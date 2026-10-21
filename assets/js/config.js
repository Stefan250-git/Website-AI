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
};
