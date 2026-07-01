import React, { useState, useRef } from "react";
import { 
  Trophy, BookOpen, Plus, FileText, Users, Award, 
  Trash2, ShieldAlert, Check, Calendar, Clock, Download, Upload, Trash, Edit, AlertCircle, Send, FileCode
} from "lucide-react";
import { Test, Question, Student, TestResult, Notice, PDFNote } from "../types";

interface AdminDashboardProps {
  tests: Test[];
  students: Student[];
  results: TestResult[];
  onAddTest: (newTest: Test) => void;
  onDeleteTest: (testId: string) => void;
  onNavigateBack: () => void;
  onAddNotice?: (notice: Notice) => void;
  onAddPDF?: (pdf: PDFNote) => void;
}

export default function AdminDashboard({
  tests,
  students,
  results,
  onAddTest,
  onDeleteTest,
  onNavigateBack,
  onAddNotice,
  onAddPDF,
}: AdminDashboardProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<"tests" | "students" | "results" | "batches" | "teacher-panel" | "notices">("tests");
  
  // Create Test Form States
  const [testTitle, setTestTitle] = useState("");
  const [testSubject, setTestSubject] = useState("Science");
  const [testClass, setTestClass] = useState("Class 10th");
  const [testStream, setTestStream] = useState("Science");
  const [testChapter, setTestChapter] = useState("रासायनिक अभिक्रियाएं एवं समीकरण");
  const [testBatch, setTestBatch] = useState("BSSC Inter Level 2026");
  const [duration, setDuration] = useState(15);
  const [marks, setMarks] = useState(4);
  const [negMark, setNegMark] = useState(1.0);
  const [testDate, setTestDate] = useState("2026-07-05");
  const [testTime, setTestTime] = useState("10:00 AM");
  const [isDraft, setIsDraft] = useState(false);

  // Create Question Form States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qText, setQText] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt4, setOpt4] = useState("");
  const [correctIdx, setCorrectIdx] = useState(0);
  const [qSubject, setQSubject] = useState("Science");
  const [qExpl, setQExpl] = useState("");
  const [qDifficulty, setQDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [qChapter, setQChapter] = useState("रासायनिक अभिक्रियाएं एवं समीकरण");
  const [qClass, setQClass] = useState("Class 10th");

  // Editing state for questions in the draft queue
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Excel/CSV Bulk Upload Simulation States
  const [csvText, setCsvText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [csvFileName, setCsvFileName] = useState("");

  // Batches list state
  const [batchesList, setBatchesList] = useState<string[]>([
    "Railway Mission 2026",
    "BSSC Inter Level 2026",
    "Bihar Board Matric (Class 10th)",
    "Bihar Board Inter Science 2026",
    "Bihar Daroga (S.I.) Batch",
    "SSC GD Special Batch"
  ]);
  const [newBatchName, setNewBatchName] = useState("");

  // Notice Board form state
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeTag, setNoticeTag] = useState("Exam");

  // Material upload form state (Model paper / PDF notes / PYQ)
  const [materialType, setMaterialType] = useState<"Notes" | "ModelPaper" | "PYQ">("Notes");
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialSubject, setMaterialSubject] = useState("Science");
  const [materialSize, setMaterialSize] = useState("3.5 MB");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add or Edit Single Question manually
  const handleAddQuestionLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText || !opt1 || !opt2 || !opt3 || !opt4) {
      alert("कृपया प्रश्न और चारों विकल्प अवश्य दर्ज करें।");
      return;
    }

    const newQ: Question = {
      id: editingIndex !== null ? questions[editingIndex].id : `q-${Date.now()}-${questions.length}`,
      questionText: qText.trim(),
      options: [opt1.trim(), opt2.trim(), opt3.trim(), opt4.trim()],
      correctOptionIndex: correctIdx,
      subject: qSubject,
      explanationHindi: qExpl.trim() || `${qSubject} से संबंधित महत्वपूर्ण प्रश्न जिसका सही उत्तर ${correctIdx === 0 ? 'A' : correctIdx === 1 ? 'B' : correctIdx === 2 ? 'C' : 'D'} है।`
    };

    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = newQ;
      setQuestions(updated);
      setEditingIndex(null);
      alert("प्रश्न को सफलतापूर्वक अपडेट कर दिया गया है!");
    } else {
      setQuestions([...questions, newQ]);
    }
    
    // Clear question inputs for next entries
    setQText("");
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setOpt4("");
    setQExpl("");
  };

  // Edit Question in Queue Handler
  const handleEditQuestionInQueue = (index: number) => {
    const target = questions[index];
    setQText(target.questionText);
    setOpt1(target.options[0]);
    setOpt2(target.options[1]);
    setOpt3(target.options[2]);
    setOpt4(target.options[3]);
    setCorrectIdx(target.correctOptionIndex);
    setQSubject(target.subject);
    setQExpl(target.explanationHindi || "");
    setEditingIndex(index);
  };

  // Delete Question in Queue Handler
  const handleDeleteQuestionInQueue = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  // Excel/CSV Simulated Import
  const handleCSVImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) {
      alert("कृपया यहाँ CSV/Excel का प्रारूप पेस्ट करें।");
      return;
    }

    try {
      const lines = csvText.split("\n").filter(line => line.trim().length > 0);
      const parsedQs: Question[] = [];

      lines.forEach((line, index) => {
        const parts = line.split("|").map(p => p.trim());
        if (parts.length >= 6) {
          const newQ: Question = {
            id: `csv-q-${Date.now()}-${index}`,
            questionText: parts[0],
            options: [parts[1], parts[2], parts[3], parts[4]],
            correctOptionIndex: parseInt(parts[5]) || 0,
            subject: testSubject,
            explanationHindi: parts[6] || `इस प्रश्न का सही हल विकल्प ${parts[5]} है।`
          };
          parsedQs.push(newQ);
        }
      });

      if (parsedQs.length === 0) {
        alert("कोई वैध प्रश्न नहीं मिल पाया। प्रारूप देखें: प्रश्न | विकल्प1 | विकल्प2 | विकल्प3 | विकल्प4 | सही_इंडेक्स_0_से_3 | व्याख्या");
        return;
      }

      setQuestions([...questions, ...parsedQs]);
      setCsvText("");
      setCsvFileName("");
      alert(`${parsedQs.length} प्रश्न सफ़लतापूर्वक आयात किए गए!`);
    } catch (err) {
      alert("प्रारूप त्रुटि! कृपया दिशानिर्देश अनुसार डाटा भरें।");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCsvFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setCsvText(text);
      };
      reader.readAsText(file);
    }
  };

  // Submit test to list
  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim()) {
      alert("कृपया टेस्ट का शीर्षक दर्ज करें।");
      return;
    }
    if (questions.length === 0) {
      alert("कृपया टेस्ट में कम से कम 1 प्रश्न अवश्य जोड़ें।");
      return;
    }

    const newTest: Test = {
      id: `test-custom-${Date.now()}`,
      title: testTitle.trim() + (isDraft ? " [DRAFT]" : ""),
      subject: testSubject,
      date: testDate,
      time: testTime,
      durationMinutes: duration,
      marksPerQuestion: marks,
      negativeMarking: negMark,
      questions: questions,
      batchName: testBatch
    };

    onAddTest(newTest);
    
    // Clear all forms
    setTestTitle("");
    setQuestions([]);
    alert(`नया टेस्ट "${newTest.title}" सफलतापूर्वक ${isDraft ? "ड्राफ्ट के रूप में सुरक्षित" : "कोचिंग श्रृंखला में प्रकाशित"} कर दिया गया है!`);
  };

  // Notice Submit
  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    if (onAddNotice) {
      onAddNotice({
        id: `notice-${Date.now()}`,
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        date: new Date().toLocaleDateString("hi-IN"),
        tag: noticeTag
      });
      alert("नोटिस सफलतापूर्वक बोर्ड पर जारी कर दिया गया है!");
      setNoticeTitle("");
      setNoticeContent("");
    } else {
      alert("Notice submitted successfully! (Stored locally)");
    }
  };

  // Material Upload Submit
  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) return;

    if (onAddPDF) {
      onAddPDF({
        id: `pdf-${Date.now()}`,
        title: materialTitle.trim() + ` [${materialType}]`,
        subject: materialSubject,
        fileSize: materialSize,
        downloadCount: 0
      });
      alert(`${materialType} सफलतापूर्वक लाइब्रेरी में अपलोड कर दी गई है!`);
      setMaterialTitle("");
    } else {
      alert("Material uploaded successfully! (Stored locally)");
    }
  };

  // Download simulation tables
  const triggerTableDownload = (title: string, type: "students" | "results") => {
    let content = "";
    if (type === "students") {
      content = "Name,Mobile,Batch,Roll Number,Registered Date\n" + 
        students.map(s => `"${s.name}","${s.mobile}","${s.batchName}","${s.rollNumber}","${s.createdAt}"`).join("\n");
    } else {
      content = "Student Name,Roll,Batch,Test,Marks Obtained,Max Marks,Percentage,Time Taken(s)\n" + 
        results.map(r => `"${r.studentName}","${r.rollNumber}","${r.batchName}","${r.testTitle}",${r.totalMarksObtained},${r.maxMarks},${r.percentage},${r.timeTakenSeconds}`).join("\n");
    }

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Weak students calculation
  const weakStudentsList = students.map(st => {
    const studentResults = results.filter(r => r.studentMobile === st.mobile);
    const total = studentResults.length;
    const avgScore = total > 0 ? Math.round(studentResults.reduce((acc, r) => acc + r.percentage, 0) / total) : 0;
    
    // Identify weak subject
    let weakSubject = "N/A";
    let minSubPct = 100;
    studentResults.forEach(r => {
      Object.entries(r.subjectPerformance).forEach(([sub, score]: any) => {
        const pct = Math.round((score.correct / score.total) * 100);
        if (pct < minSubPct) {
          minSubPct = pct;
          weakSubject = sub;
        }
      });
    });

    return {
      ...st,
      avgScore,
      total,
      weakSubject: avgScore < 60 ? (weakSubject !== "N/A" ? weakSubject : "Math & GS") : "None (Strong)"
    };
  }).filter(st => st.avgScore < 60 && st.total > 0);

  return (
    <div id="admin-dashboard-page" className="min-h-screen bg-slate-900 text-white font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Admin Panel Header */}
      <header className="bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <Plus className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider block -mb-0.5">SHAJAHAN ADMIN CONTROL</span>
              <h2 className="text-base font-black text-white">कोचिंग स्मार्ट डैशबोर्ड (Super Admin Control)</h2>
            </div>
          </div>

          <button
            onClick={onNavigateBack}
            className="text-xs bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:text-white text-slate-400 font-bold px-4 py-2 rounded-xl transition"
          >
            ← मुख्य पृष्ठ पर लौटें (Exit Admin)
          </button>
        </div>

        {/* Navigation Admin Tabs */}
        <div className="bg-slate-950 border-t border-slate-850">
          <div className="max-w-7xl mx-auto px-4 flex gap-4 py-2 overflow-x-auto scrollbar-none">
            {[
              { id: "tests", label: "➕ टेस्ट & प्रश्न (Tests & Qs)" },
              { id: "students", label: "👥 नामांकित छात्र (Students)" },
              { id: "results", label: "🏆 परीक्षा परिणाम (Results)" },
              { id: "batches", label: "🏫 बैच नियंत्रण (Batches)" },
              { id: "teacher-panel", label: "🎓 शिक्षक पैनल (Teacher Panel)" },
              { id: "notices", label: "📢 सूचना & स्टडी मटेरियल" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition duration-150 cursor-pointer ${
                  activeAdminTab === tab.id 
                    ? "bg-amber-500 text-slate-950 shadow" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TAB 1: ADD TESTS & MANAGE QUESTIONS */}
        {activeAdminTab === "tests" && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Form: Test Parameters */}
              <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow space-y-5 h-fit">
                <h3 className="text-base font-black text-white pb-3 border-b border-slate-850">
                  1. टेस्ट पैरामीटर्स सेट करें
                </h3>

                <form onSubmit={handleCreateTestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">टेस्ट शीर्षक (Test Title)</label>
                    <input
                      type="text"
                      required
                      placeholder="जैसे: BSEB Matric Science Mock - 01"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">कक्षा चुनें (Class)</label>
                      <select
                        value={testClass}
                        onChange={(e) => setTestClass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="Class 8th">Class 8th</option>
                        <option value="Class 9th">Class 9th</option>
                        <option value="Class 10th">Class 10th (Matric)</option>
                        <option value="Class 11th">Class 11th</option>
                        <option value="Class 12th">Class 12th (Inter)</option>
                        <option value="Competitive">Government Exams</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">संकाय (Stream)</label>
                      <select
                        value={testStream}
                        onChange={(e) => setTestStream(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="General">General / All</option>
                        <option value="Science">Science (विज्ञान)</option>
                        <option value="Commerce">Commerce (वाणिज्य)</option>
                        <option value="Arts">Arts (कला)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">विषय (Subject)</label>
                      <select
                        value={testSubject}
                        onChange={(e) => setTestSubject(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500"
                      >
                        {["Science", "Math", "GK", "Reasoning", "Bihar GK", "Computer", "Current Affairs", "Physics", "Chemistry", "English", "Sanskrit", "Social Science"].map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">चैप्टर का नाम (Chapter)</label>
                      <input
                        type="text"
                        placeholder="जैसे: विद्युत धारा या electrostatics"
                        value={testChapter}
                        onChange={(e) => setTestChapter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">लक्षित बैच (Target Batch)</label>
                    <select
                      value={testBatch}
                      onChange={(e) => setTestBatch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500"
                    >
                      {batchesList.map((batch, idx) => (
                        <option key={idx} value={batch}>{batch}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">अवधि (Min)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-center focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">प्रति प्रश्न अंक</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={marks}
                        onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-center focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">नेगेटिव अंक</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        min={0}
                        value={negMark}
                        onChange={(e) => setNegMark(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-center focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">तिथि (Date)</label>
                      <input
                        type="date"
                        required
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">समय (Time)</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: 10:00 AM"
                        value={testTime}
                        onChange={(e) => setTestTime(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  {/* Save draft toggle */}
                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="draft-checkbox"
                      checked={isDraft}
                      onChange={(e) => setIsDraft(e.target.checked)}
                      className="w-4 h-4 text-amber-500 bg-slate-900 rounded border-slate-800 focus:ring-amber-500"
                    />
                    <label htmlFor="draft-checkbox" className="text-xs font-bold text-slate-300 uppercase cursor-pointer">
                      ड्राफ्ट के रूप में सुरक्षित करें (Save as Draft)
                    </label>
                  </div>

                  <button
                    type="submit"
                    id="submit-new-test-btn"
                    disabled={questions.length === 0}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm tracking-wider transition cursor-pointer"
                  >
                    सृजित करें (Publish Test)
                  </button>
                </form>

              </div>

              {/* Right Forms (8): Add Questions (Manual & Bulk Excel) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Manual Add Question */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow">
                  <h3 className="text-base font-black text-white pb-3 border-b border-slate-850 flex justify-between items-center">
                    <span>{editingIndex !== null ? "📝 प्रश्न संपादित करें (Edit Question)" : "2. नया प्रश्न जोड़ें (Manual Question Entry)"}</span>
                    <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      प्रश्नों की संख्या: {questions.length}
                    </span>
                  </h3>

                  <form onSubmit={handleAddQuestionLocal} className="space-y-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">प्रश्न कथन (Question Text in Hindi / Formulas / Diagrams Description)</label>
                      <textarea
                        required
                        placeholder="जैसे: न्यूट्रॉन की खोज किस वैज्ञानिक ने की थी?"
                        value={qText}
                        onChange={(e) => setQText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500 h-16 resize-none text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">विकल्प A (Option A)</label>
                        <input
                          type="text"
                          required
                          placeholder="जैसे: जे. जे. थॉमसन"
                          value={opt1}
                          onChange={(e) => setOpt1(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">विकल्प B (Option B)</label>
                        <input
                          type="text"
                          required
                          placeholder="जैसे: जेम्स चैडविक"
                          value={opt2}
                          onChange={(e) => setOpt2(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">विकल्प C (Option C)</label>
                        <input
                          type="text"
                          required
                          placeholder="जैसे: रदरफोर्ड"
                          value={opt3}
                          onChange={(e) => setOpt3(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">विकल्प D (Option D)</label>
                        <input
                          type="text"
                          required
                          placeholder="जैसे: गोल्डस्टीन"
                          value={opt4}
                          onChange={(e) => setOpt4(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 mb-1">सही उत्तर (Correct Option)</label>
                        <select
                          value={correctIdx}
                          onChange={(e) => setCorrectIdx(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500"
                        >
                          <option value={0}>विकल्प A (Option A)</option>
                          <option value={1}>विकल्प B (Option B)</option>
                          <option value={2}>विकल्प C (Option C)</option>
                          <option value={3}>विकल्प D (Option D)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">कठिनाई (Difficulty)</label>
                        <select
                          value={qDifficulty}
                          onChange={(e) => setQDifficulty(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500"
                        >
                          <option value="Easy">Easy (आसान)</option>
                          <option value="Medium">Medium (मध्यम)</option>
                          <option value="Hard">Hard (कठिन)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">विषय (Subject)</label>
                        <select
                          value={qSubject}
                          onChange={(e) => setQSubject(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-amber-500"
                        >
                          {["Science", "Math", "GK", "Reasoning", "Bihar GK", "Computer", "Current Affairs", "Physics", "Chemistry"].map((s, idx) => (
                            <option key={idx} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">चैप्टर का नाम (Chapter Tag)</label>
                        <input
                          type="text"
                          placeholder="जैसे: परमाणु संरचना"
                          value={qChapter}
                          onChange={(e) => setQChapter(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">क्लास नाम (Class Tag)</label>
                        <input
                          type="text"
                          placeholder="जैसे: Class 10th / Class 12th / Competitive"
                          value={qClass}
                          onChange={(e) => setQClass(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">हिंदी व्याख्या / स्पष्टीकरण (Hindi Explanation)</label>
                      <textarea
                        placeholder="जैसे: चैडविक ने 1932 में न्यूट्रॉन की खोज की थी। न्यूट्रॉन एक आवेशहीन मूलभूत कण है जो परमाणु के नाभिक में रहता है।"
                        value={qExpl}
                        onChange={(e) => setQExpl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:border-amber-500 h-14 resize-none text-white"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{editingIndex !== null ? "प्रश्न सेव करें (Save)" : "प्रश्न सूची में जोड़ें (Add Question)"}</span>
                      </button>
                      {editingIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIndex(null);
                            setQText("");
                            setOpt1("");
                            setOpt2("");
                            setOpt3("");
                            setOpt4("");
                            setQExpl("");
                          }}
                          className="bg-slate-800 text-slate-400 hover:text-white px-4 py-2 rounded-xl text-xs"
                        >
                          रद्द करें
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Bulk Question Excel/CSV Drag Drop Loader */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow">
                  <h3 className="text-base font-black text-white pb-3 border-b border-slate-850 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-500" />
                    <span>Excel/CSV से प्रश्न बल्क अपलोड करें (Simulated File Loader)</span>
                  </h3>

                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`mt-4 border-2 border-dashed rounded-2xl p-6 text-center transition ${
                      dragActive ? "border-amber-500 bg-amber-500/5" : "border-slate-800 bg-slate-900/20"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setCsvFileName(file.name);
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            setCsvText(evt.target?.result as string);
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden"
                      accept=".csv,.txt"
                    />
                    
                    <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white">प्रश्नों की फ़ाइल (.CSV / .TXT) यहाँ ड्रैग करें</p>
                    <p className="text-xs text-slate-400 mt-1">या नीचे दिए गए मैन्युअल फ़ॉर्मेट बॉक्स में डेटा पेस्ट करें</p>
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-amber-400 font-bold px-4 py-2 rounded-lg"
                    >
                      डिवाइस से फ़ाइल चुनें
                    </button>
                    {csvFileName && (
                      <p className="text-xs text-emerald-400 font-bold mt-2">✓ चयनित फ़ाइल: {csvFileName}</p>
                    )}
                  </div>

                  <form onSubmit={handleCSVImportSubmit} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">
                        पेस्ट प्रारूप (Paste Data Format)
                      </label>
                      <textarea
                        placeholder="प्रारूप: प्रश्न कथन | विकल्प A | विकल्प B | विकल्प C | विकल्प D | सही विकल्प क्रमांक(0 से 3) | हिंदी व्याख्या"
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500 h-20 text-white"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>डाटा इम्पोर्ट करें (Import Now)</span>
                    </button>
                  </form>
                </div>

                {/* Queue Preview List with Edit and Delete */}
                {questions.length > 0 && (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-850 mb-4">
                      <h4 className="text-sm font-bold text-white">सृजित प्रश्नों का संपादन / पूर्वावलोकन (Preview & Edit Queue)</h4>
                      <button 
                        onClick={() => {
                          if (confirm("क्या आप सचमुच पूरी सूची को साफ करना चाहते हैं?")) setQuestions([]);
                        }}
                        className="text-xs text-red-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        <span>सूची साफ करें</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {questions.map((q, idx) => (
                        <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-xs flex justify-between items-start gap-4">
                          <div className="space-y-1.5">
                            <p className="font-bold text-white">Q{idx + 1}: {q.questionText}</p>
                            <p className="text-slate-400 font-medium">A: {q.options[0]} | B: {q.options[1]} | C: {q.options[2]} | D: {q.options[3]}</p>
                            <p className="text-amber-400 font-bold">सही उत्तर सूचकांक: {q.correctOptionIndex} ({q.options[q.correctOptionIndex]})</p>
                            {q.explanationHindi && <p className="text-slate-500 italic">💡 हल: {q.explanationHindi}</p>}
                          </div>
                          
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditQuestionInQueue(idx)}
                              className="p-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded border border-blue-500/20"
                              title="एडिट करें"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestionInQueue(idx)}
                              className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded border border-red-500/20"
                              title="हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* List of existing active tests */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow mt-8">
              <h3 className="text-base font-black text-white pb-3 border-b border-slate-850 mb-4">
                सक्रिय ऑनलाइन मॉक टेस्ट श्रृंखला ({tests.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tests.map((test) => (
                  <div key={test.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">{test.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">विषय: {test.subject} | {test.questions.length} प्रश्न | बैच: {test.batchName}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`क्या आप सचमुच टेस्ट श्रृंखला "${test.title}" को मिटाना चाहते हैं?`)) {
                          onDeleteTest(test.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 p-2 bg-red-500/10 rounded-lg border border-red-500/20"
                      title="टेस्ट मिटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: REGISTERED STUDENTS TABLE */}
        {activeAdminTab === "students" && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-850">
              <div>
                <h3 className="text-xl font-black text-white">कोचिंग में नामांकित ऑनलाइन छात्र (Registered Students)</h3>
                <p className="text-xs text-slate-400 mt-1">सक्रिय मोबाइल नंबर, बैच और आवंटित अनुक्रमांक (Roll Numbers)।</p>
              </div>

              <button
                onClick={() => triggerTableDownload("Shajahan_Students_List", "students")}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition duration-150 flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>सूची डाऊनलोड (Excel/CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold h-10">
                    <th className="px-4">क्रमांक</th>
                    <th className="px-4">छात्र का नाम</th>
                    <th className="px-4">अनुक्रमांक (Roll)</th>
                    <th className="px-4">पंजीकृत मोबाइल</th>
                    <th className="px-4">संबद्ध बैच</th>
                    <th className="px-4">पंजीकरण तिथि</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {students.map((student, idx) => (
                    <tr key={idx} className="h-12 hover:bg-slate-900/40 text-slate-300 transition">
                      <td className="px-4 font-mono font-bold text-slate-500">{idx + 1}</td>
                      <td className="px-4 font-bold text-white">{student.name}</td>
                      <td className="px-4 font-mono text-amber-400 font-bold">{student.rollNumber}</td>
                      <td className="px-4 font-mono">{student.mobile}</td>
                      <td className="px-4 font-medium text-slate-400">{student.batchName}</td>
                      <td className="px-4 text-slate-500">{student.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ALL TEST SUBMISSIONS & LEADERBOARDS */}
        {activeAdminTab === "results" && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-850">
              <div>
                <h3 className="text-xl font-black text-white">लाइव परीक्षा परिणाम सूचकांक (Live Exam Submissions)</h3>
                <p className="text-xs text-slate-400 mt-1">सभी मॉक टेस्ट के सबमिशन, प्राप्तांक और लाइव बैच रैंकिंग।</p>
              </div>

              <button
                onClick={() => triggerTableDownload("Shajahan_Exam_Results", "results")}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition duration-150 flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>रिजल्ट शीट डाउनलोड (Excel/CSV)</span>
              </button>
            </div>

            {results.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-slate-400 font-medium text-base">अभी तक किसी छात्र ने परीक्षा सबमिट नहीं की है।</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold h-10">
                      <th className="px-4">छात्र का नाम</th>
                      <th className="px-4">अनुक्रमांक</th>
                      <th className="px-4">मॉक टेस्ट</th>
                      <th className="px-4 text-center">सही / गलत</th>
                      <th className="px-4 text-center">प्राप्तांक</th>
                      <th className="px-4 text-center">प्रतिशत (Accuracy)</th>
                      <th className="px-4 text-center">लिया समय</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60">
                    {results
                      .sort((a, b) => b.percentage - a.percentage || a.timeTakenSeconds - b.timeTakenSeconds)
                      .map((res, idx) => (
                        <tr key={idx} className="h-12 hover:bg-slate-900/40 text-slate-300 transition">
                          <td className="px-4 font-bold text-white flex items-center gap-2">
                            <span>{res.studentName}</span>
                            {idx < 3 && (
                              <span className="w-4 h-4 rounded bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">🏆</span>
                            )}
                          </td>
                          <td className="px-4 font-mono font-bold text-slate-400">{res.rollNumber}</td>
                          <td className="px-4 text-slate-400 font-medium">{res.testTitle}</td>
                          <td className="px-4 text-center font-bold">
                            <span className="text-emerald-400">{res.correctAnswers}</span>
                            <span className="text-slate-500 mx-1">/</span>
                            <span className="text-red-400">{res.wrongAnswers}</span>
                          </td>
                          <td className="px-4 text-center font-black font-mono text-amber-400">{res.totalMarksObtained} <span className="text-[10px] text-slate-500">/ {res.maxMarks}</span></td>
                          <td className="px-4 text-center font-bold text-white">{res.percentage}%</td>
                          <td className="px-4 text-center font-mono text-slate-500">{Math.floor(res.timeTakenSeconds / 60)}m {res.timeTakenSeconds % 60}s</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: BATCH MANAGEMENT */}
        {activeAdminTab === "batches" && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow">
            <h3 className="text-xl font-black text-white pb-3 border-b border-slate-850 mb-6">
              🏫 कोचिंग बैच नियंत्रण (Manage Batches)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Batch list */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300">वर्तमान सक्रिय बैच (Active Batches)</h4>
                
                <div className="space-y-2">
                  {batchesList.map((batch, idx) => (
                    <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex justify-between items-center">
                      <span className="text-sm font-bold text-white">{batch}</span>
                      <button
                        onClick={() => {
                          if (batchesList.length <= 1) {
                            alert("कम से कम एक बैच का होना आवश्यक है।");
                            return;
                          }
                          if (confirm(`क्या आप बैच "${batch}" को हटाना चाहते हैं?`)) {
                            setBatchesList(batchesList.filter(b => b !== batch));
                          }
                        }}
                        className="text-red-400 hover:text-red-300 p-1.5"
                      >
                        हटाएं
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Batch Form */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-850 h-fit space-y-4">
                <h4 className="text-sm font-bold text-slate-300">नया बैच बनाएं (Create New Batch)</h4>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newBatchName.trim()) return;
                    if (batchesList.includes(newBatchName.trim())) {
                      alert("यह बैच पहले से मौजूद है।");
                      return;
                    }
                    setBatchesList([...batchesList, newBatchName.trim()]);
                    setNewBatchName("");
                    alert(`बैच "${newBatchName}" सफलतापूर्वक सृजित किया गया!`);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">बैच का नाम (Batch Name)</label>
                    <input
                      type="text"
                      required
                      placeholder="जैसे: Class 10th Matric Board 2026"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm tracking-wider transition"
                  >
                    नया बैच बनाएं (Create Batch)
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: TEACHER PANEL FEATURE */}
        {activeAdminTab === "teacher-panel" && (
          <div className="space-y-8">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow">
              <h3 className="text-xl font-black text-white pb-1.5">🎓 शिक्षक विशेष पैनल (Teacher Operations Panel)</h3>
              <p className="text-xs text-slate-400">शिक्षकों के लिए प्रश्नों को सुधारने, कमजोर छात्रों की पहचान करने और गृहकार्य देने का नियंत्रण कक्ष।</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Weak Students analysis */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow space-y-4">
                <h4 className="text-base font-bold text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span>कमजोर छात्र विश्लेषण (Weak Student Performance Tracker)</span>
                </h4>
                <p className="text-xs text-slate-400">जिन छात्रों का औसत स्कोर 60% से कम है और वे किस विषय में कमजोर प्रदर्शन कर रहे हैं:</p>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {weakStudentsList.map((st, idx) => (
                    <div key={idx} className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{st.name}</p>
                        <p className="text-[10px] text-slate-500">अनुक्रमांक: {st.rollNumber} | बैच: {st.batchName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-red-400 font-bold">औसत: {st.avgScore}%</span>
                        <p className="text-[10px] text-amber-500 font-bold">कमजोर विषय: {st.weakSubject}</p>
                      </div>
                    </div>
                  ))}
                  {weakStudentsList.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">सभी नामांकित छात्र उत्कृष्ट प्रदर्शन कर रहे हैं!</p>
                  )}
                </div>
              </div>

              {/* simulated explanations uploader */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow space-y-4">
                <h4 className="text-base font-bold text-amber-500 flex items-center gap-1.5">
                  <FileCode className="w-5 h-5 text-amber-500" />
                  <span>प्रश्न स्पष्टीकरण संवर्धक (Explanation Enhancer)</span>
                </h4>
                <p className="text-xs text-slate-400">संशोधित परीक्षाओं के स्पष्टीकरण और चित्र विवरण को तुरंत अपडेट करें:</p>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("व्याख्या को रीयलटाइम डेटाबेस में जोड़ दिया गया है!");
                  }}
                  className="space-y-3"
                >
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white">
                    <option value="all">-- प्रश्न का चयन करें --</option>
                    <option value="1">लोहे को जिंक से लेपित करने की क्रिया...</option>
                    <option value="2">विद्युत फ्लक्स (Electric Flux) का S.I. मात्रक...</option>
                  </select>
                  <textarea
                    placeholder="शिक्षक व्याख्या या गणितीय सूत्र यहाँ अपडेट करें..."
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs">
                    व्याख्या अपडेट करें
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: NOTICES & STUDY MATERIAL UPLOAD */}
        {activeAdminTab === "notices" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Notice Board Uploader */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-500" />
                <span>नया सूचना बोर्ड संदेश (Publish Notices)</span>
              </h3>
              <p className="text-xs text-slate-400">सभी छात्रों के मोबाइल डैशबोर्ड पर तुरंत पॉप-अप / नोटिफिकेशन भेजने के लिए यहाँ संदेश जारी करें।</p>

              <form onSubmit={handleNoticeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">शीर्षक (Notice Title)</label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: 15 अगस्त स्पेशल मॉक टेस्ट सूचना"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">टैग / श्रेणी (Notice Tag)</label>
                    <select
                      value={noticeTag}
                      onChange={(e) => setNoticeTag(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm focus:outline-none"
                    >
                      <option value="Exam">Exam (परीक्षा)</option>
                      <option value="Holiday">Holiday (अवकाश)</option>
                      <option value="Admissions">Admissions (प्रवेश)</option>
                      <option value="General">General (सामान्य)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">विस्तृत संदेश सामग्री (Notice Details)</label>
                  <textarea
                    required
                    placeholder="सभी छात्रों को सूचित किया जाता है कि कल सुबह 10 बजे से..."
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs transition duration-150 cursor-pointer"
                >
                  सूचना प्रकाशित करें (Publish Notice)
                </button>
              </form>
            </div>

            {/* Material Library Uploader (PDF / Model Papers / PYQs) */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                <span>लाइब्रेरी अपलोड (Upload Notes, Model Papers & PYQs)</span>
              </h3>
              <p className="text-xs text-slate-400">नि:शुल्क अध्ययन सामग्री की लाइब्रेरी में नए हस्तलिखित पीडीएफ नोट्स, बोर्ड मॉडल पेपर्स या पिछले वर्षों के प्रश्न जोड़ें।</p>

              <form onSubmit={handleMaterialSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">अध्ययन सामग्री प्रकार (Material Type)</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm focus:outline-none"
                  >
                    <option value="Notes">Notes (हस्तलिखित नोट्स)</option>
                    <option value="ModelPaper">Model Paper (बोर्ड/सरकारी मॉडल पेपर)</option>
                    <option value="PYQ">PYQ (पिछले वर्षों के प्रश्न पत्र)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">शीर्षक (Material Title)</label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: BSEB Matric Chemistry Chapter 1 Revision Set"
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">विषय (Subject)</label>
                    <select
                      value={materialSubject}
                      onChange={(e) => setMaterialSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm focus:outline-none"
                    >
                      {["Science", "Math", "GK", "Reasoning", "Bihar GK", "Physics", "Chemistry"].map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">फ़ाइल साइज़ (File Size)</label>
                    <input
                      type="text"
                      required
                      placeholder="जैसे: 4.2 MB"
                      value={materialSize}
                      onChange={(e) => setMaterialSize(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs transition duration-150 cursor-pointer"
                >
                  लाइब्रेरी में जोड़ें (Add to Library)
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
