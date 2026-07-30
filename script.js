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

  /* ---------- Bioenergetic self-read (educational) ---------- */
  var btn = document.getElementById('calc-btn');
  var out = document.getElementById('tracker-out');

  function esc(v) { return String(v).replace(/[<>&]/g, ''); }

  function assess(wake, noon, pulse) {
    // Scoring against Peat-style criteria. Educational only.
    var notes = [];
    var score = 0, max = 0;

    // Waking temperature
    if (!isNaN(wake)) {
      max += 1;
      if (wake >= 36.4 && wake <= 36.9) { score += 1; notes.push('Aufwach-Temperatur im von Peat bevorzugten Bereich (etwa 36,5 °C).'); }
      else if (wake < 36.4) { notes.push('Niedrige Aufwach-Temperatur. In Peats Lesart ein möglicher Hinweis auf einen gedrosselten Stoffwechsel.'); }
      else { notes.push('Erhöhte Aufwach-Temperatur. Kann normal sein, bei Infekt oder Stress aber auch anders bedingt.'); }
    }

    // Rise after breakfast
    if (!isNaN(wake) && !isNaN(noon)) {
      max += 1;
      var diff = noon - wake;
      if (diff >= 0.2) { score += 1; notes.push('Die Temperatur steigt nach dem Frühstück (+' + diff.toFixed(1) + ' °C). Das wertete Peat als gute Energieantwort.'); }
      else if (diff >= 0) { notes.push('Die Temperatur bleibt nach dem Essen fast gleich. Peat hätte sich einen deutlicheren Anstieg gewünscht.'); }
      else { notes.push('Die Temperatur fällt nach dem Essen (' + diff.toFixed(1) + ' °C). In Peats Modell ein Zeichen einer Stressreaktion.'); }
    }

    // Pulse
    if (!isNaN(pulse)) {
      max += 1;
      if (pulse >= 75 && pulse <= 95) { score += 1; notes.push('Ruhepuls nahe an Peats Richtwert von etwa 85 bpm.'); }
      else if (pulse < 75) { notes.push('Ruhepuls unter Peats Richtwert. Kardiologisch oft positiv, von Peat aber teils als Anpassung an eine Unterfunktion gedeutet. Nur zusammen mit der Temperatur interpretieren.'); }
      else { notes.push('Ruhepuls über 95 bpm. Kann Ausdruck von Stress, Koffein, Aufregung oder anderem sein.'); }
    }

    return { score: score, max: max, notes: notes };
  }

  function render(wake, noon, pulse) {
    var r = assess(wake, noon, pulse);
    if (r.max === 0) {
      out.innerHTML = '<p class="placeholder">Bitte mindestens einen Wert eingeben.</p>';
      return;
    }
    var ratio = r.score / r.max;
    var cls, label, headline;
    if (ratio >= 0.75) { cls = 'ok'; label = 'gute Energieantwort'; headline = 'Nach Peats Kriterien günstig'; }
    else if (ratio >= 0.4) { cls = 'mid'; label = 'gemischtes Bild'; headline = 'Teils günstig, teils grenzwertig'; }
    else { cls = 'low'; label = 'Hinweise auf Stress'; headline = 'Mehrere Werte außerhalb von Peats Zielbereich'; }

    var display = !isNaN(pulse) ? pulse + ' <span style="font-size:16px;color:var(--muted)">bpm</span>'
                : (!isNaN(noon) ? noon.toFixed(1) + ' <span style="font-size:16px;color:var(--muted)">°C</span>'
                : wake.toFixed(1) + ' <span style="font-size:16px;color:var(--muted)">°C</span>');

    var li = r.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('');

    out.innerHTML =
      '<div class="readout">' +
        '<div class="gauge"><span class="val">' + display + '</span></div>' +
        '<span class="verdict ' + cls + '">' + label + '</span>' +
        '<h4>' + headline + '</h4>' +
        '<ul>' + li + '</ul>' +
        '<p style="margin-top:14px;font-size:13px;color:var(--muted)">Bildungs-Demonstration nach Peats Denkmustern. Keine Diagnose. Bei anhaltenden Auffälligkeiten bitte ärztlich abklären lassen.</p>' +
      '</div>';
  }

  if (btn) {
    btn.addEventListener('click', function () {
      var wake = parseFloat(document.getElementById('t-wake').value);
      var noon = parseFloat(document.getElementById('t-noon').value);
      var pulse = parseFloat(document.getElementById('pulse').value);
      render(wake, noon, pulse);
    });
  }
})();
