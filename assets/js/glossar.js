(function () {
  "use strict";

  /* ---------- Glossar: Quickinfos für Fachbegriffe ----------
     Neue Begriffe hier ergänzen: Schlüssel = Begriff wie im Text, „alt“ = weitere Schreibweisen.
     Elemente mit data-glossar werden automatisch versehen; Skripte nutzen Glossar.mark(). */
  var TERMS = {
    "SaaS": {
      text: "Software as a Service: fertige Software, die Sie über den Browser nutzen. Betrieb und Updates übernimmt der Anbieter.",
      example: "Ein KI-Chat-Assistent mit Firmenlizenz – so wie ein E-Mail-Postfach in der Cloud.",
    },
    "Enterprise-SaaS": {
      text: "Die Geschäftskunden-Version einer Cloud-Software – mit Vertrag zur Auftragsverarbeitung, zentraler Benutzerverwaltung und Zusagen zum Datenschutz.",
      example: "Eingaben werden nicht zum Training genutzt, und die IT verwaltet alle Zugänge zentral.",
    },
    "PaaS": {
      text: "Platform as a Service: Ein Cloud-Anbieter stellt Bausteine bereit, etwa KI-Modelle oder Datenbanken. Daraus entstehen eigene Anwendungen.",
      example: "Ihr Dienstleister baut einen Angebots-Assistenten, der ein KI-Modell aus der Cloud nutzt.",
    },
    "Model-as-a-Service": {
      text: "KI-Modelle zur Miete: Ihre Anwendung ruft ein Modell über eine Schnittstelle auf, abgerechnet wird nach Nutzung.",
      example: "Pro verarbeitetem Text fällt ein kleiner Betrag an – ähnlich wie beim Stromzähler.",
    },
    "IaaS": {
      text: "Infrastructure as a Service: gemietete Server, Speicher und Netzwerke in der Cloud. Alles darüber richten Sie selbst ein und betreiben es.",
      example: "Wie eine leere, gemietete Werkhalle – Maschinen und Betrieb organisieren Sie selbst.",
    },
    "Self-hosted": {
      alt: ["selbst betrieben"],
      text: "Selbst betrieben: Das KI-Modell läuft auf Servern, die Sie selbst verwalten – nicht beim Modellanbieter.",
      example: "Ein offenes Sprachmodell läuft auf einem Server in Ihrem Rechenzentrum.",
    },
    "RAG": {
      alt: ["Retrieval-Augmented Generation"],
      text: "Retrieval-Augmented Generation: Die KI sucht vor ihrer Antwort passende Stellen in Ihren Dokumenten und stützt sich darauf.",
      example: "Auf die Frage „Wie viele Urlaubstage habe ich?“ liest sie zuerst die Betriebsvereinbarung.",
    },
    "Managed RAG": {
      text: "Eine RAG-Lösung, deren Betrieb ein Anbieter übernimmt („managed“ = verwaltet). Sie liefern die Dokumente, die Plattform kümmert sich um Suche und Technik.",
      example: "Ihre Handbücher werden hochgeladen; Mitarbeitende stellen Fragen und erhalten Antworten mit Quellenangabe.",
    },
    "Agent Platform": {
      text: "Plattform, auf der KI-Agenten eingerichtet, mit Werkzeugen verbunden und überwacht werden.",
      example: "Ein Agent für Reklamationen bekommt Lesezugriff auf das Auftragssystem und das Postfach.",
    },
    "Retrieval": {
      text: "Das gezielte Heraussuchen passender Textstellen aus einer Dokumentensammlung.",
      example: "Wie ein Archivar, der zu Ihrer Frage die drei relevanten Seiten aus dem Ordner holt.",
    },
    "Agenten": {
      alt: ["Agents"],
      text: "KI, die nicht nur antwortet, sondern selbstständig mehrere Arbeitsschritte ausführt und dabei Werkzeuge nutzt.",
      example: "Eine Reklamation lesen, den Auftrag im System suchen und einen Antwortentwurf anlegen.",
    },
    "Copiloten": {
      alt: ["Copilot", "Copilots"],
      text: "KI-Assistent, der direkt in einem Programm mitarbeitet und Vorschläge macht. Die Entscheidung bleibt beim Menschen.",
      example: "Im Textprogramm schlägt er eine Zusammenfassung des geöffneten Dokuments vor.",
    },
    "Private Cloud": {
      text: "Cloud-Umgebung, die nur Ihrem Unternehmen zur Verfügung steht – im eigenen Rechenzentrum oder exklusiv bei einem Anbieter.",
      example: "Ein abgeschotteter Serverbereich, den kein anderer Kunde mitnutzt.",
    },
    "On-Prem": {
      alt: ["On-Premises"],
      text: "On-Premises: Die Technik steht in Ihren eigenen Räumen und wird dort betrieben.",
      example: "Der KI-Server steht im Serverraum Ihres Betriebs.",
    },
    "Hybrid": {
      text: "Mischform: Ein Teil der Lösung läuft in der eigenen Umgebung, ein Teil in der Cloud.",
      example: "Personaldaten bleiben im Haus, allgemeine Texte erstellt ein Cloud-Dienst.",
    },
    "APIs": {
      alt: ["API", "Schnittstellen", "Schnittstelle"],
      text: "Programmierschnittstelle: ein fest definierter Weg, auf dem zwei Programme Daten austauschen.",
      example: "Das CRM schickt eine Kundenanfrage an die KI und erhält einen Antwortentwurf zurück.",
    },
    "Workflows": {
      alt: ["Workflow"],
      text: "Festgelegte Abfolge von Arbeitsschritten, die teilweise automatisch abläuft.",
      example: "Rechnung kommt an → wird geprüft → geht zur Freigabe an die Abteilungsleitung.",
    },
    "Identitäten": {
      text: "Digitale Benutzerkonten und ihre Anmeldung: Wer ist wer, und wer darf was?",
      example: "Mitarbeitende melden sich mit dem Firmenkonto an – die KI kennt so ihre Berechtigungen.",
    },
    "Limits": {
      text: "Obergrenzen für die Nutzung, etwa Anfragen pro Minute oder Budget pro Monat.",
      example: "Ab 500 € im Monat stoppt der Dienst automatisch.",
    },
    "Kostenlimit": {
      text: "Feste Obergrenze für KI-Kosten, damit die Nutzung nicht unbemerkt teuer wird.",
      example: "Bei 300 € pro Monat erhält die IT eine Warnung, bei 400 € wird gestoppt.",
    },
    "Logging": {
      alt: ["Protokollierung"],
      text: "Automatisches Mitschreiben, wer wann was mit dem System gemacht hat.",
      example: "Später lässt sich nachvollziehen, welche Anfrage zu welcher Antwort geführt hat.",
    },
    "Evaluation": {
      text: "Systematische Prüfung, wie gut und zuverlässig die KI-Antworten sind.",
      example: "50 typische Fragen mit bekannten Antworten werden regelmäßig erneut getestet.",
    },
    "Single Source of Truth": {
      text: "Eine einzige, verbindliche Quelle für eine Information. Alle arbeiten mit derselben, gepflegten Fassung.",
      example: "Die aktuelle Preisliste liegt an genau einer Stelle – keine Kopien in Mails oder auf dem Desktop.",
    },
    "n8n": {
      text: "Werkzeug, das Abläufe zwischen Programmen automatisiert, weitgehend ohne Programmierung. Lässt sich auch selbst betreiben.",
      example: "Neue Anfrage per Mail → Daten ins CRM → kurze Zusammenfassung an den Vertrieb.",
    },
    "Patching": {
      text: "Einspielen von Updates, die Fehler und Sicherheitslücken schließen.",
      example: "Wie das monatliche Windows-Update – nur für Server und KI-Software, und in Ihrer Verantwortung.",
    },
    "Skalierung": {
      text: "Anpassen der Rechenleistung an die Nachfrage – mehr bei Andrang, weniger in ruhigen Zeiten.",
      example: "Zum Monatsabschluss, wenn viele Berichte entstehen, werden zusätzliche Server zugeschaltet.",
    },
    "GPU-Kapazität": {
      alt: ["GPU"],
      text: "Rechenleistung von Grafikprozessoren (GPUs) – Spezialchips, auf denen KI-Modelle schnell laufen.",
      example: "Ein großes Sprachmodell braucht mehrere teure Grafikkarten, die beschafft und ausgelastet werden müssen.",
    },
    "Latenz": {
      text: "Die Wartezeit zwischen Anfrage und Antwort.",
      example: "Eine Maschinensteuerung braucht Antworten in Millisekunden – der Umweg über ein Rechenzentrum im Ausland wäre zu langsam.",
    },
    "Fallbacks": {
      alt: ["Fallback"],
      text: "Ausweichlösung, die greift, wenn ein System ausfällt oder unsicher antwortet.",
      example: "Ist der Cloud-Dienst nicht erreichbar, geht der Vorgang automatisch an einen Menschen.",
    },
    "Souveränität": {
      text: "Kontrolle darüber, wo Daten liegen und wer darauf zugreifen kann – auch unabhängig von einzelnen Anbietern.",
      example: "Alle Daten bleiben in Rechenzentren in Deutschland, ein Anbieterwechsel bleibt möglich.",
    },
    "Laufzeiten": {
      alt: ["Laufzeitbetrieb", "Laufzeitumgebungen"],
      text: "Die technische Umgebung, in der ein Programm oder Modell ausgeführt wird.",
      example: "Ein bestimmtes Modell benötigt eine spezielle Software-Version und passende Hardware.",
    },
    "Offline": {
      text: "Ohne Internetverbindung.",
      example: "In einer abgeschotteten Produktionshalle muss die KI auf einem lokalen Rechner laufen.",
    },
    "synthetisch": {
      text: "Künstlich erzeugte Daten, die echten ähneln, aber keine realen Personen oder Vorgänge enthalten.",
      example: "Erfundene Musterkunden, um eine Auswertung gefahrlos zu testen.",
    },
    "Datenklassifizierung": {
      text: "Einstufung von Daten nach Schutzbedarf, z. B. öffentlich, intern, vertraulich.",
      example: "Preislisten gelten als intern, Gehaltsdaten als vertraulich.",
    },
    "Rollenrechte": {
      text: "Zugriffsrechte nach Aufgabe statt nach Person.",
      example: "Nur die Rolle „Personal“ sieht Gehaltsdaten – egal, wer sie gerade innehat.",
    },
    "Review": {
      text: "Prüfung eines Ergebnisses durch einen Menschen, bevor es verwendet wird.",
      example: "Eine Kollegin liest das KI-Angebot gegen, bevor es an den Kunden geht.",
    },
    "Versionierung": {
      text: "Jede Änderung wird als neue Version gespeichert; frühere Stände bleiben abrufbar.",
      example: "Sie können jederzeit sehen, welche Fassung einer Vorlage im März galt.",
    },
    "DSFA": {
      alt: ["Datenschutz-Folgenabschätzung"],
      text: "Datenschutz-Folgenabschätzung: Pflichtprüfung nach DSGVO, wenn eine Verarbeitung ein hohes Risiko für Betroffene hat.",
      example: "Vor dem Einsatz von KI zur Vorauswahl von Bewerbungen.",
    },
    "Least Privilege": {
      text: "Prinzip der minimalen Rechte: Personen und Systeme erhalten nur die Zugriffe, die sie für ihre Aufgabe brauchen.",
      example: "Der KI-Assistent für den Vertrieb liest Angebote, aber keine Personalakten.",
    },
    "Audit": {
      text: "Unabhängige, nachvollziehbare Überprüfung, ob Regeln eingehalten werden.",
      example: "Die Revision prüft anhand der Protokolle, wer auf welche Daten zugegriffen hat.",
    },
    "Datenfluss": {
      alt: ["Datenflüsse"],
      text: "Der Weg, den Daten nehmen: woher sie kommen, wo sie verarbeitet und wo sie gespeichert werden.",
      example: "Kundenmail → KI-Dienst in der EU → Antwortentwurf im Postfach der Sachbearbeitung.",
    },
    "Integrationsfähigkeit": {
      text: "Wie gut sich eine Lösung mit Ihren vorhandenen Programmen verbinden lässt.",
      example: "Kann die KI Kundendaten direkt aus dem CRM lesen, oder muss jemand sie hineinkopieren?",
    },
    "Bestandssysteme": {
      text: "Bereits vorhandene, oft ältere Programme im Unternehmen.",
      example: "Die seit 15 Jahren genutzte Warenwirtschaft.",
    },
    "CRM": {
      text: "Customer-Relationship-Management: Software für Kundendaten, Kontakte und Verkaufschancen.",
      example: "Dort steht, wann ein Kunde zuletzt angefragt hat und welches Angebot offen ist.",
    },
    "ERP": {
      text: "Enterprise Resource Planning: zentrale Software für Einkauf, Lager, Produktion und Buchhaltung.",
      example: "Dort werden Aufträge, Lagerbestände und Rechnungen geführt.",
    },
    "Ticketsystem": {
      text: "Software, in der Anfragen als einzelne Vorgänge („Tickets“) erfasst und abgearbeitet werden.",
      example: "Eine IT-Störung wird gemeldet; das Ticket zeigt, wer sie bearbeitet und wie weit sie ist.",
    },
    "SharePoint": {
      text: "Plattform von Microsoft zur gemeinsamen Ablage und Bearbeitung von Dokumenten im Unternehmen.",
      example: "Der Ordner „Vorlagen Vertrieb“, auf den das ganze Team zugreift.",
    },
    "Wiki": {
      text: "Interne Wissenssammlung im Browser, die Mitarbeitende gemeinsam pflegen.",
      example: "Eine Seite „So beantragen Sie Urlaub“ mit Schritt-für-Schritt-Anleitung.",
    },
    "Golden Circle": {
      text: "Denkmodell von Simon Sinek: zuerst das Warum klären, dann das Wie, zuletzt das Was.",
      example: "Erst „Warum wollen wir KI nutzen?“, dann „Wie betreiben wir sie?“, dann „Was bauen wir konkret?“.",
    },
    "Arena": {
      text: "Offene Vergleichsplattform (arena.ai): Menschen stellen eine Frage, erhalten zwei anonyme Antworten und wählen die bessere.",
      example: "Aus Millionen solcher Abstimmungen entsteht eine Rangliste der Modelle.",
    },
    "CC BY 4.0": {
      text: "Offene Lizenz: Die Daten dürfen frei genutzt werden, wenn die Quelle genannt wird.",
      example: "Deshalb steht unter den Ranglisten der Hinweis auf arena.ai.",
    },
  };

  /* ---------- Begriffe im Text finden ---------- */
  var lookup = {};
  Object.keys(TERMS).forEach(function (key) {
    lookup[key] = key;
    (TERMS[key].alt || []).forEach(function (a) { lookup[a] = key; });
  });
  // Längste Begriffe zuerst, damit „Enterprise-SaaS“ vor „SaaS“ greift
  var words = Object.keys(lookup).sort(function (a, b) { return b.length - a.length; });
  var WORD = "A-Za-z0-9ÄÖÜäöüß";
  var pattern = new RegExp("(^|[^" + WORD + "-])(" + words.map(function (w) {
    return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("|") + ")(?![" + WORD + "])", "g");

  // Markiert in (bereits maskiertem) HTML-Text jeden Begriff beim ersten Vorkommen.
  // inline = true: nicht klickbar (für Text innerhalb von Buttons), Erklärung per Mauszeiger.
  function mark(html, inline) {
    var seen = {};
    return html.replace(pattern, function (all, before, word) {
      var key = lookup[word];
      if (seen[key]) return all;
      seen[key] = true;
      return before + (inline
        ? '<span class="tip tip-inline" data-tip="' + key + '">' + word + "</span>"
        : '<button type="button" class="tip" data-tip="' + key + '">' + word + "</button>");
    });
  }

  // Liefert die Schlüssel aller Begriffe in einem Text (für Begriffsleisten unter Antworten)
  function find(text) {
    var keys = [];
    String(text).replace(pattern, function (all, before, word) {
      if (keys.indexOf(lookup[word]) === -1) keys.push(lookup[word]);
      return all;
    });
    return keys;
  }

  function chip(key) {
    return '<button type="button" class="tip tip-chip" data-tip="' + key + '">' + key + "</button>";
  }

  // Textknoten unterhalb von root versehen (für statische Inhalte mit data-glossar)
  function decorate(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement.closest("a, button, .tip")) nodes.push(walker.currentNode);
    }
    nodes.forEach(function (node) {
      var safe = node.nodeValue.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      var html = mark(safe);
      if (html === safe) return;
      var tpl = document.createElement("template");
      tpl.innerHTML = html;
      node.parentNode.replaceChild(tpl.content, node);
    });
  }

  /* ---------- Quickinfo-Fenster ---------- */
  var box = document.createElement("div");
  box.className = "tooltip";
  box.id = "glossar-tip";
  box.setAttribute("role", "tooltip");
  box.hidden = true;
  box.innerHTML = '<strong class="tooltip-term"></strong><p class="tooltip-text"></p><p class="tooltip-example"></p>';
  document.body.appendChild(box);

  var current = null;
  var hideTimer = null;

  function show(trigger) {
    var entry = TERMS[trigger.getAttribute("data-tip")];
    if (!entry) return;
    clearTimeout(hideTimer);
    if (current && current !== trigger) current.removeAttribute("aria-describedby");
    current = trigger;
    // Offene Dialoge liegen über der Seite: Quickinfo dort einhängen, sonst bleibt sie verdeckt
    var host = trigger.closest("dialog") || document.body;
    if (box.parentNode !== host) host.appendChild(box);
    box.querySelector(".tooltip-term").textContent = trigger.textContent;
    box.querySelector(".tooltip-text").textContent = entry.text;
    box.querySelector(".tooltip-example").textContent = entry.example ? "Beispiel: " + entry.example : "";
    box.hidden = false;
    trigger.setAttribute("aria-describedby", box.id);
    trigger.classList.add("is-open");

    // Unter dem Begriff platzieren; reicht der Platz nicht, darüber
    var r = trigger.getBoundingClientRect();
    var w = box.offsetWidth, h = box.offsetHeight, gap = 10;
    var left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), window.innerWidth - w - 16);
    var top = r.bottom + gap;
    var above = top + h > window.innerHeight - 8 && r.top - gap - h > 8;
    if (above) top = r.top - gap - h;
    box.style.left = left + "px";
    box.style.top = top + "px";
    box.classList.toggle("is-above", above);
    box.style.setProperty("--arrow", (r.left + r.width / 2 - left) + "px");
  }

  function hide() {
    box.hidden = true;
    if (current) {
      current.removeAttribute("aria-describedby");
      current.classList.remove("is-open");
    }
    current = null;
  }

  function hideSoon() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 120);
  }

  var hoverCapable = window.matchMedia("(hover: hover)").matches;

  document.addEventListener("mouseover", function (e) {
    if (!hoverCapable) return;
    var t = e.target.closest("[data-tip]");
    if (t) show(t);
    else if (e.target.closest(".tooltip")) clearTimeout(hideTimer);
  });
  document.addEventListener("mouseout", function (e) {
    if (!hoverCapable) return;
    if (e.target.closest("[data-tip], .tooltip")) hideSoon();
  });
  document.addEventListener("focusin", function (e) {
    var t = e.target.closest("button[data-tip]");
    if (t) show(t);
  });
  document.addEventListener("focusout", function (e) {
    if (e.target.closest("button[data-tip]")) hideSoon();
  });
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button[data-tip]");
    if (t) {
      e.preventDefault();
      if (current === t && !box.hidden && !hoverCapable) hide(); else show(t);
      return;
    }
    if (!e.target.closest(".tooltip")) hide();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !box.hidden) hide();
  });
  window.addEventListener("scroll", function () { if (!box.hidden) hide(); }, { passive: true });
  window.addEventListener("resize", hide);

  // Für Paul: Begriffe unabhängig von Groß-/Kleinschreibung finden und Erklärung abrufen
  var lowerLookup = {};
  Object.keys(lookup).forEach(function (w) { lowerLookup[w.toLowerCase()] = lookup[w]; });
  var loosePattern = new RegExp(pattern.source, "gi");
  function findLoose(text) {
    var keys = [];
    String(text).replace(loosePattern, function (all, before, word) {
      var key = lowerLookup[word.toLowerCase()];
      if (key && keys.indexOf(key) === -1) keys.push(key);
      return all;
    });
    return keys;
  }
  function entry(key) { return TERMS[key]; }

  window.Glossar = { mark: mark, find: find, findLoose: findLoose, entry: entry, chip: chip, decorate: decorate };

  document.querySelectorAll("[data-glossar]").forEach(decorate);
})();
