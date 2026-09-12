import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import { TrendingUp, Droplets, Activity, Layers, ShieldCheck } from "lucide-react";

interface SkinTrajectoryChartProps {
  currentScore?: number;
  hydrationScore?: number;
  sebumScore?: number;
  elasticityScore?: number;
  textureScore?: number;
  selectedConcerns?: string[];
}

export default function SkinTrajectoryChart({
  currentScore = 72,
  hydrationScore = 60,
  sebumScore = 45,
  elasticityScore = 68,
  textureScore = 64,
  selectedConcerns = []
}: SkinTrajectoryChartProps) {
  const [activeMetricView, setActiveMetricView] = useState<"all" | "hydration" | "elasticity" | "texture">("all");

  // Determine severity based on concerns count, low scores, or severe concern triggers
  const concernCount = selectedConcerns.length;
  const isHighSeverity = 
    concernCount >= 3 ||
    currentScore < 68 ||
    hydrationScore < 50 ||
    selectedConcerns.some((c) => 
      /acne|congestion|redness|sensitivity|hyperpigmentation|dark spots|severe/i.test(c)
    );

  // Total duration: 2 Weeks for mild/moderate, 3 Weeks for highly severe facial problems
  const totalWeeks = isHighSeverity ? 3 : 2;
  const totalDays = totalWeeks * 7;

  // Baseline and target improvements
  const baseScore = currentScore;
  const targetScore = Math.min(98, Math.max(88, baseScore + (isHighSeverity ? 24 : 18)));

  const baseHydration = hydrationScore;
  const targetHydration = Math.min(98, Math.max(90, baseHydration + (isHighSeverity ? 34 : 26)));

  const baseElasticity = elasticityScore;
  const targetElasticity = Math.min(96, Math.max(88, baseElasticity + (isHighSeverity ? 22 : 16)));

  const baseTexture = textureScore;
  const targetTexture = Math.min(97, Math.max(90, baseTexture + (isHighSeverity ? 28 : 20)));

  // Generate 2 or 3-week daily trajectory data points
  const generateChartData = () => {
    // Checkpoint intervals
    const checkpoints = isHighSeverity
      ? [
          { day: 0, label: "Day 0", weekLabel: "Baseline", stage: "Baseline Diagnostics" },
          { day: 3, label: "Day 3", weekLabel: "W1 Early", stage: "Barrier Stabilization" },
          { day: 7, label: "Day 7", weekLabel: "Week 1", stage: "Microbiome Reset" },
          { day: 11, label: "Day 11", weekLabel: "W2 Mid", stage: "Cellular Soothing & Hydration" },
          { day: 14, label: "Day 14", weekLabel: "Week 2", stage: "Pore & Redness Clearance" },
          { day: 18, label: "Day 18", weekLabel: "W3 Mid", stage: "Collagen & Elasticity Boost" },
          { day: 21, label: "Day 21", weekLabel: "Week 3", stage: "Peak Glass Skin Clarity" }
        ]
      : [
          { day: 0, label: "Day 0", weekLabel: "Baseline", stage: "Baseline Diagnostics" },
          { day: 2, label: "Day 2", weekLabel: "W1 Early", stage: "Deep Hydration Infusion" },
          { day: 5, label: "Day 5", weekLabel: "W1 Mid", stage: "Barrier Smoothing" },
          { day: 7, label: "Day 7", weekLabel: "Week 1", stage: "Tone & Radiance Lift" },
          { day: 10, label: "Day 10", weekLabel: "W2 Mid", stage: "Texture Refinement" },
          { day: 12, label: "Day 12", weekLabel: "W2 Late", stage: "Elasticity Firming" },
          { day: 14, label: "Day 14", weekLabel: "Week 2", stage: "Glass Skin Glow Achieved" }
        ];

    return checkpoints.map((cp) => {
      const t = cp.day / totalDays;
      // Responsive S-curve progression
      const factor = Math.sin((t * Math.PI) / 2);

      const hydVal = Math.round(baseHydration + (targetHydration - baseHydration) * factor);
      const elaVal = Math.round(baseElasticity + (targetElasticity - baseElasticity) * factor);
      const texVal = Math.round(baseTexture + (targetTexture - baseTexture) * factor);
      const scoreVal = Math.round(baseScore + (targetScore - baseScore) * factor);

      // Degradation projection without routine
      const noRoutineVal = Math.max(45, Math.round(baseScore - (cp.day / 7) * 0.8));

      return {
        day: cp.day,
        label: cp.label,
        weekLabel: cp.weekLabel,
        stage: cp.stage,
        hydration: hydVal,
        elasticity: elaVal,
        texture: texVal,
        overallScore: scoreVal,
        withoutRoutine: noRoutineVal
      };
    });
  };

  const chartData = generateChartData();

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#3D2D29] text-[#FAF6F0] p-3.5 rounded-2xl border border-[#CBA38E]/50 shadow-xl text-xs space-y-2 z-50 min-w-[210px]">
          <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-1.5">
            <span className="font-mono font-bold text-amber-300 uppercase tracking-wider">{data.label} ({data.weekLabel})</span>
            <span className="text-[10px] text-white/70 font-mono">{data.stage}</span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-blue-300 font-medium">
                <Droplets className="w-3 h-3 text-blue-400" />
                Hydration:
              </span>
              <span className="font-mono font-bold text-white text-sm">{data.hydration}%</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                <Activity className="w-3 h-3 text-rose-400" />
                Elasticity:
              </span>
              <span className="font-mono font-bold text-white text-sm">{data.elasticity}%</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Layers className="w-3 h-3 text-amber-400" />
                Texture Refinement:
              </span>
              <span className="font-mono font-bold text-white text-sm">{data.texture}%</span>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-1.5">
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Overall Score:
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">{data.overallScore} pts</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#FAF6F0] border border-[#E3C2B0]/40 rounded-3xl p-5 sm:p-7 space-y-6" id="section-skin-trajectory">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3C2B0]/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#3D2D29] text-[#FAF6F0] text-[8px] font-mono font-bold uppercase rounded-md tracking-wider">
              {totalWeeks}-WEEK TARGETED CLINICAL JOURNEY
            </span>
            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
              isHighSeverity 
                ? "bg-amber-100/80 text-amber-900 border-amber-300"
                : "bg-emerald-100/80 text-emerald-900 border-emerald-300"
            }`}>
              {isHighSeverity ? "3-Week Intensive Protocol (High Concern Focus)" : "2-Week Accelerated Routine (Targeted Focus)"}
            </span>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#3D2D29] font-sans">
            Hydration, Elasticity & Texture Progress Over {totalWeeks} Weeks
          </h3>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-1 bg-[#F4EDE4] p-1 rounded-xl border border-[#E3C2B0]/40 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveMetricView("all")}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
              activeMetricView === "all"
                ? "bg-[#3D2D29] text-[#FAF6F0] shadow-xs"
                : "text-[#3D2D29]/70 hover:text-[#3D2D29]"
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setActiveMetricView("hydration")}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeMetricView === "hydration"
                ? "bg-blue-900 text-white shadow-xs"
                : "text-blue-900/80 hover:text-blue-900"
            }`}
          >
            <Droplets className="w-3 h-3 text-blue-500" />
            Hydration
          </button>
          <button
            onClick={() => setActiveMetricView("elasticity")}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeMetricView === "elasticity"
                ? "bg-rose-900 text-white shadow-xs"
                : "text-rose-900/80 hover:text-rose-900"
            }`}
          >
            <Activity className="w-3 h-3 text-rose-500" />
            Elasticity
          </button>
          <button
            onClick={() => setActiveMetricView("texture")}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeMetricView === "texture"
                ? "bg-amber-800 text-white shadow-xs"
                : "text-amber-900/80 hover:text-amber-900"
            }`}
          >
            <Layers className="w-3 h-3 text-amber-500" />
            Texture
          </button>
        </div>
      </div>

      {/* 3 Metric Cards: Baseline vs Growth */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Hydration Card */}
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-2xs space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              Hydration Progress
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +{targetHydration - baseHydration}% in {totalWeeks} Wks
            </span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-black font-mono text-[#3D2D29]">{baseHydration}%</span>
            <span className="text-xs text-[#3D2D29]/50 font-mono">➔</span>
            <span className="text-2xl font-black font-mono text-blue-700">{targetHydration}%</span>
          </div>
          <p className="text-[10px] text-[#3D2D29]/70 font-sans">
            Rapid moisture surge restores cellular plumpness and strengthens barrier defense.
          </p>
        </div>

        {/* Elasticity Card */}
        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              Elasticity & Bounce
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +{targetElasticity - baseElasticity}% in {totalWeeks} Wks
            </span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-black font-mono text-[#3D2D29]">{baseElasticity}%</span>
            <span className="text-xs text-[#3D2D29]/50 font-mono">➔</span>
            <span className="text-2xl font-black font-mono text-rose-600">{targetElasticity}%</span>
          </div>
          <p className="text-[10px] text-[#3D2D29]/70 font-sans">
            Targeted lipid and peptide synergy reactivates skin cushion and snap-back firmness.
          </p>
        </div>

        {/* Texture Card */}
        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              Texture Smoothing
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +{targetTexture - baseTexture}% in {totalWeeks} Wks
            </span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-black font-mono text-[#3D2D29]">{baseTexture}%</span>
            <span className="text-xs text-[#3D2D29]/50 font-mono">➔</span>
            <span className="text-2xl font-black font-mono text-amber-700">{targetTexture}%</span>
          </div>
          <p className="text-[10px] text-[#3D2D29]/70 font-sans">
            Smooths rough cellular accumulation, tightens micro-pores, and boosts light bounce.
          </p>
        </div>
      </div>

      {/* Main Interactive Progression Chart */}
      <div className="bg-white p-5 rounded-2xl border border-[#E3C2B0]/30 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAF6F0] pb-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {(activeMetricView === "all" || activeMetricView === "hydration") && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-500 rounded-sm inline-block"></span>
                <span className="font-bold text-[#3D2D29]">Hydration</span>
              </span>
            )}
            {(activeMetricView === "all" || activeMetricView === "elasticity") && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#E879A0] rounded-sm inline-block"></span>
                <span className="font-bold text-[#3D2D29]">Elasticity</span>
              </span>
            )}
            {(activeMetricView === "all" || activeMetricView === "texture") && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-500 rounded-sm inline-block"></span>
                <span className="font-bold text-[#3D2D29]">Texture</span>
              </span>
            )}
            {activeMetricView === "all" && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#3D2D29] rounded-full inline-block"></span>
                <span className="font-bold text-[#3D2D29]">Overall Glass Score</span>
              </span>
            )}
          </div>

          <span className="text-[10px] text-[#CBA38E] font-bold uppercase tracking-wider">
            Target: 90%+ Glass Skin Glow
          </span>
        </div>

        {/* Recharts Canvas */}
        <div className="w-full h-[280px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hydGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3182CE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3182CE" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="elaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E879A0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E879A0" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="texGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D69E2E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D69E2E" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#F4EDE4" vertical={false} />

              <XAxis
                dataKey="label"
                tick={{ fill: "#3D2D29", fontSize: 11, fontFamily: "monospace" }}
                axisLine={{ stroke: "#E3C2B0", strokeWidth: 1 }}
                tickLine={false}
              />

              <YAxis
                domain={[45, 100]}
                tick={{ fill: "#3D2D29", fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine y={90} stroke="#CBA38E" strokeDasharray="3 3" label={{ value: "Peak Glass Threshold (90%)", fill: "#CBA38E", fontSize: 9, position: "top" }} />

              {/* Hydration Area/Line */}
              {(activeMetricView === "all" || activeMetricView === "hydration") && (
                <Area
                  type="monotone"
                  dataKey="hydration"
                  stroke="#2B6CB0"
                  strokeWidth={2.5}
                  fill="url(#hydGradient)"
                  name="Hydration"
                  activeDot={{ r: 6, fill: "#2B6CB0", stroke: "#FAF6F0", strokeWidth: 2 }}
                />
              )}

              {/* Elasticity Area/Line */}
              {(activeMetricView === "all" || activeMetricView === "elasticity") && (
                <Area
                  type="monotone"
                  dataKey="elasticity"
                  stroke="#E879A0"
                  strokeWidth={2.5}
                  fill="url(#elaGradient)"
                  name="Elasticity"
                  activeDot={{ r: 6, fill: "#E879A0", stroke: "#FAF6F0", strokeWidth: 2 }}
                />
              )}

              {/* Texture Area/Line */}
              {(activeMetricView === "all" || activeMetricView === "texture") && (
                <Area
                  type="monotone"
                  dataKey="texture"
                  stroke="#D69E2E"
                  strokeWidth={2.5}
                  fill="url(#texGradient)"
                  name="Texture"
                  activeDot={{ r: 6, fill: "#D69E2E", stroke: "#FAF6F0", strokeWidth: 2 }}
                />
              )}

              {/* Overall Score Line */}
              {activeMetricView === "all" && (
                <Line
                  type="monotone"
                  dataKey="overallScore"
                  stroke="#3D2D29"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#3D2D29" }}
                  name="Overall Score"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trajectory Milestone Stages: Dynamic 2 or 3 Week Blocks */}
      {isHighSeverity ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-white p-3.5 rounded-xl border border-[#E3C2B0]/20 space-y-1">
            <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider">Week 1 (Days 1 - 7)</span>
            <h5 className="text-xs font-bold text-[#3D2D29] font-sans">Barrier Stabilization & Microbiome Calm</h5>
            <p className="text-[10px] text-[#3D2D29]/70 leading-relaxed font-sans">
              Calms severe redness, unclogs congestion, and floods the acid mantle with humectants.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E3C2B0]/20 space-y-1">
            <span className="text-[9px] font-mono font-bold text-amber-700 uppercase tracking-wider">Week 2 (Days 8 - 14)</span>
            <h5 className="text-xs font-bold text-[#3D2D29] font-sans">Active Texture Smoothing & Pore Clear</h5>
            <p className="text-[10px] text-[#3D2D29]/70 leading-relaxed font-sans">
              Accelerates cellular sloughing, clears lingering blemishes, and improves smoothness.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E3C2B0]/20 space-y-1">
            <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-wider">Week 3 (Days 15 - 21)</span>
            <h5 className="text-xs font-bold text-[#3D2D29] font-sans">Peak Glass Skin & High Translucency</h5>
            <p className="text-[10px] text-[#3D2D29]/70 leading-relaxed font-sans">
              Firm elasticity rebound with 90%+ moisture retention and luminous glass clarity.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-white p-3.5 rounded-xl border border-[#E3C2B0]/20 space-y-1">
            <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider">Week 1 (Days 1 - 7)</span>
            <h5 className="text-xs font-bold text-[#3D2D29] font-sans">Hydration Infusion & Tone Balancing</h5>
            <p className="text-[10px] text-[#3D2D29]/70 leading-relaxed font-sans">
              Infuses ceramides and glycerin to restore water balance and banish surface dullness.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#E3C2B0]/20 space-y-1">
            <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-wider">Week 2 (Days 8 - 14)</span>
            <h5 className="text-xs font-bold text-[#3D2D29] font-sans">Glass Skin Radiance & Micro-Firmness</h5>
            <p className="text-[10px] text-[#3D2D29]/70 leading-relaxed font-sans">
              Completes pore refinement, builds bouncy elasticity, and achieves a luminous dewy finish.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
