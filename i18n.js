/**
 * Site copy in English and French. When you add or change visible text:
 * add the same key under both `en` and `fr` in STRINGS below, then wire
 * the element with data-i18n / data-i18n-html in index.html (or use t() in app.js).
 */
(function (global) {
  const STORAGE_KEY = "andronicus_lang";
  const THEME_STORAGE_KEY = "andronicus_theme";

  const STRINGS = {
    en: {
      meta_title: "Andronicus · English Grinds",
      meta_description:
        "Online English grinds for French-speaking students. Small groups, weekly structure, progress checks. Louis McGovern, Trinity College Dublin.",
      lang_aria: "Language",
      lang_en: "English",
      lang_fr: "French",
      theme_aria: "Color theme",
      theme_light: "Light",
      theme_dark: "Dark",
      tagline: "Online English grinds for French-speaking students.",
      nav_main_aria: "Main sections",
      nav_about_label: "About the Teacher",
      nav_about_hint: "Louis McGovern, Trinity, and how I teach",
      nav_process_label: "The Process",
      nav_process_hint: "Chat, booking, then weekly classes",
      nav_content_label: "Content",
      nav_content_hint: "Materials by level (password)",
      nav_booking_label: "Booking",
      nav_booking_hint: "Send a time request",
      nav_booking_price: "€25 per session",
      home_free_banner_text:
        "Your first class is free — no commitment, no payment until you decide to continue.",
      hero_cta_book_now: "Book now",
      nav_account_label: "Student Account",
      nav_account_hint: "Optional login to track practice",
      btn_home: "← Back to home",
      skip_to_content: "Skip to content",
      hero_cta_book: "Book a lesson",
      why_section_title: "Why Choose Andronicus?",
      why_1_title: "Small Groups",
      why_1_body:
        "Maximum four students per class. That's small enough that you can't disappear, that every answer gets a response, and that the lesson can shift if a topic isn't landing. Big classes save money for the teacher; small classes work for the student.",
      why_2_title: "You Can See Progress",
      why_2_body:
        "Every student has a tracking page with real graphs, test results, and notes on class performance. You're not guessing whether you're improving — you can look. Parents see the same view, so there are no surprises at the end of the term.",
      why_3_title: "I'm a Student Too",
      why_3_body:
        "I'm at Trinity College Dublin right now, so I know what it's like to be inside the work, not above it. That changes how I teach — I remember exactly which bits felt hard, which explanations finally clicked, and how to find ten extra minutes when the week is already full.",
      home_trust_line: "Most students who start stay for the year. Message or call if you want to talk before booking.",
      faq_section_title: "Frequently Asked Questions",
      faq_q1: "Who are the lessons for?",
      faq_a1:
        "Mostly French-speaking students from collège through lycée and into early university — but anyone whose first language is French and who wants to improve their English is welcome. There are beginner, intermediate, and advanced tracks, and we'll place you sensibly once we talk.",
      faq_q2: "Where do lessons happen?",
      faq_a2:
        "Lessons are online in small groups. After we agree a slot, I send the join link and what you need. I will be on Zoom Plus so I can use premium features: that helps keep things reliable and simple for students every time they join.",
      faq_q3: "How does booking work?",
      faq_a3:
        "You send times that suit you. That is only a request until I reply by email or message with a definite slot.",
      faq_q4: "What level do I need?",
      faq_a4:
        "Beginner, intermediate, or advanced tracks. If you are not sure, say so in the form and I will place you sensibly.",
      faq_q5: "How will I know my booking is confirmed?",
      faq_a5:
        "I confirm every booking personally by email or message — usually within 24 hours. Until you've heard back from me with a confirmed time slot, your booking is a request, not a confirmation. That way nothing gets double-booked and you always know where you stand.",
      faq_q6: "What do I need for a lesson?",
      faq_a6:
        "Somewhere you can focus, decent Wi-Fi, and the Zoom link I send. Pen and paper help. Headphones help if it is noisy at home.",
      contact_section_title: "Rather Talk First?",
      contact_section_html:
        "Call or email and we can sort level and timing in a few minutes. <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      about_title: "About the Teacher",
      about_p1_html:
        "My name is <strong>Louis McGovern</strong>. I am <strong>21</strong> and I study <strong>Business and French</strong> at <strong>Trinity College Dublin</strong> — widely ranked as Ireland's top university.",
      about_p2_html:
        "In my Leaving Certificate I was awarded an <strong>H1</strong> — the highest possible grade — in Higher-Level French.",
      about_p3_html:
        "I have travelled a lot in France: I've been in the <strong>Pyrenees</strong> and the <strong>Alps</strong>, stayed in <strong>Le Mans</strong> for two months and <strong>Laval</strong> for a month, visited <strong>Paris</strong> many times, and taught in <strong>Nantes</strong>. Next year I will spend a year in <strong>Strasbourg</strong> on <strong>Erasmus</strong>.",
      about_p4_html:
        "I taught English to children through <strong>Living Language</strong>. I have taught <strong>sailing</strong> for the past four years and I work with young people in other teaching settings too.",
      about_p5_html:
        "To get in touch: <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      process_title: "The Process",
      process_steps_intro: "Talk → book → join each week.",
      process_step_1_title: "Get in touch",
      process_step_1_html:
        "<div class=\"step-card__stack\"><p>Call, text, or email — same number for texts.</p><p>Optional 10-minute chat first.</p></div><div class=\"step-card__links\"><a href=\"tel:+353833198980\">+353 (83) 319 8980</a><span class=\"step-card__dot\" aria-hidden=\"true\">·</span><a href=\"mailto:louis.f.mcgovern@gmail.com\">Email</a></div>",
      process_step_2_title: "Booking",
      process_step_2_html:
        "<div class=\"step-card__stack\"><p>Open Booking — menu or button below.</p><p><strong>Choose your English level and the times that work for you</strong>, then send. I confirm by message.</p></div>",
      process_step_3_title: "Pay and come to grinds",
      process_step_3_html:
        "<div class=\"step-card__stack\"><p><strong>Slot confirmed</strong> — pay at the start of each month.</p><p>Join every week on Zoom: one hour, small group.</p></div>",
      process_btn_booking: "Open booking form",
      process_actions_hint: "Same form as in the main menu.",
      process_extra_heading: "Fees, Homework, and How It Works",
      process_p1_html:
        "Each class is <strong>one hour</strong>. It costs <strong>€25 per student per session</strong>. There are <strong>at most four students</strong>, so everyone can speak and get feedback.",
      process_p2_html:
        "I track how each student moves forward with simple <strong>progress graphs</strong>, plus short tests and how you join in during class.",
      process_p3_html:
        "Grammar is steady and explicit. We also use <strong>debates</strong>, <strong>homework</strong>, and suggestions for <strong>films, series, and music</strong> so English feels lived-in, not only like a workbook.",
      process_zoom_plus_html:
        "I will be using <strong>Zoom Plus</strong> so I can access premium features: that supports a more reliable connection and a simpler join flow for students each week.",
      process_p4_html:
        "Classes run on <strong>Zoom</strong> in small groups. If anything is unclear after our chat, you can always message me before you use the booking form.",
      process_p5_html:
        "<strong>Contact:</strong> <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      content_intro:
        "Choose your level. Content is uploaded by English level, and the password is required each time. If you would like access, <strong>contact me</strong> and we can arrange a <strong>10-minute chat</strong>.",
      content_levels_aria: "English level",
      level_beginner: "Beginner",
      level_intermediate: "Intermediate",
      level_advanced: "Advanced",
      btn_level_desc_beginner:
        "A1 to A2 — core vocabulary, everyday grammar, and short practice tasks.",
      btn_level_desc_intermediate:
        "B1 — stronger grammar, wider vocabulary, and longer written tasks.",
      btn_level_desc_advanced:
        "B2 and above — nuanced grammar, academic vocabulary, and exam-style practice.",
      level_landing_grid_aria: "Choose activity",
      content_breadcrumb_aria: "Content location",
      home_testimonials_heading: "What students and parents say",
      testimonials_heading: "What students and parents say",
      testimonial_label: "Testimonial",
      testimonial_attr_1: "Parent of a Beginner student",
      testimonial_attr_2: "Intermediate student, Lycée, Paris",
      testimonial_1_quote:
        "Louis explains things the way a student thinks, not the way a textbook is written. My daughter went from dreading English class to actually enjoying it.",
      testimonial_1_attr: "Parent of a Beginner student",
      testimonial_2_quote:
        "The small group format means you can't hide. You actually have to speak, and that's what made the difference for my exam.",
      testimonial_2_attr: "Intermediate student, Lycée, Paris",
      teacher_caption_1: "Louis McGovern — studying Business and French at Trinity College Dublin.",
      teacher_caption_2:
        "Teaching approach: structured sessions, real conversation, and consistent feedback.",
      content_password_title: "Enter Password",
      content_password_intro: "Enter the password your teacher gave you.",
      content_password_close_aria: "Cancel and return to levels",
      content_password_label: "Password",
      content_password_submit: "Continue",
      content_password_error: "Incorrect password.",
      content_back_levels: "← Back to levels",
      content_close_aria: "Close and return to levels",
      content_opening: "Opening {level} material.",
      article_beginner_intro_html:
        "Focus on high-frequency vocabulary, present simple and continuous, basic questions, and everyday situations (greetings, school, hobbies). Short dialogues, picture prompts, and repetition build confidence before longer texts.",
      article_beginner_li1_html:
        "<strong>Grammar:</strong> be/have, articles, there is/are, word order in questions.",
      article_beginner_li2_html:
        "<strong>Skills:</strong> listening to slow, clear audio; reading short paragraphs; speaking in structured pairs.",
      article_beginner_li3_html:
        "<strong>Homework:</strong> vocabulary lists with spaced review; short diary sentences in English.",
      article_intermediate_intro_html:
        "Expand tense range (past, present perfect, conditionals), linking words, and paragraph writing. Topics include travel, media, and short opinion texts with room to debate without losing clarity.",
      article_intermediate_li1_html:
        "<strong>Grammar:</strong> reported speech, passive voice, relative clauses, comparatives.",
      article_intermediate_li2_html:
        "<strong>Skills:</strong> summarising articles; mini-debates; writing emails and short essays.",
      article_intermediate_li3_html:
        "<strong>Media:</strong> one episode per week of a graded series or podcast with a short reflection.",
      article_advanced_intro_html:
        "Refine nuance, register, and cohesion. We analyse essays, speeches, and journalism. You learn to argue clearly and edit your own writing for tone. Strong preparation for exams and university English.",
      article_advanced_li1_html:
        "<strong>Grammar &amp; style:</strong> inversion, cleft sentences, hedging, formal vs informal vocabulary.",
      article_advanced_li2_html:
        "<strong>Skills:</strong> timed essays; abstract discussion; reformulation and paraphrase under pressure.",
      article_advanced_li3_html:
        "<strong>Extension:</strong> long-form reading (non-fiction or literary extracts) with vocabulary journals.",
      booking_title: "Booking",
      booking_intro_html:
        "Classes start in <strong>September 2026</strong> and run <strong>each week</strong> through the school year, with <strong>homework</strong> when it helps. There are breaks around holidays (for example <strong>Christmas</strong>) and I tell everyone the dates in advance. Pick every hour you can honestly make each week: it makes grouping easier. The usual slot should work most weeks, but real life happens. Pay at the <strong>start of the month</strong>. Miss a class with fair warning (ideally when you pay, or at least <strong>three days before</strong>) and you are not charged for that hour.",
      booking_parent_name_label: "Parent name",
      booking_student_name_label: "Student name",
      booking_phone_label: "Phone (for my reply)",
      booking_level_label: "English level",
      booking_level_help: "Roughly where the student is now: beginner, intermediate, or advanced.",
      booking_parent_name_ph: "Parent full name",
      booking_student_name_ph: "Student full name",
      booking_phone_ph: "Mobile, with country code if not Ireland",
      booking_request_note_html:
        "<strong>This form is only a request.</strong> Your place is fixed once I have answered you by email or message.",
      booking_price_callout:
        "Each session is €25 per student. Maximum four students per class. Your first session is free.",
      booking_level_empty: "Select level",
      booking_level_unknown: "I do not know yet",
      booking_slots_legend: "Preferred times (France · Paris time)",
      booking_slots_hint:
        "Hours are in France (Paris) local time. Pick a weekday, then tap the hours that work. Add other days if you need. I confirm by email.",
      booking_times_unknown_label: "I do not know yet",
      booking_pick_day: "1 · Choose a day",
      booking_times_for: "Times for {day}",
      booking_hours_hint: "Tap hours to add or remove them for this day.",
      booking_selected_label: "Your selected slots",
      booking_no_slots: "None yet. Choose a day and times above.",
      booking_remove_aria: "Remove {slot}",
      booking_err_no_slots: "Please choose at least one time slot.",
      booking_err_missing_fields_intro: "Please complete: {fields}.",
      booking_missing_parent_name: "Parent name",
      booking_missing_student_name: "Student name",
      booking_missing_phone: "Phone",
      booking_missing_level: "English level",
      booking_missing_times: "Preferred times (or choose 'I do not know yet')",
      booking_level_unknown_badge: "I do not know yet",
      booking_submit: "Send request",
      booking_success_heading: "Request received",
      booking_success_main:
        "Louis will contact you within 24 hours by email or WhatsApp to confirm your slot. Your first class is free — no payment until confirmed.",
      booking_success_followup_html:
        'If you have not heard back within 24 hours, call <a href="tel:+353833198980">+353 (83) 319 8980</a>.',
      booking_success_p1:
        "Thanks, I have your request. I will email or message you to confirm a slot and what happens next.",
      booking_success_small:
        "The site is not connected to the server from here. Please email me so I still receive your request.",
      booking_success_cloud:
        "Your request reached me online. I will email or message you to confirm the slot.",
      booking_success_local_fallback:
        "The server was unreachable, so this device saved a copy only. Please email or text me as well so I see it.",
      booking_success_confirm_note_html:
        "<strong>Still a request until I reply.</strong> Check your inbox or phone for my confirmation.",
      booking_error_submit:
        "Nothing was saved online. Try again in a minute, or phone or email me and we will book manually.",
      booking_error_submit_partial:
        "Your booking was saved on this device only because the server was unavailable. Please also email or call me so I receive it.",
      footer_line: "Andronicus · English grinds",
      footer_contact_html:
        "<a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      account_title: "Your Account",
      account_intro: "For students who want to track exercises and quiz progress on this device.",
      account_register_heading: "Create account",
      account_login_heading: "Log in",
      account_label_fullname: "Full name",
      account_label_username: "Account name",
      account_label_password: "Password",
      account_label_password_confirm: "Confirm password",
      account_password_show: "Show password",
      account_password_hide: "Hide password",
      account_err_password_mismatch: "Password and confirmation do not match.",
      account_forgot_link: "Forgot password?",
      account_forgot_heading: "Forgot your password?",
      account_forgot_body_html:
        "Accounts are stored on this site only (not emailed). If you cannot remember your password, contact Louis and he can reset it from the admin panel after you tell him your account name. <a href=\"mailto:louis.f.mcgovern@gmail.com\">Email</a> · <a href=\"tel:+353833198980\">+353 (83) 319 8980</a>",
      account_forgot_close_btn: "Close",
      account_btn_register: "Create account",
      account_btn_login: "Log in",
      account_btn_logout: "Log out",
      account_completed_heading: "Completed exercises",
      account_err_register_fields: "Please enter account name, full name, and password.",
      account_err_register_exists: "That account name is already taken.",
      account_err_login: "Invalid account name or password.",
      account_ok_register: "Account created successfully.",
      account_ok_login: "Logged in.",
      account_welcome_logged_in: "Logged in as: {user}",
      account_onboarding_welcome: "Welcome, {name}!",
      account_onboarding_start_en:
        "Head to Content → Beginner to start with flashcards, vocabulary, or grammar exercises.",
      account_onboarding_start_fr:
        "Va dans Contenu → Débutant pour commencer avec les flashcards, le vocabulaire ou la grammaire.",
      account_onboarding_btn: "Go to Beginner content",
      account_onboarding_dismiss: "Dismiss welcome",
      account_continue_heading: "Continue where you left off",
      account_continue_btn: "Go to {level}",
      account_no_exercises_done: "No exercises marked completed yet.",
      admin_title: "Site Admin",
      admin_banner_note: "For the site owner only. Students do not need this page.",
      admin_login_heading: "Admin login",
      admin_password_label: "Admin password",
      admin_login_btn: "Open dashboard",
      admin_login_fail: "Incorrect admin password.",
      admin_controls_title: "Admin Controls",
      admin_logout_btn: "Close admin",
      admin_refresh_cloud: "Refresh cloud data",
      admin_tab_bookings: "Bookings",
      admin_tab_progress: "Student progress",
      admin_tab_payments: "Payments",
      admin_bookings_heading: "Class bookings",
      admin_progress_heading: "Student progress",
      admin_payments_heading: "Parent payment checklist",
      admin_col_name: "Name",
      admin_col_phone: "Phone",
      admin_col_level: "Level",
      admin_col_slots: "Slots",
      admin_col_booked: "Booked at",
      admin_col_actions: "Actions",
      admin_col_username: "Username",
      admin_col_flashcards: "Flashcards",
      admin_col_quiz: "Quiz sessions",
      admin_col_done: "Completed exercises",
      admin_payment_name_label: "Parent or student name",
      admin_payment_owed_label: "Amount owed (EUR)",
      admin_payment_owed_short: "Owes",
      admin_payment_add_btn: "Add to checklist",
      admin_edit_name: "Edit name",
      admin_reset_password: "Reset password",
      admin_booking_remove: "Remove",
      admin_payment_remove: "Remove",
      admin_booking_remove_confirm: "Remove booking for {name}?",
      admin_cloud_syncing: "Syncing with cloud…",
      admin_cloud_ok:
        "Cloud on: bookings and payments load from Supabase on every device.",
      admin_cloud_fail_prefix:
        "Cloud sync failed. Showing data stored on this device. Check config and Supabase.",
      admin_cloud_no_secret:
        "Bookings go online, but adminApiSecret is missing in config. Admin lists stay on this device until you add it.",
      admin_corner_aria: "Open site admin",
      admin_student_view: "Profile & stats",
      admin_student_back: "Back to student list",
      admin_student_detail_title: "Progress: {name}",
      admin_student_detail_username: "Account: {user}",
      admin_student_flash_overall: "Flashcards (all decks)",
      admin_student_lifetime_accuracy: "Lifetime accuracy (Got it vs saved for later)",
      admin_student_by_deck: "Accuracy by deck",
      admin_student_no_deck_stats: "No per-deck data yet — practice flashcards while logged in.",
      admin_student_flash_sessions: "Recent flashcard sessions",
      admin_student_no_sessions: "No completed flashcard sessions yet.",
      admin_student_session_chart_hint:
        "Bars show score for each finished session (1 = oldest on this chart). Hover a bar for deck name.",
      admin_student_mode_wrong_retry: "saved-for-later pass",
      admin_student_quiz_title: "Vocab quiz activity",
      admin_student_no_quiz_log: "No quiz sessions recorded yet.",
      admin_student_quiz_best: "Best score by mode",
      admin_student_exercises: "Completed exercises",
      flashcard_deck_label: "Vocabulary category",
      flashcard_prev: "Previous",
      flashcard_next: "Next",
      flashcard_again: "Save for later",
      flashcard_got_it: "Got it",
      flashcard_score_label: "Score: {correct}/{attempts}",
      flashcard_live_score: "{correct} correct out of {total}",
      flashcard_session_progress: "{n} of {total} cards",
      flashcard_session_sample_hint:
        "This session practises {n} random cards from {total} in this deck. Use Got it or Save for later for each.",
      flashcard_session_full_hint: "This session runs through all {n} cards once. Use Got it or Save for later for each.",
      flashcard_empty_deck: "No cards in this deck.",
      flashcard_pick_deck: "Choose another category above.",
      flashcard_session_done_face: "Session complete",
      flashcard_session_done_back: "Pick an option in the summary box, or choose another category.",
      flashcard_complete_title: "Deck session complete",
      flashcard_complete_summary:
        "You answered {correct} correctly and saved {wrong} cards for later (out of {total}).",
      flashcard_complete_wrong_only: "Study cards saved for later",
      flashcard_complete_full_again: "Whole category again",
      flashcard_complete_close: "Close",
      flashcard_side_english: "English — ",
      flashcard_side_french: "French — ",
      flashcard_order_label: "Show first",
      flashcard_order_en_option: "English (front)",
      flashcard_order_fr_option: "French (front)",
      flashcard_lang_toggle_to_fr: "French first",
      flashcard_lang_toggle_to_en: "English first",
      flashcard_deck_card_count: "{n} cards in this deck",
      flashcard_deck_card_count_one: "1 card in this deck",
      flashcard_full_deck_name: "Full deck",
      flashcard_saved_deck_name: "Saved cards",
      flashcard_saved_empty: "No saved cards. Use the bookmark on any card to save it here.",
      flashcard_remove_saved: "Remove from saved",
      flashcard_bookmark_add: "Save card",
      flashcard_bookmark_remove: "Remove saved card",
      learning_tab_flashcards: "Flashcards",
      learning_tab_vocab: "Vocabulary",
      learning_tab_grammar: "Grammar",
      learning_tab_homework: "Homework",
      learning_hub_home: "← Choose activity",
      learning_level_desc_beginner:
        "Core vocabulary, everyday grammar, and short practice tasks to build confidence step by step.",
      learning_level_desc_intermediate:
        "Stronger grammar, wider vocabulary, and longer tasks for students who already handle everyday English.",
      learning_level_desc_advanced:
        "Nuanced grammar, academic vocabulary, and exam-style practice for confident, precise English.",
      learning_landing_flashcards: "Practice words with flip cards",
      learning_landing_vocab: "Quiz yourself on grammar and topics",
      learning_landing_grammar: "Interactive exercises with instant feedback",
      learning_landing_homework: "Your task list and progress checklist",
      learning_landing_progress: "Your streak and activity",
      learning_landing_grammar_progress: "{n} of {t} topics done",
      learning_landing_homework_progress: "{n} of {t} tasks done",
      learning_landing_flashcards_progress: "{n} sessions completed",
      learning_landing_vocab_progress: "{n} quiz sessions",
      learning_back_to_menu: "← Back to menu",
      learning_tab_progress: "Progress",
      learning_progress_no_user:
        "Log in under Account to track your progress and activity on this device.",
      learning_progress_stat_grammar_label: "Grammar",
      learning_progress_stat_grammar: "{n} of {t} topics done",
      learning_progress_stat_homework_label: "Homework",
      learning_progress_stat_homework: "{n} of {t} tasks done",
      learning_progress_streak: "Day streak",
      learning_progress_flash_accuracy: "Flashcard accuracy",
      learning_progress_week_activity: "Last 7 days",
      learning_progress_homework_title: "Homework",
      learning_progress_grammar_title: "Grammar topics",
      learning_progress_tasks_caption: "{n} of {t} tasks completed",
      learning_progress_grammar_summary: "{n} of {t} grammar topics completed",
      learning_progress_grammar_all_done:
        "Well done — you have completed every grammar topic!",
      learning_progress_plan: "Upcoming class plan",
      learning_homework_today: "Today",
      learning_homework_upcoming: "In progress",
      learning_homework_done: "Completed",
      learning_homework_tasks_count: "{n} tasks",
      learning_homework_empty: "Nothing here yet.",
      learning_homework_week_hint: "Bars combine flashcard sessions and vocab quizzes.",
      learning_homework_checklist_title: "Homework checklist",
      learning_homework_checklist_intro: "Work through these across the year. Your teacher will tell you which to do for each class — tick them off when you're done.",
      learning_homework_checklist_progress: "{n} of {t} completed",
      learning_homework_overall_progress: "{n} / {t} tasks completed ({pct}%)",
      learning_homework_checklist_signin: "Sign in to save your progress.",
      learning_hub_streak: "Streak",
      learning_hub_topic_all: "All topics",
      learning_vocab_variant_mc: "Multiple choice",
      learning_vocab_variant_match: "Match",
      learning_vocab_variant_speed: "Speed",
      learning_vocab_variant_match_prompt: "Tap the word that fits the blank.",
      learning_vocab_variant_speed_prompt: "Quick mode — same challenge, faster pace.",
      learning_vocab_save_word: "Save this word",
      learning_vocab_filter_show: "Filter by topic",
      learning_vocab_filter_hide: "Hide filters",
      learning_exercise_topic_fallback: "Grammar and practice for {topic}.",
      learning_ex_back: "← Back to topics",
      learning_ex_learn: "Learn",
      learning_ex_examples: "Examples",
      learning_ex_practice: "Practice",
      learning_ex_mark_done: "I finished the practice task",
      learning_ex_undo_done: "Mark as not done",
      learning_topic_start_here: "Start here",
      learning_topics_completed_sep: "Completed",
      learning_topics_back: "← Back to topics",
      learning_topics_what_learn: "What you will learn",
      learning_topics_content: "Lesson content",
      learning_topics_key_vocab: "Key vocabulary",
      learning_topics_no_vocab: "No matching flashcard deck yet. Use the Flashcards tab to study words.",
      learning_topics_tasks: "Your tasks",
      learning_exercise_examples_toggle: "Examples & model answers",
      learning_exercise_no_inline:
        "No inline gap-fill lines in this topic yet. Use the practice text above.",
      learning_exercise_gap_complete: "Great work! You scored {score} out of {total}.",
      learning_vocab_quiz_title: "Vocab challenge (fill in the blank)",
      learning_vocab_question_counter: "Question {current} of {total}",
      learning_vocab_next: "Next question",
      learning_vocab_restart_session: "Restart session",
      learning_vocab_mode_easy: "Easy",
      learning_vocab_mode_medium: "Medium",
      learning_vocab_mode_hard: "Hard",
      learning_vocab_summary_title: "Session summary: {score}/{total} ({pct}%)",
      learning_vocab_summary_focus: "Great work. Focus next on these topics:",
      learning_vocab_summary_no_misses: "No weak topics this round — excellent consistency.",
      learning_vocab_summary_miss: "{topic} ({misses} misses)",
      learning_vocab_results_score: "{score} / {total} correct",
      learning_vocab_results_msg_excellent: "Excellent work — keep it up!",
      learning_vocab_results_msg_good: "Good effort — you're making progress!",
      learning_vocab_results_msg_review: "Review the flashcards and try again — you've got this!",
      learning_vocab_results_retry: "Try again",
      learning_vocab_results_level_up: "Next level up",
      learning_vocab_question_line: "Q{n}: {q} [{mode}]",
      learning_vocab_choose_prompt: "Score: {score}/{round} | Choose an option to continue.",
      learning_vocab_correct_feedback: "Correct. Score: {score}/{round}",
      learning_vocab_wrong_feedback: "Not quite. Correct answer: {answer} | Score: {score}/{round}",
      learning_vocab_challenge_line: "Challenge: {task} Complete this in 8 minutes.",
      learning_vocab_challenge_btn: "Give me a random challenge",
      learning_vocab_done_btn: "Mark vocab topic completed",
      learning_exercise_topic_label: "Exercise topic",
      learning_exercise_practice: "Practice task:",
      learning_exercise_extension: "Extension:",
      learning_exercise_homework: "Homework:",
      learning_exercise_extension_default: "Create 5 extra original examples.",
      learning_exercise_homework_default: "Submit your final answers before next class.",
      learning_exercise_done_btn: "Mark this exercise as completed",
      learning_exercise_saved_ok: "Saved to your account progress.",
      learning_exercise_saved_auth: "Log in in the Account section to track completion.",
      learning_exercise_saved_exists: "Already marked as completed.",
      learning_schedule_title: "Your upcoming class plan",
      slot_day_mon: "Mon",
      slot_day_tue: "Tue",
      slot_day_wed: "Wed",
      slot_day_thu: "Thu",
      slot_day_fri: "Fri",
      slot_day_sat: "Sat",
      slot_day_sun: "Sun",
      learning_progress_not_applicable: "N/A",
      learning_bilingual_en: "EN",
      learning_bilingual_fr: "FR",
      learning_ex_example_progress: "{current} of {total}",
      learning_gap_correct: "Correct!",
      learning_gap_incorrect: "Incorrect. The correct answer is: {answer}",
      learning_gap_retry_intro: "Good effort. Now let's go over the ones you missed.",
      learning_gap_score_line: "Question {current} of {total} — Score: {correct}/{answered}",
      learning_gap_complete_score: "{correct} out of {total} on the first try",
      learning_gap_complete_excellent: "Excellent work!",
      learning_gap_complete_good: "Good effort — keep going!",
      learning_gap_complete_review: "Review the lesson and try again!",
      learning_gap_restart: "Start again",
      learning_gap_continue: "Continue",
      learning_ex_practice_congrats: "Congratulations! You completed the practice task.",
      learning_exercise_intro_en_fallback:
        "This lesson covers {topic}. Read the explanation in both languages, work through each example, then complete the practice task in your notebook.",
      learning_exercise_intro_fr_fallback:
        "Cette leçon porte sur {topic}. Lis l'explication dans les deux langues, fais tous les exemples, puis termine la tâche d'entraînement dans ton cahier.",
      learning_hw_cat_vocab: "Vocab",
      learning_hw_cat_reading: "Reading",
      learning_hw_cat_grammar: "Grammar",
      learning_hw_cat_writing: "Writing",
      learning_hw_cat_listening: "Listening",
      learning_hw_cat_speaking: "Speaking",
      admin_payment_paid_badge: " (paid)",
      admin_payment_unpaid_badge: " (not paid)",
      admin_table_empty: "—",
      admin_edit_name_prompt: "Update full name for {user}",
      admin_reset_password_prompt: "Set new password for {user}",
      booking_parent_fallback: "Parent",
      ui_remove_symbol: "×",
      booking_hour_format: "{hour}:00",
      account_metric_flash_accuracy: "Flashcard accuracy: {correct}/{attempts} ({pct})",
      account_metric_quiz_sessions: "Quiz sessions completed: {n}",
      account_metric_exercises_done: "Completed exercises: {n}",
      account_metric_quiz_best: "Best {mode}: {pct}%",
    },
    fr: {
      meta_title: "Andronicus · Cours d’anglais",
      meta_description:
        "Cours d’anglais en ligne pour élèves francophones. Petits groupes, cadre clair, suivi des progrès. Louis McGovern, Trinity College Dublin.",
      lang_aria: "Langue",
      lang_en: "Anglais",
      lang_fr: "Français",
      theme_aria: "Thème d’affichage",
      theme_light: "Clair",
      theme_dark: "Sombre",
      tagline: "Cours d’anglais en ligne pour élèves francophones.",
      nav_main_aria: "Sections principales",
      nav_about_label: "À propos du professeur",
      nav_about_hint: "Louis McGovern, Trinity, et ma façon d’enseigner",
      nav_process_label: "Le déroulement des cours",
      nav_process_hint: "Échange, inscription, cours chaque semaine",
      nav_content_label: "Contenu",
      nav_content_hint: "Supports par niveau (mot de passe)",
      nav_booking_label: "Inscription",
      nav_booking_hint: "Envoyer une demande de créneau",
      nav_booking_price: "25 € par séance",
      home_free_banner_text:
        "Ton premier cours est gratuit — sans engagement, et aucun paiement tant que tu n'as pas décidé de continuer.",
      hero_cta_book_now: "Réserver",
      nav_account_label: "Compte élève",
      nav_account_hint: "Connexion facultative pour suivre le travail",
      btn_home: "← Retour à l’accueil",
      skip_to_content: "Aller au contenu",
      hero_cta_book: "Réserver un cours",
      why_section_title: "Pourquoi choisir Andronicus ?",
      why_1_title: "Petits groupes",
      why_1_body:
        "Quatre étudiants maximum par classe. C'est assez petit pour qu'on ne puisse pas s'effacer, pour que chaque réponse reçoive une réaction, et pour que le cours puisse s'adapter si un sujet ne passe pas. Les grandes classes font gagner du temps à l'enseignant ; les petites classes font progresser l'étudiant.",
      why_2_title: "Des progrès visibles",
      why_2_body:
        "Chaque étudiant dispose d'une page de suivi avec de vrais graphiques, des résultats de tests, et des notes sur la participation en classe. Pas besoin de deviner si vous progressez — il suffit de regarder. Les parents voient la même page, donc aucune surprise à la fin du trimestre.",
      why_3_title: "Je suis aussi étudiant",
      why_3_body:
        "Je suis actuellement étudiant à Trinity College Dublin, donc je sais ce que c'est que d'être dans le travail, pas au-dessus. Cela change ma façon d'enseigner — je me souviens précisément des passages qui m'ont paru difficiles, des explications qui ont fini par déclencher quelque chose, et de la manière de trouver dix minutes supplémentaires quand la semaine est déjà chargée.",
      home_trust_line: "La plupart des élèves qui commencent restent l’année. Écrivez ou appelez si vous voulez en parler avant de réserver.",
      faq_section_title: "Questions fréquentes",
      faq_q1: "À qui s’adressent les cours ?",
      faq_a1:
        "Principalement des élèves francophones, du collège au lycée et jusqu'au début des études supérieures — mais toute personne dont la langue maternelle est le français et qui souhaite progresser en anglais est la bienvenue. Il existe des parcours débutant, intermédiaire et avancé, et nous vous placerons correctement après en avoir discuté.",
      faq_q2: "Où ont lieu les cours ?",
      faq_a2:
        "Les cours sont en ligne, en petits groupes. Une fois le créneau convenu, j’envoie le lien de connexion et le nécessaire. Je passerai à Zoom Plus pour accéder aux fonctions premium : cela renforce la fiabilité et simplifie la connexion pour les élèves à chaque cours.",
      faq_q3: "Comment fonctionne l’inscription ?",
      faq_a3:
        "Vous proposez des horaires possibles. Tant que je ne vous ai pas répondu, ce n’est qu’une demande, pas une place garantie.",
      faq_q4: "Quel niveau il faut ?",
      faq_a4:
        "Parcours débutant, intermédiaire ou avancé. Si vous doutez, écrivez-le dans le formulaire et je vous oriente.",
      faq_q5: "Comment saurai-je que ma réservation est confirmée ?",
      faq_a5:
        "Je confirme chaque réservation personnellement par email ou message — généralement sous 24 heures. Tant que vous n'avez pas reçu une confirmation avec un créneau précis, votre réservation est une demande, pas une confirmation. Ainsi, rien n'est doublement réservé et vous savez toujours où vous en êtes.",
      faq_q6: "De quoi j’ai besoin pour le cours ?",
      faq_a6:
        "Un endroit où vous pouvez vous concentrer, une connexion correcte, et le lien Zoom que j’envoie. Papier-crayon utile, casque utile si c’est bruyant chez vous.",
      contact_section_title: "Envie d’en parler avant ?",
      contact_section_html:
        "Appelez ou écrivez, on règle souvent niveau et créneau en quelques minutes. <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      about_title: "À propos du professeur",
      about_p1_html:
        "Je m’appelle <strong>Louis McGovern</strong>, j’ai <strong>21 ans</strong>, et je fais <strong>commerce et français</strong> à <strong>Trinity College Dublin</strong>, souvent classée comme la meilleure université d’Irlande dans les grands classements.",
      about_p2_html:
        "Au Leaving Certificate j’ai obtenu un <strong>H1</strong>, la note la plus élevée, en français niveau supérieur.",
      about_p3_html:
        "Je connais bien la France sur le terrain : <strong>Pyrénées</strong> et <strong>Alpes</strong>, deux mois au <strong>Mans</strong>, un mois à <strong>Laval</strong>, <strong>Paris</strong> très souvent, et j’ai enseigné à <strong>Nantes</strong>. L’année prochaine je passe une année à <strong>Strasbourg</strong> en <strong>Erasmus</strong>.",
      about_p4_html:
        "J’ai enseigné l’anglais à des enfants avec <strong>Living Language</strong>. J’enseigne la <strong>voile</strong> depuis quatre ans et je travaille souvent avec des jeunes dans d’autres contextes.",
      about_p5_html:
        "Pour me joindre : <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      process_title: "Le déroulement des cours",
      process_steps_intro: "On en parle → inscription → cours chaque semaine.",
      process_step_1_title: "Me contacter",
      process_step_1_html:
        "<div class=\"step-card__stack\"><p>Appel, SMS ou mail — le même numéro pour les SMS.</p><p>Échange de dix minutes si vous le souhaitez.</p></div><div class=\"step-card__links\"><a href=\"tel:+353833198980\">+353 (83) 319 8980</a><span class=\"step-card__dot\" aria-hidden=\"true\">·</span><a href=\"mailto:louis.f.mcgovern@gmail.com\">E-mail</a></div>",
      process_step_2_title: "Inscription",
      process_step_2_html:
        "<div class=\"step-card__stack\"><p>Ouvrir Inscription — menu ou bouton ci-dessous.</p><p><strong>Choisissez votre niveau d’anglais et les horaires qui vous conviennent</strong>, puis envoyez. Je confirme.</p></div>",
      process_step_3_title: "Payer et venir aux cours",
      process_step_3_html:
        "<div class=\"step-card__stack\"><p><strong>Créneau confirmé</strong> — paiement en début de mois.</p><p>Cours chaque semaine sur Zoom : 1 h, petit groupe.</p></div>",
      process_btn_booking: "Ouvrir le formulaire d’inscription",
      process_actions_hint: "Même formulaire que dans le menu.",
      process_extra_heading: "Tarif, devoirs, et comment ça fonctionne",
      process_p1_html:
        "Chaque séance dure <strong>une heure</strong>. C’est <strong>25 € par élève et par cours</strong>. Il y a <strong>au plus quatre élèves</strong>, pour que chacun puisse prendre la parole et recevoir des retours.",
      process_p2_html:
        "Je suis la progression avec des <strong>graphiques simples</strong>, des petits contrôles, et la façon dont vous participez en cours.",
      process_p3_html:
        "La grammaire est expliquée méthodiquement. On ajoute des <strong>débats</strong>, des <strong>devoirs</strong>, et des idées de <strong>films, séries ou musique</strong> pour que l’anglais sonne comme une langue vivante, pas seulement comme un manuel.",
      process_zoom_plus_html:
        "J’adopterai <strong>Zoom Plus</strong> pour accéder aux fonctions premium : une connexion plus fiable et une invitation plus simple pour les élèves chaque semaine.",
      process_p4_html:
        "Les cours ont lieu sur <strong>Zoom</strong> en petits groupes. Si quelque chose n’est pas clair après notre échange, vous pouvez m’écrire avant de remplir le formulaire d’inscription.",
      process_p5_html:
        "<strong>Contact :</strong> <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>.",
      content_intro:
        "Choisissez votre niveau. Le contenu est publié selon le niveau d’anglais, et le mot de passe est demandé à chaque fois. Pour obtenir l’accès, <strong>contactez-moi</strong> et nous pourrons organiser un <strong>échange de dix minutes</strong>.",
      content_levels_aria: "Niveau d’anglais",
      level_beginner: "Débutant",
      level_intermediate: "Intermédiaire",
      level_advanced: "Avancé",
      btn_level_desc_beginner:
        "A1 à A2 — vocabulaire de base, grammaire du quotidien et exercices courts.",
      btn_level_desc_intermediate:
        "B1 — grammaire plus solide, vocabulaire élargi et tâches écrites plus longues.",
      btn_level_desc_advanced:
        "B2 et plus — grammaire nuancée, vocabulaire académique et pratique type examen.",
      level_landing_grid_aria: "Choisir une activité",
      content_breadcrumb_aria: "Emplacement dans le contenu",
      home_testimonials_heading: "Ce qu'en disent élèves et parents",
      testimonials_heading: "Ce qu'en disent élèves et parents",
      testimonial_label: "Témoignage",
      testimonial_attr_1: "Parent d'un élève débutant",
      testimonial_attr_2: "Intermediate student, Lycée, Paris",
      testimonial_1_quote:
        "Louis explique comme pense un élève, pas comme est rédigé un manuel. Ma fille est passée de la crainte du cours d'anglais au plaisir d'y aller.",
      testimonial_1_attr: "Parent d'une élève débutante",
      testimonial_2_quote:
        "Le petit groupe ne laisse pas place à la passivité. Il faut vraiment parler — c'est ce qui a fait la différence pour mon examen.",
      testimonial_2_attr: "Élève de niveau intermédiaire, lycée, Paris",
      teacher_caption_1: "Louis McGovern — étudiant en commerce et en français à Trinity College Dublin.",
      teacher_caption_2:
        "Ma façon d'enseigner : des séances structurées, de vraies conversations et des retours réguliers.",
      content_password_title: "Saisir le mot de passe",
      content_password_intro: "Entrez le mot de passe que votre professeur vous a donné.",
      content_password_close_aria: "Annuler et revenir au choix des niveaux",
      content_password_label: "Mot de passe",
      content_password_submit: "Continuer",
      content_password_error: "Mot de passe incorrect.",
      content_back_levels: "← Retour aux niveaux",
      content_close_aria: "Fermer et revenir aux niveaux",
      content_opening: "Ouverture du contenu {level}.",
      article_beginner_intro_html:
        "Acquisition du vocabulaire fréquent, présent simple et continu, questions de base et situations quotidiennes (salutations, école, loisirs). Courts dialogues, images-éclair et répétition pour prendre confiance avant des textes plus longs.",
      article_beginner_li1_html:
        "<strong>Grammaire :</strong> be/have, articles, there is/are, ordre des mots dans les questions.",
      article_beginner_li2_html:
        "<strong>Compétences :</strong> écoute d’audio lent et clair ; lecture de courts paragraphes ; expression à deux structurée.",
      article_beginner_li3_html:
        "<strong>Devoirs :</strong> listes de vocabulaire avec révision espacée ; courtes phrases de journal en anglais.",
      article_intermediate_intro_html:
        "Élargir les temps (passé, present perfect, conditionnelles), les connecteurs et la rédaction de paragraphes. Thèmes : voyage, médias, textes d’opinion, avec assez de matière pour débattre sans se perdre.",
      article_intermediate_li1_html:
        "<strong>Grammaire :</strong> discours rapporté, voix passive, propositions relatives, comparatifs.",
      article_intermediate_li2_html:
        "<strong>Compétences :</strong> résumer des articles ; mini-débats ; e-mails et courtes dissertations.",
      article_intermediate_li3_html:
        "<strong>Médias :</strong> un épisode par semaine d’une série ou d’un podcast adapté, avec un court compte rendu.",
      article_advanced_intro_html:
        "Affiner la nuance, le registre et la cohésion. On lit dissertations, discours et articles ; vous apprenez à argumenter net et à réécrire vos textes. Solide pour les examens et l’anglais à l’université.",
      article_advanced_li1_html:
        "<strong>Grammaire &amp; style :</strong> inversion, phrases clivées, atténuation, vocabulaire formel vs familier.",
      article_advanced_li2_html:
        "<strong>Compétences :</strong> dissertations chronométrées ; discussion abstraite ; reformulation sous pression.",
      article_advanced_li3_html:
        "<strong>Approfondissement :</strong> lecture longue (non-fiction ou extraits littéraires) et carnets de vocabulaire.",
      booking_title: "Inscription",
      booking_intro_html:
        "Les cours commencent en <strong>septembre 2026</strong>, <strong>une séance par semaine</strong> pendant l’année scolaire, avec des <strong>devoirs</strong> quand ça aide. Il y a des pauses aux vacances (par exemple à <strong>Noël</strong>) et je préviens tout le monde des dates. Cochez toutes les plages où vous êtes vraiment libres : ça simplifie les groupes. Le créneau habituel doit marcher la plupart du temps, mais la vie arrive. Paiement en <strong>début de mois</strong>. Si vous ne pouvez pas venir, prévenez (idéalement au paiement, ou au moins <strong>trois jours avant</strong>) et ce cours n’est pas facturé.",
      booking_parent_name_label: "Nom du parent",
      booking_student_name_label: "Nom de l’élève",
      booking_phone_label: "Téléphone (pour ma réponse)",
      booking_level_label: "Niveau d’anglais",
      booking_level_help: "Où l’élève en est à peu près : débutant, intermédiaire, ou avancé.",
      booking_parent_name_ph: "Nom complet du parent",
      booking_student_name_ph: "Nom complet de l’élève",
      booking_phone_ph: "Portable, indicatif si hors d’Irlande",
      booking_request_note_html:
        "<strong>Ce formulaire ne fait qu’une demande.</strong> La place est sûre seulement quand je vous ai répondu par mail ou message.",
      booking_price_callout:
        "Chaque séance coûte 25 € par élève. Quatre élèves maximum par cours. La première séance est gratuite.",
      booking_level_empty: "Choisir un niveau",
      booking_level_unknown: "Je ne sais pas encore",
      booking_slots_legend: "Créneaux souhaités (heure de Paris)",
      booking_slots_hint:
        "Les heures sont en heure locale de Paris. Choisissez un jour, puis les créneaux qui vous vont. Ajoutez d’autres jours si besoin. Je confirme par mail.",
      booking_times_unknown_label: "Je ne sais pas encore",
      booking_pick_day: "1 · Choisir un jour",
      booking_times_for: "Créneaux pour {day}",
      booking_hours_hint: "Touchez une heure pour l’ajouter ou la retirer pour ce jour.",
      booking_selected_label: "Créneaux sélectionnés",
      booking_no_slots: "Aucun pour l’instant. Choisissez un jour et des heures ci-dessus.",
      booking_remove_aria: "Retirer {slot}",
      booking_err_no_slots: "Veuillez choisir au moins un créneau.",
      booking_err_missing_fields_intro: "Merci de compléter : {fields}.",
      booking_missing_parent_name: "Nom du parent",
      booking_missing_student_name: "Nom de l’élève",
      booking_missing_phone: "Téléphone",
      booking_missing_level: "Niveau d’anglais",
      booking_missing_times: "Créneaux souhaités (ou 'Je ne sais pas encore')",
      booking_level_unknown_badge: "Je ne sais pas encore",
      booking_submit: "Envoyer la demande",
      booking_success_heading: "Demande envoyée",
      booking_success_main:
        "Louis vous contactera dans les 24 heures par email ou WhatsApp pour confirmer votre créneau. Votre premier cours est gratuit — aucun paiement avant confirmation.",
      booking_success_followup_html:
        'Si vous n\'avez pas de nouvelles dans 24 heures, appelez le <a href="tel:+353833198980">+353 (83) 319 8980</a>.',
      booking_success_p1:
        "Merci, j’ai bien reçu votre demande. Je vous écris ou vous envoie un message pour confirmer un créneau et la suite.",
      booking_success_small:
        "Ici le site n’atteint pas le serveur. Écrivez-moi pour que je reçoive quand même votre demande.",
      booking_success_cloud:
        "Votre demande est bien arrivée en ligne. Je vous réponds pour confirmer le créneau.",
      booking_success_local_fallback:
        "Le serveur ne répondait pas, donc une copie est restée sur cet appareil. Écrivez-moi aussi pour être sûr que je la voie.",
      booking_success_confirm_note_html:
        "<strong>Tant que je n’ai pas répondu, ce n’est pas confirmé.</strong> Surveillez vos mails ou messages.",
      booking_error_submit:
        "Rien n’a été enregistré en ligne. Réessayez dans une minute, ou appelez ou écrivez et on fera l’inscription à la main.",
      booking_error_submit_partial:
        "La demande n’a été enregistrée que sur cet appareil car le serveur était indisponible. Écrivez-moi aussi par e-mail ou téléphone pour que je la reçoive.",
      footer_line: "Andronicus · Cours d’anglais",
      footer_contact_html:
        "<a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      account_title: "Votre compte",
      account_intro: "Pour les élèves qui souhaitent suivre leurs exercices et quiz sur cet appareil.",
      account_register_heading: "Créer un compte",
      account_login_heading: "Connexion",
      account_label_fullname: "Nom complet",
      account_label_username: "Nom du compte",
      account_label_password: "Mot de passe",
      account_label_password_confirm: "Confirmer le mot de passe",
      account_password_show: "Afficher le mot de passe",
      account_password_hide: "Masquer le mot de passe",
      account_err_password_mismatch: "Le mot de passe et la confirmation ne correspondent pas.",
      account_forgot_link: "Mot de passe oublié ?",
      account_forgot_heading: "Mot de passe oublié ?",
      account_forgot_body_html:
        "Les comptes sont enregistrés sur ce site seulement (pas par e-mail). Si tu as oublié ton mot de passe, contacte Louis : il peut le réinitialiser depuis l’admin quand tu lui donnes ton nom de compte. <a href=\"mailto:louis.f.mcgovern@gmail.com\">E-mail</a> · <a href=\"tel:+353833198980\">+353 (83) 319 8980</a>",
      account_forgot_close_btn: "Fermer",
      account_btn_register: "Créer le compte",
      account_btn_login: "Se connecter",
      account_btn_logout: "Se déconnecter",
      account_completed_heading: "Exercices terminés",
      account_err_register_fields: "Veuillez indiquer le nom du compte, le nom complet et le mot de passe.",
      account_err_register_exists: "Ce nom de compte est déjà utilisé.",
      account_err_login: "Nom de compte ou mot de passe incorrect.",
      account_ok_register: "Compte créé avec succès.",
      account_ok_login: "Vous êtes connecté(e).",
      account_welcome_logged_in: "Connecté(e) en tant que : {user}",
      account_onboarding_welcome: "Bienvenue, {name} !",
      account_onboarding_start_en:
        "Head to Content → Beginner to start with flashcards, vocabulary, or grammar exercises.",
      account_onboarding_start_fr:
        "Va dans Contenu → Débutant pour commencer avec les flashcards, le vocabulaire ou la grammaire.",
      account_onboarding_btn: "Aller au contenu Débutant",
      account_onboarding_dismiss: "Fermer le message de bienvenue",
      account_continue_heading: "Reprendre où tu en étais",
      account_continue_btn: "Aller à {level}",
      account_no_exercises_done: "Aucun exercice marqué comme terminé pour l’instant.",
      admin_title: "Administration du site",
      admin_banner_note: "Réservé au propriétaire du site. Les élèves n’en ont pas besoin.",
      admin_login_heading: "Connexion administrateur",
      admin_password_label: "Mot de passe administrateur",
      admin_login_btn: "Ouvrir le tableau de bord",
      admin_login_fail: "Mot de passe administrateur incorrect.",
      admin_controls_title: "Contrôles admin",
      admin_logout_btn: "Fermer l’admin",
      admin_refresh_cloud: "Actualiser les données en ligne",
      admin_tab_bookings: "Réservations",
      admin_tab_progress: "Progression des élèves",
      admin_tab_payments: "Paiements",
      admin_bookings_heading: "Demandes de cours",
      admin_progress_heading: "Progression des élèves",
      admin_payments_heading: "Liste de suivi des paiements (parents)",
      admin_col_name: "Nom",
      admin_col_phone: "Téléphone",
      admin_col_level: "Niveau",
      admin_col_slots: "Créneaux",
      admin_col_booked: "Date de la demande",
      admin_col_actions: "Actions",
      admin_col_username: "Identifiant",
      admin_col_flashcards: "Cartes mémoire",
      admin_col_quiz: "Sessions quiz",
      admin_col_done: "Exercices faits",
      admin_payment_name_label: "Nom du parent ou de l’élève",
      admin_payment_owed_label: "Montant dû (EUR)",
      admin_payment_owed_short: "Dû",
      admin_payment_add_btn: "Ajouter à la liste",
      admin_edit_name: "Modifier le nom",
      admin_reset_password: "Réinitialiser le mot de passe",
      admin_booking_remove: "Retirer",
      admin_payment_remove: "Retirer",
      admin_booking_remove_confirm: "Retirer la réservation de {name} ?",
      admin_cloud_syncing: "Synchronisation…",
      admin_cloud_ok:
        "Nuage actif : réservations et paiements viennent de Supabase partout.",
      admin_cloud_fail_prefix:
        "Échec de synchro. Affichage des données sur cet appareil. Vérifiez la config et Supabase.",
      admin_cloud_no_secret:
        "Les réservations partent en ligne, mais adminApiSecret manque dans la config. Les listes admin restent ici tant que ce n’est pas corrigé.",
      admin_corner_aria: "Ouvrir l’administration du site",
      admin_student_view: "Profil et stats",
      admin_student_back: "Retour à la liste",
      admin_student_detail_title: "Progrès : {name}",
      admin_student_detail_username: "Compte : {user}",
      admin_student_flash_overall: "Cartes mémoire (tous thèmes)",
      admin_student_lifetime_accuracy: "Précision globale (OK vs gardé pour plus tard)",
      admin_student_by_deck: "Précision par thème",
      admin_student_no_deck_stats:
        "Pas encore de stats par thème — connecte-toi et entraîne les cartes.",
      admin_student_flash_sessions: "Sessions récentes (cartes)",
      admin_student_no_sessions: "Aucune session terminée pour l’instant.",
      admin_student_session_chart_hint:
        "Chaque barre = score d’une session (1 = la plus ancienne ici). Survol pour le nom du paquet.",
      admin_student_mode_wrong_retry: "cartes gardées pour plus tard",
      admin_student_quiz_title: "Quiz vocabulaire",
      admin_student_no_quiz_log: "Aucun quiz enregistré pour l’instant.",
      admin_student_quiz_best: "Meilleur score par mode",
      admin_student_exercises: "Exercices complétés",
      flashcard_deck_label: "Thème de vocabulaire",
      flashcard_prev: "Précédent",
      flashcard_next: "Suivant",
      flashcard_again: "Garder pour plus tard",
      flashcard_got_it: "OK",
      flashcard_score_label: "Score : {correct}/{attempts}",
      flashcard_live_score: "{correct} bonnes réponses sur {total}",
      flashcard_session_progress: "{n} sur {total} cartes",
      flashcard_session_sample_hint:
        "Cette session mélange {n} cartes au hasard sur {total}. Utilise OK ou « Garder pour plus tard » pour chaque carte.",
      flashcard_session_full_hint:
        "Cette session parcourt les {n} cartes une fois. Utilise OK ou « Garder pour plus tard » pour chaque carte.",
      flashcard_empty_deck: "Aucune carte dans ce paquet.",
      flashcard_pick_deck: "Choisis un autre thème ci-dessus.",
      flashcard_session_done_face: "Session terminée",
      flashcard_session_done_back:
        "Choisis une option dans le résumé, ou change de thème.",
      flashcard_complete_title: "Session terminée",
      flashcard_complete_summary:
        "Tu as {correct} bonnes réponses et {wrong} cartes gardées pour plus tard sur {total}.",
      flashcard_complete_wrong_only: "Revoir les cartes gardées pour plus tard",
      flashcard_complete_full_again: "Tout le thème encore",
      flashcard_complete_close: "Fermer",
      flashcard_side_english: "Anglais — ",
      flashcard_side_french: "Français — ",
      flashcard_order_label: "Afficher d’abord",
      flashcard_order_en_option: "Anglais (face avant)",
      flashcard_order_fr_option: "Français (face avant)",
      flashcard_lang_toggle_to_fr: "FR d'abord",
      flashcard_lang_toggle_to_en: "EN d'abord",
      flashcard_deck_card_count: "{n} cartes dans ce paquet",
      flashcard_deck_card_count_one: "1 carte dans ce paquet",
      flashcard_full_deck_name: "Paquet complet",
      flashcard_saved_deck_name: "Cartes enregistrées",
      flashcard_saved_empty:
        "Aucune carte sauvegardée. Utilise le signet sur une carte pour la sauvegarder ici.",
      flashcard_remove_saved: "Retirer des sauvegardés",
      flashcard_bookmark_add: "Enregistrer la carte",
      flashcard_bookmark_remove: "Retirer la carte enregistrée",
      learning_tab_flashcards: "Cartes mémoire",
      learning_tab_vocab: "Vocabulaire",
      learning_tab_grammar: "Grammaire",
      learning_tab_homework: "Devoirs",
      learning_hub_home: "← Choisir une activité",
      learning_level_desc_beginner:
        "Vocabulaire de base, grammaire du quotidien et exercices courts pour progresser pas à pas.",
      learning_level_desc_intermediate:
        "Grammaire plus solide, vocabulaire élargi et tâches plus longues si tu maîtrises déjà l'anglais courant.",
      learning_level_desc_advanced:
        "Grammaire nuancée, vocabulaire académique et pratique type examen pour un anglais précis et assuré.",
      learning_landing_flashcards: "Entraîne-toi avec des cartes à retourner",
      learning_landing_vocab: "Teste-toi sur la grammaire et les thèmes",
      learning_landing_grammar: "Exercices interactifs avec retour immédiat",
      learning_landing_homework: "Ta liste de tâches et ta checklist de progrès",
      learning_landing_progress: "Ta série et ton activité",
      learning_landing_grammar_progress: "{n} sur {t} thèmes terminés",
      learning_landing_homework_progress: "{n} sur {t} tâches terminées",
      learning_landing_flashcards_progress: "{n} sessions terminées",
      learning_landing_vocab_progress: "{n} sessions de quiz",
      learning_back_to_menu: "← Retour au menu",
      learning_tab_progress: "Progrès",
      learning_progress_no_user:
        "Connecte-toi dans Compte pour suivre ta progression et ton activité sur cet appareil.",
      learning_progress_stat_grammar_label: "Grammaire",
      learning_progress_stat_grammar: "{n} sur {t} thèmes terminés",
      learning_progress_stat_homework_label: "Devoirs",
      learning_progress_stat_homework: "{n} sur {t} tâches terminées",
      learning_progress_streak: "Série (jours)",
      learning_progress_flash_accuracy: "Précision (cartes)",
      learning_progress_week_activity: "7 derniers jours",
      learning_progress_homework_title: "Devoirs",
      learning_progress_grammar_title: "Thèmes de grammaire",
      learning_progress_tasks_caption: "{n} sur {t} tâches terminées",
      learning_progress_grammar_summary: "{n} sur {t} thèmes de grammaire terminés",
      learning_progress_grammar_all_done:
        "Bravo ! Tu as terminé tous les thèmes de grammaire !",
      learning_progress_plan: "Planning des cours",
      learning_homework_today: "Aujourd’hui",
      learning_homework_upcoming: "En cours",
      learning_homework_done: "Terminé",
      learning_homework_tasks_count: "{n} tâches",
      learning_homework_empty: "Rien pour l’instant.",
      learning_homework_week_hint: "Les barres combinent cartes et quiz vocabulaire.",
      learning_homework_checklist_title: "Liste de devoirs",
      learning_homework_checklist_intro: "Avance dans cette liste au fil de l'année. Ton professeur te dira lesquels faire pour chaque cours — coche-les quand c'est terminé.",
      learning_homework_checklist_progress: "{n} sur {t} terminés",
      learning_homework_overall_progress: "{n} / {t} tâches terminées ({pct}%)",
      learning_homework_checklist_signin: "Connecte-toi pour enregistrer ta progression.",
      learning_hub_streak: "Série",
      learning_hub_topic_all: "Tous les thèmes",
      learning_vocab_variant_mc: "QCM",
      learning_vocab_variant_match: "Association",
      learning_vocab_variant_speed: "Rapide",
      learning_vocab_variant_match_prompt: "Choisis le mot qui complète la phrase.",
      learning_vocab_variant_speed_prompt: "Mode rapide — même défi, rythme soutenu.",
      learning_vocab_save_word: "Garder ce mot",
      learning_vocab_filter_show: "Filtrer par thème",
      learning_vocab_filter_hide: "Masquer les filtres",
      learning_exercise_topic_fallback: "Grammaire et pratique : {topic}.",
      learning_ex_back: "← Retour aux thèmes",
      learning_ex_learn: "Apprendre",
      learning_ex_examples: "Exemples",
      learning_ex_practice: "Entraînement",
      learning_ex_mark_done: "J'ai terminé la tâche",
      learning_ex_undo_done: "Marquer comme non fait",
      learning_topic_start_here: "Commence ici",
      learning_topics_completed_sep: "Terminés",
      learning_topics_back: "← Retour aux thèmes",
      learning_topics_what_learn: "Ce que vous allez apprendre",
      learning_topics_content: "Contenu de la leçon",
      learning_topics_key_vocab: "Vocabulaire clé",
      learning_topics_no_vocab:
        "Pas encore de paquet de cartes correspondant. Utilise l'onglet Cartes mémoire.",
      learning_topics_tasks: "Tes tâches",
      learning_exercise_examples_toggle: "Exemples & modèles",
      learning_exercise_no_inline:
        "Pas encore de phrases à trous intégrées pour ce thème. Utilise le texte d’exercice ci-dessus.",
      learning_exercise_gap_complete: "Bravo ! Tu as {score} bonnes réponses sur {total}.",
      learning_vocab_quiz_title: "Quiz vocabulaire (texte à trous)",
      learning_vocab_question_counter: "Question {current} sur {total}",
      learning_vocab_next: "Question suivante",
      learning_vocab_restart_session: "Recommencer la session",
      learning_vocab_mode_easy: "Facile",
      learning_vocab_mode_medium: "Moyen",
      learning_vocab_mode_hard: "Difficile",
      learning_vocab_summary_title: "Résumé de session : {score}/{total} ({pct}%)",
      learning_vocab_summary_focus: "Bravo. Concentre-toi ensuite sur ces thèmes :",
      learning_vocab_summary_no_misses: "Aucun thème faible cette fois — très régulier.",
      learning_vocab_summary_miss: "{topic} ({misses} erreurs)",
      learning_vocab_results_score: "{score} / {total} bonnes réponses",
      learning_vocab_results_msg_excellent: "Excellent travail, continue comme ça !",
      learning_vocab_results_msg_good: "Bon effort, tu progresses bien !",
      learning_vocab_results_msg_review: "Revois les flashcards et réessaie, tu vas y arriver !",
      learning_vocab_results_retry: "Réessayer",
      learning_vocab_results_level_up: "Niveau supérieur",
      learning_vocab_question_line: "Q{n} : {q} [{mode}]",
      learning_vocab_choose_prompt: "Score : {score}/{round} | Choisis une réponse pour continuer.",
      learning_vocab_correct_feedback: "Correct. Score : {score}/{round}",
      learning_vocab_wrong_feedback: "Pas tout à fait. Bonne réponse : {answer} | Score : {score}/{round}",
      learning_vocab_challenge_line: "Défi : {task} Fais-le en 8 minutes.",
      learning_vocab_challenge_btn: "Donne-moi un défi au hasard",
      learning_vocab_done_btn: "Marquer ce thème vocabulaire comme fait",
      learning_exercise_topic_label: "Thème de l’exercice",
      learning_exercise_practice: "Tâche :",
      learning_exercise_extension: "Approfondissement :",
      learning_exercise_homework: "Devoirs :",
      learning_exercise_extension_default: "Crée 5 exemples supplémentaires originaux.",
      learning_exercise_homework_default: "Envoie tes réponses finales avant le prochain cours.",
      learning_exercise_done_btn: "Marquer cet exercice comme fait",
      learning_exercise_saved_ok: "Enregistré dans ta progression sur le compte.",
      learning_exercise_saved_auth: "Connecte-toi dans la section Compte pour suivre la progression.",
      learning_exercise_saved_exists: "Déjà marqué comme fait.",
      learning_schedule_title: "Ton planning de cours à venir",
      slot_day_mon: "Lun",
      slot_day_tue: "Mar",
      slot_day_wed: "Mer",
      slot_day_thu: "Jeu",
      slot_day_fri: "Ven",
      slot_day_sat: "Sam",
      slot_day_sun: "Dim",
      learning_progress_not_applicable: "N/D",
      learning_bilingual_en: "EN",
      learning_bilingual_fr: "FR",
      learning_ex_example_progress: "{current} sur {total}",
      learning_gap_correct: "Correct !",
      learning_gap_incorrect: "Incorrect. La bonne réponse est : {answer}",
      learning_gap_retry_intro: "Bon effort. On reprend les questions que tu as ratées.",
      learning_gap_score_line: "Question {current} sur {total} — Score : {correct}/{answered}",
      learning_gap_complete_score: "{correct} sur {total} au premier passage",
      learning_gap_complete_excellent: "Excellent travail !",
      learning_gap_complete_good: "Bon effort, continue !",
      learning_gap_complete_review: "Revois la leçon et réessaie !",
      learning_gap_restart: "Recommencer",
      learning_gap_continue: "Continuer",
      learning_ex_practice_congrats: "Félicitations ! Tu as terminé la tâche d'entraînement.",
      learning_exercise_intro_en_fallback:
        "This lesson covers {topic}. Read the explanation in both languages, work through each example, then complete the practice task in your notebook.",
      learning_exercise_intro_fr_fallback:
        "Cette leçon porte sur {topic}. Lis l'explication dans les deux langues, fais tous les exemples, puis termine la tâche d'entraînement dans ton cahier.",
      learning_hw_cat_vocab: "Vocabulaire",
      learning_hw_cat_reading: "Lecture",
      learning_hw_cat_grammar: "Grammaire",
      learning_hw_cat_writing: "Écriture",
      learning_hw_cat_listening: "Écoute",
      learning_hw_cat_speaking: "Oral",
      admin_payment_paid_badge: " (payé)",
      admin_payment_unpaid_badge: " (non payé)",
      admin_table_empty: "—",
      admin_edit_name_prompt: "Modifier le nom complet de {user}",
      admin_reset_password_prompt: "Définir un nouveau mot de passe pour {user}",
      booking_parent_fallback: "Parent",
      ui_remove_symbol: "×",
      booking_hour_format: "{hour} h",
      account_metric_flash_accuracy: "Précision cartes : {correct}/{attempts} ({pct})",
      account_metric_quiz_sessions: "Sessions de quiz : {n}",
      account_metric_exercises_done: "Exercices terminés : {n}",
      account_metric_quiz_best: "Meilleur score {mode} : {pct} %",
    },
  };

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "fr";
    } catch (e) {
      return "fr";
    }
  }

  function setLang(lang) {
    const next = lang === "fr" ? "fr" : "en";
    if (next === getLang()) return;
    localStorage.setItem(STORAGE_KEY, next);
    apply();
    global.dispatchEvent(new CustomEvent("andronicus:langchange"));
  }

  function t(key, vars) {
    const L = getLang();
    let s = STRINGS[L][key];
    if (s == null) s = STRINGS.en[key];
    if (s == null) return key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }

  function apply() {
    const L = getLang();
    document.documentElement.lang = L === "fr" ? "fr" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (key && STRINGS[L][key] != null) {
        el.textContent = STRINGS[L][key];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-html");
      if (key && STRINGS[L][key] != null) {
        el.innerHTML = STRINGS[L][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && STRINGS[L][key] != null) {
        el.setAttribute("placeholder", STRINGS[L][key]);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-aria");
      if (key && STRINGS[L][key] != null) {
        el.setAttribute("aria-label", STRINGS[L][key]);
      }
    });

    document.title = STRINGS[L].meta_title || STRINGS.en.meta_title;

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", STRINGS[L].meta_description || STRINGS.en.meta_description || "");
    }

    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      const isFr = btn.getAttribute("data-lang") === "fr";
      const active = (isFr && L === "fr") || (!isFr && L === "en");
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    syncThemeToggle();

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-title");
      if (key && STRINGS[L][key] != null) {
        el.setAttribute("title", STRINGS[L][key]);
      }
    });

    var footerBrand = document.querySelector(".site-footer__brand");
    if (footerBrand) {
      footerBrand.textContent = STRINGS[L].footer_line || STRINGS.en.footer_line;
    }
    var footerContact = document.querySelector(".site-footer__contact");
    if (footerContact) {
      footerContact.innerHTML = STRINGS[L].footer_contact_html || STRINGS.en.footer_contact_html;
    }
  }

  function initLangSwitch(root) {
    var r = root || document;
    r.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function syncThemeToggle() {
    var t = getTheme();
    document.querySelectorAll(".theme-switch__btn").forEach(function (btn) {
      var v = btn.getAttribute("data-theme-value");
      var active = v === t;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setTheme(theme) {
    var next = theme === "dark" ? "dark" : "light";
    if (next === getTheme()) return;
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) {}
    syncThemeToggle();
  }

  function initThemeSwitch(root) {
    var r = root || document;
    r.querySelectorAll(".theme-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTheme(btn.getAttribute("data-theme-value"));
      });
    });
    syncThemeToggle();
  }

  global.AndronicusI18n = {
    getLang: getLang,
    setLang: setLang,
    getTheme: getTheme,
    setTheme: setTheme,
    t: t,
    apply: apply,
    initLangSwitch: initLangSwitch,
    initThemeSwitch: initThemeSwitch,
  };
})(window);
