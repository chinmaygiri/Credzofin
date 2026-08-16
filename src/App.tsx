import React, { useState, useEffect } from "react";
import { 
  Shield, 
  TrendingUp, 
  Coins, 
  User, 
  Briefcase, 
  Car, 
  Smartphone, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle, 
  Check, 
  Lock, 
  PieChart, 
  Info, 
  Percent, 
  Calendar, 
  Heart, 
  Activity, 
  BookOpen, 
  Sparkles,
  HelpCircle,
  Clock,
  Award,
  Phone,
  Mail,
  Star,
  Zap,
  CreditCard
} from "lucide-react";
import { CredzoLogo, CredzoIcon } from "./components/Logo";

export default function App() {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // EMI Calculator states
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTenure, setLoanTenure] = useState(5); // years

  // Calculated EMI details
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // SIP Calculator states
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12); // Expected return
  const [sipYears, setSipYears] = useState(10);

  // Calculated SIP details
  const [sipInvested, setSipInvested] = useState(0);
  const [sipEstReturns, setSipEstReturns] = useState(0);
  const [sipTotalValue, setSipTotalValue] = useState(0);

  // Insurance Quote states
  const [insType, setInsType] = useState<"life" | "health" | "motor" | "travel">("life");
  const [insAge, setInsAge] = useState(30);
  const [insCover, setInsCover] = useState(5000000); // 50 Lakhs default
  const [insPremium, setInsPremium] = useState(0);

  // Modal control states
  const [activeModal, setActiveModal] = useState<"login" | "signup" | "eligibility" | "apply" | "none">("none");
  const [modalData, setModalData] = useState<any>(null);

  // Eligibility Checker State
  const [salary, setSalary] = useState<string>("50000");
  const [existingEmi, setExistingEmi] = useState<string>("0");
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);

  // Auth form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  // Calculate EMI whenever inputs change
  useEffect(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;
    
    if (r === 0) {
      const calculatedEmi = P / n;
      setEmi(Math.round(calculatedEmi));
      setTotalPayment(P);
      setTotalInterest(0);
    } else {
      const calculatedEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayable = calculatedEmi * n;
      const totalInt = totalPayable - P;
      
      setEmi(Math.round(calculatedEmi));
      setTotalPayment(Math.round(totalPayable));
      setTotalInterest(Math.round(totalInt));
    }
  }, [loanAmount, interestRate, loanTenure]);

  // Calculate SIP whenever inputs change
  useEffect(() => {
    const M = sipMonthly;
    const r = sipRate / 12 / 100;
    const n = sipYears * 12;

    const totalInvested = M * n;
    let futureValue = 0;

    if (r === 0) {
      futureValue = totalInvested;
    } else {
      // Future Value of an Annuity Due formula
      futureValue = M * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    }

    const estimatedReturns = futureValue - totalInvested;

    setSipInvested(totalInvested);
    setSipEstReturns(Math.round(estimatedReturns));
    setSipTotalValue(Math.round(futureValue));
  }, [sipMonthly, sipRate, sipYears]);

  // Calculate Insurance premium estimate
  useEffect(() => {
    let baseRate = 0.00012; // Base annual premium rate
    
    if (insType === "life") {
      baseRate = 0.00015;
      // Age modifier: premium increases with age
      const ageModifier = 1 + (insAge - 18) * 0.045;
      const annualPremium = insCover * baseRate * ageModifier;
      setInsPremium(Math.round(annualPremium / 12));
    } else if (insType === "health") {
      baseRate = 0.0012;
      const ageModifier = 1 + (insAge - 18) * 0.035;
      // Health cover is lower typically (e.g. scale premium to cover scale)
      const annualPremium = insCover * baseRate * ageModifier;
      setInsPremium(Math.round(annualPremium / 12));
    } else if (insType === "motor") {
      // Motor is less age sensitive, cover scales with vehicle value
      baseRate = 0.015;
      const annualPremium = insCover * baseRate;
      setInsPremium(Math.round(annualPremium / 12));
    } else { // travel
      baseRate = 0.0008;
      // Travel premium is low, flat cover estimate
      const annualPremium = insCover * baseRate;
      setInsPremium(Math.round(annualPremium / 12));
    }
  }, [insType, insAge, insCover]);

  // Handle loan eligibility check
  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const income = parseFloat(salary) || 0;
    const emiOutgo = parseFloat(existingEmi) || 0;
    
    // Debt-to-income ratio guidelines: Disposable income limit is usually 50%
    const maxEmiAllowed = income * 0.5 - emiOutgo;
    const estimatedMaxLoanAmount = Math.max(0, Math.round(maxEmiAllowed * 60)); // roughly 5 years at 10%
    
    let status: "Approved" | "Review" | "Ineligible" = "Approved";
    let message = "";
    
    if (income < 15000) {
      status = "Ineligible";
      message = "Minimum monthly income required is ₹15,000 for standard loan approvals.";
    } else if (maxEmiAllowed <= 0) {
      status = "Ineligible";
      message = "Your current financial obligations (existing EMIs) exceed our safe debt-to-income threshold (50%).";
    } else if (maxEmiAllowed < 5000) {
      status = "Review";
      message = `Approved with conditions. You have high debt outgo. We can offer a micro-credit line of up to ₹${Math.round(maxEmiAllowed * 24).toLocaleString("en-IN")}.`;
    } else {
      status = "Approved";
      message = `Congratulations! You are eligible for high-limit financing. Estimated loan eligibility up to ₹${estimatedMaxLoanAmount.toLocaleString("en-IN")}.`;
    }

    setEligibilityResult({
      status,
      maxEmiAllowed: Math.round(Math.max(0, maxEmiAllowed)),
      estimatedMaxLoan: estimatedMaxLoanAmount,
      message
    });
  };

  // Helper formatting function
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Handle Mock Login/Signup
  const handleAuthSubmit = (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    setAuthSuccessMsg(
      type === "login" 
        ? "Successfully signed in! Welcome back." 
        : `Welcome to Credzo, ${fullName || "Investor"}! Your account was initialized.`
    );
    setTimeout(() => {
      setActiveModal("none");
      setAuthSuccessMsg("");
      setEmail("");
      setPassword("");
      setFullName("");
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="app-root" className="min-h-screen flex flex-col font-sans bg-[#f9f9ff] text-[#161c27] relative overflow-x-hidden">
      
      {/* HEADER */}
      <header id="site-header" className="bg-white/90 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 border-b border-gray-100 transition-all duration-200">
        <div id="header-container" className="flex justify-between items-center px-4 md:px-16 h-20 w-full max-w-7xl mx-auto">
          
          {/* Logo / Brand */}
          <div id="brand-logo" className="flex items-center cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <CredzoLogo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8 h-full">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="h-full flex items-center text-primary font-bold border-b-2 border-primary px-1 transition-all">Home</button>
            <button onClick={() => scrollToSection("section-borrow")} className="h-full flex items-center text-gray-600 font-medium hover:text-primary transition-colors px-1">Borrow</button>
            <button onClick={() => scrollToSection("section-invest")} className="h-full flex items-center text-gray-600 font-medium hover:text-primary transition-colors px-1">Invest</button>
            <button onClick={() => scrollToSection("section-insure")} className="h-full flex items-center text-gray-600 font-medium hover:text-primary transition-colors px-1">Insure</button>
            <button onClick={() => scrollToSection("section-about")} className="h-full flex items-center text-gray-600 font-medium hover:text-primary transition-colors px-1">About Us</button>
            <button onClick={() => scrollToSection("section-faqs")} className="h-full flex items-center text-gray-600 font-medium hover:text-primary transition-colors px-1">FAQ</button>
          </nav>

          {/* User Actions */}
          <div id="header-actions" className="hidden md:flex items-center gap-4">
            <button 
              id="login-btn-header"
              onClick={() => setActiveModal("login")} 
              className="text-primary font-bold px-5 py-2.5 rounded-full hover:bg-primary/5 transition-all text-sm border border-transparent hover:border-primary/10"
            >
              Log In
            </button>
            <button 
              id="signup-btn-header"
              onClick={() => setActiveModal("signup")} 
              className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-primary-container transition-all shadow-sm shadow-primary/10 hover:shadow-md"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            id="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-primary p-2 focus:outline-none hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div id="mobile-drawer-backdrop" className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300">
          <div id="mobile-drawer" className="fixed right-0 top-0 h-full w-4/5 max-w-[320px] bg-white shadow-2xl p-6 flex flex-col gap-6 z-50 transform translate-x-0 transition-transform duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <CredzoLogo size="sm" />
              <button 
                id="close-mobile-drawer"
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav id="mobile-nav-links" className="flex flex-col gap-4">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-left font-semibold text-lg text-primary py-1.5"
              >
                Home
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); scrollToSection("section-borrow"); }} 
                className="text-left font-medium text-lg text-gray-700 hover:text-primary py-1.5"
              >
                Borrow
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); scrollToSection("section-invest"); }} 
                className="text-left font-medium text-lg text-gray-700 hover:text-primary py-1.5"
              >
                Invest
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); scrollToSection("section-insure"); }} 
                className="text-left font-medium text-lg text-gray-700 hover:text-primary py-1.5"
              >
                Insure
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); scrollToSection("section-about"); }} 
                className="text-left font-medium text-lg text-gray-700 hover:text-primary py-1.5"
              >
                About Us
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); scrollToSection("section-faqs"); }} 
                className="text-left font-medium text-lg text-gray-700 hover:text-primary py-1.5"
              >
                FAQ
              </button>
            </nav>

            <div id="mobile-drawer-footer" className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
              <button 
                id="login-btn-mobile"
                onClick={() => { setIsMobileMenuOpen(false); setActiveModal("login"); }} 
                className="w-full text-center py-3 rounded-full border border-primary/20 text-primary font-bold text-sm hover:bg-gray-50"
              >
                Log In
              </button>
              <button 
                id="signup-btn-mobile"
                onClick={() => { setIsMobileMenuOpen(false); setActiveModal("signup"); }} 
                className="w-full text-center py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-20">

        {/* HERO SECTION */}
        <section id="hero-section" className="relative bg-gradient-to-br from-primary via-[#002f80] to-tertiary text-white overflow-hidden pb-8 pt-6 md:py-10 px-4 md:px-16">
          
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -right-[10%] -top-[20%] w-[60%] h-[120%] bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute -left-[5%] bottom-[5%] w-[40%] h-[50%] bg-secondary/15 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Col: Text Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 self-center lg:self-start bg-white/10 backdrop-blur-md text-white border border-white/20 font-semibold text-xs px-4 py-2 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>India's All-in-One Personal Finance Partner</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Borrow. Invest. Insure. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-fixed to-inverse-primary">
                  All in One Platform.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Credzo empowers you to achieve complete financial security. Fast NBFC-powered credit lines, robust mutual fund portfolios, and complete safety cover — all managed on a single dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center lg:justify-start">
                <button 
                  id="get-started-hero"
                  onClick={() => setActiveModal("signup")}
                  className="font-bold bg-white text-primary px-8 py-4 rounded-full hover:bg-[#ecf2ff] hover:scale-102 hover:ring-4 hover:ring-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  id="explore-products-hero"
                  onClick={() => scrollToSection("overlapping-products")}
                  className="font-bold border border-white/30 hover:border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                >
                  Explore Products
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Secure &amp; Licensed</p>
                    <p className="text-xs text-white/60">RBI Regulated NBFC Partner</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Instant Approval</p>
                    <p className="text-xs text-white/60">100% Digital Processing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center items-center relative py-4">
              <div className="absolute inset-0 bg-[#254adf]/20 blur-3xl rounded-full scale-75 animate-pulse"></div>
              
              {/* Phone Frame (Light Theme) */}
              <div className="relative w-[300px] h-[600px] bg-slate-100 rounded-[45px] p-3 shadow-2xl border-4 border-slate-200 ring-4 ring-white/60 transition-transform duration-500 hover:rotate-2">
                
                {/* Screen Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
                </div>

                {/* Internal Screen (Light Theme) */}
                <div className="w-full h-full rounded-[35px] overflow-hidden bg-[#f8fafc] text-slate-900 flex flex-col justify-between p-4 pt-7 text-[12px] relative shadow-inner">
                  
                  {/* Internal App Header */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <CredzoIcon className="w-5 h-5" color="#0038D1" />
                      <span className="font-bold text-[11px] text-slate-900">Credzo Credit</span>
                    </div>
                    <span className="text-[9px] text-emerald-600 font-extrabold tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">● LIVE</span>
                  </div>

                  {/* App Balance and Quick Stats */}
                  <div className="flex flex-col gap-2.5 py-2 flex-grow overflow-y-auto hide-scrollbar">
                    
                    {/* Pre-approved Loan Limit */}
                    <div className="bg-gradient-to-br from-[#0038D1] to-[#002699] p-3.5 rounded-xl shadow-md text-white relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/80 text-[10px] font-medium">Pre-Approved Loan Limit</p>
                          <h4 className="text-lg font-extrabold text-white mt-0.5">{formatCurrency(loanAmount || 500000)}</h4>
                        </div>
                        <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/40 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          Instant
                        </span>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[9px] text-white/90">
                        <span>Interest from {interestRate || 10.5}% p.a.</span>
                        <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">0 Collateral</span>
                      </div>
                    </div>

                    {/* Active Loan & EMI Details */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[11px] text-slate-900">Monthly EMI Breakdown</span>
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Active</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-1">
                        <div>
                          <p className="text-[10px] text-slate-500">Calculated EMI</p>
                          <p className="text-sm font-bold text-slate-900">{formatCurrency(emi)}<span className="text-[10px] text-slate-400 font-normal">/mo</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500">Tenure Period</p>
                          <p className="text-xs font-bold text-slate-700">{loanTenure} Years ({loanTenure * 12} Mos)</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-200/60">
                        <div className="bg-[#0038D1] h-full rounded-full w-3/4"></div>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-1.5 flex justify-between font-medium">
                        <span>Disbursal: In 2 Mins</span>
                        <span>Repayment: Auto-Debit</span>
                      </p>
                    </div>

                    {/* Quick Loan Types */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-700 mb-1.5">Instant Loan Products</p>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/80 hover:bg-primary/5 transition-colors">
                          <p className="font-bold text-slate-900 text-[10px]">Personal</p>
                          <p className="text-[8px] text-slate-500">Up to ₹10L</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/80 hover:bg-primary/5 transition-colors">
                          <p className="font-bold text-slate-900 text-[10px]">Business</p>
                          <p className="text-[8px] text-slate-500">Up to ₹50L</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/80 hover:bg-primary/5 transition-colors">
                          <p className="font-bold text-slate-900 text-[10px]">Education</p>
                          <p className="text-[8px] text-slate-500">Low ROI</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Tools shortcuts inside phone */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-[9px]">CIBIL Score</p>
                        <p className="font-bold text-slate-900 text-xs">785 <span className="text-[8px] text-emerald-600 font-semibold">(Excellent)</span></p>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <p className="text-slate-500 text-[9px]">Loan Sanction</p>
                        <p className="font-bold text-emerald-600 text-xs">Pre-Approved</p>
                      </div>
                    </div>

                  </div>

                  {/* App Navigation Bar inside phone */}
                  <div className="bg-white p-2 rounded-xl flex justify-around items-center border border-slate-200 shadow-sm">
                    <span className="text-[#0038D1] font-bold text-[9px]">Loans</span>
                    <span className="text-slate-400 text-[9px]">Apply</span>
                    <span className="text-slate-400 text-[9px]">EMI Calc</span>
                    <span className="text-slate-400 text-[9px]">Profile</span>
                  </div>

                </div>

                {/* Physical Controls Mock */}
                <div className="absolute -left-2 top-24 w-1.5 h-12 bg-slate-300 rounded-l-md"></div>
                <div className="absolute -right-2 top-32 w-1.5 h-20 bg-slate-300 rounded-r-md"></div>
              </div>

              {/* Floating micro badges */}
              <div className="absolute -right-6 top-12 bg-white text-slate-800 p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 animate-bounce">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold">100% Paperless</span>
              </div>

              <div className="absolute -left-6 bottom-12 bg-white text-slate-800 p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">Instant Disbursal</span>
              </div>

              <div className="absolute -left-12 top-16 bg-white text-slate-800 p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="text-xs font-bold">Instant Approval</span>
              </div>

              <div className="absolute -right-14 bottom-24 bg-white text-slate-800 p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold">4.8★ Rating</span>
              </div>

            </div>

          </div>
        </section>

        {/* OVERLAPPING PRODUCTS SECTION */}
        <section id="overlapping-products" className="px-4 md:px-16 -mt-6 md:-mt-8 relative z-30 pb-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Borrow Category Card */}
            <div 
              id="product-card-borrow"
              onClick={() => scrollToSection("section-borrow")}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex justify-between gap-4 group hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col gap-3 flex-grow">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full w-fit">
                  Credit Lines
                </span>
                <h3 className="font-bold text-xl text-gray-900">Borrow Smarter</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Personal, Business, and Auto loans with low-interest rates &amp; flexible repayments.
                </p>
                <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-2">
                  Calculate EMI <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Coins className="w-6 h-6" />
              </div>
            </div>

            {/* Invest Category Card */}
            <div 
              id="product-card-invest"
              onClick={() => scrollToSection("section-invest")}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex justify-between gap-4 group hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col gap-3 flex-grow">
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider rounded-full w-fit">
                  Wealth Growth
                </span>
                <h3 className="font-bold text-xl text-gray-900">Invest Wisely</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Direct Mutual Funds, Digital Gold, Fixed Deposits with high returns and SIP trackers.
                </p>
                <span className="text-secondary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-2">
                  Plan Wealth <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex-shrink-0 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            {/* Insure Category Card */}
            <div 
              id="product-card-insure"
              onClick={() => scrollToSection("section-insure")}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex justify-between gap-4 group hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col gap-3 flex-grow">
                <span className="inline-block px-3 py-1 bg-tertiary/10 text-tertiary text-xs font-bold uppercase tracking-wider rounded-full w-fit">
                  Risk Cover
                </span>
                <h3 className="font-bold text-xl text-gray-900">Secure Life</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  High-limit Life, Health, Motor and Travel policies backed by top insurance partners.
                </p>
                <span className="text-tertiary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-2">
                  Get Free Quote <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex-shrink-0 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
            </div>

          </div>
        </section>

        {/* BORROW DETAILED SECTION */}
        <section id="section-borrow" className="py-7 bg-white px-4 md:px-16 border-b border-gray-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Features and Details */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <span className="text-primary font-bold tracking-wider text-xs uppercase bg-primary/10 w-fit px-3 py-1 rounded-full">
                Borrow Smarter, Not Harder
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Unlock Instant Flexible Credit Lines
              </h2>
              
              <p className="text-base text-gray-600">
                Get customizable financing solutions designed to suit your unique circumstances. With Credzofinance, you skip long lines, heavy paperwork, and unexpected fees.
              </p>

              <div className="flex flex-col gap-5 mt-2">
                <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Personal Loans</h4>
                    <p className="text-sm text-gray-600">Collateral-free instant emergency, travel, medical, or marriage loans up to ₹15 Lakhs.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Business Loans</h4>
                    <p className="text-sm text-gray-600">Quick capital to expand operations, stock inventory, or manage cash flows up to ₹1 Crore.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0 text-tertiary">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Auto Loans</h4>
                    <p className="text-sm text-gray-600">Up to 95% on-road funding with flexible low-interest repayment tenure of up to 7 years.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <button 
                  id="eligibility-btn-borrow"
                  onClick={() => setActiveModal("eligibility")}
                  className="font-bold bg-primary text-white px-6 py-3.5 rounded-full hover:bg-primary-container transition-all shadow-md"
                >
                  Check Eligibility
                </button>
                <button 
                  id="apply-btn-borrow"
                  onClick={() => { setActiveModal("apply"); setModalData("loan"); }}
                  className="font-bold border border-gray-200 text-gray-700 px-6 py-3.5 rounded-full hover:bg-gray-50 transition-all"
                >
                  Apply Online
                </button>
              </div>
            </div>

            {/* Right Col: EMI Calculator & Interactive Slider Box */}
            <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm relative">
              <div className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded">
                LIVE CALCULATOR
              </div>
              
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                <span>Loan EMI Calculator</span>
              </h3>

              <div className="flex flex-col gap-6">
                
                {/* Loan Amount */}
                <div id="slider-loan-amount" className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Loan Amount</span>
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="15000000" 
                    step="50000"
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>₹10,000</span>
                    <span>₹1.5 Crores</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div id="slider-interest-rate" className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Interest Rate (p.a.)</span>
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                      {interestRate}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="25" 
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div id="slider-tenure" className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Tenure (Years)</span>
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                      {loanTenure} Years
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    step="1"
                    value={loanTenure} 
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>

                {/* Result Box */}
                <div id="emi-result-box" className="bg-primary/5 p-5 rounded-2xl border border-primary/10 text-center mt-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Estimated Monthly EMI
                  </p>
                  <h3 className="text-3xl font-black text-primary">
                    {formatCurrency(emi)}
                  </h3>
                </div>

                {/* breakdown stats */}
                <div id="emi-breakdown" className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs text-gray-600 font-semibold">
                    <span>Principal Amount:</span>
                    <span>{formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 font-semibold">
                    <span>Interest Amount:</span>
                    <span>{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-primary border-t border-dashed border-gray-200 pt-3">
                    <span>Total Amount Payable:</span>
                    <span>{formatCurrency(totalPayment)}</span>
                  </div>

                  {/* Graphic Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>Principal: {Math.round((loanAmount / totalPayment) * 100)}%</span>
                      <span>Interest: {Math.round((totalInterest / totalPayment) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary" style={{ width: `${(loanAmount / totalPayment) * 100}%` }}></div>
                      <div className="h-full bg-secondary" style={{ width: `${(totalInterest / totalPayment) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                <button 
                  id="calc-apply-btn"
                  onClick={() => setActiveModal("eligibility")} 
                  className="w-full font-bold bg-primary text-white py-4 rounded-xl hover:bg-primary-container transition-all mt-4"
                >
                  Verify Loan Eligibility
                </button>

              </div>
            </div>

          </div>
        </section>

        {/* INVEST DETAILED SECTION */}
        <section id="section-invest" className="py-7 bg-slate-50 px-4 md:px-16 border-b border-gray-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Interactive SIP Calculator Mock */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm order-2 lg:order-1 relative">
              <div className="absolute top-4 right-4 bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded">
                WEALTH GENERATOR
              </div>

              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span>SIP &amp; Wealth Estimator</span>
              </h3>

              <div className="flex flex-col gap-6">
                {/* Monthly Investment */}
                <div id="slider-sip-monthly" className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Monthly Investment</span>
                    <span className="font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full text-sm">
                      {formatCurrency(sipMonthly)}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="100000" 
                    step="500"
                    value={sipMonthly} 
                    onChange={(e) => setSipMonthly(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>₹500</span>
                    <span>₹1 Lakh</span>
                  </div>
                </div>

                {/* Expected Rate of Return */}
                <div id="slider-sip-rate" className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Expected Return Rate (p.a.)</span>
                    <span className="font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full text-sm">
                      {sipRate}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="25" 
                    step="0.5"
                    value={sipRate} 
                    onChange={(e) => setSipRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>

                {/* Duration in Years */}
                <div id="slider-sip-years" className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Time Period (Years)</span>
                    <span className="font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full text-sm">
                      {sipYears} Years
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    step="1"
                    value={sipYears} 
                    onChange={(e) => setSipYears(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>

                {/* Portfolio Wealth Output */}
                <div id="sip-growth-display" className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 text-center">
                    <span className="text-[11px] text-gray-400 uppercase font-bold">Total Invested</span>
                    <p className="text-base font-bold text-gray-700 mt-1">{formatCurrency(sipInvested)}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-center">
                    <span className="text-[11px] text-emerald-600 uppercase font-bold">Est. Wealth Gain</span>
                    <p className="text-base font-bold text-emerald-600 mt-1">+{formatCurrency(sipEstReturns)}</p>
                  </div>
                </div>

                {/* Final Total Asset Value */}
                <div id="sip-total-box" className="bg-secondary/5 p-4 rounded-2xl border border-secondary/10 text-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                    Estimated Total Wealth Value
                  </p>
                  <h3 className="text-3xl font-black text-secondary">
                    {formatCurrency(sipTotalValue)}
                  </h3>
                </div>

                {/* Pro Tip Message based on value */}
                <div className="bg-secondary-fixed/30 p-3 rounded-lg border border-secondary-fixed text-xs text-secondary-container font-medium text-center">
                  💡 In {sipYears} years, your money multiplied by {(sipTotalValue / (sipInvested || 1)).toFixed(1)}x through compound interest!
                </div>
              </div>
            </div>

            {/* Right Col: Details */}
            <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
              <span className="text-secondary font-bold tracking-wider text-xs uppercase bg-secondary/10 w-fit px-3 py-1 rounded-full">
                Grow Your Wealth on Autopilot
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Unlock Smart, Compounded Investments
              </h2>

              <p className="text-base text-gray-600">
                Take control of your financial destiny. Whether you are creating a rainy day emergency buffer or planning a long-term retirement, our wealth builders streamline the process completely.
              </p>

              <div className="flex flex-col gap-5 mt-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Digital Gold</h4>
                    <p className="text-sm text-gray-600">Buy 24K 99.9% pure physical gold online starting from just ₹10. Safely held in secure vaults.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Direct Mutual Funds</h4>
                    <p className="text-sm text-gray-600">Get 1.5% higher returns with zero distributor commissions. Auto-invest monthly via UPI SIPs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">High-Yield Fixed Deposits</h4>
                    <p className="text-sm text-gray-600">Secure returns up to 9.1% p.a. with DICGC-insured NBFC &amp; Bank partners.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <button 
                  id="invest-start-btn"
                  onClick={() => { setActiveModal("apply"); setModalData("invest"); }}
                  className="font-bold bg-secondary text-white px-8 py-3.5 rounded-full hover:bg-secondary-container transition-all shadow-md"
                >
                  Start Investing Now
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* INSURE DETAILED SECTION */}
        <section id="section-insure" className="py-7 bg-white px-4 md:px-16 border-b border-gray-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Details */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <span className="text-tertiary font-bold tracking-wider text-xs uppercase bg-tertiary/10 w-fit px-3 py-1 rounded-full">
                Protection for What Matters Most
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                100% Paperless Digital Insurance Cover
              </h2>

              <p className="text-base text-gray-600">
                Life can be unpredictable. Protect your loved ones, your health, and your valuable assets instantly with fully compliant policies. 
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div 
                  onClick={() => setInsType("life")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${insType === "life" ? "border-tertiary bg-tertiary/5 text-tertiary" : "border-gray-100 bg-slate-50 text-gray-700 hover:bg-slate-100"}`}
                >
                  <Heart className="w-6 h-6 text-tertiary" />
                  <div>
                    <h5 className="font-bold">Life Shield</h5>
                    <p className="text-xs text-gray-500 mt-1">Cover up to ₹2 Crores starting at just ₹450/mo</p>
                  </div>
                </div>

                <div 
                  onClick={() => setInsType("health")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${insType === "health" ? "border-tertiary bg-tertiary/5 text-tertiary" : "border-gray-100 bg-slate-50 text-gray-700 hover:bg-slate-100"}`}
                >
                  <Activity className="w-6 h-6 text-tertiary" />
                  <div>
                    <h5 className="font-bold">Health Care</h5>
                    <p className="text-xs text-gray-500 mt-1">Cashless hospital stays across 10,000+ medical hubs</p>
                  </div>
                </div>

                <div 
                  onClick={() => setInsType("motor")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${insType === "motor" ? "border-tertiary bg-tertiary/5 text-tertiary" : "border-gray-100 bg-slate-50 text-gray-700 hover:bg-slate-100"}`}
                >
                  <Car className="w-6 h-6 text-tertiary" />
                  <div>
                    <h5 className="font-bold">Motor &amp; Car</h5>
                    <p className="text-xs text-gray-500 mt-1">Instant claim settlement with absolute roadside assistance</p>
                  </div>
                </div>

                <div 
                  onClick={() => setInsType("travel")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${insType === "travel" ? "border-tertiary bg-tertiary/5 text-tertiary" : "border-gray-100 bg-slate-50 text-gray-700 hover:bg-slate-100"}`}
                >
                  <BookOpen className="w-6 h-6 text-tertiary" />
                  <div>
                    <h5 className="font-bold">Global Travel</h5>
                    <p className="text-xs text-gray-500 mt-1">Coverage for medical emergencies &amp; delayed baggage abroad</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <button 
                  id="quote-get-btn"
                  onClick={() => { setActiveModal("apply"); setModalData("insure"); }}
                  className="font-bold bg-tertiary text-white px-8 py-3.5 rounded-full hover:bg-tertiary-container transition-all shadow-md"
                >
                  Get Covered Now
                </button>
              </div>
            </div>

            {/* Right Col: Interactive Premium Selector */}
            <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm relative">
              <div className="absolute top-4 right-4 bg-tertiary/10 text-tertiary text-[10px] font-bold px-2 py-1 rounded">
                PREMIUM CALCULATOR
              </div>

              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-tertiary" />
                <span>Instant Insurance Quote</span>
              </h3>

              <div className="flex flex-col gap-6">
                
                {/* Policy Type Tab indicator */}
                <div className="bg-gray-200/50 p-1 rounded-xl flex gap-1">
                  {(["life", "health", "motor", "travel"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setInsType(type);
                        if (type === "health") setInsCover(1000000); // 10 Lakh
                        else if (type === "motor") setInsCover(800000); // Car value
                        else if (type === "travel") setInsCover(2000000);
                        else setInsCover(5000000); // Life cover
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${insType === type ? "bg-white text-tertiary shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Age selector */}
                <div id="slider-ins-age" className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Your Current Age</span>
                    <span className="font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full text-sm">
                      {insAge} Years Old
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="18" 
                    max="65" 
                    step="1"
                    value={insAge} 
                    onChange={(e) => setInsAge(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tertiary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>18 Years</span>
                    <span>65 Years</span>
                  </div>
                </div>

                {/* Cover amount selector */}
                <div id="slider-ins-cover" className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Sum Assured / Coverage Cover</span>
                    <span className="font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full text-sm">
                      {formatCurrency(insCover)}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={insType === "health" ? "100000" : "200000"} 
                    max={insType === "life" ? "20000000" : insType === "health" ? "5000000" : "3000000"} 
                    step={insType === "health" ? "50000" : "100000"}
                    value={insCover} 
                    onChange={(e) => setInsCover(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tertiary"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>{formatCurrency(insType === "health" ? 100000 : 200000)}</span>
                    <span>{formatCurrency(insType === "life" ? 20000000 : insType === "health" ? 5000000 : 3000000)}</span>
                  </div>
                </div>

                {/* Premium quote Result Box */}
                <div id="premium-result-box" className="bg-tertiary/5 p-5 rounded-2xl border border-tertiary/10 text-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Estimated Premium Contribution
                  </p>
                  <h3 className="text-3xl font-black text-tertiary">
                    {formatCurrency(insPremium)}<span className="text-xs font-semibold text-gray-400"> / month</span>
                  </h3>
                </div>

                {/* Benefits breakdown */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Includes complete cover with cashless claim benefit network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>DICGC and IRDAI certified partner coverage structures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Flexible premium waivers in case of emergency situations</span>
                  </div>
                </div>

                <button 
                  id="buy-policy-btn"
                  onClick={() => { setActiveModal("apply"); setModalData("insure"); }}
                  className="w-full font-bold bg-tertiary text-white py-4 rounded-xl hover:bg-tertiary-container transition-all mt-2"
                >
                  Buy Instantly
                </button>

              </div>
            </div>

          </div>
        </section>

        {/* ABOUT & NBFC COMPLIANCE SECTION */}
        <section id="section-about" className="py-7 bg-slate-50 px-4 md:px-16 border-b border-gray-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto flex flex-col gap-12">
            
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
              <span className="text-primary font-bold tracking-wider text-xs uppercase bg-primary/10 w-fit px-3 py-1 rounded-full mx-auto">
                Trust &amp; Transparency First
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                RBI Regulated Financial Operations
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Credzofinance operates as a co-branded financial platform partnering with RBI-registered NBFCs and premier insurance providers to deliver authorized, secure services across India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs text-center flex flex-col gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg text-gray-900">RBI Licensed Partners</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Our credit products are backed exclusively by RBI-regulated co-lending NBFCs, guaranteeing strict adherence to the Fair Practice Code.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs text-center flex flex-col gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg text-gray-900">Enterprise Security</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Your details are protected using industry-standard 256-bit SSL encryption. We never sell your personal financial records to third parties.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs text-center flex flex-col gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <Award className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg text-gray-900">Grievance Redressal</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Clear, timely support resolutions under our official Grievance Officer guidelines to address any consumer issues.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="section-faqs" className="py-7 bg-white px-4 md:px-16 scroll-mt-20">
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            <div className="text-center flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-gray-500">
                Got questions about our services? We have got the answers.
              </p>
            </div>

            <div className="space-y-4">
              
              <div className="p-6 rounded-2xl border border-gray-100 bg-slate-50">
                <h4 className="font-bold text-base text-gray-900 mb-2">Is Credzofinance an RBI registered NBFC?</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Credzofinance is a digital personal finance application platform. All loans and credit lines are issued directly by our partner RBI-registered Non-Banking Financial Companies (NBFCs) and Banks.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-slate-50">
                <h4 className="font-bold text-base text-gray-900 mb-2">How long does it take for a loan to be disbursed?</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  For eligible users who have completed their digital e-KYC and signed the NACH mandate, loan approval and bank account disbursement take as little as 10 to 30 minutes.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-slate-50">
                <h4 className="font-bold text-base text-gray-900 mb-2">Are there any hidden processing charges?</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We believe in 100% transparency. Any processing fees or stamp duties are explicitly highlighted on your mobile loan agreement before you sign.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-slate-50">
                <h4 className="font-bold text-base text-gray-900 mb-2">Can I withdraw Digital Gold as physical gold?</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Yes, you can request physical gold delivery of your accumulated balance (starting from 0.5g) to your home address across India, packed in secure tamper-proof packaging.
                </p>
              </div>

            </div>

          </div>
        </section>

      </main>

      <footer className="bg-primary text-surface-container-lowest w-full pt-6 pb-3">
        <div className="w-full px-4 md:px-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 max-w-[1280px] mx-auto py-4 border-b border-white/10">
          
          <div className="flex flex-col gap-4 col-span-1 md:col-span-1 md:mr-auto md:pr-12">
            <CredzoLogo variant="white" size="md" />
            <div className="flex flex-col gap-2 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/60" />
                <a href="tel:+917377857707" className="hover:text-white transition-colors">+91 73778 57707</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/60" />
                <a href="mailto:contact@credzofinance.com" className="hover:text-white transition-colors">contact@credzofinance.com</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:text-left w-[150px]">
            <h4 className="font-bold text-lg text-white mb-2 w-[152px]">Borrow</h4>
            <a onClick={() => { scrollToSection("section-borrow"); setLoanAmount(300000); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Personal Loan</a>
            <a onClick={() => { scrollToSection("section-borrow"); setLoanAmount(2000000); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Business Loan</a>
            <a onClick={() => { scrollToSection("section-borrow"); setLoanAmount(800000); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Auto Loan</a>
            <a onClick={() => { scrollToSection("section-borrow"); setLoanAmount(150000); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Education Loan</a>
          </div>

          <div className="flex flex-col gap-3 md:text-left w-[150px]">
            <h4 className="font-bold text-lg text-white mb-2 w-[150px]">Invest</h4>
            <a onClick={() => { scrollToSection("section-invest"); setSipMonthly(1000); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Digital Gold</a>
            <a onClick={() => { scrollToSection("section-invest"); setSipMonthly(10000); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Mutual Funds</a>
            <a onClick={() => { scrollToSection("section-invest"); setSipMonthly(25000); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Fixed Deposits</a>
            <a onClick={() => { scrollToSection("section-invest"); setSipMonthly(5000); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">SIP</a>
          </div>

          <div className="flex flex-col gap-3 md:text-left w-[150px]">
            <h4 className="font-bold text-lg text-white mb-2 w-[151px]">Insure</h4>
            <a onClick={() => { scrollToSection("section-insure"); setInsType("life"); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Life Insurance</a>
            <a onClick={() => { scrollToSection("section-insure"); setInsType("health"); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Health Insurance</a>
            <a onClick={() => { scrollToSection("section-insure"); setInsType("motor"); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Motor Insurance</a>
            <a onClick={() => { scrollToSection("section-insure"); setInsType("travel"); }} className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Travel Insurance</a>
          </div>

          <div className="flex flex-col gap-6 md:text-left w-[150px]">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-lg text-white mb-2 w-[150px]">Legal</h4>
              <a className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Privacy Policy</a>
              <a className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Terms of Service</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-lg text-white mb-2">Compliance</h4>
              <a className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Fair Practice Code</a>
              <a className="text-sm text-surface-variant opacity-80 hover:opacity-100 hover:text-white transition-all underline-offset-4 hover:underline cursor-pointer">Grievance Redressal</a>
            </div>
          </div>

        </div>

        <div className="w-full max-w-[1000px] mx-auto px-6 py-5 flex flex-col items-center justify-center gap-2.5 text-xs text-white/60 bg-white/5 border border-white/10 rounded-2xl mt-8 text-center">
          <p className="font-medium text-white/80">© 2026 Credzofinance. All Rights Reserved.</p>
          <p className="opacity-90">Bhubaneswar, Odisha, India</p>
          <p className="opacity-75">Corporate Identification Number: U64990OD2026PTC053970</p>
        </div>
      </footer>

      {/* DYNAMIC MODALS SECTION */}
      {activeModal !== "none" && (
        <div id="auth-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div id="modal-container" className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300">
            
            {/* Close Button */}
            <button 
              id="close-modal-btn"
              onClick={() => { setActiveModal("none"); setEligibilityResult(null); }} 
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Contents based on type */}

            {/* LOGIN MODAL */}
            {activeModal === "login" && (
              <div className="p-8">
                <div className="text-center mb-6">
                  <CredzoLogo size="md" className="mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">Sign in to Credzo</h3>
                  <p className="text-xs text-gray-500 mt-1">Access your secure borrowing &amp; credit dashboard</p>
                </div>

                {authSuccessMsg ? (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-semibold text-sm animate-pulse">
                    {authSuccessMsg}
                  </div>
                ) : (
                  <form onSubmit={(e) => handleAuthSubmit(e, "login")} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">PASSWORD</label>
                      <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-container transition-all shadow-md mt-2"
                    >
                      Login securely
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                      Don't have an account? <span onClick={() => setActiveModal("signup")} className="text-primary font-bold cursor-pointer hover:underline">Create one</span>
                    </p>
                  </form>
                )}
              </div>
            )}

            {/* SIGNUP MODAL */}
            {activeModal === "signup" && (
              <div className="p-8">
                <div className="text-center mb-6">
                  <CredzoLogo size="md" className="mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">Create Free Account</h3>
                  <p className="text-xs text-gray-500 mt-1">Get pre-approved in under 2 minutes</p>
                </div>

                {authSuccessMsg ? (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-semibold text-sm animate-pulse">
                    {authSuccessMsg}
                  </div>
                ) : (
                  <form onSubmit={(e) => handleAuthSubmit(e, "signup")} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">FULL NAME</label>
                      <input 
                        type="text" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">SECURE PASSWORD</label>
                      <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <input type="checkbox" required id="agree-terms" className="rounded text-primary border-gray-300" />
                      <label htmlFor="agree-terms" className="text-[11px] text-gray-500">I agree to NBFC consent policy guidelines &amp; Fair practices.</label>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-container transition-all shadow-md mt-1"
                    >
                      Complete registration
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4">
                      Already registered? <span onClick={() => setActiveModal("login")} className="text-primary font-bold cursor-pointer hover:underline">Log In</span>
                    </p>
                  </form>
                )}
              </div>
            )}

            {/* LOAN ELIGIBILITY DETAILED MODAL */}
            {activeModal === "eligibility" && (
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    <Percent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">NBFC Eligibility Estimator</h3>
                  <p className="text-xs text-gray-500 mt-1">Get an instant pre-approval credit score verdict</p>
                </div>

                {!eligibilityResult ? (
                  <form onSubmit={checkEligibility} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">MONTHLY SALARY / INCOME (NET INFLOW)</label>
                      <input 
                        type="number" 
                        required 
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        placeholder="₹50,000" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">TOTAL OUTSTANDING MONTHLY EMIs (IF ANY)</label>
                      <input 
                        type="number" 
                        value={existingEmi}
                        onChange={(e) => setExistingEmi(e.target.value)}
                        placeholder="₹0" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-container transition-all shadow-md mt-2"
                    >
                      Run Instant Eligibility Assessment
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-4 rounded-2xl bg-slate-50 border border-gray-100">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Verdict Status</span>
                      <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-black mt-2 uppercase tracking-widest ${
                        eligibilityResult.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                        eligibilityResult.status === "Review" ? "bg-amber-100 text-amber-800" :
                        "bg-rose-100 text-rose-800"
                      }`}>
                        {eligibilityResult.status}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed text-center">
                      {eligibilityResult.message}
                    </p>

                    {eligibilityResult.status !== "Ineligible" && (
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Max safe monthly EMI cap:</span>
                          <span>{formatCurrency(eligibilityResult.maxEmiAllowed)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-primary">
                          <span>Maximum suggested loan limit:</span>
                          <span>{formatCurrency(eligibilityResult.estimatedMaxLoan)}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button 
                        onClick={() => { setEligibilityResult(null); }}
                        className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all"
                      >
                        Recalculate
                      </button>
                      {eligibilityResult.status !== "Ineligible" && (
                        <button 
                          onClick={() => { setActiveModal("signup"); setEligibilityResult(null); }}
                          className="flex-1 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-container transition-all shadow-md"
                        >
                          Proceed to KYC
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACTION / APPLICATION COMPLETED */}
            {activeModal === "apply" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Initiated</h3>
                
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {modalData === "loan" && `Your instant ${formatCurrency(loanAmount)} credit request with NBFC partner registration is processed.`}
                  {modalData === "invest" && `Your monthly mutual fund/SIP mandate of ${formatCurrency(sipMonthly)} is initiated successfully.`}
                  {modalData === "insure" && `Your paperless premium contribution for ${insType.toUpperCase()} insurance cover has been setup.`}
                  Our agents will reach out within 15 minutes to confirm digital signature verification.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl text-left text-xs text-gray-500 mb-6 space-y-1">
                  <p><strong>Tracking ID:</strong> CZ-{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p><strong>Status:</strong> Awaiting Digital e-KYC Sign</p>
                  <p><strong>Assigned Partner:</strong> RBI Regulated NBFC Co-Lender</p>
                </div>

                <button 
                  onClick={() => setActiveModal("none")}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-container transition-all shadow-md"
                >
                  Dismiss Overview
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
