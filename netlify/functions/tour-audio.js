const { getStore } = require("@netlify/blobs");
const { readCachedAudio, synthesizeScene } = require("../../server/tour-tts");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, fallback: "browser" }),
    };
  }
  const id = String((event.queryStringParameters && event.queryStringParameters.id) || "");
  const cached = readCachedAudio(id);
  if (cached) {
    return audioResponse(cached);
  }
  try {
    const store = getStore("ssot-tour-audio");
    const saved = await store.get(id, { type: "text" });
    if (saved) return audioResponse(Buffer.from(saved, "base64"));
    const result = await synthesizeScene(id);
    if (!result.buffer) {
      return {
        statusCode: result.status || 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, fallback: "browser" }),
      };
    }
    await store.set(id, result.buffer.toString("base64"));
    return audioResponse(result.buffer);
  } catch (err) {
    console.error("Tour narration failed:", err && err.message ? err.message : err);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, fallback: "browser" }),
    };
  }
};

function audioResponse(buffer) {
  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000",
    },
    body: Buffer.from(buffer).toString("base64"),
  };
}
