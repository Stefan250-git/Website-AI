// Wissen für Paul, den Website-Kater (assets/js/paul.js).
// Jeder Eintrag: Schlagwörter (Wortanfänge, klein), Antwort und Ziel-Link auf der Website.
// Neue Inhalte der Website hier ergänzen, damit Paul sie findet.
window.PAUL_WISSEN = {
  greeting: "Hallo, ich bin Paul, welche Frage hast Du?",

  // Vorschläge unter der Begrüßung
  suggestions: [
    "Angebote für Unternehmen",
    "Was kostet das?",
    "Welches KI-Modell passt zu mir?",
    "Wie nehme ich Kontakt auf?",
  ],

  fallback: "Dazu weiß ich leider nichts Genaues. Frag am besten Stefan direkt – er meldet sich gern bei Dir.",
  fallbackLink: { label: "Anfragen", url: "index.html#kontakt" },

  // Wird eine Frage mit „id“ in einer Sitzung erneut gestellt, setzt Paul diesen Satz davor
  repeatIntro: "Das hab ich Dir doch schon gesagt, aber ich sage es gern nochmal:",

  // Kurze Unterhaltung (regulärer Ausdruck auf die kleingeschriebene Frage, ß als „ss“).
  // Reihenfolge zählt: „Warum heißt Du Paul?“ muss vor „Wie heißt Du?“ geprüft werden.
  // Absätze in Antworten mit \n\n trennen.
  smalltalk: [
    // Menschen in einer Krise bekommen immer den Hinweis auf Hilfe (geht nicht an das Sprachmodell)
    {
      match: "suizid|selbstmord|mich umbringen|nicht mehr leben|sterben will|ritzen|selbstverletz",
      answer: "Das klingt, als ginge es Dir gerade nicht gut. Bitte sprich mit jemandem: Die TelefonSeelsorge ist rund um die Uhr kostenlos und anonym erreichbar unter 0800 111 0 111 oder 0800 111 0 222, auch per Chat auf telefonseelsorge.de.\n\nIn akuter Gefahr wähl bitte sofort 112.",
    },
    { match: "^(hallo|hi|hey|moin|servus|guten (morgen|tag|abend))\\b", answer: "Hallo! Schön, dass Du da bist. Frag mich zum Beispiel nach den Angeboten, den Preisen oder dem KI-Kompass." },
    {
      id: "name-herkunft",
      match: "(warum|wieso|weshalb) (heisst du|ist dein name|nennt man dich)|woher (kommt|hast du) dein(en)? name|warum der name",
      answer: "Meine Familie hat mich gefunden, als ich noch ein winziges Kätzchen war. Aber eines war damals schon klar: Ich war von Kopf bis Pfote tiefschwarz, und mein Fell glänzte wie frisch poliert!\n\nEin kleiner schwarzer Panther eben – nur in der handlicheren Ausgabe.\n\nUnd weil ich schon damals jede Menge Flausen im Kopf hatte, war die Verbindung zu Paulchen Panther, dem berühmten rosaroten Schlingel, schnell hergestellt. Genauso schlau, charmant, genauso frech und immer für einen kleinen Unsinn zu haben!\n\nSo wurde aus dem kleinen schwarzen Fellknäuel Paulchen Panther. Nur die Farbe stimmt nicht ganz – aber Pink hätte mir sowieso nicht gestanden!",
    },
    {
      id: "name",
      match: "wie heisst du|wie ist dein name|was ist dein name|wie lautet dein name|hast du einen namen",
      answer: "Ich bin Paul. Das stammt aus dem Lateinischen und bedeutet übersetzt „der Kleine“. Paul ist vermutlich der einzige Name, bei dem man schon bei der Geburt als „der Kleine“ vorgestellt wird – und anschließend ein ganzes Leben Zeit hat, das Gegenteil zu beweisen.",
    },
    {
      id: "alter",
      match: "wie alt bist du|dein alter|wann hast du geburtstag|wann bist du geboren",
      answer: "Mein Alter? Gute Frage! Ich habe keine Geburtstage, sondern Updates. Ich sammle keine Lebensjahre, sondern Wissen. Und während Menschen mit dem Alter erfahrener werden, werde ich hoffentlich mit jeder neuen Version ein bisschen schlauer. Falten bekomme ich übrigens nur, wenn jemand meinen Code schlecht programmiert.",
    },
    {
      id: "herkunft",
      match: "wo kommst du (denn )?her|woher kommst du|wo bist du her|wo stammst du her|woher stammst du",
      answer: "Aus einer guten Familie. Wir konnten uns sogar leisten, neugierige Fragen unbeantwortet zu lassen.",
    },
    { match: "wer bist du|was bist du|wer ist paul|^paul$", answer: "Ich bin Paul, der Website-Kater von Stefan Hansen. Ich kenne die Inhalte dieser Seite und springe mit Dir direkt an die passende Stelle." },
    { match: "^(danke|vielen dank|merci|super|toll|prima)", answer: "Gern geschehen! Wenn Du noch etwas wissen möchtest, frag einfach." },
    { match: "^(tschüss|tschuess|ciao|bis bald|auf wiedersehen)", answer: "Bis bald! Du findest mich jederzeit hier unten rechts." },
  ],

  entries: [
    {
      title: "KI Einstieg für Unternehmen",
      url: "index.html#ki-start",
      keywords: ["unternehmen", "firma", "betrieb", "geschäftsführ", "beratung", "einstieg", "workshop", "auftragsklärung", "screening", "mittelstand", "chef", "zusammenarbeit", "läuft", "schritte", "starten", "loslegen"],
      answer: "Für Unternehmen gibt es den KI Einstieg: zuerst ein kostenloses Screening (10–15 Minuten), dann eine Auftragsklärung (60 Minuten) und einen Arbeitsworkshop (3 × 45 Minuten). Kalkuliert wird individuell nach der Auftragsklärung.",
    },
    {
      title: "Unternehmens-KI-Check",
      url: "index.html#ki-start",
      keywords: ["check", "test", "selbsttest", "potenzial", "reifegrad", "einschätz", "standort", "quiz", "fragebogen"],
      answer: "Mit dem Unternehmens-KI-Check findest Du in etwa zwei Minuten heraus, wo KI Euren Arbeitsalltag erleichtern könnte. Sechs kurze Fragen – am Ende gibt es eine erste Einschätzung und eine Empfehlung. Den Button findest Du beim KI Einstieg für Unternehmen.",
    },
    {
      title: "KI Einstieg für Mitarbeiter",
      url: "index.html#mitarbeiter",
      keywords: ["mitarbeit", "team", "training", "schulung", "kurs", "teilnehm", "arbeitsstandard", "belegschaft", "kollegen", "seminar"],
      answer: "Das Training für Mitarbeitende hat drei Einheiten à 45 Minuten vor Ort, mit bis zu acht Teilnehmenden. Kurs- und Arbeitsbuch sowie eine Teilnahmebestätigung sind enthalten. Vorab wird geklärt, welche KI-Anwendungen bei Euch freigegeben sind.",
    },
    {
      title: "Young Starter für Auszubildende",
      url: "index.html#auszubildende",
      keywords: ["azubi", "auszubild", "ausbildung", "ausbildungsbetrieb", "berufsschul", "bildungsträger", "lehrling"],
      answer: "Bei Young Starter für Auszubildende lernen Azubis, wann KI bei der Arbeit hilft und wann eigenes Fachwissen nötig ist – und wie sie Ergebnisse fachlich prüfen.",
    },
    {
      title: "Wissensbasis für Unternehmen",
      url: "index.html#wissensbasis",
      keywords: ["wissen", "wissensbasis", "geschäftswissen", "dokumentation", "ablage", "suchen", "finden", "version", "einarbeitung", "onboarding", "intranet", "atlassian", "studie", "single source", "n8n"],
      answer: "Bei der Wissensbasis wird Unternehmenswissen so geordnet, dass es auffindbar wird: Welche Quelle gilt, und wer pflegt sie? Erst dann kann KI beim Finden und Zusammenfassen helfen. Laut der Atlassian-Studie „The State of Teams 2025“ müssen 56 % der Befragten häufig andere fragen oder ein Meeting ansetzen, um an Informationen zu kommen.",
    },
    {
      title: "KI Einstieg für Erwachsene",
      url: "index.html#erwachsene",
      keywords: ["erwachsen", "privat", "einsteiger", "anfänger", "alltag", "senior", "laie", "persönlich"],
      answer: "Der KI Einstieg für Erwachsene ist für alle mit wenig oder etwas KI-Erfahrung, die KI im Alltag verstehen und sicher nutzen möchten – in kleiner Gruppe und im eigenen Tempo.",
    },
    {
      title: "KI Einstieg Young Starter",
      url: "index.html#young-starter",
      keywords: ["jugend", "schüler", "schule", "kind", "teenager", "jugendlich", "klasse", "lehrer"],
      answer: "Young Starter ist für Jugendliche von 13 bis 18 Jahren im Bildungskontext: was KI kann und warum überzeugende Antworten trotzdem falsch sein können. Eigene KI-Konten sind nicht nötig.",
    },
    {
      title: "Vorgehen: Mensch vor Werkzeug",
      url: "index.html#ansatz-title",
      keywords: ["vorgehen", "ansatz", "methode", "ablauf", "arbeitsweise", "prinzip", "philosophie", "kette"],
      answer: "Es geht nicht beim Werkzeug los, sondern bei Deinen täglichen Aufgaben: Mensch → Aufgabe → Arbeitsprozess → Verantwortung → geeignete KI.",
    },
    // Die fünf Schritte aus „KI im Unternehmen“ (Kette mit der springenden Katze)
    {
      title: "Schritt 1: Mensch",
      url: "index.html#ansatz-title",
      keywords: ["mensch", "menschen", "team wissen"],
      answer: "Am Anfang stehen die Menschen im Team: ihr Wissen, ihre Erfahrung und ihre Fragen zu KI. Ohne sie hilft auch kein Werkzeug weiter.",
    },
    {
      title: "Schritt 2: Aufgabe",
      url: "index.html#ansatz-title",
      keywords: ["aufgabe", "aufgaben", "zeitfresser", "wiederkehrend"],
      answer: "Welche wiederkehrenden Aufgaben kosten Zeit? Dort liegt der Ansatzpunkt für KI – nicht beim Werkzeug.",
    },
    {
      title: "Schritt 3: Arbeitsprozess",
      url: "index.html#ansatz-title",
      keywords: ["arbeitsprozess", "arbeitsablauf", "geschäftsprozess"],
      answer: "Wie läuft die Aufgabe heute ab? Erst ein klarer Ablauf zeigt, wo KI wirklich entlastet.",
    },
    {
      title: "Schritt 4: Verantwortung",
      url: "index.html#ansatz-title",
      keywords: ["verantwortung", "verantwortlich", "wer prüft", "haftung", "kontrolle"],
      answer: "Wer prüft das Ergebnis, welche Daten dürfen genutzt werden? Die Entscheidung bleibt beim Menschen.",
    },
    {
      title: "Schritt 5: geeignete KI",
      url: "index.html#ansatz-title",
      keywords: ["geeignete ki", "geeignet", "passende ki", "passendes werkzeug"],
      answer: "Erst jetzt wird das Werkzeug gewählt: passend zu Aufgabe, Daten und Team, nicht umgekehrt. Einen Überblick über Modelle gibt der KI-Kompass.",
      more: { label: "KI-Kompass: Modelle", url: "ki-kompass.html#modelle" },
    },
    {
      title: "Über Stefan Hansen",
      url: "index.html#ueber-mich",
      keywords: ["stefan", "hansen", "über dich", "über stefan", "person", "hintergrund", "erfahrung", "trainer", "berater", "lebenslauf", "wer steckt"],
      answer: "Stefan Hansen verbindet Management-Erfahrung mit dem pragmatischen Einsatz von KI. Sein Hintergrund: Organisationsentwicklung, Management und Vertrieb im Healthcaresektor.",
    },
    {
      title: "Anfragen",
      url: "index.html#kontakt",
      keywords: ["kontakt", "anfrag", "erstgespräch", "anruf", "telefon", "mail", "erreich", "melden", "schreiben"],
      answer: "Über das Kontaktformular kannst Du ein kostenloses Erstgespräch anfragen – ein unverbindliches Kennenlerngespräch am Telefon von etwa 15 Minuten. Danach weißt Du, welches Angebot passt, und entscheidest in Ruhe.",
    },
    {
      title: "Termin wählen",
      url: "index.html#kontakt",
      keywords: ["termin", "uhrzeit", "datum", "zeitfenster", "verfügbar", "buchen", "reservier", "kalender", "montag", "dienstag", "mittwoch", "donnerstag", "freitag", "wochenende", "verschieb", "absag"],
      // Nächste freie Termine aus config.js (termine), berechnet in termine.js
      answer: function () {
        var T = window.TERMINE;
        var free = T ? T.slots().filter(function (s) { return !s.blocked; }) : [];
        var base = "Feste Screening-Termine gibt es montags und mittwochs um 16:30 Uhr sowie dienstags und donnerstags um 9:00 Uhr, jeweils 15 Minuten. ";
        if (!free.length) return base + "In den nächsten zwei Wochen ist leider alles vergeben. Schick trotzdem eine Anfrage über das Kontaktformular – Stefan meldet sich bei Dir.";
        return base + "Als Nächstes frei: " + free.slice(0, 3).map(T.label).join("; ") + ". Im Kontaktbereich wählst Du über „Termin“ einen Zeitpunkt aus und sendest ihn mit Deiner Anfrage mit; Stefan bestätigt ihn dann. Verschieben oder absagen kannst Du per Nachricht an Stefan.";
      },
    },
    {
      title: "Preise",
      url: "index.html#mitarbeiter",
      keywords: ["preis", "kost", "euro", "teuer", "günstig", "budget", "honorar", "bezahl", "gebühr"],
      boost: 2, // Preisfragen haben Vorrang vor dem Angebot, nach dem gefragt wird
      // Antwort hängt von SHOW_PRICES in config.js ab
      answer: function (config) {
        var p = config.prices || {};
        if (config.SHOW_PRICES && p.learningOffer) {
          return "Das Kennenlernangebot für die Trainings kostet " + p.learningOffer + " €, der geplante reguläre Preis liegt bei " + p.regular + " €. Beratung für Unternehmen wird nach der Auftragsklärung individuell kalkuliert.";
        }
        return "Die Preise gibt es auf Anfrage. Das Screening im Erstgespräch ist kostenlos – dort klärt Stefan mit Dir, was passt und was es kostet.";
      },
      more: { label: "Anfragen", url: "index.html#kontakt" },
    },
    {
      title: "KI-Kompass: Welches Modell passt?",
      url: "ki-kompass.html#modelle",
      keywords: ["modell", "chatgpt", "gpt", "claude", "gemini", "llm", "sprachmodell", "beste", "vergleich", "ranking", "rangliste", "leaderboard", "arena", "copilot", "welche ki", "welches tool", "werkzeug"],
      answer: "Im KI-Kompass bewertest Du, welche Aufgaben Dir wichtig sind – zum Beispiel E-Mails, Planung oder Recherche. Daraus entstehen die drei passenden Modelle, auf Basis aktueller Arena-Daten.",
    },
    {
      title: "KI-Kompass: Welche Infrastruktur?",
      url: "ki-kompass.html#infrastruktur",
      keywords: ["infrastruktur", "architektur", "saas", "paas", "iaas", "rag", "cloud", "hosting", "server", "on-prem", "hybrid", "betreiben", "datenampel", "sicher", "datenschutz im unternehmen"],
      answer: "Der Infrastruktur-Wegweiser im KI-Kompass stellt acht kurze Fragen – erst zum Warum, dann zum Wie und zum Was – und empfiehlt eine passende Architektur, von SaaS bis Private Cloud.",
    },
    {
      title: "Datenschutzerklärung",
      url: "datenschutz.html",
      keywords: ["datenschutz", "dsgvo", "privacy", "cookie", "personenbezogen", "speicher"],
      answer: "Alles zum Umgang mit Deinen Daten auf dieser Website steht in der Datenschutzerklärung.",
    },
    {
      title: "Impressum",
      url: "impressum.html",
      keywords: ["impressum", "anbieter", "anschrift", "adresse", "verantwortlich", "rechtlich"],
      answer: "Die Anbieterangaben findest Du im Impressum.",
    },
  ],
};
