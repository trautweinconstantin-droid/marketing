/* ============================================================
   Nutq · Inhalte (Modernes Hocharabisch / Fuṣḥā)
   ------------------------------------------------------------
   Alle Daten sind statisch. IDs werden beim Laden vergeben,
   damit der Fortschritt (localStorage) stabil referenziert.
   ============================================================ */

/* ---------- Niveaustufen ---------- */
const LEVELS = ["A1", "A2", "B1", "B2"];

/* ---------- Wortschatz / Sätze zum Sprechen ---------- */
/* cat = Kategorie, lvl = Niveau, ar = Arabisch, tr = Umschrift, de = Deutsch */
const PHRASES = [
  // Begrüßung & Abschied
  { cat: "Begrüßung",   lvl: "A1", ar: "مرحباً",              tr: "marḥaban",              de: "Hallo" },
  { cat: "Begrüßung",   lvl: "A1", ar: "السلام عليكم",        tr: "as-salāmu ʿalaykum",    de: "Friede sei mit dir (Gruß)" },
  { cat: "Begrüßung",   lvl: "A1", ar: "وعليكم السلام",       tr: "wa-ʿalaykum as-salām",  de: "Und mit dir (Antwort)" },
  { cat: "Begrüßung",   lvl: "A1", ar: "صباح الخير",          tr: "ṣabāḥ al-khayr",        de: "Guten Morgen" },
  { cat: "Begrüßung",   lvl: "A1", ar: "مساء الخير",          tr: "masāʾ al-khayr",        de: "Guten Abend" },
  { cat: "Begrüßung",   lvl: "A1", ar: "مع السلامة",          tr: "maʿa s-salāma",         de: "Auf Wiedersehen" },
  { cat: "Begrüßung",   lvl: "A2", ar: "أهلاً وسهلاً",         tr: "ahlan wa-sahlan",       de: "Herzlich willkommen" },
  { cat: "Begrüßung",   lvl: "A2", ar: "كيف حالك؟",           tr: "kayfa ḥāluk?",          de: "Wie geht es dir?" },
  { cat: "Begrüßung",   lvl: "A2", ar: "بخير، والحمد لله",    tr: "bi-khayr, wa-l-ḥamdu li-llāh", de: "Gut, Gott sei Dank" },
  { cat: "Begrüßung",   lvl: "B1", ar: "لم أرك منذ زمن طويل", tr: "lam araka mundhu zaman ṭawīl", de: "Ich habe dich lange nicht gesehen" },

  // Höflichkeit
  { cat: "Höflichkeit", lvl: "A1", ar: "شكراً",               tr: "shukran",               de: "Danke" },
  { cat: "Höflichkeit", lvl: "A1", ar: "شكراً جزيلاً",         tr: "shukran jazīlan",       de: "Vielen Dank" },
  { cat: "Höflichkeit", lvl: "A1", ar: "عفواً",               tr: "ʿafwan",                de: "Gern geschehen / Entschuldigung" },
  { cat: "Höflichkeit", lvl: "A1", ar: "من فضلك",             tr: "min faḍlik",            de: "Bitte (Aufforderung)" },
  { cat: "Höflichkeit", lvl: "A1", ar: "نعم",                 tr: "naʿam",                 de: "Ja" },
  { cat: "Höflichkeit", lvl: "A1", ar: "لا",                  tr: "lā",                    de: "Nein" },
  { cat: "Höflichkeit", lvl: "A2", ar: "آسف",                 tr: "āsif",                  de: "Es tut mir leid (m)" },
  { cat: "Höflichkeit", lvl: "A2", ar: "لا بأس",              tr: "lā baʾs",               de: "Kein Problem" },
  { cat: "Höflichkeit", lvl: "B1", ar: "هل يمكنك مساعدتي؟",    tr: "hal yumkinuka musāʿadatī?", de: "Kannst du mir helfen?" },
  { cat: "Höflichkeit", lvl: "B1", ar: "بكل سرور",            tr: "bi-kulli surūr",        de: "Mit Vergnügen" },

  // Sich vorstellen
  { cat: "Vorstellen",  lvl: "A1", ar: "أنا",                 tr: "anā",                   de: "Ich" },
  { cat: "Vorstellen",  lvl: "A2", ar: "ما اسمك؟",            tr: "mā ismuk?",             de: "Wie heißt du?" },
  { cat: "Vorstellen",  lvl: "A2", ar: "اسمي أحمد",           tr: "ismī Aḥmad",            de: "Ich heiße Ahmad" },
  { cat: "Vorstellen",  lvl: "A2", ar: "أنا من ألمانيا",      tr: "anā min Almāniyā",      de: "Ich komme aus Deutschland" },
  { cat: "Vorstellen",  lvl: "A2", ar: "أنا أتعلم العربية",   tr: "anā ataʿallam al-ʿarabiyya", de: "Ich lerne Arabisch" },
  { cat: "Vorstellen",  lvl: "B1", ar: "أعمل مهندساً",        tr: "aʿmal muhandisan",      de: "Ich arbeite als Ingenieur" },
  { cat: "Vorstellen",  lvl: "B1", ar: "أسكن في برلين منذ سنتين", tr: "askun fī Barlīn mundhu sanatayn", de: "Ich wohne seit zwei Jahren in Berlin" },
  { cat: "Vorstellen",  lvl: "B2", ar: "تشرفت بمعرفتك",       tr: "tasharraftu bi-maʿrifatik", de: "Es hat mich gefreut, dich kennenzulernen" },

  // Alltag
  { cat: "Alltag",      lvl: "A1", ar: "ماء",                 tr: "māʾ",                   de: "Wasser" },
  { cat: "Alltag",      lvl: "A2", ar: "لا أفهم",             tr: "lā afham",              de: "Ich verstehe nicht" },
  { cat: "Alltag",      lvl: "A2", ar: "من فضلك، تكلم ببطء",  tr: "min faḍlik, takallam bi-buṭʾ", de: "Bitte sprich langsam" },
  { cat: "Alltag",      lvl: "A2", ar: "هل تتكلم الإنجليزية؟", tr: "hal tatakallam al-injilīziyya?", de: "Sprichst du Englisch?" },
  { cat: "Alltag",      lvl: "A2", ar: "ماذا يعني هذا؟",      tr: "mādhā yaʿnī hādhā?",    de: "Was bedeutet das?" },
  { cat: "Alltag",      lvl: "B1", ar: "أين الحمام؟",         tr: "ayna l-ḥammām?",        de: "Wo ist die Toilette?" },
  { cat: "Alltag",      lvl: "B1", ar: "لحظة من فضلك",        tr: "laḥẓa min faḍlik",      de: "Einen Moment bitte" },
  { cat: "Alltag",      lvl: "B1", ar: "لا مشكلة في ذلك",     tr: "lā mushkila fī dhālik", de: "Damit gibt es kein Problem" },

  // Einkaufen
  { cat: "Einkaufen",   lvl: "A2", ar: "كم السعر؟",           tr: "kam as-siʿr?",          de: "Was kostet das?" },
  { cat: "Einkaufen",   lvl: "A2", ar: "هذا غالٍ",            tr: "hādhā ghālin",          de: "Das ist teuer" },
  { cat: "Einkaufen",   lvl: "B1", ar: "هل يمكن أن تخفّض السعر؟", tr: "hal yumkin an tukhaffiḍ as-siʿr?", de: "Können Sie den Preis senken?" },
  { cat: "Einkaufen",   lvl: "B1", ar: "سآخذ هذا",            tr: "sa-ākhudh hādhā",       de: "Ich nehme das" },
  { cat: "Einkaufen",   lvl: "B1", ar: "هل تقبلون البطاقة؟",  tr: "hal taqbalūn al-biṭāqa?", de: "Nehmen Sie Karte?" },
  { cat: "Einkaufen",   lvl: "B2", ar: "أبحث عن شيء أرخص",    tr: "abḥathu ʿan shayʾ arkhaṣ", de: "Ich suche etwas Günstigeres" },

  // Reisen & Wegbeschreibung
  { cat: "Reisen",      lvl: "A2", ar: "أين المحطة؟",         tr: "ayna l-maḥaṭṭa?",       de: "Wo ist der Bahnhof?" },
  { cat: "Reisen",      lvl: "B1", ar: "كيف أصل إلى المطار؟", tr: "kayfa aṣil ilā l-maṭār?", de: "Wie komme ich zum Flughafen?" },
  { cat: "Reisen",      lvl: "B1", ar: "على اليمين",          tr: "ʿalā l-yamīn",          de: "Rechts / auf der rechten Seite" },
  { cat: "Reisen",      lvl: "B1", ar: "على اليسار",          tr: "ʿalā l-yasār",          de: "Links / auf der linken Seite" },
  { cat: "Reisen",      lvl: "B1", ar: "امشِ على طول",        tr: "imshi ʿalā ṭūl",        de: "Geh geradeaus" },
  { cat: "Reisen",      lvl: "B2", ar: "هل هذا القطار متجه إلى القاهرة؟", tr: "hal hādhā l-qiṭār muttajih ilā l-Qāhira?", de: "Fährt dieser Zug nach Kairo?" },

  // Notfall
  { cat: "Notfall",     lvl: "A2", ar: "ساعدني!",             tr: "sāʿidnī!",              de: "Hilf mir!" },
  { cat: "Notfall",     lvl: "B1", ar: "اتصل بالشرطة",        tr: "ittaṣil bi-sh-shurṭa",  de: "Ruf die Polizei" },
  { cat: "Notfall",     lvl: "B1", ar: "أحتاج إلى طبيب",      tr: "aḥtāj ilā ṭabīb",       de: "Ich brauche einen Arzt" },
  { cat: "Notfall",     lvl: "B1", ar: "لقد ضعت",             tr: "laqad ḍiʿt",            de: "Ich habe mich verlaufen" },
  { cat: "Notfall",     lvl: "B2", ar: "أين أقرب مستشفى؟",    tr: "ayna aqrab mustashfā?", de: "Wo ist das nächste Krankenhaus?" },

  // Zeit & Datum
  { cat: "Zeit",        lvl: "A2", ar: "كم الساعة؟",          tr: "kam as-sāʿa?",          de: "Wie spät ist es?" },
  { cat: "Zeit",        lvl: "A2", ar: "اليوم",               tr: "al-yawm",               de: "Heute" },
  { cat: "Zeit",        lvl: "A2", ar: "غداً",                tr: "ghadan",                de: "Morgen" },
  { cat: "Zeit",        lvl: "A2", ar: "أمس",                 tr: "ams",                   de: "Gestern" },
  { cat: "Zeit",        lvl: "B1", ar: "في الصباح",           tr: "fī ṣ-ṣabāḥ",            de: "Am Morgen" },
  { cat: "Zeit",        lvl: "B1", ar: "بعد قليل",            tr: "baʿda qalīl",           de: "In Kürze / gleich" },

  // Gefühle & Small Talk
  { cat: "Gefühle",     lvl: "A2", ar: "أنا سعيد",            tr: "anā saʿīd",             de: "Ich bin glücklich" },
  { cat: "Gefühle",     lvl: "A2", ar: "أنا متعب",            tr: "anā mutʿab",            de: "Ich bin müde" },
  { cat: "Gefühle",     lvl: "B1", ar: "أنا جائع",            tr: "anā jāʾiʿ",             de: "Ich habe Hunger" },
  { cat: "Gefühle",     lvl: "B1", ar: "أنا قلق قليلاً",      tr: "anā qaliq qalīlan",     de: "Ich bin ein wenig besorgt" },
  { cat: "Gefühle",     lvl: "B2", ar: "أشعر بتحسن اليوم",    tr: "ashʿur bi-taḥassun al-yawm", de: "Ich fühle mich heute besser" },

  // Zahlen
  { cat: "Zahlen",      lvl: "A1", ar: "صفر",                 tr: "ṣifr",                  de: "Null" },
  { cat: "Zahlen",      lvl: "A1", ar: "واحد",                tr: "wāḥid",                 de: "Eins" },
  { cat: "Zahlen",      lvl: "A1", ar: "اثنان",               tr: "ithnān",                de: "Zwei" },
  { cat: "Zahlen",      lvl: "A1", ar: "ثلاثة",               tr: "thalātha",              de: "Drei" },
  { cat: "Zahlen",      lvl: "A1", ar: "أربعة",               tr: "arbaʿa",                de: "Vier" },
  { cat: "Zahlen",      lvl: "A1", ar: "خمسة",                tr: "khamsa",                de: "Fünf" },
  { cat: "Zahlen",      lvl: "A1", ar: "ستة",                 tr: "sitta",                 de: "Sechs" },
  { cat: "Zahlen",      lvl: "A1", ar: "سبعة",                tr: "sabʿa",                 de: "Sieben" },
  { cat: "Zahlen",      lvl: "A1", ar: "ثمانية",              tr: "thamāniya",             de: "Acht" },
  { cat: "Zahlen",      lvl: "A1", ar: "تسعة",                tr: "tisʿa",                 de: "Neun" },
  { cat: "Zahlen",      lvl: "A1", ar: "عشرة",                tr: "ʿashara",               de: "Zehn" },
  { cat: "Zahlen",      lvl: "A2", ar: "عشرون",               tr: "ʿishrūn",               de: "Zwanzig" },
  { cat: "Zahlen",      lvl: "A2", ar: "مئة",                 tr: "miʾa",                  de: "Hundert" },
  { cat: "Zahlen",      lvl: "A2", ar: "ألف",                 tr: "alf",                   de: "Tausend" },
];

/* ---------- Alltagsnahe Dialoge (Rollenspiel) ---------- */
/* Jede Zeile: sp = Sprecher-Rolle, ar/tr/de. */
const DIALOGUES = [
  {
    title: "Im Café",
    lvl: "A2",
    icon: "☕",
    roles: { A: "Kellner", B: "Gast" },
    context: "Du bestellst in einem arabischen Café.",
    turns: [
      { sp: "A", ar: "أهلاً وسهلاً، تفضل.",            tr: "ahlan wa-sahlan, tafaḍḍal.",        de: "Herzlich willkommen, bitte sehr." },
      { sp: "B", ar: "مرحباً، هل عندكم قهوة عربية؟",   tr: "marḥaban, hal ʿindakum qahwa ʿarabiyya?", de: "Hallo, habt ihr arabischen Kaffee?" },
      { sp: "A", ar: "نعم بالطبع. هل تريدها مع سكر؟",  tr: "naʿam bi-ṭ-ṭabʿ. hal turīduhā maʿa sukkar?", de: "Ja, natürlich. Möchten Sie ihn mit Zucker?" },
      { sp: "B", ar: "بدون سكر من فضلك.",             tr: "bidūn sukkar min faḍlik.",          de: "Ohne Zucker bitte." },
      { sp: "A", ar: "هل تريد شيئاً آخر؟",            tr: "hal turīd shayʾan ākhar?",          de: "Möchten Sie noch etwas?" },
      { sp: "B", ar: "نعم، قطعة كعك. كم الحساب؟",     tr: "naʿam, qiṭʿat kaʿk. kam al-ḥisāb?", de: "Ja, ein Stück Kuchen. Was macht das?" },
      { sp: "A", ar: "خمسة عشر جنيهاً.",              tr: "khamsata ʿashara junayhan.",        de: "Fünfzehn Pfund." },
      { sp: "B", ar: "تفضل، شكراً جزيلاً.",           tr: "tafaḍḍal, shukran jazīlan.",        de: "Bitte sehr, vielen Dank." },
    ],
  },
  {
    title: "Beim Arzt",
    lvl: "B1",
    icon: "🩺",
    roles: { A: "Ärztin", B: "Patient" },
    context: "Du beschreibst deine Beschwerden in der Praxis.",
    turns: [
      { sp: "A", ar: "ما الذي تشكو منه؟",            tr: "mā lladhī tashkū minh?",            de: "Was fehlt Ihnen? / Worüber klagen Sie?" },
      { sp: "B", ar: "عندي صداع شديد منذ يومين.",     tr: "ʿindī ṣudāʿ shadīd mundhu yawmayn.", de: "Ich habe seit zwei Tagen starke Kopfschmerzen." },
      { sp: "A", ar: "هل عندك حرارة؟",               tr: "hal ʿindak ḥarāra?",                de: "Haben Sie Fieber?" },
      { sp: "B", ar: "نعم، وأشعر بالتعب.",            tr: "naʿam, wa-ashʿur bi-t-taʿab.",      de: "Ja, und ich fühle mich erschöpft." },
      { sp: "A", ar: "هل تتناول أي أدوية؟",          tr: "hal tatanāwal ayya adwiya?",        de: "Nehmen Sie irgendwelche Medikamente?" },
      { sp: "B", ar: "لا، لا أتناول شيئاً.",          tr: "lā, lā atanāwal shayʾan.",          de: "Nein, ich nehme nichts." },
      { sp: "A", ar: "سأصف لك دواءً. خذه مرتين في اليوم.", tr: "sa-aṣif laka dawāʾan. khudhhu marratayn fī l-yawm.", de: "Ich verschreibe Ihnen ein Medikament. Nehmen Sie es zweimal täglich." },
      { sp: "B", ar: "شكراً يا دكتورة.",             tr: "shukran yā duktūra.",               de: "Danke, Frau Doktor." },
    ],
  },
  {
    title: "Nach dem Weg fragen",
    lvl: "A2",
    icon: "🧭",
    roles: { A: "Passant", B: "Du" },
    context: "Du fragst einen Passanten nach dem Weg.",
    turns: [
      { sp: "B", ar: "عفواً، كيف أصل إلى المحطة؟",    tr: "ʿafwan, kayfa aṣil ilā l-maḥaṭṭa?", de: "Entschuldigung, wie komme ich zum Bahnhof?" },
      { sp: "A", ar: "امشِ على طول ثم انعطف يميناً.", tr: "imshi ʿalā ṭūl thumma inʿaṭif yamīnan.", de: "Geh geradeaus und biege dann rechts ab." },
      { sp: "B", ar: "هل هي بعيدة؟",                 tr: "hal hiya baʿīda?",                  de: "Ist er weit weg?" },
      { sp: "A", ar: "لا، حوالي عشر دقائق سيراً.",    tr: "lā, ḥawālī ʿashr daqāʾiq sayran.",  de: "Nein, etwa zehn Minuten zu Fuß." },
      { sp: "B", ar: "هل يوجد مترو قريب؟",           tr: "hal yūjad mitrū qarīb?",           de: "Gibt es eine U-Bahn in der Nähe?" },
      { sp: "A", ar: "نعم، المحطة خلف البنك.",       tr: "naʿam, al-maḥaṭṭa khalfa l-bank.",  de: "Ja, die Station ist hinter der Bank." },
      { sp: "B", ar: "شكراً على مساعدتك.",           tr: "shukran ʿalā musāʿadatik.",         de: "Danke für deine Hilfe." },
      { sp: "A", ar: "عفواً، مع السلامة.",           tr: "ʿafwan, maʿa s-salāma.",            de: "Gern geschehen, auf Wiedersehen." },
    ],
  },
  {
    title: "Auf dem Markt (Handeln)",
    lvl: "B1",
    icon: "🍅",
    roles: { A: "Händler", B: "Kunde" },
    context: "Du handelst auf dem Gemüsemarkt um den Preis.",
    turns: [
      { sp: "B", ar: "بكم كيلو الطماطم؟",            tr: "bi-kam kīlū ṭ-ṭamāṭim?",            de: "Wie viel kostet das Kilo Tomaten?" },
      { sp: "A", ar: "بعشرة جنيهات.",                tr: "bi-ʿashrat junayhāt.",              de: "Zehn Pfund." },
      { sp: "B", ar: "هذا غالٍ قليلاً. هل يمكن أن تخفّض السعر؟", tr: "hādhā ghālin qalīlan. hal yumkin an tukhaffiḍ as-siʿr?", de: "Das ist etwas teuer. Können Sie den Preis senken?" },
      { sp: "A", ar: "حسناً، ثمانية جنيهات لأجلك.",   tr: "ḥasanan, thamāniyat junayhāt li-ajlik.", de: "Also gut, acht Pfund für Sie." },
      { sp: "B", ar: "سآخذ كيلوين. وهل عندك خيار طازج؟", tr: "sa-ākhudh kīlūayn. wa-hal ʿindak khiyār ṭāzij?", de: "Ich nehme zwei Kilo. Und haben Sie frische Gurken?" },
      { sp: "A", ar: "نعم، وصل اليوم في الصباح.",     tr: "naʿam, waṣala l-yawm fī ṣ-ṣabāḥ.",  de: "Ja, sie sind heute Morgen gekommen." },
      { sp: "B", ar: "ممتاز، أعطني نصف كيلو أيضاً.",  tr: "mumtāz, aʿṭinī niṣf kīlū ayḍan.",   de: "Ausgezeichnet, geben Sie mir auch ein halbes Kilo." },
      { sp: "A", ar: "على الرأس والعين.",            tr: "ʿalā r-raʾs wa-l-ʿayn.",            de: "Sehr gerne (wörtl.: auf Kopf und Auge)." },
    ],
  },
  {
    title: "Wohnung mieten",
    lvl: "B1",
    icon: "🏠",
    roles: { A: "Makler", B: "Interessent" },
    context: "Du erkundigst dich nach einer Mietwohnung.",
    turns: [
      { sp: "B", ar: "أبحث عن شقة للإيجار في هذا الحي.", tr: "abḥathu ʿan shaqqa li-l-ījār fī hādhā l-ḥayy.", de: "Ich suche eine Mietwohnung in diesem Viertel." },
      { sp: "A", ar: "كم غرفة تحتاج؟",               tr: "kam ghurfa taḥtāj?",                de: "Wie viele Zimmer brauchen Sie?" },
      { sp: "B", ar: "غرفتين وصالة ومطبخ.",          tr: "ghurfatayn wa-ṣāla wa-maṭbakh.",    de: "Zwei Zimmer, ein Wohnzimmer und eine Küche." },
      { sp: "A", ar: "عندي شقة في الطابق الثالث.",   tr: "ʿindī shaqqa fī ṭ-ṭābiq ath-thālith.", de: "Ich habe eine Wohnung im dritten Stock." },
      { sp: "B", ar: "كم الإيجار شهرياً؟",           tr: "kam al-ījār shahriyyan?",           de: "Wie hoch ist die Miete monatlich?" },
      { sp: "A", ar: "ثلاثة آلاف، والفواتير غير مشمولة.", tr: "thalāthat ālāf, wa-l-fawātīr ghayr mashmūla.", de: "Dreitausend, die Nebenkosten sind nicht inbegriffen." },
      { sp: "B", ar: "متى يمكنني معاينة الشقة؟",      tr: "matā yumkinunī muʿāyanat ash-shaqqa?", de: "Wann kann ich die Wohnung besichtigen?" },
      { sp: "A", ar: "غداً بعد الظهر إن ناسبك.",     tr: "ghadan baʿda ẓ-ẓuhr in nāsabak.",   de: "Morgen Nachmittag, wenn es Ihnen passt." },
    ],
  },
  {
    title: "Vorstellungsgespräch",
    lvl: "B2",
    icon: "💼",
    roles: { A: "Personaler", B: "Bewerber" },
    context: "Ein Jobinterview – erzähl von dir und deiner Erfahrung.",
    turns: [
      { sp: "A", ar: "حدثني عن نفسك من فضلك.",       tr: "ḥaddithnī ʿan nafsik min faḍlik.",  de: "Erzählen Sie mir bitte von sich." },
      { sp: "B", ar: "أنا مهندس ولدي خمس سنوات خبرة.", tr: "anā muhandis wa-ladayya khams sanawāt khibra.", de: "Ich bin Ingenieur und habe fünf Jahre Erfahrung." },
      { sp: "A", ar: "لماذا تريد العمل معنا؟",       tr: "limādhā turīd al-ʿamal maʿanā?",    de: "Warum möchten Sie bei uns arbeiten?" },
      { sp: "B", ar: "لأن شركتكم رائدة في هذا المجال.", tr: "li-anna sharikatakum rāʾida fī hādhā l-majāl.", de: "Weil Ihre Firma in diesem Bereich führend ist." },
      { sp: "A", ar: "ما هي نقاط قوتك؟",             tr: "mā hiya niqāṭ quwwatik?",           de: "Was sind Ihre Stärken?" },
      { sp: "B", ar: "أنا منظم وأعمل جيداً ضمن فريق.", tr: "anā munaẓẓam wa-aʿmal jayyidan ḍimna farīq.", de: "Ich bin organisiert und arbeite gut im Team." },
      { sp: "A", ar: "متى يمكنك البدء؟",             tr: "matā yumkinuka l-badʾ?",            de: "Wann können Sie anfangen?" },
      { sp: "B", ar: "يمكنني البدء الشهر القادم.",   tr: "yumkinunī l-badʾ ash-shahr al-qādim.", de: "Ich kann nächsten Monat anfangen." },
    ],
  },
  {
    title: "Termin am Telefon",
    lvl: "B1",
    icon: "📞",
    roles: { A: "Sekretär", B: "Anrufer" },
    context: "Du vereinbarst telefonisch einen Termin.",
    turns: [
      { sp: "B", ar: "ألو، مساء الخير. أريد حجز موعد.", tr: "alū, masāʾ al-khayr. urīd ḥajz mawʿid.", de: "Hallo, guten Abend. Ich möchte einen Termin vereinbaren." },
      { sp: "A", ar: "بالتأكيد. أي يوم يناسبك؟",     tr: "bi-t-taʾkīd. ayy yawm yunāsibuk?",  de: "Sicher. Welcher Tag passt Ihnen?" },
      { sp: "B", ar: "يوم الثلاثاء إن أمكن.",        tr: "yawm ath-thulāthāʾ in amkan.",      de: "Dienstag, wenn möglich." },
      { sp: "A", ar: "الثلاثاء ممتلئ. ماذا عن الأربعاء؟", tr: "ath-thulāthāʾ mumtaliʾ. mādhā ʿan al-arbiʿāʾ?", de: "Dienstag ist voll. Wie wäre es mit Mittwoch?" },
      { sp: "B", ar: "الأربعاء مناسب. في أي ساعة؟",  tr: "al-arbiʿāʾ munāsib. fī ayy sāʿa?",  de: "Mittwoch passt. Um wie viel Uhr?" },
      { sp: "A", ar: "الساعة الرابعة عصراً.",        tr: "as-sāʿa r-rābiʿa ʿaṣran.",          de: "Um vier Uhr nachmittags." },
      { sp: "B", ar: "ممتاز، شكراً لك.",             tr: "mumtāz, shukran lak.",              de: "Ausgezeichnet, danke." },
      { sp: "A", ar: "إلى اللقاء.",                  tr: "ilā l-liqāʾ.",                      de: "Auf Wiederhören." },
    ],
  },
  {
    title: "Im Restaurant",
    lvl: "A2",
    icon: "🍽️",
    roles: { A: "Kellner", B: "Gast" },
    context: "Du bestellst zu zweit im Restaurant.",
    turns: [
      { sp: "B", ar: "هل لديكم طاولة لشخصين؟",       tr: "hal ladaykum ṭāwila li-shakhṣayn?", de: "Haben Sie einen Tisch für zwei Personen?" },
      { sp: "A", ar: "نعم، تفضلوا من هنا.",          tr: "naʿam, tafaḍḍalū min hunā.",        de: "Ja, kommen Sie bitte hier entlang." },
      { sp: "B", ar: "ماذا تنصحنا به اليوم؟",        tr: "mādhā tanṣaḥunā bihi l-yawm?",      de: "Was empfehlen Sie uns heute?" },
      { sp: "A", ar: "سمك اليوم طازج جداً.",         tr: "samak al-yawm ṭāzij jiddan.",       de: "Der Fisch des Tages ist sehr frisch." },
      { sp: "B", ar: "جيد، سنطلب طبقين.",           tr: "jayyid, sa-naṭlub ṭabaqayn.",       de: "Gut, wir bestellen zwei Portionen." },
      { sp: "A", ar: "وماذا تشربون؟",               tr: "wa-mādhā tashrabūn?",               de: "Und was möchten Sie trinken?" },
      { sp: "B", ar: "ماء وعصير برتقال.",           tr: "māʾ wa-ʿaṣīr burtuqāl.",            de: "Wasser und Orangensaft." },
      { sp: "A", ar: "حسناً، سيصل الطلب حالاً.",      tr: "ḥasanan, sa-yaṣil aṭ-ṭalab ḥālan.", de: "Gut, die Bestellung kommt gleich." },
    ],
  },
];

/* ---------- Grammatik-Lektionen ---------- */
/* note = Erklärung (HTML erlaubt), rows = Beispiele zum Anhören */
const GRAMMAR = [
  {
    title: "Personalpronomen",
    lvl: "A1",
    note: "Arabisch unterscheidet bei „du“ und „ihr/sie“ zwischen männlich und weiblich. Das Verb passt sich der Person an – man kann das Pronomen im Satz oft weglassen.",
    rows: [
      { ar: "أنا",   tr: "anā",   de: "ich" },
      { ar: "أنتَ",  tr: "anta",  de: "du (m)" },
      { ar: "أنتِ",  tr: "anti",  de: "du (f)" },
      { ar: "هو",    tr: "huwa",  de: "er" },
      { ar: "هي",    tr: "hiya",  de: "sie" },
      { ar: "نحن",   tr: "naḥnu", de: "wir" },
      { ar: "أنتم",  tr: "antum", de: "ihr (m)" },
      { ar: "هم",    tr: "hum",   de: "sie (pl, m)" },
    ],
  },
  {
    title: "Der Nominalsatz (kein „sein“)",
    lvl: "A1",
    note: "Im Präsens gibt es kein Wort für „ist/sind“. Man stellt einfach Subjekt und Aussage nebeneinander: „Das Haus – groß“ = „Das Haus ist groß“.",
    rows: [
      { ar: "البيت كبير",   tr: "al-bayt kabīr",    de: "Das Haus ist groß." },
      { ar: "الطقس جميل",   tr: "aṭ-ṭaqs jamīl",    de: "Das Wetter ist schön." },
      { ar: "أنا مشغول",    tr: "anā mashghūl",     de: "Ich bin beschäftigt." },
      { ar: "هي طبيبة",     tr: "hiya ṭabība",      de: "Sie ist Ärztin." },
      { ar: "القهوة ساخنة", tr: "al-qahwa sākhina", de: "Der Kaffee ist heiß." },
    ],
  },
  {
    title: "Präsens: das Verb „schreiben“",
    lvl: "A2",
    note: "Das Präsens wird über Vorsilben gebildet: أ (ich), تـ (du/sie), يـ (er), نـ (wir). Der Wortstamm k-t-b (schreiben) bleibt erkennbar.",
    rows: [
      { ar: "أنا أكتب",   tr: "anā aktub",     de: "ich schreibe" },
      { ar: "أنتَ تكتب",  tr: "anta taktub",   de: "du schreibst" },
      { ar: "هو يكتب",    tr: "huwa yaktub",   de: "er schreibt" },
      { ar: "هي تكتب",    tr: "hiya taktub",   de: "sie schreibt" },
      { ar: "نحن نكتب",   tr: "naḥnu naktub",  de: "wir schreiben" },
      { ar: "هم يكتبون",  tr: "hum yaktubūn",  de: "sie schreiben" },
    ],
  },
  {
    title: "Genus & die Endung ة",
    lvl: "A2",
    note: "Die meisten weiblichen Wörter enden auf ة (Tāʾ marbūṭa). Aus einem männlichen Wort wird durch Anhängen von ة oft die weibliche Form.",
    rows: [
      { ar: "طالب / طالبة",   tr: "ṭālib / ṭāliba",    de: "Student / Studentin" },
      { ar: "معلم / معلمة",   tr: "muʿallim / muʿallima", de: "Lehrer / Lehrerin" },
      { ar: "كبير / كبيرة",   tr: "kabīr / kabīra",    de: "groß (m / f)" },
      { ar: "جميل / جميلة",   tr: "jamīl / jamīla",    de: "schön (m / f)" },
    ],
  },
  {
    title: "Besitz: Personalsuffixe",
    lvl: "B1",
    note: "Besitz wird durch angehängte Endungen ausgedrückt: ـي (mein), ـكَ (dein), ـه (sein), ـها (ihr), ـنا (unser).",
    rows: [
      { ar: "كتابي",  tr: "kitābī",    de: "mein Buch" },
      { ar: "كتابك",  tr: "kitābuk",   de: "dein Buch" },
      { ar: "كتابه",  tr: "kitābuh",   de: "sein Buch" },
      { ar: "كتابها", tr: "kitābuhā",  de: "ihr Buch" },
      { ar: "بيتنا",  tr: "baytunā",   de: "unser Haus" },
    ],
  },
  {
    title: "Fragewörter",
    lvl: "A2",
    note: "Mit هل leitet man eine Ja/Nein-Frage ein. Die übrigen Fragewörter stehen wie im Deutschen am Satzanfang.",
    rows: [
      { ar: "ما هذا؟",       tr: "mā hādhā?",       de: "Was ist das?" },
      { ar: "من أنت؟",       tr: "man anta?",       de: "Wer bist du?" },
      { ar: "أين تسكن؟",     tr: "ayna taskun?",    de: "Wo wohnst du?" },
      { ar: "متى تأتي؟",     tr: "matā taʾtī?",     de: "Wann kommst du?" },
      { ar: "كيف الحال؟",    tr: "kayfa l-ḥāl?",    de: "Wie geht's?" },
      { ar: "لماذا؟",        tr: "limādhā?",        de: "Warum?" },
      { ar: "هل أنت جاهز؟",  tr: "hal anta jāhiz?", de: "Bist du bereit?" },
    ],
  },
  {
    title: "Demonstrativpronomen",
    lvl: "B1",
    note: "„Dieser/diese“ richtet sich nach dem Genus. Für Fernes gibt es ذلك (m) und تلك (f).",
    rows: [
      { ar: "هذا رجل",   tr: "hādhā rajul",   de: "Dieser (ist ein) Mann." },
      { ar: "هذه امرأة", tr: "hādhihi mraʾa", de: "Diese (ist eine) Frau." },
      { ar: "هؤلاء طلاب", tr: "hāʾulāʾ ṭullāb", de: "Diese (sind) Studenten." },
      { ar: "ذلك البيت", tr: "dhālika l-bayt", de: "Jenes Haus." },
      { ar: "تلك السيارة", tr: "tilka s-sayyāra", de: "Jenes Auto." },
    ],
  },
  {
    title: "Verneinung",
    lvl: "B2",
    note: "Je nach Zeit ein anderes Verneinungswort: لا (Gegenwart), ليس (nicht sein), لم (Vergangenheit), لن (Zukunft).",
    rows: [
      { ar: "لا أعرف",        tr: "lā aʿrif",           de: "Ich weiß nicht." },
      { ar: "لست متأكداً",     tr: "lastu mutaʾakkidan", de: "Ich bin nicht sicher." },
      { ar: "لم أذهب",        tr: "lam adhhab",         de: "Ich bin nicht gegangen." },
      { ar: "لن أنسى",        tr: "lan ansā",           de: "Ich werde nicht vergessen." },
    ],
  },
];

/* ---------- Alphabet (28 Buchstaben) ---------- */
/* Positionsformen (Anfang/Mitte/Ende) werden per ZWJ zur Laufzeit
   erzeugt – der Font rendert automatisch die korrekte Form. */
const ALPHABET = [
  { ar: "ا", name: "Alif",  tr: "ʾa / ā",           hint: "langes a" },
  { ar: "ب", name: "Bāʾ",   tr: "b",                hint: "wie in Buch" },
  { ar: "ت", name: "Tāʾ",   tr: "t",                hint: "wie in Tag" },
  { ar: "ث", name: "Thāʾ",  tr: "th",               hint: "engl. think" },
  { ar: "ج", name: "Jīm",   tr: "dsch",             hint: "wie in Dschungel" },
  { ar: "ح", name: "Ḥāʾ",   tr: "ḥ",                hint: "kehliges, hauchiges h" },
  { ar: "خ", name: "Khāʾ",  tr: "ch",               hint: "wie in Bach" },
  { ar: "د", name: "Dāl",   tr: "d",                hint: "wie in du" },
  { ar: "ذ", name: "Dhāl",  tr: "dh",               hint: "engl. this" },
  { ar: "ر", name: "Rāʾ",   tr: "r",                hint: "gerolltes r" },
  { ar: "ز", name: "Zāy",   tr: "z",                hint: "weiches s (Rose)" },
  { ar: "س", name: "Sīn",   tr: "s",                hint: "scharfes s" },
  { ar: "ش", name: "Shīn",  tr: "sch",              hint: "wie in Schule" },
  { ar: "ص", name: "Ṣād",   tr: "ṣ",                hint: "emphatisches s" },
  { ar: "ض", name: "Ḍād",   tr: "ḍ",                hint: "emphatisches d" },
  { ar: "ط", name: "Ṭāʾ",   tr: "ṭ",                hint: "emphatisches t" },
  { ar: "ظ", name: "Ẓāʾ",   tr: "ẓ",                hint: "emphatisches dh/z" },
  { ar: "ع", name: "ʿAyn",  tr: "ʿ",                hint: "tiefer Kehllaut" },
  { ar: "غ", name: "Ghayn", tr: "gh",               hint: "Gaumen-r (franz. r)" },
  { ar: "ف", name: "Fāʾ",   tr: "f",                hint: "wie in fünf" },
  { ar: "ق", name: "Qāf",   tr: "q",                hint: "k tief hinten im Rachen" },
  { ar: "ك", name: "Kāf",   tr: "k",                hint: "wie in kalt" },
  { ar: "ل", name: "Lām",   tr: "l",                hint: "wie in Lampe" },
  { ar: "م", name: "Mīm",   tr: "m",                hint: "wie in Mond" },
  { ar: "ن", name: "Nūn",   tr: "n",                hint: "wie in Nase" },
  { ar: "ه", name: "Hāʾ",   tr: "h",                hint: "behauchtes h" },
  { ar: "و", name: "Wāw",   tr: "w / ū",            hint: "wie engl. w / langes u" },
  { ar: "ي", name: "Yāʾ",   tr: "j / ī",            hint: "wie in ja / langes i" },
];
