import React, { useState } from 'react';
import { motion } from 'motion/react';
import { formatShortUsd } from '../../types/brokerage';

interface HeroObservatoryClusterProps {
  totalInventoryValue: number;
  availableCount: number;
  medianPrice: number;
}

const SERIES_DATA: Record<
  '1Y' | '3Y' | '5Y',
  {
    primaryPath: string;
    secondaryPath: string;
    points: { x: number; y: number }[];
    delta: string;
    label: string;
  }
> = {
  '1Y': {
    primaryPath: 'M 8 88 C 36 84, 52 72, 78 64 C 108 55, 132 58, 162 42 C 192 26, 218 30, 248 16',
    secondaryPath: 'M 8 96 C 42 94, 68 86, 98 81 C 134 76, 166 74, 202 62 C 224 55, 238 52, 248 48',
    points: [
      { x: 78, y: 64 },
      { x: 162, y: 42 },
      { x: 248, y: 16 },
    ],
    delta: '+24.8%',
    label: '12-month trailing index',
  },
  '3Y': {
    primaryPath: 'M 8 98 C 36 92, 66 88, 94 74 C 122 60, 148 64, 178 44 C 208 24, 228 24, 248 12',
    secondaryPath: 'M 8 102 C 44 100, 74 92, 108 86 C 142 80, 176 72, 206 60 C 226 53, 238 48, 248 44',
    points: [
      { x: 94, y: 74 },
      { x: 178, y: 44 },
      { x: 248, y: 12 },
    ],
    delta: '+61.4%',
    label: '36-month category appreciation',
  },
  '5Y': {
    primaryPath: 'M 8 104 C 40 98, 70 84, 102 72 C 136 60, 162 50, 192 34 C 216 21, 232 18, 248 10',
    secondaryPath: 'M 8 106 C 48 102, 82 96, 118 88 C 154 80, 186 70, 214 58 C 230 51, 240 46, 248 40',
    points: [
      { x: 102, y: 72 },
      { x: 192, y: 34 },
      { x: 248, y: 10 },
    ],
    delta: '+118.2%',
    label: '5-year ultra-premium benchmark',
  },
};

const BAR_HEIGHTS = [34, 48, 42, 66, 58, 78, 92, 84];

export const HeroObservatoryCluster: React.FC<HeroObservatoryClusterProps> = ({
  totalInventoryValue,
  availableCount,
  medianPrice,
}) => {
  const [range, setRange] = useState<'1Y' | '3Y' | '5Y'>('3Y');
  const activeSeries = SERIES_DATA[range];

  const ringRadius = 32;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = 0.964;

  return (
    <div className="relative w-full min-h-[450px] lg:min-h-[500px] select-none">
      {/* Subtle warm Ash editorial backdrop plate — Ventriloc style */}
      <div
        aria-hidden="true"
        className="absolute inset-x-4 top-5 bottom-4 bg-ash asymmetric-card"
      />

      {/* Card 1: Primary Valuation Index Line Chart (Top-Right Floating White Data Card) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 ml-auto w-full sm:w-[88%] bg-canvas-white data-widget-card border border-mist p-6 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[13px] font-editorial text-brass">
              Mortila Liquidity Index
            </p>
            <h3 className="text-[18px] font-editorial text-graphite mt-0.5">
              One-word .com &amp; .ai appreciation
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-fog p-1">
            {(['1Y', '3Y', '5Y'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`px-2 py-1 text-[12px] font-mono tabular-nums transition-colors cursor-pointer ${
                  range === key
                    ? 'bg-graphite text-canvas-white'
                    : 'text-slate hover:text-graphite'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[28px] font-editorial text-graphite tabular-nums leading-none">
              {activeSeries.delta}
            </span>
            <span className="text-[12px] text-slate">{activeSeries.label}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[12px] text-slate">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-[1.5px] bg-ember-orange" />
              Mortila Index
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-[1.5px] bg-brass" />
              Broad Market
            </span>
          </div>
        </div>

        {/* Flat Editorial SVG Chart */}
        <div className="relative h-[120px] w-full">
          <svg
            viewBox="0 0 260 116"
            className="w-full h-full overflow-visible"
            role="img"
            aria-label="Domain valuation appreciation chart"
          >
            {/* Subtle horizontal editorial gridlines */}
            {[20, 50, 80, 108].map((y) => (
              <line
                key={y}
                x1="0"
                x2="260"
                y1={y}
                y2={y}
                stroke="#efefef"
                strokeWidth="1"
              />
            ))}

            {/* Secondary Brass Benchmark Curve */}
            <motion.path
              key={`sec-${range}`}
              d={activeSeries.secondaryPath}
              fill="none"
              stroke="#816729"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Primary Ember Orange Curve */}
            <motion.path
              key={`pri-${range}`}
              d={activeSeries.primaryPath}
              fill="none"
              stroke="#ff682c"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Data nodes */}
            {activeSeries.points.map((pt, idx) => (
              <motion.circle
                key={`${range}-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={idx === activeSeries.points.length - 1 ? 4 : 2.5}
                fill={idx === activeSeries.points.length - 1 ? '#ff682c' : '#ffffff'}
                stroke="#ff682c"
                strokeWidth="1.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35 + idx * 0.15, duration: 0.3 }}
              />
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-mist text-[11px] font-mono text-slate tabular-nums">
          <span>Q1 2023</span>
          <span>Q4 2024</span>
          <span>Q2 2025</span>
          <span>Q4 2026</span>
        </div>
      </motion.div>

      {/* Bottom Overlapping Row: Two Complementary Data Widgets */}
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-12 gap-5 -mt-6 sm:-mt-8 px-1 sm:px-0">
        {/* Card 2: Managed Portfolio Valuation (Bottom-Left) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="sm:col-span-7 bg-canvas-white data-widget-card border border-mist p-6"
        >
          <p className="text-[13px] font-editorial text-slate">
            Active Inventory Value
          </p>
          <div className="mt-1.5 flex items-baseline gap-3">
            <span className="text-[32px] font-editorial text-graphite tabular-nums leading-none">
              {formatShortUsd(totalInventoryValue)}
            </span>
            <span className="text-[12px] font-mono text-ember-orange tabular-nums">
              {availableCount} listed
            </span>
          </div>

          {/* Animated Monoline Bar Histogram */}
          <div className="mt-5 flex items-end gap-2 h-[56px]">
            {BAR_HEIGHTS.map((height, idx) => (
              <div
                key={idx}
                className="flex-1 h-full flex items-end bg-fog"
              >
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.25 + idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    height: `${height}%`,
                    transformOrigin: 'bottom',
                  }}
                  className={`w-full ${
                    idx === 6
                      ? 'bg-ember-orange'
                      : idx >= 4
                      ? 'bg-graphite'
                      : 'bg-ivory'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-[12px] text-steel">
            <span>Median ask</span>
            <span className="font-mono tabular-nums text-graphite">
              {formatShortUsd(medianPrice)}
            </span>
          </div>
        </motion.div>

        {/* Card 3: Escrow Closing Velocity Ring (Bottom-Right) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="sm:col-span-5 bg-canvas-white data-widget-card border border-mist p-6 flex flex-col justify-between"
        >
          <div>
            <p className="text-[13px] font-editorial text-slate">
              Escrow Settlement
            </p>
            <p className="text-[15px] font-editorial text-graphite mt-0.5">
              Clean transfer rate
            </p>
          </div>

          <div className="my-3 flex items-center justify-center">
            <div className="relative w-[84px] h-[84px]">
              <svg
                viewBox="0 0 80 80"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label="96.4% escrow completion rate"
              >
                <circle
                  cx="40"
                  cy="40"
                  r={ringRadius}
                  fill="none"
                  stroke="#efefef"
                  strokeWidth="4.5"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={ringRadius}
                  fill="none"
                  stroke="#816729"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  initial={{ strokeDashoffset: ringCircumference }}
                  animate={{
                    strokeDashoffset: ringCircumference * (1 - ringProgress),
                  }}
                  transition={{ duration: 1.15, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[17px] font-editorial text-graphite tabular-nums leading-none">
                  96.4%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12px] text-steel border-t border-mist pt-2.5">
            <span>Median close</span>
            <span className="font-mono tabular-nums text-graphite">11 days</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
