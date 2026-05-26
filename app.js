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

  const bookingForm = document.getElementById("booking-form");
  const bookingParentNameInput = document.getElementById("booking-parent-name");
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
  const adminPaymentForm = document.getElementById("admin-payment-form");
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
  let adminUnlocked = false;
  let adminViewingStudent = null;
  let bookings = [];
  let paymentChecklist = [];
  let supabaseClient = null;
  let userCloudSyncTimer = null;
  let userCloudSyncInFlight = false;
  let userCloudSyncQueued = false;
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
          examples: [
            "1) This is ___ book. (I) -> my",
            "2) We like ___ teacher. (we) -> our",
            "3) They forgot ___ homework. (they) -> their",
          ],
          practice:
            "Write 10 sentences about your school and home using possessive adjectives. Then swap sentences with a classmate and correct each other.",
        },
        {
          topic: "Present simple vs present continuous",
          introEn:
            "French has one present tense; English has two. Use the Present Simple for routines and facts: \"I eat lunch at 1pm.\" Use the Present Continuous for actions happening right now: \"I'm eating lunch.\" The giveaway is am/is/are + verb-ing. That pattern always means \"now.\"",
          introFr:
            "En français il y a un seul présent ; en anglais il y en a deux. On utilise le Present Simple pour les routines et les faits : « I eat lunch at 1pm » (je mange à 13h, en général). On utilise le Present Continuous pour ce qui se passe maintenant : « I'm eating lunch » (je suis en train de manger). La formule am/is/are + verbe-ing veut toujours dire « maintenant ».",
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
          examples: [
            "1) ___ a book on the table. (There is)",
            "2) ___ two windows in my room. (There are)",
            "3) ___ any milk in the fridge? (Is there)",
          ],
          practice:
            "Describe your bedroom in 10 sentences using there is/there are and at least 4 prepositions.",
        },
        {
          topic: "Question forms (do/does/is/are)",
          examples: [
            "1) ___ you like English? (Do)",
            "2) Where ___ she live? (does)",
            "3) ___ they in class now? (Are)",
          ],
          practice:
            "Write 12 interview questions to ask a new classmate. Then answer them in full sentences.",
        },
        {
          topic: "Articles (a / an / the)",
          examples: [
            "1) I have ___ orange and ___ banana. (an, a)",
            "2) ___ sun is bright today. (The)",
            "3) She is ___ teacher in my school. (a)",
          ],
          practice:
            "Write 14 sentences about your school day and underline every article you use.",
        },
        {
          topic: "Prepositions of place",
          examples: [
            "1) The bag is ___ the chair. (under)",
            "2) The clock is ___ the wall. (on)",
            "3) The keys are ___ the table and the lamp. (between)",
          ],
          practice:
            "Describe one room in your house using at least 12 preposition phrases.",
        },
        {
          topic: "Countable and uncountable nouns",
          examples: [
            "1) We need ___ apples. (some)",
            "2) There isn't ___ sugar left. (much)",
            "3) How ___ bottles do we need? (many)",
          ],
          practice:
            "Write a shopping list with 20 items and classify each as countable or uncountable.",
        },
        {
          topic: "Can / can't for ability",
          examples: [
            "1) I ___ swim very well. (can)",
            "2) She ___ drive yet. (can't)",
            "3) ___ you speak English and French? (Can)",
          ],
          practice:
            "Write 12 sentences about what you can and can't do, then ask 6 partner questions.",
        },
        {
          topic: "Past simple regular/irregular verbs",
          examples: [
            "1) Yesterday I ___ to school. (went)",
            "2) We ___ football after class. (played)",
            "3) She ___ a great film. (saw)",
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
          examples: [
            "1) My teacher helped ___. (me)",
            "2) I called ___ yesterday. (him)",
            "3) They invited ___ to the event. (us)",
          ],
          practice: "Rewrite 12 sentences by replacing names with object pronouns correctly.",
          extension: "Write a dialogue with 8 object pronouns and perform it in pairs.",
          homework: "Complete a pronoun correction worksheet and explain 3 corrections.",
          checklist: ["Correct object pronoun choice", "Clear sentence meaning", "No subject/object mix-ups"],
        },
        {
          topic: "Future forms (going to / will)",
          examples: [
            "1) I ___ study tonight. (am going to)",
            "2) I think it ___ rain later. (will)",
            "3) We ___ visit Cork this weekend. (are going to)",
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
          examples: [
            "1) The students presented ___ projects. (their)",
            "2) She forgot ___ charger at home. (her)",
            "3) We improved ___ pronunciation this month. (our)",
          ],
          practice:
            "Rewrite a short paragraph by replacing names with pronouns and correct possessive adjectives.",
        },
        {
          topic: "Present perfect vs past simple",
          examples: [
            "1) I ___ that film last week. (watched)",
            "2) We ___ three units this month. (have completed)",
            "3) She ___ to London in 2024. (went)",
          ],
          practice:
            "Create 12 sentence pairs: one life experience sentence and one specific past-time sentence.",
        },
        {
          topic: "Relative clauses (who/which/that)",
          examples: [
            "1) The teacher ___ helped me was excellent. (who)",
            "2) This is the app ___ I use every day. (that/which)",
            "3) Students ___ revise regularly improve faster. (who)",
          ],
          practice:
            "Combine 10 short sentence pairs into one sentence using relative clauses.",
        },
        {
          topic: "Modal verbs for advice and obligation",
          examples: [
            "1) You ___ revise every day. (should)",
            "2) Students ___ wear a uniform. (must)",
            "3) You ___ use your phone in the exam. (mustn't)",
          ],
          practice:
            "Write a class rule guide with 8 rules and 6 advice sentences using should/must/mustn't.",
        },
        {
          topic: "Conditionals (0, 1st, 2nd)",
          examples: [
            "1) If you heat ice, it ___. (melts)",
            "2) If I study hard, I ___ the test. (will pass)",
            "3) If I had more time, I ___ more books. (would read)",
          ],
          practice:
            "Write 12 conditional sentences: 4 zero, 4 first, and 4 second conditional.",
        },
        {
          topic: "Reported speech",
          examples: [
            "1) She said, 'I am tired.' -> She said she ___ tired. (was)",
            "2) He said, 'I will call you.' -> He said he ___ call me. (would)",
            "3) They said, 'We have finished.' -> They said they ___ finished. (had)",
          ],
          practice:
            "Convert 10 direct quotes into reported speech and explain each tense change.",
        },
        {
          topic: "Passive voice in context",
          examples: [
            "1) People speak English worldwide. -> English ___ worldwide. (is spoken)",
            "2) They built the bridge in 1998. -> The bridge ___ in 1998. (was built)",
            "3) Someone has stolen my bike. -> My bike ___ . (has been stolen)",
          ],
          practice:
            "Rewrite 14 active sentences into passive voice and identify the tense used each time.",
        },
        {
          topic: "Comparatives and superlatives for argument writing",
          examples: [
            "1) This plan is ___ than the last one. (more effective)",
            "2) It is the ___ option for students. (best)",
            "3) Public transport is often ___ than driving. (cheaper)",
          ],
          practice:
            "Write a comparison paragraph (150 words) about two study methods using 10 comparison forms.",
        },
        {
          topic: "Essay paragraph structure (PEEL)",
          examples: [
            "Point: School uniforms improve focus.",
            "Evidence: Survey data from 200 students.",
            "Explain: Reduced social pressure improves concentration.",
          ],
          practice:
            "Write two PEEL paragraphs on one education topic and self-check each section.",
          extension: "Turn one paragraph into a full timed essay introduction and conclusion.",
          homework: "Submit one PEEL paragraph plus self-assessment rubric.",
          checklist: ["Point is clear", "Evidence is relevant", "Explanation links to question"],
        },
        {
          topic: "Linkers for cohesion (however, therefore, moreover)",
          examples: [
            "1) The plan is expensive; ___, it is effective. (however)",
            "2) We practised daily; ___, we improved. (therefore)",
            "3) The class is small; ___, everyone participates. (moreover)",
          ],
          practice: "Write a 160-word argument text using at least 10 linkers accurately.",
          extension: "Replace basic linkers with higher-level alternatives.",
          homework: "Annotate your paragraph and label every linker by function.",
          checklist: ["No repeated simple linkers", "Correct punctuation", "Logical paragraph flow"],
        },
        {
          topic: "Error correction and redrafting",
          examples: [
            "1) He go to school every day. -> goes",
            "2) I am agree with you. -> I agree with you.",
            "3) She said me to come. -> She told me to come.",
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
          examples: [
            "1) Each candidate must justify ___ methodology. (his/her/their)",
            "2) The committee reviewed ___ final draft. (its)",
            "3) Students should evaluate ___ assumptions. (their)",
          ],
          practice:
            "Edit a 180-word text to improve reference clarity, possessives, and cohesion.",
        },
        {
          topic: "Cleft and inversion practice",
          examples: [
            "1) It was only later that we ___ the issue. (understood)",
            "2) Rarely ___ students receive such feedback. (do)",
            "3) What the essay lacks is ___. (clear evidence)",
          ],
          practice:
            "Rewrite 8 neutral sentences into advanced structures with clefts or inversion.",
        },
        {
          topic: "Hedging and academic caution",
          examples: [
            "1) This result ___ indicate a wider trend. (may)",
            "2) It ___ be argued that policy changes are needed. (can)",
            "3) The evidence ___ to suggest a link. (appears)",
          ],
          practice:
            "Rewrite a strong opinion paragraph using at least 8 hedging expressions.",
        },
        {
          topic: "Nominalisation for formal writing",
          examples: [
            "1) We analysed the data. -> The ___ of the data... (analysis)",
            "2) The government decided quickly. -> The quick ___ ... (decision)",
            "3) Students improved rapidly. -> Rapid ___ was observed. (improvement)",
          ],
          practice:
            "Transform 12 verb-based sentences into formal nominalised structures.",
        },
        {
          topic: "Paraphrasing and synonym control",
          examples: [
            "1) Important -> significant / crucial",
            "2) Show -> demonstrate / indicate",
            "3) Problem -> issue / challenge / limitation",
          ],
          practice:
            "Paraphrase a 160-word paragraph without changing meaning while improving register.",
        },
        {
          topic: "Complex sentence cohesion",
          examples: [
            "1) Although X, Y ...",
            "2) While it is true that X, ...",
            "3) Not only X, but also Y ...",
          ],
          practice:
            "Write one cohesive paragraph using at least 8 advanced linkers and 3 complex sentence frames.",
        },
        {
          topic: "Advanced punctuation and clarity",
          examples: [
            "1) Use semicolons to connect related clauses.",
            "2) Use colons to introduce explanation or lists.",
            "3) Control comma splices in long sentences.",
          ],
          practice:
            "Edit a 220-word text for punctuation accuracy and sentence clarity, then justify each correction.",
        },
        {
          topic: "Synthesis writing from two sources",
          examples: [
            "1) Source A argues that remote learning increases access.",
            "2) Source B claims quality depends on teacher training.",
            "3) Synthesis: balanced thesis combining both findings.",
          ],
          practice:
            "Write a 250-word synthesis paragraph integrating two short sources with clear attribution.",
        },
        {
          topic: "Timed high-level speaking response",
          examples: [
            "1) 30s plan -> 2min response",
            "2) Include claim, support, counterpoint, conclusion",
            "3) Use at least 6 advanced linkers",
          ],
          practice:
            "Record three timed responses and self-score accuracy, coherence, and lexical range.",
          extension: "Re-record your lowest-scoring response and improve by at least 2 points.",
          homework: "Submit both recordings and a reflection paragraph.",
          checklist: ["Clear structure", "Advanced vocabulary", "Accurate grammar under time pressure"],
        },
        {
          topic: "Abstract topic essay planning",
          examples: [
            "1) Prompt: Is technology making attention spans weaker?",
            "2) Build thesis + 2 balanced body points + counterargument.",
            "3) Add one real-world example per paragraph.",
          ],
          practice: "Create 3 full essay plans in 20 minutes each.",
          extension: "Write one complete essay from your strongest plan.",
          homework: "Submit all 3 plans with your best chosen thesis highlighted.",
          checklist: ["Balanced argument", "Clear logic chain", "Concrete examples"],
        },
        {
          topic: "Source comparison and reliability",
          examples: [
            "1) Compare purpose, audience, and evidence quality.",
            "2) Distinguish claim from data.",
            "3) Identify bias and missing context.",
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
        question: current.q + " [Q" + String(i + 1) + "]",
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

  async function refreshAdminCloudData() {
    if (!adminUnlocked) return;
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
    if (!user.fullName) user.fullName = "";
    ensureLearningHub(user.stats);
    return user.stats;
  }

  function ensureLearningHub(stats) {
    if (!stats.learningHub) {
      stats.learningHub = {
        xp: 0,
        xpByLevel: {},
        streak: 0,
        lastActiveDay: "",
        vocabTopic: {},
        savedWords: [],
        homeworkTasks: {},
        homeworkChecklist: {},
        activityByDay: {},
      };
    }
    const lh = stats.learningHub;
    if (!lh.xpByLevel) lh.xpByLevel = {};
    if (!lh.vocabTopic) lh.vocabTopic = {};
    if (!lh.savedWords) lh.savedWords = [];
    if (!lh.homeworkTasks) lh.homeworkTasks = {};
    if (!lh.homeworkChecklist) lh.homeworkChecklist = {};
    if (!lh.activityByDay) lh.activityByDay = {};
    return lh;
  }

  function isoDay(d) {
    return d.toISOString().slice(0, 10);
  }

  let _activeLevelForXp = null;

  function bumpLearningActivity(xpDelta) {
    const user = getActiveUser();
    if (!user) return;
    const stats = ensureStats(user);
    const lh = ensureLearningHub(stats);
    const today = isoDay(new Date());
    if (typeof xpDelta === "number" && xpDelta > 0) {
      lh.xp = (lh.xp || 0) + xpDelta;
      if (_activeLevelForXp) {
        if (!lh.xpByLevel) lh.xpByLevel = {};
        lh.xpByLevel[_activeLevelForXp] = (lh.xpByLevel[_activeLevelForXp] || 0) + xpDelta;
      }
    }
    if (lh.lastActiveDay !== today) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const ystr = isoDay(y);
      if (lh.lastActiveDay === ystr) lh.streak = (lh.streak || 0) + 1;
      else lh.streak = lh.lastActiveDay ? 1 : Math.max(1, lh.streak || 1);
      lh.lastActiveDay = today;
    }
    lh.activityByDay[today] = (lh.activityByDay[today] || 0) + 1;
    saveUsers();
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
    const bonus = Math.min(18, 6 + Math.max(0, Number(payload.correct) || 0));
    bumpLearningActivity(bonus);
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
      ["account-register-password-confirm-toggle", "account-register-password-confirm"],
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
      document.getElementById("account-register-password-confirm-toggle"),
      document.getElementById("account-register-password-confirm")
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
    adminStudentDetailInner.innerHTML = "";

    const header = document.createElement("div");
    header.className = "admin-student-detail__header";
    const h = document.createElement("h3");
    h.textContent = I18n.t("admin_student_detail_title", {
      name: user.fullName || username,
    });
    const sub = document.createElement("p");
    sub.className = "admin-student-detail__sub";
    sub.textContent = I18n.t("admin_student_detail_username", { user: username });
    header.appendChild(h);
    header.appendChild(sub);
    adminStudentDetailInner.appendChild(header);

    const secFlash = document.createElement("section");
    secFlash.className = "admin-detail-section";
    const hFlash = document.createElement("h4");
    hFlash.textContent = I18n.t("admin_student_flash_overall");
    secFlash.appendChild(hFlash);
    const att = stats.flashcards.attempts || 0;
    const cor = stats.flashcards.correct || 0;
    const pct = att ? (cor / att) * 100 : 0;
    appendAdminBarRow(secFlash, I18n.t("admin_student_lifetime_accuracy"), pct);
    adminStudentDetailInner.appendChild(secFlash);

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
    const sessions = (stats.flashcardSessions || []).slice(-12);
    if (!sessions.length) {
      const p = document.createElement("p");
      p.className = "admin-detail-empty";
      p.textContent = I18n.t("admin_student_no_sessions");
      secSess.appendChild(p);
    } else {
      const chart = document.createElement("div");
      chart.className = "admin-column-chart";
      sessions.forEach(function (s, idx) {
        const col = document.createElement("div");
        col.className = "admin-column-chart__col";
        const total = s.total || 1;
        const hPct = Math.round(((s.correct || 0) / total) * 100);
        const bar = document.createElement("div");
        bar.className = "admin-column-chart__bar";
        const px = Math.round((hPct / 100) * 110);
        bar.style.height = String(Math.max(4, px)) + "px";
        bar.title =
          (s.topic || "") +
          " (" +
          (s.level || "") +
          "): " +
          String(s.correct) +
          "/" +
          String(total) +
          (s.mode === "wrong_retry" ? " · " + I18n.t("admin_student_mode_wrong_retry") : "");
        const lab = document.createElement("span");
        lab.className = "admin-column-chart__label";
        lab.textContent = String(idx + 1);
        col.appendChild(bar);
        col.appendChild(lab);
        chart.appendChild(col);
      });
      secSess.appendChild(chart);
      const tb = document.createElement("p");
      tb.className = "admin-session-legend";
      tb.textContent = I18n.t("admin_student_session_chart_hint");
      secSess.appendChild(tb);
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
      const ul = document.createElement("ul");
      ul.className = "admin-detail-list";
      stats.completedExercises.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      secEx.appendChild(ul);
    }
    adminStudentDetailInner.appendChild(secEx);
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
    accountAuth.classList.add("hidden");
    accountDashboard.classList.remove("hidden");
    accountWelcome.textContent = I18n.t("account_welcome_logged_in", { user: activeUsername });
    accountProgressCards.innerHTML = "";
    const metrics = [
      "Flashcard accuracy: " +
        String(stats.flashcards.correct) +
        "/" +
        String(stats.flashcards.attempts) +
        " (" +
        formatPct(stats.flashcards.correct, stats.flashcards.attempts) +
        ")",
      "Quiz sessions completed: " + String(stats.quizSessions),
      "Completed exercises: " + String(stats.completedExercises.length),
    ];
    Object.keys(stats.quizBest).forEach(function (k) {
      metrics.push("Best " + k + ": " + String(stats.quizBest[k]) + "%");
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

  function renderAdminPanel() {
    if (!adminLoginWrap || !adminDashboard || !adminStudentsTableBody) return;
    adminLoginWrap.classList.toggle("hidden", adminUnlocked);
    adminDashboard.classList.toggle("hidden", !adminUnlocked);
    if (!adminUnlocked) return;
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
            td.textContent = txt || "-";
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
      Object.keys(users).forEach(function (username) {
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
          const next = window.prompt("Update full name for " + username, user.fullName || username);
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
          const next = window.prompt("Set new password for " + username);
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
        name.textContent = item.name + (item.paid ? " (paid)" : " (not paid)");
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
    bumpLearningActivity(22);
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
    bumpLearningActivity(wasCorrect ? 4 : 1);
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
    bumpLearningActivity(Math.min(20, 8 + Math.round(pct / 5)));
    saveUsers();
    renderAccountPanel();
  }

  function refreshPasswordHint() {
    if (!contentPasswordOverlay.classList.contains("hidden") && pendingLevel) {
      contentPasswordForLevel.textContent = I18n.t("content_opening", {
        level: I18n.t("level_" + pendingLevel),
      });
    }
  }

  window.addEventListener("andronicus:langchange", function () {
    buildBookingCalendar();
    refreshPasswordHint();
    syncPasswordToggleAria();
    if (adminUnlocked) renderAdminPanel();
    learningToolsLangRefreshers.forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
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

    const XP_GOAL = 1000;
    const LEVEL_ORDER = ["beginner", "intermediate", "advanced"];

    function getLevelXp(level) {
      const user = getActiveUser();
      if (!user) return 0;
      const lh = ensureLearningHub(ensureStats(user));
      return Number(lh.xpByLevel && lh.xpByLevel[level]) || 0;
    }

    function isLevelUnlocked(level) {
      if (level === "beginner") return true;
      const idx = LEVEL_ORDER.indexOf(level);
      if (idx <= 0) return true;
      const prevLevel = LEVEL_ORDER[idx - 1];
      return getLevelXp(prevLevel) >= XP_GOAL;
    }

    document.querySelectorAll(".btn-level").forEach((btn) => {
      const level = btn.getAttribute("data-level");
      if (!level) return;

      const existing = btn.querySelector(".btn-level__xp");
      if (existing) existing.remove();

      const unlocked = isLevelUnlocked(level);
      const displayXp = unlocked ? getLevelXp(level) : getLevelXp(LEVEL_ORDER[Math.max(0, LEVEL_ORDER.indexOf(level) - 1)]);
      const pct = Math.max(0, Math.min(100, Math.round((displayXp / XP_GOAL) * 100)));

      const wrap = document.createElement("span");
      wrap.className = "btn-level__xp";

      const label = document.createElement("span");
      label.className = "btn-level__xp-label";
      label.textContent = unlocked
        ? String(Math.min(XP_GOAL, displayXp)) + " / " + String(XP_GOAL) + " XP"
        : "🔒 Reach 1000 XP in previous level";

      const track = document.createElement("span");
      track.className = "btn-level__xp-track";
      const fill = document.createElement("span");
      fill.className = "btn-level__xp-fill";
      fill.style.width = String(pct) + "%";
      track.appendChild(fill);

      wrap.appendChild(label);
      wrap.appendChild(track);
      btn.appendChild(wrap);
    });
  }

  function showHome() {
    panelHome.classList.remove("hidden");
    panels.forEach((p) => p.classList.add("hidden"));
    mainNav.classList.remove("hidden");
    btnHome.classList.add("hidden");
    setContentPanelOpen(false);
    resetContentPanel();
  }

  function forceInitialHomeView() {
    showHome();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function resetContentPanel() {
    showLevelPicker();
  }

  function openSection(id) {
    setContentPanelOpen(id === "content");
    panelHome.classList.add("hidden");
    panels.forEach((p) => {
      p.classList.toggle("hidden", p.id !== "panel-" + id);
    });
    mainNav.classList.add("hidden");
    btnHome.classList.remove("hidden");

    if (id === "content") {
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
  }

  mainNav.addEventListener("click", (e) => {
    const card = e.target.closest("[data-section]");
    if (!card) return;
    openSection(card.getAttribute("data-section"));
  });

  btnHome.addEventListener("click", showHome);

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
      const passConfirm = (document.getElementById("account-register-password-confirm").value || "").trim();
      if (!name || !pass || !fullName || !passConfirm) {
        setAuthFeedback(I18n.t("account_err_register_fields"), true);
        return;
      }
      if (pass !== passConfirm) {
        setAuthFeedback(I18n.t("account_err_password_mismatch"), true);
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

  window.addEventListener("pageshow", function () {
    forceInitialHomeView();
  });

  contentPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (contentPasswordInput.value || "").trim();
    if (val === CONTENT_PASSWORD && pendingLevel) {
      contentPasswordError.classList.add("hidden");
      contentPasswordOverlay.classList.add("hidden");
      contentPasswordInput.value = "";
      levelPicker.classList.add("hidden");
      document.querySelectorAll(".btn-level").forEach((b) => b.classList.remove("is-active"));
      document.querySelectorAll(".level-article").forEach((art) => art.classList.add("hidden"));
      const btn = document.querySelector('.btn-level[data-level="' + pendingLevel + '"]');
      if (btn) btn.classList.add("is-active");
      const article = document.getElementById("content-" + pendingLevel);
      if (article) article.classList.remove("hidden");
      pendingLevel = null;
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
    const studentName = (bookingStudentNameInput && bookingStudentNameInput.value.trim()) || "";
    const phone = (bookingPhoneInput && bookingPhoneInput.value.trim()) || "";
    const level = (bookingLevelInput && bookingLevelInput.value) || "";
    const timesUnknown = bookingTimesUnknownSelected();

    if (!parentName) missing.push(I18n.t("booking_missing_parent_name"));
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
      btn.textContent = h + ":00";
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
        rm.textContent = "×";
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
    document.querySelectorAll(".learning-tools").forEach(initLearningHubForRoot);
  }

  function initLearningHubForRoot(root) {
      const level = root.getAttribute("data-learning-level");
      _activeLevelForXp = level;
      const data = learningData[level];
      if (!data) return;
      const menuButtons = root.querySelectorAll(".tool-menu__btn[data-tool]");
      const panels = root.querySelectorAll(".tool-panel");
      const flashcardsPanel = root.querySelector('[data-tool-panel="flashcards"]');
      const vocabPanel = root.querySelector('[data-tool-panel="vocab"]');
      const exercisesPanel = root.querySelector('[data-tool-panel="exercises"]');
      const homeworkPanel = root.querySelector('[data-tool-panel="homework"]');
      const progressPanel = root.querySelector('[data-tool-panel="progress"]');

      function activateTab(name) {
        menuButtons.forEach(function (b) {
          const on = b.getAttribute("data-tool") === name;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (panel) {
          panel.classList.toggle("hidden", panel.getAttribute("data-tool-panel") !== name);
        });
        if (name === "progress") renderProgressPanel();
      }
      menuButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          activateTab(btn.getAttribute("data-tool"));
        });
      });

      function refreshGamificationHeader() {
        const user = getActiveUser();
        const xpEl = root.querySelector(".lh-vocab__xp-val");
        const stEl = root.querySelector(".lh-vocab__streak-val");
        if (!xpEl || !stEl) return;
        if (!user) {
          xpEl.textContent = "0";
          stEl.textContent = "0";
          return;
        }
        const lh = ensureLearningHub(ensureStats(user));
        xpEl.textContent = String(lh.xp || 0);
        stEl.textContent = String(lh.streak || 0);
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
        const grid = document.createElement("div");
        grid.className = "lh-stat-grid";
        function statCard(label, val) {
          const c = document.createElement("div");
          c.className = "lh-stat-card";
          const lab = document.createElement("div");
          lab.className = "lh-stat-card__label";
          lab.textContent = label;
          const v = document.createElement("div");
          v.className = "lh-stat-card__value";
          v.textContent = val;
          c.appendChild(lab);
          c.appendChild(v);
          grid.appendChild(c);
        }
        statCard(I18n.t("learning_progress_xp"), String(lh.xp || 0));
        statCard(I18n.t("learning_progress_streak"), String(lh.streak || 0));
        const fa = stats.flashcards.attempts || 0;
        const fc = stats.flashcards.correct || 0;
        statCard(I18n.t("learning_progress_flash_accuracy"), fa ? String(Math.round((fc / fa) * 100)) + "%" : "N/A");
        statCard(I18n.t("learning_progress_quiz_sessions"), String(stats.quizSessions || 0));
        statCard(I18n.t("learning_progress_exercises_done"), String((stats.completedExercises || []).length));
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
        for (let i = 6; i >= 0; i -= 1) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = isoDay(d);
          const col = document.createElement("div");
          col.className = "lh-week-chart__col";
          const n = dayCounts[key] || 0;
          const bar = document.createElement("div");
          bar.className = "lh-week-chart__bar";
          bar.style.height = String(Math.min(72, 8 + n * 10)) + "px";
          bar.title = key + ": " + String(n);
          const lab = document.createElement("span");
          lab.className = "lh-week-chart__lab";
          lab.textContent = String(d.getDate());
          col.appendChild(bar);
          col.appendChild(lab);
          chart.appendChild(col);
        }
        wrap.appendChild(chart);

        const planTitle = document.createElement("h4");
        planTitle.className = "lh-subheading";
        planTitle.textContent = I18n.t("learning_progress_plan");
        wrap.appendChild(planTitle);
        const planList = document.createElement("ul");
        planList.className = "resource-list lh-plan-list";
        (data.schedule || []).forEach(function (week) {
          const li = document.createElement("li");
          li.textContent = week;
          planList.appendChild(li);
        });
        wrap.appendChild(planList);

        const badgeTitle = document.createElement("h4");
        badgeTitle.className = "lh-subheading";
        badgeTitle.textContent = I18n.t("learning_progress_badges");
        wrap.appendChild(badgeTitle);
        const badges = document.createElement("div");
        badges.className = "lh-badges";
        const b1 = document.createElement("span");
        b1.className = "lh-badge";
        b1.textContent =
          ((lh.xp || 0) >= 50 ? "★ " : "○ ") + I18n.t("learning_progress_badge_xp50");
        const b2 = document.createElement("span");
        b2.className = "lh-badge";
        b2.textContent =
          ((lh.streak || 0) >= 3 ? "★ " : "○ ") + I18n.t("learning_progress_badge_streak3");
        badges.appendChild(b1);
        badges.appendChild(b2);
        wrap.appendChild(badges);

        progressPanel.appendChild(wrap);
      }

      function homeworkKey(topic) {
        return level + "|hw|" + topic;
      }

      function renderHomeworkPanel() {
        homeworkPanel.innerHTML = "";

        // New flat checklist (if defined for this level, replaces the mission-card UI).
        if (Array.isArray(data.homeworkChecklist) && data.homeworkChecklist.length) {
          const cuser = getActiveUser();
          const cstats = cuser ? ensureStats(cuser) : null;
          const clh = cuser ? ensureLearningHub(cstats) : null;
          const done = (clh && clh.homeworkChecklist && clh.homeworkChecklist[level]) || {};

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

          const totalDone = data.homeworkChecklist.reduce(function (acc, item) {
            return acc + (done[item.id] ? 1 : 0);
          }, 0);
          const cProgress = document.createElement("p");
          cProgress.className = "lh-hw-checklist__progress";
          cProgress.textContent = I18n.t("learning_homework_checklist_progress", {
            n: String(totalDone),
            t: String(data.homeworkChecklist.length),
          });
          cwrap.appendChild(cProgress);

          const cList = document.createElement("ol");
          cList.className = "lh-hw-checklist__list";
          const cLang = I18n.getLang();
          data.homeworkChecklist.forEach(function (item) {
            const li = document.createElement("li");
            li.className = "lh-hw-checklist__item" + (done[item.id] ? " is-done" : "");
            const label = document.createElement("label");
            label.className = "lh-hw-checklist__label";
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.className = "lh-hw-checklist__cb";
            cb.checked = !!done[item.id];
            cb.disabled = !cuser;
            cb.addEventListener("change", function () {
              if (!cuser) return;
              const st = ensureStats(cuser);
              const hub = ensureLearningHub(st);
              if (!hub.homeworkChecklist) hub.homeworkChecklist = {};
              if (!hub.homeworkChecklist[level]) hub.homeworkChecklist[level] = {};
              if (cb.checked) hub.homeworkChecklist[level][item.id] = true;
              else delete hub.homeworkChecklist[level][item.id];
              saveUsers();
              bumpLearningActivity(cb.checked ? 3 : 0);
              renderHomeworkPanel();
            });
            const tag = document.createElement("span");
            tag.className = "lh-hw-checklist__tag lh-hw-cat-" + String(item.category || "").toLowerCase();
            tag.textContent = item.category || "";
            const text = document.createElement("span");
            text.className = "lh-hw-checklist__text";
            text.textContent = cLang === "fr" && item.fr ? item.fr : item.en || item.fr || "";
            label.appendChild(cb);
            label.appendChild(tag);
            label.appendChild(text);
            li.appendChild(label);
            cList.appendChild(li);
          });
          cwrap.appendChild(cList);

          if (!cuser) {
            const cNotice = document.createElement("p");
            cNotice.className = "lh-muted";
            cNotice.textContent = I18n.t("learning_homework_checklist_signin");
            cwrap.appendChild(cNotice);
          }

          homeworkPanel.appendChild(cwrap);
          return;
        }

        const wrap = document.createElement("div");
        wrap.className = "lh-homework";
        const user = getActiveUser();
        const stats = user ? ensureStats(user) : null;
        const lh = user ? ensureLearningHub(stats) : null;

        const sections = [
          { key: "today", title: I18n.t("learning_homework_today") },
          { key: "upcoming", title: I18n.t("learning_homework_upcoming") },
          { key: "done", title: I18n.t("learning_homework_done") },
        ];
        const buckets = { today: [], upcoming: [], done: [] };
        (data.vocab || []).forEach(function (mission, mi) {
          const topic = mission.topic;
          const doneKey = level + " - Vocab: " + topic;
          const taskArr =
            lh && lh.homeworkTasks && lh.homeworkTasks[homeworkKey(topic)]
              ? lh.homeworkTasks[homeworkKey(topic)].slice()
              : Array(mission.tasks.length).fill(false);
          const allChecked = taskArr.every(Boolean);
          const completedFlag = allChecked || (stats && stats.completedExercises.includes(doneKey));
          const card = document.createElement("article");
          card.className = "lh-hw-card";
          const head = document.createElement("div");
          head.className = "lh-hw-card__head";
          const h = document.createElement("h4");
          h.textContent = topic;
          const meta = document.createElement("span");
          meta.className = "lh-hw-card__meta";
          meta.textContent = I18n.t("learning_homework_tasks_count", {
            n: String(mission.tasks.length),
          });
          head.appendChild(h);
          head.appendChild(meta);
          card.appendChild(head);
          const ul = document.createElement("ul");
          ul.className = "lh-hw-tasks";
          mission.tasks.forEach(function (task, ti) {
            const li = document.createElement("li");
            const lab = document.createElement("label");
            lab.className = "lh-hw-task";
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = !!taskArr[ti];
            cb.disabled = !user;
            cb.addEventListener("change", function () {
              if (!user) return;
              const st = ensureStats(user);
              const hub = ensureLearningHub(st);
              const key = homeworkKey(topic);
              const prev = Array.isArray(hub.homeworkTasks[key])
                ? hub.homeworkTasks[key].slice()
                : Array(mission.tasks.length).fill(false);
              while (prev.length < mission.tasks.length) prev.push(false);
              prev[ti] = cb.checked;
              hub.homeworkTasks[key] = prev.slice(0, mission.tasks.length);
              saveUsers();
              bumpLearningActivity(cb.checked ? 2 : 0);
              renderHomeworkPanel();
            });
            const span = document.createElement("span");
            span.textContent = task;
            lab.appendChild(cb);
            lab.appendChild(span);
            li.appendChild(lab);
            ul.appendChild(li);
          });
          card.appendChild(ul);
          const foot = document.createElement("div");
          foot.className = "lh-hw-card__foot";
          const markBtn = document.createElement("button");
          markBtn.type = "button";
          markBtn.className = "flashcard-btn";
          markBtn.textContent = I18n.t("learning_vocab_done_btn");
          markBtn.disabled = !user;
          markBtn.addEventListener("click", function () {
            const res = recordExerciseCompletion(level, "Vocab: " + topic);
            if (res.ok) bumpLearningActivity(18);
            renderHomeworkPanel();
          });
          foot.appendChild(markBtn);
          card.appendChild(foot);

          if (completedFlag) buckets.done.push(card);
          else if (buckets.today.length < 2) buckets.today.push(card);
          else buckets.upcoming.push(card);
        });

        sections.forEach(function (sec) {
          const list = buckets[sec.key];
          if (!list.length && sec.key !== "done") return;
          const block = document.createElement("section");
          block.className = "lh-hw-section";
          const ht = document.createElement("h3");
          ht.className = "lh-hw-section__title";
          ht.textContent = sec.title;
          block.appendChild(ht);
          if (!list.length) {
            const empty = document.createElement("p");
            empty.className = "lh-muted";
            empty.textContent = I18n.t("learning_homework_empty");
            block.appendChild(empty);
          } else {
            const grid = document.createElement("div");
            grid.className = "lh-hw-grid";
            list.forEach(function (c) {
              grid.appendChild(c);
            });
            block.appendChild(grid);
          }
          wrap.appendChild(block);
        });

        const weekNote = document.createElement("p");
        weekNote.className = "lh-muted lh-hw-footnote";
        weekNote.textContent = I18n.t("learning_homework_week_hint");
        wrap.appendChild(weekNote);

        homeworkPanel.appendChild(wrap);
      }
      renderHomeworkPanel();

      vocabPanel.innerHTML = "";
      const vocShell = document.createElement("div");
      vocShell.className = "lh-vocab";
      const vocHeader = document.createElement("div");
      vocHeader.className = "lh-vocab__header";
      const xpBox = document.createElement("div");
      xpBox.className = "lh-chip lh-chip--xp";
      xpBox.innerHTML =
        '<span class="lh-chip__lab">' +
        I18n.t("learning_hub_xp") +
        '</span> <span class="lh-vocab__xp-val">0</span>';
      const stBox = document.createElement("div");
      stBox.className = "lh-chip lh-chip--streak";
      stBox.innerHTML =
        '<span class="lh-chip__lab">' +
        I18n.t("learning_hub_streak") +
        '</span> <span class="lh-vocab__streak-val">0</span>';
      vocHeader.appendChild(xpBox);
      vocHeader.appendChild(stBox);
      vocShell.appendChild(vocHeader);

      const topicRow = document.createElement("div");
      topicRow.className = "lh-pill-row";
      let activeTopicFilter = "all";
      const topicSet = {};
      (data.vocabQuiz || []).forEach(function (q) {
        if (q.topic) topicSet[q.topic] = true;
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
      vocShell.appendChild(topicRow);

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

      const summary = document.createElement("div");
      summary.className = "vocab-summary lh-vocab-summary hidden";
      const summaryTitle = document.createElement("h4");
      const summaryText = document.createElement("p");
      const summaryFocus = document.createElement("ul");
      summaryFocus.className = "resource-list";
      const summaryRestart = document.createElement("button");
      summaryRestart.type = "button";
      summaryRestart.className = "flashcard-btn";
      summaryRestart.textContent = I18n.t("learning_vocab_restart_session");
      summary.appendChild(summaryTitle);
      summary.appendChild(summaryText);
      summary.appendChild(summaryFocus);
      summary.appendChild(summaryRestart);
      quizWrap.appendChild(summary);

      let quizScore = 0;
      let quizAnswered = false;
      let currentQuestion = null;
      let currentMode = "easy";
      let remainingQuestions = [];
      let askedCount = 0;
      let sessionRecorded = false;
      const wrongByTopic = {};

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

      function showSummary(totalCount) {
        quizQuestion.classList.add("hidden");
        quizOptions.classList.add("hidden");
        quizFeedback.classList.add("hidden");
        quizNext.classList.add("hidden");
        saveWordBtn.classList.add("hidden");
        summary.classList.remove("hidden");
        const pct = totalCount ? Math.round((quizScore / totalCount) * 100) : 0;
        summaryTitle.textContent = I18n.t("learning_vocab_summary_title", {
          score: String(quizScore),
          total: String(totalCount),
          pct: String(pct),
        });
        if (!sessionRecorded) {
          recordQuizSummary(level, currentMode, quizScore, totalCount);
          sessionRecorded = true;
        }
        summaryText.textContent = I18n.t("learning_vocab_summary_focus");
        summaryFocus.innerHTML = "";
        const ranked = Object.keys(wrongByTopic).sort(function (a, b) {
          return wrongByTopic[b] - wrongByTopic[a];
        });
        const focusTopics = ranked.slice(0, 3);
        if (!focusTopics.length) {
          const li = document.createElement("li");
          li.textContent = I18n.t("learning_vocab_summary_no_misses");
          summaryFocus.appendChild(li);
        } else {
          focusTopics.forEach(function (topic) {
            const li = document.createElement("li");
            li.textContent = I18n.t("learning_vocab_summary_miss", {
              topic: topic,
              misses: String(wrongByTopic[topic]),
            });
            summaryFocus.appendChild(li);
          });
        }
        refreshGamificationHeader();
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
        quizNext.disabled = true;
        const vLabel =
          activeVariant === "match"
            ? I18n.t("learning_vocab_variant_match_prompt")
            : activeVariant === "speed"
              ? I18n.t("learning_vocab_variant_speed_prompt")
              : "";
        quizQuestion.textContent =
          vLabel +
          I18n.t("learning_vocab_question_line", {
            n: String(askedCount),
            q: currentQuestion.question,
            mode: currentMode,
          });
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
            quizAnswered = true;
            const correct = opt === currentQuestion.answer;
            trackVocabAnswer(currentQuestion.topic, correct);
            if (correct) {
              quizScore += 1;
              btn.classList.add("is-correct");
              quizFeedback.textContent = I18n.t("learning_vocab_correct_feedback", {
                score: String(quizScore),
                round: String(askedCount),
              });
              bumpLearningActivity(5);
            } else {
              btn.classList.add("is-wrong");
              wrongByTopic[currentQuestion.topic] = (wrongByTopic[currentQuestion.topic] || 0) + 1;
              quizFeedback.textContent = I18n.t("learning_vocab_wrong_feedback", {
                answer: currentQuestion.answer,
                score: String(quizScore),
                round: String(askedCount),
              });
              bumpLearningActivity(1);
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
            refreshGamificationHeader();
          });
          quizOptions.appendChild(btn);
        });
      }

      function startQuiz(mode) {
        currentMode = mode;
        quizScore = 0;
        askedCount = 0;
        quizAnswered = false;
        sessionRecorded = false;
        Object.keys(wrongByTopic).forEach(function (key) {
          delete wrongByTopic[key];
        });
        remainingQuestions = questionsForMode(mode).slice();
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

      summaryRestart.addEventListener("click", function () {
        startQuiz(currentMode);
      });

      saveWordBtn.addEventListener("click", function () {
        saveWordBtn.classList.add("hidden");
      });

      vocabPanel.appendChild(vocShell);
      startQuiz("easy");
      refreshGamificationHeader();

      exercisesPanel.innerHTML = "";
      const exShell = document.createElement("div");
      exShell.className = "lh-ex";
      const exNav = document.createElement("div");
      exNav.className = "lh-ex__nav";
      const exMain = document.createElement("div");
      exMain.className = "lh-ex__main";
      exShell.appendChild(exNav);
      exShell.appendChild(exMain);
      exercisesPanel.appendChild(exShell);

      function parseGapLine(line) {
        if (!line || line.indexOf("___") < 0) return null;
        const arrow = line.lastIndexOf("->");
        if (arrow < 0) return null;
        const answer = line.slice(arrow + 2).trim();
        const head = line.slice(0, arrow).trim();
        const parts = head.split("___");
        if (parts.length < 2) return null;
        return { before: parts[0], after: parts.slice(1).join("___"), answer: answer };
      }

      let activeExIdx = 0;
      let exGapPool = [];
      let exGapStep = 0;
      let exGapScore = 0;
      let exGapAnswered = false;

      data.exercises.forEach(function (ex, i) {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "lh-ex-pill" + (i === 0 ? " is-active" : "");
        pill.textContent = ex.topic;
        pill.addEventListener("click", function () {
          activeExIdx = i;
          Array.from(exNav.querySelectorAll(".lh-ex-pill")).forEach(function (p) {
            p.classList.remove("is-active");
          });
          pill.classList.add("is-active");
          renderExerciseLesson(i);
        });
        exNav.appendChild(pill);
      });

      const exLesson = document.createElement("div");
      exLesson.className = "lh-ex-lesson";
      const exPlay = document.createElement("div");
      exPlay.className = "lh-ex-play";
      exMain.appendChild(exLesson);
      exMain.appendChild(exPlay);

      function renderExerciseLesson(idx) {
        const ex = data.exercises[idx];
        if (!ex) return;
        exLesson.innerHTML = "";
        exPlay.innerHTML = "";
        const card = document.createElement("article");
        card.className = "lh-lesson-card";
        const h = document.createElement("h3");
        h.className = "lh-lesson-card__title";
        h.textContent = ex.topic;
        card.appendChild(h);
        // Optional bilingual intro paragraph (uses introEn / introFr if present)
        if (ex.introEn || ex.introFr) {
          const intro = document.createElement("p");
          intro.className = "lh-lesson-intro";
          const lang = I18n.getLang();
          intro.textContent = lang === "fr" && ex.introFr ? ex.introFr : ex.introEn || ex.introFr || "";
          card.appendChild(intro);
        }
        const details = document.createElement("details");
        details.className = "lh-details";
        details.open = true;
        const sum = document.createElement("summary");
        sum.textContent = I18n.t("learning_exercise_examples_toggle");
        details.appendChild(sum);
        const exList = document.createElement("ul");
        exList.className = "resource-list lh-tight-list";
        ex.examples.forEach(function (line) {
          const li = document.createElement("li");
          li.textContent = line;
          exList.appendChild(li);
        });
        details.appendChild(exList);
        card.appendChild(details);
        const task = document.createElement("p");
        task.className = "lh-lesson-practice";
        task.textContent = I18n.t("learning_exercise_practice") + " " + ex.practice;
        card.appendChild(task);
        const ext = document.createElement("p");
        ext.className = "lh-muted";
        ext.textContent =
          I18n.t("learning_exercise_extension") +
          " " +
          (ex.extension || I18n.t("learning_exercise_extension_default"));
        card.appendChild(ext);
        const doneBtn = document.createElement("button");
        doneBtn.type = "button";
        doneBtn.className = "flashcard-btn lh-primary-btn";
        doneBtn.setAttribute("data-learning-chrome", "learning_exercise_done_btn");
        doneBtn.textContent = I18n.t("learning_exercise_done_btn");
        const doneMsg = document.createElement("p");
        doneMsg.className = "exercise-complete-msg hidden";
        doneBtn.addEventListener("click", function () {
          const res = recordExerciseCompletion(level, ex.topic);
          if (res.ok) {
            doneMsg.textContent = I18n.t("learning_exercise_saved_ok");
          } else if (res.reason === "auth") {
            doneMsg.textContent = I18n.t("learning_exercise_saved_auth");
          } else {
            doneMsg.textContent = I18n.t("learning_exercise_saved_exists");
          }
          doneMsg.classList.remove("hidden");
        });
        card.appendChild(doneBtn);
        card.appendChild(doneMsg);
        exLesson.appendChild(card);

        exGapPool = [];
        (ex.examples || []).forEach(function (line) {
          const g = parseGapLine(line);
          if (g) exGapPool.push(g);
        });
        exGapStep = 0;
        exGapScore = 0;
        exGapAnswered = false;
        if (!exGapPool.length) {
          const p = document.createElement("p");
          p.className = "lh-muted";
          p.textContent = I18n.t("learning_exercise_no_inline");
          exPlay.appendChild(p);
          return;
        }
        function renderGap() {
          exPlay.innerHTML = "";
          if (exGapStep >= 5 || exGapStep >= exGapPool.length) {
            const done = document.createElement("div");
            done.className = "lh-celebrate";
            done.textContent = I18n.t("learning_exercise_gap_complete", {
              score: String(exGapScore),
            });
            exPlay.appendChild(done);
            bumpLearningActivity(6 + exGapScore * 2);
            return;
          }
          const item = exGapPool[exGapStep % exGapPool.length];
          const q = document.createElement("p");
          q.className = "lh-gap-q";
          q.textContent = item.before + " _____ " + item.after;
          exPlay.appendChild(q);
          const opts = [item.answer];
          const seenAns = Object.create(null);
          seenAns[item.answer] = true;
          for (let gi = 0; gi < exGapPool.length * 2 && opts.length < 4; gi += 1) {
            const o = exGapPool[(exGapStep + 1 + gi) % exGapPool.length].answer;
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
          row.className = "lh-vocab-options";
          exGapAnswered = false;
          opts.forEach(function (o) {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "flashcard-btn lh-option-btn";
            b.textContent = o;
            b.addEventListener("click", function () {
              if (exGapAnswered) return;
              exGapAnswered = true;
              const ok = o === item.answer;
              if (ok) {
                b.classList.add("is-correct");
                exGapScore += 1;
                bumpLearningActivity(4);
              } else {
                b.classList.add("is-wrong");
                bumpLearningActivity(1);
              }
              setTimeout(function () {
                exGapStep += 1;
                renderGap();
              }, 420);
            });
            row.appendChild(b);
          });
          exPlay.appendChild(row);
        }
        renderGap();
      }
      renderExerciseLesson(0);

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
      const orderRow = document.createElement("div");
      orderRow.className = "flashcard-trainer__top-row";
      const orderLabel = document.createElement("label");
      orderLabel.setAttribute("for", "flashcard-order-" + level);
      orderLabel.textContent = I18n.t("flashcard_order_label");
      const orderSelect = document.createElement("select");
      orderSelect.id = "flashcard-order-" + level;
      orderSelect.className = "flashcard-topic flashcard-order-select";
      orderSelect.setAttribute("aria-label", I18n.t("flashcard_order_label"));
      const orderOptEn = document.createElement("option");
      orderOptEn.value = "en";
      orderOptEn.textContent = I18n.t("flashcard_order_en_option");
      const orderOptFr = document.createElement("option");
      orderOptFr.value = "fr";
      orderOptFr.textContent = I18n.t("flashcard_order_fr_option");
      orderSelect.appendChild(orderOptEn);
      orderSelect.appendChild(orderOptFr);
      orderSelect.value = readFlashcardFirstLang();
      orderSelect.addEventListener("change", function () {
        writeFlashcardFirstLang(orderSelect.value);
      });
      orderRow.appendChild(orderLabel);
      orderRow.appendChild(orderSelect);
      top.appendChild(deckRow);
      top.appendChild(orderRow);
      const deckCountHint = document.createElement("p");
      deckCountHint.className = "flashcard-deck-count";
      deckCountHint.setAttribute("aria-live", "polite");
      const sessionHint = document.createElement("p");
      sessionHint.className = "flashcard-session-hint";
      const flipBtn = document.createElement("button");
      flipBtn.type = "button";
      flipBtn.className = "flashcard";
      const front = document.createElement("span");
      front.className = "flashcard__side flashcard__front";
      const back = document.createElement("span");
      back.className = "flashcard__side flashcard__back";
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
      const score = document.createElement("span");
      score.className = "flashcard-progress";
      score.textContent = I18n.t("flashcard_score_label", { correct: "0", attempts: "0" });
      controls.appendChild(prevBtn);
      controls.appendChild(progress);
      controls.appendChild(nextBtn);
      controls.appendChild(againBtn);
      controls.appendChild(gotItBtn);
      controls.appendChild(score);
      const completeOverlay = document.createElement("div");
      completeOverlay.className = "flashcard-complete-overlay hidden";
      const completeInner = document.createElement("div");
      completeInner.className = "flashcard-complete-overlay__inner";
      const completeTitle = document.createElement("h4");
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
      completeInner.appendChild(completeSummary);
      completeInner.appendChild(completeActions);
      completeOverlay.appendChild(completeInner);
      stage.appendChild(top);
      stage.appendChild(deckCountHint);
      stage.appendChild(sessionHint);
      stage.appendChild(flipBtn);
      stage.appendChild(controls);
      stage.appendChild(completeOverlay);
      flashcardsPanel.appendChild(stage);

      const decks = data.flashcards;
      const topicNames = Object.keys(decks);
      let activeTopic = decks["Master 1000"] ? "Master 1000" : topicNames[0];
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
        return { level: level, topic: activeTopic };
      };

      function fullDeck() {
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
          renderCard();
          return;
        }
        sessionPos = 0;
        lastSessionWrongKeys = null;
        applySessionHintFromState();
        prevBtn.classList.add("hidden");
        nextBtn.classList.add("hidden");
        renderCard();
      }

      function finishSession() {
        if (sessionSummarySaved) return;
        sessionSummarySaved = true;
        const total = sessionIndices.length;
        const wrongCount = sessionWrong;
        const correctCount = sessionCorrect;
        lastSessionWrongKeys = {};
        Object.keys(wrongKeysThisSession).forEach(function (k) {
          lastSessionWrongKeys[k] = true;
        });
        lastCompleteStats = {
          correct: correctCount,
          wrong: wrongCount,
          total: total,
        };
        recordFlashcardSessionComplete({
          level: level,
          topic: activeTopic,
          correct: correctCount,
          wrong: wrongCount,
          total: total,
          mode: lastSessionMode,
        });
        completeTitle.textContent = I18n.t("flashcard_complete_title");
        completeSummary.textContent = I18n.t("flashcard_complete_summary", {
          correct: String(correctCount),
          wrong: String(wrongCount),
          total: String(total),
        });
        const wrongSetSize = Object.keys(lastSessionWrongKeys).length;
        btnWrongOnly.classList.toggle("hidden", wrongSetSize === 0);
        completeOverlay.classList.remove("hidden");
      }

      function updateDeckCountHint() {
        const n = (decks[activeTopic] || []).length;
        deckCountHint.textContent =
          n === 1 ? I18n.t("flashcard_deck_card_count_one") : I18n.t("flashcard_deck_card_count", { n: String(n) });
      }

      topicNames.forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        if (name === activeTopic) option.selected = true;
        topicSelect.appendChild(option);
      });
      updateDeckCountHint();

      function renderCard() {
        const deck = fullDeck();
        if (sessionIndices.length && sessionPos >= sessionIndices.length) {
          if (!sessionSummarySaved) finishSession();
          front.textContent = I18n.t("flashcard_session_done_face");
          back.textContent = I18n.t("flashcard_session_done_back");
          progress.textContent =
            String(sessionIndices.length) + " / " + String(sessionIndices.length);
          const attempts = sessionCorrect + sessionWrong;
          score.textContent = I18n.t("flashcard_score_label", {
            correct: String(sessionCorrect),
            attempts: String(attempts),
          });
          flipBtn.classList.remove("is-flipped");
          showingBack = false;
          return;
        }
        if (!deck.length) {
          front.textContent = I18n.t("flashcard_empty_deck");
          back.textContent = "";
          progress.textContent = "0 / 0";
          score.textContent = I18n.t("flashcard_score_label", { correct: "0", attempts: "0" });
          sessionHint.textContent = "";
          return;
        }
        if (!sessionIndices.length) {
          front.textContent = I18n.t("flashcard_pick_deck");
          back.textContent = "";
          progress.textContent = "0 / 0";
          score.textContent = I18n.t("flashcard_score_label", { correct: "0", attempts: "0" });
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
        const attempts = sessionCorrect + sessionWrong;
        score.textContent = I18n.t("flashcard_score_label", {
          correct: String(sessionCorrect),
          attempts: String(attempts),
        });
        flipBtn.classList.toggle("is-flipped", showingBack);
      }

      topicSelect.addEventListener("change", function () {
        activeTopic = topicSelect.value;
        updateDeckCountHint();
        startSession("full", null);
      });

      flipBtn.addEventListener("click", function () {
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
        if (!sessionIndices.length || sessionPos >= sessionIndices.length) return;
        if (!showingBack) showingBack = true;
        const deck = fullDeck();
        const idx = sessionIndices[sessionPos];
        const card = deck[idx];
        const key = flashcardCardKey(card);
        wrongKeysThisSession[key] = true;
        sessionWrong += 1;
        recordFlashcardResult(false, flashMeta());
        sessionPos += 1;
        showingBack = false;
        if (sessionPos >= sessionIndices.length) {
          renderCard();
        } else {
          renderCard();
        }
      });

      gotItBtn.addEventListener("click", function () {
        if (!sessionIndices.length || sessionPos >= sessionIndices.length) return;
        if (!showingBack) showingBack = true;
        sessionCorrect += 1;
        recordFlashcardResult(true, flashMeta());
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
        orderSelect.value = readFlashcardFirstLang();
        showingBack = false;
        renderCard();
      });

      learningToolsLangRefreshers.push(function () {
        quizTitle.textContent = I18n.t("learning_vocab_quiz_title");
        quizNext.textContent = I18n.t("learning_vocab_next");
        summaryRestart.textContent = I18n.t("learning_vocab_restart_session");
        Array.from(quizModeWrap.querySelectorAll("[data-mode]")).forEach(function (mb) {
          const mode = mb.getAttribute("data-mode");
          if (mode) mb.textContent = I18n.t("learning_vocab_mode_" + mode);
        });
        const allTopicPill = topicRow.querySelector('[data-lh-all-topic="1"]');
        if (allTopicPill) allTopicPill.textContent = I18n.t("learning_hub_topic_all");
        variantRow.querySelectorAll("[data-variant]").forEach(function (vb) {
          const vk = vb.getAttribute("data-variant");
          if (vk) vb.textContent = I18n.t("learning_vocab_variant_" + vk);
        });
        saveWordBtn.textContent = I18n.t("learning_vocab_save_word");
        const xpLab = xpBox.querySelector(".lh-chip__lab");
        const stLab = stBox.querySelector(".lh-chip__lab");
        if (xpLab) xpLab.textContent = I18n.t("learning_hub_xp");
        if (stLab) stLab.textContent = I18n.t("learning_hub_streak");
        root.querySelectorAll("[data-learning-chrome]").forEach(function (el) {
          const key = el.getAttribute("data-learning-chrome");
          if (key) el.textContent = I18n.t(key);
        });
        label.textContent = I18n.t("flashcard_deck_label");
        orderLabel.textContent = I18n.t("flashcard_order_label");
        orderSelect.setAttribute("aria-label", I18n.t("flashcard_order_label"));
        orderOptEn.textContent = I18n.t("flashcard_order_en_option");
        orderOptFr.textContent = I18n.t("flashcard_order_fr_option");
        updateDeckCountHint();
        prevBtn.textContent = I18n.t("flashcard_prev");
        nextBtn.textContent = I18n.t("flashcard_next");
        againBtn.textContent = I18n.t("flashcard_again");
        gotItBtn.textContent = I18n.t("flashcard_got_it");
        btnWrongOnly.textContent = I18n.t("flashcard_complete_wrong_only");
        btnFullAgain.textContent = I18n.t("flashcard_complete_full_again");
        applySessionHintFromState();
        if (!completeOverlay.classList.contains("hidden") && lastCompleteStats) {
          completeTitle.textContent = I18n.t("flashcard_complete_title");
          completeSummary.textContent = I18n.t("flashcard_complete_summary", {
            correct: String(lastCompleteStats.correct),
            wrong: String(lastCompleteStats.wrong),
            total: String(lastCompleteStats.total),
          });
        }
        if (!summary.classList.contains("hidden")) {
          const pct = askedCount ? Math.round((quizScore / askedCount) * 100) : 0;
          summaryTitle.textContent = I18n.t("learning_vocab_summary_title", {
            score: String(quizScore),
            total: String(askedCount),
            pct: String(pct),
          });
          summaryText.textContent = I18n.t("learning_vocab_summary_focus");
          summaryFocus.innerHTML = "";
          const ranked = Object.keys(wrongByTopic).sort(function (a, b) {
            return wrongByTopic[b] - wrongByTopic[a];
          });
          const focusTopics = ranked.slice(0, 3);
          if (!focusTopics.length) {
            const li = document.createElement("li");
            li.textContent = I18n.t("learning_vocab_summary_no_misses");
            summaryFocus.appendChild(li);
          } else {
            focusTopics.forEach(function (topic) {
              const li = document.createElement("li");
              li.textContent = I18n.t("learning_vocab_summary_miss", {
                topic: topic,
                misses: String(wrongByTopic[topic]),
              });
              summaryFocus.appendChild(li);
            });
          }
        }
        renderExerciseLesson(activeExIdx);
        renderHomeworkPanel();
        renderProgressPanel();
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
      studentName: (bookingStudentNameInput && bookingStudentNameInput.value.trim()) || "",
      name:
        ((bookingStudentNameInput && bookingStudentNameInput.value.trim()) || "") +
        " (" +
        (((bookingParentNameInput && bookingParentNameInput.value.trim()) || "") || "Parent") +
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
        bookingSuccessDetail.textContent = I18n.t("booking_success_cloud");
      } else if (isSupabaseConfigured()) {
        bookingSuccessDetail.textContent = I18n.t("booking_success_local_fallback");
      } else {
        bookingSuccessDetail.textContent = I18n.t("booking_success_small");
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

    setTimeout(() => {
      introOverlay.classList.add("is-done");
      app.classList.remove("hidden-until-intro");
      app.classList.add("intro-visible");
    }, INTRO_MS);
  })();
})();
