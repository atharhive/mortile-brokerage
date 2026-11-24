import React from 'react';
import { motion } from 'motion/react';
import type { DomainAsset } from '../../types/brokerage';
import { formatShortUsd } from '../../types/brokerage';

const PARTNER_NAMES = [
  'Escrow.com',
  'Atom.com',
  'Sedo MLS',
  'Afternic',
  'Cloudflare',
  'Dynadot',
  'ICANN Accredited',
];

export const PartnerLogoStrip: React.FC = () => {
  return (
    <section className="w-full bg-canvas-white py-14 border-y border-graphite/8">
      <div className="editorial-container">
        <p className="text-[13px] font-editorial text-brass mb-7">
          Trusted settlement rails across 140+ institutional domain transfers
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-6 gap-x-6 items-center">
          {PARTNER_NAMES.map((partner, idx) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-editorial text-[18px] text-graphite/75 hover:text-graphite transition-colors tracking-[-0.02em] whitespace-nowrap"
            >
              {partner}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CategoryDistributionCard: React.FC<{ domains: DomainAsset[] }> = ({
  domains,
}) => {
  const counts = domains.reduce<Record<string, { count: number; total: number }>>(
    (acc, d) => {
      if (!acc[d.category]) {
        acc[d.category] = { count: 0, total: 0 };
      }
      acc[d.category].count += 1;
      acc[d.category].total += d.priceUsd;
      return acc;
    },
    {}
  );

  const entries = Object.entries(counts)
    .map(([category, info]) => ({ category, ...info }))
    .sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...entries.map((e) => e.total), 1);

  return (
    <div className="tactile-widget data-widget-card p-7 sm:p-8">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <p className="text-[13px] font-editorial text-brass">
            Portfolio Allocation
          </p>
          <h3 className="text-[22px] font-editorial text-graphite mt-0.5">
            Inventory value by vertical
          </h3>
        </div>
        <span className="font-mono text-[12px] text-slate tabular-nums">
          {domains.length} assets
        </span>
      </div>

      <div className="space-y-4">
        {entries.map((item, idx) => {
          const widthPct = Math.max(8, Math.round((item.total / maxTotal) * 100));
          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2 text-[13px]">
                <span className="text-graphite truncate">{item.category}</span>
                <span className="font-mono text-steel tabular-nums whitespace-nowrap">
                  {formatShortUsd(item.total)} · {item.count}
                </span>
              </div>
              <div className="h-[6px] bg-fog w-full overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: idx * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ width: `${widthPct}%`, transformOrigin: 'left' }}
                  className={
                    idx === 0 ? 'h-full bg-ember-orange' : 'h-full bg-graphite'
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CommissionStructureCard: React.FC = () => {
  return (
    <div className="tactile-widget data-widget-card p-7 sm:p-9">
      <p className="text-[13px] font-editorial text-brass">
        Seller Alignment Model
      </p>
      <h3 className="text-[24px] font-editorial text-graphite mt-1">
        Success-only brokerage economics
      </h3>
      <p className="text-[14px] text-steel mt-2 leading-[1.6]">
        Zero upfront listing retainers. Mortila earns exclusively when funds
        clear escrow and registrar transfer completes.
      </p>

      <div className="mt-7 grid grid-cols-3 gap-4 border-t border-mist pt-6">
        <div>
          <p className="font-mono text-[28px] text-graphite tabular-nums leading-none">
            15%
          </p>
          <p className="text-[12px] text-slate mt-2">
            Standard commission on completed sales
          </p>
        </div>
        <div>
          <p className="font-mono text-[28px] text-ember-orange tabular-nums leading-none">
            90d
          </p>
          <p className="text-[12px] text-slate mt-2">
            Exclusive targeted representation window
          </p>
        </div>
        <div>
          <p className="font-mono text-[28px] text-graphite tabular-nums leading-none">
            $0
          </p>
          <p className="text-[12px] text-slate mt-2">
            Upfront appraisal or marketing fees
          </p>
        </div>
      </div>

      {/* Visual split bar */}
      <div className="mt-6">
        <div className="flex justify-between text-[12px] font-mono text-steel mb-1.5">
          <span>Seller Net Proceeds (85%)</span>
          <span className="text-ember-orange">Brokerage (15%)</span>
        </div>
        <div className="h-[8px] w-full flex overflow-hidden bg-fog">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '85%', transformOrigin: 'left' }}
            className="bg-graphite h-full"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '15%', transformOrigin: 'left' }}
            className="bg-ember-orange h-full"
          />
        </div>
      </div>
    </div>
  );
};
