import React, { useState } from "react";
import { X, Droplets, ShieldCheck, Zap, Info, Search, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export interface ActiveIngredientDetail {
  id: string;
  name: string;
  alias?: string;
  category: "Hydration" | "Barrier & Soothing" | "Exfoliants & Acne" | "Brightening & Anti-Aging" | "Botanical Remedies";
  shortDesc: string;
  benefits: string[];
  bestFor: string[];
  howToUse: string;
  whenToUse: "AM & PM" | "AM Only" | "PM Only" | "1-3x Weekly";
  pairsWellWith: string[];
  avoidMixingWith?: string[];
  dermalMechanism: string;
}

export const INGREDIENTS_DATABASE: ActiveIngredientDetail[] = [
  {
    id: "niacinamide",
    name: "Niacinamide",
    alias: "Vitamin B3",
    category: "Barrier & Soothing",
    shortDesc: "A versatile water-soluble vitamin that calms inflammation, strengthens the skin barrier, and regulates oil production.",
    benefits: [
      "Minimizes enlarged pores & evens skin texture",
      "Reduces redness, blotchiness, and hyperpigmentation",
      "Boosts natural ceramide production for barrier repair",
      "Regulates sebum production without stripping skin"
    ],
    bestFor: ["Acne-Prone Skin", "Oily/Combination Skin", "Redness & Rosacea", "Compromised Barrier"],
    howToUse: "Apply 2-5% concentration after cleansing and toning, before heavier creams.",
    whenToUse: "AM & PM",
    pairsWellWith: ["Hyaluronic Acid", "Ceramides", "Zinc", "Centella Asiatica"],
    dermalMechanism: "Increases intracellular NADP levels to enhance epidermal lipid synthesis and inhibit melanosome transfer from melanocytes to keratinocytes."
  },
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    alias: "Sodium Hyaluronate",
    category: "Hydration",
    shortDesc: "A powerful humectant capable of holding up to 1,000 times its weight in water to plump and hydrate the skin.",
    benefits: [
      "Instantly plumps fine lines caused by dehydration",
      "Restores surface moisture balance",
      "Enhances skin elasticity and smooth translucency",
      "Lightweight, non-greasy moisture layer"
    ],
    bestFor: ["Dehydrated Skin", "Dry Skin", "All Skin Types", "Sensitive Skin"],
    howToUse: "Apply onto damp skin following cleansing or misting to lock in moisture.",
    whenToUse: "AM & PM",
    pairsWellWith: ["Niacinamide", "Squalane", "Ceramides", "Vitamin C"],
    dermalMechanism: "Binds water molecules to extracellular matrix glycosaminoglycans, swelling the epidermis for structural bounce."
  },
  {
    id: "salicylic-acid",
    name: "Salicylic Acid",
    alias: "Beta Hydroxy Acid (BHA)",
    category: "Exfoliants & Acne",
    shortDesc: "A oil-soluble acid that penetrates deep into pores to dissolve excess sebum, dead skin cell buildup, and debris.",
    benefits: [
      "Clears clogged pores and blackheads",
      "Reduces active breakouts and micro-comedones",
      "Soothes inflammation with natural anti-inflammatory properties",
      "Refines rough, uneven skin texture"
    ],
    bestFor: ["Acne-Prone Skin", "Blackheads & Congestion", "Oily Skin", "Enlarged Pores"],
    howToUse: "Start 2-3x weekly at 0.5% - 2% concentration. Follow with a barrier-soothing moisturizer.",
    whenToUse: "PM Only",
    pairsWellWith: ["Niacinamide", "Centella Asiatica", "Hyaluronic Acid"],
    avoidMixingWith: ["Retinol (on same night)", "High-strength AHA", "Benzoyl Peroxide"],
    dermalMechanism: "Disrupts intercellular desmosomal adhesions within lipid-rich pores, facilitating gentle follicular desquamation."
  },
  {
    id: "ceramides",
    name: "Ceramides",
    alias: "Ceramide NP / AP / EOP",
    category: "Barrier & Soothing",
    shortDesc: "Essential lipids that make up over 50% of the skin barrier, acting like 'mortar' to lock in moisture and keep irritants out.",
    benefits: [
      "Rebuilds damaged or over-exfoliated skin barriers",
      "Prevents Transepidermal Water Loss (TEWL)",
      "Protects against environmental pollution and windburn",
      "Relieves dryness, stinging, and tight skin"
    ],
    bestFor: ["Compromised Barrier", "Eczema & Flakiness", "Sensitive Skin", "Dry Skin"],
    howToUse: "Use as a core component of daily moisturizers or barrier creams.",
    whenToUse: "AM & PM",
    pairsWellWith: ["Fatty Acids", "Cholesterol", "Hyaluronic Acid", "Niacinamide"],
    dermalMechanism: "Supplements stratum corneum intercellular lipid lamellae to restore lipid bilayer integrity."
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    alias: "L-Ascorbic Acid / THD Ascorbate",
    category: "Brightening & Anti-Aging",
    shortDesc: "A potent antioxidant that neutralizes free radicals, brightens dark spots, and stimulates collagen synthesis.",
    benefits: [
      "Fades stubborn post-acne marks & hyperpigmentation",
      "Shields skin against oxidative stress and UV damage",
      "Promotes firm, youthful collagen production",
      "Restores vibrant radiance to dull skin"
    ],
    bestFor: ["Dullness", "Sun Spots & Hyperpigmentation", "Uneven Skin Tone", "Early Aging"],
    howToUse: "Apply 10-15% L-Ascorbic Acid in the morning under sunscreen.",
    whenToUse: "AM Only",
    pairsWellWith: ["Vitamin E", "Ferulic Acid", "Hyaluronic Acid", "Sunscreen"],
    avoidMixingWith: ["Retinol (use PM instead)", "Niacinamide in high unbuffered concentrations"],
    dermalMechanism: "Acts as an essential cofactor for prolyl and lysyl hydroxylase enzymes in collagen cross-linking while suppressing tyrosinase."
  },
  {
    id: "retinol",
    name: "Retinol / Retinoid",
    alias: "Vitamin A Derivative",
    category: "Brightening & Anti-Aging",
    shortDesc: "The gold-standard ingredient for accelerating cellular turnover, smoothing wrinkles, and clearing persistent congestion.",
    benefits: [
      "Accelerates epidermal cell renewal and shedding",
      "Smooths fine lines and deep wrinkles",
      "Unclogs pores and prevents future breakouts",
      "Boosts collagen for firmer skin density"
    ],
    bestFor: ["Fine Lines & Aging", "Persistent Acne", "Textured Skin", "Loss of Firmness"],
    howToUse: "Introduce slowly (1-2x per week) at night. Apply pea-sized amount onto dry skin. Always wear SPF daytime.",
    whenToUse: "PM Only",
    pairsWellWith: ["Ceramides", "Hyaluronic Acid", "Niacinamide", "Peptides"],
    avoidMixingWith: ["AHA/BHA Acids (same night)", "Vitamin C (use AM)"],
    dermalMechanism: "Binds to retinoic acid receptors (RAR) to stimulate keratinocyte proliferation and extracellular matrix gene transcription."
  },
  {
    id: "centella-asiatica",
    name: "Centella Asiatica",
    alias: "CICA / Gotu Kola / Madecassoside",
    category: "Barrier & Soothing",
    shortDesc: "A medicinal botanical famed for its rapid wound-healing, anti-inflammatory, and redness-soothing properties.",
    benefits: [
      "Cools heated, flushed, or inflamed skin",
      "Accelerates healing of blemishes and irritation",
      "Strengthens delicate skin tissue",
      "Protects against environmental stressors"
    ],
    bestFor: ["Rosacea & Redness", "Sensitive Skin", "Post-Breakout Healing", "Irritated Skin"],
    howToUse: "Incorporate as a serum, ampoule, or soothing moisturizer morning and evening.",
    whenToUse: "AM & PM",
    pairsWellWith: ["All Active Ingredients", "Niacinamide", "Ceramides"],
    dermalMechanism: "Contains active triterpenoids (asiaticoside, madecassic acid) that stimulate type I collagen synthesis and suppress pro-inflammatory cytokines."
  },
  {
    id: "colloidal-oatmeal",
    name: "Colloidal Oatmeal",
    alias: "Avena Sativa",
    category: "Botanical Remedies",
    shortDesc: "Finely ground oats suspended in liquid that provide immediate relief for itchy, dry, and irritated barrier conditions.",
    benefits: [
      "Calms intense itching, stinging, and burning",
      "Forms a protective soothing barrier coat",
      "Rich in beta-glucans for deep moisture",
      "Soothes allergic reactions and dermatitis"
    ],
    bestFor: ["Eczema & Itching", "Extremely Sensitive Skin", "Sunburn & Windburn"],
    howToUse: "Used in homemade compresses, masks, or gentle wash-off remedies.",
    whenToUse: "AM & PM",
    pairsWellWith: ["Raw Honey", "Cucumber Juice", "Ceramides"],
    dermalMechanism: "Contains avenanthramides that inhibit NF-kB signaling and histamine release for instant neuro-sensory calming."
  },
  {
    id: "raw-honey",
    name: "Raw Organic Honey",
    alias: "Manuka / Raw Honey",
    category: "Botanical Remedies",
    shortDesc: "A natural antimicrobial humectant that draws moisture into skin while inhibiting bacterial overgrowth.",
    benefits: [
      "Natural antibacterial protection for breakouts",
      "Soften and hydrates without pore congestion",
      "Speeds up tissue repair and mark recovery",
      "Enzymatic gentle smoothing"
    ],
    bestFor: ["Acne & Blemishes", "Dehydrated Skin", "Natural Remedy Enthusiasts"],
    howToUse: "Apply as a 15-minute raw face mask or spot application for redness.",
    whenToUse: "1-3x Weekly",
    pairsWellWith: ["Colloidal Oatmeal", "Yogurt", "Aloe Vera"],
    dermalMechanism: "Exerts osmotic pressure on bacterial cell membranes while producing trace hydrogen peroxide for gentle clearing."
  },
  {
    id: "squalane",
    name: "Squalane Oil",
    alias: "Plant-Derived Squalane",
    category: "Hydration",
    shortDesc: "A bio-identical, non-comedogenic oil that mimics human sebum to seal moisture without clogging pores.",
    benefits: [
      "Non-comedogenic nourishment for all skin types",
      "Locks in hydration without heavy greasy film",
      "Softens fine dry skin lines",
      "Antioxidant protection against lipid peroxidation"
    ],
    bestFor: ["Dry Skin", "Combination Skin", "Pore-Conscious Users"],
    howToUse: "Apply 2-3 drops as the final step in your routine or mix into moisturizer.",
    whenToUse: "AM & PM",
    pairsWellWith: ["Retinol", "Hyaluronic Acid", "Active Serums"],
    dermalMechanism: "Supplements the natural skin surface lipid matrix to prevent trans-epidermal moisture escape."
  }
];

interface ActiveIngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIngredientId?: string | null;
}

export default function ActiveIngredientsModal({
  isOpen,
  onClose,
  initialIngredientId
}: ActiveIngredientsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeIngredient, setActiveIngredient] = useState<ActiveIngredientDetail | null>(null);

  // Synchronize initial ingredient selection if provided
  React.useEffect(() => {
    if (initialIngredientId) {
      const found = INGREDIENTS_DATABASE.find(
        (ing) =>
          ing.id.toLowerCase() === initialIngredientId.toLowerCase() ||
          ing.name.toLowerCase().includes(initialIngredientId.toLowerCase())
      );
      if (found) {
        setActiveIngredient(found);
      }
    } else if (!activeIngredient && INGREDIENTS_DATABASE.length > 0) {
      setActiveIngredient(INGREDIENTS_DATABASE[0]);
    }
  }, [initialIngredientId, isOpen]);

  if (!isOpen) return null;

  const categories = ["All", "Hydration", "Barrier & Soothing", "Exfoliants & Acne", "Brightening & Anti-Aging", "Botanical Remedies"];

  const filteredIngredients = INGREDIENTS_DATABASE.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alias && item.alias.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentDisplay = activeIngredient || filteredIngredients[0] || INGREDIENTS_DATABASE[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF6F0] rounded-3xl border border-[#E3C2B0]/80 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left relative">
        
        {/* Header */}
        <div className="bg-[#3D2D29] text-[#FAF6F0] p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E879A0]/20 flex items-center justify-center text-[#E879A0]">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">Active Ingredient Benefits Guide</h2>
              <p className="text-[10px] font-mono text-[#E3C2B0] uppercase tracking-wider">
                Clinical Dermal Actions & Optimal Pairings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#F4EDE4] p-3 border-b border-[#E3C2B0]/30 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between shrink-0">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#3D2D29]/50" />
            <input
              type="text"
              placeholder="Search ingredient (e.g., Niacinamide, Hyaluronic Acid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-xl text-xs font-sans text-[#3D2D29] border border-[#E3C2B0]/40 focus:outline-none focus:border-[#3D2D29] placeholder:text-[#3D2D29]/40"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#3D2D29] text-[#FAF6F0]"
                    : "bg-white/60 hover:bg-white text-[#3D2D29]/80 border border-[#E3C2B0]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Body Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E3C2B0]/30">
          
          {/* Left Column: Ingredient Master List */}
          <div className="md:col-span-5 p-3 space-y-1.5 overflow-y-auto max-h-[300px] md:max-h-none">
            <span className="text-[9px] font-mono font-bold text-[#CBA38E] uppercase tracking-wider block px-2 py-1">
              {filteredIngredients.length} Actives Found
            </span>
            {filteredIngredients.map((item) => {
              const isSelected = currentDisplay?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIngredient(item)}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-150 cursor-pointer border flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-white border-[#3D2D29] shadow-xs"
                      : "bg-white/40 hover:bg-white/80 border-[#E3C2B0]/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#3D2D29] font-sans">{item.name}</span>
                      {item.alias && (
                        <span className="text-[9px] text-[#CBA38E] font-mono font-semibold">({item.alias})</span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-[#3D2D29]/60 block mt-0.5">{item.category}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    item.whenToUse.includes("AM") && item.whenToUse.includes("PM")
                      ? "bg-amber-100 text-amber-900"
                      : item.whenToUse.includes("PM")
                      ? "bg-indigo-100 text-indigo-900"
                      : "bg-emerald-100 text-emerald-900"
                  }`}>
                    {item.whenToUse}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Active Ingredient Card */}
          <div className="md:col-span-7 p-5 sm:p-6 space-y-5 bg-white/50 overflow-y-auto">
            {currentDisplay ? (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Title & Badge Header */}
                <div className="border-b border-[#E3C2B0]/30 pb-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[9px] font-mono font-bold uppercase rounded-md tracking-wider">
                      {currentDisplay.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#CBA38E] uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Usage: {currentDisplay.whenToUse}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#3D2D29]">{currentDisplay.name}</h3>
                    {currentDisplay.alias && (
                      <p className="text-xs font-mono text-[#CBA38E]">Also known as: {currentDisplay.alias}</p>
                    )}
                  </div>

                  <p className="text-xs text-[#3D2D29]/80 leading-relaxed font-sans bg-[#FAF6F0] p-3 rounded-xl border border-[#E3C2B0]/30">
                    {currentDisplay.shortDesc}
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#3D2D29] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Dermal Benefits
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentDisplay.benefits.map((b, idx) => (
                      <li key={idx} className="bg-white p-2.5 rounded-xl border border-[#E3C2B0]/25 text-[11px] text-[#3D2D29]/85 flex items-start gap-2 shadow-2xs font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E879A0] mt-1 shrink-0"></span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Concerns & Ideal Skin */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#3D2D29] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#CBA38E]" />
                    Best For Skin Types
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentDisplay.bestFor.map((bf, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#F4EDE4] text-[#3D2D29] text-[10px] font-medium rounded-lg border border-[#E3C2B0]/30">
                        {bf}
                      </span>
                    ))}
                  </div>
                </div>

                {/* How To Use & Synergies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* How to Apply */}
                  <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#E3C2B0]/30 space-y-1">
                    <span className="text-[9px] font-mono font-bold text-[#CBA38E] uppercase tracking-wider block">Application Protocol</span>
                    <p className="text-[11px] text-[#3D2D29]/80 font-sans leading-relaxed">{currentDisplay.howToUse}</p>
                  </div>

                  {/* Pairs Well With */}
                  <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#E3C2B0]/30 space-y-1">
                    <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">Synergistic Pairings</span>
                    <p className="text-[11px] text-[#3D2D29]/80 font-sans leading-relaxed">
                      {currentDisplay.pairsWellWith.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Avoid Mixing (if applicable) */}
                {currentDisplay.avoidMixingWith && (
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] uppercase text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Cautionary Mixing Warnings
                    </div>
                    <p className="text-[11px] text-[#3D2D29]/80 font-sans">
                      Avoid applying in same routine layer with: {currentDisplay.avoidMixingWith.join(", ")}.
                    </p>
                  </div>
                )}

                {/* Clinical Mechanism */}
                <div className="bg-[#3D2D29] text-[#FAF6F0] p-3.5 rounded-2xl space-y-1 text-xs">
                  <span className="text-[9px] font-mono text-amber-300 uppercase tracking-wider font-bold block">
                    Clinical Dermal Action Mechanism
                  </span>
                  <p className="text-[11px] text-white/80 italic font-sans leading-relaxed">
                    "{currentDisplay.dermalMechanism}"
                  </p>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-xs text-[#3D2D29]/50 font-mono">
                Select an active ingredient from the left list to view clinical benefits.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#F4EDE4] p-3.5 border-t border-[#E3C2B0]/30 flex items-center justify-between text-[10px] font-mono text-[#3D2D29]/70 shrink-0">
          <span>Dermatological Active Database • SKN LAB</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#3D2D29] hover:bg-[#3D2D29]/90 text-[#FAF6F0] rounded-xl font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
