(function () {
  "use strict";

  /* ---------- KI-Kompass · Infrastruktur: Fragen-Assistent nach dem Golden Circle ---------- */
  var root = document.getElementById("infra-wizard");
  if (!root) return;

  // Architekturen. Reihenfolge = Vorrang bei Gleichstand (einfachere Lösung zuerst).
  var ARCH = [
    {
      id: "saas", name: "SaaS", full: "Software as a Service",
      short: "Fertige KI-Anwendung aus der Cloud, z. B. ein Chat-Assistent mit Unternehmenslizenz.",
      runs: "Der Anbieter betreibt Anwendung, Modell und Infrastruktur. Ihr Team nutzt die fertige Oberfläche.",
      fit: "Schneller Einstieg, Texte, E-Mails, Recherche und risikoarme Anwendungsfälle.",
      risk: "Der Datenfluss hängt vom Anbieter ab. Freigaben, Datenregeln und Verträge müssen vorab geklärt sein.",
    },
    {
      id: "paas", name: "PaaS / Model-as-a-Service", full: "Plattform mit bereitgestellten Modellen",
      short: "Ihre eigene Anwendung nutzt Modelle und KI-Dienste, die ein Cloud-Anbieter bereitstellt und wartet.",
      runs: "Eigene Anwendung nutzt verwaltete Modelle und KI-Dienste.",
      fit: "Individuelle Assistenten, APIs, eigene Oberflächen, RAG und Workflows.",
      risk: "Fehlende Architektur für Identitäten, Kosten, Limits, Logging und Evaluation.",
    },
    {
      id: "rag", name: "Managed RAG / Agent Platform", full: "Plattform für Wissens-Assistenten und Agenten",
      short: "Eine Plattform verbindet KI mit Ihren Dokumenten: Vor jeder Antwort sucht sie die passenden Stellen heraus (RAG).",
      runs: "Die Plattform verwaltet Teile von Datenaufnahme, Retrieval, Agenten und Evaluation.",
      fit: "Unternehmenswissen, Copiloten, dokumentenbasierte Prozesse und Agenten.",
      risk: "Falsches Vertrauen in die Automatik. Berechtigungen und Datenqualität bleiben eigene Verantwortung.",
    },
    {
      id: "iaas", name: "IaaS / Self-hosted", full: "Infrastructure as a Service",
      short: "Sie mieten Rechenleistung und betreiben Modelle selbst (Self-hosted) – auch offene Modelle in eigener Konfiguration.",
      runs: "Virtuelle Rechenleistung, Speicher und Netzwerke. Modell- und Laufzeitbetrieb liegen weitgehend bei Ihnen.",
      fit: "Self-hosted Modelle, spezielle Laufzeiten, eigene Netzwerk- und Betriebsanforderungen.",
      risk: "Hoher Betriebsaufwand für Patching, Skalierung, GPU-Kapazität, Sicherheit und Modellbetrieb.",
    },
    {
      id: "private", name: "Private Cloud / On-Prem / Hybrid", full: "Eigene oder besonders kontrollierte Umgebung",
      short: "Ein Teil der Lösung läuft im eigenen Rechenzentrum oder einer abgeschotteten Cloud; Cloud-Dienste werden gezielt ergänzt.",
      runs: "Ein Teil der Lösung bleibt in eigener oder besonders kontrollierter Umgebung. Cloud-Dienste werden gezielt ergänzt.",
      fit: "Hohe Souveränität, bestehende Systeme, spezielle Latenz, regulatorische oder Offline-Anforderungen.",
      risk: "Komplexe Verantwortungs- und Integrationsgrenzen. Datenflüsse und Fallbacks müssen explizit gestaltet werden.",
    },
  ];

  // Entscheidungsmatrix (Zeilen = Kriterien, Werte in ARCH-Reihenfolge)
  var MATRIX = [
    { label: "Startgeschwindigkeit", values: ["hoch", "mittel", "mittel", "gering", "gering"] },
    { label: "Integrationsfähigkeit", values: ["begrenzt bis mittel", "hoch", "hoch für Wissensquellen", "hoch, aber aufwendig", "hoch, auch für Bestandssysteme"] },
    { label: "Kontrolle über Datenfluss", values: ["anbieterabhängig", "gut steuerbar", "gut steuerbar", "maximal steuerbar", "maximal steuerbar"] },
    { label: "Technische Verantwortung", values: ["gering", "geteilt", "geteilt", "hoch", "hoch"] },
    { label: "Typischer Startpunkt", values: ["risikoarmer Anwendungsfall", "Unternehmenspilot", "Wissens-Assistent", "besondere Anforderungen", "regulierte oder souveräne Umgebung"] },
  ];

  // Datenampel – „Wohin dürfen Daten?“
  var AMPEL = {
    gruen: {
      label: "Grün", data: "Öffentlich, synthetisch oder nicht sensibel",
      env: "SaaS oder freigegebene Standardanwendung",
      min: "Quellencheck, keine vertraulichen Inhalte, Ergebnis als Entwurf behandeln",
    },
    gelb: {
      label: "Gelb", data: "Intern, personenbezogen oder geschäftlich sensibel",
      env: "Enterprise-SaaS oder PaaS mit Berechtigungen",
      min: "Datenklassifizierung, Rollenrechte, Logging, Review, Versionierung, Kostenlimit",
    },
    rot: {
      label: "Rot", data: "Hochsensibel, reguliert oder entscheidungskritisch",
      env: "Geschützte Umgebung, abgestimmte Plattform, ggf. Self-hosted",
      min: "Freigabe, Datenschutzprüfung, DSFA falls erforderlich, Least Privilege, Audit, menschliche Entscheidung",
    },
  };

  var PHASES = [
    { id: "warum", label: "Warum", sub: "Ziel und Daten" },
    { id: "wie", label: "Wie", sub: "Betrieb und Verantwortung" },
    { id: "was", label: "Was", sub: "Die Lösung" },
  ];

  // Fragen. „pts“ vergibt Punkte je Architektur; „ampel“/„qa“ steuern die Hinweise im Ergebnis.
  var QUESTIONS = [
    {
      phase: "warum", criterion: "Typischer Startpunkt",
      q: "Warum möchten Sie KI einsetzen?",
      hint: "Wählen Sie das Ziel, das für den Start am wichtigsten ist.",
      options: [
        { label: "Einen risikoarmen Anwendungsfall schnell ausprobieren", pts: { saas: 3 } },
        { label: "Einen Pilot mit eigenen Abläufen im Unternehmen aufbauen", pts: { paas: 3, rag: 1 } },
        { label: "Unternehmenswissen und Dokumente nutzbar machen", pts: { rag: 3, paas: 1 } },
        { label: "Besondere Anforderungen erfüllen", sub: "z. B. Regulierung, Souveränität oder Betrieb ohne Internet", pts: { private: 3, iaas: 2 } },
      ],
    },
    {
      phase: "warum", criterion: "Datenampel",
      q: "Welche Daten sollen verarbeitet werden?",
      hint: "Die Daten entscheiden, wohin sie dürfen.",
      options: [
        { label: "Öffentlich, synthetisch oder nicht sensibel", sub: "z. B. Webtexte, Musterdaten, allgemeine Fragen", ampel: "gruen", pts: { saas: 3, paas: 1, rag: 1 } },
        { label: "Intern, personenbezogen oder geschäftlich sensibel", sub: "z. B. Kundendaten, Angebote, interne Unterlagen", ampel: "gelb", pts: { saas: 1, paas: 3, rag: 3, private: 1 } },
        { label: "Hochsensibel, reguliert oder entscheidungskritisch", sub: "z. B. Gesundheitsdaten, Personalakten, Geschäftsgeheimnisse", ampel: "rot", pts: { private: 3, iaas: 3, paas: 1 }, exclude: ["saas"] },
      ],
    },
    {
      phase: "warum", criterion: "Prüfung des Ergebnisses",
      q: "Was steht auf dem Spiel, wenn ein Ergebnis falsch ist?",
      hint: "Daraus ergibt sich, welche Prüfung die Ergebnisse brauchen.",
      options: [
        { label: "Wenig – Ergebnisse sind Entwürfe", qa: "Stichprobe genügt; Ergebnisse bleiben Entwürfe, bis ein Mensch sie freigibt.", pts: { saas: 2, rag: 1 } },
        { label: "Spürbar – Ergebnisse gehen an Kunden oder fließen in Entscheidungen", qa: "Vier-Augen-Prinzip und dokumentierte Prüfung vor der Weitergabe.", pts: { paas: 2, rag: 2 } },
        { label: "Viel – Ergebnisse sind entscheidungskritisch oder rechtlich relevant", qa: "Fachliche Freigabe, nachvollziehbares Protokoll und menschliche Entscheidung.", pts: { private: 2, iaas: 1, paas: 1 } },
      ],
    },
    {
      phase: "wie", criterion: "Startgeschwindigkeit",
      q: "Wie schnell soll die Lösung nutzbar sein?",
      options: [
        { label: "In wenigen Tagen", pts: { saas: 3, rag: 1 } },
        { label: "In einigen Wochen", pts: { paas: 2, rag: 2 } },
        { label: "Die Lösung soll passen – Zeit ist zweitrangig", pts: { iaas: 2, private: 2 } },
      ],
    },
    {
      phase: "wie", criterion: "Technische Verantwortung",
      q: "Wie viel technische Verantwortung kann Ihr Unternehmen übernehmen?",
      options: [
        { label: "Gering", sub: "Kein eigenes IT-Team für KI", pts: { saas: 3, rag: 1 } },
        { label: "Geteilt", sub: "Mit eigener IT-Abteilung oder einem Dienstleister", pts: { paas: 3, rag: 2 } },
        { label: "Hoch", sub: "Eigener Betrieb mit Patching, Skalierung und Sicherheit", pts: { iaas: 3, private: 2 } },
      ],
    },
    {
      phase: "wie", criterion: "Kontrolle über Datenfluss",
      q: "Wie viel Kontrolle über den Datenfluss brauchen Sie?",
      options: [
        { label: "Der Standard des Anbieters genügt", pts: { saas: 3 } },
        { label: "Gut steuerbar", sub: "Rollenrechte, Logging, Speicherort in der EU", pts: { paas: 2, rag: 2 } },
        { label: "Maximal", sub: "Daten verlassen die eigene Umgebung nicht", pts: { private: 3, iaas: 2 } },
      ],
    },
    {
      phase: "was", criterion: "Integrationsfähigkeit",
      q: "Was soll die Lösung mit Ihren Systemen verbinden?",
      options: [
        { label: "Nichts – sie soll eigenständig nutzbar sein", pts: { saas: 3 } },
        { label: "Einzelne Systeme über Schnittstellen", sub: "z. B. CRM, Ticketsystem oder ERP", pts: { paas: 3, rag: 1 } },
        { label: "Dokumentenablagen und Wissensquellen", sub: "z. B. Laufwerke, SharePoint, Wiki", pts: { rag: 3, paas: 1 } },
        { label: "Bestehende Systeme in eigenen Netzwerken", sub: "teils Offline, also ohne Internetverbindung", pts: { private: 3, iaas: 1 } },
      ],
    },
    {
      phase: "was", criterion: "Geeignet für",
      q: "Was soll konkret entstehen?",
      options: [
        { label: "Eine fertige Anwendung für Texte, E-Mails und Recherche", pts: { saas: 3 } },
        { label: "Eigene Assistenten, Oberflächen oder Workflows über APIs", pts: { paas: 3, rag: 1 } },
        { label: "Ein Assistent oder Copilot, der aus Unternehmenswissen antwortet", pts: { rag: 3, paas: 1 } },
        { label: "Eigene oder offene Modelle selbst betreiben", pts: { iaas: 3, private: 1 } },
      ],
    },
  ];

  var answers = [];
  var current = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Fachbegriffe mit Quickinfo versehen (assets/js/glossar.js); inline = innerhalb von Buttons
  var G = window.Glossar;
  function tip(s) { return G ? G.mark(esc(s)) : esc(s); }
  function tipInline(s) { return G ? G.mark(esc(s), true) : esc(s); }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Grundgerüst ---------- */
  root.innerHTML =
    '<ol class="wiz-phases">' + PHASES.map(function (p) {
      return '<li data-phase="' + p.id + '"><strong>' + p.label + '</strong><span>' + p.sub + '</span></li>';
    }).join("") + '</ol>' +
    '<div class="progress" aria-hidden="true"><span id="wiz-progress"></span></div>' +
    '<p class="progress-label" id="wiz-progress-label"></p>' +
    '<div class="wiz-stage" id="wiz-stage"></div>';

  var stage = document.getElementById("wiz-stage");
  var progress = document.getElementById("wiz-progress");
  var progressLabel = document.getElementById("wiz-progress-label");
  var phaseEls = root.querySelectorAll(".wiz-phases li");

  function setProgress(done, phaseId) {
    progress.style.width = (done / QUESTIONS.length * 100) + "%";
    var phaseIndex = PHASES.map(function (p) { return p.id; }).indexOf(phaseId);
    phaseEls.forEach(function (el, i) {
      el.classList.toggle("is-active", i === phaseIndex);
      el.classList.toggle("is-done", phaseId === "fertig" || i < phaseIndex);
    });
  }

  // Wechsel zwischen Schritten mit kurzer Ausblende-Animation
  function swap(html, after) {
    function render() {
      stage.innerHTML = html;
      stage.classList.remove("is-leaving");
      var heading = stage.querySelector("h3");
      if (heading && document.activeElement !== document.body) heading.focus({ preventScroll: true });
      if (after) after();
    }
    if (reduceMotion || !stage.firstChild) return render();
    stage.classList.add("is-leaving");
    setTimeout(render, 220);
  }

  /* ---------- Frage ---------- */
  function showQuestion(index) {
    current = index;
    var q = QUESTIONS[index];
    var phase = PHASES.filter(function (p) { return p.id === q.phase; })[0];
    setProgress(index, q.phase);
    progressLabel.textContent = "Frage " + (index + 1) + " von " + QUESTIONS.length;

    // Begriffe aus den Antworten zusätzlich als antippbare Leiste (Buttons dürfen keine Buttons enthalten)
    var terms = G ? G.find(q.options.map(function (o) { return o.label + " · " + (o.sub || ""); }).join(" · ")) : [];

    swap(
      '<div class="wiz-step">' +
      '<p class="wiz-kicker">' + phase.label + ' · ' + esc(q.criterion) + '</p>' +
      '<h3 id="wiz-q" tabindex="-1">' + tip(q.q) + '</h3>' +
      (q.hint ? '<p class="wiz-hint">' + tip(q.hint) + '</p>' : '') +
      '<div class="wiz-options" role="radiogroup" aria-labelledby="wiz-q">' +
      q.options.map(function (o, i) {
        var checked = answers[index] === i;
        return '<button type="button" class="wiz-option" role="radio" aria-checked="' + checked + '" data-option="' + i + '" style="--i:' + i + '">' +
          '<span class="wiz-dot" aria-hidden="true"></span>' +
          '<span class="wiz-text"><strong>' + tipInline(o.label) + '</strong>' + (o.sub ? '<span>' + tipInline(o.sub) + '</span>' : '') + '</span>' +
          '</button>';
      }).join("") +
      '</div>' +
      (terms.length ? '<p class="tip-row">Begriffe erklärt: ' + terms.map(G.chip).join(" ") + '</p>' : '') +
      '<div class="wiz-nav">' +
      (index > 0 ? '<button type="button" class="link-btn" data-action="back">← Zurück</button>' : '<span></span>') +
      (answers[index] !== undefined ? '<button type="button" class="btn btn-secondary" data-action="next">Weiter</button>' : '') +
      '</div>' +
      '</div>'
    );
  }

  /* ---------- Auswertung ---------- */
  function evaluate() {
    var score = {}, max = {}, excluded = {};
    ARCH.forEach(function (a) { score[a.id] = 0; max[a.id] = 0; });
    var ampel = null, qa = null;

    QUESTIONS.forEach(function (q, qi) {
      ARCH.forEach(function (a) {
        max[a.id] += Math.max.apply(null, q.options.map(function (o) { return o.pts[a.id] || 0; }));
      });
      var o = q.options[answers[qi]];
      Object.keys(o.pts).forEach(function (k) { score[k] += o.pts[k]; });
      (o.exclude || []).forEach(function (k) { excluded[k] = true; });
      if (o.ampel) ampel = o.ampel;
      if (o.qa) qa = o.qa;
    });

    var ranked = ARCH.map(function (a, order) {
      return {
        arch: a, order: order, excluded: !!excluded[a.id],
        fit: excluded[a.id] ? 0 : Math.round(score[a.id] / (max[a.id] || 1) * 100),
      };
    }).sort(function (a, b) { return b.fit - a.fit || a.order - b.order; });

    return { ranked: ranked, ampel: AMPEL[ampel], ampelId: ampel, qa: qa };
  }

  function showResult() {
    var r = evaluate();
    var pick = r.ranked[0];
    var pickIndex = ARCH.indexOf(pick.arch);
    setProgress(QUESTIONS.length, "fertig");
    progressLabel.textContent = "Alle " + QUESTIONS.length + " Fragen beantwortet";

    var fitList = r.ranked.map(function (x, i) {
      return '<li class="' + (i === 0 ? "is-pick" : "") + '" style="--i:' + i + '">' +
        '<span class="fit-name">' + tip(x.arch.name) + '</span>' +
        '<span class="fit-bar" aria-hidden="true"><span data-w="' + x.fit + '"></span></span>' +
        '<span class="fit-value">' + (x.excluded ? "–" : x.fit + " %") + '</span>' +
        (x.excluded ? '<span class="fit-note">Bei roten Daten nicht geeignet</span>' : '') +
        '</li>';
    }).join("");

    var matrix = '<div class="matrix-wrap"><table class="matrix">' +
      '<caption class="visually-hidden">Entscheidungsmatrix, empfohlene Architektur hervorgehoben</caption>' +
      '<thead><tr><th scope="col">Kriterium</th>' + ARCH.map(function (a, i) {
        return '<th scope="col"' + (i === pickIndex ? ' class="is-pick"' : '') + '>' + tip(a.name) + '</th>';
      }).join("") + '</tr></thead><tbody>' +
      MATRIX.map(function (row) {
        return '<tr><th scope="row">' + tip(row.label) + '</th>' + row.values.map(function (v, i) {
          return '<td' + (i === pickIndex ? ' class="is-pick"' : '') + '>' + tip(v) + '</td>';
        }).join("") + '</tr>';
      }).join("") + '</tbody></table></div>';

    swap(
      '<div class="wiz-step wiz-result">' +
      '<p class="wiz-kicker">Ergebnis</p>' +
      '<h3 tabindex="-1">Empfohlen: <em>' + tip(pick.arch.name) + '</em></h3>' +
      '<p class="wiz-lead">' + tip(pick.arch.short) + '</p>' +

      '<ol class="fit-list" aria-label="Passung aller Architekturen">' + fitList + '</ol>' +

      '<dl class="arch-facts">' +
      '<div><dt>Was wird betrieben?</dt><dd>' + tip(pick.arch.runs) + '</dd></div>' +
      '<div><dt>Geeignet für</dt><dd>' + tip(pick.arch.fit) + '</dd></div>' +
      '<div><dt>Beratungsrisiko</dt><dd>' + tip(pick.arch.risk) + '</dd></div>' +
      '</dl>' +

      '<div class="ampel ampel-' + r.ampelId + '">' +
      '<p class="ampel-head"><span class="ampel-dot" aria-hidden="true"></span>Datenampel: ' + esc(r.ampel.label) + '</p>' +
      '<dl>' +
      '<div><dt>Datenlage</dt><dd>' + tip(r.ampel.data) + '</dd></div>' +
      '<div><dt>Typische Umgebung</dt><dd>' + tip(r.ampel.env) + '</dd></div>' +
      '<div><dt>Mindestanforderungen</dt><dd>' + tip(r.ampel.min) + '</dd></div>' +
      '<div><dt>Prüfung der Ergebnisse</dt><dd>' + tip(r.qa) + '</dd></div>' +
      '</dl></div>' +

      '<h4>Entscheidungsmatrix</h4>' + matrix +

      '<div class="wiz-actions">' +
      '<a class="btn btn-primary" href="index.html#kontakt">Ergebnis im Erstgespräch besprechen</a>' +
      '<button type="button" class="btn btn-secondary" data-action="restart">Neu starten</button>' +
      '<button type="button" class="link-btn" data-action="back">← Letzte Frage ändern</button>' +
      '</div>' +
      '</div>',
      function () {
        // Balken nach dem Einblenden wachsen lassen
        requestAnimationFrame(function () {
          stage.querySelectorAll(".fit-bar span").forEach(function (bar) {
            bar.style.width = bar.getAttribute("data-w") + "%";
          });
        });
      }
    );
  }

  /* ---------- Bedienung ---------- */
  stage.addEventListener("click", function (e) {
    var option = e.target.closest(".wiz-option");
    if (option) {
      answers[current] = Number(option.getAttribute("data-option"));
      stage.querySelectorAll(".wiz-option").forEach(function (b) {
        b.setAttribute("aria-checked", String(b === option));
      });
      var next = current + 1;
      setTimeout(function () {
        if (next < QUESTIONS.length) showQuestion(next); else showResult();
      }, reduceMotion ? 0 : 280);
      return;
    }
    var action = e.target.closest("[data-action]");
    if (!action) return;
    var name = action.getAttribute("data-action");
    if (name === "back") showQuestion(stage.querySelector(".wiz-result") ? QUESTIONS.length - 1 : current - 1);
    if (name === "next") {
      if (current + 1 < QUESTIONS.length) showQuestion(current + 1); else showResult();
    }
    if (name === "restart") {
      answers = [];
      showQuestion(0);
    }
  });

  // Pfeiltasten innerhalb der Antwortgruppe
  stage.addEventListener("keydown", function (e) {
    if (!e.target.classList.contains("wiz-option")) return;
    if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].indexOf(e.key) === -1) return;
    e.preventDefault();
    var options = Array.prototype.slice.call(stage.querySelectorAll(".wiz-option"));
    var i = options.indexOf(e.target);
    var step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    options[(i + step + options.length) % options.length].focus();
  });

  showQuestion(0);
})();
