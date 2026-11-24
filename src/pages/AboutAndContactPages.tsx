import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { AppRoute } from '../types/brokerage';
import { PartnerLogoStrip } from '../components/observatory/EditorialDiagrams';
import { EditorialButton } from '../components/ui/EditorialButton';

export const AboutPage: React.FC<{ onNavigate: (route: AppRoute) => void }> = ({
  onNavigate,
}) => {
  return (
    <div className="w-full bg-canvas-white">
      <section className="editorial-container pt-14 pb-20">
        <div className="max-w-[820px]">
          <p className="font-editorial text-[13px] text-brass mb-3">
            About Mortila Brokerage
          </p>
          <h1 className="display-headline text-graphite">
            Built on the conviction that a company’s name is permanent capital.
          </h1>
          <p className="mt-7 text-[18px] leading-[1.6] text-steel">
            Mortila Brokerage was founded to replace high-volume domain
            marketplaces with the calm rigor of a private M&amp;A advisory desk.
            We represent a tightly curated ledger of exact-match .com, .ai, .io,
            and .si digital real estate—bridging legacy asset holders and
            ambitious technology leaders.
          </p>
        </div>

        {/* Quantitative Track Record Grid */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '$38.4M+', label: 'Cumulative gross domain volume brokered' },
            { value: '140+', label: 'Verified institutional escrow closings' },
            { value: '11 days', label: 'Median wire-to-registrar settlement cycle' },
            { value: '22', label: 'Countries represented across buyer desks' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="surface-paper-ash tactile-card asymmetric-card p-8"
            >
              <p className="font-editorial text-[38px] text-graphite tabular-nums leading-none">
                {stat.value}
              </p>
              <p className="mt-3 text-[13px] text-steel leading-[1.5]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Operating Principles on Textured Ash Surface */}
      <section className="w-full surface-paper-ash border-y border-graphite/8 py-20 lg:py-24">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="font-editorial text-[13px] text-brass mb-2">
                Advisory Charter
              </p>
              <h2 className="heading-lg-editorial text-graphite">
                Three principles that govern every negotiation.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-5">
              {[
                {
                  num: '01',
                  title: 'Principal-level confidentiality',
                  body: 'We never publish buyer identities, internal ceiling budgets, or unsuccessful negotiations. Discretion protects both acquisition pricing and corporate launch schedules.',
                },
                {
                  num: '02',
                  title: 'Comparable-backed discipline',
                  body: 'Appraisals rely on verifiable historical liquidity—not automated keyword generators. Every asking price reflects linguistic permanence, TLD scarcity, and real enterprise demand.',
                },
                {
                  num: '03',
                  title: 'Regulated third-party custody',
                  body: 'Mortila never co-mingles client settlement funds. Every closing executes exclusively through Escrow.com, Atom.com, or major law firm trust accounts.',
                },
              ].map((p) => (
                <div
                  key={p.num}
                  className="surface-paper-white tactile-card asymmetric-card p-8 sm:p-9"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[13px] text-ember-orange">
                      {p.num}.
                    </span>
                    <h3 className="font-editorial text-[23px] text-graphite">
                      {p.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 pl-7 text-[15px] text-steel leading-[1.65]">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PartnerLogoStrip />

      {/* Leadership Desk */}
      <section className="editorial-container py-20 lg:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-editorial text-[13px] text-brass mb-2">
              Advisory Partners
            </p>
            <h2 className="heading-lg-editorial text-graphite">
              Senior specialists across Europe and North America.
            </h2>
          </div>
          <EditorialButton
            variant="primary"
            showArrow
            onClick={() => onNavigate('contact')}
          >
            Contact the desk
          </EditorialButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              initials: 'MK',
              name: 'Matteo Krenn',
              role: 'Managing Partner · Flagship .com & .ch',
              bio: 'Twelve years structuring seven-figure corporate domain acquisitions and sovereign IP consolidations from Zurich.',
            },
            {
              initials: 'AV',
              name: 'Anja Vidmar',
              role: 'Head of Emerging TLDs · .ai & .si',
              bio: 'Leads European Super Intelligence (.si) and artificial intelligence (.ai) portfolio mandates and institutional buyer syndication.',
            },
            {
              initials: 'DR',
              name: 'Daniel Richter',
              role: 'Director of Escrow & Title Diligence',
              bio: 'Oversees WHOIS chain-of-title verification, UDRP screening, and multi-jurisdictional Escrow.com closing operations.',
            },
          ].map((partner) => (
            <div
              key={partner.name}
              className="surface-paper-ash tactile-card asymmetric-card p-8 sm:p-9 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-graphite text-canvas-white font-editorial text-[16px] flex items-center justify-center">
                  {partner.initials}
                </div>
                <h3 className="font-editorial text-[24px] text-graphite mt-5">
                  {partner.name}
                </h3>
                <p className="font-mono text-[12px] text-brass mt-1">
                  {partner.role}
                </p>
                <p className="text-[14px] text-steel leading-[1.65] mt-4">
                  {partner.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [company, setCompany] = useState('');
  const [subjectDomain, setSubjectDomain] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general_advisory',
          domainName: subjectDomain || null,
          clientName,
          clientEmail,
          company,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to send message.');
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-canvas-white">
      <section className="editorial-container py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Direct Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="font-editorial text-[13px] text-brass mb-3">
                Private Advisory Desk
              </p>
              <h1 className="display-headline text-graphite">
                Start a confidential conversation.
              </h1>
              <p className="mt-5 text-[16px] leading-[1.65] text-steel">
                Reach our brokerage partners directly for portfolio inquiries,
                stealth acquisitions, escrow coordination, or media requests.
              </p>
            </div>

            <div className="surface-paper-ash tactile-card asymmetric-card p-8 sm:p-9 space-y-5">
              <div>
                <p className="text-[12px] text-slate">Direct Email</p>
                <a
                  href="mailto:advisory@mortilabrokerage.com"
                  className="font-editorial text-[21px] text-graphite link-ember mt-1 inline-block"
                >
                  advisory@mortilabrokerage.com
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-graphite/10 text-[14px]">
                <div>
                  <p className="text-[12px] text-slate">X (Twitter)</p>
                  <p className="text-graphite font-mono mt-0.5">
                    @MortilaBrokerage
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-slate">Telegram Desk</p>
                  <p className="text-graphite font-mono mt-0.5">
                    @MortilaBrokerage
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-graphite/10 text-[13px] text-steel">
                Response SLA: Within 4 business hours across CET, GMT, and EST
                trading windows.
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7 surface-paper-ash border border-graphite/10 asymmetric-card p-8 sm:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
            {submitted ? (
              <div className="tactile-widget p-9">
                <div className="flex items-center gap-2.5 text-graphite">
                  <Check className="w-5 h-5 text-ember-orange" />
                  <h2 className="font-editorial text-[26px]">
                    Message dispatched to Mortila Desk
                  </h2>
                </div>
                <p className="mt-3 text-[15px] text-steel leading-[1.6]">
                  Thank you, {clientName}. A managing partner will reply to{' '}
                  <span className="text-graphite">{clientEmail}</span> shortly.
                </p>
                <div className="mt-6">
                  <EditorialButton
                    variant="primary"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                  >
                    Send another message
                  </EditorialButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="heading-editorial text-graphite">
                  Direct Advisory Inquiry
                </h2>

                {error && (
                  <div className="p-3.5 bg-ivory border border-ember-orange/40 text-[13px] text-graphite">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="you@organization.com"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Domain / Subject (Optional)
                    </label>
                    <input
                      type="text"
                      value={subjectDomain}
                      onChange={(e) => setSubjectDomain(e.target.value)}
                      placeholder="e.g. velora.com or portfolio valuation"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] text-steel mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share how our advisory desk can assist..."
                    className="w-full px-3.5 py-2.5 bg-canvas-white border border-graphite/12 text-[14px] text-graphite focus:border-graphite"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <EditorialButton
                    type="submit"
                    variant="primary"
                    showArrow
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </EditorialButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
