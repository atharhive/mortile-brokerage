import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, LayoutGrid, List, Search, X } from 'lucide-react';
import {
  DOMAIN_CATEGORIES,
  DOMAIN_TLDS,
  formatUsd,
  type DomainAsset,
} from '../../types/brokerage';
import { EditorialButton } from '../ui/EditorialButton';

interface PortfolioExplorerProps {
  domains: DomainAsset[];
  loading: boolean;
  onSelectDomain: (domain: DomainAsset) => void;
  compactMode?: boolean;
  onViewAllClick?: () => void;
}

type LengthFilter = 'all' | 'short' | 'medium' | 'long';
type PriceFilter = 'all' | 'under50k' | '50kTo150k' | 'over150k';
type StatusFilter = 'all' | 'available' | 'under_offer' | 'sold';
type SortKey = 'featured' | 'price_desc' | 'price_asc' | 'length_asc' | 'oldest';

/** Deterministic editorial micro-sparkline path per domain for tactile data depth */
function buildSparklinePath(seed: number): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const x = i * 16;
    const wave = Math.sin(seed * 1.7 + i * 1.15) * 4.5;
    const trend = 22 - i * 2.6;
    const y = Math.max(4, Math.min(24, Number((trend + wave).toFixed(1))));
    pts.push([x, y]);
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
}

const DomainPortfolioCard: React.FC<{
  domain: DomainAsset;
  index: number;
  onSelect: (domain: DomainAsset) => void;
}> = ({ domain, index, onSelect }) => {
  const [spot, setSpot] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const sparkPath = useMemo(() => buildSparklinePath(domain.id + domain.length), [domain.id, domain.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y, active: true });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.48,
        delay: Math.min(index % 3, 2) * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onSelect(domain)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, active: false }))}
      className="group relative overflow-hidden surface-paper-ash tactile-card asymmetric-card p-7 sm:p-8 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Ember Accent Sweep on Hover */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px] bg-ember-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"
      />

      {/* Subtle Cursor-Following Warm Paper Highlight */}
      <span
        aria-hidden="true"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.68), rgba(235,230,221,0.18) 45%, transparent 72%)`,
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
      />

      <div className="relative z-10">
        {/* Clean Zero-Pill Typographic Metadata Kicker */}
        <div className="flex items-center justify-between gap-3 text-[12px] text-slate">
          <span className="truncate">
            {domain.category} · {domain.length}L · Est. {domain.registeredYear}
          </span>
          <StatusText status={domain.status} />
        </div>

        {/* Domain Wordmark + Kinetic Corner Arrow */}
        <div className="mt-5 flex items-baseline justify-between gap-3">
          <h3 className="font-editorial text-[30px] text-graphite leading-[1.06] tracking-[-0.025em] group-hover:text-ember-orange transition-colors duration-200">
            {domain.name}
          </h3>
          <span className="w-8 h-8 border border-graphite/10 bg-canvas-white/70 group-hover:bg-graphite group-hover:border-graphite group-hover:text-canvas-white text-graphite flex items-center justify-center shrink-0 transition-all duration-200">
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.6}
            />
          </span>
        </div>

        <p className="mt-3.5 text-[14px] leading-[1.6] text-steel line-clamp-2">
          {domain.summary}
        </p>
      </div>

      {/* Bottom Valuation Bar + Editorial Micro-Sparkline */}
      <div className="relative z-10 mt-7 pt-5 border-t border-graphite/10 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono text-slate uppercase tracking-wider">
            {domain.pricingModel}
          </p>
          <p className="font-mono text-[20px] text-graphite tabular-nums mt-1 leading-none">
            {domain.status === 'sold'
              ? 'Closed Sale'
              : formatUsd(domain.priceUsd)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {/* Quiet Demand Micro-Sparkline */}
          <svg
            width="84"
            height="26"
            viewBox="0 0 84 26"
            className="overflow-visible opacity-75 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            <path
              d={sparkPath}
              fill="none"
              stroke="#816729"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-[#ff682c] transition-colors duration-200"
            />
          </svg>
          <span className="font-editorial text-[13px] text-graphite link-ember">
            {domain.status === 'sold' ? 'View archive' : 'Inspect dossier'}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export const PortfolioExplorer: React.FC<PortfolioExplorerProps> = ({
  domains,
  loading,
  onSelectDomain,
  compactMode = false,
  onViewAllClick,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All Categories');
  const [tld, setTld] = useState<string>('All Extensions');
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = domains.filter((d) => {
      if (q) {
        const hay = `${d.name} ${d.category} ${d.summary} ${d.useCases}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category !== 'All Categories' && d.category !== category) return false;
      if (tld !== 'All Extensions' && d.tld !== tld) return false;

      if (lengthFilter === 'short' && d.length > 5) return false;
      if (lengthFilter === 'medium' && (d.length < 6 || d.length > 7)) return false;
      if (lengthFilter === 'long' && d.length < 8) return false;

      if (priceFilter === 'under50k' && d.priceUsd >= 50000) return false;
      if (
        priceFilter === '50kTo150k' &&
        (d.priceUsd < 50000 || d.priceUsd > 150000)
      )
        return false;
      if (priceFilter === 'over150k' && d.priceUsd <= 150000) return false;

      if (statusFilter !== 'all' && d.status !== statusFilter) return false;

      return true;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case 'price_desc':
          return b.priceUsd - a.priceUsd;
        case 'price_asc':
          return a.priceUsd - b.priceUsd;
        case 'length_asc':
          return a.length - b.length || b.priceUsd - a.priceUsd;
        case 'oldest':
          return a.registeredYear - b.registeredYear;
        case 'featured':
        default:
          return Number(b.featured) - Number(a.featured) || b.priceUsd - a.priceUsd;
      }
    });

    return compactMode ? list.slice(0, 6) : list;
  }, [
    domains,
    query,
    category,
    tld,
    lengthFilter,
    priceFilter,
    statusFilter,
    sortBy,
    compactMode,
  ]);

  const hasActiveFilters =
    query.trim() !== '' ||
    category !== 'All Categories' ||
    tld !== 'All Extensions' ||
    lengthFilter !== 'all' ||
    priceFilter !== 'all' ||
    statusFilter !== 'all';

  const resetFilters = () => {
    setQuery('');
    setCategory('All Categories');
    setTld('All Extensions');
    setLengthFilter('all');
    setPriceFilter('all');
    setStatusFilter('all');
    setSortBy('featured');
  };

  return (
    <div className="space-y-7">
      {/* Tactile Search & Filter Deck */}
      <div className="surface-paper-ash border border-graphite/10 asymmetric-card p-5 sm:p-7 space-y-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
        <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-slate absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by domain, keyword, or industry vertical (e.g. velora, .si, fintech)..."
              className="w-full pl-10 pr-9 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite placeholder:text-slate focus:border-graphite transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-graphite cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            aria-label="Filter by extension"
            value={tld}
            onChange={(e) => setTld(e.target.value)}
            className="px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite cursor-pointer"
          >
            {DOMAIN_TLDS.map((ext) => (
              <option key={ext} value={ext}>
                {ext}
              </option>
            ))}
          </select>

          {!compactMode && (
            <>
              <select
                aria-label="Filter by length"
                value={lengthFilter}
                onChange={(e) => setLengthFilter(e.target.value as LengthFilter)}
                className="px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite cursor-pointer"
              >
                <option value="all">All Lengths</option>
                <option value="short">5 letters or fewer</option>
                <option value="medium">6 – 7 letters</option>
                <option value="long">8+ letters</option>
              </select>

              <select
                aria-label="Filter by price range"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
                className="px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite cursor-pointer"
              >
                <option value="all">All Price Tiers</option>
                <option value="under50k">Under $50,000</option>
                <option value="50kTo150k">$50,000 – $150,000</option>
                <option value="over150k">$150,000+</option>
              </select>

              <select
                aria-label="Sort portfolio"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="length_asc">Shortest First</option>
                <option value="oldest">Oldest Registration</option>
              </select>
            </>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {DOMAIN_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 text-[13px] transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-graphite text-canvas-white border border-graphite'
                      : 'bg-canvas-white text-steel hover:text-graphite border border-graphite/10 hover:border-graphite/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {!compactMode && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-canvas-white border border-graphite/12 p-0.5">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'available', label: 'Available' },
                    { id: 'under_offer', label: 'Under Offer' },
                    { id: 'sold', label: 'Sold' },
                  ] as { id: StatusFilter; label: string }[]
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-2.5 py-1 text-[12px] transition-colors cursor-pointer whitespace-nowrap ${
                      statusFilter === st.id
                        ? 'bg-ash text-graphite font-medium'
                        : 'text-slate hover:text-graphite'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center border border-graphite/12 bg-canvas-white">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`p-2 cursor-pointer transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-graphite text-canvas-white'
                      : 'text-slate hover:text-graphite'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  aria-label="Ledger table view"
                  className={`p-2 cursor-pointer transition-colors ${
                    viewMode === 'table'
                      ? 'bg-graphite text-canvas-white'
                      : 'text-slate hover:text-graphite'
                  }`}
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count & Active Reset */}
      <div className="flex items-center justify-between text-[13px] text-slate">
        <p className="tabular-nums">
          Showing <span className="text-graphite font-mono">{filtered.length}</span>{' '}
          of <span className="text-graphite font-mono">{domains.length}</span>{' '}
          curated assets
        </p>
        <div className="flex items-center gap-5">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="link-ember text-graphite cursor-pointer"
            >
              Reset filters
            </button>
          )}
          {compactMode && onViewAllClick && (
            <button
              type="button"
              onClick={onViewAllClick}
              className="link-ember text-graphite cursor-pointer"
            >
              Browse complete inventory ({domains.length})
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[256px] surface-paper-ash asymmetric-card border border-graphite/8 animate-pulse p-8"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-paper-ash border border-graphite/10 asymmetric-card p-14 text-center">
          <p className="font-editorial text-[26px] text-graphite">
            No matching domains in active inventory
          </p>
          <p className="text-[15px] text-steel mt-2 max-w-[480px] mx-auto">
            Many institutional assets are held off-market under confidential
            representation. Reset your filters or brief our acquisition desk.
          </p>
          <div className="mt-7">
            <EditorialButton variant="primary" onClick={resetFilters}>
              Clear Search &amp; Filters
            </EditorialButton>
          </div>
        </div>
      ) : viewMode === 'table' && !compactMode ? (
        /* High-Density Ledger Table View */
        <div className="overflow-x-auto border border-graphite/10 tactile-widget">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-mist bg-fog text-[12px] text-slate font-normal">
                <th className="py-4 px-6 font-normal">Domain</th>
                <th className="py-4 px-4 font-normal">Vertical</th>
                <th className="py-4 px-4 font-normal text-right">Length</th>
                <th className="py-4 px-4 font-normal text-right">Est.</th>
                <th className="py-4 px-4 font-normal">Status</th>
                <th className="py-4 px-6 font-normal text-right">Guide Price</th>
                <th className="py-4 px-6 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist text-[14px]">
              {filtered.map((domain) => (
                <tr
                  key={domain.id}
                  onClick={() => onSelectDomain(domain)}
                  className="hover:bg-ash/55 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 font-editorial text-[19px] text-graphite group-hover:text-ember-orange transition-colors">
                    {domain.name}
                  </td>
                  <td className="py-4 px-4 text-steel">{domain.category}</td>
                  <td className="py-4 px-4 text-right font-mono tabular-nums text-steel">
                    {domain.length}L
                  </td>
                  <td className="py-4 px-4 text-right font-mono tabular-nums text-steel">
                    {domain.registeredYear}
                  </td>
                  <td className="py-4 px-4 text-[13px]">
                    <StatusText status={domain.status} />
                  </td>
                  <td className="py-4 px-6 text-right font-mono tabular-nums text-graphite">
                    {domain.status === 'sold'
                      ? 'Closed'
                      : formatUsd(domain.priceUsd)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="link-ember text-[13px] text-graphite">
                      Dossier
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tactile Animated Editorial Asymmetric Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((domain, idx) => (
            <DomainPortfolioCard
              key={domain.id}
              domain={domain}
              index={idx}
              onSelect={onSelectDomain}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function StatusText({ status }: { status: DomainAsset['status'] }) {
  if (status === 'under_offer') {
    return (
      <span className="font-mono text-[11px] text-ember-orange whitespace-nowrap">
        Under Offer
      </span>
    );
  }
  if (status === 'sold') {
    return (
      <span className="font-mono text-[11px] text-slate whitespace-nowrap">
        Sold
      </span>
    );
  }
  return (
    <span className="font-mono text-[11px] text-brass whitespace-nowrap">
      Available
    </span>
  );
}
