// Zentrale Inhaltskonfiguration (PRD §36, §48).
// Änderungen hier wirken auf alle Seiten – keine zweite Website pflegen.
window.SITE_CONFIG = {
  // Modus A (true): Preise sichtbar · Modus B (false): Preise ausgeblendet
  SHOW_PRICES: false,

  prices: {
    learningOffer: 790,
    regular: 890,
    // "planned" = „Geplanter regulärer Preis 890 €“ (rechtlich unkritische Variante)
    // "strike"  = durchgestrichener Referenzpreis – erst nach rechtlicher Prüfung verwenden!
    referenceMode: "planned",
    // z. B. "zzgl. USt." oder Hinweis zur Kleinunternehmerregelung – vor Launch klären
    taxNote: "",
  },

  // Wenn SHOW_PRICES = false: "request" zeigt „Preis auf Anfrage“, "none" blendet das Preiselement aus
  PRICE_FALLBACK: "request",

  contact: {
    email: "",          // z. B. "kontakt@ai-work-lab.de" – aktiviert den E-Mail-Versand des Formulars
    phone: "",
    formEndpoint: "",   // optional: URL eines Formular-Dienstes (POST, FormData); hat Vorrang vor E-Mail
  },

  // Terminauswahl für das Screening (assets/js/termine.js) – Dialog im Kontaktbereich, Antworten von Paul
  termine: {
    // Feste Wochentermine: day 1 = Montag … 5 = Freitag, Uhrzeit, Blocklänge in Minuten
    slots: [
      { day: 1, time: "16:30", minutes: 15 },
      { day: 2, time: "09:00", minutes: 15 },
      { day: 3, time: "16:30", minutes: 15 },
      { day: 4, time: "09:00", minutes: 15 },
    ],
    show: 6,          // so viele Termine zeigt der Dialog
    days: 14,         // Zeitraum ab heute
    blockFirst: 2,    // die nächsten zwei Termine ab heute sind immer ausgegraut (Vorlauf)
    // Bereits vergebene Termine – werden ausgegraut. Format "JJJJ-MM-TT HH:MM", z. B. "2026-11-02 16:30"
    booked: [],
  },

  // Paul, der Website-Kater (assets/js/paul.js)
  paul: {
    // Leer = Paul antwortet aus assets/js/paul-wissen.js (keine Daten verlassen den Browser).
    // Optional: URL des Sprachmodell-Proxys (Cloudflare Worker, siehe proxy/README.md).
    // Paul sendet POST (JSON) { question, page, context: [{ title, url, answer }] } und erwartet
    // { answer: "…", links?: [{ label, url }] }. API-Schlüssel nie hier eintragen!
    // Vor Aktivierung Datenschutzerklärung ergänzen.
    endpoint: "https://paul-proxy.biese250.workers.dev",
    // Leises Schlecken, wenn Paul sich die Pfote leckt (false = stumm)
    sound: true,
  },
};
