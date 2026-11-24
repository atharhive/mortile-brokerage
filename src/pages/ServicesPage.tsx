import React from 'react';
import { motion } from 'motion/react';
import type { AppRoute } from '../types/brokerage';
import { CommissionStructureCard } from '../components/observatory/EditorialDiagrams';
import { EditorialButton } from '../components/ui/EditorialButton';

interface ServicesPageProps {
  onNavigate: (route: AppRoute) => void;
}

const SERVICES = [
  {
    index: '01',
    title: 'Buyer Acquisition Mandates',
    fee: 'Success-based / Retainer optional',
    summary:
      'End-to-end stealth acquisition for startups, public enterprises, and venture studios targeting an exact-match upgrade. We verify ownership behind WHOIS privacy, establish fair market pricing, and negotiate without exposing your brand or funding round.',
    deliverables: [
      'Comprehensive ownership trace & legal title audit',
      'Comparable sale valuation memo prior to first outreach',
      'Anonymized negotiation & counteroffer execution',
      'Escrow.com or Atom.com settlement & DNS cutover checklist',
    ],
  },
  {
    index: '02',
    title: 'Exclusive Seller Representation',
    fee: '15% commission · 90-day exclusive',
    summary:
      'Active outbound brokerage for ultra-premium single names and curated investor portfolios across .com, .ai, .io, and .si. Rather than passively waiting for inbound forms, we map funded end-user buyers and pitch executive decision-makers directly.',
    deliverables: [
      'Bespoke brand positioning dossier for each represented asset',
      'Targeted outreach to Series A–D founders & corporate M&A desks',
      'Bi-weekly pipeline telemetry and offer verification',
      'Protected closing via licensed third-party escrow',
    ],
  },
  {
    index: '03',
    title: 'Portfolio Valuation & Liquidity Audits',
    fee: 'Fixed advisory scope',
    summary:
      'Independent appraisal and divestment sequencing for private holders, corporate IP desks, and estate portfolios. We separate liquid category leaders from long-tail renewals to optimize annual carrying costs and exit pricing.',
    deliverables: [
      'Asset-by-asset retail vs. wholesale liquidation range',
      'Trademark collision and UDRP risk screening',
      'Multi-quarter staged exit plan to maximize net proceeds',
    ],
  },
  {
    index: '04',
    title: 'Lease-to-Own & Structured Closings',
    fee: 'Custom escrow schedule',
    summary:
      'Preserve operating runway while securing a category-defining brand today. Mortila structures 12 to 36 month installment acquisitions with immediate DNS control under escrow custody until final principal payoff.',
    deliverables: [
      'Immediate live DNS & email deployment from payment one',
      'Zero-penalty early buyout option at any milestone',
      'Automated title transfer upon completion of final installment',
    ],
  },
];

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-canvas-white">
      {/* Header */}
      <section className="editorial-container pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <p className="font-editorial text-[13px] text-brass mb-3">
              Advisory &amp; Brokerage Services
            </p>
            <h1 className="display-headline text-graphite">
              Structured domain brokerage for high-conviction transactions.
            </h1>
            <p className="mt-6 text-[18px] leading-[1.55] text-steel max-w-[620px]">
              Whether acquiring an off-market flagship .com or divesting a
              curated .si / .ai portfolio, every Mortila mandate is governed by
              clear fee alignment, strict confidentiality, and regulated escrow
              settlement.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <EditorialButton
                variant="primary"
                showArrow
                onClick={() => onNavigate('buy')}
              >
                Looking to Buy
              </EditorialButton>
              <EditorialButton
                variant="ghost"
                onClick={() => onNavigate('sell')}
              >
                Looking to Sell
              </EditorialButton>
            </div>
          </motion.div>

          <div className="lg:col-span-5">
            <CommissionStructureCard />
          </div>
        </div>
      </section>

      {/* Numbered Services List on Textured Ash Surface */}
      <section className="w-full surface-paper-ash border-y border-graphite/8 py-20 lg:py-24">
        <div className="editorial-container space-y-6">
          {SERVICES.map((svc, idx) => (
            <motion.article
              key={svc.index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="surface-paper-white tactile-card asymmetric-card p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[14px] text-ember-orange">
                    {svc.index}.
                  </span>
                  <h2 className="heading-editorial text-graphite">
                    {svc.title}
                  </h2>
                </div>
                <p className="mt-3 pl-7 font-mono text-[12px] text-brass">
                  {svc.fee}
                </p>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <p className="text-[16px] leading-[1.65] text-steel">
                  {svc.summary}
                </p>
                <div className="pt-4 border-t border-graphite/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px] text-graphite">
                  {svc.deliverables.map((item) => (
                    <p key={item} className="leading-[1.5]">
                      · {item}
                    </p>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Escrow Terms Comparison Matrix */}
      <section className="editorial-container py-20 lg:py-24">
        <div className="max-w-[660px] mb-10">
          <p className="font-editorial text-[13px] text-brass mb-2">
            Settlement Architecture
          </p>
          <h2 className="heading-lg-editorial text-graphite">
            Transparent fee &amp; escrow terms across transaction tiers.
          </h2>
        </div>

        <div className="overflow-x-auto tactile-widget">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fog border-b border-mist text-[13px] text-slate">
                <th className="py-4 px-6 font-normal">Mandate Scope</th>
                <th className="py-4 px-6 font-normal">Minimum Asset Tier</th>
                <th className="py-4 px-6 font-normal">Brokerage Fee</th>
                <th className="py-4 px-6 font-normal">Exclusivity Window</th>
                <th className="py-4 px-6 font-normal">Escrow Rail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist text-[14px]">
              <tr>
                <td className="py-4 px-6 font-editorial text-[17px] text-graphite">
                  Single Asset Listing
                </td>
                <td className="py-4 px-6 font-mono tabular-nums text-steel">
                  $15,000+
                </td>
                <td className="py-4 px-6 font-mono tabular-nums text-graphite">
                  15% on close
                </td>
                <td className="py-4 px-6 text-steel">90 days exclusive</td>
                <td className="py-4 px-6 text-steel">Escrow.com / Atom</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-editorial text-[17px] text-graphite">
                  Institutional Portfolio Sale
                </td>
                <td className="py-4 px-6 font-mono tabular-nums text-steel">
                  $250,000+
                </td>
                <td className="py-4 px-6 font-mono tabular-nums text-graphite">
                  10% – 12% tiered
                </td>
                <td className="py-4 px-6 text-steel">120 days exclusive</td>
                <td className="py-4 px-6 text-steel">Escrow.com Concierge</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-editorial text-[17px] text-graphite">
                  Buyer Stealth Acquisition
                </td>
                <td className="py-4 px-6 font-mono tabular-nums text-steel">
                  $25,000+ budget
                </td>
                <td className="py-4 px-6 font-mono tabular-nums text-graphite">
                  10% of purchase price
                </td>
                <td className="py-4 px-6 text-steel">60 days target lock</td>
                <td className="py-4 px-6 text-steel">Escrow.com / Wire</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex justify-end">
          <EditorialButton
            variant="primary"
            showArrow
            onClick={() => onNavigate('contact')}
          >
            Request custom brokerage terms
          </EditorialButton>
        </div>
      </section>
    </div>
  );
};
