import React, { useState } from "react";
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  MessageSquarePlus, 
  X, 
  Filter,
  Check,
  ChevronLeft
} from "lucide-react";
import womanDewyImg from "../assets/images/homepage_woman_dewy_long_1782989531484.jpg";
import manDewyImg from "../assets/images/homepage_man_dewy_face_only_1782989746439.jpg";
import womanDryImg from "../assets/images/homepage_woman_dry_smile_1782988379051.jpg";
import manDryImg from "../assets/images/homepage_man_dry_shaven_1782988365659.jpg";
import frecklesImg from "../assets/images/freckles_model_home_1782748113330.jpg";
import dewyModelImg from "../assets/images/skincare_dewy_model_1782741556073.jpg";
import maleModelImg from "../assets/images/skincare_male_model_1782747287716.jpg";

interface TestimonialItem {
  id: string;
  name: string;
  age: number;
  location: string;
  concernCategory: string;
  beforeScore: number;
  afterScore: number;
  timeline: string;
  rating: number;
  title: string;
  story: string;
  keyRoutine: string;
  beforeImg: string;
  afterImg: string;
  verifiedScan: boolean;
  helpfulCount: number;
  date: string;
}

const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Elena Rostova",
    age: 22,
    location: "Chicago, IL",
    concernCategory: "Acne & Blemishes",
    beforeScore: 52,
    afterScore: 94,
    timeline: "3 Weeks",
    rating: 5,
    title: "My hormonal acne cleared up without harsh prescriptions!",
    story: "I struggled with deep jawline breakouts for 3 years. The SKN LAB scan spotted severe moisture barrier damage caused by over-exfoliating. Following the customized evening honey-oat mask and barrier serum completely calmed my skin in 21 days.",
    keyRoutine: "Gentle Cica Cleanser + Oat Bio-Mask + SPF 50",
    beforeImg: womanDryImg,
    afterImg: womanDewyImg,
    verifiedScan: true,
    helpfulCount: 342,
    date: "2 days ago"
  },
  {
    id: "2",
    name: "Marcus Vance",
    age: 26,
    location: "Austin, TX",
    concernCategory: "Men's Skincare",
    beforeScore: 58,
    afterScore: 91,
    timeline: "4 Weeks",
    rating: 5,
    title: "Simple, no-nonsense routine that actually works for men.",
    story: "As a guy who never knew what products to use, the scan broke down my oily T-zone and razor bump irritation clearly. The 3-product clean recommendation and green tea ice therapy fixed my redness in under a month.",
    keyRoutine: "Salicylic Cleanser + Niacinamide Serum + Lightweight Gel",
    beforeImg: manDryImg,
    afterImg: manDewyImg,
    verifiedScan: true,
    helpfulCount: 289,
    date: "1 week ago"
  },
  {
    id: "3",
    name: "Sophia Chen",
    age: 29,
    location: "Seattle, WA",
    concernCategory: "Hydration & Barrier",
    beforeScore: 46,
    afterScore: 96,
    timeline: "14 Days",
    rating: 5,
    title: "Restored my flaky skin barrier after a failed chemical peel.",
    story: "My skin was stinging every time I applied moisturizer. SKN LAB identified my hydration level at only 28%. The AI recommended stopping active acids and prescribed a lipid-replenishing routine. My face feels glowing and supple again!",
    keyRoutine: "Rice Water Tonic + Ceramide Complex + Squalane Oil",
    beforeImg: frecklesImg,
    afterImg: dewyModelImg,
    verifiedScan: true,
    helpfulCount: 198,
    date: "2 weeks ago"
  },
  {
    id: "4",
    name: "David K.",
    age: 26,
    location: "Miami, FL",
    concernCategory: "Anti-Aging & Firmness",
    beforeScore: 61,
    afterScore: 89,
    timeline: "6 Weeks",
    rating: 5,
    title: "Dramatically softened forehead lines and dark eye circles.",
    story: "The facial zone mapping accurately highlighted elasticity loss around my eyes. The customized peptide treatment and daily facial massage technique gave my skin a plump, refreshed look that my colleagues noticed instantly.",
    keyRoutine: "Peptide Complex + DIY Avocado Eye Mask + Hydrating Sunscreen",
    beforeImg: maleModelImg,
    afterImg: manDewyImg,
    verifiedScan: true,
    helpfulCount: 156,
    date: "3 weeks ago"
  }
];

interface TestimonialsPageProps {
  onStartAnalysis: () => void;
  onBack?: () => void;
}

export default function TestimonialsPage({ onStartAnalysis, onBack }: TestimonialsPageProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Stories");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Submit story form state
  const [newStoryName, setNewStoryName] = useState("");
  const [newStoryAge, setNewStoryAge] = useState("");
  const [newStoryCategory, setNewStoryCategory] = useState("Acne & Blemishes");
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [newStoryText, setNewStoryText] = useState("");

  const categories = [
    "All Stories",
    "Acne & Blemishes",
    "Hydration & Barrier",
    "Anti-Aging & Firmness",
    "Men's Skincare"
  ];

  const filteredTestimonials = selectedCategory === "All Stories"
    ? testimonials
    : testimonials.filter(t => t.concernCategory === selectedCategory);

  const toggleHelpful = (id: string) => {
    setHelpfulVotes(prev => {
      const current = prev[id];
      setTestimonials(list => list.map(t => {
        if (t.id === id) {
          return { ...t, helpfulCount: current ? t.helpfulCount - 1 : t.helpfulCount + 1 };
        }
        return t;
      }));
      return { ...prev, [id]: !current };
    });
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryName || !newStoryText) return;

    const newEntry: TestimonialItem = {
      id: Date.now().toString(),
      name: newStoryName.trim(),
      age: parseInt(newStoryAge) || 26,
      location: "Verified User",
      concernCategory: newStoryCategory,
      beforeScore: 54,
      afterScore: 92,
      timeline: "3 Weeks",
      rating: 5,
      title: newStoryTitle.trim() || "Amazing Skin Transformation!",
      story: newStoryText.trim(),
      keyRoutine: "SKN LAB AI Personalized Routine & DIY Remedies",
      beforeImg: womanDryImg,
      afterImg: womanDewyImg,
      verifiedScan: true,
      helpfulCount: 1,
      date: "Just now"
    };

    setTestimonials([newEntry, ...testimonials]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setNewStoryName("");
      setNewStoryAge("");
      setNewStoryTitle("");
      setNewStoryText("");
    }, 1800);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-2 px-3 sm:px-4 text-[#2C1A0E] animate-in fade-in duration-300">
      
      {/* Top Header / Back Action if provided */}
      {onBack && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E3C2B0]/30">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2C1A0E] hover:opacity-80 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Analysis</span>
          </button>
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-[#E3C2B0]">
            Verified Reviews & Proof
          </span>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="text-center mb-6 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4EDE4] rounded-full border border-[#E3C2B0] text-[#2C1A0E] text-[10px] font-mono uppercase tracking-widest font-bold mb-3">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#E879A0]" />
          14,800+ Verified Transformations
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1A0E] mb-2 tracking-tight">
          Real People. Real Skin Results.
        </h1>
        <p className="text-xs sm:text-sm text-[#2C1A0E]/70 max-w-md mx-auto leading-relaxed">
          See how thousands of users unlocked clear, glowing glass skin using SKN LAB's AI face analysis and custom routines.
        </p>

        {/* Rating Overview Pill */}
        <div className="mt-4 inline-flex items-center gap-3 bg-white border border-[#E3C2B0]/80 rounded-2xl px-4 py-2 shadow-xs">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-500" />
            ))}
          </div>
          <div className="text-left border-l border-[#E3C2B0]/60 pl-3">
            <span className="text-sm font-serif font-bold text-[#2C1A0E]">4.9 / 5.0</span>
            <span className="text-[10px] text-[#2C1A0E]/60 block font-medium">Based on 14,820 clinical scans</span>
          </div>
        </div>
      </div>

      {/* Key Proof Highlights Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        <div className="bg-white p-3 rounded-2xl border border-[#E3C2B0]/60 text-center shadow-2xs">
          <span className="text-lg sm:text-xl font-serif font-bold text-[#2C1A0E] block">98%</span>
          <span className="text-[10px] text-[#2C1A0E]/70 font-medium leading-tight block">Noticed clearer skin in 21 days</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#E3C2B0]/60 text-center shadow-2xs">
          <span className="text-lg sm:text-xl font-serif font-bold text-[#2C1A0E] block">94%</span>
          <span className="text-[10px] text-[#2C1A0E]/70 font-medium leading-tight block">Repaired moisture barrier strength</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#E3C2B0]/60 text-center shadow-2xs">
          <span className="text-lg sm:text-xl font-serif font-bold text-[#2C1A0E] block">+38 Pts</span>
          <span className="text-[10px] text-[#2C1A0E]/70 font-medium leading-tight block">Average Skin Score increase</span>
        </div>
      </div>

      {/* Category Filter Pills & Add Story Button */}
      <div className="flex items-center justify-between gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#2C1A0E] text-white shadow-xs"
                  : "bg-white text-[#2C1A0E]/80 border border-[#E3C2B0]/80 hover:bg-[#F4EDE4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#2C1A0E] hover:text-white border border-[#E3C2B0] text-[#2C1A0E] text-xs font-bold rounded-full transition shadow-2xs cursor-pointer"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-[#E879A0]" />
          <span className="hidden sm:inline">Submit Your Story</span>
        </button>
      </div>

      {/* Testimonial Cards List */}
      <div className="space-y-4 mb-8">
        {filteredTestimonials.map((item) => (
          <div 
            key={item.id}
            className="bg-white border border-[#E3C2B0] rounded-3xl p-4 sm:p-5 shadow-xs transition hover:shadow-md"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#E3C2B0] overflow-hidden shrink-0 relative">
                  <img 
                    src={item.afterImg} 
                    alt={item.name}
                    className="w-full h-full object-cover blur-[2.5px] scale-105"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-sm text-[#2C1A0E]">{item.name}</h3>
                    <span className="text-[10px] text-[#2C1A0E]/60">• Age {item.age}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {item.verifiedScan && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        Verified AI Scan
                      </span>
                    )}
                    <span className="text-[9px] text-[#2C1A0E]/50 font-mono">{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                ))}
              </div>
            </div>

            {/* Before / After Progression Bar */}
            <div className="bg-[#FAF7F4] border border-[#E3C2B0]/60 rounded-2xl p-2.5 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-extrabold text-[#2C1A0E]/60">Skin Score:</span>
                <span className="text-xs font-mono line-through text-red-500/80 font-bold">{item.beforeScore}/100</span>
                <ArrowRight className="w-3 h-3 text-[#2C1A0E]/40" />
                <span className="text-xs font-mono text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md">
                  {item.afterScore}/100 (+{item.afterScore - item.beforeScore} pts)
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#2C1A0E]/70 bg-white px-2 py-0.5 rounded-full border border-[#E3C2B0]/50">
                ⏱ {item.timeline}
              </span>
            </div>

            {/* Title & Review Story */}
            <h4 className="font-serif font-bold text-sm text-[#2C1A0E] mb-1.5">
              "{item.title}"
            </h4>
            <p className="text-xs text-[#2C1A0E]/80 leading-relaxed mb-3">
              {item.story}
            </p>

            {/* Key Routine Badge */}
            <div className="bg-[#F4EDE4]/60 border border-[#E3C2B0]/40 rounded-xl p-2 mb-3 text-[11px] text-[#2C1A0E]">
              <span className="font-bold text-[#2C1A0E] block text-[10px] uppercase font-mono tracking-wider text-[#2C1A0E]/70 mb-0.5">
                Key AI Prescribed Routine:
              </span>
              <span className="font-medium text-[#2C1A0E]/90">✨ {item.keyRoutine}</span>
            </div>

            {/* Footer with helpful count */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E3C2B0]/30 text-[10px] text-[#2C1A0E]/60">
              <span>Posted {item.date}</span>
              <button
                onClick={() => toggleHelpful(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition cursor-pointer ${
                  helpfulVotes[item.id]
                    ? "bg-[#2C1A0E] text-white border-[#2C1A0E]"
                    : "bg-white text-[#2C1A0E]/70 border-[#E3C2B0]/60 hover:bg-[#FAF6F0]"
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful ({item.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Direct Call to Action Footer Box */}
      <div className="bg-[#2C1A0E] text-white rounded-3xl p-6 text-center relative overflow-hidden shadow-lg mb-6">
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5 text-[#E879A0]" />
          </div>

          <h3 className="text-xl font-serif font-bold text-white mb-2">
            Ready to unlock your personalized skin score?
          </h3>
          <p className="text-xs text-white/80 max-w-sm mx-auto mb-5 leading-relaxed">
            Get your instant AI analysis, zone mapping, and clean custom routines in under 60 seconds.
          </p>

          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#E879A0] hover:bg-[#E879A0]/90 text-white font-extrabold text-sm rounded-2xl shadow-md transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            Start Free AI Skin Scan Now →
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-[#2C1A0E]/60 uppercase tracking-wider text-center">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          Clinical AI Certified
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-[#E879A0]" />
          Dermatologist Tested
        </span>
      </div>

      {/* Submit Story Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-[#E3C2B0] shadow-2xl relative text-[#2C1A0E]">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#2C1A0E]/70 hover:text-[#2C1A0E] border border-[#E3C2B0]"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#2C1A0E]">Thank you for sharing!</h3>
                <p className="text-xs text-[#2C1A0E]/70">
                  Your transformation story has been added to our community wall.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddStory} className="space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2C1A0E] mb-1">
                    Share Your Skin Transformation
                  </h3>
                  <p className="text-xs text-[#2C1A0E]/60">
                    Help others discover what works for their unique skin type.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#2C1A0E]/70 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah M."
                      value={newStoryName}
                      onChange={(e) => setNewStoryName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F4] border border-[#E3C2B0] rounded-xl text-xs focus:outline-none focus:border-[#2C1A0E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#2C1A0E]/70 block mb-1">Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 29"
                      value={newStoryAge}
                      onChange={(e) => setNewStoryAge(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F4] border border-[#E3C2B0] rounded-xl text-xs focus:outline-none focus:border-[#2C1A0E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#2C1A0E]/70 block mb-1">Skin Concern Category</label>
                  <select
                    value={newStoryCategory}
                    onChange={(e) => setNewStoryCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F4] border border-[#E3C2B0] rounded-xl text-xs focus:outline-none focus:border-[#2C1A0E]"
                  >
                    <option>Acne & Blemishes</option>
                    <option>Hydration & Barrier</option>
                    <option>Anti-Aging & Firmness</option>
                    <option>Men's Skincare</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#2C1A0E]/70 block mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cleared my hormonal acne in 3 weeks!"
                    value={newStoryTitle}
                    onChange={(e) => setNewStoryTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F4] border border-[#E3C2B0] rounded-xl text-xs focus:outline-none focus:border-[#2C1A0E]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#2C1A0E]/70 block mb-1">Your Story & Results</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how your routine helped your skin..."
                    value={newStoryText}
                    onChange={(e) => setNewStoryText(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F4] border border-[#E3C2B0] rounded-xl text-xs focus:outline-none focus:border-[#2C1A0E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#2C1A0E] hover:bg-[#2C1A0E]/90 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Publish Transformation Story →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
