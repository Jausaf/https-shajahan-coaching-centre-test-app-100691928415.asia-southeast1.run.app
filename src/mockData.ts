import { Test, Notice, Quiz, PDFNote, TestResult } from "./types";

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "notice-1",
    title: "Bihar Daroga Pre Exam Special Test series details",
    content: "बिहार दरोगा (Bihar Daroga) परीक्षा के लिए विशेष टेस्ट सीरीज हर रविवार सुबह 10:00 बजे आयोजित की जाएगी। सभी छात्र अपनी तैयारी मजबूत करें। परीक्षा ऑफलाइन और ऑनलाइन दोनों माध्यम में होगी।",
    date: "2026-06-29",
    tag: "Exam"
  },
  {
    id: "notice-2",
    title: "New Batch Announcement: SSC GD & Railway Special (Hindi Medium)",
    content: "नया बैच 5 जुलाई 2026 से शुरू हो रहा है। इसमें रेलवे ग्रुप डी, NTPC और SSC GD की संपूर्ण तैयारी बेसिक से कराई जाएगी। नामांकन प्रारंभ है। सीमित सीटें उपलब्ध हैं!",
    date: "2026-06-28",
    tag: "New Batch"
  },
  {
    id: "notice-3",
    title: "Urgent: Current Affairs June 2026 PDF is live now",
    content: "जून 2026 महीने की संपूर्ण राष्ट्रीय एवं अंतर्राष्ट्रीय समसामयिकी (Current Affairs) ई-बुक 'Notes' सेक्शन में अपलोड कर दी गई है। सभी छात्र इसे तुरंत डाउनलोड करें।",
    date: "2026-06-27",
    tag: "Urgent"
  },
  {
    id: "notice-4",
    title: "Coaching timing adjustment for Monsoon season",
    content: "बारिश के मौसम को देखते हुए ऑफलाइन क्लास का समय सुबह 06:30 बजे से और शाम का बैच 04:00 बजे से निर्धारित किया गया है। ऑनलाइन टेस्ट पूर्ववत चलते रहेंगे।",
    date: "2026-06-25",
    tag: "General"
  }
];

export const INITIAL_PDF_NOTES: PDFNote[] = [
  { id: "pdf-1", title: "बिहार सामान्य ज्ञान (Bihar GK Complete Booster)", subject: "Bihar GK", fileSize: "4.8 MB", downloadCount: 342 },
  { id: "pdf-2", title: "भौतिक विज्ञान शॉर्टकट नोट्स (Physics Formulas for Railway)", subject: "Science", fileSize: "2.1 MB", downloadCount: 520 },
  { id: "pdf-3", title: "SSC GD महत्वपूर्ण मुहावरे और व्याकरण", subject: "Hindi", fileSize: "1.5 MB", downloadCount: 219 },
  { id: "pdf-4", title: "पिछले 6 महीने के करंट अफेयर्स (Jan-June 2026)", subject: "Current Affairs", fileSize: "8.4 MB", downloadCount: 880 },
  { id: "pdf-5", title: "गणित: लाभ और हानि महत्वपूर्ण ट्रिक्स (Math Profit & Loss)", subject: "Math", fileSize: "3.2 MB", downloadCount: 412 }
];

export const INITIAL_QUIZZES: Quiz[] = [
  { id: "quiz-1", title: "GK Daily Dose - 15 Questions", subject: "GK", questionsCount: 15 },
  { id: "quiz-2", title: "Bihar Special Quiz 01", subject: "Bihar GK", questionsCount: 10 },
  { id: "quiz-3", title: "Speed Math - Time and Work", subject: "Math", questionsCount: 12 },
  { id: "quiz-4", title: "Reasoning: Number Series Tricks", subject: "Reasoning", questionsCount: 10 }
];

export const INITIAL_TESTS: Test[] = [
  {
    id: "test-bssc-1",
    title: "BSSC Inter Level special Mock Test - 01",
    subject: "GK & General Science",
    date: "2026-07-01",
    time: "10:00 AM",
    durationMinutes: 10, // kept short for quick testing, easily configurable
    marksPerQuestion: 4,
    negativeMarking: 1.0, // 1 mark negative for every wrong answer
    batchName: "BSSC Inter Level 2026",
    questions: [
      {
        id: "bssc-q1",
        questionText: "बिहार सोशलिस्ट पार्टी के संस्थापक कौन थे?",
        options: [
          "जयप्रकाश नारायण",
          "सत्य भक्त",
          "एम.एन. रॉय",
          "सुभाष चंद्र बोस"
        ],
        correctOptionIndex: 0,
        subject: "Bihar GK",
        explanationHindi: "बिहार सोशलिस्ट पार्टी का गठन वर्ष 1931 में हुआ था। इसके संस्थापक जयप्रकाश नारायण, फूलन प्रसाद वर्मा और गंगा शरण सिंह थे। 1934 में इसकी औपचारिक बैठक पटना के अंजुमन इस्लामिया हॉल में हुई, जिसमें आचार्य नरेंद्र देव इसके अध्यक्ष बने थे।"
      },
      {
        id: "bssc-q2",
        questionText: "पानी का घनत्व (Density) किस तापमान पर अधिकतम होता है?",
        options: [
          "0°C",
          "4°C",
          "100°C",
          "-4°C"
        ],
        correctOptionIndex: 1,
        subject: "Science",
        explanationHindi: "पानी का घनत्व 4 डिग्री सेल्सियस (4°C) पर अधिकतम होता है। इस तापमान पर पानी का आयतन न्यूनतम होता है। 4°C से नीचे जाने पर पानी का असामान्य प्रसार होता है, जिससे उसका घनत्व घटने लगता है।"
      },
      {
        id: "bssc-q3",
        questionText: "निम्नलिखित में से कौन सा भारत का सबसे पुराना कोयला क्षेत्र है?",
        options: [
          "झरिया",
          "रानीगंज",
          "बोकारो",
          "सिंगरौली"
        ],
        correctOptionIndex: 1,
        subject: "GK",
        explanationHindi: "पश्चिम बंगाल का 'रानीगंज कोयला क्षेत्र' भारत का सबसे पहला और पुराना कोयला खनन क्षेत्र है। यहाँ 1774 में ईस्ट इंडिया कंपनी द्वारा पहली बार कोयला निकाला गया था। हालांकि भारत में सबसे ज्यादा कोयला भंडार झरिया (झारखंड) में है।"
      },
      {
        id: "bssc-q4",
        questionText: "यदि '+' का अर्थ 'भाग', '×' का अर्थ 'जोड़', '-' का अर्थ 'गुणा' और '÷' का अर्थ 'घटाव' है, तो निम्न का मान क्या होगा? 18 + 6 × 7 - 3 ÷ 2",
        options: [
          "22",
          "18",
          "24",
          "20"
        ],
        correctOptionIndex: 0,
        subject: "Reasoning",
        explanationHindi: "दिए गए संकेतों को बदलने पर:\n18 / 6 + 7 * 3 - 2\n= 3 + 21 - 2\n= 24 - 2\n= 22.\nअतः सही उत्तर 22 है।"
      },
      {
        id: "bssc-q5",
        questionText: "एक साइकिल चालक 12 किमी/घंटा की गति से 3 घंटे में कितनी दूरी तय करेगा?",
        options: [
          "24 किमी",
          "36 किमी",
          "48 किमी",
          "15 किमी"
        ],
        correctOptionIndex: 1,
        subject: "Math",
        explanationHindi: "दूरी = चाल × समय\nदूरी = 12 किमी/घंटा × 3 घंटे = 36 किमी.\nअतः साइकिल चालक 36 किमी की दूरी तय करेगा।"
      }
    ]
  },
  {
    id: "test-railway-1",
    title: "RRB NTPC & Group D Mega Science Test - 02",
    subject: "General Science",
    date: "2026-07-02",
    time: "02:00 PM",
    durationMinutes: 15,
    marksPerQuestion: 2,
    negativeMarking: 0.66, // 1/3 negative
    batchName: "Railway Mission 2026",
    questions: [
      {
        id: "rw-q1",
        questionText: "विद्युत धारा (Electric Current) का S.I. मात्रक क्या है?",
        options: [
          "वोल्ट (Volt)",
          "ओम (Ohm)",
          "एम्पीयर (Ampere)",
          "वाट (Watt)"
        ],
        correctOptionIndex: 2,
        subject: "Science",
        explanationHindi: "विद्युत धारा का SI मात्रक एम्पीयर (Ampere) है। वोल्ट विभवांतर का, ओम प्रतिरोध का और वाट विद्युत शक्ति का मात्रक है। एम्पीयर को 'A' चिन्ह से दर्शाया जाता है।"
      },
      {
        id: "rw-q2",
        questionText: "हंसाने वाली गैस (Laughing Gas) का रासायनिक नाम क्या है?",
        options: [
          "नाइट्रिक ऑक्साइड (Nitric Oxide)",
          "नाइट्रस ऑक्साइड (Nitrous Oxide)",
          "नाइट्रोजन पेंटाऑक्साइड",
          "सोडियम नाइट्रेट"
        ],
        correctOptionIndex: 1,
        subject: "Science",
        explanationHindi: "लाफिंग गैस का रासायनिक नाम नाइट्रस ऑक्साइड (Nitrous Oxide) है, और इसका रासायनिक सूत्र N2O है। इसकी खोज जोसेफ प्रिस्टले ने 1772 में की थी। इसका उपयोग दंत चिकित्सा में हल्की बेहोशी या दर्द निवारक के रूप में किया जाता है।"
      },
      {
        id: "rw-q3",
        questionText: "मानव शरीर में रक्त का थक्का (Blood Clotting) बनाने में कौन सा विटामिन सहायक होता है?",
        options: [
          "विटामिन A",
          "विटामिन C",
          "विटामिन K",
          "विटामिन E"
        ],
        correctOptionIndex: 2,
        subject: "Science",
        explanationHindi: "मानव शरीर में विटामिन K रक्त का थक्का (Prothrombin के निर्माण में) बनाने के लिए आवश्यक है। विटामिन K की कमी होने पर चोट लगने पर खून का बहना बंद नहीं होता है।"
      },
      {
        id: "rw-q4",
        questionText: "कंप्यूटर का मस्तिष्क किसे कहा जाता है?",
        options: [
          "RAM",
          "Hard Disk",
          "CPU",
          "Monitor"
        ],
        correctOptionIndex: 2,
        subject: "Computer",
        explanationHindi: "CPU (Central Processing Unit) को कंप्यूटर का दिमाग या मस्तिष्क कहा जाता है। यह सभी प्रकार के डेटा प्रोसेसिंग और नियंत्रण कार्यों को संपन्न करता है।"
      }
    ]
  },
  {
    id: "test-daroga-1",
    title: "Bihar Daroga Prelims Static GK Test - 03",
    subject: "General Studies",
    date: "2026-07-03",
    time: "11:00 AM",
    durationMinutes: 20,
    marksPerQuestion: 2,
    negativeMarking: 0.2, // Bihar Daroga standard negative marking
    batchName: "Bihar Daroga (S.I.) Batch",
    questions: [
      {
        id: "dg-q1",
        questionText: "बिहार में जल मंदिर कहाँ स्थित है?",
        options: [
          "पावापुरी",
          "राजगीर",
          "गया",
          "वैशाली"
        ],
        correctOptionIndex: 0,
        subject: "Bihar GK",
        explanationHindi: "बिहार में प्रसिद्ध जल मंदिर पावापुरी में स्थित है। यह जैन धर्म का एक अत्यंत पवित्र तीर्थ स्थल है जहाँ भगवान महावीर ने मोक्ष (निर्वाण) प्राप्त किया था। यह मंदिर एक बड़े तालाब के बीच में सफेद संगमरमर से बना हुआ है।"
      },
      {
        id: "dg-q2",
        questionText: "भारतीय संविधान का कौन सा अनुच्छेद 'ग्राम पंचायतों के संगठन' से संबंधित है?",
        options: [
          "अनुच्छेद 32",
          "अनुच्छेद 40",
          "अनुच्छेद 44",
          "अनुच्छेद 48"
        ],
        correctOptionIndex: 1,
        subject: "GK",
        explanationHindi: "भारतीय संविधान के नीति निदेशक तत्वों के अंतर्गत 'अनुच्छेद 40' राज्य को ग्राम पंचायतों के गठन का निर्देश देता है। इसे गांधीवादी सिद्धांतों के अनुरूप माना जाता है। बाद में 73वें संविधान संशोधन द्वारा पंचायतों को संवैधानिक दर्जा मिला।"
      },
      {
        id: "dg-q3",
        questionText: "चंपारण सत्याग्रह (1917) के दौरान महात्मा गांधी के प्राण किसने बचाए थे?",
        options: [
          "बतख मियां",
          "राजकुमार शुक्ल",
          "राजेंद्र प्रसाद",
          "जेपी कृपलानी"
        ],
        correctOptionIndex: 0,
        subject: "Bihar GK",
        explanationHindi: "1917 में चंपारण सत्याग्रह के समय महात्मा गांधी जब नील बागान मालिक इरविन से मिलने गए थे, तो इरविन ने गांधीजी को दूध में जहर देकर मारने की साजिश रची थी। बतख मियां (जो कि रसोइया थे) ने गांधीजी को सचेत कर उनके प्राण बचाए थे। यह बिहार के इतिहास का एक बहुत ही महत्वपूर्ण और गौरवशाली तथ्य है।"
      }
    ]
  },
  {
    id: "test-board-10-science",
    title: "Bihar Board Class 10th Matric Science Chapter 1 MCQ Test",
    subject: "Science",
    date: "2026-07-04",
    time: "09:00 AM",
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarking: 0.0, // No negative marking in Bihar board exams
    batchName: "Bihar Board Matric Batch 2026",
    questions: [
      {
        id: "bsebold-10-s1",
        questionText: "लोहे को जिंक से लेपित करने की क्रिया को क्या कहते हैं?",
        options: [
          "संक्षारण",
          "गैल्वेनीकरण (Galvanization)",
          "पानी चढ़ाना",
          "विद्युत अपघटन"
        ],
        correctOptionIndex: 1,
        subject: "Science",
        explanationHindi: "लोहे को जंग (corrosion) से बचाने के लिए उस पर जस्ते (zinc) की एक पतली परत चढ़ाने की क्रिया को गैल्वेनीकरण या यशदलेपन (Galvanization) कहते हैं।"
      },
      {
        id: "bsebold-10-s2",
        questionText: "किसी उदासीन विलयन (Neutral Solution) का pH मान कितना होता है?",
        options: [
          "5",
          "7",
          "14",
          "0"
        ],
        correctOptionIndex: 1,
        subject: "Science",
        explanationHindi: "pH पैमाना 0 से 14 तक होता है। 7 मान उदासीन विलयन को दर्शाता है। 7 से कम मान अम्लीय (Acidic) और 7 से अधिक मान क्षारीय (Basic) विलयन को दर्शाता है। अतः शुद्ध पानी या उदासीन विलयन का pH मान 7 होता है।"
      }
    ]
  },
  {
    id: "test-board-12-physics",
    title: "Bihar Board Class 12th Intermediate Physics Special - Electrostatics",
    subject: "Physics",
    date: "2026-07-05",
    time: "11:00 AM",
    durationMinutes: 20,
    marksPerQuestion: 2,
    negativeMarking: 0.0, // Board standard
    batchName: "Bihar Board Inter Science 2026",
    questions: [
      {
        id: "bsebold-12-p1",
        questionText: "निर्वात की विद्युतशीलता (Permittivity of Free Space - ε₀) का मात्रक क्या होता है?",
        options: [
          "Fm⁻¹ (Farad per meter)",
          "CV⁻¹",
          "N m² C⁻²",
          "C² N⁻¹ m⁻²"
        ],
        correctOptionIndex: 0,
        subject: "Physics",
        explanationHindi: "निर्वात की विद्युतशीलता (ε₀) का SI मात्रक Farad per meter (Fm⁻¹) या C² N⁻¹ m⁻² होता है। इसका मान लगभग 8.85 × 10⁻¹² F/m होता है।"
      },
      {
        id: "bsebold-12-p2",
        questionText: "विद्युत फ्लक्स (Electric Flux) का S.I. मात्रक क्या होता है?",
        options: [
          "वेबर (Weber)",
          "वोल्ट-मीटर (Volt-meter)",
          "एम्पीयर-मीटर",
          "टेस्ला (Tesla)"
        ],
        correctOptionIndex: 1,
        subject: "Physics",
        explanationHindi: "विद्युत फ्लक्स का SI मात्रक वोल्ट-मीटर (V-m) या न्यूटन-मीटर²/कूलॉम (N m²/C) होता है। वेबर चुंबकीय फ्लक्स का और टेस्ला चुंबकीय क्षेत्र का मात्रक होता है।"
      }
    ]
  }
];

export const MOCK_STUDENTS = [
  { mobile: "9876543210", name: "Raju Kumar", batchName: "Railway Mission 2026", rollNumber: "R-101", createdAt: "2026-06-25" },
  { mobile: "9123456789", name: "Vikash Singh", batchName: "BSSC Inter Level 2026", rollNumber: "B-154", createdAt: "2026-06-26" },
  { mobile: "8888877777", name: "Anjali Kumari", batchName: "Bihar Daroga (S.I.) Batch", rollNumber: "D-203", createdAt: "2026-06-27" },
  { mobile: "9999900000", name: "Amit Yadav", batchName: "BSSC Inter Level 2026", rollNumber: "B-108", createdAt: "2026-06-28" },
  { mobile: "9000011111", name: "Suman Kumari", batchName: "Railway Mission 2026", rollNumber: "R-112", createdAt: "2026-06-29" }
];

export const INITIAL_RESULTS: TestResult[] = [
  {
    id: "res-1",
    testId: "test-bssc-1",
    testTitle: "BSSC Inter Level special Mock Test - 01",
    studentMobile: "9123456789",
    studentName: "Vikash Singh",
    rollNumber: "B-154",
    batchName: "BSSC Inter Level 2026",
    correctAnswers: 4,
    wrongAnswers: 1,
    unattemptedQuestions: 0,
    totalMarksObtained: 15, // 4 * 4 - 1 = 15
    maxMarks: 20,
    percentage: 75,
    timeTakenSeconds: 320,
    submittedAt: "2026-06-30T10:15:00Z",
    answersMap: { "bssc-q1": 0, "bssc-q2": 1, "bssc-q3": 0, "bssc-q4": 0, "bssc-q5": 1 }, // q3 was wrong (answered 0 (झरिया), correct was 1 (रानीगंज))
    subjectPerformance: {
      "Bihar GK": { correct: 1, total: 1 },
      "Science": { correct: 1, total: 1 },
      "GK": { correct: 0, total: 1 },
      "Reasoning": { correct: 1, total: 1 },
      "Math": { correct: 1, total: 1 }
    }
  },
  {
    id: "res-2",
    testId: "test-bssc-1",
    testTitle: "BSSC Inter Level special Mock Test - 01",
    studentMobile: "9999900000",
    studentName: "Amit Yadav",
    rollNumber: "B-108",
    batchName: "BSSC Inter Level 2026",
    correctAnswers: 5,
    wrongAnswers: 0,
    unattemptedQuestions: 0,
    totalMarksObtained: 20, // 5 * 4 = 20
    maxMarks: 20,
    percentage: 100,
    timeTakenSeconds: 240,
    submittedAt: "2026-06-30T11:05:00Z",
    answersMap: { "bssc-q1": 0, "bssc-q2": 1, "bssc-q3": 1, "bssc-q4": 0, "bssc-q5": 1 },
    subjectPerformance: {
      "Bihar GK": { correct: 1, total: 1 },
      "Science": { correct: 1, total: 1 },
      "GK": { correct: 1, total: 1 },
      "Reasoning": { correct: 1, total: 1 },
      "Math": { correct: 1, total: 1 }
    }
  },
  {
    id: "res-3",
    testId: "test-bssc-1",
    testTitle: "BSSC Inter Level special Mock Test - 01",
    studentMobile: "9876543210",
    studentName: "Raju Kumar",
    rollNumber: "R-101",
    batchName: "Railway Mission 2026",
    correctAnswers: 3,
    wrongAnswers: 2,
    unattemptedQuestions: 0,
    totalMarksObtained: 10, // 3 * 4 - 2 = 10
    maxMarks: 20,
    percentage: 50,
    timeTakenSeconds: 410,
    submittedAt: "2026-06-30T12:00:00Z",
    answersMap: { "bssc-q1": 0, "bssc-q2": 0, "bssc-q3": 1, "bssc-q4": 1, "bssc-q5": 1 },
    subjectPerformance: {
      "Bihar GK": { correct: 1, total: 1 },
      "Science": { correct: 0, total: 1 },
      "GK": { correct: 1, total: 1 },
      "Reasoning": { correct: 0, total: 1 },
      "Math": { correct: 1, total: 1 }
    }
  }
];
