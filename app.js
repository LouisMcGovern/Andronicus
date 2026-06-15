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
    heading.textContent = String(days) + " jours de suite !";
    const subline = document.createElement("p");
    subline.textContent = "Continue comme ça !";
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
    title.textContent = "Topic terminé !";
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
    document.querySelectorAll(".teacher-figure__caption").forEach(function (cap, i) {
      cap.textContent = I18n.t("teacher_caption_" + (i + 1));
    });
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
   * dayIndex: Mon=0 … Sun=6; hour is wall-clock 9–20 in France (Europe/Paris local time).
   */
  let bookingSlotSelections = [];

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
  let userCloudSyncTimer = null;
  let userCloudSyncInFlight = false;
  let userCloudSyncQueued = false;

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
    "Conditionals (0, 1st, 2nd)": "Conditionnels (0, 1er, 2e)",
    "Reported speech": "Discours indirect",
    "Passive voice in context": "Voix passive",
    "Comparatives and superlatives for argument writing": "Comparatif et superlatif",
    "Essay paragraph structure (PEEL)": "Structure de paragraphe (PEEL)",
    "Linkers for cohesion (however, therefore, moreover)": "Connecteurs logiques",
    "Error correction and redrafting": "Correction et réécriture",
    "Possessive adjectives in advanced writing": "Adjectifs possessifs (écriture avancée)",
    "Cleft and inversion practice": "Phrases clivées et inversion",
    "Hedging and academic caution": "Atténuation académique",
    "Nominalisation for formal writing": "Nominalisation",
    "Paraphrasing and synonym control": "Paraphrase et synonymes",
    "Complex sentence cohesion": "Cohésion de phrases complexes",
    "Advanced punctuation and clarity": "Ponctuation avancée",
    "Synthesis writing from two sources": "Synthèse de deux sources",
    "Timed high-level speaking response": "Oral chronométré",
    "Abstract topic essay planning": "Plan de dissertation",
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
          { front: "How are you?", back: "Comment ca va ?" },
          { front: "Please", back: "S'il vous plait" },
          { front: "Thank you", back: "Merci" },
          { front: "See you tomorrow", back: "A demain" },
          { front: "Good evening", back: "Bonsoir" },
          { front: "Good night", back: "Bonne nuit" },
          { front: "Goodbye", back: "Au revoir" },
          { front: "Excuse me", back: "Excusez-moi" },
          { front: "Sorry", back: "Desole" },
          { front: "Yes / No", back: "Oui / Non" },
          { front: "Maybe", back: "Peut-etre" },
          { front: "I don't understand", back: "Je ne comprends pas" },
          { front: "Can you repeat?", back: "Pouvez-vous repeter ?" },
          { front: "How do you say...?", back: "Comment dit-on ... ?" },
          { front: "What does that mean?", back: "Qu'est-ce que ca veut dire ?" },
          { front: "I would like", back: "Je voudrais" },
          { front: "I need help", back: "J'ai besoin d'aide" },
          { front: "Where is...?", back: "Ou est ... ?" },
          { front: "What time is it?", back: "Quelle heure est-il ?" },
          { front: "Nice to meet you", back: "Enchanté" },
        ],
        "School and Study": [
          { front: "Homework", back: "Devoirs" },
          { front: "Notebook", back: "Cahier" },
          { front: "Classroom", back: "Salle de classe" },
          { front: "Exam", back: "Examen" },
          { front: "To learn", back: "Apprendre" },
          { front: "To improve", back: "Ameliorer" },
          { front: "Teacher", back: "Professeur" },
          { front: "Student", back: "Eleve" },
          { front: "Lesson", back: "Lecon" },
          { front: "Break time", back: "Recreation" },
          { front: "Dictionary", back: "Dictionnaire" },
          { front: "Pencil case", back: "Trousse" },
          { front: "Ruler", back: "Regle" },
          { front: "Eraser", back: "Gomme" },
          { front: "Sharpener", back: "Taille-crayon" },
          { front: "School bag", back: "Cartable" },
          { front: "Timetable", back: "Emploi du temps" },
          { front: "Mark / grade", back: "Note" },
          { front: "Subject", back: "Matiere" },
          { front: "Science lab", back: "Salle de sciences" },
          { front: "Playground", back: "Cour de recreation" },
          { front: "Head teacher", back: "Directeur / directrice" },
        ],
        "Home and Town": [
          { front: "Kitchen", back: "Cuisine" },
          { front: "Bedroom", back: "Chambre" },
          { front: "Library", back: "Bibliotheque" },
          { front: "Crossroad", back: "Carrefour" },
          { front: "Neighbourhood", back: "Quartier" },
          { front: "Traffic lights", back: "Feux de circulation" },
          { front: "Bus stop", back: "Arret de bus" },
          { front: "Train station", back: "Gare" },
          { front: "Post office", back: "Bureau de poste" },
          { front: "Pharmacy", back: "Pharmacie" },
          { front: "Bakery", back: "Boulangerie" },
          { front: "Supermarket", back: "Supermarche" },
          { front: "Park", back: "Parc" },
          { front: "Bridge", back: "Pont" },
          { front: "River", back: "Riviere" },
          { front: "Turn left", back: "Tournez a gauche" },
          { front: "Turn right", back: "Tournez a droite" },
          { front: "Go straight on", back: "Allez tout droit" },
          { front: "Is it far?", back: "C'est loin ?" },
          { front: "Near / far", back: "Pres / loin" },
          { front: "City centre", back: "Centre-ville" },
          { front: "Map", back: "Plan / carte" },
        ],
        "Food and Shopping": [
          { front: "Receipt", back: "Ticket de caisse" },
          { front: "Price", back: "Prix" },
          { front: "Cheap", back: "Bon marche" },
          { front: "Expensive", back: "Cher" },
          { front: "Would like", back: "Voudrais" },
          { front: "How much is it?", back: "C'est combien ?" },
          { front: "Shopping basket", back: "Panier" },
          { front: "Trolley", back: "Caddie" },
          { front: "Cashier", back: "Caissier / caissiere" },
          { front: "Credit card", back: "Carte bancaire" },
          { front: "Cash", back: "Liquide" },
          { front: "Change (money)", back: "Monnaie" },
          { front: "Discount", back: "Reduction" },
          { front: "Special offer", back: "Promotion" },
          { front: "Fresh bread", back: "Pain frais" },
          { front: "Dairy products", back: "Produits laitiers" },
          { front: "Fruit and vegetables", back: "Fruits et legumes" },
          { front: "Bottle of water", back: "Bouteille d'eau" },
          { front: "Can I try it on?", back: "Est-ce que je peux l'essayer ?" },
          { front: "It doesn't fit", back: "Ca ne va pas" },
          { front: "Size", back: "Taille" },
          { front: "Queue / line", back: "File d'attente" },
        ],
        "In the house": [
          { front: "Living room", back: "Salon" },
          { front: "Dining room", back: "Salle a manger" },
          { front: "Bathroom", back: "Salle de bain" },
          { front: "Toilet", back: "WC / toilettes" },
          { front: "Hallway", back: "Couloir" },
          { front: "Stairs", back: "Escalier" },
          { front: "Ceiling", back: "Plafond" },
          { front: "Floor", back: "Sol" },
          { front: "Wall", back: "Mur" },
          { front: "Window", back: "Fenetre" },
          { front: "Door", back: "Porte" },
          { front: "Light switch", back: "Interrupteur" },
          { front: "Socket / plug", back: "Prise (electrique)" },
          { front: "Radiator", back: "Radiateur" },
          { front: "Sofa", back: "Canape" },
          { front: "Armchair", back: "Fauteuil" },
          { front: "Table", back: "Table" },
          { front: "Chair", back: "Chaise" },
          { front: "Fridge", back: "Refrigerateur" },
          { front: "Oven", back: "Four" },
          { front: "Sink", back: "Evier" },
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
          { front: "Smoke alarm", back: "Detecteur de fumee" },
          { front: "Bin / trash", back: "Poubelle" },
        ],
        "Sports and fitness": [
          { front: "Team", back: "Equipe" },
          { front: "Match", back: "Match" },
          { front: "Training", back: "Entrainement" },
          { front: "Coach", back: "Entraineur" },
          { front: "Stadium", back: "Stade" },
          { front: "Swimming pool", back: "Piscine" },
          { front: "Tennis court", back: "Court de tennis" },
          { front: "To win", back: "Gagner" },
          { front: "To lose", back: "Perdre" },
          { front: "Draw / tie", back: "Match nul" },
          { front: "Referee", back: "Arbitre" },
          { front: "Captain", back: "Capitaine" },
          { front: "Warm up", back: "Echauffement" },
          { front: "Tired", back: "Fatigue" },
          { front: "Injury", back: "Blessure" },
          { front: "Basketball", back: "Basket-ball" },
          { front: "Rugby", back: "Rugby" },
          { front: "Athletics", back: "Athletisme" },
          { front: "Cycling", back: "Cyclisme" },
          { front: "Skiing", back: "Ski" },
          { front: "Hiking", back: "Randonnee" },
          { front: "Jogging", back: "Footing" },
          { front: "Yoga", back: "Yoga" },
          { front: "Gym", back: "Salle de sport" },
          { front: "Dumbbells", back: "Halteres" },
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
        { id: "hw-b-02", category: "Vocab", en: "Memorise 15 words from one flashcard deck and ask a parent or friend to test you.", fr: "Apprends 15 mots d'un paquet de flashcards par cœur et demande à un parent ou un ami de te tester." },
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
        { id: "hw-b-15", category: "Vocab", en: "Pick a topic (sports, food, school) and write 20 English words on it. Translate each into French.", fr: "Choisis un thème (sport, nourriture, école) et écris-y 20 mots anglais. Traduis chacun en français." },
        { id: "hw-b-16", category: "Grammar", en: "Write 10 questions in English using \"Do\" or \"Does\" (e.g., \"Do you like pizza?\").", fr: "Écris 10 questions en anglais avec « Do » ou « Does » (par exemple : « Do you like pizza? »)." },
        { id: "hw-b-17", category: "Listening", en: "Listen to an English song with the lyrics in front of you and underline every verb you see.", fr: "Écoute une chanson en anglais en suivant les paroles, et souligne tous les verbes que tu vois." },
        { id: "hw-b-18", category: "Reading", en: "Read an English Wikipedia article on a topic you like (Simple English version). Write 5 things you learned.", fr: "Lis un article Wikipédia en anglais (version Simple English) sur un sujet qui te plaît. Note 5 choses que tu as apprises." },
        { id: "hw-b-19", category: "Writing", en: "Describe your bedroom in 8 English sentences. Use \"There is\" and \"There are.\"", fr: "Décris ta chambre en 8 phrases anglaises. Utilise « There is » et « There are »." },
        { id: "hw-b-20", category: "Speaking", en: "Have a 2-minute conversation with someone (or pretend) about your weekend. Only English.", fr: "Tiens une conversation de 2 minutes avec quelqu'un (ou fais semblant) sur ton week-end. Uniquement en anglais." },
        { id: "hw-b-21", category: "Grammar", en: "Write 10 sentences in Present Simple (routines) and 10 in Present Continuous (now). Mix them up.", fr: "Écris 10 phrases au Present Simple (routines) et 10 au Present Continuous (maintenant). Mélange-les." },
        { id: "hw-b-22", category: "Reading", en: "Read the back of an English movie/show DVD or poster. Write a French summary in 3 sentences.", fr: "Lis le résumé au dos d'un DVD ou d'une affiche de film/série en anglais. Écris un résumé en français en 3 phrases." },
        { id: "hw-b-23", category: "Writing", en: "Write a short email (5–8 sentences) introducing yourself to a pen pal.", fr: "Écris un court email (5 à 8 phrases) pour te présenter à un correspondant." },
        { id: "hw-b-24", category: "Listening", en: "Watch one English-speaking YouTuber for 5 minutes. Don't pause. Note 5 new words afterwards.", fr: "Regarde un YouTubeur anglophone pendant 5 minutes. Sans mettre en pause. Note 5 nouveaux mots à la fin." },
        { id: "hw-b-25", category: "Speaking", en: "Order an imaginary meal in English. Include the dish, drink, and \"please\" / \"thank you.\"", fr: "Commande un repas imaginaire en anglais. Précise le plat, la boisson, et n'oublie pas « please » et « thank you »." },
        { id: "hw-b-26", category: "Vocab", en: "Learn 30 irregular past tense verbs (go/went, eat/ate…) and write them in 3 columns: base / past / French.", fr: "Apprends 30 verbes irréguliers au past tense (go/went, eat/ate…) et écris-les en 3 colonnes : base / past / français." },
        { id: "hw-b-27", category: "Writing", en: "Write a 100-word diary entry about yesterday. Use Past Simple.", fr: "Écris un texte de journal intime de 100 mots sur ta journée d'hier. Utilise le Past Simple." },
        { id: "hw-b-28", category: "Grammar", en: "Rewrite 10 affirmative sentences as negative AND as questions. (E.g., \"She plays football.\" → \"She doesn't play football.\" / \"Does she play football?\")", fr: "Réécris 10 phrases affirmatives en version négative ET en question. (Ex. : « She plays football. » → « She doesn't play football. » / « Does she play football? »)" },
        { id: "hw-b-29", category: "Reading", en: "Read a short news article in simple English (News in Levels, BBC Learning English). Summarise in French.", fr: "Lis un court article d'actualité en anglais simple (News in Levels, BBC Learning English). Fais-en un résumé en français." },
        { id: "hw-b-30", category: "Listening", en: "Watch a 10-minute English video (no subtitles). Write 5 sentences in English about what happened.", fr: "Regarde une vidéo en anglais de 10 minutes (sans sous-titres). Écris 5 phrases en anglais sur ce qui s'est passé." },
        { id: "hw-b-31", category: "Speaking", en: "Give a 1-minute spoken presentation in English about your favourite hobby. Record it.", fr: "Fais une présentation orale d'une minute en anglais sur ton hobby préféré. Enregistre-toi." },
        { id: "hw-b-32", category: "Writing", en: "Write a 150-word story using at least 8 Past Simple verbs. Give it a title.", fr: "Écris une histoire de 150 mots avec au moins 8 verbes au Past Simple. Donne-lui un titre." },
        { id: "hw-b-33", category: "Grammar", en: "Learn the difference between \"much / many / a lot of\" and write 9 sentences correctly using each.", fr: "Apprends la différence entre « much », « many » et « a lot of », puis écris 9 phrases correctes en utilisant chacun." },
        { id: "hw-b-34", category: "Reading", en: "Read the first chapter of an English children's novel (Roald Dahl, Diary of a Wimpy Kid). Write 10 questions you have about it.", fr: "Lis le premier chapitre d'un roman jeunesse en anglais (Roald Dahl, Le Journal d'un dégonflé). Écris 10 questions que tu te poses dessus." },
        { id: "hw-b-35", category: "Writing", en: "Write a letter to your future self in English (150+ words). Mix past, present, and future tenses.", fr: "Écris une lettre à ton toi du futur en anglais (150 mots minimum). Mélange les temps passé, présent et futur." },
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
            "En anglais il y a deux présents. Le Present Simple pour les habitudes et les faits, le Present Continuous pour ce qui se passe en ce moment.\n\nFormule Present Simple : sujet + verbe (+ s à la 3e personne).\nFormule Present Continuous : sujet + am/is/are + verbe-ing.\n\n|||EXAMPLES|||\nI eat lunch at 1pm every day.\nRight now I am eating lunch.\nShe plays football on Saturdays.\nLook, she is playing football now.",
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
            "On utilise \"there is\" pour parler d'une seule chose qui existe quelque part, et \"there are\" pour plusieurs choses. C'est l'équivalent de \"il y a\" en français mais ça ne change pas selon le genre.\n\nFormule : There is + nom singulier. There are + nom pluriel. Is there / Are there pour les questions.\n\n|||EXAMPLES|||\nThere is a book on the table.\nThere are three windows in my room.\nIs there a supermarket near here?\nAre there any students in the classroom?",
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
            "En anglais, pour poser une question au Present Simple, il faut ajouter Do ou Does au début. Does s'utilise avec he, she, it. Do s'utilise avec I, you, we, they. Avec le verbe to be on inverse juste le sujet et le verbe.\n\nFormule : Do/Does + sujet + verbe de base ?\n\n|||EXAMPLES|||\nDo you like English?\nDoes she live in Paris?\nAre you tired?\nIs he at school today?",
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
            "En anglais il y a trois articles. A s'utilise devant un mot qui commence par une consonne pour quelque chose de non précis. An s'utilise devant un mot qui commence par une voyelle. The s'utilise quand on parle de quelque chose de précis ou déjà mentionné. Contrairement au français il n'y a pas de genre masculin ou féminin.\n\nFormule : a + consonne, an + voyelle, the + nom précis.\n\n|||EXAMPLES|||\nI have a dog and a cat.\nShe is eating an apple.\nThe dog is sleeping on the sofa.\nCan you close the window please?",
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
            "Les noms comptables sont des choses qu'on peut compter et ont un pluriel. Les noms incomptables sont des choses qu'on ne peut pas compter et n'ont jamais de pluriel ni de a ou an devant eux.\n\nFormule comptable : a/an + nom, ou nom + s au pluriel.\nFormule incomptable : some/much/a lot of + nom sans pluriel.\n\n|||EXAMPLES|||\nI have two apples.\nI need some water.\nThere are many students.\nThere isn't much time.",
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
            "Can exprime la capacité, ce qu'on est capable de faire. Il est identique pour tous les sujets, on ne le conjugue jamais. Le négatif est cannot ou can't. Pour les questions on inverse juste can et le sujet.\n\nFormule positive : sujet + can + verbe de base.\nFormule négative : sujet + can't + verbe de base.\nQuestion : Can + sujet + verbe de base ?\n\n|||EXAMPLES|||\nI can swim very well.\nShe can't drive yet.\nCan you speak English?\nHe can play the guitar.",
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
            "Le Past Simple s'utilise pour parler d'une action terminée dans le passé. Les verbes réguliers prennent -ed à la fin. Les verbes irréguliers changent complètement et doivent être mémorisés. Pour le négatif et les questions on utilise toujours did plus la base verbale.\n\nFormule : sujet + verbe passé. Négatif : sujet + didn't + base. Question : Did + sujet + base ?\n\n|||EXAMPLES|||\nI walked to school yesterday.\nShe went to London last year.\nWe didn't watch the film.\nDid you eat breakfast this morning?",
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
            "En anglais les pronoms sujets remplacent celui qui fait l'action et les pronoms compléments remplacent celui qui reçoit l'action. Le pronom complément se place toujours après le verbe ou après une préposition.\n\nFormule : verbe + pronom complément.\nListe : me, you, him, her, us, them.\n\n|||EXAMPLES|||\nMy teacher helped me a lot.\nI called him yesterday.\nShe gave the book to her.\nCan you help us please?",
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
            "En anglais il y a deux façons principales de parler du futur. Going to s'utilise pour un plan décidé à l'avance ou une prédiction basée sur ce qu'on voit. Will s'utilise pour une décision spontanée, une promesse ou une prédiction basée sur une opinion.\n\nFormule going to : sujet + am/is/are + going to + verbe de base.\nFormule will : sujet + will + verbe de base.\n\n|||EXAMPLES|||\nI am going to study tonight, I planned it.\nIt will rain tomorrow I think.\nI will help you, don't worry.\nShe is going to visit her grandmother this weekend.",
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
          { front: "Make progress", back: "Faire des progres" },
          { front: "Take responsibility", back: "Prendre des responsabilites" },
          { front: "Do research", back: "Faire des recherches" },
          { front: "Strong argument", back: "Argument solide" },
          { front: "Raise awareness", back: "Sensibiliser" },
          { front: "Meet expectations", back: "Repondre aux attentes" },
          { front: "Reach a decision", back: "Prendre une decision" },
          { front: "Pay attention", back: "Faire attention" },
          { front: "Lose contact", back: "Perdre le contact" },
          { front: "Keep in touch", back: "Rester en contact" },
          { front: "Run a risk", back: "Courir un risque" },
          { front: "Set a goal", back: "Se fixer un objectif" },
          { front: "Gain experience", back: "Acquerir de l'experience" },
          { front: "Miss an opportunity", back: "Manquer une occasion" },
          { front: "Face a challenge", back: "Relever un defi" },
          { front: "Solve a problem", back: "Resoudre un probleme" },
          { front: "Break the law", back: "Enfreindre la loi" },
          { front: "Catch a cold", back: "Attraper un rhume" },
          { front: "Save time", back: "Gagner du temps" },
          { front: "Waste money", back: "Gaspiller de l'argent" },
          { front: "Tell the truth", back: "Dire la verite" },
          { front: "Tell a lie", back: "Mentir" },
        ],
        "Phrasal Verbs": [
          { front: "Carry on", back: "Continuer" },
          { front: "Find out", back: "Decouvrir" },
          { front: "Set up", back: "Mettre en place" },
          { front: "Work out", back: "Resoudre / s'entrainer" },
          { front: "Look after", back: "S'occuper de" },
          { front: "Give up", back: "Abandonner" },
          { front: "Turn up", back: "Arriver / monter le son" },
          { front: "Turn down", back: "Refuser / baisser" },
          { front: "Run out of", back: "Etre a court de" },
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
          { front: "Drop off", back: "Deposer quelqu'un" },
        ],
        "Education and Careers": [
          { front: "Qualification", back: "Diplome / qualification" },
          { front: "Deadline", back: "Date limite" },
          { front: "Internship", back: "Stage" },
          { front: "Skill set", back: "Ensemble de competences" },
          { front: "Application", back: "Candidature" },
          { front: "Work experience", back: "Experience professionnelle" },
          { front: "Curriculum vitae (CV)", back: "CV" },
          { front: "Cover letter", back: "Lettre de motivation" },
          { front: "Interview", back: "Entretien" },
          { front: "Reference", back: "Reference" },
          { front: "Networking", back: "Creation de reseau" },
          { front: "Mentor", back: "Mentor" },
          { front: "Scholarship", back: "Bourse" },
          { front: "Tuition fees", back: "Frais de scolarite" },
          { front: "Seminar", back: "Seminaire" },
          { front: "Lecture", back: "Cours magistral" },
          { front: "Tutorial", back: "Travaux diriges" },
          { front: "Dissertation", back: "Memoire" },
          { front: "Plagiarism", back: "Plagiat" },
          { front: "Peer review", back: "Evaluation par les pairs" },
          { front: "Career fair", back: "Forum des metiers" },
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
          { front: "This raises the question of...", back: "Cela souleve la question de..." },
          { front: "There is evidence to suggest...", back: "Des elements suggerent que..." },
          { front: "A compelling case", back: "Un argument convaincant" },
          { front: "To some extent", back: "Jusqu'a un certain point" },
          { front: "By contrast", back: "En revanche" },
          { front: "In contrast", back: "Par contraste" },
          { front: "As a result", back: "En consequence" },
          { front: "Consequently", back: "Par consequent" },
          { front: "That being said", back: "Cela dit" },
          { front: "To sum up", back: "Pour conclure" },
          { front: "I remain unconvinced", back: "Je ne suis pas convaincu" },
          { front: "I strongly disagree", back: "Je suis en desaccord total" },
          { front: "I partially agree", back: "Je suis partiellement d'accord" },
          { front: "The crux of the matter", back: "Le coeur du probleme" },
        ],
        "Sports and competition": [
          { front: "Tournament", back: "Tournoi" },
          { front: "Semi-final", back: "Demi-finale" },
          { front: "Knockout stage", back: "Phase eliminatoire" },
          { front: "League table", back: "Classement" },
          { front: "Home advantage", back: "Avantage du terrain" },
          { front: "Under pressure", back: "Sous pression" },
          { front: "Fair play", back: "Fair-play" },
          { front: "Performance", back: "Performance" },
          { front: "To qualify", back: "Se qualifier" },
          { front: "To be eliminated", back: "Etre elimine" },
          { front: "Sponsorship", back: "Sponsoring" },
          { front: "Broadcast", back: "Diffusion" },
          { front: "Season ticket", back: "Abonnement (stade)" },
          { front: "Transfer window", back: "Mercato" },
          { front: "Contract", back: "Contrat" },
          { front: "Physiotherapist", back: "Kinesitherapeute" },
          { front: "Offside", back: "Hors-jeu" },
          { front: "Tackle", back: "Tacle" },
          { front: "Pass", back: "Passe" },
          { front: "Shoot", back: "Tirer au but" },
          { front: "Defence", back: "Defense" },
        ],
        "At home and routines": [
          { front: "Household chores", back: "Taches menageres" },
          { front: "To tidy up", back: "Ranger" },
          { front: "To do the shopping", back: "Faire les courses" },
          { front: "Neighbour", back: "Voisin / voisine" },
          { front: "Landlord", back: "Proprietaire / bailleur" },
          { front: "Tenant", back: "Locataire" },
          { front: "Rent", back: "Loyer" },
          { front: "Bills", back: "Factures" },
          { front: "Remote working", back: "Teletravail" },
          { front: "Commute", back: "Trajet domicile-travail" },
          { front: "Household bills", back: "Factures du foyer" },
          { front: "Mortgage", back: "Pret immobilier" },
          { front: "Estate agent", back: "Agent immobilier" },
          { front: "Lease", back: "Bail" },
          { front: "Housemate", back: "Colocataire" },
          { front: "Rubbish collection", back: "Collecte des ordures" },
          { front: "Recycling", back: "Tri selectif" },
          { front: "DIY", back: "Bricolage" },
          { front: "Ironing", back: "Repassage" },
          { front: "Laundry", back: "Lessive" },
          { front: "Alarm clock", back: "Reveil" },
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
        { id: "hw-i-01", category: "Vocab", en: "Make 20 flashcards of phrasal verbs (look up, give up, find out, etc.) with French equivalents.", fr: "Fabrique 20 flashcards de phrasal verbs (look up, give up, find out, etc.) avec leur équivalent français." },
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
        { id: "hw-i-12", category: "Writing", en: "Write a formal email asking a teacher for an extension on homework.", fr: "Écris un email formel à un professeur pour demander un délai supplémentaire pour un devoir." },
        { id: "hw-i-13", category: "Grammar", en: "Write 10 sentences with \"since\" and \"for\" using Present Perfect.", fr: "Écris 10 phrases avec « since » et « for » en utilisant le Present Perfect." },
        { id: "hw-i-14", category: "Reading", en: "Read a 1-page English short story. Underline every word you don't know and look up at least 5.", fr: "Lis une nouvelle en anglais d'une page. Souligne tous les mots que tu ne connais pas et cherches-en au moins 5." },
        { id: "hw-i-15", category: "Vocab", en: "Learn 20 collocations (make/do, take/have a shower, do business…) and write sentences for each.", fr: "Apprends 20 collocations (make/do, take/have a shower, do business…) et écris une phrase pour chacune." },
        { id: "hw-i-16", category: "Speaking", en: "Give a 2-minute spoken summary of a film you saw recently, in English.", fr: "Fais un résumé oral de 2 minutes en anglais d'un film que tu as vu récemment." },
        { id: "hw-i-17", category: "Writing", en: "Write a 150-word opinion paragraph: \"Is social media good or bad for teenagers?\"", fr: "Écris un paragraphe d'opinion de 150 mots : « Les réseaux sociaux sont-ils bons ou mauvais pour les adolescents ? »" },
        { id: "hw-i-18", category: "Listening", en: "Listen to one BBC Learning English podcast episode. Write 8 sentences about what you heard.", fr: "Écoute un épisode de podcast BBC Learning English. Écris 8 phrases sur ce que tu as entendu." },
        { id: "hw-i-19", category: "Grammar", en: "Write 5 First Conditional sentences (\"If X, Y will…\") and 5 Second Conditional (\"If X, Y would…\").", fr: "Écris 5 phrases au First Conditional (« If X, Y will… ») et 5 au Second Conditional (« If X, Y would… »)." },
        { id: "hw-i-20", category: "Reading", en: "Read an English Wikipedia article (full version, not Simple English). Note 3 things that surprised you.", fr: "Lis un article Wikipédia en anglais (version normale, pas Simple English). Note 3 choses qui t'ont surpris." },
        { id: "hw-i-21", category: "Writing", en: "Describe a place you love in 200 words. Use at least 3 different senses (sight, sound, smell, etc.).", fr: "Décris en 200 mots un endroit que tu aimes. Sollicite au moins trois sens différents (vue, ouïe, odorat, etc.)." },
        { id: "hw-i-22", category: "Speaking", en: "Argue both sides of a topic for 1 minute each: \"Should homework be banned?\"", fr: "Argumente une minute pour le pour et une minute pour le contre d'un sujet : « Faut-il interdire les devoirs ? »" },
        { id: "hw-i-23", category: "Vocab", en: "Learn 15 words for expressing opinions (in my view, arguably, frankly, allegedly…) and use each.", fr: "Apprends 15 mots pour exprimer une opinion (in my view, arguably, frankly, allegedly…) et utilise-les chacun." },
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
            "À ce niveau, l'adjectif possessif doit toujours correspondre au possesseur, pas à l'objet. En français on dit « sa maison » pour un homme ou une femme ; en anglais on dit his house ou her house selon qui possède. Pour une équipe ou un groupe, utilise their.\n\nFormule : possessif du possesseur + nom (his research, their results, its logo).\n\n|||EXAMPLES|||\nThe students presented their projects.\nShe forgot her charger at home.\nThe company changed its policy last year.\nWe improved our pronunciation this month.",
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
            "Le passé composé français ne se traduit pas toujours pareil. Si tu peux nommer le moment précis (hier, en 2020, la semaine dernière), utilise le Past Simple. Si tu parles d'une expérience de vie ou d'un résultat visible maintenant, utilise le Present Perfect avec have/has + participe passé.\n\nFormule Past Simple : sujet + verbe passé (+ date).\nFormule Present Perfect : sujet + have/has + participe passé.\n\n|||EXAMPLES|||\nI watched that film last week.\nWe have completed three units this month.\nShe went to London in 2024.\nHave you ever tried sushi?",
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
            "Une proposition relative ajoute une information sur un nom juste avant. Who pour les personnes, which pour les choses, that pour les deux dans une phrase définissante. Tu peux omettre who/that/which quand c'est le complément : The book (that) I read.\n\nFormule : nom + who/which/that + phrase.\n\n|||EXAMPLES|||\nThe teacher who helped me was excellent.\nThis is the app that I use every day.\nStudents who revise regularly improve faster.\nThe film we saw was brilliant.",
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
            "Le zero conditional = vérité générale (si tu chauffes l'eau, elle bout). Le first conditional = futur réaliste (si j'étudie, je réussirai). Le second conditional = situation imaginaire au présent (si j'avais plus de temps, je voyagerais). Jamais de would dans la partie avec if.\n\nFormule 0 : If + présent, présent.\nFormule 1 : If + présent, will + base.\nFormule 2 : If + past simple, would + base.\n\n|||EXAMPLES|||\nIf you heat ice, it melts.\nIf I study hard, I will pass the test.\nIf I had more time, I would read more books.\nIf it rains, we will stay at home.",
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
            "La voix passive met l'accent sur l'action, pas sur qui l'a faite. On la forme avec be + participe passé au bon temps. En français on utilise souvent « on » ; en anglais la passive est très courante à l'écrit.\n\nFormule : sujet + be + participe passé (+ by + agent si besoin).\n\n|||EXAMPLES|||\nEnglish is spoken worldwide.\nThe bridge was built in 1998.\nMy bike has been stolen.\nThe road is being repaired today.",
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
            "PEEL t'aide à structurer un paragraphe d'essai en anglais : annonce ton idée tout de suite, pas à la fin comme parfois en français. Point = idée principale, Evidence = preuve, Explain = pourquoi c'est important, Link = retour à la question.\n\nFormule : Point + Evidence + Explain + Link (un paragraphe = une idée).\n\n|||EXAMPLES|||\nPoint: School uniforms improve focus.\nEvidence: A survey of 200 students showed better concentration.\nExplain: Less social pressure helps students work.\nLink: This answers why uniforms can help learning.",
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
            "Les connecteurs montrent le lien logique entre tes idées. However = contraste, therefore = conséquence, moreover = en plus, although = bien que. En anglais formel, however commence souvent une nouvelle phrase ou suit un point-virgule.\n\nFormule : phrase 1 ; however, phrase 2.\n\n|||EXAMPLES|||\nThe plan is expensive; however, it is effective.\nWe practised daily; therefore, we improved.\nThe class is small; moreover, everyone participates.\nAlthough it was late, they continued working.",
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
            "Les francophones font souvent les mêmes erreurs : oubli du -s à la 3e personne (He go → goes), « I am agree » (faux ami → I agree), et « She said me » (→ She told me). Relis à voix haute : si ça sonne bizarre en anglais, corrige.\n\nFormule de base : sujet + verbe (+ compléments), dans cet ordre.\n\n|||EXAMPLES|||\nHe goes to school every day.\nI agree with you on this point.\nShe told me to come earlier.\nThey haven't finished their homework yet.",
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
          { front: "Nevertheless", back: "Neanmoins" },
          { front: "Significant", back: "Significatif" },
          { front: "To assess", back: "Evaluer" },
          { front: "To justify", back: "Justifier" },
          { front: "To highlight", back: "Mettre en evidence" },
          { front: "Consequently", back: "Par consequent" },
          { front: "Hence", back: "D'ou" },
          { front: "Accordingly", back: "En consequence" },
          { front: "Prerequisite", back: "Prerequis" },
          { front: "Implication", back: "Implication" },
          { front: "Criterion", back: "Critere" },
          { front: "Hypothesis", back: "Hypothese" },
          { front: "Variable", back: "Variable" },
          { front: "Correlation", back: "Correlation" },
          { front: "Causation", back: "Relation de cause a effet" },
          { front: "Paradigm", back: "Paradigme" },
          { front: "Rationale", back: "Justification" },
          { front: "Coherent", back: "Coherent" },
          { front: "Ambiguous", back: "Ambigu" },
          { front: "Prevalent", back: "Repandu" },
          { front: "Robust", back: "Robuste" },
        ],
        "Essay Precision": [
          { front: "A key limitation", back: "Une limite majeure" },
          { front: "It can be argued that", back: "On peut soutenir que" },
          { front: "From a broader perspective", back: "Dans une perspective plus large" },
          { front: "This suggests that", back: "Cela suggere que" },
          { front: "In practical terms", back: "En termes pratiques" },
          { front: "A nuanced view", back: "Une vision nuancee" },
          { front: "By implication", back: "Par implication" },
          { front: "To put it another way", back: "Autrement dit" },
          { front: "For the sake of clarity", back: "Pour plus de clarte" },
          { front: "Without oversimplifying", back: "Sans simplifier a l'exces" },
          { front: "A salient point", back: "Un point saillant" },
          { front: "The prevailing view", back: "L'opinion dominante" },
          { front: "A contentious issue", back: "Une question controversee" },
          { front: "To reiterate", back: "Pour le repeter" },
          { front: "In essence", back: "Essentiellement" },
          { front: "Prima facie", back: "A premiere vue" },
          { front: "Mutatis mutandis", back: "Toutes choses egales par ailleurs" },
          { front: "Extrapolation", back: "Extrapolation" },
          { front: "Generalisation", back: "Generalisation" },
          { front: "Tentative conclusion", back: "Conclusion provisoire" },
          { front: "Further research is warranted", back: "Des recherches supplementaires s'imposent" },
          { front: "The burden of proof", back: "La charge de la preuve" },
        ],
        "Critical Analysis": [
          { front: "Underlying assumption", back: "Hypothese sous-jacente" },
          { front: "Methodological weakness", back: "Faiblesse methodologique" },
          { front: "Empirical evidence", back: "Preuve empirique" },
          { front: "Counterargument", back: "Contre-argument" },
          { front: "To substantiate", back: "Etayer / corroborer" },
          { front: "Bias", back: "Biais" },
          { front: "Confounding factor", back: "Facteur de confusion" },
          { front: "Internal validity", back: "Validite interne" },
          { front: "External validity", back: "Validite externe" },
          { front: "Sampling error", back: "Erreur d'echantillonnage" },
          { front: "Statistical significance", back: "Signification statistique" },
          { front: "Effect size", back: "Taille d'effet" },
          { front: "Replication", back: "Replication" },
          { front: "Anomaly", back: "Anomalie" },
          { front: "Outlier", back: "Valeur aberrante" },
          { front: "Cherry-picking", back: "Selection biaisee des donnees" },
          { front: "Straw man fallacy", back: "Homme de paille (sophisme)" },
          { front: "Circular reasoning", back: "Raisonnement circulaire" },
          { front: "Hasty generalisation", back: "Generalisation hative" },
          { front: "Red herring", back: "Diversion / fausse piste" },
          { front: "Appeal to authority", back: "Argument d'autorite" },
          { front: "Occam's razor", back: "Rasoir d'Ockham" },
        ],
        "Presentation Language": [
          { front: "Today I will address...", back: "Aujourd'hui, je vais aborder..." },
          { front: "Let's now turn to...", back: "Passons maintenant a..." },
          { front: "As this chart illustrates...", back: "Comme ce graphique l'illustre..." },
          { front: "To conclude this section...", back: "Pour conclure cette partie..." },
          { front: "In summary...", back: "En resume..." },
          { front: "I welcome your questions.", back: "Je suis ouvert a vos questions." },
          { front: "Let me begin by outlining...", back: "Permettez-moi de commencer par esquisser..." },
          { front: "This slide shows...", back: "Cette diapositive montre..." },
          { front: "If we zoom in on...", back: "Si nous zoomons sur..." },
          { front: "The key takeaway is...", back: "L'essentiel a retenir est..." },
          { front: "I will now hand over to...", back: "Je cede maintenant la parole a..." },
          { front: "Thank you for your attention.", back: "Merci pour votre attention." },
          { front: "I am happy to elaborate.", back: "Je suis ravi d'approfondir." },
          { front: "Does that answer your question?", back: "Est-ce que cela repond a votre question ?" },
          { front: "Let me clarify that point.", back: "Permettez-moi de clarifier ce point." },
          { front: "Moving on to the next topic...", back: "Passons au sujet suivant..." },
          { front: "To put this into context...", back: "Pour situer le contexte..." },
          { front: "Time permitting, I will...", back: "Si le temps le permet, je..." },
          { front: "I will keep this brief.", back: "Je serai bref / breve." },
          { front: "Any questions so far?", back: "Des questions jusqu'ici ?" },
          { front: "I look forward to your feedback.", back: "J'attends vos retours avec interet." },
          { front: "This brings me to my final point.", back: "Cela m'amene a mon dernier point." },
        ],
        "Sport, ethics, and society": [
          { front: "Doping scandal", back: "Affaire de dopage" },
          { front: "Integrity", back: "Integrite" },
          { front: "Grassroots sport", back: "Sport de base" },
          { front: "Elite performance", back: "Haut niveau" },
          { front: "Commercialisation", back: "Commercialisation" },
          { front: "Public funding", back: "Financement public" },
          { front: "Safeguarding", back: "Protection des mineurs / prevention" },
          { front: "Inclusivity", back: "Inclusivite" },
          { front: "Match fixing", back: "Trucage de match" },
          { front: "Anti-doping agency", back: "Agence antidopage" },
          { front: "Spectator violence", back: "Violence des supporters" },
          { front: "Ticket scalping", back: "Revente de billets" },
          { front: "Youth academy", back: "Centre de formation" },
          { front: "Transfer fee", back: "Indemnite de transfert" },
          { front: "Sports governance", back: "Gouvernance sportive" },
          { front: "Gender equality in sport", back: "Egalite des genres dans le sport" },
          { front: "Paralympic movement", back: "Mouvement paralympique" },
          { front: "Olympic charter", back: "Charte olympique" },
          { front: "National anthem", back: "Hymne national" },
        ],
        "Housing and urban life": [
          { front: "Gentrification", back: "Embourgeoisement" },
          { front: "Affordable housing", back: "Logement abordable" },
          { front: "Urban sprawl", back: "Etalement urbain" },
          { front: "Zoning regulations", back: "Reglementation d'urbanisme" },
          { front: "Commuter belt", back: "Couronne periurbaine" },
          { front: "High-density housing", back: "Logement a forte densite" },
          { front: "Social housing", back: "Logement social" },
          { front: "Carbon footprint of buildings", back: "Empreinte carbone du batiment" },
          { front: "Green belt", back: "Ceinture verte" },
          { front: "Brownfield site", back: "Friche industrielle" },
          { front: "Gentrification pressure", back: "Pression d'embourgeoisement" },
          { front: "Eviction", back: "Expulsion" },
          { front: "Housing shortage", back: "Penurie de logements" },
          { front: "Rent control", back: "Encadrement des loyers" },
          { front: "Co-housing", back: "Habitat participatif" },
          { front: "Urban renewal", back: "Renouvellement urbain" },
          { front: "Pedestrian zone", back: "Zone pietonne" },
          { front: "Public transport hub", back: "Pole d'echanges multimodal" },
          { front: "Air quality index", back: "Indice de qualite de l'air" },
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
            "En rédaction formelle, chaque possessif doit renvoyer clairement au bon possesseur sur tout le texte. Its pour une organisation, un pays ou un document ; their pour un groupe de personnes. Si c'est flou, répète le nom au lieu d'utiliser their ou its.\n\nFormule : possessif précis + nom, ou répéter le nom pour éviter l'ambiguïté.\n\n|||EXAMPLES|||\nEach candidate must justify their methodology.\nThe committee reviewed its final draft.\nThe researchers defended their conclusions.\nThe university published its annual report.",
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
            "Les phrases clivées mettent en avant un élément : It was John who called. L'inversion donne un ton plus formel ou emphatique : Rarely do we see such progress. Utilise ces structures avec parcimonie dans un essai — une ou deux fois suffisent.\n\nFormule clivée : It was/was + élément + who/that + reste.\nFormule inversion : Rarely/Never + auxiliaire + sujet + verbe.\n\n|||EXAMPLES|||\nIt was Maria who solved the problem.\nRarely do students receive such detailed feedback.\nWhat the essay lacks is clear evidence.\nNever have I seen such dedication.",
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
            "Une phrase complexe relie plusieurs idées avec although, while, because, so that, not only… but also. Chaque partie doit avoir un lien logique clair. Si la phrase devient trop longue, coupe en deux.\n\nFormule : Although/While + proposition, proposition principale.\n\n|||EXAMPLES|||\nAlthough the exam was hard, she passed.\nHe studied hard, yet he still felt nervous.\nIf you practise regularly, you will improve.\nShe speaks French, whereas her brother speaks English.",
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
            "Le point-virgule relie deux phrases complètes liées. Les deux-points introduisent une liste ou une explication. Une comma splice = deux phrases jointes seulement par une virgule — c'est une erreur fréquente. Corrige avec un point, un point-virgule ou une conjonction.\n\nFormule : phrase complète ; however, phrase complète.\n\n|||EXAMPLES|||\nThe results were mixed; however, the trend was positive.\nOne thing is clear: we need a plan.\nUse a semicolon to join related ideas.\nCommas separate items in a list of three or more.",
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
            "La synthèse mélange deux sources dans un seul argument — ne fais pas un paragraphe par source. Utilise Source A argues… while Source B suggests… et montre comment les idées se répondent ou s'opposent.\n\nFormule : thèse + Source A + while/however + Source B + ta conclusion.\n\n|||EXAMPLES|||\nSource A argues that remote learning increases access.\nSource B claims quality depends on teacher training.\nA strong thesis must address both viewpoints.\nUse contrast linkers to compare the two sources.",
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
            "À l'oral chronométré, prends trente secondes pour planifier, puis structure : affirmation, exemple, contrepoint, conclusion. Des phrases courtes et correctes valent mieux que de longues phrases cassées. Entraîne-toi avec un minuteur.\n\nFormule : First + point 1. However + contrepoint. To sum up + conclusion.\n\n|||EXAMPLES|||\nFirst, state your main claim clearly.\nSupport it with one concrete example.\nHowever, mention one counterargument briefly.\nTo sum up, restate your position in one sentence.",
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
            "Avant d'écrire sur un sujet abstrait (technologie, éthique, climat), écris un plan avec une thèse claire, deux arguments et un contre-argument que tu peux réfuter. Chaque paragraphe du corps = une partie du plan. Planifier d'abord te fait gagner du temps.\n\nFormule : thèse + argument 1 + argument 2 + contre-argument + conclusion.\n\n|||EXAMPLES|||\nEvery essay plan needs a clear thesis.\nInclude at least two supporting points.\nAdd one counterargument you can answer.\nSpend the first minutes planning, then write.",
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
    userCloudSyncTimer = setTimeout(function () {
      void flushActiveUserCloudSync();
    }, 1200);
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
      const n = (stats.quizSessionLog || []).filter(function (s) {
        return s.level === lvl;
      }).length;
      return I18n.t("learning_landing_vocab_progress", { n: String(n) });
    }
    return "";
  }

  function refreshLandingCardProgress(root, lvl, data) {
    const user = getActiveUser();
    const stats = user ? ensureStats(user) : null;
    const lh = user ? ensureLearningHub(stats) : null;
    root.querySelectorAll(".level-landing__card[data-tool]").forEach(function (card) {
      const tool = card.getAttribute("data-tool");
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
        users[name] = latestCloudUser;
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
      if (adminPasswordInput) adminPasswordInput.value = "";
      renderAdminPanel();
    });
  }

  if (adminTabs.length) {
    adminTabs.forEach(function (tabBtn) {
      tabBtn.addEventListener("click", function () {
        const tab = tabBtn.getAttribute("data-admin-tab");
        if (tab !== "progress") adminViewingStudent = null;
        adminTabs.forEach(function (b) {
          b.classList.toggle("is-active", b === tabBtn);
        });
        if (adminBookingsTab) adminBookingsTab.classList.toggle("hidden", tab !== "bookings");
        if (adminProgressTab) adminProgressTab.classList.toggle("hidden", tab !== "progress");
        if (adminPaymentsTab) adminPaymentsTab.classList.toggle("hidden", tab !== "payments");
        if (adminLeaderboardTab) adminLeaderboardTab.classList.toggle("hidden", tab !== "leaderboard");
        if (tab === "leaderboard") renderAdminLeaderboard();
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

  function bookingFormatSlot(dayIndex, hour) {
    return bookingDayLabels[dayIndex] + " " + hour + ":00";
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
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-day-btn";
      btn.textContent = label;
      btn.dataset.dayIndex = String(i);
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
    for (let h = 9; h <= 20; h++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-hour-btn";
      btn.textContent = I18n.t("booking_hour_format", { hour: String(h) });
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
    if (bookingActiveDayIndex !== null && bookingActiveDayIndex >= bookingDayLabels.length) {
      bookingActiveDayIndex = null;
    }
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
          unavailable.textContent = "The checklist is not available for this level.";
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

      vocabPanel.innerHTML = "";
      const vocShell = document.createElement("div");
      vocShell.className = "lh-vocab";
      const vocHeader = document.createElement("div");
      vocHeader.className = "lh-vocab__header";
      const stBox = document.createElement("div");
      stBox.className = "lh-chip lh-chip--streak";
      stBox.innerHTML =
        '<span class="lh-chip__lab">' +
        I18n.t("learning_hub_streak") +
        '</span> <span class="lh-vocab__streak-val">0</span>';
      vocHeader.appendChild(stBox);
      vocShell.appendChild(vocHeader);

      const topicRow = document.createElement("div");
      topicRow.className = "lh-pill-row is-collapsed";
      let activeTopicFilter = "all";
      let filterExpanded = false;
      const topicSet = {};
      (data.vocabQuiz || []).forEach(function (q) {
        if (q.topic) topicSet[q.topic] = true;
      });
      const filterToggle = document.createElement("button");
      filterToggle.type = "button";
      filterToggle.className = "lh-filter-toggle";
      filterToggle.setAttribute("aria-expanded", "false");
      const filterToggleLabel = document.createElement("span");
      filterToggleLabel.className = "lh-filter-toggle__label";
      const filterToggleChevron = document.createElement("span");
      filterToggleChevron.className = "lh-filter-toggle__chevron";
      filterToggleChevron.setAttribute("aria-hidden", "true");
      filterToggleChevron.textContent = "▼";
      const filterToggleDot = document.createElement("span");
      filterToggleDot.className = "lh-filter-toggle__dot";
      filterToggle.appendChild(filterToggleLabel);
      filterToggle.appendChild(filterToggleChevron);
      filterToggle.appendChild(filterToggleDot);
      const filterWrap = document.createElement("div");
      filterWrap.className = "lh-filter-wrap";
      function updateFilterToggleUI() {
        filterToggleLabel.textContent = filterExpanded
          ? I18n.t("learning_vocab_filter_hide")
          : I18n.t("learning_vocab_filter_show");
        topicRow.classList.toggle("is-collapsed", !filterExpanded);
        filterToggle.classList.toggle("is-expanded", filterExpanded);
        filterToggle.setAttribute("aria-expanded", filterExpanded ? "true" : "false");
        filterToggleDot.classList.toggle("is-visible", activeTopicFilter !== "all");
      }
      filterToggle.addEventListener("click", function () {
        filterExpanded = !filterExpanded;
        updateFilterToggleUI();
      });
      function makePill(label, value) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "lh-pill" + (value === activeTopicFilter ? " is-active" : "");
        if (value === "all") b.setAttribute("data-lh-all-topic", "1");
        b.textContent = label;
        b.addEventListener("click", function () {
          activeTopicFilter = value;
          Array.from(topicRow.querySelectorAll(".lh-pill")).forEach(function (p) {
            p.classList.remove("is-active");
          });
          b.classList.add("is-active");
          updateFilterToggleUI();
          startQuiz(currentMode);
        });
        return b;
      }
      topicRow.appendChild(makePill(I18n.t("learning_hub_topic_all"), "all"));
      Object.keys(topicSet)
        .sort()
        .forEach(function (t) {
          topicRow.appendChild(makePill(t, t));
        });
      filterWrap.appendChild(filterToggle);
      filterWrap.appendChild(topicRow);
      vocShell.appendChild(filterWrap);
      updateFilterToggleUI();

      const quizWrap = document.createElement("div");
      quizWrap.className = "lh-vocab-quiz resource-item";
      const quizTitle = document.createElement("h4");
      quizTitle.textContent = I18n.t("learning_vocab_quiz_title");
      const variantRow = document.createElement("div");
      variantRow.className = "lh-variant-row";
      let activeVariant = "mc";
      ["mc", "match", "speed"].forEach(function (vk) {
        const vb = document.createElement("button");
        vb.type = "button";
        vb.setAttribute("data-variant", vk);
        vb.className = "lh-variant-btn" + (vk === activeVariant ? " is-active" : "");
        vb.textContent = I18n.t("learning_vocab_variant_" + vk);
        vb.addEventListener("click", function () {
          activeVariant = vk;
          Array.from(variantRow.querySelectorAll(".lh-variant-btn")).forEach(function (x, j) {
            x.classList.toggle("is-active", ["mc", "match", "speed"][j] === vk);
          });
          if (remainingQuestions.length) renderQuiz();
        });
        variantRow.appendChild(vb);
      });
      const quizQuestion = document.createElement("p");
      quizQuestion.className = "vocab-quiz__question lh-vocab-q";
      const quizCounter = document.createElement("p");
      quizCounter.className = "lh-gap-score vocab-quiz__counter lh-muted";
      const quizOptions = document.createElement("div");
      quizOptions.className = "vocab-quiz__options lh-vocab-options";
      const quizFeedback = document.createElement("p");
      quizFeedback.className = "vocab-quiz__feedback";
      const saveWordBtn = document.createElement("button");
      saveWordBtn.type = "button";
      saveWordBtn.className = "flashcard-btn lh-save-word hidden";
      saveWordBtn.textContent = I18n.t("learning_vocab_save_word");
      const quizNext = document.createElement("button");
      quizNext.type = "button";
      quizNext.className = "flashcard-btn lh-primary-btn";
      quizNext.textContent = I18n.t("learning_vocab_next");
      quizNext.disabled = true;
      quizWrap.appendChild(quizTitle);
      quizWrap.appendChild(variantRow);
      quizWrap.appendChild(quizQuestion);
      quizWrap.appendChild(quizOptions);
      quizWrap.appendChild(quizFeedback);
      quizWrap.appendChild(saveWordBtn);
      quizWrap.appendChild(quizNext);
      vocShell.appendChild(quizWrap);

      const quizModeWrap = document.createElement("div");
      quizModeWrap.className = "tool-menu lh-difficulty";
      ["easy", "medium", "hard"].forEach(function (mode, idx) {
        const modeBtn = document.createElement("button");
        modeBtn.type = "button";
        modeBtn.className = "tool-menu__btn" + (idx === 0 ? " is-active" : "");
        modeBtn.textContent = I18n.t("learning_vocab_mode_" + mode);
        modeBtn.setAttribute("data-mode", mode);
        quizModeWrap.appendChild(modeBtn);
      });
      quizWrap.insertBefore(quizModeWrap, quizQuestion);
      quizWrap.insertBefore(quizCounter, quizQuestion);

      const summary = document.createElement("div");
      summary.className = "vocab-summary lh-vocab-summary hidden";
      const resultsCard = document.createElement("div");
      resultsCard.className = "lh-quiz-results";
      const resultsPct = document.createElement("div");
      resultsPct.className = "lh-quiz-results__pct";
      const resultsScore = document.createElement("p");
      resultsScore.className = "lh-muted lh-quiz-results__score";
      const resultsBest = document.createElement("p");
      resultsBest.className = "lh-quiz-best hidden";
      const resultsMsg = document.createElement("p");
      resultsMsg.className = "lh-quiz-results__msg";
      const resultsActions = document.createElement("div");
      resultsActions.className = "lh-quiz-results__actions";
      const resultsRetryBtn = document.createElement("button");
      resultsRetryBtn.type = "button";
      resultsRetryBtn.className = "flashcard-btn lh-primary-btn";
      resultsRetryBtn.textContent = I18n.t("learning_vocab_results_retry");
      const resultsLevelUpBtn = document.createElement("button");
      resultsLevelUpBtn.type = "button";
      resultsLevelUpBtn.className = "flashcard-btn";
      resultsLevelUpBtn.textContent = I18n.t("learning_vocab_results_level_up");
      resultsActions.appendChild(resultsRetryBtn);
      resultsActions.appendChild(resultsLevelUpBtn);
      resultsCard.appendChild(resultsPct);
      resultsCard.appendChild(resultsScore);
      resultsCard.appendChild(resultsBest);
      resultsCard.appendChild(resultsMsg);
      resultsCard.appendChild(resultsActions);
      summary.appendChild(resultsCard);
      quizWrap.appendChild(summary);

      let quizScore = 0;
      let quizAnswered = false;
      let lastQuizCorrect = null;
      let currentQuestion = null;
      let currentMode = "easy";
      let remainingQuestions = [];
      let askedCount = 0;
      let sessionQuestionTotal = 0;
      let sessionRecorded = false;
      const wrongByTopic = {};
      const wrongAnswers = [];

      function questionsForMode(mode) {
        return (data.vocabQuiz || []).filter(function (q) {
          if (q.difficulty !== mode) return false;
          if (activeTopicFilter !== "all" && q.topic !== activeTopicFilter) return false;
          return true;
        });
      }

      function randomPickIndex(listLength) {
        return Math.floor(Math.random() * listLength);
      }

      function trackVocabAnswer(topic, wasCorrect) {
        const user = getActiveUser();
        if (!user || !topic) return;
        const stats = ensureStats(user);
        const lh = ensureLearningHub(stats);
        if (!lh.vocabTopic[topic]) lh.vocabTopic[topic] = { c: 0, w: 0 };
        if (wasCorrect) lh.vocabTopic[topic].c += 1;
        else lh.vocabTopic[topic].w += 1;
        saveUsers();
      }

      function quizNextMode(mode) {
        if (mode === "easy") return "medium";
        if (mode === "medium") return "hard";
        return null;
      }

      function setQuizModeActive(mode) {
        Array.from(quizModeWrap.querySelectorAll("[data-mode]")).forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-mode") === mode);
        });
      }

      function updateQuizCounter() {
        if (summary.classList.contains("hidden") && sessionQuestionTotal > 0 && askedCount > 0) {
          quizCounter.classList.remove("hidden");
          quizCounter.textContent = I18n.t("learning_vocab_question_counter", {
            current: String(askedCount),
            total: String(sessionQuestionTotal),
          });
        } else {
          quizCounter.classList.add("hidden");
        }
      }

      function updateResultsCard(totalCount) {
        const pct = totalCount ? Math.round((quizScore / totalCount) * 100) : 0;
        resultsPct.textContent = String(pct) + "%";
        resultsScore.textContent = I18n.t("learning_vocab_results_score", {
          score: String(quizScore),
          total: String(totalCount),
        });
        let msgKey = "learning_vocab_results_msg_review";
        if (pct >= 80) msgKey = "learning_vocab_results_msg_excellent";
        else if (pct >= 60) msgKey = "learning_vocab_results_msg_good";
        resultsMsg.textContent = I18n.t(msgKey);
        resultsRetryBtn.textContent = I18n.t("learning_vocab_results_retry");
        resultsLevelUpBtn.textContent = I18n.t("learning_vocab_results_level_up");
        resultsLevelUpBtn.disabled = !quizNextMode(currentMode);
      }

      function renderMissedQuestions() {
        const existing = resultsCard.querySelector(".lh-quiz-missed");
        if (existing) existing.remove();
        if (!wrongAnswers.length) return;
        const missed = document.createElement("details");
        missed.className = "lh-quiz-missed";
        const missedSummary = document.createElement("summary");
        missedSummary.textContent = I18n.t("learning_vocab_missed_summary", {
          count: String(wrongAnswers.length),
        });
        const list = document.createElement("div");
        list.className = "lh-quiz-missed__list";
        wrongAnswers.forEach(function (item) {
          const row = document.createElement("div");
          row.className = "lh-quiz-missed__row";
          const qSpan = document.createElement("span");
          qSpan.className = "lh-quiz-missed__q";
          qSpan.textContent = item.question;
          const aSpan = document.createElement("span");
          aSpan.className = "lh-quiz-missed__answer";
          aSpan.textContent = item.answer;
          row.appendChild(qSpan);
          row.appendChild(aSpan);
          list.appendChild(row);
        });
        missed.appendChild(missedSummary);
        missed.appendChild(list);
        resultsCard.insertBefore(missed, resultsActions);
      }

      function updateResultsBestLine(pct, previousBest) {
        resultsBest.className = "lh-quiz-best hidden";
        resultsBest.textContent = "";
        if (previousBest == null) return;
        if (pct > previousBest) {
          resultsBest.className = "lh-quiz-best lh-quiz-best--new-record";
          resultsBest.textContent = I18n.t("learning_vocab_results_new_record", {
            pct: String(pct),
          });
          haptic([6, 30, 6, 30, 6]);
        } else if (previousBest > pct) {
          resultsBest.className = "lh-quiz-best";
          resultsBest.textContent = I18n.t("learning_vocab_results_best", {
            pct: String(previousBest),
          });
        }
      }

      function showSummary(totalCount) {
        quizCounter.classList.add("hidden");
        quizQuestion.classList.add("hidden");
        quizOptions.classList.add("hidden");
        quizFeedback.classList.add("hidden");
        quizNext.classList.add("hidden");
        saveWordBtn.classList.add("hidden");
        summary.classList.remove("hidden");
        const pct = totalCount ? Math.round((quizScore / totalCount) * 100) : 0;
        const quizKey = level + " " + currentMode;
        let previousBest = null;
        const summaryUser = getActiveUser();
        if (summaryUser) {
          const summaryStats = ensureStats(summaryUser);
          if (
            summaryStats.quizBest &&
            Object.prototype.hasOwnProperty.call(summaryStats.quizBest, quizKey)
          ) {
            previousBest = summaryStats.quizBest[quizKey];
          }
        }
        if (!sessionRecorded) {
          recordQuizSummary(level, currentMode, quizScore, totalCount);
          sessionRecorded = true;
        }
        updateResultsCard(totalCount);
        updateResultsBestLine(pct, previousBest);
        renderMissedQuestions();
        refreshStreakHeader();
      }

      function renderQuiz() {
        saveWordBtn.classList.add("hidden");
        if (!remainingQuestions.length) {
          showSummary(askedCount);
          return;
        }
        quizQuestion.classList.remove("hidden");
        quizOptions.classList.remove("hidden");
        quizFeedback.classList.remove("hidden");
        quizNext.classList.remove("hidden");
        summary.classList.add("hidden");

        const pickIdx = randomPickIndex(remainingQuestions.length);
        currentQuestion = remainingQuestions.splice(pickIdx, 1)[0];
        askedCount += 1;
        quizAnswered = false;
        lastQuizCorrect = null;
        quizNext.disabled = true;
        updateQuizCounter();
        quizQuestion.textContent = currentQuestion.question;
        quizFeedback.textContent = I18n.t("learning_vocab_choose_prompt", {
          score: String(quizScore),
          round: String(askedCount - 1),
        });
        quizOptions.innerHTML = "";
        const shuffledOptions = currentQuestion.options.slice().sort(function () {
          return Math.random() - 0.5;
        });
        shuffledOptions.forEach(function (opt) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "flashcard-btn vocab-quiz__option lh-option-btn";
          btn.textContent = opt;
          btn.addEventListener("click", function () {
            if (quizAnswered) return;
            haptic(4);
            quizAnswered = true;
            const correct = opt === currentQuestion.answer;
            trackVocabAnswer(currentQuestion.topic, correct);
            if (correct) {
              quizScore += 1;
              lastQuizCorrect = true;
              btn.classList.add("is-correct");
              playElementAnimation(btn, "answer-correct-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)");
              quizFeedback.textContent = I18n.t("learning_vocab_correct_feedback", {
                score: String(quizScore),
                round: String(askedCount),
              });
            } else {
              lastQuizCorrect = false;
              btn.classList.add("is-wrong");
              playElementAnimation(btn, "shake 0.35s ease");
              wrongByTopic[currentQuestion.topic] = (wrongByTopic[currentQuestion.topic] || 0) + 1;
              wrongAnswers.push({
                question: currentQuestion.question,
                answer: currentQuestion.answer,
              });
              quizFeedback.textContent = I18n.t("learning_vocab_wrong_feedback", {
                answer: currentQuestion.answer,
                score: String(quizScore),
                round: String(askedCount),
              });
              const user = getActiveUser();
              if (user) {
                const lh = ensureLearningHub(ensureStats(user));
                lh.savedWords = lh.savedWords || [];
                lh.savedWords.push({
                  q: currentQuestion.question,
                  a: currentQuestion.answer,
                  topic: currentQuestion.topic,
                  at: new Date().toISOString(),
                });
                if (lh.savedWords.length > 24) lh.savedWords = lh.savedWords.slice(-24);
                saveUsers();
              }
              saveWordBtn.classList.remove("hidden");
            }
            Array.from(quizOptions.querySelectorAll("button")).forEach(function (b) {
              if (b.textContent === currentQuestion.answer) b.classList.add("is-correct");
            });
            quizNext.disabled = false;
            refreshStreakHeader();
          });
          quizOptions.appendChild(btn);
        });
      }

      function startQuiz(mode) {
        currentMode = mode;
        quizScore = 0;
        askedCount = 0;
        quizAnswered = false;
        lastQuizCorrect = null;
        sessionRecorded = false;
        Object.keys(wrongByTopic).forEach(function (key) {
          delete wrongByTopic[key];
        });
        wrongAnswers.length = 0;
        remainingQuestions = questionsForMode(mode).slice();
        sessionQuestionTotal = remainingQuestions.length;
        renderQuiz();
      }

      Array.from(quizModeWrap.querySelectorAll("[data-mode]")).forEach(function (modeBtn) {
        modeBtn.addEventListener("click", function () {
          const mode = modeBtn.getAttribute("data-mode");
          Array.from(quizModeWrap.querySelectorAll("[data-mode]")).forEach(function (b) {
            b.classList.toggle("is-active", b === modeBtn);
          });
          startQuiz(mode);
        });
      });

      quizNext.addEventListener("click", function () {
        if (!quizAnswered) return;
        renderQuiz();
      });

      resultsRetryBtn.addEventListener("click", function () {
        startQuiz(currentMode);
      });

      resultsLevelUpBtn.addEventListener("click", function () {
        const next = quizNextMode(currentMode);
        if (!next) return;
        setQuizModeActive(next);
        startQuiz(next);
      });

      saveWordBtn.addEventListener("click", function () {
        saveWordBtn.classList.add("hidden");
      });

      vocabPanel.appendChild(vocShell);
      startQuiz("easy");
      refreshStreakHeader();

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
        return name === "Master 1000" ? I18n.t("flashcard_full_deck_name") : name;
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
        quizTitle.textContent = I18n.t("learning_vocab_quiz_title");
        quizNext.textContent = I18n.t("learning_vocab_next");
        Array.from(quizModeWrap.querySelectorAll("[data-mode]")).forEach(function (mb) {
          const mode = mb.getAttribute("data-mode");
          if (mode) mb.textContent = I18n.t("learning_vocab_mode_" + mode);
        });
        const allTopicPill = topicRow.querySelector('[data-lh-all-topic="1"]');
        if (allTopicPill) allTopicPill.textContent = I18n.t("learning_hub_topic_all");
        updateFilterToggleUI();
        variantRow.querySelectorAll("[data-variant]").forEach(function (vb) {
          const vk = vb.getAttribute("data-variant");
          if (vk) vb.textContent = I18n.t("learning_vocab_variant_" + vk);
        });
        saveWordBtn.textContent = I18n.t("learning_vocab_save_word");
        const stLab = stBox.querySelector(".lh-chip__lab");
        if (stLab) stLab.textContent = I18n.t("learning_hub_streak");
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
        if (!summary.classList.contains("hidden")) {
          updateResultsCard(askedCount);
          renderMissedQuestions();
        }
        refreshExercisesPanel();
        renderHomeworkPanel();
        renderProgressPanel();
        refreshLandingCardProgress(root, level, data);
        refreshStreakHeader();
        if (currentQuestion && askedCount > 0 && summary.classList.contains("hidden")) {
          updateQuizCounter();
          quizQuestion.textContent = currentQuestion.question;
          if (!quizAnswered) {
            quizFeedback.textContent = I18n.t("learning_vocab_choose_prompt", {
              score: String(quizScore),
              round: String(askedCount - 1),
            });
          } else if (lastQuizCorrect === true) {
            quizFeedback.textContent = I18n.t("learning_vocab_correct_feedback", {
              score: String(quizScore),
              round: String(askedCount),
            });
          } else if (lastQuizCorrect === false) {
            quizFeedback.textContent = I18n.t("learning_vocab_wrong_feedback", {
              answer: currentQuestion.answer,
              score: String(quizScore),
              round: String(askedCount),
            });
          }
        }
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
        users[activeUsername] = cloudUser;
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

    function endIntroSequence() {
      clearTimeout(introFallback);
      document.body.classList.remove("intro-running");
      document.body.style.overflow = "";
      introOverlay.classList.add("is-done");
      app.classList.remove("hidden-until-intro");
      app.classList.add("intro-visible");
    }

    if (prefersReducedMotion) {
      endIntroSequence();
    } else {
      document.body.classList.add("intro-running");
      document.body.style.overflow = "hidden";

      // Safety net: always finish within 5 seconds
      introFallback = setTimeout(endIntroSequence, 5000);

      // Wait for fonts to fully load before measuring — prevents jump from
      // fallback-font metrics being used in getBoundingClientRect
      document.fonts.ready.then(function () {
        var introTitle = document.querySelector(".intro-title");
        var realH1    = document.querySelector(".site-title");
        if (!introTitle || !realH1) { endIntroSequence(); return; }

        // Overlay chars finish at: 9 chars × 60ms stagger + 100ms start + 450ms duration ≈ 1090ms
        // Hold the centred title for 0.8 s of confidence after that
        var elapsed   = Date.now() - introStart;
        var holdUntil = 1090 + 800; // 1890 ms from page-load
        var waitMs    = Math.max(50, holdUntil - elapsed);

        setTimeout(function () {
          // ── Accurate position measurement (fonts loaded) ──────────────
          var iRect = introTitle.getBoundingClientRect();
          var hRect = realH1.getBoundingClientRect();

          var iFs   = parseFloat(window.getComputedStyle(introTitle).fontSize);
          var hFs   = parseFloat(window.getComputedStyle(realH1).fontSize);
          var scale = iFs > 0 ? hFs / iFs : 0.4;

          // transform-origin is 0 0 (top-left).
          // With CSS `scale(s) translate(tx, ty)` the translate is applied
          // first (in original coordinate space) then scaled, so:
          //   final_top_left = (iRect.left + tx*scale, iRect.top + ty*scale)
          // Solve for tx/ty to land on hRect:
          var tx = (hRect.left - iRect.left) / scale;
          var ty = (hRect.top  - iRect.top)  / scale;

          // Kick off the move — 0.9 s, cinematic ease
          introTitle.style.transition = "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)";
          introTitle.style.transform  = "scale(" + scale + ") translate(" + tx + "px, " + ty + "px)";

          // After 0.9 s move + 0.2 s pause = 1100 ms
          setTimeout(function () {
            // ── Pre-render real h1 so handoff is invisible ────────────
            // Make every char instantly visible (no re-run of char-appear)
            realH1.querySelectorAll(".char").forEach(function (ch) {
              ch.style.animation  = "none";
              ch.style.opacity    = "1";
              ch.style.filter     = "none";
              ch.style.transform  = "none";
            });

            // ── Stage hero sub-elements for simultaneous fade-in ──────
            var stamp   = document.querySelector(".hero-brand-stamp");
            var tagline = document.querySelector(".tagline");
            var rule    = document.querySelector(".home-hero__rule");

            [stamp, tagline, rule].forEach(function (el) {
              if (!el) return;
              el.style.animation = "none";
              el.style.opacity   = "0";
            });
            if (stamp)   stamp.style.transform   = "translateX(-16px)";
            if (tagline) tagline.style.transform  = "translateY(15px)";
            if (rule) {
              rule.style.transform       = "scaleX(0)";
              rule.style.transformOrigin = "left center";
            }

            // Two rAF frames: first applies the staged styles above,
            // second starts the transitions (avoids a single-frame flash)
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                // ── Seamless handoff ────────────────────────────────────
                // 1. Real h1 becomes visible (intro-running removed)
                document.body.classList.remove("intro-running");
                document.body.style.overflow = "";
                clearTimeout(introFallback);

                // 2. Overlay fades away (0.4 s)
                introOverlay.classList.add("is-done");

                // 3. Hero sub-elements fade in simultaneously (0.5 s)
                if (stamp) {
                  stamp.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                  stamp.style.opacity    = "1";
                  stamp.style.transform  = "translateX(0)";
                }
                if (tagline) {
                  tagline.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                  tagline.style.opacity    = "1";
                  tagline.style.transform  = "translateY(0)";
                }
                if (rule) {
                  rule.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease";
                  rule.style.opacity    = "1";
                  rule.style.transform  = "scaleX(1)";
                }

                // 4. Rest of page fades in 0.1 s later (0.4 s duration)
                setTimeout(function () {
                  app.classList.remove("hidden-until-intro");
                  app.classList.add("intro-visible");
                }, 100);
                // ──────────────────────────────────────────────────────
              });
            });
          }, 1100); // 900 ms move + 200 ms pause

        }, waitMs);
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
