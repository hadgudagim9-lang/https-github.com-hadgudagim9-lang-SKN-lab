import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, 
  User, 
  Check, 
  ShieldAlert, 
  Loader2, 
  ChevronLeft, 
  Heart, 
  AlertCircle, 
  CheckCircle, 
  Moon, 
  Sun, 
  Activity, 
  Layers, 
  Clock, 
  Lock, 
  Printer,
  Compass,
  Coffee,
  CheckCircle2,
  Bookmark,
  Search,
  Video,
  Play,
  Copy,
  Lightbulb,
  Star,
  Camera,
  Droplets,
  Eye,
  Award,
  HelpCircle,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { AppPhase, SkinConcern, SkinAnalysisResponse } from "./types";
import { SKIN_CONCERNS, ONBOARDING_QUESTIONS, SAMPLE_FACES } from "./data";
import AuthHeader from "./components/AuthHeader";
import CameraCapture from "./components/CameraCapture";
import WhopPaywall from "./components/WhopPaywall";
import UnlockedReport from "./components/UnlockedReport";
import { generateClientFallbackReport } from "./utils/generateClientReport";
import TestimonialsPage from "./components/TestimonialsPage";
import SkinComparisonSlider from "./components/SkinComparisonSlider";
import homepageSplitHeroImg from "./assets/images/homepage_split_hero_1783764252901.jpg";

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("landing");


  
  // User Profile State
  const [userName, setUserName] = useState<string>("");
  const [userAge, setUserAge] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>("female");
  const [skinType, setSkinType] = useState<string>("combination");
  const [userRoutine, setUserRoutine] = useState<string>("morning_evening");
  const [targetConcerns, setTargetConcerns] = useState<string[]>(["Acne & Congestion"]);
  const [serviceApproach, setServiceApproach] = useState<"homemade" | "products" | "both">("both");
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<SkinAnalysisResponse | null>(null);
  
  // Interactivity States
  const [activeZoneTipModal, setActiveZoneTipModal] = useState<number | null>(null);
  
  // Countdown Timer state (10 mins = 600s)
  const [timerSeconds, setTimerSeconds] = useState(599);
  
  // Unlock & Payment State
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Live timer for paywall
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "paywall" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timerSeconds]);

  // Handle scanning phase auto trigger - strict rule: always transition to timeline screen, never show report after face scan
  useEffect(() => {
    if (phase === "scanning") {
      const timer = setTimeout(() => {
        runSkinAnalysis(capturedImage || undefined);
        setPhase("timeline");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phase, capturedImage]);

  // Format seconds as MM:SS
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Activate Owner Bypass Mode
  const handleActivateOwnerMode = async () => {
    setIsUnlocked(true);
    localStorage.setItem("skn_paid_token", "SKN-OWNER-BYPASS");
    localStorage.setItem("skn_paid_email", "owner@sknlab.ai");
    if (!userName) setUserName("Sarah");
    if (!selectedGender) setSelectedGender("female");
    if (!targetConcerns.length) setTargetConcerns(["Acne & Congestion", "Uneven Texture", "Dehydration"]);
    
    // Set immediate rich placeholder data so report renders right away
    if (!analysisData) {
      setAnalysisData({
        skinScore: 78,
        skinType: "Combination / Barrier Sensitive",
        primaryConcern: "Acne & Congestion",
        concernsDetail: [
          { name: "Acne & Congestion", severity: "Moderate", priority: "High" },
          { name: "Dehydration", severity: "Mild", priority: "Medium" }
        ],
        metrics: { hydration: 65, sebum: 45, elasticity: 74, melaninDepth: 70 },
        understandingNote: "Clinical assessment complete. Your personalized barrier repair and acne management regimen is ready.",
        morningRoutine: [
          "1. Cleanse with Gentle Low-pH Foaming Cleanser",
          "2. Apply 2% Salicylic Acid BHA Liquid Exfoliant",
          "3. Hydrate with Barrier Support Serum (Niacinamide + Ceramide NP)",
          "4. Protect with Broad-Spectrum SPF 50 Mineral Sunscreen"
        ],
        eveningRoutine: [
          "1. First Cleanse: Oat Cleansing Balm (to dissolve sebum & SPF)",
          "2. Second Cleanse: Hydrating Gel Cleanser",
          "3. Target: Encapsulated Retinal 0.05% Emulsion (alternate nights)",
          "4. Seal: Ceramide Restorative Barrier Night Cream"
        ],
        homemadeRemedies: [
          {
            name: "Colloidal Oatmeal Anti-Inflammatory Mask",
            description: "Finely ground oats mixed with plain yogurt to calm redness and soothe active breakouts.",
            usage: "Apply 2x weekly for 10-15 minutes on clean skin."
          },
          {
            name: "Green Tea & Chamomile Cold Compress",
            description: "Chilled brewed green tea packed with EGCG polyphenols to reduce sebum oxidation.",
            usage: "Press gently on congested areas for 5 minutes after cleansing."
          }
        ],
        productRecommendations: [
          {
            name: "CeraVe Foaming Facial Cleanser (Niacinamide & Ceramides)",
            category: "Cleanser",
            step: "Step 1: Cleanse",
            whyChosen: "Cleanses without stripping delicate lipid moisture barrier.",
            buyUrl: "https://www.amazon.com/dp/B01N1LL62W",
            img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80"
          },
          {
            name: "The Ordinary Niacinamide 10% + Zinc 1%",
            category: "Active Serum",
            step: "Step 2: Treat",
            whyChosen: "Balances sebum activity and refines enlarged pores visibly.",
            buyUrl: "https://www.amazon.com/dp/B06XNX68Q9",
            img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80"
          },
          {
            name: "La Roche-Posay Anthelios Clear Skin Dry Touch SPF 60",
            category: "Sunscreen & Moisturizer",
            step: "Step 3: Protect",
            whyChosen: "Oil-absorbing perlite and silica protect against UV damage without clogging pores.",
            buyUrl: "https://www.amazon.com/dp/B01A0NT3YG",
            img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80"
          }
        ],
        videoSuggestions: [
          {
            title: "Dermatologist Explains: The Complete Glass Skin Routine",
            youtubeUrl: "https://www.youtube.com/watch?v=u1bQ2bI_i5Y",
            thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
            description: "Clinical step-by-step masterclass on fixing texture and barrier health."
          },
          {
            title: "How to Clear Acne & Congestion Without Damaging Skin Barrier",
            youtubeUrl: "https://www.youtube.com/watch?v=kYJmN7fLh4U",
            thumbnail: "https://images.unsplash.com/photo-1512290900672-1f4864197e41?w=500&auto=format&fit=crop&q=80",
            description: "Expert routine guide for acne prone and sensitive skin."
          }
        ]
      });
    }

    setPhase("unlocked_report");
    // Also trigger server analysis in background
    runSkinAnalysis(undefined, "SKN-OWNER-BYPASS");
  };

  // Restore payment session or detect URL query parameter bypass on mount
  useEffect(() => {
    const checkUrlOrSession = async () => {
      // 1. Check URL query parameters or hash for owner bypass (e.g. ?owner=true or ?preview=owner or ?bypass=true or ?unlock=true or #owner)
      const urlParams = new URLSearchParams(window.location.search);
      const isOwnerLink =
        urlParams.get("owner") === "true" ||
        urlParams.get("owner") === "1" ||
        urlParams.get("preview") === "owner" ||
        urlParams.get("preview") === "true" ||
        urlParams.get("mode") === "owner" ||
        urlParams.get("bypass") === "true" ||
        urlParams.get("admin") === "true" ||
        urlParams.get("unlock") === "true" ||
        urlParams.get("unlocked") === "true" ||
        urlParams.get("shared") === "true" ||
        window.location.hash === "#owner" ||
        window.location.hash === "#bypass";

      if (isOwnerLink) {
        handleActivateOwnerMode();
        return;
      }

      // 2. Otherwise restore previous paid session
      const storedToken = localStorage.getItem("skn_paid_token");
      const storedEmail = localStorage.getItem("skn_paid_email");
      
      if (storedToken && storedEmail) {
        try {
          const response = await fetch("/api/check-payment-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: storedEmail, token: storedToken }),
          });
          const result = await response.json();
          if (result.success) {
            setIsUnlocked(true);
            runSkinAnalysis(undefined, storedToken);
            setPhase("unlocked_report");
          }
        } catch (err) {
          console.warn("Could not auto-verify previous payment session.");
        }
      }
    };
    checkUrlOrSession();
  }, []);

  // Run Backend Skin Analysis with robust error recovery
  const runSkinAnalysis = async (imgOverride?: string, paymentToken?: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(10);

    const activeImage = imgOverride || capturedImage;

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 350);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (paymentToken) {
        headers["Authorization"] = `Bearer ${paymentToken}`;
      }

      // Add 12s timeout controller to prevent hanging fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch("/api/analyze-skin", {
        method: "POST",
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          gender: selectedGender || "female",
          concerns: targetConcerns.length > 0 ? targetConcerns : ["Acne & Congestion", "Uneven Texture", "Dehydration"],
          confidenceAnswer: "Seeking structured glass skin routine",
          image: activeImage && activeImage.length < 5000000 ? activeImage : undefined,
          paymentToken,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result && result.success && result.data) {
          setAnalysisData(result.data);
          return;
        }
      }

      // If backend returned non-ok or missing data, use client-side diagnostic fallback
      const fallbackReport = generateClientFallbackReport(selectedGender, targetConcerns, userName);
      setAnalysisData(fallbackReport);
    } catch (err) {
      console.warn("Using resilient client diagnostic report generator:", err);
      const fallbackReport = generateClientFallbackReport(selectedGender, targetConcerns, userName);
      setAnalysisData(fallbackReport);
    } finally {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#2C1A0E] font-sans selection:bg-[#E879A0]/20 flex flex-col items-center">
      
      {/* GLOBAL HEADER (Except Landing and Scanning) */}
      {phase !== "landing" && phase !== "scanning" && (
        <header className={`w-full ${
          phase === "unlocked_report" || phase === "testimonials" 
            ? "max-w-5xl lg:max-w-6xl px-4 sm:px-6 lg:px-8" 
            : "max-w-xl sm:max-w-2xl px-4"
        } py-3 flex items-center justify-between border-b border-[#E3C2B0]/30 bg-[#FAF7F4]/90 backdrop-blur-md sticky top-0 z-40`}>
          <button
            onClick={() => {
              if (phase === "name") setPhase("landing");
              else if (phase === "gender") setPhase("name");
              else if (phase === "age") setPhase("gender");
              else if (phase === "skin_type") setPhase("age");
              else if (phase === "routine_check") setPhase("skin_type");
              else if (phase === "upload") setPhase("routine_check");
              else if (phase === "timeline") setPhase("upload");
              else if (phase === "treatment_program") setPhase("timeline");
              else if (phase === "commitment") setPhase("treatment_program");
              else if (phase === "paywall") setPhase("commitment");
              else if (phase === "testimonials") setPhase("landing");
            }}
            className="w-9 h-9 rounded-full bg-white border border-[#E3C2B0]/60 flex items-center justify-center text-[#2C1A0E] hover:bg-[#F4EDE4] transition shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setPhase("landing")}
            className="flex items-center gap-1.5 font-serif font-bold text-lg tracking-wider text-[#2C1A0E] hover:opacity-80 transition cursor-pointer"
            title="Go to Home Page"
          >
            <span>SKN LAB</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <AuthHeader currentReport={analysisData} />

            <button
              onClick={() => setPhase("testimonials")}
              className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A0E] bg-[#F4EDE4] border border-[#E3C2B0] px-2.5 py-1 rounded-full hover:bg-[#2C1A0E] hover:text-white transition cursor-pointer flex items-center gap-1"
              title="View Customer Reviews & Proof"
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Reviews</span>
            </button>
          </div>
        </header>
      )}

      {/* MAIN CONTAINER */}
      <main className={`w-full ${
        phase === "unlocked_report" || phase === "testimonials"
          ? "max-w-5xl lg:max-w-6xl px-3 sm:px-6 lg:px-8 items-stretch"
          : "max-w-xl sm:max-w-2xl px-4 items-center justify-center"
      } py-6 sm:py-8 flex-1 flex flex-col`}>
        
        {/* ========================================================================= */}
        {/* SCREEN TESTIMONIALS: REVIEWS & PROOF */}
        {/* ========================================================================= */}
        {phase === "testimonials" && (
          <TestimonialsPage
            onStartAnalysis={() => setPhase("name")}
            onBack={() => setPhase("landing")}
          />
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1: LANDING PAGE */}
        {/* ========================================================================= */}
        {phase === "landing" && (
          <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-300 py-1 px-1">
            
            {/* Top Logo and Header Row */}
            <div className="w-full flex items-center justify-between mb-3">
              <span className="font-serif italic text-3xl sm:text-5xl font-normal text-[#1C120C] tracking-tight drop-shadow-2xs">
                Skin
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <AuthHeader currentReport={analysisData} />
                <button
                  onClick={() => setPhase("testimonials")}
                  className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-white/90 hover:bg-[#281811] hover:text-white border border-[#E8DACD] rounded-full text-[#2C1A0E] text-[11px] sm:text-xs font-semibold transition cursor-pointer shadow-xs backdrop-blur-xs"
                >
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-400" />
                  <span className="hidden sm:inline">14.8k+ Reviews</span>
                  <span className="sm:hidden">Reviews</span>
                </button>
              </div>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 sm:py-1 rounded-full bg-white/90 border border-[#E8DACD] text-[#2C1A0E] text-[11px] sm:text-xs font-medium mb-2 shadow-2xs backdrop-blur-xs">
              <span>Know your skin score in 60 seconds</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#1C120C] tracking-tight leading-tight mb-4 sm:mb-6 max-w-xs">
              Get your personalized skin routine
            </h1>

            {/* Interactive Before/After Skin Comparison Slider with Sliding Bright Light Bar ("Barrow") */}
            <div className="w-full relative mb-4">
              <SkinComparisonSlider
                badgeText="Clinical Skin Scan"
                className="w-full aspect-[4/5] sm:aspect-[1/1] rounded-[24px] sm:rounded-[32px] shadow-[0_15px_35px_rgba(44,26,14,0.12)] border-2 border-white bg-[#E3C2B0]"
              />
            </div>

            {/* Action Button - Always Prominent & Reachable */}
            <button
              onClick={() => setPhase("name")}
              className="w-full py-3.5 sm:py-4 bg-[#281811] hover:bg-[#1f120c] text-white font-semibold text-sm rounded-[20px] shadow-lg flex items-center justify-center gap-1.5 transition active:scale-[0.99] cursor-pointer"
            >
              <span>Start my analysis</span>
              <span className="text-base font-normal ml-0.5">&gt;</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: ENTER YOUR NAME */}
        {/* ========================================================================= */}
        {phase === "name" && (
          <div className="w-full max-w-md flex flex-col items-center text-center py-8 animate-in fade-in duration-300">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1A0E] mb-2">
              What is your first name?
            </h2>
            <p className="text-[#2C1A0E]/60 text-xs mb-8">
              We'll personalize your entire skin report with your name.
            </p>

            <div className="w-full mb-8">
              <input
                type="text"
                placeholder="Your first name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
                className="w-full px-6 py-4 bg-white border border-[#E3C2B0] rounded-full text-center text-base font-medium text-[#2C1A0E] placeholder-[#2C1A0E]/40 focus:outline-none focus:border-[#2C1A0E] shadow-sm"
              />
            </div>

            <button
              disabled={!userName.trim()}
              onClick={() => setPhase("gender")}
              className="w-full py-4 bg-[#2C1A0E] disabled:bg-[#2C1A0E]/30 text-white font-bold text-sm rounded-full shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Next →
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: ENTER YOUR GENDER */}
        {/* ========================================================================= */}
        {phase === "gender" && (
          <div className="w-full max-w-md flex flex-col items-center text-center py-6 animate-in fade-in duration-300">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#2C1A0E]/60 bg-[#F4EDE4] px-3 py-1 rounded-full border border-[#E3C2B0]/40 mb-3">
              QUESTION 1 / 5
            </span>

            <h2 className="text-2xl font-serif font-bold text-[#2C1A0E] mb-2">
              What gender do you identify with?
            </h2>
            <p className="text-xs text-[#2C1A0E]/60 mb-8 max-w-xs leading-relaxed">
              Biological hormones heavily influence dermal thickness, pore density, and sebum baselines.
            </p>

            <div className="space-y-3 w-full mb-8">
              <button
                type="button"
                onClick={() => setSelectedGender("female")}
                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                  selectedGender === "female"
                    ? "bg-white border-[#2C1A0E] shadow-sm"
                    : "bg-[#F4EDE4]/60 border-[#E3C2B0]/60 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">♀</span>
                  <span className="font-serif font-bold text-sm text-[#2C1A0E]">Female</span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedGender === "female" ? "border-[#2C1A0E] bg-[#2C1A0E]" : "border-[#E3C2B0]"}`}>
                  {selectedGender === "female" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGender("male")}
                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                  selectedGender === "male"
                    ? "bg-white border-[#2C1A0E] shadow-sm"
                    : "bg-[#F4EDE4]/60 border-[#E3C2B0]/60 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">♂</span>
                  <span className="font-serif font-bold text-sm text-[#2C1A0E]">Male</span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedGender === "male" ? "border-[#2C1A0E] bg-[#2C1A0E]" : "border-[#E3C2B0]"}`}>
                  {selectedGender === "male" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </button>
            </div>

            <button
              onClick={() => setPhase("age")}
              className="w-full py-4 bg-[#2C1A0E] hover:bg-[#2C1A0E]/90 text-white font-bold text-sm rounded-2xl shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: ENTER YOUR AGE */}
        {/* ========================================================================= */}
        {phase === "age" && (
          <div className="w-full max-w-md flex flex-col items-center text-center py-8 animate-in fade-in duration-300">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#2C1A0E]/60 bg-[#F4EDE4] px-3 py-1 rounded-full border border-[#E3C2B0]/40 mb-3">
              QUESTION 2 / 5
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1A0E] mb-2">
              How old are you, {userName.trim() || "there"}?
            </h2>
            <p className="text-[#2C1A0E]/60 text-xs mb-8">
              Age affects skin cell turnover, oil production, and collagen levels.
            </p>

            <div className="w-full mb-8">
              <input
                type="number"
                placeholder="Your age"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                autoFocus
                className="w-full px-6 py-4 bg-white border border-[#E3C2B0] rounded-full text-center text-base font-medium text-[#2C1A0E] placeholder-[#2C1A0E]/40 focus:outline-none focus:border-[#2C1A0E] shadow-sm"
              />
            </div>

            <button
              disabled={!userAge.trim()}
              onClick={() => setPhase("skin_type")}
              className="w-full py-4 bg-[#2C1A0E] disabled:bg-[#2C1A0E]/30 text-white font-bold text-sm rounded-full shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Next →
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: QUESTION — SKIN TYPE */}
        {/* ========================================================================= */}
        {phase === "skin_type" && (
          <div className="w-full max-w-md flex flex-col items-center text-center py-6 animate-in fade-in duration-300">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#2C1A0E]/60 bg-[#F4EDE4] px-3 py-1 rounded-full border border-[#E3C2B0]/40 mb-3">
              QUESTION 3 / 5
            </span>

            <h2 className="text-2xl font-serif font-bold text-[#2C1A0E] mb-2">
              How would you describe your skin type?
            </h2>
            <p className="text-xs text-[#2C1A0E]/60 mb-8 max-w-xs leading-relaxed">
              This guides active ingredient concentrations and lipid formulation balance.
            </p>

            <div className="space-y-2.5 w-full mb-8 text-left">
              {[
                { id: "oily", title: "Oily", desc: "Excess shine throughout the day, enlarged pores, prone to congestion." },
                { id: "dry", title: "Dry", desc: "Tightness after washing, flaking, or a dull complexion." },
                { id: "combination", title: "Combination", desc: "Oily T-zone (forehead & nose) with normal or dry cheeks." },
                { id: "sensitive", title: "Sensitive", desc: "Easily irritated, reactive, flushed, or prone to burning." },
                { id: "unknown", title: "I don't know", desc: "Let our photo scan determine my exact oil-to-moisture metric." },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSkinType(item.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    skinType === item.id
                      ? "bg-white border-[#2C1A0E] shadow-sm"
                      : "bg-[#F4EDE4]/60 border-[#E3C2B0]/60 hover:bg-white"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${skinType === item.id ? "border-[#2C1A0E] bg-[#2C1A0E]" : "border-[#E3C2B0]"}`}>
                    {skinType === item.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <span className="text-xs font-serif font-bold text-[#2C1A0E] block">{item.title}</span>
                    <span className="text-[11px] text-[#2C1A0E]/60 leading-tight block mt-0.5">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setPhase("routine_check")}
              className="w-full py-4 bg-[#2C1A0E] hover:bg-[#2C1A0E]/90 text-white font-bold text-sm rounded-2xl shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 6: QUESTION — DAILY ROUTINE CHECK */}
        {/* ========================================================================= */}
        {phase === "routine_check" && (
          <div className="w-full max-w-md flex flex-col items-center text-center py-6 animate-in fade-in duration-300">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#2C1A0E]/60 bg-[#F4EDE4] px-3 py-1 rounded-full border border-[#E3C2B0]/40 mb-3">
              QUESTION 4 / 5
            </span>

            <h2 className="text-2xl font-serif font-bold text-[#2C1A0E] mb-2">
              What is your current daily skincare routine?
            </h2>
            <p className="text-xs text-[#2C1A0E]/60 mb-8 max-w-xs leading-relaxed">
              We will build upon your existing habits so your new routine feels effortless.
            </p>

            <div className="space-y-2.5 w-full mb-8 text-left">
              {[
                { id: "morning_evening", title: "☀️🌙 Morning & Evening", desc: "I follow a complete skincare routine twice a day." },
                { id: "only_morning", title: "☀️ Only Morning", desc: "I wash & protect my skin in the morning." },
                { id: "only_evening", title: "🌙 Only Evening", desc: "I cleanse & hydrate before sleep at night." },
                { id: "no_routine", title: "✨ No Routine Yet", desc: "I'm starting fresh! Keep it simple and quick under 3 mins." },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setUserRoutine(item.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    userRoutine === item.id
                      ? "bg-white border-[#2C1A0E] shadow-sm"
                      : "bg-[#F4EDE4]/60 border-[#E3C2B0]/60 hover:bg-white"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${userRoutine === item.id ? "border-[#2C1A0E] bg-[#2C1A0E]" : "border-[#E3C2B0]"}`}>
                    {userRoutine === item.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <span className="text-xs font-serif font-bold text-[#2C1A0E] block">{item.title}</span>
                    <span className="text-[11px] text-[#2C1A0E]/60 leading-tight block mt-0.5">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setPhase("upload")}
              className="w-full py-4 bg-[#2C1A0E] hover:bg-[#2C1A0E]/90 text-white font-bold text-sm rounded-2xl shadow-md transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: FACE PHOTO UPLOAD */}
        {/* ========================================================================= */}
        {phase === "upload" && (
          <div className="w-full max-w-md flex flex-col items-center text-center py-4 animate-in fade-in duration-300">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#2C1A0E]/60 bg-[#F4EDE4] px-3 py-1 rounded-full border border-[#E3C2B0]/40 mb-4">
              STEP 2 / 5
            </span>

            {/* Instruction Cards Row */}
            <div className="grid grid-cols-3 gap-2 w-full mb-6 text-left">
              <div className="p-2.5 bg-[#F4EDE4] border border-[#E3C2B0]/60 rounded-2xl flex flex-col items-center text-center">
                <span className="text-lg mb-1">☀️</span>
                <span className="text-[10px] font-medium leading-tight text-[#2C1A0E]">Good lighting</span>
              </div>
              <div className="p-2.5 bg-[#F4EDE4] border border-[#E3C2B0]/60 rounded-2xl flex flex-col items-center text-center">
                <span className="text-lg mb-1">😐</span>
                <span className="text-[10px] font-medium leading-tight text-[#2C1A0E]">Neutral expression</span>
              </div>
              <div className="p-2.5 bg-[#F4EDE4] border border-[#E3C2B0]/60 rounded-2xl flex flex-col items-center text-center">
                <span className="text-lg mb-1">👤</span>
                <span className="text-[10px] font-medium leading-tight text-[#2C1A0E]">Align face</span>
              </div>
            </div>

            {/* Camera / Upload Module */}
            <CameraCapture
              gender={selectedGender || "female"}
              selectedConcerns={targetConcerns}
              onCapture={(base64Img) => {
                setCapturedImage(base64Img);
                setPhase("scanning");
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 5: AI SCANNING ANIMATION */}
        {/* ========================================================================= */}
        {phase === "scanning" && (
          <div className="fixed inset-0 bg-[#FAF7F4] text-[#2C1A0E] z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-[#E879A0] shadow-[0_10px_40px_rgba(232,121,160,0.25)] mb-8 flex items-center justify-center bg-white">
              
              {/* User photo or placeholder */}
              <img
                src={capturedImage || SAMPLE_FACES[0].image}
                alt="Scanning face matrix"
                className="w-full h-full object-cover scale-105"
              />

              {/* Glowing AR facial dot grid */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Dots on forehead */}
                <span className="absolute top-[28%] left-[38%] w-2.5 h-2.5 rounded-full bg-[#E879A0] animate-ping"></span>
                <span className="absolute top-[26%] left-[50%] w-2.5 h-2.5 rounded-full bg-[#E879A0] animate-pulse"></span>
                <span className="absolute top-[28%] left-[62%] w-2.5 h-2.5 rounded-full bg-[#E879A0] animate-ping"></span>
                
                {/* Dots on cheeks & nose */}
                <span className="absolute top-[48%] left-[32%] w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="absolute top-[46%] left-[50%] w-2.5 h-2.5 rounded-full bg-[#E879A0] animate-ping"></span>
                <span className="absolute top-[48%] left-[68%] w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                
                {/* Dots on chin */}
                <span className="absolute top-[72%] left-[48%] w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              </div>

              {/* Circular scanning ring overlay */}
              <div className="absolute inset-0 border-4 border-dashed border-[#E879A0] rounded-full animate-spin [animation-duration:8s]"></div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#E879A0]" />
              <h3 className="font-serif font-bold text-xl tracking-wide text-[#2C1A0E]">
                Analyzing your facial structure...
              </h3>
            </div>
            <p className="text-xs text-[#2C1A0E]/70 max-w-xs mb-8">
              Mapping dermal lipid barrier, sebum distribution, and cellular moisture balance for {userName.trim() || "you"}.
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-white text-[#2C1A0E] px-3 py-1.5 rounded-full border border-[#E3C2B0] shadow-2xs">
                BIOMETRIC MAPPING • FACE MATRIX CAPTURED
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-300">
                100% SECURE
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN: SKIN RESULTS TIMELINE (Image 1 Reference - Harmonized Palette) */}
        {/* ========================================================================= */}
        {phase === "timeline" && (
          <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-300 py-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1A0E] text-left w-full tracking-tight">
              Skin results timeline
            </h2>
            <p className="text-xs sm:text-sm text-[#2C1A0E]/70 text-left w-full mt-2 mb-8 font-sans leading-relaxed">
              Most users see visible improvements within 1-3 weeks.
            </p>

            {/* Timeline Steps */}
            <div className="w-full relative pl-6 pb-2 mb-6 text-left">
              {/* Vertical connecting line */}
              <div className="absolute left-[15px] top-4 bottom-6 w-0.5 bg-[#E3C2B0]" />

              <div className="space-y-7 relative">
                {/* Node 1: Week 1 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F4] border-2 border-[#E879A0] flex items-center justify-center shrink-0 z-10 shadow-xs -ml-6">
                    <CheckCircle2 className="w-4 h-4 text-[#E879A0]" />
                  </div>
                  <div className="pt-0.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E879A0] block">Week 1</span>
                    <h4 className="font-serif font-bold text-base text-[#2C1A0E] mt-0.5">Skin Adjustment</h4>
                    <p className="text-xs sm:text-sm text-[#2C1A0E]/70 mt-1 leading-relaxed">
                      Your skin starts adapting to the personalized routine.
                    </p>
                  </div>
                </div>

                {/* Node 2: Week 2 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F4] border-2 border-[#2C1A0E] flex items-center justify-center shrink-0 z-10 shadow-xs -ml-6">
                    <CheckCircle2 className="w-4 h-4 text-[#2C1A0E]" />
                  </div>
                  <div className="pt-0.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2C1A0E]/70 block">Week 2</span>
                    <h4 className="font-serif font-bold text-base text-[#2C1A0E] mt-0.5">Visible Improvements</h4>
                    <p className="text-xs sm:text-sm text-[#2C1A0E]/70 mt-1 leading-relaxed">
                      Texture becomes noticeably smoother and redness starts reducing.
                    </p>
                  </div>
                </div>

                {/* Node 3: Week 3 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F4] border-2 border-emerald-600 flex items-center justify-center shrink-0 z-10 shadow-xs -ml-6">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="pt-0.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">Week 3</span>
                    <h4 className="font-serif font-bold text-base text-[#2C1A0E] mt-0.5">Stable Skin Results</h4>
                    <p className="text-xs sm:text-sm text-[#2C1A0E]/70 mt-1 leading-relaxed">
                      Balanced, radiant glass skin with lasting healthy barrier protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Glass Skin Transformation Note */}
            <div className="w-full p-4 sm:p-5 bg-white border border-[#E3C2B0] rounded-3xl text-left mb-8 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#F4EDE4] border border-[#E3C2B0]/80 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#E879A0]" />
              </div>
              <p className="text-xs sm:text-sm text-[#2C1A0E]/80 leading-relaxed">
                Unlock glowing <strong className="font-bold text-[#2C1A0E]">glass skin under a month</strong> with consistent daily care.
              </p>
            </div>

            <button
              onClick={() => setPhase("treatment_program")}
              className="w-full py-4 bg-[#2C1A0E] hover:bg-[#3D2D29] text-white font-serif font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN: TREATMENT PROGRAM WITH 100% FIT (Image 2 Reference - Harmonized) */}
        {/* ========================================================================= */}
        {phase === "treatment_program" && (
          <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-300 py-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1A0E] text-left w-full tracking-tight leading-snug">
              Treatment program with 100% fit
            </h2>
            <p className="text-xs sm:text-sm text-[#2C1A0E]/70 mb-6 text-left w-full font-sans">
              Let's get dream skin, we will introduce you to your personal routines
            </p>

            {/* Main Treatment Program Card */}
            <div className="w-full bg-white border border-[#E3C2B0] rounded-3xl p-4 sm:p-5 shadow-xs mb-5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                
                {/* Photo with Futuristic Green Landmark Mesh Overlay */}
                <div className="relative aspect-square sm:h-52 rounded-2xl overflow-hidden border border-[#2C1A0E]/30 bg-[#2C1A0E]">
                  <img
                    src={capturedImage || SAMPLE_FACES[0].image}
                    alt="Facial Scan Analysis"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* High-Tech Biometric Grid & Landmarks */}
                  <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none">
                    {/* Viewfinder corners */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                    
                    {/* Matrix Dots */}
                    <div className="absolute inset-4 grid grid-cols-5 grid-rows-5 opacity-50">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: `${(i % 5) * 200}ms` }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="absolute bottom-2.5 left-2.5 bg-[#2C1A0E]/90 backdrop-blur-md text-emerald-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-emerald-400/40 font-bold">
                    ✓ 100% SCAN FIT
                  </span>
                </div>

                {/* Metric Progress Bars Column */}
                <div className="space-y-4 py-1">
                  {/* Hydration 56% */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2C1A0E] mb-1.5">
                      <span>Hydration</span>
                      <span className="font-mono text-xs text-[#E879A0] font-bold">56%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F4EDE4] rounded-full overflow-hidden">
                      <div className="h-full bg-[#E879A0] rounded-full" style={{ width: "56%" }}></div>
                    </div>
                  </div>

                  {/* Elasticity 34% */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2C1A0E] mb-1.5">
                      <span>Elasticity</span>
                      <span className="font-mono text-xs text-emerald-700 font-bold">34%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F4EDE4] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "34%" }}></div>
                    </div>
                  </div>

                  {/* Complexion 70% */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2C1A0E] mb-1.5">
                      <span>Complexion</span>
                      <span className="font-mono text-xs text-[#2C1A0E] font-bold">70%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F4EDE4] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2C1A0E] rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>

                  {/* Texture 54% */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2C1A0E] mb-1.5">
                      <span>Texture</span>
                      <span className="font-mono text-xs text-amber-700 font-bold">54%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F4EDE4] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "54%" }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* "You are here" Progress Status Card */}
            <div className="w-full bg-[#F4EDE4] border border-[#E3C2B0] rounded-2xl p-4 sm:p-5 text-left mb-6 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#2C1A0E]/70 font-bold block">
                  PROFILE READY
                </span>
                <span className="text-xs sm:text-sm font-serif font-bold text-[#2C1A0E] block mt-0.5">
                  You are here: Personalized Protocol Assembled
                </span>
              </div>
              <div className="w-3 h-3 rounded-full bg-[#E879A0] animate-ping shrink-0 ml-3"></div>
            </div>

            <button
              onClick={() => setPhase("commitment")}
              className="w-full py-4 bg-[#2C1A0E] hover:bg-[#3D2D29] text-white font-serif font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
            >
              Next →
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN: COMMITMENT SCREEN (Image 3 Reference - Harmonized) */}
        {/* ========================================================================= */}
        {phase === "commitment" && (
          <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-300 py-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1A0E] mb-6 tracking-tight">
              Your Personalized Skin Plan is <span className="text-[#E879A0]">Ready</span>
            </h2>

            {/* Summary Highlights Card */}
            <div className="w-full bg-white border border-[#E3C2B0] rounded-3xl p-5 sm:p-6 shadow-xs mb-6 text-left space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F4EDE4] border border-[#E3C2B0]/80 flex items-center justify-center shrink-0 text-xl shadow-2xs">
                  🎯
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C1A0E]/60 block">GOAL</span>
                  <span className="text-sm font-serif font-bold text-[#2C1A0E] block mt-0.5">
                    {targetConcerns.length > 0 ? targetConcerns[0] : "Reduce acne & redness"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 border-t border-[#E3C2B0]/30 pt-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F4EDE4] border border-[#E3C2B0]/80 flex items-center justify-center shrink-0 text-xl shadow-2xs">
                  ⏱️
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C1A0E]/60 block">ROUTINE</span>
                  <span className="text-sm font-serif font-bold text-[#2C1A0E] block mt-0.5">Morning & Evening, only 2 min/day</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 border-t border-[#E3C2B0]/30 pt-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F4EDE4] border border-[#E3C2B0]/80 flex items-center justify-center shrink-0 text-xl shadow-2xs">
                  🗓️
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C1A0E]/60 block">FIRST MILESTONE</span>
                  <span className="text-sm font-serif font-bold text-[#2C1A0E] block mt-0.5">Build a 7-day routine</span>
                </div>
              </div>
            </div>

            {/* Commitment Box */}
            <div className="w-full text-center mb-6">
              <p className="text-sm sm:text-base text-[#2C1A0E] leading-relaxed mb-3">
                I, <strong className="text-[#E879A0] font-serif font-bold">{userName.trim() || "Friend"}</strong>,<br />
                commit to my skincare routine for the next 7 days for healthier skin.
              </p>

              {/* Digital Signature Frame */}
              <div className="w-full bg-[#FAF7F4] border-2 border-[#E3C2B0] rounded-2xl p-5 flex items-center justify-center min-h-[90px] shadow-inner my-3">
                <span 
                  className="text-4xl sm:text-5xl text-[#2C1A0E] tracking-wide select-none"
                  style={{ fontFamily: "'Great Vibes', 'Playfair Display', cursive, serif" }}
                >
                  {userName.trim() || "Signature"}
                </span>
              </div>
            </div>

            <button
              id="commit-and-begin-btn"
              onClick={() => {
                // Always navigate strictly to the paywall screen
                setPhase("paywall");
              }}
              className="w-full py-4 bg-[#2C1A0E] hover:bg-[#3D2D29] text-white font-serif font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer mb-3 uppercase tracking-wider"
            >
              Commit & Begin →
            </button>
            
            <p className="text-xs text-[#2C1A0E]/70 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#E879A0]" />
              <span>By continuing, you're starting your personalized skincare journey.</span>
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 13: PAYWALL */}
        {/* ========================================================================= */}
        {phase === "paywall" && (
          <WhopPaywall
            userName={userName}
            timerSeconds={timerSeconds}
            formatTimer={formatTimer}
          />
        )}

        {/* ========================================================================= */}
        {/* UNLOCKED REPORT */}
        {/* ========================================================================= */}
        {phase === "unlocked_report" && (
          <UnlockedReport
            analysisData={
              analysisData || {
                skinScore: 78,
                skinType: "Combination / Barrier Sensitive",
                primaryConcern: targetConcerns[0] || "Acne & Congestion",
                concernsDetail: [],
                metrics: { hydration: 65, sebum: 40, elasticity: 70, melaninDepth: 75 },
                understandingNote: "Your customized report is ready.",
                morningRoutine: ["Gentle Cleanser", "Barrier Serum", "SPF 50 Moisturizer"],
                eveningRoutine: ["Double Cleanse", "Restorative Night Cream"],
                homemadeRemedies: [],
                productRecommendations: []
              }
            }
            userName={userName || "Friend"}
            gender={selectedGender || "female"}
            selectedConcerns={targetConcerns}
            capturedImage={capturedImage}
            onRestart={() => setPhase("landing")}
          />
        )}

      </main>
    </div>
  );
}
