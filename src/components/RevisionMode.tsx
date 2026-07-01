import React, { useState } from "react";
import { RefreshCw, BookOpen, CheckCircle, XCircle, Trophy, HelpCircle, ArrowLeft } from "lucide-react";
import { Question, TestResult } from "../types";

interface RevisionModeProps {
  results: TestResult[];
  allQuestions: Question[];
  onBackToDashboard: () => void;
}

export default function RevisionMode({ results, allQuestions, onBackToDashboard }: RevisionModeProps) {
  // Collect all unique question IDs answered incorrectly by this student
  // For safety, let's filter the questions that actually match those IDs
  const wrongQuestionIds = Array.from(new Set(
    results.flatMap(r => 
      Object.entries(r.answersMap)
        .filter(([qId, sAnsIdx]) => {
          const q = allQuestions.find(quest => quest.id === qId);
          return q && sAnsIdx !== -1 && sAnsIdx !== q.correctOptionIndex;
        })
        .map(([qId]) => qId)
    )
  ));

  const wrongQuestions = allQuestions.filter(q => wrongQuestionIds.includes(q.id));

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const currentQ = wrongQuestions[currentIdx];
  const letters = ["A", "B", "C", "D"];

  const handleSelectOption = (idx: number) => {
    if (hasChecked) return;
    setSelectedIdx(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedIdx === null) return;
    setHasChecked(true);
  };

  const handleNextQuestion = () => {
    setSelectedIdx(null);
    setHasChecked(false);
    setCurrentIdx(prev => prev + 1);
  };

  return (
    <div id="revision-mode-page" className="min-h-screen bg-slate-900 text-white font-sans py-12 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-8 border-b border-slate-800">
          <div>
            <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              गलती सुधार मोड (REVISION MODE)
            </span>
            <h2 className="text-xl font-bold text-white mt-1">गलत उत्तरों का पुनः अभ्यास</h2>
          </div>
          <button
            onClick={onBackToDashboard}
            className="text-xs bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white px-4 py-2 rounded-xl transition"
          >
            ← वापस डैशबोर्ड
          </button>
        </div>

        {wrongQuestions.length === 0 ? (
          <div className="bg-slate-950 p-12 rounded-2xl border border-slate-800 text-center space-y-4">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
            <h3 className="text-xl font-black text-white">कोई गलत प्रश्न दर्ज नहीं है!</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              शानदार तैयारी! आपके दिए गए मॉक टेस्टों में एक भी गलत उत्तर नहीं है। अपनी तैयारी इसी तरह बनाए रखें।
            </p>
            <button
              onClick={onBackToDashboard}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold transition"
            >
              वापस मुख्य पोर्टल
            </button>
          </div>
        ) : currentIdx >= wrongQuestions.length ? (
          <div className="bg-slate-950 p-12 rounded-2xl border border-slate-800 text-center space-y-4">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-white">रिवीजन पूर्ण हुआ!</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              आपने अपने सभी गलत प्रश्नों का दोबारा अभ्यास कर लिया है। अब नए मॉक टेस्ट देने के लिए तैयार हो जाएं।
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  setCurrentIdx(0);
                  setSelectedIdx(null);
                  setHasChecked(false);
                }}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-850 px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>पुनः रिवीजन करें</span>
              </button>
              <button
                onClick={onBackToDashboard}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold transition"
              >
                डैशबोर्ड पर लौटें
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            
            {/* Status indicator bar */}
            <div className="px-6 py-3.5 bg-slate-900 border-b border-slate-850 flex justify-between items-center">
              <span className="text-xs font-bold text-amber-400 font-mono">
                प्रश्न {currentIdx + 1} of {wrongQuestions.length}
              </span>
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded uppercase">
                पुनः परीक्षा (Re-test)
              </span>
            </div>

            {/* Question Text */}
            <div className="p-6 space-y-6">
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-850">
                <span className="text-[10px] text-amber-500 font-bold block mb-1 uppercase">विषय: {currentQ.subject}</span>
                <p className="text-base sm:text-lg font-semibold text-white leading-relaxed Hindi-text">
                  {currentQ.questionText}
                </p>
              </div>

              {/* Options list */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedIdx === idx;
                  const isCorrectAnswer = idx === currentQ.correctOptionIndex;

                  let optClass = "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-850";
                  let prefixClass = "bg-slate-800 text-slate-400";

                  if (isSelected) {
                    optClass = "bg-amber-500/10 border-amber-500 text-amber-300";
                    prefixClass = "bg-amber-500 text-slate-950 font-black";
                  }

                  if (hasChecked) {
                    if (isCorrectAnswer) {
                      optClass = "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                      prefixClass = "bg-emerald-500 text-slate-950 font-black";
                    } else if (isSelected) {
                      optClass = "bg-red-500/10 border-red-500 text-red-300";
                      prefixClass = "bg-red-500 text-white font-black";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasChecked}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition cursor-pointer ${optClass}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${prefixClass}`}>
                        {letters[idx]}
                      </span>
                      <span className="text-sm sm:text-base font-medium Hindi-text leading-tight">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Verification Feedback Block */}
              {hasChecked && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-850 space-y-3">
                  <div className="flex items-center gap-2">
                    {selectedIdx === currentQ.correctOptionIndex ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>बहुत बढ़िया! सही उत्तर</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        <span>गलत उत्तर, कोई बात नहीं फिर प्रयास करें</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-1 uppercase">हल एवं व्याख्या (Explanation):</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed Hindi-text">
                      {currentQ.explanationHindi}
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                {!hasChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedIdx === null}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black py-3 px-6 rounded-xl text-xs transition"
                  >
                    उत्तर जांचें (Verify Answer)
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-xs transition"
                  >
                    {currentIdx === wrongQuestions.length - 1 ? "रिवीजन समाप्त" : "अगला प्रश्न देखें"}
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
