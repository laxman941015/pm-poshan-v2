import { 
  ChevronRight, BookOpen, User, BellRing,
  LayoutDashboard, UserCircle, Users, ClipboardList, Archive, CalendarRange, 
  FileText, CreditCard, Briefcase, ShieldCheck 
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [manualStep, setManualStep] = useState(1);

  const totalManualSteps = 6;

  const nextManualStep = () => {
    if (manualStep < totalManualSteps) {
      setManualStep(manualStep + 1);
    } else {
      setShowManualModal(false);
      setManualStep(1);
    }
  };

  const closeManual = () => {
    setShowManualModal(false);
    setManualStep(1);
  };
  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-50 via-white to-orange-50">
      
      {/* Fixed Header */}
      <div className="fixed w-full top-0 z-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm px-4 py-4 flex items-center justify-between">
          <div className="flex flex-row items-center gap-x-2 md:gap-x-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 100 100" 
              className="w-10 h-10 md:w-16 md:h-16 rounded-full shadow-md border-2 border-white bg-white shrink-0"
            >
              <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              <path id="curve" d="M 12 50 A 38 38 0 0 1 88 50" fill="transparent" />
              <text fill="#1e3a8a" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
                <textPath href="#curve" startOffset="50%" textAnchor="middle">
                  PM POSHAN
                </textPath>
              </text>
              <path id="curveBottom" d="M 85 55 A 35 35 0 0 1 15 55" fill="transparent" />
              <text fill="#ea580c" fontSize="12" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
                <textPath href="#curveBottom" startOffset="50%" textAnchor="middle">
                  YOJNA
                </textPath>
              </text>
              <g transform="translate(35, 45) scale(1.2)">
                <path d="M 0 10 C 0 15, 25 15, 25 10 Z" fill="#facc15" />
                <path d="M 2 9 C 2 0, 23 0, 23 9 Z" fill="#3b82f6" />
                <circle cx="12.5" cy="-0.5" r="2.5" fill="#1e3a8a" />
              </g>
            </svg>
            <span className="text-[15px] md:text-2xl font-black text-indigo-900 tracking-tight leading-tight">
                पीएम-शालेय पोषण आहार व्यवस्थापन
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/register" className="hidden md:block bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-2.5 px-6 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
              Register School
            </Link>
            <Link to="/login" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-200">
              Teacher Login
            </Link>
          </div>
        </header>

        {/* Menu Ribbon */}
        <div className="bg-[#474379] shadow-md border-b border-[#34305c] flex overflow-x-auto md:overflow-visible items-center justify-start md:justify-center gap-6 md:gap-10 py-3 px-4 md:px-0">
          <Link to="/" className="text-white/90 hover:text-white text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 whitespace-nowrap shrink-0">Home</Link>
          <button onClick={() => setShowPlanModal(true)} className="text-white/90 hover:text-white text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 whitespace-nowrap shrink-0">Plan Information</button>
          <button onClick={() => { setShowManualModal(true); setManualStep(1); }} className="text-white/90 hover:text-white text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 whitespace-nowrap shrink-0">User Manual</button>
          <button onClick={() => setShowHelpModal(true)} className="text-white/90 hover:text-white text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 whitespace-nowrap shrink-0">Help</button>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="pb-10 px-4 text-center relative mt-[130px] md:mt-[160px] min-h-[300px] md:min-h-[650px] flex items-end justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.onlymyhealth.com/imported/images/2022/September/08_Sep_2022/nutritonal_month_main.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="flex flex-row items-center justify-center gap-3">
            <Link to="/login" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-5 rounded-full shadow-lg shadow-blue-500/30 hover:scale-105 transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm">
              Daily Log
              <ChevronRight size={16} />
            </Link>
            <Link to="/register" className="bg-white/90 hover:bg-white text-slate-700 border border-slate-200 font-bold py-2 px-5 rounded-full shadow-md hover:scale-105 transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm backdrop-blur-sm">
              <User size={16} />
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Scrolling News Ticker */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 py-3 border-y border-orange-400/30 overflow-hidden relative shadow-inner">
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-10 pr-10">
            <span className="text-white font-black text-sm md:text-base flex items-center gap-3">
              <BellRing className="w-5 h-5 animate-bounce"/> शाळा नोंदणी सुरू झाली आहे, तुमच्या ७ दिवसांच्या मोफत ट्रायलचा लाभ घ्या. ★★★ School Registration has been started, avail your 7 days free trail. ★★★
            </span>
          </div>
          {/* Duplicate for seamless scrolling */}
          <div className="flex items-center gap-10 pr-10">
            <span className="text-white font-black text-sm md:text-base flex items-center gap-3">
              <BellRing className="w-5 h-5 animate-bounce"/> शाळा नोंदणी सुरू झाली आहे, तुमच्या ७ दिवसांच्या मोफत ट्रायलचा लाभ घ्या. ★★★ School Registration has been started, avail your 7 days free trail. ★★★
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* सुविधा मार्गदर्शिका (Feature Discovery Grid) */}
      <section className="py-12 px-4 bg-white/30 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center mb-16 mt-0">
            <div className="border-[3px] border-blue-600 px-8 md:px-20 py-4 md:py-8 rounded-[2rem] shadow-2xl shadow-blue-50/50 bg-white/60 backdrop-blur-md">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight m-0 text-center">
                सुविधा <span className="text-blue-600">मार्गदर्शिका</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Dashboard */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <LayoutDashboard size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">शिक्षक डॅशबोर्ड</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">शालेय पोषण आहाराचे नियंत्रण केंद्र.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> आजच्या आहाराची स्थिती पहा.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> धान्याचा साठा संपत असल्यास त्वरित सूचना.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> दैनंदिन नोंदींसाठी क्विक लिंक्स.
                </li>
              </ul>
            </div>

            {/* 2. Profile */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <UserCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">शिक्षक प्रोफाइल</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">शाळा आणि वैयक्तिक माहिती व्यवस्थापन.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> शाळेचा UDISE कोड आणि मराठी नाव.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> प्राथमिक/उच्च प्राथमिक विभाग सेटिंग्ज.
                </li>
              </ul>
            </div>

            {/* 3. Enrollment */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">विद्यार्थी नोंदणी</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">लाभार्थी विद्यार्थ्यांची अचूक माहिती.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> इयत्ता १ ली ते ८ वी पर्यंतची पटसंख्या.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> पटसंख्येनुसार आहाराचे उद्दिष्ट ठरते.
                </li>
              </ul>
            </div>

            {/* 4. Daily Log */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ClipboardList size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">दैनंदिन उपभोग नोंद</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">रोजच्या आहाराची डिजिटल हजेरी.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> लाभ घेतलेल्या विद्यार्थ्यांची संख्या नोंदवा.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> तांदूळ आणि मालाचे स्वयंचलित मोजमाप.
                </li>
              </ul>
            </div>

            {/* 5. Stock */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Archive size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">साठा नोंदवही</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">धान्य आणि मालाचे रिअल-टाइम ट्रॅकिंग.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> सर्व वस्तूंचा शिल्लक साठा पहा.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> नवीन मालाची पावती (Receipt) नोंदवा.
                </li>
              </ul>
            </div>

            {/* 6. Menu */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <CalendarRange size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">साप्ताहिक आहार नियोजन</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">निश्चित वेळापत्रकानुसार आहार वाटप.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> आठवड्याचा आहार (उदा. सोमवारी खिचडी) सेट करा.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> रोजचा खर्च आणि माल आपोआप मोजला जाईल.
                </li>
              </ul>
            </div>

            {/* 7. ZP Reports */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">मासिक झेड.पी. अहवाल</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">क्लिष्ट अहवाल आता एका क्लिकवर.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> प्रारंभीची शिल्लक, आवक, खर्च आणि अंतिम शिल्लक.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> जिल्हा परिषदेच्या निकषांनुसार अहवाल.
                </li>
              </ul>
            </div>

            {/* 8. Ledgers */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">आर्थिक आणि वस्तू खतावणी</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">ऑडिट-रेडी व्यवहारांची सविस्तर नोंद.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> वस्तू खतावणी (Item Ledger) ट्रॅकिंग.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> आचारी मानधन खतावणीचा हिशोब.
                </li>
              </ul>
            </div>

            {/* 9. Payment */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">सबस्क्रिप्शन आणि पेमेंट</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">प्रगत वैशिष्ट्यांसाठी खाते व्यवस्थापन.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> तुमच्या खात्याची मुदत आणि स्थिती पहा.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Razorpay द्वारे सुरक्षित वार्षिक शुल्क भरा.
                </li>
              </ul>
            </div>

            {/* 10. Staff */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50 hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">कर्मचारी व्यवस्थापन</h3>
              <p className="text-sm font-bold text-slate-500 mb-4 italic leading-relaxed">स्वयंपाकी आणि मदतनीस यांचा हिशोब.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> बचत गट आणि मदतनीसांची माहिती.
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> उपस्थिती आणि मानधनाचा अचूक हिशोब.
                </li>
              </ul>
            </div>
          </div>
          
      {/* Plan Information Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden relative animate-in fade-in zoom-in duration-300 my-auto">
            {/* Close Button */}
            <button onClick={() => setShowPlanModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-white shadow-sm p-2 rounded-full z-20 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">निवडा तुमचा योग्य प्लॅन</h2>
                <p className="text-slate-500 font-medium">तुमच्या शाळेच्या गरजेनुसार सर्वोत्तम प्लॅन निवडा</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="mb-6">
                    <span className="bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">Free Trial</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-4">७ दिवसांचा मोफत प्लॅन</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">₹०</span>
                      <span className="text-slate-400 font-medium">/७ दिवस</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> ७ दिवसांसाठी पूर्ण एक्सेस
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> सर्व अहवाल (Reports) सुविधा
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> ऑटोमॅटिक हिशोब (Auto Math)
                    </li>
                  </ul>
                </div>

                {/* Standard Plan */}
                <div className="bg-white rounded-3xl p-8 border-2 border-indigo-600 shadow-indigo-100 shadow-2xl scale-105 relative flex flex-col group">
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">Most Popular</div>
                  <div className="mb-6">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">Primary / Upper Primary</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-4">१-५ वी किंवा ६-८ वी</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">₹६९९</span>
                      <span className="text-slate-400 font-medium">/वर्ष</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> पूर्ण वर्षभर एक्सेस
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> इन्व्हेंटरी आणि स्टॉक मॅनेजमेंट
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> झेड.पी. फॉरमॅट मधील अहवाल
                    </li>
                  </ul>
                </div>

                {/* Combo Plan */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="mb-6">
                    <span className="bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">Combo Package</span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-4">१-८ वी कॉम्बो प्लॅन</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">₹८९९</span>
                      <span className="text-slate-400 font-medium">/वर्ष</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> सर्व वर्गांसाठी एकच लॉगिन
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> एकत्रित (Unified) डॅशबोर्ड
                    </li>
                    <li className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                      <ShieldCheck className="w-5 h-5 text-green-500 shrink-0"/> सर्वोत्तम व्हॅल्यू पॅक
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 text-center bg-slate-900 text-white py-6 px-4 rounded-2xl shadow-xl shadow-slate-200">
                <p className="font-bold text-lg">
                  प्लॅन ॲक्टिव्हेट करण्यासाठी कृपया लॉगिन करा आणि तुमची माहिती भरा.
                </p>
                <p className="text-slate-400 text-sm mt-1">To activate this plan kindly login and fill information.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Manual Modal (Wizard) */}
      {showManualModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-1">वापरकर्ता मार्गदर्शिका (User Manual)</h3>
                <p className="text-indigo-100 text-xs font-medium uppercase tracking-widest">पायरी {manualStep} पैकी {totalManualSteps}</p>
              </div>
              <button onClick={closeManual} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8">
              {manualStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-indigo-600 mb-2">
                    <div className="p-3 bg-indigo-50 rounded-2xl"><UserCircle className="w-8 h-8"/></div>
                    <h4 className="text-2xl font-black">स्टेप १: शिक्षक प्रोफाईल</h4>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    तुमच्या प्रोफाईल विभागात जाऊन तुमची सर्व माहिती (नाव, संपर्क, पद इ.) अचूक भरा. हे अहवाल जनरेट करण्यासाठी आवश्यक आहे.
                  </p>
                </div>
              )}

              {manualStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-indigo-600 mb-2">
                    <div className="p-3 bg-indigo-50 rounded-2xl"><Users className="w-8 h-8"/></div>
                    <h4 className="text-2xl font-black">स्टेप २: विद्यार्थी नोंदणी</h4>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    विद्यार्थी नोंदणी (Student Enrollment) मध्ये विद्यार्थ्यांची माहिती भरा. तुमच्या शाळेचा स्तर निश्चित करा:
                    <ul className="list-disc ml-6 mt-3 space-y-1 text-slate-700">
                      <li>पहिली ते पाचवी (1-5th)</li>
                      <li>सहावी ते आठवी (6-8th)</li>
                      <li>दोन्ही स्तर (Both)</li>
                    </ul>
                  </p>
                </div>
              )}

              {manualStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-indigo-600 mb-2">
                    <div className="p-3 bg-indigo-50 rounded-2xl"><ClipboardList className="w-8 h-8"/></div>
                    <h4 className="text-2xl font-black">स्टेप ३: आहार प्रमाण</h4>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    नोंदणी केलेल्या विद्यार्थ्यांनुसार प्रति विद्यार्थी लागणारे आहाराचे प्रमाण (Portion) भरा. ड्रॉपडाउनमधून अन्नपदार्थ निवडा आणि त्याचे प्रमाण प्रविष्ट करा.
                  </p>
                </div>
              )}

              {manualStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-indigo-600 mb-2">
                    <div className="p-3 bg-indigo-50 rounded-2xl"><FileText className="w-8 h-8"/></div>
                    <h4 className="text-2xl font-black">स्टेप ४: अहवाल क्रमवारी (Rank)</h4>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    अहवालाच्या फॉरमॅटनुसार अन्नपदार्थांना 'रँक' (Rank) द्या. यामुळे अहवालामध्ये सर्व पदार्थ योग्य आणि तुमच्या पसंतीच्या क्रमाने दिसतील.
                  </p>
                </div>
              )}

              {manualStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-indigo-600 mb-2">
                    <div className="p-3 bg-indigo-50 rounded-2xl"><CalendarRange className="w-8 h-8"/></div>
                    <h4 className="text-2xl font-black">स्टेप ५: साप्ताहिक नियोजन</h4>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    साप्ताहिक आहार वितरणाचे वेळापत्रक तयार करा. डेली लॉग (Daily Log) सबमिट केल्यावर यातील पदार्थ स्टॉक मधून आपोआप वजा होतील, म्हणून योग्य पदार्थ निवडा.
                  </p>
                </div>
              )}

              {manualStep === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-indigo-600 mb-2">
                    <div className="p-3 bg-indigo-50 rounded-2xl"><Archive className="w-8 h-8"/></div>
                    <h4 className="text-2xl font-black">स्टेप ६: स्टॉक आणि शिल्लक साठा</h4>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    तुमच्याकडील उपलब्ध साठ्याची माहिती भरा. एप्रिल महिन्यातील सुरुवातीचा शिल्लक साठा (Opening Balance) भरण्यासाठी 'एकवेळ घोषणा' (One-time Declaration) सुविधेचा वापर करा. ही एक वेळची तरतूद आहे.
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mt-8 flex gap-2">
                {[...Array(totalManualSteps)].map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i + 1 <= manualStep ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex gap-4">
                <button 
                  onClick={closeManual}
                  className="flex-1 px-6 py-4 border-2 border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                >
                  बंद करा (Hide)
                </button>
                <button 
                  onClick={nextManualStep}
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {manualStep === totalManualSteps ? 'पूर्ण करा' : 'पुढील स्टेप (Next)'}
                  {manualStep < totalManualSteps && <ChevronRight className="w-5 h-5"/>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          
          {/* Footer Note Banner */}
          <div className="mt-20 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-slate-800">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                      <ShieldCheck className="text-white" size={24} />
                   </div>
                   <p className="text-white font-black uppercase italic tracking-tighter text-lg md:text-xl">
                     सुरक्षित लोकल-फर्स्ट तंत्रज्ञान
                   </p>
                </div>
                <p className="text-slate-400 font-bold text-xs md:text-sm max-w-xl text-center md:text-right leading-relaxed">
                  तुमची माहिती तुमच्याच डिव्हाइसवर सुरक्षित राहते, ज्यामुळे इंटरनेट नसतानाही काम करता येते आणि डेटा प्रायव्हसी जपली जाते.
                </p>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-slate-500 font-medium text-lg">Three easy steps to streamline your operations.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center max-w-xs relative group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-black flex items-center justify-center text-3xl mb-6 shadow-md shadow-blue-100/50 group-hover:scale-110 transition-transform duration-300 border border-blue-200/50">
                1
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Secure Login</h4>
              <p className="font-medium text-slate-500">Access the portal using your authorized School ID.</p>
            </div>
            
            <div className="flex flex-col items-center text-center max-w-xs relative group">
              <div className="hidden md:block absolute top-8 -left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 -z-10"></div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 font-black flex items-center justify-center text-3xl mb-6 shadow-md shadow-indigo-100/50 group-hover:scale-110 transition-transform duration-300 border border-indigo-200/50 relative z-10">
                2
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Automated Logs</h4>
              <p className="font-medium text-slate-500">Enter daily attendance points and let the system verify norms.</p>
            </div>
            
            <div className="flex flex-col items-center text-center max-w-xs relative group">
              <div className="hidden md:block absolute top-8 -left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-100 to-orange-100 -z-10"></div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-50 text-orange-600 font-black flex items-center justify-center text-3xl mb-6 shadow-md shadow-orange-100/50 group-hover:scale-110 transition-transform duration-300 border border-orange-200/50 relative z-10">
                3
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Export Data</h4>
              <p className="font-medium text-slate-500">Download your Monthly Summary with just a click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800">
                 Help & Support
              </h3>
            </div>

            <div className="space-y-4 text-slate-700">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Office Time</p>
                  <p className="font-bold text-lg text-slate-800">10:00 AM to 05:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-[#25D366]/10 p-4 rounded-xl border border-[#25D366]/20">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-xs text-[#128C7E] font-bold uppercase tracking-wider mb-1">WhatsApp Your Query</p>
                  <p className="font-bold text-xl text-slate-800">+91 (Your Number)</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 px-4 text-center border-t border-slate-900 mt-10">
        <div className="mb-4 text-2xl font-bold text-slate-300 tracking-tight">PM-POSHAN Tracker</div>
        <p className="font-medium tracking-wide flex flex-col md:flex-row items-center justify-center gap-2">
          <span>© 2026 PM-POSHAN Tracker -</span>
          <span 
            className="font-black uppercase tracking-widest text-lg drop-shadow-lg" 
            style={{ 
              backgroundImage: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Pratibha Info Solution
          </span>
        </p>
        <p className="text-sm mt-4 opacity-50">Designed to meet Maharashtra Food Management guidelines.</p>
      </footer>
    </div>
  );
}
