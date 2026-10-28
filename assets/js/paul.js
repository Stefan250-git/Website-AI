(function () {
  "use strict";

  /* ---------- Paul, der Website-Kater: Chat-Bot unten rechts auf jeder Seite ----------
     Wissen: assets/js/paul-wissen.js · optionaler Sprachmodell-Proxy: SITE_CONFIG.paul.endpoint */
  var W = window.PAUL_WISSEN;
  if (!W) return;
  var config = window.SITE_CONFIG || {};
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

  // Testbetrieb: Das Sprachmodell antwortet nur mit Testschlüssel. Einmal die Seite mit
  // ?paul=SCHLÜSSEL öffnen, der Browser merkt ihn sich; ?paul= (leer) beendet den Testbetrieb.
  // Der Proxy prüft den Schlüssel selbst (Secret ACCESS_KEY), ohne ihn antwortet Paul lokal.
  var keyParam = new URLSearchParams(location.search).get("paul");
  if (keyParam !== null) {
    save("localStorage", "paul-key", keyParam.trim() || null);
    // Schlüssel aus der Adresszeile entfernen, damit er nicht versehentlich mit geteilt wird
    var clean = new URL(location.href);
    clean.searchParams.delete("paul");
    history.replaceState(history.state, "", clean.href);
  }
  var accessKey = load("localStorage", "paul-key") || "";
  var endpoint = accessKey ? (config.paul || {}).endpoint || "" : "";

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
  // Auge in Seitenansicht (Blick nach rechts): grün, Pupille nach vorn, Glanzpunkt
  function sideEye(x, y, rx, ry) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + EYE + '"/>' +
      '<ellipse cx="' + (x + rx * .25) + '" cy="' + (y + ry * .12) + '" rx="' + (rx * .6) + '" ry="' + (ry * .68) + '" fill="#0d1d37"/>' +
      '<circle cx="' + (x + rx * .5) + '" cy="' + (y - ry * .35) + '" r="' + (rx * .28) + '" fill="#fff"/>';
  }
  // Kopf in Seitenansicht (Blick nach rechts); (x, y) = Kopfmitte, k = Größe
  function sideHead(x, y, k) {
    function n(v) { return Math.round(v * 10) / 10; }
    return '<path d="M' + n(x - 20 * k) + ' ' + n(y - 12 * k) + 'l' + n(-2 * k) + ' ' + n(-30 * k) + ' ' + n(24 * k) + ' ' + n(18 * k) + 'zM' +
      n(x + 6 * k) + ' ' + n(y - 22 * k) + 'l' + n(14 * k) + ' ' + n(-24 * k) + ' ' + n(6 * k) + ' ' + n(32 * k) + 'z" fill="' + BLACK + '" stroke="' + BLACK + '" stroke-width="' + n(4 * k) + '" stroke-linejoin="round"/>' +
      '<path d="M' + n(x - 18 * k) + ' ' + n(y - 16 * k) + 'l' + n(-1.5 * k) + ' ' + n(-18 * k) + ' ' + n(13 * k) + ' ' + n(11 * k) + 'z" fill="' + SOFT + '"/>' +
      '<ellipse cx="' + x + '" cy="' + y + '" rx="' + n(34 * k) + '" ry="' + n(30 * k) + '" fill="' + BLACK + '"/>' +
      sideEye(n(x - 6 * k), n(y), n(9.5 * k), n(11 * k)) + sideEye(n(x + 17 * k), n(y), n(8 * k), n(10 * k)) +
      '<path d="M' + n(x + 29 * k) + ' ' + n(y + 12 * k) + 'q' + n(3 * k) + ' ' + n(-2 * k) + ' ' + n(5 * k) + ' ' + n(1 * k) + '-' + n(3 * k) + ' ' + n(3 * k) + '-' + n(5 * k) + '-' + n(1 * k) + 'z" fill="' + SOFT + '"/>' +
      '<path d="M' + n(x + 20 * k) + ' ' + n(y + 17 * k) + 'q' + n(4 * k) + ' ' + n(4 * k) + ' ' + n(8 * k) + ' 0" fill="none" stroke="' + LINE + '" stroke-width="' + n(2 * k) + '" stroke-linecap="round"/>';
  }

  var CAT_SVG =
    '<svg class="paul-svg" viewBox="0 0 120 132" aria-hidden="true">' +
    // Vorderansicht (Ruhe)
    '<g class="pose-front">' +
    '<path class="paul-tail" d="M82 120c22-1 30-20 18-34" fill="none" stroke="' + BLACK + '" stroke-width="9" stroke-linecap="round"/>' +
    '<ellipse class="paul-body" cx="60" cy="106" rx="28" ry="23" fill="' + BLACK + '"/>' +
    '<ellipse cx="71" cy="127" rx="9" ry="5" fill="' + BLACK + '"/>' +
    '<g class="paul-head">' +
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
    '</g>' +
    // Linke Vorderpfote: hebt sich beim Putzen zum Maul (Drehpunkt am Ellenbogen)
    '<g class="paul-paw">' +
    '<rect x="41" y="106" width="17" height="27" rx="8.5" fill="' + BLACK + '"/>' +
    '<path class="paul-toes" d="M46 127.5v3.5M49.5 127v4.5M53 127.5v3.5" stroke="' + LINE + '" stroke-width="1.5" stroke-linecap="round"/>' +
    '</g>' +
    // Rosa Zunge, nur beim Pfote-Lecken sichtbar
    '<ellipse class="paul-tongue" cx="60" cy="84" rx="3.4" ry="3.4" fill="#f0a8b0"/>' +
    '</g>' +
    // Seitlich sitzend, Blick nach rechts (Drehung vor dem Sprung, Stehen nach der Landung)
    '<g class="pose-side">' +
    '<path d="M34 122c-22 0-28-20-15-32" fill="none" stroke="' + BLACK + '" stroke-width="9" stroke-linecap="round"/>' +
    '<ellipse cx="52" cy="106" rx="30" ry="22" fill="' + BLACK + '"/>' +
    '<path d="M64 102h11v24a5.5 5.5 0 0 1-11 0zM76 100h11v26a5.5 5.5 0 0 1-11 0z" fill="' + BLACK + '"/>' +
    sideHead(74, 60, 1) +
    '</g>' +
    // Geduckt zum Absprung bzw. nach der Landung: Kopf und Brust tief, Hinterteil hoch
    '<g class="pose-crouch">' +
    '<path d="M18 104c-14-6-22-4-30 2" fill="none" stroke="' + BLACK + '" stroke-width="8" stroke-linecap="round"/>' +
    '<ellipse cx="52" cy="112" rx="38" ry="16" transform="rotate(9 52 112)" fill="' + BLACK + '"/>' +
    '<ellipse cx="26" cy="127" rx="11" ry="5" fill="' + BLACK + '"/>' +
    '<path d="M84 120c8 4 16 6 24 6" fill="none" stroke="' + BLACK + '" stroke-width="9" stroke-linecap="round"/>' +
    sideHead(90, 100, .85) +
    '</g>' +
    // Gestreckt im Sprung: Vorderpfoten voraus, Hinterbeine und Schwanz nach hinten
    '<g class="pose-leap">' +
    '<path d="M14 84C2 82-8 82-20 86" fill="none" stroke="' + BLACK + '" stroke-width="8" stroke-linecap="round"/>' +
    '<ellipse cx="54" cy="88" rx="44" ry="15" fill="' + BLACK + '"/>' +
    '<path d="M86 94l26 12M82 98l22 18M24 94L0 104M28 98L8 116" fill="none" stroke="' + BLACK + '" stroke-width="8" stroke-linecap="round"/>' +
    sideHead(100, 70, .72) +
    '</g>' +
    // Weggeklickt: schaut über den unteren Rand – Ohren, Augen, links und rechts die Pfoten
    '<g class="pose-peek">' +
    // Ohren mit dem Ansatz im Kopf (der Kopf überdeckt ihn), damit sie geschlossen am Kopf sitzen
    '<path d="M27 80l4 41 23-17zM93 80l-4 41-23-17z" fill="' + BLACK + '" stroke="' + BLACK + '" stroke-width="5" stroke-linejoin="round"/>' +
    '<path d="M30 88l3 25 15-9zM90 88l-3 25-15-9z" fill="' + SOFT + '"/>' +
    '<ellipse cx="60" cy="140" rx="36" ry="38" fill="' + BLACK + '"/>' +
    // Augen sitzen auf der Kante: nur die obere Hälfte ist zu sehen
    '<g class="paul-eyes">' +
    '<ellipse cx="45" cy="131" rx="10.5" ry="11.5" fill="' + EYE + '"/><ellipse cx="75" cy="131" rx="10.5" ry="11.5" fill="' + EYE + '"/>' +
    '<g class="paul-pupils">' +
    '<ellipse cx="46" cy="132.5" rx="6.4" ry="7.6" fill="#0d1d37"/><ellipse cx="74" cy="132.5" rx="6.4" ry="7.6" fill="#0d1d37"/>' +
    '<circle cx="49" cy="126" r="2.8" fill="#fff"/><circle cx="79" cy="126" r="2.8" fill="#fff"/>' +
    '</g></g>' +
    // Pfoten links und rechts, mit minimalem Abstand zum Kopf
    '<ellipse cx="11" cy="128" rx="12" ry="7" fill="' + BLACK + '"/><ellipse cx="109" cy="128" rx="12" ry="7" fill="' + BLACK + '"/>' +
    '<path d="M6 124.5v5M11 123.5v6M16 124.5v5M104 124.5v5M109 123.5v6M114 124.5v5" stroke="' + LINE + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '</g>' +
    '</svg>';

  var ICON_MIC = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Gerüst ---------- */
  var root = document.createElement("div");
  root.className = "paul";
  root.innerHTML =
    '<div class="paul-bubble" id="paul-bubble" role="dialog" aria-label="Chat mit Paul" hidden>' +
    '<button type="button" class="paul-close" aria-label="Chat schließen">×</button>' +
    '<div class="paul-say" aria-live="polite"></div>' +
    '<form class="paul-form">' +
    '<label class="visually-hidden" for="paul-input">Deine Frage an Paul</label>' +
    '<input id="paul-input" type="text" autocomplete="off" maxlength="200" placeholder="Frage eingeben …">' +
    '<button type="button" class="paul-mic" aria-label="Frage diktieren" hidden>' + ICON_MIC + '</button>' +
    '<button type="submit" class="paul-send" aria-label="Frage senden">' + ICON_SEND + '</button>' +
    '</form>' +
    '<p class="paul-note" hidden>Spracheingabe über den Dienst Deines Browsers</p>' +
    // Transparenzpflicht nach Art. 50 KI-Verordnung, sobald ein Sprachmodell antwortet
    (endpoint ? '<p class="paul-ai">Paul antwortet mit Hilfe von KI und kann sich irren. Bitte gib keine persönlichen Daten ein. <a href="datenschutz.html#paul">Mehr dazu</a></p>' : '') +
    '</div>' +
    '<button type="button" class="paul-teaser" hidden>' + esc(W.greeting) + '</button>' +
    '<button type="button" class="paul-cat" data-pose="front" aria-expanded="false" aria-controls="paul-bubble" aria-label="Paul fragen – Chat öffnen">' + CAT_SVG + '</button>' +
    '<button type="button" class="paul-hide" aria-label="Paul ausblenden">×</button>';
  document.body.appendChild(root);

  var bubble = root.querySelector(".paul-bubble");
  var say = root.querySelector(".paul-say");
  var form = root.querySelector(".paul-form");
  var input = root.querySelector("#paul-input");
  var mic = root.querySelector(".paul-mic");
  var note = root.querySelector(".paul-note");
  var teaser = root.querySelector(".paul-teaser");
  var catBtn = root.querySelector(".paul-cat");
  var hideBtn = root.querySelector(".paul-hide");
  var pupils = root.querySelectorAll(".paul-pupils");
  var svg = root.querySelector(".paul-svg");

  /* ---------- Textblase: immer leer beginnen, genau ein Vorschlag ---------- */
  var suggestion = Math.floor(Math.random() * W.suggestions.length);

  function text(s) {
    return G ? G.mark(esc(s)) : esc(s);
  }

  // Leerer Zustand: Begrüßung und ein Vorschlag (wechselt bei jedem Öffnen)
  function reset() {
    var tip = W.suggestions[suggestion++ % W.suggestions.length];
    say.innerHTML = '<p>' + esc(W.greeting) + '</p><button type="button" class="paul-chip">' + esc(tip) + '</button>';
    input.value = "";
  }

  function show(answer) {
    var links = (answer.links || []).slice(0, 2);
    var paragraphs = String(answer.text).split(/\n\n+/).map(function (part) { return '<p>' + text(part) + '</p>'; }).join("");
    say.innerHTML = paragraphs + (links.length ? '<ul class="paul-links">' + links.map(function (l) {
      // Quellen anderer Websites (z. B. tagesschau.de) im neuen Tab, Paul bleibt hier
      var external = new URL(l.url, location.href).origin !== location.origin;
      return '<li><a class="paul-link" href="' + esc(l.url) + '"'
        + (external ? ' target="_blank" rel="noopener"' : '') + '>' + esc(l.label) + '</a></li>';
    }).join("") + '</ul>' : '');
  }

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
      var talk = W.smalltalk[i];
      if (!new RegExp(talk.match).test(q)) continue;
      // Feste Antworten: beim zweiten Mal in derselben Sitzung mit freundlichem Hinweis davor
      if (talk.id) {
        var asked = (load("sessionStorage", "paul-asked") || "").split(",");
        if (asked.indexOf(talk.id) !== -1) return { text: W.repeatIntro + "\n\n" + talk.answer, links: [], fixed: true };
        asked.push(talk.id);
        save("sessionStorage", "paul-asked", asked.filter(Boolean).join(","));
      }
      return { text: talk.answer, links: [], fixed: true };
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
        fixed: true,
      };
    }

    if (!ranked.length) return { text: W.fallback, links: [W.fallbackLink], fallback: true };

    var best = ranked[0].entry;
    var links = [{ label: best.title, url: best.url }];
    if (best.more) links.push(best.more);
    ranked.slice(1, 3).forEach(function (r) {
      if (r.points >= ranked[0].points - 1 && links.length < 3) links.push({ label: r.entry.title, url: r.entry.url });
    });
    return { text: resolveAnswer(best), links: links, context: ranked.slice(0, 3) };
  }

  // Mit Proxy: Sprachmodell erhält die Frage und die passenden Website-Inhalte als Kontext.
  // Feste Antworten (Smalltalk, Glossar) bleiben lokal; ist der Proxy nicht erreichbar, ebenso.
  function remoteAnswer(question, local) {
    var context = (local.context || []).map(function (r) {
      return { title: r.entry.title, url: r.entry.url, answer: resolveAnswer(r.entry) };
    });
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Paul-Key": accessKey },
      body: JSON.stringify({ question: question, page: location.pathname, context: context }),
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }).then(function (data) {
      if (!data || !data.answer) throw new Error("leer");
      // Allgemeine Fragen ohne Bezug zur Website: kein Kontakt-Link unter der Antwort
      return { text: data.answer, links: data.links || (local.fallback ? [] : local.links) };
    }).catch(function () { return local; });
  }

  var busy = false;
  function ask(question) {
    question = question.trim();
    if (!question || busy) return;
    busy = true;
    say.innerHTML = '<p class="paul-typing"><span></span><span></span><span></span><span class="visually-hidden">Paul denkt nach</span></p>';

    var local = localAnswer(question);
    var answer = endpoint && !local.fixed ? remoteAnswer(question, local) : Promise.resolve(local);
    Promise.all([answer, wait(reduceMotion ? 0 : 650)]).then(function (r) {
      show(r[0]);
      busy = false;
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ask(input.value);
    input.value = "";
  });

  say.addEventListener("click", function (e) {
    var chip = e.target.closest(".paul-chip");
    if (chip) ask(chip.textContent);
    var link = e.target.closest(".paul-link");
    if (link && !link.target && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      go(link.href);
    }
  });

  /* ---------- Spracheingabe (über den Spracherkennungsdienst des Browsers) ---------- */
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var MIC_ERRORS = {
    "not-allowed": "Ich darf Dein Mikrofon nicht benutzen. Erlaube den Zugriff oben in der Adresszeile Deines Browsers und versuch es noch einmal.",
    "service-not-allowed": "Ich darf Dein Mikrofon nicht benutzen. Erlaube den Zugriff oben in der Adresszeile Deines Browsers und versuch es noch einmal.",
    "audio-capture": "Ich finde kein Mikrofon. Prüf bitte, ob eines angeschlossen und eingeschaltet ist.",
    "no-speech": "Ich habe nichts gehört. Tipp noch einmal auf das Mikrofon und sprich dann Deine Frage.",
    "network": "Die Spracherkennung Deines Browsers ist gerade nicht erreichbar. Tipp Deine Frage bitte ein.",
  };
  mic.hidden = false;
  var rec = null;
  mic.addEventListener("click", function () {
    if (!Recognition) {
      show({ text: "Dein Browser bietet leider keine Spracheingabe an. In Chrome, Edge oder Safari klappt es. Oder Du nutzt die Diktierfunktion Deiner Tastatur." });
      input.focus();
      return;
    }
    if (rec) { rec.stop(); return; }
    if (mode === "hover") mode = "pinned";  // Blase bleibt offen, während Du sprichst
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
    rec.onerror = function (e) {
      if (e.error === "aborted") return;
      show({ text: MIC_ERRORS[e.error] || "Ich konnte Dich leider nicht verstehen. Versuch es noch einmal oder tipp Deine Frage ein." });
    };
    rec.onend = function () {
      rec = null;
      note.hidden = true;
      mic.classList.remove("is-listening");
      mic.setAttribute("aria-label", "Frage diktieren");
    };
    mic.classList.add("is-listening");
    note.hidden = false;
    mic.setAttribute("aria-label", "Diktat beenden");
    rec.start();
  });

  /* ---------- Öffnen, schließen, ausblenden ---------- */
  // hover = kurz durch Darüberfahren geöffnet; pinned = per Klick geöffnet
  var mode = null;

  function open(how) {
    if (root.classList.contains("is-away")) return comeBack();
    mode = how === "hover" ? "hover" : "pinned";
    reset();
    teaser.hidden = true;
    bubble.hidden = false;
    catBtn.setAttribute("aria-expanded", "true");
    catBtn.setAttribute("aria-label", "Chat mit Paul schließen");
    if (mode === "pinned") input.focus();
  }

  function close() {
    mode = null;
    clearTimeout(leaveTimer);
    bubble.hidden = true;
    reset();
    catBtn.setAttribute("aria-expanded", "false");
    catBtn.setAttribute("aria-label", "Paul fragen – Chat öffnen");
  }

  // Wegklicken: Paul taucht ab und schaut über den unteren Rand (Ohren, Augen, Pfoten)
  function goAway() {
    close();
    teaser.hidden = true;
    catBtn.setAttribute("aria-label", "Paul wieder aufrufen");
    save("localStorage", "paul-away", "1");
    dive(function () {
      pose("peek");
      root.classList.add("is-away");
    });
  }

  function comeBack() {
    catBtn.setAttribute("aria-label", "Paul fragen – Chat öffnen");
    save("localStorage", "paul-away", null);
    dive(function () {
      root.classList.remove("is-away");
      pose("front");
    });
  }

  // Abtauchen, Haltung wechseln, wieder auftauchen
  function dive(change) {
    if (reduceMotion) return change();
    root.classList.add("is-diving");
    wait(320).then(function () {
      change();
      void catBtn.offsetWidth;
      root.classList.remove("is-diving");
    });
  }

  catBtn.addEventListener("click", function () {
    if (root.classList.contains("is-away")) return comeBack();
    if (bubble.hidden) return open();
    // Durch Darüberfahren geöffnet: Klick hält die Blase offen
    if (mode === "hover") {
      mode = "pinned";
      input.focus();
      return;
    }
    close();
  });
  teaser.addEventListener("click", function () { open(); });

  /* ---------- Darüberfahren: Paul blinzelt, die Blase geht kurz auf; nach dem Verlassen
     des Bereichs schließt sie sich nach etwa 3 Sekunden (nicht, solange getippt wird) ---------- */
  var LEAVE_DELAY = 3000;
  var leaveTimer = null;
  var inside = false;

  function blink() {
    root.classList.remove("is-blink");
    void root.offsetWidth;
    root.classList.add("is-blink");
  }

  function closeLater() {
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(function () {
      if (!inside && document.activeElement !== input && !rec && !bubble.hidden) close();
    }, LEAVE_DELAY);
  }

  root.addEventListener("pointerenter", function (e) {
    inside = true;
    clearTimeout(leaveTimer);
    if (e.pointerType !== "mouse") return;
    var busyJumping = root.classList.contains("is-exit") || root.classList.contains("is-enter");
    if (root.classList.contains("is-away") || busyJumping) return;
    blink();
    if (bubble.hidden) open("hover");
  });
  root.addEventListener("pointerleave", function () {
    inside = false;
    if (!bubble.hidden) closeLater();
  });
  input.addEventListener("blur", function () {
    if (!inside && !bubble.hidden) closeLater();
  });
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

  /* ---------- Sprünge wie eine echte Katze: drehen, ducken, Po wackeln, gestreckt springen ---------- */
  function play(name, ms) {
    root.classList.remove(name);
    void root.offsetWidth;
    root.classList.add(name);
    return wait(ms).then(function () { root.classList.remove(name); });
  }
  function bounce() { if (!reduceMotion) play("is-bounce", 500); }

  function pose(name) { catBtn.setAttribute("data-pose", name); }

  // Ein Zeitabschnitt: fn(t) mit t von 0 bis 1
  function phase(ms, fn) {
    return new Promise(function (resolve) {
      var start = null;
      function frame(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / ms);
        fn(t);
        if (t < 1) requestAnimationFrame(frame); else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  // face: 1 = Blick nach rechts, -1 = nach links; r > 0 hebt die Nase
  function place(o, face) {
    svg.style.transform = "translate(" + (o.x || 0) + "px," + (o.y || 0) + "px) rotate(" + (-(o.r || 0) * face) + "deg) scale(" +
      (face * (o.sx || 1)) + "," + (o.sy || 1) + ")";
  }

  // Drehung: Körper wird kurz schmal, in der Mitte wechselt die Haltung
  function turn(to, face) {
    var swapped = false;
    return phase(240, function (t) {
      if (!swapped && t >= .5) { pose(to); swapped = true; }
      place({ sx: 1 - .45 * Math.sin(Math.PI * t) }, face);
    });
  }

  var LEAP = 380; // Sprungweite nach rechts (px), sicher aus dem Bild

  function jumpOut() {
    root.classList.add("is-exit");
    return turn("side", 1).then(function () {
      return phase(160, function () { place({}, 1); });
    }).then(function () {
      pose("crouch");
      // Ducken und Po-Wackeln, zum Schluss kurz zusammenziehen
      return phase(620, function (t) {
        var wiggle = t < .8 ? Math.sin(t * Math.PI * 6) * 3 : 0;
        var load = t > .8 ? (t - .8) / .2 : 0;
        place({ x: -6 * Math.min(1, t * 3), r: wiggle, sx: 1 + .05 * load, sy: 1 - .1 * load }, 1);
      });
    }).then(function () {
      pose("leap");
      return phase(560, function (t) {
        place({ x: LEAP * t, y: 18 * t - 110 * 4 * t * (1 - t), r: 22 - 44 * t }, 1);
      });
    }).then(function () {
      svg.style.opacity = "0";
    });
  }

  function jumpIn() {
    root.classList.add("is-enter");
    svg.style.opacity = "1";
    pose("leap");
    return phase(560, function (t) {
      place({ x: LEAP * (1 - t), y: -30 * (1 - t) - 100 * 4 * t * (1 - t), r: 20 - 42 * t }, -1);
    }).then(function () {
      pose("crouch");
      // Landung: abfedern
      return phase(300, function (t) {
        var squash = Math.sin((1 - t) * Math.PI / 2);
        place({ sx: 1 + .08 * squash, sy: 1 - .14 * squash }, -1);
      });
    }).then(function () {
      pose("side");
      return phase(260, function () { place({}, -1); });
    }).then(function () {
      return turn("front", -1);
    }).then(function () {
      svg.style.transform = "";
      root.classList.remove("is-enter", "is-exit");
    });
  }

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
    jumpOut().then(function () {
      if (samePage(url)) {
        location.hash = url.hash;
        return wait(450).then(jumpIn);
      }
      save("sessionStorage", "paul-enter", "1");
      location.href = url.href;
    });
  }

  /* ---------- Putzen: nach längerer Ruhe leckt Paul sich die Pfote (dezent, selten) ---------- */
  var LICK = 2800;              // Dauer, abgestimmt auf die CSS-Animationen „paul-lick-…“
  var LICK_STROKES = [.24, .44, .64]; // Zeitpunkte, an denen die Zunge die Pfote berührt
  var idleTimer = null;

  function scheduleLick(first) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(lick, first ? 30000 : 45000 + Math.random() * 30000);
  }

  function lick() {
    var resting = bubble.hidden && !document.hidden && catBtn.getAttribute("data-pose") === "front" &&
      !root.classList.contains("is-away") && !root.classList.contains("is-exit") && !root.classList.contains("is-enter");
    if (!resting) return scheduleLick();
    root.classList.add("is-licking");
    LICK_STROKES.forEach(function (at) { lickSound(at * LICK / 1000); });
    wait(LICK).then(function () {
      root.classList.remove("is-licking");
      scheduleLick();
    });
  }

  // Jede Beschäftigung mit Paul unterbricht das Putzen und startet die Wartezeit neu
  function stopLick() {
    root.classList.remove("is-licking");
    scheduleLick(true);
  }

  /* Leises Schlecken, im Browser erzeugt (keine Audiodatei). Erst nach der ersten Nutzer-Aktion
     möglich – Browser spielen vorher keinen Ton ab. Abschaltbar über SITE_CONFIG.paul.sound = false. */
  var audio = null, noise = null;
  function unlockAudio() {
    if (audio || (config.paul || {}).sound === false) return;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      audio = new Ctx();
      noise = audio.createBuffer(1, Math.round(audio.sampleRate * .09), audio.sampleRate);
      var data = noise.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    } catch (e) { audio = null; }
  }
  document.addEventListener("pointerdown", unlockAudio, { once: true });
  document.addEventListener("keydown", unlockAudio, { once: true });

  function lickSound(delay) {
    if (!audio || audio.state !== "running") return;
    var t = audio.currentTime + delay;
    var src = audio.createBufferSource();
    var filter = audio.createBiquadFilter();
    var gain = audio.createGain();
    src.buffer = noise;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2600, t);
    filter.frequency.linearRampToValueAtTime(3600, t + .07);
    filter.Q.value = 1.4;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(.022, t + .012);
    gain.gain.exponentialRampToValueAtTime(.0005, t + .085);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(audio.destination);
    src.start(t);
    src.stop(t + .09);
  }

  if (!reduceMotion) {
    scheduleLick(true);
    [catBtn, teaser, input].forEach(function (el) {
      el.addEventListener("pointerdown", stopLick);
      el.addEventListener("focus", stopLick);
    });
  }

  /* ---------- Freundlicher Blick: Pupillen folgen leicht dem Mauszeiger ---------- */
  var frame = null;
  document.addEventListener("mousemove", function (e) {
    if (frame || reduceMotion) return;
    frame = requestAnimationFrame(function () {
      frame = null;
      var r = catBtn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * .45);
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      var k = Math.min(1, d / 300) * 2.4;
      var move = "translate(" + (dx / d * k).toFixed(2) + " " + (dy / d * k).toFixed(2) + ")";
      pupils.forEach(function (g) { g.setAttribute("transform", move); });
    });
  });

  /* ---------- Kellerlampe: Licht für Paul vor dunklem Hintergrund ----------
     Liegt hinter Paul eine dunkle Fläche, erscheint am rechten Rand über seinem Kopf eine Glühlampe
     mit Zugkette (.is-dark). Bleibt es dunkel, zieht Paul an der Kette: Sie wackelt, die Lampe geht an
     und beleuchtet ihn, das Fell schimmert leicht (.is-lit). Wird es hell, verschwindet die Lampe – beliebig oft.
     Ein Klick auf die Lampe schaltet das Licht aus oder wieder an; „aus“ gilt für die Sitzung. */
  var LIGHT_DELAY = 1400; // so lange muss es dunkel bleiben, bevor das Licht angeht
  var lampOff = load("sessionStorage", "paul-lamp") === "off";
  var lamp = document.createElement("button");
  lamp.type = "button";
  lamp.className = "paul-lamp";
  lamp.tabIndex = -1;
  lamp.setAttribute("aria-hidden", "true");
  lamp.setAttribute("aria-label", "Licht für Paul");
  lamp.innerHTML =
    '<svg viewBox="0 0 44 130" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M18 0v44" stroke="#3a3f48" stroke-width="1.6"/>' +
    '<rect x="12" y="44" width="12" height="13" rx="2" fill="#5b616c"/>' +
    '<path d="M13 49h10M13 53h10" stroke="#3f444d" stroke-width="1"/>' +
    '<path class="paul-lamp-bulb" d="M14 57h8c0 4 7 7 7 16a11 11 0 0 1-22 0c0-9 7-12 7-16z" stroke="#9aa3ae" stroke-width="1.2"/>' +
    '<path class="paul-lamp-wire" d="M16 57v9l2 4 2-4v-9" stroke-width="1"/>' +
    '<g class="paul-lamp-chain"><path d="M24 54v52" stroke="#9aa3ae" stroke-width="1.6" stroke-dasharray="1.6 2.4"/>' +
    '<circle cx="24" cy="109" r="2.6" fill="#9aa3ae"/></g>' +
    '</svg>';
  root.insertBefore(lamp, catBtn);
  var light = document.createElement("div");
  light.className = "paul-light";
  light.setAttribute("aria-hidden", "true");
  root.insertBefore(light, catBtn);

  // Erste sichtbare Hintergrundfarbe hinter einem Punkt; Paul selbst wird übersprungen
  function backgroundAt(x, y) {
    var stack = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];
    for (var i = 0; i < stack.length; i++) {
      if (root.contains(stack[i])) continue;
      var m = getComputedStyle(stack[i]).backgroundColor.match(/[\d.]+/g);
      if (m && (m[3] === undefined || +m[3] > .5)) return m.map(Number);
    }
    return [255, 255, 255];
  }

  function isDarkBehind() {
    var r = catBtn.getBoundingClientRect();
    var c = backgroundAt(r.left + r.width / 2, r.top + r.height * .4);
    return (.2126 * c[0] + .7152 * c[1] + .0722 * c[2]) / 255 < .35;
  }

  var lightTimer = null, checkFrame = null;
  function checkLight() {
    checkFrame = null;
    var dark = !root.classList.contains("is-away") && isDarkBehind();
    if (dark === root.classList.contains("is-dark")) return;
    clearTimeout(lightTimer);
    root.classList.toggle("is-dark", dark);
    // Nur sichtbar bedienbar: bei hellem Hintergrund nicht fokussierbar und für Screenreader verborgen
    lamp.tabIndex = dark ? 0 : -1;
    lamp.setAttribute("aria-hidden", dark ? "false" : "true");
    if (!dark) { root.classList.remove("is-lit", "is-pulling"); return; }
    setLamp(false);
    if (!lampOff) lightTimer = setTimeout(function () { switchLamp(true); }, reduceMotion ? 0 : LIGHT_DELAY);
  }

  function setLamp(on) {
    root.classList.toggle("is-lit", on);
    lamp.setAttribute("aria-pressed", on ? "true" : "false");
  }
  // Licht schalten wie mit der Zugkette: Kette wackelt, dann an oder aus
  function switchLamp(on) {
    setLamp(on);
    if (!reduceMotion) play("is-pulling", 1200);
  }
  lamp.addEventListener("click", function () {
    if (!root.classList.contains("is-dark")) return;
    clearTimeout(lightTimer);
    var on = !root.classList.contains("is-lit");
    lampOff = !on;
    save("sessionStorage", "paul-lamp", on ? null : "off");
    switchLamp(on);
  });
  function scheduleLight() {
    if (!checkFrame) checkFrame = requestAnimationFrame(checkLight);
  }
  window.addEventListener("scroll", scheduleLight, { passive: true });
  window.addEventListener("resize", scheduleLight);
  setInterval(checkLight, 1000); // auch ohne Scrollen, z. B. nach Wegklicken oder geöffneten Bereichen
  setTimeout(scheduleLight, 600);

  /* ---------- Start ---------- */
  if (load("localStorage", "paul-away") === "1") {
    root.classList.add("is-away");
    pose("peek");
    catBtn.setAttribute("aria-label", "Paul wieder aufrufen");
  } else if (load("sessionStorage", "paul-enter") === "1" && !reduceMotion) {
    svg.style.opacity = "0";
    setTimeout(jumpIn, 250);
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
