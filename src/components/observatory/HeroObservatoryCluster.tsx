import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { formatShortUsd } from '../../types/brokerage';

interface HeroObservatoryClusterProps {
  totalInventoryValue: number;
  availableCount: number;
  medianPrice: number;
}

type TimeRange = '1Y' | '3Y' | '5Y';

const SERIES_DATA: Record<
  TimeRange,
  {
    primaryPath: string;
    areaPath: string;
    secondaryPath: string;
    scrubberPoints: { x: number; y: number; label: string; value: string }[];
    delta: string;
    caption: string;
  }
> = {
  '1Y': {
    primaryPath:
      'M 8 92 C 44 86, 72 74, 108 66 C 148 57, 184 60, 224 44 C 260 30, 294 34, 336 18',
    areaPath:
      'M 8 92 C 44 86, 72 74, 108 66 C 148 57, 184 60, 224 44 C 260 30, 294 34, 336 18 L 336 112 L 8 112 Z',
    secondaryPath:
      'M 8 100 C 52 96, 88 88, 130 82 C 178 76, 226 74, 274 62 C 304 56, 322 52, 336 48',
    scrubberPoints: [
      { x: 108, y: 66, label: 'Q2 2026', value: '+11.4%' },
      { x: 224, y: 44, label: 'Q3 2026', value: '+18.9%' },
      { x: 336, y: 18, label: 'Q4 2026', value: '+24.8%' },
    ],
    delta: '+24.8%',
    caption: '12-month trailing index',
  },
  '3Y': {
    primaryPath:
      'M 8 98 C 46 92, 86 86, 124 72 C 164 58, 200 62, 240 42 C 280 24, 308 26, 336 14',
    areaPath:
      'M 8 98 C 46 92, 86 86, 124 72 C 164 58, 200 62, 240 42 C 280 24, 308 26, 336 14 L 336 112 L 8 112 Z',
    secondaryPath:
      'M 8 104 C 54 100, 96 92, 144 86 C 192 80, 240 72, 282 60 C 308 52, 324 48, 336 44',
    scrubberPoints: [
      { x: 124, y: 72, label: '2024', value: '+26.2%' },
      { x: 240, y: 42, label: '2025', value: '+46.7%' },
      { x: 336, y: 14, label: '2026', value: '+61.4%' },
    ],
    delta: '+61.4%',
    caption: '36-month category appreciation',
  },
  '5Y': {
    primaryPath:
      'M 8 104 C 52 96, 94 82, 138 68 C 182 54, 218 46, 258 30 C 292 18, 314 16, 336 10',
    areaPath:
      'M 8 104 C 52 96, 94 82, 138 68 C 182 54, 218 46, 258 30 C 292 18, 314 16, 336 10 L 336 112 L 8 112 Z',
    secondaryPath:
      'M 8 106 C 62 102, 108 94, 158 86 C 208 78, 252 68, 290 56 C 312 49, 326 44, 336 39',
    scrubberPoints: [
      { x: 138, y: 68, label: '2023', value: '+44.0%' },
      { x: 258, y: 30, label: '2025', value: '+89.5%' },
      { x: 336, y: 10, label: '2026', value: '+118.2%' },
    ],
    delta: '+118.2%',
    caption: '5-year ultra-premium benchmark',
  },
};

const BAR_ITEMS = [
  { label: 'Q1', pct: 38, count: '3' },
  { label: 'Q2', pct: 52, count: '4' },
  { label: 'Q3', pct: 46, count: '3' },
  { label: 'Q4', pct: 70, count: '6' },
  { label: 'Q1', pct: 64, count: '5' },
  { label: 'Q2', pct: 82, count: '7' },
  { label: 'Q3', pct: 95, count: '9' },
  { label: 'Q4', pct: 86, count: '8' },
];

/**
 * Choreographed Ventriloc-style virtual cursor loop across the non-overlapping
 * observatory bento grid. Pauses gracefully when a real user interacts.
 */
interface CursorStep {
  id: string;
  xPct: number;
  yPct: number;
  card: 'chart' | 'inventory' | 'escrow';
  range?: TimeRange;
  pointIdx?: number;
  barIdx?: number;
  click?: boolean;
  label: string;
  durationMs: number;
}

const CURSOR_SCRIPT: CursorStep[] = [
  {
    id: 'range-5y',
    xPct: 86,
    yPct: 12,
    card: 'chart',
    range: '5Y',
    pointIdx: 2,
    click: true,
    label: 'Switch 5Y index',
    durationMs: 2100,
  },
  {
    id: 'scrub-mid',
    xPct: 62,
    yPct: 30,
    card: 'chart',
    range: '5Y',
    pointIdx: 1,
    label: 'Inspect comparable',
    durationMs: 2100,
  },
  {
    id: 'scrub-peak',
    xPct: 84,
    yPct: 24,
    card: 'chart',
    range: '5Y',
    pointIdx: 2,
    label: '+118.2% index peak',
    durationMs: 2000,
  },
  {
    id: 'inventory-bar',
    xPct: 43,
    yPct: 77,
    card: 'inventory',
    barIdx: 6,
    click: true,
    label: 'Peak quarter liquidity',
    durationMs: 2300,
  },
  {
    id: 'escrow-ring',
    xPct: 80,
    yPct: 76,
    card: 'escrow',
    click: true,
    label: '96.4% escrow verified',
    durationMs: 2300,
  },
  {
    id: 'range-3y',
    xPct: 79,
    yPct: 12,
    card: 'chart',
    range: '3Y',
    pointIdx: 2,
    click: true,
    label: 'Switch 3Y index',
    durationMs: 2000,
  },
];

export const HeroObservatoryCluster: React.FC<HeroObservatoryClusterProps> = ({
  totalInventoryValue,
  availableCount,
  medianPrice,
}) => {
  const [range, setRange] = useState<TimeRange>('3Y');
  const [stepIdx, setStepIdx] = useState(0);
  const [userHovering, setUserHovering] = useState(false);
  const [manualPointIdx, setManualPointIdx] = useState<number>(2);
  const [manualBarIdx, setManualBarIdx] = useState<number>(6);
  const [clickPulseKey, setClickPulseKey] = useState(0);

  useEffect(() => {
    if (userHovering) return;
    const step = CURSOR_SCRIPT[stepIdx];

    if (step.range) {
      setRange(step.range);
    }
    if (step.pointIdx !== undefined) {
      setManualPointIdx(step.pointIdx);
    }
    if (step.barIdx !== undefined) {
      setManualBarIdx(step.barIdx);
    }
    if (step.click) {
      const rippleTimer = window.setTimeout(() => {
        setClickPulseKey((k) => k + 1);
      }, 420);
      const nextTimer = window.setTimeout(() => {
        setStepIdx((prev) => (prev + 1) % CURSOR_SCRIPT.length);
      }, step.durationMs);
      return () => {
        window.clearTimeout(rippleTimer);
        window.clearTimeout(nextTimer);
      };
    }

    const timer = window.setTimeout(() => {
      setStepIdx((prev) => (prev + 1) % CURSOR_SCRIPT.length);
    }, step.durationMs);
    return () => window.clearTimeout(timer);
  }, [stepIdx, userHovering]);

  const activeStep = CURSOR_SCRIPT[stepIdx];
  const activeCard = userHovering ? null : activeStep.card;
  const activeSeries = SERIES_DATA[range];
  const activePoint =
    activeSeries.scrubberPoints[manualPointIdx] ??
    activeSeries.scrubberPoints[2];

  const ringRadius = 36;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = 0.964;

  return (
    <div
      onMouseEnter={() => setUserHovering(true)}
      onMouseLeave={() => setUserHovering(false)}
      className="relative w-full surface-architectural-grid asymmetric-card border border-graphite/10 p-5 sm:p-6 lg:p-7 select-none overflow-hidden"
    >
      {/* Top micro-header bar inside observatory canvas */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate mb-4 px-1">
        <span>MORTILA OBSERVATORY · LIVE LEDGER</span>
        <span className="text-brass">
          {userHovering ? 'Interactive control' : 'Guided preview'}
        </span>
      </div>

      {/* CLEAN NON-OVERLAPPING BENTO GRID — Zero Clutter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
        {/* Card 1: Full-Width Liquidity Index Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`sm:col-span-12 tactile-widget data-widget-card p-6 sm:p-7 ${
            activeCard === 'chart' ? 'tactile-widget-active' : ''
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-[12px] font-editorial text-brass">
                Mortila Liquidity Index
              </p>
              <h3 className="text-[20px] font-editorial text-graphite mt-0.5">
                Exact-match .com &amp; .ai valuation trajectory
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-ash/90 p-1 border border-graphite/5">
              {(['1Y', '3Y', '5Y'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRange(key)}
                  className={`px-2.5 py-1 text-[12px] font-mono tabular-nums transition-all duration-200 cursor-pointer ${
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

          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div className="flex items-baseline gap-3">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${range}-${activeSeries.delta}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[34px] font-editorial text-graphite tabular-nums leading-none"
                >
                  {activeSeries.delta}
                </motion.span>
              </AnimatePresence>
              <span className="text-[13px] text-slate">
                {activeSeries.caption}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[12px] text-slate">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-[2px] bg-ember-orange" />
                Mortila Index
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-[1.5px] bg-brass" />
                Broad Market
              </span>
            </div>
          </div>

          {/* Interactive SVG Valuation Chart with Active Scrubber Readout */}
          <div className="relative h-[132px] w-full">
            <svg
              viewBox="0 0 348 118"
              className="w-full h-full overflow-visible"
              role="img"
              aria-label="Domain valuation appreciation chart"
            >
              <defs>
                <linearGradient id="emberWash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff682c" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#ff682c" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {[20, 50, 80, 110].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="348"
                  y1={y}
                  y2={y}
                  stroke="#efefef"
                  strokeWidth="1"
                />
              ))}

              {/* Subtle warm area wash under Ember curve */}
              <motion.path
                key={`area-${range}`}
                d={activeSeries.areaPath}
                fill="url(#emberWash)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55 }}
              />

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
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Primary Ember Orange Curve */}
              <motion.path
                key={`pri-${range}`}
                d={activeSeries.primaryPath}
                fill="none"
                stroke="#ff682c"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Vertical Scrubber Guide Hairline */}
              <motion.line
                animate={{ x1: activePoint.x, x2: activePoint.x }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                y1={activePoint.y}
                y2={112}
                stroke="#202020"
                strokeOpacity="0.18"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Interactive Data Nodes */}
              {activeSeries.scrubberPoints.map((pt, idx) => {
                const isSelected = idx === manualPointIdx;
                return (
                  <g
                    key={`${range}-${pt.label}`}
                    onMouseEnter={() => setManualPointIdx(idx)}
                    className="cursor-pointer"
                  >
                    <circle cx={pt.x} cy={pt.y} r="12" fill="transparent" />
                    {isSelected && (
                      <motion.circle
                        cx={pt.x}
                        cy={pt.y}
                        r="8"
                        fill="#ff682c"
                        fillOpacity="0.16"
                        initial={{ scale: 0.7 }}
                        animate={{ scale: [0.85, 1.15, 0.85] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 4.2 : 2.8}
                      fill={isSelected ? '#ff682c' : '#ffffff'}
                      stroke="#ff682c"
                      strokeWidth="1.8"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Floating Scrubber Metric Readout */}
            <motion.div
              animate={{
                left: `${Math.min(72, Math.max(12, (activePoint.x / 348) * 100 - 12))}%`,
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 bg-graphite text-canvas-white px-2.5 py-1 text-[11px] font-mono tabular-nums pointer-events-none"
            >
              {activePoint.label} ·{' '}
              <span className="text-ember-orange">{activePoint.value}</span>
            </motion.div>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-mist text-[11px] font-mono text-slate tabular-nums">
            <span>Q1 2023</span>
            <span>Q4 2024</span>
            <span>Q2 2025</span>
            <span>Q4 2026</span>
          </div>
        </motion.div>

        {/* Card 2: Managed Portfolio Valuation (Bottom Left — Clean Bento Fit) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className={`sm:col-span-7 tactile-widget data-widget-card p-6 flex flex-col justify-between ${
            activeCard === 'inventory' ? 'tactile-widget-active' : ''
          }`}
        >
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[12px] font-editorial text-slate">
                Active Inventory Value
              </p>
              <span className="text-[11px] font-mono text-ember-orange tabular-nums">
                {availableCount} listed
              </span>
            </div>
            <p className="mt-1.5 text-[32px] font-editorial text-graphite tabular-nums leading-none">
              {formatShortUsd(totalInventoryValue)}
            </p>
          </div>

          {/* Interactive Animated Bar Histogram */}
          <div className="my-5 flex items-end gap-2 h-[72px]">
            {BAR_ITEMS.map((bar, idx) => {
              const isHighlighted = idx === manualBarIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setManualBarIdx(idx)}
                  aria-label={`Quarter ${bar.label}: ${bar.count} closings`}
                  className="flex-1 h-full flex flex-col justify-end bg-fog/90 relative cursor-pointer group"
                >
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{
                      scaleY: 1,
                      opacity: isHighlighted ? 1 : 0.85,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15 + idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      height: `${bar.pct}%`,
                      transformOrigin: 'bottom',
                    }}
                    className={`w-full transition-colors duration-200 ${
                      isHighlighted
                        ? 'bg-ember-orange'
                        : idx >= 4
                        ? 'bg-graphite'
                        : 'bg-ivory'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[12px] text-steel border-t border-mist pt-3">
            <span>Median guide</span>
            <span className="font-mono tabular-nums text-graphite">
              {formatShortUsd(medianPrice)}
            </span>
          </div>
        </motion.div>

        {/* Card 3: Escrow Settlement Velocity Ring (Bottom Right — Clean Bento Fit) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`sm:col-span-5 tactile-widget data-widget-card p-6 flex flex-col justify-between ${
            activeCard === 'escrow' ? 'tactile-widget-active' : ''
          }`}
        >
          <div>
            <p className="text-[12px] font-editorial text-slate">
              Escrow Settlement
            </p>
            <p className="text-[16px] font-editorial text-graphite mt-0.5">
              Clean transfer rate
            </p>
          </div>

          <div className="my-4 flex items-center justify-center">
            <div className="relative w-[94px] h-[94px]">
              <svg
                viewBox="0 0 88 88"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label="96.4% escrow completion rate"
              >
                <circle
                  cx="44"
                  cy="44"
                  r={ringRadius}
                  fill="none"
                  stroke="#efefef"
                  strokeWidth="5"
                />
                <motion.circle
                  cx="44"
                  cy="44"
                  r={ringRadius}
                  fill="none"
                  stroke={activeCard === 'escrow' ? '#ff682c' : '#816729'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  initial={{ strokeDashoffset: ringCircumference }}
                  animate={{
                    strokeDashoffset: ringCircumference * (1 - ringProgress),
                  }}
                  transition={{
                    duration: 1.1,
                    delay: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[19px] font-editorial text-graphite tabular-nums leading-none">
                  96.4%
                </span>
                <span className="text-[10px] font-mono text-slate mt-1">
                  verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12px] text-steel border-t border-mist pt-3">
            <span>Median close</span>
            <span className="font-mono tabular-nums text-graphite">
              11 days
            </span>
          </div>
        </motion.div>
      </div>

      {/* CHOREOGRAPHED VENTRILOC VIRTUAL CURSOR LOOP OVERLAY */}
      <AnimatePresence>
        {!userHovering && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              left: `${activeStep.xPct}%`,
              top: `${activeStep.yPct}%`,
            }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{
              left: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
              top: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3 },
            }}
            className="hidden sm:block pointer-events-none absolute z-30 -translate-x-1 -translate-y-1"
          >
            {/* Click Ripple Ring */}
            {activeStep.click && (
              <motion.span
                key={`ripple-${clickPulseKey}`}
                initial={{ scale: 0.3, opacity: 0.7 }}
                animate={{ scale: 2.3, opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="absolute -left-2 -top-2 w-6 h-6 rounded-full border border-ember-orange"
              />
            )}

            {/* Editorial Precision Pointer SVG */}
            <svg
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_4px_10px_rgba(32,32,32,0.28)]"
            >
              <path
                d="M2.2 1.8L17.6 10.6L10.3 12.1L7.1 19.2L2.2 1.8Z"
                fill="#202020"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>

            {/* Clean Ventriloc Cursor Action Label */}
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="mt-1 ml-3.5 bg-graphite text-canvas-white px-2.5 py-1 text-[11px] font-mono whitespace-nowrap shadow-[0_6px_16px_-4px_rgba(32,32,32,0.28)]"
            >
              {activeStep.label}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
