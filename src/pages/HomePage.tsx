import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { AppRoute, DomainAsset } from '../types/brokerage';
import { HeroObservatoryCluster } from '../components/observatory/HeroObservatoryCluster';
import {
  CategoryDistributionCard,
  PartnerLogoStrip,
} from '../components/observatory/EditorialDiagrams';
import { BrokerageStoryVisualizer } from '../components/observatory/BrokerageStoryVisualizer';
import { PortfolioExplorer } from '../components/portfolio/PortfolioExplorer';

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

  return (
    <div>
      {/* 1. HERO SECTION — White Canvas, Two-Column Editorial Split */}
      <section className="w-full bg-canvas-white pt-14 pb-20 lg:pt-20 lg:pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Whisper-Weight 66px Editorial Statement */}
            <div className="lg:col-span-6">
              <p className="font-editorial text-[13px] text-brass mb-5">
                Private Domain Brokerage &amp; Digital Real Estate Observatory
              </p>
              <h1 className="display-headline text-graphite">
                Category-defining domains, brokered with quiet precision.
              </h1>
              <p className="mt-7 text-[18px] leading-[1.45] text-steel max-w-[500px]">
                Mortila Brokerage advises founders, venture funds, and private
                portfolio holders on acquiring and divesting exact-match .com,
                .ai, .io, and .si digital assets—settled exclusively through
                licensed escrow.
              </p>

              {/* Dual 0px Sharp Button Stack */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="btn-graphite cursor-pointer"
                >
                  Explore portfolio
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="btn-ghost-graphite cursor-pointer"
                >
                  About us
                </button>
              </div>

              <div className="mt-10 pt-6 border-t border-mist flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-slate">
                <span>
                  <strong className="font-mono font-normal text-graphite tabular-nums">
                    $38.4M+
                  </strong>{' '}
                  brokered volume
                </span>
                <span>
                  <strong className="font-mono font-normal text-graphite tabular-nums">
                    15%
                  </strong>{' '}
                  success-only seller fee
                </span>
                <span>
                  <strong className="font-mono font-normal text-graphite tabular-nums">
                    100%
                  </strong>{' '}
                  escrow-protected title
                </span>
              </div>
            </div>

            {/* Right Column: Overlapping 3-Card Ventriloc Data Observatory */}
            <div className="lg:col-span-6">
              <HeroObservatoryCluster
                totalInventoryValue={totalValue || 1680000}
                availableCount={activeDomains.length || 17}
                medianPrice={medianPrice}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNER LOGO STRIP — Full-Width White Canvas */}
      <PartnerLogoStrip />

      {/* 3. CURATED PORTFOLIO PREVIEW — Ash Surface Band */}
      <section className="w-full bg-canvas-white py-20 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-editorial text-[13px] text-brass mb-2">
                Curated Inventory
              </p>
              <h2 className="heading-lg-editorial text-graphite max-w-[620px]">
                Vetted digital assets available for immediate acquisition or
                structured offer.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="font-editorial text-[16px] text-graphite link-ember inline-flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <span>View full catalogue</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          <PortfolioExplorer
            domains={domains}
            loading={loading}
            onSelectDomain={onSelectDomain}
            compactMode={true}
            onViewAllClick={() => onNavigate('portfolio')}
          />
        </div>
      </section>

      {/* 4. TWO-PATHWAY ASYMMETRIC MANDATE CARDS — Sisora Buy/Sell Structure in Ventriloc Form */}
      <section className="w-full bg-ash py-20 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[640px] mb-12">
            <p className="font-editorial text-[13px] text-brass mb-2">
              Brokerage Mandates
            </p>
            <h2 className="heading-lg-editorial text-graphite">
              Two disciplined desks built for opposite sides of the closing
              table.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Looking to Buy Asymmetric Card */}
            <div className="bg-canvas-white asymmetric-card pt-14 px-9 pb-10 sm:px-12 flex flex-col justify-between border border-mist">
              <div>
                <p className="font-mono text-[12px] text-ember-orange">
                  01. Acquisition Desk
                </p>
                <h3 className="heading-editorial text-graphite mt-3">
                  Looking to Buy
                </h3>
                <p className="mt-4 text-[16px] leading-[1.6] text-steel">
                  Access verified .com, .ai, .io, and .si inventory or commission
                  a confidential stealth acquisition for an unlisted domain. We
                  shield your corporate identity, benchmark true market value,
                  and coordinate clean registrar transfer.
                </p>
                <ul className="mt-6 space-y-2.5 text-[14px] text-graphite">
                  <li>· Direct access to off-market investor portfolios</li>
                  <li>· Anonymized owner outreach &amp; valuation diligence</li>
                  <li>· Outright purchase or 12–36 month lease-to-own</li>
                </ul>
              </div>
              <div className="mt-9 pt-6 border-t border-mist flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('buy')}
                  className="btn-graphite cursor-pointer"
                >
                  Submit buying brief
                </button>
                <span className="font-mono text-[12px] text-slate">
                  Response &lt; 4h
                </span>
              </div>
            </div>

            {/* Looking to Sell Asymmetric Card */}
            <div className="bg-ivory asymmetric-card pt-14 px-9 pb-10 sm:px-12 flex flex-col justify-between border border-mist">
              <div>
                <p className="font-mono text-[12px] text-brass">
                  02. Divestment Desk
                </p>
                <h3 className="heading-editorial text-graphite mt-3">
                  Looking to Sell
                </h3>
                <p className="mt-4 text-[16px] leading-[1.6] text-steel">
                  Entrust single flagship names or institutional portfolios to
                  active outbound representation. We research funded end-users,
                  prepare tailored positioning dossiers, and negotiate directly
                  with decision-makers.
                </p>
                <ul className="mt-6 space-y-2.5 text-[14px] text-graphite">
                  <li>· Standard 15% success-only brokerage commission</li>
                  <li>· Focused 90-day exclusive representation period</li>
                  <li>· Zero upfront listing, appraisal, or marketing retainers</li>
                </ul>
              </div>
              <div className="mt-9 pt-6 border-t border-graphite/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('sell')}
                  className="btn-ghost-graphite cursor-pointer"
                >
                  List your domain
                </button>
                <span className="font-mono text-[12px] text-steel">
                  15% · 90-day term
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE EDITORIAL STORYTELLING — Ventriloc 4-Stage Visual Protocol */}
      <section className="w-full bg-canvas-white py-20 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[660px] mb-12">
            <p className="font-editorial text-[13px] text-brass mb-2">
              How Mortila Operates
            </p>
            <h2 className="heading-lg-editorial text-graphite">
              From comparable modeling to atomic escrow transfer in four
              audited stages.
            </h2>
          </div>

          <div className="bg-ash asymmetric-card p-6 sm:p-10">
            <BrokerageStoryVisualizer />
          </div>
        </div>
      </section>

      {/* 6. PROOF & PORTFOLIO ALLOCATION OBSERVATORY */}
      <section className="w-full bg-ash py-20 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="font-editorial text-[13px] text-brass mb-2">
                  Verified Outcomes
                </p>
                <h2 className="heading-lg-editorial text-graphite">
                  Discreet execution trusted by founders and institutional
                  holders.
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {TESTIMONIALS.map((item) => (
                  <blockquote
                    key={item.name}
                    className="bg-canvas-white asymmetric-card p-8 border border-mist"
                  >
                    <p className="text-[17px] leading-[1.55] text-graphite">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <footer className="mt-6 pt-4 border-t border-mist flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div>
                        <p className="font-editorial text-[16px] text-graphite">
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
                  </blockquote>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 lg:pt-12">
              <CategoryDistributionCard domains={domains} />
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLOSING EDITORIAL CTA BAND */}
      <section className="w-full bg-canvas-white py-20 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-ivory asymmetric-card p-10 sm:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-[640px]">
              <p className="font-editorial text-[13px] text-brass mb-3">
                Private Advisory Desk
              </p>
              <h2 className="heading-lg-editorial text-graphite">
                Securing your flagship identity begins with a single
                confidential brief.
              </h2>
              <p className="mt-4 text-[16px] text-steel leading-[1.6]">
                Speak directly with a Mortila managing broker regarding an
                acquisition target, portfolio appraisal, or custom lease-to-own
                structure.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="btn-graphite cursor-pointer"
              >
                Schedule advisory call
              </button>
              <button
                type="button"
                onClick={() => onNavigate('services')}
                className="btn-ghost-graphite cursor-pointer"
              >
                Review fee terms
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
