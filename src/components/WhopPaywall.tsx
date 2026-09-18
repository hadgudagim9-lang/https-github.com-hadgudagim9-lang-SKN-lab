import React from "react";
import { 
  Percent,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface WhopPaywallProps {
  userName?: string;
  timerSeconds?: number;
  formatTimer?: (sec: number) => string;
}

export default function WhopPaywall({ 
  timerSeconds = 560,
  formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
}: WhopPaywallProps) {
  const checkoutUrl = "https://whop.com/checkout/plan_RcK1E3yWGzGyw";
  const timeFormatted = formatTimer(timerSeconds);

  const handleOpenCheckout = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      // 1. Attempt window.open first
      const newWin = window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      if (!newWin || newWin.closed || typeof newWin.closed === "undefined") {
        // If popup was blocked by browser or iframe sandbox, direct top-level navigation
        if (window.top && window.top !== window) {
          window.top.location.href = checkoutUrl;
        } else {
          window.location.href = checkoutUrl;
        }
      }
    } catch {
      try {
        if (window.top) {
          window.top.location.href = checkoutUrl;
        } else {
          window.location.href = checkoutUrl;
        }
      } catch {
        window.location.href = checkoutUrl;
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center animate-in fade-in duration-300 py-1" id="whop-paywall-screen">

      {/* ========================================================================= */}
      {/* TOP COUNTDOWN & OFFER BANNER (Brand Matched Espresso & Rose Theme) */}
      {/* ========================================================================= */}
      <div className="w-full bg-gradient-to-b from-[#2C1A0E] to-[#3D2617] border border-[#E3C2B0]/30 rounded-3xl p-5 sm:p-6 text-white shadow-xl mb-5 text-center relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E879A0]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#C98A70]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header Text */}
        <h2 className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#FAF7F4] mb-3.5 flex items-center justify-center gap-2">
          <span>Introductory offer expires in</span>
          <span className="font-mono text-[#E879A0] font-black">{timeFormatted}</span>
        </h2>

        {/* Center Discount Box */}
        <div className="w-full bg-white/10 backdrop-blur-md border border-[#E3C2B0]/40 rounded-2xl p-3.5 flex items-center justify-center gap-2.5 shadow-inner mb-3">
          <div className="w-7 h-7 rounded-xl bg-[#E879A0]/25 border border-[#E879A0]/40 flex items-center justify-center text-[#FAF7F4]">
            <Percent className="w-4 h-4 text-[#E879A0]" />
          </div>
          <span className="font-serif font-black text-base sm:text-lg tracking-wider text-white">
            SPECIAL OFFER APPLIED
          </span>
        </div>

        {/* Sub-label */}
        <div className="flex items-center justify-between text-xs text-[#FAF7F4]/80 font-medium px-2">
          <span>Discount reserved for:</span>
          <span className="font-mono font-bold text-[#E879A0] text-sm">{timeFormatted}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SINGLE PAYMENT OPTION CARD: LIFETIME ACCESS PLAN */}
      {/* ========================================================================= */}
      <div className="w-full relative mb-4">
        
        {/* Access Pill */}
        <div className="absolute -top-3 left-4 z-10 bg-[#2C1A0E] border border-[#E3C2B0]/60 text-[#FAF7F4] text-[10px] font-mono font-black uppercase tracking-wider px-3 py-0.5 rounded-md shadow-sm">
          <span>FULL ACCESS</span>
        </div>

        {/* Clickable Card Link that triggers Whop checkout */}
        <a
          href={checkoutUrl}
          target="_top"
          rel="noopener noreferrer"
          onClick={handleOpenCheckout}
          id="single-plan-checkout-card"
          className="block w-full bg-white border-2 border-[#2C1A0E] rounded-3xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all cursor-pointer group active:scale-[0.99] relative"
        >
          <div className="flex items-center justify-between gap-3">
            
            {/* Left: Radio + Plan Description */}
            <div className="flex items-center gap-3.5 text-left">
              {/* Selected Radio Indicator */}
              <div className="w-6 h-6 rounded-full border-2 border-[#2C1A0E] flex items-center justify-center shrink-0 bg-[#FAF7F4]">
                <div className="w-3 h-3 rounded-full bg-[#2C1A0E]" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#2C1A0E] group-hover:text-[#8B5E3C] transition-colors flex items-center gap-1.5">
                  <span>Lifetime Access Plan</span>
                </h3>
                <span className="text-[10px] text-emerald-700 font-bold block mt-1 uppercase tracking-wide">
                  ✓ Full Custom Routine & Bio-Metrics Report
                </span>
              </div>
            </div>

            {/* Right: Continue Action Pill */}
            <div className="bg-[#FAF7F4] border border-[#E3C2B0] rounded-2xl px-4 py-2.5 text-center shrink-0 flex items-center justify-center text-[#2C1A0E] font-serif font-bold text-xs group-hover:bg-[#2C1A0E] group-hover:text-white transition-colors shadow-2xs">
              <span>Continue</span>
            </div>

          </div>
        </a>
      </div>

      {/* Main Action Button */}
      <div className="w-full space-y-2 mb-4">
        <a
          href={checkoutUrl}
          target="_top"
          rel="noopener noreferrer"
          onClick={handleOpenCheckout}
          id="pay-and-unlock-report-btn"
          className="w-full py-4 bg-[#2C1A0E] hover:bg-[#3D2D29] text-white font-serif font-bold text-sm sm:text-base rounded-2xl shadow-lg flex items-center justify-center hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer text-center uppercase tracking-wider"
        >
          <span>Get My Plan & Full Report</span>
        </a>

        {/* Direct Link Backup */}
        <div className="text-center pt-0.5">
          <a
            href={checkoutUrl}
            target="_top"
            rel="noopener noreferrer"
            onClick={handleOpenCheckout}
            className="text-[11px] text-[#8B5E3C] hover:text-[#2C1A0E] font-medium underline transition cursor-pointer"
          >
            Direct checkout link: whop.com/checkout/plan_RcK1E3yWGzGyw
          </a>
        </div>

        <p className="text-[11px] text-[#2C1A0E]/70 text-center font-medium flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2C1A0E]" />
          <span>Secure 256-Bit Encrypted Checkout Powered by Whop</span>
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SOCIAL PROOF CARD */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border border-[#E3C2B0] rounded-3xl p-4 sm:p-5 text-left mb-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FAF7F4] border border-[#E3C2B0] flex items-center justify-center shrink-0 mt-0.5">
            <ThumbsUp className="w-4 h-4 text-[#2C1A0E] fill-[#2C1A0E]" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-[#2C1A0E]/90 leading-relaxed font-medium">
              People who used SKN LAB for 3 months felt their skin was twice as smooth and noticed a big improvement in texture compared to just 1 month*
            </p>
            <span className="text-[10px] text-[#2C1A0E]/60 block mt-1.5 font-medium">
              *According to user research, 2026
            </span>
          </div>
        </div>
      </div>

      {/* Verified payment methods */}
      <div className="w-full flex items-center justify-center gap-3 text-[11px] text-[#2C1A0E]/60 mb-2 font-medium">
        <span>Apple Pay</span>
        <span>•</span>
        <span>Google Pay</span>
        <span>•</span>
        <span>Credit / Debit Cards</span>
      </div>

    </div>
  );
}
