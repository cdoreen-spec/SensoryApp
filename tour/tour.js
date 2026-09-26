/* Automated SoulfulSensory tour. Reuses existing screens; does not save anything. */
(function () {
  const script = window.TOUR_SCRIPT;
  if (!script || !Array.isArray(script.scenes)) return;

  const scenes = script.scenes;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plannedTotal = scenes.reduce((sum, scene) => sum + (scene.durationMs || 0), 0);

  const cache = {
    home: "",
    questions: "",
    results: "",
    dashboard: "",
  };
  const clips = new Map();

  let root = null;
  let frame = null;
  let lineEl = null;
  let lineText = null;
  let captionEl = null;
  let sampleEl = null;
  let startEl = null;
  let endEl = null;
  let loadingEl = null;
  let barEl = null;
  let timeEl = null;
  let playBtn = null;
  let muteBtn = null;
  let captionBtn = null;
  let session = null;
  let group = "";
  let captionsOn = true;
  let muted = false;
  let audio = null;

  function clock(ms) {
    const seconds = Math.max(0, Math.round(ms / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function snapshotState() {
    if (typeof structuredClone === "function") return structuredClone(state);
    return JSON.parse(JSON.stringify(state));
  }

  function restoreState(snap) {
    Object.keys(state).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(snap, key)) delete state[key];
    });
    Object.keys(snap).forEach((key) => {
      state[key] = snap[key];
    });
  }

  function capture(mode, prepare) {
    const snap = snapshotState();
    try {
      prepare();
      state.tourCapture = true;
      state.tourCaptureMode = mode;
      if (mode === "dashboard") return renderDashboard();
      if (mode === "questions") {
        const domains = getSensoryDomains(state.language || "en", state.respondent || "adult");
        return renderDomain(domains[0]);
      }
      if (mode === "results") return renderResults();
      return renderHome();
    } finally {
      restoreState(snap);
    }
  }

  function htmlFor(scene) {
    if (scene.kind === "end") return "";
    if (scene.kind === "home") {
      if (!cache.home) {
        cache.home = capture("home", () => {
          state.viewerMode = true;
          state.view = "home";
          state.step = 0;
          state.showIntroModal = false;
        });
      }
      return cache.home;
    }
    if (scene.kind === "questions") {
      if (!cache.questions) {
        cache.questions = capture("questions", () => {
          state.viewerMode = true;
          state.sampleReportPreview = true;
          state.view = "questionnaire";
          state.language = "en";
          state.respondent = "adult";
          state.lifeContext = "home";
          state.answers = emptyAnswers();
          state.error = null;
          state.step = STEPS.findIndex((step) => step.type === "domain");
        });
      }
      return cache.questions;
    }
    if (scene.kind === "results") {
      if (!cache.results) {
        cache.results = capture("results", () => {
          state.viewerMode = true;
          const record = buildSampleAssessmentRecord({ respondent: "adult", lifeContext: "home" });
          applyAssessmentRecord(record);
          state.sampleReportPreview = true;
          state.showSensoryDiet = true;
        });
      }
      return cache.results;
    }
    if (scene.kind === "dashboard") {
      if (!cache.dashboard) {
        cache.dashboard = capture("dashboard", () => {
          state.view = "dashboard";
          state.dashboardTab = "register";
          state.dashboardSearch = "";
          state.dashboardNotice = null;
          state.prefsNotice = null;
          state.tourDashboardItems = sampleDashboard();
        });
      }
      return cache.dashboard;
    }
    return "";
  }

  function sampleDashboard() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const complete = buildSampleAssessmentRecord({ respondent: "adult", lifeContext: "home" });
    complete.id = "tour-sample-complete";
    complete.status = "complete";
    complete.completedAt = new Date(now - 2 * day).toISOString();
    complete.savedAt = complete.completedAt;
    if (complete.summary) {
      complete.summary.patientName = complete.demographics.name;
      complete.summary.completerName = complete.demographics.name;
      complete.summary.email = complete.demographics.email;
    }
    return [
      {
        id: "tour-sample-assigned",
        status: "assigned",
        respondent: "adult",
        lifeContext: "home",
        savedAt: new Date(now - day).toISOString(),
        startedAt: new Date(now - day).toISOString(),
        demographics: { name: "Amina Petersen", email: "amina.sample@example.com", phone: "" },
        summary: {
          patientName: "Amina Petersen",
          email: "amina.sample@example.com",
          reasonForReferral: "Sample referral — questionnaire not started yet",
        },
        reasonForReferral: "Sample referral — questionnaire not started yet",
      },
      {
        id: "tour-sample-progress",
        status: "incomplete",
        respondent: "teen",
        lifeContext: "homeSchool",
        step: 4,
        savedAt: new Date(now - 3 * day).toISOString(),
        startedAt: new Date(now - 4 * day).toISOString(),
        demographics: { name: "Leo Dlamini", email: "leo.sample@example.com", phone: "" },
        summary: {
          patientName: "Leo Dlamini",
          email: "leo.sample@example.com",
          progressLabel: "In progress",
        },
      },
      complete,
    ];
  }

  function mount() {
    if (root) return;
    root = document.createElement("div");
    root.className = "tour";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "SoulfulSensory 2-minute tour");
    root.innerHTML = `
      <div class="tour__stage">
        <div class="tour__frame" aria-hidden="true"></div>
        <div class="tour__line" hidden><p></p></div>
        <p class="tour__sample" hidden>Sample profile · not a real patient</p>
        <div class="tour__start">
          <div class="tour__card">
            <img class="tour__logo" src="assets/logo.png" alt="" width="72" height="72" />
            <p class="tour__kicker">About 2 minutes · no sign-in</p>
            <h2>See how SoulfulSensory works</h2>
            <p>A short walk-through for therapists and other healthcare professionals. Press play once — the tour moves on its own.</p>
            <button type="button" class="btn btn-primary tour__start-play">▶ Start tour</button>
          </div>
        </div>
        <div class="tour__end" hidden>
          <div class="tour__card">
            <img class="tour__logo" src="assets/logo.png" alt="" width="72" height="72" />
            <p class="tour__kicker">SoulfulSensory</p>
            <h2>Could sensory profiling support someone you work with?</h2>
            <p>Explore the demo to look through each questionnaire and a sample report. Nothing you open is saved.</p>
            <div class="tour__end-actions">
              <button type="button" class="btn btn-primary" data-tour-end="demo">Explore the Demo</button>
              <a class="btn btn-secondary" data-tour-end="contact" href="${typeof WHATSAPP_URL === "string" ? WHATSAPP_URL : "#"}" target="_blank" rel="noopener noreferrer">Contact SoulfulSensory</a>
            </div>
          </div>
        </div>
        <p class="tour__loading" hidden>Preparing the tour…</p>
      </div>
      <div class="tour__dock">
        <p class="tour__caption" aria-live="polite"></p>
        <div class="tour__progress">
          <div class="tour__bar" aria-hidden="true"><span></span></div>
          <span class="tour__time">0:00 / ${clock(plannedTotal)}</span>
        </div>
        <div class="tour__controls">
          <button type="button" data-tour="pause" aria-label="Pause tour">Pause</button>
          <button type="button" data-tour="mute" aria-pressed="false" aria-label="Mute narration">Mute</button>
          <button type="button" data-tour="restart" aria-label="Restart tour">Restart</button>
          <button type="button" data-tour="captions" aria-pressed="true" aria-label="Turn captions off">Captions</button>
          <button type="button" data-tour="exit" aria-label="Exit tour">Exit tour</button>
          <button type="button" data-tour="demo" aria-label="Leave the tour and explore the demo">Explore demo</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    frame = root.querySelector(".tour__frame");
    lineEl = root.querySelector(".tour__line");
    lineText = lineEl.querySelector("p");
    captionEl = root.querySelector(".tour__caption");
    sampleEl = root.querySelector(".tour__sample");
    startEl = root.querySelector(".tour__start");
    endEl = root.querySelector(".tour__end");
    loadingEl = root.querySelector(".tour__loading");
    barEl = root.querySelector(".tour__bar span");
    timeEl = root.querySelector(".tour__time");
    playBtn = root.querySelector("[data-tour='pause']");
    muteBtn = root.querySelector("[data-tour='mute']");
    captionBtn = root.querySelector("[data-tour='captions']");

    root.querySelector(".tour__start-play").addEventListener("click", () => begin(0));
    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tour]");
      if (!button) return;
      const action = button.getAttribute("data-tour");
      if (action === "pause") togglePause();
      else if (action === "mute") toggleMute();
      else if (action === "restart") begin(0);
      else if (action === "captions") toggleCaptions();
      else if (action === "exit") closeTour();
      else if (action === "demo") exploreDemo();
      else if (action === "end" && button.getAttribute("data-tour-end") === "demo") exploreDemo();
    });
    endEl.querySelector("[data-tour-end='demo']").addEventListener("click", exploreDemo);
    document.addEventListener("keydown", onKey);
  }

  function onKey(event) {
    if (!root) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeTour();
      return;
    }
    if (event.key === " " || event.key === "Spacebar") {
      const tag = event.target && event.target.tagName;
      if (tag === "A" || tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      event.preventDefault();
      if (session) togglePause();
      else begin(0);
    }
  }

  function open() {
    mount();
    document.body.classList.add("tour-open");
    showStart();
    const play = root.querySelector(".tour__start-play");
    if (play) play.focus();
  }

  function showStart() {
    stopSession();
    group = "";
    frame.innerHTML = "";
    frame.className = "tour__frame";
    startEl.hidden = false;
    endEl.hidden = true;
    lineEl.hidden = true;
    sampleEl.hidden = true;
    captionEl.textContent = "Press start, then the tour plays through on its own. Captions stay on if you mute the sound.";
    setProgress(0);
    playBtn.textContent = "Play";
    playBtn.setAttribute("aria-label", "Play tour");
  }

  function closeTour() {
    stopSession();
    if (root) root.remove();
    root = null;
    document.body.classList.remove("tour-open");
    const url = new URL(window.location.href);
    if (url.searchParams.has("tour")) {
      url.searchParams.delete("tour");
      url.searchParams.set("viewer", "1");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
    const opener = document.querySelector("[data-action='start-tour']");
    if (opener) opener.focus();
  }

  function exploreDemo() {
    closeTour();
    const target = document.getElementById("profiles-heading");
    if (target) target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  function toggleCaptions() {
    captionsOn = !captionsOn;
    captionBtn.setAttribute("aria-pressed", captionsOn ? "true" : "false");
    captionBtn.setAttribute("aria-label", captionsOn ? "Turn captions off" : "Turn captions on");
    captionEl.hidden = !captionsOn;
  }

  function toggleMute() {
    muted = !muted;
    muteBtn.setAttribute("aria-pressed", muted ? "true" : "false");
    muteBtn.textContent = muted ? "Unmute" : "Mute";
    muteBtn.setAttribute("aria-label", muted ? "Unmute narration" : "Mute narration");
    if (audio) audio.muted = muted;
    if (session) session.muted = muted;
    if (muted && window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function togglePause() {
    if (!session) {
      begin(0);
      return;
    }
    session.paused = !session.paused;
    playBtn.textContent = session.paused ? "Play" : "Pause";
    playBtn.setAttribute("aria-label", session.paused ? "Play tour" : "Pause tour");
    if (audio) {
      if (session.paused) audio.pause();
      else if (session.usingAudio) audio.play().catch(() => {});
    }
    if (session.paused && window.speechSynthesis) window.speechSynthesis.cancel();
    if (!session.paused && session.resumeSpeech) session.resumeSpeech();
  }

  function stopSession() {
    if (session) session.active = false;
    session = null;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function unlockSound() {
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audio.setAttribute("playsinline", "");
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.resume();
        const wake = new SpeechSynthesisUtterance(" ");
        wake.volume = 0;
        window.speechSynthesis.speak(wake);
      } catch (_) {
        /* ignore */
      }
    }
  }

  function begin(index) {
    unlockSound();
    stopSession();
    const current = {
      active: true,
      paused: false,
      muted,
      usingAudio: false,
      resumeSpeech: null,
    };
    session = current;
    startEl.hidden = true;
    playBtn.textContent = "Pause";
    playBtn.setAttribute("aria-label", "Pause tour");
    run(current, index);
  }

  async function run(current, startIndex) {
    for (let index = startIndex; index < scenes.length; index += 1) {
      if (!current.active) return;
      await playScene(current, index);
      if (!current.active) return;
    }
    if (current.active) {
      playBtn.textContent = "Play";
      playBtn.setAttribute("aria-label", "Play tour");
    }
  }

  async function playScene(current, index) {
    const scene = scenes[index];
    current.heard = false;
    current.narrationFraction = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    let html = "";
    try {
      html = htmlFor(scene);
    } catch (error) {
      console.error("Tour scene could not use the existing screen:", error);
      html = `<div class="tour__card" style="margin:1.5rem"><h2>${escapeText(scene.title)}</h2><p>This part of the tour could not open the usual screen. The narration continues.</p></div>`;
    }
    showScene(scene, html);
    const clip = await clipFor(scene, index === 0);
    if (!current.active) return;
    prefetch(index + 1);
    const started = performance.now();
    let pausedFor = 0;
    let pauseMark = 0;
    const visual = track(current, scene, index, () => {
      let elapsed = performance.now() - started - pausedFor;
      if (current.paused) {
        if (!pauseMark) pauseMark = performance.now();
        elapsed -= performance.now() - pauseMark;
      } else if (pauseMark) {
        pausedFor += performance.now() - pauseMark;
        pauseMark = 0;
        elapsed = performance.now() - started - pausedFor;
      }
      return elapsed;
    });

    if (clip && !current.muted) {
      current.usingAudio = true;
      await playClip(current, scene, clip, visual);
    } else if (!current.muted && window.speechSynthesis) {
      await speakScene(current, scene, visual);
    } else {
      await wait(scene.durationMs, current);
    }

    if (!current.heard) current.narrationFraction = null;
    if (!current.active) {
      visual.stop();
      return;
    }
    const spent = performance.now() - started;
    if (spent < scene.durationMs) await wait(scene.durationMs - spent, current);
    visual.stop();
    setProgress(sceneOffset(index) + scene.durationMs);
  }

  function showScene(scene, html) {
    endEl.hidden = scene.kind !== "end";
    sampleEl.hidden = !scene.sample;
    if (scene.kind === "end") {
      frame.innerHTML = "";
      frame.className = "tour__frame is-end";
      group = "end";
    } else if (group !== scene.kind) {
      frame.innerHTML = html;
      frame.className = `tour__frame is-${scene.kind}`;
      group = scene.kind;
      frame.scrollTop = 0;
    } else {
      frame.className = `tour__frame is-${scene.kind}`;
    }
    applyFraction(scene, 0);
    const status = root.querySelector(".tour__caption");
    if (status && captionsOn) {
      /* caption text is set by applyFraction */
    }
  }

  function applyFraction(scene, fraction) {
    const at = Math.max(0, Math.min(0.999, fraction));
    const caption = latest(scene.captions, at);
    if (captionsOn) {
      captionEl.hidden = false;
      captionEl.textContent = caption ? caption.text : "";
    }
    const line = scene.kind === "end" ? null : latest(scene.lines, at);
    if (line && line.text) {
      lineText.textContent = line.text;
      lineEl.hidden = false;
    } else {
      lineEl.hidden = true;
    }
    (scene.beats || []).forEach((beat, beatIndex) => {
      if (beat.fired || at + 0.001 < beat.at) return;
      beat.fired = true;
      runBeat(beat, beatIndex);
    });
  }

  function latest(items, fraction) {
    let chosen = null;
    (items || []).forEach((item) => {
      if (item.at <= fraction + 0.001) chosen = item;
    });
    return chosen;
  }

  function runBeat(beat) {
    if (beat.action === "answer") {
      markAnswer(beat.index, beat.value);
      return;
    }
    const target = beat.target ? queryFirst(frame, beat.target) : null;
    if (!target) return;
    if (beat.action === "highlight" || beat.action === "scroll") {
      frame.querySelectorAll(".tour-hot").forEach((node) => node.classList.remove("tour-hot"));
      if (beat.action === "highlight") target.classList.add("tour-hot");
      scrollTo(target);
    }
  }

  function queryFirst(scope, selector) {
    const parts = String(selector).split(",").map((part) => part.trim()).filter(Boolean);
    for (let i = 0; i < parts.length; i += 1) {
      const found = scope.querySelector(parts[i]);
      if (found) return found;
    }
    return null;
  }

  function scrollTo(node) {
    const frameBox = frame.getBoundingClientRect();
    const nodeBox = node.getBoundingClientRect();
    const top = frame.scrollTop + (nodeBox.top - frameBox.top) - 18;
    frame.scrollTo({ top: Math.max(0, top), behavior: reduced ? "auto" : "smooth" });
  }

  function markAnswer(index, value) {
    const questions = frame.querySelectorAll(".question-list .question");
    const question = questions[index];
    if (!question) return;
    question.querySelectorAll("button").forEach((button) => button.classList.remove("selected"));
    const chosen = question.querySelector(`[data-answer="${value}"]`);
    if (chosen) chosen.classList.add("selected");
    const text = frame.querySelector(".question-progress__text");
    if (text) text.textContent = text.textContent.replace(/^\d+/, String(index + 1));
    const fill = frame.querySelector(".question-progress__fill");
    if (fill && questions.length) {
      fill.style.width = `${Math.round(((index + 1) / questions.length) * 100)}%`;
    }
    scrollTo(question);
  }

  function track(current, scene, index, elapsed) {
    let stopped = false;
    function frameTick() {
      if (stopped || !current.active) return;
      if (!current.paused) {
        const fraction = scene.durationMs ? Math.min(1, elapsed() / scene.durationMs) : 1;
        if (current.narrationFraction == null) applyFraction(scene, fraction);
        setProgress(sceneOffset(index) + fraction * scene.durationMs);
      }
      requestAnimationFrame(frameTick);
    }
    requestAnimationFrame(frameTick);
    return {
      stop() {
        stopped = true;
      },
      setNarration(fraction) {
        current.narrationFraction = fraction;
        applyFraction(scene, fraction);
      },
    };
  }

  function sceneOffset(index) {
    return scenes.slice(0, index).reduce((sum, scene) => sum + scene.durationMs, 0);
  }

  function setProgress(ms) {
    const clamped = Math.max(0, Math.min(plannedTotal, ms));
    if (barEl) barEl.style.width = `${(clamped / plannedTotal) * 100}%`;
    if (timeEl) timeEl.textContent = `${clock(clamped)} / ${clock(plannedTotal)}`;
  }

  function wait(ms, current) {
    return new Promise((resolve) => {
      const start = performance.now();
      let held = 0;
      let mark = 0;
      function tick() {
        if (!current.active) return resolve();
        const now = performance.now();
        if (current.paused) {
          if (!mark) mark = now;
        } else if (mark) {
          held += now - mark;
          mark = 0;
        }
        if (now - start - held >= ms) return resolve();
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  async function playClip(current, scene, url, visual) {
    audio.src = url;
    audio.currentTime = 0;
    audio.muted = current.muted;
    try {
      await audio.play();
    } catch (_) {
      return speakScene(current, scene, visual);
    }
    await new Promise((resolve) => {
      const finish = () => resolve();
      audio.addEventListener("ended", finish, { once: true });
      const watch = () => {
        if (!current.active) {
          audio.pause();
          return resolve();
        }
        if (audio.duration && !current.paused) {
          visual.setNarration(audio.currentTime / audio.duration);
        }
        if (current.active && !audio.ended) requestAnimationFrame(watch);
      };
      requestAnimationFrame(watch);
    });
  }

  function pickVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    const male = /\b(male|daniel|alex|fred|thomas|tom|david|rishi|lee|gordon|arthur|albert|bruce|ralph|aaron)\b/i;
    const female = /female|samantha|victoria|karen|moira|tessa|serena|kate|fiona|susan|zira|aria|jenny|libby|sonia|natasha|allison|ava|emma|sara|veena|catherine/i;
    let best = null;
    let bestScore = -1;
    voices.forEach((voice) => {
      if (!/^en/i.test(voice.lang || "")) return;
      if (male.test(voice.name) && !female.test(voice.name)) return;
      let score = 5;
      if (/en-ZA/i.test(voice.lang)) score += 80;
      else if (/en-GB/i.test(voice.lang)) score += 40;
      else if (/en-US|en-AU/i.test(voice.lang)) score += 20;
      if (female.test(`${voice.name} ${voice.lang}`)) score += 25;
      if (/natural|premium|enhanced/i.test(voice.name)) score += 8;
      if (score > bestScore) {
        best = voice;
        bestScore = score;
      }
    });
    return best;
  }

  function sentences(text) {
    const parts = [];
    let current = "";
    const source = String(text || "");
    for (let i = 0; i < source.length; i += 1) {
      current += source[i];
      const boundary = /[.!?]/.test(source[i]) && (i === source.length - 1 || /\s/.test(source[i + 1] || ""));
      if (!boundary) continue;
      const trimmed = current.trim();
      if (trimmed) parts.push(trimmed);
      current = "";
    }
    const tail = current.trim();
    if (tail) parts.push(tail);
    return parts;
  }

  function speakScene(current, scene, visual) {
    const chunks = sentences(scene.narration);
    if (!chunks.length || !window.speechSynthesis) return Promise.resolve();
    const voice = pickVoice();
    if (root && voice) root.dataset.voice = `${voice.name} (${voice.lang})`;
    let index = 0;
    let token = 0;
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      const next = () => {
        if (settled) return;
        if (!current.active || current.muted) return finish();
        if (current.paused) return;
        if (index >= chunks.length) return finish();
        const chunk = chunks[index];
        const before = chunks.slice(0, index).join(" ").length;
        const total = Math.max(1, chunks.join(" ").length);
        const utterance = new SpeechSynthesisUtterance(chunk);
        const mine = ++token;
        utterance.rate = 0.92;
        utterance.pitch = 1.02;
        utterance.lang = voice && voice.lang ? voice.lang : "en-ZA";
        if (voice) utterance.voice = voice;
        const started = performance.now();
        const expected = Math.max(1200, (scene.durationMs * chunk.length) / total);
        let watching = true;
        const follow = () => {
          if (!watching || mine !== token || !current.active || current.paused) return;
          const local = Math.min(1, (performance.now() - started) / expected);
          visual.setNarration((before + local * chunk.length) / total);
          requestAnimationFrame(follow);
        };
        requestAnimationFrame(follow);
        const done = (ok) => {
          if (mine !== token) return;
          watching = false;
          if (ok) {
            current.heard = true;
            visual.setNarration(Math.min(1, (before + chunk.length + 1) / total));
          }
          index += 1;
          next();
        };
        utterance.onend = () => done(true);
        utterance.onerror = () => done(false);
        window.speechSynthesis.speak(utterance);
      };
      current.resumeSpeech = () => {
        if (current.paused || !current.active || settled) return;
        next();
      };
      next();
      setTimeout(finish, scene.durationMs + 8000);
    });
  }

  async function clipFor(scene, first) {
    if (clips.has(scene.id)) return clips.get(scene.id);
    if (first) showLoading(true);
    const found = await probe(`tour/audio/${scene.id}.mp3`, first ? 900 : 700);
    const api = found || (await probe(`/api/tour-audio?id=${encodeURIComponent(scene.id)}`, first ? 8000 : 1500));
    if (first) showLoading(false);
    clips.set(scene.id, api);
    return api;
  }

  function prefetch(index) {
    const scene = scenes[index];
    if (!scene || clips.has(scene.id)) return;
    probe(`tour/audio/${scene.id}.mp3`, 700).then((url) => {
      if (url) clips.set(scene.id, url);
    });
  }

  function probe(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { signal: controller.signal })
      .then((response) => {
        const type = response.headers.get("content-type") || "";
        if (!response.ok || type.includes("text/html") || type.includes("application/json")) return null;
        if (url.indexOf("/api/tour-audio") === 0) return response.blob().then((blob) => URL.createObjectURL(blob));
        return url;
      })
      .catch(() => null)
      .finally(() => clearTimeout(timer));
  }

  function showLoading(on) {
    if (loadingEl) loadingEl.hidden = !on;
  }

  function escapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function resetBeats() {
    scenes.forEach((scene) => {
      (scene.beats || []).forEach((beat) => {
        beat.fired = false;
      });
    });
  }

  const originalBegin = begin;
  begin = function (index) {
    resetBeats();
    return originalBegin(index);
  };

  window.SoulfulTour = {
    open,
    close: closeTour,
    start: () => begin(0),
  };

  if (typeof state !== "undefined" && state.openTourOnBoot) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", open);
    } else {
      open();
    }
  }
})();
