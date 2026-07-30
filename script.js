/* =========================================================
   Ray Peat . Bioenergetik  .  interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Theme toggle (respects system + saved choice) ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var saved = null;
  try { saved = localStorage.getItem('peat-theme'); } catch (e) {}
  if (saved) {
    root.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('peat-theme', next); } catch (e) {}
      if (window.__renderSpark) window.__renderSpark(); // recolor sparkline for new theme
    });
  }

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('hamburger');
  if (burger) {
    burger.addEventListener('click', function () { nav.classList.toggle('mobile-open'); });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('mobile-open'); });
    });
  }

  /* ---------- Scroll progress + nav shadow ---------- */
  var progress = document.getElementById('progress');
  function onScroll() {
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = (scrolled * 100) + '%';
    if (nav) nav.classList.toggle('scrolled', h.scrollTop > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.qa button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var qa = btn.parentElement;
      var ans = qa.querySelector('.ans');
      var open = qa.classList.toggle('open');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0px';
    });
  });

  /* ---------- Glossar filter ---------- */
  var gsearch = document.getElementById('glossar-search');
  if (gsearch) {
    var terms = Array.prototype.slice.call(document.querySelectorAll('#glossar-list .gterm'));
    var gEmpty = document.getElementById('glossar-empty');
    gsearch.addEventListener('input', function () {
      var q = gsearch.value.trim().toLowerCase().replace(/₂/g, '2');
      var visible = 0;
      terms.forEach(function (t) {
        var txt = t.textContent.toLowerCase().replace(/₂/g, '2');
        var show = q === '' || txt.indexOf(q) !== -1;
        t.classList.toggle('hide', !show);
        if (show) visible++;
      });
      if (gEmpty) gEmpty.hidden = visible !== 0;
    });
  }

  /* ---------- Bioenergetic self-read + data logging ---------- */
  var out = document.getElementById('tracker-out');
  var calcBtn = document.getElementById('calc-btn');
  var saveBtn = document.getElementById('save-btn');
  var clearBtn = document.getElementById('clear-btn');
  var LOG_KEY = 'peat-log';

  function esc(v) { return String(v).replace(/[<>&]/g, ''); }
  function num(id) { return parseFloat(document.getElementById(id).value); }

  function assess(wake, noon, pulse) {
    var notes = [], score = 0, max = 0;
    if (!isNaN(wake)) {
      max += 1;
      if (wake >= 36.4 && wake <= 36.9) { score += 1; notes.push('Aufwach-Temperatur im von Peat bevorzugten Bereich (etwa 36,5 °C).'); }
      else if (wake < 36.4) { notes.push('Niedrige Aufwach-Temperatur. In Peats Lesart ein möglicher Hinweis auf einen gedrosselten Stoffwechsel.'); }
      else { notes.push('Erhöhte Aufwach-Temperatur. Kann normal sein, bei Infekt oder Stress aber auch anders bedingt.'); }
    }
    if (!isNaN(wake) && !isNaN(noon)) {
      max += 1;
      var diff = noon - wake;
      if (diff >= 0.2) { score += 1; notes.push('Die Temperatur steigt nach dem Frühstück (+' + diff.toFixed(1) + ' °C). Das wertete Peat als gute Energieantwort.'); }
      else if (diff >= 0) { notes.push('Die Temperatur bleibt nach dem Essen fast gleich. Peat hätte sich einen deutlicheren Anstieg gewünscht.'); }
      else { notes.push('Die Temperatur fällt nach dem Essen (' + diff.toFixed(1) + ' °C). In Peats Modell ein Zeichen einer Stressreaktion.'); }
    }
    if (!isNaN(pulse)) {
      max += 1;
      if (pulse >= 75 && pulse <= 95) { score += 1; notes.push('Ruhepuls nahe an Peats Richtwert von etwa 85 bpm.'); }
      else if (pulse < 75) { notes.push('Ruhepuls unter Peats Richtwert. Kardiologisch oft positiv, von Peat aber teils als Anpassung an eine Unterfunktion gedeutet. Nur zusammen mit der Temperatur interpretieren.'); }
      else { notes.push('Ruhepuls über 95 bpm. Kann Ausdruck von Stress, Koffein, Aufregung oder anderem sein.'); }
    }
    return { score: score, max: max, notes: notes };
  }

  function classify(r) {
    var ratio = r.max ? r.score / r.max : 0;
    if (ratio >= 0.75) return { cls: 'ok', label: 'gute Energieantwort', headline: 'Nach Peats Kriterien günstig' };
    if (ratio >= 0.4) return { cls: 'mid', label: 'gemischtes Bild', headline: 'Teils günstig, teils grenzwertig' };
    return { cls: 'low', label: 'Hinweise auf Stress', headline: 'Mehrere Werte außerhalb von Peats Zielbereich' };
  }

  function render(wake, noon, pulse) {
    var r = assess(wake, noon, pulse);
    if (r.max === 0) { out.innerHTML = '<p class="placeholder">Bitte mindestens einen Wert eingeben.</p>'; return; }
    var c = classify(r);
    var display = !isNaN(pulse) ? pulse + ' <span style="font-size:16px;color:var(--muted)">bpm</span>'
                : (!isNaN(noon) ? noon.toFixed(1) + ' <span style="font-size:16px;color:var(--muted)">°C</span>'
                : wake.toFixed(1) + ' <span style="font-size:16px;color:var(--muted)">°C</span>');
    var li = r.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('');
    out.innerHTML =
      '<div class="readout">' +
        '<div class="gauge"><span class="val">' + display + '</span></div>' +
        '<span class="verdict ' + c.cls + '">' + c.label + '</span>' +
        '<h4>' + c.headline + '</h4>' +
        '<ul>' + li + '</ul>' +
        '<p style="margin-top:14px;font-size:13px;color:var(--muted)">Bildungs-Demonstration nach Peats Denkmustern. Keine Diagnose. Bei anhaltenden Auffälligkeiten bitte ärztlich abklären lassen.</p>' +
      '</div>';
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', function () { render(num('t-wake'), num('t-noon'), num('pulse')); });
  }

  /* ----- persistence: read / write log ----- */
  function loadLog() {
    try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) { return []; }
  }
  function saveLog(arr) {
    try { localStorage.setItem(LOG_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  var wrap = document.getElementById('history-wrap');
  var list = document.getElementById('history-list');
  var spark = document.getElementById('spark');

  function accent() {
    return getComputedStyle(root).getPropertyValue('--accent').trim() || '#ff7a3d';
  }
  function muted() {
    return getComputedStyle(root).getPropertyValue('--border-2').trim() || 'rgba(255,255,255,.2)';
  }

  function renderSpark() {
    if (!spark) return;
    var data = loadLog().filter(function (e) { return typeof e.wake === 'number' && !isNaN(e.wake); });
    var W = 600, H = 120, pad = 12;
    if (data.length < 2) {
      spark.innerHTML = '<text x="' + (W / 2) + '" y="' + (H / 2) +
        '" text-anchor="middle" fill="' + '#9d9384' + '" font-size="13" font-family="monospace">' +
        (data.length === 0 ? 'Noch keine Aufwach-Temperatur gespeichert' : 'Mindestens zwei Einträge für die Kurve') +
        '</text>';
      return;
    }
    var vals = data.map(function (e) { return e.wake; });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (max - min < 0.4) { var mid = (min + max) / 2; min = mid - 0.4; max = mid + 0.4; }
    var n = data.length;
    function X(i) { return pad + (W - 2 * pad) * (i / (n - 1)); }
    function Y(v) { return H - pad - (H - 2 * pad) * ((v - min) / (max - min)); }
    var d = '', dots = '';
    data.forEach(function (e, i) {
      d += (i === 0 ? 'M' : 'L') + X(i).toFixed(1) + ' ' + Y(e.wake).toFixed(1) + ' ';
      dots += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(e.wake).toFixed(1) + '" r="3.5" fill="' + accent() + '" />';
    });
    var a = accent();
    spark.innerHTML =
      '<path d="' + d.trim() + '" fill="none" stroke="' + a + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />' +
      dots +
      '<text x="' + pad + '" y="14" fill="#9d9384" font-size="10" font-family="monospace">' + max.toFixed(1) + '</text>' +
      '<text x="' + pad + '" y="' + (H - 2) + '" fill="#9d9384" font-size="10" font-family="monospace">' + min.toFixed(1) + '</text>';
  }
  window.__renderSpark = renderSpark;

  function renderHistory() {
    if (!wrap) return;
    var log = loadLog();
    if (log.length === 0) { wrap.hidden = true; renderSpark(); return; }
    wrap.hidden = false;
    list.innerHTML = log.map(function (e, i) {
      var parts = [];
      if (typeof e.wake === 'number' && !isNaN(e.wake)) parts.push('auf ' + e.wake.toFixed(1) + '°');
      if (typeof e.noon === 'number' && !isNaN(e.noon)) parts.push('vm ' + e.noon.toFixed(1) + '°');
      if (typeof e.pulse === 'number' && !isNaN(e.pulse)) parts.push(e.pulse + ' bpm');
      return { i: i, html:
        '<li>' +
          '<span class="h-date">' + esc(e.date) + '</span>' +
          '<span class="h-vals">' + esc(parts.join('  .  ')) + '</span>' +
          '<span class="h-badge ' + e.cls + '">' + esc(e.label) + '</span>' +
          '<button class="h-del" data-i="' + i + '" aria-label="Eintrag löschen" title="Löschen">×</button>' +
        '</li>' };
    }).reverse().map(function (o) { return o.html; }).join('');
    list.querySelectorAll('.h-del').forEach(function (b) {
      b.addEventListener('click', function () {
        var arr = loadLog();
        arr.splice(parseInt(b.getAttribute('data-i'), 10), 1);
        saveLog(arr);
        renderHistory();
      });
    });
    renderSpark();
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      var wake = num('t-wake'), noon = num('t-noon'), pulse = num('pulse');
      var r = assess(wake, noon, pulse);
      if (r.max === 0) { out.innerHTML = '<p class="placeholder">Bitte mindestens einen Wert eingeben, bevor du speicherst.</p>'; return; }
      var c = classify(r);
      var now = new Date();
      var date = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
                 ' ' + now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      var entry = { date: date, cls: c.cls, label: c.label };
      if (!isNaN(wake)) entry.wake = wake;
      if (!isNaN(noon)) entry.noon = noon;
      if (!isNaN(pulse)) entry.pulse = pulse;
      var arr = loadLog();
      arr.push(entry);
      saveLog(arr);
      render(wake, noon, pulse);
      renderHistory();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      saveLog([]);
      renderHistory();
    });
  }

  renderHistory();

  /* ---------- PWA: register service worker (home-screen app + offline) ---------- */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline support optional */ });
    });
  }
})();
