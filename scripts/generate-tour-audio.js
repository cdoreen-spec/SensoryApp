#!/usr/bin/env node
/**
 * Create the cached tour narration once.
 *   node scripts/generate-tour-audio.js
 * Requires OPENAI_API_KEY or ELEVENLABS_API_KEY in .env.
 * Writes tour/audio/<scene>.mp3. The tour then plays those files
 * instead of calling the provider on every view.
 */
const fs = require("fs");
const path = require("path");
const { loadTourScript, synthesizeScene, writeCachedAudio, pickProvider } = require("../server/tour-tts");

loadDotEnv(path.join(__dirname, "..", ".env"));

async function main() {
  const provider = pickProvider();
  if (!provider) {
    console.error("Add OPENAI_API_KEY or ELEVENLABS_API_KEY to .env first.");
    process.exit(1);
  }
  const scenes = loadTourScript().scenes || [];
  for (const scene of scenes) {
    process.stdout.write(`Narration: ${scene.id} … `);
    const result = await synthesizeScene(scene.id);
    if (!result.buffer) {
      console.log("skipped");
      continue;
    }
    writeCachedAudio(scene.id, result.buffer);
    console.log(`saved (${result.provider}, ${result.buffer.length} bytes)`);
  }
}

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
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] == null) process.env[key] = value;
    }
  } catch (_) {
    /* optional */
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
