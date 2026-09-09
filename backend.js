/**
 * Shared store + Gmail client for Soulful Sensory OT.
 * Talks to the Netlify function or the local Node API.
 */
const SSOT_BACKEND_SESSION_KEY = "ssot-backend-session-v1";
const SSOT_USERS_KEY = "ssot-users-v1";
const SSOT_SETTINGS_KEY = "ssot-settings-v1";
const SSOT_ASSESSMENTS_KEY = "ssot-assessments-v1";
const SSOT_COUPLE_KEY = "ssot-couple-sessions-v1";
const SSOT_PAYMENTS_KEY = "ssot-payments-v1";

const SsotBackend = (() => {
  let applying = false;
  let pushTimer = null;
  let inFlight = null;
  let lastError = null;
  let live = null;

  function configuredUrl() {
    const cfg = typeof APP_CONFIG !== "undefined" ? APP_CONFIG : {};
    const value = cfg.backendUrl;
    if (value === false || value === "off") return "";
    if (typeof value === "string" && value.trim()) return value.trim().replace(/\/$/, "");
    if (typeof location === "undefined") return "";
    const host = location.hostname;
    const port = location.port;
    if (host.endsWith("netlify.app") || host.endsWith("netlify.com") || port === "8888") {
      return `${location.origin}/.netlify/functions/ssot`;
    }
    if (location.protocol === "https:" && host !== "localhost") {
      return `${location.origin}/.netlify/functions/ssot`;
    }
    if (host === "localhost" || host === "127.0.0.1") {
      if (port === "8787") return `${location.origin}/api/ssot`;
      if (port === "8080" || port === "5500" || port === "3000") {
        return "http://127.0.0.1:8787/api/ssot";
      }
    }
    return "";
  }

  function isEnabled() {
    return Boolean(configuredUrl()) && live !== false;
  }

  function getSessionToken() {
    try {
      return sessionStorage.getItem(SSOT_BACKEND_SESSION_KEY) || "";
    } catch (_) {
      return "";
    }
  }

  function setSessionToken(token) {
    try {
      if (token) sessionStorage.setItem(SSOT_BACKEND_SESSION_KEY, token);
      else sessionStorage.removeItem(SSOT_BACKEND_SESSION_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  function clearSession() {
    setSessionToken("");
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function inviteTokenFromUrl() {
    try {
      return new URLSearchParams(location.search).get("patient") || "";
    } catch (_) {
      return "";
    }
  }

  function resetTokenFromUrl() {
    try {
      return new URLSearchParams(location.search).get("reset") || "";
    } catch (_) {
      return "";
    }
  }

  function localSnapshot() {
    return {
      users: readJson(SSOT_USERS_KEY, []),
      assessments: readJson(SSOT_ASSESSMENTS_KEY, { version: 1, items: [] }),
      coupleSessions: readJson(SSOT_COUPLE_KEY, { version: 1, sessions: {} }),
      payments: readJson(SSOT_PAYMENTS_KEY, { version: 1, currency: "ZAR", items: [] }),
      settings: readJson(SSOT_SETTINGS_KEY, {}),
    };
  }

  function mergeById(existing, incoming) {
    const map = new Map();
    for (const item of existing || []) {
      if (item?.id) map.set(item.id, item);
    }
    for (const item of incoming || []) {
      if (item?.id) map.set(item.id, item);
    }
    return [...map.values()];
  }

  function applySnapshot(snapshot) {
    if (!snapshot || snapshot.empty) return;
    applying = true;
    try {
      const replace = snapshot.replace === true;
      if (Array.isArray(snapshot.users)) {
        if (replace) writeJson(SSOT_USERS_KEY, snapshot.users);
        else writeJson(SSOT_USERS_KEY, mergeById(readJson(SSOT_USERS_KEY, []), snapshot.users));
      }
      if (snapshot.assessments) {
        const incoming = Array.isArray(snapshot.assessments)
          ? snapshot.assessments
          : snapshot.assessments.items;
        if (Array.isArray(incoming)) {
          const current = readJson(SSOT_ASSESSMENTS_KEY, { version: 1, items: [] });
          writeJson(SSOT_ASSESSMENTS_KEY, {
            version: 1,
            items: replace ? incoming : mergeById(current.items || [], incoming),
          });
        }
      }
      if (snapshot.coupleSessions) {
        const incoming =
          snapshot.coupleSessions.sessions ||
          (snapshot.coupleSessions.version ? {} : snapshot.coupleSessions);
        if (replace) {
          writeJson(SSOT_COUPLE_KEY, { version: 1, sessions: incoming || {} });
        } else {
          const current = readJson(SSOT_COUPLE_KEY, { version: 1, sessions: {} });
          writeJson(SSOT_COUPLE_KEY, {
            version: 1,
            sessions: { ...(current.sessions || {}), ...(incoming || {}) },
          });
        }
      }
      if (snapshot.payments && replace) {
        writeJson(
          SSOT_PAYMENTS_KEY,
          Array.isArray(snapshot.payments)
            ? { version: 1, currency: "ZAR", items: snapshot.payments }
            : snapshot.payments
        );
      }
      if (snapshot.settings && replace) {
        writeJson(SSOT_SETTINGS_KEY, snapshot.settings);
      }
      if (snapshot.token) setSessionToken(snapshot.token);
    } finally {
      applying = false;
    }
  }

  async function request(payload) {
    const url = configuredUrl();
    if (!url) throw new Error("The shared practice store is not connected.");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      const err = new Error((data && data.error) || "The practice server could not complete that request.");
      err.code = data?.code || null;
      throw err;
    }
    live = true;
    return data;
  }

  async function hydrate() {
    if (!configuredUrl()) return { ok: true, skipped: true };
    try {
      const data = await request({
        action: "hydrate",
        sessionToken: getSessionToken(),
        inviteToken: inviteTokenFromUrl(),
        resetToken: resetTokenFromUrl(),
      });
      applySnapshot(data);
      lastError = null;
      live = true;
      return data;
    } catch (err) {
      live = false;
      lastError = err;
      console.warn("Could not load shared patient records:", err);
      return { ok: false, error: err.message };
    }
  }

  async function login(email, password) {
    const data = await request({
      action: "login",
      email,
      password,
      localSnapshot: localSnapshot(),
    });
    if (!data.ok) return data;
    applySnapshot(data);
    return { ok: true, user: data.user };
  }

  async function register(details) {
    const data = await request({
      action: "register",
      ...details,
    });
    if (!data.ok) return data;
    applySnapshot(data);
    return data;
  }

  async function doPush() {
    if (!isEnabled() || applying) return null;
    const token = getSessionToken();
    if (!token) return null;
    const snapshot = localSnapshot();
    const data = await request({
      action: "push",
      sessionToken: token,
      ...snapshot,
    });
    return data;
  }

  function schedulePush() {
    if (!isEnabled() || applying || !getSessionToken()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      inFlight = doPush()
        .catch((err) => {
          lastError = err;
          console.warn("Could not save shared patient records:", err);
        })
        .finally(() => {
          inFlight = null;
        });
    }, 500);
  }

  async function flush() {
    if (!isEnabled()) return;
    clearTimeout(pushTimer);
    if (inFlight) {
      try {
        await inFlight;
      } catch (_) {
        /* already logged */
      }
    }
    try {
      await doPush();
    } catch (err) {
      lastError = err;
      throw err;
    }
  }

  function noteChanged() {
    schedulePush();
  }

  async function sendEmail({
    to,
    subject,
    message,
    name,
    kind,
    inviteUrl,
    resetUrl,
    questionnaireType,
    expiresAt,
    email,
    password,
    intro,
    sections,
  }) {
    await flush();
    const data = await request({
      action: "sendEmail",
      sessionToken: getSessionToken(),
      inviteToken: inviteTokenFromUrl(),
      kind: kind || "",
      to,
      subject,
      message,
      name,
      inviteUrl,
      resetUrl,
      questionnaireType,
      expiresAt,
      email,
      password,
      intro,
      sections,
    });
    if (!data.ok) {
      const err = new Error(data.error || "Gmail could not send the email.");
      err.code = data.code || null;
      throw err;
    }
    return { provider: "gmail" };
  }

  async function requestPasswordReset(email) {
    return request({
      action: "requestPasswordReset",
      email,
      origin: typeof location !== "undefined" ? location.origin : "",
    });
  }

  async function peekReset(token) {
    return request({ action: "peekReset", token });
  }

  async function completeReset({ token, password }) {
    return request({ action: "completeReset", token, password });
  }

  return {
    isEnabled,
    hydrate,
    login,
    register,
    flush,
    noteChanged,
    sendEmail,
    requestPasswordReset,
    peekReset,
    completeReset,
    clearSession,
    getSessionToken,
    lastError: () => lastError,
  };
})();
