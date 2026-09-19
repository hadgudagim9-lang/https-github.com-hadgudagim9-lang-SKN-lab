import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import beforeImg from "../assets/images/homepage_skincare_woman_dry_1782988113169.jpg";
import afterImg from "../assets/images/homepage_woman_dewy_long_1782989531484.jpg";

interface SkinComparisonSliderProps {
  className?: string;
  badgeText?: string;
}

export default function SkinComparisonSlider({
  className = "",
  badgeText = "Clinical Skin Scan"
}: SkinComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Auto-demonstration slide animation on initial load to show users it actually slides
  useEffect(() => {
    if (hasInteracted) return;

    let startTime: number | null = null;
    const duration = 2200; // 2.2 seconds gentle sweep

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration && !hasInteracted) {
        // Sine wave swing: 50% -> 38% -> 62% -> 50%
        const angle = (progress / duration) * Math.PI * 2;
        const offset = Math.sin(angle) * 14;
        setSliderPosition(50 + offset);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setSliderPosition(50);
      }
    };

    // Small delay before beginning the gentle slide cue
    const timer = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 600);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hasInteracted]);

  // Update slider position based on clientX pointer coordinates
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(4, Math.min(96, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setHasInteracted(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsDragging(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    updatePosition(clientX);
  };

  // Window-level mouse move & up listeners for fluid dragging even when cursor leaves bounds
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      className={`relative select-none overflow-hidden cursor-ew-resize touch-none ${className}`}
      id="skin-comparison-slider"
      role="slider"
      aria-label="Before and After Skin Comparison Slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        setHasInteracted(true);
        if (e.key === "ArrowLeft") {
          setSliderPosition((prev) => Math.max(4, prev - 5));
        } else if (e.key === "ArrowRight") {
          setSliderPosition((prev) => Math.min(96, prev + 5));
        }
      }}
    >
      {/* 1. Base Layer: AFTER (Dewy Glass Skin) */}
      <img
        src={afterImg}
        alt="After: Hydrated Glowing Glass Skin"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        draggable={false}
      />

      {/* 2. Top Layer: BEFORE (Natural / Dry Texture) - Clipped to sliderPosition */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
        style={{
          clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`
        }}
      >
        <img
          src={beforeImg}
          alt="Before: Skin Baseline"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
        />

        {/* Subtle "BEFORE" Tag on the top left */}
        <div className="absolute top-3.5 left-3.5 z-10 bg-[#2C1A0E]/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[#FAF7F4] text-[10px] font-mono font-bold tracking-wider uppercase shadow-xs">
          Before
        </div>
      </div>

      {/* Subtle "AFTER" Tag on the top right */}
      <div className="absolute top-3.5 right-3.5 z-10 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/60 text-[#2C1A0E] text-[10px] font-mono font-bold tracking-wider uppercase shadow-xs">
        Glass Skin
      </div>

      {/* ========================================================================= */}
      {/* 3. THE BRIGHT LIGHT BAR & ARROW ("Barrow") */}
      {/* ========================================================================= */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Glowing light bloom aura behind the bar */}
        <div className="absolute top-0 bottom-0 -left-6 w-12 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none blur-[2px]" />

        {/* The razor-sharp bright light beam line */}
        <div className="absolute top-0 bottom-0 -left-[1.5px] w-[3px] bg-white shadow-[0_0_8px_#ffffff,0_0_18px_rgba(255,255,255,0.95),0_0_32px_rgba(232,121,160,0.6)]" />

        {/* The circular slider arrow button ("Barrow") positioned right in the center */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border-2 border-white shadow-[0_4px_16px_rgba(44,26,14,0.35),0_0_20px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#2C1A0E] transition-transform duration-100 ${
            isDragging ? "scale-115 shadow-[0_4px_22px_rgba(44,26,14,0.45),0_0_28px_rgba(255,255,255,1)]" : "scale-100 hover:scale-105"
          }`}
        >
          <div className="flex items-center -space-x-1 text-[#2C1A0E]">
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Floating Glassmorphism Clinical Badge at bottom right */}
      <div className="absolute bottom-3.5 right-3.5 z-10 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/60 text-[#2C1A0E] text-[11px] font-semibold flex items-center gap-1.5 shadow-sm pointer-events-none">
        <span>{badgeText}</span>
      </div>

      {/* Hint pill at bottom center that fades after user has interacted */}
      {!hasInteracted && (
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 bg-[#2C1A0E]/80 backdrop-blur-md text-white text-[10px] font-medium tracking-wide px-3 py-1 rounded-full border border-white/20 shadow-md animate-pulse pointer-events-none whitespace-nowrap">
          Slide bar to compare
        </div>
      )}
    </div>
  );
}
