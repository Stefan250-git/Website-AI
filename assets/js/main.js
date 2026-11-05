(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};

  /* ---------- Kopf: nach dem ersten Scrollen kompakter Anfrage-Knopf (html.is-scrolled) ---------- */
  var scrollTick = false;
  var markScrolled = function () {
    scrollTick = false;
    document.documentElement.classList.toggle("is-scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", function () {
    if (!scrollTick) { scrollTick = true; requestAnimationFrame(markScrolled); }
  }, { passive: true });
  markScrolled();

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

  // „Mehr über mich“: Klick/Tippen öffnet und schließt die Quickinfo, Escape und Klick daneben schließen
  var aboutMore = document.querySelector(".about-more");
  if (aboutMore) {
    var aboutBtn = aboutMore.querySelector(".about-more-btn");
    var setAbout = function (open) {
      aboutMore.classList.toggle("is-open", open);
      aboutBtn.setAttribute("aria-expanded", String(open));
    };
    aboutBtn.addEventListener("click", function () { setAbout(!aboutMore.classList.contains("is-open")); });
    document.addEventListener("click", function (e) { if (!aboutMore.contains(e.target)) setAbout(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setAbout(false); });
  }

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

    // Katze mit Pauls Gesicht: sitzend (Kopf zum Betrachter, Schwanz um den Körper) und gestreckt im Sprung
    var EYE = "#9fd0bd";
    // Auge wie bei Paul (paul.js): grün, große dunkle Pupille, Glanzpunkt
    function paulEye(x, y, r) {
      return '<g class="eye">' +
        '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r * 1.12) + '" fill="' + EYE + '" stroke="none"/>' +
        '<ellipse cx="' + (x + r * .12) + '" cy="' + (y + r * .16) + '" rx="' + (r * .6) + '" ry="' + (r * .74) + '" fill="#0d1d37" stroke="none"/>' +
        '<circle cx="' + (x + r * .4) + '" cy="' + (y - r * .32) + '" r="' + (r * .28) + '" fill="#fff" stroke="none"/>' +
        "</g>";
    }
    var cat = document.createElement("span");
    cat.className = "chain-cat";
    cat.setAttribute("aria-hidden", "true");
    cat.innerHTML =
      '<svg viewBox="0 0 40 40" fill="#16181d" stroke="#16181d" stroke-linecap="round">' +
      '<g class="pose-sit">' +
      '<path d="M10 38c-1-9 2-17 10-18 7 0 9 9 8 18z" stroke="none"/>' +
      '<path class="tail-wrap" pathLength="1" d="M10.5 32c-8 0-9.5 7.5-1.5 7.5h15c4.5 0 7-1.5 7-6" fill="none" stroke-width="2.8"/>' +
      '<path d="M13.5 11.5l.4-9 6 5zM22.1 7.5l6-5 .4 9z" stroke="none"/>' +
      '<ellipse cx="21" cy="15" rx="9" ry="8" stroke="none"/>' +
      paulEye(17.6, 15.2, 2.5) + paulEye(24.4, 15.2, 2.5) +
      '<path d="M19.5 19.2q.75.8 1.5 0 .75.8 1.5 0" fill="none" stroke="#454a54" stroke-width=".6"/>' +
      '</g>' +
      '<g class="pose-leap">' +
      '<path d="M9 22.5C6 22 3 21.5-1 20.5" fill="none" stroke-width="2.6"/>' +
      '<path d="M8 24c2-5 9-7 16-6 4 1 6 3 6 5-1 3-7 4-13 4-5 0-8-1-9-3z" stroke="none"/>' +
      '<path d="M26 24l9 4M24 25l8 6M12 26l-8 4M14 27l-7 6" fill="none" stroke-width="2.6"/>' +
      '<path d="M26.5 15.5l1-6.5 4.5 4.2zM32 13l3.4-5.4 1 6.6z" stroke="none"/>' +
      '<ellipse cx="31.5" cy="18" rx="6.6" ry="6" stroke="none"/>' +
      paulEye(30.4, 17.6, 1.7) + paulEye(34.4, 17.9, 1.7) +
      '</g>' +
      '</svg>';
    stage.appendChild(cat);

    // Kurzinfo je Feld (Text aus data-info): als Blase unter dem Feld,
    // auf dem Smartphone in einem Kasten unter der Kette
    var infoBox = document.createElement("p");
    infoBox.className = "chain-info";
    infoBox.setAttribute("aria-live", "polite");
    stage.insertBefore(infoBox, cat);
    items.forEach(function (li, k) {
      var text = li.getAttribute("data-info");
      if (!text) return;
      var tip = document.createElement("span");
      tip.className = "chain-tip";
      tip.textContent = text;
      li.querySelector("span").appendChild(tip);
      li.addEventListener("click", function () { info(k); });
    });

    function info(i) {
      items.forEach(function (li, k) { li.classList.toggle("is-info", k === i); });
      infoBox.textContent = i >= 0 ? items[i].getAttribute("data-info") || "" : "";
      infoBox.classList.toggle("is-visible", i >= 0);
    }

    var SIT = 3000, SIT_LAST = 3500; // Sitzzeit je Feld, damit die Kurzinfo gelesen werden kann
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
        info(0);
        return wait(SIT);
      });
      var i;
      for (i = 1; i <= last; i++) {
        (function (i) {
          p = p.then(function () {
            info(-1);
            items[i].classList.add("is-linked");
            return jump(i - 1, i);
          }).then(function () {
            items[i].classList.add("is-on");
            info(i);
            return wait(i === last ? SIT_LAST : SIT);
          });
        })(i);
      }
      for (i = last; i >= 1; i--) {
        (function (i) {
          p = p.then(function () {
            info(-1);
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

  // CSS-Variable nur schreiben, wenn sich der Wert ändert (spart Stil-Neuberechnung beim Scrollen)
  var setVarC = function (el, name, v) {
    var key = "_v" + name;
    if (el[key] === v) return;
    el[key] = v;
    el.style.setProperty(name, v);
  };

  /* ---------- Startseite: Foto bleibt stehen, Verläufe beim Scrollen ---------- */
  var hero = document.querySelector(".hero-full");
  var heroMedia = hero && hero.querySelector(".hero-media");
  var heroText = hero && (hero.querySelector(".hero-cta") || hero.querySelector(".split")); // unterster Text im Startbild
  if (heroMedia && heroText) {
    var heroTicking = false;
    var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };
    var heroMix = function () {
      heroTicking = false;
      if (window.scrollY > hero.offsetTop + hero.offsetHeight + window.innerHeight) return; // weit unterhalb: nichts zu tun
      var mediaTop = heroMedia.getBoundingClientRect().top;
      // Heller Verlauf bleibt, solange Text da ist; tritt zurück, wenn der Text oben verschwindet
      var textLeft = (heroText.getBoundingClientRect().bottom - mediaTop) / (heroMedia.offsetHeight * 0.4);
      setVarC(hero, "--hero-veil", clamp01(1 - textLeft).toFixed(3));
      // Kurz bevor das Foto freigegeben wird: nach unten weich ins Weiß auslaufen
      var holdLeft = hero.getBoundingClientRect().bottom - heroMedia.getBoundingClientRect().bottom;
      setVarC(hero, "--hero-out", clamp01(1 - holdLeft / (heroMedia.offsetHeight * 0.6)).toFixed(3));
    };
    var heroRequest = function () {
      if (heroTicking) return;
      heroTicking = true;
      window.requestAnimationFrame(heroMix);
    };
    window.addEventListener("scroll", heroRequest, { passive: true });
    window.addEventListener("resize", heroRequest);
    heroMix();
  }

  /* ---------- Europa bei Nacht: Foto bleibt stehen, blendet weich ein und aus ---------- */
  var euStage = document.querySelector(".eu-stage");
  var euMedia = euStage && euStage.querySelector(".eu-media");
  if (euMedia) {
    var euTicking = false;
    var euFade = function () {
      euTicking = false;
      var h = euMedia.offsetHeight;
      var stage = euStage.getBoundingClientRect();
      if (stage.bottom < -h || stage.top > window.innerHeight + h) return; // weit außerhalb: Werte bleiben, wie sie sind
      var top = euMedia.getBoundingClientRect().top;
      var line = parseFloat(getComputedStyle(euMedia).top) || 0; // Klebelinie unter dem Header
      var fit = function (v) { return Math.min(1, Math.max(0, v)).toFixed(3); };
      // 0, solange die Bühne von unten hereinkommt (oberer Verlauf über dem Startfoto), 1, sobald das Foto steht
      var euIn = fit(1 - (stage.top - line) / (h * 0.7));
      setVarC(euStage, "--eu-in", euIn);
      // Erst am Ende (Tafeln durchgelaufen): auf der letzten Viertel-Bildhöhe nach unten ins Weiß auslaufen
      var euOut = fit(1 - (stage.bottom - (top + h)) / (h * 0.25));
      setVarC(euStage, "--eu-out", euOut);
      // Foto deckt den unteren Bildschirmrand (Pauls Platz): nur dann zählt es für Pauls Lampe als dunkel
      euStage.classList.toggle("is-shown", euIn > 0.5 && euOut < 0.3);
    };
    var euRequest = function () {
      if (euTicking) return;
      euTicking = true;
      window.requestAnimationFrame(euFade);
    };
    window.addEventListener("scroll", euRequest, { passive: true });
    window.addEventListener("resize", euRequest);
    euFade();
  }

  /* ---------- Foto-Bühnen (.photo-stage): Foto bleibt stehen, blendet oben ein und unten ins Weiß aus ---------- */
  var photoStages = document.querySelectorAll(".photo-stage");
  if (photoStages.length) {
    var stTicking = false;
    var stFade = function () {
      stTicking = false;
      Array.prototype.forEach.call(photoStages, function (st) {
        var media = st.querySelector(".photo-stage-media");
        var h = media.offsetHeight;
        var box = st.getBoundingClientRect();
        if (box.bottom < 0 || box.top > window.innerHeight) return;
        var top = media.getBoundingClientRect().top;
        var line = parseFloat(getComputedStyle(media).top) || 0;
        var fit = function (v) { return Math.min(1, Math.max(0, v)).toFixed(3); };
        setVarC(st, "--st-in", fit(1 - (box.top - line) / (h * 0.6)));
        setVarC(st, "--st-out", fit(1 - (box.bottom - (top + h)) / (h * 0.3)));
      });
    };
    var stRequest = function () {
      if (stTicking) return;
      stTicking = true;
      window.requestAnimationFrame(stFade);
    };
    window.addEventListener("scroll", stRequest, { passive: true });
    window.addEventListener("resize", stRequest);
    stFade();
  }

  /* ---------- Mein Netzwerk: Seitenfeld statt eigener Seite (ohne JS/Dialog: netzwerk.html) ---------- */
  var nwDialog = document.getElementById("nw-dialog");
  var nwOpener = document.querySelector("[data-open-netzwerk]");
  if (nwDialog && nwOpener && typeof nwDialog.showModal === "function") {
    nwOpener.addEventListener("click", function (e) {
      e.preventDefault();
      nwDialog.showModal();
      nwDialog.querySelector(".nw-scroll").scrollTop = 0;
    });
    nwDialog.querySelector(".nw-close").addEventListener("click", function () { nwDialog.close(); });
    // Klick auf den abgedunkelten Bereich links schließt ebenfalls (Esc schließt der Dialog selbst)
    nwDialog.addEventListener("click", function (e) { if (e.target === nwDialog) nwDialog.close(); });
    nwDialog.addEventListener("close", function () { nwOpener.focus(); });

    // Ablauf beim Scrollen:
    // 1. Fotorahmen bleibt oben stehen und schiebt sich zusammen (--nw-s 0 → 1).
    // 2. Kopf läuft darunter und verschmilzt mit dem Fotorahmen zu einer Einheit (--nw-j: Ecken und Schatten
    //    an der Naht verschwinden); beim Weiterscrollen blenden Kicker und Einleitung aus (--nw-h1),
    //    dann wird der Kopf kleiner (--nw-h2).
    // 3. Darunter kommen die drei Kacheln und „Uns verbindet“.
    // Modus „stack“: alles passt in die Höhe → Kacheln und „Uns verbindet“ bleiben unter der Einheit stehen.
    // Modus „unit“: nur die Einheit bleibt stehen, Kacheln und „Uns verbindet“ laufen darunter durch.
    // Modus „none“ (Handy): nur der Fotorahmen bleibt stehen.
    var nwScroll = nwDialog.querySelector(".nw-scroll");
    var nwPeople = nwDialog.querySelector(".nw-people");
    var nwHero = nwDialog.querySelector(".nw-hero");
    var nwBody = nwDialog.querySelector(".nw-body");
    var nwBond = nwDialog.querySelector(".nw-bond");
    var NW_GAP = 16;     // Abstand unter der Einheit und zwischen den Rahmen
    var NW_HOLD = 220;   // Scrollstrecke nach dem Andocken, auf der die Einleitung noch ganz lesbar stehen bleibt
    var NW_RUN = 300;    // danach: Einleitung blendet aus, Kopf wird kleiner
    var nwMode = "none";
    var nwHeroFull = 0;
    var nwPeopleFull = 0;
    // Abstand vor den Kacheln: Scrollstrecke plus das, was Fotorahmen und Kopf beim Schrumpfen verlieren –
    // so bleibt die Gesamthöhe gleich und auch große Sprünge (Ende-Taste) landen im Endzustand
    var nwRunway = function () { return NW_HOLD + NW_RUN + 24 + nwHeroFull - nwHero.offsetHeight + nwPeopleFull - nwPeople.offsetHeight; };
    var nwTicking = false;
    // Platz am Ende als eigenes Element (nicht als Innenabstand): stehende Rahmen bleiben nur innerhalb
    // des Inhalts stehen, im Innenabstand würden sie wieder nach oben wandern
    var nwEnd = document.createElement("div");
    nwEnd.setAttribute("aria-hidden", "true");
    nwScroll.appendChild(nwEnd);
    var clamp01 = function (v) { return Math.min(1, Math.max(0, v)); };
    var px = function (el, prop) { return parseFloat(getComputedStyle(el)[prop]) || 0; };
    // Werte nur schreiben, wenn sie sich ändern (jede Änderung lässt den Browser Stile neu berechnen)
    var nwVar = function (el, name, v) {
      var key = "_nw" + name;
      if (el[key] === v) return;
      el[key] = v;
      el.style.setProperty(name, v);
    };
    var nwPx = function (el, prop, v) {
      var val = Math.round(v * 10) / 10 + "px";
      if (el.style[prop] !== val) el.style[prop] = val;
    };
    var nwSet = function (s, h, j) {
      nwVar(nwPeople, "--nw-s", s.toFixed(3));
      nwVar(nwHero, "--nw-h1", clamp01(h / 0.5).toFixed(3));          // ausblenden
      nwVar(nwHero, "--nw-h2", clamp01((h - 0.4) / 0.6).toFixed(3));  // zusammenziehen
      nwVar(nwHero, "--nw-t", clamp01((h - 0.4) / 0.3).toFixed(3));    // Titelschrift kleiner
      nwVar(nwHero, "--nw-mx", clamp01((h - 0.7) / 0.15).toFixed(3));  // zweite Zeile nach rechts …
      nwVar(nwHero, "--nw-my", clamp01((h - 0.85) / 0.15).toFixed(3)); // … und hoch neben die erste
      nwVar(nwScroll, "--nw-j", j.toFixed(3));
    };
    var nwStart = 88, nwHeroGap = 24, nwBondGap = 24, nwSafe = 0;
    // Pro Bild nur eine Layout-Berechnung: erst alle Werte aus der Scrollposition schreiben, dann einmal Höhen lesen,
    // dann Lagen schreiben. Lage des Kopfes: Er dockt an, sobald scrollTop die Strecke bis unter die Fotos zurückgelegt hat.
    var nwUpdate = function () {
      nwTicking = false;
      var st = nwScroll.scrollTop;
      var s = clamp01((st - nwStart) / 160);
      if (nwMode === "none") { nwSet(s, 0, 0); return; }
      var d = Math.max(-nwHeroGap, st - nwStart - nwHeroGap);   // wie weit der Kopf über seine Haltelinie gescrollt ist
      nwSet(s, clamp01((d - NW_HOLD) / NW_RUN), 1 - clamp01(-d / nwHeroGap));
      var peopleH = nwPeople.offsetHeight, heroH = nwHero.offsetHeight, bodyH = nwBody.offsetHeight;
      nwPx(nwHero, "top", peopleH);
      // Abstand vor den Kacheln gleicht das Schrumpfen von Fotos und Kopf aus – die Gesamthöhe bleibt gleich
      nwPx(nwBody, "marginTop", NW_HOLD + NW_RUN + 24 + nwHeroFull - heroH + nwPeopleFull - peopleH);
      if (nwMode === "stack") {
        var bodyTop = peopleH + heroH + NW_GAP;
        nwPx(nwBody, "top", bodyTop);
        nwPx(nwBond, "top", bodyTop + bodyH + nwBondGap);
      }
      // nur am Ende nötig: ein Zwischenlayout kann die Scrollposition gekürzt haben
      if (st > nwSafe && nwScroll.scrollTop !== st) nwScroll.scrollTop = st;
    };
    var nwFit = function () {
      nwScroll.classList.remove("nw-stack", "nw-unit", "nw-tight");
      nwScroll.style.paddingBottom = "0px";
      nwHero.style.top = ""; nwBody.style.top = ""; nwBond.style.top = ""; nwBody.style.marginTop = "";
      [nwPeople, nwHero, nwScroll].forEach(function (el) { Object.keys(el).forEach(function (k) { if (k.indexOf("_nw") === 0) delete el[k]; }); });
      // Endzustand messen: alles zusammengeschoben
      nwSet(0, 0, 1);
      // Breite der ersten Titelzeile plus Wortabstand, in em (für das Nebeneinander im zusammengezogenen Kopf)
      var nwTitle = nwHero.querySelector(".nw-title");
      var l1 = nwHero.querySelector(".nw-l1");
      if (l1) nwHero.style.setProperty("--nw-l1", (l1.offsetWidth / px(nwTitle, "fontSize") + 0.28).toFixed(3));
      nwPeopleFull = nwPeople.offsetHeight;
      nwSet(1, 0, 1);
      nwHeroFull = nwHero.offsetHeight;
      nwSet(1, 1, 1);
      var peopleH = nwPeople.offsetHeight, heroH = nwHero.offsetHeight, bodyH, bondH, bondGap, bondTop;
      var view = nwScroll.clientHeight;
      var unitH = peopleH + heroH;
      var measure = function () {
        bodyH = nwBody.offsetHeight; bondH = nwBond.offsetHeight; bondGap = px(nwBond, "marginTop");
        bondTop = unitH + NW_GAP + bodyH + bondGap;
        return bondTop + bondH + NW_GAP <= view;
      };
      var fits = measure();
      // wenig Höhe: Kacheln und „Uns verbindet“ enger setzen, damit sie trotzdem unter der Einheit stehen bleiben
      if (!fits && window.innerWidth > 600) {
        nwScroll.classList.add("nw-tight");
        fits = measure();
        if (!fits) { nwScroll.classList.remove("nw-tight"); measure(); }
      }
      if (window.innerWidth <= 600) nwMode = "none";
      else if (fits) nwMode = "stack";
      else if (unitH <= view * 0.55) nwMode = "unit";
      else nwMode = "none";
      if (nwMode === "stack") {
        nwScroll.classList.add("nw-stack");
        nwEnd.style.height = Math.max(24, view - bondTop - bondH) + "px";
      } else if (nwMode === "unit") {
        nwScroll.classList.add("nw-unit");
        // am Ende steht „Uns verbindet“ vollständig unter der Einheit
        nwEnd.style.height = Math.max(24, view - unitH - NW_GAP - bondH) + "px";
      } else {
        nwEnd.style.height = Math.max(24, view - peopleH - NW_GAP - bodyH - bondGap - bondH) + "px";
      }
      if (nwMode !== "none") nwBody.style.marginTop = nwRunway() + "px";
      nwStart = px(nwPeople, "marginTop") - px(nwPeople, "top");
      nwHeroGap = px(nwHero, "marginTop") || 24;
      nwBondGap = px(nwBond, "marginTop");
      nwSafe = nwScroll.scrollHeight - view - 700;
      nwUpdate();
    };
    nwScroll.addEventListener("scroll", function () {
      if (!nwTicking) { nwTicking = true; requestAnimationFrame(nwUpdate); }
    }, { passive: true });
    nwOpener.addEventListener("click", nwFit);
    if (window.ResizeObserver) {
      new ResizeObserver(function () { if (nwDialog.open) nwFit(); }).observe(nwScroll);
    } else {
      window.addEventListener("resize", function () { if (nwDialog.open) nwFit(); });
    }
  }

  /* ---------- Grafiken bauen sich beim Hineinscrollen auf ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add("is-armed");
      revealObserver.observe(el);
    });
  }

  /* ---------- Kontaktformular ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var topic = form.elements.topic;
  var company = form.elements.company;
  var companyHint = document.getElementById("company-required");
  var status = document.getElementById("form-status");
  var B2B_TOPICS = ["unternehmen"];

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
    topic: "Bitte wählen Sie ein Thema aus.",
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

  /* ---------- Ergebnis des Unternehmens-KI-Checks als sichtbarer Anhang (ki-check.js) ---------- */
  var attach = document.getElementById("check-attach");
  var attachBody = document.getElementById("check-attach-body");
  var attachToggle = document.getElementById("f-check");

  /* Ausgefüllt (Zusammenfassung in sessionStorage): Ergebnis sichtbar, Haken gesetzt.
     Nicht ausgefüllt: kein Haken, „mitsenden?“. Haken setzen öffnet den Check; wird er ohne Abschluss
     geschlossen, fällt der Haken weg und Quickinfo plus Hinweis erklären, dass nichts mitgeschickt wird. */
  var attachQ = document.getElementById("check-attach-q");
  var attachTip = document.getElementById("check-attach-tip");
  var attachNote = document.getElementById("check-attach-note");
  var checkDialog = document.getElementById("ki-check");
  var openedFromForm = false;
  var tipTimer = null;

  function checkSummary() {
    try { return (JSON.parse(sessionStorage.getItem("ki-check") || "null") || {}).summary || ""; } catch (err) { return ""; }
  }

  function showCheckAttachment() {
    if (!attach) return;
    if (!checkDialog || typeof checkDialog.showModal !== "function") return;
    var text = checkSummary();
    attach.hidden = false;
    attachBody.hidden = !text;
    attachBody.textContent = text;
    attachQ.hidden = !!text;
    if (text) { attachToggle.checked = true; attachNote.hidden = true; hideTip(); }
    else attachToggle.checked = false;
  }

  function showTip(ms) {
    clearTimeout(tipTimer);
    attachTip.hidden = false;
    if (ms) tipTimer = setTimeout(hideTip, ms);
  }
  function hideTip() {
    clearTimeout(tipTimer);
    attachTip.hidden = true;
  }

  if (attach) {
    showCheckAttachment();
    document.addEventListener("kicheck:done", showCheckAttachment);

    attachToggle.addEventListener("change", function () {
      if (!attachToggle.checked || checkSummary() || !window.KiCheck) return;
      openedFromForm = true;
      hideTip();
      window.KiCheck.open();
    });

    if (checkDialog) checkDialog.addEventListener("close", function () {
      if (!openedFromForm) return;
      openedFromForm = false;
      showCheckAttachment();
      if (checkSummary()) return;
      attachNote.hidden = false;
      showTip(6000);
    });

    attachQ.addEventListener("mouseenter", function () { showTip(); });
    attachQ.addEventListener("mouseleave", hideTip);
  }

  function checkAttachment() {
    return attach && !attach.hidden && attachToggle.checked ? checkSummary() : "";
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
      setStatus("Bitte füllen Sie alle Pflichtfelder (*) aus – nur dann kann ich Kontakt zu Ihnen aufnehmen.", "error");
      firstInvalid.focus();
      return;
    }

    var contact = config.contact || {};
    var data = new FormData(form);
    data.set("topic", topic.options[topic.selectedIndex].text);
    var checkText = checkAttachment();
    if (checkText) data.set("ki_check", checkText);

    if (contact.formEndpoint) {
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      fetch(contact.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          updateCompanyRequirement();
          setStatus(data.get("termin")
            ? "Vielen Dank. Ihre Anfrage ist angekommen – ich bestätige Ihnen den Termin " + data.get("termin") + "."
            : "Vielen Dank. Ihre Anfrage ist angekommen – ich melde mich zur Terminabstimmung für das Screening.", "success");
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
        "Wunschtermin Screening: " + (data.get("termin") || "–"),
        "",
        data.get("message") || "",
      ];
      if (checkText) lines.push("", "Unternehmens-KI-Check:", checkText);
      window.location.href = "mailto:" + contact.email +
        "?subject=" + encodeURIComponent("Anfrage Erstgespräch: " + data.get("topic")) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      setStatus("Ihr E-Mail-Programm wurde mit der vorbereiteten Anfrage geöffnet.", "success");
      return;
    }

    setStatus("Der Versand ist noch nicht eingerichtet (Kontaktdaten in assets/js/config.js ergänzen).", "error");
  });

  updateCompanyRequirement();

  /* ---------- KI-Kennzeichnung: Wassertropfen unter der Maus ----------
     Buchstaben werden einzeln gekapselt; nahe am Mauszeiger wölben sie sich auf (Lupe),
     dazu ein heller Glanzpunkt (--mx/--my/--drop in styles.css). Bei „reduzierte Bewegung“ aus. */
  var aiNote = document.querySelector(".ai-note");
  if (aiNote && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var DROP_RADIUS = 15, DROP_SCALE = 0.6; /* passend zum Tropfen (26 px, styles.css .ai-note::after) */
    var aiChars = [];
    aiNote.querySelectorAll("span").forEach(function (part) {
      var text = part.textContent;
      part.textContent = "";
      text.split("").forEach(function (ch) {
        if (ch === " ") { part.appendChild(document.createTextNode(" ")); return; }
        var span = document.createElement("span");
        span.className = "ai-ch";
        span.textContent = ch;
        part.appendChild(span);
        aiChars.push(span);
      });
    });

    aiNote.addEventListener("mousemove", function (e) {
      var box = aiNote.getBoundingClientRect();
      var x = e.clientX - box.left, y = e.clientY - box.top;
      aiNote.style.setProperty("--mx", x + "px");
      aiNote.style.setProperty("--my", y + "px");
      aiNote.style.setProperty("--drop", "1");
      aiChars.forEach(function (span) {
        var cx = span.offsetLeft + span.offsetWidth / 2, cy = span.offsetTop + span.offsetHeight / 2;
        var d = Math.sqrt((cx - x) * (cx - x) + (cy - y) * (cy - y));
        var k = d < DROP_RADIUS ? Math.cos((d / DROP_RADIUS) * Math.PI / 2) : 0;
        span.style.transform = k ? "translateY(" + (-1.5 * k) + "px) scale(" + (1 + DROP_SCALE * k * k) + ")" : "";
      });
    });
    aiNote.addEventListener("mouseleave", function () {
      aiNote.style.setProperty("--drop", "0");
      aiChars.forEach(function (span) { span.style.transform = ""; });
    });
  }
})();
