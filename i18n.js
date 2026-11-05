/**
 * Site copy in English and French. When you add or change visible text:
 * add the same key under both `en` and `fr` in STRINGS below, then wire
 * the element with data-i18n / data-i18n-html in index.html (or use t() in app.js).
 */
(function (global) {
  const STORAGE_KEY = "andronicus_lang_v2";
  const THEME_STORAGE_KEY = "andronicus_theme";

  const STRINGS = {
    en: {
      meta_title: "Andronicus · English Grinds",
      meta_description:
        "One-to-one online English grinds for French-speaking students. Weekly structure, progress checks. Louis McGovern, Trinity College Dublin.",
      lang_aria: "Language",
      lang_en: "English",
      lang_fr: "French",
      theme_aria: "Color theme",
      theme_light: "Light",
      theme_dark: "Dark",
      tagline: "Online English grinds for French-speaking students.",
      hero_kicker: "ENGLISH GRINDS · DUBLIN · ONLINE",
      footer_tagline: "ANDRONICUS · ENGLISH GRINDS FOR FRENCH-SPEAKING STUDENTS",
      instagram_follow: "📸 Follow us on Instagram —",
      admin_tab_planner: "Class Planner",
      streak_days_title: "{n} days in a row!",
      streak_keep_going: "Keep it up!",
      topic_complete_title: "Topic complete!",
      learning_homework_unavailable: "The checklist is not available for this level.",
      nav_main_aria: "Main sections",
      nav_about_label: "About me",
      nav_about_hint: "Who I am and how I teach",
      nav_process_label: "The Process",
      nav_process_hint: "How grinds work and what to expect",
      nav_content_label: "Content",
      nav_content_hint: "Materials by level",
      nav_booking_label: "Booking",
      nav_booking_hint: "Send a time request",
      nav_booking_price: "€25 per session",
      home_free_banner_text:
        "Your first class is free — no commitment, no payment until you decide to continue.",
      hero_cta_book_now: "Claim your free class",
      nav_account_label: "Student Account",
      nav_account_hint: "Optional login to track practice",
      mobile_nav_aria: "Mobile navigation",
      mobile_nav_home: "Home",
      mobile_nav_content: "Content",
      mobile_nav_booking: "Booking",
      mobile_nav_account: "Account",
      btn_home: "← Back to home",
      skip_to_content: "Skip to content",
      hero_cta_book: "Book a free class",
      why_section_title: "Why Choose Andronicus?",
      why_1_title: "One-to-One Classes",
      why_1_body:
        "Every class is one-to-one. There's nowhere to hide and no waiting for a turn to speak: the student talks for the whole hour, every answer gets a response, and the lesson moves at their pace – slowing down when a topic isn't landing, moving on when it is.",
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
        "Lessons are online and one-to-one. After we agree a slot, I send the join link and what you need. I will be on Zoom Plus so I can use premium features: that helps keep things reliable and simple for students every time they join.",
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
      about_title: "About me",
      about_p1_html:
        "My name is <strong>Louis McGovern</strong>. I am <strong>21</strong> and I study <strong>Business and French</strong> at <strong>Trinity College Dublin</strong> — widely ranked as Ireland's top university.",
      about_p2_html:
        "In my Leaving Certificate I was awarded an <strong>H1</strong> — the highest possible grade — in Higher-Level French.",
      about_p3_html:
        "I have travelled a lot in France: I've been in the <strong>Pyrenees</strong> and the <strong>Alps</strong>, stayed in <strong>Le Mans</strong> for two months and <strong>Laval</strong> for a month, visited <strong>Paris</strong> many times, and taught in <strong>Nantes</strong>. I am currently studying on <strong>Erasmus</strong> in <strong>Strasbourg</strong>, France.",
      about_p4_html:
        "I taught English to children through <strong>Living Language</strong>. I have taught <strong>sailing</strong> for the past four years and I work with young people in other teaching settings too.",
      about_p5_html:
        "To get in touch: <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      process_title: "The Process",
      process_steps_intro: "Three simple steps — that's genuinely all there is to it.",
      process_step_1_title: "Get to know me",
      process_step_1_html:
        "<div class=\"step-card__stack\"><p>Before anything else, <strong>let's have a quick chat</strong>. Call me, send me a text, or drop me an email — five or ten minutes is enough. I'll explain exactly how the classes work, you can ask anything you like, and we'll figure out together whether it's the right fit. <strong>No pressure, no obligation.</strong></p></div><div class=\"step-card__links\"><a href=\"tel:+353833198980\">📞 +353 (83) 319 8980</a><span class=\"step-card__dot\" aria-hidden=\"true\">·</span><a href=\"mailto:louis.f.mcgovern@gmail.com\">✉️ Email me</a></div>",
      process_step_2_title: "Find a weekly slot",
      process_step_2_html:
        "<div class=\"step-card__stack\"><p>Once you're happy to go ahead, we'll <strong>find one hour during the week that works for both of us</strong>. Classes run on the same day and time every week — no rescheduling confusion, just a fixed slot you can count on.</p></div>",
      process_step_3_title: "Show up and pay monthly",
      process_step_3_html:
        "<div class=\"step-card__stack\"><p>Join your class on Zoom every week — <strong>one hour, just you and me</strong>. I keep track of the classes you attend, and <strong>at the end of each month I send an invoice</strong> for exactly those. No advance payments, no contracts. <strong>€25 per class.</strong></p></div>",
      process_btn_booking: "Open booking form",
      process_actions_hint: "Same form as in the main menu.",
      process_extra_heading: "Fees, Homework, and How It Works",
      process_p1_html:
        "Each class is <strong>one hour</strong>. It costs <strong>€25 per session</strong>. Every class is <strong>one-to-one</strong>, so the student speaks for the whole hour and gets feedback on everything.",
      process_p2_html:
        "I track how each student moves forward with simple <strong>progress graphs</strong>, plus short tests and how you join in during class.",
      process_p3_html:
        "Grammar is steady and explicit. We also use <strong>debates</strong>, <strong>homework</strong>, and suggestions for <strong>films, series, and music</strong> so English feels lived-in, not only like a workbook.",
      process_zoom_plus_html:
        "I will be using <strong>Zoom Plus</strong> so I can access premium features: that supports a more reliable connection and a simpler join flow for students each week.",
      process_p4_html:
        "Classes run one-to-one on <strong>Zoom</strong>. If anything is unclear after our chat, you can always message me before you use the booking form.",
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
      testimonial_heading: "What students and parents say",
      testimonial_label: "Testimonial",
      testimonial_quote_1:
        "Louis explains things the way a student thinks, not the way a textbook is written. My daughter went from dreading English class to actually enjoying it.",
      testimonial_attr_1: "Parent of a Beginner student",
      testimonial_quote_2:
        "The small group format means you can't hide. You actually have to speak, and that's what made the difference for my exam.",
      testimonial_attr_2: "Intermediate student, Lycée, Paris",
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
        "Classes start in <strong>September 2026</strong> and run <strong>each week</strong> through the school year, with <strong>homework</strong> when it helps. There are breaks around holidays (for example <strong>Christmas</strong>) and I tell everyone the dates in advance. Pick every available hour you can honestly make each week: it makes it easier to find you a fixed slot. The usual slot should work most weeks, but real life happens. <strong>Nothing is paid in advance.</strong> I keep track of the classes attended and send an <strong>invoice at the end of each month</strong>, so you only pay for the classes you actually attended. If you can't make a class, please let me know at least <strong>three days before</strong>.",
      booking_parent_name_label: "Parent name",
      booking_parent_email_label: "Parent email address",
      booking_parent_email_ph: "parent@example.com",
      booking_parent_email_hint: "You'll receive your child's monthly progress report here.",
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
        "Each one-to-one session is €25. Your first session is free.",
      booking_level_empty: "Select level",
      booking_level_unknown: "I do not know yet",
      booking_slots_legend: "Preferred times (France · Paris time)",
      booking_slots_hint:
        "Hours are in France (Paris) local time. Pick a weekday, then tap the available hours that work. Greyed-out hours are already taken. Add other days if you need. I confirm by email.",
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
      booking_missing_parent_email: "Parent email address (valid email required)",
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
      admin_send_emails_btn: "Send monthly progress emails",
      admin_send_emails_sending: "Sending…",
      admin_send_emails_ok: "Done — {sent} emails sent, {skipped} skipped (non-email usernames).",
      admin_send_emails_error: "Error:",
      admin_send_emails_no_secret: "Admin API secret not configured.",
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
      admin_parent_email_label: "Parent email",
      admin_parent_email_none: "not set",
      admin_parent_email_edit: "Edit",
      admin_parent_email_save: "Save",
      admin_parent_email_cancel: "Cancel",
      admin_student_stat_cards_reviewed: "Cards reviewed",
      admin_student_stat_accuracy: "Flashcard accuracy",
      admin_student_stat_quiz_sessions: "Quiz sessions",
      admin_student_stat_exercises: "Exercises done",
      admin_student_stat_streak: "Streak (days)",
      admin_student_session_cards: "{n} cards",
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
      admin_student_homework: "Homework completed",
      admin_student_homework_none_for_level: "No homework list available for this student's level.",
      admin_student_homework_summary: "{done} of {total} tasks ticked off",
      admin_tab_leaderboard: "Leaderboard",
      points_one: "{n} point",
      points_many: "{n} points",
      points_word: "points",
      points_word_one: "point",
      points_badge_aria: "You have {n} points – open details",
      points_title: "Your points",
      points_split_vocab: "Vocabulary (1 per stone)",
      points_split_teacher: "From your teacher",
      points_history_title: "Recent points",
      points_history_empty: "Nothing yet – keep going!",
      points_from_teacher: "Teacher",
      points_from_writing: "Writing homework",
      points_toast: "You received {pts}!",
      points_toast_msg: "You received {pts}: “{msg}”",
      admin_tab_points: "Points",
      admin_points_send_heading: "Send points",
      admin_points_student: "Student",
      admin_points_choose: "Choose a student",
      admin_points_amount: "Points",
      admin_points_message: "Message (optional)",
      admin_points_message_ph: "e.g. Great effort in class this week!",
      admin_points_hint: "The student sees the points and your message next time they open the site. Use a negative number to take points away.",
      admin_points_send: "Send points",
      admin_points_need_student: "Choose a student first.",
      admin_points_need_amount: "Enter a number of points (not 0).",
      admin_points_confirm: "Send {pts} to {name}?",
      admin_points_sent: "Sent {pts} to {name} ✓",
      admin_points_table_heading: "Everyone's points",
      admin_points_col_vocab: "Vocabulary",
      admin_points_col_teacher: "From you",
      admin_points_col_total: "Total",
      admin_points_give: "Give points",
      admin_points_history_heading: "Points you've given",
      admin_points_seen: "seen",
      admin_points_unseen: "not seen yet",
      admin_points_undo: "Undo",
      admin_points_undo_confirm: "Remove {pts} from {name}?",
      admin_points_no_cloud: "Points need Supabase to be connected.",
      admin_points_missing_sql: "Points aren't set up in Supabase yet – run the file 20261105120000_points.sql in the SQL Editor.",
      admin_writing_points_label: "Points for this homework",
      admin_writing_points_hint: "Given when you send the correction. Change it and send again to update; 0 removes them.",
      admin_tab_writing: "Writing",
      writing_btn_start: "✎ Write my answer",
      writing_btn_continue: "✎ Continue my draft",
      writing_btn_open: "Open my work",
      writing_badge_draft: "Draft saved",
      writing_badge_submitted: "Sent – awaiting correction",
      writing_badge_corrected: "Corrected ✓",
      writing_signin: "Sign in to write your answer.",
      writing_kicker: "Writing · {level}",
      writing_close: "Close",
      writing_attempt: "Attempt {n}",
      writing_words: "{n} words",
      writing_words_one: "1 word",
      writing_no_paste: "Copy and paste is turned off here. Type your answer yourself, letter by letter.",
      writing_paste_blocked: "Pasting isn't allowed here – please type your answer.",
      writing_placeholder: "Start typing your answer here…",
      writing_save: "Save and finish later",
      writing_submit: "Submit to my teacher",
      writing_saving: "Saving…",
      writing_saved_at: "Saved at {time}",
      writing_save_failed: "Couldn't save online. Your text is kept on this device – try again in a moment.",
      writing_submit_empty: "Write your answer before sending it.",
      writing_submit_confirm: "Send attempt {n} to your teacher? You won't be able to change it afterwards.",
      writing_sent_title: "Attempt {n} has been sent to your teacher.",
      writing_sent_waiting: "You'll see the correction here once it's ready. You can also try again now.",
      writing_corrected_title: "Your teacher has corrected attempt {n}. Read the correction above, then try again if you'd like.",
      writing_new_attempt: "Start a new attempt",
      writing_history_title: "Your attempts",
      writing_status_submitted: "Awaiting correction",
      writing_status_corrected: "Corrected",
      writing_sent_on: "sent {date}",
      writing_teacher_note: "Teacher's note",
      writing_legend_err: "mistake",
      writing_legend_fix: "correction",
      writing_offline: "Online saving isn't available right now.",
      writing_load_failed: "Couldn't load your previous work. Check your connection and reopen this task.",
      writing_restored_local: "We restored text you hadn't saved yet.",
      admin_writing_heading: "Writing to correct",
      admin_writing_filter_todo: "To correct ({n})",
      admin_writing_filter_done: "Corrected ({n})",
      admin_writing_filter_all: "All ({n})",
      admin_writing_col_student: "Student",
      admin_writing_col_task: "Task",
      admin_writing_col_attempt: "Attempt",
      admin_writing_col_sent: "Sent",
      admin_writing_col_status: "Status",
      admin_writing_empty: "Nothing here yet.",
      admin_writing_loading: "Loading…",
      admin_writing_open_correct: "Correct",
      admin_writing_open_view: "View / edit",
      admin_writing_back: "Back to list",
      admin_writing_original: "Student's original text",
      admin_writing_other_attempts: "Other attempts:",
      admin_writing_help: "Select words in the text, then click “Highlight mistake”, or type the correct version in the box and click “Highlight + correct”. You can also type straight into the text.",
      admin_writing_mark: "Highlight mistake",
      admin_writing_fix_placeholder: "Correct version…",
      admin_writing_mark_fix: "Highlight + correct",
      admin_writing_unmark: "Remove marks",
      admin_writing_reset: "Start again from original",
      admin_writing_reset_confirm: "Remove all your corrections and go back to the student's original text?",
      admin_writing_select_first: "Select some words in the text first.",
      admin_writing_fix_needed: "Type the correct version in the box first.",
      admin_writing_note_label: "Note for the student (optional)",
      admin_writing_save: "Save without sending",
      admin_writing_send: "Send correction to student",
      admin_writing_resend: "Update correction",
      admin_writing_send_confirm: "Send this correction to {name}? They will see it straight away.",
      admin_writing_saved: "Saved – not visible to the student yet.",
      admin_writing_sent: "Correction sent ✓",
      admin_writing_failed: "Couldn't save: {err}",
      admin_writing_unsaved_confirm: "You have unsaved changes to this correction. Leave anyway?",
      admin_writing_no_cloud: "Writing corrections need Supabase to be connected.",
      admin_leaderboard_heading: "Student leaderboard",
      admin_leaderboard_empty: "No students found.",
      admin_lb_col_rank: "Rank",
      admin_lb_col_name: "Name",
      admin_lb_col_level: "Level",
      admin_lb_col_score: "Score",
      admin_lb_col_cards: "Cards (×1)",
      admin_lb_col_quizzes: "Quizzes (×5)",
      admin_lb_col_exercises: "Exercises (×10)",
      admin_lb_col_homework: "Homework (×3)",
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
      flashcard_complete_msg_excellent: "Excellent! You really know this deck.",
      flashcard_complete_msg_good: "Good work — keep it up!",
      flashcard_complete_msg_review: "Keep practising — you'll get there!",
      learning_streak_hint_html:
        "Active days in a row<br>Complete any activity to keep your streak going",
      flashcard_complete_wrong_only: "Study cards I got wrong",
      flashcard_complete_full_again: "Whole deck again",
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
      learning_landing_vocab: "Cross the stepping stones, one word at a time",
      vocab_path_title: "Stepping stones",
      vocab_path_meta: "Stone {n} of {t}",
      vocab_path_meta_done: "All {t} stones crossed",
      vocab_path_lap: "Lap {n}",
      vocab_path_difficulty: "Difficulty",
      vocab_path_pending: "{n} missed words are waiting at the back of the line.",
      vocab_path_pending_one: "1 missed word is waiting at the back of the line.",
      vocab_path_ask_fr: "What does this mean in French?",
      vocab_path_ask_en: "How do you say this in English?",
      vocab_path_review_hint: "A word you missed earlier – try again!",
      vocab_path_correct: "Correct! +1 point – on to the next stone.",
      vocab_path_wrong: "Not quite: “{prompt}” = “{answer}”. This word goes to the back of the line.",
      vocab_path_continue: "Continue",
      vocab_path_autosave: "Your place is saved automatically – stop whenever you like. Tip: use keys 1–4 to answer.",
      vocab_path_guest: "Sign in to save your place on the path.",
      vocab_path_done_badge: "Section complete ✓",
      vocab_path_done_title: "You crossed all {t} stones!",
      vocab_path_done_text: "Every word of this level has been answered correctly. You can stop here, or go round again – the words will come back in the same slow climb.",
      vocab_path_next_lap: "Start lap {n}",
      vocab_path_celebrate: "Vocabulary complete!",
      vocab_path_card_progress: "Stone {n} / {t}",
      vocab_path_card_done: "Complete ✓",
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
      learning_vocab_results_best: "Your best: {pct}%",
      learning_vocab_results_new_record: "New best! {pct}%",
      learning_vocab_results_msg_excellent: "Excellent work — keep it up!",
      learning_vocab_results_msg_good: "Good effort — you're making progress!",
      learning_vocab_results_msg_review: "Review the flashcards and try again — you've got this!",
      learning_vocab_results_retry: "Try again",
      learning_vocab_results_level_up: "Next level up",
      learning_vocab_missed_summary: "See missed questions ({count})",
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
      booking_hour_range: "{start}:00–{end}:00",
      booking_sold_out: "Sold out",
      booking_day_full_note: "All slots on this day are taken. Please choose another day.",
      account_metric_flash_accuracy: "Flashcard accuracy: {correct}/{attempts} ({pct})",
      account_metric_quiz_sessions: "Quiz sessions completed: {n}",
      account_metric_exercises_done: "Completed exercises: {n}",
      account_metric_quiz_best: "Best {mode}: {pct}%",
    },
    fr: {
      meta_title: "Andronicus · Cours d’anglais",
      meta_description:
        "Cours particuliers d’anglais en ligne pour élèves francophones. Cadre clair, suivi des progrès. Louis McGovern, Trinity College Dublin.",
      lang_aria: "Langue",
      lang_en: "Anglais",
      lang_fr: "Français",
      theme_aria: "Thème d’affichage",
      theme_light: "Clair",
      theme_dark: "Sombre",
      tagline: "Cours d’anglais en ligne pour élèves francophones.",
      hero_kicker: "COURS D’ANGLAIS · DUBLIN · EN LIGNE",
      footer_tagline: "ANDRONICUS · COURS D’ANGLAIS POUR ÉLÈVES FRANCOPHONES",
      instagram_follow: "📸 Suivez-nous sur Instagram —",
      admin_tab_planner: "Planning des cours",
      streak_days_title: "{n} jours de suite !",
      streak_keep_going: "Continue comme ça !",
      topic_complete_title: "Thème terminé !",
      learning_homework_unavailable: "La liste de devoirs n’est pas disponible pour ce niveau.",
      nav_main_aria: "Sections principales",
      nav_about_label: "À propos de moi",
      nav_about_hint: "Qui je suis et comment j’enseigne",
      nav_process_label: "Le déroulement des cours",
      nav_process_hint: "Comment fonctionnent les cours et à quoi s’attendre",
      nav_content_label: "Contenu",
      nav_content_hint: "Supports par niveau",
      nav_booking_label: "Inscription",
      nav_booking_hint: "Envoyer une demande de créneau",
      nav_booking_price: "25 € par séance",
      home_free_banner_text:
        "Votre premier cours est gratuit — sans engagement, et aucun paiement tant que vous n'avez pas décidé de continuer.",
      hero_cta_book_now: "Réserver mon cours gratuit",
      nav_account_label: "Compte élève",
      nav_account_hint: "Connexion facultative pour suivre ses progrès",
      mobile_nav_aria: "Navigation mobile",
      mobile_nav_home: "Accueil",
      mobile_nav_content: "Contenu",
      mobile_nav_booking: "Réserver",
      mobile_nav_account: "Compte",
      btn_home: "← Retour à l’accueil",
      skip_to_content: "Aller au contenu",
      hero_cta_book: "Réserver un cours gratuit",
      why_section_title: "Pourquoi choisir Andronicus ?",
      why_1_title: "Cours particuliers",
      why_1_body:
        "Chaque cours se fait en tête-à-tête. Impossible de se cacher, et pas besoin d'attendre son tour pour parler : l'élève s'exprime pendant toute l'heure, chaque réponse reçoit un retour, et le cours avance à son rythme – on ralentit quand un sujet ne passe pas, on avance quand tout va bien.",
      why_2_title: "Des progrès visibles",
      why_2_body:
        "Chaque élève dispose d'une page de suivi avec de vrais graphiques, des résultats de tests et des remarques sur sa participation en cours. Inutile de deviner s'il progresse : il suffit de regarder. Les parents voient la même page, donc aucune mauvaise surprise en fin de trimestre.",
      why_3_title: "Je suis aussi étudiant",
      why_3_body:
        "Je suis moi-même étudiant à Trinity College Dublin : je sais ce que c'est d'avoir le nez dans le travail, pas de le regarder de haut. Cela change ma façon d'enseigner — je me souviens précisément de ce qui m'a paru difficile, des explications qui m'ont enfin fait comprendre, et de la manière de trouver dix minutes de plus quand la semaine est déjà bien remplie.",
      home_trust_line: "La plupart des élèves qui commencent restent toute l’année. Écrivez-moi ou appelez-moi si vous souhaitez en parler avant de réserver.",
      faq_section_title: "Questions fréquentes",
      faq_q1: "À qui s’adressent les cours ?",
      faq_a1:
        "Principalement des élèves francophones, du collège au lycée et jusqu'au début des études supérieures — mais toute personne dont la langue maternelle est le français et qui souhaite progresser en anglais est la bienvenue. Il existe des parcours débutant, intermédiaire et avancé, et nous choisirons ensemble le bon niveau après en avoir discuté.",
      faq_q2: "Où ont lieu les cours ?",
      faq_a2:
        "Les cours ont lieu en ligne, en tête-à-tête. Une fois le créneau convenu, je vous envoie le lien de connexion et tout ce qu’il faut. J’utilise Zoom Plus, qui donne accès aux fonctions premium : la connexion est plus fiable et plus simple pour l’élève à chaque cours.",
      faq_q3: "Comment fonctionne l’inscription ?",
      faq_a3:
        "Vous proposez des horaires possibles. Tant que je ne vous ai pas répondu, ce n’est qu’une demande, pas une place garantie.",
      faq_q4: "Quel niveau faut-il ?",
      faq_a4:
        "Il existe des parcours débutant, intermédiaire et avancé. Si vous hésitez, indiquez-le dans le formulaire et je vous orienterai.",
      faq_q5: "Comment saurai-je que ma réservation est confirmée ?",
      faq_a5:
        "Je confirme chaque réservation personnellement par e-mail ou par message — généralement sous 24 heures. Tant que vous n'avez pas reçu de confirmation avec un créneau précis, votre réservation reste une demande. Ainsi, aucun créneau n'est réservé deux fois et vous savez toujours où vous en êtes.",
      faq_q6: "De quoi a-t-on besoin pour un cours ?",
      faq_a6:
        "Un endroit calme pour se concentrer, une bonne connexion Internet et le lien Zoom que je vous envoie. Une feuille et un stylo sont utiles, ainsi qu’un casque si la maison est bruyante.",
      contact_section_title: "Envie d’en parler avant ?",
      contact_section_html:
        "Appelez-moi ou écrivez-moi : on règle généralement le niveau et le créneau en quelques minutes. <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      about_title: "À propos de moi",
      about_p1_html:
        "Je m’appelle <strong>Louis McGovern</strong>, j’ai <strong>21 ans</strong> et j’étudie <strong>le commerce et le français</strong> à <strong>Trinity College Dublin</strong>, régulièrement classée meilleure université d’Irlande.",
      about_p2_html:
        "Au Leaving Certificate (l’équivalent irlandais du baccalauréat), j’ai obtenu un <strong>H1</strong>, la meilleure note possible, en français niveau supérieur.",
      about_p3_html:
        "Je connais bien la France : les <strong>Pyrénées</strong> et les <strong>Alpes</strong>, deux mois au <strong>Mans</strong>, un mois à <strong>Laval</strong>, de nombreux séjours à <strong>Paris</strong>, et j’ai enseigné à <strong>Nantes</strong>. Je suis actuellement en <strong>Erasmus</strong> à <strong>Strasbourg</strong>.",
      about_p4_html:
        "J’ai enseigné l’anglais à des enfants avec <strong>Living Language</strong>. J’enseigne la <strong>voile</strong> depuis quatre ans et j’encadre aussi des jeunes dans d’autres contextes éducatifs.",
      about_p5_html:
        "Pour me joindre : <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      process_title: "Le déroulement des cours",
      process_steps_intro: "Trois étapes simples — c'est vraiment tout.",
      process_step_1_title: "Apprenons à nous connaître",
      process_step_1_html:
        "<div class=\"step-card__stack\"><p>Avant toute chose, <strong>parlons quelques minutes</strong>. Appelez-moi, envoyez-moi un SMS ou un e-mail — cinq à dix minutes suffisent. Je vous explique comment se déroulent les cours, vous posez toutes vos questions, et nous voyons ensemble si cela vous convient. <strong>Sans pression, sans engagement.</strong></p></div><div class=\"step-card__links\"><a href=\"tel:+353833198980\">📞 +353 (83) 319 8980</a><span class=\"step-card__dot\" aria-hidden=\"true\">·</span><a href=\"mailto:louis.f.mcgovern@gmail.com\">✉️ M'envoyer un e-mail</a></div>",
      process_step_2_title: "Trouver un créneau hebdomadaire",
      process_step_2_html:
        "<div class=\"step-card__stack\"><p>Si vous décidez de vous lancer, nous <strong>cherchons ensemble une heure dans la semaine qui nous convient à tous les deux</strong>. Les cours ont lieu le même jour et à la même heure chaque semaine — pas de casse-tête d’agenda, juste un créneau fixe sur lequel vous pouvez compter.</p></div>",
      process_step_3_title: "Suivez les cours, payez en fin de mois",
      process_step_3_html:
        "<div class=\"step-card__stack\"><p>Rejoignez votre cours sur Zoom chaque semaine — <strong>une heure, en tête-à-tête</strong>. Je tiens le compte des cours suivis et <strong>j’envoie une facture à la fin de chaque mois</strong>, uniquement pour ceux-là. Pas de paiement à l'avance, pas de contrat. <strong>25 € par cours.</strong></p></div>",
      process_btn_booking: "Ouvrir le formulaire d’inscription",
      process_actions_hint: "C’est le même formulaire que dans le menu principal.",
      process_extra_heading: "Tarifs, devoirs et fonctionnement",
      process_p1_html:
        "Chaque séance dure <strong>une heure</strong> et coûte <strong>25 €</strong>. Chaque cours est <strong>particulier</strong> : l’élève parle pendant toute l’heure et reçoit des retours sur tout.",
      process_p2_html:
        "Je suis la progression de chaque élève avec des <strong>graphiques simples</strong>, de courts tests et l’observation de sa participation en cours.",
      process_p3_html:
        "La grammaire est travaillée de façon régulière et explicite. Nous ajoutons des <strong>débats</strong>, des <strong>devoirs</strong> et des idées de <strong>films, séries ou musique</strong> pour que l’anglais devienne une langue vivante, et pas seulement un manuel.",
      process_zoom_plus_html:
        "J’utilise <strong>Zoom Plus</strong> pour accéder aux fonctions premium : la connexion est plus fiable et l’accès au cours plus simple pour l’élève chaque semaine.",
      process_p4_html:
        "Les cours particuliers ont lieu sur <strong>Zoom</strong>. Si quelque chose n’est pas clair après notre échange, vous pouvez m’écrire avant de remplir le formulaire d’inscription.",
      process_p5_html:
        "<strong>Contact :</strong> <a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      content_intro:
        "Choisissez votre niveau. Le contenu est classé par niveau d’anglais, et le mot de passe est demandé à chaque fois. Pour obtenir l’accès, <strong>contactez-moi</strong> et nous pourrons organiser un <strong>échange de dix minutes</strong>.",
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
      home_testimonials_heading: "Ce que disent les élèves et les parents",
      testimonial_heading: "Ce que disent les élèves et les parents",
      testimonial_label: "Témoignage",
      testimonial_quote_1:
        "Louis explique les choses comme un élève les pense, pas comme un manuel les présente. Ma fille redoutait le cours d'anglais ; aujourd'hui, elle l'apprécie vraiment.",
      testimonial_attr_1: "Parent d'un élève débutant",
      testimonial_quote_2:
        "Le format en petits groupes fait qu'on ne peut pas se cacher. On doit vraiment parler, et c'est ce qui a fait la différence pour mon examen.",
      testimonial_attr_2: "Élève intermédiaire, Lycée, Paris",
      content_password_title: "Saisir le mot de passe",
      content_password_intro: "Entre le mot de passe que ton professeur t’a donné.",
      content_password_close_aria: "Annuler et revenir au choix des niveaux",
      content_password_label: "Mot de passe",
      content_password_submit: "Continuer",
      content_password_error: "Mot de passe incorrect.",
      content_back_levels: "← Retour aux niveaux",
      content_close_aria: "Fermer et revenir aux niveaux",
      content_opening: "Ouverture du contenu {level}.",
      article_beginner_intro_html:
        "Vocabulaire courant, présent simple et continu, questions de base et situations du quotidien (salutations, école, loisirs). Courts dialogues, supports visuels et répétition pour prendre confiance avant d’aborder des textes plus longs.",
      article_beginner_li1_html:
        "<strong>Grammaire :</strong> be/have, articles, there is/are, ordre des mots dans les questions.",
      article_beginner_li2_html:
        "<strong>Compétences :</strong> écoute d’enregistrements lents et clairs ; lecture de courts paragraphes ; expression orale guidée en binôme.",
      article_beginner_li3_html:
        "<strong>Devoirs :</strong> listes de vocabulaire avec révision espacée ; courtes phrases de journal en anglais.",
      article_intermediate_intro_html:
        "Élargir l’éventail des temps (passé, present perfect, conditionnel), les connecteurs et la rédaction de paragraphes. Thèmes : voyage, médias, courts textes d’opinion, avec de quoi débattre tout en restant clair.",
      article_intermediate_li1_html:
        "<strong>Grammaire :</strong> discours rapporté, voix passive, propositions relatives, comparatifs.",
      article_intermediate_li2_html:
        "<strong>Compétences :</strong> résumer des articles ; mini-débats ; rédiger des e-mails et de courts essais.",
      article_intermediate_li3_html:
        "<strong>Médias :</strong> un épisode par semaine d’une série ou d’un podcast adapté, avec un court compte rendu.",
      article_advanced_intro_html:
        "Affiner la nuance, le registre et la cohésion. Nous analysons des essais, des discours et des articles de presse ; vous apprenez à argumenter clairement et à retravailler le ton de vos textes. Une solide préparation aux examens et à l’anglais universitaire.",
      article_advanced_li1_html:
        "<strong>Grammaire &amp; style :</strong> inversion, phrases clivées, atténuation, vocabulaire formel vs familier.",
      article_advanced_li2_html:
        "<strong>Compétences :</strong> rédactions en temps limité ; discussion de sujets abstraits ; reformulation et paraphrase sous pression.",
      article_advanced_li3_html:
        "<strong>Approfondissement :</strong> lecture longue (non-fiction ou extraits littéraires) et carnets de vocabulaire.",
      booking_title: "Inscription",
      booking_intro_html:
        "Les cours commencent en <strong>septembre 2026</strong>, <strong>une séance par semaine</strong> pendant l’année scolaire, avec des <strong>devoirs</strong> quand c’est utile. Il y a des pauses pendant les vacances (par exemple à <strong>Noël</strong>) et je communique les dates à l’avance. Cochez toutes les plages disponibles où vous êtes vraiment libres : cela aide à vous trouver un créneau fixe. Le créneau habituel devrait convenir la plupart des semaines, mais il y a toujours des imprévus. <strong>Rien n’est payé à l’avance.</strong> Je tiens le compte des cours suivis et j’envoie une <strong>facture à la fin de chaque mois</strong> : vous ne payez que les cours auxquels l’élève a assisté. Si vous ne pouvez pas venir à un cours, prévenez-moi au moins <strong>trois jours avant</strong>.",
      booking_parent_name_label: "Nom du parent",
      booking_parent_email_label: "Adresse e-mail du parent",
      booking_parent_email_ph: "parent@exemple.com",
      booking_parent_email_hint: "Vous recevrez ici le rapport mensuel de votre enfant.",
      booking_student_name_label: "Nom de l’élève",
      booking_phone_label: "Téléphone (pour ma réponse)",
      booking_level_label: "Niveau d’anglais",
      booking_level_help: "Le niveau actuel de l’élève, à peu près : débutant, intermédiaire ou avancé.",
      booking_parent_name_ph: "Nom complet du parent",
      booking_student_name_ph: "Nom complet de l’élève",
      booking_phone_ph: "Portable, avec l’indicatif du pays (ex. +33)",
      booking_request_note_html:
        "<strong>Ce formulaire n’est qu’une demande.</strong> Votre place n’est confirmée qu’une fois que je vous ai répondu par e-mail ou par message.",
      booking_price_callout:
        "Chaque cours particulier coûte 25 €. La première séance est gratuite.",
      booking_level_empty: "Choisir un niveau",
      booking_level_unknown: "Je ne sais pas encore",
      booking_slots_legend: "Créneaux souhaités (heure de Paris)",
      booking_slots_hint:
        "Les heures sont en heure locale de Paris. Choisissez un jour, puis les créneaux disponibles qui vous conviennent. Les heures grisées sont déjà prises. Ajoutez d’autres jours si besoin. Je confirme par e-mail.",
      booking_times_unknown_label: "Je ne sais pas encore",
      booking_pick_day: "1 · Choisir un jour",
      booking_times_for: "Créneaux pour {day}",
      booking_hours_hint: "Cliquez sur une heure pour l’ajouter ou la retirer pour ce jour.",
      booking_selected_label: "Créneaux sélectionnés",
      booking_no_slots: "Aucun pour l’instant. Choisissez un jour et des heures ci-dessus.",
      booking_remove_aria: "Retirer {slot}",
      booking_err_no_slots: "Veuillez choisir au moins un créneau.",
      booking_err_missing_fields_intro: "Merci de compléter : {fields}.",
      booking_missing_parent_name: "Nom du parent",
      booking_missing_parent_email: "Adresse e-mail du parent (adresse valide requise)",
      booking_missing_student_name: "Nom de l’élève",
      booking_missing_phone: "Téléphone",
      booking_missing_level: "Niveau d’anglais",
      booking_missing_times: "Créneaux souhaités (ou « Je ne sais pas encore »)",
      booking_level_unknown_badge: "Je ne sais pas encore",
      booking_submit: "Envoyer la demande",
      booking_success_heading: "Demande envoyée",
      booking_success_main:
        "Louis vous contactera dans les 24 heures par e-mail ou WhatsApp pour confirmer votre créneau. Votre premier cours est gratuit — aucun paiement avant confirmation.",
      booking_success_followup_html:
        'Si vous n\'avez pas de nouvelles dans 24 heures, appelez le <a href="tel:+353833198980">+353 (83) 319 8980</a>.',
      booking_success_p1:
        "Merci, j’ai bien reçu votre demande. Je vous écris ou vous envoie un message pour confirmer un créneau et la suite.",
      booking_success_small:
        "Le site n’arrive pas à joindre le serveur. Écrivez-moi pour que je reçoive quand même votre demande.",
      booking_success_cloud:
        "Votre demande est bien arrivée en ligne. Je vous réponds pour confirmer le créneau.",
      booking_success_local_fallback:
        "Le serveur ne répondait pas, donc une copie est restée sur cet appareil. Écrivez-moi aussi pour être sûr que je la voie.",
      booking_success_confirm_note_html:
        "<strong>Tant que je n’ai pas répondu, ce n’est pas confirmé.</strong> Surveillez vos e-mails ou vos messages.",
      booking_error_submit:
        "Rien n’a été enregistré en ligne. Réessayez dans une minute, ou appelez-moi ou écrivez-moi : nous ferons l’inscription manuellement.",
      booking_error_submit_partial:
        "La demande n’a été enregistrée que sur cet appareil car le serveur était indisponible. Écrivez-moi aussi par e-mail ou téléphone pour que je la reçoive.",
      footer_line: "Andronicus · Cours d’anglais",
      footer_contact_html:
        "<a href=\"tel:+353833198980\">+353 (83) 319 8980</a> · <a href=\"mailto:louis.f.mcgovern@gmail.com\">louis.f.mcgovern@gmail.com</a>",
      account_title: "Ton compte",
      account_intro: "Pour les élèves qui veulent suivre leurs exercices et leurs progrès.",
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
        "Les comptes sont gérés directement sur ce site (aucun e-mail n’est envoyé). Si tu as oublié ton mot de passe, contacte Louis : il peut le réinitialiser depuis l’administration si tu lui donnes ton nom de compte. <a href=\"mailto:louis.f.mcgovern@gmail.com\">E-mail</a> · <a href=\"tel:+353833198980\">+353 (83) 319 8980</a>",
      account_forgot_close_btn: "Fermer",
      account_btn_register: "Créer le compte",
      account_btn_login: "Se connecter",
      account_btn_logout: "Se déconnecter",
      account_completed_heading: "Exercices terminés",
      account_err_register_fields: "Indique ton nom de compte, ton nom complet et ton mot de passe.",
      account_err_register_exists: "Ce nom de compte est déjà utilisé.",
      account_err_login: "Nom de compte ou mot de passe incorrect.",
      account_ok_register: "Compte créé avec succès.",
      account_ok_login: "Tu es connecté(e).",
      account_welcome_logged_in: "Connecté(e) en tant que : {user}",
      account_onboarding_welcome: "Bienvenue, {name} !",
      account_onboarding_start_en:
        "Head to Content → Beginner to start with flashcards, vocabulary, or grammar exercises.",
      account_onboarding_start_fr:
        "Va dans Contenu → Débutant pour commencer avec les cartes mémoire, le vocabulaire ou la grammaire.",
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
      admin_controls_title: "Outils d’administration",
      admin_logout_btn: "Fermer l’admin",
      admin_refresh_cloud: "Actualiser les données en ligne",
      admin_tab_bookings: "Réservations",
      admin_tab_progress: "Progression des élèves",
      admin_tab_payments: "Paiements",
      admin_bookings_heading: "Demandes de cours",
      admin_progress_heading: "Progression des élèves",
      admin_payments_heading: "Liste de suivi des paiements (parents)",
      admin_send_emails_btn: "Envoyer les bilans mensuels par e-mail",
      admin_send_emails_sending: "Envoi en cours…",
      admin_send_emails_ok: "Terminé — {sent} e-mails envoyés, {skipped} ignorés (identifiants qui ne sont pas des adresses e-mail).",
      admin_send_emails_error: "Erreur :",
      admin_send_emails_no_secret: "Clé API admin non configurée.",
      admin_col_name: "Nom",
      admin_col_phone: "Téléphone",
      admin_col_level: "Niveau",
      admin_col_slots: "Créneaux",
      admin_col_booked: "Date de la demande",
      admin_col_actions: "Actions",
      admin_col_username: "Identifiant",
      admin_col_flashcards: "Cartes mémoire",
      admin_col_quiz: "Séances de quiz",
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
        "Synchronisation active : les réservations et les paiements sont chargés depuis Supabase sur tous les appareils.",
      admin_cloud_fail_prefix:
        "Échec de la synchronisation. Affichage des données enregistrées sur cet appareil. Vérifie la configuration et Supabase.",
      admin_cloud_no_secret:
        "Les réservations sont bien envoyées en ligne, mais adminApiSecret manque dans la configuration. Les listes d’administration restent sur cet appareil tant que ce n’est pas corrigé.",
      admin_corner_aria: "Ouvrir l’administration du site",
      admin_student_view: "Profil et statistiques",
      admin_student_back: "Retour à la liste",
      admin_student_detail_title: "Progression : {name}",
      admin_student_detail_username: "Compte : {user}",
      admin_parent_email_label: "E-mail du parent",
      admin_parent_email_none: "non renseigné",
      admin_parent_email_edit: "Modifier",
      admin_parent_email_save: "Enregistrer",
      admin_parent_email_cancel: "Annuler",
      admin_student_stat_cards_reviewed: "Cartes revues",
      admin_student_stat_accuracy: "Précision (cartes mémoire)",
      admin_student_stat_quiz_sessions: "Séances de quiz",
      admin_student_stat_exercises: "Exercices terminés",
      admin_student_stat_streak: "Série (jours)",
      admin_student_session_cards: "{n} cartes",
      admin_student_flash_overall: "Cartes mémoire (tous thèmes)",
      admin_student_lifetime_accuracy: "Précision globale (« Je sais » contre « À revoir »)",
      admin_student_by_deck: "Précision par thème",
      admin_student_no_deck_stats:
        "Pas encore de statistiques par thème : l’élève doit s’entraîner sur les cartes en étant connecté.",
      admin_student_flash_sessions: "Sessions récentes (cartes)",
      admin_student_no_sessions: "Aucune session terminée pour l’instant.",
      admin_student_session_chart_hint:
        "Chaque barre = le score d’une session (1 = la plus ancienne ici). Survole une barre pour voir le thème.",
      admin_student_mode_wrong_retry: "révision des cartes à revoir",
      admin_student_quiz_title: "Activité vocabulaire",
      admin_student_no_quiz_log: "Aucun quiz enregistré pour l’instant.",
      admin_student_quiz_best: "Meilleur score par mode",
      admin_student_exercises: "Exercices terminés",
      admin_student_homework: "Devoirs terminés",
      admin_student_homework_none_for_level: "Aucune liste de devoirs disponible pour le niveau de cet élève.",
      admin_student_homework_summary: "{done} tâches cochées sur {total}",
      admin_tab_leaderboard: "Classement",
      points_one: "{n} point",
      points_many: "{n} points",
      points_word: "points",
      points_word_one: "point",
      points_badge_aria: "Tu as {n} points – voir le détail",
      points_title: "Tes points",
      points_split_vocab: "Vocabulaire (1 par pierre)",
      points_split_teacher: "De ton professeur",
      points_history_title: "Derniers points reçus",
      points_history_empty: "Rien pour l'instant – continue !",
      points_from_teacher: "Professeur",
      points_from_writing: "Devoir d'écriture",
      points_toast: "Tu as reçu {pts} !",
      points_toast_msg: "Tu as reçu {pts} : « {msg} »",
      admin_tab_points: "Points",
      admin_points_send_heading: "Envoyer des points",
      admin_points_student: "Élève",
      admin_points_choose: "Choisir un élève",
      admin_points_amount: "Points",
      admin_points_message: "Message (facultatif)",
      admin_points_message_ph: "ex. Super travail en cours cette semaine !",
      admin_points_hint: "L'élève voit les points et ton message la prochaine fois qu'il ouvre le site. Mets un nombre négatif pour retirer des points.",
      admin_points_send: "Envoyer les points",
      admin_points_need_student: "Choisis d'abord un élève.",
      admin_points_need_amount: "Indique un nombre de points (pas 0).",
      admin_points_confirm: "Envoyer {pts} à {name} ?",
      admin_points_sent: "{pts} envoyés à {name} ✓",
      admin_points_table_heading: "Les points de chacun",
      admin_points_col_vocab: "Vocabulaire",
      admin_points_col_teacher: "De toi",
      admin_points_col_total: "Total",
      admin_points_give: "Donner des points",
      admin_points_history_heading: "Points que tu as donnés",
      admin_points_seen: "vu",
      admin_points_unseen: "pas encore vu",
      admin_points_undo: "Annuler",
      admin_points_undo_confirm: "Retirer {pts} à {name} ?",
      admin_points_no_cloud: "Les points nécessitent que Supabase soit connecté.",
      admin_points_missing_sql: "Les points ne sont pas encore installés dans Supabase – exécute le fichier 20261105120000_points.sql dans l’éditeur SQL.",
      admin_writing_points_label: "Points pour ce devoir",
      admin_writing_points_hint: "Donnés quand tu envoies la correction. Modifie et renvoie pour mettre à jour ; 0 les retire.",
      admin_tab_writing: "Rédactions",
      writing_btn_start: "✎ Écrire ma réponse",
      writing_btn_continue: "✎ Continuer mon brouillon",
      writing_btn_open: "Voir mon travail",
      writing_badge_draft: "Brouillon enregistré",
      writing_badge_submitted: "Envoyé – en attente de correction",
      writing_badge_corrected: "Corrigé ✓",
      writing_signin: "Connecte-toi pour écrire ta réponse.",
      writing_kicker: "Écriture · {level}",
      writing_close: "Fermer",
      writing_attempt: "Tentative {n}",
      writing_words: "{n} mots",
      writing_words_one: "1 mot",
      writing_no_paste: "Le copier-coller est désactivé ici. Écris ta réponse toi-même, lettre par lettre.",
      writing_paste_blocked: "Impossible de coller du texte ici – écris ta réponse au clavier.",
      writing_placeholder: "Commence à écrire ta réponse ici…",
      writing_save: "Enregistrer et finir plus tard",
      writing_submit: "Envoyer à mon professeur",
      writing_saving: "Enregistrement…",
      writing_saved_at: "Enregistré à {time}",
      writing_save_failed: "Échec de l'enregistrement en ligne. Ton texte est gardé sur cet appareil – réessaie dans un instant.",
      writing_submit_empty: "Écris ta réponse avant de l'envoyer.",
      writing_submit_confirm: "Envoyer la tentative {n} à ton professeur ? Tu ne pourras plus la modifier ensuite.",
      writing_sent_title: "La tentative {n} a été envoyée à ton professeur.",
      writing_sent_waiting: "Tu verras la correction ici dès qu'elle sera prête. Tu peux aussi réessayer maintenant.",
      writing_corrected_title: "Ton professeur a corrigé la tentative {n}. Lis la correction ci-dessus, puis réessaie si tu veux.",
      writing_new_attempt: "Commencer une nouvelle tentative",
      writing_history_title: "Tes tentatives",
      writing_status_submitted: "En attente de correction",
      writing_status_corrected: "Corrigé",
      writing_sent_on: "envoyé le {date}",
      writing_teacher_note: "Note du professeur",
      writing_legend_err: "erreur",
      writing_legend_fix: "correction",
      writing_offline: "L'enregistrement en ligne n'est pas disponible pour le moment.",
      writing_load_failed: "Impossible de charger ton travail précédent. Vérifie ta connexion et rouvre ce devoir.",
      writing_restored_local: "Nous avons récupéré du texte que tu n'avais pas encore enregistré.",
      admin_writing_heading: "Rédactions à corriger",
      admin_writing_filter_todo: "À corriger ({n})",
      admin_writing_filter_done: "Corrigées ({n})",
      admin_writing_filter_all: "Toutes ({n})",
      admin_writing_col_student: "Élève",
      admin_writing_col_task: "Devoir",
      admin_writing_col_attempt: "Tentative",
      admin_writing_col_sent: "Envoyé",
      admin_writing_col_status: "Statut",
      admin_writing_empty: "Rien pour le moment.",
      admin_writing_loading: "Chargement…",
      admin_writing_open_correct: "Corriger",
      admin_writing_open_view: "Voir / modifier",
      admin_writing_back: "Retour à la liste",
      admin_writing_original: "Texte original de l'élève",
      admin_writing_other_attempts: "Autres tentatives :",
      admin_writing_help: "Sélectionne des mots dans le texte, puis clique sur « Surligner l'erreur », ou écris la bonne version dans la case et clique sur « Surligner + corriger ». Tu peux aussi écrire directement dans le texte.",
      admin_writing_mark: "Surligner l'erreur",
      admin_writing_fix_placeholder: "Version corrigée…",
      admin_writing_mark_fix: "Surligner + corriger",
      admin_writing_unmark: "Retirer les marques",
      admin_writing_reset: "Recommencer depuis l'original",
      admin_writing_reset_confirm: "Supprimer toutes tes corrections et revenir au texte original de l'élève ?",
      admin_writing_select_first: "Sélectionne d'abord des mots dans le texte.",
      admin_writing_fix_needed: "Écris d'abord la bonne version dans la case.",
      admin_writing_note_label: "Note pour l'élève (facultatif)",
      admin_writing_save: "Enregistrer sans envoyer",
      admin_writing_send: "Envoyer la correction à l'élève",
      admin_writing_resend: "Mettre à jour la correction",
      admin_writing_send_confirm: "Envoyer cette correction à {name} ? L'élève la verra tout de suite.",
      admin_writing_saved: "Enregistré – pas encore visible par l'élève.",
      admin_writing_sent: "Correction envoyée ✓",
      admin_writing_failed: "Échec de l'enregistrement : {err}",
      admin_writing_unsaved_confirm: "Tu as des modifications non enregistrées. Quitter quand même ?",
      admin_writing_no_cloud: "Les corrections nécessitent que Supabase soit connecté.",
      admin_leaderboard_heading: "Classement des élèves",
      admin_leaderboard_empty: "Aucun élève trouvé.",
      admin_lb_col_rank: "Rang",
      admin_lb_col_name: "Nom",
      admin_lb_col_level: "Niveau",
      admin_lb_col_score: "Score",
      admin_lb_col_cards: "Cartes (×1)",
      admin_lb_col_quizzes: "Quiz (×5)",
      admin_lb_col_exercises: "Exercices (×10)",
      admin_lb_col_homework: "Devoirs (×3)",
      flashcard_deck_label: "Thème de vocabulaire",
      flashcard_prev: "Précédent",
      flashcard_next: "Suivant",
      flashcard_again: "À revoir",
      flashcard_got_it: "Je sais",
      flashcard_score_label: "Score : {correct}/{attempts}",
      flashcard_live_score: "{correct} bonnes réponses sur {total}",
      flashcard_session_progress: "{n} sur {total} cartes",
      flashcard_session_sample_hint:
        "Cette session te propose {n} cartes tirées au hasard parmi {total}. Choisis « Je sais » ou « À revoir » pour chaque carte.",
      flashcard_session_full_hint:
        "Cette session passe en revue les {n} cartes une fois. Choisis « Je sais » ou « À revoir » pour chaque carte.",
      flashcard_empty_deck: "Aucune carte dans ce paquet.",
      flashcard_pick_deck: "Choisis un autre thème ci-dessus.",
      flashcard_session_done_face: "Session terminée",
      flashcard_session_done_back:
        "Choisis une option dans le résumé, ou change de thème.",
      flashcard_complete_title: "Session terminée",
      flashcard_complete_summary:
        "Tu as {correct} bonnes réponses et {wrong} cartes à revoir, sur {total}.",
      flashcard_complete_msg_excellent: "Excellent ! Tu maîtrises bien ce paquet.",
      flashcard_complete_msg_good: "Bon travail, continue comme ça !",
      flashcard_complete_msg_review: "Continue à t'entraîner, tu vas y arriver !",
      learning_streak_hint_html:
        "Jours actifs d'affilée<br>Complète n'importe quelle activité pour continuer ta série",
      flashcard_complete_wrong_only: "Revoir les cartes ratées",
      flashcard_complete_full_again: "Recommencer tout le paquet",
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
        "Aucune carte enregistrée. Utilise le signet d’une carte pour l’enregistrer ici.",
      flashcard_remove_saved: "Retirer des cartes enregistrées",
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
      learning_landing_vocab: "Traverse le chemin de pierres, un mot à la fois",
      vocab_path_title: "Le chemin de pierres",
      vocab_path_meta: "Pierre {n} sur {t}",
      vocab_path_meta_done: "Les {t} pierres sont traversées",
      vocab_path_lap: "Tour {n}",
      vocab_path_difficulty: "Difficulté",
      vocab_path_pending: "{n} mots ratés t'attendent au bout de la file.",
      vocab_path_pending_one: "1 mot raté t'attend au bout de la file.",
      vocab_path_ask_fr: "Que veut dire ce mot en français ?",
      vocab_path_ask_en: "Comment dit-on ceci en anglais ?",
      vocab_path_review_hint: "Un mot que tu avais raté – réessaie !",
      vocab_path_correct: "Bravo ! +1 point – pierre suivante.",
      vocab_path_wrong: "Pas tout à fait : « {prompt} » = « {answer} ». Ce mot retourne au bout de la file.",
      vocab_path_continue: "Continuer",
      vocab_path_autosave: "Ta place est enregistrée automatiquement – arrête-toi quand tu veux. Astuce : utilise les touches 1 à 4 pour répondre.",
      vocab_path_guest: "Connecte-toi pour enregistrer ta place sur le chemin.",
      vocab_path_done_badge: "Section terminée ✓",
      vocab_path_done_title: "Tu as traversé les {t} pierres !",
      vocab_path_done_text: "Tu as bien répondu à tous les mots de ce niveau. Tu peux t'arrêter ici, ou refaire un tour – les mots reviendront dans la même progression douce.",
      vocab_path_next_lap: "Commencer le tour {n}",
      vocab_path_celebrate: "Vocabulaire terminé !",
      vocab_path_card_progress: "Pierre {n} / {t}",
      vocab_path_card_done: "Terminé ✓",
      learning_landing_grammar: "Exercices interactifs avec retour immédiat",
      learning_landing_homework: "Ta liste de devoirs et ton suivi",
      learning_landing_progress: "Ta série et ton activité",
      learning_landing_grammar_progress: "{n} sur {t} thèmes terminés",
      learning_landing_homework_progress: "{n} sur {t} tâches terminées",
      learning_landing_flashcards_progress: "{n} sessions terminées",
      learning_landing_vocab_progress: "{n} sessions de quiz",
      learning_back_to_menu: "← Retour au menu",
      learning_tab_progress: "Progrès",
      learning_progress_no_user:
        "Connecte-toi dans Compte pour suivre ta progression et ton activité.",
      learning_progress_stat_grammar_label: "Grammaire",
      learning_progress_stat_grammar: "{n} sur {t} thèmes terminés",
      learning_progress_stat_homework_label: "Devoirs",
      learning_progress_stat_homework: "{n} sur {t} tâches terminées",
      learning_progress_streak: "Série (jours)",
      learning_progress_flash_accuracy: "Précision (cartes mémoire)",
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
      learning_homework_week_hint: "Les barres regroupent les sessions de cartes mémoire et de vocabulaire.",
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
      learning_ex_undo_done: "Marquer comme non terminé",
      learning_topic_start_here: "Commence ici",
      learning_topics_completed_sep: "Terminés",
      learning_topics_back: "← Retour aux thèmes",
      learning_topics_what_learn: "Ce que tu vas apprendre",
      learning_topics_content: "Contenu de la leçon",
      learning_topics_key_vocab: "Vocabulaire clé",
      learning_topics_no_vocab:
        "Pas encore de paquet de cartes correspondant. Utilise l'onglet Cartes mémoire.",
      learning_topics_tasks: "Tes tâches",
      learning_exercise_examples_toggle: "Exemples et réponses modèles",
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
      learning_vocab_results_best: "Ton meilleur score : {pct}%",
      learning_vocab_results_new_record: "Nouveau record ! {pct}%",
      learning_vocab_results_msg_excellent: "Excellent travail, continue comme ça !",
      learning_vocab_results_msg_good: "Bon effort, tu progresses bien !",
      learning_vocab_results_msg_review: "Revois les cartes mémoire et réessaie, tu vas y arriver !",
      learning_vocab_results_retry: "Réessayer",
      learning_vocab_results_level_up: "Niveau supérieur",
      learning_vocab_missed_summary: "Voir les erreurs ({count})",
      learning_vocab_question_line: "Q{n} : {q} [{mode}]",
      learning_vocab_choose_prompt: "Score : {score}/{round} | Choisis une réponse pour continuer.",
      learning_vocab_correct_feedback: "Bonne réponse ! Score : {score}/{round}",
      learning_vocab_wrong_feedback: "Pas tout à fait. Bonne réponse : {answer} | Score : {score}/{round}",
      learning_vocab_challenge_line: "Défi : {task} Fais-le en 8 minutes.",
      learning_vocab_challenge_btn: "Donne-moi un défi au hasard",
      learning_vocab_done_btn: "Marquer ce thème de vocabulaire comme terminé",
      learning_exercise_topic_label: "Thème de l’exercice",
      learning_exercise_practice: "Tâche :",
      learning_exercise_extension: "Approfondissement :",
      learning_exercise_homework: "Devoirs :",
      learning_exercise_extension_default: "Invente 5 exemples supplémentaires.",
      learning_exercise_homework_default: "Envoie tes réponses finales avant le prochain cours.",
      learning_exercise_done_btn: "Marquer cet exercice comme terminé",
      learning_exercise_saved_ok: "Enregistré dans ta progression.",
      learning_exercise_saved_auth: "Connecte-toi dans la section Compte pour suivre la progression.",
      learning_exercise_saved_exists: "Déjà marqué comme terminé.",
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
      learning_gap_correct: "Bonne réponse !",
      learning_gap_incorrect: "Pas tout à fait. La bonne réponse est : {answer}",
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
      booking_hour_range: "{start} h – {end} h",
      booking_sold_out: "Complet",
      booking_day_full_note: "Tous les créneaux de ce jour sont pris. Choisissez un autre jour.",
      account_metric_flash_accuracy: "Précision (cartes mémoire) : {correct}/{attempts} ({pct})",
      account_metric_quiz_sessions: "Séances de quiz terminées : {n}",
      account_metric_exercises_done: "Exercices terminés : {n}",
      account_metric_quiz_best: "Meilleur score {mode} : {pct} %",
    },
  };

  /* French by default on every visit. Choosing English only lasts for the current browser tab. */
  function getLang() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "en" ? "en" : "fr";
    } catch (e) {
      return "fr";
    }
  }

  function setLang(lang) {
    const next = lang === "fr" ? "fr" : "en";
    if (next === getLang()) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
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
      if (!key) return;
      const s = STRINGS[L][key] != null ? STRINGS[L][key] : STRINGS.en[key];
      if (s != null) el.textContent = s;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      const s = STRINGS[L][key] != null ? STRINGS[L][key] : STRINGS.en[key];
      if (s != null) el.innerHTML = s;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const s = STRINGS[L][key] != null ? STRINGS[L][key] : STRINGS.en[key];
      if (s != null) el.setAttribute("placeholder", s);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      const s = STRINGS[L][key] != null ? STRINGS[L][key] : STRINGS.en[key];
      if (s != null) el.setAttribute("aria-label", s);
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
      if (!key) return;
      const s = STRINGS[L][key] != null ? STRINGS[L][key] : STRINGS.en[key];
      if (s != null) el.setAttribute("title", s);
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
