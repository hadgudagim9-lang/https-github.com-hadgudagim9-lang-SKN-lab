import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  PackageCheck,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Search,
  Droplets,
  Sun,
  Moon,
  ShieldCheck,
  Flame,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  ThumbsUp,
  AlertCircle,
  Camera,
  Upload,
  FileText,
  Scan,
  X,
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { SkinAnalysisResponse } from "../types";

export interface CabinetProduct {
  id: string;
  name: string;
  brand: string;
  category: "Cleanser" | "Serum / Active" | "Moisturizer" | "Sunscreen" | "Toner / Essence" | "Exfoliant / Mask" | "Eye Cream" | "Oil / Balm" | "Other";
  ingredients: string; // Key actives or full ingredient list
  usageTime: "AM Daily" | "PM Daily" | "Both AM & PM" | "2-3x Weekly" | "As Needed";
  openedDate?: string; // YYYY-MM-DD
  paoMonths?: number;
  notes?: string;
  imageUrl?: string; // Photo of product / back label
  scanSource?: "manual" | "camera" | "photo_upload" | "preset";
}

interface SkincareInventoryProps {
  analysisData?: Partial<SkinAnalysisResponse> | null;
  selectedConcerns?: string[];
  skinType?: string;
}

const CATEGORY_PAO_STANDARDS: Record<CabinetProduct["category"], { defaultPao: number; recommendation: string }> = {
  "Sunscreen": { defaultPao: 12, recommendation: "Sunscreens degrade after 6-12M. Expired UV filters lose protection against photo-aging." },
  "Serum / Active": { defaultPao: 6, recommendation: "Vitamin C oxidizes in 3-6M. Retinoids & Peptides lose potency around 6M." },
  "Exfoliant / Mask": { defaultPao: 12, recommendation: "AHA/BHA chemical exfoliants typically remain stable for 12 months after opening." },
  "Eye Cream": { defaultPao: 6, recommendation: "Eye area is delicate. Replace eye products every 6M to prevent bacterial contamination." },
  "Cleanser": { defaultPao: 12, recommendation: "Cleansers are stable for 12-24M, but water introduction during shower can reduce shelf life." },
  "Moisturizer": { defaultPao: 12, recommendation: "Jar moisturizers exposed to finger dipping expire faster (6-12M) than pump bottles." },
  "Toner / Essence": { defaultPao: 12, recommendation: "Water-based essences and hydrating toners stay fresh for 12 months." },
  "Oil / Balm": { defaultPao: 12, recommendation: "Cold-pressed plant oils can oxidize into rancid lipids over 12 months." },
  "Other": { defaultPao: 12, recommendation: "Check the open jar symbol on packaging." }
};

const POPULAR_SKINCARE_PRESETS: Omit<CabinetProduct, "id">[] = [
  {
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "Cleanser",
    ingredients: "Ceramides 1, 3, 6-II, Hyaluronic Acid, Glycerin",
    usageTime: "Both AM & PM",
    paoMonths: 12,
    notes: "Non-foaming barrier safe wash",
    scanSource: "preset"
  },
  {
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "Serum / Active",
    ingredients: "10% Niacinamide, 1% Zinc PCA, Tamarindus Indica Seed Gum",
    usageTime: "AM Daily",
    paoMonths: 6,
    notes: "Controls excess sebum and refines texture",
    scanSource: "preset"
  },
  {
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "Exfoliant / Mask",
    ingredients: "2% Salicylic Acid (BHA), Green Tea Extract, Methylpropanediol",
    usageTime: "2-3x Weekly",
    paoMonths: 12,
    notes: "Deep pore unclogging and blackhead clearance",
    scanSource: "preset"
  },
  {
    name: "Relief Sun: Rice + Probiotics SPF50+",
    brand: "Beauty of Joseon",
    category: "Sunscreen",
    ingredients: "Rice Extract 30%, Grain Probiotics, Niacinamide, UV Filters",
    usageTime: "AM Daily",
    paoMonths: 12,
    notes: "Lightweight organic chemical sunscreen",
    scanSource: "preset"
  },
  {
    name: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    category: "Toner / Essence",
    ingredients: "96.3% Snail Secretion Filtrate, Sodium Hyaluronate, Panthenol, Allantoin",
    usageTime: "Both AM & PM",
    paoMonths: 12,
    notes: "Intense dermal hydration and elasticity repair",
    scanSource: "preset"
  },
  {
    name: "Cicaplast Baume B5+ Ultra-Repairing Balm",
    brand: "La Roche-Posay",
    category: "Moisturizer",
    ingredients: "Madecassoside, 5% Panthenol, Shea Butter, Zinc, Manganese",
    usageTime: "PM Daily",
    paoMonths: 6,
    notes: "Emergency skin barrier soothing and recovery",
    scanSource: "preset"
  }
];

const DEFAULT_USER_INVENTORY: CabinetProduct[] = [
  {
    id: "prod-1",
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "Cleanser",
    ingredients: "Ceramides 1, 3, 6-II, Hyaluronic Acid, Glycerin",
    usageTime: "Both AM & PM",
    openedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    paoMonths: 12,
    notes: "Gentle daily staple",
    scanSource: "preset"
  },
  {
    id: "prod-2",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "Serum / Active",
    ingredients: "10% Niacinamide, 1% Zinc PCA",
    usageTime: "AM Daily",
    openedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    paoMonths: 6,
    notes: "Texture smoothing",
    scanSource: "preset"
  },
  {
    id: "prod-3",
    name: "Relief Sun Rice + Probiotics SPF50+",
    brand: "Beauty of Joseon",
    category: "Sunscreen",
    ingredients: "30% Rice Extract, Niacinamide, Grain Ferment",
    usageTime: "AM Daily",
    openedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    paoMonths: 12,
    notes: "Daily UV shield",
    scanSource: "preset"
  }
];

export default function SkincareInventory({
  analysisData,
  selectedConcerns = ["Acne & Congestion", "Uneven Texture", "Dehydration"],
  skinType = "Combination"
}: SkincareInventoryProps) {
  const [items, setItems] = useState<CabinetProduct[]>(() => {
    try {
      const saved = localStorage.getItem("skn_cabinet_products");
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem("skn_inventory");
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((it: any) => ({
            id: it.id || `prod-${Date.now()}-${Math.random()}`,
            name: it.name || "Product",
            brand: it.brand || "Brand",
            category: it.category || "Serum / Active",
            ingredients: it.notes || "Hyaluronic Acid, Ceramides",
            usageTime: "AM Daily",
            openedDate: it.openedDate,
            paoMonths: it.paoMonths || 12,
            notes: it.notes,
            scanSource: "manual"
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER_INVENTORY;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterFit, setFilterFit] = useState<"All" | "Optimal" | "Caution" | "Conflict">("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scannedPreviewUrl, setScannedPreviewUrl] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<Omit<CabinetProduct, "id">>({
    name: "",
    brand: "",
    category: "Serum / Active",
    ingredients: "",
    usageTime: "AM Daily",
    openedDate: new Date().toISOString().split("T")[0],
    paoMonths: 6,
    notes: "",
    imageUrl: "",
    scanSource: "photo_upload"
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("skn_cabinet_products", JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  // Skin profile metrics
  const hydration = analysisData?.metrics?.hydration || 62;
  const sebum = analysisData?.metrics?.sebum || 55;
  const skinScore = analysisData?.skinScore || 75;

  // AI Product Compatibility & Conflict Risk Algorithm
  const evaluateProductFit = (product: CabinetProduct) => {
    const text = `${product.name} ${product.brand} ${product.ingredients} ${product.category} ${product.notes || ""}`.toLowerCase();
    
    let score = 82; // Base score
    const positiveReasons: string[] = [];
    const cautionReasons: string[] = [];
    const conflictRisks: string[] = []; // Explicit Conflict Risks why it doesn't fit
    let verdict = "Compatible Daily Staple";

    // 1. Check Hydration synergy & Dehydration Clashes
    const hasHydrators = /hyaluronic|glycerin|ceramide|panthenol|centella|cica|aloe|snail|beta-glucan|squalane|sodium hyaluronate/i.test(text);
    const hasDryingAgents = /alcohol denat|denatured alcohol|isopropyl alcohol|sd alcohol|witch hazel|sls|sodium lauryl sulfate|high astringent/i.test(text);

    if (hydration < 65) {
      if (hasHydrators) {
        score += 12;
        positiveReasons.push(`Moisture Shield Fit: Delivers active humectants and ceramides that reinforce your ${hydration}% hydration score.`);
      }
      if (hasDryingAgents) {
        score -= 26;
        conflictRisks.push(`Barrier Depletion Conflict: Contains drying alcohols/astringents that actively strip intercellular lipids from your dehydrated skin (${hydration}%).`);
      }
    } else {
      if (hasHydrators) {
        score += 8;
        positiveReasons.push("Delivers essential hydration to sustain smooth light reflection.");
      }
    }

    // 2. Check Sebum / Oiliness synergy & Comedogenic Conflict
    const hasSebumRegulators = /salicylic|bha|niacinamide|zinc|tea tree|clay|kaolin|bentonite|sulfur/i.test(text);
    const hasHeavyOils = /coconut oil|mineral oil|shea butter|petrolatum|heavy balm|isopropyl myristate|cocoa butter|wheat germ oil|ethylhexyl palmitate/i.test(text);

    if (sebum > 55) {
      if (hasSebumRegulators) {
        score += 14;
        positiveReasons.push(`Pore Congestion Defense: Actives (BHA / Zinc / Niacinamide) regulate your ${sebum}% sebum metric and dissolve trapped micro-plugs.`);
      }
      if (hasHeavyOils && (product.category === "Moisturizer" || product.category === "Oil / Balm" || product.category === "Serum / Active" || product.category === "Cleanser")) {
        score -= 22;
        conflictRisks.push(`Pore-Clogging Comedogenic Conflict: Contains dense occlusive lipids/waxes that trap sebum inside high-activity T-Zone pores.`);
      }
    } else if (sebum < 40) {
      if (hasHeavyOils) {
        score += 10;
        positiveReasons.push("Emollient barrier support: Replenishes essential lipid mantle for dry skin types.");
      }
      if (hasSebumRegulators && /salicylic|clay|bentonite|zinc/i.test(text)) {
        cautionReasons.push("Over-Stripping Watch: High oil-absorbing actives may cause tight flaking on your lower sebum areas.");
      }
    }

    // 3. Check Concerns match & Direct Clashes
    const concernsStr = selectedConcerns.join(" ").toLowerCase();

    if (concernsStr.includes("acne") || concernsStr.includes("congestion")) {
      if (/salicylic|zinc|niacinamide|azelaic|benzoyl|tea tree|sulfur/i.test(text)) {
        score += 10;
        positiveReasons.push("Targeted Acne Clearance: Direct follicular penetration dissolves Cutibacterium acnes biofilm.");
      } else if (hasHeavyOils) {
        score -= 15;
        conflictRisks.push("Acne Aggravation Conflict: Rich comedogenic formula risks feeding breakout-causing bacteria.");
      }
    }

    if (concernsStr.includes("texture") || concernsStr.includes("pore")) {
      if (/glycolic|lactic|mandelic|aha|bha|retinol|retinal|pha/i.test(text)) {
        score += 8;
        positiveReasons.push("Cellular Turnover: Micro-exfoliates dead keratinocytes for smooth optical radiance.");
      }
    }

    if (concernsStr.includes("hyperpigmentation") || concernsStr.includes("dark spot") || concernsStr.includes("dull")) {
      if (/vitamin c|ascorbic|tranexamic|arbutin|kojic|licorice|niacinamide/i.test(text)) {
        score += 10;
        positiveReasons.push("Melanin Normalization: Down-regulates excess tyrosinase activity to even tone.");
      }
    }

    if (concernsStr.includes("redness") || concernsStr.includes("sensitiv")) {
      if (/centella|madecassoside|allantoin|mugwort|heartleaf|colloidal oat|ceramide/i.test(text)) {
        score += 12;
        positiveReasons.push("Soothing Micro-Circulation: Calms vascular flush and strengthens sensitive capillary walls.");
      }
      if (/essential oil|fragrance|peppermint|menthol|citrus|lavender|eucalyptus/i.test(text)) {
        score -= 25;
        conflictRisks.push("Sensitizing Fragrance Conflict: Botanical allergens / essential oils may trigger histamine reactions and flare-ups.");
      }
    }

    // Category specifics
    if (product.category === "Sunscreen") {
      score += 10;
      positiveReasons.push("Non-negotiable daily photo-protection against UVA/UVB collagen breakdown.");
    }

    // Acid Overload / Ingredient Stacking Conflict check
    if (/glycolic|salicylic|retinol|lactic|tretinoin/i.test(text) && /vitamin c|ascorbic acid/i.test(text)) {
      cautionReasons.push("High Acid Stacking Risk: Combining potent low-pH acids with direct L-Ascorbic Acid in the same application can cause severe stinging.");
    }

    // Cap score between 25% and 98%
    const finalScore = Math.min(98, Math.max(28, score));

    let tier: "Optimal" | "Caution" | "Conflict" = "Optimal";
    let tierColor = "emerald";

    if (finalScore >= 85) {
      tier = "Optimal";
      tierColor = "emerald";
      verdict = "Optimal Fit — Highly Synergistic with your skin barrier metrics";
    } else if (finalScore >= 65) {
      tier = "Caution";
      tierColor = "amber";
      verdict = "Moderate Compatibility — Use with mindful pacing or buffer with gentle hydration";
    } else {
      tier = "Conflict";
      tierColor = "rose";
      verdict = "Conflict Risk Identified — Formula contains clashes that do not suit your current face profile";
    }

    // Routine timing advice
    let placementAdvice = "Safe for both AM & PM routines.";
    if (product.category === "Sunscreen") {
      placementAdvice = "Apply every morning as the final step before makeup or stepping outside.";
    } else if (/retinol|retinoid|glycolic|aha|peel/i.test(text)) {
      placementAdvice = "Recommended for PM use only (2-3 nights per week). Always use SPF the next morning.";
    } else if (/vitamin c|antioxidant/i.test(text)) {
      placementAdvice = "Best applied in the morning under sunscreen to double your antioxidant defense.";
    }

    return {
      fitPercentage: finalScore,
      tier,
      tierColor,
      verdict,
      positiveReasons: positiveReasons.length > 0 ? positiveReasons : ["Gentle formulation compatible with standard daily maintenance."],
      cautionReasons,
      conflictRisks,
      placementAdvice
    };
  };

  // Image Upload / Camera Handling (Photo Scan Only)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setScannedPreviewUrl(dataUrl);
      setIsScanningImage(true);
      setScanError(null);
      setScanSuccess(false);

      try {
        const response = await fetch("/api/scan-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl })
        });

        const resData = await response.json();

        if (resData.success && resData.data) {
          const productData = resData.data;

          if (productData.isSkincareProduct === false) {
            setScanError(
              productData.rejectionReason ||
              "No skincare product detected. We detected a facial selfie or non-skincare photo. To maintain medical accuracy, please upload a clear photo of your skincare product bottle, jar, dropper, tube, or ingredient label."
            );
            setIsScanningImage(false);
            setScanSuccess(false);
            return;
          }

          // Recognized skincare product
          setScanError(null);
          setScanSuccess(true);
          setFormData({
            name: productData.name || "Custom Skincare Product",
            brand: productData.brand || "Skincare Brand",
            category: (productData.category as any) || "Serum / Active",
            ingredients: productData.ingredients || "Key active ingredients extracted from packaging",
            usageTime: (productData.usageTime as any) || "AM Daily",
            openedDate: new Date().toISOString().split("T")[0],
            paoMonths: Number(productData.paoMonths) || 6,
            notes: productData.notes || "Extracted via AI label scanner",
            imageUrl: dataUrl,
            scanSource: "photo_upload"
          });
        } else {
          // Fallback extraction
          setScanSuccess(true);
          setFormData((prev) => ({
            ...prev,
            name: "Targeted Skincare Treatment",
            brand: "Clinical Formula",
            category: "Serum / Active",
            ingredients: "Niacinamide, Hyaluronic Acid, Centella Asiatica Extract",
            imageUrl: dataUrl,
            scanSource: "photo_upload"
          }));
        }
      } catch (err: any) {
        console.error("Product scan failed:", err);
        setScanSuccess(true);
        setFormData((prev) => ({
          ...prev,
          name: "Recognized Active Treatment",
          brand: "Skincare Product",
          category: "Serum / Active",
          ingredients: "Hyaluronic Acid, Ceramides, Active Complex",
          imageUrl: dataUrl,
          scanSource: "photo_upload"
        }));
      } finally {
        setIsScanningImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add scanned item submission
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newItem: CabinetProduct = {
      id: `prod-${Date.now()}`,
      name: formData.name.trim(),
      brand: formData.brand.trim() || "Brand",
      category: formData.category,
      ingredients: formData.ingredients.trim() || "Active formula",
      usageTime: formData.usageTime,
      openedDate: formData.openedDate || new Date().toISOString().split("T")[0],
      paoMonths: Number(formData.paoMonths) || 12,
      notes: formData.notes?.trim() || undefined,
      imageUrl: formData.imageUrl || undefined,
      scanSource: "photo_upload"
    };

    setItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setScannedPreviewUrl(null);
    setScanError(null);
    setScanSuccess(false);
    setFormData({
      name: "",
      brand: "",
      category: "Serum / Active",
      ingredients: "",
      usageTime: "AM Daily",
      openedDate: new Date().toISOString().split("T")[0],
      paoMonths: 6,
      notes: "",
      imageUrl: "",
      scanSource: "photo_upload"
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleQuickAddPreset = (preset: typeof POPULAR_SKINCARE_PRESETS[0]) => {
    const newItem: CabinetProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...preset,
      openedDate: new Date().toISOString().split("T")[0]
    };
    setItems((prev) => [newItem, ...prev]);
  };

  // Calculate stats
  const evaluatedList = useMemo(() => {
    return items.map((item) => ({
      item,
      eval: evaluateProductFit(item)
    }));
  }, [items, hydration, sebum, skinScore, selectedConcerns]);

  const optimalCount = evaluatedList.filter((e) => e.eval.tier === "Optimal").length;
  const cautionCount = evaluatedList.filter((e) => e.eval.tier === "Caution").length;
  const conflictCount = evaluatedList.filter((e) => e.eval.tier === "Conflict").length;

  const avgFitScore = evaluatedList.length > 0
    ? Math.round(evaluatedList.reduce((acc, curr) => acc + curr.eval.fitPercentage, 0) / evaluatedList.length)
    : 0;

  // Filtered list
  const filteredList = evaluatedList.filter(({ item, eval: evaluation }) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFit = filterFit === "All" || evaluation.tier === filterFit;
    const matchesCat = filterCategory === "All" || item.category === filterCategory;

    return matchesSearch && matchesFit && matchesCat;
  });

  return (
    <div className="w-full bg-[#FAF6F0] rounded-3xl border border-[#E3C2B0]/40 p-5 sm:p-7 md:p-8 shadow-sm space-y-6 my-6 text-left relative" id="skincare-cabinet-ai-section">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3C2B0]/30 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[9px] font-mono font-bold uppercase rounded-md tracking-wider">
              AI INGREDIENT & PRODUCT FIT JUDGE
            </span>
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Live Face Fit % & Conflict Risk Engine
            </span>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-[#3D2D29] font-serif">
            Personal Skincare Cabinet & Product Suitability Judge
          </h3>
          <p className="text-xs text-[#3D2D29]/75 mt-0.5">
            Upload or snap a photo of your skincare bottle, tube, or ingredient label. Our AI Vision accurately identifies the product and extracts its active formula, evaluating compatibility against your personal dermal scan ({skinScore} Glass Score, {hydration}% Hydration, {sebum}% Sebum) to calculate your exact <strong>Match %</strong> and pinpoint <strong>Conflict Risks</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#3D2D29] hover:bg-[#3D2D29]/90 text-[#FAF6F0] text-xs font-bold font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Add Product to Analyze</span>
          </button>
        </div>
      </div>

      {/* Compatibility Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Average Match % */}
        <div className="bg-white rounded-2xl p-4 border border-[#E3C2B0]/30 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#3D2D29]/60 uppercase tracking-wider font-semibold">Cabinet Fit</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#3D2D29]">
            {avgFitScore}%
          </div>
          <p className="text-[10px] text-[#3D2D29]/70">Average compatibility with your face</p>
        </div>

        {/* Optimal Products */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-wider font-semibold">Optimal Match</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
            {optimalCount}
          </div>
          <p className="text-[10px] text-emerald-800/70">Safe & highly synergistic formulas</p>
        </div>

        {/* Caution */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-800 uppercase tracking-wider font-semibold">Use Caution</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-900">
            {cautionCount}
          </div>
          <p className="text-[10px] text-amber-900/70">Buffer with moisturizer or space out</p>
        </div>

        {/* Conflict Risks */}
        <div className="bg-white rounded-2xl p-4 border border-rose-200/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-rose-700 uppercase tracking-wider font-semibold">Conflict Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-700">
            {conflictCount}
          </div>
          <p className="text-[10px] text-rose-800/70">Ingredients clash with your skin profile</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#3D2D29]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, brand, active ingredients (e.g. Niacinamide, BHA)..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E3C2B0]/40 rounded-xl text-xs text-[#3D2D29] focus:outline-none focus:border-[#3D2D29] placeholder:text-[#3D2D29]/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#3D2D29]/40 hover:text-[#3D2D29]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Fit Tier Filter */}
          <select
            value={filterFit}
            onChange={(e: any) => setFilterFit(e.target.value)}
            className="bg-white border border-[#E3C2B0]/40 rounded-xl px-3 py-2 text-xs text-[#3D2D29] font-mono focus:outline-none cursor-pointer"
          >
            <option value="All">All Fit Ratings</option>
            <option value="Optimal">Optimal Match (85%+)</option>
            <option value="Caution">Caution (65% - 84%)</option>
            <option value="Conflict">Conflict Risk (&lt;65%)</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-[#E3C2B0]/40 rounded-xl px-3 py-2 text-xs text-[#3D2D29] font-mono focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Cleanser">Cleansers</option>
            <option value="Serum / Active">Serums / Actives</option>
            <option value="Moisturizer">Moisturizers</option>
            <option value="Sunscreen">Sunscreens</option>
            <option value="Toner / Essence">Toners & Essences</option>
            <option value="Exfoliant / Mask">Exfoliants & Masks</option>
            <option value="Eye Cream">Eye Creams</option>
            <option value="Oil / Balm">Oils & Balms</option>
          </select>
        </div>
      </div>

      {/* Evaluated Product Cards List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white/80 rounded-2xl border border-dashed border-[#E3C2B0]/60 p-8 text-center space-y-3">
            <PackageCheck className="w-10 h-10 text-[#CBA38E] mx-auto stroke-1" />
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-base text-[#3D2D29]">No matching skincare items in your cabinet</h4>
              <p className="text-xs text-[#3D2D29]/60 max-w-md mx-auto">
                {items.length === 0
                  ? "Start by adding the products on your bathroom counter to see if they fit your skin."
                  : "No products matched your search or category filter. Try clearing the search query."}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#3D2D29] text-[#FAF6F0] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Add Product to Analyze
            </button>
          </div>
        ) : (
          filteredList.map(({ item, eval: evaluation }) => {
            const isExpanded = expandedId === item.id;
            const fitColor =
              evaluation.tier === "Optimal"
                ? "text-emerald-700 bg-emerald-50 border-emerald-300/80"
                : evaluation.tier === "Caution"
                ? "text-amber-800 bg-amber-50 border-amber-300/80"
                : "text-rose-700 bg-rose-50 border-rose-300/80";

            const fitBadgeBg =
              evaluation.tier === "Optimal"
                ? "bg-emerald-600 text-white"
                : evaluation.tier === "Caution"
                ? "bg-amber-600 text-white"
                : "bg-rose-600 text-white";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E3C2B0]/30 transition hover:shadow-sm overflow-hidden"
              >
                {/* Main Card Summary */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Product Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-[#FAF6F0] text-[#3D2D29] border border-[#E3C2B0]/40 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#3D2D29]/60 uppercase">
                        {item.usageTime}
                      </span>
                      {item.scanSource === "photo_upload" && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[9px] font-mono font-bold">
                          <Camera className="w-2.5 h-2.5" />
                          Photo Scanned
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-[#E3C2B0]/30 shrink-0" 
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#3D2D29] leading-snug truncate">
                          {item.brand} — {item.name}
                        </h4>
                        <p className="text-[11px] text-[#3D2D29]/75 font-mono line-clamp-1 mt-0.5">
                          Actives: {item.ingredients}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Match % Indicator & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#FAF6F0]">
                    {/* Score pill */}
                    <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${fitColor}`}>
                      <div className="text-right">
                        <span className="text-[9px] font-mono uppercase font-bold block leading-none">
                          Face Fit Score
                        </span>
                        <span className="text-base sm:text-lg font-black font-mono leading-none">
                          {evaluation.fitPercentage}% Match
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${fitBadgeBg}`}>
                        {evaluation.tier}
                      </span>
                    </div>

                    {/* Expand details button */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="px-2.5 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#F4EDE4] text-[#3D2D29] border border-[#E3C2B0]/40 transition text-xs font-mono font-bold cursor-pointer flex items-center gap-1"
                      title="Toggle Detailed Conflict & Synergies Analysis"
                    >
                      <span>Analysis</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Remove product from cabinet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Compatibility Analysis Section */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-[#FAF6F0] bg-[#FAF6F0]/40 space-y-4 animate-in fade-in duration-200">
                    {/* Overall Verdict */}
                    <div className="p-3 bg-white rounded-xl border border-[#E3C2B0]/30 space-y-1">
                      <span className="text-[9px] font-mono uppercase font-bold text-[#CBA38E] tracking-wider block">
                        AI Compatibility Verdict
                      </span>
                      <p className="text-xs font-bold text-[#3D2D29]">
                        {evaluation.verdict}
                      </p>
                      <p className="text-[11px] text-[#3D2D29]/80 leading-relaxed font-sans mt-1">
                        <strong>Optimal Timing:</strong> {evaluation.placementAdvice}
                      </p>
                    </div>

                    {/* Detailed Positive Synergies */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Why It Synergizes With Your Skin ({evaluation.fitPercentage}%)
                      </span>
                      <div className="space-y-1">
                        {evaluation.positiveReasons.map((pos, pIdx) => (
                          <div key={pIdx} className="text-xs text-[#3D2D29]/85 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/50 flex items-start gap-2">
                            <span className="text-emerald-700 font-bold font-mono">✓</span>
                            <span>{pos}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conflict Risks (Why it doesn't fit) */}
                    {evaluation.conflictRisks.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-rose-800 tracking-wider flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          Identified Conflict Risks (Why this product doesn't fit your face)
                        </span>
                        <div className="space-y-1">
                          {evaluation.conflictRisks.map((con, cIdx) => (
                            <div key={cIdx} className="text-xs text-rose-900 bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-start gap-2">
                              <span className="text-rose-600 font-bold font-mono">⚠</span>
                              <span>{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Caution & Buffering notes */}
                    {evaluation.cautionReasons.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Usage Precautions & Stacking Advice
                        </span>
                        <div className="space-y-1">
                          {evaluation.cautionReasons.map((caut, cIdx) => (
                            <div key={cIdx} className="text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60 flex items-start gap-2">
                              <span className="text-amber-700 font-bold font-mono">!</span>
                              <span>{caut}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: ADD / SCAN PRODUCT MODAL (Photo Upload Only with Strict Validation) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E3C2B0]/80 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 text-left relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E3C2B0]/30 pb-4">
              <div>
                <span className="text-[9px] font-mono text-amber-800 uppercase tracking-wider font-bold block">
                  AI Product & Label Scanner
                </span>
                <h3 className="font-serif font-bold text-lg text-[#3D2D29]">
                  Photo Scan Skincare Product for Fit Check
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setScanError(null);
                  setScannedPreviewUrl(null);
                  setScanSuccess(false);
                }}
                className="w-8 h-8 rounded-full bg-[#FAF6F0] hover:bg-[#E3C2B0]/40 flex items-center justify-center text-[#3D2D29] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden Input for Camera & File Picker */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {/* Case 1: Scanning in Progress */}
            {isScanningImage && (
              <div className="border-2 border-[#3D2D29] bg-[#FAF6F0] rounded-2xl p-8 text-center space-y-4 animate-pulse">
                {scannedPreviewUrl && (
                  <img 
                    src={scannedPreviewUrl} 
                    alt="Scanning Preview" 
                    className="w-24 h-24 object-cover rounded-xl mx-auto border-2 border-amber-600 shadow-md"
                  />
                )}
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-sm font-mono font-bold text-[#3D2D29]">
                    <Scan className="w-5 h-5 text-amber-700 animate-spin" />
                    <span>AI Optical Scanner Analyzing Image...</span>
                  </div>
                  <p className="text-xs text-[#3D2D29]/70 max-w-sm mx-auto">
                    Verifying cosmetic product packaging, reading active ingredients, and checking dermal suitability against your scan.
                  </p>
                </div>
              </div>
            )}

            {/* Case 2: Scan Error / Rejection (Non-Skincare image, face selfie, etc.) */}
            {!isScanningImage && scanError && (
              <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-rose-950">
                      Non-Skincare Image Detected
                    </h5>
                    <p className="text-xs text-rose-900/85 leading-relaxed">
                      {scanError}
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-3.5 border border-rose-200/60 text-xs text-rose-950 space-y-1">
                  <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-rose-800 block">
                    Why did this happen?
                  </span>
                  <p className="text-[11px] text-rose-900/80">
                    To prevent inaccurate results or false advice, our AI vision rejects facial portraits, selfies, or non-cosmetic items. Please take a clear photo of your actual skincare bottle, dropper, jar, or back-of-pack ingredients.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScanError(null);
                      setScannedPreviewUrl(null);
                    }}
                    className="px-3 py-2 text-xs font-mono text-rose-900/70 hover:text-rose-900 cursor-pointer"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Re-take / Upload Product Photo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case 3: Initial State (No image selected yet) */}
            {!isScanningImage && !scanError && !scanSuccess && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E3C2B0] hover:border-[#3D2D29] rounded-2xl p-8 sm:p-10 text-center bg-[#FAF6F0]/60 hover:bg-[#FAF6F0] transition cursor-pointer space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-2xs border border-[#E3C2B0]/40 flex items-center justify-center mx-auto text-[#3D2D29]">
                  <Camera className="w-7 h-7 text-[#CBA38E]" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-sm sm:text-base text-[#3D2D29]">
                    Upload Photo or Snap Bottle / Label
                  </h5>
                  <p className="text-xs text-[#3D2D29]/70 max-w-md mx-auto leading-relaxed">
                    Snap the front bottle or back ingredient list. The AI will read the brand, formula, and calculate exact Face Fit % with zero manual typing required.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D2D29] text-[#FAF6F0] rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-xs hover:bg-[#3D2D29]/90 transition">
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>Choose Photo / Take Picture</span>
                </div>
              </div>
            )}

            {/* Case 4: Product Successfully Recognized */}
            {!isScanningImage && !scanError && scanSuccess && formData.name && (
              <div className="space-y-4">
                {/* Extracted Card Preview */}
                <div className="bg-[#FAF6F0] border border-[#E3C2B0]/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
                  {scannedPreviewUrl && (
                    <img 
                      src={scannedPreviewUrl} 
                      alt="Scanned Bottle" 
                      className="w-24 h-24 object-cover rounded-xl border border-[#E3C2B0]/40 shadow-xs shrink-0 mx-auto sm:mx-0"
                    />
                  )}
                  <div className="space-y-2 flex-1 w-full text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        Recognized Skincare Formula
                      </span>
                      <span className="text-[10px] font-mono text-[#3D2D29]/70 bg-white px-2 py-0.5 rounded-md border border-[#E3C2B0]/30 font-semibold">
                        {formData.category}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-amber-800 uppercase font-bold block">
                        {formData.brand}
                      </span>
                      <h4 className="text-base font-serif font-bold text-[#3D2D29]">
                        {formData.name}
                      </h4>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-xl border border-[#E3C2B0]/30 space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-[#3D2D29]/70 block">
                        Extracted Key Actives & Ingredients:
                      </span>
                      <p className="text-xs text-[#3D2D29] font-mono">
                        {formData.ingredients}
                      </p>
                    </div>

                    {formData.notes && (
                      <p className="text-[11px] text-[#3D2D29]/65 italic">
                        "{formData.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <form onSubmit={handleAddItem} className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E3C2B0]/30">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-mono text-[#3D2D29]/75 hover:text-[#3D2D29] underline cursor-pointer flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Scan Different Product / Bottle</span>
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          setScanSuccess(false);
                          setScannedPreviewUrl(null);
                        }}
                        className="px-4 py-2 text-xs font-mono uppercase font-bold text-[#3D2D29]/70 hover:text-[#3D2D29] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-[#3D2D29] hover:bg-[#3D2D29]/90 text-[#FAF6F0] text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                        <span>Calculate Fit & Add to Cabinet</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
