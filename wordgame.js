/**
 * Word wheel game ("Mots en roue"): swipe across the letters to make words and fill the grid.
 * Data comes from wordgame-data.js (window.ANDRONICUS_WORDGAME).
 * Mounted by app.js with: AndronicusWordGame.mount(panel, { t, lang, loadState, saveState })
 */
(function () {
  "use strict";

  var DEFAULT_DATA = window.ANDRONICUS_WORDGAME || { rounds: [], fr: {} };

  function parseRound(raw, idx) {
    var words = raw[3].split(" ").map(function (s) {
      var p = s.split(":");
      return { w: p[0], r: +p[1], c: +p[2], d: p[3] };
    });
    var bonus = Object.create(null);
    (raw[4] ? raw[4].split(" ") : []).forEach(function (b) {
      bonus[b] = true;
    });
    return { idx: idx, letters: raw[0].split(""), rows: raw[1], cols: raw[2], words: words, bonus: bonus };
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var ROUND_POINTS = 5;
  var HINT_COST = 1;

  function freshState() {
    return { round: 0, best: 0, paid: 0, found: {}, hints: {}, bonusFound: {}, bonusTotal: 0 };
  }

  function normalise(s, DATA) {
    var st = freshState();
    if (!s || typeof s !== "object") return st;
    st.round = Math.max(0, Math.floor(+s.round || 0));
    st.best = Math.max(st.round, Math.floor(+s.best || 0));
    st.found = s.found && typeof s.found === "object" ? s.found : {};
    st.hints = s.hints && typeof s.hints === "object" ? s.hints : {};
    st.bonusFound = s.bonusFound && typeof s.bonusFound === "object" ? s.bonusFound : {};
    st.bonusTotal = Math.max(0, Math.floor(+s.bonusTotal || 0));
    st.paid = Math.max(0, Math.floor(+s.paid || 0));
    var max = DATA.rounds.length - 1;
    if (st.round > max) st.round = max;
    if (st.best > max) st.best = max;
    return st;
  }

  function mount(panel, api) {
    var DATA = api.data || DEFAULT_DATA; // the French course passes its own rounds
    var t = api.t;
    var state = normalise(api.loadState(), DATA);
    var round = null;
    var shuffled = [];
    var msgTimer = null;

    var root = el("div", "wg");
    panel.innerHTML = "";
    panel.appendChild(root);

    function save() {
      ["found", "hints", "bonusFound"].forEach(function (k) {
        Object.keys(state[k]).forEach(function (key) {
          if (+key < state.best - 10 && +key !== state.round) delete state[k][key];
        });
      });
      api.saveState(state);
    }

    function foundList() {
      var k = String(round.idx);
      if (!Array.isArray(state.found[k])) state.found[k] = [];
      return state.found[k];
    }
    function hintList() {
      var k = String(round.idx);
      if (!Array.isArray(state.hints[k])) state.hints[k] = [];
      return state.hints[k];
    }
    function bonusList() {
      var k = String(round.idx);
      if (!Array.isArray(state.bonusFound[k])) state.bonusFound[k] = [];
      return state.bonusFound[k];
    }
    function isComplete() {
      var f = foundList();
      return round.words.every(function (w) {
        return f.indexOf(w.w) >= 0;
      });
    }
    function fr(word) {
      return DATA.fr[word] || "";
    }

    /* ---------- layout ---------- */
    var head, gridEl, msgEl, previewEl, wheelEl, svgEl, actions, defEl, doneEl;

    function build() {
      root.innerHTML = "";
      head = el("div", "wg__head");
      root.appendChild(head);
      gridEl = el("div", "wg__grid");
      root.appendChild(gridEl);
      var mid = el("div", "wg__mid");
      root.appendChild(mid);
      msgEl = el("p", "wg__msg");
      msgEl.setAttribute("aria-live", "polite");
      mid.appendChild(msgEl);
      previewEl = el("div", "wg__preview");
      mid.appendChild(previewEl);
      defEl = el("div", "wg__def hidden");
      mid.appendChild(defEl);
      wheelEl = el("div", "wg__wheel");
      svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgEl.setAttribute("class", "wg__lines");
      svgEl.setAttribute("viewBox", "0 0 100 100");
      wheelEl.appendChild(svgEl);
      root.appendChild(wheelEl);
      bindWheel();
      actions = el("div", "wg__actions");
      root.appendChild(actions);
      doneEl = el("div", "wg__done hidden");
      root.appendChild(doneEl);
    }

    function render() {
      if (!DATA.rounds.length) {
        root.textContent = "";
        return;
      }
      if (!round || round.idx !== state.round) {
        round = parseRound(DATA.rounds[state.round], state.round);
        shuffled = round.letters.slice();
      }
      root.classList.remove("is-finished");
      build();
      renderHead();
      renderGrid();
      renderWheel();
      renderActions();
      if (isComplete()) showDone(false);
    }

    function renderHead() {
      var nav = el("div", "wg__nav");
      var prev = el("button", "wg__navbtn", "‹");
      prev.type = "button";
      prev.setAttribute("aria-label", t("wg_prev"));
      prev.disabled = state.round <= 0;
      prev.addEventListener("click", function () {
        goTo(state.round - 1);
      });
      var title = el("div", "wg__title");
      title.appendChild(el("strong", null, t("wg_round", { n: String(state.round + 1) })));
      title.appendChild(el("span", "wg__of", t("wg_of", { t: String(DATA.rounds.length) })));
      var next = el("button", "wg__navbtn", "›");
      next.type = "button";
      next.setAttribute("aria-label", t("wg_next"));
      next.disabled = state.round >= state.best || state.round >= DATA.rounds.length - 1;
      next.addEventListener("click", function () {
        goTo(state.round + 1);
      });
      nav.appendChild(prev);
      nav.appendChild(title);
      nav.appendChild(next);
      head.appendChild(nav);
      var sub = el("p", "wg__sub", t("wg_progress", { n: String(foundList().length), t: String(round.words.length) }));
      head.appendChild(sub);
    }

    function cellMap() {
      var map = {};
      var f = foundList();
      var h = hintList();
      round.words.forEach(function (w) {
        var got = f.indexOf(w.w) >= 0;
        for (var i = 0; i < w.w.length; i++) {
          var r = w.d === "V" ? w.r + i : w.r;
          var c = w.d === "H" ? w.c + i : w.c;
          var key = r + "," + c;
          if (!map[key]) map[key] = { ch: w.w[i], shown: false, words: [] };
          if (got) map[key].shown = true;
          map[key].words.push(w.w);
        }
      });
      h.forEach(function (key) {
        if (map[key]) map[key].hint = true;
      });
      return map;
    }

    function renderGrid(flashWord) {
      gridEl.innerHTML = "";
      gridEl.style.gridTemplateColumns = "repeat(" + round.cols + ", var(--wg-cell))";
      gridEl.style.gridTemplateRows = "repeat(" + round.rows + ", var(--wg-cell))";
      gridEl.style.setProperty(
        "--wg-cell",
        "min(2.4rem, calc((min(100vw, 34rem) - 5.5rem) / " +
          Math.max(round.cols, 5) +
          "), calc(34vh / " +
          Math.max(round.rows, 5) +
          "))"
      );
      var map = cellMap();
      var f = foundList();
      Object.keys(map).forEach(function (key) {
        var info = map[key];
        var rc = key.split(",");
        var cell = el("button", "wg__cell");
        cell.type = "button";
        cell.style.gridRow = String(+rc[0] + 1);
        cell.style.gridColumn = String(+rc[1] + 1);
        if (info.shown) {
          cell.classList.add("is-shown");
          cell.textContent = info.ch.toUpperCase();
          if (flashWord && info.words.indexOf(flashWord) >= 0) cell.classList.add("is-new");
          cell.addEventListener("click", function () {
            var shownWords = info.words.filter(function (w) {
              return f.indexOf(w) >= 0;
            });
            showDef(shownWords);
          });
        } else if (info.hint) {
          cell.classList.add("is-hint");
          cell.textContent = info.ch.toUpperCase();
          cell.tabIndex = -1;
        } else {
          cell.tabIndex = -1;
        }
        gridEl.appendChild(cell);
      });
    }

    function showDef(words) {
      defEl.innerHTML = "";
      defEl.classList.remove("hidden");
      words.forEach(function (w) {
        var row = el("div", "wg__defrow");
        row.appendChild(el("strong", null, w));
        row.appendChild(el("span", null, fr(w) || "—"));
        defEl.appendChild(row);
      });
      var close = el("button", "wg__defclose", "×");
      close.type = "button";
      close.setAttribute("aria-label", t("wg_close"));
      close.addEventListener("click", function () {
        defEl.classList.add("hidden");
      });
      defEl.appendChild(close);
    }

    function say(text, kind) {
      msgEl.textContent = text;
      msgEl.className = "wg__msg" + (kind ? " is-" + kind : "");
      if (msgTimer) clearTimeout(msgTimer);
      msgTimer = setTimeout(function () {
        msgEl.textContent = "";
        msgEl.className = "wg__msg";
      }, 2600);
    }

    /* ---------- wheel ---------- */
    var letterEls = [];
    var path = [];
    var dragging = false;

    function renderWheel() {
      Array.prototype.slice.call(wheelEl.querySelectorAll(".wg__letter")).forEach(function (n) {
        n.remove();
      });
      letterEls = [];
      var n = shuffled.length;
      shuffled.forEach(function (ch, i) {
        var ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        var x = 50 + 34 * Math.cos(ang);
        var y = 50 + 34 * Math.sin(ang);
        var b = el("div", "wg__letter", ch.toUpperCase());
        b.style.left = x + "%";
        b.style.top = y + "%";
        b.dataset.i = String(i);
        b.dataset.x = String(x);
        b.dataset.y = String(y);
        wheelEl.appendChild(b);
        letterEls.push(b);
      });
      drawLines(null);
      previewEl.textContent = "";
    }

    function letterAt(clientX, clientY) {
      var rect = wheelEl.getBoundingClientRect();
      var best = -1;
      var bestD = Infinity;
      letterEls.forEach(function (b, i) {
        var bx = rect.left + (rect.width * +b.dataset.x) / 100;
        var by = rect.top + (rect.height * +b.dataset.y) / 100;
        var d = Math.hypot(clientX - bx, clientY - by);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      var radius = rect.width * 0.12;
      return bestD <= radius ? best : -1;
    }

    function toLocal(clientX, clientY) {
      var rect = wheelEl.getBoundingClientRect();
      return { x: ((clientX - rect.left) / rect.width) * 100, y: ((clientY - rect.top) / rect.height) * 100 };
    }

    function drawLines(pointer) {
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
      if (!path.length) return;
      var pts = path.map(function (i) {
        return +letterEls[i].dataset.x + "," + +letterEls[i].dataset.y;
      });
      if (pointer) pts.push(pointer.x + "," + pointer.y);
      var pl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      pl.setAttribute("points", pts.join(" "));
      svgEl.appendChild(pl);
    }

    function updateSelection(pointer) {
      letterEls.forEach(function (b, i) {
        b.classList.toggle("is-on", path.indexOf(i) >= 0);
      });
      previewEl.textContent = path
        .map(function (i) {
          return shuffled[i];
        })
        .join("")
        .toUpperCase();
      previewEl.classList.toggle("is-active", path.length > 0);
      drawLines(pointer);
    }

    function onDown(e) {
      if (isComplete()) return;
      var i = letterAt(e.clientX, e.clientY);
      if (i < 0) return;
      e.preventDefault();
      dragging = true;
      defEl.classList.add("hidden");
      path = [i];
      try {
        wheelEl.setPointerCapture(e.pointerId);
      } catch (_) {}
      updateSelection(toLocal(e.clientX, e.clientY));
    }
    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      var i = letterAt(e.clientX, e.clientY);
      if (i >= 0) {
        if (path.length >= 2 && path[path.length - 2] === i) {
          path.pop(); // slide back to undo the last letter
        } else if (path.indexOf(i) < 0) {
          path.push(i);
        }
      }
      updateSelection(toLocal(e.clientX, e.clientY));
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      var word = path
        .map(function (i) {
          return shuffled[i];
        })
        .join("");
      path = [];
      updateSelection(null);
      if (word.length >= 2) submit(word);
    }

    function bindWheel() {
      wheelEl.addEventListener("pointerdown", onDown);
      wheelEl.addEventListener("pointermove", onMove);
      wheelEl.addEventListener("pointerup", onUp);
      wheelEl.addEventListener("pointercancel", onUp);
      wheelEl.addEventListener("lostpointercapture", onUp);
    }

    /* ---------- words ---------- */
    function submit(word) {
      var f = foundList();
      var inGrid = round.words.some(function (w) {
        return w.w === word;
      });
      if (word.length < 3) {
        say(t("wg_too_short"), "bad");
        shake();
        return;
      }
      if (inGrid) {
        if (f.indexOf(word) >= 0) {
          say(t("wg_already"), "info");
          return;
        }
        f.push(word);
        save();
        renderHead2();
        renderGrid(word);
        var tr = fr(word);
        say("✓ " + word.toUpperCase() + (tr ? " — " + tr : ""), "good");
        if (isComplete()) {
          if (state.best <= state.round && state.round < DATA.rounds.length - 1) state.best = state.round + 1;
          var earned = 0;
          if (round.idx >= (state.paid || 0) && api.signedIn && api.signedIn()) {
            api.addPoints(ROUND_POINTS);
            state.paid = round.idx + 1;
            earned = ROUND_POINTS;
          }
          save();
          setTimeout(function () {
            showDone(true, false, earned);
          }, 700);
        }
        return;
      }
      if (round.bonus[word]) {
        var bl = bonusList();
        if (bl.indexOf(word) >= 0) {
          say(t("wg_bonus_already", { w: word.toUpperCase() }), "info");
          return;
        }
        bl.push(word);
        state.bonusTotal += 1;
        save();
        renderActions();
        var tr2 = fr(word);
        say("✦ " + t("wg_bonus", { w: word.toUpperCase() }) + (tr2 ? " (" + tr2 + ")" : ""), "bonus");
        return;
      }
      say(t("wg_not_word", { w: word.toUpperCase() }), "bad");
      shake();
    }

    function renderHead2() {
      var sub = head.querySelector(".wg__sub");
      if (sub) sub.textContent = t("wg_progress", { n: String(foundList().length), t: String(round.words.length) });
    }

    function shake() {
      previewEl.classList.remove("is-shake");
      void previewEl.offsetWidth;
      previewEl.classList.add("is-shake");
    }

    function giveHint() {
      if (isComplete()) return;
      if (!api.signedIn || !api.signedIn()) {
        say(t("wg_hint_signin"), "info");
        return;
      }
      if (api.pointsAvailable() < HINT_COST) {
        say(t("wg_hint_no_points"), "bad");
        return;
      }
      var map = cellMap();
      var hidden = Object.keys(map).filter(function (k) {
        return !map[k].shown && !map[k].hint;
      });
      if (!hidden.length) return;
      // reveal the first letter of a word that isn't found yet, otherwise any letter
      var f = foundList();
      var target = null;
      for (var i = 0; i < round.words.length && !target; i++) {
        var w = round.words[i];
        if (f.indexOf(w.w) >= 0) continue;
        for (var j = 0; j < w.w.length; j++) {
          var key = (w.d === "V" ? w.r + j : w.r) + "," + (w.d === "H" ? w.c + j : w.c);
          if (hidden.indexOf(key) >= 0) {
            target = key;
            break;
          }
        }
      }
      hintList().push(target || hidden[0]);
      api.addPoints(-HINT_COST);
      say(t("wg_hint_used"), "info");
      save();
      renderGrid();
    }

    function renderActions() {
      actions.innerHTML = "";
      var shuf = window.AndIcon ? AndIcon.label(el("button", "wg__act"), "shuffle", t("wg_shuffle")) : el("button", "wg__act", t("wg_shuffle"));
      shuf.type = "button";
      shuf.addEventListener("click", function () {
        for (var i = shuffled.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = shuffled[i];
          shuffled[i] = shuffled[j];
          shuffled[j] = tmp;
        }
        renderWheel();
      });
      var hint = window.AndIcon ? AndIcon.label(el("button", "wg__act"), "bulb", t("wg_hint_cost")) : el("button", "wg__act", t("wg_hint_cost"));
      hint.type = "button";
      hint.addEventListener("click", giveHint);
      var words = window.AndIcon ? AndIcon.label(el("button", "wg__act"), "book", t("wg_words")) : el("button", "wg__act", t("wg_words"));
      words.type = "button";
      words.addEventListener("click", function () {
        showDone(false, true);
      });
      actions.appendChild(shuf);
      actions.appendChild(hint);
      actions.appendChild(words);
      var bonus = window.AndIcon ? AndIcon.label(el("p", "wg__bonuscount"), "sparkle", t("wg_bonus_total", { n: String(state.bonusTotal) })) : el("p", "wg__bonuscount", t("wg_bonus_total", { n: String(state.bonusTotal) }));
      actions.appendChild(bonus);
    }

    function showDone(celebrate, listOnly, earned) {
      var complete = isComplete();
      doneEl.innerHTML = "";
      doneEl.classList.remove("hidden");
      root.classList.toggle("is-finished", complete && !listOnly);
      var card = el("div", "wg__donecard");
      if (complete && !listOnly) {
        card.appendChild(el("p", "wg__donetitle", celebrate ? t("wg_done_title") : t("wg_done_again")));
        if (earned) card.appendChild(el("p", "wg__earned", t("wg_points_earned", { n: String(earned) })));
        else if (celebrate && !(api.signedIn && api.signedIn()))
          card.appendChild(el("p", "wg__sub", t("wg_points_signin")));
      } else {
        card.appendChild(el("p", "wg__donetitle", t("wg_words")));
      }
      var f = foundList();
      var list = el("ul", "wg__wordlist");
      round.words
        .slice()
        .sort(function (a, b) {
          return a.w.length - b.w.length || (a.w < b.w ? -1 : 1);
        })
        .forEach(function (w) {
          var got = f.indexOf(w.w) >= 0;
          var li = el("li", got ? "is-got" : "is-missing");
          li.appendChild(el("strong", null, got ? w.w : w.w.replace(/./g, "•")));
          li.appendChild(el("span", null, got ? fr(w.w) : t("wg_not_found_yet")));
          list.appendChild(li);
        });
      card.appendChild(list);
      var bl = bonusList();
      if (bl.length) {
        card.appendChild(el("p", "wg__bonushead", t("wg_bonus_words")));
        var bul = el("ul", "wg__wordlist wg__wordlist--bonus");
        bl.forEach(function (w) {
          var li = el("li", "is-got");
          li.appendChild(el("strong", null, w));
          li.appendChild(el("span", null, fr(w) || t("wg_no_translation")));
          bul.appendChild(li);
        });
        card.appendChild(bul);
      }
      var btns = el("div", "wg__donebtns");
      if (complete && !listOnly && state.round < DATA.rounds.length - 1) {
        var nxt = el("button", "btn btn-primary wg__nextbtn", t("wg_next_round") + " →");
        nxt.type = "button";
        nxt.addEventListener("click", function () {
          goTo(state.round + 1);
        });
        btns.appendChild(nxt);
      } else if (complete && !listOnly) {
        card.appendChild(el("p", "wg__sub", t("wg_all_done")));
      }
      if (listOnly || !complete) {
        var back = el("button", "btn btn-secondary", t("wg_back_to_game"));
        back.type = "button";
        back.addEventListener("click", function () {
          doneEl.classList.add("hidden");
          root.classList.remove("is-finished");
        });
        btns.appendChild(back);
      } else {
        var replay = el("button", "btn btn-secondary", t("wg_replay"));
        replay.type = "button";
        replay.addEventListener("click", function () {
          state.found[String(round.idx)] = [];
          state.hints[String(round.idx)] = [];
          save();
          render();
        });
        btns.appendChild(replay);
      }
      card.appendChild(btns);
      doneEl.appendChild(card);
      if (celebrate) doneEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function goTo(n) {
      if (n < 0 || n > state.best || n >= DATA.rounds.length) return;
      state.round = n;
      save();
      render();
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function fullRender() {
      state = normalise(api.loadState(), DATA);
      render();
    }

    fullRender();
    return { render: fullRender };
  }

  window.AndronicusWordGame = {
    mount: mount,
    count: function (data) {
      return ((data || DEFAULT_DATA).rounds || []).length;
    },
  };
})();
