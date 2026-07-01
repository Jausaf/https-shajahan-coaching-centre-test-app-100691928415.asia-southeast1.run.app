import React, { useState, useEffect, useRef } from "react";
import { Clock, CheckSquare, List, Bookmark, HelpCircle, AlertTriangle, ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { Test, Question } from "../types";

interface TestTakingProps {
  test: Test;
  onSubmitTest: (answersMap: { [questionId: string]: number }, timeTakenSeconds: number) => void;
  onCancel: () => void;
}

export default function TestTaking({ test, onSubmitTest, onCancel }: TestTakingProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"one-by-one" | "full-list">("one-by-one");
  
  // State for answered questions: map questionId -> selectedOptionIndex (0-3), or undefined
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  
  // State for marked for review: map questionId -> boolean
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});
  
  // Timer state (seconds remaining)
  const totalSeconds = test.durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const timerRef = useRef<any>(null);

  // Countdown logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleClearAnswer = (questionId: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleToggleMarkReview = (questionId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleAutoSubmit = () => {
    const timeTaken = totalSeconds;
    onSubmitTest(answers, timeTaken);
  };

  const handleManualSubmit = () => {
    const timeTaken = totalSeconds - secondsLeft;
    onSubmitTest(answers, timeTaken);
    setShowSubmitModal(false);
  };

  const currentQuestion = test.questions[currentIdx];

  // Stats for the sidebar tracker
  const totalQs = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unattemptedCount = totalQs - answeredCount;

  return (
    <div id="test-taking-container" className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      
      {/* Test Running Sticky Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 sm:py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Test Name & Badge */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="shrink-0 bg-red-600 text-white px-2.5 py-1 rounded text-[11px] font-black animate-pulse uppercase tracking-wider">
              LIVE EXAM
            </span>
            <div className="text-left">
              <h2 className="text-base font-bold text-white leading-tight">{test.title}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">विषय: <span className="text-amber-400 font-bold">{test.subject}</span> | {test.batchName}</p>
            </div>
          </div>

          {/* TIMER AND BUTTONS BAR */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
            {/* Countdown timer */}
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shadow-sm">
              <Clock className="w-5 h-5 text-amber-500 animate-spin-slow" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black block leading-none">समय शेष (Time Remaining)</span>
                <span className="text-lg font-black font-mono text-amber-400 leading-none block mt-1">
                  {formatTime(secondsLeft)}
                </span>
              </div>
            </div>

            {/* Toggle View Mode Button */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-850">
              <button
                onClick={() => setViewMode("one-by-one")}
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === "one-by-one" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
                title="एक बार में एक प्रश्न"
              >
                <CheckSquare className="w-4 h-4" />
                <span className="hidden md:inline">एक-एक प्रश्न</span>
              </button>
              <button
                onClick={() => setViewMode("full-list")}
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === "full-list" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
                title="सभी प्रश्न एक साथ"
              >
                <List className="w-4 h-4" />
                <span className="hidden md:inline">पूरा पेपर</span>
              </button>
            </div>

            {/* Submit Mock Test */}
            <button
              onClick={() => setShowSubmitModal(true)}
              id="submit-test-trigger-btn"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm tracking-wider shadow-lg shadow-emerald-600/10 transition cursor-pointer"
            >
              सबमिट करें (Submit)
            </button>
          </div>

        </div>
      </header>

      {/* Main Testing Arena Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
        
        {/* Left Columns (3): Questions Panel */}
        <div className="lg:col-span-3 space-y-6">

          {/* VIEW MODE 1: ONE-QUESTION-AT-A-TIME (DEFAULT) */}
          {viewMode === "one-by-one" && currentQuestion && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              
              {/* Question Header */}
              <div className="bg-slate-900 px-5 py-4 border-b border-slate-850 flex justify-between items-center">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  प्रश्न {currentIdx + 1} of {totalQs}
                </span>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    +{test.marksPerQuestion} अंक
                  </span>
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/20">
                    -{test.negativeMarking} नेगेटिव
                  </span>
                </div>
              </div>

              {/* Question Text Arena */}
              <div className="p-6">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 mb-6">
                  <p className="text-base sm:text-lg font-semibold text-white leading-relaxed Hindi-text">
                    {currentQuestion.questionText}
                  </p>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const letters = ["A", "B", "C", "D"];
                    const isSelected = answers[currentQuestion.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQuestion.id, idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center gap-4 cursor-pointer group ${
                          isSelected 
                            ? "bg-amber-500/15 border-amber-500 text-white" 
                            : "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-850 hover:border-slate-800"
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                          isSelected 
                            ? "bg-amber-500 text-slate-950" 
                            : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                        }`}>
                          {letters[idx]}
                        </span>
                        <span className="text-sm sm:text-base font-medium leading-relaxed Hindi-text">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Footer Actions */}
                <div className="mt-8 pt-6 border-t border-slate-850 flex flex-wrap gap-3 justify-between items-center">
                  <div className="flex gap-2">
                    {answers[currentQuestion.id] !== undefined && (
                      <button
                        onClick={() => handleClearAnswer(currentQuestion.id)}
                        className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                      >
                        उत्तर हटाएं (Clear Response)
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleToggleMarkReview(currentQuestion.id)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 ${
                        markedForReview[currentQuestion.id]
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>{markedForReview[currentQuestion.id] ? "मार्कड फॉर रिव्यु (Marked)" : "रिव्यु के लिए रखें (Mark for Review)"}</span>
                    </button>
                  </div>

                  {/* Previous / Next buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                      disabled={currentIdx === 0}
                      className="bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-white font-bold p-3 rounded-xl transition"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentIdx(prev => Math.min(totalQs - 1, prev + 1))}
                      disabled={currentIdx === totalQs - 1}
                      className="bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-white font-bold p-3 rounded-xl transition"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* VIEW MODE 2: FULL-QUESTION-LIST */}
          {viewMode === "full-list" && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>आप पूरा प्रश्न पत्र एक साथ देख रहे हैं। किसी भी विकल्प पर क्लिक करके उत्तर अंकित करें।</span>
              </div>

              {test.questions.map((question, qIdx) => {
                const letters = ["A", "B", "C", "D"];
                return (
                  <div key={question.id} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow">
                    
                    {/* Header */}
                    <div className="bg-slate-900 px-5 py-3 border-b border-slate-850 flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-400">
                        प्रश्न {qIdx + 1} | विषय: {question.subject}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleMarkReview(question.id)}
                          className={`text-[10px] font-bold px-2 py-1 rounded transition flex items-center gap-1 ${
                            markedForReview[question.id]
                              ? "bg-amber-500 text-slate-950"
                              : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>रिव्यु</span>
                        </button>
                        {answers[question.id] !== undefined && (
                          <button
                            onClick={() => handleClearAnswer(question.id)}
                            className="bg-slate-800 text-[10px] font-semibold text-red-400 hover:text-red-300 px-2 py-1 rounded"
                          >
                            उत्तर हटाएं
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="p-5">
                      <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed mb-4 Hindi-text">
                        {question.questionText}
                      </p>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.options.map((option, optIdx) => {
                          const isSelected = answers[question.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(question.id, optIdx)}
                              className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center gap-3 cursor-pointer ${
                                isSelected
                                  ? "bg-amber-500/10 border-amber-500 text-amber-300"
                                  : "bg-slate-900 border-slate-850 text-slate-300 hover:bg-slate-850"
                              }`}
                            >
                              <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected ? "bg-amber-500 text-slate-950" : "bg-slate-850 text-slate-500"
                              }`}>
                                {letters[optIdx]}
                              </span>
                              <span className="Hindi-text leading-tight">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Guidance Alert for Small Screen Users */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-xs text-slate-500 leading-relaxed">
            🚩 **महत्वपूर्ण सूचना**: यदि इंटरनेट कनेक्टिविटी चली भी जाती है, तो परीक्षा स्क्रीन को रिफ्रेश न करें। आपके सबमिट किए गए उत्तर सुरक्षित रहते हैं। किसी भी शंका की स्थिति में ऊपर दिए गए 'सबमिट करें' बटन से परीक्षा सुरक्षित रूप से सबमिट करें।
          </div>

        </div>

        {/* Right Columns (1): Status Tracker Sidebar & Instructions */}
        <div className="space-y-6">
          
          {/* Status Tracker */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">परीक्षा ट्रैकर (Exam Status)</h3>
            
            <div className="grid grid-cols-2 gap-2 text-center mb-6">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-850">
                <span className="text-xl font-bold font-mono text-emerald-400">{answeredCount}</span>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">उत्तर दिए (Answered)</p>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-850">
                <span className="text-xl font-bold font-mono text-amber-400">{markedCount}</span>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">रिव्यु (Marked)</p>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-850 col-span-2">
                <span className="text-xl font-bold font-mono text-slate-400">{unattemptedCount}</span>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">अनटेम्पटेड (Remaining)</p>
              </div>
            </div>

            {/* Interactive Question Jump Board */}
            <p className="text-[11px] text-slate-500 font-bold mb-2 uppercase tracking-wide">प्रश्नों की सूची (Jump Board)</p>
            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
              {test.questions.map((q, idx) => {
                const isCurrent = currentIdx === idx && viewMode === "one-by-one";
                const isAnswered = answers[q.id] !== undefined;
                const isMarked = markedForReview[q.id] === true;

                let btnClass = "bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-850";
                if (isAnswered) btnClass = "bg-emerald-600 text-white border-emerald-500";
                if (isMarked) btnClass = "bg-amber-500 text-slate-950 border-amber-400";
                if (isCurrent) btnClass = "ring-2 ring-amber-500 bg-slate-800 text-white border-slate-700";

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setViewMode("one-by-one");
                      setCurrentIdx(idx);
                    }}
                    className={`h-9 rounded-lg border text-xs font-black font-mono transition flex items-center justify-center cursor-pointer ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Negative Marking Alert */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>नेगेटिव मार्किंग चेतावनी</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              इस परीक्षा में प्रत्येक गलत उत्तर के लिए <span className="text-red-400 font-bold">{test.negativeMarking} अंक</span> काटे जाएंगे। यदि आपको किसी उत्तर के बारे में पक्का पता नहीं है, तो गलत तुक्का लगाने से बचें।
            </p>
          </div>

          {/* Quick Exit / Help Button */}
          <button
            onClick={() => {
              if (confirm("क्या आप सचमुच परीक्षा रद्द करके पीछे जाना चाहते हैं? आपका वर्तमान प्रयास निरस्त हो जाएगा।")) {
                onCancel();
              }
            }}
            className="w-full bg-slate-950/40 hover:bg-red-600/10 border border-slate-850 hover:border-red-600/30 text-xs text-slate-400 hover:text-red-400 font-semibold py-3 px-4 rounded-xl transition"
          >
            परीक्षा निरस्त करें (Cancel)
          </button>

        </div>

      </div>

      {/* CONFIRMATION SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 shadow-2xl relative">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">क्या आप परीक्षा सबमिट करना चाहते हैं?</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                कृपया ध्यान दें! एक बार सबमिट करने के बाद आप उत्तरों में संशोधन नहीं कर पाएंगे। आपको तुरंत आपके अंक, रैंक और विस्तृत हिंदी हल प्राप्त हो जाएंगे।
              </p>

              {/* Mini Stats Summary */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-4 rounded-xl border border-slate-850 mb-6 text-center">
                <div>
                  <span className="text-xs text-slate-500 block">कुल प्रश्न</span>
                  <span className="text-base font-bold text-white font-mono">{totalQs}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">उत्तर दिया</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{answeredCount}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">शेष प्रश्न</span>
                  <span className="text-base font-bold text-slate-400 font-mono">{unattemptedCount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition duration-150"
                >
                  नहीं, वापस जाएँ
                </button>
                <button
                  onClick={handleManualSubmit}
                  id="confirm-submit-test-btn"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition duration-150 shadow-lg shadow-emerald-600/20"
                >
                  हाँ, सबमिट करें
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
