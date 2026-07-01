import React, { useState } from "react";
import { Phone, User, Users, LogIn, Sparkles, Trophy } from "lucide-react";
import { Student } from "../types";
import { MOCK_STUDENTS } from "../mockData";

interface StudentLoginProps {
  onLogin: (student: Student) => void;
  onNavigateBack: () => void;
  existingStudents: Student[];
  onRegisterStudent: (student: Student) => void;
}

export default function StudentLogin({ onLogin, onNavigateBack, existingStudents, onRegisterStudent }: StudentLoginProps) {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [prepCategory, setPrepCategory] = useState<"Bihar Board" | "Competitive">("Competitive");
  const [studentClass, setStudentClass] = useState("Class 10th");
  const [stream, setStream] = useState("Science");
  const [targetExam, setTargetExam] = useState("BSSC Inter Level 2026");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const boardClasses = [
    "Class 8th",
    "Class 9th",
    "Class 10th",
    "Class 11th",
    "Class 12th"
  ];

  const boardStreams = [
    "Science",
    "Commerce",
    "Arts"
  ];

  const competitiveExams = [
    "Railway Mission 2026",
    "BSSC Inter Level 2026",
    "Bihar Daroga (S.I.) Batch",
    "SSC GD Special Batch",
    "Bihar Police Special Batch",
    "Civil Court Special Batch",
    "Banking & NTPC Special"
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setError("कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें।");
      return;
    }

    // Look up student
    const student = existingStudents.find(s => s.mobile === mobile);
    if (student) {
      onLogin(student);
    } else {
      // Student doesn't exist, prompt for registration or auto-create
      setIsRegistering(true);
      setError("यह मोबाइल नंबर पंजीकृत नहीं है। कृपया अपना नाम और कक्षा चुनकर पंजीकरण पूरा करें।");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("कृपया अपना पूरा नाम दर्ज करें।");
      return;
    }
    if (!mobile || mobile.length < 10) {
      setError("कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें।");
      return;
    }

    // Resolve batchName automatically
    let resolvedBatch = "";
    if (prepCategory === "Bihar Board") {
      if (studentClass === "Class 11th" || studentClass === "Class 12th") {
        resolvedBatch = `Bihar Board Inter ${stream} 2026`;
      } else {
        resolvedBatch = "Bihar Board Matric Batch 2026";
      }
    } else {
      resolvedBatch = targetExam;
    }

    // Generate custom roll number based on prefix
    const prefix = prepCategory === "Bihar Board" ? "BSEB" : "COMP";
    const randNum = Math.floor(100 + Math.random() * 900);
    const rollNumber = `${prefix}-${randNum}`;

    const newStudent: Student = {
      mobile,
      name: name.trim(),
      batchName: resolvedBatch,
      rollNumber,
      createdAt: new Date().toISOString().split('T')[0],
      prepCategory,
      studentClass: prepCategory === "Bihar Board" ? studentClass : undefined,
      stream: (prepCategory === "Bihar Board" && (studentClass === "Class 11th" || studentClass === "Class 12th")) ? stream : undefined,
      targetExam: prepCategory === "Competitive" ? targetExam : undefined
    };

    onRegisterStudent(newStudent);
    onLogin(newStudent);
  };

  const handleDemoSignIn = (demoStudent: typeof MOCK_STUDENTS[0]) => {
    // Ensure the demo student is in our existing student pool
    const exists = existingStudents.some(s => s.mobile === demoStudent.mobile);
    if (!exists) {
      onRegisterStudent(demoStudent);
    }
    onLogin(demoStudent);
  };

  return (
    <div id="student-login-page" className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-4 font-sans py-12 relative">
      <div className="absolute top-4 left-4">
        <button 
          onClick={onNavigateBack}
          className="text-slate-400 hover:text-white flex items-center gap-1 text-sm bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          ← वापस मुख्य पृष्ठ
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3">
            <Trophy className="w-8 h-8 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-amber-500 uppercase tracking-tight">SHAJAHAN COACHING</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Online Test Portal</p>
        </div>

        {/* Card */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">
              {isRegistering ? "नया छात्र पंजीकरण (Register)" : "छात्र लॉगिन (Student Login)"}
            </h3>
            <span className="text-[11px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded font-medium border border-amber-500/20">
              Hindi Medium Special
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          {!isRegistering ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  मोबाइल नंबर (Mobile Number)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 XXXXX"
                    value={mobile}
                    onChange={(e) => {
                      setError("");
                      setMobile(e.target.value.replace(/\D/g, ""));
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-lg tracking-wider"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  यदि आप पहली बार आ रहे हैं, तो अपना मोबाइल नंबर दर्ज करके आगे बढ़ें।
                </p>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 text-base shadow-lg shadow-amber-500/15 cursor-pointer mt-6"
              >
                <LogIn className="w-5 h-5" />
                <span>आगे बढ़ें (Proceed)</span>
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  मोबाइल नंबर (Mobile Number)
                </label>
                <input
                  type="tel"
                  disabled
                  value={mobile}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-500 text-lg tracking-wider focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  आपका पूरा नाम (Full Name)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: राजू कुमार यादव"
                    value={name}
                    onChange={(e) => {
                      setError("");
                      setName(e.target.value);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-base"
                  />
                </div>
              </div>

              {/* Category Selector Tab */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  तैयारी की श्रेणी (Preparation Category)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrepCategory("Bihar Board")}
                    className={`py-2.5 rounded-xl font-bold text-xs transition border ${
                      prepCategory === "Bihar Board"
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    बिहार बोर्ड (BSEB)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrepCategory("Competitive")}
                    className={`py-2.5 rounded-xl font-bold text-xs transition border ${
                      prepCategory === "Competitive"
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    प्रतियोगी परीक्षा (Govt Exams)
                  </button>
                </div>
              </div>

              {prepCategory === "Bihar Board" ? (
                <>
                  {/* Class Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      कक्षा का चयन करें (Select Class)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <Users className="w-5 h-5" />
                      </span>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 text-base appearance-none"
                      >
                        {boardClasses.map((cl, idx) => (
                          <option key={idx} value={cl} className="bg-slate-900 text-white">
                            {cl}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Stream Selection (only for 11th and 12th) */}
                  {(studentClass === "Class 11th" || studentClass === "Class 12th") && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        स्ट्रीम चुनें (Select Stream)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <Users className="w-5 h-5" />
                        </span>
                        <select
                          value={stream}
                          onChange={(e) => setStream(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 text-base appearance-none"
                        >
                          {boardStreams.map((st, idx) => (
                            <option key={idx} value={st} className="bg-slate-900 text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Competitive Target selection */
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    लक्षित सरकारी परीक्षा (Select Target Exam)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <Users className="w-5 h-5" />
                    </span>
                    <select
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 text-base appearance-none"
                    >
                      {competitiveExams.map((ex, idx) => (
                        <option key={idx} value={ex} className="bg-slate-900 text-white">
                          {ex}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setError("");
                  }}
                  className="w-1/3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold py-3 px-4 rounded-xl transition duration-150"
                >
                  पीछे जाएँ
                </button>
                <button
                  type="submit"
                  id="register-submit-btn"
                  className="w-2/3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15"
                >
                  <span>रजिस्टर करें (Register)</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Demo Fast Login Panel */}
        <div className="mt-6 bg-slate-950/50 border border-slate-800/60 p-4 rounded-xl text-center">
          <p className="text-xs text-amber-400 font-medium flex items-center justify-center gap-1 mb-3">
            <Sparkles className="w-4 h-4" />
            <span>परीक्षण के लिए डेमो छात्र से तुरंत लॉगिन करें:</span>
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {MOCK_STUDENTS.slice(0, 3).map((student, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDemoSignIn(student)}
                className="bg-slate-900 hover:bg-amber-500/20 hover:border-amber-500/30 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-amber-300 transition duration-150 flex items-center gap-1.5"
              >
                <span>{student.name}</span>
                <span className="text-[10px] text-slate-500">({student.rollNumber})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Small Notice / Coaching Banner */}
        <p className="text-center text-slate-500 text-xs mt-8">
          किसी भी सहायता के लिए संपर्क करें: +91 95462 75231<br />
          शजहान कोचिंग सेंटर, गांधी मैदान, पटना, बिहार।
        </p>
      </div>
    </div>
  );
}
