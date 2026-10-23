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

  /* ---------- Ablauf-Kette: Katze springt von Feld zu Feld (Endlosschleife) ---------- */
  var chain = document.querySelector(".chain");
  if (chain && window.Promise) initChainCat(chain);

  function initChainCat(chain) {
    var items = chain.querySelectorAll("li");
    var last = items.length - 1;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Bühne um die Liste, damit die Katze kein Kind des <ol> ist
    var stage = document.createElement("div");
    stage.className = "chain-stage";
    chain.parentNode.insertBefore(stage, chain);
    stage.appendChild(chain);

    // Sitzende Katze im Profil, Blick nach rechts
    var cat = document.createElement("span");
    cat.className = "chain-cat";
    cat.setAttribute("aria-hidden", "true");
    cat.innerHTML =
      '<svg viewBox="0 0 40 40" fill="#16181d">' +
      '<path d="M11 37c-7-1-9-8-4-12" fill="none" stroke="#16181d" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M9 38c-1-9 2-17 10-18 7 0 9 9 8 18z"/>' +
      '<circle cx="25" cy="15" r="7"/>' +
      '<path d="M19 12l1-8 5 5zM26 9l4-5 1 8z"/>' +
      '<circle cx="28.4" cy="14" r="1.2" fill="#9fd0bd"/>' +
      '</svg>';
    stage.appendChild(cat);
    var svg = cat.firstChild;
    var current = 0;
    var jumping = false;

    // Sitzplatz oben auf einem Feld; im Spaltenlayout (Smartphone) rechts, neben der Linie
    function spot(i) {
      var s = items[i].querySelector("span").getBoundingClientRect();
      var b = stage.getBoundingClientRect();
      var column = getComputedStyle(chain).flexDirection === "column";
      return { x: (column ? s.right - 26 : s.left + s.width / 2) - b.left, y: s.top - b.top + 2 };
    }

    function place(p) {
      cat.style.transform = "translate(" + (p.x - cat.offsetWidth / 2) + "px," + (p.y - cat.offsetHeight) + "px)";
    }

    function wait(ms) {
      return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    // Sprung im Bogen; Katze neigt sich beim Absprung nach oben und beim Landen nach unten
    function jump(from, to, duration, height) {
      jumping = true;
      var a = spot(from), b = spot(to);
      var flip = b.x < a.x - 1 ? -1 : 1;
      var start = null;
      return new Promise(function (resolve) {
        function frame(now) {
          if (start === null) start = now;
          var t = Math.min(1, (now - start) / duration);
          var e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          place({ x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e - height * 4 * t * (1 - t) });
          svg.style.transform = "scaleX(" + flip + ") rotate(" + (t - .5) * 36 + "deg) scaleY(" + (1 + .1 * Math.sin(Math.PI * t)) + ")";
          if (t < 1) return requestAnimationFrame(frame);
          svg.style.transform = "scaleX(" + flip + ")";
          cat.classList.remove("is-landing");
          void cat.offsetWidth;
          cat.classList.add("is-landing");
          current = to;
          jumping = false;
          resolve();
        }
        requestAnimationFrame(frame);
      });
    }

    function hopHeight(from, to) {
      var a = spot(from), b = spot(to);
      return Math.min(70, Math.max(34, Math.abs(b.x - a.x) * .35));
    }

    function run() {
      var p = wait(500).then(function () {
        items[0].classList.add("is-on");
        return wait(700);
      });
      for (var i = 1; i <= last; i++) {
        (function (i) {
          p = p.then(function () {
            items[i].classList.add("is-linked");
            return jump(i - 1, i, 620, hopHeight(i - 1, i));
          }).then(function () {
            items[i].classList.add("is-on");
            return wait(i === last ? 1600 : 420);
          });
        })(i);
      }
      // Großer Satz zurück zum Anfang; Felder und Linien setzen sich nacheinander zurück
      p.then(function () {
        for (var k = last; k >= 0; k--) {
          (function (k) {
            setTimeout(function () { items[k].classList.remove("is-on", "is-linked"); }, (last - k) * 90);
          })(k);
        }
        return jump(last, 0, 1000, 120);
      }).then(function () {
        return wait(800);
      }).then(run);
    }

    chain.classList.add("is-animated");
    place(spot(0));
    window.addEventListener("resize", function () { if (!jumping) place(spot(current)); });

    // Ohne Bewegung: Endzustand zeigen, Katze sitzt auf „geeignete KI“
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (li) { li.classList.add("is-on", "is-linked"); });
      current = last;
      place(spot(last));
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      run();
    }, { threshold: 0.6 });
    observer.observe(stage);
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
