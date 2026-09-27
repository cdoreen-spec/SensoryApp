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
  ".mp3": "audio/mpeg",
  ".mpeg": "audio/mpeg",
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

function forwardedOrigin(req) {
  const fromEnv = String(process.env.APP_ORIGIN || "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const forwardedHost = String(req.headers["x-forwarded-host"] || req.headers["x-original-host"] || "")
    .split(",")[0]
    .trim();
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim() || "https";
  if (forwardedHost && !/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(forwardedHost)) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  const headerOrigin = String(req.headers.origin || "").trim().replace(/\/$/, "");
  if (headerOrigin && !/localhost|127\.0\.0\.1|\[::1\]/i.test(headerOrigin)) return headerOrigin;
  return `http://${HOST}:${PORT}`;
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
  const result = await handleRequest(payload, { origin: forwardedOrigin(req) });
  if (payload.action === "sendEmail" || result.status >= 400) {
    console.log(
      `${payload.action || "request"} ${result.status}${result.body?.error ? ` — ${result.body.error}` : ""}${
        payload.to ? ` to ${payload.to}` : ""
      }`
    );
  }
  send(res, result.status, result.body, { "Content-Type": "application/json; charset=utf-8" });
}

async function handleTourAudio(req, res, url) {
  if (req.method !== "GET") {
    send(res, 405, { ok: false, fallback: "browser" }, { "Content-Type": "application/json; charset=utf-8" });
    return;
  }
  const { readCachedAudio, writeCachedAudio, synthesizeScene } = require("./tour-tts");
  const id = String(url.searchParams.get("id") || "");
  const cached = readCachedAudio(id);
  if (cached) {
    send(res, 200, cached, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000",
    });
    return;
  }
  try {
    const result = await synthesizeScene(id);
    if (!result.buffer) {
      send(
        res,
        result.status || 404,
        { ok: false, fallback: "browser" },
        { "Content-Type": "application/json; charset=utf-8" }
      );
      return;
    }
    writeCachedAudio(id, result.buffer);
    send(res, 200, result.buffer, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000",
      "X-Tour-Voice": result.provider || "tts",
    });
  } catch (err) {
    console.error("Tour narration failed:", err.message || err);
    send(res, 502, { ok: false, fallback: "browser" }, { "Content-Type": "application/json; charset=utf-8" });
  }
}

function serveStatic(req, res, url) {
  let relative = decodeURIComponent(url.pathname || "/");
  if (relative === "/" || relative === "/tour" || relative === "/tour/") relative = "/index.html";
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
    if (url.pathname === "/api/tour-audio") {
      await handleTourAudio(req, res, url);
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
