(function () {
  "use strict";

  function yorkMonth() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      month: "numeric",
    }).formatToParts(new Date());
    var m = parts.find(function (p) {
      return p.type === "month";
    });
    return parseInt(m.value, 10);
  }

  function chipFor(el, month) {
    if (el.getAttribute("data-garden") === "1") return "Garden colonizer";
    if (month === 8) return el.getAttribute("data-august-chip");
    var peak = (el.getAttribute("data-peak") || "")
      .split(",")
      .filter(Boolean)
      .map(Number);
    var flight = (el.getAttribute("data-flight") || "")
      .split(",")
      .filter(Boolean)
      .map(Number);
    if (peak.indexOf(month) !== -1) return "Common now";
    if (flight.indexOf(month) !== -1) return "Possible";
    return "Unlikely this month";
  }

  function chipClass(label) {
    if (label === "Common now") return "chip chip-common";
    if (label === "Possible") return "chip chip-possible";
    if (label === "Unlikely this month") return "chip chip-unlikely";
    if (label === "Garden colonizer") return "chip chip-colonizer";
    return "chip";
  }

  function applyChip(el, month) {
    var node = el.querySelector("[data-chip]");
    if (!node) return;
    var label = chipFor(el, month);
    node.textContent = label;
    node.className = chipClass(label);
    el.setAttribute("data-chip-now", label);
  }

  function selectedIn(root, group) {
    return Array.prototype.map
      .call(root.querySelectorAll('[data-group="' + group + '"][aria-pressed="true"]'), function (b) {
        return b.getAttribute("data-value");
      });
  }

  function hasAny(have, want) {
    for (var i = 0; i < want.length; i++) {
      if (have.indexOf(want[i]) !== -1) return true;
    }
    return false;
  }

  function parseList(attr) {
    if (!attr) return [];
    return attr.split("|").filter(Boolean);
  }

  function applyFilters(root) {
    var flying = root.querySelector('[data-group="flying"][aria-pressed="true"]');
    var colors = selectedIn(root, "color");
    var places = selectedIn(root, "place");
    var kinds = selectedIn(root, "kind");
    var cards = root.querySelectorAll("[data-species]");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var ok = true;
      if (flying) {
        var chip = card.getAttribute("data-chip-now");
        if (chip !== "Common now" && chip !== "Garden colonizer") ok = false;
      }
      if (ok && colors.length) {
        if (!hasAny(parseList(card.getAttribute("data-color")), colors)) ok = false;
      }
      if (ok && places.length) {
        if (!hasAny(parseList(card.getAttribute("data-place")), places)) ok = false;
      }
      if (ok && kinds.length) {
        if (!hasAny(parseList(card.getAttribute("data-kind")), kinds)) ok = false;
      }
      if (ok) card.removeAttribute("hidden");
      else card.setAttribute("hidden", "");
    }
  }

  function initHome() {
    var root = document.querySelector("[data-home]");
    if (!root) return;
    var month = yorkMonth();
    var cards = root.querySelectorAll("[data-species]");
    for (var i = 0; i < cards.length; i++) applyChip(cards[i], month);
    var buttons = root.querySelectorAll(".fchip");
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].addEventListener("click", function () {
        var on = this.getAttribute("aria-pressed") === "true";
        this.setAttribute("aria-pressed", on ? "false" : "true");
        applyFilters(root);
      });
    }
    applyFilters(root);
  }

  function initSpecies() {
    var page = document.querySelector("[data-species-page]");
    if (!page) return;
    applyChip(page, yorkMonth());
  }

  initHome();
  initSpecies();
})();
