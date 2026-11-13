/**
 * Leaderboard characters: an animal portrait + accessories, drawn as SVG.
 * Every animal shares the same layout (head centred at 50,58 · eyes at 40,56 and 60,56 ·
 * neck at the bottom), so any hat, glasses or neck accessory fits any animal.
 * window.AndAvatar.svg({ animal, bg, hat, eyes, neck }) -> SVG markup.
 */
(function () {
  "use strict";

  var INK = "#1f2430";
  var EYE = function (x, y, r) {
    r = r || 2.6;
    return (
      '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/>' +
      '<circle cx="' + (x + r * 0.35) + '" cy="' + (y - r * 0.4) + '" r="' + r * 0.32 + '" fill="#fff"/>'
    );
  };
  var EYES = EYE(40, 56) + EYE(60, 56);

  /* ---------- animals ---------- */
  var ANIMALS = {
    fox: function () {
      return (
        '<path d="M26 44 L29 14 L47 33 Z" fill="#d9692e"/><path d="M74 44 L71 14 L53 33 Z" fill="#d9692e"/>' +
        '<path d="M30 38 L31 21 L42 32 Z" fill="#3a2a26"/><path d="M70 38 L69 21 L58 32 Z" fill="#3a2a26"/>' +
        '<path d="M22 54 C22 37 36 30 50 30 C64 30 78 37 78 54 C78 70 64 84 50 86 C36 84 22 70 22 54 Z" fill="#e57a3b"/>' +
        '<path d="M23 58 C32 60 42 63 50 72 C58 63 68 60 77 58 C75 72 63 84 50 86 C37 84 25 72 23 58 Z" fill="#fbf4ec"/>' +
        EYES +
        '<ellipse cx="50" cy="71" rx="3.6" ry="2.6" fill="' + INK + '"/>' +
        '<path d="M50 74 Q47 78 44 77 M50 74 Q53 78 56 77" stroke="' + INK + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
      );
    },
    cat: function () {
      return (
        '<path d="M25 46 L29 17 L46 31 Z" fill="#8c96a3"/><path d="M75 46 L71 17 L54 31 Z" fill="#8c96a3"/>' +
        '<path d="M29 40 L31 24 L41 32 Z" fill="#e8b7bf"/><path d="M71 40 L69 24 L59 32 Z" fill="#e8b7bf"/>' +
        '<ellipse cx="50" cy="58" rx="28" ry="26" fill="#9aa4b1"/>' +
        '<path d="M44 33 L46 41 M50 32 L50 41 M56 33 L54 41" stroke="#7d8794" stroke-width="2" stroke-linecap="round"/>' +
        '<ellipse cx="50" cy="70" rx="12" ry="9" fill="#e9edf1"/>' +
        '<ellipse cx="40" cy="56" rx="3.4" ry="3.8" fill="#8fbf6a"/><ellipse cx="60" cy="56" rx="3.4" ry="3.8" fill="#8fbf6a"/>' +
        '<ellipse cx="40" cy="56" rx="1.2" ry="3.2" fill="' + INK + '"/><ellipse cx="60" cy="56" rx="1.2" ry="3.2" fill="' + INK + '"/>' +
        '<path d="M47.5 66 L52.5 66 L50 69 Z" fill="#d98a98"/>' +
        '<path d="M50 69 Q48 73 45 72 M50 69 Q52 73 55 72" stroke="' + INK + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
        '<path d="M36 68 L22 66 M36 71 L22 73 M64 68 L78 66 M64 71 L78 73" stroke="#f5f7f9" stroke-width="0.9" stroke-linecap="round"/>'
      );
    },
    dog: function () {
      return (
        '<ellipse cx="50" cy="57" rx="26" ry="27" fill="#d9b48a"/>' +
        '<path d="M27 36 C17 38 13 54 17 70 C20 76 27 74 29 66 C31 56 31 44 27 36 Z" fill="#6f5546"/>' +
        '<path d="M73 36 C83 38 87 54 83 70 C80 76 73 74 71 66 C69 56 69 44 73 36 Z" fill="#6f5546"/>' +
        '<ellipse cx="60" cy="54" rx="8" ry="7" fill="#c49a6c"/>' +
        '<ellipse cx="50" cy="71" rx="13" ry="10" fill="#f1e2cf"/>' +
        EYES +
        '<ellipse cx="50" cy="66.5" rx="4.6" ry="3.4" fill="' + INK + '"/>' +
        '<path d="M50 70 L50 73 Q47 77 44 75 M50 73 Q53 77 56 75" stroke="' + INK + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
      );
    },
    bear: function () {
      return (
        '<circle cx="28" cy="35" r="10" fill="#7a5340"/><circle cx="72" cy="35" r="10" fill="#7a5340"/>' +
        '<circle cx="28" cy="35" r="5" fill="#b78b6e"/><circle cx="72" cy="35" r="5" fill="#b78b6e"/>' +
        '<ellipse cx="50" cy="58" rx="28" ry="27" fill="#8a5f48"/>' +
        '<ellipse cx="50" cy="70" rx="12" ry="9.5" fill="#d6b49a"/>' +
        EYES +
        '<path d="M45 65 Q50 62 55 65 Q53 69 50 69.5 Q47 69 45 65 Z" fill="' + INK + '"/>' +
        '<path d="M50 69.5 L50 72.5 Q47.5 76 45 74.5 M50 72.5 Q52.5 76 55 74.5" stroke="' + INK + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
      );
    },
    panda: function () {
      return (
        '<circle cx="28" cy="35" r="10" fill="' + INK + '"/><circle cx="72" cy="35" r="10" fill="' + INK + '"/>' +
        '<ellipse cx="50" cy="58" rx="28" ry="27" fill="#f6f6f3"/>' +
        '<ellipse cx="39" cy="56" rx="6" ry="8" transform="rotate(25 39 56)" fill="' + INK + '"/>' +
        '<ellipse cx="61" cy="56" rx="6" ry="8" transform="rotate(-25 61 56)" fill="' + INK + '"/>' +
        '<circle cx="40" cy="56" r="2.3" fill="#fff"/><circle cx="60" cy="56" r="2.3" fill="#fff"/>' +
        '<circle cx="40.5" cy="56" r="1.3" fill="' + INK + '"/><circle cx="60.5" cy="56" r="1.3" fill="' + INK + '"/>' +
        '<ellipse cx="50" cy="67" rx="4" ry="2.8" fill="' + INK + '"/>' +
        '<path d="M50 69.5 L50 72 Q47.5 75.5 45 74 M50 72 Q52.5 75.5 55 74" stroke="' + INK + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
      );
    },
    rabbit: function () {
      return (
        '<ellipse cx="40" cy="20" rx="7" ry="20" transform="rotate(-8 40 20)" fill="#dcd8d2"/>' +
        '<ellipse cx="60" cy="20" rx="7" ry="20" transform="rotate(8 60 20)" fill="#dcd8d2"/>' +
        '<ellipse cx="40" cy="21" rx="3.5" ry="15" transform="rotate(-8 40 21)" fill="#ecc2c9"/>' +
        '<ellipse cx="60" cy="21" rx="3.5" ry="15" transform="rotate(8 60 21)" fill="#ecc2c9"/>' +
        '<ellipse cx="50" cy="60" rx="26" ry="25" fill="#e6e2dc"/>' +
        '<ellipse cx="50" cy="71" rx="11" ry="8" fill="#faf8f5"/>' +
        EYES +
        '<path d="M47.5 66 L52.5 66 L50 68.5 Z" fill="#d98a98"/>' +
        '<path d="M50 68.5 Q48 72 45.5 71 M50 68.5 Q52 72 54.5 71" stroke="' + INK + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>' +
        '<rect x="48" y="71.5" width="4" height="4" rx="0.8" fill="#fff" stroke="#c9c4bd" stroke-width="0.5"/>'
      );
    },
    lion: function () {
      return (
        '<circle cx="50" cy="58" r="37" fill="#b9652b"/>' +
        '<circle cx="50" cy="58" r="31" fill="#cf7d36"/>' +
        '<circle cx="31" cy="36" r="6" fill="#e2a85a"/><circle cx="69" cy="36" r="6" fill="#e2a85a"/>' +
        '<ellipse cx="50" cy="59" rx="24" ry="24" fill="#e8b468"/>' +
        '<ellipse cx="50" cy="71" rx="11" ry="8.5" fill="#f6e3c3"/>' +
        EYES +
        '<path d="M45.5 65 Q50 63 54.5 65 Q52.5 69 50 69.5 Q47.5 69 45.5 65 Z" fill="#6b4a3a"/>' +
        '<path d="M50 69.5 L50 72 Q47.5 75.5 45 74 M50 72 Q52.5 75.5 55 74" stroke="' + INK + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
      );
    },
    koala: function () {
      return (
        '<circle cx="24" cy="42" r="14" fill="#8e98a3"/><circle cx="76" cy="42" r="14" fill="#8e98a3"/>' +
        '<circle cx="24" cy="42" r="8" fill="#e8e3df"/><circle cx="76" cy="42" r="8" fill="#e8e3df"/>' +
        '<ellipse cx="50" cy="58" rx="26" ry="26" fill="#a3acb6"/>' +
        '<ellipse cx="50" cy="73" rx="11" ry="7" fill="#e6e8eb"/>' +
        EYES +
        '<ellipse cx="50" cy="65" rx="6" ry="8" fill="#2e3440"/>' +
        '<ellipse cx="48" cy="62" rx="1.6" ry="2.4" fill="#59616d"/>' +
        '<path d="M46 75 Q50 77.5 54 75" stroke="' + INK + '" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
      );
    },
  };

  /* ---------- hats (sit on the head top, around y 30) ---------- */
  var HATS = {
    none: function () {
      return "";
    },
    beret: function () {
      return (
        '<ellipse cx="53" cy="31" rx="25" ry="8" transform="rotate(-8 53 31)" fill="#1f2a44"/>' +
        '<ellipse cx="53" cy="28" rx="21" ry="6" transform="rotate(-8 53 28)" fill="#2a375a"/>' +
        '<path d="M56 21 L57 15" stroke="#1f2a44" stroke-width="2.4" stroke-linecap="round"/>'
      );
    },
    cap: function () {
      return (
        '<path d="M25 37 C25 20 37 13 50 13 C63 13 75 20 75 37 Z" fill="#2f6fb8"/>' +
        '<path d="M60 37 C70 35 83 36 90 40 C82 43 68 42 58 40 Z" fill="#245a98"/>' +
        '<path d="M50 13 L50 37" stroke="#245a98" stroke-width="1.2"/>' +
        '<circle cx="50" cy="13.5" r="2" fill="#245a98"/>'
      );
    },
    beanie: function () {
      return (
        '<path d="M24 40 C24 22 36 14 50 14 C64 14 76 22 76 40 Z" fill="#c63d3d"/>' +
        '<rect x="22" y="34" width="56" height="9" rx="4" fill="#a83232"/>' +
        '<path d="M30 36 L30 41 M36 36 L36 41 M42 36 L42 41 M48 36 L48 41 M54 36 L54 41 M60 36 L60 41 M66 36 L66 41 M72 36 L72 41" stroke="#912a2a" stroke-width="1"/>' +
        '<circle cx="50" cy="11" r="6" fill="#f1ece6"/>'
      );
    },
    tophat: function () {
      return (
        '<rect x="35" y="5" width="30" height="27" rx="2" fill="#1d2233"/>' +
        '<rect x="35" y="25" width="30" height="5" fill="#6a46c2"/>' +
        '<ellipse cx="50" cy="32.5" rx="24" ry="4.5" fill="#151927"/>'
      );
    },
    crown: function () {
      return (
        '<path d="M32 36 L32 18 L41 27 L50 13 L59 27 L68 18 L68 36 Z" fill="#c5ccd8" stroke="#8d97a8" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<rect x="32" y="31" width="36" height="5" fill="#aab3c2"/>' +
        '<circle cx="50" cy="24" r="2.4" fill="#4c6fd6"/><circle cx="40" cy="30" r="1.7" fill="#d0455b"/><circle cx="60" cy="30" r="1.7" fill="#2f9a6a"/>'
      );
    },
    grad: function () {
      return (
        '<path d="M34 28 C34 34 66 34 66 28 L66 22 L34 22 Z" fill="#1f2a44"/>' +
        '<path d="M50 9 L86 20 L50 31 L14 20 Z" fill="#26324f"/>' +
        '<path d="M50 20 L72 24 L72 36" stroke="#e0b84a" stroke-width="1.4" fill="none"/>' +
        '<circle cx="72" cy="38" r="2" fill="#e0b84a"/>'
      );
    },
    headphones: function () {
      return (
        '<path d="M22 56 C22 26 78 26 78 56" stroke="#2b2f3a" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<rect x="15" y="50" width="11" height="18" rx="5" fill="#6a46c2"/>' +
        '<rect x="74" y="50" width="11" height="18" rx="5" fill="#6a46c2"/>'
      );
    },
  };

  /* ---------- eyewear (eyes at 40,56 and 60,56) ---------- */
  var EYEWEAR = {
    none: function () {
      return "";
    },
    round: function () {
      return (
        '<circle cx="40" cy="56" r="7.2" fill="rgba(255,255,255,0.18)" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<circle cx="60" cy="56" r="7.2" fill="rgba(255,255,255,0.18)" stroke="' + INK + '" stroke-width="1.8"/>' +
        '<path d="M47 55 Q50 53 53 55 M32.8 55 L26 52 M67.2 55 L74 52" stroke="' + INK + '" stroke-width="1.6" fill="none"/>'
      );
    },
    square: function () {
      return (
        '<rect x="31.5" y="50" width="17" height="12" rx="3" fill="rgba(255,255,255,0.18)" stroke="#2f6fb8" stroke-width="2"/>' +
        '<rect x="51.5" y="50" width="17" height="12" rx="3" fill="rgba(255,255,255,0.18)" stroke="#2f6fb8" stroke-width="2"/>' +
        '<path d="M48.5 55 L51.5 55 M31.5 54 L25 51 M68.5 54 L75 51" stroke="#2f6fb8" stroke-width="1.8"/>'
      );
    },
    sunglasses: function () {
      return (
        '<path d="M30 51 L49 51 L48 58 Q46 63 40 63 Q32 63 31 58 Z" fill="#1b1f2a"/>' +
        '<path d="M51 51 L70 51 L69 58 Q68 63 60 63 Q54 63 52 58 Z" fill="#1b1f2a"/>' +
        '<path d="M49 52 L51 52 M30 52 L24 50 M70 52 L76 50" stroke="#1b1f2a" stroke-width="2"/>' +
        '<path d="M34 53.5 L39 53.5 M55 53.5 L60 53.5" stroke="rgba(255,255,255,0.45)" stroke-width="1.2" stroke-linecap="round"/>'
      );
    },
    monocle: function () {
      return (
        '<circle cx="60" cy="56" r="7.5" fill="rgba(255,255,255,0.2)" stroke="#8d97a8" stroke-width="1.8"/>' +
        '<path d="M66 61 Q72 70 69 82" stroke="#8d97a8" stroke-width="1" fill="none"/>'
      );
    },
  };

  /* ---------- neck (bottom of the portrait) ---------- */
  var NECKS = {
    none: function () {
      return "";
    },
    bowtie: function () {
      return (
        '<path d="M50 90 L37 83 L37 97 Z" fill="#c63d3d"/><path d="M50 90 L63 83 L63 97 Z" fill="#c63d3d"/>' +
        '<rect x="46.5" y="86.5" width="7" height="7" rx="1.6" fill="#a83232"/>'
      );
    },
    scarf: function () {
      return (
        '<path d="M24 82 Q50 92 76 82 L78 91 Q50 101 22 91 Z" fill="#2f9a6a"/>' +
        '<path d="M60 89 L66 100 L57 100 L54 90 Z" fill="#268057"/>' +
        '<path d="M30 86 L32 93 M40 89 L41 96 M60 88 L59 95 M70 86 L68 93" stroke="#268057" stroke-width="1.2"/>'
      );
    },
    tie: function () {
      return (
        '<path d="M45 84 L55 84 L53 89 L47 89 Z" fill="#2f6fb8"/>' +
        '<path d="M47 89 L53 89 L57 100 L43 100 Z" fill="#245a98"/>'
      );
    },
    medal: function () {
      return (
        '<path d="M40 80 L47 92 M60 80 L53 92" stroke="#4c6fd6" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="50" cy="94" r="6" fill="#c5ccd8" stroke="#8d97a8" stroke-width="1.2"/>' +
        '<path d="M50 91 L51 93.5 L53.5 93.6 L51.5 95.1 L52.2 97.5 L50 96.1 L47.8 97.5 L48.5 95.1 L46.5 93.6 L49 93.5 Z" fill="#8d97a8"/>'
      );
    },
  };

  var BGS = ["#cfe0f1", "#d6eadf", "#f6dccb", "#e3dcf4", "#f3d6df", "#f3ecc8", "#d4e9ee", "#e2e5ea"];

  var LABELS = {
    animal: {
      fox: ["Fox", "Renard"], cat: ["Cat", "Chat"], dog: ["Dog", "Chien"], bear: ["Bear", "Ours"],
      panda: ["Panda", "Panda"], rabbit: ["Rabbit", "Lapin"], lion: ["Lion", "Lion"], koala: ["Koala", "Koala"],
    },
    hat: {
      none: ["None", "Aucun"], beret: ["Beret", "Béret"], cap: ["Cap", "Casquette"], beanie: ["Beanie", "Bonnet"],
      tophat: ["Top hat", "Chapeau haut-de-forme"], crown: ["Crown", "Couronne"], grad: ["Graduation cap", "Toque de diplômé"],
      headphones: ["Headphones", "Casque audio"],
    },
    eyes: {
      none: ["None", "Aucunes"], round: ["Round glasses", "Lunettes rondes"], square: ["Square glasses", "Lunettes carrées"],
      sunglasses: ["Sunglasses", "Lunettes de soleil"], monocle: ["Monocle", "Monocle"],
    },
    neck: {
      none: ["None", "Aucun"], bowtie: ["Bow tie", "Nœud papillon"], scarf: ["Scarf", "Écharpe"], tie: ["Tie", "Cravate"],
      medal: ["Medal", "Médaille"],
    },
  };

  function pick(list, key, fallback) {
    return Object.prototype.hasOwnProperty.call(list, key) ? key : fallback;
  }

  /** Cleans a saved character so only known parts are used. */
  function normalize(a) {
    a = a && typeof a === "object" ? a : {};
    var bg = typeof a.bg === "string" && /^#[0-9a-f]{6}$/i.test(a.bg) ? a.bg : BGS[0];
    return {
      animal: pick(ANIMALS, a.animal, "fox"),
      bg: bg,
      hat: pick(HATS, a.hat, "none"),
      eyes: pick(EYEWEAR, a.eyes, "none"),
      neck: pick(NECKS, a.neck, "none"),
    };
  }

  /** A stable default character for players who haven't made one (based on their name). */
  function forName(name) {
    var h = 0;
    var s = String(name || "");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var animals = Object.keys(ANIMALS);
    return normalize({ animal: animals[h % animals.length], bg: BGS[(h >>> 3) % BGS.length] });
  }

  var uid = 0;
  /** SVG markup for a character. */
  function svg(a, label) {
    a = normalize(a);
    uid += 1;
    var clip = "av-clip-" + uid;
    return (
      '<svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="' +
      String(label || "").replace(/"/g, "&quot;") +
      '" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="' + clip + '"><circle cx="50" cy="50" r="50"/></clipPath></defs>' +
      '<g clip-path="url(#' + clip + ')">' +
      '<rect width="100" height="100" fill="' + a.bg + '"/>' +
      '<path d="M18 100 C20 86 34 80 50 80 C66 80 80 86 82 100 Z" fill="rgba(31,36,48,0.12)"/>' +
      (a.hat === "headphones" ? "" : "") +
      ANIMALS[a.animal]() +
      NECKS[a.neck]() +
      EYEWEAR[a.eyes]() +
      HATS[a.hat]() +
      "</g></svg>"
    );
  }

  function label(group, key, lang) {
    var l = LABELS[group] && LABELS[group][key];
    if (!l) return key;
    return lang === "fr" ? l[1] : l[0];
  }

  window.AndAvatar = {
    svg: svg,
    normalize: normalize,
    forName: forName,
    label: label,
    animals: Object.keys(ANIMALS),
    hats: Object.keys(HATS),
    eyes: Object.keys(EYEWEAR),
    necks: Object.keys(NECKS),
    bgs: BGS.slice(),
  };
})();
