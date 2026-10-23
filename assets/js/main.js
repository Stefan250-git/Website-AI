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

    // Katze, Blick nach rechts: sitzend (Kopf zum Betrachter, Schwanz um den Körper) und gestreckt im Sprung
    var EYE = "#9fd0bd";
    var cat = document.createElement("span");
    cat.className = "chain-cat";
    cat.setAttribute("aria-hidden", "true");
    cat.innerHTML =
      '<svg viewBox="0 0 40 40" fill="#16181d" stroke="#16181d" stroke-linecap="round">' +
      '<g class="pose-sit">' +
      '<path d="M10 38c-1-9 2-17 10-18 7 0 9 9 8 18z" stroke="none"/>' +
      '<path class="tail-wrap" pathLength="1" d="M10.5 32c-8 0-9.5 7.5-1.5 7.5h15c4.5 0 7-1.5 7-6" fill="none" stroke-width="2.8"/>' +
      '<circle cx="21" cy="15" r="7" stroke="none"/>' +
      '<path d="M14.5 11l.5-8 5.5 5zM22 8l5.5-5 .5 8z" stroke="none"/>' +
      '<ellipse class="eye" cx="18.3" cy="15" rx="1.6" ry="1.9" fill="' + EYE + '" stroke="none"/>' +
      '<ellipse class="eye" cx="23.7" cy="15" rx="1.6" ry="1.9" fill="' + EYE + '" stroke="none"/>' +
      '</g>' +
      '<g class="pose-leap">' +
      '<path d="M9 22.5C6 22 3 21.5-1 20.5" fill="none" stroke-width="2.6"/>' +
      '<path d="M8 24c2-5 9-7 16-6 4 1 6 3 6 5-1 3-7 4-13 4-5 0-8-1-9-3z" stroke="none"/>' +
      '<path d="M26 24l9 4M24 25l8 6M12 26l-8 4M14 27l-7 6" fill="none" stroke-width="2.6"/>' +
      '<circle cx="31" cy="18" r="5.6" stroke="none"/>' +
      '<path d="M27 15l1-6 4 4zM32 13l3-5 1 6z" stroke="none"/>' +
      '<ellipse cx="31.6" cy="17.4" rx="1.1" ry="1.3" fill="' + EYE + '" stroke="none"/>' +
      '<ellipse cx="34.3" cy="17.7" rx="1.1" ry="1.3" fill="' + EYE + '" stroke="none"/>' +
      '</g>' +
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

    var CROUCH = 170, FLIGHT = 540, LAND = 220;

    // Hinsetzen: Schwanz schwingt um den Körper, danach einmal blinzeln (CSS-Animationen)
    function sitDown() {
      cat.classList.remove("is-sitting");
      void cat.offsetWidth;
      cat.classList.add("is-sitting");
    }

    // Ein Sprung: ducken → gestreckt im Bogen fliegen (Neigung folgt der Flugbahn) → abfedern
    function jump(from, to) {
      jumping = true;
      var a = spot(from), b = spot(to);
      var dx = b.x - a.x, dy = b.y - a.y;
      // Flacher Bogen: bleibt im Freiraum über den Feldern (Text darüber, Nachbarfelder)
      var column = getComputedStyle(chain).flexDirection === "column";
      var height = column ? 10 : Math.min(32, Math.max(22, Math.abs(dx) * .18));
      var flip = dx < -1 ? -1 : 1;
      var start = null;

      function pose(rotate, sx, sy) {
        svg.style.transform = "scaleX(" + flip + ") rotate(" + rotate + "deg) scale(" + sx + "," + sy + ")";
      }

      return new Promise(function (resolve) {
        function frame(now) {
          if (start === null) start = now;
          var ms = now - start;

          if (ms < CROUCH) {
            if (ms > CROUCH / 2) cat.classList.remove("is-sitting");
            var c = Math.sin(ms / CROUCH * Math.PI / 2);
            place(a);
            pose(0, 1 + .12 * c, 1 - .24 * c);
          } else if (ms < CROUCH + FLIGHT) {
            var t = (ms - CROUCH) / FLIGHT;
            cat.classList.add("is-leaping");
            place({ x: a.x + dx * t, y: a.y + dy * t - height * 4 * t * (1 - t) });
            var vy = dy - height * 4 * (1 - 2 * t);
            var angle = Math.atan2(vy, Math.max(Math.abs(dx), 60)) * 180 / Math.PI;
            pose(Math.max(-40, Math.min(40, angle)), 1.05, .95);
          } else if (ms < CROUCH + FLIGHT + LAND) {
            var l = (ms - CROUCH - FLIGHT) / LAND;
            cat.classList.remove("is-leaping");
            place(b);
            var squash = Math.sin((1 - l) * Math.PI / 2);
            pose(0, 1 + .14 * squash, 1 - .22 * squash);
          } else {
            place(b);
            pose(0, 1, 1);
            sitDown();
            current = to;
            jumping = false;
            return resolve();
          }
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }

    // Hin: Feld für Feld, jedes Feld wird beim Landen grün.
    // Zurück: Feld für Feld, das verlassene Feld wird wieder weiß, die Linie verschwindet.
    function run() {
      var p = wait(400).then(function () {
        items[0].classList.add("is-on");
        return wait(700);
      });
      var i;
      for (i = 1; i <= last; i++) {
        (function (i) {
          p = p.then(function () {
            items[i].classList.add("is-linked");
            return jump(i - 1, i);
          }).then(function () {
            items[i].classList.add("is-on");
            return wait(i === last ? 1500 : 650);
          });
        })(i);
      }
      for (i = last; i >= 1; i--) {
        (function (i) {
          p = p.then(function () {
            items[i].classList.remove("is-on", "is-linked");
            return jump(i, i - 1);
          }).then(function () {
            return wait(650);
          });
        })(i);
      }
      p.then(function () {
        items[0].classList.remove("is-on");
        return wait(900);
      }).then(run);
    }

    chain.classList.add("is-animated");
    place(spot(0));
    sitDown();
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
