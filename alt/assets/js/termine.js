(function () {
  "use strict";

  /* ---------- Terminauswahl für das Screening ----------
     Termine und belegte Zeiten stehen in SITE_CONFIG.termine (config.js).
     window.TERMINE liefert die nächsten Termine auch für Paul (paul-wissen.js).
     Die Auswahl landet im Kontaktformular (verstecktes Feld „termin“) und in sessionStorage („termin“). */
  var config = (window.SITE_CONFIG || {}).termine || {};
  var WEEKDAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function key(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()); }
  function dateText(d) { return WEEKDAYS[d.getDay()] + ", " + d.getDate() + ". " + MONTHS[d.getMonth()]; }
  function timeText(d) { return pad(d.getHours()) + ":" + pad(d.getMinutes()) + " Uhr"; }
  function label(slot) { return dateText(slot.start) + ", " + timeText(slot.start); }

  // Nächste Termine im Zeitraum; vergebene und die ersten „blockFirst“ als „blocked“
  function slots(now) {
    now = now || new Date();
    var booked = config.booked || [];
    var list = [];
    for (var i = 0; i <= (config.days || 14); i++) {
      var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      (config.slots || []).forEach(function (s) {
        if (s.day !== day.getDay()) return;
        var hm = s.time.split(":");
        var start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), +hm[0], +hm[1]);
        if (start.getTime() <= now.getTime()) return;
        list.push({
          key: key(start), start: start, minutes: s.minutes,
          blocked: booked.indexOf(key(start)) !== -1,
        });
      });
    }
    list.sort(function (a, b) { return a.start - b.start; });
    list.slice(0, config.blockFirst || 0).forEach(function (s) { s.blocked = true; });
    return list.slice(0, config.show || 6);
  }

  window.TERMINE = { slots: slots, label: label };

  /* ---------- Dialog (nur auf der Startseite) ---------- */
  var dialog = document.getElementById("termin-dialog");
  var opener = document.querySelector("[data-open-termin]");
  if (!dialog || !opener) return;

  var list = dialog.querySelector(".termin-list");
  var today = dialog.querySelector(".termin-today");
  var field = document.getElementById("f-termin");
  var chosen = document.getElementById("termin-chosen");

  function load() { try { return sessionStorage.getItem("termin") || ""; } catch (err) { return ""; } }
  function save(value) { try { value ? sessionStorage.setItem("termin", value) : sessionStorage.removeItem("termin"); } catch (err) { /* ohne Speicher */ } }

  function choose(text) {
    field.value = text;
    save(text);
    chosen.hidden = !text;
    chosen.querySelector("strong").textContent = text;
    opener.textContent = text ? "Termin ändern" : "Termin vereinbaren";
  }

  function render() {
    var now = new Date();
    today.textContent = "Heute ist " + dateText(now) + " " + now.getFullYear() + ".";
    list.innerHTML = "";
    var items = slots(now);
    items.forEach(function (slot) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "termin-slot";
      btn.disabled = slot.blocked;
      btn.innerHTML = "<span></span><strong></strong><small></small>";
      btn.children[0].textContent = dateText(slot.start);
      btn.children[1].textContent = timeText(slot.start);
      btn.children[2].textContent = slot.blocked ? "vergeben" : slot.minutes + " Minuten";
      if (field.value === label(slot)) btn.classList.add("is-on");
      btn.addEventListener("click", function () {
        choose(label(slot));
        dialog.close();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
    if (!items.length) list.innerHTML = '<li class="termin-empty">Zurzeit sind keine Termine frei. Senden Sie einfach Ihre Anfrage – ich melde mich.</li>';
  }

  opener.addEventListener("click", function () {
    render();
    dialog.showModal();
  });
  dialog.querySelector(".check-close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  chosen.querySelector("button").addEventListener("click", function () { choose(""); });
  document.getElementById("contact-form").addEventListener("reset", function () { setTimeout(function () { choose(""); }); });

  choose(load());
})();
