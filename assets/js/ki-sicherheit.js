(function () {
  "use strict";

  /* ---------- KI-Sicherheitscheck: drei Fälle im Dialog, Auswertung erst am Ende ----------
     Fälle in assets/data/sicherheitsfragen.js. Je Durchgang drei Themen mit je einem noch nicht
     gesehenen Fall; Themen, die seltener dran waren, zuerst. In der Sitzung (sessionStorage
     „ki-sicherheit“) stehen nur die gesehenen Fälle und die Themenzählung, keine Antworten.
     Alle Texte werden per textContent eingesetzt, kein innerHTML. */
  var DATA = window.SICHERHEITSFRAGEN;
  var dialog = document.getElementById("sc-dialog");
  var openers = document.querySelectorAll("[data-open-sicherheit]");
  if (!DATA || !dialog || typeof dialog.showModal !== "function") {
    openers.forEach(function (b) { b.hidden = true; });
    return;
  }

  var TOPICS = Object.keys(DATA.topics);
  var START_TOPICS = ["injection", "daten", "taeuschung", "falsch", "verantwortung"];
  var PER_ROUND = 3;
  var LETTERS = ["A", "B", "C"];
  var CONTACT = "index.html#kontakt";
  var STORE = "ki-sicherheit";

  var stage = dialog.querySelector(".check-stage");
  var bar = dialog.querySelector(".check-progress span");

  var stored = load() || {};
  var seen = stored.seen || [];
  var topicCount = stored.count || {};
  var round = null;

  function load() {
    try { return JSON.parse(sessionStorage.getItem(STORE) || "null"); } catch (e) { return null; }
  }
  function save() {
    try { sessionStorage.setItem(STORE, JSON.stringify({ seen: seen, count: topicCount })); } catch (e) { /* ohne Speicher weiter */ }
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else if (key === "className") node.className = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) {
      if (child) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function unseen(topic) {
    return DATA.questions.filter(function (q) { return q.topic === topic && seen.indexOf(q.id) === -1; });
  }
  function bestIndex(q) {
    for (var i = 0; i < q.options.length; i++) if (q.options[i].best) return i;
    return -1;
  }

  // Neuer Durchgang: seltenste Themen zuerst, je Thema ein noch nicht gesehener Fall
  function newRound() {
    var open = TOPICS.filter(function (t) { return unseen(t).length; });
    if (open.length < PER_ROUND) { seen = []; open = TOPICS.slice(); }
    var picked = shuffle(open).sort(function (a, b) { return (topicCount[a] || 0) - (topicCount[b] || 0); }).slice(0, PER_ROUND);
    round = {
      index: 0,
      answers: [],
      items: shuffle(picked).map(function (t) {
        var q = shuffle(unseen(t))[0];
        seen.push(q.id);
        topicCount[t] = (topicCount[t] || 0) + 1;
        return { q: q, order: shuffle([0, 1, 2]) };
      }),
    };
    save();
  }

  function setBar(done) { bar.style.width = (done / PER_ROUND * 100) + "%"; }

  // Einstieg: Themen als gerahmte Begriffe (Überschrift), Einleitung, dann der Test
  function renderStart() {
    stage.textContent = "";
    setBar(0);
    var go = el("button", { className: "btn btn-primary", type: "button", text: "Check starten" });
    go.addEventListener("click", function () { newRound(); renderCase(); });
    stage.appendChild(el("div", { className: "check-step" }, [
      el("p", { className: "kicker", text: "KI-Sicherheitscheck" }),
      el("h2", { className: "sc-topic-head", id: "sc-title", tabindex: "-1" }, [
        el("span", { className: "visually-hidden", text: "Themen: " }),
        el("span", { className: "sc-topic-chips" }, START_TOPICS.map(function (t) {
          return el("span", { className: "sc-topic-chip", text: DATA.topics[t] });
        })),
      ]),
      el("p", { className: "check-lead" }, [
        el("strong", { text: "Wie sicher nutzen Sie KI im Arbeitsalltag? " }),
        "Nicht jede Nachricht ist echt, nicht jedes Ergebnis richtig und nicht jede Information gehört in ein KI-System. Wie reagieren Sie in drei Fällen?",
      ]),
      el("p", { className: "sc-facts", text: "3 Fälle · ca. 2 Minuten · Auswertung am Ende · nichts wird gespeichert" }),
      el("p", { className: "check-note", text: "Lernübung, keine technische Sicherheitsprüfung. Alle Beispiele sind erfunden." }),
      el("div", { className: "check-actions" }, [go]),
    ]));
    focusHeading();
  }

  // Fall zeigen – ohne Rückmeldung; bewertet wird erst am Ende
  function renderCase() {
    var item = round.items[round.index];
    var q = item.q;
    var last = round.index === PER_ROUND - 1;
    stage.textContent = "";
    setBar(round.index);

    var options = el("fieldset", { className: "check-options", "aria-labelledby": "sc-q" });
    item.order.forEach(function (orig, pos) {
      options.appendChild(el("label", { className: "check-option", "for": "sc-o" + pos, style: "--i:" + pos }, [
        el("input", { type: "radio", name: "sc-answer", value: String(pos), id: "sc-o" + pos }),
        el("span", { text: LETTERS[pos] + ") " + q.options[orig].label }),
      ]));
    });

    var error = el("p", { className: "sc-error", "aria-live": "polite" });
    var next = el("button", { className: "btn btn-primary", type: "button", text: last ? "Auswertung" : "Weiter" });
    next.addEventListener("click", function () {
      var chosen = options.querySelector("input:checked");
      if (!chosen) { error.textContent = "Bitte wählen Sie eine Antwort."; return; }
      // Antwort wird einmal festgehalten und ist danach nicht mehr änderbar
      if (round.answers.length === round.index) round.answers.push(Number(chosen.value));
      if (last) renderResult();
      else { round.index++; renderCase(); }
    });

    stage.appendChild(el("div", { className: "check-step" }, [
      el("p", { className: "check-count", text: "Fall " + (round.index + 1) + " von " + PER_ROUND + " · " + DATA.topics[q.topic] }),
      el("p", { className: "sc-scenario", text: q.scenario }),
      el("h3", { className: "sc-q", id: "sc-q", tabindex: "-1", text: q.q }),
      options, error,
      el("div", { className: "check-nav" }, [el("span"), next]),
    ]));
    focusHeading();
  }

  // Ring aus drei Teilen: grün = Empfehlung getroffen, ocker = abweichend
  function donut(oks) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("class", "sc-donut");
    svg.setAttribute("aria-hidden", "true");
    var r = 40, c = 2 * Math.PI * r, gap = 4, seg = c / oks.length;
    oks.forEach(function (ok, i) {
      var circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", "50"); circle.setAttribute("cy", "50"); circle.setAttribute("r", String(r));
      circle.setAttribute("fill", "none"); circle.setAttribute("stroke-width", "12");
      circle.setAttribute("stroke", ok ? "#2f725d" : "#e3c48a");
      circle.setAttribute("stroke-dasharray", (seg - gap) + " " + (c - seg + gap));
      circle.setAttribute("stroke-dashoffset", String(-i * seg + c / 4));
      svg.appendChild(circle);
    });
    var text = document.createElementNS(ns, "text");
    text.setAttribute("x", "50"); text.setAttribute("y", "58"); text.setAttribute("text-anchor", "middle");
    text.textContent = oks.filter(Boolean).length + "/" + oks.length;
    svg.appendChild(text);
    return svg;
  }

  // Auswertung: je Fall Regel zuerst, dann Ihre Antwort, bei Abweichung die Empfehlung; Erklärung aufklappbar
  function renderResult() {
    stage.textContent = "";
    setBar(PER_ROUND);
    var oks = round.items.map(function (item, i) { return item.order[round.answers[i]] === bestIndex(item.q); });
    var hits = oks.filter(Boolean).length;

    var cases = el("ol", { className: "sc-cases" });
    round.items.forEach(function (item, i) {
      var q = item.q;
      var pos = round.answers[i];
      var chosen = q.options[item.order[pos]];
      var best = bestIndex(q);
      var body = el("div", {}, [
        el("p", { className: "sc-case-topic", text: "Fall " + (i + 1) + " · " + DATA.topics[q.topic] }),
        el("p", { className: "sc-case-rule", text: q.rule }),
      ]);
      if (oks[i]) {
        body.appendChild(el("p", { className: "sc-case-line is-best" }, [el("b", { text: "Ihre Antwort " + LETTERS[pos] + " ist die empfohlene: " }), chosen.label]));
      } else {
        body.appendChild(el("p", { className: "sc-case-line" }, [el("b", { text: "Ihre Antwort " + LETTERS[pos] + ": " }), chosen.label + " " + chosen.why]));
        body.appendChild(el("p", { className: "sc-case-line is-best" }, [el("b", { text: "Empfohlen ist Antwort " + LETTERS[item.order.indexOf(best)] + ": " }), q.options[best].label]));
      }
      body.appendChild(el("details", {}, [
        el("summary", { text: "Warum?" }),
        el("p", { text: q.explain }),
        el("p", { className: "sc-meta" }, [
          el("strong", { text: q.kind }), " · Quelle: ",
          el("a", { href: q.source.url, target: "_blank", rel: "noopener noreferrer", text: q.source.label }),
        ]),
      ]));
      cases.appendChild(el("li", { className: "sc-case" + (oks[i] ? "" : " is-miss") }, [
        el("span", { className: "sc-mark", "aria-hidden": "true", text: oks[i] ? "✓" : "!" }),
        body,
      ]));
    });

    var again = el("button", { className: "link-btn", type: "button", text: "Nochmal? Drei neue Fälle" });
    again.addEventListener("click", function () { newRound(); renderCase(); });

    stage.appendChild(el("div", { className: "check-step" }, [
      el("div", { className: "sc-result-head" }, [
        donut(oks),
        el("div", {}, [
          el("p", { className: "check-count", text: "Ihre Auswertung" }),
          el("h2", { id: "sc-title", tabindex: "-1", text: hits + " von " + PER_ROUND + " Empfehlungen getroffen" }),
          el("p", { text: hits === PER_ROUND ? "Ihre Regeln zum Mitnehmen:" : "Regeln und Richtigstellung je Fall:" }),
        ]),
      ]),
      cases,
      el("div", { className: "sc-result-actions" }, [
        el("a", { className: "btn btn-primary", href: CONTACT, text: "Kontakt" }),
        again,
      ]),
      el("p", { className: "sc-disclaimer", text: "Lernhilfe – kein Zertifikat und kein Nachweis über KI-Kompetenz. Keine Rechtsberatung. Ihre Antworten werden nicht übertragen." }),
    ]));
    focusHeading();
  }

  function focusHeading() {
    var h = stage.querySelector("h2, h3");
    if (h) h.focus();
  }

  // Angefangener Durchgang geht beim nächsten offenen Fall weiter, nichts wird doppelt gewertet
  function open() {
    if (!round) renderStart();
    else if (round.answers.length === PER_ROUND) renderResult();
    else { round.index = round.answers.length; renderCase(); }
    dialog.showModal();
    // showModal setzt den Fokus aufs Schließen-Kreuz – zurück auf die Überschrift
    focusHeading();
  }

  openers.forEach(function (b) { b.addEventListener("click", open); });
  dialog.querySelector(".check-close").addEventListener("click", function () { dialog.close(); });
  // Klick auf den abgedunkelten Hintergrund schließt den Dialog
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });
  // Textblase am Button: Esc blendet sie aus, bis Maus oder Fokus den Button verlassen (WCAG 1.4.13)
  document.querySelectorAll(".sec-tip").forEach(function (tip) {
    tip.addEventListener("keydown", function (e) { if (e.key === "Escape") tip.classList.add("is-dismissed"); });
    ["mouseleave", "focusout"].forEach(function (ev) {
      tip.addEventListener(ev, function () { tip.classList.remove("is-dismissed"); });
    });
  });

  window.KiSicherheit = { open: open };
})();
