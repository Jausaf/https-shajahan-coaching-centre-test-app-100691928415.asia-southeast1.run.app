import React, { useState, useEffect } from "react";
import { 
  Trophy, BookOpen, FileText, Bell, Phone, HelpCircle, 
  ArrowRight, Download, RefreshCw, User, Award, ExternalLink, MessageCircle,
  Calendar, CheckCircle, CreditCard, ClipboardList, Flame, Users, Check, X, Send, Sparkles
} from "lucide-react";
import { Student, Test, Notice, Quiz, PDFNote, TestResult, Question } from "../types";

interface StudentDashboardProps {
  student: Student;
  tests: Test[];
  notices: Notice[];
  quizzes: Quiz[];
  pdfNotes: PDFNote[];
  results: TestResult[];
  onStartTest: (test: Test) => void;
  onViewResult: (resultId: string) => void;
  onLogout: () => void;
  onNavigateToRevision: () => void;
}

export default function StudentDashboard({
  student,
  tests,
  notices,
  quizzes,
  pdfNotes,
  results,
  onStartTest,
  onViewResult,
  onLogout,
  onNavigateToRevision,
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "tests" | "results" | "leaderboard" | "practice" | "notices" | "pdf" | "homework" | "attendance" | "fees" | "admission"
  >("dashboard");
  
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("All");

  // State for Chapter-wise Practice
  const [practiceClass, setPracticeClass] = useState<string>(student.studentClass || "Class 10th");
  const [practiceSubject, setPracticeSubject] = useState<string>("Science");
  const [practiceChapter, setPracticeChapter] = useState<string>("रासायनिक अभिक्रियाएं एवं समीकरण");
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState(0);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [practiceShowExplanation, setPracticeShowExplanation] = useState(false);

  // State for Daily Current Affairs mini-quiz
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [dailyQuizAnswers, setDailyQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [dailyQuizSubmitted, setDailyQuizSubmitted] = useState(false);

  // State for Admission Inquiry form
  const [inquiryName, setInquiryName] = useState(student.name);
  const [inquiryMobile, setInquiryMobile] = useState(student.mobile);
  const [inquiryClass, setInquiryClass] = useState(student.studentClass || "Class 10th");
  const [inquiryStream, setInquiryStream] = useState(student.stream || "Science");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // State for Fees Receipt submit
  const [receiptRef, setReceiptRef] = useState("");
  const [receiptSuccess, setReceiptSuccess] = useState(false);

  // State for Homework submit
  const [homeworkSubmits, setHomeworkSubmits] = useState<{ [hwId: string]: string }>({});
  const [homeworkStatus, setHomeworkStatus] = useState<{ [hwId: string]: boolean }>({});

  const studentResults = results.filter(r => r.studentMobile === student.mobile);
  
  // Calculate stats for rank card
  const totalTestsGiven = studentResults.length;
  const bestScore = totalTestsGiven > 0 ? Math.max(...studentResults.map(r => r.percentage)) : 0;
  const averagePercentage = totalTestsGiven > 0 ? Math.round(studentResults.reduce((acc, r) => acc + r.percentage, 0) / totalTestsGiven) : 0;

  // Coaching WhatsApp contact details
  const whatsappNumber = "919546275231";
  const contactText = encodeURIComponent(`नमस्ते सर, मैं ${student.name} (${student.rollNumber}) बोल रहा हूँ। मुझे टेस्ट सीरीज़ के संबंध में एक सवाल है।`);

  // Subjects for subject-wise booster practice
  const subjects = ["All", "GK", "Math", "Reasoning", "Science", "Bihar GK", "Computer", "Current Affairs", "Physics", "Chemistry", "Social Science", "Hindi", "English", "Sanskrit"];

  // Mock Homework Data
  const mockHomeworkList = [
    {
      id: "hw-1",
      title: "Science Chapter 1 Formula Practice",
      classTarget: "Class 10th",
      subject: "Science",
      dueDate: "2026-07-03",
      instruction: "लोहे में जंग लगने के रासायनिक समीकरण को अपनी कॉपी में लिखकर उसका संतुलित समीकरण यहाँ दर्ज करें।"
    },
    {
      id: "hw-2",
      title: "Bihar GK Top 5 Freedom Fighters",
      classTarget: "Competitive",
      subject: "Bihar GK",
      dueDate: "2026-07-04",
      instruction: "बिहार के किन्हीं 5 प्रमुख स्वतंत्रता सेनानियों के नाम और उनके जन्म स्थान की सूची बनाकर नीचे दर्ज करें।"
    }
  ];

  // Filter homework matching student category
  const activeHomework = mockHomeworkList.filter(hw => {
    if (student.prepCategory === "Bihar Board") {
      return hw.classTarget === student.studentClass;
    }
    return hw.classTarget === "Competitive";
  });

  // Dynamic Leaderboard Calculations
  // Fetch top scorers for a given test (or overall)
  const getLeaderboardData = (testId: string | "overall") => {
    if (testId === "overall") {
      // Aggregate by student mobile
      const studentMap: { [mobile: string]: { name: string; roll: string; totalMarks: number; testsCount: number; maxPercentage: number } } = {};
      results.forEach(res => {
        if (!studentMap[res.studentMobile]) {
          studentMap[res.studentMobile] = {
            name: res.studentName,
            roll: res.rollNumber,
            totalMarks: 0,
            testsCount: 0,
            maxPercentage: 0
          };
        }
        studentMap[res.studentMobile].totalMarks += res.totalMarksObtained;
        studentMap[res.studentMobile].testsCount += 1;
        if (res.percentage > studentMap[res.studentMobile].maxPercentage) {
          studentMap[res.studentMobile].maxPercentage = res.percentage;
        }
      });

      return Object.values(studentMap)
        .sort((a, b) => b.totalMarks - a.totalMarks || b.maxPercentage - a.maxPercentage)
        .slice(0, 10);
    } else {
      // Test-specific leaderboard
      return results
        .filter(r => r.testId === testId)
        .sort((a, b) => b.totalMarksObtained - a.totalMarksObtained || a.timeTakenSeconds - b.timeTakenSeconds)
        .slice(0, 10);
    }
  };

  const [leaderboardFilter, setLeaderboardFilter] = useState<string>("overall");

  // Current Affairs Quiz Questions
  const dailyCurrentAffairsQuiz = {
    title: "आज का डेली करंट अफेयर्स क्विज़ — " + new Date().toLocaleDateString("hi-IN"),
    questions: [
      {
        id: "ca-1",
        questionText: "हाल ही में बिहार के किस जिले में नए राजकीय खेल अकादमी का उद्घाटन किया गया है?",
        options: ["राजगीर (नालंदा)", "पटना", "गया", "मुजफ्फरपुर"],
        correctOptionIndex: 0,
        explanation: "बिहार के नालंदा जिले के राजगीर में अंतरराष्ट्रीय मानकों वाली अत्याधुनिक राजकीय खेल अकादमी और खेल विश्वविद्यालय का उद्घाटन किया गया है।"
      },
      {
        id: "ca-2",
        questionText: "रेलवे बोर्ड के नए अध्यक्ष और मुख्य कार्यकारी अधिकारी (CEO) के रूप में किसे नियुक्त किया गया है?",
        options: ["सतीश कुमार", "अनिल कुमार लाहोटी", "जया वर्मा सिन्हा", "विवेक सहाय"],
        correctOptionIndex: 0,
        explanation: "सतीश कुमार को रेलवे बोर्ड का नया अध्यक्ष और सीईओ नियुक्त किया गया है। वे भारतीय रेलवे सिग्नलिंग इंजीनियर्स सेवा (IRSSE) के वरिष्ठ अधिकारी हैं।"
      }
    ]
  };

  // Chapter-wise Practice Questions
  const practiceQuestionPool: { [key: string]: Question[] } = {
    "रासायनिक अभिक्रियाएं एवं समीकरण": [
      {
        id: "prac-chem-1",
        questionText: "श्वसन (Respiration) किस प्रकार की रासायनिक अभिक्रिया है?",
        options: ["ऊष्माक्षेपी (Exothermic)", "ऊष्माशोषी (Endothermic)", "संयोजन", "अपघटन"],
        correctOptionIndex: 0,
        subject: "Science",
        explanationHindi: "श्वसन एक ऊष्माक्षेपी (Exothermic) अभिक्रिया है क्योंकि इस प्रक्रिया में भोजन के ऑक्सीकरण के दौरान ऊर्जा (ATP के रूप में) और ऊष्मा मुक्त होती है।"
      },
      {
        id: "prac-chem-2",
        questionText: "चिप्स की थैली में ऑक्सीकरण से बचाने के लिए कौन-सी गैस भरी जाती है?",
        options: ["ऑक्सीजन", "नाइट्रोजन", "हाइड्रोजन", "क्लोरीन"],
        correctOptionIndex: 1,
        subject: "Science",
        explanationHindi: "चिप्स की थैलियों में ऑक्सीजन को हटाकर नाइट्रोजन गैस भरी जाती है। नाइट्रोजन एक अक्रिय गैस है जो वसा और तेल युक्त भोजन के ऑक्सीकरण को रोकती है, जिससे वे विकृतगंधिता (Rancidity) से बचे रहते हैं।"
      }
    ],
    "बिहार सामान्य ज्ञान (Bihar GK)": [
      {
        id: "prac-bgk-1",
        questionText: "बिहार का शोक (Sorrow of Bihar) किस नदी को कहा जाता है?",
        options: ["गंगा नदी", "बागमती नदी", "कोसी नदी", "गंडक नदी"],
        correctOptionIndex: 2,
        subject: "Bihar GK",
        explanationHindi: "कोसी नदी को 'बिहार का शोक' कहा जाता है क्योंकि यह अपनी दिशा बदलने और मानसून के दौरान उत्तरी बिहार में विनाशकारी बाढ़ लाने के लिए कुख्यात है।"
      },
      {
        id: "prac-bgk-2",
        questionText: "बिहार में १८५७ की क्रांति के मुख्य नेता कौन थे?",
        options: ["वीर कुंवर सिंह", "नाना साहेब", "मंगल पांडे", "तात्या टोपे"],
        correctOptionIndex: 0,
        subject: "Bihar GK",
        explanationHindi: "बिहार के जगदीशपुर (आरा) के ८० वर्षीय जमींदार बाबू वीर कुंवर सिंह १८५७ के प्रथम भारतीय स्वतंत्रता संग्राम के महान सेनानायक थे। उन्होंने अंग्रेजों के खिलाफ अत्यंत वीरतापूर्वक युद्ध लड़ा।"
      }
    ]
  };

  const selectedPracticeQuestions = practiceQuestionPool[practiceChapter] || practiceQuestionPool["रासायनिक अभिक्रियाएं एवं समीकरण"];

  const handlePracticeAnswerSelect = (optIdx: number) => {
    setSelectedPracticeOption(optIdx);
    setPracticeShowExplanation(true);
  };

  const handleNextPracticeQuestion = () => {
    if (practiceQuestionIndex < selectedPracticeQuestions.length - 1) {
      setPracticeQuestionIndex(prev => prev + 1);
      setSelectedPracticeOption(null);
      setPracticeShowExplanation(false);
    } else {
      setIsPracticing(false);
      alert("बधाई हो! आपने इस चैप्टर का अभ्यास पूर्ण कर लिया है। शजहान सर के साथ इसी तरह लगातार मेहनत करते रहें।");
    }
  };

  // Inquiry Form Handler
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiry = {
      name: inquiryName,
      mobile: inquiryMobile,
      studentClass: inquiryClass,
      stream: inquiryStream,
      message: inquiryMsg,
      submittedAt: new Date().toISOString()
    };
    const existingInquiries = JSON.parse(localStorage.getItem("coaching_inquiries") || "[]");
    localStorage.setItem("coaching_inquiries", JSON.stringify([...existingInquiries, inquiry]));
    setInquirySuccess(true);
    setInquiryMsg("");
    setTimeout(() => setInquirySuccess(false), 5000);
  };

  // Receipt reference Handler
  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptRef.trim()) return;
    setReceiptSuccess(true);
    setReceiptRef("");
    setTimeout(() => setReceiptSuccess(false), 5000);
  };

  // Submit Homework text
  const handleHomeworkSubmit = (hwId: string) => {
    const text = homeworkSubmits[hwId];
    if (!text || !text.trim()) {
      alert("कृपया अपना उत्तर बॉक्स में दर्ज करें।");
      return;
    }
    setHomeworkStatus(prev => ({ ...prev, [hwId]: true }));
    alert("गृहकार्य सफलतापूर्वक सबमिट हो गया है! शिक्षक जल्द ही इसकी जांच करेंगे।");
  };

  // Static Study Materials categories
  const modelPapers = [
    { title: "BSEB Class 10th Matric Science Official Model Paper 2026", size: "3.2 MB", downloads: 480 },
    { title: "BSEB Class 12th Physics Chapterwise Blueprint & Model Set", size: "4.1 MB", downloads: 350 },
    { title: "BSSC Inter Level Mock Practice Booklet - Set 01 to 05", size: "8.5 MB", downloads: 1200 },
    { title: "Railway Group D & NTPC Speedy General Science Guide Book", size: "12.4 MB", downloads: 1550 }
  ];

  const previousYearPapers = [
    { title: "BSEB Class 10th Matric Mathematics Board Exam Paper (2025)", size: "2.8 MB", downloads: 720 },
    { title: "BSEB Class 12th Intermediate Chemistry Previous 5 Years Qs", size: "5.6 MB", downloads: 610 },
    { title: "BSSC Inter Level Mains Exam Original Solved Paper (2023)", size: "4.9 MB", downloads: 910 },
    { title: "Bihar Police Sub-Inspector Prelims General Studies (2024)", size: "3.5 MB", downloads: 840 }
  ];

  return (
    <div id="student-dashboard" className="min-h-screen bg-slate-900 text-white font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Premium Sub-Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 py-2 px-4 text-center text-xs font-bold tracking-wider">
        🔥 शजहान कोचिंग सेंटर ऑनलाइन टेस्ट पोर्टल — बिहार बोर्ड Class 8th to 12th & सरकारी परीक्षा तैयारी स्पेशल!
      </div>

      {/* Main Student Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block -mb-1">STUDENT PORTAL</span>
              <h2 className="text-base sm:text-lg font-black text-amber-500 tracking-tight">SHAJAHAN COACHING</h2>
            </div>
          </div>

          {/* Student Quick Info */}
          <div className="hidden md:flex items-center gap-4 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <User className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">{student.name}</p>
              <p className="text-[11px] text-slate-400">अनुक्रमांक (Roll): <span className="font-mono text-amber-400">{student.rollNumber}</span> | {student.batchName}</p>
            </div>
          </div>

          {/* Logout Action */}
          <button 
            onClick={onLogout}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-red-400 font-semibold px-4 py-2 rounded-lg border border-red-500/10 hover:border-red-500/20 transition cursor-pointer"
          >
            लॉगआउट (Logout)
          </button>
        </div>

        {/* Responsive Mobile Sub-header */}
        <div className="md:hidden bg-slate-950 px-4 py-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400">छात्र: </span>
            <span className="font-bold text-white">{student.name}</span>
          </div>
          <div>
            <span className="text-slate-400">अनुक्रमांक: </span>
            <span className="font-mono text-amber-400 font-bold">{student.rollNumber}</span>
          </div>
          <div>
            <span className="text-slate-400">बैच: </span>
            <span className="text-amber-400 font-medium">{student.batchName.split(" ")[0]}</span>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="bg-slate-950 border-t border-slate-800 overflow-x-auto select-none scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 flex gap-1.5 py-2">
            {[
              { id: "dashboard", label: "डैशबोर्ड (Dashboard)" },
              { id: "tests", label: "ऑनलाइन टेस्ट (Tests)" },
              { id: "results", label: "रिजल्ट्स (Results)" },
              { id: "leaderboard", label: "लीडरबोर्ड (Leaderboard)" },
              { id: "practice", label: "चैप्टर प्रैक्टिस (Practice)" },
              { id: "pdf", label: "स्टडी मटेरियल (PDFs)" },
              { id: "homework", label: "गृहकार्य (Homework)" },
              { id: "attendance", label: "उपस्थिति (Attendance)" },
              { id: "fees", label: "फीस विवरण (Fees)" },
              { id: "admission", label: "प्रवेश पूछताछ (Admission)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsPracticing(false);
                }}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold transition duration-150 cursor-pointer ${
                  activeTab === tab.id 
                    ? "bg-amber-500 text-slate-950 shadow-md" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* NOTICES BANNER */}
        {notices.length > 0 && activeTab === "dashboard" && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3 items-start">
              <span className="inline-block shrink-0 bg-red-600 text-white px-2.5 py-1 rounded text-[10px] font-black animate-pulse uppercase">
                महत्वपूर्ण सूचना
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">{notices[0].title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{notices[0].content}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setActiveTab("dashboard");
                const noticeBoardSection = document.getElementById("notice-board-section");
                if (noticeBoardSection) noticeBoardSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-amber-400 font-semibold flex items-center gap-1 hover:underline shrink-0"
            >
              <span>पढ़ें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TAB 1: DASHBOARD MAIN */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            
            {/* Top Row: Welcome & Score Card & Revision */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <h3 className="text-2xl font-black text-white">जय हिंद, {student.name}!</h3>
                  <p className="text-xs text-slate-400 mt-1">शजहान कोचिंग सेंटर पटना के डिजिटल पोर्टल पर आपका स्वागत है।</p>
                  
                  <div className="mt-4 space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                    <p className="text-xs text-slate-400">तैयारी श्रेणी: <span className="font-bold text-amber-400">{student.prepCategory || "Competitive Exam"}</span></p>
                    {student.studentClass && <p className="text-xs text-slate-400">कक्षा / क्लास: <span className="font-bold text-amber-400">{student.studentClass}</span></p>}
                    {student.stream && <p className="text-xs text-slate-400">स्ट्रीम / संकाय: <span className="font-bold text-amber-400">{student.stream}</span></p>}
                    <p className="text-xs text-slate-400">बैच: <span className="font-bold text-amber-400">{student.batchName}</span></p>
                    <p className="text-xs text-slate-400">अनुक्रमांक: <span className="font-bold text-amber-400 font-mono">{student.rollNumber}</span></p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setActiveTab("tests")}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>टेस्ट दें (Start Tests)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${contactText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl transition duration-150 flex items-center justify-center"
                    title="Direct WhatsApp Helpline"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Performance Rank Card */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-slate-300">प्रदर्शन कार्ड (Your Scorecard)</h3>
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-850">
                      <p className="text-2xl font-black text-white font-mono">{totalTestsGiven}</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold leading-none font-sans">कुल टेस्ट</p>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-850">
                      <p className="text-2xl font-black text-emerald-400 font-mono">{bestScore}%</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold leading-none font-sans">सर्वश्रेष्ठ</p>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-850">
                      <p className="text-2xl font-black text-amber-400 font-mono">{averagePercentage}%</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold leading-none font-sans">औसत</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-center text-xs text-blue-300">
                    {totalTestsGiven > 0 ? "आपकी लाइव रैंकिंग बैच में अपडेट कर दी गई है। निरंतर प्रयास करते रहें!" : "रैंकिंग सूची में आने के लिए आज ही पहला टेस्ट दें।"}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab("results")}
                  className="mt-4 w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-bold py-2.5 px-4 rounded-xl transition duration-150 cursor-pointer"
                >
                  विस्तृत रिपोर्ट देखें
                </button>
              </div>

              {/* Revision Mode Quick Card */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                <div>
                  <h3 className="text-base font-bold text-slate-300">गलत प्रश्न सुधारें (Revision)</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    जो प्रश्न आपके पिछले टेस्टों में गलत हुए हैं, उन्हें दोबारा अभ्यास करके सुधारें। बोर्ड परीक्षाओं या सरकारी नौकरी में एक भी अंक न गंवाएं!
                  </p>

                  <div className="mt-6 flex items-center justify-between p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                    <div>
                      <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">रिवीजन पूल</span>
                      <p className="text-sm font-bold text-white mt-1">गलत उत्तरों का संग्रह सक्रिय</p>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center font-bold font-mono">
                      !
                    </span>
                  </div>
                </div>

                <button
                  onClick={onNavigateToRevision}
                  className="mt-6 w-full bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-600/30 font-bold py-3 px-4 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>गलत प्रश्न सुधारें (Revision Mode)</span>
                </button>
              </div>

            </div>

            {/* Daily Current Affairs Mini-quiz */}
            <div className="bg-gradient-to-r from-blue-950 to-slate-950 p-6 rounded-2xl border border-blue-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400 font-extrabold tracking-widest uppercase block">DAILY SPECIAL BOOST</span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">{dailyCurrentAffairsQuiz.title}</h4>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDailyQuiz(true);
                    setDailyQuizSubmitted(false);
                    setDailyQuizAnswers({});
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-md shadow-blue-600/10"
                >
                  <span>क्विज़ शुरू करें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Daily Quiz Modal / Block */}
              {showDailyQuiz && (
                <div className="mt-6 p-5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-blue-400">डेली करंट अफेयर्स बूस्टर प्रश्न</span>
                    <button 
                      onClick={() => setShowDailyQuiz(false)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {dailyCurrentAffairsQuiz.questions.map((q, qIdx) => (
                    <div key={q.id} className="space-y-3">
                      <p className="text-sm font-semibold text-white">{qIdx + 1}. {q.questionText}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = dailyQuizAnswers[q.id] === optIdx;
                          const isCorrect = q.correctOptionIndex === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={dailyQuizSubmitted}
                              onClick={() => setDailyQuizAnswers(p => ({ ...p, [q.id]: optIdx }))}
                              className={`text-left p-3 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                                dailyQuizSubmitted 
                                  ? isCorrect 
                                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                                    : isSelected 
                                      ? "bg-red-500/10 border-red-500 text-red-400" 
                                      : "bg-slate-950 border-slate-900 text-slate-500"
                                  : isSelected 
                                    ? "bg-blue-500/20 border-blue-500 text-white" 
                                    : "bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-900"
                              }`}
                            >
                              <span className="text-[10px] uppercase font-bold text-slate-500">[{["A", "B", "C", "D"][optIdx]}]</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                      {dailyQuizSubmitted && (
                        <p className="text-xs text-amber-400 bg-amber-500/5 p-2 rounded border border-amber-500/10 mt-1">
                          💡 <strong>स्पष्टीकरण:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  {!dailyQuizSubmitted && (
                    <div className="pt-3 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => setDailyQuizSubmitted(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-lg text-xs"
                      >
                        क्विज़ सबमिट करें (Submit Answers)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Main Active Test List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-amber-500 rounded-full block"></span>
                  <span>उपलब्ध लाइव ऑनलाइन टेस्ट (Active Tests)</span>
                </h3>
                <button onClick={() => setActiveTab("tests")} className="text-xs text-amber-400 font-semibold hover:underline">
                  सभी टेस्ट देखें ({tests.length})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tests.slice(0, 4).map((test) => {
                  const hasGiven = studentResults.some(r => r.testId === test.id);
                  return (
                    <div 
                      key={test.id} 
                      className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition duration-150 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {test.subject}
                          </span>
                          {hasGiven && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              सबमिट किया गया (Completed)
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white leading-snug mb-3">{test.title}</h4>
                        
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-400 font-medium mb-4">
                          <p>⏱️ समय: <span className="text-slate-200">{test.durationMinutes} मिनट</span></p>
                          <p>📝 प्रश्न: <span className="text-slate-200">{test.questions.length} Qs</span></p>
                          <p>💯 कुल अंक: <span className="text-slate-200">{test.questions.length * test.marksPerQuestion}</span></p>
                          <p>⚠️ नेगेटिव: <span className="text-red-400">-{test.negativeMarking} अंक</span></p>
                        </div>
                      </div>

                      {hasGiven ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const res = studentResults.find(r => r.testId === test.id);
                              if (res) onViewResult(res.id);
                            }}
                            className="flex-1 text-center bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-amber-400 font-bold py-2.5 rounded-xl transition duration-150"
                          >
                            परिणाम & रैंक देखें
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onStartTest(test)}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>परीक्षा शुरू करें (Start Test)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Quizzes & Practice Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Daily Quizzes */}
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full block"></span>
                  <span>डेली क्विज़ बूस्टर (Daily Quizzes)</span>
                </h3>

                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <div 
                      key={quiz.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between hover:border-slate-800 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
                          {quiz.subject.slice(0, 3)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{quiz.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{quiz.questionsCount} महत्वपूर्ण प्रश्न | {quiz.subject}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          alert(`डेली क्विज़: "${quiz.title}"\n\nडेमो क्विज़ मुख्य परीक्षा के समान ही काम करता है। कृपया मुख्य टेस्ट सूची में जाकर पूर्ण मॉक टेस्ट का अभ्यास करें।`);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition duration-150 cursor-pointer"
                      >
                        शुरू करें
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject-Wise Selector */}
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-6 bg-purple-500 rounded-full block"></span>
                  <span>विषयवार विशेष अभ्यास (Subject Practice)</span>
                </h3>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    रेलवे और राज्य लोक सेवा परीक्षाओं में विशिष्ट विषयों पर अधिक पकड़ बनाने के लिए यहाँ से अभ्यास विषय का चयन करें।
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {subjects.filter(s => s !== "All" && s !== "Physics" && s !== "Chemistry").slice(0, 6).map((subject, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedSubjectFilter(subject);
                          setActiveTab("tests");
                        }}
                        className="bg-slate-900 hover:bg-purple-500/10 hover:border-purple-500/30 border border-slate-800 rounded-xl p-3 text-center transition duration-150 group cursor-pointer"
                      >
                        <span className="block text-xs font-bold text-slate-300 group-hover:text-purple-400">{subject}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5 block">अभ्यास प्रारंभ</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Notice Board Section in Dashboard */}
            <div id="notice-board-section" className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>कोचिंग सूचना बोर्ड (Notice Board)</span>
              </h3>
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="p-4 bg-slate-900 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-amber-500 font-bold">[{notice.tag}]</span>
                      <span className="text-[10px] text-slate-500">{notice.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{notice.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{notice.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DETAILED TESTS LIST */}
        {activeTab === "tests" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">ऑनलाइन टेस्ट श्रृंखला (Online Mock Tests)</h3>
                <p className="text-xs text-slate-400 mt-1">सभी प्रश्न नवीनतम परीक्षा पैटर्न (Railway/BSSC/SSC/BSEB) पर आधारित हैं।</p>
              </div>

              {/* Subject Filters */}
              <div className="flex flex-wrap gap-1.5 max-w-full">
                {subjects.slice(0, 8).map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubjectFilter(sub)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 cursor-pointer ${
                      selectedSubjectFilter === sub 
                        ? "bg-amber-500 text-slate-950" 
                        : "bg-slate-950 text-slate-400 hover:bg-slate-850 hover:text-white"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Cards List */}
            {tests.filter(t => selectedSubjectFilter === "All" || t.subject.includes(selectedSubjectFilter) || t.questions.some(q => q.subject === selectedSubjectFilter)).length === 0 ? (
              <div className="text-center bg-slate-950 p-12 rounded-2xl border border-slate-850">
                <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-base text-slate-400 font-medium">चयनित विषय "{selectedSubjectFilter}" के लिए अभी कोई सक्रिय टेस्ट उपलब्ध नहीं है।</p>
                <button onClick={() => setSelectedSubjectFilter("All")} className="text-xs text-amber-400 mt-2 font-bold hover:underline">
                  सभी टेस्ट देखें
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests
                  .filter(t => selectedSubjectFilter === "All" || t.subject.includes(selectedSubjectFilter) || t.questions.some(q => q.subject === selectedSubjectFilter))
                  .map((test) => {
                    const hasGiven = studentResults.some(r => r.testId === test.id);
                    return (
                      <div 
                        key={test.id} 
                        className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 uppercase tracking-wider">
                              {test.subject}
                            </span>
                            {hasGiven ? (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                COMPLETED
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10 animate-pulse">
                                LIVE
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-base font-bold text-white leading-snug mb-3">{test.title}</h4>
                          <p className="text-xs text-slate-400 mb-4 font-medium">बैच पात्रता: {test.batchName}</p>

                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 grid grid-cols-2 gap-2 text-xs text-slate-400 mb-6">
                            <p>⏳ अवधि: <span className="text-white font-bold">{test.durationMinutes} मिनट</span></p>
                            <p>❓ प्रश्न: <span className="text-white font-bold">{test.questions.length} प्रश्न</span></p>
                            <p>⭐ प्रति अंक: <span className="text-white font-bold">+{test.marksPerQuestion}</span></p>
                            <p>🎯 नेगेटिव: <span className="text-red-400 font-bold">-{test.negativeMarking}</span></p>
                          </div>
                        </div>

                        {hasGiven ? (
                          <button
                            onClick={() => {
                              const res = studentResults.find(r => r.testId === test.id);
                              if (res) onViewResult(res.id);
                            }}
                            className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-amber-400 font-bold py-3 rounded-xl transition duration-150 cursor-pointer"
                          >
                            परिणाम & रैंक रिपोर्ट देखें
                          </button>
                        ) : (
                          <button
                            onClick={() => onStartTest(test)}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>परीक्षा प्रारंभ करें (Start Test)</span>
                            <ArrowRight className="w-4 h-4 text-slate-950" />
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TEST HISTORY & DETAILED RESULTS REPORT */}
        {activeTab === "results" && (
          <div>
            <h3 className="text-xl font-black text-white mb-2">आपका परीक्षा परिणाम एवं इतिहास (Your Test History)</h3>
            <p className="text-xs text-slate-400 mb-6">यहाँ आपके द्वारा सबमिट किए गए सभी ऑनलाइन मॉक टेस्ट की सूची है।</p>

            {studentResults.length === 0 ? (
              <div className="text-center bg-slate-950 p-12 rounded-2xl border border-slate-850">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-base text-slate-400 font-medium">आपने अभी तक कोई टेस्ट नहीं दिया है।</p>
                <button onClick={() => setActiveTab("tests")} className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold transition">
                  पहला मॉक टेस्ट दें
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {studentResults.map((result) => (
                  <div 
                    key={result.id}
                    className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                          SUBMITTED
                        </span>
                        <span className="text-xs text-slate-500 font-mono">तिथि: {new Date(result.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-base font-bold text-white leading-tight">{result.testTitle}</h4>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2 font-medium">
                        <p>💯 अंक प्राप्त: <span className="text-amber-400 font-bold">{result.totalMarksObtained} / {result.maxMarks}</span></p>
                        <p>🎯 शुद्धता (Accuracy): <span className="text-emerald-400 font-bold">{result.percentage}%</span></p>
                        <p>✅ सही: <span className="text-white">{result.correctAnswers}</span> | ❌ गलत: <span className="text-red-400">{result.wrongAnswers}</span> | ➖ अनटेम्पटेड: <span className="text-slate-500">{result.unattemptedQuestions}</span></p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => onViewResult(result.id)}
                        className="flex-1 md:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>स्कोरकार्ड और रैंक (Score & Rank)</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LEADERBOARD SYSTEM */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">Shajahan Coaching Centre लाइव लीडरबोर्ड</h3>
              <p className="text-xs text-slate-400 mt-1">टॉप 10 छात्र जिन्होंने उत्कृष्ट प्रदर्शन दर्ज किया है। अपनी तैयारी को सर्वश्रेष्ठ बनाएं!</p>
            </div>

            {/* Leaderboard Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLeaderboardFilter("overall")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  leaderboardFilter === "overall" ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-400"
                }`}
              >
                🏆 मासिक टॉपर लिस्ट (Monthly Overall)
              </button>
              {tests.map(t => (
                <button
                  key={t.id}
                  onClick={() => setLeaderboardFilter(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    leaderboardFilter === t.id ? "bg-amber-500 text-slate-950" : "bg-slate-950 text-slate-400"
                  }`}
                >
                  📄 {t.title.split(" - ")[0]}
                </button>
              ))}
            </div>

            {/* Leaderboard Table/Cards */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">RANKINGS</span>
                <span className="text-xs text-slate-400 font-medium">रीयल-टाइम अपडेटेड</span>
              </div>

              {leaderboardFilter === "overall" ? (
                // Overall Leaderboard
                <div className="divide-y divide-slate-850">
                  {getLeaderboardData("overall").map((item: any, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition">
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                          idx === 0 ? "bg-yellow-500 text-slate-950" :
                          idx === 1 ? "bg-slate-300 text-slate-950" :
                          idx === 2 ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{item.name}</span>
                            {idx < 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                          </p>
                          <p className="text-xs text-slate-500">अनुक्रमांक: {item.roll} | कुल परीक्षा: {item.testsCount}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-amber-400 font-mono">{item.totalMarks} अंक</span>
                        <p className="text-[10px] text-slate-500">सर्वोच्च प्रतिशत: {item.maxPercentage}%</p>
                      </div>
                    </div>
                  ))}
                  {getLeaderboardData("overall").length === 0 && (
                    <p className="text-center p-8 text-slate-500 text-sm">कोई डेटा उपलब्ध नहीं है। अभी कोई टेस्ट सबमिट नहीं हुआ है।</p>
                  )}
                </div>
              ) : (
                // Test specific leaderboard
                <div className="divide-y divide-slate-850">
                  {getLeaderboardData(leaderboardFilter).map((res: any, idx) => (
                    <div key={res.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition">
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                          idx === 0 ? "bg-yellow-500 text-slate-950" :
                          idx === 1 ? "bg-slate-300 text-slate-950" :
                          idx === 2 ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{res.studentName}</span>
                            {idx < 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                          </p>
                          <p className="text-xs text-slate-500">रोल: {res.rollNumber} | बैच: {res.batchName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-amber-400 font-mono">{res.totalMarksObtained} / {res.maxMarks} अंक</span>
                        <p className="text-[10px] text-slate-500">समय: {Math.floor(res.timeTakenSeconds / 60)} मिनट {res.timeTakenSeconds % 60} सेकंड</p>
                      </div>
                    </div>
                  ))}
                  {getLeaderboardData(leaderboardFilter).length === 0 && (
                    <p className="text-center p-8 text-slate-500 text-sm">इस विशेष टेस्ट के लिए अभी तक कोई परिणाम दर्ज नहीं हुआ है। प्रथम स्थान प्राप्त करने के लिए इसे आज ही दें!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CHAPTER-WISE & SUBJECT-WISE PRACTICE */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            {!isPracticing ? (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white">अध्यायवार अभ्यास (Chapter-wise Practice Mode)</h3>
                  <p className="text-xs text-slate-400 mt-1">शजहान कोचिंग स्पेशल क्लास के आधार पर क्लास, विषय एवं चैप्टर का चयन कर तुरंत अभ्यास प्रारंभ करें।</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Class selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">कक्षा (Class)</label>
                    <select
                      value={practiceClass}
                      onChange={(e) => setPracticeClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Class 8th">Class 8th (कक्षा 8)</option>
                      <option value="Class 9th">Class 9th (कक्षा 9)</option>
                      <option value="Class 10th">Class 10th (कक्षा 10)</option>
                      <option value="Class 11th">Class 11th (कक्षा 11)</option>
                      <option value="Class 12th">Class 12th (कक्षा 12)</option>
                      <option value="Competitive">General Competitive (प्रतियोगी परीक्षा)</option>
                    </select>
                  </div>

                  {/* Subject selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">विषय (Subject)</label>
                    <select
                      value={practiceSubject}
                      onChange={(e) => setPracticeSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Science">Science (विज्ञान)</option>
                      <option value="Bihar GK">Bihar GK (बिहार सामान्य ज्ञान)</option>
                      <option value="Math">Mathematics (गणित)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                    </select>
                  </div>

                  {/* Chapter selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">अध्याय (Chapter)</label>
                    <select
                      value={practiceChapter}
                      onChange={(e) => setPracticeChapter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500"
                    >
                      {practiceSubject === "Science" ? (
                        <>
                          <option value="रासायनिक अभिक्रियाएं एवं समीकरण">अध्याय 1: रासायनिक अभिक्रियाएं एवं समीकरण</option>
                          <option value="अम्ल, क्षारक एवं लवण">अध्याय 2: अम्ल, क्षारक एवं लवण</option>
                        </>
                      ) : (
                        <>
                          <option value="बिहार सामान्य ज्ञान (Bihar GK)">चैप्टर 1: बिहार सामान्य ज्ञान (Bihar GK)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850">
                  <button
                    onClick={() => {
                      setIsPracticing(true);
                      setPracticeQuestionIndex(0);
                      setSelectedPracticeOption(null);
                      setPracticeShowExplanation(false);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-6 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <BookOpen className="w-5 h-5 text-slate-950" />
                    <span>अभ्यास शुरू करें (Start Practice)</span>
                  </button>
                </div>
              </div>
            ) : (
              // Practice Session Arena
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider block">PRACTICE MODE ACTIVE</span>
                    <h3 className="text-sm font-bold text-white">{practiceClass} &gt; {practiceSubject} &gt; {practiceChapter}</h3>
                  </div>
                  <button
                    onClick={() => setIsPracticing(false)}
                    className="text-xs bg-slate-900 border border-slate-800 hover:text-white px-3 py-1.5 rounded-lg font-bold"
                  >
                    अभ्यास बंद करें (Exit)
                  </button>
                </div>

                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-850">
                  <span className="text-xs font-bold text-amber-400 font-mono">प्रश्न {practiceQuestionIndex + 1} / {selectedPracticeQuestions.length}</span>
                  <p className="text-base sm:text-lg font-bold text-white mt-2 leading-relaxed">
                    {selectedPracticeQuestions[practiceQuestionIndex].questionText}
                  </p>
                </div>

                <div className="space-y-2">
                  {selectedPracticeQuestions[practiceQuestionIndex].options.map((opt, optIdx) => {
                    const isCorrectOption = selectedPracticeQuestions[practiceQuestionIndex].correctOptionIndex === optIdx;
                    const isSelected = selectedPracticeOption === optIdx;
                    
                    let optClass = "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-850";
                    if (practiceShowExplanation) {
                      if (isCorrectOption) optClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                      else if (isSelected) optClass = "bg-red-500/10 border-red-500 text-red-400";
                    } else if (isSelected) {
                      optClass = "bg-amber-500/15 border-amber-500 text-white";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={practiceShowExplanation}
                        onClick={() => handlePracticeAnswerSelect(optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-4 cursor-pointer ${optClass}`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        }`}>
                          {["A", "B", "C", "D"][optIdx]}
                        </span>
                        <span className="text-sm sm:text-base font-semibold">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {practiceShowExplanation && (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl space-y-2">
                    <p className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>शजहान सर का हिंदी हल (Hindi Explanation)</span>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {selectedPracticeQuestions[practiceQuestionIndex].explanationHindi}
                    </p>
                  </div>
                )}

                {practiceShowExplanation && (
                  <div className="flex justify-end pt-3">
                    <button
                      onClick={handleNextPracticeQuestion}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl text-xs transition duration-150 flex items-center gap-1 cursor-pointer"
                    >
                      <span>अगला प्रश्न (Next Question)</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: STUDY MATERIAL & FREE PDF NOTES */}
        {activeTab === "pdf" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-black text-white">शजहान सर के हस्तलिखित नोट्स एवं सरकारी अध्ययन सामग्री</h3>
                <p className="text-xs text-slate-400 mt-1">नि:शुल्क डाऊनलोड करें और परीक्षा की उत्कृष्ट तैयारी करें।</p>
              </div>
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg font-bold">
                ⭐ 100% फ्री स्टडी सामग्री
              </span>
            </div>

            {/* Sub-section 1: Handwritten Notes */}
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-1 bg-amber-500 h-4 rounded-full"></span>
                <span>हस्तलिखित नोट्स (Handwritten PDF Notes)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pdfNotes.map((pdf) => (
                  <div key={pdf.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0 font-black text-xs font-mono">
                        PDF
                      </div>
                      <div>
                        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded uppercase">
                          {pdf.subject}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-2 leading-snug">{pdf.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1.5">साइज़: <span className="font-semibold text-slate-400 font-mono">{pdf.fileSize}</span> | {pdf.downloadCount + 25} छात्रों ने डाउनलोड किया</p>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`"${pdf.title}" सफलतापूर्वक डाऊनलोड हो गई है!`)}
                      className="mt-5 w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-amber-400 hover:text-amber-300 font-bold py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>मुफ़्त डाउनलोड करें (Download)</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-section 2: Model Papers */}
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-1 bg-amber-500 h-4 rounded-full"></span>
                <span>बिहार बोर्ड एवं सरकारी मॉडल पेपर (Model Papers)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {modelPapers.map((paper, index) => (
                  <div key={index} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs font-mono">
                        SET
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-white leading-tight">{paper.title}</h5>
                        <p className="text-[11px] text-slate-500 mt-1">साइज़: {paper.size} | {paper.downloads} डाऊनलोड्स</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`"${paper.title}" डाउनलोड प्रारंभ हुआ!`)}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-amber-400 hover:text-amber-300 font-bold p-2.5 rounded-lg text-xs transition shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-section 3: Previous Year Papers */}
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-1 bg-amber-500 h-4 rounded-full"></span>
                <span>पिछले वर्षों के प्रश्न पत्र (Previous Year Papers - PYQs)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {previousYearPapers.map((pyq, index) => (
                  <div key={index} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xs font-mono">
                        PYQ
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-white leading-tight">{pyq.title}</h5>
                        <p className="text-[11px] text-slate-500 mt-1">साइज़: {pyq.size} | {pyq.downloads} डाऊनलोड्स</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`"${pyq.title}" डाउनलोड प्रारंभ हुआ!`)}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-amber-400 hover:text-amber-300 font-bold p-2.5 rounded-lg text-xs transition shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: HOMEWORK SYSTEM */}
        {activeTab === "homework" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">दैनिक गृहकार्य (Daily Homework Assignments)</h3>
              <p className="text-xs text-slate-400 mt-1">शिक्षकों द्वारा अपलोड किया गया गृहकार्य पूरा करें और अपनी प्रगति रिपोर्ट बढ़ाएं।</p>
            </div>

            {activeHomework.length === 0 ? (
              <div className="bg-slate-950 p-8 rounded-xl border border-slate-850 text-center text-slate-500 text-sm">
                वर्तमान में आपके बैच के लिए कोई सक्रिय गृहकार्य नहीं है।
              </div>
            ) : (
              <div className="space-y-4">
                {activeHomework.map((hw) => {
                  const isSubmitted = homeworkStatus[hw.id] === true;
                  return (
                    <div key={hw.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-850 mb-4">
                        <div>
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {hw.subject}
                          </span>
                          <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded ml-2 font-mono">
                            अंतिम तिथि: {hw.dueDate}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isSubmitted ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {isSubmitted ? "सफलतापूर्वक सबमिट" : "लंबित (Pending)"}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-2">{hw.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 p-3 bg-slate-900 rounded-xl border border-slate-850 font-medium">
                        💡 <strong>निर्देश:</strong> {hw.instruction}
                      </p>

                      {!isSubmitted ? (
                        <div className="space-y-3">
                          <textarea
                            placeholder="अपना गृहकार्य का जवाब यहाँ हिंदी या अंग्रेजी में लिखें..."
                            value={homeworkSubmits[hw.id] || ""}
                            onChange={(e) => setHomeworkSubmits(prev => ({ ...prev, [hw.id]: e.target.value }))}
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleHomeworkSubmit(hw.id)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2 rounded-lg text-xs transition duration-150 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-slate-950" />
                            <span>सबमिट करें</span>
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>आपका गृहकार्य सबमिट हो गया है। शिक्षक इसकी जांच कर रहे हैं।</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: ATTENDANCE CALENDAR */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">मेरी डिजिटल उपस्थिति (Student Attendance Tracker)</h3>
              <p className="text-xs text-slate-400 mt-1">शजहान कोचिंग डिजिटल पोर्टल पर आपकी दैनिक उपस्थिति दर।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Attendance Stat Card */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between text-center relative overflow-hidden">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">वार्षिक उपस्थिति (Overall Rate)</span>
                  <p className="text-5xl font-black text-emerald-400 mt-6 font-mono">94.2%</p>
                  <p className="text-xs text-slate-400 mt-3 font-medium">कुल स्वीकृत कक्षाएं: 52 | उपस्थित: 49</p>
                </div>
                <div className="mt-6 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <span className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>उत्कृष्ट उपस्थिति स्तर!</span>
                  </span>
                </div>
              </div>

              {/* Attendance Tracker calendar June/July */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 md:col-span-2">
                <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>हालिया उपस्थिति कैलेंडर (July 2026)</span>
                </h4>

                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {/* Days label */}
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                    <span key={i} className="text-slate-500 font-bold">{d}</span>
                  ))}
                  {/* Dummy dates */}
                  {Array.from({ length: 30 }).map((_, index) => {
                    const dayNum = index + 1;
                    const isAbsent = dayNum === 5 || dayNum === 19;
                    const isFuture = dayNum > 10; // Current date is around 10th
                    
                    let bgClass = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                    if (isAbsent) bgClass = "bg-red-500/20 text-red-400 border border-red-500/30";
                    if (isFuture) bgClass = "bg-slate-900 text-slate-600 border border-slate-850";

                    return (
                      <div key={index} className={`h-10 rounded-lg flex flex-col justify-center items-center font-bold font-mono text-[10px] sm:text-xs relative ${bgClass}`}>
                        <span>{dayNum}</span>
                        {!isFuture && (
                          <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isAbsent ? "bg-red-500" : "bg-emerald-500"}`}></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: FEES DETAILS & MOCK STATEMENT */}
        {activeTab === "fees" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">कोचिंग शुल्क विवरण (Fees Ledger)</h3>
              <p className="text-xs text-slate-400 mt-1">शजहान कोचिंग सेंटर पटना के साथ आपके सक्रिय बैच का शुल्क रिकॉर्ड।</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fee overview */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <span className="text-[11px] text-slate-500 font-bold uppercase block">शुल्क स्थिति (Fees Status)</span>
                
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-400">सक्रिय कोर्स शुल्क:</span>
                  <p className="text-2xl font-black text-white">₹500 / महीना</p>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-2">
                  <span className="text-xs text-red-400 font-extrabold block">देय राशि (Due This Month):</span>
                  <p className="text-lg font-black text-white">₹500.00</p>
                  <span className="text-[10px] text-slate-400 block leading-none">अंतिम तिथि: 10 जुलाई 2026</span>
                </div>

                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
                  <p className="text-[11px] text-emerald-400 font-semibold">पूर्व की सभी किश्तें पूर्ण भुगतान हो चुकी हैं।</p>
                </div>
              </div>

              {/* Receipt Reference submission and ledger */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    <span>शुल्क भुगतान रसीद दर्ज करें (Online Fee Reporting)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">यदि आपने UPI / Google Pay / WhatsApp Pay द्वारा पेमेंट किया है, तो रसीद संदर्भ दर्ज करें।</p>
                </div>

                {!receiptSuccess ? (
                  <form onSubmit={handleReceiptSubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="जैसे: UPI Transaction ID / UTR No"
                      value={receiptRef}
                      onChange={(e) => setReceiptRef(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs transition duration-150 cursor-pointer"
                    >
                      भुगतान सूचित करें (Submit Reference)
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                    ✅ सफलता! आपका भुगतान संदर्भ शिक्षक डैशबोर्ड में भेज दिया गया है। वेरिफिकेशन के बाद रसीद मान्य हो जाएगी।
                  </div>
                )}

                {/* Ledger */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">भुगतान इतिहास (Receipt History)</h5>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">जून 2026 किश्त (June Installment)</p>
                        <p className="text-[10px] text-slate-500">UTR: 618491040 | 05 जून 2026</p>
                      </div>
                      <span className="text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">₹500 PAID</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">मई 2026 किश्त (May Installment)</p>
                        <p className="text-[10px] text-slate-500">UTR: 610931221 | 04 मई 2026</p>
                      </div>
                      <span className="text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">₹500 PAID</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: ADMISSION INQUIRY FORM */}
        {activeTab === "admission" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-950 to-slate-950 p-6 rounded-2xl border border-purple-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Shajahan Coaching Centre ऑफलाइन एवं ऑनलाइन प्रवेश पूछताछ</h3>
                  <p className="text-xs text-slate-400 mt-1">शजहान कोचिंग पटना (आरा एवं बक्सर शाखा) में नए ऑफलाइन/ऑनलाइन बैच में सीट आरक्षित करने के लिए यह फॉर्म भरें।</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-2xl mx-auto">
              {inquirySuccess ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center font-bold">
                  🎉 पूछताछ फॉर्म सफलतापूर्वक सबमिट हो गया है! शजहान कोचिंग डेस्क जल्द ही आपसे संपर्क करेगा।
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">छात्र का नाम (Name)</label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">मोबाइल नंबर (Mobile)</label>
                      <input
                        type="tel"
                        required
                        value={inquiryMobile}
                        onChange={(e) => setInquiryMobile(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">इच्छित कक्षा (Target Class)</label>
                      <select
                        value={inquiryClass}
                        onChange={(e) => setInquiryClass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="Class 8th">Class 8th</option>
                        <option value="Class 9th">Class 9th</option>
                        <option value="Class 10th">Class 10th</option>
                        <option value="Class 11th">Class 11th</option>
                        <option value="Class 12th">Class 12th</option>
                        <option value="Competitive">Government Exam Preparation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">स्ट्रीम / लक्ष्य (Stream/Exam)</label>
                      <input
                        type="text"
                        placeholder="जैसे: Science / Commerce / Arts / Bihar Police / Railway"
                        value={inquiryStream}
                        onChange={(e) => setInquiryStream(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">पूछताछ संदेश / सवाल (Query Message)</label>
                    <textarea
                      placeholder="आप अपनी शंका या नया बैच का समय जानने के लिए यहाँ लिखें..."
                      required
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 px-6 rounded-xl text-xs sm:text-sm transition duration-150 cursor-pointer shadow-lg shadow-purple-600/15"
                  >
                    प्रवेश फॉर्म भेजें (Submit Inquiry Form)
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
