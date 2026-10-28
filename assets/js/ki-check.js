(function () {
  "use strict";

  /* ---------- Unternehmens-KI-Check: sechs Fragen im Dialog, Ergebnis Newbie / Basic / Expert ----------
     Inhalte unten anpassen. „score“ (0–3) fließt in die Einstufung ein; ohne „score“ zählt eine
     Antwort neutral. „tip“ ergänzt die Empfehlung. Speicherung nur in der Sitzung (sessionStorage). */
  var CHECK = {
    title: "KI im Unternehmen. Aber womit anfangen?",
    intro: "Finden Sie in etwa zwei Minuten heraus, wo Künstliche Intelligenz Ihren Arbeitsalltag erleichtern könnte und was Ihr Team dafür braucht.",
    rules: [
      "Sechs kurze Fragen",
      "Pro Frage sind bis zu zwei Antworten möglich.",
      "Alle Antworten sind freiwillig – Sie können jede Frage überspringen.",
      "Es gibt keine richtigen oder falschen Antworten.",
    ],
    maxAnswers: 2,
    questions: [
      {
        q: "Wie wird KI heute in Ihrem Unternehmen genutzt?",
        options: [
          { label: "Noch gar nicht – wir stehen am Anfang.", score: 0 },
          { label: "Einzelne Mitarbeitende probieren KI bereits aus.", score: 1 },
          { label: "KI wird regelmäßig für bestimmte Aufgaben eingesetzt.", score: 2 },
          { label: "Wir nutzen KI bereits gezielt in mehreren Arbeitsabläufen.", score: 3 },
          { label: "Ich weiß nicht genau, wie KI bei uns genutzt wird." },
        ],
      },
      {
        q: "Wo würde eine Erleichterung Ihrer täglichen Arbeit am meisten helfen?",
        options: [
          { label: "Routineaufgaben, E-Mails und Dokumente", tip: "Routineaufgaben, E-Mails und Dokumente sind ein guter Startpunkt – hier entlastet KI oft schon nach kurzer Zeit." },
          { label: "Informationen suchen, ordnen und verfügbar machen", tip: "Für das Suchen und Ordnen von Informationen lohnt sich ein Blick auf eine gepflegte Wissensbasis." },
          { label: "Kundenkommunikation, Vertrieb und Marketing", tip: "In Kundenkommunikation und Vertrieb unterstützt KI beim Entwerfen – die Freigabe bleibt beim Menschen." },
          { label: "Planung, Organisation und interne Abläufe", tip: "Bei Planung und internen Abläufen hilft es, zuerst einen Ablauf genau zu beschreiben und dann gezielt zu entlasten." },
          { label: "Daten auswerten und Entscheidungen vorbereiten", tip: "Beim Auswerten von Daten bereitet KI Entscheidungen vor – Prüfung und Verantwortung bleiben im Team." },
          { label: "Wir wissen noch nicht, wo KI sinnvoll wäre.", tip: "Ein kurzer Blick auf Ihre wiederkehrenden Aufgaben zeigt meist schnell, wo KI sinnvoll ist." },
        ],
      },
      {
        q: "Wie sicher fühlen sich Ihre Mitarbeitenden im Umgang mit KI?",
        options: [
          { label: "Die meisten haben kaum Erfahrung.", score: 0 },
          { label: "Einige sind neugierig, andere eher skeptisch.", score: 1 },
          { label: "Einzelne nutzen KI bereits sicher.", score: 2 },
          { label: "Unser Team verfügt über grundlegende KI-Kenntnisse.", score: 3 },
          { label: "Das kann ich nicht einschätzen." },
        ],
      },
      {
        q: "Was hält Ihr Unternehmen bislang am stärksten davon ab, KI einzusetzen?",
        options: [
          { label: "Uns fehlt das Wissen, wie wir beginnen sollen.", score: 0, tip: "Ein kompakter Einstieg schafft Orientierung, bevor Werkzeuge ausgewählt werden." },
          { label: "Datenschutz, Sicherheit oder rechtliche Fragen sind unklar.", tip: "Klären Sie früh, welche Daten in welche Werkzeuge dürfen – das schafft Sicherheit im Team." },
          { label: "Wir erkennen noch keinen konkreten Nutzen.", tip: "Ein konkreter Anwendungsfall aus Ihrem Alltag macht den Nutzen sichtbar." },
          { label: "Im Tagesgeschäft fehlen Zeit und Kapazitäten.", tip: "Klein starten: eine Aufgabe, ein Team, wenige Wochen." },
          { label: "Uns fehlt Orientierung bei Werkzeugen und Kosten.", tip: "Der KI-Kompass auf dieser Website gibt einen ersten Überblick über Modelle und Betriebsformen." },
          { label: "Eigentlich hält uns nichts zurück.", score: 3 },
        ],
      },
      {
        q: "Gibt es bereits gemeinsame Regeln für den Einsatz von KI?",
        options: [
          { label: "Nein, bisher gibt es keine Regeln.", score: 0, tip: "Gemeinsame Regeln – welche Werkzeuge, welche Daten, wer prüft – sollten früh festgelegt werden." },
          { label: "Wir haben darüber gesprochen, aber noch nichts festgelegt.", score: 1, tip: "Halten Sie die besprochenen Punkte als einfache, verbindliche Regeln fest." },
          { label: "Es gibt erste Vorgaben, z. B. zum Datenschutz.", score: 2 },
          { label: "Es gibt verbindliche Regeln und klare Verantwortlichkeiten.", score: 3 },
          { label: "Das ist mir nicht bekannt." },
        ],
      },
      {
        q: "Was wäre für Ihr Unternehmen jetzt der hilfreichste nächste Schritt?",
        options: [
          { label: "Zunächst verstehen, was KI kann und was nicht.", score: 0, offer: "ki-start" },
          { label: "Unser Team an praktischen Beispielen mit KI vertraut machen.", score: 1, offer: "mitarbeiter" },
          { label: "Konkrete Einsatzmöglichkeiten im Unternehmen finden.", score: 1, offer: "ki-start" },
          { label: "Einen Anwendungsfall gemeinsam ausprobieren.", score: 2, offer: "ki-start" },
          { label: "KI-Regeln, Datenschutz und Verantwortlichkeiten klären.", score: 2, offer: "ki-start" },
          { label: "Wir möchten uns zunächst unverbindlich orientieren.", offer: "ki-start" },
        ],
      },
    ],
    // Einstufung nach dem Mittelwert aller bewerteten Antworten (0–3); ohne Angaben: Basic
    levels: [
      { id: "Newbie", below: 1, text: "Ihr Unternehmen steht am Anfang. Ein gemeinsames Grundverständnis von KI ist jetzt der passende erste Schritt." },
      { id: "Basic", below: 2, text: "Erste Erfahrungen sind vorhanden. Jetzt lohnt es sich, Einsatzfelder und Regeln gemeinsam festzulegen." },
      { id: "Expert", below: Infinity, text: "KI ist bei Ihnen im Einsatz. Als Nächstes geht es darum, Anwendungen zu vertiefen und Verantwortung klar zu regeln." },
    ],
    offers: {
      "ki-start": { label: "KI Einstieg für Unternehmen", url: "#ki-start" },
      "mitarbeiter": { label: "KI Einstieg für Mitarbeiter", url: "#mitarbeiter" },
    },
    closing: {
      title: "Ihre erste KI-Orientierung",
      text: "Vielen Dank für Ihre Antworten. Ihre Auswahl bietet eine erste Orientierung zu möglichen Einsatzfeldern, Herausforderungen und nächsten Schritten beim Einsatz von KI in Ihrem Unternehmen.",
      claim: "KI beginnt nicht mit der Technologie, sondern mit den Menschen und ihren Aufgaben.",
      question: "Möchten Sie erfahren, welche Möglichkeiten sich daraus für Ihr Unternehmen ergeben?",
    },
  };

  var STORE = "ki-check";
  var dialog = document.getElementById("ki-check");
  if (!dialog || typeof dialog.showModal !== "function") {
    document.querySelectorAll("[data-open-check]").forEach(function (b) { b.hidden = true; });
    return;
  }
  var stage = dialog.querySelector(".check-stage");
  var bar = dialog.querySelector(".check-progress span");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var answers = [];
  var current = -1;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function load() {
    try { return JSON.parse(sessionStorage.getItem(STORE) || "null"); } catch (e) { return null; }
  }
  function save(data) {
    try { sessionStorage.setItem(STORE, JSON.stringify(data)); } catch (e) { /* ohne Speicher weiter */ }
  }

  /* ---------- Auswertung ---------- */
  function evaluate() {
    var scores = [], tips = [], offer = null;
    CHECK.questions.forEach(function (q, qi) {
      (answers[qi] || []).forEach(function (oi) {
        var o = q.options[oi];
        if (typeof o.score === "number") scores.push(o.score);
        if (o.tip && tips.indexOf(o.tip) === -1) tips.push(o.tip);
        if (o.offer && !offer) offer = o.offer;
      });
    });
    var avg = scores.length ? scores.reduce(function (a, b) { return a + b; }, 0) / scores.length : 1.5;
    var level = CHECK.levels.filter(function (l) { return avg < l.below; })[0];
    // Höchstens drei Hinweise; das Angebot folgt aus dem gewünschten nächsten Schritt
    return { level: level.id, status: level.text, tips: tips.slice(0, 3), offer: CHECK.offers[offer || "ki-start"] };
  }

  // Lesbare Zusammenfassung für das Kontaktformular
  function summary(result) {
    var lines = ["Ergebnis: " + result.level + " – " + result.status];
    if (result.tips.length) {
      lines.push("", "Empfehlung:");
      result.tips.forEach(function (t) { lines.push("- " + t); });
    }
    lines.push("", "Antworten:");
    CHECK.questions.forEach(function (q, qi) {
      var picked = (answers[qi] || []).map(function (oi) { return q.options[oi].label; });
      lines.push((qi + 1) + ". " + q.q + " " + (picked.length ? picked.join(" / ") : "(keine Angabe)"));
    });
    return lines.join("\n");
  }

  /* ---------- Darstellung ---------- */
  function swap(html) {
    function render() {
      stage.innerHTML = html;
      stage.classList.remove("is-leaving");
      var h = stage.querySelector("h2, h3");
      if (h) h.focus({ preventScroll: true });
    }
    if (reduceMotion || !stage.firstChild) return render();
    stage.classList.add("is-leaving");
    setTimeout(render, 180);
  }

  function progress(step) {
    bar.style.width = Math.max(0, Math.min(1, step / CHECK.questions.length)) * 100 + "%";
  }

  function showIntro() {
    current = -1;
    progress(0);
    swap(
      '<div class="check-step">' +
      '<p class="kicker">Unternehmens-KI-Check</p>' +
      '<h2 id="check-title" tabindex="-1">' + esc(CHECK.title) + '</h2>' +
      '<p class="check-lead">' + esc(CHECK.intro) + '</p>' +
      '<p class="check-how"><strong>So funktioniert es:</strong></p>' +
      '<ul class="check-rules">' + CHECK.rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join("") + '</ul>' +
      '<div class="check-nav"><span></span><button type="button" class="btn btn-check" data-go="0">Check starten</button></div>' +
      '</div>'
    );
  }

  function showQuestion(qi) {
    current = qi;
    progress(qi);
    var q = CHECK.questions[qi];
    var picked = answers[qi] || [];
    var full = picked.length >= CHECK.maxAnswers;
    var last = qi === CHECK.questions.length - 1;
    swap(
      '<div class="check-step">' +
      '<p class="check-count">Frage ' + (qi + 1) + ' von ' + CHECK.questions.length + '</p>' +
      '<h3 id="check-title" tabindex="-1">' + esc(q.q) + '</h3>' +
      '<p class="check-hint" id="check-hint">Bis zu zwei Antworten möglich.</p>' +
      '<fieldset class="check-options" aria-describedby="check-hint"><legend class="visually-hidden">' + esc(q.q) + '</legend>' +
      q.options.map(function (o, oi) {
        var on = picked.indexOf(oi) !== -1;
        return '<label class="check-option' + (on ? " is-on" : "") + '" style="--i:' + oi + '">' +
          '<input type="checkbox" value="' + oi + '"' + (on ? " checked" : "") + (!on && full ? " disabled" : "") + '>' +
          '<span>' + esc(o.label) + '</span></label>';
      }).join("") +
      '</fieldset>' +
      '<div class="check-nav">' +
      '<button type="button" class="link-btn" data-go="' + (qi - 1) + '">← Zurück</button>' +
      '<span class="check-nav-right">' +
      '<button type="button" class="link-btn check-skip" data-skip="' + qi + '">Überspringen</button>' +
      '<button type="button" class="btn btn-check" data-go="' + (last ? "done" : qi + 1) + '">' + (last ? "Abschließen" : "Weiter") + '</button>' +
      '</span></div>' +
      '</div>'
    );
  }

  function showClosing() {
    current = CHECK.questions.length;
    progress(CHECK.questions.length);
    var c = CHECK.closing;
    swap(
      '<div class="check-step">' +
      '<p class="kicker">Abschluss</p>' +
      '<h2 id="check-title" tabindex="-1">' + esc(c.title) + '</h2>' +
      '<p class="check-lead">' + esc(c.text) + '</p>' +
      '<p class="check-claim">' + esc(c.claim) + '</p>' +
      '<p>' + esc(c.question) + '</p>' +
      '<div class="check-actions">' +
      '<button type="button" class="btn btn-check" data-go="result">Ergebnisse ansehen</button>' +
      '<button type="button" class="btn btn-secondary" data-contact>Anfragen</button>' +
      '</div></div>'
    );
  }

  function showResult() {
    var r = evaluate();
    swap(
      '<div class="check-step check-result">' +
      '<p class="kicker">Ihr Ergebnis</p>' +
      '<h2 id="check-title" tabindex="-1" class="check-level check-level-' + r.level.toLowerCase() + '">' + esc(r.level) + '</h2>' +
      '<p class="check-status">' + esc(r.status) + '</p>' +
      (r.tips.length ? '<h3 class="check-sub">Empfehlung</h3><ul class="check-tips">' +
        r.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul>' : '') +
      '<p class="check-offer">Passendes Angebot: <a href="' + r.offer.url + '" data-close>' + esc(r.offer.label) + '</a></p>' +
      '<p class="check-note">Ihr Ergebnis bleibt nur in diesem Browser-Tab gespeichert. Bei einer Anfrage können Sie es mitsenden.</p>' +
      '<div class="check-actions">' +
      '<button type="button" class="btn btn-check" data-contact>Anfragen</button>' +
      '<button type="button" class="link-btn" data-go="restart">Check wiederholen</button>' +
      '</div></div>'
    );
  }

  function finish() {
    var r = evaluate();
    save({ answers: answers, level: r.level, summary: summary(r) });
    document.dispatchEvent(new CustomEvent("kicheck:done"));
  }

  /* ---------- Bedienung ---------- */
  stage.addEventListener("change", function (e) {
    if (e.target.type !== "checkbox") return;
    var picked = [];
    stage.querySelectorAll(".check-options input").forEach(function (box) {
      if (box.checked) picked.push(Number(box.value));
      box.closest(".check-option").classList.toggle("is-on", box.checked);
    });
    answers[current] = picked;
    var full = picked.length >= CHECK.maxAnswers;
    stage.querySelectorAll(".check-options input").forEach(function (box) {
      box.disabled = !box.checked && full;
    });
  });

  stage.addEventListener("click", function (e) {
    var go = e.target.closest("[data-go]");
    var to = go ? go.getAttribute("data-go") : null;
    // Überspringen: Antworten dieser Frage verwerfen und weiter
    if (e.target.closest("[data-skip]")) {
      answers[current] = [];
      to = current + 1 < CHECK.questions.length ? String(current + 1) : "done";
    }
    if (to !== null) {
      if (to === "done") { finish(); return showClosing(); }
      if (to === "result") return showResult();
      if (to === "restart") { answers = []; return showQuestion(0); }
      var n = Number(to);
      return n < 0 ? showIntro() : showQuestion(n);
    }
    if (e.target.closest("[data-contact]")) {
      finish();
      dialog.close();
      var topic = document.getElementById("f-topic");
      if (topic) {
        topic.value = "ki-start";
        topic.dispatchEvent(new Event("change", { bubbles: true }));
      }
      location.hash = "kontakt";
      return;
    }
    if (e.target.closest("[data-close]")) dialog.close();
  });

  dialog.querySelector(".check-close").addEventListener("click", function () { dialog.close(); });
  // Klick auf den abgedunkelten Hintergrund schließt den Dialog
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });

  document.querySelectorAll("[data-open-check]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var stored = load();
      answers = stored && stored.answers ? stored.answers : [];
      stage.innerHTML = "";
      dialog.showModal();
      if (stored) showResult(); else showIntro();
    });
  });
})();
