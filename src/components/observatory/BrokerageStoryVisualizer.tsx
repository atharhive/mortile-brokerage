import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface StoryChapter {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  metricLabel: string;
  metricValue: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    index: '01',
    title: 'Valuation & Market Audit',
    subtitle: 'Comparable benchmarking before outreach',
    description:
      'Every asset undergoes linguistic clarity review, trademark conflict screening across Nice classes, historical WHOIS continuity verification, and private comparable-sale modeling.',
    metricLabel: 'Data signals modeled',
    metricValue: '28 criteria',
  },
  {
    index: '02',
    title: 'Stealth Buyer Representation',
    subtitle: 'Identity-shielded institutional outreach',
    description:
      'When acquiring off-market names, disclosing a well-funded acquirer multiplies asking prices overnight. Mortila approaches current holders under strict NDA with verified proof of funds.',
    metricLabel: 'Avg. ask compression',
    metricValue: '34.2% below open',
  },
  {
    index: '03',
    title: 'Bilateral Negotiation Desk',
    subtitle: 'Structured offer & lease-to-own terms',
    description:
      'We orchestrate direct principal-to-principal counteroffers, deferred installment structures, and equity-cash hybrids—keeping momentum disciplined without broker friction.',
    metricLabel: 'Standard commission',
    metricValue: '15% success-only',
  },
  {
    index: '04',
    title: 'Escrow & Atomic Transfer',
    subtitle: 'Escrow.com & Atom institutional closing',
    description:
      'Funds are held with licensed third-party escrow agents until registrar push, EPP authorization transfer, DNSSEC continuity, and clean title assignment are independently confirmed.',
    metricLabel: 'Zero-dispute closings',
    metricValue: '140+ transfers',
  },
];

export const BrokerageStoryVisualizer: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  useEffect(() => {
    if (!autoAdvance) return;
    const timer = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % CHAPTERS.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [autoAdvance]);

  const active = CHAPTERS[activeIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
      {/* Left Narrative Chapters */}
      <div className="lg:col-span-6 flex flex-col justify-between gap-3">
        {CHAPTERS.map((chapter, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={chapter.index}
              type="button"
              onClick={() => {
                setAutoAdvance(false);
                setActiveIdx(idx);
              }}
              className={`text-left p-6 transition-colors duration-200 cursor-pointer asymmetric-card ${
                isSelected
                  ? 'bg-canvas-white border border-mist'
                  : 'bg-transparent hover:bg-canvas-white/60 border border-transparent'
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span
                    className={`font-mono text-[13px] tabular-nums ${
                      isSelected ? 'text-ember-orange' : 'text-slate'
                    }`}
                  >
                    {chapter.index}.
                  </span>
                  <h3 className="text-[20px] font-editorial text-graphite">
                    {chapter.title}
                  </h3>
                </div>
                <span className="hidden sm:inline font-mono text-[12px] text-brass tabular-nums whitespace-nowrap">
                  {chapter.metricValue}
                </span>
              </div>

              <p className="mt-2 pl-7 text-[14px] leading-[1.55] text-steel">
                {chapter.description}
              </p>

              {/* Subtle progress hairline when active */}
              <div className="mt-4 pl-7">
                <div className="h-[1px] w-full bg-mist overflow-hidden">
                  {isSelected && (
                    <motion.div
                      key={`bar-${idx}-${autoAdvance}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: autoAdvance ? 5.2 : 0.45,
                        ease: 'linear',
                      }}
                      style={{ transformOrigin: 'left' }}
                      className="h-full bg-ember-orange"
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Live Animated Editorial Observatory Canvas */}
      <div className="lg:col-span-6 bg-canvas-white data-widget-card border border-mist p-7 sm:p-10 flex flex-col justify-between min-h-[420px]">
        <div className="flex items-start justify-between gap-4 border-b border-mist pb-5">
          <div>
            <p className="text-[13px] font-editorial text-brass">
              Stage {active.index} of 04
            </p>
            <h4 className="text-[24px] font-editorial text-graphite mt-1">
              {active.subtitle}
            </h4>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-slate">{active.metricLabel}</p>
            <p className="text-[16px] font-mono text-graphite tabular-nums mt-0.5">
              {active.metricValue}
            </p>
          </div>
        </div>

        {/* Dynamic SVG Editorial Diagram per Stage */}
        <div className="my-6 flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeIdx === 0 && <ValuationAuditGraphic />}
              {activeIdx === 1 && <StealthRoutingGraphic />}
              {activeIdx === 2 && <NegotiationConvergenceGraphic />}
              {activeIdx === 3 && <EscrowAtomicTransferGraphic />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-mist text-[12px] text-slate">
          <span>Mortila Private Brokerage Protocol</span>
          <button
            type="button"
            onClick={() => setAutoAdvance((v) => !v)}
            className="font-mono text-graphite hover:text-ember-orange transition-colors cursor-pointer"
          >
            {autoAdvance ? 'Pause sequence' : 'Resume sequence'}
          </button>
        </div>
      </div>
    </div>
  );
};

function ValuationAuditGraphic() {
  const bars = [
    { label: 'Phonetic Recall', pct: 94, accent: true },
    { label: 'TLD Scarcity', pct: 88, accent: false },
    { label: 'Trademark Headroom', pct: 92, accent: false },
    { label: 'Comparable Velocity', pct: 81, accent: true },
    { label: 'WHOIS Heritage', pct: 96, accent: false },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between text-[13px] font-mono text-slate">
        <span>Asset Dossier Sample: velora.com</span>
        <span className="text-graphite">Est. Band: $165K – $210K</span>
      </div>
      <div className="space-y-3.5">
        {bars.map((bar, idx) => (
          <div key={bar.label} className="space-y-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-graphite">{bar.label}</span>
              <span className="font-mono text-steel tabular-nums">{bar.pct}/100</span>
            </div>
            <div className="h-[6px] w-full bg-fog overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ width: `${bar.pct}%`, transformOrigin: 'left' }}
                className={`h-full ${bar.accent ? 'bg-ember-orange' : 'bg-graphite'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StealthRoutingGraphic() {
  return (
    <svg viewBox="0 0 420 200" className="w-full h-auto" role="img" aria-label="Stealth buyer representation flow">
      {/* Node 1: Confidential Buyer */}
      <rect x="10" y="68" width="110" height="64" rx="6" fill="#efefef" />
      <text x="65" y="96" textAnchor="middle" fill="#202020" fontSize="12" fontFamily="Inter Tight, sans-serif">
        Principal Buyer
      </text>
      <text x="65" y="114" textAnchor="middle" fill="#828282" fontSize="10" fontFamily="IBM Plex Mono, monospace">
        Identity NDA
      </text>

      {/* Node 2: Mortila Shield Desk */}
      <rect x="155" y="54" width="110" height="92" rx="6" fill="#202020" />
      <text x="210" y="94" textAnchor="middle" fill="#ffffff" fontSize="13" fontFamily="Inter Tight, sans-serif">
        Mortila Desk
      </text>
      <text x="210" y="114" textAnchor="middle" fill="#ff682c" fontSize="10" fontFamily="IBM Plex Mono, monospace">
        Stealth Proxy
      </text>
      <text x="210" y="130" textAnchor="middle" fill="#efefef" fontSize="9.5" fontFamily="IBM Plex Mono, monospace">
        Verified Funds
      </text>

      {/* Node 3: Current Holder */}
      <rect x="300" y="68" width="110" height="64" rx="6" fill="#ebe6dd" />
      <text x="355" y="96" textAnchor="middle" fill="#202020" fontSize="12" fontFamily="Inter Tight, sans-serif">
        Asset Holder
      </text>
      <text x="355" y="114" textAnchor="middle" fill="#816729" fontSize="10" fontFamily="IBM Plex Mono, monospace">
        Direct Outreach
      </text>

      {/* Connecting animated signal lines */}
      <motion.line
        x1="120"
        y1="100"
        x2="155"
        y2="100"
        stroke="#202020"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.line
        x1="265"
        y1="100"
        x2="300"
        y2="100"
        stroke="#ff682c"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      />

      {/* Animated travelling pulse dot */}
      <motion.circle
        r="3.5"
        fill="#ff682c"
        initial={{ cx: 120, cy: 100 }}
        animate={{ cx: [120, 210, 300], cy: [100, 100, 100] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Bottom caption */}
      <text x="210" y="178" textAnchor="middle" fill="#4d4d4d" fontSize="11" fontFamily="Inter, sans-serif">
        Zero brand leakage during discovery prevents strategic price inflation
      </text>
    </svg>
  );
}

function NegotiationConvergenceGraphic() {
  return (
    <svg viewBox="0 0 420 205" className="w-full h-auto" role="img" aria-label="Offer and ask negotiation convergence">
      {/* Grid */}
      {[30, 75, 120, 165].map((y) => (
        <line key={y} x1="20" x2="400" y1={y} y2={y} stroke="#efefef" strokeWidth="1" />
      ))}

      {/* Seller Ask Trajectory (Brass) */}
      <motion.path
        d="M 35 42 C 110 46, 175 64, 240 82 C 295 96, 330 100, 368 100"
        fill="none"
        stroke="#816729"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Buyer Offer Trajectory (Ember Orange) */}
      <motion.path
        d="M 35 154 C 110 144, 175 128, 240 112 C 295 102, 330 100, 368 100"
        fill="none"
        stroke="#ff682c"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Settlement Marker */}
      <motion.circle
        cx="368"
        cy="100"
        r="5.5"
        fill="#202020"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.75, duration: 0.3 }}
      />
      <text x="35" y="30" fill="#816729" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
        Initial Seller Ask ($240K)
      </text>
      <text x="35" y="176" fill="#ff682c" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
        Opening Mandate Bid ($145K)
      </text>
      <text x="368" y="84" textAnchor="end" fill="#202020" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        Agreed Close ($182K)
      </text>
    </svg>
  );
}

function EscrowAtomicTransferGraphic() {
  const steps = [
    { x: 46, title: 'Wire Funded', sub: 'Escrow.com' },
    { x: 155, title: 'EPP Unlocked', sub: 'Registrar Auth' },
    { x: 264, title: 'Title Verified', sub: 'WHOIS / DNS' },
    { x: 373, title: 'Disbursed', sub: 'Settled' },
  ];
  return (
    <svg viewBox="0 0 420 190" className="w-full h-auto" role="img" aria-label="Atomic escrow transfer timeline">
      <line x1="46" y1="86" x2="373" y2="86" stroke="#e8e8e8" strokeWidth="2" />
      <motion.line
        x1="46"
        y1="86"
        x2="373"
        y2="86"
        stroke="#ff682c"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      />
      {steps.map((step, i) => (
        <g key={step.title}>
          <motion.circle
            cx={step.x}
            cy="86"
            r="10"
            fill={i === 3 ? '#202020' : '#ffffff'}
            stroke={i === 3 ? '#202020' : '#ff682c'}
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25 * i, duration: 0.3 }}
          />
          <text
            x={step.x}
            y="118"
            textAnchor="middle"
            fill="#202020"
            fontSize="11.5"
            fontFamily="Inter Tight, sans-serif"
          >
            {step.title}
          </text>
          <text
            x={step.x}
            y="134"
            textAnchor="middle"
            fill="#828282"
            fontSize="10"
            fontFamily="IBM Plex Mono, monospace"
          >
            {step.sub}
          </text>
        </g>
      ))}
      <text x="210" y="170" textAnchor="middle" fill="#4d4d4d" fontSize="11" fontFamily="Inter, sans-serif">
        Buyer funds and seller domain credentials swap simultaneously under regulated custody
      </text>
    </svg>
  );
}
