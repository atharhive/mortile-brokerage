import React, { useEffect, useRef, useState } from 'react';
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
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll-synchronized chapter detection (Ventriloc editorial scroll storytelling)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = entry.target.getAttribute('data-chapter-idx');
            if (idxAttr !== null) {
              setActiveIdx(Number(idxAttr));
            }
          }
        });
      },
      {
        rootMargin: '-32% 0px -45% 0px',
        threshold: 0.15,
      }
    );

    chapterRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const active = CHAPTERS[activeIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Narrative Chapters — Spacious Scroll-Driven Steps */}
      <div className="lg:col-span-5 space-y-5">
        {CHAPTERS.map((chapter, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={chapter.index}
              ref={(el) => {
                chapterRefs.current[idx] = el;
              }}
              data-chapter-idx={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`w-full text-left p-7 sm:p-8 transition-all duration-300 cursor-pointer asymmetric-card ${
                isSelected
                  ? 'tactile-widget border-graphite/20 opacity-100'
                  : 'bg-canvas-white/45 border border-graphite/6 opacity-65 hover:opacity-100 hover:bg-canvas-white/80'
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
                  <h3 className="text-[22px] font-editorial text-graphite">
                    {chapter.title}
                  </h3>
                </div>
                <span className="hidden sm:inline font-mono text-[12px] text-brass tabular-nums whitespace-nowrap">
                  {chapter.metricValue}
                </span>
              </div>

              <p className="mt-3 pl-7 text-[15px] leading-[1.6] text-steel">
                {chapter.description}
              </p>

              {/* Precision progress indicator */}
              <div className="mt-5 pl-7">
                <div className="h-[1.5px] w-full bg-mist overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: isSelected ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'left' }}
                    className="h-full bg-ember-orange"
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Sticky Animated Editorial Observatory Canvas */}
      <div className="lg:col-span-7 lg:sticky lg:top-[106px] tactile-widget data-widget-card p-8 sm:p-11 flex flex-col justify-between min-h-[480px]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-mist pb-6">
          <div>
            <p className="text-[13px] font-editorial text-brass">
              Stage {active.index} of 04
            </p>
            <AnimatePresence mode="wait">
              <motion.h4
                key={active.subtitle}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-[26px] font-editorial text-graphite mt-1"
              >
                {active.subtitle}
              </motion.h4>
            </AnimatePresence>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-slate">{active.metricLabel}</p>
            <p className="text-[17px] font-mono text-graphite tabular-nums mt-0.5">
              {active.metricValue}
            </p>
          </div>
        </div>

        {/* Dynamic SVG Editorial Diagram per Stage */}
        <div className="my-8 flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.index}
              initial={{ opacity: 0, scale: 0.985, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeIdx === 0 && <ValuationAuditGraphic />}
              {activeIdx === 1 && <StealthRoutingGraphic />}
              {activeIdx === 2 && <NegotiationConvergenceGraphic />}
              {activeIdx === 3 && <EscrowAtomicTransferGraphic />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-mist text-[12px] text-slate">
          <span>Scroll or select any stage to inspect protocol</span>
          <div className="flex items-center gap-2">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.index}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`Jump to stage ${c.index}`}
                className={`h-1.5 transition-all duration-300 cursor-pointer ${
                  i === activeIdx
                    ? 'w-7 bg-ember-orange'
                    : 'w-2.5 bg-mist hover:bg-slate'
                }`}
              />
            ))}
          </div>
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
      <div className="space-y-4">
        {bars.map((bar, idx) => (
          <div key={bar.label} className="space-y-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-graphite">{bar.label}</span>
              <span className="font-mono text-steel tabular-nums">
                {bar.pct}/100
              </span>
            </div>
            <div className="h-[7px] w-full bg-fog overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ width: `${bar.pct}%`, transformOrigin: 'left' }}
                className={`h-full ${
                  bar.accent ? 'bg-ember-orange' : 'bg-graphite'
                }`}
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
    <svg
      viewBox="0 0 420 205"
      className="w-full h-auto"
      role="img"
      aria-label="Stealth buyer representation flow"
    >
      <rect x="10" y="68" width="110" height="64" rx="6" fill="#efefef" stroke="#e2e2e2" />
      <text
        x="65"
        y="96"
        textAnchor="middle"
        fill="#202020"
        fontSize="12"
        fontFamily="Inter Tight, sans-serif"
      >
        Principal Buyer
      </text>
      <text
        x="65"
        y="114"
        textAnchor="middle"
        fill="#828282"
        fontSize="10"
        fontFamily="IBM Plex Mono, monospace"
      >
        Identity NDA
      </text>

      <rect x="155" y="54" width="110" height="92" rx="6" fill="#202020" />
      <text
        x="210"
        y="94"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="13"
        fontFamily="Inter Tight, sans-serif"
      >
        Mortila Desk
      </text>
      <text
        x="210"
        y="114"
        textAnchor="middle"
        fill="#ff682c"
        fontSize="10"
        fontFamily="IBM Plex Mono, monospace"
      >
        Stealth Proxy
      </text>
      <text
        x="210"
        y="130"
        textAnchor="middle"
        fill="#efefef"
        fontSize="9.5"
        fontFamily="IBM Plex Mono, monospace"
      >
        Verified Funds
      </text>

      <rect x="300" y="68" width="110" height="64" rx="6" fill="#ebe6dd" stroke="#ddd6c9" />
      <text
        x="355"
        y="96"
        textAnchor="middle"
        fill="#202020"
        fontSize="12"
        fontFamily="Inter Tight, sans-serif"
      >
        Asset Holder
      </text>
      <text
        x="355"
        y="114"
        textAnchor="middle"
        fill="#816729"
        fontSize="10"
        fontFamily="IBM Plex Mono, monospace"
      >
        Direct Outreach
      </text>

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

      <motion.circle
        r="3.8"
        fill="#ff682c"
        initial={{ cx: 120, cy: 100 }}
        animate={{ cx: [120, 210, 300], cy: [100, 100, 100] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <text
        x="210"
        y="180"
        textAnchor="middle"
        fill="#4d4d4d"
        fontSize="11"
        fontFamily="Inter, sans-serif"
      >
        Zero brand leakage during discovery prevents strategic price inflation
      </text>
    </svg>
  );
}

function NegotiationConvergenceGraphic() {
  return (
    <svg
      viewBox="0 0 420 205"
      className="w-full h-auto"
      role="img"
      aria-label="Offer and ask negotiation convergence"
    >
      {[30, 75, 120, 165].map((y) => (
        <line
          key={y}
          x1="20"
          x2="400"
          y1={y}
          y2={y}
          stroke="#efefef"
          strokeWidth="1"
        />
      ))}

      <motion.path
        d="M 35 42 C 110 46, 175 64, 240 82 C 295 96, 330 100, 368 100"
        fill="none"
        stroke="#816729"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.path
        d="M 35 154 C 110 144, 175 128, 240 112 C 295 102, 330 100, 368 100"
        fill="none"
        stroke="#ff682c"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.circle
        cx="368"
        cy="100"
        r="5.5"
        fill="#202020"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      />
      <text
        x="35"
        y="30"
        fill="#816729"
        fontSize="10.5"
        fontFamily="IBM Plex Mono, monospace"
      >
        Initial Seller Ask ($240K)
      </text>
      <text
        x="35"
        y="176"
        fill="#ff682c"
        fontSize="10.5"
        fontFamily="IBM Plex Mono, monospace"
      >
        Opening Mandate Bid ($145K)
      </text>
      <text
        x="368"
        y="84"
        textAnchor="end"
        fill="#202020"
        fontSize="11"
        fontFamily="IBM Plex Mono, monospace"
      >
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
    <svg
      viewBox="0 0 420 190"
      className="w-full h-auto"
      role="img"
      aria-label="Atomic escrow transfer timeline"
    >
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
        transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ delay: 0.22 * i, duration: 0.3 }}
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
      <text
        x="210"
        y="170"
        textAnchor="middle"
        fill="#4d4d4d"
        fontSize="11"
        fontFamily="Inter, sans-serif"
      >
        Buyer funds and seller domain credentials swap simultaneously under
        regulated custody
      </text>
    </svg>
  );
}
