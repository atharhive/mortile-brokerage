import React from 'react';
import type { AppRoute, DomainAsset } from '../types/brokerage';
import { formatShortUsd } from '../types/brokerage';
import { PortfolioExplorer } from '../components/portfolio/PortfolioExplorer';

interface PortfolioPageProps {
  domains: DomainAsset[];
  loading: boolean;
  onSelectDomain: (domain: DomainAsset) => void;
  onNavigate: (route: AppRoute) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  domains,
  loading,
  onSelectDomain,
  onNavigate,
}) => {
  const available = domains.filter((d) => d.status === 'available');
  const totalValue = available.reduce((sum, d) => sum + d.priceUsd, 0);
  const avgAge =
    domains.length > 0
      ? Math.round(
          domains.reduce((sum, d) => sum + d.ageYears, 0) / domains.length
        )
      : 14;

  return (
    <div className="w-full bg-canvas-white">
      {/* Page Header */}
      <section className="max-w-[1200px] mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-mist pb-10">
          <div className="lg:col-span-8">
            <p className="font-editorial text-[13px] text-brass mb-3">
              Mortila Portfolio Directory
            </p>
            <h1 className="display-headline text-graphite">
              Curated domain inventory
            </h1>
            <p className="mt-5 text-[18px] leading-[1.45] text-steel max-w-[620px]">
              Filter by industry vertical, extension (.com, .ai, .io, .si, .ch),
              character length, or guide price. Select any asset to review full
              comparable data and submit an escrow-backed offer.
            </p>
          </div>
          <div className="lg:col-span-4 grid grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-[12px] text-slate">Available</p>
              <p className="font-mono text-[22px] text-graphite tabular-nums mt-1">
                {available.length}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate">Active Value</p>
              <p className="font-mono text-[22px] text-graphite tabular-nums mt-1">
                {formatShortUsd(totalValue)}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate">Avg. Age</p>
              <p className="font-mono text-[22px] text-graphite tabular-nums mt-1">
                {avgAge} yrs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Search & Filter Directory */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">
        <PortfolioExplorer
          domains={domains}
          loading={loading}
          onSelectDomain={onSelectDomain}
        />

        {/* Off-Market Stealth Acquisition Strip */}
        <div className="mt-16 bg-ivory asymmetric-card p-9 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-[600px]">
            <p className="font-editorial text-[13px] text-brass">
              Off-Market Sourcing
            </p>
            <h2 className="heading-editorial text-graphite mt-1">
              Seeking a specific name not displayed in public inventory?
            </h2>
            <p className="text-[15px] text-steel mt-2 leading-[1.55]">
              More than 40% of Mortila transactions involve unlisted assets
              negotiated privately under non-disclosure agreements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('buy')}
            className="btn-graphite shrink-0 cursor-pointer"
          >
            Commission stealth search
          </button>
        </div>
      </section>
    </div>
  );
};
