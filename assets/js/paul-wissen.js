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
  fallbackLink: { label: "Erstgespräch anfragen", url: "index.html#kontakt" },

  // Kurze Unterhaltung (regulärer Ausdruck auf die kleingeschriebene Frage)
  smalltalk: [
    { match: "^(hallo|hi|hey|moin|servus|guten (morgen|tag|abend))\\b", answer: "Hallo! Schön, dass Du da bist. Frag mich zum Beispiel nach den Angeboten, den Preisen oder dem KI-Kompass." },
    { match: "wer bist du|was bist du|wie heisst du|wer ist paul|^paul$", answer: "Ich bin Paul, der Website-Kater von Stefan Hansen. Ich kenne die Inhalte dieser Seite und springe mit Dir direkt an die passende Stelle." },
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
      keywords: ["wissen", "wissensbasis", "geschäftswissen", "dokumentation", "ablage", "suchen", "finden", "version", "einarbeitung", "onboarding", "intranet"],
      answer: "Bei der Wissensbasis wird Unternehmenswissen so geordnet, dass es auffindbar wird: Welche Quelle gilt, und wer pflegt sie? Erst dann kann KI beim Finden und Zusammenfassen helfen.",
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
      keywords: ["vorgehen", "ansatz", "methode", "ablauf", "verantwortung", "arbeitsweise", "prinzip", "philosophie"],
      answer: "Es geht nicht beim Werkzeug los, sondern bei Deinen täglichen Aufgaben: Mensch → Aufgabe → Arbeitsprozess → Verantwortung → geeignete KI.",
    },
    {
      title: "Über Stefan Hansen",
      url: "index.html#ueber-mich",
      keywords: ["stefan", "hansen", "über dich", "über stefan", "person", "hintergrund", "erfahrung", "trainer", "berater", "lebenslauf", "wer steckt"],
      answer: "Stefan Hansen verbindet Management-Erfahrung mit dem pragmatischen Einsatz von KI. Sein Hintergrund: Organisationsentwicklung, Management und Vertrieb im Healthcaresektor.",
    },
    {
      title: "Erstgespräch anfragen",
      url: "index.html#kontakt",
      keywords: ["kontakt", "anfrag", "erstgespräch", "termin", "anruf", "telefon", "mail", "erreich", "melden", "buchen", "schreiben"],
      answer: "Über das Kontaktformular kannst Du ein kostenloses Erstgespräch anfragen – ein Screening von etwa 15 Minuten. Danach weißt Du, welches Angebot passt, und entscheidest in Ruhe.",
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
      more: { label: "Erstgespräch anfragen", url: "index.html#kontakt" },
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
