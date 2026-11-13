/* French course grammar (for English speakers): lessons + gap-fill practice.
 * Same shape as the English course's exercises:
 *   introFr  = the lesson (explained in English); lines after |||EXAMPLES||| are shown as examples
 *   examples = gap-fill questions "n) sentence with ___ -> answer"
 *              (a hint at the very end of a sentence is hidden, so verb hints go right after the gap)
 */
window.ANDRONICUS_FRENCH_GRAMMAR = {
  beginner: [
    {
      topic: "Gender and articles (le, la, les, un, une, des)",
      subtitle: "le chat, la maison, des amis",
      introFr:
        "Every French noun is either masculine or feminine, and the article in front of it tells you which. There is no reliable rule, so always learn a noun together with its article.\n\nThe (definite): le (masculine), la (feminine), l' (before a vowel or silent h), les (plural).\nA / some (indefinite): un (masculine), une (feminine), des (plural).\n\nUse le / la / les for things in general and for likes and dislikes: J'aime le chocolat (I like chocolate), even where English has no article.\n\n|||EXAMPLES|||\nle livre, la table, l'arbre, les enfants\nun chien, une voiture, des pommes\nJ'adore la musique.\nIl y a un chat dans le jardin.",
      examples: [
        "1) ___ (the) soleil brille aujourd'hui. -> Le",
        "2) Elle mange ___ (an) pomme. -> une",
        "3) Nous avons ___ (some) amis à Paris. -> des",
        "4) J'adore ___ musique classique. -> la",
        "5) Il a ___ (a) chien noir. -> un",
        "6) ___ (the) enfants jouent dans le parc. -> Les",
        "7) Où est ___ (the) hôpital ? -> l'",
        "8) C'est ___ (the) maison de mon oncle. -> la",
        "9) Tu veux ___ (a) café ? -> un",
        "10) Je n'aime pas ___ légumes. -> les",
      ],
      practice:
        "Write 10 nouns you know with le or la, then with un or une. Colour-code them: one colour for masculine, one for feminine. Say each one aloud with its article.",
    },
    {
      topic: "Être and avoir in the present",
      subtitle: "je suis, j'ai",
      introFr:
        "Être (to be) and avoir (to have) are the two most important verbs in French. Both are irregular, so learn them by heart.\n\nÊtre: je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont.\nAvoir: j'ai, tu as, il/elle/on a, nous avons, vous avez, ils/elles ont.\n\nCareful: French uses avoir where English uses 'to be' for age and some feelings: j'ai 14 ans (I am 14), j'ai faim (I'm hungry), j'ai froid (I'm cold), j'ai peur (I'm scared).\n\n|||EXAMPLES|||\nJe suis irlandais.\nNous sommes en retard.\nElle a deux frères.\nIls ont soif.",
      examples: [
        "1) Je ___ (être) fatigué ce soir. -> suis",
        "2) Tu ___ (avoir) quel âge ? -> as",
        "3) Nous ___ (être) dans la cuisine. -> sommes",
        "4) Elles ___ (avoir) un chat et un chien. -> ont",
        "5) Vous ___ (être) très gentils. -> êtes",
        "6) Il ___ (avoir) faim. -> a",
        "7) Mes parents ___ (être) au travail. -> sont",
        "8) Nous ___ (avoir) cours de français lundi. -> avons",
        "9) Tu ___ (être) prêt ? -> es",
        "10) Vous ___ (avoir) des frères ou des sœurs ? -> avez",
      ],
      practice:
        "Write 8 sentences about yourself and your family: 4 with être (nationality, personality, where you are) and 4 with avoir (age, pets, brothers and sisters, feelings like faim or peur).",
    },
    {
      topic: "Regular -er verbs in the present",
      subtitle: "parler: je parle, nous parlons",
      introFr:
        "Most French verbs end in -er, and nearly all of them follow the same pattern. Take off -er and add the endings:\n\nje parle, tu parles, il/elle/on parle, nous parlons, vous parlez, ils/elles parlent.\n\nThe -e, -es and -ent endings are all silent, so je parle, tu parles and ils parlent sound exactly the same. Before a vowel, je becomes j': j'aime, j'habite.\n\nThe French present covers both 'I speak' and 'I am speaking'.\n\n|||EXAMPLES|||\nJe regarde la télé.\nTu habites à Dublin ?\nNous jouons au foot le samedi.\nIls écoutent de la musique.",
      examples: [
        "1) Je ___ (parler) anglais et français. -> parle",
        "2) Tu ___ (regarder) un film ? -> regardes",
        "3) Nous ___ (jouer) au tennis. -> jouons",
        "4) Vous ___ (habiter) où ? -> habitez",
        "5) Elles ___ (chanter) très bien. -> chantent",
        "6) Il ___ (travailler) dans un bureau. -> travaille",
        "7) Tu ___ (aimer) le chocolat ? -> aimes",
        "8) Nous ___ (manger) à midi. -> mangeons",
        "9) Mes amis ___ (écouter) de la musique. -> écoutent",
        "10) Vous ___ (danser) le samedi soir ? -> dansez",
      ],
      practice:
        "Choose 5 -er verbs (jouer, regarder, écouter, manger, habiter…) and write them out in full for all six persons. Then write one true sentence about your week with each verb.",
    },
    {
      topic: "Negation (ne… pas)",
      subtitle: "Je ne parle pas",
      introFr:
        "To make a sentence negative, wrap ne… pas around the verb: ne goes before the verb and pas after it. Before a vowel, ne becomes n'.\n\nAfter a negative, un, une and des usually become de (d'): J'ai un chien → Je n'ai pas de chien.\n\nOther negatives work the same way: ne… jamais (never), ne… plus (no longer), ne… rien (nothing).\n\nIn everyday speech French people often drop the ne (je sais pas), but always write it.\n\n|||EXAMPLES|||\nJe ne mange pas de viande.\nIl n'aime pas le sport.\nNous ne regardons jamais la télé.\nElle n'habite plus à Paris.",
      examples: [
        "1) Je ___ parle pas espagnol. -> ne",
        "2) Il ___ aime pas les maths. -> n'",
        "3) Nous ne mangeons ___ (not) de viande. -> pas",
        "4) Je n'ai pas ___ frère. -> de",
        "5) Elle ne va ___ (never) au cinéma, elle déteste ça. -> jamais",
        "6) Tu ne fais ___ (nothing) ce week-end ? -> rien",
        "7) Ils n'habitent ___ (no longer) ici, ils ont déménagé. -> plus",
        "8) Vous n'avez pas ___ animaux ? -> d'",
        "9) On ___ est pas en retard. -> n'",
        "10) Je ne bois jamais ___ café. -> de",
      ],
      practice:
        "Write 8 things you don't do or don't have, using ne… pas, ne… jamais and ne… plus. Remember to change un/une/des to de.",
    },
    {
      topic: "Adjective agreement and position",
      subtitle: "un petit chat, une maison blanche",
      introFr:
        "French adjectives agree with the noun: add -e for feminine and -s for plural (-es for feminine plural). If the adjective already ends in -e, it doesn't change for feminine: rouge, jeune.\n\nSome common irregular forms: beau → belle, nouveau → nouvelle, vieux → vieille, blanc → blanche, gentil → gentille, heureux → heureuse.\n\nMost adjectives go after the noun: un pull rouge. A few short, common ones go before: beau, joli, petit, grand, jeune, vieux, bon, mauvais, nouveau.\n\n|||EXAMPLES|||\nun garçon intelligent, une fille intelligente\ndes chiens noirs, des voitures noires\nune petite maison\nun vieil ami, une vieille amie",
      examples: [
        "1) Ma sœur est très ___ (grand). -> grande",
        "2) J'ai deux chats ___ (noir) à la maison. -> noirs",
        "3) Elle porte une robe ___ (blanc) aujourd'hui. -> blanche",
        "4) C'est une ___ (beau) journée. -> belle",
        "5) Mes amies sont ___ (gentil) avec moi. -> gentilles",
        "6) Nous avons une ___ (nouveau) voiture. -> nouvelle",
        "7) Ma grand-mère est une femme ___ (heureux) et calme. -> heureuse",
        "8) Il habite dans une ___ (vieux) maison. -> vieille",
        "9) Les fleurs ___ (bleu) sont dans le jardin. -> bleues",
        "10) Mes frères sont ___ (petit) pour leur âge. -> petits",
      ],
      practice:
        "Describe three people you know (looks and personality) in 4 sentences each. Use at least one adjective that goes before the noun and check every ending agrees.",
    },
    {
      topic: "Asking questions",
      subtitle: "Est-ce que… ? Où… ? Quand… ?",
      introFr:
        "There are three ways to ask a yes/no question in French:\n1. Raise your voice at the end: Tu aimes le foot ?\n2. Put est-ce que at the start: Est-ce que tu aimes le foot ?\n3. Swap the verb and subject (inversion, more formal): Aimes-tu le foot ?\n\nQuestion words: où (where), quand (when), comment (how), pourquoi (why), combien (how much/many), qui (who), que / qu'est-ce que (what), quel/quelle (which).\n\nQuel agrees with its noun: quel livre, quelle heure, quels films, quelles chansons.\n\n|||EXAMPLES|||\nOù est-ce que tu habites ?\nPourquoi tu ris ?\nQuelle heure est-il ?\nQu'est-ce que tu fais ce soir ?",
      examples: [
        "1) ___ est-ce que tu habites ? À Lyon. -> Où",
        "2) ___ tu t'appelles ? Je m'appelle Paul. -> Comment",
        "3) ___ heure est-il ? -> Quelle",
        "4) ___ tu ne manges pas ? Parce que je n'ai pas faim. -> Pourquoi",
        "5) ___ est-ce que tu as de frères ? -> Combien",
        "6) ___ est ton anniversaire ? En mai. -> Quand",
        "7) ___ est-ce que tu fais ce week-end ? -> Qu'",
        "8) ___ est ton prof de maths ? M. Martin. -> Qui",
        "9) ___ film tu veux voir ? -> Quel",
        "10) ___ tu aimes le chocolat ? Oui, beaucoup ! -> Est-ce que",
      ],
      practice:
        "Write 10 questions you could ask a new French penfriend, using at least 6 different question words. Then answer them yourself.",
    },
    {
      topic: "Aller and the near future",
      subtitle: "je vais, je vais manger",
      introFr:
        "Aller (to go) is irregular: je vais, tu vas, il/elle/on va, nous allons, vous allez, ils/elles vont.\n\nWith places, à changes with the article: à + le = au, à + les = aux (à la and à l' don't change): Je vais au cinéma, à la piscine, à l'école, aux magasins.\n\nThe near future (le futur proche) is aller + infinitive, just like 'going to' in English: Je vais manger (I'm going to eat). For the negative, wrap ne… pas around aller: Je ne vais pas sortir.\n\n|||EXAMPLES|||\nNous allons à la plage.\nTu vas au collège à pied ?\nIls vont regarder le match.\nDemain, je vais faire mes devoirs.",
      examples: [
        "1) Je ___ (aller) au cinéma ce soir. -> vais",
        "2) Nous ___ (aller) à la piscine samedi. -> allons",
        "3) Ils ___ (aller) aux États-Unis cet été. -> vont",
        "4) Tu ___ (aller) faire tes devoirs ? -> vas",
        "5) Vous ___ (aller) bien ? -> allez",
        "6) Elle ___ (aller) partir demain matin. -> va",
        "7) On va ___ cinéma ? -> au",
        "8) Je vais ___ magasins avec ma mère. -> aux",
        "9) Il va ___ école en bus. -> à l'",
        "10) Demain, nous allons ___ (jouer) au foot. -> jouer",
      ],
      practice:
        "Write your plans for next weekend: 8 sentences with the near future (je vais + infinitive), and say where you are going with au, à la, à l' or aux.",
    },
    {
      topic: "Possessive adjectives",
      subtitle: "mon, ma, mes, ton, ta, tes…",
      introFr:
        "Possessive adjectives agree with the thing owned, not the owner. So sa mère can mean 'his mother' or 'her mother'.\n\nmy: mon (m.), ma (f.), mes (pl.)\nyour (tu): ton, ta, tes\nhis/her/its: son, sa, ses\nour: notre, notre, nos\nyour (vous): votre, votre, vos\ntheir: leur, leur, leurs\n\nBefore a feminine noun starting with a vowel, use mon/ton/son to make it easier to say: mon amie, ton école, son histoire.\n\n|||EXAMPLES|||\nmon frère, ma sœur, mes parents\nC'est son vélo. (his or her bike)\nnotre maison, nos voisins\nleur fille, leurs enfants",
      examples: [
        "1) J'adore ___ (my) chien, il s'appelle Max. -> mon",
        "2) Tu as ___ (your, tu) clés ? -> tes",
        "3) Paul cherche ___ (his) sœur. -> sa",
        "4) Nous aimons ___ (our) prof de français. -> notre",
        "5) Ils habitent avec ___ (their) grands-parents. -> leurs",
        "6) ___ (my) amie Léa vient ce soir. -> Mon",
        "7) Vous avez ___ (your, vous) passeport ? -> votre",
        "8) Marie a perdu ___ (her) téléphone. -> son",
        "9) Ce sont ___ (my) livres, pas les tiens. -> mes",
        "10) Les enfants rangent ___ (their) chambre. -> leur",
      ],
      practice:
        "Draw your family tree and label it with French sentences: C'est mon père, ma tante, mes cousins… Then describe a friend's family using son, sa and ses.",
    },
  ],

  intermediate: [
    {
      topic: "The passé composé with avoir",
      subtitle: "j'ai mangé, il a fini",
      introFr:
        "The passé composé is the main past tense for completed actions: 'I ate', 'I have eaten'. It is made of two parts: avoir in the present + the past participle.\n\nPast participles: -er → -é (manger → mangé), -ir → -i (finir → fini), -re → -u (vendre → vendu).\nCommon irregular participles: avoir → eu, être → été, faire → fait, prendre → pris, mettre → mis, voir → vu, boire → bu, lire → lu, écrire → écrit, dire → dit, pouvoir → pu, vouloir → voulu.\n\nIn the negative, ne… pas goes around avoir: Je n'ai pas fini.\n\n|||EXAMPLES|||\nJ'ai regardé un film hier.\nNous avons fini nos devoirs.\nIl a pris le train.\nElles n'ont pas vu le match.",
      examples: [
        "1) Hier, j'ai ___ (manger) une pizza. -> mangé",
        "2) Nous avons ___ (finir) le travail. -> fini",
        "3) Tu as ___ (faire) tes devoirs ? -> fait",
        "4) Il a ___ (prendre) le bus ce matin. -> pris",
        "5) Elles ont ___ (voir) un bon film. -> vu",
        "6) J'ai ___ (boire) trop de café. -> bu",
        "7) Vous avez ___ (lire) ce livre ? -> lu",
        "8) Il a ___ (écrire) une lettre à sa grand-mère. -> écrit",
        "9) Nous avons ___ (attendre) le bus pendant une heure. -> attendu",
        "10) J'ai ___ (mettre) mon manteau. -> mis",
      ],
      practice:
        "Write a short diary entry about last Saturday (10 sentences) using the passé composé with avoir. Use at least 5 irregular past participles.",
    },
    {
      topic: "The passé composé with être",
      subtitle: "je suis allé(e), elles sont parties",
      introFr:
        "Some verbs use être instead of avoir in the passé composé. They are mostly verbs of movement or change of state: aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître, mourir, rester, tomber, retourner, revenir, devenir. All reflexive verbs also use être.\n\nWith être, the past participle agrees with the subject like an adjective: add -e for feminine and -s for plural.\n\n|||EXAMPLES|||\nJe suis allé au cinéma. (a boy speaking)\nJe suis allée au cinéma. (a girl speaking)\nNous sommes partis à 8 heures.\nElles sont arrivées en retard.",
      examples: [
        "1) Marie est ___ (aller) à Paris. -> allée",
        "2) Nous ___ (être) partis tôt ce matin. -> sommes",
        "3) Les filles sont ___ (arriver) à midi. -> arrivées",
        "4) Il est ___ (tomber) dans la rue. -> tombé",
        "5) Mes parents sont ___ (sortir) hier soir. -> sortis",
        "6) Je ___ (être) né à Dublin. -> suis",
        "7) Elle est ___ (rester) à la maison. -> restée",
        "8) Tu ___ (être) venu en bus ? -> es",
        "9) Ils sont ___ (monter) au dernier étage. -> montés",
        "10) Ma grand-mère est ___ (naître) en 1950. -> née",
      ],
      practice:
        "Tell the story of a day trip in 10 sentences. Mix verbs with avoir and with être, and check every être participle agrees with its subject.",
    },
    {
      topic: "Imparfait vs passé composé",
      subtitle: "je regardais… quand il a sonné",
      introFr:
        "The imparfait describes the background in the past: what things were like, what used to happen, what was going on. The passé composé tells you the events: what happened, once and completed.\n\nImparfait: take the nous form of the present, remove -ons, add -ais, -ais, -ait, -ions, -iez, -aient (nous finissons → je finissais). Only être is irregular: j'étais.\n\nA useful pattern: imparfait (what was going on) + quand + passé composé (what interrupted it).\n\n|||EXAMPLES|||\nQuand j'étais petit, j'habitais à Cork.\nIl faisait beau et les enfants jouaient.\nJe regardais la télé quand le téléphone a sonné.\nHier, j'ai vu Paul au marché.",
      examples: [
        "1) Quand j'___ (être) petit, j'avais un chien. -> étais",
        "2) Il ___ (faire) beau, alors nous sommes sortis. -> faisait",
        "3) Je dormais quand tu ___ (téléphoner). -> as téléphoné",
        "4) Avant, nous ___ (habiter) à la campagne. -> habitions",
        "5) Hier soir, ils ___ (regarder) un film d'horreur. -> ont regardé",
        "6) Elle lisait quand son frère ___ (entrer) dans la chambre. -> est entré",
        "7) Tous les étés, on ___ (aller) à la plage. -> allait",
        "8) Vous ___ (avoir) peur des chiens quand vous étiez jeunes ? -> aviez",
        "9) Soudain, la lumière ___ (s'éteindre). -> s'est éteinte",
        "10) Les enfants ___ (jouer) dans le jardin quand il a commencé à pleuvoir. -> jouaient",
      ],
      practice:
        "Write a short story (12 sentences) that starts with 'Il était une fois…' or 'C'était un samedi matin…'. Underline background in one colour (imparfait) and events in another (passé composé).",
    },
    {
      topic: "Reflexive verbs",
      subtitle: "je me lève, ils se sont couchés",
      introFr:
        "Reflexive verbs have an extra pronoun that refers back to the subject. Many describe daily routine: se lever (to get up), se laver (to wash), s'habiller (to get dressed), se coucher (to go to bed).\n\nThe pronoun changes with the subject: je me, tu te, il/elle/on se, nous nous, vous vous, ils/elles se. Me, te and se become m', t', s' before a vowel.\n\nIn the passé composé they take être, and the participle agrees: Elle s'est levée tôt.\n\n|||EXAMPLES|||\nJe me lève à 7 heures.\nTu te couches tard ?\nNous nous amusons bien.\nIls se sont disputés hier.",
      examples: [
        "1) Je ___ lève à sept heures. -> me",
        "2) Tu ___ couches à quelle heure ? -> te",
        "3) Elle ___ (herself) habille très vite. -> s'",
        "4) Nous ___ dépêchons pour ne pas rater le bus. -> nous",
        "5) Vous ___ brossez les dents après le repas ? -> vous",
        "6) Les enfants ___ (themselves) amusent dans le jardin. -> s'",
        "7) Ce matin, elle s'est ___ (réveiller) tard. -> réveillée",
        "8) Nous nous sommes ___ (promener) au bord de la mer. -> promenés",
        "9) Je ne ___ ennuie jamais avec toi. -> m'",
        "10) Ils ___ (se reposer) après le match. -> se reposent",
      ],
      practice:
        "Describe your typical school day from waking up to going to bed with at least 8 reflexive verbs. Then rewrite it in the passé composé as 'yesterday'.",
    },
    {
      topic: "Direct and indirect object pronouns",
      subtitle: "je le vois, je lui parle",
      introFr:
        "Object pronouns replace a noun to avoid repeating it, and in French they go before the verb.\n\nDirect (answers 'what?' or 'whom?'): me, te, le, la, nous, vous, les. Je vois Marie → Je la vois.\nIndirect (replaces à + person): me, te, lui, nous, vous, leur. Je parle à Marie → Je lui parle.\n\nLe and la become l' before a vowel. In the passé composé the pronoun goes before avoir: Je l'ai vu.\n\nVerbs that take à + person in French include parler à, téléphoner à, donner à, dire à, écrire à, répondre à.\n\n|||EXAMPLES|||\nTu connais Paul ? Oui, je le connais.\nJ'aime ces chaussures, je les achète.\nJ'écris à ma grand-mère. Je lui écris.\nJe téléphone à mes parents. Je leur téléphone.",
      examples: [
        "1) Tu vois le bus ? Oui, je ___ vois. -> le",
        "2) Tu aimes cette chanson ? Oui, je ___ adore. -> l'",
        "3) Tu as tes clés ? Non, je ne ___ trouve pas. -> les",
        "4) Tu parles à ton frère ? Oui, je ___ parle tous les jours. -> lui",
        "5) Tu téléphones à tes parents ? Oui, je ___ téléphone ce soir. -> leur",
        "6) Il ___ invite à sa fête, toi et moi ! -> nous",
        "7) Tu as vu Sophie ? Oui, je l'ai ___ (voir) hier. -> vue",
        "8) Je ___ donne mon numéro, comme ça tu peux m'appeler. -> te",
        "9) Tu fais la vaisselle ? Oui, je ___ fais tout de suite. -> la",
        "10) Le prof ___ explique la leçon, à vous et à vos camarades. -> vous",
      ],
      practice:
        "Write 8 short question-and-answer pairs where the answer uses a pronoun instead of repeating the noun (Tu regardes la télé ? Oui, je la regarde.). Use both direct and indirect pronouns.",
    },
    {
      topic: "The future tense",
      subtitle: "je parlerai, nous irons",
      introFr:
        "The futur simple says what will happen. For most verbs, take the infinitive (drop the final -e of -re verbs) and add the endings -ai, -as, -a, -ons, -ez, -ont: je parlerai, tu finiras, il vendra.\n\nCommon irregular stems (same endings): être → ser-, avoir → aur-, aller → ir-, faire → fer-, venir → viendr-, voir → verr-, pouvoir → pourr-, vouloir → voudr-, devoir → devr-, savoir → saur-.\n\nAfter quand, French uses the future where English uses the present: Quand je serai grand… (When I grow up…).\n\n|||EXAMPLES|||\nDemain, il pleuvra.\nNous irons en Espagne l'année prochaine.\nTu auras ton permis à 18 ans.\nQuand j'aurai le temps, je t'appellerai.",
      examples: [
        "1) L'année prochaine, je ___ (parler) mieux français. -> parlerai",
        "2) Nous ___ (aller) à Rome cet été. -> irons",
        "3) Tu ___ (être) là à huit heures ? -> seras",
        "4) Ils ___ (avoir) les résultats lundi. -> auront",
        "5) Elle ___ (faire) ses devoirs plus tard. -> fera",
        "6) Vous ___ (venir) avec nous ? -> viendrez",
        "7) Je te ___ (voir) demain au collège. -> verrai",
        "8) Quand il ___ (pouvoir), il viendra nous aider. -> pourra",
        "9) Nous ___ (finir) le projet vendredi. -> finirons",
        "10) Demain, il ___ (pleuvoir) toute la journée. -> pleuvra",
      ],
      practice:
        "Write 10 predictions about your life in 15 years (où tu habiteras, ton métier, ta famille…) using the futur simple, with at least 5 irregular verbs.",
    },
    {
      topic: "Partitive articles (du, de la, des)",
      subtitle: "du pain, de l'eau, pas de lait",
      introFr:
        "When you talk about an unspecified amount of something ('some', or no word at all in English), French uses the partitive article: du (masculine), de la (feminine), de l' (before a vowel), des (plural).\n\nJe mange du pain = I eat (some) bread.\n\nAfter a negative, and after expressions of quantity (beaucoup de, un peu de, un kilo de, une bouteille de, assez de, trop de), it becomes just de / d': Je ne mange pas de pain. Un kilo de pommes.\n\nWith verbs of liking (aimer, adorer, détester), use le/la/les instead: J'aime le pain.\n\n|||EXAMPLES|||\nJe voudrais du fromage.\nTu bois de l'eau ?\nElle achète des œufs et de la farine.\nIl n'y a plus de lait.",
      examples: [
        "1) Le matin, je bois ___ thé. -> du",
        "2) Tu veux ___ confiture sur ton pain ? -> de la",
        "3) Il faut acheter ___ œufs pour le gâteau. -> des",
        "4) Je ne mange pas ___ viande. -> de",
        "5) Nous buvons ___ eau minérale. -> de l'",
        "6) Elle a acheté un kilo ___ tomates. -> de",
        "7) Il y a beaucoup ___ monde ici. -> de",
        "8) J'adore ___ chocolat noir. -> le",
        "9) On n'a plus ___ argent. -> d'",
        "10) Tu as ___ chance ! -> de la",
      ],
      practice:
        "Write a shopping list for a picnic for 6 people with quantities (un paquet de, une bouteille de…), then write 6 sentences about what you eat and don't eat for breakfast.",
    },
    {
      topic: "Comparatives and superlatives",
      subtitle: "plus grand que, le meilleur",
      introFr:
        "To compare: plus… que (more… than), moins… que (less… than), aussi… que (as… as). The adjective still agrees: Ma sœur est plus grande que moi.\n\nSuperlative: le/la/les plus… (the most…), le/la/les moins… (the least…): C'est la ville la plus belle du monde.\n\nIrregular forms: bon → meilleur (better) → le meilleur (the best); bien → mieux (better, adverb) → le mieux. Never say 'plus bon'.\n\nWith nouns, use plus de / moins de / autant de: J'ai plus de devoirs que toi.\n\n|||EXAMPLES|||\nLe train est plus rapide que le bus.\nCe film est moins intéressant que le livre.\nElle chante mieux que moi.\nC'est le meilleur restaurant de la ville.",
      examples: [
        "1) Paris est ___ grand que Lyon. -> plus",
        "2) Ce gâteau est ___ que l'autre, il est délicieux. -> meilleur",
        "3) Elle parle anglais ___ que son frère. -> mieux",
        "4) Le vélo est ___ rapide que la voiture. -> moins",
        "5) Je suis ___ grand que mon père : on fait la même taille. -> aussi",
        "6) C'est la ___ chanson de l'album, je l'adore. -> meilleure",
        "7) J'ai ___ de devoirs que toi ce soir, je n'ai pas fini ! -> plus",
        "8) C'est le bâtiment le ___ haut de la ville. -> plus",
        "9) Il a ___ de frères que de sœurs : deux et deux. -> autant",
        "10) Ce sont les ___ élèves de la classe. -> meilleurs",
      ],
      practice:
        "Compare two cities, two sports and two films you know in 9 sentences, using plus, moins, aussi, meilleur and mieux. Finish with three superlatives about your own town.",
    },
  ],

  advanced: [
    {
      topic: "The present subjunctive",
      subtitle: "il faut que tu viennes",
      introFr:
        "The subjunctive is used after expressions of necessity, wish, emotion and doubt, when the subject of the second verb is different: Je veux que tu viennes (I want you to come).\n\nFormation: take the ils form of the present, remove -ent and add -e, -es, -e, -ions, -iez, -ent (ils finissent → que je finisse).\nMain irregulars: être (que je sois, que nous soyons), avoir (que j'aie), aller (que j'aille), faire (que je fasse), pouvoir (que je puisse), savoir (que je sache), vouloir (que je veuille).\n\nCommon triggers: il faut que, vouloir que, préférer que, être content / triste que, avoir peur que, douter que, bien que, pour que, avant que.\n\n|||EXAMPLES|||\nIl faut que tu fasses tes devoirs.\nJe suis content que vous soyez là.\nElle veut que nous partions tôt.\nBien qu'il pleuve, on sort.",
      examples: [
        "1) Il faut que tu ___ (faire) attention. -> fasses",
        "2) Je veux que vous ___ (être) à l'heure. -> soyez",
        "3) Mes parents préfèrent que j'___ (aller) au lycée à pied. -> aille",
        "4) Je suis contente que tu ___ (venir) ce soir. -> viennes",
        "5) Il faut que nous ___ (finir) avant midi. -> finissions",
        "6) Bien qu'il ___ (avoir) raison, personne ne l'écoute. -> ait",
        "7) Elle a peur que son frère ne ___ (pouvoir) pas venir. -> puisse",
        "8) Je doute qu'ils ___ (savoir) la réponse. -> sachent",
        "9) Le prof répète pour que nous ___ (comprendre). -> comprenions",
        "10) Partons avant qu'il ne ___ (pleuvoir). -> pleuve",
      ],
      practice:
        "Write 10 pieces of advice for a new student at your school beginning with Il faut que…, Il est important que… or Je conseille que…, using at least 5 irregular subjunctives.",
    },
    {
      topic: "The conditional and si clauses",
      subtitle: "si j'avais le temps, je voyagerais",
      introFr:
        "The conditional (would…) uses the future stem + the imparfait endings: -ais, -ais, -ait, -ions, -iez, -aient: je parlerais, nous irions, ils seraient.\n\nSi clauses follow fixed tense patterns:\n• si + present → future: Si tu viens, on ira au cinéma.\n• si + imparfait → conditional: Si j'avais de l'argent, j'achèterais une moto.\n• si + plus-que-parfait → past conditional: Si j'avais su, je serais venu.\n\nNever use the future or conditional directly after si (meaning 'if').\n\nThe conditional is also used for polite requests: Je voudrais…, Pourriez-vous… ?\n\n|||EXAMPLES|||\nSi j'étais riche, je ferais le tour du monde.\nSi tu travailles, tu réussiras.\nJe voudrais un café, s'il vous plaît.\nS'il avait plu, nous serions restés à la maison.",
      examples: [
        "1) Si j'avais le temps, je ___ (voyager) plus. -> voyagerais",
        "2) Si tu viens, nous ___ (aller) à la plage. -> irons",
        "3) Si nous ___ (être) riches, nous achèterions une grande maison. -> étions",
        "4) Est-ce que vous ___ (vouloir) un peu plus de thé ? -> voudriez",
        "5) S'il ___ (faire) beau demain, on fera un pique-nique. -> fait",
        "6) Si j'avais su, je ne ___ pas venu. -> serais",
        "7) Elle ___ (pouvoir) réussir si elle travaillait plus. -> pourrait",
        "8) Si vous ___ (avoir) besoin d'aide, appelez-moi. -> avez",
        "9) Qu'est-ce que tu ___ (faire) à ma place ? -> ferais",
        "10) S'ils étaient partis plus tôt, ils n'___ pas raté le train. -> auraient",
      ],
      practice:
        "Answer in 3-4 sentences each: Que ferais-tu si tu gagnais au loto ? Si tu pouvais vivre dans un autre pays ? Si tu étais ministre de l'Éducation ? Then write 3 regrets with si + plus-que-parfait.",
    },
    {
      topic: "Relative pronouns (qui, que, dont, où)",
      subtitle: "le livre dont je parle",
      introFr:
        "Relative pronouns join two ideas and avoid repetition.\n\nqui: the subject of the next verb (who / which / that): L'homme qui parle est mon oncle.\nque (qu'): the object (whom / which / that), followed by a new subject: Le film que j'ai vu était génial.\ndont: replaces de + noun (of which / whose / about which): C'est le livre dont je t'ai parlé (parler de).\noù: place or time (where / when): La ville où je suis né. Le jour où il est arrivé.\n\nAfter a preposition, use lequel / laquelle / lesquels / lesquelles for things (la table sur laquelle…) and qui for people (l'ami avec qui…).\n\n|||EXAMPLES|||\nC'est une amie qui habite à Nice.\nLa robe que tu portes est jolie.\nVoici le prof dont tout le monde parle.\nC'est le café où on s'est rencontrés.",
      examples: [
        "1) Le garçon ___ joue de la guitare s'appelle Hugo. -> qui",
        "2) Le livre ___ je lis est passionnant. -> que",
        "3) C'est le film ___ tout le monde parle. -> dont",
        "4) La ville ___ j'ai grandi est au bord de la mer. -> où",
        "5) Voici le garçon à ___ j'ai prêté mon livre. -> qui",
        "6) La chanson ___ elle chante est triste. -> qu'",
        "7) J'ai besoin d'un ordinateur. C'est l'ordinateur ___ j'ai besoin. -> dont",
        "8) Le jour ___ il est né, il neigeait. -> où",
        "9) C'est la raison pour ___ je suis parti. -> laquelle",
        "10) Les élèves ___ réussissent sont ceux qui travaillent. -> qui",
      ],
      practice:
        "Write 8 definitions in French without naming the thing, using a different relative pronoun each time (C'est un endroit où…, C'est une personne qui…, C'est un objet dont…). Swap with a partner and guess.",
    },
    {
      topic: "The pronouns y and en",
      subtitle: "j'y vais, j'en veux",
      introFr:
        "Y replaces à + a place or thing (there / about it): Tu vas à Paris ? Oui, j'y vais. Tu penses à ton examen ? Oui, j'y pense.\n\nEn replaces de + noun, and anything with a quantity (some / of it / of them): Tu veux du gâteau ? Oui, j'en veux. Tu as des frères ? Oui, j'en ai deux.\n\nBoth go before the verb (before avoir in the passé composé): J'y suis allé. J'en ai mangé.\nWith people after à, use lui / leur instead of y: Je pense à ma sœur → Je pense à elle.\n\nFixed expressions: il y a, allons-y, je m'en vais (I'm off), je n'en peux plus (I can't take any more).\n\n|||EXAMPLES|||\nOn va au cinéma ? Oui, on y va !\nCombien de croissants ? J'en prends trois.\nTu as besoin de mon stylo ? Non, je n'en ai pas besoin.\nElle habite en Italie depuis longtemps ; elle y est heureuse.",
      examples: [
        "1) Tu vas à la piscine ce soir ? Oui, j'___ vais. -> y",
        "2) Tu veux de la soupe ? Oui, j'___ veux bien. -> en",
        "3) Tu as des cousins ? Oui, j'___ ai cinq. -> en",
        "4) Tu penses à tes vacances ? Oui, j'___ pense souvent. -> y",
        "5) Il parle de son voyage ? Oui, il ___ parle tout le temps. -> en",
        "6) Vous êtes allés au Canada ? Oui, nous ___ sommes allés l'an dernier. -> y",
        "7) Elle a mangé des fraises ? Oui, elle ___ a mangé beaucoup. -> en",
        "8) Tu réponds à la lettre ? Oui, j'___ réponds demain. -> y",
        "9) Il y a du lait ? Non, il n'y ___ a plus. -> en",
        "10) Vous vous intéressez à la politique ? Oui, je m'___ intéresse. -> y",
      ],
      practice:
        "Write 10 question-and-answer pairs about your habits (sport, food, places you go) where every answer uses y or en, including at least 3 in the passé composé.",
    },
    {
      topic: "Plus-que-parfait and reported speech",
      subtitle: "il a dit qu'il avait fini",
      introFr:
        "The plus-que-parfait (had done) is for an action that happened before another past action. It is avoir or être in the imparfait + past participle: j'avais fini, elle était partie.\n\nIn reported speech after a past verb (il a dit que, elle a expliqué que), the tenses shift back:\n• present → imparfait: « Je suis fatigué » → Il a dit qu'il était fatigué.\n• passé composé → plus-que-parfait: « J'ai fini » → Il a dit qu'il avait fini.\n• future → conditional: « Je viendrai » → Il a dit qu'il viendrait.\n\nPronouns and time words change too: demain → le lendemain, hier → la veille.\n\n|||EXAMPLES|||\nQuand je suis arrivé, le film avait déjà commencé.\nElle m'a dit qu'elle était malade.\nIls ont expliqué qu'ils avaient raté le train.\nPaul a promis qu'il appellerait le lendemain.",
      examples: [
        "1) Quand nous sommes arrivés, le train ___ (partir) déjà. -> était parti",
        "2) Elle a dit qu'elle ___ (être) fatiguée. -> était",
        "3) Il m'a expliqué qu'il ___ (perdre) ses clés. -> avait perdu",
        "4) Ils ont promis qu'ils ___ (venir) le lendemain. -> viendraient",
        "5) J'ai réussi l'examen parce que j'___ (beaucoup réviser). -> avais beaucoup révisé",
        "6) Tu m'as dit que tu ___ (aimer) le jazz. -> aimais",
        "7) Elle ne savait pas que nous ___ (déjà manger). -> avions déjà mangé",
        "8) Le prof a annoncé que l'examen ___ (avoir) lieu lundi. -> aurait",
        "9) « J'étais à Paris hier. » → Il a dit qu'il avait été à Paris ___. -> la veille",
        "10) Marie a raconté qu'elle ___ (rencontrer) une star. -> avait rencontré",
      ],
      practice:
        "Take a short conversation (8 lines) from a French film, song or your own life and report it using il a dit que, elle a répondu que, ils ont expliqué que, shifting every tense correctly.",
    },
    {
      topic: "The passive voice and its alternatives",
      subtitle: "la maison a été construite",
      introFr:
        "The passive is être (in any tense) + past participle, which agrees with the subject. The agent is introduced by par (by): La lettre a été écrite par Victor Hugo.\n\nFrench uses the passive less than English. Common alternatives:\n• on + active verb: On parle français ici (French is spoken here).\n• a reflexive verb: Ça se mange froid (It is eaten cold). Ce livre se vend bien.\n• se faire + infinitive: Il s'est fait voler son vélo (He had his bike stolen).\n\nVerbs like dire, demander and permettre take à + person and cannot become passive with that person as the subject: 'I was told' = On m'a dit.\n\n|||EXAMPLES|||\nCe pont a été construit en 1900.\nLes résultats seront publiés demain.\nOn m'a offert un livre.\nCe vin se boit très frais.",
      examples: [
        "1) La tour Eiffel a été ___ (construire) en 1889. -> construite",
        "2) Les voleurs ont été arrêtés ___ la police. -> par",
        "3) Les résultats ___ (être, futur) publiés demain. -> seront",
        "4) ___ m'a dit que le magasin était fermé. -> On",
        "5) Ce plat ___ mange froid, avec de la salade. -> se",
        "6) Il s'est ___ (faire) voler son portable dans le métro. -> fait",
        "7) Les lettres sont ___ (envoyer) chaque matin. -> envoyées",
        "8) Le gagnant ___ (être, passé composé) choisi par le public. -> a été",
        "9) Ici, ___ parle anglais et français. -> on",
        "10) Ces romans ___ vendent très bien en ce moment. -> se",
      ],
      practice:
        "Write 6 news headlines in the passive (Un nouveau musée a été inauguré…), then rewrite each one using on or a reflexive verb, and say which sounds more natural.",
    },
    {
      topic: "Present participle and gerund",
      subtitle: "en travaillant, ayant fini",
      introFr:
        "The present participle ends in -ant. Take the nous form of the present, remove -ons and add -ant: nous parlons → parlant, nous finissons → finissant. Irregular: être → étant, avoir → ayant, savoir → sachant.\n\nThe gerund is en + -ant. It describes how something is done or two actions happening at the same time, by the same subject: Il a appris le français en regardant des films. Ne lis pas en mangeant !\n\nTout en + -ant stresses contrast or simultaneity: Il souriait tout en pleurant.\n\nWithout en, the present participle is more formal and often replaces qui: Les élèves ayant fini peuvent partir.\n\n|||EXAMPLES|||\nJ'écoute de la musique en faisant mes devoirs.\nC'est en forgeant qu'on devient forgeron.\nÉtant malade, il est resté chez lui.\nElle est sortie en claquant la porte.",
      examples: [
        "1) Il est tombé en ___ (courir) dans l'escalier. -> courant",
        "2) J'ai appris l'anglais en ___ (regarder) des séries. -> regardant",
        "3) Ne parle pas en ___ (manger) ! -> mangeant",
        "4) ___ (être) malade, elle n'est pas venue. -> Étant",
        "5) En ___ (finir) tôt, nous pourrons sortir. -> finissant",
        "6) Il chante en ___ (faire) la vaisselle. -> faisant",
        "7) ___ (avoir) beaucoup de travail, je reste à la maison. -> Ayant",
        "8) C'est en ___ (lire) qu'on enrichit son vocabulaire. -> lisant",
        "9) Elle est partie en ___ (dire) au revoir à tout le monde. -> disant",
        "10) Les élèves ___ (savoir) la réponse lèvent la main. -> sachant",
      ],
      practice:
        "Describe 8 things you often do at the same time (J'écoute de la musique en courant…), then write 3 sentences explaining how you could improve at something using en + -ant.",
    },
    {
      topic: "Conjunctions with the subjunctive",
      subtitle: "bien que, pour que, avant que",
      introFr:
        "Some conjunctions are always followed by the subjunctive:\n• bien que / quoique (although): Bien qu'il soit tard, je travaille encore.\n• pour que / afin que (so that): Je parle lentement pour que tu comprennes.\n• avant que (before): Rentre avant qu'il fasse nuit.\n• à condition que (provided that), sans que (without), jusqu'à ce que (until), à moins que (unless).\n\nWhen both verbs have the same subject, use a preposition + infinitive instead: Je travaille pour réussir (not pour que je réussisse). Mange avant de partir.\n\nAprès que, parce que and pendant que take the indicative, not the subjunctive.\n\n|||EXAMPLES|||\nBien que ce soit difficile, j'adore le français.\nJe t'explique pour que tu saches.\nAttends ici jusqu'à ce que je revienne.\nIl est parti sans que personne le voie.",
      examples: [
        "1) Bien qu'il ___ (faire) froid, nous sortons. -> fasse",
        "2) Je t'appelle pour que tu ___ (savoir) la nouvelle. -> saches",
        "3) Finis tes devoirs avant que tes parents ne ___ (rentrer). -> rentrent",
        "4) Je viendrai à condition que vous ___ (être) là. -> soyez",
        "5) Il est sorti sans que nous l'___ (entendre). -> entendions",
        "6) Attends jusqu'à ce que le feu ___ (devenir) vert. -> devienne",
        "7) Je travaille dur ___ réussir mes examens. -> pour",
        "8) Mange quelque chose avant ___ partir. -> de",
        "9) Je reste parce que je ___ (vouloir) t'aider. -> veux",
        "10) Quoiqu'elle ___ (avoir) peu de temps, elle nous aide toujours. -> ait",
      ],
      practice:
        "Write a short argumentative paragraph (8-10 sentences) on 'Faut-il interdire les portables au lycée ?' using at least 5 different conjunctions, including bien que, pour que and à condition que.",
    },
  ],
};
