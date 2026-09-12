import { SkinConcern, FeelingUnderstoodQuestion } from "./types";

export const SKIN_CONCERNS: SkinConcern[] = [
  {
    id: "acne",
    label: "Acne & Congestion",
    description: "Active breakouts, whiteheads, blackheads, or clogged pores.",
    symptoms: ["Inflammatory papules", "Sebum backup", "Post-acne redness"]
  },
  {
    id: "dryness",
    label: "Dryness & Dehydration",
    description: "Tightness, flaking, or a dull complexion lacking moisture.",
    symptoms: ["Elevated TEWL", "Micro-scaling", "Compromised lipid barrier"]
  },
  {
    id: "redness",
    label: "Redness & Sensitivity",
    description: "Reactive skin, persistent redness, flushing, or easily irritated skin barrier.",
    symptoms: ["Dilated capillaries", "Inflammatory flush", "Reactive epidermis"]
  },
  {
    id: "dark_circles",
    label: "Dark Circles & Under-Eye Bags",
    description: "Tired appearance, hollow under-eyes, puffiness, or shadow-like circles.",
    symptoms: ["Micro-congestion", "Fatigue shadows", "Thin periorbital tissue"]
  },
  {
    id: "dullness",
    label: "Dullness & Lack of Glow",
    description: "Lackluster complexion, fatigue, ash-toned skin, or uneven radiance.",
    symptoms: ["Reduced surface micro-circulation", "Keratinized buildup", "Sustained oxidative stress"]
  }
];

export interface OnboardingQuestion {
  id: string;
  text: string;
  category: string;
  options: {
    id: string;
    text: string;
    compassionKey: string;
    glassSkinValue: string; // Shows how this option relates to glass skin journey
  }[];
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: "gender",
    category: "Identity",
    text: "What's your gender?",
    options: [
      {
        id: "male",
        text: "Male",
        compassionKey: "gender-male",
        glassSkinValue: "Understanding gender allows us to better tailor formulas based on standard oil-production baselines and dermal thickness variations."
      },
      {
        id: "female",
        text: "Female",
        compassionKey: "gender-female",
        glassSkinValue: "Hormonal cycles frequently guide surface moisture levels and lipid balance. We'll fine-tune your recovery protocol to suit your unique chemistry."
      }
    ]
  },
  {
    id: "age",
    category: "Cellular Longevity",
    text: "What's your age range?",
    options: [
      {
        id: "under_18",
        text: "Under 18",
        compassionKey: "youthful",
        glassSkinValue: "At this stage, your skin has exceptional collagen synthesis. We'll focus on stabilizing active cellular turnover and maintaining clean, clear pores."
      },
      {
        id: "18_24",
        text: "18-24",
        compassionKey: "young-adult",
        glassSkinValue: "Your cellular regeneration is highly active. We'll optimize your hydration-locking potential and shield your lipid layer from environmental stressors."
      },
      {
        id: "25_34",
        text: "25-34",
        compassionKey: "pre-aging",
        glassSkinValue: "This is a critical transition window as natural collagen and hyaluronic acid levels begin a slight, steady deceleration. Preventive care will pay off massively."
      },
      {
        id: "35_plus",
        text: "35+",
        compassionKey: "maturing",
        glassSkinValue: "Dermal renewal cycles naturally slow down to 30-45 days. We will introduce cell-communicating actives to accelerate recovery and bring back radiant bounce."
      }
    ]
  },
  {
    id: "concern",
    category: "Core Target",
    text: "What's your biggest skin concern right now?",
    options: [
      {
        id: "acne",
        text: "Acne & breakouts",
        compassionKey: "breakouts",
        glassSkinValue: "Breakouts can be painful and frustrating. We will target the roots of sebaceous congestion with ultra-gentle, non-stripping active clarifying botanicals."
      },
      {
        id: "dark_spots",
        text: "Dark spots & uneven tone",
        compassionKey: "spots",
        glassSkinValue: "Hyperpigmentation represents stubborn melanin clusters. We will use gentle tyrosinase inhibitors to break down uneven spots and restore a uniform, glowing tone."
      },
      {
        id: "aging",
        text: "Fine lines & aging",
        compassionKey: "lines",
        glassSkinValue: "Fine lines appear when moisture-holding cells deflate. We will infuse deep-binding humectants and collagen boosters to plump your skin from within."
      },
      {
        id: "redness",
        text: "Redness & dullness",
        compassionKey: "reactive",
        glassSkinValue: "Persistent redness points to a sensitive, over-reactive lipid barrier. Our absolute first priority is to calm thermal capillaries and seal your defensive mortar."
      }
    ]
  },
  {
    id: "improve_areas",
    category: "Target Areas",
    text: "What areas would you like to improve?",
    options: [
      {
        id: "whole_face",
        text: "Whole face",
        compassionKey: "whole-face",
        glassSkinValue: "Targeting your overall complexion ensures balanced lipid hydration and uniform skin barrier renewal."
      },
      {
        id: "eyes",
        text: "Eyes",
        compassionKey: "eyes",
        glassSkinValue: "Periorbital skin is 4x thinner than the rest of the face. Gentle micro-circulation support keeps dark circles at bay."
      },
      {
        id: "cheeks",
        text: "Cheeks",
        compassionKey: "cheeks",
        glassSkinValue: "Cheeks are prone to redness and dryness. Hydrating ceramides lock in dewiness and soothe sensitivity."
      },
      {
        id: "under_nose",
        text: "Under nose",
        compassionKey: "under-nose",
        glassSkinValue: "Perinasal congestion and redness are common. Light clarifying botanicals keep pores clear without flaking."
      },
      {
        id: "chin",
        text: "Chin",
        compassionKey: "chin",
        glassSkinValue: "Hormonal breakouts and texture often affect the chin area. We balance sebum to prevent recurring bumps."
      }
    ]
  },
  {
    id: "type",
    category: "Sebum Metric",
    text: "How would you describe your skin type?",
    options: [
      {
        id: "oily",
        text: "Oily",
        compassionKey: "sebum-high",
        glassSkinValue: "Oily skin has a wonderful natural defense against aging! We will manage excess shine by feeding your skin water-rich hydrators so it stops overproducing sebum."
      },
      {
        id: "dry",
        text: "Dry",
        compassionKey: "sebum-low",
        glassSkinValue: "Dry skin lacks natural lipids, leading to a dull or tight feel. We will envelope your face in skin-identical squalane and rich emollients to trap dense hydration."
      },
      {
        id: "combination",
        text: "Combination",
        compassionKey: "sebum-mixed",
        glassSkinValue: "The most common skin profile. We will design a smart, self-balancing protocol that hydrates dry cheeks while keeping your oily T-zone completely fresh and clear."
      },
      {
        id: "sensitive",
        text: "Sensitive",
        compassionKey: "sebum-fragile",
        glassSkinValue: "Your skin barrier is highly reactive to changes. We will use zero synthetic fragrance and stick exclusively to skin-soothing, biocompatible recovery remedies."
      },
      {
        id: "unknown",
        text: "I don't know",
        compassionKey: "unknown",
        glassSkinValue: "Totally fine! Our high-fidelity dermal scan phase will analyze your epidermal metrics to identify your exact oil-to-water ratio."
      }
    ]
  },
  {
    id: "daily_routine_check",
    category: "Daily Routine",
    text: "Do you have daily skin care routine?",
    options: [
      {
        id: "morning_evening",
        text: "Yes, I have a morning and an evening routine",
        compassionKey: "full-routine",
        glassSkinValue: "Great consistency! We will optimize your active ingredients to maximize acne clearing, hydrator absorption, and barrier repair."
      },
      {
        id: "only_morning",
        text: "Only a morning one",
        compassionKey: "am-routine",
        glassSkinValue: "Morning protection keeps environmental damage away. Adding a 2-minute night repair step will accelerate cell renewal & fade dark spots."
      },
      {
        id: "only_evening",
        text: "Only an evening one",
        compassionKey: "pm-routine",
        glassSkinValue: "Overnight recovery is essential! We will add a lightweight morning shield to defend against pollution, oil buildup, and UV stress."
      },
      {
        id: "no_routine",
        text: "No, I don't have any routine",
        compassionKey: "no-routine",
        glassSkinValue: "Zero worries! We'll give you a simple, 3-step personalized routine that solves skin issues in under 3 minutes a day."
      }
    ]
  },
  {
    id: "products_used",
    category: "Skincare Products",
    text: "Which skincare products do you use?",
    options: [
      {
        id: "cleanser",
        text: "Cleanser",
        compassionKey: "cleanser",
        glassSkinValue: "Cleansing purifies the canvas. We'll make sure your cleanser maintains optimal pH without stripping essential lipids."
      },
      {
        id: "makeup_remover",
        text: "Makeup Remover",
        compassionKey: "makeup-remover",
        glassSkinValue: "Proper makeup removal prevents pore clogging and micro-inflammation before overnight cellular recovery."
      },
      {
        id: "toner",
        text: "Toner",
        compassionKey: "toner",
        glassSkinValue: "Toners prep the skin surface for deeper hydration absorption and balance post-wash dermal pH."
      },
      {
        id: "moisturizer",
        text: "Moisturizer",
        compassionKey: "moisturizer",
        glassSkinValue: "Moisturizers create the protective lipid seal that prevents transepidermal water loss."
      },
      {
        id: "treatment_eye",
        text: "Treatment (Eye)",
        compassionKey: "eye-treatment",
        glassSkinValue: "Targeted eye treatments nourish delicate periorbital tissue to reduce fine lines and dark circles."
      },
      {
        id: "treatment_face",
        text: "Treatment (Face)",
        compassionKey: "face-treatment",
        glassSkinValue: "Serums and active treatments deliver concentrated bio-actives deep into the epidermal layers."
      }
    ]
  },
  {
    id: "clear_skin_thought",
    category: "Psychological Impact",
    text: "When you see someone with clear skin, what's your honest first thought?",
    options: [
      {
        id: "wish_me",
        text: "\"I wish that was me\"",
        compassionKey: "comparison-longing",
        glassSkinValue: "It's completely natural to long for that confidence. We will work directly on rebuilding your barrier, so you can soon feel exactly that level of peace."
      },
      {
        id: "doing_differently",
        text: "\"What are they doing differently?\"",
        compassionKey: "comparison-curiosity",
        glassSkinValue: "Curiosity is the beginning of skin education! We are going to break down the exact science behind your barrier metrics to answer that question."
      },
      {
        id: "motivates_me",
        text: "\"That motivates me\"",
        compassionKey: "comparison-motivation",
        glassSkinValue: "We love this active motivation! Setting a daily plan is the fastest way to turn that inspiration into a real, glowing physical asset."
      },
      {
        id: "no_compare",
        text: "\"I try not to compare\"",
        compassionKey: "comparison-neutral",
        glassSkinValue: "An exceptionally mature and healthy mindset. Your skin journey is uniquely your own, and our focus is purely on achieving your personal best health."
      }
    ]
  },
  {
    id: "failed_routines",
    category: "Historical Overload",
    text: "Have you tried a skincare routine before that didn't work?",
    options: [
      {
        id: "failed_breakouts",
        text: "Yes, products caused breakouts, irritation, or clogged pores",
        compassionKey: "breakouts-irritation",
        glassSkinValue: "Classic barrier disruption & comedogenic reaction. We eliminate harsh irritants and focus on non-comedogenic, soothing bio-remedies."
      },
      {
        id: "failed_no_results",
        text: "Yes, spent time and money but saw zero visible change",
        compassionKey: "no-visible-change",
        glassSkinValue: "Likely incorrect active pairing or pH imbalance. We match exact ingredient concentrations to your specific skin metrics."
      },
      {
        id: "failed_too_complex",
        text: "Yes, too many complicated steps to stay consistent",
        compassionKey: "too-complex",
        glassSkinValue: "Skincare fatigue is very real! We streamline your routine to 3 high-impact steps that deliver real results in under 3 minutes."
      },
      {
        id: "failed_first_time",
        text: "No, I'm starting fresh and want to build a routine that works",
        compassionKey: "fresh-canvas",
        glassSkinValue: "Starting with a clean slate prevents barrier damage and builds healthy, lasting skin habits right from day one."
      }
    ]
  },
  {
    id: "skin_feelings",
    category: "Dermal Confidence",
    text: "How does your skin make you feel day to day?",
    options: [
      {
        id: "confident",
        text: "Confident",
        compassionKey: "secure",
        glassSkinValue: "Fantastic energy! Let's elevate your skin from good to optimal, amplifying your natural luminosity and translucent, glass-like reflectivity."
      },
      {
        id: "self_conscious",
        text: "Self-conscious",
        compassionKey: "vulnerable",
        glassSkinValue: "Your skin represents how you present yourself to the world. We hear you, and our mission is to restore comfort and secure, relaxed confidence."
      },
      {
        id: "anxious",
        text: "Anxious before going out",
        compassionKey: "anxious",
        glassSkinValue: "No one should feel restricted by their complexion. We will focus on fast, calming remedies to soothe any active irritation before social events."
      },
      {
        id: "no_think",
        text: "I try not to think about it",
        compassionKey: "neutral",
        glassSkinValue: "A perfect way to keep cortisol down! Low psychological stress directly supports skin healing and lowers chronic capillary redness."
      }
    ]
  },
  {
    id: "rate_skin",
    category: "Biometric Consent",
    text: "Rate your skin right now — then let's see the real score.",
    options: [
      {
        id: "rate_placeholder",
        text: "Rate",
        compassionKey: "rating",
        glassSkinValue: "Your self-assessment helps calibrate our biometric analysis, highlighting the gap between external appearance and cellular barrier health."
      }
    ]
  }
];

export const SAMPLE_FACES = [
  {
    id: "female-1",
    gender: "female",
    name: "Elena (Sample Profile)",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    concerns: ["dryness", "redness"]
  },
  {
    id: "female-2",
    gender: "female",
    name: "Chloe (Sample Profile)",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600",
    concerns: ["acne", "dullness"]
  },
  {
    id: "male-1",
    gender: "male",
    name: "Marcus (Sample Profile)",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    concerns: ["acne", "dullness"]
  },
  {
    id: "male-2",
    gender: "male",
    name: "Julian (Sample Profile)",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    concerns: ["dark_circles", "dryness"]
  }
];
