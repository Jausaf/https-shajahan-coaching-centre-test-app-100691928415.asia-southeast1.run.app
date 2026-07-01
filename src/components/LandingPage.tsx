import React from "react";
import { BookOpen, Award, Phone, Trophy, Users, ShieldAlert, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onStartTest: () => void;
  onNavigateToLogin: () => void;
  onNavigateToAdmin: () => void;
}

export default function LandingPage({ onStartTest, onNavigateToLogin, onNavigateToAdmin }: LandingPageProps) {
  const whatsappNumber = "919546275231"; // Sample official coaching number
  const messageText = encodeURIComponent("नमस्ते सर, मैं Shajahan Coaching Centre के ऑनलाइन टेस्ट पोर्टल के बारे में जानकारी चाहता हूँ।");

  return (
    <div id="landing-page" className="min-h-screen bg-slate-900 text-white font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-amber-500 tracking-tight">SHAJAHAN</h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase -mt-1 font-semibold">COACHING CENTRE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateToLogin}
              id="header-student-login-btn"
              className="px-4 py-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition duration-150"
            >
              छात्र लॉगिन (Login)
            </button>
            <button 
              onClick={onNavigateToAdmin}
              id="header-admin-login-btn"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 shadow-md shadow-amber-500/10"
            >
              शिक्षक पैनल (Admin)
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        {/* Ambient background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-medium mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>बिहार की नंबर 1 सरकारी नौकरी तैयारी ऐप</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight sm:leading-none">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Shajahan Coaching Centre</span>
          </h2>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
            Online test series, instant result, ranking, and Hindi explanations for serious government exam preparation.
          </p>

          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto Hindi-text leading-relaxed">
            रेलवे, SSC, बिहार पुलिस, दरोगा, BSSC और अन्य राज्य स्तरीय परीक्षाओं के लिए सर्वश्रेष्ठ ऑनलाइन परीक्षा केंद्र। ग्रामीण छात्रों के लिए सबसे आसान और परिणाम-उन्मुख मंच।
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStartTest}
              id="hero-start-test-btn"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-amber-500/20 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>टेस्ट शुरू करें (Start Test)</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a
              href={`https://wa.me/${whatsappNumber}?text=${messageText}`}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-contact-coaching-btn"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg shadow-emerald-500/10 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>कोचिंग से संपर्क करें (WhatsApp)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Target Exams Carousel Banner */}
      <section className="py-8 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">विशेष तैयारी (Target Exams)</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: "Railway NTPC & Group D", color: "from-blue-600/30 to-slate-900" },
              { name: "BSSC Inter Level", color: "from-amber-600/30 to-slate-900" },
              { name: "Bihar Police & Daroga", color: "from-red-600/30 to-slate-900" },
              { name: "SSC GD, CHSL & CGL", color: "from-purple-600/30 to-slate-900" },
              { name: "Civil Court & BPSC", color: "from-indigo-600/30 to-slate-900" }
            ].map((exam, i) => (
              <div 
                key={i} 
                className={`bg-gradient-to-b ${exam.color} p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-center items-center min-h-[90px] shadow-sm hover:border-amber-500/40 transition duration-150`}
              >
                <span className="text-sm sm:text-base font-bold text-white leading-tight">{exam.name}</span>
                <span className="text-[10px] text-amber-400 font-semibold mt-1">Hindi Medium Special</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Features */}
      <section className="py-16 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-12">
            Shajahan कोचिंग की मुख्य विशेषताएं
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition duration-150 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-150">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">विस्तृत हिंदी व्याख्या (Hindi Explanations)</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                प्रत्येक प्रश्न के सबमिशन के बाद संपूर्ण व्याख्या हिंदी में दी जाएगी। जटिल गणितीय और विज्ञान प्रश्नों के लिए विशेष शॉर्टकट ट्रिक भी मिलेंगी।
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition duration-150 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors duration-150">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">लाइव रैंक कार्ड (Rank & Leaderboard)</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                टेस्ट देने वाले हजारों छात्रों के बीच अपनी रियल-टाइम रैंक और प्रदर्शन चार्ट देखें। टॉपर सूची (Leaderboard) से स्वयं को प्रेरित करें।
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition duration-150 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors duration-150">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">ग्रामीण छात्रों के लिए आसान (Easy Interface)</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                एकदम सरल और कम इंटरनेट पर भी चलने वाला डिज़ाइन। छोटे कस्बों और गाँवों के छात्रों के मोबाइल को ध्यान में रखकर बनाया गया है।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Stats */}
      <section className="bg-slate-950 py-12 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-500 font-mono">10,000+</p>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">सफल छात्र (Offline & Online)</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono">150+</p>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">ऑनलाइन मॉक टेस्ट</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono">25+</p>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">विशिष्ट अनुभवी शिक्षक</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-500 font-mono">92%</p>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">छात्र संतुष्टि दर (Success Rate)</p>
          </div>
        </div>
      </section>

      {/* Coaching Address & Details Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-slate-950" />
                </div>
                <span className="text-white font-bold text-lg">Shajahan Coaching Centre</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                रेलवे, एसएससी और बिहार पुलिस परीक्षाओं के लिए बिहार का प्रमुख संस्थान। हमारी लगन, आपका चयन।
              </p>
            </div>

            <div>
              <h5 className="text-white font-bold text-base mb-4">संपर्क सूत्र (Contact Us)</h5>
              <p className="mb-2 flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+91 95462 75231</span>
              </p>
              <p className="mb-2 text-slate-400">
                ईमेल: support@shajahancoaching.com
              </p>
              <p className="text-slate-400">
                समय: सुबह 06:00 बजे से शाम 08:00 बजे तक
              </p>
            </div>

            <div>
              <h5 className="text-white font-bold text-base mb-4">पता (Offline Head Office)</h5>
              <p className="leading-relaxed text-slate-300">
                शजहान कोचिंग सेंटर भवन,<br />
                नया बाजार मार्ग, गांधी मैदान के पास,<br />
                पटना, बिहार - 800001
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 Shajahan Coaching Centre Test App. सर्वाधिकार सुरक्षित।</p>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={onNavigateToAdmin} className="text-slate-500 hover:text-amber-400 transition">Admin Portal</button>
              <span>•</span>
              <button onClick={onNavigateToLogin} className="text-slate-500 hover:text-amber-400 transition">Student Login</button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
