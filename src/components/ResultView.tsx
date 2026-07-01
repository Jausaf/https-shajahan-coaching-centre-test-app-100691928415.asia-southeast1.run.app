import React from "react";
import { Trophy, ArrowRight, CheckCircle2, XCircle, AlertCircle, Clock, BookOpen, Share2, Award } from "lucide-react";
import { Test, TestResult } from "../types";

interface ResultViewProps {
  result: TestResult;
  test: Test;
  allResults: TestResult[]; // for ranking calculation
  onViewSolutions: () => void;
  onBackToDashboard: () => void;
}

export default function ResultView({ result, test, allResults, onViewSolutions, onBackToDashboard }: ResultViewProps) {
  
  // Calculate real rank amongst all submissions of this test
  const testResults = allResults
    .filter(r => r.testId === test.id)
    .sort((a, b) => b.totalMarksObtained - a.totalMarksObtained || a.timeTakenSeconds - b.timeTakenSeconds);

  const studentRank = testResults.findIndex(r => r.id === result.id) + 1;
  const totalSubmissions = testResults.length;

  const totalQuestions = test.questions.length;

  // Formatting seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} मिनट ${secs} सेकंड`;
  };

  return (
    <div id="test-result-page" className="min-h-screen bg-slate-900 text-white font-sans selection:bg-amber-500 selection:text-slate-950 py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Elite Congratulations Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>सफलता रिपोर्ट (SUCCESS REPORT)</span>
          </div>
          
          <h2 className="text-3xl font-black text-white leading-tight">Shajahan Coaching Centre Scorecard</h2>
          <p className="text-sm text-slate-400 mt-2">परीक्षार्थी: <span className="text-white font-bold">{result.studentName}</span> | अनुक्रमांक: <span className="text-amber-400 font-mono font-bold">{result.rollNumber}</span></p>
        </div>

        {/* TOP DYNAMIC RANK CARD BENTO STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Main Score Wheel */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden text-center md:col-span-1">
            <div>
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">प्राप्त अंक (Score Obtained)</span>
              
              <div className="my-6 relative inline-flex items-center justify-center">
                {/* SVG Circular Progress Wheel */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-amber-500 transition-all duration-1000"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 - (351.8 * result.percentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black font-mono text-white leading-none block">{result.totalMarksObtained}</span>
                  <span className="text-xs text-slate-500 font-bold block mt-1">कुल {result.maxMarks} में से</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-block bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-xs font-mono">
                प्रतिशत: {result.percentage}%
              </span>
            </div>
          </div>

          {/* Rank Badge */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden md:col-span-1">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">बैच रैंक (Batch Rank)</span>
              
              <div className="my-5">
                <p className="text-5xl font-black font-mono text-amber-400">
                  #{studentRank} <span className="text-sm font-bold text-slate-400">/ {totalSubmissions}</span>
                </p>
                <p className="text-xs text-slate-400 mt-2 font-medium">Shajahan Coaching Centre लाइव रैंकिंग सूची के अनुसार।</p>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-center">
              <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                <Award className="w-4 h-4" />
                <span>शीर्ष {Math.ceil((studentRank/totalSubmissions)*100)}% छात्रों में शामिल</span>
              </span>
            </div>
          </div>

          {/* Time Taken & Average */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden md:col-span-1">
            <div>
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider block">लिया गया समय (Time Taken)</span>
              
              <div className="my-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-lg font-bold text-white">{formatTime(result.timeTakenSeconds)}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">कुल समय: {test.durationMinutes} मिनट</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400 block">सफलता संदेश:</span>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
                {result.percentage >= 80 ? "उत्कृष्ट तैयारी! आपकी लगन आपको अवश्य सरकारी सेवा में लेकर जाएगी।" : 
                 result.percentage >= 50 ? "अच्छी कोशिश! गलतियों को सुधारने के लिए विस्तृत हल पेज अवश्य देखें।" : 
                 "मेहनत बढाएं! शजहान सर के नोट्स पढ़ें और दुबारा अभ्यास करें।"}
              </p>
            </div>
          </div>

        </div>

        {/* DETAILED QUESTION METRIC BREAKDOWN */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow mb-8">
          <h3 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
            <span>उत्तरों का विवरण (Question Performance Breakdown)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Correct */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block uppercase leading-none">सही उत्तर (Correct)</span>
                <span className="text-xl font-bold font-mono text-white mt-1 block">{result.correctAnswers} प्रश्न</span>
              </div>
            </div>

            {/* Incorrect */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block uppercase leading-none">गलत उत्तर (Incorrect)</span>
                <span className="text-xl font-bold font-mono text-white mt-1 block">{result.wrongAnswers} प्रश्न</span>
              </div>
            </div>

            {/* Unattempted */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold block uppercase leading-none">छोड़े गए (Skipped)</span>
                <span className="text-xl font-bold font-mono text-white mt-1 block">{result.unattemptedQuestions} प्रश्न</span>
              </div>
            </div>

          </div>
        </div>

        {/* SUBJECT-WISE PERFORMANCE TRACKER */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow mb-8">
          <h3 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
            <span>विषयवार विश्लेषण (Subject-wise Analysis)</span>
          </h3>

          <div className="space-y-4">
            {Object.entries(result.subjectPerformance).map(([subject, stats]) => {
              const subPercentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={subject} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300">{subject}</span>
                    <span className="text-amber-400">{stats.correct} / {stats.total} सही ({subPercentage}%)</span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        subPercentage >= 85 ? "bg-emerald-500" :
                        subPercentage >= 50 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${subPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER ACTIONS BAR */}
        <div className="flex flex-col sm:flex-row gap-3">
          
          <button
            onClick={onViewSolutions}
            id="view-solutions-btn"
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 px-6 rounded-xl text-sm transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <BookOpen className="w-5 h-5 text-slate-950" />
            <span>हिंदी हल और AI विश्लेषण देखें (View Solutions)</span>
          </button>

          <button
            onClick={onBackToDashboard}
            className="sm:w-1/3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-bold py-4 px-6 rounded-xl text-xs sm:text-sm transition duration-150"
          >
            वापस डैशबोर्ड (Dashboard)
          </button>

        </div>

      </div>
    </div>
  );
}
