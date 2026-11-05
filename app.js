(function () {
  const I18n = window.AndronicusI18n;
  if (!I18n) {
    console.error("i18n.js must load before app.js");
    return;
  }

  I18n.apply();
  I18n.initLangSwitch(document);
  I18n.initThemeSwitch(document);

  const learningToolsLangRefreshers = [];
  const flashcardOrderRefreshers = [];

  const PROGRESS_DAY_KEYS = [
    "slot_day_sun",
    "slot_day_mon",
    "slot_day_tue",
    "slot_day_wed",
    "slot_day_thu",
    "slot_day_fri",
    "slot_day_sat",
  ];

  const STREAK_MILESTONES = [3, 7, 14, 30];
  const STREAK_CONFETTI_COLORS = ["#1d4ed8", "#059669", "#7c3aed", "#f59e0b", "#ef4444"];

  const LANDING_TOOL_ICONS = {
    verbs:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
    flashcards:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    vocab:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    grammar:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    homework:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    progress:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  };

  function applyLandingCardIcons(root) {
    root.querySelectorAll(".level-landing__card[data-tool]").forEach(function (card) {
      const tool = card.getAttribute("data-tool");
      const iconEl = card.querySelector(".level-landing__card__icon");
      if (iconEl && tool && LANDING_TOOL_ICONS[tool]) {
        iconEl.innerHTML = LANDING_TOOL_ICONS[tool];
      }
    });
  }

  function hwProgressBarColor(pct) {
    const t = Math.max(0, Math.min(100, pct)) / 100;
    const from = { r: 26, g: 111, b: 163 };
    const to = { r: 22, g: 163, b: 74 };
    const r = Math.round(from.r + (to.r - from.r) * t);
    const g = Math.round(from.g + (to.g - from.g) * t);
    const b = Math.round(from.b + (to.b - from.b) * t);
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

  function playElementAnimation(el, animation) {
    if (!el) return;
    el.style.animation = "none";
    requestAnimationFrame(function () {
      el.style.animation = animation;
      el.addEventListener(
        "animationend",
        function () {
          el.style.animation = "";
        },
        { once: true }
      );
    });
  }

  function haptic(pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (e) {}
  }

  function showStreakCelebration(days) {
    const overlay = document.createElement("div");
    overlay.className = "streak-celebration";
    for (let i = 0; i < 24; i += 1) {
      const particle = document.createElement("span");
      particle.className = "confetti-particle";
      particle.style.left = 5 + Math.random() * 90 + "%";
      particle.style.animationDelay = Math.random() * 0.6 + "s";
      particle.style.background =
        STREAK_CONFETTI_COLORS[Math.floor(Math.random() * STREAK_CONFETTI_COLORS.length)];
      overlay.appendChild(particle);
    }
    const emoji = document.createElement("div");
    emoji.className = "streak-celebration__emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = "🔥";
    const heading = document.createElement("h2");
    heading.textContent = I18n.t("streak_days_title", { n: String(days) });
    const subline = document.createElement("p");
    subline.textContent = I18n.t("streak_keep_going");
    overlay.appendChild(emoji);
    overlay.appendChild(heading);
    overlay.appendChild(subline);
    document.body.appendChild(overlay);
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 2800);
  }

  function showTopicCompleteFlash(container, topicName) {
    const flash = document.createElement("div");
    flash.className = "topic-complete-flash";
    const check = document.createElement("div");
    check.className = "topic-complete-flash__check";
    check.textContent = "✓";
    check.setAttribute("aria-hidden", "true");
    const title = document.createElement("div");
    title.className = "topic-complete-flash__title";
    title.textContent = I18n.t("topic_complete_title");
    const name = document.createElement("div");
    name.className = "topic-complete-flash__name";
    name.textContent = topicName;
    flash.appendChild(check);
    flash.appendChild(title);
    flash.appendChild(name);
    document.body.appendChild(flash);
    return flash;
  }

  function burstParticles(el) {
    if (!el || !el.getBoundingClientRect) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 8; i += 1) {
      const particle = document.createElement("span");
      particle.className = "gap-burst-particle";
      particle.style.left = cx + "px";
      particle.style.top = cy + "px";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "1500";
      const angle = Math.random() * 360;
      const dist = 30 + Math.random() * 40;
      const dx = Math.cos((angle * Math.PI) / 180) * dist;
      const dy = Math.sin((angle * Math.PI) / 180) * dist;
      document.body.appendChild(particle);
      const anim = particle.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          {
            transform: "translate(" + dx + "px, " + dy + "px) scale(0)",
            opacity: 0,
          },
        ],
        { duration: 600, easing: "ease-out", fill: "forwards" }
      );
      if (anim && anim.finished) {
        anim.finished.then(function () {
          particle.remove();
        });
      } else {
        setTimeout(function () {
          particle.remove();
        }, 600);
      }
    }
  }

  function refreshStaticPageCopy() {
    const bannerText = document.querySelector(".home-free-banner__text");
    if (bannerText) bannerText.textContent = I18n.t("home_free_banner_text");
    const bannerBtn = document.querySelector(".home-free-banner__btn");
    if (bannerBtn) bannerBtn.textContent = I18n.t("hero_cta_book_now");
    const navPrice = document.querySelector(".nav-card__price");
    if (navPrice) navPrice.textContent = I18n.t("nav_booking_price");
    const bookingCallout = document.querySelector(".booking-price-callout");
    if (bookingCallout) bookingCallout.textContent = I18n.t("booking_price_callout");
    document.querySelectorAll(".btn-level").forEach(function (btn) {
      const level = btn.getAttribute("data-level");
      const desc = btn.querySelector(".btn-level__desc");
      if (desc && level) desc.textContent = I18n.t("btn_level_desc_" + level);
    });
    document.querySelectorAll(".level-landing__grid").forEach(function (grid) {
      grid.setAttribute("aria-label", I18n.t("level_landing_grid_aria"));
    });
    const footerBrand = document.querySelector(".site-footer__brand");
    if (footerBrand) footerBrand.textContent = I18n.t("footer_line");
    const footerContact = document.querySelector(".site-footer__contact");
    if (footerContact) footerContact.innerHTML = I18n.t("footer_contact_html");
  }

  refreshStaticPageCopy();

  const FLASHCARD_FIRST_LANG_KEY = "andronicus_flashcard_first_lang";

  function readFlashcardFirstLang() {
    try {
      return localStorage.getItem(FLASHCARD_FIRST_LANG_KEY) === "fr" ? "fr" : "en";
    } catch (e) {
      return "en";
    }
  }

  function writeFlashcardFirstLang(v) {
    const next = v === "fr" ? "fr" : "en";
    try {
      localStorage.setItem(FLASHCARD_FIRST_LANG_KEY, next);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent("andronicus:flashcardorder"));
  }

  window.addEventListener("andronicus:flashcardorder", function () {
    flashcardOrderRefreshers.forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    });
  });

  const CONTENT_PASSWORD = "123";

  const introOverlay = document.getElementById("intro-overlay");
  const app = document.getElementById("app");
  const mainNav = document.querySelector(".main-nav");
  const btnHome = document.getElementById("btn-home");
  const panelHome = document.getElementById("panel-home");
  const panels = document.querySelectorAll(".panel:not(.panel--home)");

  const contentPasswordForm = document.getElementById("content-password-form");
  const contentPasswordInput = document.getElementById("content-password");
  const contentPasswordError = document.getElementById("content-password-error");
  const contentPasswordOverlay = document.getElementById("content-password-overlay");
  const contentPasswordClose = document.getElementById("content-password-close");
  const contentPasswordForLevel = document.getElementById("content-password-for-level");
  const levelPicker = document.getElementById("level-picker");
  const contentBreadcrumb = document.getElementById("content-breadcrumb");
  const scrollTopBtn = document.getElementById("scroll-top-btn");
  const mobileBottomNav = document.getElementById("mobile-bottom-nav");

  const MOBILE_NAV_SECTIONS = ["home", "content", "booking", "account"];
  let mobileNavSection = "home";

  function updateMobileNav(sectionId) {
    if (sectionId !== undefined) {
      mobileNavSection = sectionId;
    }
    if (!mobileBottomNav) return;
    mobileBottomNav.querySelectorAll(".mobile-bottom-nav__btn").forEach(function (btn) {
      btn.classList.toggle(
        "is-active",
        !!mobileNavSection && btn.getAttribute("data-section") === mobileNavSection
      );
    });
  }

  const bookingForm = document.getElementById("booking-form");
  const bookingParentNameInput = document.getElementById("booking-parent-name");
  const bookingParentEmailInput = document.getElementById("booking-parent-email");
  const bookingStudentNameInput = document.getElementById("booking-student-name");
  const bookingPhoneInput = document.getElementById("booking-phone");
  const bookingLevelInput = document.getElementById("booking-level");
  const bookingTimesUnknownInput = document.getElementById("booking-times-unknown");
  const bookingCalendar = document.getElementById("booking-calendar");
  const bookingSuccess = document.getElementById("booking-success");
  const bookingDayGrid = document.getElementById("booking-day-grid");
  const bookingHoursWrap = document.getElementById("booking-hours-wrap");
  const bookingHoursGrid = document.getElementById("booking-hours-grid");
  const bookingTimesHeading = document.getElementById("booking-times-heading");
  const bookingHiddenSlots = document.getElementById("booking-slots-hidden");
  const bookingSelectedList = document.getElementById("booking-selected-list");
  const bookingSelectedEmpty = document.getElementById("booking-selected-empty");
  const bookingSlotsWarning = document.getElementById("booking-slots-warning");
  const accountAuth = document.getElementById("account-auth");
  const accountRegisterForm = document.getElementById("account-register-form");
  const accountLoginForm = document.getElementById("account-login-form");
  const accountAuthFeedback = document.getElementById("account-auth-feedback");
  const accountDashboard = document.getElementById("account-dashboard");
  const accountWelcome = document.getElementById("account-welcome");
  const accountLogoutBtn = document.getElementById("account-logout-btn");
  const accountProgressCards = document.getElementById("account-progress-cards");
  const accountCompletedExercises = document.getElementById("account-completed-exercises");
  const accountForgotDialog = document.getElementById("account-forgot-dialog");
  const accountForgotOpen = document.getElementById("account-forgot-open");
  const adminLoginWrap = document.getElementById("admin-login-wrap");
  const adminPasswordInput = document.getElementById("admin-password");
  const adminLoginBtn = document.getElementById("admin-login-btn");
  const adminLoginFeedback = document.getElementById("admin-login-feedback");
  const adminDashboard = document.getElementById("admin-dashboard");
  const adminReminderBanner = document.getElementById("admin-reminder-banner");
  const adminLogoutBtn = document.getElementById("admin-logout-btn");
  const adminStudentsTableBody = document.querySelector("#admin-students-table tbody");
  const adminStudentListWrap = document.getElementById("admin-student-list-wrap");
  const adminStudentDetail = document.getElementById("admin-student-detail");
  const adminStudentDetailInner = document.getElementById("admin-student-detail-inner");
  const adminStudentBackBtn = document.getElementById("admin-student-back-btn");
  const adminBookingsTableBody = document.querySelector("#admin-bookings-table tbody");
  const adminTabs = document.querySelectorAll("#admin-dashboard [data-admin-tab]");
  const adminBookingsTab = document.getElementById("admin-bookings-tab");
  const adminProgressTab = document.getElementById("admin-progress-tab");
  const adminPaymentsTab = document.getElementById("admin-payments-tab");
  const adminLeaderboardTab = document.getElementById("admin-leaderboard-tab");
  const adminLeaderboardTbody = document.getElementById("admin-leaderboard-tbody");
  const adminPlannerTab = document.getElementById("admin-planner-tab");
  const adminPlannerContent = document.getElementById("admin-planner-content");
  const adminWritingTab = document.getElementById("admin-writing-tab");
  const adminPointsTab = document.getElementById("admin-points-tab");
  const adminPaymentForm = document.getElementById("admin-payment-form");
  const adminSendEmailsBtn = document.getElementById("admin-send-emails-btn");
  const adminSendEmailsStatus = document.getElementById("admin-send-emails-status");
  const adminPaymentNameInput = document.getElementById("admin-payment-name");
  const adminPaymentOwedInput = document.getElementById("admin-payment-owed");
  const adminPaymentList = document.getElementById("admin-payment-list");
  const adminCornerBtn = document.getElementById("admin-corner-btn");
  const adminCloudStatus = document.getElementById("admin-cloud-status");
  const adminCloudRefreshBtn = document.getElementById("admin-cloud-refresh-btn");
  const bookingSuccessDetail = document.getElementById("booking-success-detail");
  const bookingSuccessWarning = document.getElementById("booking-success-warning");
  const bookingSubmitError = document.getElementById("booking-submit-error");

  const DAY_KEYS = [
    "slot_day_mon",
    "slot_day_tue",
    "slot_day_wed",
    "slot_day_thu",
    "slot_day_fri",
    "slot_day_sat",
    "slot_day_sun",
  ];

  let bookingDayLabels = [];
  let bookingActiveDayIndex = null;
  /**
   * @type {{ dayIndex: number; hour: number }[]}
   * dayIndex: Mon=0 … Sun=6; hour is the start hour (24h) in France (Europe/Paris local time).
   */
  let bookingSlotSelections = [];

  /**
   * Weekly one-to-one slots, in France (Paris) time. Key = start hour (24h); each class lasts one hour.
   * "open" = can be requested, "full" = shown as sold out. Leave a day or hour out to hide it.
   * To open or close a slot later, just change it here.
   */
  const BOOKING_SCHEDULE = {
    0: { 18: "full", 19: "open", 20: "open", 21: "open" }, // Monday
    1: { 17: "open", 18: "open", 19: "open", 21: "open" }, // Tuesday
    2: { 17: "open", 18: "open", 19: "open", 21: "open" }, // Wednesday
    3: { 17: "full", 18: "full", 19: "full", 20: "full" }, // Thursday
    4: { 17: "full", 18: "full", 19: "full", 20: "full" }, // Friday
  };

  const INTRO_MS = 1200;
  /** Large decks use a random sample so one session can finish in a class period. */
  const FLASHCARD_SESSION_CAP = 48;
  const USERS_KEY = "andronicus_users_v1";
  const ACTIVE_USER_KEY = "andronicus_active_user_v1";
  const BOOKINGS_KEY = "andronicus_bookings_v1";
  const PAYMENTS_KEY = "andronicus_payments_v1";
  const ADMIN_PASSWORD = "321";

  let pendingLevel = null;
  let users = {};
  let activeUsername = null;
  let homeworkPanelRenderers = [];
  let adminUnlocked = false;
  let adminViewingStudent = null;
  let adminStudentsLoading = false;
  let adminStudentsError = "";
  let adminStudentsFetched = false;
  let bookings = [];
  let paymentChecklist = [];
  let supabaseClient = null;
  let vocabPathRenderers = [];
  let pointsState = { user: null, loading: false, loaded: false, awards: [] };
  let pointsBadge = null;
  let adminPoints = { loading: false, loaded: false, error: "", awards: [], flash: "" };
  let writingState = { user: null, loading: false, loaded: false, error: "", byTask: {} };
  let writingEditor = null;
  let adminWriting = { loading: false, loaded: false, error: "", rows: [], filter: "todo", openId: null, dirty: false };
  let userCloudSyncTimer = null;
  let userCloudSyncInFlight = false;
  let userCloudSyncQueued = false;
  let userCloudSyncPendingSince = 0;
  const USER_CLOUD_SYNC_MAX_WAIT = 5000;

  const EXERCISE_TOPIC_FR = {
    "Possessive adjectives (my/your/his/her/our/their)": "Les adjectifs possessifs",
    "Present simple vs present continuous": "Present simple et present continuous",
    "There is / there are": "There is / There are",
    "Question forms (do/does/is/are)": "Les formes interrogatives",
    "Articles (a / an / the)": "Les articles",
    "Prepositions of place": "Prépositions de lieu",
    "Countable and uncountable nouns": "Noms dénombrables et indénombrables",
    "Can / can't for ability": "Can / can't (capacité)",
    "Past simple regular/irregular verbs": "Past simple",
    "Object pronouns (me/you/him/her/us/them)": "Pronoms compléments",
    "Future forms (going to / will)": "Futur (going to / will)",
    "Possessive adjectives in context": "Adjectifs possessifs en contexte",
    "Present perfect vs past simple": "Present perfect vs past simple",
    "Relative clauses (who/which/that)": "Propositions relatives",
    "Modal verbs for advice and obligation": "Modaux (conseil et obligation)",
    "Conditionals (0, 1st, 2nd)": "Les conditionnels (types 0, 1 et 2)",
    "Reported speech": "Discours indirect",
    "Passive voice in context": "Voix passive",
    "Comparatives and superlatives for argument writing": "Comparatif et superlatif",
    "Essay paragraph structure (PEEL)": "Structure de paragraphe (PEEL)",
    "Linkers for cohesion (however, therefore, moreover)": "Connecteurs logiques",
    "Error correction and redrafting": "Correction et réécriture",
    "Possessive adjectives in advanced writing": "Adjectifs possessifs (écriture avancée)",
    "Cleft and inversion practice": "Phrases clivées et inversion",
    "Hedging and academic caution": "La prudence dans l’écrit académique",
    "Nominalisation for formal writing": "Nominalisation",
    "Paraphrasing and synonym control": "Paraphrase et synonymes",
    "Complex sentence cohesion": "La cohésion des phrases complexes",
    "Advanced punctuation and clarity": "Ponctuation avancée",
    "Synthesis writing from two sources": "Synthèse de deux sources",
    "Timed high-level speaking response": "Oral chronométré",
    "Abstract topic essay planning": "Plan d’un essai sur un sujet abstrait",
    "Source comparison and reliability": "Comparaison de sources",
  };

  const EXERCISE_SUBTITLE_FR = {
    "Possessive adjectives (my/your/his/her/our/their)": "mon, ton, son, sa, notre, leur",
    "Present simple vs present continuous": "I eat / I am eating",
    "There is / there are": "There is a… / There are…",
    "Question forms (do/does/is/are)": "Do, Does, Is, Are",
    "Articles (a / an / the)": "a, an, the",
    "Prepositions of place": "in, on, at, under, next to",
    "Countable and uncountable nouns": "many, much, some, a lot of",
    "Can / can't for ability": "I can swim / She can't drive",
    "Past simple regular/irregular verbs": "went, played, saw, didn't",
    "Object pronouns (me/you/him/her/us/them)": "me, him, her, us, them",
    "Future forms (going to / will)": "going to / will",
    "Possessive adjectives in context": "his / her / their + nom",
    "Present perfect vs past simple": "have done / did yesterday",
    "Relative clauses (who/which/that)": "who, which, that, whose",
    "Modal verbs for advice and obligation": "should, must, mustn't, have to",
    "Conditionals (0, 1st, 2nd)": "if + present, will / would",
    "Reported speech": "said she was, would, could",
    "Passive voice in context": "is made, was built, been stolen",
    "Comparatives and superlatives for argument writing": "more… than, the best",
    "Essay paragraph structure (PEEL)": "Point, Evidence, Explain, Link",
    "Linkers for cohesion (however, therefore, moreover)": "however, therefore, moreover",
    "Error correction and redrafting": "3rd person -s, told me, agree",
    "Possessive adjectives in advanced writing": "its policy, their results",
    "Cleft and inversion practice": "It was… who, Rarely do…",
    "Hedging and academic caution": "may, might, appears to",
    "Nominalisation for formal writing": "analysis, decision, improvement",
    "Paraphrasing and synonym control": "significant, demonstrate, issue",
    "Complex sentence cohesion": "although, whereas, however",
    "Advanced punctuation and clarity": "semicolon, colon, comma splice",
    "Synthesis writing from two sources": "Source A argues, while B…",
    "Timed high-level speaking response": "First, However, To sum up",
    "Abstract topic essay planning": "thesis, points, counterargument",
    "Source comparison and reliability": "bias, evidence, reliability",
  };

  function exerciseTopicLabel(ex) {
    if (I18n.getLang() === "fr" && EXERCISE_TOPIC_FR[ex.topic]) {
      return EXERCISE_TOPIC_FR[ex.topic];
    }
    return ex.topic;
  }

  function exerciseSubtitleLabel(ex) {
    if (I18n.getLang() === "fr" && EXERCISE_SUBTITLE_FR[ex.topic]) {
      return EXERCISE_SUBTITLE_FR[ex.topic];
    }
    return ex.subtitle || "";
  }

  const learningData = {
    beginner: {
      flashcards: {
        "Core Everyday": [
          { front: "Hello", back: "Bonjour" },
          { front: "Good morning", back: "Bonjour (matin)" },
          { front: "How are you?", back: "Comment ça va ?" },
          { front: "Please", back: "S'il vous plaît" },
          { front: "Thank you", back: "Merci" },
          { front: "See you tomorrow", back: "À demain" },
          { front: "Good evening", back: "Bonsoir" },
          { front: "Good night", back: "Bonne nuit" },
          { front: "Goodbye", back: "Au revoir" },
          { front: "Excuse me", back: "Excusez-moi" },
          { front: "Sorry", back: "Désolé" },
          { front: "Yes / No", back: "Oui / Non" },
          { front: "Maybe", back: "Peut-être" },
          { front: "I don't understand", back: "Je ne comprends pas" },
          { front: "Can you repeat?", back: "Pouvez-vous répéter ?" },
          { front: "How do you say...?", back: "Comment dit-on ... ?" },
          { front: "What does that mean?", back: "Qu'est-ce que ça veut dire ?" },
          { front: "I would like", back: "Je voudrais" },
          { front: "I need help", back: "J'ai besoin d'aide" },
          { front: "Where is...?", back: "Où est... ?" },
          { front: "What time is it?", back: "Quelle heure est-il ?" },
          { front: "Nice to meet you", back: "Enchanté" },
        ],
        "School and Study": [
          { front: "Homework", back: "Devoirs" },
          { front: "Notebook", back: "Cahier" },
          { front: "Classroom", back: "Salle de classe" },
          { front: "Exam", back: "Examen" },
          { front: "To learn", back: "Apprendre" },
          { front: "To improve", back: "Améliorer" },
          { front: "Teacher", back: "Professeur" },
          { front: "Student", back: "Élève" },
          { front: "Lesson", back: "Leçon" },
          { front: "Break time", back: "Récréation" },
          { front: "Dictionary", back: "Dictionnaire" },
          { front: "Pencil case", back: "Trousse" },
          { front: "Ruler", back: "Règle" },
          { front: "Eraser", back: "Gomme" },
          { front: "Sharpener", back: "Taille-crayon" },
          { front: "School bag", back: "Cartable" },
          { front: "Timetable", back: "Emploi du temps" },
          { front: "Mark / grade", back: "Note" },
          { front: "Subject", back: "Matière" },
          { front: "Science lab", back: "Salle de sciences" },
          { front: "Playground", back: "Cour de récréation" },
          { front: "Head teacher", back: "Directeur / directrice" },
        ],
        "Home and Town": [
          { front: "Kitchen", back: "Cuisine" },
          { front: "Bedroom", back: "Chambre" },
          { front: "Library", back: "Bibliothèque" },
          { front: "Crossroad", back: "Carrefour" },
          { front: "Neighbourhood", back: "Quartier" },
          { front: "Traffic lights", back: "Feux de circulation" },
          { front: "Bus stop", back: "Arrêt de bus" },
          { front: "Train station", back: "Gare" },
          { front: "Post office", back: "Bureau de poste" },
          { front: "Pharmacy", back: "Pharmacie" },
          { front: "Bakery", back: "Boulangerie" },
          { front: "Supermarket", back: "Supermarché" },
          { front: "Park", back: "Parc" },
          { front: "Bridge", back: "Pont" },
          { front: "River", back: "Rivière" },
          { front: "Turn left", back: "Tournez à gauche" },
          { front: "Turn right", back: "Tournez à droite" },
          { front: "Go straight on", back: "Allez tout droit" },
          { front: "Is it far?", back: "C'est loin ?" },
          { front: "Near / far", back: "Près / loin" },
          { front: "City centre", back: "Centre-ville" },
          { front: "Map", back: "Plan / carte" },
        ],
        "Food and Shopping": [
          { front: "Receipt", back: "Ticket de caisse" },
          { front: "Price", back: "Prix" },
          { front: "Cheap", back: "Bon marché" },
          { front: "Expensive", back: "Cher" },
          { front: "Would like", back: "Voudrais" },
          { front: "How much is it?", back: "C'est combien ?" },
          { front: "Shopping basket", back: "Panier" },
          { front: "Trolley", back: "Caddie" },
          { front: "Cashier", back: "Caissier / caissière" },
          { front: "Credit card", back: "Carte bancaire" },
          { front: "Cash", back: "Liquide" },
          { front: "Change (money)", back: "Monnaie" },
          { front: "Discount", back: "Réduction" },
          { front: "Special offer", back: "Promotion" },
          { front: "Fresh bread", back: "Pain frais" },
          { front: "Dairy products", back: "Produits laitiers" },
          { front: "Fruit and vegetables", back: "Fruits et légumes" },
          { front: "Bottle of water", back: "Bouteille d'eau" },
          { front: "Can I try it on?", back: "Est-ce que je peux l'essayer ?" },
          { front: "It doesn't fit", back: "Ça ne me va pas" },
          { front: "Size", back: "Taille" },
          { front: "Queue / line", back: "File d'attente" },
        ],
        "In the house": [
          { front: "Living room", back: "Salon" },
          { front: "Dining room", back: "Salle à manger" },
          { front: "Bathroom", back: "Salle de bain" },
          { front: "Toilet", back: "WC / toilettes" },
          { front: "Hallway", back: "Couloir" },
          { front: "Stairs", back: "Escalier" },
          { front: "Ceiling", back: "Plafond" },
          { front: "Floor", back: "Sol" },
          { front: "Wall", back: "Mur" },
          { front: "Window", back: "Fenêtre" },
          { front: "Door", back: "Porte" },
          { front: "Light switch", back: "Interrupteur" },
          { front: "Socket / plug", back: "Prise (électrique)" },
          { front: "Radiator", back: "Radiateur" },
          { front: "Sofa", back: "Canapé" },
          { front: "Armchair", back: "Fauteuil" },
          { front: "Table", back: "Table" },
          { front: "Chair", back: "Chaise" },
          { front: "Fridge", back: "Réfrigérateur" },
          { front: "Oven", back: "Four" },
          { front: "Sink", back: "Évier" },
          { front: "Cupboard", back: "Placard" },
          { front: "Wardrobe", back: "Armoire" },
          { front: "Mirror", back: "Miroir" },
          { front: "Towel", back: "Serviette" },
          { front: "Blanket", back: "Couverture" },
          { front: "Pillow", back: "Oreiller" },
          { front: "Sheet", back: "Drap" },
          { front: "Basement", back: "Sous-sol" },
          { front: "Attic", back: "Grenier" },
          { front: "Garden", back: "Jardin" },
          { front: "Gate", back: "Portail" },
          { front: "Key", back: "Clef" },
          { front: "Lock", back: "Serrure" },
          { front: "Smoke alarm", back: "Détecteur de fumée" },
          { front: "Bin / trash", back: "Poubelle" },
        ],
        "Sports and fitness": [
          { front: "Team", back: "Équipe" },
          { front: "Match", back: "Match" },
          { front: "Training", back: "Entraînement" },
          { front: "Coach", back: "Entraîneur" },
          { front: "Stadium", back: "Stade" },
          { front: "Swimming pool", back: "Piscine" },
          { front: "Tennis court", back: "Court de tennis" },
          { front: "To win", back: "Gagner" },
          { front: "To lose", back: "Perdre" },
          { front: "Draw / tie", back: "Match nul" },
          { front: "Referee", back: "Arbitre" },
          { front: "Captain", back: "Capitaine" },
          { front: "Warm up", back: "Échauffement" },
          { front: "Tired", back: "Fatigué" },
          { front: "Injury", back: "Blessure" },
          { front: "Basketball", back: "Basket-ball" },
          { front: "Rugby", back: "Rugby" },
          { front: "Athletics", back: "Athlétisme" },
          { front: "Cycling", back: "Cyclisme" },
          { front: "Skiing", back: "Ski" },
          { front: "Hiking", back: "Randonnée" },
          { front: "Jogging", back: "Footing" },
          { front: "Yoga", back: "Yoga" },
          { front: "Gym", back: "Salle de sport" },
          { front: "Dumbbells", back: "Haltères" },
          { front: "Treadmill", back: "Tapis de course" },
          { front: "Helmet", back: "Casque" },
          { front: "Whistle", back: "Sifflet" },
          { front: "Half-time", back: "Mi-temps" },
          { front: "Extra time", back: "Prolongations" },
          { front: "Penalty", back: "Penalty" },
          { front: "Goal", back: "But" },
          { front: "Fans", back: "Supporters" },
          { front: "Cheer", back: "Encourager" },
        ],
        "Action verbs (daily life)": [
          { front: "Eat", back: "Manger" },
          { front: "Drink", back: "Boire" },
          { front: "Sleep", back: "Dormir" },
          { front: "Play", back: "Jouer" },
          { front: "Watch", back: "Regarder" },
          { front: "Listen", back: "Écouter" },
          { front: "Read", back: "Lire" },
          { front: "Study", back: "Étudier" },
          { front: "Write", back: "Écrire" },
          { front: "Speak", back: "Parler" },
          { front: "Go (to school)", back: "Aller (à l'école)" },
          { front: "Come (home)", back: "Rentrer (à la maison)" },
          { front: "Work", back: "Travailler" },
          { front: "Run", back: "Courir" },
          { front: "Walk", back: "Marcher" },
          { front: "Sing", back: "Chanter" },
          { front: "Dance", back: "Danser" },
          { front: "Cook", back: "Cuisiner" },
        ],
      },
      vocab: [
        {
          topic: "Family and personal info",
          focus: "Introduce yourself and describe family members clearly.",
          tasks: ["Write 12 sentences about your family.", "Record a 1-minute self introduction."],
        },
        {
          topic: "Daily routine and time",
          focus: "Use present simple with clock times and frequency adverbs.",
          tasks: ["Create a weekly routine paragraph.", "Ask and answer 10 time questions."],
        },
        {
          topic: "Food, shopping, and money",
          focus: "Order food politely and talk about prices and quantities.",
          tasks: ["Write a cafe roleplay with 12 lines.", "Complete a shopping list speaking drill."],
        },
        {
          topic: "Home and town places",
          focus: "Describe your home and ask/give directions in town.",
          tasks: ["Draw and label your neighbourhood map.", "Write 10 direction commands in English."],
        },
        {
          topic: "Weather and seasons",
          focus: "Talk about weather naturally in present and future contexts.",
          tasks: ["Write a 7-day weather report.", "Record a 1-minute weather forecast."],
        },
        {
          topic: "Hobbies and free time",
          focus: "Describe activities, preferences, and frequency.",
          tasks: ["Create a hobby survey for 5 classmates.", "Write 12 likes/dislikes sentences."],
        },
        {
          topic: "Travel basics",
          focus: "Use practical travel phrases for stations, airports, and hotels.",
          tasks: ["Complete a travel dialogue worksheet.", "Write 10 survival travel questions."],
        },
        {
          topic: "School life and exams",
          focus: "Talk about school routines, test preparation, and classroom language confidently.",
          tasks: ["Build a 20-word school glossary.", "Write 8 exam advice sentences for a friend."],
        },
        {
          topic: "Digital life and communication",
          focus: "Describe online habits and polite communication.",
          tasks: ["Write 10 useful message phrases in English.", "Create a short online safety poster in English."],
        },
      ],
      homeworkChecklist: [
        { id: "hw-b-01", category: "Vocab", en: "Make 10 flashcards by hand: English on one side, French on the other. Use any words you've learned.", fr: "Fabrique 10 cartes en papier : anglais d'un côté, français de l'autre. Choisis n'importe quels mots que tu connais." },
        { id: "hw-b-02", category: "Vocab", en: "Memorise 15 words from one flashcard deck and ask a parent or friend to test you.", fr: "Apprends par cœur 15 mots d'un paquet de cartes mémoire et demande à un parent ou un ami de te tester." },
        { id: "hw-b-03", category: "Reading", en: "Find an English word on something around your house (cereal box, t-shirt, app) and write what it means.", fr: "Trouve un mot anglais quelque part chez toi (boîte de céréales, T-shirt, application) et écris ce qu'il veut dire." },
        { id: "hw-b-04", category: "Vocab", en: "Write the alphabet in English and say each letter out loud three times.", fr: "Écris l'alphabet en anglais et prononce chaque lettre à voix haute, trois fois." },
        { id: "hw-b-05", category: "Listening", en: "Listen to one English song you already like and write down 5 words you hear.", fr: "Écoute une chanson en anglais que tu aimes déjà et note 5 mots que tu entends." },
        { id: "hw-b-06", category: "Reading", en: "Read the names of 5 countries in English and write the French version next to each.", fr: "Lis les noms de 5 pays en anglais et écris leur version française à côté de chacun." },
        { id: "hw-b-07", category: "Speaking", en: "Say out loud: your name, your age, where you live, and one thing you like. In English.", fr: "Dis à voix haute : ton prénom, ton âge, où tu habites, et une chose que tu aimes. En anglais." },
        { id: "hw-b-08", category: "Vocab", en: "Learn the days of the week and the months of the year in English. Write them out from memory.", fr: "Apprends les jours de la semaine et les mois de l'année en anglais, puis écris-les de mémoire." },
        { id: "hw-b-09", category: "Writing", en: "Write 5 sentences about what you do every morning. Use Present Simple.", fr: "Écris 5 phrases sur ce que tu fais tous les matins. Utilise le Present Simple." },
        { id: "hw-b-10", category: "Grammar", en: "Conjugate the verb \"to be\" in Present Simple for all six pronouns (I am, you are…). Write it out.", fr: "Conjugue le verbe « to be » au Present Simple pour les six pronoms (I am, you are…). Écris-les." },
        { id: "hw-b-11", category: "Reading", en: "Read a short children's book or comic strip in English. Don't translate. Just understand what's happening.", fr: "Lis un petit livre pour enfants ou une bande dessinée en anglais. Ne traduis pas. Essaie juste de comprendre l'histoire." },
        { id: "hw-b-12", category: "Listening", en: "Watch one Disney or Pixar clip in English with French subtitles. Write down 3 phrases you heard.", fr: "Regarde un extrait Disney ou Pixar en anglais avec les sous-titres français. Note 3 phrases que tu as entendues." },
        { id: "hw-b-13", category: "Speaking", en: "Record yourself saying 10 sentences about your family. Play it back and listen for mistakes.", fr: "Enregistre-toi en disant 10 phrases sur ta famille. Réécoute-toi et repère tes erreurs." },
        { id: "hw-b-14", category: "Writing", en: "Write 5 sentences about what you are doing right now. Use Present Continuous (am/is/are + verb-ing).", fr: "Écris 5 phrases sur ce que tu es en train de faire maintenant. Utilise le Present Continuous (am/is/are + verbe-ing)." },
        { id: "hw-b-15", category: "Vocab", en: "Pick a topic (sports, food, school) and write 20 English words on it. Translate each into French.", fr: "Choisis un thème (sport, nourriture, école) et écris 20 mots anglais sur ce thème. Traduis chacun en français." },
        { id: "hw-b-16", category: "Grammar", en: "Write 10 questions in English using \"Do\" or \"Does\" (e.g., \"Do you like pizza?\").", fr: "Écris 10 questions en anglais avec « Do » ou « Does » (par exemple : « Do you like pizza? »)." },
        { id: "hw-b-17", category: "Listening", en: "Listen to an English song with the lyrics in front of you and underline every verb you see.", fr: "Écoute une chanson en anglais en suivant les paroles, et souligne tous les verbes que tu vois." },
        { id: "hw-b-18", category: "Reading", en: "Read an English Wikipedia article on a topic you like (Simple English version). Write 5 things you learned.", fr: "Lis un article Wikipédia en anglais (version Simple English) sur un sujet qui te plaît. Note 5 choses que tu as apprises." },
        { id: "hw-b-19", category: "Writing", en: "Describe your bedroom in 8 English sentences. Use \"There is\" and \"There are.\"", fr: "Décris ta chambre en 8 phrases en anglais. Utilise « There is » et « There are »." },
        { id: "hw-b-20", category: "Speaking", en: "Have a 2-minute conversation with someone (or pretend) about your weekend. Only English.", fr: "Tiens une conversation de 2 minutes avec quelqu'un (ou fais semblant) sur ton week-end. Uniquement en anglais." },
        { id: "hw-b-21", category: "Grammar", en: "Write 10 sentences in Present Simple (routines) and 10 in Present Continuous (now). Mix them up.", fr: "Écris 10 phrases au Present Simple (routines) et 10 au Present Continuous (maintenant). Mélange-les." },
        { id: "hw-b-22", category: "Reading", en: "Read the back of an English movie/show DVD or poster. Write a French summary in 3 sentences.", fr: "Lis le résumé au dos d'un DVD ou d'une affiche de film/série en anglais. Écris un résumé en français en 3 phrases." },
        { id: "hw-b-23", category: "Writing", en: "Write a short email (5–8 sentences) introducing yourself to a pen pal.", fr: "Écris un court e-mail (5 à 8 phrases) pour te présenter à un correspondant." },
        { id: "hw-b-24", category: "Listening", en: "Watch one English-speaking YouTuber for 5 minutes. Don't pause. Note 5 new words afterwards.", fr: "Regarde un youtubeur anglophone pendant 5 minutes, sans mettre en pause. Note 5 nouveaux mots à la fin." },
        { id: "hw-b-25", category: "Speaking", en: "Order an imaginary meal in English. Include the dish, drink, and \"please\" / \"thank you.\"", fr: "Commande un repas imaginaire en anglais. Précise le plat, la boisson, et n'oublie pas « please » et « thank you »." },
        { id: "hw-b-26", category: "Vocab", en: "Learn 30 irregular past tense verbs (go/went, eat/ate…) and write them in 3 columns: base / past / French.", fr: "Apprends 30 verbes irréguliers au past tense (go/went, eat/ate…) et écris-les en 3 colonnes : base / past / français." },
        { id: "hw-b-27", category: "Writing", en: "Write a 100-word diary entry about yesterday. Use Past Simple.", fr: "Écris une page de journal intime de 100 mots sur ta journée d'hier. Utilise le Past Simple." },
        { id: "hw-b-28", category: "Grammar", en: "Rewrite 10 affirmative sentences as negative AND as questions. (E.g., \"She plays football.\" → \"She doesn't play football.\" / \"Does she play football?\")", fr: "Réécris 10 phrases affirmatives en version négative ET en question. (Ex. : « She plays football. » → « She doesn't play football. » / « Does she play football? »)" },
        { id: "hw-b-29", category: "Reading", en: "Read a short news article in simple English (News in Levels, BBC Learning English). Summarise in French.", fr: "Lis un court article d'actualité en anglais simple (News in Levels, BBC Learning English). Fais-en un résumé en français." },
        { id: "hw-b-30", category: "Listening", en: "Watch a 10-minute English video (no subtitles). Write 5 sentences in English about what happened.", fr: "Regarde une vidéo en anglais de 10 minutes (sans sous-titres). Écris 5 phrases en anglais sur ce qui s'est passé." },
        { id: "hw-b-31", category: "Speaking", en: "Give a 1-minute spoken presentation in English about your favourite hobby. Record it.", fr: "Fais une présentation orale d'une minute en anglais sur ton loisir préféré. Enregistre-toi." },
        { id: "hw-b-32", category: "Writing", en: "Write a 150-word story using at least 8 Past Simple verbs. Give it a title.", fr: "Écris une histoire de 150 mots avec au moins 8 verbes au Past Simple. Donne-lui un titre." },
        { id: "hw-b-33", category: "Grammar", en: "Learn the difference between \"much / many / a lot of\" and write 9 sentences correctly using each.", fr: "Apprends la différence entre « much », « many » et « a lot of », puis écris 9 phrases correctes en utilisant chacun." },
        { id: "hw-b-34", category: "Reading", en: "Read the first chapter of an English children's novel (Roald Dahl, Diary of a Wimpy Kid). Write 10 questions you have about it.", fr: "Lis le premier chapitre d'un roman jeunesse en anglais (Roald Dahl, Le Journal d'un dégonflé). Écris 10 questions que tu te poses dessus." },
        { id: "hw-b-35", category: "Writing", en: "Write a letter to your future self in English (150+ words). Mix past, present, and future tenses.", fr: "Écris en anglais une lettre à la personne que tu seras dans dix ans (150 mots minimum). Mélange les temps passé, présent et futur." },
      ],
      exercises: [
        {
          topic: "Possessive adjectives (my/your/his/her/our/their)",
          subtitle: "my, your, his, her, our, their",
          introFr:
            "En anglais, on utilise des adjectifs possessifs avant le nom pour dire à qui appartient quelque chose. Contrairement au français, ils ne changent pas selon le genre du nom, seulement selon la personne qui possède.\n\nFormule : my / your / his / her / our / their + nom.\n\n|||EXAMPLES|||\nThis is my bag.\nShe forgot her phone.\nWe love our teacher.\nThey did their homework.",
          examples: [
            "1) This is ___ book. (I) -> my",
            "2) Is that ___ phone? (you) -> your",
            "3) He forgot ___ keys. (he) -> his",
            "4) She loves ___ dog. (she) -> her",
            "5) We cleaned ___ classroom. (we) -> our",
            "6) They sold ___ old bike. (they) -> their",
            "7) The cat washed ___ paws. (it) -> its",
            "8) I met ___ parents yesterday. (she) -> her",
            "9) ___ teacher is very kind. (we) -> Our",
            "10) ___ house is near the park. (they) -> Their",
          ],
          practice:
            "Write 10 sentences about your school and home using possessive adjectives. Then swap sentences with a classmate and correct each other.",
        },
        {
          topic: "Present simple vs present continuous",
          subtitle: "I eat / I am eating",
          introFr:
            "En anglais il y a deux présents. Le Present Simple sert pour les habitudes et les vérités générales, le Present Continuous pour ce qui se passe en ce moment.\n\nFormule Present Simple : sujet + verbe (+ s à la 3e personne).\nFormule Present Continuous : sujet + am/is/are + verbe-ing.\n\n|||EXAMPLES|||\nI eat lunch at 1pm every day.\nRight now I am eating lunch.\nShe plays football on Saturdays.\nLook, she is playing football now.",
          examples: [
            "1) I usually ___ at 7. (wake up) -> wake up",
            "2) Right now she ___ English. (study) -> is studying",
            "3) We ___ football every Saturday. (play) -> play",
            "4) Look! Marie ___ a sandwich. (eat) -> is eating",
            "5) My dad ___ in Paris every day. (work) -> works",
            "6) Quiet, the baby ___ now. (sleep) -> is sleeping",
            "7) I can't talk, I ___ my homework. (do) -> am doing",
            "8) Cats ___ milk. (drink) -> drink",
            "9) Listen, they ___ a song. (sing) -> are singing",
            "10) He always ___ his keys. (forget) -> forgets",
          ],
          practice:
            "Make two columns on a page: routine actions and actions happening now. Write 8 sentences in each. In every continuous sentence, circle the am/is/are.",
          extension:
            "Pick three of your routine sentences and rewrite them as if they're happening right now. Read both versions aloud and notice how your voice changes when the action shifts to the moment.",
          homework:
            "Write 5 sentences about today: three at Present Simple (things you do every day or every week) and two at Present Continuous (what's happening while you write).",
          checklist: [
            "Used am/is/are correctly in continuous forms",
            "Spotted the trigger words (every / always / now / right now / listen / look)",
            "Spelled -ing forms correctly (eating not eatting, writing not writting)",
          ],
        },
        {
          topic: "There is / there are",
          subtitle: "There is a… / There are…",
          introFr:
            "On utilise \"there is\" pour parler d'une seule chose qui existe quelque part, et \"there are\" pour plusieurs choses. C'est l'équivalent de « il y a », mais contrairement au français, la forme change selon que ce qui suit est au singulier ou au pluriel.\n\nFormule : There is + nom singulier. There are + nom pluriel. Is there / Are there pour les questions.\n\n|||EXAMPLES|||\nThere is a book on the table.\nThere are three windows in my room.\nIs there a supermarket near here?\nAre there any students in the classroom?",
          examples: [
            "1) ___ a book on the table. (There is) -> There is",
            "2) ___ two windows in my room. (There are) -> There are",
            "3) ___ any milk in the fridge? (Is there) -> Is there",
            "4) ___ a good café near here. (There is) -> There is",
            "5) ___ many students in the hall. (There are) -> There are",
            "6) ___ a problem with my phone. (There is) -> There is",
            "7) ___ no buses after midnight. (There are) -> There are",
            "8) ___ an exam tomorrow? (Is there) -> Is there",
            "9) ___ some apples in the bowl. (There are) -> There are",
            "10) ___ a cat under the bed. (There is) -> There is",
          ],
          practice:
            "Describe your bedroom in 10 sentences using there is/there are and at least 4 prepositions.",
        },
        {
          topic: "Question forms (do/does/is/are)",
          subtitle: "Do, Does, Is, Are",
          introFr:
            "En anglais, pour poser une question au Present Simple, il faut ajouter Do ou Does au début. Does s'utilise avec he, she, it. Do s'utilise avec I, you, we, they. Avec le verbe to be, on inverse simplement le sujet et le verbe.\n\nFormule : Do/Does + sujet + verbe de base ?\n\n|||EXAMPLES|||\nDo you like English?\nDoes she live in Paris?\nAre you tired?\nIs he at school today?",
          examples: [
            "1) ___ you like English? (Do) -> Do",
            "2) Where ___ she live? (does) -> does",
            "3) ___ they in class now? (Are) -> Are",
            "4) ___ he watch TV every evening? (Does) -> Does",
            "5) ___ you doing your homework? (Are) -> Are",
            "6) What ___ they want? (do) -> do",
            "7) ___ I late? (Am) -> Am",
            "8) ___ your brother play guitar? (Does) -> Does",
            "9) Why ___ we waiting here? (are) -> are",
            "10) ___ there a shop nearby? (Is) -> Is",
          ],
          practice:
            "Write 12 interview questions to ask a new classmate. Then answer them in full sentences.",
        },
        {
          topic: "Articles (a / an / the)",
          subtitle: "a, an, the",
          introFr:
            "En anglais il y a trois articles. A s'utilise devant un mot qui commence par un son de consonne, pour quelque chose de non précis. An s'utilise devant un son de voyelle (an apple, an hour). The s'utilise quand on parle de quelque chose de précis ou déjà mentionné. Contrairement au français, il n'y a ni masculin ni féminin.\n\nFormule : a + consonne, an + voyelle, the + nom précis.\n\n|||EXAMPLES|||\nI have a dog and a cat.\nShe is eating an apple.\nThe dog is sleeping on the sofa.\nCan you close the window please?",
          examples: [
            "1) I ate ___ apple for lunch. (an) -> an",
            "2) She is ___ teacher at our school. (a) -> a",
            "3) ___ sun is very bright today. (The) -> The",
            "4) He wants ___ hour to finish. (an) -> an",
            "5) We visited ___ Eiffel Tower last summer. (the) -> the",
            "6) There is ___ cat on the roof. (a) -> a",
            "7) I need ___ umbrella, it is raining. (an) -> an",
            "8) ___ book you lent me is excellent. (The) -> The",
            "9) She plays ___ piano every day. (the) -> the",
            "10) He bought ___ new phone yesterday. (a) -> a",
          ],
          practice:
            "Write 14 sentences about your school day and underline every article you use.",
        },
        {
          topic: "Prepositions of place",
          subtitle: "in, on, at, under, next to",
          introFr:
            "Les prépositions de lieu indiquent où se trouve quelque chose. En anglais les plus importantes sont in pour l'intérieur, on pour une surface, at pour un point précis, under pour en dessous, next to pour à côté, between pour entre, behind pour derrière, in front of pour devant.\n\nFormule : objet + préposition + lieu.\n\n|||EXAMPLES|||\nThe book is on the table.\nMy bag is under the chair.\nShe is standing next to the door.\nThe school is between the park and the supermarket.",
          examples: [
            "1) The bag is ___ the chair. (under) -> under",
            "2) The clock is ___ the wall. (on) -> on",
            "3) The keys are ___ the table and the lamp. (between) -> between",
            "4) She waits ___ the bus stop. (at) -> at",
            "5) The cat is ___ the sofa. (on) -> on",
            "6) We live ___ Dublin. (in) -> in",
            "7) The dog hid ___ the bed. (under) -> under",
            "8) He stood ___ front of the class. (in) -> in",
            "9) The shop is ___ the bank and the café. (between) -> between",
            "10) There is a picture ___ the door. (next to) -> next to",
          ],
          practice:
            "Describe one room in your house using at least 12 preposition phrases.",
        },
        {
          topic: "Countable and uncountable nouns",
          subtitle: "many, much, some, a lot of",
          introFr:
            "Les noms dénombrables désignent des choses que l'on peut compter : ils ont un pluriel. Les noms indénombrables désignent des choses que l'on ne peut pas compter : ils n'ont jamais de pluriel et ne prennent ni a ni an.\n\nFormule dénombrable : a/an + nom, ou nom + s au pluriel.\nFormule indénombrable : some/much/a lot of + nom sans pluriel.\n\n|||EXAMPLES|||\nI have two apples.\nI need some water.\nThere are many students.\nThere isn't much time.",
          examples: [
            "1) We need ___ apples for the recipe. (some) -> some",
            "2) There isn't ___ sugar left. (much) -> much",
            "3) How ___ bottles do we need? (many) -> many",
            "4) Can I have ___ water, please? (some) -> some",
            "5) She gave me ___ good advice. (some) -> some",
            "6) How ___ students are in your class? (many) -> many",
            "7) I don't have ___ money today. (much) -> much",
            "8) We bought ___ bread from the bakery. (some) -> some",
            "9) There are ___ chairs in the room. (a lot of) -> a lot of",
            "10) He drank ___ juice at breakfast. (some) -> some",
          ],
          practice:
            "Write a shopping list with 20 items and classify each as countable or uncountable.",
        },
        {
          topic: "Can / can't for ability",
          subtitle: "I can swim / She can't drive",
          introFr:
            "Can exprime la capacité, ce qu'on est capable de faire. Il est identique pour tous les sujets, on ne le conjugue jamais. La forme négative est cannot ou can't. Pour les questions, on inverse simplement can et le sujet.\n\nFormule positive : sujet + can + verbe de base.\nFormule négative : sujet + can't + verbe de base.\nQuestion : Can + sujet + verbe de base ?\n\n|||EXAMPLES|||\nI can swim very well.\nShe can't drive yet.\nCan you speak English?\nHe can play the guitar.",
          examples: [
            "1) I ___ swim very well. (can) -> can",
            "2) She ___ drive yet. (can't) -> can't",
            "3) ___ you speak English and French? (Can) -> Can",
            "4) He ___ play the guitar. (can) -> can",
            "5) We ___ come to the party tonight. (can't) -> can't",
            "6) ___ they help us tomorrow? (Can) -> Can",
            "7) My little brother ___ read yet. (can't) -> can't",
            "8) I ___ cook pasta. (can) -> can",
            "9) ___ she run fast? (Can) -> Can",
            "10) You ___ use my phone if you need it. (can) -> can",
          ],
          practice:
            "Write 12 sentences about what you can and can't do, then ask 6 partner questions.",
        },
        {
          topic: "Past simple regular/irregular verbs",
          subtitle: "went, played, saw, didn't",
          introFr:
            "Le Past Simple s'utilise pour parler d'une action terminée dans le passé. Les verbes réguliers prennent -ed à la fin. Les verbes irréguliers changent complètement et doivent être mémorisés. Pour la forme négative et les questions, on utilise toujours did + la base verbale.\n\nFormule : sujet + verbe passé. Négatif : sujet + didn't + base. Question : Did + sujet + base ?\n\n|||EXAMPLES|||\nI walked to school yesterday.\nShe went to London last year.\nWe didn't watch the film.\nDid you eat breakfast this morning?",
          examples: [
            "1) Yesterday I ___ to school on foot. (went) -> went",
            "2) We ___ football after class. (played) -> played",
            "3) She ___ a great film on Saturday. (saw) -> saw",
            "4) He ___ pizza for dinner. (ate) -> ate",
            "5) They ___ a cake for my birthday. (made) -> made",
            "6) I ___ my room before lunch. (cleaned) -> cleaned",
            "7) We ___ home late last night. (arrived) -> arrived",
            "8) She ___ me a message. (sent) -> sent",
            "9) He ___ TV for two hours. (watched) -> watched",
            "10) I ___ tired after the match. (felt) -> felt",
          ],
          practice:
            "Write a short story (120 words) about last weekend using at least 10 past simple verbs.",
          extension:
            "Retell your story in speaking form in under 90 seconds with clear pronunciation and sequencing words.",
          homework: "Submit the story and a corrected version with 5 improved verbs.",
          checklist: ["Used 10+ past verbs", "Included time markers", "Checked spelling of irregular verbs"],
        },
        {
          topic: "Object pronouns (me/you/him/her/us/them)",
          subtitle: "me, him, her, us, them",
          introFr:
            "En anglais, les pronoms sujets désignent la personne qui fait l'action, et les pronoms compléments celle qui la reçoit. Le pronom complément se place toujours après le verbe ou après une préposition.\n\nFormule : verbe + pronom complément.\nListe : me, you, him, her, us, them.\n\n|||EXAMPLES|||\nMy teacher helped me a lot.\nI called him yesterday.\nShe gave the book to her.\nCan you help us please?",
          examples: [
            "1) My teacher helped ___. (me) -> me",
            "2) I called ___ yesterday. (him) -> him",
            "3) They invited ___ to the event. (us) -> us",
            "4) Can you tell ___ the answer? (her) -> her",
            "5) She gave ___ a present. (them) -> them",
            "6) He asked ___ a question. (me) -> me",
            "7) We saw ___ at the cinema. (you) -> you",
            "8) I sent ___ an email. (him) -> him",
            "9) The coach praised ___ after the match. (us) -> us",
            "10) Please wait for ___. (them) -> them",
          ],
          practice: "Rewrite 12 sentences by replacing names with object pronouns correctly.",
          extension: "Write a dialogue with 8 object pronouns and perform it in pairs.",
          homework: "Complete a pronoun correction worksheet and explain 3 corrections.",
          checklist: ["Correct object pronoun choice", "Clear sentence meaning", "No subject/object mix-ups"],
        },
        {
          topic: "Future forms (going to / will)",
          subtitle: "going to / will",
          introFr:
            "En anglais, il y a deux façons principales de parler du futur. Going to s'utilise pour un projet décidé à l'avance ou une prédiction fondée sur ce que l'on voit. Will s'utilise pour une décision spontanée, une promesse ou une prédiction fondée sur une opinion.\n\nFormule going to : sujet + am/is/are + going to + verbe de base.\nFormule will : sujet + will + verbe de base.\n\n|||EXAMPLES|||\nI am going to study tonight, I planned it.\nIt will rain tomorrow I think.\nI will help you, don't worry.\nShe is going to visit her grandmother this weekend.",
          examples: [
            "1) I ___ study tonight after dinner. (am going to) -> am going to",
            "2) I think it ___ rain later. (will) -> will",
            "3) We ___ visit Cork this weekend. (are going to) -> are going to",
            "4) Don't worry, I ___ help you. (will) -> will",
            "5) She ___ start a new job in September. (is going to) -> is going to",
            "6) I promise I ___ be on time. (will) -> will",
            "7) Look! The bus ___ arrive. (is going to) -> is going to",
            "8) They ___ probably pass the exam. (will) -> will",
            "9) He ___ buy a new laptop next month. (is going to) -> is going to",
            "10) I ___ call you when I arrive. (will) -> will",
          ],
          practice: "Write 10 predictions and 10 plans using the correct future form.",
          extension: "Create a one-week personal plan using both forms naturally.",
          homework: "Submit a 120-word future diary entry.",
          checklist: ["Used both forms", "Accurate verb structure", "Clear time references"],
        },
      ],
      schedule: [
        "Week 1: Introductions, classroom English, core verbs (be/have).",
        "Week 2: Possessive adjectives + family vocabulary.",
        "Week 3: Present simple routines + time expressions.",
        "Week 4: Questions and short answers.",
        "Week 5: Present continuous and daily activities.",
        "Week 6: Vocabulary check + speaking mini test.",
        "Week 7: Articles, nouns, and quantity language.",
        "Week 8: Home and town descriptions + directions.",
        "Week 9: Food and shopping roleplay class.",
        "Week 10: Past simple storytelling tasks.",
        "Week 11: Mixed grammar revision and flashcard sprint.",
        "Week 12: End-of-module assessment + graph review.",
        "Week 13: Revision block + targeted weak-area drills.",
        "Week 14: Speaking confidence workshop (daily life topics).",
        "Week 15: Listening week with transcript support.",
        "Week 16: Writing clinic - sentence accuracy and punctuation.",
        "Week 17: Mid-year progress graph review with new targets.",
        "Week 18: Vocabulary expansion week (food/town/school).",
        "Week 19: Grammar consolidation test and correction lab.",
        "Week 20: Reading comprehension strategies for exam texts.",
        "Week 21: Paired speaking and roleplay performance class.",
        "Week 22: Homework project feedback and upgrade session.",
        "Week 23: Full mixed-skill mock week.",
        "Week 24: End-of-term review and next-step planning.",
      ],
      vocabQuiz: [
        {
          question: "I ___ 15 years old.",
          options: ["am", "is", "are", "be"],
          answer: "am",
        },
        {
          question: "This is ___ brother.",
          options: ["I", "my", "me", "mine"],
          answer: "my",
        },
        {
          question: "There ___ two books on the desk.",
          options: ["is", "are", "am", "be"],
          answer: "are",
        },
        {
          question: "She ___ English every Wednesday.",
          options: ["study", "studies", "studying", "studied"],
          answer: "studies",
        },
        {
          question: "Can I have ___ apple, please?",
          options: ["a", "an", "the", "some"],
          answer: "an",
        },
        {
          question: "We ___ to school by bus yesterday.",
          options: ["go", "goed", "went", "goes"],
          answer: "went",
        },
      ],
    },
    intermediate: {
      flashcards: {
        "Collocations": [
          { front: "Make progress", back: "Faire des progrès" },
          { front: "Take responsibility", back: "Prendre des responsabilités" },
          { front: "Do research", back: "Faire des recherches" },
          { front: "Strong argument", back: "Argument solide" },
          { front: "Raise awareness", back: "Sensibiliser" },
          { front: "Meet expectations", back: "Répondre aux attentes" },
          { front: "Reach a decision", back: "Prendre une décision" },
          { front: "Pay attention", back: "Faire attention" },
          { front: "Lose contact", back: "Perdre le contact" },
          { front: "Keep in touch", back: "Rester en contact" },
          { front: "Run a risk", back: "Courir un risque" },
          { front: "Set a goal", back: "Se fixer un objectif" },
          { front: "Gain experience", back: "Acquérir de l'expérience" },
          { front: "Miss an opportunity", back: "Manquer une occasion" },
          { front: "Face a challenge", back: "Relever un défi" },
          { front: "Solve a problem", back: "Résoudre un problème" },
          { front: "Break the law", back: "Enfreindre la loi" },
          { front: "Catch a cold", back: "Attraper un rhume" },
          { front: "Save time", back: "Gagner du temps" },
          { front: "Waste money", back: "Gaspiller de l'argent" },
          { front: "Tell the truth", back: "Dire la vérité" },
          { front: "Tell a lie", back: "Mentir" },
        ],
        "Phrasal Verbs": [
          { front: "Carry on", back: "Continuer" },
          { front: "Find out", back: "Découvrir" },
          { front: "Set up", back: "Mettre en place" },
          { front: "Work out", back: "Résoudre / s'entraîner" },
          { front: "Look after", back: "S'occuper de" },
          { front: "Give up", back: "Abandonner" },
          { front: "Turn up", back: "Arriver / monter le son" },
          { front: "Turn down", back: "Refuser / baisser" },
          { front: "Run out of", back: "Être à court de" },
          { front: "Come across", back: "Tomber sur" },
          { front: "Get over", back: "Se remettre de" },
          { front: "Put off", back: "Reporter" },
          { front: "Bring up", back: "Soulever (un sujet)" },
          { front: "Look into", back: "Examiner" },
          { front: "Go on", back: "Continuer" },
          { front: "Hold on", back: "Patienter" },
          { front: "Catch up", back: "Rattraper" },
          { front: "Calm down", back: "Se calmer" },
          { front: "Fill in", back: "Remplir" },
          { front: "Throw away", back: "Jeter" },
          { front: "Pick up", back: "Ramasser / apprendre vite" },
          { front: "Drop off", back: "Déposer quelqu'un" },
        ],
        "Education and Careers": [
          { front: "Qualification", back: "Diplôme / qualification" },
          { front: "Deadline", back: "Date limite" },
          { front: "Internship", back: "Stage" },
          { front: "Skill set", back: "Ensemble de compétences" },
          { front: "Application", back: "Candidature" },
          { front: "Work experience", back: "Expérience professionnelle" },
          { front: "Curriculum vitae (CV)", back: "CV" },
          { front: "Cover letter", back: "Lettre de motivation" },
          { front: "Interview", back: "Entretien" },
          { front: "Reference", back: "Reference" },
          { front: "Networking", back: "Réseautage" },
          { front: "Mentor", back: "Mentor" },
          { front: "Scholarship", back: "Bourse" },
          { front: "Tuition fees", back: "Frais de scolarité" },
          { front: "Seminar", back: "Séminaire" },
          { front: "Lecture", back: "Cours magistral" },
          { front: "Tutorial", back: "Travaux diriges" },
          { front: "Dissertation", back: "Mémoire" },
          { front: "Plagiarism", back: "Plagiat" },
          { front: "Peer review", back: "Évaluation par les pairs" },
          { front: "Career fair", back: "Forum des métiers" },
          { front: "Recruitment", back: "Recrutement" },
        ],
        "Debate Language": [
          { front: "From my perspective", back: "De mon point de vue" },
          { front: "I acknowledge that...", back: "Je reconnais que..." },
          { front: "A major drawback is...", back: "Un inconvénient majeur est..." },
          { front: "To illustrate this point", back: "Pour illustrer ce point" },
          { front: "It depends on...", back: "Cela dépend de..." },
          { front: "Overall, I would argue...", back: "Globalement, je dirais..." },
          { front: "On the one hand...", back: "D'une part..." },
          { front: "On the other hand...", back: "D'autre part..." },
          { front: "This raises the question of...", back: "Cela soulève la question de..." },
          { front: "There is evidence to suggest...", back: "Des éléments suggèrent que..." },
          { front: "A compelling case", back: "Un argument convaincant" },
          { front: "To some extent", back: "Jusqu'à un certain point" },
          { front: "By contrast", back: "En revanche" },
          { front: "In contrast", back: "Par contraste" },
          { front: "As a result", back: "En conséquence" },
          { front: "Consequently", back: "Par conséquent" },
          { front: "That being said", back: "Cela dit" },
          { front: "To sum up", back: "Pour conclure" },
          { front: "I remain unconvinced", back: "Je ne suis pas convaincu" },
          { front: "I strongly disagree", back: "Je suis en désaccord total" },
          { front: "I partially agree", back: "Je suis partiellement d'accord" },
          { front: "The crux of the matter", back: "Le cœur du problème" },
        ],
        "Sports and competition": [
          { front: "Tournament", back: "Tournoi" },
          { front: "Semi-final", back: "Demi-finale" },
          { front: "Knockout stage", back: "Phase éliminatoire" },
          { front: "League table", back: "Classement" },
          { front: "Home advantage", back: "Avantage du terrain" },
          { front: "Under pressure", back: "Sous pression" },
          { front: "Fair play", back: "Fair-play" },
          { front: "Performance", back: "Performance" },
          { front: "To qualify", back: "Se qualifier" },
          { front: "To be eliminated", back: "Être éliminé" },
          { front: "Sponsorship", back: "Sponsoring" },
          { front: "Broadcast", back: "Diffusion" },
          { front: "Season ticket", back: "Abonnement (stade)" },
          { front: "Transfer window", back: "Mercato" },
          { front: "Contract", back: "Contrat" },
          { front: "Physiotherapist", back: "Kinésithérapeute" },
          { front: "Offside", back: "Hors-jeu" },
          { front: "Tackle", back: "Tacle" },
          { front: "Pass", back: "Passe" },
          { front: "Shoot", back: "Tirer au but" },
          { front: "Defence", back: "Défense" },
        ],
        "At home and routines": [
          { front: "Household chores", back: "Tâches ménagères" },
          { front: "To tidy up", back: "Ranger" },
          { front: "To do the shopping", back: "Faire les courses" },
          { front: "Neighbour", back: "Voisin / voisine" },
          { front: "Landlord", back: "Propriétaire / bailleur" },
          { front: "Tenant", back: "Locataire" },
          { front: "Rent", back: "Loyer" },
          { front: "Bills", back: "Factures" },
          { front: "Remote working", back: "Télétravail" },
          { front: "Commute", back: "Trajet domicile-travail" },
          { front: "Household bills", back: "Factures du foyer" },
          { front: "Mortgage", back: "Prêt immobilier" },
          { front: "Estate agent", back: "Agent immobilier" },
          { front: "Lease", back: "Bail" },
          { front: "Housemate", back: "Colocataire" },
          { front: "Rubbish collection", back: "Collecte des ordures" },
          { front: "Recycling", back: "Tri sélectif" },
          { front: "DIY", back: "Bricolage" },
          { front: "Ironing", back: "Repassage" },
          { front: "Laundry", back: "Lessive" },
          { front: "Alarm clock", back: "Réveil" },
        ],
      },
      vocab: [
        {
          topic: "Media and technology",
          focus: "Discuss online life, social media, privacy, and misinformation.",
          tasks: ["Build a 25-word topic list.", "Prepare a 90-second opinion speech."],
        },
        {
          topic: "Travel and global culture",
          focus: "Use topic vocabulary with comparatives and travel narratives.",
          tasks: ["Write a travel review (140 words).", "Do 12 collocation matching tasks."],
        },
        {
          topic: "Education and future careers",
          focus: "Express future plans, goals, and qualifications confidently.",
          tasks: ["Write a study plan for next month.", "Prepare 8 interview answers about your goals."],
        },
        {
          topic: "Health and lifestyle",
          focus: "Discuss habits, wellbeing, and balanced routines.",
          tasks: ["Create a healthy-week routine in English.", "Record a 2-minute advice talk for a friend."],
        },
        {
          topic: "Environment and sustainability",
          focus: "Discuss environmental issues using argument language.",
          tasks: ["Write 15 key environment terms with definitions.", "Prepare a 2-minute mini debate response."],
        },
        {
          topic: "News and current events",
          focus: "Summarise short news items clearly and objectively.",
          tasks: ["Write 3 short news summaries.", "Underline opinion vs fact language."],
        },
        {
          topic: "Social issues and society",
          focus: "Develop balanced viewpoints and nuanced vocabulary.",
          tasks: ["Build a pros/cons chart for one issue.", "Write one paragraph with contrast linkers."],
        },
        {
          topic: "Workplace communication",
          focus: "Use practical English for meetings, emails, and project updates.",
          tasks: ["Write one formal and one semi-formal email.", "Create a 6-line meeting update script."],
        },
        {
          topic: "Problem-solving language",
          focus: "Explain problems, propose solutions, and justify choices.",
          tasks: ["Write 10 solution phrases.", "Complete a case-study response in 140 words."],
        },
      ],
      homeworkChecklist: [
        { id: "hw-i-01", category: "Vocab", en: "Make 20 flashcards of phrasal verbs (look up, give up, find out, etc.) with French equivalents.", fr: "Fabrique 20 cartes de phrasal verbs (look up, give up, find out, etc.) avec leur équivalent français." },
        { id: "hw-i-02", category: "Reading", en: "Read a children's chapter book in English (Roald Dahl, Diary of a Wimpy Kid). Write a 50-word summary.", fr: "Lis un livre jeunesse en anglais (Roald Dahl, Le Journal d'un dégonflé). Rédige un résumé de 50 mots." },
        { id: "hw-i-03", category: "Grammar", en: "Conjugate 15 verbs in Past Simple. Include at least 8 irregular verbs.", fr: "Conjugue 15 verbes au Past Simple. Inclus au moins 8 verbes irréguliers." },
        { id: "hw-i-04", category: "Vocab", en: "Learn 25 advanced everyday words (anyway, although, however, etc.) and use each in a sentence.", fr: "Apprends 25 mots du quotidien plus avancés (anyway, although, however, etc.) et utilise chacun dans une phrase." },
        { id: "hw-i-05", category: "Writing", en: "Write a 100-word paragraph comparing two things you know well (two friends, two films, two cities).", fr: "Écris un paragraphe de 100 mots qui compare deux choses que tu connais bien (deux amis, deux films, deux villes)." },
        { id: "hw-i-06", category: "Listening", en: "Watch a 15-minute English YouTube vlog without subtitles. Write what you remember.", fr: "Regarde un vlog YouTube en anglais de 15 minutes sans sous-titres. Écris ce dont tu te souviens." },
        { id: "hw-i-07", category: "Speaking", en: "Record a 1-minute monologue about your week. Include past, present, and future tenses.", fr: "Enregistre un monologue d'une minute sur ta semaine. Inclus du passé, du présent et du futur." },
        { id: "hw-i-08", category: "Reading", en: "Read a short English news article and write 5 questions you still have about it.", fr: "Lis un court article d'actualité en anglais et écris 5 questions que tu te poses encore dessus." },
        { id: "hw-i-09", category: "Grammar", en: "Write 8 sentences using Present Perfect (have/has + past participle).", fr: "Écris 8 phrases avec le Present Perfect (have/has + participe passé)." },
        { id: "hw-i-10", category: "Listening", en: "Watch an English-language film with French subtitles. Note 10 idioms or phrases you found interesting.", fr: "Regarde un film en anglais avec les sous-titres français. Note 10 expressions ou phrases qui t'ont marqué." },
        { id: "hw-i-11", category: "Speaking", en: "Phone-call roleplay: book a restaurant in English. At least 5 exchanges.", fr: "Jeu de rôle au téléphone : réserve une table au restaurant en anglais. Au moins 5 échanges." },
        { id: "hw-i-12", category: "Writing", en: "Write a formal email asking a teacher for an extension on homework.", fr: "Écris un e-mail formel à un professeur pour demander un délai supplémentaire pour un devoir." },
        { id: "hw-i-13", category: "Grammar", en: "Write 10 sentences with \"since\" and \"for\" using Present Perfect.", fr: "Écris 10 phrases avec « since » et « for » en utilisant le Present Perfect." },
        { id: "hw-i-14", category: "Reading", en: "Read a 1-page English short story. Underline every word you don't know and look up at least 5.", fr: "Lis une nouvelle en anglais d'une page. Souligne tous les mots que tu ne connais pas et cherches-en au moins 5." },
        { id: "hw-i-15", category: "Vocab", en: "Learn 20 collocations (make/do, take/have a shower, do business…) and write sentences for each.", fr: "Apprends 20 collocations (make/do, take/have a shower, do business…) et écris une phrase pour chacune." },
        { id: "hw-i-16", category: "Speaking", en: "Give a 2-minute spoken summary of a film you saw recently, in English.", fr: "Fais un résumé oral de 2 minutes en anglais d'un film que tu as vu récemment." },
        { id: "hw-i-17", category: "Writing", en: "Write a 150-word opinion paragraph: \"Is social media good or bad for teenagers?\"", fr: "Écris un paragraphe d'opinion de 150 mots : « Les réseaux sociaux sont-ils bons ou mauvais pour les adolescents ? »" },
        { id: "hw-i-18", category: "Listening", en: "Listen to one BBC Learning English podcast episode. Write 8 sentences about what you heard.", fr: "Écoute un épisode de podcast BBC Learning English. Écris 8 phrases sur ce que tu as entendu." },
        { id: "hw-i-19", category: "Grammar", en: "Write 5 First Conditional sentences (\"If X, Y will…\") and 5 Second Conditional (\"If X, Y would…\").", fr: "Écris 5 phrases au First Conditional (« If X, Y will… ») et 5 au Second Conditional (« If X, Y would… »)." },
        { id: "hw-i-20", category: "Reading", en: "Read an English Wikipedia article (full version, not Simple English). Note 3 things that surprised you.", fr: "Lis un article Wikipédia en anglais (version normale, pas Simple English). Note 3 choses qui t'ont surpris." },
        { id: "hw-i-21", category: "Writing", en: "Describe a place you love in 200 words. Use at least 3 different senses (sight, sound, smell, etc.).", fr: "Décris en 200 mots un endroit que tu aimes. Fais appel à au moins trois sens différents (vue, ouïe, odorat, etc.)." },
        { id: "hw-i-22", category: "Speaking", en: "Argue both sides of a topic for 1 minute each: \"Should homework be banned?\"", fr: "Défends le pour pendant une minute, puis le contre pendant une minute, sur ce sujet : « Faut-il interdire les devoirs ? »" },
        { id: "hw-i-23", category: "Vocab", en: "Learn 15 words for expressing opinions (in my view, arguably, frankly, allegedly…) and use each.", fr: "Apprends 15 mots pour exprimer une opinion (in my view, arguably, frankly, allegedly…) et utilise chacun dans une phrase." },
        { id: "hw-i-24", category: "Listening", en: "Listen to an English song and transcribe the chorus from memory. Compare with the official lyrics.", fr: "Écoute une chanson en anglais et transcris le refrain de mémoire. Compare ensuite avec les paroles officielles." },
        { id: "hw-i-25", category: "Writing", en: "Write a 250-word movie review: plot summary, what you liked, what you didn't.", fr: "Écris une critique de film de 250 mots : résumé du scénario, ce que tu as aimé, ce qui t'a déplu." },
        { id: "hw-i-26", category: "Speaking", en: "Phone-call roleplay: complain to a hotel about a noisy room. Negotiate a solution. At least 8 exchanges.", fr: "Jeu de rôle au téléphone : adresse une plainte à un hôtel à propos d'une chambre bruyante. Négocie une solution. Au moins 8 échanges." },
        { id: "hw-i-27", category: "Grammar", en: "Rewrite 10 active sentences in the passive voice (e.g., \"Shakespeare wrote Hamlet\" → \"Hamlet was written by Shakespeare\").", fr: "Réécris 10 phrases actives à la voix passive (ex. : « Shakespeare wrote Hamlet » → « Hamlet was written by Shakespeare »)." },
        { id: "hw-i-28", category: "Reading", en: "Read a 2-page English short story. Write a 50-word reaction in English.", fr: "Lis une nouvelle de 2 pages en anglais. Écris une réaction de 50 mots en anglais." },
        { id: "hw-i-29", category: "Vocab", en: "Learn 25 phrasal verbs from a single topic (work, travel, friendship) with example sentences.", fr: "Apprends 25 phrasal verbs autour d'un seul thème (travail, voyage, amitié) avec une phrase d'exemple pour chacun." },
        { id: "hw-i-30", category: "Listening", en: "Watch a 30-minute English-language episode without subtitles. Summarise the plot in 5 English sentences.", fr: "Regarde un épisode de 30 minutes en anglais sans sous-titres. Résume l'intrigue en 5 phrases en anglais." },
        { id: "hw-i-31", category: "Grammar", en: "Write 5 Reported Speech sentences (e.g., She said: \"I am tired.\" → She said that she was tired.).", fr: "Écris 5 phrases au discours rapporté (ex. : She said: « I am tired. » → She said that she was tired.)." },
        { id: "hw-i-32", category: "Writing", en: "Write a 300-word personal essay: \"The moment I learned something important.\"", fr: "Écris un essai personnel de 300 mots : « Le moment où j'ai appris quelque chose d'important. »" },
        { id: "hw-i-33", category: "Speaking", en: "Have a real 5-minute conversation in English with someone (a teacher, an online language partner). Reflect on what was hard.", fr: "Tiens une vraie conversation de 5 minutes en anglais avec quelqu'un (un professeur, un partenaire linguistique en ligne). Réfléchis ensuite à ce qui a été difficile." },
        { id: "hw-i-34", category: "Reading", en: "Read the first chapter of an English young-adult novel (The Hunger Games, Percy Jackson). Write 10 questions about it.", fr: "Lis le premier chapitre d'un roman jeunesse en anglais (The Hunger Games, Percy Jackson). Écris 10 questions dessus." },
        { id: "hw-i-35", category: "Writing", en: "Write a 250-word formal letter to a local newspaper about an issue you care about.", fr: "Écris une lettre formelle de 250 mots à un journal local sur un sujet qui te tient à cœur." },
      ],
      exercises: [
        {
          topic: "Possessive adjectives in context",
          subtitle: "his / her / their + noun",
          introFr:
            "À ce niveau, l'adjectif possessif doit toujours correspondre au possesseur, pas à l'objet. En français on dit « sa maison » pour un homme ou une femme ; en anglais on dit his house ou her house selon le possesseur. Pour une équipe ou un groupe, utilise their.\n\nFormule : possessif du possesseur + nom (his research, their results, its logo).\n\n|||EXAMPLES|||\nThe students presented their projects.\nShe forgot her charger at home.\nThe company changed its policy last year.\nWe improved our pronunciation this month.",
          examples: [
            "1) The students presented ___ projects. (their) -> their",
            "2) She forgot ___ charger at home. (her) -> her",
            "3) We improved ___ pronunciation this month. (our) -> our",
            "4) The company changed ___ logo last year. (its) -> its",
            "5) Each student must bring ___ own notebook. (his/her/their) -> their",
            "6) I respect ___ opinion, even when we disagree. (your) -> your",
            "7) The team celebrated ___ victory. (its) -> its",
            "8) They lost ___ tickets before the concert. (their) -> their",
            "9) He borrowed ___ friend's bike. (his) -> his",
            "10) We finished ___ homework on time. (our) -> our",
          ],
          practice:
            "Rewrite a short paragraph by replacing names with pronouns and correct possessive adjectives.",
        },
        {
          topic: "Present perfect vs past simple",
          subtitle: "have done / did yesterday",
          introFr:
            "Le passé composé français ne se traduit pas toujours de la même façon. Si tu peux nommer le moment précis (hier, en 2020, la semaine dernière), utilise le Past Simple. Si tu parles d'une expérience de vie ou d'un résultat visible maintenant, utilise le Present Perfect avec have/has + participe passé.\n\nFormule Past Simple : sujet + verbe passé (+ date).\nFormule Present Perfect : sujet + have/has + participe passé.\n\n|||EXAMPLES|||\nI watched that film last week.\nWe have completed three units this month.\nShe went to London in 2024.\nHave you ever tried sushi?",
          examples: [
            "1) I ___ that film last week. (watched) -> watched",
            "2) We ___ three units this month. (have completed) -> have completed",
            "3) She ___ to London in 2024. (went) -> went",
            "4) Have you ever ___ sushi? (tried) -> tried",
            "5) They ___ here since 2021. (have lived) -> have lived",
            "6) He ___ his keys yesterday. (lost) -> lost",
            "7) I have never ___ such a good lesson. (had) -> had",
            "8) We ___ the project yet. (haven't finished) -> haven't finished",
            "9) She ___ two books this year. (has read) -> has read",
            "10) When did you ___ learning French? (start) -> start",
          ],
          practice:
            "Create 12 sentence pairs: one life experience sentence and one specific past-time sentence.",
        },
        {
          topic: "Relative clauses (who/which/that)",
          subtitle: "who, which, that, whose",
          introFr:
            "Une proposition relative ajoute une information sur le nom qui la précède. Who pour les personnes, which pour les choses, that pour les deux dans une relative déterminative. Tu peux omettre who/that/which quand c'est le complément : The book (that) I read.\n\nFormule : nom + who/which/that + phrase.\n\n|||EXAMPLES|||\nThe teacher who helped me was excellent.\nThis is the app that I use every day.\nStudents who revise regularly improve faster.\nThe film we saw was brilliant.",
          examples: [
            "1) The teacher ___ helped me was excellent. (who) -> who",
            "2) This is the app ___ I use every day. (that) -> that",
            "3) Students ___ revise regularly improve faster. (who) -> who",
            "4) The film ___ we saw was brilliant. (that) -> that",
            "5) I know a girl ___ speaks four languages. (who) -> who",
            "6) The phone ___ he bought is expensive. (that) -> that",
            "7) People ___ exercise often feel healthier. (who) -> who",
            "8) The reason ___ I called is important. (why) -> why",
            "9) This is the house ___ I grew up. (where) -> where",
            "10) The student ___ essay won got a prize. (whose) -> whose",
          ],
          practice:
            "Combine 10 short sentence pairs into one sentence using relative clauses.",
        },
        {
          topic: "Modal verbs for advice and obligation",
          subtitle: "should, must, mustn't, have to",
          introFr:
            "Les modaux ne se conjuguent pas : pas de -s, pas de did. Should = conseil, must = obligation forte, mustn't = interdit, have to = obligation extérieure (règle, loi), don't have to = pas obligé.\n\nFormule : sujet + modal + verbe de base.\n\n|||EXAMPLES|||\nYou should revise every day.\nStudents must wear a uniform.\nYou mustn't use your phone in the exam.\nWe have to leave early tomorrow.",
          examples: [
            "1) You ___ revise every day. (should) -> should",
            "2) Students ___ wear a uniform. (must) -> must",
            "3) You ___ use your phone in the exam. (mustn't) -> mustn't",
            "4) We ___ leave early tomorrow. (have to) -> have to",
            "5) You ___ pay to use the library. (don't have to) -> don't have to",
            "6) She ___ speak more slowly in class. (should) -> should",
            "7) Visitors ___ sign in at reception. (must) -> must",
            "8) You ___ smoke inside the building. (mustn't) -> mustn't",
            "9) I ___ work on Saturday this week. (have to) -> have to",
            "10) You ___ bring food; lunch is provided. (don't have to) -> don't have to",
          ],
          practice:
            "Write a class rule guide with 8 rules and 6 advice sentences using should/must/mustn't.",
        },
        {
          topic: "Conditionals (0, 1st, 2nd)",
          subtitle: "if + present, will / would",
          introFr:
            "Le zero conditional = vérité générale (si tu chauffes l'eau, elle bout). Le first conditional = futur réaliste (si j'étudie, je réussirai). Le second conditional = situation imaginaire au présent (si j'avais plus de temps, je voyagerais). Jamais de would dans la proposition introduite par if.\n\nFormule 0 : If + présent, présent.\nFormule 1 : If + présent, will + base.\nFormule 2 : If + past simple, would + base.\n\n|||EXAMPLES|||\nIf you heat ice, it melts.\nIf I study hard, I will pass the test.\nIf I had more time, I would read more books.\nIf it rains, we will stay at home.",
          examples: [
            "1) If you heat ice, it ___. (melts) -> melts",
            "2) If I study hard, I ___ the test. (will pass) -> will pass",
            "3) If I had more time, I ___ more books. (would read) -> would read",
            "4) If it rains, we ___ at home. (will stay) -> will stay",
            "5) If she ___ harder, she would succeed. (worked) -> worked",
            "6) If you mix red and blue, you ___ purple. (get) -> get",
            "7) If they invite me, I ___ go. (will) -> will",
            "8) If I were rich, I ___ travel the world. (would) -> would",
            "9) If he doesn't hurry, he ___ the bus. (will miss) -> will miss",
            "10) If we had a car, we ___ drive to the coast. (would) -> would",
          ],
          practice:
            "Write 12 conditional sentences: 4 zero, 4 first, and 4 second conditional.",
        },
        {
          topic: "Reported speech",
          subtitle: "said she was, would, could",
          introFr:
            "Le discours indirect rapporte ce que quelqu'un a dit sans guillemets. Si le verbe introducteur est au passé (said, told), les temps reculent : « I am tired » → she said she was tired. Les mots comme today deviennent that day, now → then.\n\nFormule : She said (that) + sujet + verbe au passé.\n\n|||EXAMPLES|||\nShe said she was tired.\nHe said he would call me.\nThey said they had finished.\nShe said she could help us.",
          examples: [
            "1) She said, 'I am tired.' -> She said she ___ tired. (was) -> was",
            "2) He said, 'I will call you.' -> He said he ___ call me. (would) -> would",
            "3) They said, 'We have finished.' -> They said they ___ finished. (had) -> had",
            "4) She said, 'I can help.' -> She said she ___ help. (could) -> could",
            "5) He said, 'I live in Dublin.' -> He said he ___ in Dublin. (lived) -> lived",
            "6) They said, 'We are leaving.' -> They said they ___ leaving. (were) -> were",
            "7) She said, 'I saw the film.' -> She said she ___ the film. (had seen) -> had seen",
            "8) He said, 'I will not come.' -> He said he ___ not come. (would) -> would",
            "9) She asked, 'Are you ready?' -> She asked if I ___ ready. (was) -> was",
            "10) He said, 'I must go now.' -> He said he ___ to go then. (had) -> had",
          ],
          practice:
            "Convert 10 direct quotes into reported speech and explain each tense change.",
        },
        {
          topic: "Passive voice in context",
          subtitle: "is made, was built, been stolen",
          introFr:
            "La voix passive met l'accent sur l'action, pas sur qui l'a faite. On la forme avec be + participe passé au bon temps. En français on utilise souvent « on » ; en anglais, le passif est très courant à l'écrit.\n\nFormule : sujet + be + participe passé (+ by + agent si besoin).\n\n|||EXAMPLES|||\nEnglish is spoken worldwide.\nThe bridge was built in 1998.\nMy bike has been stolen.\nThe road is being repaired today.",
          examples: [
            "1) People speak English worldwide. -> English ___ worldwide. (is spoken) -> is spoken",
            "2) They built the bridge in 1998. -> The bridge ___ in 1998. (was built) -> was built",
            "3) Someone has stolen my bike. -> My bike ___. (has been stolen) -> has been stolen",
            "4) The chef cooks the meals. -> The meals ___ by the chef. (are cooked) -> are cooked",
            "5) They will announce the results. -> The results ___ tomorrow. (will be announced) -> will be announced",
            "6) Someone broke the window. -> The window ___. (was broken) -> was broken",
            "7) They are repairing the road. -> The road ___. (is being repaired) -> is being repaired",
            "8) People use this app daily. -> This app ___ daily. (is used) -> is used",
            "9) They had finished the work. -> The work ___. (had been finished) -> had been finished",
            "10) Someone must sign the form. -> The form ___. (must be signed) -> must be signed",
          ],
          practice:
            "Rewrite 14 active sentences into passive voice and identify the tense used each time.",
        },
        {
          topic: "Comparatives and superlatives for argument writing",
          subtitle: "more… than, the best",
          introFr:
            "Les adjectifs courts prennent -er / -est (cheaper, cheapest). Les adjectifs longs utilisent more / most (more effective, most effective). Après le comparatif, mets than. Devant le superlatif, mets the. Attention aux irréguliers : good → better → best, bad → worse → worst.\n\nFormule comparatif court : adjectif + er + than.\nFormule superlatif court : the + adjectif + est.\n\n|||EXAMPLES|||\nThis plan is more effective than the last one.\nIt is the best option for students.\nPublic transport is often cheaper than driving.\nThat was the worst film I have ever seen.",
          examples: [
            "1) This plan is ___ than the last one. (more effective) -> more effective",
            "2) It is the ___ option for students. (best) -> best",
            "3) Public transport is often ___ than driving. (cheaper) -> cheaper",
            "4) She is ___ than her sister. (taller) -> taller",
            "5) That was the ___ film I have ever seen. (worst) -> worst",
            "6) This exercise is ___ than the previous one. (harder) -> harder",
            "7) He is the ___ player on the team. (most experienced) -> most experienced",
            "8) Today is ___ than yesterday. (warmer) -> warmer",
            "9) Maths is ___ for me than history. (easier) -> easier",
            "10) It was the ___ day of my life. (happiest) -> happiest",
          ],
          practice:
            "Write a comparison paragraph (150 words) about two study methods using 10 comparison forms.",
        },
        {
          topic: "Essay paragraph structure (PEEL)",
          subtitle: "Point, Evidence, Explain, Link",
          introFr:
            "PEEL t'aide à structurer un paragraphe argumenté en anglais : annonce ton idée tout de suite, pas à la fin comme parfois en français. Point = idée principale, Evidence = preuve, Explain = pourquoi c'est important, Link = retour à la question.\n\nFormule : Point + Evidence + Explain + Link (un paragraphe = une idée).\n\n|||EXAMPLES|||\nPoint: School uniforms improve focus.\nEvidence: A survey of 200 students showed better concentration.\nExplain: Less social pressure helps students work.\nLink: This answers why uniforms can help learning.",
          examples: [
            "1) The ___ sentence should state your main idea. (opening) -> opening",
            "2) Good evidence includes a ___ or a real example. (fact) -> fact",
            "3) After evidence, you must ___ why it matters. (explain) -> explain",
            "4) The final sentence should ___ back to the question. (link) -> link",
            "5) Each PEEL paragraph covers one ___. (point) -> point",
            "6) Strong essays use ___ data, not vague opinions. (specific) -> specific",
            "7) The Explain section connects evidence to your ___. (argument) -> argument",
            "8) A good Link shows how the paragraph answers the ___. (question) -> question",
            "9) PEEL helps you avoid ___ that wander off topic. (paragraphs) -> paragraphs",
            "10) In English essays, put the Point ___ in the paragraph. (first) -> first",
          ],
          practice:
            "Write two PEEL paragraphs on one education topic and self-check each section.",
          extension: "Turn one paragraph into a full timed essay introduction and conclusion.",
          homework: "Submit one PEEL paragraph plus self-assessment rubric.",
          checklist: ["Point is clear", "Evidence is relevant", "Explanation links to question"],
        },
        {
          topic: "Linkers for cohesion (however, therefore, moreover)",
          subtitle: "however, therefore, moreover",
          introFr:
            "Les connecteurs montrent le lien logique entre tes idées. However = contraste, therefore = conséquence, moreover = de plus, although = bien que. En anglais formel, however commence souvent une nouvelle phrase ou suit un point-virgule.\n\nFormule : phrase 1 ; however, phrase 2.\n\n|||EXAMPLES|||\nThe plan is expensive; however, it is effective.\nWe practised daily; therefore, we improved.\nThe class is small; moreover, everyone participates.\nAlthough it was late, they continued working.",
          examples: [
            "1) The plan is expensive; ___, it is effective. (however) -> however",
            "2) We practised daily; ___, we improved. (therefore) -> therefore",
            "3) The class is small; ___, everyone participates. (moreover) -> moreover",
            "4) ___ the weather was bad, we went out. (Although) -> Although",
            "5) She studied hard; ___, she passed easily. (therefore) -> therefore",
            "6) The idea is new. ___, it needs more testing. (However) -> However",
            "7) He is talented. ___, he works very hard. (Furthermore) -> Furthermore",
            "8) I wanted to go; ___, I was too tired. (however) -> however",
            "9) ___ it was late, they continued working. (Even though) -> Even though",
            "10) Costs rose. ___, profits increased. (Nevertheless) -> Nevertheless",
          ],
          practice: "Write a 160-word argument text using at least 10 linkers accurately.",
          extension: "Replace basic linkers with higher-level alternatives.",
          homework: "Annotate your paragraph and label every linker by function.",
          checklist: ["No repeated simple linkers", "Correct punctuation", "Logical paragraph flow"],
        },
        {
          topic: "Error correction and redrafting",
          subtitle: "3rd person -s, told me, agree",
          introFr:
            "Les francophones font souvent les mêmes erreurs : oubli du -s à la 3e personne (He go → goes), « I am agree » (calque du français → I agree), et « She said me » (→ She told me). Relis à voix haute : si ça sonne bizarre en anglais, corrige.\n\nFormule de base : sujet + verbe (+ compléments), dans cet ordre.\n\n|||EXAMPLES|||\nHe goes to school every day.\nI agree with you on this point.\nShe told me to come earlier.\nThey haven't finished their homework yet.",
          examples: [
            "1) He ___ to school every day. (goes) -> goes",
            "2) I ___ with you on this point. (agree) -> agree",
            "3) She ___ me to come earlier. (told) -> told",
            "4) They ___ finished their homework yet. (haven't) -> haven't",
            "5) He is ___ intelligent than his brother. (more) -> more",
            "6) I have ___ to Paris three times. (been) -> been",
            "7) She ___ me a text message. (sent) -> sent",
            "8) We ___ a lot of fun at the party. (had) -> had",
            "9) He doesn't ___ like spicy food. (really) -> really",
            "10) She explained the rules ___ us clearly. (to) -> to",
          ],
          practice: "Correct 20 common learner errors and rewrite the final paragraph cleanly.",
          extension: "Explain why each correction is needed in simple grammar language.",
          homework: "Submit draft 1 + corrected draft 2.",
          checklist: ["Grammar fixed", "Vocabulary upgraded", "Final draft cleaner than first draft"],
        },
      ],
      schedule: [
        "Week 1: Diagnostic quiz + target setting.",
        "Week 2: Collocations and speaking structure.",
        "Week 3: Present perfect vs past simple.",
        "Week 4: Possessive adjectives and reference clarity in writing.",
        "Week 5: Debate language and argument building.",
        "Week 6: Progress test + graph review + next targets.",
        "Week 7: Relative clauses and sentence expansion.",
        "Week 8: Conditionals for opinion and prediction.",
        "Week 9: Reported speech and summary writing.",
        "Week 10: Passive voice and formal style.",
        "Week 11: Timed writing and speaking mock.",
        "Week 12: End-of-module benchmark + progression graph.",
        "Week 13: Mid-course diagnostic refresh and target reset.",
        "Week 14: Advanced vocabulary in context (media and society).",
        "Week 15: Listening detail + inference training.",
        "Week 16: Structured speaking debates with scoring rubric.",
        "Week 17: Grammar accuracy bootcamp and correction patterns.",
        "Week 18: Essay cohesion and paragraph linking clinic.",
        "Week 19: Reading + summary synthesis practice.",
        "Week 20: Formal and semi-formal email writing workshop.",
        "Week 21: Scenario-based problem-solving speaking class.",
        "Week 22: Progress graph check and weak-topic sprint.",
        "Week 23: Full mixed paper + oral mock practice.",
        "Week 24: Final performance review and next-module pathway.",
      ],
      vocabQuiz: [
        {
          question: "If I study hard, I ___ pass the exam.",
          options: ["would", "will", "have", "had"],
          answer: "will",
        },
        {
          question: "She said she ___ tired.",
          options: ["is", "was", "has", "be"],
          answer: "was",
        },
        {
          question: "The report ___ yesterday.",
          options: ["completed", "was completed", "is complete", "has complete"],
          answer: "was completed",
        },
        {
          question: "This method is ___ than the old one.",
          options: ["effective", "more effective", "most effective", "effectiver"],
          answer: "more effective",
        },
        {
          question: "The app ___ I use is very useful.",
          options: ["who", "which", "where", "what"],
          answer: "which",
        },
        {
          question: "I have lived here ___ 2022.",
          options: ["for", "since", "from", "during"],
          answer: "since",
        },
      ],
    },
    advanced: {
      flashcards: {
        "Academic Vocabulary": [
          { front: "Furthermore", back: "De plus" },
          { front: "Nevertheless", back: "Néanmoins" },
          { front: "Significant", back: "Significatif" },
          { front: "To assess", back: "Évaluer" },
          { front: "To justify", back: "Justifier" },
          { front: "To highlight", back: "Mettre en évidence" },
          { front: "Consequently", back: "Par conséquent" },
          { front: "Hence", back: "D'où" },
          { front: "Accordingly", back: "En conséquence" },
          { front: "Prerequisite", back: "Prérequis" },
          { front: "Implication", back: "Implication" },
          { front: "Criterion", back: "Critère" },
          { front: "Hypothesis", back: "Hypothèse" },
          { front: "Variable", back: "Variable" },
          { front: "Correlation", back: "Corrélation" },
          { front: "Causation", back: "Relation de cause à effet" },
          { front: "Paradigm", back: "Paradigme" },
          { front: "Rationale", back: "Justification" },
          { front: "Coherent", back: "Coherent" },
          { front: "Ambiguous", back: "Ambigu" },
          { front: "Prevalent", back: "Répandu" },
          { front: "Robust", back: "Robuste" },
        ],
        "Essay Precision": [
          { front: "A key limitation", back: "Une limite majeure" },
          { front: "It can be argued that", back: "On peut soutenir que" },
          { front: "From a broader perspective", back: "Dans une perspective plus large" },
          { front: "This suggests that", back: "Cela suggère que" },
          { front: "In practical terms", back: "En termes pratiques" },
          { front: "A nuanced view", back: "Une vision nuancée" },
          { front: "By implication", back: "Par implication" },
          { front: "To put it another way", back: "Autrement dit" },
          { front: "For the sake of clarity", back: "Pour plus de clarté" },
          { front: "Without oversimplifying", back: "Sans simplifier à l'excès" },
          { front: "A salient point", back: "Un point saillant" },
          { front: "The prevailing view", back: "L'opinion dominante" },
          { front: "A contentious issue", back: "Une question controversée" },
          { front: "To reiterate", back: "Pour le répéter" },
          { front: "In essence", back: "Essentiellement" },
          { front: "Prima facie", back: "À première vue" },
          { front: "Mutatis mutandis", back: "En changeant ce qui doit l'être" },
          { front: "Extrapolation", back: "Extrapolation" },
          { front: "Generalisation", back: "Généralisation" },
          { front: "Tentative conclusion", back: "Conclusion provisoire" },
          { front: "Further research is warranted", back: "Des recherches supplémentaires s'imposent" },
          { front: "The burden of proof", back: "La charge de la preuve" },
        ],
        "Critical Analysis": [
          { front: "Underlying assumption", back: "Hypothèse sous-jacente" },
          { front: "Methodological weakness", back: "Faiblesse méthodologique" },
          { front: "Empirical evidence", back: "Preuve empirique" },
          { front: "Counterargument", back: "Contre-argument" },
          { front: "To substantiate", back: "Étayer / corroborer" },
          { front: "Bias", back: "Biais" },
          { front: "Confounding factor", back: "Facteur de confusion" },
          { front: "Internal validity", back: "Validité interne" },
          { front: "External validity", back: "Validité externe" },
          { front: "Sampling error", back: "Erreur d'échantillonnage" },
          { front: "Statistical significance", back: "Signification statistique" },
          { front: "Effect size", back: "Taille d'effet" },
          { front: "Replication", back: "Replication" },
          { front: "Anomaly", back: "Anomalie" },
          { front: "Outlier", back: "Valeur aberrante" },
          { front: "Cherry-picking", back: "Sélection biaisée des données" },
          { front: "Straw man fallacy", back: "Homme de paille (sophisme)" },
          { front: "Circular reasoning", back: "Raisonnement circulaire" },
          { front: "Hasty generalisation", back: "Généralisation hâtive" },
          { front: "Red herring", back: "Diversion / fausse piste" },
          { front: "Appeal to authority", back: "Argument d'autorité" },
          { front: "Occam's razor", back: "Rasoir d'Ockham" },
        ],
        "Presentation Language": [
          { front: "Today I will address...", back: "Aujourd'hui, je vais aborder..." },
          { front: "Let's now turn to...", back: "Passons maintenant à..." },
          { front: "As this chart illustrates...", back: "Comme ce graphique l'illustre..." },
          { front: "To conclude this section...", back: "Pour conclure cette partie..." },
          { front: "In summary...", back: "En résumé..." },
          { front: "I welcome your questions.", back: "Je suis ouvert à vos questions." },
          { front: "Let me begin by outlining...", back: "Permettez-moi de commencer par esquisser..." },
          { front: "This slide shows...", back: "Cette diapositive montre..." },
          { front: "If we zoom in on...", back: "Si nous zoomons sur..." },
          { front: "The key takeaway is...", back: "L'essentiel à retenir est..." },
          { front: "I will now hand over to...", back: "Je cède maintenant la parole à..." },
          { front: "Thank you for your attention.", back: "Merci pour votre attention." },
          { front: "I am happy to elaborate.", back: "Je suis ravi d'approfondir." },
          { front: "Does that answer your question?", back: "Est-ce que cela répond à votre question ?" },
          { front: "Let me clarify that point.", back: "Permettez-moi de clarifier ce point." },
          { front: "Moving on to the next topic...", back: "Passons au sujet suivant..." },
          { front: "To put this into context...", back: "Pour situer le contexte..." },
          { front: "Time permitting, I will...", back: "Si le temps le permet, je..." },
          { front: "I will keep this brief.", back: "Je serai bref / brève." },
          { front: "Any questions so far?", back: "Des questions jusqu'ici ?" },
          { front: "I look forward to your feedback.", back: "J'attends vos retours avec intérêt." },
          { front: "This brings me to my final point.", back: "Cela m'amène à mon dernier point." },
        ],
        "Sport, ethics, and society": [
          { front: "Doping scandal", back: "Affaire de dopage" },
          { front: "Integrity", back: "Intégrité" },
          { front: "Grassroots sport", back: "Sport amateur" },
          { front: "Elite performance", back: "Haut niveau" },
          { front: "Commercialisation", back: "Commercialisation" },
          { front: "Public funding", back: "Financement public" },
          { front: "Safeguarding", back: "Protection des mineurs / prévention" },
          { front: "Inclusivity", back: "Inclusivité" },
          { front: "Match fixing", back: "Trucage de match" },
          { front: "Anti-doping agency", back: "Agence antidopage" },
          { front: "Spectator violence", back: "Violence des supporters" },
          { front: "Ticket scalping", back: "Revente de billets" },
          { front: "Youth academy", back: "Centre de formation" },
          { front: "Transfer fee", back: "Indemnité de transfert" },
          { front: "Sports governance", back: "Gouvernance sportive" },
          { front: "Gender equality in sport", back: "Égalité des genres dans le sport" },
          { front: "Paralympic movement", back: "Mouvement paralympique" },
          { front: "Olympic charter", back: "Charte olympique" },
          { front: "National anthem", back: "Hymne national" },
        ],
        "Housing and urban life": [
          { front: "Gentrification", back: "Embourgeoisement" },
          { front: "Affordable housing", back: "Logement abordable" },
          { front: "Urban sprawl", back: "Étalement urbain" },
          { front: "Zoning regulations", back: "Réglementation d'urbanisme" },
          { front: "Commuter belt", back: "Couronne périurbaine" },
          { front: "High-density housing", back: "Logement à forte densité" },
          { front: "Social housing", back: "Logement social" },
          { front: "Carbon footprint of buildings", back: "Empreinte carbone du bâtiment" },
          { front: "Green belt", back: "Ceinture verte" },
          { front: "Brownfield site", back: "Friche industrielle" },
          { front: "Gentrification pressure", back: "Pression d'embourgeoisement" },
          { front: "Eviction", back: "Expulsion" },
          { front: "Housing shortage", back: "Pénurie de logements" },
          { front: "Rent control", back: "Encadrement des loyers" },
          { front: "Co-housing", back: "Habitat participatif" },
          { front: "Urban renewal", back: "Renouvellement urbain" },
          { front: "Pedestrian zone", back: "Zone piétonne" },
          { front: "Public transport hub", back: "Pôle d'échanges multimodal" },
          { front: "Air quality index", back: "Indice de qualité de l'air" },
        ],
      },
      vocab: [
        {
          topic: "Academic argumentation",
          focus: "Use formal connectors, hedging, and precise claims.",
          tasks: ["Produce a 200-word argument paragraph.", "Highlight 10 formal connectors."],
        },
        {
          topic: "Policy and society",
          focus: "Discuss complex topics with evidence and balance.",
          tasks: ["Prepare a structured debate outline.", "Build a 30-word advanced set."],
        },
        {
          topic: "Research and evidence language",
          focus: "Present findings and interpret data accurately.",
          tasks: ["Write a short evidence-based summary.", "Create 12 data interpretation sentences."],
        },
        {
          topic: "Formal presentations",
          focus: "Structure high-level spoken responses with confidence.",
          tasks: ["Plan a 3-minute mini presentation.", "Write and rehearse strong opening/closing lines."],
        },
        {
          topic: "Law, ethics, and policy terms",
          focus: "Use precise terminology for social and policy discussions.",
          tasks: ["Build a 35-word specialist set.", "Write 8 formal definitions in your own words."],
        },
        {
          topic: "Data commentary and graph language",
          focus: "Describe trends and comparisons with advanced precision.",
          tasks: ["Write a graph commentary (180 words).", "Use 12 trend verbs accurately."],
        },
        {
          topic: "Literary and rhetorical analysis",
          focus: "Interpret tone, voice, and persuasive techniques.",
          tasks: ["Analyse one paragraph for rhetorical devices.", "Write a high-register summary response."],
        },
        {
          topic: "University seminar discussion language",
          focus: "Contribute to complex discussion with structured interventions.",
          tasks: ["Build 20 seminar response stems.", "Write 8 analytical follow-up questions."],
        },
        {
          topic: "Evaluation and critique",
          focus: "Evaluate strengths and weaknesses with precise justification.",
          tasks: ["Write a balanced critique paragraph.", "Create a checklist for evaluating sources."],
        },
      ],
      exercises: [
        {
          topic: "Possessive adjectives in advanced writing",
          subtitle: "its policy, their results",
          introFr:
            "En rédaction formelle, chaque possessif doit renvoyer clairement au bon possesseur dans tout le texte. Its pour une organisation, un pays ou un document ; their pour un groupe de personnes. Si c'est flou, répète le nom au lieu d'utiliser their ou its.\n\nFormule : possessif précis + nom, ou répéter le nom pour éviter l'ambiguïté.\n\n|||EXAMPLES|||\nEach candidate must justify their methodology.\nThe committee reviewed its final draft.\nThe researchers defended their conclusions.\nThe university published its annual report.",
          examples: [
            "1) Each candidate must justify ___ methodology. (their) -> their",
            "2) The committee reviewed ___ final draft. (its) -> its",
            "3) Students should evaluate ___ assumptions. (their) -> their",
            "4) The university published ___ annual report. (its) -> its",
            "5) The researchers defended ___ conclusions. (their) -> their",
            "6) France raised ___ minimum wage last year. (its) -> its",
            "7) The board announced ___ decision yesterday. (its) -> its",
            "8) Both authors revised ___ chapters. (their) -> their",
            "9) The company improved ___ online service. (its) -> its",
            "10) Every participant signed ___ consent form. (their) -> their",
          ],
          practice:
            "Edit a 180-word text to improve reference clarity, possessives, and cohesion.",
        },
        {
          topic: "Cleft and inversion practice",
          subtitle: "It was… who, Rarely do…",
          introFr:
            "Les phrases clivées mettent en avant un élément : It was John who called. L'inversion donne un ton plus formel ou emphatique : Rarely do we see such progress. Utilise ces structures avec parcimonie dans un essai — une ou deux fois suffisent.\n\nFormule clivée : It is/was + élément + who/that + reste.\nFormule inversion : Rarely/Never + auxiliaire + sujet + verbe.\n\n|||EXAMPLES|||\nIt was Maria who solved the problem.\nRarely do students receive such detailed feedback.\nWhat the essay lacks is clear evidence.\nNever have I seen such dedication.",
          examples: [
            "1) It was only later that we ___ the issue. (understood) -> understood",
            "2) Rarely ___ students receive such feedback. (do) -> do",
            "3) What the essay lacks is ___ evidence. (clear) -> clear",
            "4) It was Maria ___ solved the problem. (who) -> who",
            "5) Never ___ I seen such dedication. (have) -> have",
            "6) Not only ___ she win, but she broke the record. (did) -> did",
            "7) It is flexibility ___ employers value most. (that) -> that",
            "8) Little ___ they know about the surprise. (did) -> did",
            "9) What we need is ___ better planning. (more) -> more",
            "10) Only then ___ we realise the mistake. (did) -> did",
          ],
          practice:
            "Rewrite 8 neutral sentences into advanced structures with clefts or inversion.",
        },
        {
          topic: "Hedging and academic caution",
          subtitle: "may, might, appears to",
          introFr:
            "En anglais académique, on évite les affirmations trop absolues sans preuve. May, might, appears to, tends to et it could be argued that adoucissent ta phrase et montrent que tu réfléchis. En français on peut être plus direct ; en anglais, nuancer fait plus « universitaire ».\n\nFormule : sujet + may/might/appears to + verbe.\n\n|||EXAMPLES|||\nThis result may indicate a wider trend.\nIt could be argued that policy must change.\nThe evidence appears to suggest a link.\nThese findings may not apply to all groups.",
          examples: [
            "1) This result ___ indicate a wider trend. (may) -> may",
            "2) It ___ be argued that policy changes are needed. (can) -> can",
            "3) The evidence ___ to suggest a link. (appears) -> appears",
            "4) The data ___ support this conclusion. (seem to) -> seem to",
            "5) This ___ be the main cause of the problem. (might) -> might",
            "6) It is ___ that costs will rise. (probable) -> probable",
            "7) The study ___ to show a small effect. (tends) -> tends",
            "8) One could ___ that the sample is too small. (argue) -> argue",
            "9) These findings ___ not apply to all groups. (may) -> may",
            "10) It ___ reasonable to expect improvement. (is) -> is",
          ],
          practice:
            "Rewrite a strong opinion paragraph using at least 8 hedging expressions.",
        },
        {
          topic: "Nominalisation for formal writing",
          subtitle: "analysis, decision, improvement",
          introFr:
            "La nominalisation transforme un verbe en nom pour un style plus formel : analyse → analysis, decide → decision. C'est utile en essai, mais garde aussi des verbes clairs pour que le lecteur sache qui fait l'action.\n\nFormule : The + nominalisation + of + nom (The analysis of the data…).\n\n|||EXAMPLES|||\nWe analysed the data. → The analysis was thorough.\nThe government decided quickly. → The decision surprised many.\nStudents improved rapidly. → Rapid improvement was observed.\nThey discussed the issue for hours.",
          examples: [
            "1) We analysed the data. -> The ___ of the data was thorough. (analysis) -> analysis",
            "2) The government decided quickly. -> The quick ___ surprised many. (decision) -> decision",
            "3) Students improved rapidly. -> Rapid ___ was observed. (improvement) -> improvement",
            "4) They discussed the issue. -> The ___ lasted two hours. (discussion) -> discussion",
            "5) The team failed to communicate. -> Poor ___ caused delays. (communication) -> communication",
            "6) We evaluated the results. -> Our ___ was positive. (evaluation) -> evaluation",
            "7) The policy changed society. -> The ___ of the policy was significant. (impact) -> impact",
            "8) Scientists discovered a new method. -> The ___ was published last year. (discovery) -> discovery",
            "9) He argued convincingly. -> His ___ was persuasive. (argument) -> argument",
            "10) They implemented the plan. -> The ___ took six months. (implementation) -> implementation",
          ],
          practice:
            "Transform 12 verb-based sentences into formal nominalised structures.",
        },
        {
          topic: "Paraphrasing and synonym control",
          subtitle: "significant, demonstrate, issue",
          introFr:
            "Paraphraser, c'est dire la même chose avec d'autres mots — indispensable pour les essais et pour éviter le plagiat. Un synonyme proche n'est pas toujours exact : problem ≠ issue dans tous les contextes. Change le vocabulaire et la structure de la phrase.\n\nFormule : même sens, mots différents, structure différente.\n\n|||EXAMPLES|||\nImportant → significant or crucial.\nShow → demonstrate or indicate.\nProblem → issue or challenge.\nThink → consider or believe.",
          examples: [
            "1) Important can become ___ in formal writing. (significant) -> significant",
            "2) Show can become ___ in academic texts. (demonstrate) -> demonstrate",
            "3) Problem can become ___ or challenge. (issue) -> issue",
            "4) Get can become ___ or obtain. (receive) -> receive",
            "5) Bad can become ___ or inadequate. (poor) -> poor",
            "6) Think can become ___ or believe. (consider) -> consider",
            "7) Use can become ___ or employ. (utilise) -> utilise",
            "8) Help can become ___ or support. (assist) -> assist",
            "9) Big can become ___ or substantial. (major) -> major",
            "10) Say can become ___ or state. (argue) -> argue",
          ],
          practice:
            "Paraphrase a 160-word paragraph without changing meaning while improving register.",
        },
        {
          topic: "Complex sentence cohesion",
          subtitle: "although, whereas, however",
          introFr:
            "Une phrase complexe relie plusieurs idées avec although, while, because, so that, not only… but also. Chaque partie doit avoir un lien logique clair. Si la phrase devient trop longue, coupe-la en deux.\n\nFormule : Although/While + proposition, proposition principale.\n\n|||EXAMPLES|||\nAlthough the exam was hard, she passed.\nHe studied hard, yet he still felt nervous.\nIf you practise regularly, you will improve.\nShe speaks French, whereas her brother speaks English.",
          examples: [
            "1) ___ the exam was hard, she passed. (Although) -> Although",
            "2) He studied hard, ___ he still felt nervous. (yet) -> yet",
            "3) ___ it was raining, we went out. (Even though) -> Even though",
            "4) She speaks French, ___ her brother speaks English. (whereas) -> whereas",
            "5) ___ you practise regularly, you will improve. (If) -> If",
            "6) The plan failed, ___ it taught us valuable lessons. (but) -> but",
            "7) ___ the evidence is limited, the trend is clear. (While) -> While",
            "8) Not only ___ she write well, but she speaks fluently. (does) -> does",
            "9) ___ the cost is high, the benefits are greater. (Although) -> Although",
            "10) He left early ___ he could catch the train. (so that) -> so that",
          ],
          practice:
            "Write one cohesive paragraph using at least 8 advanced linkers and 3 complex sentence frames.",
        },
        {
          topic: "Advanced punctuation and clarity",
          subtitle: "semicolon, colon, comma splice",
          introFr:
            "Le point-virgule relie deux phrases complètes liées. Les deux-points introduisent une liste ou une explication. Le « comma splice » (deux phrases complètes reliées seulement par une virgule) est une erreur fréquente. Corrige avec un point, un point-virgule ou une conjonction.\n\nFormule : phrase complète ; however, phrase complète.\n\n|||EXAMPLES|||\nThe results were mixed; however, the trend was positive.\nOne thing is clear: we need a plan.\nUse a semicolon to join related ideas.\nCommas separate items in a list of three or more.",
          examples: [
            "1) Use a ___ to join two related full sentences. (semicolon) -> semicolon",
            "2) Use a ___ before a list or explanation. (colon) -> colon",
            "3) A ___ splice joins two sentences with only a comma. (comma) -> comma",
            "4) Non-essential clauses are set off with ___. (commas) -> commas",
            "5) However at the start of a clause often follows a ___. (semicolon) -> semicolon",
            "6) Items in a series are separated by ___. (commas) -> commas",
            "7) A full ___ ends a complete sentence. (stop) -> stop",
            "8) Question marks end ___ sentences. (interrogative) -> interrogative",
            "9) Apostrophes show ___ in contractions and possession. (omission) -> omission",
            "10) Dashes can add a ___ comment mid-sentence. (brief) -> brief",
          ],
          practice:
            "Edit a 220-word text for punctuation accuracy and sentence clarity, then justify each correction.",
        },
        {
          topic: "Synthesis writing from two sources",
          subtitle: "Source A argues, while B…",
          introFr:
            "La synthèse fait dialoguer deux sources dans un même argument — ne fais pas un paragraphe par source. Utilise Source A argues… while Source B suggests… et montre comment les idées se répondent ou s'opposent.\n\nFormule : thèse + Source A + while/however + Source B + ta conclusion.\n\n|||EXAMPLES|||\nSource A argues that remote learning increases access.\nSource B claims quality depends on teacher training.\nA strong thesis must address both viewpoints.\nUse contrast linkers to compare the two sources.",
          examples: [
            "1) Source A argues that remote learning ___ access. (increases) -> increases",
            "2) Source B claims quality depends on ___ training. (teacher) -> teacher",
            "3) A balanced thesis must ___ both viewpoints. (address) -> address",
            "4) Use ___ language to compare the two sources. (contrast) -> contrast",
            "5) Attribution phrases include 'according to' and '___ suggests'. (research) -> research",
            "6) Synthesis requires ___ sources, not separate summaries. (integrating) -> integrating",
            "7) A strong thesis shows how the sources ___ or conflict. (agree) -> agree",
            "8) Link words like 'however' show ___ between sources. (contrast) -> contrast",
            "9) Your conclusion should ___ the combined argument. (summarise) -> summarise",
            "10) Cite evidence using clear ___ to each source. (references) -> references",
          ],
          practice:
            "Write a 250-word synthesis paragraph integrating two short sources with clear attribution.",
        },
        {
          topic: "Timed high-level speaking response",
          subtitle: "First, However, To sum up",
          introFr:
            "À l'oral chronométré, prends trente secondes pour planifier, puis structure : affirmation, exemple, contrepoint, conclusion. Des phrases courtes et correctes valent mieux que de longues phrases bancales. Entraîne-toi avec un minuteur.\n\nFormule : First + point 1. However + contrepoint. To sum up + conclusion.\n\n|||EXAMPLES|||\nFirst, state your main claim clearly.\nSupport it with one concrete example.\nHowever, mention one counterargument briefly.\nTo sum up, restate your position in one sentence.",
          examples: [
            "1) Start with a clear ___ statement. (opening) -> opening",
            "2) Support your claim with a concrete ___. (example) -> example",
            "3) Include at least one ___ to show balance. (counterpoint) -> counterpoint",
            "4) Use '___' to introduce your first argument. (First) -> First",
            "5) Use '___' to signal a contrast. (However) -> However",
            "6) End with a strong ___ sentence. (concluding) -> concluding",
            "7) Advanced linkers improve ___ between ideas. (cohesion) -> cohesion",
            "8) A timed response usually lasts about ___ minutes. (two) -> two",
            "9) Planning time is often about ___ seconds. (thirty) -> thirty",
            "10) Signposting helps the listener follow your ___. (structure) -> structure",
          ],
          practice:
            "Record three timed responses and self-score accuracy, coherence, and lexical range.",
          extension: "Re-record your lowest-scoring response and improve by at least 2 points.",
          homework: "Submit both recordings and a reflection paragraph.",
          checklist: ["Clear structure", "Advanced vocabulary", "Accurate grammar under time pressure"],
        },
        {
          topic: "Abstract topic essay planning",
          subtitle: "thesis, points, counterargument",
          introFr:
            "Avant d'écrire sur un sujet abstrait (technologie, éthique, climat), écris un plan avec une thèse claire, deux arguments et un contre-argument que tu peux réfuter. Chaque paragraphe du développement = une partie du plan. Planifier d'abord te fait gagner du temps.\n\nFormule : thèse + argument 1 + argument 2 + contre-argument + conclusion.\n\n|||EXAMPLES|||\nEvery essay plan needs a clear thesis.\nInclude at least two supporting points.\nAdd one counterargument you can answer.\nSpend the first minutes planning, then write.",
          examples: [
            "1) Every essay plan needs a clear ___. (thesis) -> thesis",
            "2) Include at least two supporting ___ in your plan. (points) -> points",
            "3) A strong plan includes a ___ you can answer. (counterargument) -> counterargument",
            "4) Each body paragraph maps to one ___ in the plan. (section) -> section",
            "5) Abstract topics need ___ examples, not vague generalities. (concrete) -> concrete",
            "6) Your introduction should state the ___ directly. (thesis) -> thesis",
            "7) Planning time saves time during ___. (writing) -> writing",
            "8) A balanced essay considers more than one ___. (viewpoint) -> viewpoint",
            "9) The conclusion should ___ the thesis without repeating every detail. (restate) -> restate",
            "10) Under exam conditions, spend the first minutes on ___. (planning) -> planning",
          ],
          practice: "Create 3 full essay plans in 20 minutes each.",
          extension: "Write one complete essay from your strongest plan.",
          homework: "Submit all 3 plans with your best chosen thesis highlighted.",
          checklist: ["Balanced argument", "Clear logic chain", "Concrete examples"],
        },
        {
          topic: "Source comparison and reliability",
          subtitle: "bias, evidence, reliability",
          introFr:
            "Comparer des sources, ce n'est pas dire laquelle tu préfères : examine l'objectif, le public visé, les preuves et les biais. Une source fiable cite ses sources, reconnaît ses limites et reste cohérente avec son but (informer ou convaincre).\n\nFormule : objectif + preuves + biais → jugement argumenté.\n\n|||EXAMPLES|||\nCompare each source's purpose and audience.\nDistinguish a claim from supporting data.\nIdentify bias and missing context.\nExplain why one source is more reliable.",
          examples: [
            "1) Compare each source's ___ and intended audience. (purpose) -> purpose",
            "2) Distinguish a claim from supporting ___. (data) -> data",
            "3) Identify ___ and missing context in each source. (bias) -> bias",
            "4) A reliable source acknowledges its ___. (limitations) -> limitations",
            "5) Check whether the evidence is ___ and verifiable. (specific) -> specific",
            "6) Persuasive sources may omit ___ viewpoints. (opposing) -> opposing",
            "7) Academic sources usually cite their ___. (references) -> references",
            "8) News articles should separate fact from ___. (opinion) -> opinion",
            "9) Your judgment must explain ___ one source is stronger. (why) -> why",
            "10) Compare sources using a ___ tone, not personal preference. (analytical) -> analytical",
          ],
          practice: "Compare two short sources in a 220-word critical response.",
          extension: "Add one paragraph evaluating which source is more reliable and why.",
          homework: "Submit your comparison with highlighted evidence references.",
          checklist: ["Direct source references", "Reliability judgment explained", "Balanced tone maintained"],
        },
      ],
      schedule: [
        "Week 1: Baseline essay and speaking analysis.",
        "Week 2: Academic vocabulary deployment.",
        "Week 3: Cohesion, reference, and possessive accuracy.",
        "Week 4: Advanced grammar (inversion/clefts).",
        "Week 5: Timed argument writing + feedback.",
        "Week 6: Performance graph review and next module plan.",
        "Week 7: Hedging and formal stance development.",
        "Week 8: Nominalisation and style compression.",
        "Week 9: Source analysis and synthesis writing.",
        "Week 10: Data commentary and advanced presentation language.",
        "Week 11: Full mock exam cycle (writing + speaking).",
        "Week 12: Final review, progression graphs, and next-term targets.",
        "Week 13: Advanced diagnostics and precision target reset.",
        "Week 14: Critical reading and argument evaluation workshop.",
        "Week 15: Data commentary and graph explanation masterclass.",
        "Week 16: High-register speaking and seminar response training.",
        "Week 17: Academic style editing and concision drills.",
        "Week 18: Synthesis writing from multiple short sources.",
        "Week 19: Timed essay simulation with rubric grading.",
        "Week 20: Counterargument depth and rebuttal structure clinic.",
        "Week 21: Vocabulary precision and synonym control lab.",
        "Week 22: Full oral response cycle with self-analysis.",
        "Week 23: Capstone mock (reading, writing, speaking).",
        "Week 24: Final graph review and university-readiness planning.",
      ],
      vocabQuiz: [
        {
          question: "It can be argued that this approach is ___ sustainable.",
          options: ["high", "highly", "height", "highest"],
          answer: "highly",
        },
        {
          question: "Rarely ___ students receive such specific feedback.",
          options: ["do", "did", "are", "have"],
          answer: "do",
        },
        {
          question: "The findings appear ___ support the hypothesis.",
          options: ["to", "for", "that", "with"],
          answer: "to",
        },
        {
          question: "A key ___ of the study is sample size.",
          options: ["limit", "limitation", "limited", "limiting"],
          answer: "limitation",
        },
        {
          question: "Not only ___ improve accuracy, but it also improved clarity.",
          options: ["it did", "did it", "it has", "has it"],
          answer: "did it",
        },
        {
          question: "The policy was criticised for ___ transparency.",
          options: ["lack", "lacking of", "lack of", "to lack"],
          answer: "lack of",
        },
      ],
    },
  };

  function buildMasterDeck(seedPairs, total) {
    const cards = [];
    for (let i = 0; i < total; i++) {
      const pair = seedPairs[i % seedPairs.length];
      const setNum = Math.floor(i / seedPairs.length) + 1;
      cards.push({
        front: pair.en + " (" + pair.theme + " set " + setNum + ")",
        back: pair.fr,
      });
    }
    return cards;
  }

  function buildFiftyVocabQuestions(seedItems) {
    const questions = [];
    const difficultyCycle = ["easy", "medium", "hard"];
    for (let i = 0; i < 50; i++) {
      const current = seedItems[i % seedItems.length];
      const d1 = seedItems[(i + 1) % seedItems.length].correct;
      const d2 = seedItems[(i + 2) % seedItems.length].correct;
      const d3 = seedItems[(i + 3) % seedItems.length].correct;
      questions.push({
        question: current.q,
        options: [current.correct, d1, d2, d3],
        answer: current.correct,
        topic: current.topic || "General",
        difficulty: difficultyCycle[i % difficultyCycle.length],
      });
    }
    return questions;
  }

  const beginnerMasterSeeds = [
    { en: "family", fr: "famille", theme: "people" },
    { en: "friend", fr: "ami(e)", theme: "people" },
    { en: "teacher", fr: "professeur", theme: "school" },
    { en: "lesson", fr: "leçon", theme: "school" },
    { en: "homework", fr: "devoirs", theme: "school" },
    { en: "kitchen", fr: "cuisine", theme: "home" },
    { en: "bedroom", fr: "chambre", theme: "home" },
    { en: "window", fr: "fenêtre", theme: "home" },
    { en: "street", fr: "rue", theme: "town" },
    { en: "market", fr: "marché", theme: "town" },
    { en: "bus", fr: "bus", theme: "transport" },
    { en: "ticket", fr: "billet", theme: "transport" },
    { en: "breakfast", fr: "petit-déjeuner", theme: "food" },
    { en: "dinner", fr: "dîner", theme: "food" },
    { en: "apple", fr: "pomme", theme: "food" },
    { en: "water", fr: "eau", theme: "food" },
    { en: "weather", fr: "temps", theme: "nature" },
    { en: "rain", fr: "pluie", theme: "nature" },
    { en: "sunny", fr: "ensoleillé", theme: "nature" },
    { en: "weekend", fr: "week-end", theme: "time" },
  ];

  const intermediateMasterSeeds = [
    { en: "collaboration", fr: "collaboration", theme: "work" },
    { en: "deadline", fr: "date limite", theme: "work" },
    { en: "responsibility", fr: "responsabilité", theme: "work" },
    { en: "evidence", fr: "preuve", theme: "argument" },
    { en: "claim", fr: "affirmation", theme: "argument" },
    { en: "counterpoint", fr: "contrepoint", theme: "argument" },
    { en: "habit", fr: "habitude", theme: "lifestyle" },
    { en: "wellbeing", fr: "bien-être", theme: "lifestyle" },
    { en: "journey", fr: "trajet", theme: "travel" },
    { en: "destination", fr: "destination", theme: "travel" },
    { en: "culture", fr: "culture", theme: "society" },
    { en: "community", fr: "communauté", theme: "society" },
    { en: "environment", fr: "environnement", theme: "environment" },
    { en: "sustainable", fr: "durable", theme: "environment" },
    { en: "opportunity", fr: "opportunité", theme: "education" },
    { en: "qualification", fr: "qualification", theme: "education" },
    { en: "challenge", fr: "défi", theme: "general" },
    { en: "improvement", fr: "amélioration", theme: "general" },
    { en: "feedback", fr: "retour", theme: "general" },
    { en: "confidence", fr: "confiance", theme: "general" },
  ];

  const advancedMasterSeeds = [
    { en: "nuance", fr: "nuance", theme: "writing" },
    { en: "coherence", fr: "cohérence", theme: "writing" },
    { en: "precision", fr: "précision", theme: "writing" },
    { en: "methodology", fr: "méthodologie", theme: "research" },
    { en: "hypothesis", fr: "hypothèse", theme: "research" },
    { en: "dataset", fr: "jeu de données", theme: "research" },
    { en: "argumentation", fr: "argumentation", theme: "debate" },
    { en: "counterargument", fr: "contre-argument", theme: "debate" },
    { en: "implication", fr: "implication", theme: "analysis" },
    { en: "limitation", fr: "limite", theme: "analysis" },
    { en: "framework", fr: "cadre", theme: "theory" },
    { en: "perspective", fr: "perspective", theme: "theory" },
    { en: "regulation", fr: "réglementation", theme: "policy" },
    { en: "legislation", fr: "législation", theme: "policy" },
    { en: "discourse", fr: "discours", theme: "language" },
    { en: "register", fr: "registre", theme: "language" },
    { en: "synthesis", fr: "synthèse", theme: "academic" },
    { en: "evaluation", fr: "évaluation", theme: "academic" },
    { en: "validity", fr: "validité", theme: "academic" },
    { en: "consistency", fr: "cohérence", theme: "academic" },
  ];

  const beginnerQuizSeeds = [
    { q: "I ___ from Dublin.", correct: "am", topic: "Verb be" },
    { q: "This is ___ sister.", correct: "my", topic: "Possessive adjectives" },
    { q: "There ___ three books.", correct: "are", topic: "There is/are" },
    { q: "He ___ football on Fridays.", correct: "plays", topic: "Present simple" },
    { q: "We went ___ bus.", correct: "by", topic: "Prepositions" },
    { q: "Can I have ___ orange?", correct: "an", topic: "Articles" },
    { q: "They ___ at home yesterday.", correct: "were", topic: "Past simple be" },
    { q: "She is sitting ___ the table.", correct: "at", topic: "Prepositions" },
    { q: "I ___ like coffee.", correct: "don't", topic: "Present simple negatives" },
    { q: "How ___ are you?", correct: "old", topic: "Question phrases" },
    { q: "Right now Marie ___ a sandwich.", correct: "is eating", topic: "Present simple vs continuous" },
    { q: "We ___ English every Wednesday.", correct: "have", topic: "Present simple vs continuous" },
    { q: "I can't talk, I ___ my homework now.", correct: "am doing", topic: "Present simple vs continuous" },
    { q: "Quiet! The baby ___.", correct: "is sleeping", topic: "Present simple vs continuous" },
    { q: "My sister ___ chocolate.", correct: "loves", topic: "Present simple vs continuous" },
    { q: "Listen, they ___ a song.", correct: "are singing", topic: "Present simple vs continuous" },
    { q: "He always ___ his keys.", correct: "forgets", topic: "Present simple vs continuous" },
    { q: "Look! She ___ a new dress.", correct: "is wearing", topic: "Present simple vs continuous" },
    { q: "Cats ___ milk.", correct: "drink", topic: "Present simple vs continuous" },
    { q: "Right now we ___ English.", correct: "are studying", topic: "Present simple vs continuous" },
    { q: "She ___ to school by bus every day.", correct: "goes", topic: "Present simple vs continuous" },
    { q: "Look at the sky, it ___.", correct: "is raining", topic: "Present simple vs continuous" },
  ];

  const intermediateQuizSeeds = [
    { q: "If I revise, I ___ pass.", correct: "will", topic: "First conditional" },
    { q: "She said she ___ tired.", correct: "was", topic: "Reported speech" },
    { q: "The project ___ last month.", correct: "was completed", topic: "Passive voice" },
    { q: "This phone is ___ than mine.", correct: "better", topic: "Comparatives" },
    { q: "I have lived here ___ 2021.", correct: "since", topic: "Present perfect" },
    { q: "The book ___ I bought is excellent.", correct: "that", topic: "Relative clauses" },
    { q: "You ___ wear a helmet.", correct: "must", topic: "Modal verbs" },
    { q: "If I had time, I ___ travel more.", correct: "would", topic: "Second conditional" },
    { q: "He asked me where I ___.", correct: "lived", topic: "Reported speech" },
    { q: "The report contains ___ useful data.", correct: "a lot of", topic: "Quantifiers" },
  ];

  const advancedQuizSeeds = [
    { q: "Rarely ___ such clarity in essays.", correct: "do we see", topic: "Inversion" },
    { q: "It can be argued that this is ___ valid.", correct: "highly", topic: "Academic adverbs" },
    { q: "The findings appear ___ support the claim.", correct: "to", topic: "Academic verb patterns" },
    { q: "A key ___ is limited sample size.", correct: "limitation", topic: "Academic nouns" },
    { q: "Not only ___ improve style, but it improved logic.", correct: "did it", topic: "Inversion" },
    { q: "The author failed to ___ the argument.", correct: "substantiate", topic: "Academic vocabulary" },
    { q: "From a broader ___, policy reform is needed.", correct: "perspective", topic: "Argument language" },
    { q: "This paragraph lacks internal ___.", correct: "coherence", topic: "Writing quality" },
    { q: "The study's ___ remains uncertain.", correct: "validity", topic: "Research language" },
    { q: "The conclusion should be more ___.", correct: "nuanced", topic: "Academic style" },
  ];

  learningData.beginner.flashcards["Master 1000"] = buildMasterDeck(beginnerMasterSeeds, 1000);
  learningData.intermediate.flashcards["Master 1000"] = buildMasterDeck(intermediateMasterSeeds, 1000);
  learningData.advanced.flashcards["Master 1000"] = buildMasterDeck(advancedMasterSeeds, 1000);

  (function mergeClientFlashcardBulk() {
    const src = typeof window !== "undefined" && window.ANDRONICUS_FLASHCARD_MERGE_PAIRS;
    if (!src || typeof src !== "object") return;
    Object.keys(src).forEach(function (key) {
      const pipe = key.indexOf("|");
      if (pipe < 1) return;
      const level = key.slice(0, pipe);
      const deckName = key.slice(pipe + 1);
      const deck = learningData[level] && learningData[level].flashcards && learningData[level].flashcards[deckName];
      if (!deck || !Array.isArray(src[key])) return;
      const seen = {};
      deck.forEach(function (c) {
        seen[String(c.front) + "\t" + String(c.back)] = true;
      });
      src[key].forEach(function (row) {
        if (!row || row.length < 2) return;
        const k = String(row[0]) + "\t" + String(row[1]);
        if (seen[k]) return;
        seen[k] = true;
        deck.push({ front: row[0], back: row[1] });
      });
    });
  })();

  (function snapThemedFlashcardDeckSizes() {
    const STEP = 25;
    ["beginner", "intermediate", "advanced"].forEach(function (lvl) {
      const fc = learningData[lvl] && learningData[lvl].flashcards;
      if (!fc) return;
      Object.keys(fc).forEach(function (deckName) {
        if (deckName === "Master 1000") return;
        const deck = fc[deckName];
        if (!Array.isArray(deck) || deck.length < STEP) return;
        const target = Math.floor(deck.length / STEP) * STEP;
        if (target > 0 && target < deck.length) deck.length = target;
      });
    });
  })();

  learningData.beginner.vocabQuiz = buildFiftyVocabQuestions(beginnerQuizSeeds);
  learningData.intermediate.vocabQuiz = buildFiftyVocabQuestions(intermediateQuizSeeds);
  learningData.advanced.vocabQuiz = buildFiftyVocabQuestions(advancedQuizSeeds);

  /* ------------------------------------------------------------------
   * Irregular verbs: searchable table (English or French) by tense,
   * plus an "Irregular verbs" flashcard deck in every level.
   * ------------------------------------------------------------------ */

  const IRREGULAR_DECK_NAME = "Irregular verbs";
  const VERB_TENSES = ["all", "past", "present_perfect", "past_perfect"];

  function irregularVerbList() {
    const raw = (typeof window !== "undefined" && window.ANDRONICUS_IRREGULAR_VERBS) || [];
    const seen = {};
    return raw
      .filter(function (r) {
        if (!Array.isArray(r) || r.length < 4 || seen[r[0]]) return false;
        seen[r[0]] = true;
        return true;
      })
      .map(function (r) {
        return { base: r[0], past: r[1], pp: r[2], fr: r[3] };
      })
      .sort(function (a, b) {
        return a.base.localeCompare(b.base);
      });
  }

  function firstForm(form) {
    return String(form || "").split("/")[0];
  }

  function verbExample(v, tense) {
    if (tense === "past") {
      if (v.base === "be") return "I was · you were";
      return "I " + firstForm(v.past);
    }
    if (tense === "present_perfect") return "I have " + firstForm(v.pp) + " · she has " + firstForm(v.pp);
    if (tense === "past_perfect") return "I had " + firstForm(v.pp);
    return "";
  }

  function verbSearchText(v) {
    return vocabNormalize([v.base, v.past.replace(/\//g, " "), v.pp.replace(/\//g, " "), v.fr].join(" "));
  }

  (function addIrregularVerbFlashcards() {
    const verbs = irregularVerbList();
    if (!verbs.length) return;
    const deck = verbs.map(function (v) {
      return { front: v.base + " – " + v.past + " – " + v.pp, back: v.fr };
    });
    ["beginner", "intermediate", "advanced"].forEach(function (lvl) {
      if (learningData[lvl] && learningData[lvl].flashcards) {
        learningData[lvl].flashcards[IRREGULAR_DECK_NAME] = deck.slice();
      }
    });
  })();

  function mountIrregularVerbs(level, panel, openFlashcardDeck) {
    const verbs = irregularVerbList();
    const searchIndex = verbs.map(verbSearchText);
    let tense = "all";
    let query = "";

    panel.innerHTML = "";
    const shell = document.createElement("div");
    shell.className = "iv";
    shell.innerHTML =
      '<div class="iv-head">' +
      '  <div><h3 class="iv-title"></h3><p class="iv-count"></p></div>' +
      '  <button type="button" class="flashcard-btn iv-cards"></button>' +
      "</div>" +
      '<div class="iv-controls">' +
      '  <div class="iv-tenses" role="group"></div>' +
      '  <label class="iv-search"><span class="iv-search__lab"></span><input type="search" class="iv-search__input" autocomplete="off" spellcheck="false" /></label>' +
      "</div>" +
      '<p class="iv-hint"></p>' +
      '<div class="iv-table-wrap"><table class="iv-table"><thead><tr></tr></thead><tbody></tbody></table></div>' +
      '<p class="iv-none hidden"></p>';
    panel.appendChild(shell);

    const el = {
      title: shell.querySelector(".iv-title"),
      count: shell.querySelector(".iv-count"),
      cards: shell.querySelector(".iv-cards"),
      tenses: shell.querySelector(".iv-tenses"),
      searchLab: shell.querySelector(".iv-search__lab"),
      search: shell.querySelector(".iv-search__input"),
      hint: shell.querySelector(".iv-hint"),
      headRow: shell.querySelector(".iv-table thead tr"),
      body: shell.querySelector(".iv-table tbody"),
      none: shell.querySelector(".iv-none"),
    };

    function columns() {
      if (tense === "all") {
        return [
          ["verbs_col_base", function (v) { return v.base; }, "iv-base"],
          ["verbs_col_past", function (v) { return v.past; }, ""],
          ["verbs_col_pp", function (v) { return v.pp; }, ""],
          ["verbs_col_fr", function (v) { return v.fr; }, "iv-fr"],
        ];
      }
      const formKey = tense === "past" ? "verbs_col_past" : "verbs_col_pp";
      return [
        ["verbs_col_base", function (v) { return v.base; }, "iv-base"],
        [formKey, function (v) { return tense === "past" ? v.past : v.pp; }, ""],
        ["verbs_col_example", function (v) { return verbExample(v, tense); }, "iv-example"],
        ["verbs_col_fr", function (v) { return v.fr; }, "iv-fr"],
      ];
    }

    function renderTable() {
      const cols = columns();
      el.headRow.innerHTML = "";
      cols.forEach(function (c) {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = I18n.t(c[0]);
        el.headRow.appendChild(th);
      });
      const q = vocabNormalize(query);
      const frag = document.createDocumentFragment();
      let shown = 0;
      verbs.forEach(function (v, i) {
        if (q && searchIndex[i].indexOf(q) < 0) return;
        shown += 1;
        const tr = document.createElement("tr");
        cols.forEach(function (c) {
          const td = document.createElement("td");
          if (c[2]) td.className = c[2];
          td.textContent = c[1](v);
          tr.appendChild(td);
        });
        frag.appendChild(tr);
      });
      el.body.innerHTML = "";
      el.body.appendChild(frag);
      el.count.textContent = q
        ? I18n.t("verbs_count_filtered", { n: String(shown), t: String(verbs.length) })
        : I18n.t("verbs_count", { n: String(verbs.length) });
      el.none.classList.toggle("hidden", shown > 0);
      el.none.textContent = shown ? "" : I18n.t("verbs_none", { q: query.trim() });
      el.headRow.parentNode.parentNode.classList.toggle("hidden", shown === 0);
    }

    function renderChrome() {
      el.title.textContent = I18n.t("learning_tab_verbs");
      el.cards.textContent = I18n.t("verbs_flashcards_btn");
      el.searchLab.textContent = I18n.t("verbs_search_label");
      el.search.placeholder = I18n.t("verbs_search_ph");
      el.hint.textContent = I18n.t("verbs_hint");
      el.tenses.setAttribute("aria-label", I18n.t("verbs_tense_label"));
      el.tenses.innerHTML = "";
      VERB_TENSES.forEach(function (t) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "tool-menu__btn iv-tense" + (t === tense ? " is-active" : "");
        b.setAttribute("aria-pressed", t === tense ? "true" : "false");
        b.textContent = I18n.t("verbs_tense_" + t);
        b.addEventListener("click", function () {
          tense = t;
          renderChrome();
          renderTable();
        });
        el.tenses.appendChild(b);
      });
    }

    el.search.addEventListener("input", function () {
      query = el.search.value;
      renderTable();
    });
    el.cards.addEventListener("click", function () {
      if (openFlashcardDeck) openFlashcardDeck(IRREGULAR_DECK_NAME);
    });

    renderChrome();
    renderTable();
    return {
      render: function () {
        renderChrome();
        renderTable();
      },
    };
  }

  function loadUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      users = raw ? JSON.parse(raw) : {};
    } catch (e) {
      users = {};
    }
  }

  function saveUsers() {
    console.log("SAVING", activeUsername);
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {}
    scheduleActiveUserCloudSync();
  }

  function loadBookings() {
    try {
      const raw = localStorage.getItem(BOOKINGS_KEY);
      bookings = raw ? JSON.parse(raw) : [];
    } catch (e) {
      bookings = [];
    }
  }

  function saveBookings() {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {}
  }

  function loadPayments() {
    try {
      const raw = localStorage.getItem(PAYMENTS_KEY);
      const rows = raw ? JSON.parse(raw) : [];
      paymentChecklist = rows.map(function (item) {
        return {
          id: item.id,
          name: item.name || "",
          paid: !!item.paid,
          owedAmount: Number.isFinite(Number(item.owedAmount))
            ? Math.max(0, Number(item.owedAmount))
            : 0,
        };
      });
    } catch (e) {
      paymentChecklist = [];
    }
  }

  function savePayments() {
    try {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(paymentChecklist));
    } catch (e) {}
  }

  function getSupabaseConfig() {
    return window.ANDRONICUS_CONFIG || {};
  }

  function isSupabaseConfigured() {
    const c = getSupabaseConfig();
    return !!(c.enabled && c.supabaseUrl && c.supabaseAnonKey);
  }

  function hasAdminApiSecret() {
    const c = getSupabaseConfig();
    return !!(c.adminApiSecret && String(c.adminApiSecret).trim().length);
  }

  function getSupabaseClient() {
    if (!isSupabaseConfigured()) return null;
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      console.error("Supabase client library not loaded.");
      return null;
    }
    if (!supabaseClient) {
      const c = getSupabaseConfig();
      supabaseClient = window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey);
    }
    return supabaseClient;
  }

  function normalizeCloudUserRow(row) {
    if (!row || !row.username) return null;
    return {
      fullName: String(row.full_name || ""),
      password: String(row.password || ""),
      parentEmail: String(row.parent_email || ""),
      stats: row.stats && typeof row.stats === "object" ? row.stats : {},
    };
  }

  async function fetchCloudUser(username, password) {
    if (!isSupabaseConfigured()) return null;
    const sb = getSupabaseClient();
    if (!sb || !username || !password) return null;
    try {
      const { data, error } = await sb.rpc("student_get_account", {
        p_username: username,
        p_password: password,
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return normalizeCloudUserRow(row);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function upsertCloudUser(username, user) {
    if (!isSupabaseConfigured()) return false;
    const sb = getSupabaseClient();
    if (!sb || !username || !user || !user.password) return false;
    try {
      const { error } = await sb.rpc("student_upsert_account", {
        p_username: username,
        p_password: String(user.password || ""),
        p_full_name: String(user.fullName || ""),
        p_parent_email: String(user.parentEmail || ""),
        p_stats: user.stats && typeof user.stats === "object" ? user.stats : {},
      });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  function scheduleActiveUserCloudSync() {
    if (!isSupabaseConfigured()) return;
    const user = getActiveUser();
    if (!user || !activeUsername) return;
    if (userCloudSyncTimer) clearTimeout(userCloudSyncTimer);
    if (!userCloudSyncPendingSince) userCloudSyncPendingSince = Date.now();
    // Debounce bursts of saves, but never hold changes back for more than a few seconds.
    const waited = Date.now() - userCloudSyncPendingSince;
    const delay = waited >= USER_CLOUD_SYNC_MAX_WAIT ? 0 : 1200;
    userCloudSyncTimer = setTimeout(function () {
      userCloudSyncTimer = null;
      userCloudSyncPendingSince = 0;
      void flushActiveUserCloudSync();
    }, delay);
  }

  /** Last-chance save when the tab is hidden or closed (keepalive lets the request outlive the page). */
  function flushActiveUserCloudSyncOnExit() {
    if (!userCloudSyncTimer || !isSupabaseConfigured()) return;
    const user = getActiveUser();
    if (!user || !activeUsername || !user.password) return;
    clearTimeout(userCloudSyncTimer);
    userCloudSyncTimer = null;
    userCloudSyncPendingSince = 0;
    const c = getSupabaseConfig();
    try {
      fetch(String(c.supabaseUrl).replace(/\/+$/, "") + "/rest/v1/rpc/student_upsert_account", {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          apikey: c.supabaseAnonKey,
          Authorization: "Bearer " + c.supabaseAnonKey,
        },
        body: JSON.stringify({
          p_username: activeUsername,
          p_password: String(user.password || ""),
          p_full_name: String(user.fullName || ""),
          p_parent_email: String(user.parentEmail || ""),
          p_stats: user.stats && typeof user.stats === "object" ? user.stats : {},
        }),
      }).catch(function () {});
    } catch (e) {}
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flushActiveUserCloudSyncOnExit();
  });
  window.addEventListener("pagehide", flushActiveUserCloudSyncOnExit);

  /**
   * The cloud copy normally wins when a student signs in, but if this device has
   * walked further along a vocabulary path (e.g. the tab closed before syncing),
   * keep the local progress for that level.
   */
  function keepFurthestVocabPath(localUser, cloudUser) {
    if (!localUser || !cloudUser) return cloudUser;
    const localPaths = localUser.stats && localUser.stats.learningHub && localUser.stats.learningHub.vocabPath;
    if (!localPaths || typeof localPaths !== "object") return cloudUser;
    if (!cloudUser.stats || typeof cloudUser.stats !== "object") cloudUser.stats = {};
    if (!cloudUser.stats.learningHub || typeof cloudUser.stats.learningHub !== "object") {
      cloudUser.stats.learningHub = {};
    }
    const cloudHub = cloudUser.stats.learningHub;
    if (!cloudHub.vocabPath || typeof cloudHub.vocabPath !== "object") cloudHub.vocabPath = {};
    Object.keys(localPaths).forEach(function (lvl) {
      const l = localPaths[lvl];
      const c = cloudHub.vocabPath[lvl];
      if (!l) return;
      const lScore = (l.completedLaps || 0) * 1e6 + (l.answered || 0);
      const cScore = c ? (c.completedLaps || 0) * 1e6 + (c.answered || 0) : -1;
      if (lScore > cScore) cloudHub.vocabPath[lvl] = l;
    });
    return cloudUser;
  }

  async function flushActiveUserCloudSync() {
    if (!isSupabaseConfigured()) return;
    const user = getActiveUser();
    if (!user || !activeUsername) return;
    if (userCloudSyncInFlight) {
      userCloudSyncQueued = true;
      return;
    }
    userCloudSyncInFlight = true;
    userCloudSyncQueued = false;
    await upsertCloudUser(activeUsername, user);
    userCloudSyncInFlight = false;
    if (userCloudSyncQueued) {
      userCloudSyncQueued = false;
      await flushActiveUserCloudSync();
    }
  }

  async function fetchAdminStudents() {
    if (adminStudentsLoading) return;
    if (!isSupabaseConfigured()) {
      adminStudentsFetched = true;
      return;
    }
    const sb = getSupabaseClient();
    if (!sb) {
      adminStudentsFetched = true;
      return;
    }
    adminStudentsLoading = true;
    adminStudentsError = "";
    renderAdminPanel();
    try {
      const { data, error } = await sb
        .from("student_accounts")
        .select("username, password, full_name, parent_email, stats");
      if (error) throw error;
      (data || []).forEach(function (row) {
        const normalized = normalizeCloudUserRow(row);
        if (!normalized) return;
        // Keep the active user's local copy so unsynced progress isn't clobbered.
        if (row.username === activeUsername) return;
        users[row.username] = normalized;
      });
    } catch (err) {
      console.error(err);
      adminStudentsError = err && err.message ? err.message : String(err);
    }
    adminStudentsLoading = false;
    adminStudentsFetched = true;
    renderAdminPanel();
    renderAdminPoints();
  }

  async function refreshAdminCloudData() {
    if (!adminUnlocked) return;
    adminStudentsFetched = false;
    if (!isSupabaseConfigured()) {
      if (adminCloudStatus) {
        adminCloudStatus.classList.add("hidden");
        adminCloudStatus.textContent = "";
        adminCloudStatus.style.color = "";
      }
      loadBookings();
      loadPayments();
      renderAdminPanel();
      return;
    }
    if (!hasAdminApiSecret()) {
      if (adminCloudStatus) {
        adminCloudStatus.classList.remove("hidden");
        adminCloudStatus.style.color = "";
        adminCloudStatus.textContent = I18n.t("admin_cloud_no_secret");
      }
      loadBookings();
      loadPayments();
      renderAdminPanel();
      return;
    }
    const sb = getSupabaseClient();
    const secret = getSupabaseConfig().adminApiSecret;
    if (!sb) {
      loadBookings();
      loadPayments();
      renderAdminPanel();
      return;
    }
    if (adminCloudStatus) {
      adminCloudStatus.classList.remove("hidden");
      adminCloudStatus.style.color = "";
      adminCloudStatus.textContent = I18n.t("admin_cloud_syncing");
    }
    try {
      const [bRes, pRes] = await Promise.all([
        sb.rpc("admin_list_bookings", { p_secret: secret }),
        sb.rpc("admin_list_payments", { p_secret: secret }),
      ]);
      if (bRes.error) throw bRes.error;
      if (pRes.error) throw pRes.error;
      bookings = (bRes.data || []).map(function (row) {
        return {
          id: row.id,
          name: row.name,
          phone: row.phone,
          level: row.level,
          slots: row.slots || [],
          createdAt: row.created_at ? new Date(row.created_at).toLocaleString() : "",
        };
      });
      paymentChecklist = (pRes.data || []).map(function (row) {
        return {
          id: row.id,
          name: row.name,
          paid: !!row.paid,
          owedAmount: Number.isFinite(Number(row.owed_amount))
            ? Math.max(0, Number(row.owed_amount))
            : 0,
        };
      });
      if (adminCloudStatus) {
        adminCloudStatus.textContent = I18n.t("admin_cloud_ok");
      }
    } catch (err) {
      console.error(err);
      if (adminCloudStatus) {
        adminCloudStatus.style.color = "#b74848";
        adminCloudStatus.textContent =
          I18n.t("admin_cloud_fail_prefix") + " " + (err.message || String(err));
      }
      loadBookings();
      loadPayments();
    }
    renderAdminPanel();
    void fetchAdminWriting();
    void fetchAdminPoints();
  }

  function persistActiveUser() {
    try {
      if (activeUsername) localStorage.setItem(ACTIVE_USER_KEY, activeUsername);
      else localStorage.removeItem(ACTIVE_USER_KEY);
    } catch (e) {}
  }

  function getActiveUser() {
    if (!activeUsername || !users[activeUsername]) return null;
    return users[activeUsername];
  }

  function ensureStats(user) {
    if (!user.stats) user.stats = {};
    if (!user.stats.flashcards) user.stats.flashcards = { attempts: 0, correct: 0 };
    if (!user.stats.flashcardsByDeck) user.stats.flashcardsByDeck = {};
    if (!user.stats.flashcardSessions) user.stats.flashcardSessions = [];
    if (!user.stats.quizBest) user.stats.quizBest = {};
    if (!user.stats.quizSessions) user.stats.quizSessions = 0;
    if (!user.stats.quizSessionLog) user.stats.quizSessionLog = [];
    if (!user.stats.completedExercises) user.stats.completedExercises = [];
    if (!user.stats.exerciseCompletionLog) user.stats.exerciseCompletionLog = [];
    if (!user.fullName) user.fullName = "";
    ensureLearningHub(user.stats);
    return user.stats;
  }

  function ensureLearningHub(stats) {
    if (!stats.learningHub) {
      stats.learningHub = {
        streak: 0,
        lastActiveDay: "",
        vocabTopic: {},
        savedWords: [],
        savedFlashcards: [],
        homeworkTasks: {},
        homeworkChecklist: {},
        activityByDay: {},
        onboardingShown: false,
        lastLevel: "",
      };
    }
    const lh = stats.learningHub;
    if (!lh.vocabTopic) lh.vocabTopic = {};
    if (!lh.savedWords) lh.savedWords = [];
    if (!lh.savedFlashcards) lh.savedFlashcards = [];
    if (!lh.homeworkTasks) lh.homeworkTasks = {};
    if (!lh.homeworkChecklist) lh.homeworkChecklist = {};
    if (!lh.homeworkChecklistDates) lh.homeworkChecklistDates = {};
    if (!lh.activityByDay) lh.activityByDay = {};
    if (lh.onboardingShown !== true) lh.onboardingShown = false;
    if (lh.lastLevel == null) lh.lastLevel = "";
    if (!lh.lastCelebratedStreak) lh.lastCelebratedStreak = 0;
    return lh;
  }

  function isoDay(d) {
    return d.toISOString().slice(0, 10);
  }

  function countGrammarCompleted(stats, lvl, exercises) {
    const completedKeys = stats.completedExercises || [];
    let n = 0;
    (exercises || []).forEach(function (ex) {
      if (completedKeys.includes(lvl + " - " + ex.topic)) n += 1;
    });
    return n;
  }

  function countHomeworkCompleted(lh, lvl, checklist) {
    const done = (lh.homeworkChecklist && lh.homeworkChecklist[lvl]) || {};
    return (checklist || []).reduce(function (acc, item) {
      return acc + (done[item.id] ? 1 : 0);
    }, 0);
  }

  function landingCardProgressText(tool, lvl, data, stats, lh) {
    if (tool === "grammar") {
      const exercises = data.exercises || [];
      return I18n.t("learning_landing_grammar_progress", {
        n: String(countGrammarCompleted(stats, lvl, exercises)),
        t: String(exercises.length),
      });
    }
    if (tool === "homework") {
      const checklist = data.homeworkChecklist || [];
      return I18n.t("learning_landing_homework_progress", {
        n: String(countHomeworkCompleted(lh, lvl, checklist)),
        t: String(checklist.length),
      });
    }
    if (tool === "flashcards") {
      const n = (stats.flashcardSessions || []).filter(function (s) {
        return s.level === lvl;
      }).length;
      return I18n.t("learning_landing_flashcards_progress", { n: String(n) });
    }
    if (tool === "vocab") {
      const vp = vocabPathProgress(lvl);
      if (!vp) return "";
      if (vp.completed) return I18n.t("vocab_path_card_done");
      return I18n.t("vocab_path_card_progress", { n: String(vp.correct), t: String(vp.total) });
    }
    return "";
  }

  function refreshLandingCardProgress(root, lvl, data) {
    const user = getActiveUser();
    const stats = user ? ensureStats(user) : null;
    const lh = user ? ensureLearningHub(stats) : null;
    const vocabDone = vocabPathCompleted(lvl);
    root.querySelectorAll('.learning-hub__tab[data-tool="vocab"]').forEach(function (tab) {
      tab.classList.toggle("is-complete", vocabDone);
    });
    root.querySelectorAll(".level-landing__card[data-tool]").forEach(function (card) {
      const tool = card.getAttribute("data-tool");
      if (tool === "vocab") card.classList.toggle("is-complete", vocabDone);
      let prog = card.querySelector(".level-landing__card__progress");
      const text =
        user && stats && lh && tool !== "progress"
          ? landingCardProgressText(tool, lvl, data, stats, lh)
          : "";
      if (!text) {
        if (prog) prog.remove();
        return;
      }
      if (!prog) {
        prog = document.createElement("span");
        prog.className = "level-landing__card__progress";
        card.appendChild(prog);
      }
      prog.textContent = text;
    });
  }

  function refreshAllLandingCardProgress() {
    document.querySelectorAll(".learning-hub").forEach(function (root) {
      const lvl = root.getAttribute("data-learning-level");
      const data = learningData[lvl];
      if (data) refreshLandingCardProgress(root, lvl, data);
    });
  }

  function refreshAllHomeworkPanels() {
    homeworkPanelRenderers.forEach(function (renderFn) {
      renderFn();
    });
    vocabPathRenderers.forEach(function (renderFn) {
      renderFn();
    });
  }

  /* ------------------------------------------------------------------
   * Points. Vocabulary: 1 point per stepping stone (stored in stats.learningHub.vocabPoints).
   * Teacher points (manual or for corrected writing) live in Supabase table point_awards.
   * ------------------------------------------------------------------ */

  const POINTS_REFRESH_MS = 3 * 60 * 1000;
  const POINTS_TOAST_KEY = "andronicus_points_toasted_v1";

  /** Vocabulary points from saved stats. Older progress (before points existed) is counted once. */
  function vocabPointsFromStats(stats) {
    const lh = stats && stats.learningHub;
    if (!lh) return 0;
    if (typeof lh.vocabPoints === "number" && isFinite(lh.vocabPoints)) return Math.max(0, lh.vocabPoints);
    let n = 0;
    const paths = lh.vocabPath || {};
    Object.keys(paths).forEach(function (lvl) {
      const st = paths[lvl];
      if (!st || !learningData[lvl]) return;
      const total = buildVocabBank(lvl).order.length;
      n += Math.max(0, (st.lap || 1) - 1) * total + Math.max(0, st.correct || 0);
    });
    return n;
  }

  function addVocabPoint() {
    const user = getActiveUser();
    if (!user) return;
    const stats = ensureStats(user);
    const lh = ensureLearningHub(stats);
    lh.vocabPoints = vocabPointsFromStats(stats) + 1;
    renderPointsBadge({ bump: true });
  }

  function teacherPointsTotal(awards) {
    return (awards || []).reduce(function (sum, a) {
      return sum + (Number(a.points) || 0);
    }, 0);
  }

  function pointsForSubmission(awards, submissionId) {
    if (!submissionId) return 0;
    const a = (awards || []).find(function (x) {
      return x.submission_id === submissionId;
    });
    return a ? Number(a.points) || 0 : 0;
  }

  function formatPoints(n) {
    const v = Number(n) || 0;
    return Math.abs(v) === 1 ? I18n.t("points_one", { n: String(v) }) : I18n.t("points_many", { n: String(v) });
  }

  function formatSignedPoints(n) {
    const v = Number(n) || 0;
    return (v > 0 ? "+" : "") + formatPoints(v);
  }

  function isMissingFunctionError(err) {
    const m = String((err && (err.message || err.code)) || "");
    return /PGRST202|could not find the function|does not exist/i.test(m);
  }

  /* ---------- Student: data ---------- */

  async function loadStudentPoints(force) {
    const user = getActiveUser();
    if (!user || !activeUsername) {
      pointsState = { user: null, loading: false, loaded: false, awards: [] };
      renderPointsBadge();
      return;
    }
    if (pointsState.user !== activeUsername) {
      pointsState = { user: activeUsername, loading: false, loaded: false, awards: [] };
    }
    if (pointsState.loading || (!force && pointsState.loaded)) return;
    const sb = getSupabaseClient();
    if (!sb) {
      pointsState.loaded = true;
      renderPointsBadge();
      return;
    }
    const username = activeUsername;
    pointsState.loading = true;
    try {
      const { data, error } = await sb.rpc("student_list_points", {
        p_username: username,
        p_password: String(user.password || ""),
      });
      if (error) throw error;
      if (activeUsername !== username) return;
      pointsState.awards = data || [];
    } catch (err) {
      if (!isMissingFunctionError(err)) console.error(err);
    }
    if (activeUsername !== username) return;
    pointsState.loading = false;
    pointsState.loaded = true;
    renderPointsBadge();
    maybeToastNewPoints();
    if (writingEditor && writingEditor.isOpen()) writingEditor.refresh();
  }

  async function markStudentPointsSeen() {
    const user = getActiveUser();
    const sb = getSupabaseClient();
    if (!user || !sb) return;
    const unseen = pointsState.awards.some(function (a) {
      return !a.seen_at;
    });
    if (!unseen) return;
    pointsState.awards.forEach(function (a) {
      if (!a.seen_at) a.seen_at = new Date().toISOString();
    });
    renderPointsBadge();
    try {
      await sb.rpc("student_mark_points_seen", {
        p_username: activeUsername,
        p_password: String(user.password || ""),
      });
    } catch (err) {
      console.error(err);
    }
  }

  /* ---------- Student: corner badge ---------- */

  function readToasted() {
    try {
      return JSON.parse(localStorage.getItem(POINTS_TOAST_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function writeToasted(ids) {
    try {
      localStorage.setItem(POINTS_TOAST_KEY, JSON.stringify(ids.slice(-200)));
    } catch (e) {}
  }

  function awardLabel(a) {
    if (a.source === "writing") return I18n.t("points_from_writing");
    return I18n.t("points_from_teacher");
  }

  function ensurePointsBadge() {
    if (pointsBadge) return pointsBadge;
    const wrap = document.createElement("div");
    wrap.className = "pts hidden";
    wrap.innerHTML =
      '<div class="pts-pop hidden" role="dialog" aria-modal="false">' +
      '  <div class="pts-pop__head"><p class="pts-pop__title"></p><button type="button" class="pts-pop__close" aria-label="×">×</button></div>' +
      '  <p class="pts-pop__total"></p>' +
      '  <dl class="pts-pop__split"></dl>' +
      '  <p class="pts-pop__hist-title"></p>' +
      '  <ul class="pts-pop__list"></ul>' +
      "</div>" +
      '<div class="pts-toast hidden" role="status"></div>' +
      '<button type="button" class="pts-btn" aria-haspopup="dialog">' +
      '  <span class="pts-btn__star" aria-hidden="true">★</span>' +
      '  <span class="pts-btn__num">0</span>' +
      '  <span class="pts-btn__lab"></span>' +
      '  <span class="pts-btn__dot hidden" aria-hidden="true"></span>' +
      "</button>";
    document.body.appendChild(wrap);
    const el = {
      wrap: wrap,
      btn: wrap.querySelector(".pts-btn"),
      num: wrap.querySelector(".pts-btn__num"),
      lab: wrap.querySelector(".pts-btn__lab"),
      dot: wrap.querySelector(".pts-btn__dot"),
      pop: wrap.querySelector(".pts-pop"),
      title: wrap.querySelector(".pts-pop__title"),
      close: wrap.querySelector(".pts-pop__close"),
      total: wrap.querySelector(".pts-pop__total"),
      split: wrap.querySelector(".pts-pop__split"),
      histTitle: wrap.querySelector(".pts-pop__hist-title"),
      list: wrap.querySelector(".pts-pop__list"),
      toast: wrap.querySelector(".pts-toast"),
    };
    let toastTimer = null;

    function open() {
      hideToast();
      renderPointsBadge();
      el.pop.classList.remove("hidden");
      el.btn.setAttribute("aria-expanded", "true");
      void loadStudentPoints(true).then(markStudentPointsSeen);
    }
    function close() {
      el.pop.classList.add("hidden");
      el.btn.setAttribute("aria-expanded", "false");
    }
    function hideToast() {
      if (toastTimer) clearTimeout(toastTimer);
      el.toast.classList.add("hidden");
    }
    el.btn.addEventListener("click", function () {
      if (el.pop.classList.contains("hidden")) open();
      else close();
    });
    el.close.addEventListener("click", close);
    el.toast.addEventListener("click", open);
    document.addEventListener("click", function (e) {
      if (!el.pop.classList.contains("hidden") && !wrap.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el.pop.classList.contains("hidden")) close();
    });

    pointsBadge = {
      el: el,
      close: close,
      toast: function (text) {
        el.toast.textContent = text;
        el.toast.classList.remove("hidden");
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(hideToast, 7000);
      },
    };
    return pointsBadge;
  }

  function renderPointsBadge(opts) {
    const user = getActiveUser();
    const b = ensurePointsBadge();
    const el = b.el;
    if (!user) {
      el.wrap.classList.add("hidden");
      b.close();
      return;
    }
    const stats = ensureStats(user);
    const vocab = vocabPointsFromStats(stats);
    const teacher = pointsState.user === activeUsername ? teacherPointsTotal(pointsState.awards) : 0;
    const total = vocab + teacher;
    el.wrap.classList.remove("hidden");
    el.num.textContent = String(total);
    el.lab.textContent = Math.abs(total) === 1 ? I18n.t("points_word_one") : I18n.t("points_word");
    el.btn.setAttribute("aria-label", I18n.t("points_badge_aria", { n: String(total) }));
    const unseen = pointsState.awards.some(function (a) {
      return !a.seen_at;
    });
    el.dot.classList.toggle("hidden", !unseen);
    if (opts && opts.bump) playElementAnimation(el.btn, "pts-bump 0.4s ease");

    el.title.textContent = I18n.t("points_title");
    el.close.setAttribute("aria-label", I18n.t("writing_close"));
    el.total.textContent = formatPoints(total);
    el.split.innerHTML = "";
    [
      [I18n.t("points_split_vocab"), vocab],
      [I18n.t("points_split_teacher"), teacher],
    ].forEach(function (row) {
      const dt = document.createElement("dt");
      dt.textContent = row[0];
      const dd = document.createElement("dd");
      dd.textContent = String(row[1]);
      el.split.appendChild(dt);
      el.split.appendChild(dd);
    });
    el.histTitle.textContent = I18n.t("points_history_title");
    el.list.innerHTML = "";
    const recent = pointsState.awards.slice(0, 8);
    if (!recent.length) {
      const li = document.createElement("li");
      li.className = "pts-pop__empty";
      li.textContent = I18n.t("points_history_empty");
      el.list.appendChild(li);
    }
    recent.forEach(function (a) {
      const li = document.createElement("li");
      li.className = "pts-pop__item" + (a.seen_at ? "" : " is-new");
      const top = document.createElement("div");
      top.className = "pts-pop__item-top";
      const amt = document.createElement("strong");
      amt.className = "pts-pop__amt" + (a.points < 0 ? " is-neg" : "");
      amt.textContent = formatSignedPoints(a.points);
      const src = document.createElement("span");
      src.className = "pts-pop__src";
      src.textContent = awardLabel(a) + " · " + writingFormatDate(a.created_at);
      top.appendChild(amt);
      top.appendChild(src);
      li.appendChild(top);
      if (a.message) {
        const msg = document.createElement("p");
        msg.className = "pts-pop__msg";
        msg.textContent = a.message;
        li.appendChild(msg);
      }
      el.list.appendChild(li);
    });
  }

  function maybeToastNewPoints() {
    const unseen = pointsState.awards.filter(function (a) {
      return !a.seen_at;
    });
    if (!unseen.length) return;
    const toasted = readToasted();
    const fresh = unseen.filter(function (a) {
      return toasted.indexOf(a.id) < 0;
    });
    if (!fresh.length) return;
    writeToasted(toasted.concat(fresh.map(function (a) {
      return a.id;
    })));
    const sum = teacherPointsTotal(fresh);
    const first = fresh[0];
    const text =
      fresh.length === 1 && first.message
        ? I18n.t("points_toast_msg", { pts: formatSignedPoints(sum), msg: first.message })
        : I18n.t("points_toast", { pts: formatSignedPoints(sum) });
    ensurePointsBadge().toast(text);
  }

  function syncPointsForActiveUser() {
    if (pointsState.user !== activeUsername) {
      pointsState = { user: activeUsername || null, loading: false, loaded: false, awards: [] };
    }
    renderPointsBadge();
    if (activeUsername) void loadStudentPoints(false);
  }

  setInterval(function () {
    if (activeUsername && document.visibilityState === "visible") void loadStudentPoints(true);
  }, POINTS_REFRESH_MS);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && activeUsername) void loadStudentPoints(true);
  });

  /* ---------- Admin: points ---------- */

  async function fetchAdminPoints() {
    if (!adminUnlocked || adminPoints.loading) return;
    const sb = getSupabaseClient();
    if (!sb || !hasAdminApiSecret()) {
      adminPoints.loaded = true;
      adminPoints.error = I18n.t("admin_points_no_cloud");
      renderAdminPoints();
      return;
    }
    adminPoints.loading = true;
    try {
      const { data, error } = await sb.rpc("admin_list_points", { p_secret: adminWritingSecret() });
      if (error) throw error;
      adminPoints.awards = data || [];
      adminPoints.error = "";
    } catch (err) {
      console.error(err);
      adminPoints.error = isMissingFunctionError(err)
        ? I18n.t("admin_points_missing_sql")
        : I18n.t("admin_writing_failed", { err: (err && err.message) || String(err) });
    }
    adminPoints.loading = false;
    adminPoints.loaded = true;
    renderAdminPoints();
  }

  async function adminAwardPoints(username, points, message, submissionId) {
    const sb = getSupabaseClient();
    if (!sb || !hasAdminApiSecret()) throw new Error(I18n.t("admin_points_no_cloud"));
    const { error } = await sb.rpc("admin_award_points", {
      p_secret: adminWritingSecret(),
      p_username: username,
      p_points: points,
      p_message: message || "",
      p_submission_id: submissionId || null,
    });
    if (error) throw error;
  }

  function adminPointsRows() {
    const teacherBy = {};
    adminPoints.awards.forEach(function (a) {
      teacherBy[a.username] = (teacherBy[a.username] || 0) + (Number(a.points) || 0);
    });
    const names = {};
    Object.keys(users).forEach(function (u) {
      names[u] = true;
    });
    Object.keys(teacherBy).forEach(function (u) {
      names[u] = true;
    });
    return Object.keys(names)
      .map(function (u) {
        const usr = users[u];
        const vocab = usr ? vocabPointsFromStats(usr.stats || {}) : 0;
        const teacher = teacherBy[u] || 0;
        return {
          username: u,
          name: (usr && (usr.fullName || "").trim()) || u,
          vocab: vocab,
          teacher: teacher,
          total: vocab + teacher,
        };
      })
      .sort(function (a, b) {
        return b.total - a.total || a.name.localeCompare(b.name);
      });
  }

  function renderAdminPoints() {
    const host = document.getElementById("admin-points-content");
    if (!host || !adminUnlocked) return;
    const tab = document.getElementById("admin-points-tab");
    if (tab && tab.classList.contains("hidden")) return;
    const keep = {
      user: (host.querySelector(".admin-points-user") || {}).value,
      pts: (host.querySelector(".admin-points-amount") || {}).value,
      msg: (host.querySelector(".admin-points-msg") || {}).value,
    };
    host.innerHTML = "";
    const rows = adminPointsRows();

    // Send points
    const form = document.createElement("form");
    form.className = "account-card account-card--admin admin-points-form";
    const h = document.createElement("h3");
    h.textContent = I18n.t("admin_points_send_heading");
    form.appendChild(h);
    if (adminPoints.error) {
      const err = document.createElement("p");
      err.className = "form-error";
      err.textContent = adminPoints.error;
      form.appendChild(err);
    }
    const grid = document.createElement("div");
    grid.className = "admin-points-form__grid";
    const userLab = document.createElement("label");
    userLab.textContent = I18n.t("admin_points_student");
    const sel = document.createElement("select");
    sel.className = "admin-points-user";
    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = I18n.t("admin_points_choose");
    sel.appendChild(opt0);
    rows
      .slice()
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .forEach(function (r) {
        const o = document.createElement("option");
        o.value = r.username;
        o.textContent = r.name === r.username ? r.name : r.name + " (" + r.username + ")";
        sel.appendChild(o);
      });
    sel.value = keep.user || "";
    userLab.appendChild(sel);
    const ptsLab = document.createElement("label");
    ptsLab.textContent = I18n.t("admin_points_amount");
    const pts = document.createElement("input");
    pts.type = "number";
    pts.step = "1";
    pts.min = "-10000";
    pts.max = "10000";
    pts.className = "admin-points-amount";
    pts.value = keep.pts || "10";
    ptsLab.appendChild(pts);
    grid.appendChild(userLab);
    grid.appendChild(ptsLab);
    form.appendChild(grid);
    const msgLab = document.createElement("label");
    msgLab.className = "admin-points-msg-label";
    msgLab.textContent = I18n.t("admin_points_message");
    const msg = document.createElement("textarea");
    msg.className = "admin-points-msg";
    msg.rows = 3;
    msg.maxLength = 2000;
    msg.placeholder = I18n.t("admin_points_message_ph");
    msg.value = keep.msg || "";
    msgLab.appendChild(msg);
    form.appendChild(msgLab);
    const hint = document.createElement("p");
    hint.className = "field-hint";
    hint.textContent = I18n.t("admin_points_hint");
    form.appendChild(hint);
    const send = document.createElement("button");
    send.type = "submit";
    send.className = "btn-primary";
    send.textContent = I18n.t("admin_points_send");
    form.appendChild(send);
    const status = document.createElement("p");
    status.className = "field-hint admin-points-status";
    status.setAttribute("aria-live", "polite");
    status.textContent = adminPoints.flash || "";
    adminPoints.flash = "";
    form.appendChild(status);
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = sel.value;
      const n = Math.trunc(Number(pts.value));
      if (!username) {
        status.textContent = I18n.t("admin_points_need_student");
        return;
      }
      if (!n || !isFinite(n) || Math.abs(n) > 10000) {
        status.textContent = I18n.t("admin_points_need_amount");
        return;
      }
      const row = rows.find(function (r) {
        return r.username === username;
      });
      if (!window.confirm(I18n.t("admin_points_confirm", { pts: formatSignedPoints(n), name: row ? row.name : username }))) {
        return;
      }
      send.disabled = true;
      status.textContent = I18n.t("writing_saving");
      try {
        await adminAwardPoints(username, n, msg.value.trim(), null);
        msg.value = "";
        adminPoints.flash = I18n.t("admin_points_sent", { pts: formatSignedPoints(n), name: row ? row.name : username });
        await fetchAdminPoints();
      } catch (err) {
        console.error(err);
        status.textContent = I18n.t("admin_writing_failed", { err: (err && err.message) || String(err) });
        send.disabled = false;
      }
    });
    host.appendChild(form);

    // Everyone's points
    const card = document.createElement("div");
    card.className = "account-card account-card--admin";
    const h2 = document.createElement("h3");
    h2.textContent = I18n.t("admin_points_table_heading");
    card.appendChild(h2);
    if ((!adminPoints.loaded || adminStudentsLoading) && !rows.length) {
      const p = document.createElement("p");
      p.className = "field-hint";
      p.textContent = I18n.t("admin_writing_loading");
      card.appendChild(p);
    } else if (!rows.length) {
      const p = document.createElement("p");
      p.className = "field-hint";
      p.textContent = I18n.t("admin_writing_empty");
      card.appendChild(p);
    } else {
      const wrap = document.createElement("div");
      wrap.className = "admin-table-scroll";
      const table = document.createElement("table");
      table.className = "admin-table admin-points-table";
      const thead = document.createElement("thead");
      const htr = document.createElement("tr");
      ["admin_lb_col_rank", "admin_writing_col_student", "admin_points_col_vocab", "admin_points_col_teacher", "admin_points_col_total", "admin_col_actions"].forEach(function (k) {
        const th = document.createElement("th");
        th.textContent = I18n.t(k);
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      rows.forEach(function (r, i) {
        const tr = document.createElement("tr");
        [String(i + 1), r.name, String(r.vocab), String(r.teacher), String(r.total)].forEach(function (txt, ci) {
          const td = document.createElement("td");
          td.textContent = txt;
          if (ci === 4) td.className = "admin-points-table__total";
          if (ci === 1 && r.name !== r.username) {
            const small = document.createElement("span");
            small.className = "admin-points-table__user";
            small.textContent = r.username;
            td.appendChild(small);
          }
          tr.appendChild(td);
        });
        const act = document.createElement("td");
        const give = document.createElement("button");
        give.type = "button";
        give.className = "flashcard-btn";
        give.textContent = I18n.t("admin_points_give");
        give.addEventListener("click", function () {
          sel.value = r.username;
          form.scrollIntoView({ behavior: "smooth", block: "start" });
          pts.focus();
        });
        act.appendChild(give);
        tr.appendChild(act);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrap.appendChild(table);
      card.appendChild(wrap);
    }
    host.appendChild(card);

    // History
    const histCard = document.createElement("div");
    histCard.className = "account-card account-card--admin";
    const h3 = document.createElement("h3");
    h3.textContent = I18n.t("admin_points_history_heading");
    histCard.appendChild(h3);
    const awards = adminPoints.awards.slice(0, 40);
    if (!awards.length) {
      const p = document.createElement("p");
      p.className = "field-hint";
      p.textContent = adminPoints.loaded ? I18n.t("admin_writing_empty") : I18n.t("admin_writing_loading");
      histCard.appendChild(p);
    } else {
      const list = document.createElement("ul");
      list.className = "admin-points-history";
      awards.forEach(function (a) {
        const li = document.createElement("li");
        const usr = users[a.username];
        const who = (usr && (usr.fullName || "").trim()) || a.username;
        const top = document.createElement("div");
        top.className = "admin-points-history__top";
        const amt = document.createElement("strong");
        amt.className = "pts-pop__amt" + (a.points < 0 ? " is-neg" : "");
        amt.textContent = formatSignedPoints(a.points);
        const meta = document.createElement("span");
        meta.className = "admin-points-history__meta";
        meta.textContent =
          who + " · " + awardLabel(a) + " · " + writingFormatDate(a.created_at) + " · " +
          I18n.t(a.seen_at ? "admin_points_seen" : "admin_points_unseen");
        const del = document.createElement("button");
        del.type = "button";
        del.className = "btn-text admin-points-history__del";
        del.textContent = I18n.t("admin_points_undo");
        del.addEventListener("click", async function () {
          if (!window.confirm(I18n.t("admin_points_undo_confirm", { pts: formatSignedPoints(a.points), name: who }))) return;
          try {
            const { error } = await getSupabaseClient().rpc("admin_delete_points", {
              p_secret: adminWritingSecret(),
              p_id: a.id,
            });
            if (error) throw error;
            await fetchAdminPoints();
          } catch (err) {
            console.error(err);
            window.alert(I18n.t("admin_writing_failed", { err: (err && err.message) || String(err) }));
          }
        });
        top.appendChild(amt);
        top.appendChild(meta);
        top.appendChild(del);
        li.appendChild(top);
        if (a.message) {
          const m = document.createElement("p");
          m.className = "admin-points-history__msg";
          m.textContent = a.message;
          li.appendChild(m);
        }
        list.appendChild(li);
      });
      histCard.appendChild(list);
    }
    host.appendChild(histCard);
  }

  /* ------------------------------------------------------------------
   * Vocabulary: stepping-stone path.
   * Every word of the level (from its flashcard decks) is one stone, ordered
   * from easiest to hardest. A correct answer moves the student on; a wrong
   * answer sends the word to the back of the line. Answering every word once
   * completes the lap (the section turns green); the next lap repeats them.
   * ------------------------------------------------------------------ */

  const VOCAB_PATH_SESSION_SIZE = 20;
  const VOCAB_PATH_WINDOW_BEFORE = 3;
  const VOCAB_PATH_WINDOW_AFTER = 5;
  const vocabBankCache = {};
  const vocabGuestState = {};
  const vocabStreakBumped = {};

  function vocabNormalize(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\([^)]*\)/g, " ")
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function vocabSimilarity(a, b) {
    const x = vocabNormalize(a);
    const y = vocabNormalize(b);
    if (!x.length || !y.length) return 0;
    if (x === y) return 1;
    let prev = [];
    for (let j = 0; j <= y.length; j += 1) prev.push(j);
    for (let i = 1; i <= x.length; i += 1) {
      const cur = [i];
      for (let j = 1; j <= y.length; j += 1) {
        cur.push(
          Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1))
        );
      }
      prev = cur;
    }
    return 1 - prev[y.length] / Math.max(x.length, y.length);
  }

  /** Small deterministic hash so a word keeps the same question style within a lap. */
  function vocabHash(s) {
    let h = 2166136261;
    const str = String(s);
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
  }

  function buildVocabBank(level) {
    if (vocabBankCache[level]) return vocabBankCache[level];
    const decks = (learningData[level] && learningData[level].flashcards) || {};
    const words = [];
    const byKey = {};
    Object.keys(decks).forEach(function (deckName, deckIndex) {
      if (deckName === "Master 1000" || deckName === IRREGULAR_DECK_NAME) return;
      (decks[deckName] || []).forEach(function (card, idx) {
        if (!card || !card.front || !card.back) return;
        const en = String(card.front).trim();
        const fr = String(card.back).trim();
        const key = vocabNormalize(en);
        if (!key || byKey[key]) return;
        // Identical in both languages (e.g. "Menu" = "Menu") – nothing to learn.
        if (key === vocabNormalize(fr)) return;
        const wordCount = en.split(/\s+/).length;
        const sim = vocabSimilarity(en, fr);
        // Short, single words and French look-alikes first; long phrases last.
        const score = en.length * (1 - 0.6 * sim) + 4 * (wordCount - 1) + deckIndex * 0.8 + idx * 0.01;
        const w = { key: key, en: en, fr: fr, deck: deckName, len: en.length, score: score };
        byKey[key] = w;
        words.push(w);
      });
    });
    const order = words
      .slice()
      .sort(function (a, b) {
        return a.score - b.score;
      })
      .map(function (w) {
        return w.key;
      });
    const rank = {};
    order.forEach(function (k, i) {
      rank[k] = i;
    });
    const bank = {
      words: words,
      byKey: byKey,
      order: order,
      rank: rank,
      sig: order.length + "|" + (order[0] || "") + "|" + (order[order.length - 1] || ""),
    };
    vocabBankCache[level] = bank;
    return bank;
  }

  function freshVocabPathState(bank) {
    return {
      v: 1,
      sig: bank.sig,
      lap: 1,
      pos: 0,
      back: [],
      correct: 0,
      wrong: 0,
      lapDone: false,
      completedLaps: 0,
      completedAt: "",
      answered: 0,
      sessionCorrect: 0,
      sessionAnswered: 0,
    };
  }

  function getVocabPathState(level) {
    const bank = buildVocabBank(level);
    const user = getActiveUser();
    let holder;
    if (user) {
      const lh = ensureLearningHub(ensureStats(user));
      if (!lh.vocabPath || typeof lh.vocabPath !== "object") lh.vocabPath = {};
      holder = lh.vocabPath;
    } else {
      holder = vocabGuestState;
    }
    let st = holder[level];
    if (!st || st.v !== 1) {
      st = freshVocabPathState(bank);
      holder[level] = st;
    }
    if (st.sig !== bank.sig) {
      // The word list changed since this was saved: keep progress, drop words that no longer exist.
      st.sig = bank.sig;
      st.pos = Math.min(st.pos || 0, bank.order.length);
      st.back = (st.back || []).filter(function (k) {
        return !!bank.byKey[k];
      });
      st.correct = Math.min(st.correct || 0, bank.order.length);
    }
    if (!Array.isArray(st.back)) st.back = [];
    return st;
  }

  function vocabPathCompleted(level) {
    const user = getActiveUser();
    if (!user) return false;
    const lh = ensureLearningHub(ensureStats(user));
    const st = lh.vocabPath && lh.vocabPath[level];
    return !!(st && st.completedLaps > 0);
  }

  function vocabPathProgress(level) {
    const user = getActiveUser();
    if (!user) return null;
    const lh = ensureLearningHub(ensureStats(user));
    const st = lh.vocabPath && lh.vocabPath[level];
    const total = buildVocabBank(level).order.length;
    return {
      correct: st ? st.correct || 0 : 0,
      total: total,
      completed: !!(st && st.completedLaps > 0),
      lap: st ? st.lap || 1 : 1,
    };
  }

  function vocabPathHeadKey(st, bank) {
    if (st.pos < bank.order.length) return { key: bank.order[st.pos], from: "main" };
    if (st.back.length) return { key: st.back[0], from: "back" };
    return null;
  }

  /** 0 → very first stone, 1 → hardest word of the level. */
  function vocabDifficulty(bank, key) {
    const n = bank.order.length;
    if (n < 2) return 0;
    return (bank.rank[key] || 0) / (n - 1);
  }

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }

  function buildVocabPathQuestion(bank, key, lap) {
    const word = bank.byKey[key];
    const t = vocabDifficulty(bank, key);
    // Early on: see the English, pick the French. Gradually more "say it in English".
    const toEnglish = vocabHash(key + "|" + lap) < 0.15 + 0.6 * t;
    const answerField = toEnglish ? "en" : "fr";
    const optionCount = t < 0.12 ? 3 : 4;

    // Never offer another word that has the same French meaning (e.g. "Entrée" = Entrance and Starter),
    // or there would be two right answers.
    const sameMeaning = vocabNormalize(word.fr);
    let pool = bank.words.filter(function (w) {
      return w.key !== key && vocabNormalize(w.fr) !== sameMeaning;
    });
    if (t >= 0.33) {
      const sameDeck = pool.filter(function (w) {
        return w.deck === word.deck;
      });
      if (sameDeck.length >= 6) pool = sameDeck;
    }
    if (t >= 0.66) {
      pool = pool
        .slice()
        .sort(function (a, b) {
          return Math.abs(a.len - word.len) - Math.abs(b.len - word.len);
        })
        .slice(0, 10);
    }
    pool = shuffleInPlace(pool.slice());

    const answer = word[answerField];
    const seen = {};
    seen[vocabNormalize(answer)] = true;
    const options = [answer];
    for (let i = 0; i < pool.length && options.length < optionCount; i += 1) {
      const text = pool[i][answerField];
      const norm = vocabNormalize(text);
      if (!norm || seen[norm]) continue;
      seen[norm] = true;
      options.push(text);
    }
    return {
      key: key,
      word: word,
      toEnglish: toEnglish,
      prompt: toEnglish ? word.fr : word.en,
      answer: answer,
      options: shuffleInPlace(options),
      difficulty: t,
    };
  }

  function vocabDifficultyStep(t) {
    return Math.min(5, 1 + Math.floor(t * 5));
  }

  /** Builds the whole Vocabulary panel for one level. Returns a render() to refresh on login/logout. */
  function mountVocabPath(root, level, panel, onLevelProgressChange) {
    const bank = buildVocabBank(level);
    const total = bank.order.length;

    panel.innerHTML = "";
    const shell = document.createElement("div");
    shell.className = "lh-vocab vp";

    const header = document.createElement("div");
    header.className = "lh-vocab__header";
    const stBox = document.createElement("div");
    stBox.className = "lh-chip lh-chip--streak";
    stBox.innerHTML =
      '<span class="lh-chip__lab">' +
      I18n.t("learning_hub_streak") +
      '</span> <span class="lh-vocab__streak-val">0</span>';
    header.appendChild(stBox);
    shell.appendChild(header);

    const card = document.createElement("section");
    card.className = "vp-card";
    card.innerHTML =
      '<div class="vp-top">' +
      '  <div class="vp-top__text">' +
      '    <h3 class="vp-title"></h3>' +
      '    <p class="vp-meta"></p>' +
      "  </div>" +
      '  <div class="vp-level" aria-hidden="true"></div>' +
      "</div>" +
      '<div class="vp-bar"><div class="vp-bar__fill"></div></div>' +
      '<div class="vp-river" aria-hidden="true"><div class="vp-stones"></div></div>' +
      '<p class="vp-pending hidden"></p>' +
      '<div class="vp-play">' +
      '  <p class="vp-instruction"></p>' +
      '  <p class="vp-word"></p>' +
      '  <div class="vp-options" role="group"></div>' +
      '  <p class="vp-feedback" aria-live="polite"></p>' +
      '  <button type="button" class="btn-primary vp-continue hidden"></button>' +
      "</div>" +
      '<div class="vp-done hidden">' +
      '  <p class="vp-done__badge"></p>' +
      '  <h3 class="vp-done__title"></h3>' +
      '  <p class="vp-done__text"></p>' +
      '  <button type="button" class="btn-primary vp-next-lap"></button>' +
      "</div>" +
      '<p class="vp-foot"></p>';
    shell.appendChild(card);
    panel.appendChild(shell);

    const el = {
      title: card.querySelector(".vp-title"),
      meta: card.querySelector(".vp-meta"),
      level: card.querySelector(".vp-level"),
      barFill: card.querySelector(".vp-bar__fill"),
      stones: card.querySelector(".vp-stones"),
      pending: card.querySelector(".vp-pending"),
      play: card.querySelector(".vp-play"),
      instruction: card.querySelector(".vp-instruction"),
      word: card.querySelector(".vp-word"),
      options: card.querySelector(".vp-options"),
      feedback: card.querySelector(".vp-feedback"),
      cont: card.querySelector(".vp-continue"),
      done: card.querySelector(".vp-done"),
      doneBadge: card.querySelector(".vp-done__badge"),
      doneTitle: card.querySelector(".vp-done__title"),
      doneText: card.querySelector(".vp-done__text"),
      nextLap: card.querySelector(".vp-next-lap"),
      foot: card.querySelector(".vp-foot"),
    };

    let current = null; // question on screen
    let answered = false;
    let busy = false;

    function refreshStreakChip() {
      const user = getActiveUser();
      const v = stBox.querySelector(".lh-vocab__streak-val");
      if (!v) return;
      v.textContent = user ? String(ensureLearningHub(ensureStats(user)).streak || 0) : "0";
    }

    function renderStones(st, hop) {
      el.stones.innerHTML = "";
      const here = st.lapDone ? total : st.correct;
      const from = Math.max(0, here - VOCAB_PATH_WINDOW_BEFORE);
      const to = Math.min(total, here + VOCAB_PATH_WINDOW_AFTER);
      for (let i = from; i <= to; i += 1) {
        const stone = document.createElement("div");
        let cls = "vp-stone";
        if (i < here) cls += " is-crossed";
        else if (i === here) cls += " is-here";
        if (i === total) cls += " is-goal";
        stone.className = cls;
        const num = document.createElement("span");
        num.className = "vp-stone__num";
        num.textContent = i === total ? "🏁" : String(i + 1);
        stone.appendChild(num);
        if (i === here) {
          const me = document.createElement("span");
          me.className = "vp-me" + (hop ? " is-landing" : "");
          stone.appendChild(me);
        }
        el.stones.appendChild(stone);
      }
    }

    function renderHeader(st) {
      el.title.textContent = I18n.t("vocab_path_title");
      const shown = Math.min(st.correct + (st.lapDone ? 0 : 1), total);
      el.meta.textContent =
        (st.lapDone
          ? I18n.t("vocab_path_meta_done", { t: String(total) })
          : I18n.t("vocab_path_meta", { n: String(shown), t: String(total) })) +
        " · " +
        I18n.t("vocab_path_lap", { n: String(st.lap) });
      el.barFill.style.width = (total ? Math.round((st.correct / total) * 100) : 0) + "%";
      el.pending.classList.toggle("hidden", !st.back.length || st.lapDone);
      el.pending.textContent =
        st.back.length === 1
          ? I18n.t("vocab_path_pending_one")
          : I18n.t("vocab_path_pending", { n: String(st.back.length) });
      card.classList.toggle("is-complete", st.completedLaps > 0);
      el.foot.textContent = getActiveUser()
        ? I18n.t("vocab_path_autosave")
        : I18n.t("vocab_path_guest");
    }

    function renderLevelDots(t) {
      const step = vocabDifficultyStep(t);
      el.level.innerHTML = "";
      const lab = document.createElement("span");
      lab.className = "vp-level__lab";
      lab.textContent = I18n.t("vocab_path_difficulty");
      el.level.appendChild(lab);
      for (let i = 1; i <= 5; i += 1) {
        const d = document.createElement("span");
        d.className = "vp-level__dot" + (i <= step ? " is-on" : "");
        el.level.appendChild(d);
      }
    }

    function showDone(st) {
      current = null;
      el.play.classList.add("hidden");
      el.done.classList.remove("hidden");
      el.doneBadge.textContent = I18n.t("vocab_path_done_badge");
      el.doneTitle.textContent = I18n.t("vocab_path_done_title", { t: String(total) });
      el.doneText.textContent = I18n.t("vocab_path_done_text");
      el.nextLap.textContent = I18n.t("vocab_path_next_lap", { n: String(st.lap + 1) });
      renderLevelDots(1);
    }

    function render(opts) {
      const st = getVocabPathState(level);
      refreshStreakChip();
      renderHeader(st);
      renderStones(st, opts && opts.hop);
      if (!total) {
        el.play.classList.add("hidden");
        el.done.classList.add("hidden");
        return;
      }
      if (st.lapDone) {
        showDone(st);
        return;
      }
      el.done.classList.add("hidden");
      el.play.classList.remove("hidden");
      const head = vocabPathHeadKey(st, bank);
      if (!head) return;
      current = buildVocabPathQuestion(bank, head.key, st.lap);
      current.from = head.from;
      answered = false;
      busy = false;
      renderLevelDots(current.difficulty);
      el.instruction.textContent = I18n.t(
        current.toEnglish ? "vocab_path_ask_en" : "vocab_path_ask_fr"
      );
      el.word.textContent = current.prompt;
      el.word.classList.toggle("is-review", head.from === "back");
      el.feedback.textContent =
        head.from === "back" ? I18n.t("vocab_path_review_hint") : "";
      el.feedback.className = "vp-feedback";
      el.cont.classList.add("hidden");
      el.options.innerHTML = "";
      current.options.forEach(function (opt, i) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "vp-option";
        const k = document.createElement("span");
        k.className = "vp-option__key";
        k.textContent = String(i + 1);
        const tx = document.createElement("span");
        tx.className = "vp-option__text";
        tx.textContent = opt;
        b.appendChild(k);
        b.appendChild(tx);
        b.addEventListener("click", function () {
          choose(opt, b);
        });
        el.options.appendChild(b);
      });
    }

    function recordProgressSession(st) {
      if (st.sessionAnswered < VOCAB_PATH_SESSION_SIZE) return;
      const c = st.sessionCorrect;
      const n = st.sessionAnswered;
      st.sessionCorrect = 0;
      st.sessionAnswered = 0;
      recordQuizSummary(level, "path", c, n);
    }

    function trackTopic(deck, ok) {
      const user = getActiveUser();
      if (!user) return;
      const lh = ensureLearningHub(ensureStats(user));
      if (!lh.vocabTopic[deck]) lh.vocabTopic[deck] = { c: 0, w: 0 };
      if (ok) lh.vocabTopic[deck].c += 1;
      else lh.vocabTopic[deck].w += 1;
    }

    function choose(opt, btn) {
      if (answered || !current) return;
      answered = true;
      haptic(4);
      const st = getVocabPathState(level);
      const ok = vocabNormalize(opt) === vocabNormalize(current.answer);
      const user = getActiveUser();
      if (user && !vocabStreakBumped[level + "|" + activeUsername]) {
        vocabStreakBumped[level + "|" + activeUsername] = true;
        bumpLearningStreak(level);
      }

      Array.from(el.options.querySelectorAll(".vp-option")).forEach(function (b) {
        b.disabled = true;
        const text = b.querySelector(".vp-option__text").textContent;
        if (vocabNormalize(text) === vocabNormalize(current.answer)) b.classList.add("is-correct");
      });

      st.answered = (st.answered || 0) + 1;
      st.sessionAnswered = (st.sessionAnswered || 0) + 1;
      trackTopic(current.word.deck, ok);

      if (ok) {
        addVocabPoint();
        if (current.from === "main") st.pos += 1;
        else st.back.shift();
        st.correct += 1;
        st.sessionCorrect = (st.sessionCorrect || 0) + 1;
        playElementAnimation(btn, "answer-correct-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)");
        el.feedback.textContent = I18n.t("vocab_path_correct");
        el.feedback.className = "vp-feedback vp-feedback--ok";
        let finishedLap = false;
        if (st.pos >= total && !st.back.length) {
          finishedLap = true;
          st.lapDone = true;
          st.completedLaps = (st.completedLaps || 0) + 1;
          if (!st.completedAt) st.completedAt = new Date().toISOString();
        }
        recordProgressSession(st);
        if (user) saveUsers();
        busy = true;
        setTimeout(function () {
          render({ hop: true });
          if (finishedLap) {
            celebrateVocabLap(card);
            if (onLevelProgressChange) onLevelProgressChange();
          }
        }, 650);
      } else {
        btn.classList.add("is-wrong");
        playElementAnimation(btn, "shake 0.35s ease");
        if (current.from === "main") {
          st.pos += 1;
          st.back.push(current.key);
        } else {
          st.back.push(st.back.shift());
        }
        st.wrong = (st.wrong || 0) + 1;
        if (user) {
          const lh = ensureLearningHub(ensureStats(user));
          lh.savedWords = lh.savedWords || [];
          lh.savedWords.push({
            q: current.prompt,
            a: current.answer,
            topic: current.word.deck,
            at: new Date().toISOString(),
          });
          if (lh.savedWords.length > 24) lh.savedWords = lh.savedWords.slice(-24);
        }
        recordProgressSession(st);
        if (user) saveUsers();
        el.feedback.textContent = I18n.t("vocab_path_wrong", {
          prompt: current.prompt,
          answer: current.answer,
        });
        el.feedback.className = "vp-feedback vp-feedback--wrong";
        el.cont.textContent = I18n.t("vocab_path_continue");
        el.cont.classList.remove("hidden");
        el.cont.focus();
        renderHeader(st);
      }
    }

    el.cont.addEventListener("click", function () {
      render();
    });

    el.nextLap.addEventListener("click", function () {
      const st = getVocabPathState(level);
      st.lap = (st.lap || 1) + 1;
      st.pos = 0;
      st.back = [];
      st.correct = 0;
      st.wrong = 0;
      st.lapDone = false;
      if (getActiveUser()) saveUsers();
      render();
    });

    // Number keys pick an answer, Enter continues — only while this panel is on screen.
    document.addEventListener("keydown", function (e) {
      if (panel.classList.contains("hidden") || !panel.offsetParent) return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target && e.target.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!answered && current && /^[1-4]$/.test(e.key)) {
        const btns = el.options.querySelectorAll(".vp-option");
        const b = btns[Number(e.key) - 1];
        if (b) {
          e.preventDefault();
          b.click();
        }
      } else if (e.key === "Enter" && !el.cont.classList.contains("hidden") && document.activeElement !== el.cont) {
        e.preventDefault();
        el.cont.click();
      }
    });

    window.addEventListener("andronicus:streakchange", function (ev) {
      if (ev.detail && ev.detail.level === level) refreshStreakChip();
    });

    render();
    return {
      render: function () {
        if (busy) return;
        render();
      },
    };
  }

  function celebrateVocabLap(container) {
    const overlay = document.createElement("div");
    overlay.className = "streak-celebration";
    for (let i = 0; i < 28; i += 1) {
      const particle = document.createElement("span");
      particle.className = "confetti-particle";
      particle.style.left = 5 + Math.random() * 90 + "%";
      particle.style.animationDelay = Math.random() * 0.6 + "s";
      particle.style.background =
        STREAK_CONFETTI_COLORS[Math.floor(Math.random() * STREAK_CONFETTI_COLORS.length)];
      overlay.appendChild(particle);
    }
    const emoji = document.createElement("div");
    emoji.className = "streak-celebration__emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = "🏁";
    const heading = document.createElement("h2");
    heading.textContent = I18n.t("vocab_path_celebrate");
    overlay.appendChild(emoji);
    overlay.appendChild(heading);
    document.body.appendChild(overlay);
    haptic([6, 30, 6, 30, 6]);
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 2800);
    if (container && container.scrollIntoView) container.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ------------------------------------------------------------------
   * Writing homework: students type answers, the teacher corrects them.
   * Stored in Supabase table writing_submissions (see supabase/migrations).
   * ------------------------------------------------------------------ */

  const WRITING_LOCAL_PREFIX = "andronicus_writing_draft_v1|";
  /** Largest single insertion we accept from the keyboard (predictive text inserts whole words). */
  const WRITING_MAX_KEYBOARD_INSERT = 24;


  function writingLevelLabel(level) {
    const key = "level_" + String(level || "");
    const label = I18n.t(key);
    return label === key ? String(level || "") : label;
  }

  function writingTaskText(item) {
    if (!item) return "";
    return I18n.getLang() === "fr" && item.fr ? item.fr : item.en || item.fr || "";
  }

  function writingWordCount(text) {
    const words = String(text || "").trim().split(/\s+/).filter(Boolean);
    return words.length;
  }

  function writingWordsLabel(n) {
    return n === 1 ? I18n.t("writing_words_one") : I18n.t("writing_words", { n: String(n) });
  }

  function writingFormatDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString(I18n.getLang() === "fr" ? "fr-FR" : "en-IE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return String(iso);
    }
  }

  function escapeHtmlText(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function plainTextToCorrectionHtml(text) {
    return escapeHtmlText(text).replace(/\r\n?/g, "\n").replace(/\n/g, "<br>");
  }

  /**
   * Keep only text, line breaks and the two correction marks. Everything else is unwrapped,
   * so student text or anything pasted into the teacher editor can never become live HTML.
   */
  function sanitizeCorrectionHtml(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = String(html || "");
    const out = document.createElement("div");

    function lastIsBreak(parent) {
      const last = parent.lastChild;
      return !last || (last.nodeType === 1 && last.tagName === "BR");
    }

    function walk(src, parent) {
      Array.prototype.forEach.call(src.childNodes, function (child) {
        if (child.nodeType === 3) {
          parent.appendChild(document.createTextNode(child.nodeValue));
          return;
        }
        if (child.nodeType !== 1) return;
        const tag = child.tagName.toLowerCase();
        if (tag === "script" || tag === "style" || tag === "template") return;
        if (tag === "br") {
          parent.appendChild(document.createElement("br"));
          return;
        }
        if (tag === "span" && (child.classList.contains("wc-err") || child.classList.contains("wc-fix"))) {
          const span = document.createElement("span");
          span.className = child.classList.contains("wc-err") ? "wc-err" : "wc-fix";
          walk(child, span);
          if (span.childNodes.length) parent.appendChild(span);
          return;
        }
        if (tag === "div" || tag === "p") {
          if (!lastIsBreak(parent)) parent.appendChild(document.createElement("br"));
          walk(child, parent);
          return;
        }
        walk(child, parent);
      });
    }

    walk(tpl.content, out);
    return out.innerHTML;
  }

  function buildCorrectionLegend() {
    const legend = document.createElement("p");
    legend.className = "wr-legend";
    const err = document.createElement("span");
    err.className = "wc-err";
    err.textContent = I18n.t("writing_legend_err");
    const fix = document.createElement("span");
    fix.className = "wc-fix";
    fix.textContent = I18n.t("writing_legend_fix");
    legend.appendChild(err);
    legend.appendChild(document.createTextNode("  "));
    legend.appendChild(fix);
    return legend;
  }

  /* ---------- Student data ---------- */

  function writingLocalKey(username, taskId) {
    return WRITING_LOCAL_PREFIX + username + "|" + taskId;
  }

  function readWritingLocal(username, taskId) {
    try {
      const raw = localStorage.getItem(writingLocalKey(username, taskId));
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed.text === "string" ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function writeWritingLocal(username, taskId, text) {
    try {
      localStorage.setItem(
        writingLocalKey(username, taskId),
        JSON.stringify({ text: String(text || ""), at: new Date().toISOString() })
      );
    } catch (e) {}
  }

  function clearWritingLocal(username, taskId) {
    try {
      localStorage.removeItem(writingLocalKey(username, taskId));
    } catch (e) {}
  }

  function writingAttemptsFor(taskId) {
    if (!activeUsername || writingState.user !== activeUsername) return [];
    return writingState.byTask[taskId] || [];
  }

  function writingTaskSummary(taskId) {
    const attempts = writingAttemptsFor(taskId);
    let draft = null;
    let lastSent = null;
    attempts.forEach(function (a) {
      if (a.status === "draft") draft = a;
      else lastSent = a;
    });
    return { attempts: attempts, draft: draft, lastSent: lastSent };
  }

  async function loadStudentWriting(force) {
    const user = getActiveUser();
    if (!user || !activeUsername) {
      writingState = { user: null, loading: false, loaded: false, error: "", byTask: {} };
      return;
    }
    if (
      !force &&
      writingState.user === activeUsername &&
      (writingState.loaded || writingState.loading)
    ) {
      return;
    }
    const username = activeUsername;
    if (writingState.user !== username) {
      writingState = { user: username, loading: false, loaded: false, error: "", byTask: {} };
    }
    if (!isSupabaseConfigured() || !getSupabaseClient()) {
      writingState.loaded = true;
      writingState.error = "offline";
      return;
    }
    writingState.loading = true;
    try {
      const { data, error } = await getSupabaseClient().rpc("student_list_writing", {
        p_username: username,
        p_password: String(user.password || ""),
      });
      if (error) throw error;
      if (activeUsername !== username) return;
      const byTask = {};
      (data || []).forEach(function (row) {
        if (!byTask[row.task_id]) byTask[row.task_id] = [];
        byTask[row.task_id].push(row);
      });
      Object.keys(byTask).forEach(function (k) {
        byTask[k].sort(function (a, b) {
          return a.attempt - b.attempt;
        });
      });
      writingState.byTask = byTask;
      writingState.error = "";
    } catch (err) {
      console.error(err);
      if (activeUsername === username) writingState.error = "load";
    }
    if (activeUsername !== username) return;
    writingState.loading = false;
    writingState.loaded = true;
    refreshAllHomeworkPanels();
    if (writingEditor && writingEditor.isOpen()) writingEditor.refresh();
  }

  async function saveStudentWriting(level, item, text, submit) {
    const user = getActiveUser();
    if (!user || !activeUsername) throw new Error("signin");
    if (!isSupabaseConfigured() || !getSupabaseClient()) throw new Error("offline");
    const { data, error } = await getSupabaseClient().rpc("student_save_writing", {
      p_username: activeUsername,
      p_password: String(user.password || ""),
      p_level: level,
      p_task_id: item.id,
      p_task_text: item.en || item.fr || "",
      p_body: text,
      p_submit: !!submit,
    });
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }

  /** Extra row under each Writing homework item: status badge + open button. */
  function buildWritingHomeworkRow(level, item) {
    const row = document.createElement("div");
    row.className = "lh-writing-row";
    const user = getActiveUser();
    const summary = writingTaskSummary(item.id);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lh-writing-row__btn";
    btn.disabled = !user;
    if (summary.draft) btn.textContent = I18n.t("writing_btn_continue");
    else if (summary.lastSent) btn.textContent = I18n.t("writing_btn_open");
    else btn.textContent = I18n.t("writing_btn_start");
    btn.addEventListener("click", function () {
      openWritingEditor(level, item);
    });
    row.appendChild(btn);

    let badgeKey = "";
    let badgeMod = "";
    if (summary.draft) {
      badgeKey = "writing_badge_draft";
      badgeMod = "draft";
    } else if (summary.lastSent && summary.lastSent.status === "corrected") {
      badgeKey = "writing_badge_corrected";
      badgeMod = "corrected";
    } else if (summary.lastSent) {
      badgeKey = "writing_badge_submitted";
      badgeMod = "submitted";
    }
    if (badgeKey) {
      const badge = document.createElement("span");
      badge.className = "lh-writing-row__badge lh-writing-row__badge--" + badgeMod;
      badge.textContent = I18n.t(badgeKey);
      row.appendChild(badge);
    }
    if (!user) {
      const hint = document.createElement("span");
      hint.className = "lh-writing-row__hint";
      hint.textContent = I18n.t("writing_signin");
      row.appendChild(hint);
    }
    return row;
  }

  /* ---------- Paste protection ---------- */

  function guardAgainstPaste(textarea, onBlocked) {
    const blockedTypes = {
      insertFromPaste: 1,
      insertFromPasteAsQuotation: 1,
      insertFromDrop: 1,
      insertFromYank: 1,
      insertReplacementText: 1,
    };
    let lastValue = textarea.value;
    let lastSelStart = textarea.selectionStart;
    let lastSelEnd = textarea.selectionEnd;

    function remember() {
      lastValue = textarea.value;
      lastSelStart = textarea.selectionStart;
      lastSelEnd = textarea.selectionEnd;
    }

    textarea.addEventListener("paste", function (e) {
      e.preventDefault();
      onBlocked();
    });
    textarea.addEventListener("drop", function (e) {
      e.preventDefault();
      onBlocked();
    });
    textarea.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    textarea.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
    textarea.addEventListener("beforeinput", function (e) {
      if (blockedTypes[e.inputType]) {
        e.preventDefault();
        onBlocked();
        return;
      }
      remember();
    });
    textarea.addEventListener("keydown", remember);
    // Safety net for browsers or extensions that slip text in without a paste event.
    textarea.addEventListener("input", function (e) {
      const grew = textarea.value.length - lastValue.length + (lastSelEnd - lastSelStart);
      const isTyping =
        !e.inputType || e.inputType === "insertText" || e.inputType === "insertCompositionText";
      if (grew > WRITING_MAX_KEYBOARD_INSERT && (isTyping || blockedTypes[e.inputType] || e.inputType === "insertFromPaste")) {
        textarea.value = lastValue;
        try {
          textarea.setSelectionRange(lastSelStart, lastSelStart);
        } catch (err) {}
        onBlocked();
        return;
      }
      remember();
    });
    return { reset: remember };
  }

  /* ---------- Student editor overlay ---------- */

  function createWritingEditor() {
    const overlay = document.createElement("div");
    overlay.className = "wr-overlay hidden";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<div class="wr-shell">' +
      '  <header class="wr-top">' +
      '    <div class="wr-top__text">' +
      '      <p class="wr-kicker"></p>' +
      '      <h2 class="wr-task" id="wr-task-title"></h2>' +
      "    </div>" +
      '    <button type="button" class="wr-close"></button>' +
      "  </header>" +
      '  <p class="wr-banner hidden" role="status"></p>' +
      '  <section class="wr-history hidden">' +
      '    <h3 class="wr-history__title"></h3>' +
      '    <div class="wr-history__list"></div>' +
      "  </section>" +
      '  <section class="wr-waiting hidden">' +
      '    <p class="wr-waiting__title"></p>' +
      '    <p class="wr-waiting__text"></p>' +
      '    <button type="button" class="btn-primary wr-new-attempt"></button>' +
      "  </section>" +
      '  <section class="wr-compose hidden">' +
      '    <div class="wr-compose__head">' +
      '      <span class="wr-attempt"></span>' +
      '      <span class="wr-count"></span>' +
      "    </div>" +
      '    <textarea class="wr-paper" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" aria-labelledby="wr-task-title"></textarea>' +
      '    <p class="wr-hint"></p>' +
      '    <p class="wr-msg" aria-live="polite"></p>' +
      '    <div class="wr-actions">' +
      '      <button type="button" class="flashcard-btn wr-save"></button>' +
      '      <button type="button" class="btn-primary wr-submit"></button>' +
      "    </div>" +
      "  </section>" +
      "</div>";
    document.body.appendChild(overlay);

    const el = {
      kicker: overlay.querySelector(".wr-kicker"),
      task: overlay.querySelector(".wr-task"),
      close: overlay.querySelector(".wr-close"),
      banner: overlay.querySelector(".wr-banner"),
      history: overlay.querySelector(".wr-history"),
      historyTitle: overlay.querySelector(".wr-history__title"),
      historyList: overlay.querySelector(".wr-history__list"),
      waiting: overlay.querySelector(".wr-waiting"),
      waitingTitle: overlay.querySelector(".wr-waiting__title"),
      waitingText: overlay.querySelector(".wr-waiting__text"),
      newAttempt: overlay.querySelector(".wr-new-attempt"),
      compose: overlay.querySelector(".wr-compose"),
      attempt: overlay.querySelector(".wr-attempt"),
      count: overlay.querySelector(".wr-count"),
      paper: overlay.querySelector(".wr-paper"),
      hint: overlay.querySelector(".wr-hint"),
      msg: overlay.querySelector(".wr-msg"),
      save: overlay.querySelector(".wr-save"),
      submit: overlay.querySelector(".wr-submit"),
    };

    let ctx = null; // { level, item, username, composing, dirty, busy }
    let autosaveTimer = null;
    let msgTimer = null;

    function setMsg(text, kind) {
      if (msgTimer) clearTimeout(msgTimer);
      el.msg.textContent = text || "";
      el.msg.className = "wr-msg" + (kind ? " wr-msg--" + kind : "");
    }

    const pasteGuard = guardAgainstPaste(el.paper, function () {
      setMsg(I18n.t("writing_paste_blocked"), "warn");
      msgTimer = setTimeout(function () {
        if (el.msg.classList.contains("wr-msg--warn")) setMsg("");
      }, 3500);
    });

    function updateCount() {
      el.count.textContent = writingWordsLabel(writingWordCount(el.paper.value));
    }

    function nextAttemptNumber(summary) {
      if (summary.draft) return summary.draft.attempt;
      let max = 0;
      summary.attempts.forEach(function (a) {
        if (a.attempt > max) max = a.attempt;
      });
      return max + 1;
    }

    function renderHistory(summary) {
      const sent = summary.attempts.filter(function (a) {
        return a.status !== "draft";
      });
      el.historyList.innerHTML = "";
      el.history.classList.toggle("hidden", sent.length === 0);
      if (!sent.length) return;
      el.historyTitle.textContent = I18n.t("writing_history_title");
      const newest = sent[sent.length - 1];
      sent
        .slice()
        .reverse()
        .forEach(function (a) {
          const det = document.createElement("details");
          det.className = "wr-attempt-card wr-attempt-card--" + a.status;
          if (a === newest) det.open = true;
          const sum = document.createElement("summary");
          const name = document.createElement("strong");
          name.textContent = I18n.t("writing_attempt", { n: String(a.attempt) });
          const st = document.createElement("span");
          st.className = "wr-attempt-card__status";
          st.textContent = I18n.t(
            a.status === "corrected" ? "writing_status_corrected" : "writing_status_submitted"
          );
          const when = document.createElement("span");
          when.className = "wr-attempt-card__when";
          when.textContent = a.submitted_at
            ? I18n.t("writing_sent_on", { date: writingFormatDate(a.submitted_at) })
            : "";
          sum.appendChild(name);
          sum.appendChild(st);
          sum.appendChild(when);
          const earned = a.status === "corrected" ? pointsForSubmission(pointsState.awards, a.id) : 0;
          if (earned) {
            const chip = document.createElement("span");
            chip.className = "wr-attempt-card__pts";
            chip.textContent = "★ " + formatSignedPoints(earned);
            sum.appendChild(chip);
          }
          det.appendChild(sum);

          const page = document.createElement("div");
          page.className = "wr-sheet";
          if (a.status === "corrected" && a.correction_html) {
            page.innerHTML = sanitizeCorrectionHtml(a.correction_html);
            det.appendChild(page);
            det.appendChild(buildCorrectionLegend());
          } else {
            page.textContent = a.body || "";
            det.appendChild(page);
          }
          if (a.status === "corrected" && a.teacher_note) {
            const note = document.createElement("div");
            note.className = "wr-note";
            const h = document.createElement("p");
            h.className = "wr-note__title";
            h.textContent = I18n.t("writing_teacher_note");
            const p = document.createElement("p");
            p.className = "wr-note__text";
            p.textContent = a.teacher_note;
            note.appendChild(h);
            note.appendChild(p);
            det.appendChild(note);
          }
          el.historyList.appendChild(det);
        });
    }

    function showCompose(summary, initialText) {
      ctx.composing = true;
      el.waiting.classList.add("hidden");
      el.compose.classList.remove("hidden");
      el.attempt.textContent = I18n.t("writing_attempt", { n: String(nextAttemptNumber(summary)) });
      el.paper.value = initialText || "";
      pasteGuard.reset();
      updateCount();
    }

    function showWaiting(summary) {
      ctx.composing = false;
      el.compose.classList.add("hidden");
      el.waiting.classList.remove("hidden");
      const last = summary.lastSent;
      const corrected = last && last.status === "corrected";
      el.waitingTitle.textContent = I18n.t(
        corrected ? "writing_corrected_title" : "writing_sent_title",
        { n: String(last ? last.attempt : 1) }
      );
      el.waitingText.textContent = corrected ? "" : I18n.t("writing_sent_waiting");
      el.waitingText.classList.toggle("hidden", corrected);
      el.newAttempt.textContent = I18n.t("writing_new_attempt");
    }

    function showBanner(text) {
      el.banner.textContent = text || "";
      el.banner.classList.toggle("hidden", !text);
    }

    /** Re-read state from writingState. Keeps whatever the student is currently typing. */
    function render(opts) {
      if (!ctx) return;
      const summary = writingTaskSummary(ctx.item.id);
      el.kicker.textContent = I18n.t("writing_kicker", { level: writingLevelLabel(ctx.level) });
      el.task.textContent = writingTaskText(ctx.item);
      el.close.textContent = I18n.t("writing_close");
      el.hint.textContent = I18n.t("writing_no_paste");
      el.paper.placeholder = I18n.t("writing_placeholder");
      el.save.textContent = I18n.t("writing_save");
      el.submit.textContent = I18n.t("writing_submit");
      renderHistory(summary);

      if (writingState.error === "offline") showBanner(I18n.t("writing_offline"));
      else if (writingState.error === "load") showBanner(I18n.t("writing_load_failed"));
      else if (!opts || !opts.keepBanner) showBanner("");

      if (ctx.composing && opts && opts.keepText) {
        el.attempt.textContent = I18n.t("writing_attempt", { n: String(nextAttemptNumber(summary)) });
        return;
      }

      const local = readWritingLocal(ctx.username, ctx.item.id);
      if (summary.draft) {
        let text = summary.draft.body || "";
        const draftAt = summary.draft.updated_at ? Date.parse(summary.draft.updated_at) : 0;
        if (local && local.text && local.text !== text && Date.parse(local.at) > draftAt) {
          text = local.text;
          ctx.dirty = true;
          showBanner(I18n.t("writing_restored_local"));
        }
        showCompose(summary, text);
      } else if (summary.lastSent && !(local && local.text.trim())) {
        if (ctx.composing) showCompose(summary, el.paper.value);
        else showWaiting(summary);
      } else {
        const text = local ? local.text : "";
        if (text) {
          ctx.dirty = true;
          showBanner(I18n.t("writing_restored_local"));
        }
        showCompose(summary, text);
      }
    }

    async function save(submit) {
      if (!ctx || ctx.busy) return false;
      const text = el.paper.value;
      if (submit && !text.trim()) {
        setMsg(I18n.t("writing_submit_empty"), "warn");
        return false;
      }
      if (submit) {
        const n = nextAttemptNumber(writingTaskSummary(ctx.item.id));
        if (!window.confirm(I18n.t("writing_submit_confirm", { n: String(n) }))) return false;
      }
      ctx.busy = true;
      el.save.disabled = true;
      el.submit.disabled = true;
      setMsg(I18n.t("writing_saving"));
      const thisCtx = ctx;
      try {
        await saveStudentWriting(thisCtx.level, thisCtx.item, text, submit);
        if (submit) {
          clearWritingLocal(thisCtx.username, thisCtx.item.id);
          markWritingHomeworkDone(thisCtx.level, thisCtx.item.id);
          thisCtx.composing = false;
        }
        thisCtx.dirty = false;
        if (ctx === thisCtx) {
          setMsg(
            I18n.t("writing_saved_at", {
              time: new Date().toLocaleTimeString(I18n.getLang() === "fr" ? "fr-FR" : "en-IE", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }),
            "ok"
          );
        }
        await loadStudentWriting(true);
        return true;
      } catch (err) {
        console.error(err);
        if (ctx === thisCtx) setMsg(I18n.t("writing_save_failed"), "error");
        return false;
      } finally {
        thisCtx.busy = false;
        el.save.disabled = false;
        el.submit.disabled = false;
      }
    }

    function scheduleAutosave() {
      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(function () {
        if (ctx && ctx.dirty && el.paper.value.trim()) void save(false);
      }, 20000);
    }

    async function close() {
      if (!ctx) return;
      if (autosaveTimer) clearTimeout(autosaveTimer);
      if (ctx.composing && ctx.dirty && el.paper.value.trim()) {
        await save(false);
      }
      ctx = null;
      overlay.classList.add("hidden");
      document.body.classList.remove("wr-open");
      refreshAllHomeworkPanels();
    }

    el.paper.addEventListener("input", function () {
      if (!ctx) return;
      ctx.dirty = true;
      updateCount();
      writeWritingLocal(ctx.username, ctx.item.id, el.paper.value);
      scheduleAutosave();
    });
    el.save.addEventListener("click", function () {
      void save(false);
    });
    el.submit.addEventListener("click", function () {
      void save(true);
    });
    el.close.addEventListener("click", function () {
      void close();
    });
    el.newAttempt.addEventListener("click", function () {
      if (!ctx) return;
      setMsg("");
      showCompose(writingTaskSummary(ctx.item.id), "");
      el.paper.focus();
    });
    overlay.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        void close();
      }
    });
    window.addEventListener("beforeunload", function (e) {
      if (ctx && ctx.dirty && el.paper.value.trim()) {
        e.preventDefault();
        e.returnValue = "";
      }
    });

    return {
      open: function (level, item) {
        if (!getActiveUser() || !activeUsername) return;
        ctx = { level: level, item: item, username: activeUsername, composing: false, dirty: false, busy: false };
        setMsg("");
        overlay.classList.remove("hidden");
        document.body.classList.add("wr-open");
        overlay.scrollTop = 0;
        render();
        if (ctx.composing) el.paper.focus();
        else el.close.focus();
        void loadStudentWriting(false);
      },
      refresh: function () {
        render({ keepText: true, keepBanner: true });
      },
      isOpen: function () {
        return !!ctx;
      },
      close: close,
    };
  }

  function openWritingEditor(level, item) {
    if (!writingEditor) writingEditor = createWritingEditor();
    writingEditor.open(level, item);
  }

  function markWritingHomeworkDone(level, taskId) {
    const user = getActiveUser();
    if (!user) return;
    const hub = ensureLearningHub(ensureStats(user));
    if (!hub.homeworkChecklist[level]) hub.homeworkChecklist[level] = {};
    if (hub.homeworkChecklist[level][taskId]) return;
    hub.homeworkChecklist[level][taskId] = true;
    hub.homeworkChecklistDates[level + "|" + taskId] = new Date().toISOString();
    saveUsers();
  }

  /* ---------- Admin: Writing corrections tab ---------- */


  function adminWritingCounts() {
    let todo = 0;
    let done = 0;
    adminWriting.rows.forEach(function (r) {
      if (r.status === "corrected") done += 1;
      else todo += 1;
    });
    return { todo: todo, done: done, all: adminWriting.rows.length };
  }

  function updateAdminWritingTabBadge() {
    const btn = document.querySelector('#admin-dashboard [data-admin-tab="writing"]');
    if (!btn) return;
    const n = adminWritingCounts().todo;
    let badge = btn.querySelector(".admin-tab-badge");
    if (!n) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "admin-tab-badge";
      btn.appendChild(badge);
    }
    badge.textContent = String(n);
  }

  function adminWritingSecret() {
    return String(getSupabaseConfig().adminApiSecret || "");
  }

  async function fetchAdminWriting() {
    if (!adminUnlocked) return;
    if (!isSupabaseConfigured() || !hasAdminApiSecret() || !getSupabaseClient()) {
      adminWriting.loaded = true;
      adminWriting.error = I18n.t("admin_writing_no_cloud");
      renderAdminWriting();
      return;
    }
    if (adminWriting.loading) return;
    adminWriting.loading = true;
    if (!adminWriting.openId) renderAdminWriting();
    try {
      const { data, error } = await getSupabaseClient().rpc("admin_list_writing", {
        p_secret: adminWritingSecret(),
      });
      if (error) throw error;
      adminWriting.rows = data || [];
      adminWriting.error = "";
    } catch (err) {
      console.error(err);
      adminWriting.error = I18n.t("admin_writing_failed", { err: (err && err.message) || String(err) });
    }
    adminWriting.loading = false;
    adminWriting.loaded = true;
    updateAdminWritingTabBadge();
    // Never rebuild the screen under the teacher while a correction is open.
    if (!adminWriting.openId) renderAdminWriting();
  }

  function adminWritingStudentName(r) {
    return (r.full_name || "").trim() || r.username;
  }

  function renderAdminWriting() {
    const host = document.getElementById("admin-writing-content");
    if (!host) return;
    if (adminWriting.openId) {
      const row = adminWriting.rows.find(function (r) {
        return r.id === adminWriting.openId;
      });
      if (row) {
        renderAdminWritingCorrection(host, row);
        return;
      }
      adminWriting.openId = null;
    }
    renderAdminWritingList(host);
  }

  function renderAdminWritingList(host) {
    host.innerHTML = "";
    const card = document.createElement("div");
    card.className = "account-card account-card--admin";
    const h = document.createElement("h3");
    h.textContent = I18n.t("admin_writing_heading");
    card.appendChild(h);

    if (adminWriting.error) {
      const err = document.createElement("p");
      err.className = "form-error";
      err.textContent = adminWriting.error;
      card.appendChild(err);
    }

    const counts = adminWritingCounts();
    const filters = document.createElement("div");
    filters.className = "admin-writing-filters";
    [
      ["todo", "admin_writing_filter_todo", counts.todo],
      ["done", "admin_writing_filter_done", counts.done],
      ["all", "admin_writing_filter_all", counts.all],
    ].forEach(function (f) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "admin-writing-filter" + (adminWriting.filter === f[0] ? " is-active" : "");
      b.textContent = I18n.t(f[1], { n: String(f[2]) });
      b.addEventListener("click", function () {
        adminWriting.filter = f[0];
        renderAdminWriting();
      });
      filters.appendChild(b);
    });
    const refresh = document.createElement("button");
    refresh.type = "button";
    refresh.className = "btn-text admin-writing-refresh";
    refresh.textContent = I18n.t("admin_refresh_cloud");
    refresh.addEventListener("click", function () {
      void fetchAdminWriting();
    });
    filters.appendChild(refresh);
    card.appendChild(filters);

    const rows = adminWriting.rows.filter(function (r) {
      if (adminWriting.filter === "todo") return r.status !== "corrected";
      if (adminWriting.filter === "done") return r.status === "corrected";
      return true;
    });

    if (adminWriting.loading && !adminWriting.rows.length) {
      const p = document.createElement("p");
      p.className = "field-hint";
      p.textContent = I18n.t("admin_writing_loading");
      card.appendChild(p);
      host.appendChild(card);
      return;
    }
    if (!rows.length) {
      const p = document.createElement("p");
      p.className = "field-hint";
      p.textContent = I18n.t("admin_writing_empty");
      card.appendChild(p);
      host.appendChild(card);
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "admin-table-scroll";
    const table = document.createElement("table");
    table.className = "admin-table admin-writing-table";
    const thead = document.createElement("thead");
    const htr = document.createElement("tr");
    [
      "admin_writing_col_student",
      "admin_col_level",
      "admin_writing_col_task",
      "admin_writing_col_attempt",
      "admin_writing_col_sent",
      "admin_writing_col_status",
      "admin_col_actions",
    ].forEach(function (k) {
      const th = document.createElement("th");
      th.textContent = I18n.t(k);
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    rows.forEach(function (r) {
      const tr = document.createElement("tr");
      const cells = [
        adminWritingStudentName(r),
        writingLevelLabel(r.level),
        r.task_text || r.task_id,
        String(r.attempt),
        writingFormatDate(r.submitted_at),
      ];
      cells.forEach(function (txt, i) {
        const td = document.createElement("td");
        td.textContent = txt;
        if (i === 2) td.className = "admin-writing-table__task";
        tr.appendChild(td);
      });
      const stTd = document.createElement("td");
      const st = document.createElement("span");
      st.className = "admin-writing-status admin-writing-status--" + r.status;
      st.textContent = I18n.t(
        r.status === "corrected" ? "writing_status_corrected" : "writing_status_submitted"
      );
      stTd.appendChild(st);
      tr.appendChild(stTd);
      const actTd = document.createElement("td");
      const open = document.createElement("button");
      open.type = "button";
      open.className = r.status === "corrected" ? "flashcard-btn" : "flashcard-btn admin-writing-open--todo";
      open.textContent = I18n.t(
        r.status === "corrected" ? "admin_writing_open_view" : "admin_writing_open_correct"
      );
      open.addEventListener("click", function () {
        adminWriting.openId = r.id;
        adminWriting.dirty = false;
        renderAdminWriting();
        const top = document.getElementById("admin-writing-tab");
        if (top && top.scrollIntoView) top.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      actTd.appendChild(open);
      tr.appendChild(actTd);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    card.appendChild(wrap);
    host.appendChild(card);
  }

  function unwrapCorrectionMarks(root) {
    root.querySelectorAll(".wc-fix").forEach(function (n) {
      n.remove();
    });
    root.querySelectorAll(".wc-err").forEach(function (n) {
      while (n.firstChild) n.parentNode.insertBefore(n.firstChild, n);
      n.remove();
    });
  }

  function renderAdminWritingCorrection(host, row) {
    host.innerHTML = "";
    const card = document.createElement("div");
    card.className = "account-card account-card--admin admin-writing-correct";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "btn-text";
    back.textContent = "← " + I18n.t("admin_writing_back");
    back.addEventListener("click", function () {
      if (adminWriting.dirty && !window.confirm(I18n.t("admin_writing_unsaved_confirm"))) return;
      adminWriting.openId = null;
      adminWriting.dirty = false;
      renderAdminWriting();
    });
    card.appendChild(back);

    const h = document.createElement("h3");
    h.textContent = adminWritingStudentName(row) + " · " + I18n.t("writing_attempt", { n: String(row.attempt) });
    card.appendChild(h);

    const meta = document.createElement("p");
    meta.className = "field-hint";
    meta.textContent =
      writingLevelLabel(row.level) +
      " · " +
      I18n.t("writing_sent_on", { date: writingFormatDate(row.submitted_at) }) +
      " · " +
      writingWordsLabel(writingWordCount(row.body));
    card.appendChild(meta);

    const task = document.createElement("p");
    task.className = "admin-writing-task";
    task.textContent = row.task_text || row.task_id;
    card.appendChild(task);

    const others = adminWriting.rows.filter(function (r) {
      return r.username === row.username && r.task_id === row.task_id && r.id !== row.id;
    });
    if (others.length) {
      const o = document.createElement("p");
      o.className = "admin-writing-others";
      o.appendChild(document.createTextNode(I18n.t("admin_writing_other_attempts") + " "));
      others
        .sort(function (a, b) {
          return a.attempt - b.attempt;
        })
        .forEach(function (r) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "btn-text";
          b.textContent =
            I18n.t("writing_attempt", { n: String(r.attempt) }) +
            (r.status === "corrected" ? " ✓" : "");
          b.addEventListener("click", function () {
            if (adminWriting.dirty && !window.confirm(I18n.t("admin_writing_unsaved_confirm"))) return;
            adminWriting.openId = r.id;
            adminWriting.dirty = false;
            renderAdminWriting();
          });
          o.appendChild(b);
        });
      card.appendChild(o);
    }

    const orig = document.createElement("details");
    orig.className = "admin-writing-original";
    const origSum = document.createElement("summary");
    origSum.textContent = I18n.t("admin_writing_original");
    const origSheet = document.createElement("div");
    origSheet.className = "wr-sheet";
    origSheet.textContent = row.body || "";
    orig.appendChild(origSum);
    orig.appendChild(origSheet);
    card.appendChild(orig);

    const help = document.createElement("p");
    help.className = "field-hint";
    help.textContent = I18n.t("admin_writing_help");
    card.appendChild(help);

    // Toolbar
    const bar = document.createElement("div");
    bar.className = "admin-writing-toolbar";
    const markBtn = document.createElement("button");
    markBtn.type = "button";
    markBtn.className = "flashcard-btn admin-writing-tool--err";
    markBtn.textContent = I18n.t("admin_writing_mark");
    const fixInput = document.createElement("input");
    fixInput.type = "text";
    fixInput.className = "admin-writing-fix-input";
    fixInput.placeholder = I18n.t("admin_writing_fix_placeholder");
    const fixBtn = document.createElement("button");
    fixBtn.type = "button";
    fixBtn.className = "flashcard-btn admin-writing-tool--fix";
    fixBtn.textContent = I18n.t("admin_writing_mark_fix");
    const unmarkBtn = document.createElement("button");
    unmarkBtn.type = "button";
    unmarkBtn.className = "flashcard-btn";
    unmarkBtn.textContent = I18n.t("admin_writing_unmark");
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn-text";
    resetBtn.textContent = I18n.t("admin_writing_reset");
    [markBtn, fixInput, fixBtn, unmarkBtn, resetBtn].forEach(function (n) {
      bar.appendChild(n);
    });
    card.appendChild(bar);

    const toolMsg = document.createElement("p");
    toolMsg.className = "admin-writing-toolmsg";
    toolMsg.setAttribute("aria-live", "polite");
    card.appendChild(toolMsg);

    // Editable sheet
    const editor = document.createElement("div");
    editor.className = "wr-sheet wr-sheet--edit";
    editor.contentEditable = "true";
    editor.spellcheck = false;
    editor.setAttribute("role", "textbox");
    editor.setAttribute("aria-multiline", "true");
    editor.innerHTML = sanitizeCorrectionHtml(
      row.correction_html || plainTextToCorrectionHtml(row.body)
    );
    card.appendChild(editor);
    card.appendChild(buildCorrectionLegend());

    const noteLabel = document.createElement("label");
    noteLabel.className = "admin-writing-note-label";
    noteLabel.textContent = I18n.t("admin_writing_note_label");
    const note = document.createElement("textarea");
    note.className = "admin-writing-note";
    note.rows = 4;
    note.value = row.teacher_note || "";
    noteLabel.appendChild(note);
    card.appendChild(noteLabel);

    const ptsLabel = document.createElement("label");
    ptsLabel.className = "admin-writing-points-label";
    ptsLabel.textContent = I18n.t("admin_writing_points_label");
    const ptsInput = document.createElement("input");
    ptsInput.type = "number";
    ptsInput.step = "1";
    ptsInput.min = "0";
    ptsInput.max = "10000";
    ptsInput.className = "admin-writing-points";
    ptsInput.placeholder = "0";
    let ptsTouched = false;
    function fillPoints() {
      if (ptsTouched) return;
      const existing = pointsForSubmission(adminPoints.awards, row.id);
      ptsInput.value = existing ? String(existing) : "";
    }
    fillPoints();
    if (!adminPoints.loaded) void fetchAdminPoints().then(fillPoints);
    ptsInput.addEventListener("input", function () {
      ptsTouched = true;
      markDirty();
    });
    ptsLabel.appendChild(ptsInput);
    card.appendChild(ptsLabel);
    const ptsHint = document.createElement("p");
    ptsHint.className = "field-hint";
    ptsHint.textContent = I18n.t("admin_writing_points_hint");
    card.appendChild(ptsHint);

    const actions = document.createElement("div");
    actions.className = "admin-writing-actions";
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "flashcard-btn";
    saveBtn.textContent = I18n.t("admin_writing_save");
    const sendBtn = document.createElement("button");
    sendBtn.type = "button";
    sendBtn.className = "btn-primary";
    sendBtn.textContent = I18n.t(row.status === "corrected" ? "admin_writing_resend" : "admin_writing_send");
    actions.appendChild(saveBtn);
    actions.appendChild(sendBtn);
    card.appendChild(actions);
    const status = document.createElement("p");
    status.className = "field-hint admin-writing-status-msg";
    status.setAttribute("aria-live", "polite");
    card.appendChild(status);

    // A saved correction that is still private shows its state.
    if (row.status !== "corrected" && row.correction_html) {
      status.textContent = I18n.t("admin_writing_saved");
    }

    host.appendChild(card);

    // --- behaviour ---
    let savedRange = null;
    function rememberSelection() {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const r = sel.getRangeAt(0);
      if (editor.contains(r.commonAncestorContainer)) savedRange = r.cloneRange();
    }
    document.addEventListener("selectionchange", function onSel() {
      if (!editor.isConnected) {
        document.removeEventListener("selectionchange", onSel);
        return;
      }
      rememberSelection();
    });
    function markDirty() {
      adminWriting.dirty = true;
      status.textContent = "";
    }
    editor.addEventListener("input", markDirty);
    editor.addEventListener("paste", function (e) {
      e.preventDefault();
      const text = (e.clipboardData && e.clipboardData.getData("text/plain")) || "";
      if (!text) return;
      if (!document.execCommand || !document.execCommand("insertText", false, text)) {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;
        const r = sel.getRangeAt(0);
        r.deleteContents();
        r.insertNode(document.createTextNode(text));
        r.collapse(false);
      }
      markDirty();
    });
    // Keep the editor's selection when pressing toolbar buttons.
    [markBtn, fixBtn, unmarkBtn].forEach(function (b) {
      b.addEventListener("mousedown", function (e) {
        e.preventDefault();
      });
    });

    function flash(text) {
      toolMsg.textContent = text || "";
    }

    function usableRange() {
      rememberSelection();
      if (!savedRange || savedRange.collapsed) return null;
      if (!editor.contains(savedRange.commonAncestorContainer)) return null;
      return savedRange;
    }

    function placeCaretAfter(node) {
      const sel = window.getSelection();
      if (!sel) return;
      const r = document.createRange();
      r.setStartAfter(node);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
      savedRange = null;
    }

    function mark(withFix) {
      const range = usableRange();
      if (!range) {
        flash(I18n.t("admin_writing_select_first"));
        return;
      }
      const fixText = fixInput.value.trim();
      if (withFix && !fixText) {
        flash(I18n.t("admin_writing_fix_needed"));
        fixInput.focus();
        return;
      }
      // Don't nest marks: if the selection sits inside one, mark the whole existing one.
      const inside = range.commonAncestorContainer.nodeType === 1
        ? range.commonAncestorContainer.closest(".wc-err, .wc-fix")
        : range.commonAncestorContainer.parentElement && range.commonAncestorContainer.parentElement.closest(".wc-err, .wc-fix");
      if (inside && editor.contains(inside)) {
        range.selectNode(inside);
      }
      const frag = range.extractContents();
      const tmp = document.createElement("div");
      tmp.appendChild(frag);
      unwrapCorrectionMarks(tmp);
      const err = document.createElement("span");
      err.className = "wc-err";
      while (tmp.firstChild) err.appendChild(tmp.firstChild);
      if (!err.textContent) {
        flash(I18n.t("admin_writing_select_first"));
        return;
      }
      range.insertNode(err);
      let last = err;
      if (withFix) {
        const fix = document.createElement("span");
        fix.className = "wc-fix";
        fix.textContent = fixText;
        err.parentNode.insertBefore(fix, err.nextSibling);
        last = fix;
        fixInput.value = "";
      }
      editor.normalize();
      placeCaretAfter(last);
      flash("");
      markDirty();
    }

    markBtn.addEventListener("click", function () {
      mark(false);
    });
    fixBtn.addEventListener("click", function () {
      mark(true);
    });
    fixInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        mark(true);
      }
    });
    unmarkBtn.addEventListener("click", function () {
      const range = usableRange();
      if (!range) {
        flash(I18n.t("admin_writing_select_first"));
        return;
      }
      let changed = false;
      editor.querySelectorAll(".wc-err, .wc-fix").forEach(function (n) {
        if (!range.intersectsNode(n)) return;
        changed = true;
        if (n.classList.contains("wc-fix")) {
          n.remove();
        } else {
          while (n.firstChild) n.parentNode.insertBefore(n.firstChild, n);
          n.remove();
        }
      });
      editor.normalize();
      if (changed) markDirty();
      flash("");
    });
    resetBtn.addEventListener("click", function () {
      if (!window.confirm(I18n.t("admin_writing_reset_confirm"))) return;
      editor.innerHTML = plainTextToCorrectionHtml(row.body);
      markDirty();
    });
    note.addEventListener("input", markDirty);

    async function persist(send) {
      if (send && !window.confirm(I18n.t("admin_writing_send_confirm", { name: adminWritingStudentName(row) }))) {
        return;
      }
      const sb = getSupabaseClient();
      if (!sb || !hasAdminApiSecret()) {
        status.textContent = I18n.t("admin_writing_no_cloud");
        return;
      }
      const html = sanitizeCorrectionHtml(editor.innerHTML);
      saveBtn.disabled = true;
      sendBtn.disabled = true;
      status.textContent = I18n.t("writing_saving");
      try {
        const { error } = await sb.rpc("admin_save_writing_correction", {
          p_secret: adminWritingSecret(),
          p_id: row.id,
          p_correction_html: html,
          p_teacher_note: note.value,
          p_send: !!send,
        });
        if (error) throw error;
        row.correction_html = html;
        row.teacher_note = note.value;
        if (send) {
          row.status = "corrected";
          row.corrected_at = new Date().toISOString();
          sendBtn.textContent = I18n.t("admin_writing_resend");
          if (ptsTouched) {
            const n = Math.max(0, Math.min(10000, Math.trunc(Number(ptsInput.value) || 0)));
            const taskNote = String(row.task_text || row.task_id || "").slice(0, 160);
            await adminAwardPoints(row.username, n, taskNote, row.id);
            ptsTouched = false;
            void fetchAdminPoints();
          }
        }
        adminWriting.dirty = false;
        status.textContent = I18n.t(send ? "admin_writing_sent" : "admin_writing_saved");
        updateAdminWritingTabBadge();
      } catch (err) {
        console.error(err);
        status.textContent = I18n.t("admin_writing_failed", { err: (err && err.message) || String(err) });
      } finally {
        saveBtn.disabled = false;
        sendBtn.disabled = false;
      }
    }
    saveBtn.addEventListener("click", function () {
      void persist(false);
    });
    sendBtn.addEventListener("click", function () {
      void persist(true);
    });
  }

  function bumpLearningStreak(levelKey) {
    const user = getActiveUser();
    if (!user) return;
    const stats = ensureStats(user);
    const lh = ensureLearningHub(stats);
    const today = isoDay(new Date());
    if (lh.lastActiveDay !== today) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const ystr = isoDay(y);
      if (lh.lastActiveDay === ystr) lh.streak = (lh.streak || 0) + 1;
      else lh.streak = lh.lastActiveDay ? 1 : Math.max(1, lh.streak || 1);
      lh.lastActiveDay = today;
      if (
        STREAK_MILESTONES.indexOf(lh.streak) !== -1 &&
        lh.lastCelebratedStreak !== lh.streak
      ) {
        lh.lastCelebratedStreak = lh.streak;
        saveUsers();
        showStreakCelebration(lh.streak);
      }
    }
    lh.activityByDay[today] = (lh.activityByDay[today] || 0) + 1;
    saveUsers();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("andronicus:streakchange", {
          detail: { level: levelKey },
        })
      );
    }
  }

  function breadcrumbToolLabel(tool) {
    const key = {
      flashcards: "learning_tab_flashcards",
      vocab: "learning_tab_vocab",
      grammar: "learning_tab_grammar",
      homework: "learning_tab_homework",
      progress: "learning_tab_progress",
      verbs: "learning_tab_verbs",
    }[tool];
    return key ? I18n.t(key) : tool;
  }

  function updateContentBreadcrumb() {
    if (!contentBreadcrumb) return;
    const panelContent = document.getElementById("panel-content");
    if (
      !panelContent ||
      panelContent.classList.contains("hidden") ||
      !levelPicker ||
      !levelPicker.classList.contains("hidden")
    ) {
      contentBreadcrumb.classList.add("hidden");
      contentBreadcrumb.innerHTML = "";
      return;
    }
    if (contentPasswordOverlay && !contentPasswordOverlay.classList.contains("hidden")) {
      contentBreadcrumb.classList.add("hidden");
      contentBreadcrumb.innerHTML = "";
      return;
    }

    let openLevel = null;
    let openArticle = null;
    document.querySelectorAll(".level-article").forEach(function (art) {
      if (!art.classList.contains("hidden")) {
        openLevel = art.id.replace("content-", "");
        openArticle = art;
      }
    });
    if (!openLevel || !openArticle) {
      contentBreadcrumb.classList.add("hidden");
      contentBreadcrumb.innerHTML = "";
      return;
    }

    const hub = openArticle.querySelector(".learning-hub");
    const landingEl = hub && hub.querySelector("[data-level-landing]");
    const onLanding = landingEl && !landingEl.classList.contains("hidden");

    contentBreadcrumb.classList.remove("hidden");
    contentBreadcrumb.innerHTML = "";
    contentBreadcrumb.setAttribute("aria-label", I18n.t("content_breadcrumb_aria"));

    function appendSep() {
      const sep = document.createElement("span");
      sep.setAttribute("aria-hidden", "true");
      sep.textContent = "›";
      contentBreadcrumb.appendChild(sep);
    }

    function appendLink(text, handler) {
      const link = document.createElement("span");
      link.className = "content-breadcrumb__link";
      link.textContent = text;
      link.setAttribute("role", "link");
      link.tabIndex = 0;
      link.addEventListener("click", handler);
      link.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handler();
        }
      });
      contentBreadcrumb.appendChild(link);
    }

    function appendCurrent(text) {
      const cur = document.createElement("span");
      cur.className = "content-breadcrumb__current";
      cur.textContent = text;
      cur.setAttribute("aria-current", "page");
      contentBreadcrumb.appendChild(cur);
    }

    appendLink(I18n.t("nav_content_label"), showLevelPicker);
    appendSep();
    const levelLabel = I18n.t("level_" + openLevel);
    if (onLanding) {
      appendCurrent(levelLabel);
      return;
    }
    appendLink(levelLabel, function () {
      if (hub) resetHubToLanding(hub);
    });
    const activeTab = hub && hub.querySelector(".learning-hub__tab.is-active");
    const tool = activeTab && activeTab.getAttribute("data-tool");
    if (tool) {
      appendSep();
      appendCurrent(breadcrumbToolLabel(tool));
    }
  }

  function resetHubToLanding(hub) {
    if (!hub) return;
    hub.classList.remove("is-locked");
    const landing = hub.querySelector("[data-level-landing]");
    const workspace = hub.querySelector("[data-hub-workspace]");
    const backBtn = hub.querySelector(".lh-back-to-menu");
    if (landing) landing.classList.remove("hidden");
    if (workspace) workspace.classList.add("hidden");
    if (backBtn) backBtn.classList.add("hidden");
    hub.querySelectorAll(".tool-panel").forEach(function (panel) {
      panel.classList.add("hidden");
    });
    const lvl = hub.getAttribute("data-learning-level");
    const data = learningData[lvl];
    if (data) refreshLandingCardProgress(hub, lvl, data);
    updateContentBreadcrumb();
  }

  function resetAllLearningHubsToLanding() {
    document.querySelectorAll(".learning-hub").forEach(resetHubToLanding);
  }

  function homeworkCategoryLabel(category) {
    if (!category) return "";
    const keys = {
      Vocab: "learning_hw_cat_vocab",
      Reading: "learning_hw_cat_reading",
      Grammar: "learning_hw_cat_grammar",
      Writing: "learning_hw_cat_writing",
      Listening: "learning_hw_cat_listening",
      Speaking: "learning_hw_cat_speaking",
    };
    const key = keys[category];
    return key ? I18n.t(key) : category;
  }

  function vocabMasteryLabel(correct, wrong) {
    const c = correct || 0;
    const w = wrong || 0;
    const t = c + w;
    if (t < 4) return "learning";
    if (t < 12 || c / t < 0.65) return "practicing";
    return "mastered";
  }

  function buildFlashcardSessionIndices(deckLen) {
    if (deckLen <= 0) return [];
    if (deckLen <= FLASHCARD_SESSION_CAP) {
      const arr = [];
      for (let i = 0; i < deckLen; i += 1) arr.push(i);
      return arr;
    }
    const picked = {};
    const out = [];
    while (out.length < FLASHCARD_SESSION_CAP) {
      const r = Math.floor(Math.random() * deckLen);
      if (!picked[r]) {
        picked[r] = true;
        out.push(r);
      }
    }
    return out.sort(function (a, b) {
      return a - b;
    });
  }

  function flashcardCardKey(card) {
    return String(card.front) + "\t" + String(card.back);
  }

  function recordFlashcardSessionComplete(payload) {
    const user = getActiveUser();
    if (!user) return;
    const stats = ensureStats(user);
    stats.flashcardSessions.push({
      at: new Date().toISOString(),
      level: payload.level,
      topic: payload.topic,
      correct: payload.correct,
      wrong: payload.wrong,
      total: payload.total,
      mode: payload.mode || "full",
    });
    if (stats.flashcardSessions.length > 48) {
      stats.flashcardSessions = stats.flashcardSessions.slice(-48);
    }
    bumpLearningStreak(payload.level);
    saveUsers();
  }

  function setAuthFeedback(message, isError) {
    if (!accountAuthFeedback) return;
    accountAuthFeedback.textContent = message;
    accountAuthFeedback.classList.toggle("hidden", !message);
    accountAuthFeedback.style.color = isError ? "#b74848" : "";
  }

  function wirePasswordToggle(button, input) {
    if (!button || !input || button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    const iconMasked = button.querySelector(".account-password-toggle__icon--masked");
    const iconShown = button.querySelector(".account-password-toggle__icon--shown");
    function sync() {
      const hidden = input.type === "password";
      button.setAttribute("aria-pressed", hidden ? "false" : "true");
      button.setAttribute(
        "aria-label",
        hidden ? I18n.t("account_password_show") : I18n.t("account_password_hide")
      );
      if (iconMasked) iconMasked.classList.toggle("hidden", !hidden);
      if (iconShown) iconShown.classList.toggle("hidden", hidden);
    }
    button.addEventListener("click", function () {
      input.type = input.type === "password" ? "text" : "password";
      sync();
    });
    sync();
  }

  function syncPasswordToggleAria() {
    [
      ["account-register-password-toggle", "account-register-password"],
      ["account-login-password-toggle", "account-login-password"],
    ].forEach(function (ids) {
      const btn = document.getElementById(ids[0]);
      const inp = document.getElementById(ids[1]);
      if (!btn || !inp) return;
      const hidden = inp.type === "password";
      btn.setAttribute(
        "aria-label",
        hidden ? I18n.t("account_password_show") : I18n.t("account_password_hide")
      );
      btn.setAttribute("aria-pressed", hidden ? "false" : "true");
      const iconMasked = btn.querySelector(".account-password-toggle__icon--masked");
      const iconShown = btn.querySelector(".account-password-toggle__icon--shown");
      if (iconMasked) iconMasked.classList.toggle("hidden", !hidden);
      if (iconShown) iconShown.classList.toggle("hidden", hidden);
    });
  }

  function initAccountPasswordUi() {
    wirePasswordToggle(
      document.getElementById("account-register-password-toggle"),
      document.getElementById("account-register-password")
    );
    wirePasswordToggle(
      document.getElementById("account-login-password-toggle"),
      document.getElementById("account-login-password")
    );
    if (accountForgotOpen && accountForgotDialog && !accountForgotOpen.dataset.wired) {
      accountForgotOpen.dataset.wired = "1";
      accountForgotOpen.addEventListener("click", function () {
        if (typeof accountForgotDialog.showModal === "function") {
          accountForgotDialog.showModal();
        }
      });
    }
  }

  const FR_MONTHS_ADMIN = [
    "janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin",
    "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre",
  ];

  function buildDraftMailto(username, user, stats) {
    const parentEmail = (user.parentEmail || "").trim();
    const fullName = user.fullName || username;
    const now = new Date();
    const frMonth = FR_MONTHS_ADMIN[now.getMonth()];
    const year = now.getFullYear();
    const firstName = fullName.trim().split(/\s+/)[0] || "\u00c9l\u00e8ve";

    const subject = "Andronicus \u2013 R\u00e9sultats de " + frMonth + " " + year + " | " + firstName;

    const lh = (stats && stats.learningHub) || {};
    const level = (lh.lastLevel && ["beginner", "intermediate", "advanced"].indexOf(lh.lastLevel) >= 0)
      ? lh.lastLevel : null;
    const accuracy = formatPct(stats.flashcards.correct, stats.flashcards.attempts);
    const quizSessions = String(stats.quizSessions || 0);
    const exercisesDone = String((stats.completedExercises || []).length);
    const hwDoneIds = studentHomeworkDoneIds(stats, level || "");
    const hwDone = String(hwDoneIds.length);

    const body = [
      "Bonjour,",
      "",
      "Voici le r\u00e9sum\u00e9 mensuel de progression de " + fullName + " pour le mois de " + frMonth + ".",
      "",
      "Flashcards\u00a0: " + accuracy + " de pr\u00e9cision",
      "Sessions de quiz\u00a0: " + quizSessions,
      "Exercices compl\u00e9t\u00e9s\u00a0: " + exercisesDone,
      "Devoirs coch\u00e9s\u00a0: " + hwDone,
      "",
      "[Ajoutez votre note personnelle ici]",
      "",
      "\u00c0 bient\u00f4t,",
      "Louis",
      "Andronicus \u2013 English Grinds",
      "andronicus-two.vercel.app",
    ].join("\n");

    return "mailto:" + encodeURIComponent(parentEmail) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  function formatPct(correct, attempts) {
    if (!attempts) return "0%";
    return String(Math.round((correct / attempts) * 100)) + "%";
  }

  function appendAdminBarRow(host, label, pct) {
    const row = document.createElement("div");
    row.className = "admin-chart-row";
    const lab = document.createElement("div");
    lab.className = "admin-chart-row__label";
    lab.textContent = label;
    const pctRounded = Math.round(Math.min(100, Math.max(0, pct)));
    const track = document.createElement("div");
    track.className = "admin-chart-row__track";
    const fill = document.createElement("div");
    fill.className = "admin-chart-row__fill";
    fill.style.width = String(pctRounded) + "%";
    track.appendChild(fill);
    const pctEl = document.createElement("div");
    pctEl.className = "admin-chart-row__pct";
    pctEl.textContent = String(pctRounded) + "%";
    row.appendChild(lab);
    row.appendChild(track);
    row.appendChild(pctEl);
    host.appendChild(row);
  }

  function renderAdminStudentDetail(username) {
    if (!adminStudentDetailInner) return;
    const user = users[username];
    if (!user) return;
    const stats = ensureStats(user);
    console.log("[admin] full stats for " + username, JSON.parse(JSON.stringify(stats)));
    adminStudentDetailInner.innerHTML = "";

    const lh = stats.learningHub || {};

    const header = document.createElement("div");
    header.className = "admin-student-detail__header";
    const h = document.createElement("h3");
    h.textContent = I18n.t("admin_student_detail_title", {
      name: user.fullName || username,
    });
    if (lh.lastLevel && CONTENT_LEVELS.indexOf(lh.lastLevel) >= 0) {
      const badge = document.createElement("span");
      badge.className = "admin-level-badge admin-level-badge--" + lh.lastLevel;
      badge.textContent = I18n.t("level_" + lh.lastLevel);
      h.appendChild(badge);
    }
    const sub = document.createElement("p");
    sub.className = "admin-student-detail__sub";
    sub.textContent = I18n.t("admin_student_detail_username", { user: username });
    header.appendChild(h);
    header.appendChild(sub);
    // Parent email display + inline editor
    const parentEmailWrap = document.createElement("div");
    parentEmailWrap.className = "admin-parent-email-wrap";
    const currentParentEmail = user.parentEmail || "";
    const pEmailDisplay = document.createElement("p");
    pEmailDisplay.className = "admin-student-detail__sub";
    pEmailDisplay.innerHTML = "<strong>" + I18n.t("admin_parent_email_label") + ":</strong> " +
      (currentParentEmail ? '<a href="mailto:' + currentParentEmail + '">' + currentParentEmail + "</a>" : "<em>" + I18n.t("admin_parent_email_none") + "</em>");
    const pEmailEditWrap = document.createElement("div");
    pEmailEditWrap.className = "admin-parent-email-edit hidden";
    const pEmailInput = document.createElement("input");
    pEmailInput.type = "email";
    pEmailInput.className = "admin-parent-email-input";
    pEmailInput.value = currentParentEmail;
    pEmailInput.placeholder = "parent@example.com";
    const pEmailSaveBtn = document.createElement("button");
    pEmailSaveBtn.type = "button";
    pEmailSaveBtn.className = "btn-primary btn-sm";
    pEmailSaveBtn.textContent = I18n.t("admin_parent_email_save");
    const pEmailCancelBtn = document.createElement("button");
    pEmailCancelBtn.type = "button";
    pEmailCancelBtn.className = "btn-secondary btn-sm";
    pEmailCancelBtn.textContent = I18n.t("admin_parent_email_cancel");
    pEmailEditWrap.appendChild(pEmailInput);
    pEmailEditWrap.appendChild(pEmailSaveBtn);
    pEmailEditWrap.appendChild(pEmailCancelBtn);
    const pEmailEditBtn = document.createElement("button");
    pEmailEditBtn.type = "button";
    pEmailEditBtn.className = "btn-secondary btn-sm";
    pEmailEditBtn.style.marginLeft = "0.5rem";
    pEmailEditBtn.textContent = I18n.t("admin_parent_email_edit");
    pEmailEditBtn.addEventListener("click", function () {
      pEmailDisplay.classList.add("hidden");
      pEmailEditBtn.classList.add("hidden");
      pEmailEditWrap.classList.remove("hidden");
      pEmailInput.focus();
    });
    pEmailCancelBtn.addEventListener("click", function () {
      pEmailDisplay.classList.remove("hidden");
      pEmailEditBtn.classList.remove("hidden");
      pEmailEditWrap.classList.add("hidden");
      pEmailInput.value = user.parentEmail || "";
    });
    pEmailSaveBtn.addEventListener("click", async function () {
      const newEmail = pEmailInput.value.trim();
      if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        pEmailInput.style.outline = "2px solid red";
        return;
      }
      pEmailInput.style.outline = "";
      user.parentEmail = newEmail;
      if (isSupabaseConfigured()) {
        const sb = getSupabaseClient();
        if (sb) {
          const { error } = await sb
            .from("student_accounts")
            .update({ parent_email: newEmail || null })
            .eq("username", username);
          if (error) console.error("parent_email update failed", error);
        }
      }
      pEmailDisplay.innerHTML = "<strong>" + I18n.t("admin_parent_email_label") + ":</strong> " +
        (newEmail ? '<a href="mailto:' + newEmail + '">' + newEmail + "</a>" : "<em>" + I18n.t("admin_parent_email_none") + "</em>");
      pEmailDisplay.classList.remove("hidden");
      pEmailEditBtn.classList.remove("hidden");
      pEmailEditWrap.classList.add("hidden");
    });
    parentEmailWrap.appendChild(pEmailDisplay);
    parentEmailWrap.appendChild(pEmailEditBtn);
    parentEmailWrap.appendChild(pEmailEditWrap);
    header.appendChild(parentEmailWrap);
    adminStudentDetailInner.appendChild(header);

    const att = stats.flashcards.attempts || 0;
    const cor = stats.flashcards.correct || 0;

    const statRow = document.createElement("div");
    statRow.className = "admin-stat-row";
    function appendStatCard(label, value) {
      const card = document.createElement("div");
      card.className = "admin-stat-card";
      const v = document.createElement("div");
      v.className = "admin-stat-card__value";
      v.textContent = value;
      const lab = document.createElement("div");
      lab.className = "admin-stat-card__label";
      lab.textContent = label;
      card.appendChild(v);
      card.appendChild(lab);
      statRow.appendChild(card);
    }
    appendStatCard(I18n.t("admin_student_stat_cards_reviewed"), String(att));
    appendStatCard(I18n.t("admin_student_stat_accuracy"), formatPct(cor, att));
    appendStatCard(I18n.t("admin_student_stat_quiz_sessions"), String(stats.quizSessions || 0));
    appendStatCard(
      I18n.t("admin_student_stat_exercises"),
      String(stats.completedExercises.length)
    );
    appendStatCard(I18n.t("admin_student_stat_streak"), String(lh.streak || 0));
    adminStudentDetailInner.appendChild(statRow);

    const secDeck = document.createElement("section");
    secDeck.className = "admin-detail-section";
    const hDeck = document.createElement("h4");
    hDeck.textContent = I18n.t("admin_student_by_deck");
    secDeck.appendChild(hDeck);
    const deckKeys = Object.keys(stats.flashcardsByDeck || {}).sort();
    if (!deckKeys.length) {
      const p = document.createElement("p");
      p.className = "admin-detail-empty";
      p.textContent = I18n.t("admin_student_no_deck_stats");
      secDeck.appendChild(p);
    } else {
      deckKeys.forEach(function (dk) {
        const row = stats.flashcardsByDeck[dk];
        const a = row.attempts || 0;
        const c = row.correct || 0;
        const p = a ? (c / a) * 100 : 0;
        appendAdminBarRow(secDeck, dk.split("|").join(" → "), p);
      });
    }
    adminStudentDetailInner.appendChild(secDeck);

    const secSess = document.createElement("section");
    secSess.className = "admin-detail-section";
    const hSess = document.createElement("h4");
    hSess.textContent = I18n.t("admin_student_flash_sessions");
    secSess.appendChild(hSess);
    const sessions = (stats.flashcardSessions || []).slice(-12).reverse();
    if (!sessions.length) {
      const p = document.createElement("p");
      p.className = "admin-detail-empty";
      p.textContent = I18n.t("admin_student_no_sessions");
      secSess.appendChild(p);
    } else {
      const ul = document.createElement("ul");
      ul.className = "admin-detail-list";
      sessions.forEach(function (s) {
        const total = s.total || 0;
        const sessPct = total ? Math.round(((s.correct || 0) / total) * 100) : 0;
        const deckName = [s.level, s.topic].filter(Boolean).join(" → ");
        const li = document.createElement("li");
        li.textContent =
          (s.at ? new Date(s.at).toLocaleString() : "") +
          " · " +
          deckName +
          " · " +
          I18n.t("admin_student_session_cards", { n: String(total) }) +
          " · " +
          String(sessPct) +
          "%" +
          (s.mode === "wrong_retry" ? " · " + I18n.t("admin_student_mode_wrong_retry") : "");
        ul.appendChild(li);
      });
      secSess.appendChild(ul);
    }
    adminStudentDetailInner.appendChild(secSess);

    const secQuiz = document.createElement("section");
    secQuiz.className = "admin-detail-section";
    const hQuiz = document.createElement("h4");
    hQuiz.textContent = I18n.t("admin_student_quiz_title");
    secQuiz.appendChild(hQuiz);
    const qlog = (stats.quizSessionLog || []).slice(-12).reverse();
    if (!qlog.length) {
      const p = document.createElement("p");
      p.className = "admin-detail-empty";
      p.textContent = I18n.t("admin_student_no_quiz_log");
      secQuiz.appendChild(p);
    } else {
      const ul = document.createElement("ul");
      ul.className = "admin-detail-list";
      qlog.forEach(function (q) {
        const li = document.createElement("li");
        li.textContent =
          (q.at ? new Date(q.at).toLocaleString() : "") +
          " · " +
          q.level +
          " " +
          q.mode +
          " · " +
          String(q.score) +
          "/" +
          String(q.total) +
          " (" +
          String(q.pct) +
          "%)";
        ul.appendChild(li);
      });
      secQuiz.appendChild(ul);
    }
    const bestKeys = Object.keys(stats.quizBest || {});
    if (bestKeys.length) {
      const hBest = document.createElement("h4");
      hBest.textContent = I18n.t("admin_student_quiz_best");
      hBest.className = "admin-detail-subheading";
      secQuiz.appendChild(hBest);
      bestKeys.sort().forEach(function (k) {
        appendAdminBarRow(secQuiz, k, stats.quizBest[k]);
      });
    }
    adminStudentDetailInner.appendChild(secQuiz);

    const secEx = document.createElement("section");
    secEx.className = "admin-detail-section";
    const hEx = document.createElement("h4");
    hEx.textContent = I18n.t("admin_student_exercises");
    secEx.appendChild(hEx);
    if (!stats.completedExercises.length) {
      const p = document.createElement("p");
      p.className = "admin-detail-empty";
      p.textContent = I18n.t("account_no_exercises_done");
      secEx.appendChild(p);
    } else {
      const exDates = {};
      (stats.exerciseCompletionLog || []).forEach(function (entry) {
        if (entry && entry.topic && entry.at) exDates[entry.topic] = entry.at;
      });
      const ul = document.createElement("ul");
      ul.className = "admin-detail-list";
      stats.completedExercises.forEach(function (item) {
        const li = document.createElement("li");
        const when = exDates[item] ? " · " + new Date(exDates[item]).toLocaleDateString() : "";
        li.textContent = item + when;
        ul.appendChild(li);
      });
      secEx.appendChild(ul);
    }
    adminStudentDetailInner.appendChild(secEx);

    const studentLevel = lh.lastLevel || null;
    const hwAllItems =
      studentLevel && learningData[studentLevel] && learningData[studentLevel].homeworkChecklist
        ? learningData[studentLevel].homeworkChecklist
        : [];
    const hwDoneIds = studentHomeworkDoneIds(stats, studentLevel || "");
    const secHw = document.createElement("section");
    secHw.className = "admin-detail-section";
    const hHw = document.createElement("h4");
    hHw.textContent = I18n.t("admin_student_homework");
    secHw.appendChild(hHw);
    if (!hwAllItems.length) {
      const p = document.createElement("p");
      p.className = "admin-detail-empty";
      p.textContent = I18n.t("admin_student_homework_none_for_level");
      secHw.appendChild(p);
    } else {
      const summary = document.createElement("p");
      summary.className = "admin-detail-empty";
      summary.style.marginBottom = "0.45rem";
      summary.textContent = I18n.t("admin_student_homework_summary", {
        done: String(hwDoneIds.length),
        total: String(hwAllItems.length),
      });
      secHw.appendChild(summary);
      if (hwDoneIds.length) {
        const idToLabel = Object.create(null);
        hwAllItems.forEach(function (item) {
          if (item && item.id) idToLabel[item.id] = item.en || item.fr || item.id;
        });
        const ul = document.createElement("ul");
        ul.className = "admin-detail-list";
        hwDoneIds.forEach(function (id) {
          const li = document.createElement("li");
          li.textContent = idToLabel[id] ? id + " · " + idToLabel[id] : id;
          ul.appendChild(li);
        });
        secHw.appendChild(ul);
      }
    }
    adminStudentDetailInner.appendChild(secHw);
  }

  function studentHomeworkDoneIds(stats, lvl) {
    var lh = (stats && stats.learningHub) || {};
    var done = (lh.homeworkChecklist && lh.homeworkChecklist[lvl]) || {};
    return Object.keys(done).filter(function (k) { return done[k]; });
  }

  function markAccountOnboardingShown() {
    const user = getActiveUser();
    if (!user) return;
    const lh = ensureLearningHub(ensureStats(user));
    lh.onboardingShown = true;
    saveUsers();
  }

  const CONTENT_LEVELS = ["beginner", "intermediate", "advanced"];

  function recordLastLevel(level) {
    if (!level || CONTENT_LEVELS.indexOf(level) < 0) return;
    const user = getActiveUser();
    if (!user) return;
    const lh = ensureLearningHub(ensureStats(user));
    lh.lastLevel = level;
    saveUsers();
    renderAccountPanel();
  }

  function navigateToContentLevel(level) {
    window.scrollTo({ top: 0, behavior: "instant" });
    setContentPanelOpen(true);
    panelHome.classList.add("hidden");
    panels.forEach(function (p) {
      p.classList.toggle("hidden", p.id !== "panel-content");
    });
    mainNav.classList.add("hidden");
    btnHome.classList.remove("hidden");
    pendingLevel = null;
    levelPicker.classList.add("hidden");
    contentPasswordOverlay.classList.add("hidden");
    contentPasswordInput.value = "";
    contentPasswordError.classList.add("hidden");
    document.querySelectorAll(".btn-level").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-level") === level);
    });
    document.querySelectorAll(".level-article").forEach(function (art) {
      art.classList.toggle("hidden", art.id !== "content-" + level);
    });
    const article = document.getElementById("content-" + level);
    if (article) {
      resetHubToLanding(article.querySelector(".learning-hub"));
    }
    recordLastLevel(level);
  }

  function renderAccountContinue(lh) {
    const existing = accountDashboard.querySelector(".account-continue");
    if (existing) existing.remove();
    const level = lh && lh.lastLevel;
    if (!level || CONTENT_LEVELS.indexOf(level) < 0) return;

    const card = document.createElement("div");
    card.className = "account-continue";

    const textWrap = document.createElement("div");
    const heading = document.createElement("h3");
    heading.className = "account-continue__heading";
    heading.textContent = I18n.t("account_continue_heading");
    const levelLine = document.createElement("p");
    levelLine.className = "account-continue__level";
    levelLine.textContent = I18n.t("level_" + level);
    textWrap.appendChild(heading);
    textWrap.appendChild(levelLine);

    const goBtn = document.createElement("button");
    goBtn.type = "button";
    goBtn.className = "btn-primary account-continue__btn";
    goBtn.textContent = I18n.t("account_continue_btn", { level: I18n.t("level_" + level) });
    goBtn.addEventListener("click", function () {
      navigateToContentLevel(level);
    });

    card.appendChild(textWrap);
    card.appendChild(goBtn);
    accountDashboard.insertBefore(card, accountProgressCards);
  }

  function renderAccountOnboarding(user, lh) {
    const existing = accountDashboard.querySelector(".account-onboarding");
    if (existing) existing.remove();
    if (!user || lh.onboardingShown) return;

    const card = document.createElement("div");
    card.className = "account-onboarding";
    card.setAttribute("role", "region");
    card.setAttribute("aria-labelledby", "account-onboarding-title");

    const dismissBtn = document.createElement("button");
    dismissBtn.type = "button";
    dismissBtn.className = "btn-icon-close account-onboarding__dismiss";
    dismissBtn.setAttribute("aria-label", I18n.t("account_onboarding_dismiss"));
    dismissBtn.textContent = "×";

    const title = document.createElement("h3");
    title.className = "account-onboarding__title";
    title.id = "account-onboarding-title";
    title.textContent = I18n.t("account_onboarding_welcome", {
      name: user.fullName || activeUsername,
    });

    const bodyEn = document.createElement("p");
    bodyEn.className = "account-onboarding__body";
    bodyEn.lang = "en";
    bodyEn.textContent = I18n.t("account_onboarding_start_en");

    const bodyFr = document.createElement("p");
    bodyFr.className = "account-onboarding__body";
    bodyFr.lang = "fr";
    bodyFr.textContent = I18n.t("account_onboarding_start_fr");

    const goBtn = document.createElement("button");
    goBtn.type = "button";
    goBtn.className = "btn-primary account-onboarding__go";
    goBtn.textContent = I18n.t("account_onboarding_btn");

    dismissBtn.addEventListener("click", function () {
      markAccountOnboardingShown();
      renderAccountPanel();
    });
    goBtn.addEventListener("click", function () {
      markAccountOnboardingShown();
      navigateToContentLevel("beginner");
    });

    card.appendChild(dismissBtn);
    card.appendChild(title);
    card.appendChild(bodyEn);
    card.appendChild(bodyFr);
    card.appendChild(goBtn);
    accountDashboard.insertBefore(card, accountProgressCards);
  }

  function renderAccountPanel() {
    syncPointsForActiveUser();
    if (!accountAuth || !accountDashboard) return;
    const user = getActiveUser();
    if (!user) {
      accountAuth.classList.remove("hidden");
      accountDashboard.classList.add("hidden");
      return;
    }
    const stats = ensureStats(user);
    const lh = ensureLearningHub(stats);
    accountAuth.classList.add("hidden");
    accountDashboard.classList.remove("hidden");
    accountWelcome.textContent = I18n.t("account_welcome_logged_in", { user: activeUsername });
    const existingBadge = accountWelcome.querySelector(".account-level-badge");
    if (existingBadge) existingBadge.remove();
    if (lh.lastLevel && CONTENT_LEVELS.indexOf(lh.lastLevel) >= 0) {
      const levelBadge = document.createElement("span");
      levelBadge.className = "account-level-badge account-level-badge--" + lh.lastLevel;
      levelBadge.textContent = I18n.t("level_" + lh.lastLevel);
      accountWelcome.appendChild(levelBadge);
    }
    renderAccountContinue(lh);
    renderAccountOnboarding(user, lh);
    accountProgressCards.innerHTML = "";
    const metrics = [
      I18n.t("account_metric_flash_accuracy", {
        correct: String(stats.flashcards.correct),
        attempts: String(stats.flashcards.attempts),
        pct: formatPct(stats.flashcards.correct, stats.flashcards.attempts),
      }),
      I18n.t("account_metric_quiz_sessions", { n: String(stats.quizSessions) }),
      I18n.t("account_metric_exercises_done", { n: String(stats.completedExercises.length) }),
    ];
    Object.keys(stats.quizBest).forEach(function (k) {
      metrics.push(
        I18n.t("account_metric_quiz_best", { mode: k, pct: String(stats.quizBest[k]) })
      );
    });
    metrics.forEach(function (txt) {
      const card = document.createElement("div");
      card.className = "account-progress-metric";
      card.textContent = txt;
      accountProgressCards.appendChild(card);
    });
    accountCompletedExercises.innerHTML = "";
    if (!stats.completedExercises.length) {
      const li = document.createElement("li");
      li.textContent = I18n.t("account_no_exercises_done");
      accountCompletedExercises.appendChild(li);
      return;
    }
    stats.completedExercises.slice(-20).forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      accountCompletedExercises.appendChild(li);
    });
  }

  function renderAdminLeaderboard() {
    if (!adminLeaderboardTbody) return;
    adminLeaderboardTbody.innerHTML = "";
    var rows = Object.keys(users).map(function (username) {
      var user = users[username];
      var stats = ensureStats(user);
      var lh = stats.learningHub || {};
      var cards = (stats.flashcards && stats.flashcards.attempts) || 0;
      var quizzes = stats.quizSessions || 0;
      var exercises = (stats.completedExercises || []).length;
      var lvl = lh.lastLevel || "";
      var hwIds = studentHomeworkDoneIds(stats, lvl);
      var hw = hwIds.length;
      var score = cards * 1 + quizzes * 5 + exercises * 10 + hw * 3;
      return {
        username: username,
        name: user.fullName || username,
        level: lvl,
        score: score,
        cards: cards,
        quizzes: quizzes,
        exercises: exercises,
        hw: hw,
      };
    });
    rows.sort(function (a, b) { return b.score - a.score; });
    var topScore = rows.length ? rows[0].score : -1;
    rows.forEach(function (row, idx) {
      var tr = document.createElement("tr");
      var rankTd = document.createElement("td");
      rankTd.textContent = (row.score === topScore && topScore > 0 ? "🏆 " : "") + String(idx + 1);
      var nameTd = document.createElement("td");
      nameTd.textContent = row.name;
      var levelTd = document.createElement("td");
      if (row.level && CONTENT_LEVELS.indexOf(row.level) >= 0) {
        var badge = document.createElement("span");
        badge.className = "admin-level-badge admin-level-badge--" + row.level;
        badge.textContent = I18n.t("level_" + row.level);
        levelTd.appendChild(badge);
      } else {
        levelTd.textContent = "—";
      }
      var scoreTd = document.createElement("td");
      scoreTd.textContent = String(row.score);
      scoreTd.style.fontWeight = "700";
      var cardsTd = document.createElement("td");
      cardsTd.textContent = String(row.cards);
      var quizzesTd = document.createElement("td");
      quizzesTd.textContent = String(row.quizzes);
      var exTd = document.createElement("td");
      exTd.textContent = String(row.exercises);
      var hwTd = document.createElement("td");
      hwTd.textContent = String(row.hw);
      tr.appendChild(rankTd);
      tr.appendChild(nameTd);
      tr.appendChild(levelTd);
      tr.appendChild(scoreTd);
      tr.appendChild(cardsTd);
      tr.appendChild(quizzesTd);
      tr.appendChild(exTd);
      tr.appendChild(hwTd);
      if (row.score === topScore && topScore > 0) {
        tr.style.background = "var(--accent-soft)";
      }
      adminLeaderboardTbody.appendChild(tr);
    });
    if (!rows.length) {
      var emptyTr = document.createElement("tr");
      var emptyTd = document.createElement("td");
      emptyTd.colSpan = 8;
      emptyTd.className = "admin-detail-empty";
      emptyTd.textContent = I18n.t("admin_leaderboard_empty");
      emptyTr.appendChild(emptyTd);
      adminLeaderboardTbody.appendChild(emptyTr);
    }
  }

  // ── Class Planner ─────────────────────────────────────────────────────────
  var PLANNER_KEY = "andronicus_planner_v1";

  var PLANNER_CURRICULUM = {
    beginner: {
      label: "Beginner",
      colour: "#2d6ba8",
      topics: [
        "Introductions — greetings, name, age, where you're from",
        "Numbers, dates and times",
        "The alphabet — spelling and pronunciation",
        "Present Simple — to be (am / is / are)",
        "Present Simple — have / has",
        "Present Simple — regular verbs (positive sentences)",
        "Present Simple — negatives and questions",
        "Describing people — physical appearance and personality",
        "Family vocabulary and relationships",
        "My home — rooms, furniture and prepositions",
        "Food and drink — vocabulary",
        "Food and drink — likes, dislikes and opinions",
        "Daily routines — adverbs of frequency (always, usually…)",
        "Days of the week, months and seasons",
        "Colours, shapes and sizes",
        "Present Continuous — what are you doing right now?",
        "Can / Can't — ability and permission",
        "Telling the time — quarter past, half past, etc.",
        "Shopping — prices, quantities and polite requests",
        "Directions — asking and giving (turn left, go straight on…)",
        "Transport and getting around",
        "Past Simple — verb to be (was / were)",
        "Past Simple — regular verbs (-ed endings)",
        "Past Simple — irregular verbs (group 1: go/went, come/came…)",
        "Past Simple — irregular verbs (group 2: buy/bought, think/thought…)",
        "Question words — who, what, where, when, why, how",
        "Going to — talking about future plans",
        "The weather — adjectives and describing conditions",
        "Hobbies and free time activities",
        "Animals and nature — vocabulary",
        "Writing a short paragraph about yourself",
        "Dialogue practice — at the café / restaurant / shop",
        "Reading comprehension — short simple texts",
        "Revision and year-end test practice"
      ]
    },
    intermediate: {
      label: "Intermediate",
      colour: "#1a5090",
      topics: [
        "Narrative tenses review — past simple, past continuous, past perfect",
        "Present Perfect — experiences and recent events (have you ever…?)",
        "Present Perfect vs Past Simple — choosing the right tense",
        "Future forms — will, going to, present continuous for plans",
        "First Conditional — real and likely situations",
        "Second Conditional — imaginary / unlikely situations",
        "Third Conditional — regrets and impossible past hypotheticals",
        "Mixed Conditionals — combining 2nd and 3rd",
        "Passive Voice — present simple and past simple",
        "Passive Voice — advanced forms and when to use passive",
        "Modal Verbs — obligation and advice (must, have to, should, ought to)",
        "Modal Verbs — deduction and speculation (must be, can't be, might be)",
        "Reported Speech — statements and tense changes",
        "Reported Speech — questions, commands and time expressions",
        "Relative Clauses — defining vs non-defining",
        "Articles — a / an / the / zero article rules",
        "Countable and uncountable nouns",
        "Comparatives and superlatives — review and extension",
        "Adjective order (size, colour, origin, material…)",
        "Linking words — addition, contrast, reason and result",
        "Formal vs informal writing — register and tone",
        "Writing a formal email",
        "Essay writing — argumentative structure (intro, argument, counter, conclusion)",
        "Writing a letter of complaint",
        "Reading comprehension — newspaper articles",
        "Vocabulary — idioms and phrasal verbs (part 1)",
        "Vocabulary — idioms and phrasal verbs (part 2)",
        "Speaking — discussion and debate techniques",
        "Listening skills — inference, gist and detail",
        "Prepositions — time, place and movement",
        "Gerunds and infinitives — verb patterns",
        "Wish / If Only — expressing regrets and wishes",
        "So / Such / Too / Enough",
        "Revision and exam technique session"
      ]
    },
    advanced: {
      label: "Advanced",
      colour: "#0f3d7a",
      topics: [
        "Complex tense review — all forms in context",
        "Advanced Conditionals — 3rd and mixed in depth",
        "Inversion — formal and literary use (Not only… / Rarely…)",
        "Cleft sentences — emphasis and focus (It was… / What I need is…)",
        "Advanced Passive — causative have / get",
        "Subjunctive — formal register and fixed phrases",
        "Discourse Markers — cohesion and coherence in academic writing",
        "Academic Vocabulary — AWL word families",
        "Hedging language — expressing certainty, doubt and probability",
        "Argumentative Essay — planning, structure and academic style",
        "Discursive Essay — presenting a balanced argument",
        "Descriptive Writing — literary style and sensory detail",
        "Narrative Writing — opening, tension, climax and resolution",
        "Literary Analysis — themes, motifs and symbolism",
        "Poetry Analysis — form, structure, language and imagery",
        "Short Story Analysis — character, setting and narrative voice",
        "Drama Analysis — Shakespeare extracts and theatrical techniques",
        "Comparative Analysis — comparing two texts",
        "Language Register — formal, informal, academic, colloquial",
        "Newspaper Editorial — language analysis and bias",
        "Advertisement Analysis — persuasive techniques and rhetoric",
        "Speeches and Rhetoric — ethos, pathos, logos",
        "Advanced Reading — inference, tone and author's purpose",
        "Speed Reading and Summarising",
        "Paraphrasing and Avoiding Plagiarism",
        "Vocabulary in Context — advanced collocations and connotations",
        "Idioms and Figurative Language in literary texts",
        "False Friends — common English/French confusions",
        "Pronunciation — word stress, weak forms and connected speech",
        "Interview and Presentation Skills",
        "Oral Examination Technique and Strategies",
        "Past Papers — comprehension section",
        "Past Papers — composition section",
        "Final Revision and Exam Strategy Session"
      ]
    }
  };

  function loadPlannerState() {
    try {
      return JSON.parse(localStorage.getItem(PLANNER_KEY)) || {};
    } catch (e) { return {}; }
  }

  function savePlannerState(state) {
    try { localStorage.setItem(PLANNER_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function renderAdminPlanner() {
    if (!adminPlannerContent) return;
    var state = loadPlannerState();
    var html = '<div class="planner-header"><h3 class="planner-title">Class Planner — September to May</h3><p class="planner-subtitle">Tick off topics as you teach them. Progress saves automatically.</p></div>';

    Object.keys(PLANNER_CURRICULUM).forEach(function (levelKey) {
      var level = PLANNER_CURRICULUM[levelKey];
      var done = level.topics.filter(function (_, i) { return state[levelKey] && state[levelKey][i]; }).length;
      var total = level.topics.length;
      var pct = Math.round((done / total) * 100);

      html += '<div class="planner-level">';
      html += '<div class="planner-level__header">';
      html += '<span class="planner-level__label" style="border-left:4px solid ' + level.colour + '">' + level.label + '</span>';
      html += '<span class="planner-level__count">' + done + ' / ' + total + ' topics</span>';
      html += '</div>';
      html += '<div class="planner-progress-bar"><div class="planner-progress-bar__fill" style="width:' + pct + '%;background:' + level.colour + '"></div></div>';
      html += '<ul class="planner-topic-list">';

      level.topics.forEach(function (topic, i) {
        var checked = state[levelKey] && state[levelKey][i] ? true : false;
        var itemId = "planner-" + levelKey + "-" + i;
        html += '<li class="planner-topic-item' + (checked ? " planner-topic-item--done" : "") + '">';
        html += '<label class="planner-topic-label" for="' + itemId + '">';
        html += '<input type="checkbox" id="' + itemId + '" class="planner-checkbox" data-level="' + levelKey + '" data-idx="' + i + '"' + (checked ? " checked" : "") + '>';
        html += '<span class="planner-topic-num">Week ' + (i + 1) + '</span>';
        html += '<span class="planner-topic-text">' + topic + '</span>';
        html += '</label>';
        html += '</li>';
      });

      html += '</ul></div>';
    });

    adminPlannerContent.innerHTML = html;

    // Attach checkbox listeners
    adminPlannerContent.querySelectorAll(".planner-checkbox").forEach(function (cb) {
      cb.addEventListener("change", function () {
        var levelKey = cb.getAttribute("data-level");
        var idx = parseInt(cb.getAttribute("data-idx"), 10);
        var state = loadPlannerState();
        if (!state[levelKey]) state[levelKey] = {};
        if (cb.checked) {
          state[levelKey][idx] = true;
        } else {
          delete state[levelKey][idx];
        }
        savePlannerState(state);
        renderAdminPlanner();
      });
    });
  }
  // ──────────────────────────────────────────────────────────────────────────

  function renderAdminReminderBanner() {
    if (!adminReminderBanner) return;
    adminReminderBanner.innerHTML = "";
    adminReminderBanner.className = "admin-reminder-banner";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDay.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((lastDay - today) / 86400000);

    const dateStr = lastDay.toLocaleDateString("en-IE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let countdownText;
    if (daysLeft <= 0) {
      countdownText = "Due today!";
      adminReminderBanner.classList.add("admin-reminder-banner--urgent");
    } else if (daysLeft <= 5) {
      countdownText = "in " + daysLeft + " day" + (daysLeft === 1 ? "" : "s");
      adminReminderBanner.classList.add("admin-reminder-banner--warning");
    } else {
      countdownText = "in " + daysLeft + " day" + (daysLeft === 1 ? "" : "s");
    }

    const row1 = document.createElement("p");
    row1.className = "admin-reminder-banner__line";
    row1.innerHTML =
      "<span class='admin-reminder-banner__icon'>📧</span>" +
      "<span>Next progress email due: <strong>" + dateStr + "</strong> — <em>" + countdownText + "</em></span>";

    const row2 = document.createElement("p");
    row2.className = "admin-reminder-banner__line";
    row2.innerHTML =
      "<span class='admin-reminder-banner__icon'>💶</span>" +
      "<span>Payment collection due: <strong>" + dateStr + "</strong> — <em>" + countdownText + "</em></span>";

    const row3 = document.createElement("p");
    row3.className = "admin-reminder-banner__note";
    row3.innerHTML =
      "Don't forget to send progress emails to students — use the <strong>Send monthly progress emails</strong> button in the Payments tab.";

    adminReminderBanner.appendChild(row1);
    adminReminderBanner.appendChild(row2);
    adminReminderBanner.appendChild(row3);
  }

  function renderAdminPanel() {
    if (!adminLoginWrap || !adminDashboard || !adminStudentsTableBody) return;
    adminLoginWrap.classList.toggle("hidden", adminUnlocked);
    adminDashboard.classList.toggle("hidden", !adminUnlocked);
    if (!adminUnlocked) return;
    renderAdminReminderBanner();
    if (adminBookingsTableBody) {
      adminBookingsTableBody.innerHTML = "";
      bookings
        .slice()
        .reverse()
        .forEach(function (b) {
          const tr = document.createElement("tr");
          [bookingDisplayName(b), b.phone, b.level, (b.slots || []).join(", "), b.createdAt].forEach(
            function (txt) {
            const td = document.createElement("td");
            td.textContent = txt || I18n.t("admin_table_empty");
            tr.appendChild(td);
            }
          );
          const actionTd = document.createElement("td");
          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "flashcard-btn";
          removeBtn.textContent = I18n.t("admin_booking_remove");
          removeBtn.addEventListener("click", async function () {
            const ok = window.confirm(
              I18n.t("admin_booking_remove_confirm", { name: bookingDisplayName(b) || "…" })
            );
            if (!ok) return;
            if (isSupabaseConfigured() && hasAdminApiSecret() && b.id) {
              const sb = getSupabaseClient();
              if (!sb) return;
              const { error } = await sb.rpc("admin_delete_booking", {
                p_secret: getSupabaseConfig().adminApiSecret,
                p_id: b.id,
              });
              if (error) {
                console.error(error);
                return;
              }
              await refreshAdminCloudData();
              return;
            }
            bookings = bookings.filter(function (x) {
              if (b.id != null && x.id != null) return x.id !== b.id;
              return x !== b;
            });
            saveBookings();
            renderAdminPanel();
          });
          actionTd.appendChild(removeBtn);
          tr.appendChild(actionTd);
          adminBookingsTableBody.appendChild(tr);
        });
    }
    const progressTabVisible = adminProgressTab && !adminProgressTab.classList.contains("hidden");
    if (
      progressTabVisible &&
      adminViewingStudent &&
      users[adminViewingStudent] &&
      adminStudentListWrap &&
      adminStudentDetail &&
      adminStudentDetailInner
    ) {
      adminStudentListWrap.classList.add("hidden");
      adminStudentDetail.classList.remove("hidden");
      renderAdminStudentDetail(adminViewingStudent);
    } else {
      if (adminViewingStudent && !users[adminViewingStudent]) adminViewingStudent = null;
      if (adminStudentListWrap) adminStudentListWrap.classList.remove("hidden");
      if (adminStudentDetail) adminStudentDetail.classList.add("hidden");
      adminStudentsTableBody.innerHTML = "";
      if (!adminStudentsFetched && !adminStudentsLoading) {
        void fetchAdminStudents();
      }
      if (adminStudentsLoading) {
        const loadingTr = document.createElement("tr");
        const loadingTd = document.createElement("td");
        loadingTd.colSpan = 6;
        loadingTd.textContent = I18n.t("admin_cloud_syncing");
        loadingTr.appendChild(loadingTd);
        adminStudentsTableBody.appendChild(loadingTr);
      } else if (adminStudentsError) {
        const errorTr = document.createElement("tr");
        const errorTd = document.createElement("td");
        errorTd.colSpan = 6;
        errorTd.style.color = "#b74848";
        errorTd.textContent = I18n.t("admin_cloud_fail_prefix") + " " + adminStudentsError;
        errorTr.appendChild(errorTd);
        adminStudentsTableBody.appendChild(errorTr);
      }
      const studentUsernames = adminStudentsLoading ? [] : Object.keys(users);
      studentUsernames.forEach(function (username) {
        const user = users[username];
        const stats = ensureStats(user);
        const tr = document.createElement("tr");
        const nameTd = document.createElement("td");
        nameTd.textContent = user.fullName || username;
        const userTd = document.createElement("td");
        userTd.textContent = username;
        const flashTd = document.createElement("td");
        flashTd.textContent =
          String(stats.flashcards.correct) +
          "/" +
          String(stats.flashcards.attempts) +
          " (" +
          formatPct(stats.flashcards.correct, stats.flashcards.attempts) +
          ")";
        const quizTd = document.createElement("td");
        quizTd.textContent = String(stats.quizSessions);
        const doneTd = document.createElement("td");
        doneTd.textContent = String(stats.completedExercises.length);
        const actionTd = document.createElement("td");
        const viewBtn = document.createElement("button");
        viewBtn.type = "button";
        viewBtn.className = "flashcard-btn";
        viewBtn.textContent = I18n.t("admin_student_view");
        viewBtn.addEventListener("click", function () {
          adminViewingStudent = username;
          renderAdminPanel();
        });
        const editNameBtn = document.createElement("button");
        editNameBtn.type = "button";
        editNameBtn.className = "flashcard-btn";
        editNameBtn.textContent = I18n.t("admin_edit_name");
        editNameBtn.addEventListener("click", function () {
          const next = window.prompt(
            I18n.t("admin_edit_name_prompt", { user: username }),
            user.fullName || username
          );
          if (!next) return;
          user.fullName = next.trim();
          saveUsers();
          renderAdminPanel();
        });
        const resetPassBtn = document.createElement("button");
        resetPassBtn.type = "button";
        resetPassBtn.className = "flashcard-btn";
        resetPassBtn.textContent = I18n.t("admin_reset_password");
        resetPassBtn.addEventListener("click", function () {
          const next = window.prompt(I18n.t("admin_reset_password_prompt", { user: username }));
          if (!next) return;
          user.password = next.trim();
          saveUsers();
        });
        actionTd.appendChild(viewBtn);
        actionTd.appendChild(editNameBtn);
        actionTd.appendChild(resetPassBtn);
        tr.appendChild(nameTd);
        tr.appendChild(userTd);
        tr.appendChild(flashTd);
        tr.appendChild(quizTd);
        tr.appendChild(doneTd);
        tr.appendChild(actionTd);
        adminStudentsTableBody.appendChild(tr);
      });
    }

    if (adminPaymentList) {
      adminPaymentList.innerHTML = "";
      paymentChecklist.forEach(function (item) {
        const li = document.createElement("li");
        li.className = "admin-payment-item";
        const left = document.createElement("div");
        left.className = "admin-payment-item__left";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!item.paid;
        cb.addEventListener("change", async function () {
          const nextPaid = cb.checked;
          if (isSupabaseConfigured() && hasAdminApiSecret()) {
            const sb = getSupabaseClient();
            if (!sb) return;
            const { error } = await sb.rpc("admin_set_payment_paid", {
              p_secret: getSupabaseConfig().adminApiSecret,
              p_id: item.id,
              p_paid: nextPaid,
            });
            if (error) {
              console.error(error);
              cb.checked = !nextPaid;
              return;
            }
            item.paid = nextPaid;
          } else {
            item.paid = nextPaid;
            savePayments();
          }
          renderAdminPanel();
        });
        const name = document.createElement("span");
        name.textContent =
          item.name + I18n.t(item.paid ? "admin_payment_paid_badge" : "admin_payment_unpaid_badge");
        left.appendChild(cb);
        left.appendChild(name);
        const owedWrap = document.createElement("label");
        owedWrap.className = "admin-payment-owed";
        const owedText = document.createElement("span");
        owedText.textContent = I18n.t("admin_payment_owed_short");
        const owedInput = document.createElement("input");
        owedInput.type = "number";
        owedInput.min = "0";
        owedInput.step = "0.01";
        owedInput.value = String(
          Number.isFinite(Number(item.owedAmount)) ? Number(item.owedAmount).toFixed(2) : "0.00"
        );
        owedInput.addEventListener("change", async function () {
          const nextAmount = Math.max(0, Number(owedInput.value || 0));
          owedInput.value = nextAmount.toFixed(2);
          if (isSupabaseConfigured() && hasAdminApiSecret() && item.id) {
            const sb = getSupabaseClient();
            if (!sb) return;
            const { error } = await sb.rpc("admin_set_payment_owed", {
              p_secret: getSupabaseConfig().adminApiSecret,
              p_id: item.id,
              p_owed_amount: nextAmount,
            });
            if (error) {
              console.error(error);
              owedInput.value = Number(item.owedAmount || 0).toFixed(2);
              return;
            }
            item.owedAmount = nextAmount;
          } else {
            item.owedAmount = nextAmount;
            savePayments();
          }
          renderAdminPanel();
        });
        owedWrap.appendChild(owedText);
        owedWrap.appendChild(owedInput);
        left.appendChild(owedWrap);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "flashcard-btn";
        remove.textContent = I18n.t("admin_payment_remove");
        remove.addEventListener("click", async function () {
          if (isSupabaseConfigured() && hasAdminApiSecret()) {
            const sb = getSupabaseClient();
            if (!sb) return;
            const { error } = await sb.rpc("admin_delete_payment", {
              p_secret: getSupabaseConfig().adminApiSecret,
              p_id: item.id,
            });
            if (error) {
              console.error(error);
              return;
            }
            await refreshAdminCloudData();
            return;
          }
          paymentChecklist = paymentChecklist.filter(function (x) {
            return x.id !== item.id;
          });
          savePayments();
          renderAdminPanel();
        });
        li.appendChild(left);
        li.appendChild(remove);
        adminPaymentList.appendChild(li);
      });
    }
    if (adminCloudRefreshBtn) {
      adminCloudRefreshBtn.classList.toggle(
        "hidden",
        !(adminUnlocked && isSupabaseConfigured() && hasAdminApiSecret())
      );
    }
  }

  if (adminStudentBackBtn) {
    adminStudentBackBtn.addEventListener("click", function () {
      adminViewingStudent = null;
      renderAdminPanel();
    });
  }

  function recordExerciseCompletion(level, topic) {
    const user = getActiveUser();
    if (!user) return { ok: false, reason: "auth" };
    const stats = ensureStats(user);
    const key = level + " - " + topic;
    if (stats.completedExercises.includes(key)) return { ok: false, reason: "exists" };
    stats.completedExercises.push(key);
    stats.exerciseCompletionLog.push({
      at: new Date().toISOString(),
      topic: key,
    });
    bumpLearningStreak(level);
    saveUsers();
    renderAccountPanel();
    return { ok: true };
  }

  function undoExerciseCompletion(level, topic) {
    const user = getActiveUser();
    if (!user) return { ok: false, reason: "auth" };
    const stats = ensureStats(user);
    const key = level + " - " + topic;
    const before = (stats.completedExercises || []).length;
    stats.completedExercises = (stats.completedExercises || []).filter(function (k) {
      return k !== key;
    });
    stats.exerciseCompletionLog = (stats.exerciseCompletionLog || []).filter(function (entry) {
      return !entry || entry.topic !== key;
    });
    if (stats.completedExercises.length === before) return { ok: false, reason: "missing" };
    saveUsers();
    renderAccountPanel();
    return { ok: true };
  }

  function recordFlashcardResult(wasCorrect, meta) {
    const user = getActiveUser();
    if (!user) return;
    const stats = ensureStats(user);
    stats.flashcards.attempts += 1;
    if (wasCorrect) stats.flashcards.correct += 1;
    if (meta && meta.level && meta.topic) {
      const dk = meta.level + "|" + meta.topic;
      if (!stats.flashcardsByDeck[dk]) {
        stats.flashcardsByDeck[dk] = { attempts: 0, correct: 0 };
      }
      stats.flashcardsByDeck[dk].attempts += 1;
      if (wasCorrect) stats.flashcardsByDeck[dk].correct += 1;
    }
    saveUsers();
  }

  function recordQuizSummary(level, mode, score, total) {
    const user = getActiveUser();
    if (!user) return;
    const stats = ensureStats(user);
    stats.quizSessions += 1;
    const pct = total ? Math.round((score / total) * 100) : 0;
    const key = level + " " + mode;
    stats.quizBest[key] = Math.max(stats.quizBest[key] || 0, pct);
    stats.quizSessionLog.push({
      at: new Date().toISOString(),
      level: level,
      mode: mode,
      score: score,
      total: total,
      pct: pct,
    });
    if (stats.quizSessionLog.length > 48) {
      stats.quizSessionLog = stats.quizSessionLog.slice(-48);
    }
    bumpLearningStreak(level);
    saveUsers();
    renderAccountPanel();
  }

  function refreshPasswordHint() {
    const intro = document.getElementById("content-password-intro");
    if (intro) intro.textContent = I18n.t("content_password_intro");
    if (!contentPasswordOverlay.classList.contains("hidden") && pendingLevel) {
      contentPasswordForLevel.textContent = I18n.t("content_opening", {
        level: I18n.t("level_" + pendingLevel),
      });
    }
  }

  window.addEventListener("andronicus:langchange", function () {
    I18n.apply();
    refreshStaticPageCopy();
    buildBookingCalendar();
    refreshPasswordHint();
    syncPasswordToggleAria();
    refreshAllLandingCardProgress();
    renderAccountPanel();
    if (adminUnlocked) renderAdminPanel();
    learningToolsLangRefreshers.forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
    updateContentBreadcrumb();
  });

  function setContentPanelOpen(on) {
    document.body.classList.toggle("content-panel-open", on);
  }

  function showLevelPicker() {
    pendingLevel = null;
    levelPicker.classList.remove("hidden");
    contentPasswordOverlay.classList.add("hidden");
    contentPasswordInput.value = "";
    contentPasswordError.classList.add("hidden");
    document.querySelectorAll(".level-article").forEach((el) => el.classList.add("hidden"));
    document.querySelectorAll(".btn-level").forEach((b) => b.classList.remove("is-active"));
    resetAllLearningHubsToLanding();
    updateContentBreadcrumb();
  }

  function getVisibleTopLevelPanel() {
    if (panelHome && !panelHome.classList.contains("hidden")) {
      return panelHome;
    }
    for (let i = 0; i < panels.length; i++) {
      if (!panels[i].classList.contains("hidden")) return panels[i];
    }
    return null;
  }

  const PANEL_FADE_MS = 150;
  let panelTransitioning = false;

  function transitionTopLevelPanel(applyView) {
    if (panelTransitioning) return;
    const current = getVisibleTopLevelPanel();
    if (!current) {
      applyView();
      return;
    }
    panelTransitioning = true;
    current.classList.add("panel--fading");
    setTimeout(function () {
      current.classList.remove("panel--fading");
      applyView();
      const next = getVisibleTopLevelPanel();
      if (!next) {
        panelTransitioning = false;
        return;
      }
      next.classList.add("panel--fading");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          next.classList.remove("panel--fading");
          panelTransitioning = false;
        });
      });
    }, PANEL_FADE_MS);
  }

  function showHome(animate) {
    if (animate !== false && getVisibleTopLevelPanel() === panelHome) {
      animate = false;
    }

    function applyHomeView() {
      panelHome.classList.remove("hidden");
      panels.forEach((p) => p.classList.add("hidden"));
      mainNav.classList.remove("hidden");
      btnHome.classList.add("hidden");
      setContentPanelOpen(false);
      resetContentPanel();
      updateMobileNav("home");
    }

    if (animate === false) {
      applyHomeView();
      return;
    }
    transitionTopLevelPanel(applyHomeView);
  }

  function forceInitialHomeView() {
    showHome(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function resetContentPanel() {
    showLevelPicker();
  }

  function openSection(id, animate) {
    const target = id === "home" ? panelHome : document.getElementById("panel-" + id);
    if (!target) return;
    if (getVisibleTopLevelPanel() === target) return;

    function applySectionView() {
      setContentPanelOpen(id === "content");
      panelHome.classList.add("hidden");
      panels.forEach((p) => {
        p.classList.toggle("hidden", p.id !== "panel-" + id);
      });
      mainNav.classList.add("hidden");
      btnHome.classList.remove("hidden");

      if (id === "content") {
        window.scrollTo({ top: 0, behavior: "instant" });
        resetContentPanel();
      }
      if (id === "account") {
        renderAccountPanel();
      }
      if (id === "admin") {
        renderAdminPanel();
      }
      if (id === "booking") {
        if (bookingForm) bookingForm.classList.remove("hidden");
        if (bookingSuccess) bookingSuccess.classList.add("hidden");
        if (bookingSubmitError) {
          bookingSubmitError.textContent = "";
          bookingSubmitError.classList.add("hidden");
        }
        if (bookingSuccessWarning) {
          bookingSuccessWarning.textContent = "";
          bookingSuccessWarning.classList.add("hidden");
        }
      }
      updateMobileNav(MOBILE_NAV_SECTIONS.includes(id) ? id : null);
    }

    if (animate === false) {
      applySectionView();
      return;
    }
    transitionTopLevelPanel(applySectionView);
  }

  mainNav.addEventListener("click", (e) => {
    const card = e.target.closest("[data-section]");
    if (!card) return;
    openSection(card.getAttribute("data-section"));
  });

  btnHome.addEventListener("click", showHome);

  if (mobileBottomNav) {
    mobileBottomNav.addEventListener("click", function (e) {
      const btn = e.target.closest(".mobile-bottom-nav__btn");
      if (!btn) return;
      const section = btn.getAttribute("data-section");
      if (section === "home") showHome();
      else openSection(section);
    });
  }

  const btnHomeContactBooking = document.getElementById("btn-home-contact-booking");
  if (btnHomeContactBooking) {
    btnHomeContactBooking.addEventListener("click", function () {
      openSection("booking");
    });
  }

  const btnProcessOpenBooking = document.getElementById("btn-process-open-booking");
  if (btnProcessOpenBooking) {
    btnProcessOpenBooking.addEventListener("click", function () {
      openSection("booking");
    });
  }

  if (accountRegisterForm) {
    accountRegisterForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = (document.getElementById("account-register-name").value || "").trim();
      const fullName = (document.getElementById("account-register-fullname").value || "").trim();
      const pass = (document.getElementById("account-register-password").value || "").trim();
      if (!name || !pass || !fullName) {
        setAuthFeedback(I18n.t("account_err_register_fields"), true);
        return;
      }
      if (users[name]) {
        setAuthFeedback(I18n.t("account_err_register_exists"), true);
        return;
      }
      users[name] = { fullName: fullName, password: pass, stats: {} };
      saveUsers();
      await upsertCloudUser(name, users[name]);
      activeUsername = name;
      persistActiveUser();
      setAuthFeedback(I18n.t("account_ok_register"), false);
      renderAccountPanel();
      refreshAllLandingCardProgress();
      refreshAllHomeworkPanels();
      accountRegisterForm.reset();
      syncPasswordToggleAria();
    });
  }

  if (accountLoginForm) {
    accountLoginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = (document.getElementById("account-login-name").value || "").trim();
      const pass = (document.getElementById("account-login-password").value || "").trim();
      let localUser = users[name];
      if (!localUser || localUser.password !== pass) {
        const cloudUser = await fetchCloudUser(name, pass);
        if (cloudUser) {
          users[name] = cloudUser;
          localUser = cloudUser;
          saveUsers();
        }
      }
      if (!localUser || localUser.password !== pass) {
        setAuthFeedback(I18n.t("account_err_login"), true);
        return;
      }
      activeUsername = name;
      persistActiveUser();
      const latestCloudUser = await fetchCloudUser(name, pass);
      if (latestCloudUser) {
        users[name] = keepFurthestVocabPath(users[name], latestCloudUser);
        saveUsers();
      } else {
        scheduleActiveUserCloudSync();
      }
      setAuthFeedback(I18n.t("account_ok_login"), false);
      renderAccountPanel();
      refreshAllLandingCardProgress();
      refreshAllHomeworkPanels();
      accountLoginForm.reset();
      syncPasswordToggleAria();
    });
  }

  if (accountLogoutBtn) {
    accountLogoutBtn.addEventListener("click", function () {
      activeUsername = null;
      persistActiveUser();
      setAuthFeedback("", false);
      renderAccountPanel();
      refreshAllLandingCardProgress();
      refreshAllHomeworkPanels();
    });
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", function () {
      const val = (adminPasswordInput.value || "").trim();
      if (val !== ADMIN_PASSWORD) {
        adminLoginFeedback.textContent = I18n.t("admin_login_fail");
        adminLoginFeedback.classList.remove("hidden");
        return;
      }
      adminUnlocked = true;
      adminLoginFeedback.classList.add("hidden");
      refreshAdminCloudData();
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", function () {
      adminUnlocked = false;
      adminViewingStudent = null;
      adminWriting = { loading: false, loaded: false, error: "", rows: [], filter: "todo", openId: null, dirty: false };
      adminPoints = { loading: false, loaded: false, error: "", awards: [], flash: "" };
      if (adminPasswordInput) adminPasswordInput.value = "";
      renderAdminPanel();
    });
  }

  if (adminTabs.length) {
    adminTabs.forEach(function (tabBtn) {
      tabBtn.addEventListener("click", function () {
        const tab = tabBtn.getAttribute("data-admin-tab");
        if (
          tab !== "writing" &&
          adminWriting.dirty &&
          !window.confirm(I18n.t("admin_writing_unsaved_confirm"))
        ) {
          return;
        }
        if (tab !== "writing") {
          adminWriting.openId = null;
          adminWriting.dirty = false;
        }
        if (tab !== "progress") adminViewingStudent = null;
        adminTabs.forEach(function (b) {
          b.classList.toggle("is-active", b === tabBtn);
        });
        if (adminBookingsTab) adminBookingsTab.classList.toggle("hidden", tab !== "bookings");
        if (adminProgressTab) adminProgressTab.classList.toggle("hidden", tab !== "progress");
        if (adminPaymentsTab) adminPaymentsTab.classList.toggle("hidden", tab !== "payments");
        if (adminLeaderboardTab) adminLeaderboardTab.classList.toggle("hidden", tab !== "leaderboard");
        if (adminPlannerTab)     adminPlannerTab.classList.toggle("hidden",     tab !== "planner");
        if (adminWritingTab)     adminWritingTab.classList.toggle("hidden",     tab !== "writing");
        if (adminPointsTab)      adminPointsTab.classList.toggle("hidden",      tab !== "points");
        if (tab === "points") {
          renderAdminPoints();
          if (!adminStudentsFetched && !adminStudentsLoading) void fetchAdminStudents();
          void fetchAdminPoints();
        }
        if (tab === "leaderboard") renderAdminLeaderboard();
        if (tab === "planner")     renderAdminPlanner();
        if (tab === "writing") {
          renderAdminWriting();
          void fetchAdminWriting();
          void fetchAdminPoints();
        }
      });
    });
  }

  if (adminPaymentForm) {
    adminPaymentForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = (adminPaymentNameInput.value || "").trim();
      const owedAmount = Math.max(0, Number((adminPaymentOwedInput && adminPaymentOwedInput.value) || 0));
      if (!name) return;
      if (isSupabaseConfigured() && hasAdminApiSecret()) {
        const sb = getSupabaseClient();
        if (!sb) return;
        let addError = null;
        const addWithAmount = await sb.rpc("admin_add_payment", {
          p_secret: getSupabaseConfig().adminApiSecret,
          p_name: name,
          p_owed_amount: owedAmount,
        });
        addError = addWithAmount.error || null;
        if (addError) {
          const fallback = await sb.rpc("admin_add_payment", {
            p_secret: getSupabaseConfig().adminApiSecret,
            p_name: name,
          });
          addError = fallback.error || null;
          if (!addError && owedAmount > 0 && fallback.data) {
            const setRes = await sb.rpc("admin_set_payment_owed", {
              p_secret: getSupabaseConfig().adminApiSecret,
              p_id: fallback.data,
              p_owed_amount: owedAmount,
            });
            if (setRes.error) addError = setRes.error;
          }
        }
        if (addError) {
          console.error(addError);
          return;
        }
        adminPaymentForm.reset();
        if (adminPaymentOwedInput) adminPaymentOwedInput.value = "0";
        await refreshAdminCloudData();
        return;
      }
      paymentChecklist.push({
        id: Date.now() + Math.random(),
        name: name,
        paid: false,
        owedAmount: owedAmount,
      });
      savePayments();
      adminPaymentForm.reset();
      if (adminPaymentOwedInput) adminPaymentOwedInput.value = "0";
      renderAdminPanel();
    });
  }

  if (adminCloudRefreshBtn) {
    adminCloudRefreshBtn.addEventListener("click", function () {
      refreshAdminCloudData();
    });
  }

  if (adminCornerBtn) {
    adminCornerBtn.addEventListener("click", function () {
      openSection("admin");
    });
  }

  if (adminSendEmailsBtn) {
    adminSendEmailsBtn.addEventListener("click", async function () {
      if (!adminSendEmailsStatus) return;
      const secret = getSupabaseConfig().adminApiSecret;
      if (!secret) {
        adminSendEmailsStatus.textContent = I18n.t("admin_send_emails_no_secret");
        adminSendEmailsStatus.style.color = "#b74848";
        adminSendEmailsStatus.classList.remove("hidden");
        return;
      }
      adminSendEmailsBtn.disabled = true;
      adminSendEmailsStatus.textContent = I18n.t("admin_send_emails_sending");
      adminSendEmailsStatus.style.color = "";
      adminSendEmailsStatus.classList.remove("hidden");
      try {
        const res = await fetch("/api/send-progress-emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret }),
        });
        const data = await res.json();
        if (!res.ok) {
          adminSendEmailsStatus.textContent =
            I18n.t("admin_send_emails_error") + " " + (data.error || String(res.status));
          adminSendEmailsStatus.style.color = "#b74848";
        } else {
          const errNote =
            data.errors && data.errors.length
              ? " (" + data.errors.length + " failed)"
              : "";
          adminSendEmailsStatus.textContent = I18n.t("admin_send_emails_ok", {
            sent: String(data.sent || 0),
            skipped: String(data.skipped || 0),
          }) + errNote;
          adminSendEmailsStatus.style.color = "#166534";
        }
      } catch (err) {
        adminSendEmailsStatus.textContent = I18n.t("admin_send_emails_error") + " " + err.message;
        adminSendEmailsStatus.style.color = "#b74848";
      }
      adminSendEmailsBtn.disabled = false;
    });
  }

  window.addEventListener("pageshow", function () {
    forceInitialHomeView();
  });

  contentPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (contentPasswordInput.value || "").trim();
    if (val === CONTENT_PASSWORD && pendingLevel) {
      window.scrollTo({ top: 0, behavior: "instant" });
      contentPasswordError.classList.add("hidden");
      contentPasswordOverlay.classList.add("hidden");
      contentPasswordInput.value = "";
      levelPicker.classList.add("hidden");
      document.querySelectorAll(".btn-level").forEach((b) => b.classList.remove("is-active"));
      document.querySelectorAll(".level-article").forEach((art) => art.classList.add("hidden"));
      const btn = document.querySelector('.btn-level[data-level="' + pendingLevel + '"]');
      if (btn) btn.classList.add("is-active");
      const article = document.getElementById("content-" + pendingLevel);
      if (article) {
        article.classList.remove("hidden");
        resetHubToLanding(article.querySelector(".learning-hub"));
        recordLastLevel(pendingLevel);
      }
      pendingLevel = null;
      updateContentBreadcrumb();
    } else {
      contentPasswordError.classList.remove("hidden");
    }
  });

  document.querySelectorAll(".btn-level").forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.getAttribute("data-level");
      pendingLevel = level;
      contentPasswordForLevel.textContent = I18n.t("content_opening", {
        level: I18n.t("level_" + level),
      });
      contentPasswordError.classList.add("hidden");
      contentPasswordInput.value = "";
      contentPasswordOverlay.classList.remove("hidden");
      contentPasswordInput.focus();
    });
  });

  document.querySelectorAll(".btn-level-back").forEach((btn) => {
    btn.addEventListener("click", showLevelPicker);
  });

  contentPasswordClose.addEventListener("click", showLevelPicker);

  document.querySelectorAll(".btn-level-close").forEach((btn) => {
    btn.addEventListener("click", showLevelPicker);
  });

  function bookingHourRange(hour) {
    return I18n.t("booking_hour_range", { start: String(hour), end: String(hour + 1) });
  }

  function bookingFormatSlot(dayIndex, hour) {
    return bookingDayLabels[dayIndex] + " " + bookingHourRange(hour);
  }

  function bookingDayHours(dayIndex) {
    const day = BOOKING_SCHEDULE[dayIndex] || {};
    return Object.keys(day)
      .map(Number)
      .sort(function (a, b) {
        return a - b;
      });
  }

  function bookingSlotOpen(dayIndex, hour) {
    return !!(BOOKING_SCHEDULE[dayIndex] && BOOKING_SCHEDULE[dayIndex][hour] === "open");
  }

  function bookingDayHasOpenSlot(dayIndex) {
    return bookingDayHours(dayIndex).some(function (h) {
      return bookingSlotOpen(dayIndex, h);
    });
  }

  function bookingTimesUnknownSelected() {
    return !!(bookingTimesUnknownInput && bookingTimesUnknownInput.checked);
  }

  function getBookingMissingFields() {
    const missing = [];
    const parentName = (bookingParentNameInput && bookingParentNameInput.value.trim()) || "";
    const parentEmail = (bookingParentEmailInput && bookingParentEmailInput.value.trim()) || "";
    const studentName = (bookingStudentNameInput && bookingStudentNameInput.value.trim()) || "";
    const phone = (bookingPhoneInput && bookingPhoneInput.value.trim()) || "";
    const level = (bookingLevelInput && bookingLevelInput.value) || "";
    const timesUnknown = bookingTimesUnknownSelected();

    if (!parentName) missing.push(I18n.t("booking_missing_parent_name"));
    if (!parentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
      missing.push(I18n.t("booking_missing_parent_email"));
    }
    if (!studentName) missing.push(I18n.t("booking_missing_student_name"));
    if (!phone) missing.push(I18n.t("booking_missing_phone"));
    if (!level) missing.push(I18n.t("booking_missing_level"));
    if (!timesUnknown && bookingSlotSelections.length === 0) {
      missing.push(I18n.t("booking_missing_times"));
    }
    return missing;
  }

  function bookingDisplayName(row) {
    if (!row) return "";
    if (row.studentName && row.parentName) {
      return row.studentName + " (" + row.parentName + ")";
    }
    return row.name || "";
  }

  function bookingIsSelected(dayIndex, hour) {
    return bookingSlotSelections.some(function (s) {
      return s.dayIndex === dayIndex && s.hour === hour;
    });
  }

  function bookingSortSelections(a, b) {
    if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
    return a.hour - b.hour;
  }

  function bookingSyncHiddenInputs() {
    bookingHiddenSlots.innerHTML = "";
    bookingSlotSelections.slice().sort(bookingSortSelections).forEach(function (sel) {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "slots";
      input.value = bookingFormatSlot(sel.dayIndex, sel.hour);
      input.checked = true;
      input.tabIndex = -1;
      input.setAttribute("aria-hidden", "true");
      bookingHiddenSlots.appendChild(input);
    });
  }

  function bookingRenderDays() {
    if (!bookingDayGrid) return;
    bookingDayGrid.innerHTML = "";
    if (bookingTimesUnknownSelected()) return;
    bookingDayLabels.forEach(function (label, i) {
      if (!bookingDayHours(i).length) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-day-btn";
      btn.dataset.dayIndex = String(i);
      const name = document.createElement("span");
      name.className = "booking-day-btn__name";
      name.textContent = label;
      btn.appendChild(name);
      if (!bookingDayHasOpenSlot(i)) {
        btn.classList.add("is-full");
        const tag = document.createElement("span");
        tag.className = "booking-day-btn__tag";
        tag.textContent = I18n.t("booking_sold_out");
        btn.appendChild(tag);
      }
      if (bookingActiveDayIndex === i) btn.classList.add("is-active");
      btn.addEventListener("click", function () {
        bookingActiveDayIndex = i;
        bookingRenderDays();
        bookingRenderHours();
        bookingHoursWrap.classList.remove("hidden");
        bookingTimesHeading.textContent = I18n.t("booking_times_for", { day: bookingDayLabels[i] });
      });
      bookingDayGrid.appendChild(btn);
    });
  }

  function bookingRenderHours() {
    if (!bookingHoursGrid) return;
    bookingHoursGrid.innerHTML = "";
    if (bookingTimesUnknownSelected()) return;
    if (bookingActiveDayIndex === null) return;
    bookingDayHours(bookingActiveDayIndex).forEach(function (h) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-hour-btn";
      const range = document.createElement("span");
      range.className = "booking-hour-btn__range";
      range.textContent = bookingHourRange(h);
      btn.appendChild(range);
      if (!bookingSlotOpen(bookingActiveDayIndex, h)) {
        btn.classList.add("is-full");
        btn.disabled = true;
        const tag = document.createElement("span");
        tag.className = "booking-hour-btn__tag";
        tag.textContent = I18n.t("booking_sold_out");
        btn.appendChild(tag);
        btn.setAttribute(
          "aria-label",
          bookingHourRange(h) + " – " + I18n.t("booking_sold_out")
        );
        bookingHoursGrid.appendChild(btn);
        return;
      }
      if (bookingIsSelected(bookingActiveDayIndex, h)) btn.classList.add("is-selected");
      (function (hour) {
        btn.addEventListener("click", function () {
          const di = bookingActiveDayIndex;
          const idx = bookingSlotSelections.findIndex(function (s) {
            return s.dayIndex === di && s.hour === hour;
          });
          if (idx >= 0) bookingSlotSelections.splice(idx, 1);
          else bookingSlotSelections.push({ dayIndex: di, hour: hour });
          bookingRenderHours();
          bookingRenderSummary();
          bookingSyncHiddenInputs();
          bookingSlotsWarning.classList.add("hidden");
        });
      })(h);
      bookingHoursGrid.appendChild(btn);
    });
    if (!bookingDayHasOpenSlot(bookingActiveDayIndex)) {
      const note = document.createElement("p");
      note.className = "booking-hours-full-note";
      note.textContent = I18n.t("booking_day_full_note");
      bookingHoursGrid.appendChild(note);
    }
  }

  function bookingRenderSummary() {
    if (!bookingSelectedList || !bookingSelectedEmpty) return;
    bookingSelectedList.innerHTML = "";
    bookingSlotSelections
      .slice()
      .sort(bookingSortSelections)
      .forEach(function (sel) {
        const li = document.createElement("li");
        li.className = "booking-selected-item";
        const span = document.createElement("span");
        span.textContent = bookingFormatSlot(sel.dayIndex, sel.hour);
        const rm = document.createElement("button");
        rm.type = "button";
        rm.className = "booking-selected-remove";
        rm.textContent = I18n.t("ui_remove_symbol");
        rm.setAttribute(
          "aria-label",
          I18n.t("booking_remove_aria", { slot: bookingFormatSlot(sel.dayIndex, sel.hour) })
        );
        rm.addEventListener("click", function () {
          bookingSlotSelections = bookingSlotSelections.filter(function (s) {
            return !(s.dayIndex === sel.dayIndex && s.hour === sel.hour);
          });
          bookingRenderHours();
          bookingRenderSummary();
          bookingSyncHiddenInputs();
        });
        li.appendChild(span);
        li.appendChild(rm);
        bookingSelectedList.appendChild(li);
      });
    bookingSelectedEmpty.classList.toggle("hidden", bookingSlotSelections.length > 0);
  }

  function buildBookingCalendar() {
    bookingDayLabels = DAY_KEYS.map(function (k) {
      return I18n.t(k);
    });
    if (bookingTimesUnknownSelected()) {
      bookingSlotSelections = [];
      bookingActiveDayIndex = null;
    }
    if (
      bookingActiveDayIndex !== null &&
      (bookingActiveDayIndex >= bookingDayLabels.length || !bookingDayHours(bookingActiveDayIndex).length)
    ) {
      bookingActiveDayIndex = null;
    }
    bookingSlotSelections = bookingSlotSelections.filter(function (sel) {
      return bookingSlotOpen(sel.dayIndex, sel.hour);
    });
    if (bookingCalendar) {
      bookingCalendar.classList.toggle("hidden", bookingTimesUnknownSelected());
    }
    bookingRenderDays();
    if (bookingTimesUnknownSelected()) {
      bookingHoursWrap.classList.add("hidden");
      bookingTimesHeading.textContent = "";
    } else if (bookingActiveDayIndex !== null) {
      bookingHoursWrap.classList.remove("hidden");
      bookingTimesHeading.textContent = I18n.t("booking_times_for", {
        day: bookingDayLabels[bookingActiveDayIndex],
      });
      bookingRenderHours();
    } else {
      bookingHoursWrap.classList.add("hidden");
      bookingTimesHeading.textContent = "";
    }
    bookingRenderSummary();
    bookingSyncHiddenInputs();
  }

  function initLearningTools() {
    homeworkPanelRenderers = [];
    document.querySelectorAll(".learning-tools").forEach(initLearningHubForRoot);
    refreshAllLandingCardProgress();
  }

  function initLearningHubForRoot(root) {
      const LEVEL_COLORS = {
        beginner: {
          accent: "#059669",
          soft: "rgba(5,150,105,0.12)",
          strong: "#047857",
        },
        intermediate: {
          accent: "#1d4ed8",
          soft: "rgba(29,78,216,0.12)",
          strong: "#1e40af",
        },
        advanced: {
          accent: "#7c3aed",
          soft: "rgba(124,58,237,0.12)",
          strong: "#6d28d9",
        },
      };
      const level = root.getAttribute("data-learning-level");
      const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS.beginner;
      const data = learningData[level];
      if (!data) return;

      const levelArticle = document.getElementById("content-" + level);
      if (levelArticle) levelArticle.style.borderTopColor = levelColor.accent;
      const levelLandingHeading = root.querySelector(".level-landing__heading");
      if (levelLandingHeading) levelLandingHeading.style.color = levelColor.accent;

      function applyBackToMenuColor() {
        const btn = root.querySelector(".lh-back-to-menu");
        if (btn) btn.style.color = levelColor.accent;
      }

      function homeworkKey(topic) {
        return level + "|hw|" + topic;
      }

      const levelLanding = root.querySelector("[data-level-landing]");
      const hubWorkspace = root.querySelector("[data-hub-workspace]");
      const hubBody = root.querySelector(".learning-hub__body");
      const landingCards = root.querySelectorAll(".level-landing__card[data-tool]");
      applyLandingCardIcons(root);
      const workspaceTabs = root.querySelectorAll(".learning-hub__tab[data-tool]");
      const panels = root.querySelectorAll(".tool-panel");
      const flashcardsPanel = root.querySelector('[data-tool-panel="flashcards"]');
      const vocabPanel = root.querySelector('[data-tool-panel="vocab"]');
      const grammarPanel = root.querySelector('[data-tool-panel="grammar"]');
      const homeworkPanel = root.querySelector('[data-tool-panel="homework"]');
      const progressPanel = root.querySelector('[data-tool-panel="progress"]');
      const verbsPanel = root.querySelector('[data-tool-panel="verbs"]');

      function activateTab(name) {
        workspaceTabs.forEach(function (b) {
          const on = b.getAttribute("data-tool") === name;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (panel) {
          panel.classList.toggle("hidden", panel.getAttribute("data-tool-panel") !== name);
        });
        if (name === "progress") renderProgressPanel();
        if (name === "homework") renderHomeworkPanel();
        refreshStreakHeader();
        updateContentBreadcrumb();
      }

      function enterSection(tabName) {
        window.scrollTo({ top: 0, behavior: "instant" });
        root.classList.add("is-locked");
        if (levelLanding) levelLanding.classList.add("hidden");
        if (hubWorkspace) hubWorkspace.classList.remove("hidden");
        activateTab(tabName || "flashcards");
        if (backToMenuBtn) backToMenuBtn.classList.remove("hidden");
      }

      let backToMenuBtn = hubWorkspace && hubWorkspace.querySelector(".lh-back-to-menu");
      if (hubWorkspace && !backToMenuBtn) {
        backToMenuBtn = document.createElement("button");
        backToMenuBtn.type = "button";
        backToMenuBtn.className = "lh-back-to-menu hidden";
        backToMenuBtn.setAttribute("data-learning-chrome", "learning_back_to_menu");
        backToMenuBtn.textContent = I18n.t("learning_back_to_menu");
        if (hubBody) {
          hubBody.insertBefore(backToMenuBtn, hubBody.firstChild);
        } else if (hubWorkspace) {
          hubWorkspace.appendChild(backToMenuBtn);
        }
        backToMenuBtn.addEventListener("click", function () {
          window.scrollTo({ top: 0, behavior: "instant" });
          resetHubToLanding(root);
        });
        backToMenuBtn.style.color = levelColor.accent;
      }
      applyBackToMenuColor();

      landingCards.forEach(function (btn) {
        btn.addEventListener("mouseenter", function () {
          btn.style.borderColor = levelColor.accent;
        });
        btn.addEventListener("mouseleave", function () {
          btn.style.borderColor = "";
        });
        btn.addEventListener("click", function () {
          const tool = btn.getAttribute("data-tool");
          if (tool) enterSection(tool);
        });
      });
      workspaceTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          const tool = tab.getAttribute("data-tool");
          if (tool) enterSection(tool);
        });
      });
      refreshLandingCardProgress(root, level, data);

      window.addEventListener("andronicus:streakchange", function (ev) {
        if (ev.detail && ev.detail.level === level) refreshStreakHeader();
      });

      function refreshStreakHeader() {
        const user = getActiveUser();
        const stEl = root.querySelector(".lh-vocab__streak-val");
        if (!stEl) return;
        if (!user) {
          stEl.textContent = "0";
          return;
        }
        const lh = ensureLearningHub(ensureStats(user));
        stEl.textContent = String(lh.streak || 0);
      }

      function progressDonutColor(pct) {
        const t = Math.max(0, Math.min(100, pct)) / 100;
        const r = Math.round(0x1a + (0x16 - 0x1a) * t);
        const g = Math.round(0x6f + (0xa3 - 0x6f) * t);
        const b = Math.round(0xa3 + (0x4a - 0xa3) * t);
        return (
          "#" +
          [r, g, b]
            .map(function (n) {
              const h = n.toString(16);
              return h.length < 2 ? "0" + h : h;
            })
            .join("")
        );
      }

      function progressDayAbbrev(d) {
        const key = PROGRESS_DAY_KEYS[d.getDay()];
        return key ? I18n.t(key) : "";
      }

      function buildHomeworkDonut(pct, strokeColor) {
        const size = 120;
        const strokeW = 12;
        const r = (size - strokeW) / 2;
        const cx = size / 2;
        const circ = 2 * Math.PI * r;
        const wrap = document.createElement("div");
        wrap.className = "lh-donut-wrap";

        const chart = document.createElement("div");
        chart.className = "lh-donut-chart";

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "lh-donut");
        svg.setAttribute("width", String(size));
        svg.setAttribute("height", String(size));
        svg.setAttribute("viewBox", "0 0 " + size + " " + size);
        svg.setAttribute("aria-hidden", "true");

        const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        track.setAttribute("class", "lh-donut__track");
        track.setAttribute("cx", String(cx));
        track.setAttribute("cy", String(cx));
        track.setAttribute("r", String(r));
        track.setAttribute("fill", "none");
        track.setAttribute("stroke", "var(--border)");
        track.setAttribute("stroke-width", String(strokeW));

        const arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        arc.setAttribute("class", "lh-donut__arc");
        arc.setAttribute("cx", String(cx));
        arc.setAttribute("cy", String(cx));
        arc.setAttribute("r", String(r));
        arc.setAttribute("fill", "none");
        arc.setAttribute("stroke", strokeColor);
        arc.setAttribute("stroke-width", String(strokeW));
        arc.setAttribute("stroke-linecap", "round");
        arc.setAttribute("transform", "rotate(-90 " + cx + " " + cx + ")");
        arc.style.strokeDasharray = String(circ);
        arc.style.strokeDashoffset = String(circ);
        arc.style.transition = "stroke-dashoffset 0.65s ease";

        svg.appendChild(track);
        svg.appendChild(arc);

        const center = document.createElement("div");
        center.className = "lh-donut__center";
        center.textContent = String(pct) + "%";

        chart.appendChild(svg);
        chart.appendChild(center);
        wrap.appendChild(chart);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            arc.style.strokeDashoffset = String(circ * (1 - pct / 100));
          });
        });

        return wrap;
      }

      function streakHintHtml() {
        return I18n.t("learning_streak_hint_html");
      }

      function renderProgressPanel() {
        progressPanel.innerHTML = "";
        const wrap = document.createElement("div");
        wrap.className = "lh-progress";
        const user = getActiveUser();
        if (!user) {
          const p = document.createElement("p");
          p.className = "lh-muted";
          p.textContent = I18n.t("learning_progress_no_user");
          wrap.appendChild(p);
          progressPanel.appendChild(wrap);
          return;
        }
        const stats = ensureStats(user);
        const lh = ensureLearningHub(stats);
        const exercises = Array.isArray(data.exercises) ? data.exercises : [];
        const hwList = Array.isArray(data.homeworkChecklist) ? data.homeworkChecklist : [];
        const grammarDone = countGrammarCompleted(stats, level, exercises);
        const grammarTotal = exercises.length;
        const hwDone = countHomeworkCompleted(lh, level, hwList);
        const hwTotal = hwList.length;
        const grid = document.createElement("div");
        grid.className = "lh-stat-grid";
        function statCard(label, val, accentColor) {
          const c = document.createElement("div");
          c.className = "lh-stat-card";
          const stripe = document.createElement("div");
          stripe.className = "lh-stat-card__stripe";
          stripe.style.backgroundColor = accentColor;
          const content = document.createElement("div");
          content.className = "lh-stat-card__content";
          const lab = document.createElement("div");
          lab.className = "lh-stat-card__label";
          lab.textContent = label;
          const v = document.createElement("div");
          v.className = "lh-stat-card__value";
          v.textContent = val;
          content.appendChild(lab);
          content.appendChild(v);
          c.appendChild(stripe);
          c.appendChild(content);
          grid.appendChild(c);
        }
        statCard(
          I18n.t("learning_progress_stat_grammar_label"),
          I18n.t("learning_progress_stat_grammar", {
            n: String(grammarDone),
            t: String(grammarTotal),
          }),
          "#1a6fa3"
        );
        statCard(
          I18n.t("learning_progress_stat_homework_label"),
          I18n.t("learning_progress_stat_homework", {
            n: String(hwDone),
            t: String(hwTotal),
          }),
          "#d97706"
        );
        const fa = stats.flashcards.attempts || 0;
        const fc = stats.flashcards.correct || 0;
        statCard(
          I18n.t("learning_progress_flash_accuracy"),
          fa ? String(Math.round((fc / fa) * 100)) + "%" : I18n.t("learning_progress_not_applicable"),
          "#7c3aed"
        );
        const streakCard = document.createElement("div");
        streakCard.className = "lh-stat-card lh-stat-card--streak";
        const streakLab = document.createElement("div");
        streakLab.className = "lh-stat-card__label";
        streakLab.textContent = I18n.t("learning_progress_streak");
        const streakVal = document.createElement("div");
        streakVal.className = "lh-stat-card__value";
        streakVal.textContent = String(lh.streak || 0);
        streakCard.appendChild(streakLab);
        streakCard.appendChild(streakVal);
        const streakHint = document.createElement("p");
        streakHint.className = "lh-streak-hint";
        streakHint.innerHTML = streakHintHtml();
        const streakWrap = document.createElement("div");
        streakWrap.className = "lh-streak-stat-wrap";
        streakWrap.appendChild(streakCard);
        streakWrap.appendChild(streakHint);
        grid.appendChild(streakWrap);
        wrap.appendChild(grid);

        const weekTitle = document.createElement("h4");
        weekTitle.className = "lh-subheading";
        weekTitle.textContent = I18n.t("learning_progress_week_activity");
        wrap.appendChild(weekTitle);
        const chart = document.createElement("div");
        chart.className = "lh-week-chart";
        const dayCounts = {};
        function bumpDay(iso) {
          if (!iso) return;
          const d = String(iso).slice(0, 10);
          dayCounts[d] = (dayCounts[d] || 0) + 1;
        }
        (stats.flashcardSessions || []).forEach(function (s) {
          bumpDay(s.at);
        });
        (stats.quizSessionLog || []).forEach(function (s) {
          bumpDay(s.at);
        });
        const exerciseLogByTopic = {};
        (stats.exerciseCompletionLog || []).forEach(function (entry) {
          if (entry && entry.topic) exerciseLogByTopic[entry.topic] = entry.at;
        });
        (stats.completedExercises || []).forEach(function (key) {
          bumpDay(exerciseLogByTopic[key]);
        });
        const hwChecked = (lh.homeworkChecklist && lh.homeworkChecklist[level]) || {};
        const hwDates = lh.homeworkChecklistDates || {};
        Object.keys(hwChecked).forEach(function (itemId) {
          if (hwChecked[itemId]) {
            bumpDay(hwDates[level + "|" + itemId]);
          }
        });
        let weekMax = 0;
        for (let wi = 6; wi >= 0; wi -= 1) {
          const wd = new Date();
          wd.setDate(wd.getDate() - wi);
          const wn = dayCounts[isoDay(wd)] || 0;
          if (wn > weekMax) weekMax = wn;
        }
        for (let i = 6; i >= 0; i -= 1) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = isoDay(d);
          const col = document.createElement("div");
          col.className = "lh-week-chart__col";
          const n = dayCounts[key] || 0;
          const bar = document.createElement("div");
          bar.className = "lh-week-chart__bar";
          const barH =
            n === 0 ? 0 : weekMax > 0 ? Math.max(10, Math.round((n / weekMax) * 100)) : 10;
          bar.style.height = String(Math.min(100, barH)) + "px";
          bar.title = key + ": " + String(n);
          const lab = document.createElement("span");
          lab.className = "lh-week-chart__lab";
          lab.textContent = progressDayAbbrev(d);
          col.appendChild(bar);
          col.appendChild(lab);
          chart.appendChild(col);
        }
        wrap.appendChild(chart);

        const hwPct = hwTotal ? Math.round((hwDone / hwTotal) * 100) : 0;
        const completedKeys = stats.completedExercises || [];

        const progressGrid = document.createElement("div");
        progressGrid.className = "lh-progress-grid";

        const hwSec = document.createElement("section");
        hwSec.className = "lh-progress-section";
        const hwTitle = document.createElement("h4");
        hwTitle.className = "lh-subheading";
        hwTitle.textContent = I18n.t("learning_progress_homework_title");
        hwSec.appendChild(hwTitle);
        const hwDonutWrap = buildHomeworkDonut(hwPct, progressDonutColor(hwPct));
        const hwCaption = document.createElement("p");
        hwCaption.className = "lh-donut-wrap__caption lh-muted";
        hwCaption.textContent = I18n.t("learning_progress_tasks_caption", {
          n: String(hwDone),
          t: String(hwTotal),
        });
        hwDonutWrap.appendChild(hwCaption);
        hwSec.appendChild(hwDonutWrap);
        progressGrid.appendChild(hwSec);

        const grammarSec = document.createElement("section");
        grammarSec.className = "lh-progress-section";
        const grammarTitle = document.createElement("h4");
        grammarTitle.className = "lh-subheading";
        grammarTitle.textContent = I18n.t("learning_progress_grammar_title");
        grammarSec.appendChild(grammarTitle);
        const grammarList = document.createElement("ul");
        grammarList.className = "lh-grammar-list";
        exercises.forEach(function (ex) {
          const li = document.createElement("li");
          li.className = "lh-grammar-list__row";
          const name = document.createElement("span");
          name.className = "lh-grammar-list__topic";
          name.textContent = exerciseTopicLabel(ex);
          const done = completedKeys.includes(level + " - " + ex.topic);
          const check = document.createElement("span");
          check.className = "lh-grammar-list__check" + (done ? " is-complete" : "");
          if (done) {
            check.textContent = "✓";
            check.style.background = levelColor.accent;
            check.style.borderColor = levelColor.accent;
          }
          check.setAttribute("aria-hidden", "true");
          li.appendChild(name);
          li.appendChild(check);
          grammarList.appendChild(li);
        });
        grammarSec.appendChild(grammarList);
        const grammarSummary = document.createElement("p");
        grammarSummary.className = "lh-grammar-list__summary lh-muted";
        grammarSummary.textContent = I18n.t("learning_progress_grammar_summary", {
          n: String(grammarDone),
          t: String(grammarTotal),
        });
        grammarSec.appendChild(grammarSummary);
        if (grammarTotal > 0 && grammarDone >= grammarTotal) {
          const grammarCongrats = document.createElement("p");
          grammarCongrats.className = "lh-grammar-list__congrats";
          grammarCongrats.textContent = I18n.t("learning_progress_grammar_all_done");
          grammarSec.appendChild(grammarCongrats);
        }
        progressGrid.appendChild(grammarSec);

        wrap.appendChild(progressGrid);
        progressPanel.appendChild(wrap);
      }

      function renderHomeworkPanel() {
        homeworkPanel.innerHTML = "";

        if (!Array.isArray(data.homeworkChecklist) || data.homeworkChecklist.length === 0) {
          const unavailable = document.createElement("p");
          unavailable.className = "lh-muted";
          unavailable.textContent = I18n.t("learning_homework_unavailable");
          homeworkPanel.appendChild(unavailable);
          return;
        }

        const seenIds = Object.create(null);
        data.homeworkChecklist.forEach(function (item) {
          if (!item || typeof item.id !== "string" || !item.id) {
            console.warn(
              "[Andronicus] homeworkChecklist item missing id field; checklist save will not work for this item.",
              item
            );
            return;
          }
          if (seenIds[item.id]) {
            console.warn(
              "[Andronicus] homeworkChecklist duplicate id field:",
              item.id
            );
          }
          seenIds[item.id] = true;
        });

        const user = getActiveUser();
        const hub = user ? ensureLearningHub(ensureStats(user)) : null;
        const levelDone =
          hub && hub.homeworkChecklist && hub.homeworkChecklist[level]
            ? hub.homeworkChecklist[level]
            : {};
        const cLang = I18n.getLang();
        const hwCategories = ["Vocab", "Grammar", "Reading", "Listening", "Speaking", "Writing"];
        if (user) void loadStudentWriting(false);

        function homeworkLevelDoneCount() {
          if (!hub || !hub.homeworkChecklist || !hub.homeworkChecklist[level]) return 0;
          return Object.keys(hub.homeworkChecklist[level]).length;
        }

        function countCategoryDone(items) {
          return items.reduce(function (acc, item) {
            if (!item || !item.id) return acc;
            return acc + (levelDone[item.id] ? 1 : 0);
          }, 0);
        }

        function buildOverallHwProgress(doneCount, total) {
          const pct = total ? Math.round((doneCount / total) * 100) : 0;
          const wrap = document.createElement("div");
          wrap.className = "lh-hw-checklist__overall";
          const track = document.createElement("div");
          track.className = "lh-hw-overall-bar-track";
          const fill = document.createElement("div");
          fill.className = "lh-hw-overall-bar-fill";
          fill.style.width = String(pct) + "%";
          fill.style.backgroundColor = levelColor.accent;
          track.appendChild(fill);
          wrap.appendChild(track);
          const stat = document.createElement("p");
          stat.className = "lh-hw-overall-stat";
          stat.textContent = I18n.t("learning_homework_overall_progress", {
            n: String(doneCount),
            t: String(total),
            pct: String(pct),
          });
          wrap.appendChild(stat);
          return wrap;
        }

        const cwrap = document.createElement("section");
        cwrap.className = "lh-hw-checklist";

        const cTitle = document.createElement("h3");
        cTitle.className = "lh-hw-section__title";
        cTitle.textContent = I18n.t("learning_homework_checklist_title");
        cwrap.appendChild(cTitle);

        const cIntro = document.createElement("p");
        cIntro.className = "lh-muted";
        cIntro.textContent = I18n.t("learning_homework_checklist_intro");
        cwrap.appendChild(cIntro);

        const totalDone = homeworkLevelDoneCount();
        const totalItems = data.homeworkChecklist.length;
        cwrap.appendChild(buildOverallHwProgress(totalDone, totalItems));

        const grouped = Object.create(null);
        hwCategories.forEach(function (cat) {
          grouped[cat] = [];
        });
        for (let gi = 0; gi < data.homeworkChecklist.length; gi++) {
          let item = data.homeworkChecklist[gi];
          if (!item || !item.id) continue;
          const cat = item.category || "Vocab";
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(item);
        }

        for (let ci = 0; ci < hwCategories.length; ci++) {
          const cat = hwCategories[ci];
          const items = grouped[cat];
          if (!items || !items.length) continue;

          const catDone = countCategoryDone(items);
          const catTotal = items.length;
          const catComplete = catDone >= catTotal;

          const catSec = document.createElement("section");
          catSec.className = "lh-hw-category";

          const catHead = document.createElement("div");
          catHead.className = "lh-hw-category__head";
          const catTitle = document.createElement("h4");
          catTitle.className = "lh-hw-category__title";
          catTitle.textContent = homeworkCategoryLabel(cat);
          catHead.appendChild(catTitle);
          if (catComplete) {
            const doneBadge = document.createElement("span");
            doneBadge.className = "lh-hw-category__done-badge";
            doneBadge.textContent = I18n.t("learning_homework_done");
            catHead.appendChild(doneBadge);
          }
          catSec.appendChild(catHead);

          const catList = document.createElement("ol");
          catList.className = "lh-hw-checklist__list lh-hw-category__list";
          for (let ii = 0; ii < items.length; ii++) {
            let item = items[ii];
            if (!item || !item.id) continue;

            const renderUser = getActiveUser();
            const renderHub = renderUser ? ensureLearningHub(ensureStats(renderUser)) : null;
            const doneAtRender =
              (renderHub && renderHub.homeworkChecklist && renderHub.homeworkChecklist[level]) || {};

            const li = document.createElement("li");
            li.className = "lh-hw-checklist__item" + (doneAtRender[item.id] ? " is-done" : "");
            li.setAttribute("data-category", (item.category || "Vocab").toLowerCase());
            const label = document.createElement("label");
            label.className = "lh-hw-checklist__label lh-hw-checklist__label--in-category";
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.className = "lh-hw-checklist__cb";
            cb.checked = !!doneAtRender[item.id];
            console.log("[hw checkbox] getActiveUser()", getActiveUser());
            cb.disabled = getActiveUser() === null;
            cb.addEventListener("change", function () {
              const user = getActiveUser();
              if (!user) {
                cb.checked = false;
                return;
              }
              const st = ensureStats(user);
              const hub = ensureLearningHub(st);
              if (!hub.homeworkChecklist) hub.homeworkChecklist = {};
              if (!hub.homeworkChecklist[level]) hub.homeworkChecklist[level] = {};
              if (cb.checked) {
                hub.homeworkChecklist[level][item.id] = true;
              } else {
                delete hub.homeworkChecklist[level][item.id];
              }
              saveUsers();
              renderHomeworkPanel();
            });
            const text = document.createElement("span");
            text.className = "lh-hw-checklist__text";
            text.textContent = cLang === "fr" && item.fr ? item.fr : item.en || item.fr || "";
            label.appendChild(cb);
            label.appendChild(text);
            li.appendChild(label);
            if (item.category === "Writing") {
              li.appendChild(buildWritingHomeworkRow(level, item));
            }
            catList.appendChild(li);
          }
          catSec.appendChild(catList);
          cwrap.appendChild(catSec);
        }

        if (!user) {
          const cNotice = document.createElement("p");
          cNotice.className = "lh-muted";
          cNotice.textContent = I18n.t("learning_homework_checklist_signin");
          cwrap.appendChild(cNotice);
        }

        homeworkPanel.appendChild(cwrap);
      }
      homeworkPanelRenderers.push(renderHomeworkPanel);
      renderHomeworkPanel();

      const vocabPath = mountVocabPath(root, level, vocabPanel, function () {
        refreshLandingCardProgress(root, level, data);
      });
      vocabPathRenderers.push(vocabPath.render);
      learningToolsLangRefreshers.push(vocabPath.render);

      if (verbsPanel) {
        const verbsView = mountIrregularVerbs(level, verbsPanel, function (deckName) {
          enterSection("flashcards");
          const sel = root.querySelector('[data-tool-panel="flashcards"] select.flashcard-topic');
          if (sel && sel.value !== deckName) {
            sel.value = deckName;
            sel.dispatchEvent(new Event("change"));
          }
        });
        learningToolsLangRefreshers.push(verbsView.render);
      }

      function parseGapLine(line) {
        if (!line || line.indexOf("___") < 0) return null;
        const arrow = line.lastIndexOf("->");
        if (arrow < 0) return null;
        const answer = line.slice(arrow + 2).trim();
        const head = line.slice(0, arrow).trim();
        const parts = head.split("___");
        if (parts.length < 2) return null;
        const before = parts[0];
        const after = parts.slice(1).join("___");
        return {
          before: before,
          after: after,
          answer: answer,
        };
      }

      function gapQuestionText(item) {
        let text = item.before + " _____ " + item.after;
        while (/\([^)]*\)\s*$/.test(text)) {
          text = text.replace(/\s*\([^)]*\)\s*$/, "").trim();
        }
        return text;
      }

      function parseLearnIntro(introFr) {
        if (!introFr) return { prose: "", examples: [] };
        const marker = "|||EXAMPLES|||";
        if (introFr.indexOf(marker) >= 0) {
          const bits = introFr.split(marker);
          const prose = bits[0].trim();
          const examples = (bits[1] || "")
            .split("\n")
            .map(function (l) {
              return l.trim();
            })
            .filter(Boolean);
          return { prose: prose, examples: examples };
        }
        const lines = introFr.trim().split("\n");
        const examples = [];
        while (lines.length > 0) {
          const line = lines[lines.length - 1].trim();
          if (!line) {
            lines.pop();
            continue;
          }
          if (/formule\s*:/i.test(line) || /^(en |on |le |la |les |pour |contrairement)/i.test(line)) {
            break;
          }
          if (/[àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇ]/.test(line)) {
            break;
          }
          if (/^[A-Z0-9"']/.test(line) && /[.?!]$/.test(line) && line.length < 140) {
            examples.unshift(line);
            lines.pop();
          } else {
            break;
          }
        }
        return { prose: lines.join("\n").trim(), examples: examples };
      }

      function buildLearnPanel(ex) {
        const parsed = parseLearnIntro(ex.introFr || "");
        const panel = document.createElement("div");
        panel.className = "lh-learn-panel";
        if (parsed.prose) {
          const prose = document.createElement("div");
          prose.className = "lh-learn-panel__prose";
          prose.textContent = parsed.prose;
          panel.appendChild(prose);
        }
        if (parsed.examples.length) {
          const list = document.createElement("ul");
          list.className = "lh-learn-panel__examples";
          parsed.examples.forEach(function (sentence) {
            const li = document.createElement("li");
            li.textContent = sentence;
            list.appendChild(li);
          });
          panel.appendChild(list);
        }
        if (!parsed.prose && !parsed.examples.length) {
          const fallback = document.createElement("p");
          fallback.className = "lh-learn-panel__prose";
          fallback.textContent = I18n.t("learning_exercise_intro_fr_fallback", {
            topic: exerciseTopicLabel(ex),
          });
          panel.appendChild(fallback);
        }
        return panel;
      }

      function exerciseTopicBlurb(ex) {
        if (ex.summary) return ex.summary;
        if (ex.introFr) {
          const bit = ex.introFr.split("|||EXAMPLES|||")[0].split(/[.!?]/)[0].trim();
          if (bit) return bit + ".";
        }
        if (ex.practice) {
          return ex.practice.length > 100 ? ex.practice.slice(0, 97) + "..." : ex.practice;
        }
        return I18n.t("learning_exercise_topic_fallback", { topic: exerciseTopicLabel(ex) });
      }

      function gapItemKey(item) {
        return item.before + "|" + item.after + "|" + item.answer;
      }

      function copyGapItem(item) {
        return { before: item.before, after: item.after, answer: item.answer };
      }

      function shuffleGapItems(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          const t = a[i];
          a[i] = a[j];
          a[j] = t;
        }
        return a;
      }

      function buildGapMcRow(item, pool, step, onAnswered) {
        const wrap = document.createElement("div");
        wrap.className = "lh-gap-card";
        const q = document.createElement("p");
        q.className = "lh-gap-q";
        q.textContent = gapQuestionText(item);
        wrap.appendChild(q);
        const opts = [item.answer];
        const seenAns = Object.create(null);
        seenAns[item.answer] = true;
        for (let gi = 0; gi < pool.length * 2 && opts.length < 4; gi += 1) {
          const o = pool[(step + 1 + gi) % pool.length].answer;
          if (!seenAns[o]) {
            seenAns[o] = true;
            opts.push(o);
          }
        }
        const pad = ["…", "-", "?"];
        let pi = 0;
        while (opts.length < 4 && pi < pad.length) {
          if (!seenAns[pad[pi]]) {
            seenAns[pad[pi]] = true;
            opts.push(pad[pi]);
          }
          pi += 1;
        }
        opts.sort(function () {
          return Math.random() - 0.5;
        });
        const row = document.createElement("div");
        row.className = "lh-vocab-options lh-gap-card__options";
        const continueBtn = document.createElement("button");
        continueBtn.type = "button";
        continueBtn.className = "btn-primary lh-gap-continue";
        continueBtn.textContent = I18n.t("learning_gap_continue");
        continueBtn.hidden = true;
        let locked = false;
        let pendingOk = false;
        opts.forEach(function (o) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "flashcard-btn lh-option-btn";
          b.textContent = o;
          b.addEventListener("click", function () {
            if (locked) return;
            locked = true;
            pendingOk = o === item.answer;
            Array.from(row.querySelectorAll("button")).forEach(function (btn) {
              btn.disabled = true;
            });
            if (pendingOk) {
              b.classList.add("is-correct");
              playElementAnimation(b, "answer-correct-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)");
              burstParticles(b);
            } else {
              b.classList.add("is-wrong");
              Array.from(row.querySelectorAll("button")).forEach(function (btn) {
                if (btn.textContent === item.answer) btn.classList.add("is-correct");
              });
            }
            continueBtn.hidden = false;
          });
          row.appendChild(b);
        });
        continueBtn.addEventListener("click", function () {
          if (continueBtn.hidden) return;
          haptic(6);
          Array.from(row.querySelectorAll("button")).forEach(function (btn) {
            btn.classList.remove("is-correct", "is-wrong");
          });
          continueBtn.hidden = true;
          onAnswered(pendingOk);
        });
        wrap.appendChild(row);
        wrap.appendChild(continueBtn);
        return wrap;
      }

      grammarPanel.innerHTML = "";
      const exFlow = document.createElement("div");
      exFlow.className = "lh-topics-flow lh-ex-flow";
      const exGridWrap = document.createElement("div");
      exGridWrap.className = "lh-topics-grid-wrap";
      const exTopicGrid = document.createElement("div");
      exTopicGrid.className = "lh-topic-grid lh-ex-topic-grid";
      const exTopicSummary = document.createElement("p");
      exTopicSummary.className = "lh-topic-grid-summary lh-muted";
      const exLessonPanel = document.createElement("div");
      exLessonPanel.className =
        "lh-topics-lesson-panel lh-lesson-view lh-ex-lesson-view is-hidden-panel";
      exGridWrap.appendChild(exTopicSummary);
      exGridWrap.appendChild(exTopicGrid);
      exFlow.appendChild(exGridWrap);
      exFlow.appendChild(exLessonPanel);
      grammarPanel.appendChild(exFlow);

      let exLessonOpen = false;
      let activeExIdx = -1;

      function showExGrid() {
        exLessonOpen = false;
        activeExIdx = -1;
        exGridWrap.classList.remove("is-hidden-panel");
        exLessonPanel.classList.add("is-hidden-panel");
        exLessonPanel.innerHTML = "";
      }

      function openExLesson(idx) {
        window.scrollTo({ top: 0, behavior: "instant" });
        exLessonOpen = true;
        activeExIdx = idx;
        exGridWrap.classList.add("is-hidden-panel");
        exLessonPanel.classList.remove("is-hidden-panel");
        renderExLesson(idx);
      }

      function closeExLesson() {
        window.scrollTo({ top: 0, behavior: "instant" });
        showExGrid();
      }

      function isExerciseTopicDone(topic) {
        const user = getActiveUser();
        if (!user) return false;
        const stats = ensureStats(user);
        return (stats.completedExercises || []).includes(level + " - " + topic);
      }

      function renderExTopicCard(ex, i) {
        const done = isExerciseTopicDone(ex.topic);
        const card = document.createElement("button");
        card.type = "button";
        card.className = "lh-topic-card lh-ex-topic-card" + (done ? " lh-topic-card--done" : "");
        const num = document.createElement("span");
        num.className = "lh-topic-num";
        num.textContent = String(i + 1);
        num.setAttribute("aria-hidden", "true");
        card.appendChild(num);
        if (i < 3 && !done) {
          const startHere = document.createElement("span");
          startHere.className = "lh-topic-card__start-here";
          startHere.textContent = I18n.t("learning_topic_start_here");
          startHere.style.backgroundColor = levelColor.accent;
          card.appendChild(startHere);
        }
        if (done) {
          const statusWrap = document.createElement("span");
          statusWrap.className = "lh-topic-card__status";
          const check = document.createElement("span");
          check.className = "lh-topic-card__check";
          check.textContent = "✓";
          check.style.color = levelColor.accent;
          check.setAttribute("aria-hidden", "true");
          statusWrap.appendChild(check);
          const undoBtn = document.createElement("button");
          undoBtn.type = "button";
          undoBtn.className = "lh-undo-link";
          undoBtn.textContent = I18n.t("learning_ex_undo_done");
          undoBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!getActiveUser()) return;
            undoExerciseCompletion(level, ex.topic);
            renderExTopicList();
            refreshLandingCardProgress(root, level, data);
            renderProgressPanel();
          });
          statusWrap.appendChild(undoBtn);
          card.appendChild(statusWrap);
        }
        const h = document.createElement("span");
        h.className = "lh-topic-card__title";
        h.textContent = exerciseTopicLabel(ex);
        card.appendChild(h);
        if (ex.subtitle || EXERCISE_SUBTITLE_FR[ex.topic]) {
          const sub = document.createElement("p");
          sub.className = "lh-topic-card__subtitle";
          sub.textContent = exerciseSubtitleLabel(ex);
          card.appendChild(sub);
        }
        card.addEventListener("click", function () {
          openExLesson(i);
        });
        return card;
      }

      function renderExTopicList() {
        const exercises = data.exercises || [];
        let doneCount = 0;
        exercises.forEach(function (ex) {
          if (isExerciseTopicDone(ex.topic)) doneCount += 1;
        });
        exTopicSummary.textContent = I18n.t("learning_progress_grammar_summary", {
          n: String(doneCount),
          t: String(exercises.length),
        });
        exTopicGrid.innerHTML = "";
        const incomplete = [];
        const completed = [];
        exercises.forEach(function (ex, i) {
          const entry = { ex: ex, i: i };
          if (isExerciseTopicDone(ex.topic)) completed.push(entry);
          else incomplete.push(entry);
        });
        incomplete.forEach(function (entry) {
          exTopicGrid.appendChild(renderExTopicCard(entry.ex, entry.i));
        });
        if (completed.length) {
          const sep = document.createElement("div");
          sep.className = "lh-ex-topic-grid__separator";
          sep.setAttribute("aria-hidden", "true");
          const sepLabel = document.createElement("span");
          sepLabel.className = "lh-ex-topic-grid__separator-label";
          sepLabel.textContent = I18n.t("learning_topics_completed_sep");
          sep.appendChild(sepLabel);
          exTopicGrid.appendChild(sep);
          completed.forEach(function (entry) {
            exTopicGrid.appendChild(renderExTopicCard(entry.ex, entry.i));
          });
        }
      }

      function renderExLesson(idx) {
        const ex = data.exercises[idx];
        if (!ex) return;
        exLessonPanel.innerHTML = "";

        const backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.className = "btn-text lh-lesson-view__back";
        backBtn.setAttribute("data-learning-chrome", "learning_ex_back");
        backBtn.textContent = I18n.t("learning_ex_back");
        backBtn.addEventListener("click", closeExLesson);

        const title = document.createElement("h3");
        title.className = "lh-lesson-view__title";
        title.textContent = exerciseTopicLabel(ex);

        const learnSec = document.createElement("section");
        learnSec.className = "lh-lesson-block lh-lesson-section--learn";
        const learnH = document.createElement("h4");
        learnH.className = "lh-lesson-block__title";
        learnH.setAttribute("data-learning-chrome", "learning_ex_learn");
        learnH.textContent = I18n.t("learning_ex_learn");
        learnSec.appendChild(learnH);
        learnSec.appendChild(buildLearnPanel(ex));

        const examplesSec = document.createElement("section");
        examplesSec.className = "lh-lesson-block lh-lesson-section--examples";
        const examplesH = document.createElement("h4");
        examplesH.className = "lh-lesson-block__title";
        examplesH.setAttribute("data-learning-chrome", "learning_ex_examples");
        examplesH.textContent = I18n.t("learning_ex_examples");
        examplesSec.appendChild(examplesH);
        const examplesPlay = document.createElement("div");
        examplesPlay.className = "lh-ex-examples-play";

        const exGapAllItems = [];
        (ex.examples || []).forEach(function (line) {
          const g = parseGapLine(line);
          if (g) exGapAllItems.push(g);
        });
        const exGapOriginalLength = exGapAllItems.length;
        let exGapQueue = shuffleGapItems(exGapAllItems);
        let exGapFirstPassCorrect = 0;
        const exGapFirstSeen = Object.create(null);
        let exGapPosition = 0;
        let exGapWrongAdds = 0;

        function resetGapSession() {
          exGapQueue = shuffleGapItems(exGapAllItems);
          exGapFirstPassCorrect = 0;
          exGapPosition = 0;
          exGapWrongAdds = 0;
          Object.keys(exGapFirstSeen).forEach(function (k) {
            delete exGapFirstSeen[k];
          });
          renderExampleStep();
        }

        function renderGapComplete() {
          examplesPlay.innerHTML = "";
          const card = document.createElement("div");
          card.className = "lh-gap-results";

          const emoji = document.createElement("p");
          emoji.className = "lh-gap-results__emoji";
          emoji.textContent = "🎉";

          const fraction = document.createElement("p");
          fraction.className = "lh-gap-results__fraction";
          fraction.textContent =
            String(exGapFirstPassCorrect) + "/" + String(exGapOriginalLength);

          const restartBtn = document.createElement("button");
          restartBtn.type = "button";
          restartBtn.className = "flashcard-btn lh-primary-btn";
          restartBtn.textContent = I18n.t("learning_gap_restart");
          restartBtn.addEventListener("click", resetGapSession);

          card.appendChild(emoji);
          card.appendChild(fraction);
          card.appendChild(restartBtn);
          examplesPlay.appendChild(card);
        }

        function handleGapAnswer(item, ok) {
          const key = gapItemKey(item);
          if (!exGapFirstSeen[key]) {
            exGapFirstSeen[key] = true;
            if (ok) exGapFirstPassCorrect += 1;
          }

          exGapQueue.shift();
          if (!ok) {
            exGapWrongAdds += 1;
            exGapQueue.push(copyGapItem(item));
          }

          if (!exGapQueue.length) renderGapComplete();
          else renderExampleStep();
        }

        function renderExampleStep() {
          examplesPlay.innerHTML = "";
          if (!exGapOriginalLength) {
            const p = document.createElement("p");
            p.className = "lh-muted";
            p.textContent = I18n.t("learning_exercise_no_inline");
            examplesPlay.appendChild(p);
            return;
          }
          if (!exGapQueue.length) {
            renderGapComplete();
            return;
          }
          exGapPosition += 1;
          const item = exGapQueue[0];
          const prog = document.createElement("p");
          prog.className = "lh-muted lh-ex-example-prog";
          prog.textContent = I18n.t("learning_ex_example_progress", {
            current: String(exGapPosition),
            total: String(exGapOriginalLength + exGapWrongAdds),
          });
          const card = buildGapMcRow(item, exGapAllItems, exGapPosition, handleGapAnswer);
          examplesPlay.appendChild(prog);
          examplesPlay.appendChild(card);
        }
        examplesSec.appendChild(examplesPlay);

        const practiceSec = document.createElement("section");
        practiceSec.className = "lh-lesson-block lh-lesson-section--practice";
        const practiceH = document.createElement("h4");
        practiceH.className = "lh-lesson-block__title";
        practiceH.setAttribute("data-learning-chrome", "learning_ex_practice");
        practiceH.textContent = I18n.t("learning_ex_practice");
        const practiceP = document.createElement("p");
        practiceP.className = "lh-lesson-practice";
        practiceP.textContent = ex.practice || I18n.t("learning_exercise_extension_default");
        const selfMarkBtn = document.createElement("button");
        selfMarkBtn.type = "button";
        selfMarkBtn.className = "flashcard-btn lh-primary-btn";
        selfMarkBtn.setAttribute("data-learning-chrome", "learning_ex_mark_done");
        const practiceMsg = document.createElement("p");
        practiceMsg.className = "exercise-complete-msg hidden";

        function syncPracticeMarkBtn() {
          const user = getActiveUser();
          const done = isExerciseTopicDone(ex.topic);
          if (!user) {
            selfMarkBtn.disabled = true;
            selfMarkBtn.className = "flashcard-btn lh-primary-btn";
            selfMarkBtn.textContent = I18n.t("learning_ex_mark_done");
            practiceMsg.classList.add("hidden");
            return;
          }
          selfMarkBtn.disabled = false;
          if (done) {
            selfMarkBtn.className = "lh-undo-link lh-practice-undo-btn";
            selfMarkBtn.textContent = I18n.t("learning_ex_undo_done");
            practiceMsg.textContent = I18n.t("learning_ex_practice_congrats");
            practiceMsg.classList.remove("hidden");
          } else {
            selfMarkBtn.className = "flashcard-btn lh-primary-btn";
            selfMarkBtn.textContent = I18n.t("learning_ex_mark_done");
            practiceMsg.classList.add("hidden");
          }
        }

        selfMarkBtn.addEventListener("click", function () {
          if (!getActiveUser()) return;
          if (isExerciseTopicDone(ex.topic)) {
            undoExerciseCompletion(level, ex.topic);
            renderExTopicList();
            syncPracticeMarkBtn();
            refreshLandingCardProgress(root, level, data);
            renderProgressPanel();
          } else {
            const res = recordExerciseCompletion(level, ex.topic);
            if (res && res.ok) {
              const flash = showTopicCompleteFlash(exLessonPanel, exerciseTopicLabel(ex));
              setTimeout(function () {
                if (flash.parentNode) flash.parentNode.removeChild(flash);
                renderExTopicList();
                refreshLandingCardProgress(root, level, data);
                renderProgressPanel();
                closeExLesson();
              }, 1200);
            } else {
              renderExTopicList();
              syncPracticeMarkBtn();
              refreshLandingCardProgress(root, level, data);
              renderProgressPanel();
            }
          }
        });
        syncPracticeMarkBtn();
        practiceSec.appendChild(practiceH);
        practiceSec.appendChild(practiceP);
        practiceSec.appendChild(selfMarkBtn);
        practiceSec.appendChild(practiceMsg);

        exLessonPanel.appendChild(backBtn);
        exLessonPanel.appendChild(title);
        exLessonPanel.appendChild(learnSec);
        exLessonPanel.appendChild(examplesSec);
        exLessonPanel.appendChild(practiceSec);
        renderExampleStep();
      }

      function refreshExercisesPanel() {
        if (exLessonOpen && activeExIdx >= 0) renderExLesson(activeExIdx);
        else renderExTopicList();
      }
      renderExTopicList();

      flashcardsPanel.innerHTML = "";
      const stage = document.createElement("div");
      stage.className = "flashcard-stage";
      const top = document.createElement("div");
      top.className = "flashcard-trainer__top flashcard-trainer__top--stack";
      const deckRow = document.createElement("div");
      deckRow.className = "flashcard-trainer__top-row";
      const label = document.createElement("label");
      label.setAttribute("for", "flashcard-topic-" + level);
      label.textContent = I18n.t("flashcard_deck_label");
      const topicSelect = document.createElement("select");
      topicSelect.id = "flashcard-topic-" + level;
      topicSelect.className = "flashcard-topic";
      deckRow.appendChild(label);
      deckRow.appendChild(topicSelect);
      top.appendChild(deckRow);
      const deckCountHint = document.createElement("p");
      deckCountHint.className = "flashcard-deck-count";
      deckCountHint.setAttribute("aria-live", "polite");
      const sessionHint = document.createElement("p");
      sessionHint.className = "flashcard-session-hint";
      const sessionProgressTrack = document.createElement("div");
      sessionProgressTrack.className = "flashcard-progress-bar-track";
      const sessionProgressFill = document.createElement("div");
      sessionProgressFill.className = "flashcard-progress-bar-fill";
      sessionProgressTrack.appendChild(sessionProgressFill);
      const sessionProgressLabel = document.createElement("p");
      sessionProgressLabel.className = "flashcard-progress-label";
      const liveScore = document.createElement("p");
      liveScore.className = "flashcard-live-score";
      liveScore.setAttribute("aria-live", "polite");
      const flipBtn = document.createElement("button");
      flipBtn.type = "button";
      flipBtn.className = "flashcard";
      const langToggleBtn = document.createElement("button");
      langToggleBtn.type = "button";
      langToggleBtn.className = "flashcard-lang-toggle";
      function syncLangToggleLabel() {
        const current = readFlashcardFirstLang();
        langToggleBtn.textContent = I18n.t(
          current === "fr" ? "flashcard_lang_toggle_to_en" : "flashcard_lang_toggle_to_fr"
        );
        langToggleBtn.setAttribute(
          "aria-label",
          I18n.t(current === "fr" ? "flashcard_order_en_option" : "flashcard_order_fr_option")
        );
      }
      syncLangToggleLabel();
      langToggleBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        writeFlashcardFirstLang(readFlashcardFirstLang() === "fr" ? "en" : "fr");
      });
      const bookmarkBtn = document.createElement("button");
      bookmarkBtn.type = "button";
      bookmarkBtn.className = "flashcard-bookmark";
      bookmarkBtn.setAttribute("aria-label", I18n.t("flashcard_bookmark_add"));
      const removeSavedBtn = document.createElement("button");
      removeSavedBtn.type = "button";
      removeSavedBtn.className = "flashcard-btn flashcard-remove-saved";
      removeSavedBtn.style.color = "#b74848";
      removeSavedBtn.textContent = I18n.t("flashcard_remove_saved");
      removeSavedBtn.hidden = true;
      const bookmarkSvgOutline =
        '<svg class="flashcard-bookmark__svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"><path d="M7 3h10a1 1 0 0 1 1 1v17l-5-3.5L8 21V4a1 1 0 0 1 1-1z"/></svg>';
      const bookmarkSvgFilled =
        '<svg class="flashcard-bookmark__svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M7 3h10a1 1 0 0 1 1 1v17l-5-3.5L8 21V4a1 1 0 0 1 1-1z"/></svg>';
      const front = document.createElement("span");
      front.className = "flashcard__side flashcard__front";
      const back = document.createElement("span");
      back.className = "flashcard__side flashcard__back";
      flipBtn.appendChild(langToggleBtn);
      flipBtn.appendChild(removeSavedBtn);
      flipBtn.appendChild(bookmarkBtn);
      flipBtn.appendChild(front);
      flipBtn.appendChild(back);
      const controls = document.createElement("div");
      controls.className = "flashcard-controls";
      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "flashcard-btn";
      prevBtn.textContent = I18n.t("flashcard_prev");
      const progress = document.createElement("span");
      progress.className = "flashcard-progress";
      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "flashcard-btn";
      nextBtn.textContent = I18n.t("flashcard_next");
      const againBtn = document.createElement("button");
      againBtn.type = "button";
      againBtn.className = "flashcard-btn flashcard-btn--save-later";
      againBtn.textContent = I18n.t("flashcard_again");
      const gotItBtn = document.createElement("button");
      gotItBtn.type = "button";
      gotItBtn.className = "flashcard-btn flashcard-btn--got-it";
      gotItBtn.textContent = I18n.t("flashcard_got_it");
      controls.appendChild(prevBtn);
      controls.appendChild(progress);
      controls.appendChild(nextBtn);
      controls.appendChild(againBtn);
      controls.appendChild(gotItBtn);
      const completeOverlay = document.createElement("div");
      completeOverlay.className = "flashcard-complete-overlay hidden";
      const completeInner = document.createElement("div");
      completeInner.className = "flashcard-complete-overlay__inner";
      const completeTitle = document.createElement("h4");
      const completePct = document.createElement("div");
      completePct.className = "flashcard-complete-pct";
      const completeStars = document.createElement("div");
      completeStars.className = "flashcard-complete-stars";
      completeStars.setAttribute("aria-hidden", "true");
      const completeStarSpans = [];
      for (let si = 0; si < 3; si += 1) {
        const starSpan = document.createElement("span");
        starSpan.textContent = "★";
        completeStars.appendChild(starSpan);
        completeStarSpans.push(starSpan);
      }
      const completeMsg = document.createElement("p");
      completeMsg.className = "flashcard-complete-msg";
      const completeSummary = document.createElement("p");
      const completeActions = document.createElement("div");
      completeActions.className = "flashcard-complete-actions";
      const btnWrongOnly = document.createElement("button");
      btnWrongOnly.type = "button";
      btnWrongOnly.className = "btn-primary";
      btnWrongOnly.textContent = I18n.t("flashcard_complete_wrong_only");
      const btnFullAgain = document.createElement("button");
      btnFullAgain.type = "button";
      btnFullAgain.className = "flashcard-btn";
      btnFullAgain.textContent = I18n.t("flashcard_complete_full_again");
      completeActions.appendChild(btnWrongOnly);
      completeActions.appendChild(btnFullAgain);
      completeInner.appendChild(completeTitle);
      completeInner.appendChild(completePct);
      completeInner.appendChild(completeStars);
      completeInner.appendChild(completeMsg);
      completeInner.appendChild(completeSummary);
      completeInner.appendChild(completeActions);
      completeOverlay.appendChild(completeInner);
      stage.appendChild(top);
      stage.appendChild(deckCountHint);
      stage.appendChild(sessionHint);
      stage.appendChild(sessionProgressTrack);
      stage.appendChild(sessionProgressLabel);
      stage.appendChild(liveScore);
      stage.appendChild(flipBtn);
      stage.appendChild(controls);
      stage.appendChild(completeOverlay);
      flashcardsPanel.appendChild(stage);

      const decks = data.flashcards;
      const topicNames = Object.keys(decks);
      const SAVED_CARDS_DECK = "__saved_cards__";

      function sortedFlashcardDeckNames(names) {
        const themed = names
          .filter(function (name) {
            return name !== "Master 1000";
          })
          .sort();
        if (names.indexOf("Master 1000") >= 0) {
          themed.push("Master 1000");
        }
        return themed;
      }

      function defaultFlashcardTopic(names) {
        const ordered = sortedFlashcardDeckNames(names);
        return ordered[0] || "";
      }

      function flashcardDeckOptionLabel(name) {
        if (name === "Master 1000") return I18n.t("flashcard_full_deck_name");
        if (name === IRREGULAR_DECK_NAME) return I18n.t("learning_tab_verbs");
        return name;
      }

      let activeTopic = defaultFlashcardTopic(topicNames);
      let sessionIndices = [];
      let sessionPos = 0;
      let sessionCorrect = 0;
      let sessionWrong = 0;
      let wrongKeysThisSession = {};
      let lastSessionWrongKeys = null;
      let lastSessionMode = "full";
      let lastCompleteStats = null;
      let showingBack = false;
      let sessionSummarySaved = false;

      function updateFlashcardSessionProgress() {
        const total = sessionIndices.length;
        const completed = total ? Math.min(sessionPos, total) : 0;
        const pct = total ? (completed / total) * 100 : 0;
        sessionProgressFill.style.width = String(pct) + "%";
        sessionProgressFill.style.backgroundColor = levelColor.accent;
        sessionProgressLabel.textContent = total
          ? I18n.t("flashcard_session_progress", {
              n: String(completed),
              total: String(total),
            })
          : "";
        updateLiveScore();
      }

      function updateLiveScore() {
        const total = sessionIndices.length;
        if (!total) {
          liveScore.textContent = "";
          liveScore.classList.add("hidden");
          return;
        }
        liveScore.classList.remove("hidden");
        liveScore.textContent = I18n.t("flashcard_live_score", {
          correct: String(sessionCorrect),
          total: String(total),
        });
      }

      function flashcardStarFillCount(pct) {
        if (pct > 90) return 3;
        if (pct >= 70) return 2;
        return 1;
      }

      function flashcardCompleteEncouragement(pct) {
        if (pct > 90) return I18n.t("flashcard_complete_msg_excellent");
        if (pct >= 70) return I18n.t("flashcard_complete_msg_good");
        return I18n.t("flashcard_complete_msg_review");
      }

      function updateCompleteOverlay(stats) {
        const total = stats.total || 0;
        const pct =
          stats.pct != null ? stats.pct : total ? Math.round((stats.correct / total) * 100) : 0;
        const filled = flashcardStarFillCount(pct);
        completeTitle.textContent = I18n.t("flashcard_complete_title");
        completePct.textContent = String(pct) + "%";
        completeStarSpans.forEach(function (starSpan, i) {
          starSpan.style.color = i < filled ? "var(--accent)" : "var(--border)";
        });
        completeMsg.textContent = flashcardCompleteEncouragement(pct);
        completeSummary.textContent = I18n.t("flashcard_complete_summary", {
          correct: String(stats.correct),
          wrong: String(stats.wrong),
          total: String(stats.total),
        });
      }

      function applySessionHintFromState() {
        const deck = fullDeck();
        if (!deck.length || !sessionIndices.length) {
          return;
        }
        const totalInDeck = deck.length;
        const n = sessionIndices.length;
        if (totalInDeck > FLASHCARD_SESSION_CAP) {
          sessionHint.textContent = I18n.t("flashcard_session_sample_hint", {
            n: String(n),
            total: String(totalInDeck),
          });
        } else {
          sessionHint.textContent = I18n.t("flashcard_session_full_hint", { n: String(n) });
        }
      }

      const flashMeta = function () {
        return {
          level: level,
          topic: activeTopic === SAVED_CARDS_DECK ? I18n.t("flashcard_saved_deck_name") : activeTopic,
        };
      };

      function savedDeckCards() {
        const user = getActiveUser();
        if (!user) return [];
        const lh = ensureLearningHub(ensureStats(user));
        return (lh.savedFlashcards || [])
          .filter(function (item) {
            return item.level === level;
          })
          .map(function (item) {
            return {
              front: item.front,
              back: item.back,
              _savedDeck: item.deck,
            };
          });
      }

      function currentCardSourceDeck(card) {
        if (activeTopic === SAVED_CARDS_DECK) {
          return (card && card._savedDeck) || I18n.t("flashcard_saved_deck_name");
        }
        return activeTopic;
      }

      function isCardBookmarked(card) {
        const user = getActiveUser();
        if (!user || !card) return false;
        const lh = ensureLearningHub(ensureStats(user));
        const sourceDeck = currentCardSourceDeck(card);
        return (lh.savedFlashcards || []).some(function (item) {
          return (
            item.level === level &&
            item.deck === sourceDeck &&
            item.front === card.front &&
            item.back === card.back
          );
        });
      }

      function updateBookmarkButton(card) {
        if (!card) {
          bookmarkBtn.hidden = true;
          return;
        }
        bookmarkBtn.hidden = false;
        const user = getActiveUser();
        if (!user) {
          bookmarkBtn.disabled = true;
          bookmarkBtn.classList.remove("is-saved");
          bookmarkBtn.innerHTML = bookmarkSvgOutline;
          bookmarkBtn.setAttribute("aria-label", I18n.t("flashcard_bookmark_add"));
          return;
        }
        bookmarkBtn.disabled = false;
        const saved = isCardBookmarked(card);
        bookmarkBtn.classList.toggle("is-saved", saved);
        bookmarkBtn.innerHTML = saved ? bookmarkSvgFilled : bookmarkSvgOutline;
        bookmarkBtn.setAttribute(
          "aria-label",
          saved ? I18n.t("flashcard_bookmark_remove") : I18n.t("flashcard_bookmark_add")
        );
      }

      function updateRemoveSavedButton(card) {
        const onSavedDeck = activeTopic === SAVED_CARDS_DECK;
        if (
          !onSavedDeck ||
          !card ||
          !getActiveUser() ||
          !sessionIndices.length ||
          sessionPos >= sessionIndices.length
        ) {
          removeSavedBtn.hidden = true;
          return;
        }
        removeSavedBtn.hidden = false;
        removeSavedBtn.textContent = I18n.t("flashcard_remove_saved");
      }

      function fullDeck() {
        if (activeTopic === SAVED_CARDS_DECK) {
          return savedDeckCards();
        }
        return decks[activeTopic] || [];
      }

      function startSession(mode, wrongKeyFilter) {
        const deck = fullDeck();
        lastSessionMode = mode || "full";
        wrongKeysThisSession = {};
        sessionCorrect = 0;
        sessionWrong = 0;
        showingBack = false;
        sessionSummarySaved = false;
        completeOverlay.classList.add("hidden");
        lastCompleteStats = null;
        if (!deck.length) {
          sessionIndices = [];
          sessionPos = 0;
          lastSessionWrongKeys = null;
          sessionHint.textContent = "";
          updateFlashcardSessionProgress();
          renderCard();
          return;
        }
        const useWrongFilter =
          wrongKeyFilter &&
          typeof wrongKeyFilter.has === "function" &&
          wrongKeyFilter.size > 0;
        if (useWrongFilter) {
          sessionIndices = [];
          for (let i = 0; i < deck.length; i += 1) {
            if (wrongKeyFilter.has(flashcardCardKey(deck[i]))) sessionIndices.push(i);
          }
        } else {
          sessionIndices = buildFlashcardSessionIndices(deck.length);
        }
        if (!sessionIndices.length) {
          sessionPos = 0;
          lastSessionWrongKeys = null;
          updateFlashcardSessionProgress();
          renderCard();
          return;
        }
        sessionPos = 0;
        lastSessionWrongKeys = null;
        applySessionHintFromState();
        prevBtn.classList.add("hidden");
        nextBtn.classList.add("hidden");
        updateFlashcardSessionProgress();
        renderCard();
      }

      function finishSession() {
        if (sessionSummarySaved) return;
        sessionSummarySaved = true;
        const total = sessionIndices.length;
        const wrongCount = sessionWrong;
        const correctCount = sessionCorrect;
        const accuracyPct = total ? Math.round((sessionCorrect / total) * 100) : 0;
        lastSessionWrongKeys = {};
        Object.keys(wrongKeysThisSession).forEach(function (k) {
          lastSessionWrongKeys[k] = true;
        });
        lastCompleteStats = {
          correct: correctCount,
          wrong: wrongCount,
          total: total,
          pct: accuracyPct,
        };
        recordFlashcardSessionComplete({
          level: level,
          topic: activeTopic,
          correct: correctCount,
          wrong: wrongCount,
          total: total,
          mode: lastSessionMode,
        });
        updateCompleteOverlay(lastCompleteStats);
        const wrongSetSize = Object.keys(lastSessionWrongKeys).length;
        btnWrongOnly.classList.toggle("hidden", wrongSetSize === 0);
        completeOverlay.classList.remove("hidden");
        playElementAnimation(completeInner, "celebrate-bounce 0.4s ease");
      }

      function updateDeckCountHint() {
        const n = fullDeck().length;
        deckCountHint.textContent =
          n === 1 ? I18n.t("flashcard_deck_card_count_one") : I18n.t("flashcard_deck_card_count", { n: String(n) });
      }

      function populateTopicSelect() {
        const prev = activeTopic;
        topicSelect.innerHTML = "";
        const savedOpt = document.createElement("option");
        savedOpt.value = SAVED_CARDS_DECK;
        savedOpt.setAttribute("data-saved-deck-option", "1");
        savedOpt.textContent = I18n.t("flashcard_saved_deck_name");
        topicSelect.appendChild(savedOpt);
        sortedFlashcardDeckNames(topicNames).forEach(function (name) {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = flashcardDeckOptionLabel(name);
          topicSelect.appendChild(option);
        });
        if (prev === SAVED_CARDS_DECK || (prev && topicNames.indexOf(prev) >= 0)) {
          activeTopic = prev;
        } else {
          activeTopic = defaultFlashcardTopic(topicNames);
        }
        topicSelect.value = activeTopic;
      }

      populateTopicSelect();
      updateDeckCountHint();

      function renderCard() {
        const deck = fullDeck();
        if (sessionIndices.length && sessionPos >= sessionIndices.length) {
          if (!sessionSummarySaved) finishSession();
          front.textContent = I18n.t("flashcard_session_done_face");
          back.textContent = I18n.t("flashcard_session_done_back");
          progress.textContent =
            String(sessionIndices.length) + " / " + String(sessionIndices.length);
          flipBtn.classList.remove("is-flipped");
          showingBack = false;
          bookmarkBtn.hidden = true;
          removeSavedBtn.hidden = true;
          updateFlashcardSessionProgress();
          return;
        }
        if (!deck.length) {
          if (activeTopic === SAVED_CARDS_DECK) {
            front.textContent = I18n.t("flashcard_saved_empty");
          } else {
            front.textContent = I18n.t("flashcard_empty_deck");
          }
          back.textContent = "";
          progress.textContent = "0 / 0";
          sessionHint.textContent = "";
          bookmarkBtn.hidden = true;
          removeSavedBtn.hidden = true;
          updateFlashcardSessionProgress();
          return;
        }
        if (!sessionIndices.length) {
          front.textContent = I18n.t("flashcard_pick_deck");
          back.textContent = "";
          progress.textContent = "0 / 0";
          bookmarkBtn.hidden = true;
          removeSavedBtn.hidden = true;
          updateFlashcardSessionProgress();
          return;
        }
        const idx = sessionIndices[sessionPos];
        const card = deck[idx];
        if (!card) return;
        const enLine = I18n.t("flashcard_side_english") + card.front;
        const frLine = I18n.t("flashcard_side_french") + card.back;
        if (readFlashcardFirstLang() === "fr") {
          front.textContent = frLine;
          back.textContent = enLine;
        } else {
          front.textContent = enLine;
          back.textContent = frLine;
        }
        progress.textContent =
          String(sessionPos + 1) + " / " + String(sessionIndices.length);
        flipBtn.classList.toggle("is-flipped", showingBack);
        updateBookmarkButton(card);
        updateRemoveSavedButton(card);
        updateFlashcardSessionProgress();
      }

      removeSavedBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const user = getActiveUser();
        if (!user || activeTopic !== SAVED_CARDS_DECK) return;
        const deckNow = fullDeck();
        if (!deckNow.length || sessionPos >= sessionIndices.length) return;
        const idx = sessionIndices[sessionPos];
        const card = deckNow[idx];
        if (!card) return;
        const stats = ensureStats(user);
        const lh = ensureLearningHub(stats);
        lh.savedFlashcards = (lh.savedFlashcards || []).filter(function (item) {
          return !(item.front === card.front && item.back === card.back);
        });
        saveUsers();
        updateDeckCountHint();
        startSession("full", null);
      });

      bookmarkBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const user = getActiveUser();
        if (!user) return;
        const deckNow = fullDeck();
        if (!deckNow.length || sessionPos >= sessionIndices.length) return;
        const idx = sessionIndices[sessionPos];
        const card = deckNow[idx];
        if (!card) return;
        const stats = ensureStats(user);
        const lh = ensureLearningHub(stats);
        if (!lh.savedFlashcards) lh.savedFlashcards = [];
        const sourceDeck = currentCardSourceDeck(card);
        let found = -1;
        for (let si = 0; si < lh.savedFlashcards.length; si += 1) {
          const item = lh.savedFlashcards[si];
          if (
            item.level === level &&
            item.deck === sourceDeck &&
            item.front === card.front &&
            item.back === card.back
          ) {
            found = si;
            break;
          }
        }
        if (found >= 0) {
          lh.savedFlashcards.splice(found, 1);
        } else {
          lh.savedFlashcards.push({
            level: level,
            deck: sourceDeck,
            front: card.front,
            back: card.back,
          });
        }
        saveUsers();
        if (activeTopic === SAVED_CARDS_DECK) {
          updateDeckCountHint();
          startSession("full", null);
        } else {
          updateBookmarkButton(card);
        }
      });

      topicSelect.addEventListener("change", function () {
        activeTopic = topicSelect.value;
        updateDeckCountHint();
        startSession("full", null);
      });

      flipBtn.addEventListener("click", function () {
        haptic(4);
        showingBack = !showingBack;
        renderCard();
      });

      nextBtn.addEventListener("click", function () {
        if (!sessionIndices.length) return;
        sessionPos = Math.min(sessionIndices.length - 1, sessionPos + 1);
        showingBack = false;
        renderCard();
      });

      prevBtn.addEventListener("click", function () {
        if (!sessionIndices.length) return;
        sessionPos = Math.max(0, sessionPos - 1);
        showingBack = false;
        renderCard();
      });

      againBtn.addEventListener("click", function () {
        haptic([8, 40, 8]);
        if (!sessionIndices.length || sessionPos >= sessionIndices.length) return;
        if (!showingBack) showingBack = true;
        const deck = fullDeck();
        const idx = sessionIndices[sessionPos];
        const card = deck[idx];
        const key = flashcardCardKey(card);
        wrongKeysThisSession[key] = true;
        sessionWrong += 1;
        recordFlashcardResult(false, flashMeta());
        playElementAnimation(flipBtn, "card-again 0.3s ease");
        sessionPos += 1;
        showingBack = false;
        if (sessionPos >= sessionIndices.length) {
          renderCard();
        } else {
          renderCard();
        }
      });

      gotItBtn.addEventListener("click", function () {
        haptic(8);
        if (!sessionIndices.length || sessionPos >= sessionIndices.length) return;
        if (!showingBack) showingBack = true;
        sessionCorrect += 1;
        recordFlashcardResult(true, flashMeta());
        playElementAnimation(flipBtn, "card-got-it 0.3s ease");
        sessionPos += 1;
        showingBack = false;
        renderCard();
      });

      btnWrongOnly.addEventListener("click", function () {
        if (!lastSessionWrongKeys) return;
        const filter = new Set(Object.keys(lastSessionWrongKeys));
        startSession("wrong_retry", filter);
      });

      btnFullAgain.addEventListener("click", function () {
        startSession("full", null);
      });

      startSession("full", null);

      flashcardOrderRefreshers.push(function () {
        syncLangToggleLabel();
        showingBack = false;
        renderCard();
      });

      learningToolsLangRefreshers.push(function () {
        root.querySelectorAll(".lh-chip--streak .lh-chip__lab").forEach(function (lab) {
          lab.textContent = I18n.t("learning_hub_streak");
        });
        const streakHintEl = root.querySelector(".lh-streak-hint");
        if (streakHintEl) streakHintEl.innerHTML = streakHintHtml();
        root.querySelectorAll("[data-learning-chrome]").forEach(function (el) {
          const key = el.getAttribute("data-learning-chrome");
          if (key) el.textContent = I18n.t(key);
        });
        const hubLevelLink = root.querySelector("[data-hub-level-link]");
        if (hubLevelLink) hubLevelLink.textContent = I18n.t("level_" + level);
        const backMenuBtn = root.querySelector(".lh-back-to-menu");
        if (backMenuBtn) backMenuBtn.textContent = I18n.t("learning_back_to_menu");
        const landingIntro = root.querySelector(".level-landing__intro");
        const landingHeading = root.querySelector(".level-landing__heading");
        if (landingIntro) landingIntro.textContent = I18n.t("learning_level_desc_" + level);
        if (landingHeading) {
          landingHeading.textContent = I18n.t("level_" + level);
          landingHeading.style.color = levelColor.accent;
        }
        applyBackToMenuColor();
        label.textContent = I18n.t("flashcard_deck_label");
        syncLangToggleLabel();
        const savedDeckOpt = topicSelect.querySelector('[data-saved-deck-option="1"]');
        if (savedDeckOpt) savedDeckOpt.textContent = I18n.t("flashcard_saved_deck_name");
        populateTopicSelect();
        updateDeckCountHint();
        prevBtn.textContent = I18n.t("flashcard_prev");
        nextBtn.textContent = I18n.t("flashcard_next");
        againBtn.textContent = I18n.t("flashcard_again");
        gotItBtn.textContent = I18n.t("flashcard_got_it");
        if (!removeSavedBtn.hidden) {
          removeSavedBtn.textContent = I18n.t("flashcard_remove_saved");
        }
        btnWrongOnly.textContent = I18n.t("flashcard_complete_wrong_only");
        btnFullAgain.textContent = I18n.t("flashcard_complete_full_again");
        applySessionHintFromState();
        updateFlashcardSessionProgress();
        if (!completeOverlay.classList.contains("hidden") && lastCompleteStats) {
          updateCompleteOverlay(lastCompleteStats);
        }
        refreshExercisesPanel();
        renderHomeworkPanel();
        renderProgressPanel();
        refreshLandingCardProgress(root, level, data);
        refreshStreakHeader();
        renderCard();
      });
  }

  if (bookingTimesUnknownInput) {
    bookingTimesUnknownInput.addEventListener("change", function () {
      if (bookingTimesUnknownInput.checked) {
        bookingSlotSelections = [];
        bookingActiveDayIndex = null;
        bookingSlotsWarning.classList.add("hidden");
      }
      buildBookingCalendar();
    });
  }

  bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const missingFields = getBookingMissingFields();
    bookingSlotsWarning.classList.add("hidden");
    if (bookingSubmitError) {
      bookingSubmitError.textContent = "";
      bookingSubmitError.classList.add("hidden");
    }
    if (missingFields.length > 0) {
      if (bookingSubmitError) {
        bookingSubmitError.textContent = I18n.t("booking_err_missing_fields_intro", {
          fields: missingFields.join(", "),
        });
        bookingSubmitError.classList.remove("hidden");
        bookingSubmitError.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      return;
    }
    const levelValue = (bookingLevelInput && bookingLevelInput.value) || "";
    const slotLabels = bookingTimesUnknownSelected()
      ? [I18n.t("booking_times_unknown_label")]
      : bookingSlotSelections
          .slice()
          .sort(bookingSortSelections)
          .map(function (s) {
            return bookingFormatSlot(s.dayIndex, s.hour);
          });
    const row = {
      parentName: (bookingParentNameInput && bookingParentNameInput.value.trim()) || "",
      parentEmail: (bookingParentEmailInput && bookingParentEmailInput.value.trim()) || "",
      studentName: (bookingStudentNameInput && bookingStudentNameInput.value.trim()) || "",
      name:
        ((bookingStudentNameInput && bookingStudentNameInput.value.trim()) || "") +
        " (" +
        (((bookingParentNameInput && bookingParentNameInput.value.trim()) || "") ||
          I18n.t("booking_parent_fallback")) +
        ")",
      phone: (bookingPhoneInput && bookingPhoneInput.value.trim()) || "",
      level: levelValue === "unknown" ? I18n.t("booking_level_unknown_badge") : levelValue,
      slots: slotLabels,
      createdAt: new Date().toLocaleString(),
    };
    let cloudSaved = false;
    if (isSupabaseConfigured()) {
      const sb = getSupabaseClient();
      if (sb) {
        const { error } = await sb.from("bookings").insert({
          name: row.name,
          phone: row.phone,
          level: row.level,
          slots: row.slots,
          parent_email: row.parentEmail || null,
        });
        cloudSaved = !error;
        if (error) console.error(error);
      }
    }
    let persisted = cloudSaved;
    if (!cloudSaved) {
      try {
        bookings.push(row);
        saveBookings();
        persisted = true;
      } catch (err) {
        console.error(err);
        persisted = false;
      }
    }
    if (!persisted) {
      if (bookingSubmitError) {
        bookingSubmitError.textContent = I18n.t("booking_error_submit");
        bookingSubmitError.classList.remove("hidden");
        bookingSubmitError.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      return;
    }
    if (adminUnlocked) {
      if (cloudSaved && hasAdminApiSecret()) {
        await refreshAdminCloudData();
      } else {
        renderAdminPanel();
      }
    }
    bookingForm.classList.add("hidden");
    bookingSuccess.classList.remove("hidden");
    if (bookingSuccessWarning) {
      const showPartial = isSupabaseConfigured() && !cloudSaved;
      bookingSuccessWarning.classList.toggle("hidden", !showPartial);
      if (showPartial) {
        bookingSuccessWarning.textContent = I18n.t("booking_error_submit_partial");
      }
    }
    if (bookingSuccessDetail) {
      if (cloudSaved) {
        bookingSuccessDetail.textContent = "";
        bookingSuccessDetail.classList.add("hidden");
      } else if (isSupabaseConfigured()) {
        bookingSuccessDetail.textContent = I18n.t("booking_success_local_fallback");
        bookingSuccessDetail.classList.remove("hidden");
      } else {
        bookingSuccessDetail.textContent = I18n.t("booking_success_small");
        bookingSuccessDetail.classList.remove("hidden");
      }
    }
  });

  loadUsers();
  initAccountPasswordUi();
  loadBookings();
  loadPayments();
  (async function bootstrapApp() {
    try {
      activeUsername = localStorage.getItem(ACTIVE_USER_KEY);
    } catch (e) {
      activeUsername = null;
    }
    if (!users[activeUsername]) activeUsername = null;
    if (activeUsername && users[activeUsername] && users[activeUsername].password) {
      const cloudUser = await fetchCloudUser(activeUsername, users[activeUsername].password);
      if (cloudUser) {
        users[activeUsername] = keepFurthestVocabPath(users[activeUsername], cloudUser);
        saveUsers();
      } else {
        scheduleActiveUserCloudSync();
      }
    }
    renderAccountPanel();
    buildBookingCalendar();
    initLearningTools();
    forceInitialHomeView();

    // ── Cinematic intro sequence ──────────────────────────────────────────
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var introStart = Date.now();
    var introFallback;

    // Fallback: skip everything and show the page immediately
    function endIntroSequence() {
      clearTimeout(introFallback);
      document.body.classList.remove("intro-running");
      document.body.style.overflow = "";
      introOverlay.classList.add("is-done");
      app.style.opacity = "1";
      app.classList.remove("hidden-until-intro");
    }

    if (prefersReducedMotion) {
      // Skip entire intro for accessibility
      endIntroSequence();
    } else {
      document.body.classList.add("intro-running");
      document.body.style.overflow = "hidden";
      introFallback = setTimeout(endIntroSequence, 5000);

      var introTitle = document.querySelector(".intro-title");
      var realH1     = document.querySelector(".site-title");

      // ── Phase 1: title fades in + deblurs (0 ms – 600 ms) ───────────
      // .intro-title starts at opacity:0 filter:blur(8px) from CSS.
      // Two rAF frames let the browser commit the CSS initial state before
      // we apply a transition to it, preventing a single-frame flash.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (introTitle) {
            introTitle.style.transition =
              "opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)," +
              "filter  600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            introTitle.style.opacity = "1";
            introTitle.style.filter  = "blur(0px)";
          }
        });
      });

      // ── Phase 3 (1400 ms) and Phase 4 (2200 ms) need accurate metrics ─
      // document.fonts.ready ensures Playfair Display is loaded before we
      // call getBoundingClientRect — fallback-font metrics cause the jump.
      document.fonts.ready.then(function () {
        if (!introTitle || !realH1) { endIntroSequence(); return; }

        // Phase 3 starts at 1400 ms from page-load
        var phase3Wait = Math.max(0, 1400 - (Date.now() - introStart));

        setTimeout(function () {
          // ── Phase 3: title relocates to h1 position (800 ms) ──────────
          var iRect = introTitle.getBoundingClientRect();
          var hRect = realH1.getBoundingClientRect();

          var iFs   = parseFloat(window.getComputedStyle(introTitle).fontSize);
          var hFs   = parseFloat(window.getComputedStyle(realH1).fontSize);
          var scale = iFs > 0 ? hFs / iFs : 0.5;

          // transform-origin: 50% 0 (top-center).
          // CSS `scale(s) translate(0, ty)` applied right-to-left:
          //   ① translate(0, ty): top-center moves to (iCenterX, iTop + ty)
          //   ② scale(s) from (iCenterX, iTop): final top-center.y = iTop + ty*s
          // Solve: iTop + ty*s = hRect.top  →  ty = (hRect.top - iTop) / s
          // tx is forced to 0 — both elements are horizontally centred.
          var ty = (hRect.top - iRect.top) / scale;

          introTitle.style.transition = "transform 800ms cubic-bezier(0.76, 0, 0.24, 1)";
          introTitle.style.transform  = "scale(" + scale + ") translate(0," + ty + "px)";

          // ── Phase 4: element entrances (starts 800 ms after Phase 3) ──
          setTimeout(function () {

            // Freeze real h1 chars at their fully-visible end-state (no replay)
            realH1.querySelectorAll(".char").forEach(function (ch) {
              ch.style.animation = "none";
              ch.style.opacity   = "1";
              ch.style.filter    = "none";
              ch.style.transform = "none";
            });

            // Grab all Phase 4 elements
            var stamp    = document.querySelector(".hero-brand-stamp");
            var tagline  = document.querySelector(".tagline");
            var rule     = document.querySelector(".home-hero__rule");
            var banner   = document.querySelector(".home-free-banner");
            var navCards = document.querySelectorAll(".nav-card");

            // ── Tear-down intro state + set every staged element's
            //    initial "from" style in a single synchronous block so the
            //    browser batches them into one render frame ──────────────
            document.body.classList.remove("intro-running");
            document.body.style.overflow = "";
            clearTimeout(introFallback);
            introOverlay.classList.add("is-done");     // overlay fades out (0.4 s)

            // Split stamp into per-character spans for letter-by-letter reveal
            if (stamp) {
              var stampText = stamp.textContent || "";
              stamp.innerHTML = "";
              stampText.split("").forEach(function (ch) {
                var sp = document.createElement("span");
                sp.textContent = ch;
                sp.style.display = ch === " " ? "inline" : "inline-block";
                sp.style.opacity = "0";
                stamp.appendChild(sp);
              });
              stamp.style.animation = "none";
              stamp.style.opacity   = "1"; // container visible; spans animate
            }

            // Hero sub-elements — freeze animations, set "from" transforms
            if (tagline) {
              tagline.style.animation  = "none";
              tagline.style.opacity    = "0";
              tagline.style.transform  = "translateY(12px)";
            }
            if (rule) {
              rule.style.animation       = "none";
              rule.style.opacity         = "0";
              rule.style.transform       = "scaleX(0)";
              rule.style.transformOrigin = "left center";
            }

            // Banner + nav cards are only hidden by .app.hidden-until-intro,
            // so set their initial states BEFORE revealing the app
            if (banner) {
              banner.style.opacity   = "0";
              banner.style.transform = "translateX(-30px)";
            }
            navCards.forEach(function (card) {
              card.style.animation       = "none";
              card.style.opacity         = "0";
              card.style.transform       = "perspective(800px) rotateX(15deg)";
              card.style.transformOrigin = "top center";
            });

            // App becomes instantly visible (staged elements hold their opacity:0)
            app.classList.remove("hidden-until-intro");
            app.style.opacity = "1";

            // Force a layout flush — browser commits the opacity:0 "from" states
            // so subsequent transitions animate FROM 0, not flash from 1→0→1
            void app.offsetHeight;

            // ── Schedule each entrance ────────────────────────────────
            var age = Date.now() - introStart; // ms elapsed since intro began

            // 1. Stamp letters — 30 ms stagger per character (from 2200 ms)
            if (stamp) {
              var spans = stamp.querySelectorAll("span");
              spans.forEach(function (sp, i) {
                setTimeout(function () {
                  sp.style.transition = "opacity 300ms ease";
                  sp.style.opacity    = "1";
                }, Math.max(0, 2200 - age) + i * 30);
              });
            }

            // 2. Tagline — slides up 12 px + fades in (from 2500 ms, 500 ms)
            if (tagline) {
              setTimeout(function () {
                tagline.style.transition =
                  "opacity 500ms ease," +
                  "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                tagline.style.opacity   = "1";
                tagline.style.transform = "translateY(0)";
              }, Math.max(0, 2500 - age));
            }

            // 3. Divider line — draws left to right (from 2700 ms, 400 ms)
            if (rule) {
              setTimeout(function () {
                rule.style.transition =
                  "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)," +
                  "opacity 400ms ease";
                rule.style.opacity   = "1";
                rule.style.transform = "scaleX(1)";
              }, Math.max(0, 2700 - age));
            }

            // 4. Banner — slides in from left (from 2900 ms, 400 ms)
            if (banner) {
              setTimeout(function () {
                banner.style.transition =
                  "opacity 400ms ease," +
                  "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                banner.style.opacity   = "1";
                banner.style.transform = "translateX(0)";
              }, Math.max(0, 2900 - age));
            }

            // 5. Nav cards — flip up from rotateX(15°), 80 ms stagger (from 3000 ms)
            navCards.forEach(function (card, i) {
              setTimeout(function () {
                card.style.transition =
                  "opacity 400ms ease," +
                  "transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                card.style.opacity   = "1";
                card.style.transform = "perspective(800px) rotateX(0deg)";
              }, Math.max(0, 3000 - age) + i * 80);
            });
            // ──────────────────────────────────────────────────────────

          }, 800); // Phase 3 animation duration

        }, phase3Wait);
      });
    }
    // ─────────────────────────────────────────────────────────────────────
  })();

  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 300);
    }, { passive: true });
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Scroll-reveal via IntersectionObserver (landing page only) ---
  (function () {
    var REVEAL_SELECTOR = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-bounce";
    var REVEAL_SIBLING_SELECTOR = ":scope > .reveal, :scope > .reveal-left, :scope > .reveal-right";

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        // Stagger siblings of the same reveal family in the same direct parent
        // (used for nav cards, FAQ items, why-points, etc.)
        var siblings = Array.prototype.slice.call(
          el.parentElement.querySelectorAll(REVEAL_SIBLING_SELECTOR)
        );
        var idx = siblings.indexOf(el);
        // 80ms stagger, max 6 cards; reveal-scale/bounce use CSS transition-delay so JS delay = 0
        var isScaleOrBounce = el.classList.contains("reveal-scale") || el.classList.contains("reveal-bounce");
        var delay = (!isScaleOrBounce && idx >= 0) ? Math.min(idx, 6) * 80 : 0;

        setTimeout(function () {
          el.classList.add("visible");
        }, delay);

        observer.unobserve(el);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
      observer.observe(el);
    });
  }());
})();
