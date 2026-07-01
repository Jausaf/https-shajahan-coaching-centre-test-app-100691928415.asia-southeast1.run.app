import React, { useState } from "react";
import { 
  Trophy, BookOpen, CheckCircle, XCircle, AlertCircle, Sparkles, 
  RefreshCw, Loader2, ArrowLeft, ArrowRight, MessageCircle, HelpCircle
} from "lucide-react";
import { Test, TestResult, Question } from "../types";

interface SolutionViewProps {
  result: TestResult;
  test: Test;
  onBackToResult: () => void;
  onPracticeWrongs: () => void;
}

export default function SolutionView({ result, test, onBackToResult, onPracticeWrongs }: SolutionViewProps) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  // State for storing active AI explanations: questionId -> string
  const [aiExplanations, setAiExplanations] = useState<{ [qId: string]: string }>({});
  // State for tracking loading status: questionId -> boolean
  const [loadingAi, setLoadingAi] = useState<{ [qId: string]: boolean }>({});

  const letters = ["A", "B", "C", "D"];

  const currentQuestion = test.questions[currentQIndex];
  const studentAnswerIndex = result.answersMap[currentQuestion.id] ?? -1;
  const isCorrect = studentAnswerIndex === currentQuestion.correctOptionIndex;
  const isUnattempted = studentAnswerIndex === -1;

  // Fetch AI explanation from server proxy
  const fetchAiExplanation = async (question: Question) => {
    if (loadingAi[question.id] || aiExplanations[question.id]) return;

    setLoadingAi(prev => ({ ...prev, [question.id]: true }));
    try {
      const studentAnswerText = studentAnswerIndex !== -1 ? question.options[studentAnswerIndex] : "Not Attempted";
      const correctAnswerText = question.options[question.correctOptionIndex];

      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.questionText,
          subject: question.subject,
          studentAnswer: studentAnswerText,
          correctAnswer: correctAnswerText,
          options: question.options,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach explanation server.");
      }

      const data = await response.json();
      setAiExplanations(prev => ({
        ...prev,
        [question.id]: data.explanation,
      }));
    } catch (err) {
      console.error("AI Explanation error:", err);
      setAiExplanations(prev => ({
        ...prev,
        [question.id]: `💡 *ऑफलाइन विश्लेषण*:\n\nसर्वर से संपर्क नहीं हो पाया।\n\n**सही उत्तर**: ${question.options[question.correctOptionIndex]}\n\n**व्याख्या**: ${question.explanationHindi}`,
      }));
    } finally {
      setLoadingAi(prev => ({ ...prev, [question.id]: false }));
    }
  };

  // Counting totals for easy revision triggers
  const totalWrongs = result.wrongAnswers;

  return (
    <div id="solution-portal" className="min-h-screen bg-slate-900 text-white font-sans selection:bg-amber-500 selection:text-slate-950 py-10">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Solution Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase">
                SOLUTION PORTAL
              </span>
              <h2 className="text-xl font-black text-white">{test.title}</h2>
            </div>
            <p className="text-xs text-slate-400">सभी प्रश्नों का विस्तृत विश्लेषण एवं सटीक उत्तर कुंजी।</p>
          </div>

          <div className="flex items-center gap-3">
            {totalWrongs > 0 && (
              <button
                onClick={onPracticeWrongs}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-150 flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="w-4 h-4" />
                <span>गलत हल पुनः अभ्यास ({totalWrongs})</span>
              </button>
            )}
            <button
              onClick={onBackToResult}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition duration-150"
            >
              ← स्कोरकार्ड पर जाएँ
            </button>
          </div>
        </div>

        {/* Dynamic Question Nav Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Navigation: List of questions with correct/incorrect markers */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow h-fit space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">प्रश्न नेविगेशन (Questions)</h3>
            
            <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto pr-1">
              {test.questions.map((q, idx) => {
                const sAns = result.answersMap[q.id] ?? -1;
                const isCorrectAns = sAns === q.correctOptionIndex;
                const isSkip = sAns === -1;

                let btnClass = "";
                if (idx === currentQIndex) {
                  btnClass = "ring-2 ring-amber-500 bg-slate-800 text-white border-slate-700";
                } else if (isSkip) {
                  btnClass = "bg-slate-900 border-slate-850 text-slate-500 hover:bg-slate-850";
                } else if (isCorrectAns) {
                  btnClass = "bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30";
                } else {
                  btnClass = "bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-bold font-mono transition flex items-center justify-center cursor-pointer ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Quick Map Legend */}
            <div className="border-t border-slate-850 pt-3 space-y-2 text-[11px] text-slate-500 font-bold">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                <span>सही उत्तर ({result.correctAnswers})</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
                <span>गलत उत्तर ({result.wrongAnswers})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 block"></span>
                <span>अनुत्तरित ({result.unattemptedQuestions})</span>
              </div>
            </div>
          </div>

          {/* Right Area: Large Solution Viewer Card */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              
              {/* Question Status Banner Header */}
              <div className="px-6 py-4 bg-slate-900 border-b border-slate-850 flex flex-wrap justify-between items-center gap-3">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  प्रश्न {currentQIndex + 1} of {test.questions.length} | विषय: {currentQuestion.subject}
                </span>

                <div className="flex items-center gap-2">
                  {isUnattempted ? (
                    <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>अनुत्तरित (Skipped)</span>
                    </span>
                  ) : isCorrect ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>आपका उत्तर सही है</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>आपका उत्तर गलत है</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6">
                
                {/* Question Block */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850 mb-6">
                  <p className="text-base sm:text-lg font-semibold text-white leading-relaxed Hindi-text">
                    {currentQuestion.questionText}
                  </p>
                </div>

                {/* MCQ Options with Correct/Incorrect marks */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrectIndex = idx === currentQuestion.correctOptionIndex;
                    const isStudentSelectedIndex = idx === studentAnswerIndex;

                    let optClass = "bg-slate-900 border-slate-850 text-slate-400";
                    let prefixClass = "bg-slate-850 text-slate-500";

                    if (isCorrectIndex) {
                      optClass = "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                      prefixClass = "bg-emerald-500 text-slate-950 font-black";
                    } else if (isStudentSelectedIndex) {
                      optClass = "bg-red-500/10 border-red-500 text-red-300";
                      prefixClass = "bg-red-500 text-white font-black";
                    }

                    return (
                      <div
                        key={idx}
                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition ${optClass}`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${prefixClass}`}>
                          {letters[idx]}
                        </span>
                        
                        <div className="flex-1 flex justify-between items-center gap-2">
                          <span className="text-sm sm:text-base font-medium Hindi-text leading-tight">{option}</span>
                          
                          {/* Label indicators */}
                          {isCorrectIndex && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                              सही उत्तर
                            </span>
                          )}
                          {isStudentSelectedIndex && !isCorrectIndex && (
                            <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded shrink-0">
                              आपका उत्तर
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* LOCAL EXPLANATION PANEL */}
                <div className="mt-8 bg-slate-900 p-5 rounded-2xl border border-slate-850">
                  <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>कोचिंग व्याख्या (Hindi Explanation)</span>
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed Hindi-text whitespace-pre-line">
                    {currentQuestion.explanationHindi}
                  </p>
                </div>

                {/* GEMINI AI SPECIAL EXPLANATION CALL */}
                <div className="mt-6">
                  {aiExplanations[currentQuestion.id] ? (
                    <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/5 relative">
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/10 to-transparent w-32 h-32 rounded-bl-full pointer-events-none"></div>
                      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-850 text-amber-400">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <h4 className="text-sm font-black uppercase tracking-wider">Shajahan AI गुरु व्याख्या व ट्रिक</h4>
                      </div>
                      
                      <div className="text-sm text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                        {/* Custom Simple Markdown parsing inside TSX cleanly */}
                        {aiExplanations[currentQuestion.id]}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fetchAiExplanation(currentQuestion)}
                      disabled={loadingAi[currentQuestion.id]}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-4 rounded-xl text-xs sm:text-sm transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
                    >
                      {loadingAi[currentQuestion.id] ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>AI शिक्षक हल विश्लेषण तैयार कर रहे हैं...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
                          <span>✨ Shajahan AI शिक्षक से शार्टकट ट्रिक सीखें (Get AI Shortcut Explanation)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>

              {/* Prev Next question buttons footer */}
              <div className="bg-slate-900 border-t border-slate-850 px-6 py-4 flex justify-between items-center">
                <button
                  onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 disabled:opacity-40 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>पिछला प्रश्न</span>
                </button>
                
                <button
                  onClick={() => setCurrentQIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                  disabled={currentQIndex === test.questions.length - 1}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 disabled:opacity-40 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition animate-pulse"
                >
                  <span>अगला प्रश्न</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Revision mode prompt for village/town students */}
            <div className="bg-gradient-to-r from-blue-500/5 to-slate-950 p-5 rounded-2xl border border-slate-850 text-xs text-slate-400 leading-relaxed">
              💡 **मार्क फॉर रिवीजन टिप**: इस सेक्शन के सभी कठिन प्रश्नों के AI विश्लेषणों को ध्यान से पढ़कर अपनी नोटबुक में नोट करें। रेलवे (Railway Group D/NTPC) और राज्यस्तरीय (BSSC) परीक्षाओं में शॉर्टकट सूत्र से समय की भारी बचत होती है।
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
