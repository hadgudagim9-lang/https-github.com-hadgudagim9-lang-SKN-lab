import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Share2,
  ThumbsUp,
  RotateCw,
  Droplets,
  ShieldCheck,
  Sun,
  Moon,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Flame
} from "lucide-react";

interface DailyTip {
  id: string;
  title: string;
  category: "Ingredient Spotlight" | "Barrier Protocol" | "Dermatology Insight" | "Seasonal Advice";
  concern: string;
  summary: string;
  detail: string;
  actionStep: string;
  morningOrNight: "Morning" | "Night" | "Both";
  keyIngredient?: string;
}

const CURATED_TIPS: Record<string, DailyTip[]> = {
  Dryness: [
    {
      id: "dry-1",
      title: "Damp Skin Moisture Sandwiching",
      category: "Barrier Protocol",
      concern: "Dryness & Dehydration",
      summary: "Apply humectants within 60 seconds of washing while epidermis is still damp.",
      detail: "Hyaluronic Acid and Glycerin molecules hold up to 1,000x their weight in water, but they require surface moisture to bind effectively. Applying onto bone-dry skin can pull water out from lower dermal layers.",
      actionStep: "Mist face with water or essence, apply hydrating serum, then seal immediately with a ceramide cream.",
      morningOrNight: "Both",
      keyIngredient: "Ceramides & Glycerin"
    },
    {
      id: "dry-2",
      title: "Lipid Repair Night Occlusion",
      category: "Ingredient Spotlight",
      concern: "Dryness & Dehydration",
      summary: "Incorporate phytosterols and fatty acids before sleep to stop overnight TEWL.",
      detail: "Transepidermal Water Loss (TEWL) spikes between 11 PM and 4 AM due to circadian temperature shifts. Occlusive ceramides mimic the skin's natural lipid bilayer to lock in moisture.",
      actionStep: "Layer 2 drops of squalane oil over your nightly moisturizer as the final protective seal.",
      morningOrNight: "Night",
      keyIngredient: "Phytosqualane"
    }
  ],
  Acne: [
    {
      id: "acne-1",
      title: "Contact Therapy for BPO & Salicylic Acid",
      category: "Dermatology Insight",
      concern: "Acne & Blemishes",
      summary: "Short contact washes reduce C. acnes bacteria without causing irritation.",
      detail: "Leaving active benzoyl peroxide or 2% BHA cleansers on skin for 2 minutes before rinsing delivers antimicrobial benefits equal to leave-on treatments, with 80% less flaking.",
      actionStep: "Lather salicylic acid cleanser on wet skin, wait 90 seconds, then rinse thoroughly with tepid water.",
      morningOrNight: "Morning",
      keyIngredient: "Salicylic Acid (BHA)"
    },
    {
      id: "acne-2",
      title: "Niacinamide Sebum Modulation",
      category: "Ingredient Spotlight",
      concern: "Acne & Blemishes",
      summary: "4% Niacinamide regulates sebum production and reduces post-acne erythema.",
      detail: "Excess sebum oxidizes inside pores, triggering inflammation. Niacinamide strengthens barrier integrity while downregulating lipid synthesis in sebaceous glands.",
      actionStep: "Apply a 4-5% niacinamide serum directly under sunscreen every morning.",
      morningOrNight: "Morning",
      keyIngredient: "Niacinamide (Vitamin B3)"
    }
  ],
  Redness: [
    {
      id: "red-1",
      title: "Azelaic Acid Micro-Vascular Relief",
      category: "Dermatology Insight",
      concern: "Sensitivity & Redness",
      summary: "Azelaic acid neutralizes inflammatory cytokines responsible for facial flushing.",
      detail: "10-15% Azelaic acid selectively inhibits reactive oxygen species and reduces telangiectasia visibility, making it a gold standard for rosacea-prone skin.",
      actionStep: "Apply a pea-sized amount of 10% Azelaic Acid after lightweight hydration in the evening.",
      morningOrNight: "Night",
      keyIngredient: "Azelaic Acid"
    },
    {
      id: "red-2",
      title: "Centella Asiatica & Madecassoside Cooling",
      category: "Ingredient Spotlight",
      concern: "Sensitivity & Redness",
      summary: "Cica compounds soothe thermal reactivity and accelerate vascular repair.",
      detail: "Madecassoside suppresses pro-inflammatory interleukin markers, instantly cooling heated, reactive skin patches.",
      actionStep: "Keep a Cica ampoule or gel moisturizer in the refrigerator for an instant soothing calm.",
      morningOrNight: "Both",
      keyIngredient: "Centella Asiatica"
    }
  ],
  Aging: [
    {
      id: "aging-1",
      title: "Peptide & Retinoid Synergy",
      category: "Dermatology Insight",
      concern: "Elasticity & Fine Lines",
      summary: "Signal peptides instruct fibroblasts to synthesize fresh Type-I Collagen.",
      detail: "While retinoids increase cellular turnover rate, copper peptides (GHK-Cu) supply essential structural amino acids to reconstruct matrix density.",
      actionStep: "Alternate retinoid nights with peptide serum nights to maximize collagen production without barrier fatigue.",
      morningOrNight: "Night",
      keyIngredient: "Copper Tripeptide-1"
    },
    {
      id: "aging-2",
      title: "Broad Spectrum UVA1 Shielding",
      category: "Seasonal Advice",
      concern: "Elasticity & Fine Lines",
      summary: "UVA1 rays penetrate cloud glass and degrade collagen year-round.",
      detail: "80% of visible facial aging is driven by UVA photo-degradation of elastic fibers. Standard SPF measures UVB burn, so always verify high PA++++ or UVA circle protection.",
      actionStep: "Apply two finger-lengths of SPF 50+ broad spectrum sunscreen every single morning.",
      morningOrNight: "Morning",
      keyIngredient: "Zinc Oxide & Modern Filters"
    }
  ],
  Texture: [
    {
      id: "tex-1",
      title: "LHA & Mandelic Micro-Polishing",
      category: "Ingredient Spotlight",
      concern: "Texture & Pores",
      summary: "Mandelic Acid gently dissolves dead keratinocyte buildup on sensitive skin.",
      detail: "Because Mandelic Acid has a larger molecular size, it penetrates slowly without stinging, evening out uneven skin grain and clogged pore rims.",
      actionStep: "Use a gentle 5% Mandelic or LHA toner 2 to 3 evenings per week.",
      morningOrNight: "Night",
      keyIngredient: "Mandelic Acid"
    }
  ]
};

interface DailySkincareTipProps {
  userConcerns?: string[];
  userName?: string;
  onExploreRoutine?: () => void;
}

export default function DailySkincareTip({
  userConcerns = [],
  userName = "",
  onExploreRoutine
}: DailySkincareTipProps) {
  const [selectedConcern, setSelectedConcern] = useState<string>("Dryness");
  const [currentTip, setCurrentTip] = useState<DailyTip | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(248);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync concern with user profile if available
  useEffect(() => {
    if (userConcerns && userConcerns.length > 0) {
      const first = userConcerns[0].toLowerCase();
      if (first.includes("acne") || first.includes("blemish")) setSelectedConcern("Acne");
      else if (first.includes("red") || first.includes("sensit")) setSelectedConcern("Redness");
      else if (first.includes("ag") || first.includes("wrinkle") || first.includes("line")) setSelectedConcern("Aging");
      else if (first.includes("textur") || first.includes("pore")) setSelectedConcern("Texture");
      else setSelectedConcern("Dryness");
    }
  }, [userConcerns]);

  // Compute daily tip based on date & selected concern
  useEffect(() => {
    const tipsList = CURATED_TIPS[selectedConcern] || CURATED_TIPS["Dryness"];
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const tipIndex = dayOfYear % tipsList.length;
    setCurrentTip(tipsList[tipIndex]);
    setIsSaved(false);
    setHasLiked(false);
    setAiNote(null);
  }, [selectedConcern]);

  // Request fresh AI tip from server endpoint
  const handleFetchAiTip = async () => {
    setIsLoadingAi(true);
    try {
      const response = await fetch("/api/daily-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concern: selectedConcern,
          userName: userName || "User"
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.tip) {
          setCurrentTip({
            id: `ai-${Date.now()}`,
            title: data.tip.title || `${selectedConcern} Master Tip`,
            category: "Dermatology Insight",
            concern: selectedConcern,
            summary: data.tip.summary || "Custom recommendation generated for your skin.",
            detail: data.tip.detail || "Tailored specifically for active barrier protection.",
            actionStep: data.tip.actionStep || "Integrate into your routine step-by-step.",
            morningOrNight: data.tip.morningOrNight || "Both",
            keyIngredient: data.tip.keyIngredient || "Dermal Bio-Actives"
          });
          setAiNote("Freshly generated via SKN Dermatology Lab");
        }
      } else {
        // Fallback rotation
        const tipsList = CURATED_TIPS[selectedConcern] || CURATED_TIPS["Dryness"];
        const nextTip = tipsList[(tipsList.indexOf(currentTip!) + 1) % tipsList.length];
        setCurrentTip(nextTip);
      }
    } catch (e) {
      console.log("AI Tip fallback used");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleShare = () => {
    if (!currentTip) return;
    const text = `SKN LAB Daily Tip: "${currentTip.title}" - ${currentTip.summary}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentTip) return null;

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E8DACD] p-5 sm:p-6 shadow-sm space-y-4 my-4 relative overflow-hidden transition-all">
      {/* Soft Background Accent Gradient */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl pointer-events-none opacity-60" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EDE4] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#281811] text-amber-300 flex items-center justify-center shadow-2xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2C1A0E]/60 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                {todayFormatted}
              </span>
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                DAILY SKIN TIP
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#2C1A0E] font-serif">
              Personalized Skincare Feed
            </h3>
          </div>
        </div>

        {/* Concern Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#F8F4F0] p-1 rounded-full border border-[#E8DACD]/60 overflow-x-auto max-w-full">
          {[
            { key: "Dryness", label: "Dryness" },
            { key: "Acne", label: "Acne" },
            { key: "Redness", label: "Redness" },
            { key: "Aging", label: "Aging" },
            { key: "Texture", label: "Texture" }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedConcern(item.key)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedConcern === item.key
                  ? "bg-[#281811] text-white shadow-2xs"
                  : "text-[#2C1A0E]/70 hover:text-[#2C1A0E]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tip Card */}
      <div className="space-y-3">
        {/* Category & Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-[#281811] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {currentTip.category}
          </span>

          <div className="flex items-center gap-2">
            {currentTip.morningOrNight === "Morning" && (
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-600" /> Morning
              </span>
            )}
            {currentTip.morningOrNight === "Night" && (
              <span className="text-[10px] font-semibold text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Moon className="w-3 h-3 text-indigo-600" /> Night
              </span>
            )}
            {currentTip.morningOrNight === "Both" && (
              <span className="text-[10px] font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Droplets className="w-3 h-3 text-emerald-600" /> AM / PM
              </span>
            )}
          </div>
        </div>

        {/* Tip Title */}
        <h4 className="text-base sm:text-lg font-serif font-bold text-[#1C120C]">
          {currentTip.title}
        </h4>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-[#2C1A0E]/80 font-medium leading-relaxed">
          {currentTip.summary}
        </p>

        {/* Deep Detail & Mechanism */}
        <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#E8DACD]/80 text-xs text-[#2C1A0E]/85 leading-relaxed space-y-2">
          <p>{currentTip.detail}</p>

          <div className="pt-2 border-t border-[#E8DACD]/50 flex items-start gap-2">
            <span className="font-bold text-[#281811] shrink-0 font-mono text-[11px]">ACTION STEP:</span>
            <span className="text-[#2C1A0E] font-medium">{currentTip.actionStep}</span>
          </div>

          {currentTip.keyIngredient && (
            <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-amber-800 font-bold">
              <span>Target Ingredient: {currentTip.keyIngredient}</span>
            </div>
          )}
        </div>

        {aiNote && (
          <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <span>{aiNote}</span>
          </div>
        )}
      </div>

      {/* Footer Controls: AI Refresh, Like, Bookmark, Share */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F4EDE4] text-xs">
        <button
          onClick={handleFetchAiTip}
          disabled={isLoadingAi}
          className="flex items-center gap-1.5 text-[11px] font-bold text-[#281811] hover:text-black transition cursor-pointer bg-[#F4EDE4] hover:bg-[#E8DACD] px-3 py-1.5 rounded-full"
        >
          <RotateCw className={`w-3.5 h-3.5 text-amber-700 ${isLoadingAi ? "animate-spin" : ""}`} />
          <span>{isLoadingAi ? "Generating Tip..." : "Generate Fresh Tip"}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Like button */}
          <button
            onClick={() => {
              if (!hasLiked) {
                setHasLiked(true);
                setLikeCount((prev) => prev + 1);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
              hasLiked
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : "text-[#2C1A0E]/70 hover:bg-[#FAF6F0]"
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-600 text-rose-600" : ""}`} />
            <span>{likeCount}</span>
          </button>

          {/* Bookmark button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-1.5 rounded-full transition cursor-pointer ${
              isSaved
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "text-[#2C1A0E]/70 hover:bg-[#FAF6F0]"
            }`}
            title={isSaved ? "Saved to Bookmarks" : "Save Tip"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-amber-700 fill-amber-700" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full text-[#2C1A0E]/70 hover:bg-[#FAF6F0] transition cursor-pointer relative"
            title="Share Tip"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute -top-7 right-0 bg-[#281811] text-white text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
