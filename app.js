/* ============================================================
   Nutq · App-Logik
   Vanilla JS, nutzt data.js (PHRASES, DIALOGUES, GRAMMAR,
   ALPHABET, LEVELS) und die Web Speech API.
   ============================================================ */

"use strict";

const $  = (id) => document.getElementById(id);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

/* IDs für Fortschritt vergeben */
PHRASES.forEach((p, i) => (p.id = "p" + i));

/* ============================================================
   1) Web Speech: Ausgabe (TTS)
   ============================================================ */
let arVoice = null;
function pickArabicVoice() {
  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  arVoice = voices.find(v => /^ar/i.test(v.lang)) || null;
}
if (window.speechSynthesis) {
  pickArabicVoice();
  speechSynthesis.onvoiceschanged = pickArabicVoice;
}
const TTS_OK = !!window.speechSynthesis;

function speak(text, rate = 0.85, onend) {
  if (!TTS_OK) { onend && onend(); return false; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = rate;
  if (arVoice) u.voice = arVoice;
  if (onend) u.onend = onend;
  speechSynthesis.speak(u);
  return true;
}
/* Mehrere Texte nacheinander vorlesen */
function speakSeq(items, rate, onStep, onDone) {
  let i = 0;
  function next() {
    if (i >= items.length) { onDone && onDone(); return; }
    onStep && onStep(i);
    speak(items[i], rate, () => { i++; setTimeout(next, 350); });
  }
  next();
}

/* ============================================================
   2) Web Speech: Erkennung (Nachsprechen)
   ============================================================ */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const REC_OK = !!SR;
let recInstance = null;
let recBusy = false;

function normalizeAr(s) {
  return (s || "")
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, "") // Tashkil + Tatweel
    .replace(/[آأإٱ]/g, "ا") // Alif-Varianten → ا
    .replace(/ة/g, "ه")                     // ة → ه
    .replace(/ى/g, "ي")                     // ى → ي
    .replace(/[^ء-ي\s]/g, "")               // nur arab. Buchstaben
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return d[m][n];
}
function similarity(a, b) {
  const max = Math.max(a.length, b.length);
  return max ? 1 - levenshtein(a, b) / max : 1;
}

/* Vergleicht Gehörtes mit Ziel → "exact" | "partial" | "miss" + bestes Transkript */
function gradeSpeech(results, targetRaw) {
  const target = normalizeAr(targetRaw);
  const alts = [];
  for (let i = 0; i < results.length; i++) alts.push(normalizeAr(results[i].transcript));
  let best = alts[0] || "";
  let grade = "miss";
  let bestSim = 0;
  for (const a of alts) {
    if (a === target) { grade = "exact"; best = a; bestSim = 1; break; }
    const sim = similarity(a, target);
    if (sim > bestSim) { bestSim = sim; best = a; }
    if (a && (a.includes(target) || target.includes(a)) && a.length > 1) grade = "partial";
  }
  if (grade !== "exact") grade = bestSim >= 0.6 ? "partial" : grade === "partial" ? "partial" : "miss";
  return { grade, heard: best, sim: bestSim };
}

/* Startet eine Erkennung mit Callbacks */
function recognize({ onStart, onEnd, onError, onResult }) {
  if (!REC_OK) { onError && onError({ error: "unsupported" }); return null; }
  if (recBusy && recInstance) { recInstance.stop(); return recInstance; }
  const rec = new SR();
  recInstance = rec;
  rec.lang = "ar-SA";
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  rec.onstart  = () => { recBusy = true;  onStart && onStart(); };
  rec.onend    = () => { recBusy = false; onEnd && onEnd(); };
  rec.onerror  = (e) => onError && onError(e);
  rec.onresult = (e) => onResult && onResult(e.results[0]);
  speechSynthesis && speechSynthesis.cancel();
  try { rec.start(); } catch (_) {}
  return rec;
}

/* ============================================================
   3) Fortschritt (localStorage, Leitner-Boxen 1..5)
   ============================================================ */
const STORE_KEY = "nutq_progress_v1";
let store = loadStore();

function loadStore() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && s.items) return s;
  } catch (_) {}
  return { items: {}, quiz: { best: 0, played: 0 } };
}
function saveStore() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (_) {}
}
function itemState(id) {
  return store.items[id] || (store.items[id] = { box: 1, correct: 0, wrong: 0, seen: 0, last: 0 });
}
function recordAttempt(id, success) {
  const it = itemState(id);
  it.seen++;
  it.last = Date.now();
  if (success) { it.correct++; it.box = Math.min(5, it.box + 1); }
  else         { it.wrong++;   it.box = Math.max(1, it.box - 1); }
  saveStore();
}

/* ============================================================
   4) Router / Tabs
   ============================================================ */
const enterHooks = {};
$("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  switchView(btn.dataset.view);
});
function switchView(name) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === name));
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  $("view-" + name).classList.add("active");
  speechSynthesis && speechSynthesis.cancel();
  if (recBusy && recInstance) recInstance.stop();
  enterHooks[name] && enterHooks[name]();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   5) SPRECHEN
   ============================================================ */
const SpeakView = (() => {
  let level = "Alle";
  let cat = "Alle";
  let reviewMode = false;
  let reveal = true;
  let list = [];
  let idx = 0;

  function computeList() {
    let l = PHRASES.filter(p =>
      (level === "Alle" || p.lvl === level) &&
      (cat === "Alle" || p.cat === cat));
    if (reviewMode) {
      l = l.filter(p => itemState(p.id).box < 5)
           .sort((a, b) => itemState(a.id).box - itemState(b.id).box ||
                           itemState(a.id).last - itemState(b.id).last);
    }
    list = l;
    idx = 0;
  }

  function buildFilters() {
    const lvlWrap = $("lvl-filter");
    lvlWrap.innerHTML = "";
    ["Alle", ...LEVELS].forEach(lv => {
      const b = el("button", "chip" + (lv === level ? " active" : ""), lv);
      b.onclick = () => { level = lv; computeList(); buildFilters(); render(); };
      lvlWrap.appendChild(b);
    });
    const cats = ["Alle", ...Array.from(new Set(PHRASES.map(p => p.cat)))];
    const catWrap = $("cat-filter");
    catWrap.innerHTML = "";
    cats.forEach(c => {
      const b = el("button", "chip" + (c === cat ? " active" : ""), c);
      b.onclick = () => { cat = c; computeList(); buildFilters(); render(); };
      catWrap.appendChild(b);
    });
    $("mode-all").classList.toggle("active", !reviewMode);
    $("mode-review").classList.toggle("active", reviewMode);
    $("reveal-toggle").textContent = reveal ? "👁 Übersetzung: an" : "🙈 Übersetzung: aus";
  }

  function boxDots(box) {
    let s = "";
    for (let i = 1; i <= 5; i++) s += `<span class="dot${i <= box ? " on" : ""}"></span>`;
    return s;
  }

  function render() {
    const fb = $("fc-feedback"); fb.hidden = true; fb.className = "fc-feedback";
    if (!list.length) {
      $("flashcard").classList.add("empty");
      $("fc-arabic").textContent = reviewMode ? "🎉" : "—";
      $("fc-translit").textContent = "";
      $("fc-de").textContent = reviewMode
        ? "Nichts zu wiederholen – alles gemeistert in dieser Auswahl!"
        : "Keine Einträge in dieser Auswahl.";
      $("fc-boxes").innerHTML = "";
      $("fc-pos").textContent = "0"; $("fc-total").textContent = "0";
      return;
    }
    $("flashcard").classList.remove("empty");
    const p = list[idx];
    const st = itemState(p.id);
    $("fc-arabic").textContent = p.ar;
    $("fc-translit").textContent = p.tr;
    $("fc-de").textContent = p.de;
    $("fc-pos").textContent = idx + 1;
    $("fc-total").textContent = list.length;
    $("fc-boxes").innerHTML = boxDots(st.box);
    $("fc-cat").textContent = p.cat + " · " + p.lvl;
    $("flashcard").classList.toggle("masked", !reveal);
  }

  function grade(res) {
    const p = list[idx];
    const { grade, heard } = gradeSpeech(res, p.ar);
    recordAttempt(p.id, grade === "exact");
    const fb = $("fc-feedback");
    fb.hidden = false;
    const heardHtml = `<span class="heard" dir="rtl">${heard || "—"}</span>`;
    if (grade === "exact") {
      fb.className = "fc-feedback good";
      fb.innerHTML = `✅ <strong>Ausgezeichnet!</strong> Richtig ausgesprochen.<br>${heardHtml}`;
    } else if (grade === "partial") {
      fb.className = "fc-feedback ok";
      fb.innerHTML = `👍 <strong>Fast!</strong> Hör es dir nochmal an und wiederhole.<br>${heardHtml}`;
    } else {
      fb.className = "fc-feedback warn";
      fb.innerHTML = `🔁 <strong>Noch nicht ganz.</strong> Versuch es erneut.<br>${heardHtml}`;
    }
    $("fc-boxes").innerHTML = boxDots(itemState(p.id).box);
  }

  function initEvents() {
    $("btn-listen").onclick = () => list.length && speak(list[idx].ar, 0.85);
    $("btn-slow").onclick   = () => list.length && speak(list[idx].ar, 0.5);
    $("btn-prev").onclick   = () => { if (!list.length) return; idx = (idx - 1 + list.length) % list.length; render(); };
    $("btn-next").onclick   = () => { if (!list.length) return; idx = (idx + 1) % list.length; render(); };
    $("fc-reveal-btn").onclick = () => { reveal = true; $("flashcard").classList.remove("masked"); };
    $("mode-all").onclick    = () => { reviewMode = false; computeList(); buildFilters(); render(); };
    $("mode-review").onclick = () => { reviewMode = true;  computeList(); buildFilters(); render(); };
    $("reveal-toggle").onclick = () => { reveal = !reveal; buildFilters(); render(); };

    const mic = $("btn-mic");
    if (!REC_OK) {
      mic.classList.add("disabled"); mic.disabled = true;
      $("mic-note").textContent = "🎙️ Spracherkennung wird von diesem Browser nicht unterstützt (am besten Chrome). Anhören funktioniert trotzdem.";
    } else {
      mic.onclick = () => {
        if (recBusy) { recInstance && recInstance.stop(); return; }
        recognize({
          onStart: () => { mic.classList.add("recording"); mic.querySelector(".lbl").textContent = "Hört zu…"; },
          onEnd:   () => { mic.classList.remove("recording"); mic.querySelector(".lbl").textContent = "Nachsprechen"; },
          onError: (e) => {
            const fb = $("fc-feedback"); fb.hidden = false; fb.className = "fc-feedback warn";
            fb.textContent = e.error === "not-allowed" || e.error === "service-not-allowed"
              ? "🎙️ Bitte Mikrofon-Zugriff erlauben."
              : e.error === "no-speech" ? "Nichts gehört – versuch es nochmal."
              : "Erkennung nicht möglich (" + e.error + ").";
          },
          onResult: grade,
        });
      };
    }
  }

  enterHooks.speak = () => { /* Liste ggf. neu (Boxen könnten sich geändert haben) */
    if (reviewMode) { computeList(); }
    render();
  };

  return { start() { initEvents(); computeList(); buildFilters(); render(); } };
})();

/* ============================================================
   6) DIALOGE (Rollenspiel)
   ============================================================ */
const DialogueView = (() => {
  let active = null;      // aktuelles Dialog-Objekt
  let bubbles = [];       // DOM-Referenzen
  let myRole = "B";
  let practicing = false;
  let step = 0;

  function renderList() {
    const wrap = $("dlg-list");
    wrap.innerHTML = "";
    DIALOGUES.forEach((d, i) => {
      const card = el("button", "dlg-card");
      card.innerHTML =
        `<span class="dlg-icon">${d.icon}</span>` +
        `<span class="dlg-meta"><strong>${d.title}</strong><span class="dlg-ctx">${d.context}</span></span>` +
        `<span class="dlg-lvl">${d.lvl}</span>`;
      card.onclick = () => open(i);
      wrap.appendChild(card);
    });
  }

  function open(i) {
    active = DIALOGUES[i];
    practicing = false;
    $("dlg-list").hidden = true;
    $("dlg-player").hidden = false;
    $("dlg-title").textContent = active.icon + " " + active.title;
    $("dlg-context").textContent = active.context;
    // Rollenauswahl
    const rsel = $("dlg-role");
    rsel.innerHTML = "";
    Object.entries(active.roles).forEach(([k, v]) => {
      const o = el("option", null, `${v} (${k})`);
      o.value = k;
      rsel.appendChild(o);
    });
    myRole = "B"; rsel.value = "B";
    renderChat();
    setStatus("Höre dir das Gespräch an oder übe deine Rolle.");
  }

  function renderChat() {
    const chat = $("dlg-chat");
    chat.innerHTML = "";
    bubbles = [];
    active.turns.forEach((t) => {
      const who = active.roles[t.sp];
      const b = el("div", "bubble side-" + (t.sp === "A" ? "a" : "b"));
      b.innerHTML =
        `<span class="bub-who">${who}</span>` +
        `<span class="bub-ar" dir="rtl">${t.ar}</span>` +
        `<span class="bub-tr">${t.tr}</span>` +
        `<span class="bub-de">${t.de}</span>` +
        `<button class="bub-play" title="Anhören">🔊</button>`;
      b.querySelector(".bub-play").onclick = () => speak(t.ar, 0.85);
      chat.appendChild(b);
      bubbles.push(b);
    });
  }

  function setStatus(html) { $("dlg-status").innerHTML = html; }
  function clearHighlights() { bubbles.forEach(b => b.classList.remove("current", "done")); }

  function playAll() {
    if (practicing) stopPractice();
    clearHighlights();
    const texts = active.turns.map(t => t.ar);
    setStatus("▶️ Wird vorgelesen …");
    $("dlg-playall").disabled = true;
    speakSeq(texts, 0.85,
      (i) => { clearHighlights(); bubbles[i].classList.add("current"); bubbles[i].scrollIntoView({ block: "center", behavior: "smooth" }); },
      () => { clearHighlights(); $("dlg-playall").disabled = false; setStatus("Fertig. Jetzt selbst üben?"); });
  }

  function startPractice() {
    practicing = true;
    step = 0;
    clearHighlights();
    // eigene Zeilen maskieren
    bubbles.forEach((b, i) => b.classList.toggle("masked", active.turns[i].sp === myRole));
    $("dlg-practice").textContent = "⏹ Übung beenden";
    advance();
  }
  function stopPractice() {
    practicing = false;
    clearHighlights();
    bubbles.forEach(b => b.classList.remove("masked"));
    $("dlg-practice").textContent = "🎤 Rolle üben";
    setStatus("Übung beendet.");
    $("dlg-turnbar").innerHTML = "";
  }

  function advance() {
    if (!practicing) return;
    if (step >= active.turns.length) {
      clearHighlights();
      setStatus("🎉 Gespräch abgeschlossen – gut gemacht!");
      $("dlg-turnbar").innerHTML = "";
      practicing = false;
      $("dlg-practice").textContent = "🎤 Rolle üben";
      return;
    }
    clearHighlights();
    const t = active.turns[step];
    const b = bubbles[step];
    b.classList.add("current");
    b.scrollIntoView({ block: "center", behavior: "smooth" });

    if (t.sp !== myRole) {
      // Gegenüber spricht
      $("dlg-turnbar").innerHTML = "";
      setStatus(`<em>${active.roles[t.sp]} spricht …</em>`);
      speak(t.ar, 0.85, () => { b.classList.add("done"); step++; setTimeout(advance, 500); });
    } else {
      // Du bist dran
      setStatus(`Du bist dran (<strong>${active.roles[myRole]}</strong>). Sag auf Arabisch:<br><span class="prompt-de">„${t.de}“</span>`);
      renderTurnBar(t, b);
    }
  }

  function renderTurnBar(t, b) {
    const bar = $("dlg-turnbar");
    bar.innerHTML = "";
    const micBtn  = el("button", "tbtn primary", REC_OK ? "🎙️ Sprechen" : "🎙️ (nicht verfügbar)");
    const showBtn = el("button", "tbtn", "👁 Zeigen");
    const hearBtn = el("button", "tbtn", "🔊 Anhören");
    const skipBtn = el("button", "tbtn", "⏭ Weiter");
    if (!REC_OK) micBtn.disabled = true;

    micBtn.onclick = () => {
      if (recBusy) { recInstance && recInstance.stop(); return; }
      recognize({
        onStart: () => { micBtn.textContent = "● Hört zu…"; micBtn.classList.add("rec"); },
        onEnd:   () => { micBtn.textContent = "🎙️ Sprechen"; micBtn.classList.remove("rec"); },
        onError: (e) => setStatus(`⚠️ ${e.error === "no-speech" ? "Nichts gehört." : "Fehler: " + e.error} Versuch es nochmal.`),
        onResult: (res) => {
          const { grade, heard } = gradeSpeech(res, t.ar);
          if (grade === "exact" || grade === "partial") {
            b.classList.remove("masked"); b.classList.add("done");
            setStatus(`${grade === "exact" ? "✅ Perfekt!" : "👍 Fast – akzeptiert."} <span class="heard" dir="rtl">${heard}</span>`);
            step++; setTimeout(advance, 900);
          } else {
            setStatus(`🔁 Noch nicht ganz. Gehört: <span class="heard" dir="rtl">${heard || "—"}</span> · Nochmal versuchen oder „Zeigen“.`);
          }
        },
      });
    };
    showBtn.onclick = () => b.classList.remove("masked");
    hearBtn.onclick = () => speak(t.ar, 0.7);
    skipBtn.onclick = () => { b.classList.remove("masked"); b.classList.add("done"); step++; advance(); };

    bar.append(micBtn, hearBtn, showBtn, skipBtn);
  }

  function back() {
    if (practicing) stopPractice();
    speechSynthesis && speechSynthesis.cancel();
    $("dlg-player").hidden = true;
    $("dlg-list").hidden = false;
    active = null;
  }

  function init() {
    renderList();
    $("dlg-back").onclick   = back;
    $("dlg-playall").onclick = playAll;
    $("dlg-practice").onclick = () => practicing ? stopPractice() : startPractice();
    $("dlg-role").onchange = (e) => { myRole = e.target.value; if (practicing) startPractice(); };
  }

  enterHooks.dialogue = () => {};
  return { start: init };
})();

/* ============================================================
   7) GRAMMATIK
   ============================================================ */
const GrammarView = (() => {
  function init() {
    const wrap = $("grammar-list");
    wrap.innerHTML = "";
    GRAMMAR.forEach((g, i) => {
      const item = el("div", "gr-item");
      const head = el("button", "gr-head");
      head.innerHTML = `<span class="gr-num">${i + 1}</span><span class="gr-title">${g.title}</span><span class="gr-lvl">${g.lvl}</span><span class="gr-arrow">▾</span>`;
      const body = el("div", "gr-body");
      body.innerHTML = `<p class="gr-note">${g.note}</p>`;
      const table = el("div", "gr-rows");
      g.rows.forEach(r => {
        const row = el("button", "gr-row");
        row.innerHTML =
          `<span class="gr-ar" dir="rtl">${r.ar}</span>` +
          `<span class="gr-tr">${r.tr}</span>` +
          `<span class="gr-de">${r.de}</span>` +
          `<span class="gr-play">🔊</span>`;
        row.onclick = () => speak(r.ar, 0.8);
        table.appendChild(row);
      });
      body.appendChild(table);
      head.onclick = () => item.classList.toggle("open");
      item.append(head, body);
      wrap.appendChild(item);
    });
    if (wrap.firstChild) wrap.firstChild.classList.add("open");
  }
  return { start: init };
})();

/* ============================================================
   8) HÖRVERSTEHEN-QUIZ
   ============================================================ */
const QuizView = (() => {
  const ROUND = 10;
  let queue = [];
  let qi = 0;
  let score = 0;
  let streak = 0;

  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

  function showIntro() {
    $("quiz-intro").hidden = false;
    $("quiz-play").hidden = true;
    $("quiz-result").hidden = true;
    $("quiz-best").textContent = store.quiz.best;
    $("quiz-played").textContent = store.quiz.played;
  }

  function startRound() {
    queue = shuffle(PHRASES).slice(0, ROUND);
    qi = 0; score = 0; streak = 0;
    $("quiz-intro").hidden = true;
    $("quiz-result").hidden = true;
    $("quiz-play").hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    const q = queue[qi];
    $("quiz-progress").textContent = `Frage ${qi + 1} / ${ROUND}`;
    $("quiz-score").textContent = `Punkte: ${score}`;
    $("quiz-feedback").hidden = true;
    $("quiz-feedback").className = "quiz-feedback";
    // Antwortoptionen: 1 richtig + 3 Ablenker
    const distractors = shuffle(PHRASES.filter(p => p.de !== q.de)).slice(0, 3);
    const options = shuffle([q, ...distractors]);
    const optWrap = $("quiz-options");
    optWrap.innerHTML = "";
    options.forEach(o => {
      const b = el("button", "quiz-opt", o.de);
      b.onclick = () => answer(b, o === q, q);
      optWrap.appendChild(b);
    });
    // automatisch einmal vorspielen
    setTimeout(() => speak(q.ar, 0.85), 250);
    $("quiz-replay").onclick = () => speak(q.ar, 0.85);
    $("quiz-replay-slow").onclick = () => speak(q.ar, 0.5);
  }

  function answer(btn, correct, q) {
    Array.from($("quiz-options").children).forEach(b => { b.disabled = true; if (b.textContent === q.de) b.classList.add("correct"); });
    const fb = $("quiz-feedback");
    fb.hidden = false;
    if (correct) {
      score++; streak++;
      fb.className = "quiz-feedback good";
      fb.innerHTML = `✅ Richtig! <span dir="rtl" class="q-ar">${q.ar}</span> · <em>${q.tr}</em>` + (streak >= 3 ? ` 🔥 ${streak}er-Serie!` : "");
    } else {
      streak = 0;
      btn.classList.add("wrong");
      fb.className = "quiz-feedback warn";
      fb.innerHTML = `❌ Leider falsch. <span dir="rtl" class="q-ar">${q.ar}</span> = „${q.de}“ · <em>${q.tr}</em>`;
    }
    const nextBtn = el("button", "quiz-next", qi + 1 >= ROUND ? "Ergebnis ansehen ›" : "Weiter ›");
    nextBtn.onclick = () => { qi++; qi >= ROUND ? finish() : renderQuestion(); };
    fb.appendChild(el("div", "quiz-next-wrap")).appendChild(nextBtn);
  }

  function finish() {
    $("quiz-play").hidden = true;
    $("quiz-result").hidden = false;
    store.quiz.played++;
    if (score > store.quiz.best) store.quiz.best = score;
    saveStore();
    const pct = Math.round((score / ROUND) * 100);
    let msg = pct === 100 ? "Perfekt! 🏆" : pct >= 70 ? "Stark! 👏" : pct >= 40 ? "Weiter so 💪" : "Übung macht den Meister 🙂";
    $("quiz-result").innerHTML =
      `<div class="qr-score">${score}<span>/${ROUND}</span></div>` +
      `<p class="qr-msg">${msg}</p>` +
      `<p class="qr-sub">Bestwert: ${store.quiz.best} · Runden gespielt: ${store.quiz.played}</p>`;
    const again = el("button", "btn-cta", "Nochmal spielen");
    again.onclick = startRound;
    $("quiz-result").appendChild(again);
  }

  enterHooks.quiz = showIntro;
  return { start() { $("quiz-start").onclick = startRound; showIntro(); } };
})();

/* ============================================================
   9) ALPHABET (mit Positionsformen)
   ============================================================ */
const AlphabetView = (() => {
  const ZWJ = "‍";
  function init() {
    const grid = $("alpha-grid");
    grid.innerHTML = "";
    ALPHABET.forEach(l => {
      const cell = el("button", "alpha-cell");
      cell.innerHTML =
        `<span class="alpha-char" dir="rtl">${l.ar}</span>` +
        `<span class="alpha-name">${l.name}</span>` +
        `<span class="alpha-tr">${l.tr}</span>` +
        `<span class="alpha-forms" dir="rtl">` +
          `<span title="Anfang">${l.ar + ZWJ}</span>` +
          `<span title="Mitte">${ZWJ + l.ar + ZWJ}</span>` +
          `<span title="Ende">${ZWJ + l.ar}</span>` +
        `</span>` +
        `<span class="alpha-hint">${l.hint}</span>`;
      cell.onclick = () => {
        speak(l.ar, 0.8);
        cell.classList.remove("pulse"); void cell.offsetWidth; cell.classList.add("pulse");
      };
      grid.appendChild(cell);
    });
  }
  return { start: init };
})();

/* ============================================================
   10) FORTSCHRITT
   ============================================================ */
const ProgressView = (() => {
  function render() {
    const total = PHRASES.length;
    let seen = 0, mastered = 0, learning = 0;
    PHRASES.forEach(p => {
      const it = store.items[p.id];
      if (it && it.seen) { seen++; if (it.box >= 5) mastered++; else if (it.box >= 2) learning++; }
    });
    const pct = (n) => Math.round((n / total) * 100);

    // pro Kategorie
    const cats = Array.from(new Set(PHRASES.map(p => p.cat)));
    const catRows = cats.map(c => {
      const items = PHRASES.filter(p => p.cat === c);
      const m = items.filter(p => (store.items[p.id]?.box || 0) >= 5).length;
      const p = Math.round((m / items.length) * 100);
      return `<div class="pr-cat"><span class="pr-cat-name">${c}</span>
        <span class="pr-bar"><span class="pr-fill" style="width:${p}%"></span></span>
        <span class="pr-cat-num">${m}/${items.length}</span></div>`;
    }).join("");

    $("progress-body").innerHTML = `
      <div class="pr-stats">
        <div class="pr-stat"><span class="pr-num">${mastered}</span><span class="pr-lbl">gemeistert</span></div>
        <div class="pr-stat"><span class="pr-num">${learning}</span><span class="pr-lbl">am Lernen</span></div>
        <div class="pr-stat"><span class="pr-num">${seen}<span class="pr-of">/${total}</span></span><span class="pr-lbl">geübt</span></div>
        <div class="pr-stat"><span class="pr-num">${store.quiz.best}</span><span class="pr-lbl">Quiz-Bestwert</span></div>
      </div>
      <div class="pr-overall">
        <div class="pr-overall-head"><span>Gesamtfortschritt</span><span>${pct(mastered)}%</span></div>
        <span class="pr-bar big"><span class="pr-fill" style="width:${pct(mastered)}%"></span></span>
      </div>
      <h3 class="pr-h3">Nach Thema</h3>
      <div class="pr-cats">${catRows}</div>
      <button class="pr-reset" id="pr-reset">Fortschritt zurücksetzen</button>
    `;
    $("pr-reset").onclick = () => {
      if (confirm("Wirklich den gesamten Lernfortschritt löschen?")) {
        store = { items: {}, quiz: { best: 0, played: 0 } };
        saveStore();
        render();
      }
    };
  }
  enterHooks.progress = render;
  return { start: render };
})();

/* ============================================================
   Start
   ============================================================ */
SpeakView.start();
DialogueView.start();
GrammarView.start();
QuizView.start();
AlphabetView.start();
ProgressView.start();
