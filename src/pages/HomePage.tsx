import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { AppRoute, DomainAsset } from '../types/brokerage';
import { HeroObservatoryCluster } from '../components/observatory/HeroObservatoryCluster';
import {
  CategoryDistributionCard,
  PartnerLogoStrip,
} from '../components/observatory/EditorialDiagrams';
import { BrokerageStoryVisualizer } from '../components/observatory/BrokerageStoryVisualizer';
import { PortfolioExplorer } from '../components/portfolio/PortfolioExplorer';
import { EditorialButton } from '../components/ui/EditorialButton';

interface HomePageProps {
  domains: DomainAsset[];
  loading: boolean;
  onNavigate: (route: AppRoute) => void;
  onSelectDomain: (domain: DomainAsset) => void;
}

const TESTIMONIALS = [
  {
    quote:
      'Mortila approached the holder of our flagship .com silently, compressed the opening ask by 38%, and closed through Escrow.com eleven days before our Series B announcement.',
    name: 'Soren Halvorsen',
    role: 'Chief Executive Officer',
    org: 'Kinetix Automation, Stockholm',
    outcome: '$148,000 closed in 9 days',
  },
  {
    quote:
      'Rather than listing our .si and .ai portfolio across public marketplaces, Mortila built bespoke buyer dossiers for twelve corporate targets and cleared three six-figure transfers in one quarter.',
    name: 'Elena Marchetti',
    role: 'Managing Director',
    org: 'Lombardia Digital Holdings, Milan',
    outcome: '$412,000 gross liquidity',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  domains,
  loading,
  onNavigate,
  onSelectDomain,
}) => {
  const activeDomains = domains.filter((d) => d.status !== 'sold');
  const totalValue = activeDomains.reduce((sum, d) => sum + d.priceUsd, 0);
  const sortedPrices = activeDomains.map((d) => d.priceUsd).sort((a, b) => a - b);
  const medianPrice =
    sortedPrices.length > 0
      ? sortedPrices[Math.floor(sortedPrices.length / 2)]
      : 68000;

  // Scroll-linked subtle vertical parallax on the Mandate split & Closing Ivory Banner
  const mandatesRef = useRef<HTMLElement>(null);
  const { scrollYProgress: mandatesScroll } = useScroll({
    target: mandatesRef,
    offset: ['start end', 'end start'],
  });
  const leftCardY = useTransform(mandatesScroll, [0, 1], [18, -14]);
  const rightCardY = useTransform(mandatesScroll, [0, 1], [34, -22]);

  const closingRef = useRef<HTMLElement>(null);
  const { scrollYProgress: closingScroll } = useScroll({
    target: closingRef,
    offset: ['start end', 'end start'],
  });
  const closingScale = useTransform(closingScroll, [0, 0.5], [0.975, 1]);

  return (
    <div className="overflow-x-clip">
      {/* 1. HERO SECTION — Full-Width Fluid Ventriloc Split */}
      <section className="w-full bg-canvas-white pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            {/* Left Column: Whisper-Weight Editorial Statement with Ventriloc Inline Flourish */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 xl:col-span-5"
            >
              <p className="font-editorial text-[13px] text-brass mb-6 flex items-center gap-3">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: 'left' }}
                  className="inline-block w-8 h-[1.5px] bg-ember-orange"
                />
                <span>
                  Private Domain Brokerage &amp; Digital Asset Observatory
                </span>
              </p>

              <h1 className="display-headline text-graphite">
                Category-defining domains,{' '}
                <span className="inline-flex items-center align-baseline">
                  <motion.span
                    initial={{ width: 0, opacity: 0, marginRight: 0 }}
                    animate={{ width: '0.72em', opacity: 1, marginRight: '0.2em' }}
                    transition={{
                      duration: 0.7,
                      delay: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    aria-hidden="true"
                    className="inline-block h-[0.06em] bg-ember-orange -translate-y-[0.22em] overflow-hidden"
                  />
                  brokered
                </span>{' '}
                with quiet precision.
              </h1>

              <p className="mt-7 text-[18px] leading-[1.5] text-steel max-w-[540px]">
                Mortila Brokerage advises founders, venture funds, and private
                portfolio holders on acquiring and divesting exact-match .com,
                .ai, .io, and .si digital assets—settled exclusively through
                licensed escrow.
              </p>

              {/* Tactile 0px Button Stack with Dual-Text Roll & Texture */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <EditorialButton
                  variant="primary"
                  showArrow
                  onClick={() => onNavigate('portfolio')}
                >
                  Explore portfolio
                </EditorialButton>
                <EditorialButton
                  variant="ghost"
                  onClick={() => onNavigate('about')}
                >
                  About us
                </EditorialButton>
              </div>

              <div className="mt-11 pt-6 border-t border-graphite/10 grid grid-cols-3 gap-4 text-[13px] text-slate">
                <div>
                  <p className="font-mono text-[18px] text-graphite tabular-nums">
                    $38.4M+
                  </p>
                  <p className="mt-0.5 text-[12px]">Brokered volume</p>
                </div>
                <div>
                  <p className="font-mono text-[18px] text-graphite tabular-nums">
                    15%
                  </p>
                  <p className="mt-0.5 text-[12px]">Success-only fee</p>
                </div>
                <div>
                  <p className="font-mono text-[18px] text-graphite tabular-nums">
                    100%
                  </p>
                  <p className="mt-0.5 text-[12px]">Escrow title</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Clean Non-Cluttered Bento Observatory with Animated Cursor Loop */}
            <div className="lg:col-span-6 xl:col-span-7">
              <HeroObservatoryCluster
                totalInventoryValue={totalValue || 1680000}
                availableCount={activeDomains.length || 17}
                medianPrice={medianPrice}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNER LOGO STRIP */}
      <PartnerLogoStrip />

      {/* 3. CURATED PORTFOLIO PREVIEW */}
      <section className="w-full bg-canvas-white py-20 lg:py-28">
        <div className="editorial-container">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <p className="font-editorial text-[13px] text-brass mb-2.5">
                Curated Inventory
              </p>
              <h2 className="heading-lg-editorial text-graphite max-w-[700px]">
                Vetted digital assets available for immediate acquisition or
                structured offer.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="font-editorial text-[16px] text-graphite link-ember self-start md:self-auto cursor-pointer"
            >
              <span>View full catalogue</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </motion.div>

          <PortfolioExplorer
            domains={domains}
            loading={loading}
            onSelectDomain={onSelectDomain}
            compactMode={true}
            onViewAllClick={() => onNavigate('portfolio')}
          />
        </div>
      </section>

      {/* 4. TWO-PATHWAY ASYMMETRIC MANDATE CARDS — Scroll Parallax + Tactile Paper Stock */}
      <section
        ref={mandatesRef}
        className="w-full surface-paper-ash border-y border-graphite/8 py-24 lg:py-32"
      >
        <div className="editorial-container">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[720px] mb-14"
          >
            <p className="font-editorial text-[13px] text-brass mb-2.5">
              Brokerage Mandates
            </p>
            <h2 className="heading-lg-editorial text-graphite">
              Two disciplined desks built for opposite sides of the closing
              table.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-stretch">
            {/* Looking to Buy Asymmetric Card */}
            <motion.div
              style={{ y: leftCardY }}
              className="surface-paper-white tactile-card asymmetric-card pt-14 px-9 pb-10 sm:px-12 flex flex-col justify-between"
            >
              <div>
                <p className="font-mono text-[12px] text-ember-orange">
                  01. Acquisition Desk
                </p>
                <h3 className="heading-editorial text-graphite mt-3">
                  Looking to Buy
                </h3>
                <p className="mt-4 text-[16px] leading-[1.65] text-steel">
                  Access verified .com, .ai, .io, and .si inventory or commission
                  a confidential stealth acquisition for an unlisted domain. We
                  shield your corporate identity, benchmark true market value,
                  and coordinate clean registrar transfer.
                </p>
                <ul className="mt-7 space-y-2.5 text-[14px] text-graphite">
                  <li>· Direct access to off-market investor portfolios</li>
                  <li>· Anonymized owner outreach &amp; valuation diligence</li>
                  <li>· Outright purchase or 12–36 month lease-to-own</li>
                </ul>
              </div>
              <div className="mt-10 pt-6 border-t border-graphite/10 flex items-center justify-between gap-4">
                <EditorialButton
                  variant="primary"
                  showArrow
                  onClick={() => onNavigate('buy')}
                >
                  Submit buying brief
                </EditorialButton>
                <span className="font-mono text-[12px] text-slate">
                  Response &lt; 4h
                </span>
              </div>
            </motion.div>

            {/* Looking to Sell Asymmetric Card */}
            <motion.div
              style={{ y: rightCardY }}
              className="surface-paper-ivory tactile-card asymmetric-card pt-14 px-9 pb-10 sm:px-12 flex flex-col justify-between"
            >
              <div>
                <p className="font-mono text-[12px] text-brass">
                  02. Divestment Desk
                </p>
                <h3 className="heading-editorial text-graphite mt-3">
                  Looking to Sell
                </h3>
                <p className="mt-4 text-[16px] leading-[1.65] text-steel">
                  Entrust single flagship names or institutional portfolios to
                  active outbound representation. We research funded end-users,
                  prepare tailored positioning dossiers, and negotiate directly
                  with decision-makers.
                </p>
                <ul className="mt-7 space-y-2.5 text-[14px] text-graphite">
                  <li>· Standard 15% success-only brokerage commission</li>
                  <li>· Focused 90-day exclusive representation period</li>
                  <li>· Zero upfront listing, appraisal, or marketing retainers</li>
                </ul>
              </div>
              <div className="mt-10 pt-6 border-t border-graphite/10 flex items-center justify-between gap-4">
                <EditorialButton
                  variant="ghost"
                  showArrow
                  onClick={() => onNavigate('sell')}
                >
                  List your domain
                </EditorialButton>
                <span className="font-mono text-[12px] text-steel">
                  15% · 90-day term
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. STICKY SCROLL-SYNCHRONIZED EDITORIAL STORYTELLING */}
      <section className="w-full bg-canvas-white py-24 lg:py-32">
        <div className="editorial-container">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[740px] mb-14"
          >
            <p className="font-editorial text-[13px] text-brass mb-2.5">
              How Mortila Operates
            </p>
            <h2 className="heading-lg-editorial text-graphite">
              From comparable modeling to atomic escrow transfer in four
              audited stages.
            </h2>
          </motion.div>

          <div className="surface-architectural-grid border border-graphite/10 asymmetric-card p-6 sm:p-10 lg:p-12">
            <BrokerageStoryVisualizer />
          </div>
        </div>
      </section>

      {/* 6. PROOF & PORTFOLIO ALLOCATION OBSERVATORY */}
      <section className="w-full surface-paper-ash border-y border-graphite/8 py-24 lg:py-32">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="font-editorial text-[13px] text-brass mb-2.5">
                  Verified Outcomes
                </p>
                <h2 className="heading-lg-editorial text-graphite">
                  Discreet execution trusted by founders and institutional
                  holders.
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 gap-6">
                {TESTIMONIALS.map((item, idx) => (
                  <motion.blockquote
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="surface-paper-white tactile-card asymmetric-card p-8 sm:p-10"
                  >
                    <p className="text-[18px] leading-[1.58] text-graphite">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <footer className="mt-7 pt-5 border-t border-graphite/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div>
                        <p className="font-editorial text-[17px] text-graphite">
                          {item.name}
                        </p>
                        <p className="text-[13px] text-slate">
                          {item.role} · {item.org}
                        </p>
                      </div>
                      <span className="font-mono text-[12px] text-ember-orange tabular-nums">
                        {item.outcome}
                      </span>
                    </footer>
                  </motion.blockquote>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 lg:pt-14">
              <CategoryDistributionCard domains={domains} />
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLOSING EDITORIAL CTA BAND — Scroll Scale Reveal */}
      <section ref={closingRef} className="w-full bg-canvas-white py-20 lg:py-28">
        <div className="editorial-container">
          <motion.div
            style={{ scale: closingScale }}
            className="surface-paper-ivory tactile-card asymmetric-card p-10 sm:p-16 lg:p-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10"
          >
            <div className="max-w-[680px]">
              <p className="font-editorial text-[13px] text-brass mb-3">
                Private Advisory Desk
              </p>
              <h2 className="heading-lg-editorial text-graphite">
                Securing your flagship identity begins with a single
                confidential brief.
              </h2>
              <p className="mt-4 text-[17px] text-steel leading-[1.6]">
                Speak directly with a Mortila managing broker regarding an
                acquisition target, portfolio appraisal, or custom lease-to-own
                structure.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <EditorialButton
                variant="primary"
                showArrow
                onClick={() => onNavigate('contact')}
              >
                Schedule advisory call
              </EditorialButton>
              <EditorialButton
                variant="ghost"
                onClick={() => onNavigate('services')}
              >
                Review fee terms
              </EditorialButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
