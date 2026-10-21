(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};

  /* ---------- Navigation ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menü öffnen");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }

  document.querySelectorAll(".sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".has-sub");
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".has-sub.open").forEach(function (item) {
      item.classList.remove("open");
      item.querySelector(".sub-toggle").setAttribute("aria-expanded", "false");
    });
    if (nav && nav.classList.contains("open")) {
      closeNav();
      navToggle.focus();
    }
  });

  document.addEventListener("click", function (e) {
    document.querySelectorAll(".has-sub.open").forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove("open");
        item.querySelector(".sub-toggle").setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------- Preise (SHOW_PRICES) ---------- */
  var prices = config.prices || {};
  function euro(n) { return n + " €"; }

  document.querySelectorAll("[data-price]").forEach(function (el) {
    if (config.SHOW_PRICES) {
      var html;
      if (prices.referenceMode === "strike") {
        html = '<span class="price-main">Kennenlernangebot <del>' + euro(prices.regular) + "</del> " + euro(prices.learningOffer) + "</span>";
      } else {
        html = '<span class="price-main">Kennenlernangebot ' + euro(prices.learningOffer) + "</span>" +
               '<span class="price-ref">Geplanter regulärer Preis ' + euro(prices.regular) + "</span>";
      }
      if (prices.taxNote) html += '<span class="price-ref">' + prices.taxNote + "</span>";
      el.innerHTML = html;
    } else if (config.PRICE_FALLBACK === "none") {
      el.hidden = true;
    } else {
      el.innerHTML = '<span class="price-main">Preis auf Anfrage</span>';
    }
  });

  /* ---------- Ablauf-Kette: springender Punkt, sobald sichtbar ---------- */
  var chain = document.querySelector(".chain");
  if (chain && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    chain.classList.add("is-ready");
    var chainObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      chain.classList.add("is-playing");
      chainObserver.disconnect();
    }, { threshold: 0.6 });
    chainObserver.observe(chain);
  }

  /* ---------- Kontaktformular ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var topic = form.elements.topic;
  var company = form.elements.company;
  var companyHint = document.getElementById("company-required");
  var status = document.getElementById("form-status");
  var B2B_TOPICS = ["ki-start", "adult-b2b", "young-ausbildung", "wissensbasis"];

  function updateCompanyRequirement() {
    var required = B2B_TOPICS.indexOf(topic.value) !== -1;
    company.required = required;
    companyHint.hidden = !required;
    if (!required) clearError(company);
  }
  topic.addEventListener("change", updateCompanyRequirement);

  // CTA-Links mit data-topic wählen das passende Thema vor
  document.querySelectorAll("a[data-topic]").forEach(function (link) {
    link.addEventListener("click", function () {
      topic.value = link.getAttribute("data-topic");
      updateCompanyRequirement();
    });
  });

  var messages = {
    name: "Bitte geben Sie Ihren Namen an.",
    email: "Bitte geben Sie eine gültige E-Mail-Adresse an, z. B. name@firma.de.",
    topic: "Bitte wählen Sie ein Thema aus – „Noch unsicher“ ist ebenfalls möglich.",
    company: "Für Unternehmensangebote benötigen wir den Namen Ihres Unternehmens.",
    phone: "Bitte geben Sie eine Telefonnummer an, unter der ich Sie erreiche.",
    privacy: "Bitte bestätigen Sie den Datenschutzhinweis.",
  };

  function errorEl(field) { return document.getElementById(field.name + "-error"); }

  function showError(field) {
    field.setAttribute("aria-invalid", "true");
    var el = errorEl(field);
    if (el) el.textContent = messages[field.name] || "Bitte prüfen Sie diese Angabe.";
  }

  function clearError(field) {
    field.removeAttribute("aria-invalid");
    var el = errorEl(field);
    if (el) el.textContent = "";
  }

  var VALIDATED = ["company", "name", "email", "phone", "topic", "privacy"];

  VALIDATED.forEach(function (name) {
    var field = form.elements[name];
    field.addEventListener(field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "blur", function () {
      if (field.checkValidity()) clearError(field);
    });
  });

  function setStatus(text, type) {
    status.textContent = text;
    status.className = "form-status" + (type ? " is-" + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("");

    var firstInvalid = null;
    VALIDATED.forEach(function (name) {
      var field = form.elements[name];
      if (field.checkValidity()) {
        clearError(field);
      } else {
        showError(field);
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      setStatus("Bitte prüfen Sie die markierten Felder.", "error");
      firstInvalid.focus();
      return;
    }

    var contact = config.contact || {};
    var data = new FormData(form);
    data.set("topic", topic.options[topic.selectedIndex].text);

    if (contact.formEndpoint) {
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      fetch(contact.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          updateCompanyRequirement();
          setStatus("Vielen Dank. Ihre Anfrage ist angekommen – ich melde mich zur Terminabstimmung für das Screening.", "success");
        })
        .catch(function () {
          setStatus("Die Anfrage konnte leider nicht gesendet werden. Bitte versuchen Sie es später erneut.", "error");
        })
        .then(function () { button.disabled = false; });
      return;
    }

    if (contact.email) {
      var lines = [
        "Name: " + data.get("name"),
        "E-Mail: " + data.get("email"),
        "Thema: " + data.get("topic"),
        "Unternehmen: " + (data.get("company") || "–"),
        "Telefon: " + data.get("phone"),
        "",
        data.get("message") || "",
      ];
      window.location.href = "mailto:" + contact.email +
        "?subject=" + encodeURIComponent("Anfrage Erstgespräch: " + data.get("topic")) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      setStatus("Ihr E-Mail-Programm wurde mit der vorbereiteten Anfrage geöffnet.", "success");
      return;
    }

    setStatus("Der Versand ist noch nicht eingerichtet (Kontaktdaten in assets/js/config.js ergänzen).", "error");
  });

  updateCompanyRequirement();
})();
