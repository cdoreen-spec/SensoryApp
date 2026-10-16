const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const storePath = path.join(os.tmpdir(), `ssot-signin-${process.pid}.json`);
process.env.SSOT_STORE_PATH = storePath;
process.env.GMAIL_APP_PASSWORD = "";
process.env.ADMIN_PASSWORD = "";

fs.writeFileSync(
  storePath,
  JSON.stringify({
    users: [
      {
        id: "user_admin",
        name: "Cayley Alberts",
        email: "soulfulsensoryot@gmail.com",
        role: "admin",
        status: "active",
        salt: "testsalt",
        passwordHash: "scrypt:00",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "user_patient",
        name: "Patient Example",
        email: "patient@example.com",
        role: "patient",
        status: "active",
        salt: "testsalt",
        passwordHash: "scrypt:00",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    sessions: {},
  })
);

const { handleRequest } = require("../server/ssot-api");

test("therapist sign-in link signs the account in once and skips patients", async () => {
  const patient = await handleRequest(
    {
      action: "requestSignInLink",
      email: "patient@example.com",
      origin: "http://127.0.0.1:8787",
    },
    { origin: "http://127.0.0.1:8787", allowSignInPreview: true }
  );
  assert.equal(patient.status, 200);
  assert.equal(patient.body.sent, false);
  assert.equal(patient.body.token, undefined);

  const requested = await handleRequest(
    {
      action: "requestSignInLink",
      email: "soulfulsensoryot@gmail.com",
      origin: "http://127.0.0.1:8787",
    },
    { origin: "http://127.0.0.1:8787", allowSignInPreview: true }
  );
  assert.equal(requested.status, 200);
  assert.equal(requested.body.ok, true);
  assert.equal(requested.body.sent, true);
  assert.equal(requested.body.emailed, false);
  assert.match(requested.body.signInUrl, /^http:\/\/127\.0\.0\.1:8787\/\?signin=/);

  const completed = await handleRequest({
    action: "completeSignInLink",
    token: requested.body.token,
  });
  assert.equal(completed.status, 200);
  assert.equal(completed.body.ok, true);
  assert.equal(completed.body.user.email, "soulfulsensoryot@gmail.com");
  assert.equal(completed.body.user.role, "admin");
  assert.ok(completed.body.token);

  const again = await handleRequest({
    action: "completeSignInLink",
    token: requested.body.token,
  });
  assert.equal(again.status, 400);
  assert.equal(again.body.ok, false);
});

test.after(() => {
  fs.rmSync(storePath, { force: true });
});
