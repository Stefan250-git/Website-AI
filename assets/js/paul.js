(function () {
  "use strict";

  /* ---------- Paul, der Website-Kater: Chat-Bot unten rechts auf jeder Seite ----------
     Wissen: assets/js/paul-wissen.js · optionaler Sprachmodell-Proxy: SITE_CONFIG.paul.endpoint */
  var W = window.PAUL_WISSEN;
  if (!W) return;
  var config = window.SITE_CONFIG || {};
  var endpoint = (config.paul || {}).endpoint || "";
  var G = window.Glossar;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Speicher können in privaten Fenstern fehlen – nie darauf verlassen
  function storage(type) {
    try { return window[type]; } catch (e) { return null; }
  }
  function load(type, key) {
    try { return storage(type).getItem(key); } catch (e) { return null; }
  }
  function save(type, key, value) {
    try {
      if (value === null) storage(type).removeItem(key); else storage(type).setItem(key, value);
    } catch (e) { /* ohne Speicher weiter */ }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  /* ---------- Figur: kindlich, großer Kopf, große Augen ---------- */
  // Komplett schwarz, Details nur mit wenig Kontrast – auffällig sind allein die grünen Augen
  var BLACK = "#16181d", EYE = "#9fd0bd", SOFT = "#2b2e35", LINE = "#454a54";
  var CAT_SVG =
    '<svg class="paul-svg" viewBox="0 0 120 132" aria-hidden="true">' +
    '<path class="paul-tail" d="M82 120c22-1 30-20 18-34" fill="none" stroke="' + BLACK + '" stroke-width="9" stroke-linecap="round"/>' +
    '<ellipse class="paul-body" cx="60" cy="106" rx="28" ry="23" fill="' + BLACK + '"/>' +
    '<ellipse cx="49" cy="127" rx="9" ry="5" fill="' + BLACK + '"/>' +
    '<ellipse cx="71" cy="127" rx="9" ry="5" fill="' + BLACK + '"/>' +
    '<g class="paul-ears" fill="' + BLACK + '" stroke="' + BLACK + '" stroke-width="5" stroke-linejoin="round">' +
    '<path class="paul-ear-l" d="M27 42L22 7l29 19z"/><path class="paul-ear-r" d="M93 42l5-35-29 19z"/>' +
    '</g>' +
    '<path d="M31 35l-3-20 15 12zM89 35l3-20-15 12z" fill="' + SOFT + '"/>' +
    '<ellipse cx="60" cy="58" rx="39" ry="34" fill="' + BLACK + '"/>' +
        '<g class="paul-eyes">' +
    '<ellipse cx="44" cy="58" rx="11.5" ry="13" fill="' + EYE + '"/>' +
    '<ellipse cx="76" cy="58" rx="11.5" ry="13" fill="' + EYE + '"/>' +
    '<g class="paul-pupils">' +
    '<ellipse cx="45" cy="60" rx="7" ry="8.5" fill="#0d1d37"/>' +
    '<ellipse cx="75" cy="60" rx="7" ry="8.5" fill="#0d1d37"/>' +
    '<circle cx="48.5" cy="55.5" r="3.2" fill="#fff"/><circle cx="78.5" cy="55.5" r="3.2" fill="#fff"/>' +
    '<circle cx="42.5" cy="64" r="1.5" fill="#fff"/><circle cx="72.5" cy="64" r="1.5" fill="#fff"/>' +
    '</g></g>' +
        '<path d="M56 72q4-3 8 0-4 5-8 0z" fill="' + SOFT + '"/>' +
    '<path d="M51 78q4.5 5 9 0 4.5 5 9 0" fill="none" stroke="' + LINE + '" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="M27 70l-16-4M27 75l-16 2M93 70l16-4M93 75l16 2" stroke="' + SOFT + '" stroke-width="1.5" stroke-linecap="round"/>' +
    '</svg>';

  var ICON_MIC = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Gerüst ---------- */
  var root = document.createElement("div");
  root.className = "paul";
  root.innerHTML =
    '<div class="paul-bubble" id="paul-bubble" role="dialog" aria-label="Chat mit Paul" hidden>' +
    '<div class="paul-head"><strong>Paul</strong><span>Dein Website-Kater</span>' +
    '<button type="button" class="paul-close" aria-label="Chat schließen">×</button></div>' +
    '<div class="paul-log" aria-live="polite"></div>' +
    '<form class="paul-form">' +
    '<label class="visually-hidden" for="paul-input">Deine Frage an Paul</label>' +
    '<input id="paul-input" type="text" autocomplete="off" maxlength="200" placeholder="Frage eingeben …">' +
    '<button type="button" class="paul-mic" aria-label="Frage diktieren" hidden>' + ICON_MIC + '</button>' +
    '<button type="submit" class="paul-send" aria-label="Frage senden">' + ICON_SEND + '</button>' +
    '</form>' +
    '<p class="paul-note" hidden>Die Spracheingabe nutzt den Spracherkennungsdienst Deines Browsers.</p>' +
    '</div>' +
    '<button type="button" class="paul-teaser" hidden>' + esc(W.greeting) + '</button>' +
    '<button type="button" class="paul-cat" aria-expanded="false" aria-controls="paul-bubble" aria-label="Paul fragen – Chat öffnen">' + CAT_SVG + '</button>' +
    '<button type="button" class="paul-hide" aria-label="Paul ausblenden">×</button>';
  document.body.appendChild(root);

  var bubble = root.querySelector(".paul-bubble");
  var log = root.querySelector(".paul-log");
  var form = root.querySelector(".paul-form");
  var input = root.querySelector("#paul-input");
  var mic = root.querySelector(".paul-mic");
  var note = root.querySelector(".paul-note");
  var teaser = root.querySelector(".paul-teaser");
  var catBtn = root.querySelector(".paul-cat");
  var hideBtn = root.querySelector(".paul-hide");
  var pupils = root.querySelector(".paul-pupils");

  /* ---------- Verlauf (bleibt beim Seitenwechsel innerhalb der Sitzung erhalten) ---------- */
  var history = [];
  try { history = JSON.parse(load("sessionStorage", "paul-log") || "[]"); } catch (e) { history = []; }

  function persist() {
    save("sessionStorage", "paul-log", JSON.stringify(history.slice(-20)));
  }

  function text(s) {
    return G ? G.mark(esc(s)) : esc(s);
  }

  function renderMessage(m) {
    var el = document.createElement("div");
    el.className = "paul-msg paul-msg-" + m.who;
    var html = '<p>' + (m.who === "paul" ? text(m.text) : esc(m.text)) + '</p>';
    if (m.links && m.links.length) {
      html += '<ul class="paul-links">' + m.links.map(function (l) {
        return '<li><a class="paul-link" href="' + esc(l.url) + '">' + esc(l.label) + '</a></li>';
      }).join("") + '</ul>';
    }
    if (m.chips && m.chips.length) {
      html += '<div class="paul-chips">' + m.chips.map(function (c) {
        return '<button type="button" class="paul-chip">' + esc(c) + '</button>';
      }).join("") + '</div>';
    }
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function add(m) {
    history.push(m);
    persist();
    renderMessage(m);
  }

  function ensureGreeting() {
    if (history.length) return;
    add({ who: "paul", text: W.greeting, chips: W.suggestions });
  }

  history.forEach(renderMessage);

  /* ---------- Antworten aus dem Website-Wissen ---------- */
  function normalize(s) {
    return String(s).toLowerCase().replace(/ß/g, "ss").replace(/[^a-z0-9äöü\s-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function score(entry, q, words) {
    var points = 0;
    entry.keywords.forEach(function (k) {
      var key = normalize(k);
      if (key.indexOf(" ") !== -1) {
        if (q.indexOf(key) !== -1) points += 3;
        return;
      }
      for (var i = 0; i < words.length; i++) {
        var w = words[i];
        if (w.indexOf(key) === 0 || (w.length >= 5 && key.indexOf(w) === 0)) { points += 2; return; }
      }
    });
    return points && entry.boost ? points + entry.boost : points;
  }

  function resolveAnswer(entry) {
    return typeof entry.answer === "function" ? entry.answer(config) : entry.answer;
  }

  function localAnswer(question) {
    var q = normalize(question);
    var words = q.split(" ").filter(function (w) { return w.length > 1; });

    for (var i = 0; i < W.smalltalk.length; i++) {
      if (new RegExp(W.smalltalk[i].match).test(q)) return { text: W.smalltalk[i].answer, links: [] };
    }

    var ranked = W.entries.map(function (e) { return { entry: e, points: score(e, q, words) }; })
      .filter(function (r) { return r.points >= 2; })
      .sort(function (a, b) { return b.points - a.points; });

    // Fachbegriff gefragt („Was ist RAG?“) – Erklärung aus dem Glossar
    var terms = G && G.findLoose ? G.findLoose(question) : [];
    var asksMeaning = /was (ist|sind|bedeutet|heisst|heißt|meint)|erklär|bedeutung|definition/.test(q) || words.length <= 3;
    if (terms.length && asksMeaning && (!ranked.length || ranked[0].points < 4)) {
      var t = G.entry(terms[0]);
      return {
        text: terms[0] + ": " + t.text + (t.example ? " Beispiel: " + t.example : ""),
        links: [{ label: "Mehr im KI-Kompass", url: "ki-kompass.html#infrastruktur" }],
      };
    }

    if (!ranked.length) return { text: W.fallback, links: [W.fallbackLink] };

    var best = ranked[0].entry;
    var links = [{ label: best.title, url: best.url }];
    if (best.more) links.push(best.more);
    ranked.slice(1, 3).forEach(function (r) {
      if (r.points >= ranked[0].points - 1 && links.length < 3) links.push({ label: r.entry.title, url: r.entry.url });
    });
    return { text: resolveAnswer(best), links: links, context: ranked.slice(0, 3) };
  }

  // Mit Proxy: Sprachmodell erhält die Frage und die passenden Website-Inhalte als Kontext
  function remoteAnswer(question, local) {
    var context = (local.context || []).map(function (r) {
      return { title: r.entry.title, url: r.entry.url, answer: resolveAnswer(r.entry) };
    });
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question, page: location.pathname, context: context }),
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }).then(function (data) {
      if (!data || !data.answer) throw new Error("leer");
      return { text: data.answer, links: data.links || local.links };
    }).catch(function () { return local; });
  }

  var busy = false;
  function ask(question) {
    question = question.trim();
    if (!question || busy) return;
    busy = true;
    add({ who: "user", text: question });
    var typing = document.createElement("div");
    typing.className = "paul-msg paul-msg-paul paul-typing";
    typing.innerHTML = '<p><span></span><span></span><span></span><span class="visually-hidden">Paul denkt nach</span></p>';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    var local = localAnswer(question);
    var answer = endpoint ? remoteAnswer(question, local) : Promise.resolve(local);
    Promise.all([answer, wait(reduceMotion ? 0 : 650)]).then(function (r) {
      typing.remove();
      add({ who: "paul", text: r[0].text, links: r[0].links });
      busy = false;
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ask(input.value);
    input.value = "";
  });

  log.addEventListener("click", function (e) {
    var chip = e.target.closest(".paul-chip");
    if (chip) ask(chip.textContent);
    var link = e.target.closest(".paul-link");
    if (link && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      go(link.href);
    }
  });

  /* ---------- Spracheingabe (falls der Browser sie anbietet) ---------- */
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (Recognition) {
    mic.hidden = false;
    note.hidden = false;
    var rec = null;
    mic.addEventListener("click", function () {
      if (rec) { rec.stop(); return; }
      rec = new Recognition();
      rec.lang = "de-DE";
      rec.interimResults = true;
      rec.onresult = function (e) {
        var result = e.results[e.results.length - 1];
        input.value = result[0].transcript;
        if (result.isFinal) {
          ask(input.value);
          input.value = "";
        }
      };
      rec.onerror = function () {
        add({ who: "paul", text: "Ich konnte Dich leider nicht verstehen. Versuch es noch einmal oder tipp Deine Frage ein." });
      };
      rec.onend = function () {
        rec = null;
        mic.classList.remove("is-listening");
        mic.setAttribute("aria-label", "Frage diktieren");
      };
      mic.classList.add("is-listening");
      mic.setAttribute("aria-label", "Diktat beenden");
      rec.start();
    });
  }

  /* ---------- Öffnen, schließen, ausblenden ---------- */
  function open() {
    if (root.classList.contains("is-away")) return comeBack();
    ensureGreeting();
    teaser.hidden = true;
    bubble.hidden = false;
    catBtn.setAttribute("aria-expanded", "true");
    catBtn.setAttribute("aria-label", "Chat mit Paul schließen");
    log.scrollTop = log.scrollHeight;
    input.focus();
  }

  function close() {
    bubble.hidden = true;
    catBtn.setAttribute("aria-expanded", "false");
    catBtn.setAttribute("aria-label", "Paul fragen – Chat öffnen");
  }

  // Wegklicken: Paul taucht ab, nur die Ohren bleiben am unteren Rand
  function goAway() {
    close();
    teaser.hidden = true;
    root.classList.add("is-away");
    catBtn.setAttribute("aria-label", "Paul wieder aufrufen");
    save("localStorage", "paul-away", "1");
  }

  function comeBack() {
    root.classList.remove("is-away");
    catBtn.setAttribute("aria-label", "Paul fragen – Chat öffnen");
    save("localStorage", "paul-away", null);
    bounce();
  }

  catBtn.addEventListener("click", function () {
    if (root.classList.contains("is-away")) return comeBack();
    if (bubble.hidden) open(); else close();
  });
  teaser.addEventListener("click", open);
  hideBtn.addEventListener("click", goAway);
  root.querySelector(".paul-close").addEventListener("click", function () {
    close();
    catBtn.focus();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !bubble.hidden) {
      close();
      catBtn.focus();
    }
  });

  /* ---------- Sprünge: hinaus nach rechts, hinein von rechts ---------- */
  function play(name, ms) {
    root.classList.remove("is-exit", "is-enter", "is-bounce");
    void root.offsetWidth;
    root.classList.add(name);
    return wait(ms).then(function () { if (name !== "is-exit") root.classList.remove(name); });
  }
  function bounce() { if (!reduceMotion) play("is-bounce", 500); }

  function samePage(url) {
    function path(p) { return p.replace(/index\.html$/, ""); }
    return path(url.pathname) === path(location.pathname);
  }

  function go(href) {
    var url = new URL(href, location.href);
    close();
    if (reduceMotion) {
      location.href = url.href;
      return;
    }
    play("is-exit", 650).then(function () {
      if (samePage(url)) {
        location.hash = url.hash;
        return wait(450).then(function () { return play("is-enter", 750); });
      }
      save("sessionStorage", "paul-enter", "1");
      location.href = url.href;
    });
  }

  /* ---------- Freundlicher Blick: Pupillen folgen leicht dem Mauszeiger ---------- */
  var frame = null;
  document.addEventListener("mousemove", function (e) {
    if (frame || reduceMotion || root.classList.contains("is-away")) return;
    frame = requestAnimationFrame(function () {
      frame = null;
      var r = catBtn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * .45);
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var k = Math.min(1, d / 300) * 2.4;
      pupils.setAttribute("transform", "translate(" + (dx / d * k).toFixed(2) + " " + (dy / d * k).toFixed(2) + ")");
    });
  });

  /* ---------- Start ---------- */
  if (load("localStorage", "paul-away") === "1") {
    root.classList.add("is-away");
    catBtn.setAttribute("aria-label", "Paul wieder aufrufen");
  } else if (load("sessionStorage", "paul-enter") === "1" && !reduceMotion) {
    play("is-enter", 750);
  } else if (!load("sessionStorage", "paul-greeted")) {
    // Einmal pro Sitzung grüßt Paul mit einer kleinen Sprechblase
    setTimeout(function () {
      if (bubble.hidden && !root.classList.contains("is-away")) teaser.hidden = false;
    }, 1500);
    setTimeout(function () { teaser.hidden = true; }, 12000);
    save("sessionStorage", "paul-greeted", "1");
  }
  save("sessionStorage", "paul-enter", null);
})();
