/**
 * Dictation: listen to a phrase (read aloud by the browser) and type it.
 * Points depend on difficulty: easy 1, medium 2, hard 3 — earned once per phrase,
 * and not if the student reveals the answer first.
 * Data comes from dictation-data.js (window.ANDRONICUS_DICTATION).
 * Mounted by app.js with:
 *   AndronicusDictation.mount(panel, level, { t, loadState, saveState, signedIn, addPoints })
 */
(function () {
  "use strict";

  var RAW = window.ANDRONICUS_DICTATION || {};
  var POINTS = { 1: 1, 2: 2, 3: 3 };
  var DIFF_KEY = { 1: "dict_easy", 2: "dict_medium", 3: "dict_hard" };
  var RATE_NORMAL = 0.92;
  var RATE_SLOW = 0.62;

  function phrases(level) {
    return (RAW[level] || []).map(function (line, i) {
      var bar = line.indexOf("|");
      var d = Math.max(1, Math.min(3, parseInt(line.slice(0, bar), 10) || 1));
      return { idx: i, diff: d, text: line.slice(bar + 1).trim() };
    });
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- answer checking ---------- */

  var CONTRACTIONS = {
    "i'm": "i am", "you're": "you are", "we're": "we are", "they're": "they are",
    "he's": "he is", "she's": "she is", "it's": "it is", "that's": "that is",
    "there's": "there is", "what's": "what is", "who's": "who is", "let's": "let us",
    "i've": "i have", "you've": "you have", "we've": "we have", "they've": "they have",
    "i'll": "i will", "you'll": "you will", "he'll": "he will", "she'll": "she will",
    "we'll": "we will", "they'll": "they will", "it'll": "it will",
    "i'd": "i would", "you'd": "you would", "he'd": "he would", "she'd": "she would",
    "we'd": "we would", "they'd": "they would", "who'd": "who would",
    "don't": "do not", "doesn't": "does not", "didn't": "did not", "isn't": "is not",
    "aren't": "are not", "wasn't": "was not", "weren't": "were not", "haven't": "have not",
    "hasn't": "has not", "hadn't": "had not", "won't": "will not", "wouldn't": "would not",
    "can't": "cannot", "couldn't": "could not", "shouldn't": "should not",
    "mustn't": "must not", "needn't": "need not",
    "should've": "should have", "would've": "would have", "could've": "could have",
  };
  var NUMBERS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

  /** Words for comparison: lower case, no punctuation, contractions expanded. */
  function words(s) {
    var out = [];
    String(s || "")
      .toLowerCase()
      .replace(/[‘’ʼ`]/g, "'")
      .replace(/-/g, " ")
      .replace(/[^a-z0-9' ]+/g, " ")
      .split(/\s+/)
      .forEach(function (w) {
        w = w.replace(/^'+|'+$/g, "");
        if (!w) return;
        if (/^\d+$/.test(w) && NUMBERS[+w]) w = NUMBERS[+w];
        if (w === "cannot") w = "can not";
        var exp = CONTRACTIONS[w];
        if (exp === "cannot") exp = "can not";
        (exp || w).split(" ").forEach(function (p) {
          out.push(p);
        });
      });
    return out;
  }

  /** Display tokens of the real phrase, each with its comparison words. */
  function displayTokens(text) {
    return text.split(/\s+/).map(function (tok) {
      return { shown: tok, norm: words(tok) };
    });
  }

  /** Longest common subsequence: which expected words did the student get? */
  function matchedFlags(expected, typed) {
    var n = expected.length;
    var m = typed.length;
    var dp = [];
    for (var i = 0; i <= n; i++) {
      dp.push(new Array(m + 1).fill(0));
    }
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        dp[i][j] = expected[i] === typed[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var flags = new Array(n).fill(false);
    i = 0;
    j = 0;
    while (i < n && j < m) {
      if (expected[i] === typed[j]) {
        flags[i] = true;
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        i++;
      } else {
        j++;
      }
    }
    return flags;
  }

  /* ---------- speech ---------- */

  var synth = window.speechSynthesis || null;
  var VOICE_PREF_KEY = "andronicus_dictation_voice";

  /* Browsers don't say whether a voice is male or female, so go by known names
     (Chrome, Edge, macOS/iOS, Windows). If nothing matches, the pitch is shifted instead. */
  var MALE = /\b(male|daniel|arthur|oliver|george|ryan|thomas|alfie|elliot|ethan|noah|harry|fred|alex|aaron|tom|evan|rishi|gordon|lee|david|mark|guy|christopher|eric|roger|steffan|brian|andrew|davis|tony|jason|ralph)\b/i;
  var FEMALE = /\b(female|kate|serena|stephanie|martha|moira|sonia|libby|maisie|hazel|susan|bella|hollie|abbie|olivia|mia|samantha|victoria|karen|tessa|fiona|allison|ava|nicky|zoe|zira|aria|jenny|michelle|emma|ana|sara|nancy|amber|ashley|cora|elizabeth|jane|catherine|natasha|emily|siri)\b/i;

  function getGender() {
    try {
      var g = localStorage.getItem(VOICE_PREF_KEY);
      if (g === "male" || g === "female") return g;
    } catch (e) {}
    return "female";
  }
  function setGender(g) {
    try {
      localStorage.setItem(VOICE_PREF_KEY, g);
    } catch (e) {}
  }

  function langOf(v) {
    return String(v.lang || "").replace("_", "-").toLowerCase();
  }
  function genderOf(v) {
    var n = String(v.name || "");
    if (/female/i.test(n)) return "female";
    if (MALE.test(n)) return "male";
    if (FEMALE.test(n)) return "female";
    return "";
  }

  /** Best English voice for the chosen gender; `exact` says whether the gender really matched. */
  function pickVoice(gender) {
    if (!synth) return { voice: null, exact: false };
    var list = (synth.getVoices() || []).filter(function (v) {
      return langOf(v).indexOf("en") === 0;
    });
    function score(v) {
      var l = langOf(v);
      var s = 0;
      if (l === "en-gb") s += 40;
      else if (l === "en-ie") s += 35;
      else if (l === "en-us") s += 25;
      else if (l === "en-au" || l === "en-ca" || l === "en-nz") s += 15;
      if (/natural|neural|premium|enhanced|online/i.test(v.name)) s += 8;
      if (/google/i.test(v.name)) s += 5;
      if (/novelty|whisper|bells|bubbles|cellos|zarvox|trinoids|bad news|good news|jester|organ|superstar|wobble|boing|albert|bahh/i.test(v.name)) s -= 100;
      return s;
    }
    var best = null;
    var bestAny = null;
    list.forEach(function (v) {
      var sc = score(v);
      if (!bestAny || sc > score(bestAny)) bestAny = v;
      if (genderOf(v) === gender && (!best || sc > score(best))) best = v;
    });
    return best ? { voice: best, exact: true } : { voice: bestAny, exact: false };
  }
  if (synth) {
    synth.getVoices();
    if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", function () {});
  }

  function speak(text, rate, gender, onStart, onEnd) {
    if (!synth) return false;
    synth.cancel();
    var picked = pickVoice(gender);
    var u = new SpeechSynthesisUtterance(text);
    if (picked.voice) u.voice = picked.voice;
    u.lang = picked.voice ? picked.voice.lang : "en-GB";
    u.rate = rate;
    /* No voice of the right gender on this device: shift the pitch instead. */
    if (!picked.exact) {
      var g = picked.voice ? genderOf(picked.voice) : "";
      if (gender === "male" && g !== "male") u.pitch = 0.7;
      if (gender === "female" && g !== "female") u.pitch = 1.25;
    }
    u.onstart = onStart || null;
    u.onend = u.onerror = onEnd || null;
    synth.speak(u);
    return true;
  }

  /* ---------- state ---------- */

  function freshLevel() {
    return { pos: 0, best: 0, earned: {}, revealed: {}, solved: {} };
  }

  function normaliseLevel(s, total) {
    var st = freshLevel();
    if (!s || typeof s !== "object") return st;
    st.pos = Math.max(0, Math.floor(+s.pos || 0));
    st.best = Math.max(st.pos, Math.floor(+s.best || 0));
    ["earned", "revealed", "solved"].forEach(function (k) {
      st[k] = s[k] && typeof s[k] === "object" ? s[k] : {};
    });
    var max = Math.max(0, total - 1);
    if (st.pos > max) st.pos = max;
    if (st.best > max) st.best = max;
    return st;
  }

  /* ---------- view ---------- */

  function mount(panel, level, api) {
    var t = api.t;
    var list = phrases(level);
    var all = api.loadState() || {};
    var state = normaliseLevel(all[level], list.length);
    var phase = "typing"; // typing | wrong | done
    var lastTyped = "";

    var root = el("div", "dict");
    panel.innerHTML = "";
    panel.appendChild(root);

    function save() {
      var cur = api.loadState() || {};
      cur[level] = state;
      api.saveState(cur);
    }

    function current() {
      return list[state.pos];
    }

    function solvedCount() {
      return Object.keys(state.solved).length + Object.keys(state.revealed).filter(function (k) {
        return !state.solved[k];
      }).length;
    }

    function goTo(i) {
      if (i < 0 || i > state.best || i >= list.length) return;
      if (synth) synth.cancel();
      state.pos = i;
      var k = String(i);
      phase = state.solved[k] || state.revealed[k] ? "done" : "typing";
      lastTyped = "";
      save();
      render(true);
    }

    function advanceBest() {
      if (state.best <= state.pos && state.pos < list.length - 1) state.best = state.pos + 1;
    }

    var input, playBtn, slowBtn, feedback;

    function render(autoFocus) {
      root.innerHTML = "";
      if (!list.length) return;
      var p = current();
      var key = String(p.idx);

      /* header: navigation + progress */
      var head = el("div", "dict__head");
      var nav = el("div", "dict__nav");
      var prev = el("button", "dict__navbtn", "‹");
      prev.type = "button";
      prev.setAttribute("aria-label", t("dict_prev"));
      prev.disabled = state.pos <= 0;
      prev.addEventListener("click", function () {
        goTo(state.pos - 1);
      });
      var title = el("div", "dict__title");
      title.appendChild(el("strong", null, t("dict_phrase", { n: String(state.pos + 1) })));
      title.appendChild(el("span", "dict__of", t("dict_of", { t: String(list.length) })));
      var next = el("button", "dict__navbtn", "›");
      next.type = "button";
      next.setAttribute("aria-label", t("dict_next"));
      next.disabled = state.pos >= state.best || state.pos >= list.length - 1;
      next.addEventListener("click", function () {
        goTo(state.pos + 1);
      });
      nav.appendChild(prev);
      nav.appendChild(title);
      nav.appendChild(next);
      head.appendChild(nav);
      head.appendChild(el("p", "dict__sub", t("dict_progress", { n: String(solvedCount()), t: String(list.length) })));
      root.appendChild(head);

      /* card */
      var card = el("div", "dict__card");
      var pill = el("span", "dict__pill dict__pill--" + p.diff);
      pill.textContent = t(DIFF_KEY[p.diff]) + " · " + t(POINTS[p.diff] === 1 ? "dict_point" : "dict_points", { n: String(POINTS[p.diff]) });
      var top = el("div", "dict__top");
      top.appendChild(pill);
      if (synth) {
        var seg = el("div", "dict__voice");
        seg.setAttribute("role", "group");
        seg.setAttribute("aria-label", t("dict_voice"));
        seg.appendChild(el("span", "dict__voicelabel", t("dict_voice")));
        ["female", "male"].forEach(function (g) {
          var b = el("button", "dict__voicebtn" + (getGender() === g ? " is-on" : ""), t(g === "male" ? "dict_voice_male" : "dict_voice_female"));
          b.type = "button";
          b.setAttribute("aria-pressed", getGender() === g ? "true" : "false");
          b.addEventListener("click", function () {
            setGender(g);
            seg.querySelectorAll(".dict__voicebtn").forEach(function (x) {
              var on = x === b;
              x.classList.toggle("is-on", on);
              x.setAttribute("aria-pressed", on ? "true" : "false");
            });
            play(RATE_NORMAL, playBtn);
          });
          seg.appendChild(b);
        });
        top.appendChild(seg);
      }
      card.appendChild(top);

      if (!synth) {
        card.appendChild(el("p", "dict__warn", t("dict_no_speech")));
      }

      var players = el("div", "dict__players");
      playBtn = el("button", "dict__play");
      playBtn.type = "button";
      playBtn.innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
      playBtn.appendChild(el("span", null, t("dict_listen")));
      playBtn.disabled = !synth;
      playBtn.addEventListener("click", function () {
        play(RATE_NORMAL, playBtn);
      });
      slowBtn = el("button", "dict__slow", t("dict_slow"));
      slowBtn.type = "button";
      slowBtn.disabled = !synth;
      slowBtn.addEventListener("click", function () {
        play(RATE_SLOW, slowBtn);
      });
      players.appendChild(playBtn);
      players.appendChild(slowBtn);
      card.appendChild(players);

      if (phase === "done") {
        renderAnswer(card, p, null, true);
        var earnedHere = state.earned[key];
        card.appendChild(
          el(
            "p",
            "dict__msg " + (state.solved[key] ? "is-good" : "is-info"),
            state.solved[key]
              ? earnedHere
                ? t("dict_solved_points", { n: String(earnedHere) })
                : t("dict_solved")
              : t("dict_revealed_note")
          )
        );
        var doneBtns = el("div", "dict__btns");
        if (state.pos < list.length - 1) {
          var nb = el("button", "dict__btn dict__btn--primary", t("dict_next_phrase"));
          nb.type = "button";
          nb.addEventListener("click", function () {
            goTo(state.pos + 1);
          });
          doneBtns.appendChild(nb);
          setTimeout(function () {
            if (autoFocus) nb.focus();
          }, 0);
        } else {
          doneBtns.appendChild(el("p", "dict__msg is-good", t("dict_all_done")));
        }
        card.appendChild(doneBtns);
        root.appendChild(card);
        renderFooter();
        return;
      }

      var label = el("label", "dict__label", t("dict_type_label"));
      label.setAttribute("for", "dict-input-" + level);
      card.appendChild(label);
      input = el("textarea", "dict__input");
      input.id = "dict-input-" + level;
      input.rows = 2;
      input.setAttribute("autocomplete", "off");
      input.setAttribute("autocorrect", "off");
      input.setAttribute("autocapitalize", "off");
      input.setAttribute("spellcheck", "false");
      input.placeholder = t("dict_placeholder");
      input.value = lastTyped;
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          check();
        }
      });
      card.appendChild(input);

      feedback = el("div", "dict__feedback");
      feedback.setAttribute("aria-live", "polite");
      card.appendChild(feedback);
      if (phase === "wrong") renderWrong(p, lastTyped);

      var btns = el("div", "dict__btns");
      var checkBtn = el("button", "dict__btn dict__btn--primary", t("dict_check"));
      checkBtn.type = "button";
      checkBtn.addEventListener("click", check);
      btns.appendChild(checkBtn);
      var reveal = el("button", "dict__btn", t("dict_show_answer"));
      reveal.type = "button";
      reveal.addEventListener("click", function () {
        if (!state.solved[key]) state.revealed[key] = 1;
        advanceBest();
        phase = "done";
        save();
        render(true);
      });
      btns.appendChild(reveal);
      card.appendChild(btns);

      root.appendChild(card);
      renderFooter();
      if (autoFocus) {
        setTimeout(function () {
          try {
            input.focus({ preventScroll: true });
          } catch (e) {}
        }, 0);
      }
    }

    function renderFooter() {
      if (api.signedIn && !api.signedIn()) {
        root.appendChild(el("p", "dict__note", t("dict_signin")));
      }
    }

    function play(rate, btn) {
      var p = current();
      speak(
        p.text,
        rate,
        getGender(),
        function () {
          btn.classList.add("is-playing");
        },
        function () {
          btn.classList.remove("is-playing");
        }
      );
      if (input) {
        try {
          input.focus({ preventScroll: true });
        } catch (e) {}
      }
    }

    /** Shows the real phrase, with the words the student missed highlighted. */
    function renderAnswer(container, p, flags, allGood) {
      var box = el("p", "dict__answer");
      var toks = displayTokens(p.text);
      var cursor = 0;
      toks.forEach(function (tok, i) {
        var ok = true;
        if (flags) {
          for (var k = 0; k < tok.norm.length; k++) if (!flags[cursor + k]) ok = false;
        }
        cursor += tok.norm.length;
        var span = el("span", "dict__word" + (allGood ? "" : ok ? " is-ok" : " is-miss"), tok.shown);
        box.appendChild(span);
        if (i < toks.length - 1) box.appendChild(document.createTextNode(" "));
      });
      container.appendChild(box);
    }

    function renderWrong(p, typed) {
      feedback.innerHTML = "";
      var expected = words(p.text);
      var flags = matchedFlags(expected, words(typed));
      var right = flags.filter(Boolean).length;
      feedback.appendChild(
        el("p", "dict__msg is-bad", t("dict_almost", { n: String(right), t: String(expected.length) }))
      );
      /* Only the shape, not the words: blanks for missed words so they listen again. */
      var hintBox = el("p", "dict__answer dict__answer--hint");
      var toks = displayTokens(p.text);
      var cursor = 0;
      toks.forEach(function (tok, i) {
        var ok = true;
        for (var k = 0; k < tok.norm.length; k++) if (!flags[cursor + k]) ok = false;
        cursor += tok.norm.length;
        var span = el("span", "dict__word " + (ok ? "is-ok" : "is-blank"), ok ? tok.shown : "_".repeat(Math.max(3, tok.shown.length)));
        hintBox.appendChild(span);
        if (i < toks.length - 1) hintBox.appendChild(document.createTextNode(" "));
      });
      feedback.appendChild(hintBox);
      feedback.appendChild(el("p", "dict__tip", t("dict_try_again")));
    }

    function check() {
      var p = current();
      var key = String(p.idx);
      var typed = input ? input.value : "";
      if (!words(typed).length) {
        feedback.innerHTML = "";
        feedback.appendChild(el("p", "dict__msg is-info", t("dict_empty")));
        return;
      }
      lastTyped = typed;
      var expected = words(p.text);
      var got = words(typed);
      var perfect = expected.length === got.length && expected.every(function (w, i) {
        return w === got[i];
      });
      if (!perfect) {
        phase = "wrong";
        renderWrong(p, typed);
        if (input) {
          input.classList.remove("is-shake");
          void input.offsetWidth;
          input.classList.add("is-shake");
        }
        return;
      }
      state.solved[key] = 1;
      if (!state.earned[key] && !state.revealed[key] && api.signedIn && api.signedIn()) {
        var pts = POINTS[p.diff];
        state.earned[key] = pts;
        api.addPoints(pts);
      }
      advanceBest();
      phase = "done";
      save();
      render(true);
    }

    function startPhase() {
      var k = String(current() ? current().idx : 0);
      phase = state.solved[k] || state.revealed[k] ? "done" : "typing";
    }
    startPhase();

    return {
      render: function () {
        var fresh = api.loadState() || {};
        state = normaliseLevel(fresh[level], list.length);
        startPhase();
        render(false);
      },
      stop: function () {
        if (synth) synth.cancel();
      },
    };
  }

  function count(level) {
    return (RAW[level] || []).length;
  }

  window.AndronicusDictation = { mount: mount, count: count, words: words };
})();
