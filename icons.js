/**
 * Andronicus icon set — replaces emojis with our own drawings so the site
 * looks the same on every device and doesn't feel like a phone keyboard.
 * Line icons use currentColor; "big" icons are two-tone in the site palette.
 *
 *   AndIcon("flame")              -> inline <svg> string, 1em, inherits text colour
 *   AndIcon("flame", "big")       -> large two-tone version for celebrations
 *   AndIcon.el("lock", "big")     -> same, as a DOM element
 */
(function () {
  "use strict";

  var NAVY = "#0f3d7a";
  var BLUE = "#3d7cc9";
  var SKY = "#b9d3ee";
  var GREEN = "#2f8a5b";
  var MINT = "#bfe3cd";
  var CORAL = "#e2674f";
  var PEACH = "#f6c8b6";

  /* Line icons: 24×24, round caps, a little irregular on purpose. */
  var LINE = {
    flame:
      '<path d="M12.2 21.5c-4 0-6.9-2.7-6.9-6.4 0-3.3 2.3-5.4 3.7-7.6.4 1.7 1.3 2.9 2.4 3.4-.3-3.2 1.1-6.3 3.4-8.4.2 3 1.5 4.7 2.9 6.6 1 1.4 1.7 3 1.7 5 0 4.3-3 7.4-7.2 7.4z"/><path d="M12.3 21.4c-1.8 0-3-1.3-3-3 0-1.8 1.4-2.8 2.4-4.3.9 1.3 3.5 2.4 3.5 4.6 0 1.6-1.2 2.7-2.9 2.7z"/>',
    lock:
      '<rect x="4.6" y="10.4" width="14.8" height="10.6" rx="2.6"/><path d="M8 10.3V7.6c0-2.5 1.8-4.4 4.1-4.4 2.2 0 3.9 1.8 3.9 4.3v2.8"/><path d="M12 14.6v2.4"/>',
    flag:
      '<path d="M5.4 21.2V3.4"/><path d="M5.6 4.2c2.2-1.2 4.4-.9 6.4.2 2 1.1 4.1 1.3 6.6.1v8.4c-2.4 1.2-4.6 1-6.6-.1-2-1.1-4.2-1.3-6.4-.1"/><path d="M9 4.1v8.2M12.2 5v8.3M15.4 5.4v8.2" stroke-width="1.3" opacity=".55"/>',
    trophy:
      '<path d="M7.4 3.6h9.2v5.2c0 2.8-2 5-4.6 5s-4.6-2.2-4.6-5z"/><path d="M7.3 5.4H4.6c0 2.6 1.1 4.2 3.2 4.6M16.7 5.4h2.7c0 2.6-1.1 4.2-3.2 4.6"/><path d="M12 13.9v3.4M8.4 20.6c.6-2.2 1.9-3.3 3.6-3.3s3 1.1 3.6 3.3z"/>',
    mail:
      '<rect x="3.2" y="5.4" width="17.6" height="13.4" rx="2.4"/><path d="M3.9 6.6l7 5.6c.7.5 1.5.5 2.2 0l7-5.6"/>',
    euro:
      '<path d="M17.4 6.2c-1.2-1.2-2.8-1.9-4.6-1.9-3.9 0-6.6 3.4-6.6 7.7s2.7 7.7 6.6 7.7c1.8 0 3.4-.7 4.6-1.9"/><path d="M4.2 10.2h8.6M4.2 13.8h8"/>',
    party:
      '<path d="M4 20.4 8.2 8.6l7.2 7.2z"/><path d="M6.4 14.6l3 3"/><path d="M13.6 3.6c.6 1.6.3 3-.8 4.2M20.4 10.4c-1.6-.6-3-.3-4.2.8M16.6 3.4l.2 1.4M20.6 6.8l-1.4.4M18.2 13.8l1.2.9"/>',
    camera:
      '<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17" cy="7" r=".7" fill="currentColor" stroke="none"/>',
    phone:
      '<path d="M6.6 3.6h2.6l1.4 4-2 1.4c1 2.3 2.6 3.9 4.6 4.9l1.4-2 4 1.4v2.6c0 1.3-1 2.3-2.3 2.3C9.9 18.1 5.9 14.1 4.3 6c0-1.3 1-2.4 2.3-2.4z"/>',
    sparkle:
      '<path d="M11 3.2c.6 3.9 2 5.6 6 6.4-4 .9-5.4 2.6-6 6.6-.7-4-2.1-5.7-6-6.6 3.9-.8 5.3-2.5 6-6.4z"/><path d="M18.4 14.6c.3 1.8.9 2.6 2.6 2.9-1.7.4-2.3 1.2-2.6 3-.4-1.8-1-2.6-2.7-3 1.7-.3 2.3-1.1 2.7-2.9z"/>',
    shuffle:
      '<path d="M3.6 7.2h3.2c4.6 0 5.6 9.6 10.4 9.6h3"/><path d="M3.6 16.8h3.2c1.6 0 2.7-1.2 3.6-2.8M13.6 9.8c.9-1.5 2-2.6 3.6-2.6h3"/><path d="M18 4.6l2.6 2.6L18 9.8M18 14.2l2.6 2.6L18 19.4"/>',
    bulb:
      '<path d="M9 17.2c0-1.9-.6-2.6-1.7-3.9A5.9 5.9 0 0 1 12 3.6a5.9 5.9 0 0 1 4.7 9.7c-1.1 1.3-1.7 2-1.7 3.9z"/><path d="M9.4 20.4h5.2"/>',
    book:
      '<path d="M12 6.4c-1.8-1.6-4.6-2.2-8.4-1.9v13.4c3.8-.3 6.6.3 8.4 1.9 1.8-1.6 4.6-2.2 8.4-1.9V4.5c-3.8-.3-6.6.3-8.4 1.9z"/><path d="M12 6.4v12.8"/>',
    check: '<path d="M4.6 12.6l4.6 4.6 10.2-10.4"/>',
  };

  /* Two-tone large icons for celebrations, locks, results. 64×64. */
  var BIG = {
    flame:
      '<path d="M32.6 58c-11 0-18.6-7.2-18.6-17.3 0-9 6.2-14.6 10-20.6 1 4.6 3.5 7.8 6.4 9.2-.8-8.6 3-17 9.2-22.7.5 8.1 4 12.7 7.8 17.8 2.7 3.8 4.6 8.1 4.6 13.5C52 49.6 44 58 32.6 58z" fill="' + CORAL + '"/>' +
      '<path d="M32.8 57.8c-5 0-8.2-3.5-8.2-8.2 0-4.9 3.8-7.6 6.5-11.6 2.4 3.5 9.4 6.5 9.4 12.5 0 4.3-3.2 7.3-7.7 7.3z" fill="' + PEACH + '"/>' +
      '<path d="M32.6 58c-11 0-18.6-7.2-18.6-17.3 0-9 6.2-14.6 10-20.6 1 4.6 3.5 7.8 6.4 9.2-.8-8.6 3-17 9.2-22.7.5 8.1 4 12.7 7.8 17.8 2.7 3.8 4.6 8.1 4.6 13.5C52 49.6 44 58 32.6 58z" fill="none" stroke="' + NAVY + '" stroke-width="2.6" stroke-linejoin="round"/>',
    flag:
      '<path d="M15.5 9.5c6-3.2 12-2.4 17.4.6 5.4 3 11.2 3.4 17.6.2v22.6c-6.4 3.2-12.2 2.8-17.6-.2-5.4-3-11.4-3.8-17.4-.6z" fill="#fff"/>' +
      '<path d="M15.5 9.5c3-1.6 6-2.2 9-2v22.4c-3-.2-6 .4-9 2zM32.9 10.1c2.9 1.6 5.8 2.6 8.8 2.8v22.6c-3-.2-5.9-1.2-8.8-2.8z" fill="' + NAVY + '"/>' +
      '<path d="M24.5 18.6c2.9.2 5.6 1.2 8.4 2.7v11.2c-2.8-1.5-5.5-2.5-8.4-2.7zM41.7 24.2c2.9.1 5.8-.6 8.8-2.1v10.8c-3 1.5-5.9 2.2-8.8 2.1z" fill="' + NAVY + '"/>' +
      '<path d="M15.5 9.5c6-3.2 12-2.4 17.4.6 5.4 3 11.2 3.4 17.6.2v22.6c-6.4 3.2-12.2 2.8-17.6-.2-5.4-3-11.4-3.8-17.4-.6" fill="none" stroke="' + NAVY + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M14.6 57V7.4" stroke="' + NAVY + '" stroke-width="3.2" stroke-linecap="round"/><circle cx="14.6" cy="6.6" r="2.6" fill="' + GREEN + '"/>',
    lock:
      '<path d="M21 28v-7.6C21 13.8 26 9 32.2 9 38.2 9 43 13.8 43 20.2V28" fill="none" stroke="' + NAVY + '" stroke-width="3.4" stroke-linecap="round"/>' +
      '<rect x="12.6" y="27.4" width="38.8" height="28.4" rx="7" fill="' + SKY + '" stroke="' + NAVY + '" stroke-width="2.8"/>' +
      '<circle cx="32" cy="39.6" r="4" fill="' + NAVY + '"/><path d="M32 42v6.4" stroke="' + NAVY + '" stroke-width="3.2" stroke-linecap="round"/>',
    party:
      '<path d="M10 55.4 21.4 23.2l19.4 19.4z" fill="' + SKY + '" stroke="' + NAVY + '" stroke-width="2.8" stroke-linejoin="round"/>' +
      '<path d="M15.4 40.4l8.2 8.2M18.4 31.6l13.8 13.8" stroke="' + BLUE + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M36.4 8.8c1.8 4.6.8 8.6-2.4 11.8M55.2 27.6c-4.6-1.8-8.6-.8-11.8 2.4" fill="none" stroke="' + CORAL + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M45.8 8.4l.6 4.2M56 18.4l-4 1.2M49.6 37.6l3.4 2.6" stroke="' + GREEN + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="28.4" cy="12.4" r="2.2" fill="' + GREEN + '"/><circle cx="52.2" cy="47" r="2.2" fill="' + BLUE + '"/><circle cx="44.6" cy="21" r="1.9" fill="' + NAVY + '"/>',
    trophy:
      '<path d="M20 10h24v14c0 7.6-5.4 13.4-12 13.4S20 31.6 20 24z" fill="' + SKY + '" stroke="' + NAVY + '" stroke-width="2.8" stroke-linejoin="round"/>' +
      '<path d="M19.8 14.6h-7c0 7 3 11.2 8.6 12.4M44.2 14.6h7c0 7-3 11.2-8.6 12.4" fill="none" stroke="' + NAVY + '" stroke-width="2.8" stroke-linecap="round"/>' +
      '<path d="M32 37.4v8.6" stroke="' + NAVY + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M22.4 55.2c1.6-5.8 5-8.8 9.6-8.8s8 3 9.6 8.8z" fill="' + NAVY + '"/>' +
      '<path d="M32 16.4l1.8 3.8 4.1.5-3 2.8.8 4.1-3.7-2-3.7 2 .8-4.1-3-2.8 4.1-.5z" fill="' + GREEN + '"/>',
  };

  function svg(name, size) {
    if (size === "big" && BIG[name]) {
      return (
        '<svg class="and-icon and-icon--big" viewBox="0 0 64 64" width="1em" height="1em" aria-hidden="true" focusable="false">' +
        BIG[name] +
        "</svg>"
      );
    }
    var body = LINE[name];
    if (!body) return "";
    return (
      '<svg class="and-icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      body +
      "</svg>"
    );
  }

  /** Small ribbon badge for leaderboard ranks 1–3 (navy, blue, green — no gold). */
  function rankBadge(rank) {
    var fill = rank === 1 ? NAVY : rank === 2 ? BLUE : GREEN;
    var light = rank === 1 ? SKY : rank === 2 ? SKY : MINT;
    return (
      '<svg class="and-icon and-icon--rank" viewBox="0 0 32 32" width="1.6em" height="1.6em" role="img" aria-label="' + rank + '">' +
      '<path d="M10 17.5 7 30l5-2.6 3 3.6 2.4-11.6zM22 17.5 25 30l-5-2.6-3 3.6-2.4-11.6z" fill="' + light + '" stroke="' + fill + '" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<circle cx="16" cy="12.6" r="10.2" fill="' + fill + '"/>' +
      '<circle cx="16" cy="12.6" r="7.6" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2 1.6" opacity=".7"/>' +
      '<text x="16" y="17" text-anchor="middle" font-size="12" font-weight="700" font-family="inherit" fill="#fff">' + rank + "</text>" +
      "</svg>"
    );
  }

  function el(name, size, tag) {
    var span = document.createElement(tag || "span");
    span.className = "and-icon-wrap" + (size === "big" ? " and-icon-wrap--big" : "");
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = svg(name, size);
    return span;
  }

  /** Label with a leading icon, for buttons: AndIcon.label(btn, "bulb", "Hint"). */
  function label(node, name, text) {
    node.textContent = "";
    node.appendChild(el(name));
    node.appendChild(document.createTextNode(" " + text));
    return node;
  }

  svg.el = el;
  svg.label = label;
  svg.rank = rankBadge;
  window.AndIcon = svg;
})();
