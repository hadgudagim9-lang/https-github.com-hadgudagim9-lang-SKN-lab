import React, { useState } from "react";
import { 
  Check, 
  Activity, 
  Heart, 
  Sun, 
  Moon, 
  Clock, 
  Printer,
  Bookmark,
  Copy,
  Video,
  Play,
  ExternalLink,
  Calendar,
  Trash2,
  Award,
  Download,
  Loader2,
  Share2,
  Send,
  X,
  Share,
  Info
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { SkinAnalysisResponse } from "../types";
import { SKIN_CONCERNS } from "../data";
import SkinTrajectoryChart from "./SkinTrajectoryChart";
import ActiveIngredientsModal from "./ActiveIngredientsModal";
import SkincareInventory from "./SkincareInventory";

interface UnlockedReportProps {
  analysisData: SkinAnalysisResponse | null;
  gender?: "male" | "female" | null;
  selectedConcerns?: string[];
  capturedImage?: string | null;
  copied?: boolean;
  copySkinReportToClipboard?: () => void;
  userName?: string;
  morningRemedy?: any;
  eveningRemedy?: any;
  monthlyRemedy?: any;
  cleanserProduct?: any;
  treatmentProduct?: any;
  moisturizerProduct?: any;
  amHomemadeRoutine?: any;
  pmHomemadeRoutine?: any;
  amProductRec?: any;
  pmProductRec?: any;
  weeklyHomemadeRoutine?: any;
  weeklyProductRec?: any;
  onRestart?: () => void;
}

export default function UnlockedReport({
  analysisData,
  gender = "female",
  selectedConcerns = ["Acne & Congestion", "Uneven Texture", "Dehydration"],
  capturedImage,
  copied,
  copySkinReportToClipboard,
  morningRemedy = {
    name: "Green Tea & Chamomile Cold Infusion",
    ingredients: ["Freshly Brewed Green Tea", "Chamomile Extract", "Pure Mineral Water"],
    preparation: "Steep organic green tea, chill in the refrigerator, and apply with a sterile cotton pad to reduce morning puffiness and surface inflammation.",
    benefit: "Calms redness, protects against daily oxidation, and tightens micro-pores."
  },
  eveningRemedy = {
    name: "Colloidal Oat & Raw Honey Barrier Compress",
    ingredients: ["Finely Milled Colloidal Oats", "Raw Manuka Honey", "Warm Filtered Water"],
    preparation: "Mix 1 tbsp colloidal oatmeal with 1 tsp raw honey and warm water into a smooth paste. Apply to skin for 10-15 minutes, then rinse gently with lukewarm water.",
    benefit: "Replenishes skin lipid barrier, delivers natural anti-inflammatory compounds, and locks in essential hydration."
  },
  monthlyRemedy = {
    name: "Bentonite & French Green Clay Cellular Reset",
    ingredients: ["Pure Bentonite Clay", "Organic Apple Cider Vinegar (diluted)", "Rosewater"],
    preparation: "Mix equal parts bentonite clay and organic rosewater into a non-metallic bowl. Apply a thin, even layer across the T-zone and cheeks for 10 minutes before rinsing thoroughly.",
    benefit: "Draws out deep micro-pollutants, clears cellular debris from pore walls, and resets epidermal cell turnover."
  },
  cleanserProduct = {
    name: "Foaming Hydrating Facial Cleanser",
    brand: "CeraVe",
    activeIngredients: ["Ceramides 1, 3, 6-II", "Hyaluronic Acid", "Niacinamide"],
    whyRecommended: "Formulated with 3 essential skin-identical ceramides to cleanse thoroughly without disrupting the delicate moisture barrier."
  },
  treatmentProduct = {
    name: "Niacinamide 10% + Zinc 1% Active Serum",
    brand: "The Ordinary",
    activeIngredients: ["10% Niacinamide", "1% Zinc PCA"],
    whyRecommended: "Clinically proven concentration that regulates excess sebum production, visibly refines skin texture, and fades post-blemish redness."
  },
  moisturizerProduct = {
    name: "Anthelios Clear Skin Dry Touch SPF 60",
    brand: "La Roche-Posay",
    activeIngredients: ["Cell-Ox Shield®", "Perlite & Silica Matrix"],
    whyRecommended: "Broad-spectrum daily protection with an advanced oil-absorbing formula that leaves a clean, velvety finish without clogging pores."
  },
  weeklyProductRec = {
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    activeIngredients: ["2% Salicylic Acid (BHA)", "Green Tea Extract", "Methylpropanediol"],
    whyRecommended: "Clinically proven to penetrate deep into pore linings, shed dead skin build-up, and dramatically improve skin smoothness without physical abrasion.",
    amazon_link: "https://www.amazon.com/s?k=Paula%27s+Choice+2+BHA+Liquid+Exfoliant"
  },
  amHomemadeRoutine,
  pmHomemadeRoutine,
  amProductRec,
  pmProductRec,
  weeklyHomemadeRoutine,
  onRestart
}: UnlockedReportProps) {
  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem("skn_customer_name") || "Bella Thorne";
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
    localStorage.setItem("skn_customer_name", e.target.value);
  };

  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [activeTrackerWeek, setActiveTrackerWeek] = useState<number>(0);

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState<boolean>(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);

  const openIngredientDetail = (ingredientName: string) => {
    setSelectedIngredientId(ingredientName);
    setIsIngredientModalOpen(true);
  };

  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0] || "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  };

  const getShareableUrl = () => {
    const origin = window.location.origin + window.location.pathname;
    const score = analysisData?.skinScore || 75;
    const skinType = encodeURIComponent(analysisData?.skinType || "Combination");
    const name = encodeURIComponent(customerName || "Bella");
    return `${origin}?shared=true&name=${name}&score=${score}&type=${skinType}`;
  };

  const handleCopyShareLink = async () => {
    const url = getShareableUrl();
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const url = getShareableUrl();
    const isHighProblem = (selectedConcerns || []).length >= 3 || (selectedConcerns || []).some((c) => /acne|congestion|redness|sensitivity/i.test(c));
    const weeks = isHighProblem ? 3 : 2;
    const title = `${customerName}'s SKN LAB Skin Journey`;
    const text = `Check out my personalized skin journey report! My current skin score is ${analysisData?.skinScore || 75}/100 with a ${weeks}-week glass skin target.`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (e) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyShareLink();
    }
  };

  const [amChecked, setAmChecked] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem("skn_tracker_am");
      return saved ? JSON.parse(saved) : new Array(28).fill(false);
    } catch {
      return new Array(28).fill(false);
    }
  });

  const [pmChecked, setPmChecked] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem("skn_tracker_pm");
      return saved ? JSON.parse(saved) : new Array(28).fill(false);
    } catch {
      return new Array(28).fill(false);
    }
  });

  const [amPreference, setAmPreference] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("skn_tracker_am_pref");
      return saved ? JSON.parse(saved) : new Array(28).fill("homemade");
    } catch {
      return new Array(28).fill("homemade");
    }
  });

  const [pmPreference, setPmPreference] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("skn_tracker_pm_pref");
      return saved ? JSON.parse(saved) : new Array(28).fill("homemade");
    } catch {
      return new Array(28).fill("homemade");
    }
  });

  const [weeklySundayChecked, setWeeklySundayChecked] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem("skn_tracker_weekly_sunday");
      return saved ? JSON.parse(saved) : new Array(4).fill(false);
    } catch {
      return new Array(4).fill(false);
    }
  });

  const [weeklySundayPref, setWeeklySundayPref] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("skn_tracker_weekly_sunday_pref");
      return saved ? JSON.parse(saved) : new Array(4).fill("both");
    } catch {
      return new Array(4).fill("both");
    }
  });

  const openDirectYouTube = (urlOrQuery: string) => {
    if (!urlOrQuery) return;
    let finalUrl = urlOrQuery;
    if (!urlOrQuery.startsWith("http://") && !urlOrQuery.startsWith("https://")) {
      finalUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(urlOrQuery)}`;
    }
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  const getDirectYouTubeUrl = (urlOrQuery: string) => {
    if (!urlOrQuery) return "https://www.youtube.com";
    if (urlOrQuery.startsWith("http://") || urlOrQuery.startsWith("https://")) {
      return urlOrQuery;
    }
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(urlOrQuery)}`;
  };

  const concernsLower = (selectedConcerns || []).map(c => c.toLowerCase());

  const getZoneDetails = (zone: number) => {
    const isAcne = concernsLower.some(c => c.includes("acne"));
    const isRedness = concernsLower.some(c => c.includes("redness") || c.includes("irritation"));
    const isAging = concernsLower.some(c => c.includes("aging") || c.includes("lines") || c.includes("wrinkles"));
    const isDullness = concernsLower.some(c => c.includes("dull") || c.includes("glow"));
    const isDarkSpots = concernsLower.some(c => c.includes("spots") || c.includes("pigment") || c.includes("dark"));
    const isTexture = concernsLower.some(c => c.includes("pores") || c.includes("texture") || c.includes("rough"));
    const isDryness = concernsLower.some(c => c.includes("dry") || c.includes("hydration") || c.includes("moisture"));

    if (zone === 1) {
      if (isAcne) {
        return {
          title: "Zone 1: Forehead & T-Zone",
          status: "Acne Prone / Congested",
          statusColor: "bg-rose-100 text-rose-800 border border-rose-200",
          desc: "Your scan revealed active sebum congestion and tiny comedones across the forehead. The higher oil gland concentration in your T-zone is trapping dead skin cells.",
          tip: "Cleanse with a mild salicylic-base wash daily. Avoid heavy styling hair products that bleed onto the forehead, and never pick forehead blemishes to prevent scarring.",
        };
      }
      if (isTexture) {
        return {
          title: "Zone 1: Forehead & T-Zone",
          status: "Uneven Texture / Enlarged Pores",
          statusColor: "bg-amber-100 text-amber-800 border border-amber-200",
          desc: "Your forehead scan shows visible skin pore expansion and micro-relief unevenness. This is caused by excess sebum stretching the pore walls.",
          tip: "Integrate niacinamide in your routine. It stabilizes oil production, helping stretched pore walls shrink back to their normal size, and smooths the brow.",
        };
      }
      if (isRedness) {
        return {
          title: "Zone 1: Forehead & T-Zone",
          status: "Sensitive & Flushed",
          statusColor: "bg-red-100 text-red-800 border border-red-200",
          desc: "Your scan showed localized heat and mild dehydration flushing across the forehead, indicating a slightly compromised epidermal seal.",
          tip: "Avoid washing your face with hot shower water. Cool or lukewarm water preserves the protective lipids on your forehead and keeps blood vessels calm.",
        };
      }
      if (isAging) {
        return {
          title: "Zone 1: Forehead & T-Zone",
          status: "Early Expression Creases",
          statusColor: "bg-indigo-100 text-indigo-800 border border-indigo-200",
          desc: "Fine, shallow expression lines are starting to set across your brow due to moisture loss and natural movement, as shown in your scan.",
          tip: "Keep the area heavily hydrated with a humectant serum. Dehydrated skin creases much faster; applying hydration plumps the lines instantly.",
        };
      }
      if (isDullness || isDarkSpots) {
        return {
          title: "Zone 1: Forehead & T-Zone",
          status: "Dull / Sun Exposed",
          statusColor: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          desc: "The forehead bears the brunt of UV exposure. Your scan shows early pigment clusters and flat, dull cells scattering light unevenly.",
          tip: "Always wear mineral SPF 30+ daily, even indoors. Incorporate a gentle antioxidant like Vitamin C in the morning to lift the shadow.",
        };
      }
      return {
        title: "Zone 1: Forehead & T-Zone",
        status: "Slight Sebum Congestion",
        statusColor: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        desc: "Your forehead naturally has slightly more oil glands, leading to minor shine and light cellular buildup at the surface.",
        tip: "Gently pat dry and avoid heavy oil-based creams on your forehead to keep pores completely clear and fresh.",
      };
    }

    if (zone === 2) {
      if (isAging) {
        return {
          title: "Zone 2: Under-Eyes",
          status: "Fine Crepiness",
          statusColor: "bg-indigo-100 text-indigo-800 border border-indigo-200",
          desc: "Your scan highlighted delicate crepiness or early 'crow's feet' lines. This is because the skin here has fewer oil glands and loses elasticity first.",
          tip: "Use high-fat peptide creams specifically formulated for the eye contour. Tap gently with your ring finger to avoid tearing thin tissue.",
        };
      }
      if (isDarkSpots || isDullness) {
        return {
          title: "Zone 2: Under-Eyes",
          status: "Hyperpigmentation & Shadows",
          statusColor: "bg-amber-100 text-amber-800 border border-amber-200",
          desc: "Your scan shows shadow retention under the eyes, which can be a mix of vascular congestion and superficial melanin concentration.",
          tip: "Look for eye formulas containing caffeine or Vitamin C. Caffeine temporarily constricts the micro-vessels, quickly brightening the under-eye shadow.",
        };
      }
      if (isRedness) {
        return {
          title: "Zone 2: Under-Eyes",
          status: "Highly Delicate / Thin",
          statusColor: "bg-red-100 text-red-800 border border-red-200",
          desc: "The thin skin around your eye contour shows high capillary visibility and irritation sensitivity from rubbing or makeup removal.",
          tip: "Avoid harsh makeup wipes. Switch to a nourishing micellar water or oil cleanser to melt makeup without friction, and pat dry gently.",
        };
      }
      return {
        title: "Zone 2: Under-Eyes",
        status: "Delicate & Dry",
        statusColor: "bg-amber-100 text-amber-800 border border-amber-200",
        desc: "The skin here is super thin and delicate, showing mild fatigue and a natural lack of lipid glands to keep it self-lubricated.",
        tip: "Always apply your gentle moisturizer first here to build a buffer, then tap hydration lightly around the orbital bone.",
      };
    }

    if (zone === 3) {
      if (isRedness) {
        return {
          title: "Zone 3: Cheeks",
          status: "Vasomotor Flushing / Sensitive",
          statusColor: "bg-rose-100 text-rose-800 border border-rose-200",
          desc: "Your cheeks are the primary zone of barrier disruption. The scan shows pronounced micro-capillary redness, warmth, and sensitive skin-barrier weakness.",
          tip: "Avoid coarse physical scrubs completely. Use calming products with Centella Asiatica (Cica), aloe, or green tea to quiet the redness.",
        };
      }
      if (isDryness || isDullness) {
        return {
          title: "Zone 3: Cheeks",
          status: "Dehydrated / Flaky Patches",
          statusColor: "bg-sky-100 text-sky-800 border border-sky-200",
          desc: "Your cheek scan shows acute moisture depletion. Lacking sufficient oil glands, your cheeks are losing water rapidly to dry air.",
          tip: "Apply a generous extra layer of your ceramide-rich moisturizer right after washing, while your cheeks are still slightly damp.",
        };
      }
      if (isAcne) {
        return {
          title: "Zone 3: Cheeks",
          status: "Post-Blemish Marks (PIH)",
          statusColor: "bg-rose-100 text-rose-800 border border-rose-200",
          desc: "Your scan detected light post-inflammatory marks on the cheek area, where skin heals slower due to constant friction (like phone calls or pillows).",
          tip: "Wash your pillowcases twice a week in scent-free detergent. Pat a gentle soothing serum containing licorice root or niacinamide to fade marks.",
        };
      }
      if (isTexture) {
        return {
          title: "Zone 3: Cheeks",
          status: "Rough Texture / Dullness",
          statusColor: "bg-amber-100 text-amber-800 border border-amber-200",
          desc: "Cheek scan shows tiny dry flakes and texture build-up. This creates a flat surface that prevents light from bouncing off your cheekbones.",
          tip: "Never scrub. Use a gentle homemade honey-oats mask to slowly soften dead skin cells and reveal the smooth, light-reflective surface underneath.",
        };
      }
      return {
        title: "Zone 3: Cheeks",
        status: "Mild Hydration Loss",
        statusColor: "bg-sky-100 text-sky-800 border border-sky-200",
        desc: "Your cheeks are prone to losing moisture faster. Mapped to lock in hydration and soothe any dry or sensitive patches.",
        tip: "Apply extra moisturizer here right after washing, while your face is still slightly damp.",
      };
    }

    if (zone === 4) {
      if (isAcne) {
        return {
          title: "Zone 4: Jawline & Chin",
          status: "Hormonal Breakout Prone",
          statusColor: "bg-rose-100 text-rose-800 border border-rose-200",
          desc: "Your jawline and chin scan detected painful deep-seated blemishes. This is typically tied to hormonal cycles or localized friction from hands or masks.",
          tip: "Do not scrub these bumps—it pushes bacteria deeper. Apply a thin layer of zinc-based paste or clay spot treatment to cool down the inflammation overnight.",
        };
      }
      if (isRedness || isTexture) {
        return {
          title: "Zone 4: Jawline & Chin",
          status: "Friction Irritation / Roughness",
          statusColor: "bg-amber-100 text-amber-800 border border-amber-200",
          desc: "Your chin area shows localized friction roughness and skin peeling. This can be caused by dry weather, wind-burn, or shaving/waxing irritation.",
          tip: "Soothe the area with pure aloe vera gel or a warm oat-water damp compress for 3 minutes to restore elastic suppleness and calm irritation.",
        };
      }
      if (isAging) {
        return {
          title: "Zone 4: Jawline & Chin",
          status: "Mild Elasticity Decline",
          statusColor: "bg-indigo-100 text-indigo-800 border border-indigo-200",
          desc: "Your scan shows early signs of gravitational moisture pools near the jaw, where skin requires structural support and deeper hydration.",
          tip: "Perform upward and outward facial massage sweeps during your PM routine. This drains lymphatic fluid and lifts tissue contours naturally.",
        };
      }
      return {
        title: "Zone 4: Jawline & Chin",
        status: "Clean & Calm",
        statusColor: "bg-purple-100 text-purple-800 border border-purple-200",
        desc: "Prone to occasional breakouts or localized redness. Balanced to keep your skin cool, stabilized, and clean.",
        tip: "Cleanse in gentle, upward circular motions to lift away daily pore blockages and soothe jawline tension.",
      };
    }

    return {
      title: "Zone Details",
      status: "Analyzing",
      statusColor: "bg-gray-100 text-gray-800 border border-gray-200",
      desc: "Analyzing zone layers...",
      tip: "Apply standard care.",
    };
  };

  const getScienceIntroduction = () => {
    const isAcne = concernsLower.some(c => c.includes("acne"));
    const isRedness = concernsLower.some(c => c.includes("redness") || c.includes("irritation"));
    const isAging = concernsLower.some(c => c.includes("aging") || c.includes("lines") || c.includes("wrinkles"));
    const isDullness = concernsLower.some(c => c.includes("dull") || c.includes("glow"));
    const isDarkSpots = concernsLower.some(c => c.includes("spots") || c.includes("pigment") || c.includes("dark"));
    const isTexture = concernsLower.some(c => c.includes("pores") || c.includes("texture") || c.includes("rough"));
    const isDryness = concernsLower.some(c => c.includes("dry") || c.includes("hydration") || c.includes("moisture"));

    if (isAcne) {
      return "Your routine is scientifically optimized to calm overactive sebum glands, gently dissolve pore-clogging debris, and restore a serene, breakout-free skin matrix with zero stripping.";
    }
    if (isRedness) {
      return "Your routine is formulated with ultra-soothing botanicals and barrier-building lipids to cool inflamed capillaries, calm dermal flushing, and reinforce your vulnerable moisture seal.";
    }
    if (isAging) {
      return "Your routine is targeted to plump deep cellular layers, accelerate natural epidermal renewal, and smooth out fine expression lines with intense moisture locking.";
    }
    if (isDryness) {
      return "Your routine focuses on deep cellular moisture-binding, replenishing depleted intercellular lipids to instantly alleviate tightness and lock in a dewy bounce.";
    }
    if (isDullness || isDarkSpots) {
      return "Your routine is clinical-grade curated to dissolve dead skin cells, inhibit excess pigment pathways, and reveal a luminous, light-reflective glass-skin sheen.";
    }
    if (isTexture) {
      return "Your routine is optimized to smooth surface micro-bumps, tighten stretched pore walls, and polish rough cellular layers into a silky, uniform skin canvas.";
    }
    return "Your custom routine is clinically curated to repair your lipid barrier, infuse deep-layer hydration, and activate a healthy, uniform glow tailored exactly to your skin's profile.";
  };

  const [monthlyChecked, setMonthlyChecked] = useState<boolean>(() => {
    return localStorage.getItem("skn_tracker_monthly") === "true";
  });

  const toggleAM = (dayIndex: number) => {
    const updated = [...amChecked];
    updated[dayIndex] = !updated[dayIndex];
    setAmChecked(updated);
    localStorage.setItem("skn_tracker_am", JSON.stringify(updated));
  };

  const togglePM = (dayIndex: number) => {
    const updated = [...pmChecked];
    updated[dayIndex] = !updated[dayIndex];
    setPmChecked(updated);
    localStorage.setItem("skn_tracker_pm", JSON.stringify(updated));
  };

  const changeAmPreference = (dayIndex: number, pref: "homemade" | "product" | "both") => {
    const updated = [...amPreference];
    updated[dayIndex] = pref;
    setAmPreference(updated);
    localStorage.setItem("skn_tracker_am_pref", JSON.stringify(updated));
  };

  const changePmPreference = (dayIndex: number, pref: "homemade" | "product" | "both") => {
    const updated = [...pmPreference];
    updated[dayIndex] = pref;
    setPmPreference(updated);
    localStorage.setItem("skn_tracker_pm_pref", JSON.stringify(updated));
  };

  const changeWeeklySundayPref = (weekIndex: number, pref: "homemade" | "product" | "both") => {
    const updated = [...weeklySundayPref];
    updated[weekIndex] = pref;
    setWeeklySundayPref(updated);
    localStorage.setItem("skn_tracker_weekly_sunday_pref", JSON.stringify(updated));
  };

  const toggleWeeklySunday = (weekIndex: number) => {
    const updated = [...weeklySundayChecked];
    updated[weekIndex] = !updated[weekIndex];
    setWeeklySundayChecked(updated);
    localStorage.setItem("skn_tracker_weekly_sunday", JSON.stringify(updated));
  };

  const toggleMonthly = () => {
    const next = !monthlyChecked;
    setMonthlyChecked(next);
    localStorage.setItem("skn_tracker_monthly", String(next));
  };

  const markWeekCompleted = (weekIndex: number) => {
    const updatedAm = [...amChecked];
    const updatedPm = [...pmChecked];
    const updatedWeeklySunday = [...weeklySundayChecked];
    const startDay = weekIndex * 7;
    for (let i = startDay; i < startDay + 7; i++) {
      updatedAm[i] = true;
      updatedPm[i] = true;
    }
    updatedWeeklySunday[weekIndex] = true;
    setAmChecked(updatedAm);
    setPmChecked(updatedPm);
    setWeeklySundayChecked(updatedWeeklySunday);
    localStorage.setItem("skn_tracker_am", JSON.stringify(updatedAm));
    localStorage.setItem("skn_tracker_pm", JSON.stringify(updatedPm));
    localStorage.setItem("skn_tracker_weekly_sunday", JSON.stringify(updatedWeeklySunday));
  };

  const resetTracker = () => {
    const freshAm = new Array(28).fill(false);
    const freshPm = new Array(28).fill(false);
    const freshAmPref = new Array(28).fill("homemade");
    const freshPmPref = new Array(28).fill("homemade");
    const freshWeeklySunday = new Array(4).fill(false);
    setAmChecked(freshAm);
    setPmChecked(freshPm);
    setAmPreference(freshAmPref);
    setPmPreference(freshPmPref);
    setMonthlyChecked(false);
    setWeeklySundayChecked(freshWeeklySunday);
    localStorage.setItem("skn_tracker_am", JSON.stringify(freshAm));
    localStorage.setItem("skn_tracker_pm", JSON.stringify(freshPm));
    localStorage.setItem("skn_tracker_am_pref", JSON.stringify(freshAmPref));
    localStorage.setItem("skn_tracker_pm_pref", JSON.stringify(freshPmPref));
    localStorage.setItem("skn_tracker_monthly", "false");
    localStorage.setItem("skn_tracker_weekly_sunday", JSON.stringify(freshWeeklySunday));
  };

  const [showIframeModal, setShowIframeModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const replaceColorFunctions = (cssText: string): string => {
    let result = "";
    let i = 0;
    const len = cssText.length;
    
    while (i < len) {
      const slice = cssText.slice(i, i + 15).toLowerCase();
      let isTarget = false;
      let funcName = "";
      let matchLength = 0;
      
      if (slice.startsWith("oklch(")) {
        isTarget = true;
        funcName = "oklch";
        matchLength = 6;
      } else if (slice.startsWith("oklab(")) {
        isTarget = true;
        funcName = "oklab";
        matchLength = 6;
      } else if (slice.startsWith("color-mix(")) {
        isTarget = true;
        funcName = "color-mix";
        matchLength = 10;
      } else if (slice.startsWith("light-dark(")) {
        isTarget = true;
        funcName = "light-dark";
        matchLength = 11;
      }
      
      if (isTarget) {
        let braceCount = 1;
        let j = i + matchLength;
        while (j < len && braceCount > 0) {
          if (cssText[j] === "(") {
            braceCount++;
          } else if (cssText[j] === ")") {
            braceCount--;
          }
          j++;
        }
        
        const fullCall = cssText.slice(i, j);
        let replacement = "rgba(61, 45, 41, 1)"; // default luxury espresso
        
        try {
          if (funcName === "oklch" || funcName === "oklab") {
            const content = fullCall.slice(matchLength, -1).trim();
            const parts = content.split(/[\s/]+/);
            if (parts.length >= 1) {
              const p1 = parts[0];
              let L = p1.endsWith("%") ? parseFloat(p1) / 100 : parseFloat(p1);
              let alpha = 1;
              if (parts.length >= 4) {
                const p4 = parts[3];
                alpha = p4.endsWith("%") ? parseFloat(p4) / 100 : parseFloat(p4);
              }
              if (isNaN(L)) L = 0.5;
              if (isNaN(alpha)) alpha = 1;
              
              if (L > 0.85) {
                replacement = `rgba(250, 246, 240, ${alpha})`; // Cream
              } else if (L > 0.7) {
                replacement = `rgba(244, 237, 228, ${alpha})`; // Soft Tan
              } else if (L > 0.5) {
                replacement = `rgba(203, 163, 142, ${alpha})`; // Gold-accent
              } else {
                replacement = `rgba(61, 45, 41, ${alpha})`; // Espresso
              }
            }
          } else if (funcName === "color-mix") {
            const contentLower = fullCall.toLowerCase();
            let alpha = 1;
            
            const pctMatch = contentLower.match(/(\d+)%/);
            if (pctMatch) {
              const pct = parseInt(pctMatch[1]);
              if (contentLower.includes("transparent")) {
                alpha = pct / 100;
                if (contentLower.includes("transparent " + pct)) {
                  alpha = (100 - pct) / 100;
                }
              }
            }
            
            if (contentLower.includes("cream")) {
              replacement = `rgba(250, 246, 240, ${alpha})`;
            } else if (contentLower.includes("accent")) {
              replacement = `rgba(203, 163, 142, ${alpha})`;
            } else if (contentLower.includes("espresso")) {
              replacement = `rgba(61, 45, 41, ${alpha})`;
            } else if (contentLower.includes("rose") || contentLower.includes("card")) {
              replacement = `rgba(244, 237, 228, ${alpha})`;
            } else if (contentLower.includes("white")) {
              replacement = `rgba(255, 255, 255, ${alpha})`;
            } else if (contentLower.includes("black")) {
              replacement = `rgba(0, 0, 0, ${alpha})`;
            } else {
              replacement = `rgba(203, 163, 142, ${alpha})`;
            }
          } else if (funcName === "light-dark") {
            const content = fullCall.slice(matchLength, -1).trim();
            let braceCountInner = 0;
            let commaIdx = -1;
            for (let k = 0; k < content.length; k++) {
              if (content[k] === "(") braceCountInner++;
              else if (content[k] === ")") braceCountInner--;
              else if (content[k] === "," && braceCountInner === 0) {
                commaIdx = k;
                break;
              }
            }
            if (commaIdx !== -1) {
              replacement = content.slice(0, commaIdx).trim();
            } else {
              replacement = content;
            }
          }
        } catch (e) {
          console.warn("Error processing color function:", fullCall, e);
        }
        
        result += replacement;
        i = j;
      } else {
        result += cssText[i];
        i++;
      }
    }
    return result;
  };

  const downloadReportAsPDF = async (force: any = false) => {
    const isForce = force === true;
    const isInIframe = window.self !== window.top;
    
    if (isInIframe && !isForce) {
      setShowIframeModal(true);
      return;
    }

    const element = document.getElementById("unlocked-skincare-suite");
    if (!element) return;

    setIsGeneratingPdf(true);

    try {
      // 1. Gather all local stylesheets and style tags
      let combinedCSS = "";
      
      const styleTags = Array.from(document.querySelectorAll("style"));
      styleTags.forEach((tag) => {
        combinedCSS += "\n" + tag.innerHTML;
      });

      const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
      for (const link of linkTags) {
        const href = link.getAttribute("href");
        if (href) {
          const isSameOrigin = href.startsWith("/") || href.startsWith(window.location.origin) || !href.startsWith("http");
          if (isSameOrigin) {
            try {
              const response = await fetch(href);
              if (response.ok) {
                const cssText = await response.text();
                combinedCSS += "\n" + cssText;
              }
            } catch (err) {
              console.warn("Could not pre-process stylesheet:", href, err);
            }
          }
        }
      }

      // Sanitize the compiled CSS string completely
      const sanitizedCSS = replaceColorFunctions(combinedCSS);

      // 2. Run html2canvas with in-memory manipulation inside onclone
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution pixel density
        useCORS: true,
        allowTaint: false, // Prevent tainting the canvas so toDataURL never crashes!
        backgroundColor: "#FAF6F0",
        logging: false,
        windowWidth: 1200, // Standardized desktop width for clean PDF layout
        onclone: (clonedDoc) => {
          // A. Replace all oklch / oklab colors in style tags in the clone
          const cloneStyleTags = clonedDoc.querySelectorAll("style");
          cloneStyleTags.forEach((tag) => {
            tag.innerHTML = replaceColorFunctions(tag.innerHTML);
          });

          // B. Remove same-origin stylesheets from the clone and inject our sanitized styles instead
          const cloneLinkTags = clonedDoc.querySelectorAll("link[rel='stylesheet']");
          cloneLinkTags.forEach((link) => {
            const href = link.getAttribute("href") || "";
            if (!href.includes("fonts.googleapis.com") && !href.includes("fonts.gstatic.com")) {
              link.parentNode?.removeChild(link);
            }
          });

          const tempStyle = clonedDoc.createElement("style");
          tempStyle.id = "cloned-pdf-sanitized-styles";
          tempStyle.innerHTML = sanitizedCSS;
          clonedDoc.head.appendChild(tempStyle);

          // C. Recursively sanitize inline styles in the cloned document
          const sanitizeCloneInline = (el: HTMLElement) => {
            const inlineStyle = el.getAttribute("style");
            if (inlineStyle && /oklab|oklch|color-mix|light-dark/i.test(inlineStyle)) {
              el.setAttribute("style", replaceColorFunctions(inlineStyle));
            }
            for (let i = 0; i < el.children.length; i++) {
              sanitizeCloneInline(el.children[i] as HTMLElement);
            }
          };

          const clonedElement = clonedDoc.getElementById("unlocked-skincare-suite");
          if (clonedElement) {
            sanitizeCloneInline(clonedElement);
          }

          // D. Hide elements we don't want in the PDF
          const ignoreElements = clonedDoc.querySelectorAll('[data-html2canvas-ignore="true"]');
          ignoreElements.forEach((el) => {
            (el as HTMLElement).style.display = "none";
          });
          
          const trackerActions = clonedDoc.querySelectorAll('#tracker-actions, #reset-tracker-btn, #print-routine-btn, .pdf-ignore');
          trackerActions.forEach((el) => {
            (el as HTMLElement).style.display = "none";
          });

          // Show PDF-specific elements
          const pdfShows = clonedDoc.querySelectorAll('.pdf-show');
          pdfShows.forEach((el) => {
            (el as HTMLElement).style.display = "block";
          });
        }
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Loop to add multiple pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const rawName = analysisData?.skinType || "SkinType";
      const cleanSkinName = rawName.replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`SKN_LAB_Skin_Report_${cleanSkinName}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to generate PDF. Please try again or use the browser Print/Save function.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.focus();
    window.print();
  };

  const totalTasks = 60;
  const completedAmCount = amChecked.filter(Boolean).length;
  const completedPmCount = pmChecked.filter(Boolean).length;
  const completedSundayCount = weeklySundayChecked.filter(Boolean).length;
  const completedCount = completedAmCount + completedPmCount + completedSundayCount;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const getMilestoneBadge = (percent: number) => {
    if (percent === 100) return "ULTIMATE GLASS SKIN ACHIEVED";
    if (percent >= 75) return "Luminous Glass Explorer";
    if (percent >= 50) return "Refining Active";
    if (percent >= 25) return "Moisture Builder";
    return "Skin Repair Beginner";
  };

  const getYouTubeId = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in-up text-left w-full max-w-full" id="unlocked-skincare-suite">
      
      {/* 1. SCORE */}
      <div className="bg-[#F4EDE4] border border-[#E3C2B0]/40 rounded-3xl p-4 sm:p-7 md:p-8 shadow-md space-y-6 text-left" id="section-1-score">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-[#E3C2B0]/55">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Face preview thumbnail */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-200 border border-[#CBA38E] shadow-sm shrink-0">
              <img
                src={capturedImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"}
                alt="Captured facial skin matrix"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#3D2D29]/5 pointer-events-none"></div>
            </div>

            {/* Profile attributes */}
            <div className="space-y-1">
              <span className="px-2 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[8px] font-mono font-bold uppercase rounded-md tracking-wider">
                1. SCORE & BARRIER INDEX
              </span>
              <div className="text-xs font-medium text-[#3D2D29]/90">
                Gender: <strong className="font-bold">{gender === "female" ? "Female" : "Male"}</strong>
              </div>
              <div className="text-xs font-medium text-[#3D2D29]/90">
                Skin Type: <strong className="font-bold">{analysisData?.skinType || "Combination Sensitive"}</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-start sm:justify-end" data-html2canvas-ignore="true">
            {onRestart && (
              <button
                onClick={onRestart}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white hover:bg-[#FAF6F0] border border-[#E3C2B0]/80 text-[#3D2D29] rounded-xl text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer shadow-2xs"
                title="Start New Scan (Home)"
              >
                New Scan
              </button>
            )}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-[#3D2D29] hover:bg-[#3D2D29]/90 border border-[#3D2D29] text-[#FAF6F0] rounded-xl text-[10px] sm:text-[11px] uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Share Journey</span>
            </button>
          </div>
        </div>

        {/* Three High-Fidelity Gauge Meters cloned from Image 4 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center py-2" id="gauge-meters-bento">
          
          {/* Score Circular Gauge */}
          <div className="bg-[#FAF6F0] p-2.5 sm:p-4 border border-[#E3C2B0]/40 rounded-2xl flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 shadow-xs">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" className="sm:hidden" stroke="#EAE2D5" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="24" 
                  className="sm:hidden"
                  stroke="#3D2D29" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - (analysisData?.skinScore || 75) / 100)}
                />
                <circle cx="32" cy="32" r="28" className="hidden sm:inline" stroke="#EAE2D5" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="hidden sm:inline"
                  stroke="#3D2D29" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - (analysisData?.skinScore || 75) / 100)}
                />
              </svg>
              <span className="font-mono font-bold text-sm sm:text-base text-[#3D2D29]">{analysisData?.skinScore || 75}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#3D2D29]/80 uppercase tracking-wider">Score</span>
          </div>

          {/* Hydration Circular Gauge */}
          <div className="bg-[#FAF6F0] p-2.5 sm:p-4 border border-[#E3C2B0]/40 rounded-2xl flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 shadow-xs">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" className="sm:hidden" stroke="#EAE2D5" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="24" 
                  className="sm:hidden"
                  stroke="#3D2D29" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - (analysisData?.metrics?.hydration || 60) / 100)}
                />
                <circle cx="32" cy="32" r="28" className="hidden sm:inline" stroke="#EAE2D5" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="hidden sm:inline"
                  stroke="#3D2D29" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - (analysisData?.metrics?.hydration || 60) / 100)}
                />
              </svg>
              <span className="font-mono font-bold text-sm sm:text-base text-[#3D2D29]">{analysisData?.metrics?.hydration || 60}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#3D2D29]/80 uppercase tracking-wider">Hydration</span>
          </div>

          {/* Oiliness Circular Gauge */}
          <div className="bg-[#FAF6F0] p-2.5 sm:p-4 border border-[#E3C2B0]/40 rounded-2xl flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 shadow-xs">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" className="sm:hidden" stroke="#EAE2D5" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="24" 
                  className="sm:hidden"
                  stroke="#CBA38E" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - (analysisData?.metrics?.sebum || 45) / 100)}
                />
                <circle cx="32" cy="32" r="28" className="hidden sm:inline" stroke="#EAE2D5" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="hidden sm:inline"
                  stroke="#CBA38E" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - (analysisData?.metrics?.sebum || 45) / 100)}
                />
              </svg>
              <span className="font-mono font-bold text-sm sm:text-base text-[#3D2D29]">{analysisData?.metrics?.sebum || 45}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#3D2D29]/80 uppercase tracking-wider">Oiliness</span>
          </div>

        </div>

        <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E3C2B0]/20 text-xs text-[#3D2D29]/80 leading-relaxed">
          <strong className="text-[#CBA38E] block text-[10px] uppercase tracking-wider mb-1">Diagnostic Summary:</strong>
          {analysisData?.understandingNote || "Your skin shows minor moisture depletion and localized lipid barrier sensitivity. Our structured organic routines combined with clean bio-actives will quickly normalize the epidermis and rebuild a stunning natural sheen."}
        </div>
      </div>

      {/* SKIN JOURNEY DURATION TRAJECTORY CHART (2 OR 3 WEEKS ACCORDING TO PROBLEM SEVERITY) */}
      <SkinTrajectoryChart 
        currentScore={analysisData?.skinScore}
        hydrationScore={analysisData?.metrics?.hydration}
        sebumScore={analysisData?.metrics?.sebum}
        elasticityScore={analysisData?.metrics?.elasticity || 68}
        textureScore={analysisData?.metrics?.texture || 64}
        selectedConcerns={selectedConcerns}
      />

      {/* SKINCARE CABINET & COMPATIBILITY MATCHER */}
      <SkincareInventory 
        analysisData={analysisData}
        selectedConcerns={selectedConcerns}
        skinType={analysisData?.skinType || "Combination"}
      />

      {/* 2. Your Interactive Skin Database (Facial Mapping) */}
      <div className="bg-[#FAF6F0] border border-[#E3C2B0]/40 rounded-3xl p-6 sm:p-8 space-y-4" id="section-2-facial-mapping">
        <div className="flex items-center gap-2 border-b border-[#E3C2B0]/30 pb-3">
          <span className="px-2 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[8px] font-mono font-bold uppercase rounded-md tracking-wider">
            2. FACIAL MAPPING
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#3D2D29]">Your Interactive Skin Database (Facial Mapping)</h3>
        </div>
        
        <p className="text-xs text-[#3D2D29]/80 leading-relaxed">
          We mapped your uploaded facial structure across four coordinates. <strong>Click any zone below to view its active reading and get a personal helper tip:</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Zone 1 */}
          {(() => {
            const z = getZoneDetails(1);
            return (
              <div 
                onClick={() => setActiveZone(activeZone === 1 ? null : 1)}
                className={`border p-3.5 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                  activeZone === 1 
                    ? "bg-white border-[#CBA38E] shadow-xs" 
                    : "bg-white/50 hover:bg-white/80 border-[#E3C2B0]/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-[#CBA38E] uppercase tracking-wider block">{z.title}</span>
                  <span className={`px-1.5 py-0.5 text-[8px] font-mono rounded font-bold uppercase ${z.statusColor}`}>{z.status}</span>
                </div>
                <p className="text-[11px] text-[#3D2D29]/80 mt-1.5 leading-relaxed">
                  {z.desc}
                </p>
                {activeZone === 1 && (
                  <div className="mt-2.5 p-2.5 bg-[#FAF6F0] rounded-lg border border-[#E3C2B0]/30 text-[10px] text-[#3D2D29]/70 animate-fade-in-up">
                    <strong className="text-[#CBA38E] block text-[9px] uppercase tracking-wider">Helper Tip:</strong>
                    {z.tip}
                  </div>
                )}
                <span className="text-[9px] text-[#CBA38E] mt-1.5 block font-medium hover:underline">
                  {activeZone === 1 ? "Click to close details ✕" : "Click for personal helper tip"}
                </span>
              </div>
            );
          })()}

          {/* Zone 2 */}
          {(() => {
            const z = getZoneDetails(2);
            return (
              <div 
                onClick={() => setActiveZone(activeZone === 2 ? null : 2)}
                className={`border p-3.5 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                  activeZone === 2 
                    ? "bg-white border-[#CBA38E] shadow-xs" 
                    : "bg-white/50 hover:bg-white/80 border-[#E3C2B0]/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-[#CBA38E] uppercase tracking-wider block">{z.title}</span>
                  <span className={`px-1.5 py-0.5 text-[8px] font-mono rounded font-bold uppercase ${z.statusColor}`}>{z.status}</span>
                </div>
                <p className="text-[11px] text-[#3D2D29]/80 mt-1.5 leading-relaxed">
                  {z.desc}
                </p>
                {activeZone === 2 && (
                  <div className="mt-2.5 p-2.5 bg-[#FAF6F0] rounded-lg border border-[#E3C2B0]/30 text-[10px] text-[#3D2D29]/70 animate-fade-in-up">
                    <strong className="text-[#CBA38E] block text-[9px] uppercase tracking-wider">Helper Tip:</strong>
                    {z.tip}
                  </div>
                )}
                <span className="text-[9px] text-[#CBA38E] mt-1.5 block font-medium hover:underline">
                  {activeZone === 2 ? "Click to close details ✕" : "Click for personal helper tip"}
                </span>
              </div>
            );
          })()}

          {/* Zone 3 */}
          {(() => {
            const z = getZoneDetails(3);
            return (
              <div 
                onClick={() => setActiveZone(activeZone === 3 ? null : 3)}
                className={`border p-3.5 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                  activeZone === 3 
                    ? "bg-white border-[#CBA38E] shadow-xs" 
                    : "bg-white/50 hover:bg-white/80 border-[#E3C2B0]/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-[#CBA38E] uppercase tracking-wider block">{z.title}</span>
                  <span className={`px-1.5 py-0.5 text-[8px] font-mono rounded font-bold uppercase ${z.statusColor}`}>{z.status}</span>
                </div>
                <p className="text-[11px] text-[#3D2D29]/80 mt-1.5 leading-relaxed">
                  {z.desc}
                </p>
                {activeZone === 3 && (
                  <div className="mt-2.5 p-2.5 bg-[#FAF6F0] rounded-lg border border-[#E3C2B0]/30 text-[10px] text-[#3D2D29]/70 animate-fade-in-up">
                    <strong className="text-[#CBA38E] block text-[9px] uppercase tracking-wider">Helper Tip:</strong>
                    {z.tip}
                  </div>
                )}
                <span className="text-[9px] text-[#CBA38E] mt-1.5 block font-medium hover:underline">
                  {activeZone === 3 ? "Click to close details ✕" : "Click for personal helper tip"}
                </span>
              </div>
            );
          })()}

          {/* Zone 4 */}
          {(() => {
            const z = getZoneDetails(4);
            return (
              <div 
                onClick={() => setActiveZone(activeZone === 4 ? null : 4)}
                className={`border p-3.5 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                  activeZone === 4 
                    ? "bg-white border-[#CBA38E] shadow-xs" 
                    : "bg-white/50 hover:bg-white/80 border-[#E3C2B0]/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-[#CBA38E] uppercase tracking-wider block">{z.title}</span>
                  <span className={`px-1.5 py-0.5 text-[8px] font-mono rounded font-bold uppercase ${z.statusColor}`}>{z.status}</span>
                </div>
                <p className="text-[11px] text-[#3D2D29]/80 mt-1.5 leading-relaxed">
                  {z.desc}
                </p>
                {activeZone === 4 && (
                  <div className="mt-2.5 p-2.5 bg-[#FAF6F0] rounded-lg border border-[#E3C2B0]/30 text-[10px] text-[#3D2D29]/70 animate-fade-in-up">
                    <strong className="text-[#CBA38E] block text-[9px] uppercase tracking-wider">Helper Tip:</strong>
                    {z.tip}
                  </div>
                )}
                <span className="text-[9px] text-[#CBA38E] mt-1.5 block font-medium hover:underline">
                  {activeZone === 4 ? "Click to close details ✕" : "Click for personal helper tip"}
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* 3. Clinical Dermal Science */}
      <div className="bg-[#FAF6F0] border border-[#E3C2B0]/40 rounded-3xl p-6 sm:p-8 space-y-4" id="section-3-science">
        <div className="flex items-center gap-2 border-b border-[#E3C2B0]/30 pb-3">
          <span className="px-2 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[8px] font-mono font-bold uppercase rounded-md tracking-wider">
            3. CLINICAL DERMAL SCIENCE
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#3D2D29] font-sans">Clinical Dermal Science</h3>
        </div>

        <p className="text-xs text-[#3D2D29]/80 leading-relaxed italic bg-[#F4EDE4]/40 p-4 rounded-xl border border-[#E3C2B0]/20 font-sans">
          "{getScienceIntroduction()}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Box 1: Homemade Rituals */}
          <div className="bg-white p-4 rounded-xl border border-[#E3C2B0]/20 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D2D29] font-sans">
              Custom Homemade Remedies
            </h4>
            <p className="text-[10px] leading-relaxed text-[#3D2D29]/75 font-sans">
              Organic, single-ingredient treatments like raw honey and colloidal oats specifically selected for your skin type. These natural remedies focus on calming active redness, cooling irritation, and delivering direct nourishment without synthetic triggers.
            </p>
          </div>

          {/* Box 2: Product Picks */}
          <div className="bg-white p-4 rounded-xl border border-[#E3C2B0]/20 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D2D29] font-sans">
              Dermatological Product Picks
            </h4>
            <p className="text-[10px] leading-relaxed text-[#3D2D29]/75 font-sans">
              Selected active formulations to seal, build, and support your natural moisture barrier. These products are non-comedogenic, completely fragrance-free, and chosen specifically to restore healthy hydration layers.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Personalized Skin Glow Up Routine */}
      <div className="bg-[#FAF6F0] border border-[#E3C2B0]/40 rounded-3xl p-5 sm:p-6 space-y-5" id="section-4-routine">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3C2B0]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[8px] font-mono font-bold uppercase rounded-md tracking-wider">
              4. PERSONALIZED ROUTINE
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#3D2D29] font-sans">Personalized Skin Glow Up Routine</h3>
          </div>

          <button
            onClick={() => {
              setSelectedIngredientId(null);
              setIsIngredientModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#F4EDE4] border border-[#E3C2B0]/60 text-[#3D2D29] rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            <span>Active Ingredients Benefits Guide</span>
          </button>
        </div>

        {/* Morning Routine Option */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-l-2 border-[#CBA38E] pl-2">
            <Sun className="w-3.5 h-3.5 text-[#CBA38E]" />
            <h4 className="text-xs font-bold text-[#3D2D29] uppercase tracking-widest font-mono">Morning Routine (Step-by-Step)</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Option 1: Homemade Activity */}
            <div className="bg-white border border-[#E3C2B0]/20 rounded-xl p-4 space-y-2.5 shadow-xs text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#CBA38E] uppercase tracking-wider font-bold">
                    Homemade Remedy
                  </span>
                  <span className="text-[9px] font-mono text-[#3D2D29]/50 uppercase">Step 1</span>
                </div>
                <div>
                  <h5 className="font-bold text-[#3D2D29] font-sans text-sm">{amHomemadeRoutine?.title || morningRemedy.name}</h5>
                  <p className="text-[10px] text-[#3D2D29]/60 font-mono mt-0.5">Ingredients: {(amHomemadeRoutine?.ingredients || morningRemedy.ingredients || []).join(", ")}</p>
                </div>
                <p className="text-[11px] text-[#3D2D29]/80 leading-relaxed bg-[#FAF6F0]/60 p-2.5 rounded-lg border border-[#E3C2B0]/10">
                  <strong>Directions:</strong> {amHomemadeRoutine?.steps || amHomemadeRoutine?.preparation || morningRemedy.preparation}
                </p>

                {(amHomemadeRoutine?.title || morningRemedy?.name || "")?.toLowerCase().includes("ice") ? (
                  <div className="bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/20 text-[10px] text-[#3D2D29]/80 leading-normal">
                    <span className="font-bold text-amber-800 uppercase tracking-wide text-[8px] block">Daily Recommendation Guidance:</span>
                    Daily splash-rinsing with cold water is recommended. If using direct ice contact, limit to 2-3 times a week wrapped in a soft barrier cloth.
                  </div>
                ) : (
                  <div className="bg-[#FAF6F0]/40 p-2.5 rounded-lg border border-[#E3C2B0]/20 text-[10px] text-[#3D2D29]/80 leading-normal">
                    <span className="font-bold text-amber-950 uppercase tracking-wide text-[8px] block">Fresh Botanical Guidance:</span>
                    Fresh organic botanicals are safe for daily morning application. Use chilled solutions to de-puff and soothe redness.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#FAF6F0] flex items-center justify-between">
                <a 
                  href={getDirectYouTubeUrl(amHomemadeRoutine?.youtube_tutorial || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${amHomemadeRoutine?.title || morningRemedy.name} skincare tutorial diy step by step`)}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border border-red-200 rounded-xl text-[11px] font-bold transition font-mono shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-red-600 text-red-600 shrink-0" />
                  <span>Watch Homemade Tutorial on YouTube</span>
                  <ExternalLink className="w-3 h-3 text-red-500" />
                </a>
              </div>
            </div>

            {/* Option 2: Product Suggestion */}
            <div className="bg-white border border-[#E3C2B0]/20 rounded-xl p-4 space-y-2.5 shadow-xs text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#CBA38E] uppercase tracking-wider font-bold">
                    Daily Cleanser Product
                  </span>
                  <span className="text-[9px] font-mono text-[#3D2D29]/50 uppercase">Step 2</span>
                </div>
                <div>
                  <h5 className="font-bold text-[#3D2D29] font-sans text-sm">{cleanserProduct.brand} - {amProductRec?.type || cleanserProduct.name}</h5>
                  
                  {/* Clickable Active Ingredients Badges */}
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-[#3D2D29]/60 font-mono">Active Actives:</span>
                    {(cleanserProduct.activeIngredients || ["Niacinamide", "Hyaluronic Acid"]).map((ing: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => openIngredientDetail(ing)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FAF6F0] hover:bg-[#E3C2B0]/30 text-[#3D2D29] border border-[#E3C2B0]/40 rounded-md text-[9px] font-mono cursor-pointer transition"
                      >
                        <span>{ing}</span>
                        <Info className="w-2.5 h-2.5 text-[#CBA38E]" />
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-2 p-2 bg-amber-500/5 rounded-lg border border-amber-500/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[8px] font-mono text-amber-800 uppercase block">Verified Product</span>
                      <span className="text-[10px] text-[#3D2D29]/80 font-bold truncate block">{cleanserProduct.brand} {amProductRec?.type || cleanserProduct.name}</span>
                    </div>
                    <a
                      href={amProductRec?.amazon_link || `https://www.amazon.com/s?k=${encodeURIComponent(`${cleanserProduct.brand} ${amProductRec?.type || cleanserProduct.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-2.5 py-1 bg-[#3D2D29] hover:bg-[#3D2D29]/90 text-[#FAF6F0] rounded-md font-bold text-[9px] uppercase tracking-wider transition font-mono flex items-center gap-1"
                    >
                      <span>Buy Product</span>
                      <ExternalLink className="w-2.5 h-2.5 text-amber-300" />
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-[#3D2D29]/80 leading-relaxed bg-[#FAF6F0]/60 p-2.5 rounded-lg border border-[#E3C2B0]/10">
                  <strong>Why recommended:</strong> {amProductRec?.why || cleanserProduct.whyRecommended}
                </p>
              </div>

              <div className="pt-2 border-t border-[#FAF6F0] flex items-center justify-between">
                <a 
                  href={getDirectYouTubeUrl(analysisData?.routineVideoLinks?.morningProductUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`how to wash face properly with ${cleanserProduct.brand} ${amProductRec?.type || cleanserProduct.name} dermatologist application guide`)}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border border-red-200 rounded-xl text-[11px] font-bold transition font-mono shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-red-600 text-red-600 shrink-0" />
                  <span>Watch Product Application on YouTube</span>
                  <ExternalLink className="w-3 h-3 text-red-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Night Routine Option */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 border-l-2 border-[#CBA38E] pl-2">
            <Moon className="w-3.5 h-3.5 text-[#CBA38E]" />
            <h4 className="text-xs font-bold text-[#3D2D29] uppercase tracking-widest font-mono">Night Routine (Step-by-Step)</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Option 1: Homemade Activity */}
            <div className="bg-white border border-[#E3C2B0]/20 rounded-xl p-4 space-y-2.5 shadow-xs text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#CBA38E] uppercase tracking-wider font-bold">
                    Homemade Remedy
                  </span>
                  <span className="text-[9px] font-mono text-[#3D2D29]/50 uppercase">Step 1</span>
                </div>
                <div>
                  <h5 className="font-bold text-[#3D2D29] font-sans text-sm">{pmHomemadeRoutine?.title || eveningRemedy.name}</h5>
                  <p className="text-[10px] text-[#3D2D29]/60 font-mono mt-0.5">Ingredients: {(pmHomemadeRoutine?.ingredients || eveningRemedy.ingredients || []).join(", ")}</p>
                </div>
                <p className="text-[11px] text-[#3D2D29]/80 leading-relaxed bg-[#FAF6F0]/60 p-2.5 rounded-lg border border-[#E3C2B0]/10">
                  <strong>Directions:</strong> {pmHomemadeRoutine?.steps || pmHomemadeRoutine?.preparation || eveningRemedy.preparation}
                </p>
                <div className="bg-[#FAF6F0]/40 p-2.5 rounded-lg border border-[#E3C2B0]/20 text-[10px] text-[#3D2D29]/80 leading-normal">
                  <span className="font-bold text-amber-950 uppercase tracking-wide text-[8px] block">Night Barrier Repair Benefit:</span>
                  {eveningRemedy.benefit}
                </div>
              </div>

              <div className="pt-2 border-t border-[#FAF6F0] flex items-center justify-between">
                <a 
                  href={getDirectYouTubeUrl(pmHomemadeRoutine?.youtube_tutorial || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${pmHomemadeRoutine?.title || eveningRemedy.name} DIY tutorial step by step face mask barrier repair`)}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border border-red-200 rounded-xl text-[11px] font-bold transition font-mono shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-red-600 text-red-600 shrink-0" />
                  <span>Watch Homemade Tutorial on YouTube</span>
                  <ExternalLink className="w-3 h-3 text-red-500" />
                </a>
              </div>
            </div>

            {/* Option 2: Product Suggestion */}
            <div className="bg-white border border-[#E3C2B0]/20 rounded-xl p-4 space-y-2.5 shadow-xs text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#CBA38E] uppercase tracking-wider font-bold">
                    Active Treatment Product
                  </span>
                  <span className="text-[9px] font-mono text-[#3D2D29]/50 uppercase">Step 2</span>
                </div>
                <div>
                  <h5 className="font-bold text-[#3D2D29] font-sans text-sm">{treatmentProduct.brand} - {pmProductRec?.type || treatmentProduct.name}</h5>
                  
                  {/* Clickable Active Ingredients Badges */}
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-[#3D2D29]/60 font-mono">Active Actives:</span>
                    {(treatmentProduct.activeIngredients || ["Salicylic Acid", "Ceramides"]).map((ing: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => openIngredientDetail(ing)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FAF6F0] hover:bg-[#E3C2B0]/30 text-[#3D2D29] border border-[#E3C2B0]/40 rounded-md text-[9px] font-mono cursor-pointer transition"
                      >
                        <span>{ing}</span>
                        <Info className="w-2.5 h-2.5 text-[#CBA38E]" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 p-2 bg-amber-500/5 rounded-lg border border-amber-500/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[8px] font-mono text-amber-800 uppercase block">Verified Product</span>
                      <span className="text-[10px] text-[#3D2D29]/80 font-bold truncate block">{treatmentProduct.brand} {pmProductRec?.type || treatmentProduct.name}</span>
                    </div>
                    <a
                      href={pmProductRec?.amazon_link || `https://www.amazon.com/s?k=${encodeURIComponent(`${treatmentProduct.brand} ${pmProductRec?.type || treatmentProduct.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-2.5 py-1 bg-[#3D2D29] hover:bg-[#3D2D29]/90 text-[#FAF6F0] rounded-md font-bold text-[9px] uppercase tracking-wider transition font-mono flex items-center gap-1"
                    >
                      <span>Buy Product</span>
                      <ExternalLink className="w-2.5 h-2.5 text-amber-300" />
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-[#3D2D29]/80 leading-relaxed bg-[#FAF6F0]/60 p-2.5 rounded-lg border border-[#E3C2B0]/10">
                  <strong>Why recommended:</strong> {pmProductRec?.why || treatmentProduct.whyRecommended}
                </p>
              </div>

              <div className="pt-2 border-t border-[#FAF6F0] flex items-center justify-between">
                <a 
                  href={getDirectYouTubeUrl(analysisData?.routineVideoLinks?.eveningProductUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`how to apply ${treatmentProduct.brand} ${pmProductRec?.type || treatmentProduct.name} routine tutorial dermatologist guide`)}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border border-red-200 rounded-xl text-[11px] font-bold transition font-mono shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-red-600 text-red-600 shrink-0" />
                  <span>Watch Product Application on YouTube</span>
                  <ExternalLink className="w-3 h-3 text-red-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Weekly Specialty Ritual (Homemade & Clinical Options) */}
      <div className="bg-[#FAF6F0] border border-[#E3C2B0]/40 rounded-3xl p-5 sm:p-6 space-y-4" id="section-5-weekly">
        <div className="flex items-center gap-2 border-b border-[#E3C2B0]/30 pb-3">
          <span className="px-2 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[8px] font-mono font-bold uppercase rounded-md tracking-wider">
            5. WEEKLY RITUAL
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#3D2D29] font-sans">Weekly Specialty Ritual (Sunday Reset)</h3>
        </div>

        <p className="text-xs text-[#3D2D29]/80 leading-relaxed font-sans">
          Every Sunday, reset your skin barrier after a busy week. You can choose either the <strong>Homemade Botanical Mask</strong> or the <strong>Clinical Treatment Product</strong> (or alternate weekly) to clear cellular debris and infuse deep hydration.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Sunday Homemade Specialty Mask */}
          <div className="bg-white border border-[#E3C2B0]/20 rounded-xl p-4 space-y-3 shadow-xs text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-2">
                <span className="text-[9px] font-mono text-[#CBA38E] uppercase tracking-wider font-bold">
                  Option 1: Sunday Homemade Mask
                </span>
                <span className="text-[10px] text-[#CBA38E] font-mono font-bold">
                  Natural Reset
                </span>
              </div>
              
              <div>
                <h5 className="font-bold text-[#3D2D29] font-sans text-sm">{weeklyHomemadeRoutine?.title || monthlyRemedy.name}</h5>
                <p className="text-[10px] text-[#3D2D29]/60 font-mono mt-0.5">Ingredients: {(weeklyHomemadeRoutine?.ingredients || monthlyRemedy.ingredients || []).join(", ")}</p>
              </div>
              
              <p className="text-[11px] text-[#3D2D29]/80 leading-relaxed bg-[#FAF6F0]/60 p-3 rounded-lg border border-[#E3C2B0]/10 font-sans">
                <strong>Directions:</strong> {weeklyHomemadeRoutine?.steps || weeklyHomemadeRoutine?.preparation || monthlyRemedy.preparation}
              </p>
              
              <div className="bg-[#FAF6F0]/40 p-2.5 rounded-lg border border-[#E3C2B0]/20 text-[10px] text-[#3D2D29]/80 leading-normal">
                <span className="font-bold text-amber-950 uppercase tracking-wide text-[8px] block">Weekly Reset Benefit:</span>
                {monthlyRemedy.benefit}
              </div>
            </div>
            
            <div className="pt-2 flex items-center justify-between border-t border-[#FAF6F0]">
              <a 
                href={getDirectYouTubeUrl(weeklyHomemadeRoutine?.youtube_tutorial || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${weeklyHomemadeRoutine?.title || monthlyRemedy.name} DIY mask mix and apply tutorial step by step`)}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border border-red-200 rounded-xl text-[11px] font-bold transition font-mono shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-red-600 text-red-600 shrink-0" />
                <span>Watch Sunday DIY Tutorial on YouTube</span>
                <ExternalLink className="w-3 h-3 text-red-500" />
              </a>
            </div>
          </div>

          {/* Option 2: Sunday Clinical Weekly Treatment Product */}
          <div className="bg-white border border-[#E3C2B0]/20 rounded-xl p-4 space-y-3 shadow-xs text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-2">
                <span className="text-[9px] font-mono text-[#CBA38E] uppercase tracking-wider font-bold">
                  Option 2: Sunday Clinical Product
                </span>
                <span className="text-[10px] text-[#CBA38E] font-mono font-bold">
                  Active Renewal
                </span>
              </div>
              
              <div>
                <h5 className="font-bold text-[#3D2D29] font-sans text-sm">{weeklyProductRec?.brand} - {weeklyProductRec?.name}</h5>
                
                {/* Clickable Active Ingredients Badges */}
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-[#3D2D29]/60 font-mono">Actives:</span>
                  {(weeklyProductRec?.activeIngredients || ["2% Salicylic Acid (BHA)", "Green Tea Extract"]).map((ing: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => openIngredientDetail(ing)}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FAF6F0] hover:bg-[#E3C2B0]/30 text-[#3D2D29] border border-[#E3C2B0]/40 rounded-md text-[9px] font-mono cursor-pointer transition"
                    >
                      <span>{ing}</span>
                      <Info className="w-2.5 h-2.5 text-[#CBA38E]" />
                    </button>
                  ))}
                </div>

                <div className="mt-2 p-2 bg-amber-500/5 rounded-lg border border-amber-500/10 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[8px] font-mono text-amber-800 uppercase block">Weekly Clinical Pick</span>
                    <span className="text-[10px] text-[#3D2D29]/80 font-bold truncate block">{weeklyProductRec?.brand} {weeklyProductRec?.name}</span>
                  </div>
                  <a
                    href={weeklyProductRec?.amazon_link || `https://www.amazon.com/s?k=${encodeURIComponent(`${weeklyProductRec?.brand} ${weeklyProductRec?.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-2.5 py-1 bg-[#3D2D29] hover:bg-[#3D2D29]/90 text-[#FAF6F0] rounded-md font-bold text-[9px] uppercase tracking-wider transition font-mono flex items-center gap-1"
                  >
                    <span>Buy Product</span>
                    <ExternalLink className="w-2.5 h-2.5 text-amber-300" />
                  </a>
                </div>
              </div>
              
              <p className="text-[11px] text-[#3D2D29]/80 leading-relaxed bg-[#FAF6F0]/60 p-3 rounded-lg border border-[#E3C2B0]/10 font-sans">
                <strong>Why recommended:</strong> {weeklyProductRec?.whyRecommended || "Deep cellular exfoliation that dissolves sebum clogging and accelerates glass-skin smoothness."}
              </p>
            </div>
            
            <div className="pt-2 flex items-center justify-between border-t border-[#FAF6F0]">
              <a 
                href={getDirectYouTubeUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(`how to use ${weeklyProductRec?.brand || "Paula's Choice"} ${weeklyProductRec?.name || "2% BHA Liquid Exfoliant"} properly step by step`)}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border border-red-200 rounded-xl text-[11px] font-bold transition font-mono shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-red-600 text-red-600 shrink-0" />
                <span>Watch Product Guide on YouTube</span>
                <ExternalLink className="w-3 h-3 text-red-500" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Global Medical Disclaimer Banner */}
      <div className="bg-[#F4EDE4]/60 border border-[#E3C2B0]/40 rounded-2xl p-4 text-[11px] text-[#3D2D29]/75 leading-relaxed text-center font-sans space-y-1 my-4">
        <strong className="text-[#3D2D29] block uppercase tracking-wider font-mono text-[9px]">Medical & Skincare Disclaimer</strong>
        <p>
          {analysisData?.globalDisclaimer || "Skn Lab provides general skincare guidance based on visual analysis and is not a medical diagnosis. If symptoms are severe, painful, spreading, or not improving after 4-6 weeks, please see a licensed dermatologist."}
        </p>
      </div>

      {/* SOCIAL SHARING MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#E3C2B0]/80 shadow-2xl max-w-md w-full p-6 space-y-5 relative text-left">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E3C2B0]/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E879A0]/15 flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-[#E879A0]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3D2D29]">Share Skin Journey</h3>
                  <p className="text-[10px] font-mono text-[#CBA38E] uppercase tracking-wider">SKN LAB Preview Card</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4EDE4] hover:bg-[#E3C2B0]/40 flex items-center justify-center text-[#3D2D29] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Share Preview Card */}
            <div className="bg-white rounded-2xl p-4 border border-[#E3C2B0]/30 shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-serif italic font-bold text-lg text-[#1C120C]">Skin</span>
                <span className="px-2 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[8px] font-mono font-bold uppercase rounded-md">
                  VERIFIED REPORT
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#3D2D29] text-[#FAF6F0] flex items-center justify-center font-mono font-bold text-lg shadow-inner">
                  {analysisData?.skinScore || 75}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3D2D29]">
                    {customerName}'s {((selectedConcerns || []).length >= 3 || (selectedConcerns || []).some((c) => /acne|congestion|redness|sensitivity/i.test(c))) ? "3-Week" : "2-Week"} Target
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold font-mono">
                    Projected: {Math.min(96, (analysisData?.skinScore || 75) + 22)} pts (Glass Skin)
                  </p>
                  <p className="text-[10px] text-[#3D2D29]/60 font-sans">
                    Type: {analysisData?.skinType || "Combination"}
                  </p>
                </div>
              </div>

              <div className="pt-1 text-[10px] text-[#3D2D29]/70 italic border-t border-[#F4EDE4]">
                "Generated personalized {((selectedConcerns || []).length >= 3 || (selectedConcerns || []).some((c) => /acne|congestion|redness|sensitivity/i.test(c))) ? "3-week" : "2-week"} routine & facial mapping via SKN LAB."
              </div>
            </div>

            {/* Copy Share Link Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#3D2D29]/80 uppercase tracking-wider block">
                Shareable Preview Link
              </label>
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E3C2B0]/50 shadow-2xs">
                <input
                  type="text"
                  readOnly
                  value={getShareableUrl()}
                  className="w-full text-xs font-mono text-[#3D2D29] px-2 py-1 bg-transparent focus:outline-none truncate"
                />
                <button
                  onClick={handleCopyShareLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    shareCopied
                      ? "bg-emerald-600 text-white"
                      : "bg-[#3D2D29] hover:bg-[#3D2D29]/90 text-[#FAF6F0]"
                  }`}
                >
                  {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#E3C2B0]" />}
                  {shareCopied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* WhatsApp Share Button */}
            <div className="space-y-2 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my personalized SKN LAB Skin Journey report: ${getShareableUrl()}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer font-mono uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ACTIVE INGREDIENTS BENEFIT GUIDE MODAL */}
      <ActiveIngredientsModal
        isOpen={isIngredientModalOpen}
        onClose={() => setIsIngredientModalOpen(false)}
        initialIngredientId={selectedIngredientId}
      />

    </div>
  );
}
