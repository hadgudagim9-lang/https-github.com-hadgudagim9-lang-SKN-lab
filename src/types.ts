export type BiologicalGender = "male" | "female" | null;

export interface SkinConcern {
  id: string;
  label: string;
  description: string;
  symptoms: string[];
}

export interface FeelingUnderstoodQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    compassionKey: string;
  }[];
}

export interface ProductRecommendation {
  category: "Cleanser" | "Treatment" | "Moisturizer & SPF";
  name: string;
  brand: string;
  activeIngredients: string[];
  whyRecommended: string;
  img?: string;
}

export interface HomemadeRemedy {
  name: string;
  timeToUse: "Morning" | "Evening" | "Weekly";
  ingredients: string[];
  preparation: string;
  benefit: string;
  product_search: string;
}

export interface VideoSuggestion {
  title: string;
  category: string;
  description: string;
  tip: string;
  youtubeUrl: string;
  duration: string;
}

export interface SkinAnalysisResponse {
  skinScore: number;
  skinType: string;
  primaryConcern: string;
  concernsDetail: {
    concern: string;
    severity: "Mild" | "Moderate" | "Severe";
    description: string;
  }[];
  metrics: {
    hydration: number;
    sebum: number; // Will represent Oiliness
    elasticity: number;
    melaninDepth: number;
    texture?: number;
    smoothness?: number;
  };
  understandingNote: string;
  morningRoutine: string[];
  eveningRoutine: string[];
  weeklyRoutine?: string[];
  monthlyRoutine?: string[];
  homemadeRemedies: HomemadeRemedy[];
  productRecommendations: ProductRecommendation[];
  videoSuggestions?: VideoSuggestion[];
  routineVideoLinks?: {
    morningRemedyUrl?: string;
    morningProductUrl?: string;
    eveningRemedyUrl?: string;
    eveningProductUrl?: string;
    monthlyRemedyUrl?: string;
    monthlyProductUrl?: string;
  };
  matchedIssues?: {
    id: string;
    name: string;
    issue_description: string;
    solving_approach: string;
    daily_homemade_routine: {
      title: string;
      ingredients: string[];
      steps: string;
      youtube_tutorial: string;
    };
    am_homemade_routine?: {
      title: string;
      ingredients: string[];
      steps: string;
      youtube_tutorial: string;
    };
    pm_homemade_routine?: {
      title: string;
      ingredients: string[];
      steps: string;
      youtube_tutorial: string;
    };
    product_recommendation: {
      type: string;
      why: string;
      amazon_link: string;
    };
    weekly_routine: {
      type: string;
      title: string;
      ingredients?: string[];
      why?: string;
      youtube_tutorial?: string;
      amazon_link?: string;
    };
    disclaimer: string;
  }[];
  globalDisclaimer?: string;
}

export type AppPhase =
  | "landing"
  | "testimonials"
  | "name"
  | "age"
  | "gender"
  | "skin_type"
  | "routine_check"
  | "concerns"
  | "upload"
  | "scanning"
  | "reveal"
  | "metrics_detail"
  | "zone_mapping"
  | "treatment_program"
  | "timeline"
  | "commitment"
  | "paywall"
  | "unlocked_report";
