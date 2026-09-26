/**
 * Optional narration for the 2-minute tour.
 * Reads wording from tour/tour-config.js and caches mp3 files in tour/audio.
 * No API key is required for the tour itself — the browser voice is the fallback.
 */
const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "..", "tour", "tour-config.js");
const AUDIO_DIR = path.join(__dirname, "..", "tour", "audio");

const TONE =
  "Speak as a relaxed South African woman chatting with a colleague. Warm, easy, and unhurried. Conversational South African English, not formal and not like a brochure. Gentle pace, soft landing on each sentence. Reassuring, never salesy or clinical.";

function loadTourScript() {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error("Could not read the tour script in tour/tour-config.js");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function findScene(id) {
  if (!/^[a-z0-9-]{1,40}$/.test(String(id || ""))) return null;
  const script = loadTourScript();
  return (script.scenes || []).find((scene) => scene.id === id) || null;
}

function audioFile(id) {
  if (!findScene(id)) return null;
  return path.join(AUDIO_DIR, `${id}.mp3`);
}

function readCachedAudio(id) {
  const file = audioFile(id);
  if (!file || !fs.existsSync(file)) return null;
  const data = fs.readFileSync(file);
  return data.length > 500 ? data : null;
}

function writeCachedAudio(id, buffer) {
  const file = audioFile(id);
  if (!file) return;
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.writeFileSync(file, buffer);
}

function pickProvider() {
  const forced = String(process.env.TOUR_TTS_PROVIDER || "").toLowerCase();
  if (forced === "browser" || forced === "none") return null;
  if (forced === "elevenlabs" && process.env.ELEVENLABS_API_KEY) return "elevenlabs";
  if (forced === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ELEVENLABS_API_KEY) return "elevenlabs";
  return null;
}

async function synthesize(text) {
  const provider = pickProvider();
  if (!provider) {
    return { status: 404, error: "No TTS provider configured", fallback: "browser" };
  }
  if (provider === "elevenlabs") return elevenLabs(text);
  return openAi(text);
}

async function openAi(text) {
  const model = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
  const body = {
    model,
    voice: process.env.OPENAI_TTS_VOICE || "coral",
    input: text,
    response_format: "mp3",
  };
  if (model !== "tts-1" && model !== "tts-1-hd") {
    body.instructions = process.env.OPENAI_TTS_INSTRUCTIONS || TONE;
  }
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OpenAI TTS ${res.status}: ${detail.slice(0, 280)}`);
  }
  return { status: 200, provider: `openai:${body.voice}`, buffer: Buffer.from(await res.arrayBuffer()) };
}

async function elevenLabs(text) {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.8,
        style: 0.05,
        use_speaker_boost: true,
      },
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`ElevenLabs TTS ${res.status}: ${detail.slice(0, 280)}`);
  }
  return { status: 200, provider: `elevenlabs:${voiceId}`, buffer: Buffer.from(await res.arrayBuffer()) };
}

async function synthesizeScene(id) {
  const scene = findScene(id);
  if (!scene || !scene.narration) return { status: 404, error: "Unknown scene", fallback: "browser" };
  const spoken = await synthesize(scene.narration);
  if (spoken.buffer) spoken.id = scene.id;
  return spoken;
}

module.exports = {
  loadTourScript,
  findScene,
  readCachedAudio,
  writeCachedAudio,
  synthesizeScene,
  pickProvider,
};
