/* ============================================================
   Nutq · Arabisch sprechen lernen
   Alles clientseitig, nutzt die Web Speech API.
   ============================================================ */

/* ---------- Daten: Sprech-Phrasen ---------- */
const PHRASES = [
  // Begrüßung
  { ar: "مرحبا",            tr: "marḥaban",          de: "Hallo",               cat: "Begrüßung" },
  { ar: "السلام عليكم",     tr: "as-salāmu ʿalaykum", de: "Friede sei mit dir",  cat: "Begrüßung" },
  { ar: "صباح الخير",       tr: "ṣabāḥ al-khayr",    de: "Guten Morgen",        cat: "Begrüßung" },
  { ar: "مساء الخير",       tr: "masāʾ al-khayr",    de: "Guten Abend",         cat: "Begrüßung" },
  { ar: "مع السلامة",       tr: "maʿa s-salāma",     de: "Auf Wiedersehen",     cat: "Begrüßung" },
  { ar: "كيف حالك؟",        tr: "kayfa ḥāluk?",      de: "Wie geht es dir?",    cat: "Begrüßung" },

  // Höflichkeit
  { ar: "شكرا",             tr: "shukran",           de: "Danke",               cat: "Höflichkeit" },
  { ar: "عفوا",             tr: "ʿafwan",            de: "Gern geschehen",      cat: "Höflichkeit" },
  { ar: "من فضلك",          tr: "min faḍlik",        de: "Bitte",               cat: "Höflichkeit" },
  { ar: "نعم",              tr: "naʿam",             de: "Ja",                  cat: "Höflichkeit" },
  { ar: "لا",               tr: "lā",                de: "Nein",                cat: "Höflichkeit" },
  { ar: "آسف",              tr: "āsif",              de: "Entschuldigung",      cat: "Höflichkeit" },

  // Vorstellen
  { ar: "أنا",              tr: "anā",               de: "Ich",                 cat: "Vorstellen" },
  { ar: "اسمي أحمد",        tr: "ismī Aḥmad",        de: "Ich heiße Ahmad",     cat: "Vorstellen" },
  { ar: "ما اسمك؟",         tr: "mā ismuk?",         de: "Wie heißt du?",       cat: "Vorstellen" },
  { ar: "أنا من ألمانيا",   tr: "anā min Almāniyā",  de: "Ich komme aus Deutschland", cat: "Vorstellen" },

  // Alltag
  { ar: "ماء",              tr: "māʾ",               de: "Wasser",              cat: "Alltag" },
  { ar: "طعام",             tr: "ṭaʿām",             de: "Essen",               cat: "Alltag" },
  { ar: "قهوة",             tr: "qahwa",             de: "Kaffee",              cat: "Alltag" },
  { ar: "أين الحمام؟",      tr: "ayna l-ḥammām?",    de: "Wo ist die Toilette?", cat: "Alltag" },
  { ar: "كم السعر؟",        tr: "kam as-siʿr?",      de: "Was kostet das?",     cat: "Alltag" },
  { ar: "لا أفهم",          tr: "lā afham",          de: "Ich verstehe nicht",  cat: "Alltag" },

  // Zahlen
  { ar: "واحد",             tr: "wāḥid",             de: "Eins",                cat: "Zahlen" },
  { ar: "اثنان",            tr: "ithnān",            de: "Zwei",                cat: "Zahlen" },
  { ar: "ثلاثة",            tr: "thalātha",          de: "Drei",                cat: "Zahlen" },
  { ar: "أربعة",            tr: "arbaʿa",            de: "Vier",                cat: "Zahlen" },
  { ar: "خمسة",             tr: "khamsa",            de: "Fünf",                cat: "Zahlen" },
];

/* ---------- Daten: Alphabet ---------- */
const ALPHABET = [
  { ar: "ا", name: "Alif",  tr: "ʾa / ā" },
  { ar: "ب", name: "Bāʾ",   tr: "b" },
  { ar: "ت", name: "Tāʾ",   tr: "t" },
  { ar: "ث", name: "Thāʾ",  tr: "th (engl. think)" },
  { ar: "ج", name: "Jīm",   tr: "dsch" },
  { ar: "ح", name: "Ḥāʾ",   tr: "h (kehlig)" },
  { ar: "خ", name: "Khāʾ",  tr: "ch (Bach)" },
  { ar: "د", name: "Dāl",   tr: "d" },
  { ar: "ذ", name: "Dhāl",  tr: "th (engl. this)" },
  { ar: "ر", name: "Rāʾ",   tr: "r (gerollt)" },
  { ar: "ز", name: "Zāy",   tr: "z (weich, s)" },
  { ar: "س", name: "Sīn",   tr: "s (scharf)" },
  { ar: "ش", name: "Shīn",  tr: "sch" },
  { ar: "ص", name: "Ṣād",   tr: "s (emphatisch)" },
  { ar: "ض", name: "Ḍād",   tr: "d (emphatisch)" },
  { ar: "ط", name: "Ṭāʾ",   tr: "t (emphatisch)" },
  { ar: "ظ", name: "Ẓāʾ",   tr: "z (emphatisch)" },
  { ar: "ع", name: "ʿAyn",  tr: "ʿ (kehlig)" },
  { ar: "غ", name: "Ghayn", tr: "gh (Gaumen-r)" },
  { ar: "ف", name: "Fāʾ",   tr: "f" },
  { ar: "ق", name: "Qāf",   tr: "q (tief hinten)" },
  { ar: "ك", name: "Kāf",   tr: "k" },
  { ar: "ل", name: "Lām",   tr: "l" },
  { ar: "م", name: "Mīm",   tr: "m" },
  { ar: "ن", name: "Nūn",   tr: "n" },
  { ar: "ه", name: "Hāʾ",   tr: "h (behaucht)" },
  { ar: "و", name: "Wāw",   tr: "w / ū" },
  { ar: "ي", name: "Yāʾ",   tr: "j / ī" },
];

/* ---------- Web Speech: Text-to-Speech ---------- */
let arVoice = null;

function pickArabicVoice() {
  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  arVoice = voices.find(v => /^ar/i.test(v.lang)) || null;
}
if (window.speechSynthesis) {
  pickArabicVoice();
  speechSynthesis.onvoiceschanged = pickArabicVoice;
}

function speak(text, rate = 0.85) {
  if (!window.speechSynthesis) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = rate;
  if (arVoice) u.voice = arVoice;
  speechSynthesis.speak(u);
  return true;
}

/* ---------- Web Speech: Erkennung (Nachsprechen) ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

/* Arabisch für den Vergleich normalisieren:
   Diakritika, Tatweel und Satzzeichen entfernen, Alif-Varianten
   und Tāʾ marbūṭa vereinheitlichen. */
function normalizeAr(s) {
  return (s || "")
    .replace(/[ؐ-ًؚ-ٰٟـ]/g, "") // Tashkil + Tatweel
    .replace(/[آأإٱ]/g, "ا")          // Alif-Varianten → ا
    .replace(/ة/g, "ه")                              // ة → ه
    .replace(/ى/g, "ي")                              // ى → ي
    .replace(/[^ء-ي\s]/g, "")                        // nur arab. Buchstaben
    .replace(/\s+/g, " ")
    .trim();
}

/* ---------- App-Zustand ---------- */
let filtered = PHRASES.slice();
let idx = 0;
let currentCat = "Alle";

const $ = (id) => document.getElementById(id);

/* ---------- Tabs ---------- */
$("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  btn.classList.add("active");
  $("view-" + btn.dataset.view).classList.add("active");
  speechSynthesis?.cancel();
});

/* ---------- Kategorie-Filter ---------- */
function buildCatFilter() {
  const cats = ["Alle", ...Array.from(new Set(PHRASES.map(p => p.cat)))];
  const wrap = $("cat-filter");
  wrap.innerHTML = "";
  cats.forEach(c => {
    const b = document.createElement("button");
    b.className = "chip" + (c === currentCat ? " active" : "");
    b.textContent = c;
    b.addEventListener("click", () => {
      currentCat = c;
      filtered = c === "Alle" ? PHRASES.slice() : PHRASES.filter(p => p.cat === c);
      idx = 0;
      buildCatFilter();
      renderCard();
    });
    wrap.appendChild(b);
  });
}

/* ---------- Flashcard rendern ---------- */
function renderCard() {
  const p = filtered[idx];
  if (!p) return;
  $("fc-arabic").textContent = p.ar;
  $("fc-translit").textContent = p.tr;
  $("fc-de").textContent = p.de;
  $("fc-pos").textContent = idx + 1;
  $("fc-total").textContent = filtered.length;
  const fb = $("fc-feedback");
  fb.hidden = true;
  fb.className = "fc-feedback";
}

/* ---------- Buttons: Anhören / Nachsprechen / Navigation ---------- */
$("btn-listen").addEventListener("click", () => {
  if (!speak(filtered[idx].ar, 0.85)) showNoTTS();
});
$("btn-slow").addEventListener("click", () => {
  if (!speak(filtered[idx].ar, 0.55)) showNoTTS();
});
$("btn-prev").addEventListener("click", () => {
  idx = (idx - 1 + filtered.length) % filtered.length;
  renderCard();
});
$("btn-next").addEventListener("click", () => {
  idx = (idx + 1) % filtered.length;
  renderCard();
});

function showNoTTS() {
  $("mic-note").textContent = "Dein Browser unterstützt keine arabische Sprachausgabe. Probier es in Chrome.";
}

/* ---------- Nachsprechen (Erkennung) ---------- */
const micBtn = $("btn-mic");
let recognizing = false;

if (!SR) {
  micBtn.classList.add("disabled");
  micBtn.disabled = true;
  $("mic-note").textContent =
    "🎙️ Die Spracherkennung wird von diesem Browser nicht unterstützt. In Chrome kannst du deine Aussprache überprüfen lassen. Anhören funktioniert trotzdem.";
} else {
  const rec = new SR();
  rec.lang = "ar-SA";
  rec.interimResults = false;
  rec.maxAlternatives = 5;

  micBtn.addEventListener("click", () => {
    if (recognizing) { rec.stop(); return; }
    speechSynthesis?.cancel();
    try { rec.start(); } catch (_) { /* schon aktiv */ }
  });

  rec.onstart = () => {
    recognizing = true;
    micBtn.classList.add("recording");
    micBtn.querySelector("span:last-child").textContent = "Hört zu…";
  };

  rec.onend = () => {
    recognizing = false;
    micBtn.classList.remove("recording");
    micBtn.querySelector("span:last-child").textContent = "Nachsprechen";
  };

  rec.onerror = (e) => {
    const fb = $("fc-feedback");
    fb.hidden = false;
    fb.className = "fc-feedback warn";
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      fb.textContent = "🎙️ Bitte erlaube den Mikrofon-Zugriff, um deine Aussprache zu üben.";
    } else if (e.error === "no-speech") {
      fb.textContent = "Ich habe nichts gehört – versuch es noch einmal.";
    } else {
      fb.textContent = "Erkennung nicht möglich (" + e.error + "). Versuch es erneut.";
    }
  };

  rec.onresult = (e) => {
    const target = normalizeAr(filtered[idx].ar);
    const alts = [];
    for (let i = 0; i < e.results[0].length; i++) {
      alts.push(normalizeAr(e.results[0][i].transcript));
    }
    const heard = alts[0] || "";
    const exact = alts.some(a => a === target);
    const partial = alts.some(a => a.includes(target) || target.includes(a) && a.length > 1);

    const fb = $("fc-feedback");
    fb.hidden = false;
    if (exact) {
      fb.className = "fc-feedback good";
      fb.innerHTML = "✅ <strong>Ausgezeichnet!</strong> Das war richtig.<br><span class='heard'>Gehört: " + (heard || "—") + "</span>";
    } else if (partial) {
      fb.className = "fc-feedback ok";
      fb.innerHTML = "👍 <strong>Fast!</strong> Hör dir das Wort noch einmal an und wiederhole es.<br><span class='heard'>Gehört: " + (heard || "—") + "</span>";
    } else {
      fb.className = "fc-feedback warn";
      fb.innerHTML = "🔁 <strong>Noch nicht ganz.</strong> Probier es erneut.<br><span class='heard'>Gehört: " + (heard || "—") + "</span>";
    }
  };
}

/* ---------- Alphabet rendern ---------- */
function buildAlphabet() {
  const grid = $("alpha-grid");
  ALPHABET.forEach(l => {
    const cell = document.createElement("button");
    cell.className = "alpha-cell";
    cell.innerHTML =
      '<span class="alpha-char" dir="rtl">' + l.ar + '</span>' +
      '<span class="alpha-name">' + l.name + '</span>' +
      '<span class="alpha-tr">' + l.tr + '</span>';
    cell.addEventListener("click", () => {
      speak(l.ar, 0.8);
      cell.classList.remove("pulse");
      void cell.offsetWidth;
      cell.classList.add("pulse");
    });
    grid.appendChild(cell);
  });
}

/* ---------- Start ---------- */
buildCatFilter();
renderCard();
buildAlphabet();
