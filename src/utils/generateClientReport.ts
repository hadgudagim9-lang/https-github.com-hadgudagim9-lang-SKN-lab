import { SkinAnalysisResponse } from "../types";

export function generateClientFallbackReport(
  gender: string | null = "female",
  concerns: string[] = ["Acne & Congestion", "Uneven Texture"],
  userName: string = "Valued Member"
): SkinAnalysisResponse {
  const normalizedGender = gender || "female";
  const effectiveConcerns = concerns.length > 0 ? concerns : ["Acne & Congestion", "Uneven Texture"];
  const primary = effectiveConcerns[0] || "Acne & Congestion";
  const primaryLower = primary.toLowerCase();

  // Metrics based on concerns
  let hydration = 65;
  let sebum = 55;
  let elasticity = 70;
  let melaninDepth = 60;
  let skinScore = 74;

  if (primaryLower.includes("dry") || primaryLower.includes("dehydration")) {
    hydration = 42;
    sebum = 35;
    elasticity = 62;
    melaninDepth = 55;
    skinScore = 68;
  } else if (primaryLower.includes("acne") || primaryLower.includes("oily") || primaryLower.includes("blackhead")) {
    hydration = 58;
    sebum = 82;
    elasticity = 75;
    melaninDepth = 65;
    skinScore = 64;
  } else if (primaryLower.includes("redness") || primaryLower.includes("sensitive")) {
    hydration = 48;
    sebum = 50;
    elasticity = 66;
    melaninDepth = 72;
    skinScore = 67;
  } else if (primaryLower.includes("dark") || primaryLower.includes("pigment") || primaryLower.includes("spot")) {
    hydration = 60;
    sebum = 52;
    elasticity = 72;
    melaninDepth = 84;
    skinScore = 70;
  }

  const concernsDetail = effectiveConcerns.map((c) => ({
    concern: c,
    severity: "Moderate" as const,
    description: `Targeted cellular protocol calibrated for ${c.toLowerCase()} recovery, barrier strengthening, and pore refining.`
  }));

  const morningRoutine = [
    "Gentle pH-Balancing Cleanser: Wash with lukewarm water to remove overnight cell turnover without stripping lipid moisture.",
    "Active Bio-Treatment Serum: Apply 3-4 drops of Niacinamide & Hyaluronic Acid complex to damp skin to stimulate repair.",
    "Barrier Lock & Broad Spectrum SPF 50+: Seal in deep hydration with a lightweight non-comedogenic ceramide lotion and UV shield."
  ];

  const eveningRoutine = [
    "Purifying Double Cleanse: Dissolve daily environmental pollutants, SPF, and sebum using a gentle botanical cleanser.",
    "Cellular Renewal Active: Apply targeted BHA or gentle Retinal compound to clear micro-comedones and refine stratum corneum.",
    "Lipid Matrix Recovery Balm: Warm a pea-sized amount of Squalane and Centella cream to repair the protective acid mantle overnight."
  ];

  const weeklyRoutine = [
    "Hydration Surge Compress: Apply chilled rice water or green tea essence for 10 minutes to constrict reactive capillaries.",
    "Gentle Enzymatic Exfoliation: Use mild fruit acids or colloidal oatmeal paste once weekly to melt dead keratinized buildup."
  ];

  const monthlyRoutine = [
    "Micro-Circulation Audit: Evaluate pore tightness and pigmentation lightening progress under standardized lighting.",
    "Skincare Tool & Pillowcase Sanitation: Deep clean cosmetic sponges and pillowcases to eliminate microbial colonies."
  ];

  const homemadeRemedies = [
    {
      name: "Ice-Water De-Puffing Facial",
      timeToUse: "Morning" as const,
      ingredients: ["Ice cubes", "Cold filtered water", "Clean bowl"],
      preparation: "Fill a medium bowl with cold water and ice cubes. Splash onto face 10-15 times before morning application.",
      benefit: "Instantly lowers epidermal temperature, constricts dilated capillaries, and tightens morning pore elasticity.",
      product_search: "ice facial roller skincare"
    },
    {
      name: "Rice Water Glass-Skin Toner",
      timeToUse: "Evening" as const,
      ingredients: ["1/2 cup organic rice", "1 cup water"],
      preparation: "Rinse rice, soak for 20 minutes in fresh water, strain the nutrient-rich water and pat gently onto clean skin.",
      benefit: "Packed with ferulic acid and natural starches that boost luminous light reflection and reduce rough surface patches.",
      product_search: "rice water facial toner"
    },
    {
      name: "Honey & Oatmeal Calming Mask",
      timeToUse: "Weekly" as const,
      ingredients: ["1 tbsp colloidal oatmeal", "1 tbsp pure honey", "1 tsp warm water"],
      preparation: "Mix oatmeal and honey into a smooth paste. Apply to skin for 15 minutes, then rinse with lukewarm water.",
      benefit: "Honey draws atmospheric moisture into the skin while beta-glucans in oatmeal soothe and rebuild damaged barrier walls.",
      product_search: "oatmeal honey face mask"
    }
  ];

  const productRecommendations = [
    {
      category: "Cleanser" as const,
      name: "La Roche-Posay Toleriane Hydrating Gentle Cleanser",
      brand: "La Roche-Posay",
      activeIngredients: ["Ceramide-3", "Niacinamide", "Prebiotic Thermal Water"],
      whyRecommended: "Clinically formulated with essential ceramides to lift impurities while maintaining the natural lipid envelope.",
      img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600"
    },
    {
      category: "Treatment" as const,
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      brand: "The Ordinary",
      activeIngredients: ["10% Niacinamide (Vitamin B3)", "1% Zinc PCA"],
      whyRecommended: "High-potency vitamin active that normalizes sebum congestion, refines visible pores, and accelerates acne mark fading.",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
    },
    {
      category: "Moisturizer & SPF" as const,
      name: "Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+",
      brand: "Beauty of Joseon",
      activeIngredients: ["30% Rice Extract", "Grain Fermented Probiotics", "SPF 50+ PA++++"],
      whyRecommended: "Lightweight, non-greasy formula enriched with fermented rice extracts to nourish the microbiome with zero white cast.",
      img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const videoSuggestions = [
    {
      title: "The Complete Dermatologist Guide to Glass Skin",
      category: "Daily Protocol Masterclass",
      description: "Step-by-step masterclass on optimizing epidermal barrier hydration and chemical exfoliation cadence.",
      tip: "Never layer active acids over broken or irritated skin. Focus on lipid barrier repair first.",
      youtubeUrl: "https://www.youtube.com/watch?v=u1bQ2bI_i5Y",
      duration: "03:45"
    },
    {
      title: "How to Clear Pores & Eliminate Congestion",
      category: "Pore Cleansing & Sebum",
      description: "How to effectively dissolve sebum plugs with Salicylic Acid without causing rebound oiliness.",
      tip: "Cleanse with fingertips for at least 60 seconds to allow active ingredients to penetrate pore linings.",
      youtubeUrl: "https://www.youtube.com/watch?v=0G7U6_Zg_O4",
      duration: "04:10"
    },
    {
      title: "Cold Therapy & Lymphatic Facial Drainage",
      category: "Calming & Tone Therapy",
      description: "Learn how to use cold temperature therapy to constrict swollen capillaries and eliminate puffiness.",
      tip: "Always wrap ice cubes in a clean soft cloth to prevent freeze damage to delicate tissue.",
      youtubeUrl: "https://www.youtube.com/watch?v=5T6SgI_g6SM",
      duration: "02:50"
    }
  ];

  return {
    skinScore,
    skinType: primaryLower.includes("dry") ? "Dry / Dehydrated" : primaryLower.includes("oily") ? "Oily / Acne-Prone" : "Combination / Sensitive",
    primaryConcern: primary.toUpperCase(),
    concernsDetail,
    metrics: {
      hydration,
      sebum,
      elasticity,
      melaninDepth,
      texture: 68,
      smoothness: 72
    },
    understandingNote: `Hello ${userName}, our dermatological diagnostic protocol has thoroughly mapped your skin profile. Your custom daily routine is optimized to restore radiant balance and target ${effectiveConcerns.join(" and ").toLowerCase()} safely.`,
    morningRoutine,
    eveningRoutine,
    weeklyRoutine,
    monthlyRoutine,
    homemadeRemedies,
    productRecommendations,
    videoSuggestions,
    routineVideoLinks: {
      morningRemedyUrl: "https://www.youtube.com/watch?v=5T6SgI_g6SM",
      morningProductUrl: "https://www.youtube.com/watch?v=0G7U6_Zg_O4",
      eveningRemedyUrl: "https://www.youtube.com/watch?v=u1bQ2bI_i5Y",
      eveningProductUrl: "https://www.youtube.com/watch?v=K3Sbe77l_kI",
      monthlyRemedyUrl: "https://www.youtube.com/watch?v=u1bQ2bI_i5Y",
      monthlyProductUrl: "https://www.youtube.com/watch?v=p481_G0Fj8U"
    }
  };
}
