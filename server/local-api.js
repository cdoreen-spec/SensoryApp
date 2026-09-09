#!/usr/bin/env node
/**
 * Local app + Gmail/API server.
 * Run: npm start   then open http://127.0.0.1:8787
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleRequest, previewEmailHtml } = require("./ssot-api");

loadDotEnv(path.join(__dirname, "..", ".env"));
process.env.SSOT_STORE_PATH =
  process.env.SSOT_STORE_PATH || path.join(__dirname, "..", "data", "store.json");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
};

const BLOCKED = new Set([".env", ".git", "node_modules", "data", "server"]);

function loadDotEnv(filePath) {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] == null) process.env[key] = value;
    }
  } catch (_) {
    /* optional */
  }
}

function send(res, status, body, headers = {}) {
  const payload = typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    ...headers,
  });
  res.end(payload);
}

function isBlocked(relativePath) {
  const parts = relativePath.split(path.sep).filter(Boolean);
  if (!parts.length) return false;
  if (parts[0].startsWith(".")) return true;
  return BLOCKED.has(parts[0]);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleApi(req, res, url) {
  if (req.method === "OPTIONS") {
    send(res, 204, "");
    return;
  }
  if (req.method === "GET") {
    const result = await handleRequest({ action: "health" });
    send(res, result.status, result.body, { "Content-Type": "application/json; charset=utf-8" });
    return;
  }
  if (req.method !== "POST") {
    send(res, 405, { ok: false, error: "POST only" }, { "Content-Type": "application/json; charset=utf-8" });
    return;
  }
  let payload = {};
  try {
    const raw = await readBody(req);
    payload = raw ? JSON.parse(raw) : {};
  } catch (_) {
    send(res, 400, { ok: false, error: "Invalid JSON" }, { "Content-Type": "application/json; charset=utf-8" });
    return;
  }
  const origin = `http://${HOST}:${PORT}`;
  const result = await handleRequest(payload, { origin });
  send(res, result.status, result.body, { "Content-Type": "application/json; charset=utf-8" });
}

function serveStatic(req, res, url) {
  let relative = decodeURIComponent(url.pathname || "/");
  if (relative === "/") relative = "/index.html";
  const filePath = path.resolve(ROOT, `.${relative}`);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    send(res, 403, "Forbidden");
    return;
  }
  const relFromRoot = path.relative(ROOT, filePath);
  if (isBlocked(relFromRoot)) {
    send(res, 404, "Not found");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, "Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, { "Content-Type": MIME[ext] || "application/octet-stream" });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${HOST}:${PORT}`);
  try {
    if (url.pathname === "/email-preview") {
      const kind = url.searchParams.get("kind") || "invite";
      send(res, 200, previewEmailHtml(kind), { "Content-Type": "text/html; charset=utf-8" });
      return;
    }
    if (url.pathname === "/api/ssot" || url.pathname === "/.netlify/functions/ssot") {
      await handleApi(req, res, url);
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      send(res, 405, "Method not allowed");
      return;
    }
    serveStatic(req, res, url);
  } catch (err) {
    console.error(err);
    send(res, 500, { ok: false, error: err.message || "Server error" }, { "Content-Type": "application/json; charset=utf-8" });
  }
});

server.listen(PORT, HOST, () => {
  const gmail = process.env.GMAIL_APP_PASSWORD ? "Gmail connected" : "Gmail not configured (add GMAIL_APP_PASSWORD to .env)";
  console.log(`Soulful Sensory app: http://${HOST}:${PORT}`);
  console.log(`API: http://${HOST}:${PORT}/api/ssot`);
  console.log(gmail);
});
