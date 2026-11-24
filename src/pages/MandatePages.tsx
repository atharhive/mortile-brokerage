import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import type { AppRoute } from '../types/brokerage';
import { CommissionStructureCard } from '../components/observatory/EditorialDiagrams';

interface MandatePageProps {
  onNavigate: (route: AppRoute) => void;
}

export const BuyPage: React.FC<MandatePageProps> = ({ onNavigate }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [company, setCompany] = useState('');
  const [targetDomain, setTargetDomain] = useState('');
  const [budgetUsd, setBudgetUsd] = useState('');
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
          type: 'buyer_mandate',
          domainName: targetDomain || 'Custom Acquisition Criteria',
          clientName,
          clientEmail,
          company,
          budgetOrOfferUsd: budgetUsd
            ? Number(budgetUsd.replace(/[^0-9]/g, ''))
            : null,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to submit brief.');
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-canvas-white">
      <section className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-editorial text-[13px] text-brass">
              Looking to Buy · Acquisition Desk
            </p>
            <h1 className="display-headline text-graphite">
              Acquire your exact-match domain without signaling the market.
            </h1>
            <p className="text-[16px] leading-[1.6] text-steel">
              Whether you have a specific unlisted domain in mind or need a
              curated shortlist of five-to-seven letter .com, .ai, or .si
              candidates, Mortila manages discovery, valuation, and discreet
              holder negotiations.
            </p>

            <div className="bg-ash asymmetric-card p-7 space-y-4">
              <p className="font-editorial text-[18px] text-graphite">
                Why acquirers mandate Mortila
              </p>
              <ul className="space-y-2.5 text-[14px] text-steel leading-[1.55]">
                <li>
                  <span className="text-graphite">01. Identity Shield:</span>{' '}
                  Sellers never see your corporate name or capital raise during
                  price discovery.
                </li>
                <li>
                  <span className="text-graphite">02. Verified Comparables:</span>{' '}
                  Every counteroffer is anchored in audited private sales data.
                </li>
                <li>
                  <span className="text-graphite">03. Clean Title Transfer:</span>{' '}
                  Closed strictly via Escrow.com or Atom with registrar
                  verification.
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="font-editorial text-[15px] text-graphite link-ember cursor-pointer"
            >
              Or browse immediately available inventory →
            </button>
          </div>

          {/* Right Buyer Mandate Form */}
          <div className="lg:col-span-7 bg-ash asymmetric-card p-8 sm:p-12">
            {submitted ? (
              <div className="bg-canvas-white p-8 border border-mist">
                <div className="flex items-center gap-2.5 text-graphite">
                  <Check className="w-5 h-5 text-ember-orange" />
                  <h2 className="font-editorial text-[26px]">
                    Acquisition brief received
                  </h2>
                </div>
                <p className="mt-3 text-[15px] text-steel leading-[1.6]">
                  Thank you, {clientName}. Your confidential buying mandate has
                  been assigned to a senior broker. Expect an initial feasibility
                  report at <span className="text-graphite">{clientEmail}</span>{' '}
                  within 4 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setTargetDomain('');
                    setMessage('');
                  }}
                  className="btn-graphite mt-6 cursor-pointer"
                >
                  Submit another brief
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="heading-editorial text-graphite">
                    Confidential Buyer Mandate
                  </h2>
                  <p className="text-[14px] text-steel mt-1">
                    All submissions are protected under mutual non-disclosure.
                  </p>
                </div>

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
                      placeholder="Claire Beaumont"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="claire@company.com"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Company / Fund
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Optional (Stealth OK)"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Maximum Budget (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min={5000}
                      step={1000}
                      value={budgetUsd}
                      onChange={(e) => setBudgetUsd(e.target.value)}
                      placeholder="150000"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist font-mono text-[14px] text-graphite tabular-nums focus:border-graphite"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] text-steel mb-1.5">
                    Target Domain(s) or Naming Criteria *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetDomain}
                    onChange={(e) => setTargetDomain(e.target.value)}
                    placeholder="e.g. exact-match .com, 5-letter .ai, or specific off-market domain"
                    className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-steel mb-1.5">
                    Launch Timeline, Trademark Classes &amp; Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Outline your vertical, target closing window, and whether you require stealth outreach..."
                    className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[12px] text-slate">
                    <ShieldCheck className="w-4 h-4 text-brass" strokeWidth={1.5} />
                    <span>Strict NDA &amp; Escrow.com closing</span>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-graphite cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Buying Mandate'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const SellPage: React.FC<MandatePageProps> = ({ onNavigate }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [company, setCompany] = useState('');
  const [domainName, setDomainName] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
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
          type: 'seller_listing',
          domainName,
          clientName,
          clientEmail,
          company,
          budgetOrOfferUsd: askingPrice
            ? Number(askingPrice.replace(/[^0-9]/g, ''))
            : null,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to submit listing.');
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to submit listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-canvas-white">
      <section className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Narrative + Commission Visual */}
          <div className="lg:col-span-5 space-y-6">
            <p className="font-editorial text-[13px] text-brass">
              Looking to Sell · Divestment Desk
            </p>
            <h1 className="display-headline text-graphite">
              Targeted representation for premium digital assets.
            </h1>
            <p className="text-[16px] leading-[1.6] text-steel">
              We accept select single-word .com, .ai, .io, .si, and ultra-short
              holdings for active outbound brokerage. Your assets are marketed
              directly to funded corporate end-users, venture studios, and
              institutional syndicates.
            </p>

            <CommissionStructureCard />

            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="font-editorial text-[15px] text-graphite link-ember cursor-pointer"
            >
              Review complete brokerage terms →
            </button>
          </div>

          {/* Right Seller Listing Form */}
          <div className="lg:col-span-7 bg-ivory asymmetric-card p-8 sm:p-12">
            {submitted ? (
              <div className="bg-canvas-white p-8 border border-mist">
                <div className="flex items-center gap-2.5 text-graphite">
                  <Check className="w-5 h-5 text-ember-orange" />
                  <h2 className="font-editorial text-[26px]">
                    Asset submitted for brokerage review
                  </h2>
                </div>
                <p className="mt-3 text-[15px] text-steel leading-[1.6]">
                  Thank you, {clientName}. Our valuation committee will review{' '}
                  <span className="text-graphite">{domainName}</span> and reply
                  to <span className="text-graphite">{clientEmail}</span> within
                  24 hours with a marketability assessment and exclusive 90-day
                  representation proposal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setDomainName('');
                    setMessage('');
                  }}
                  className="btn-graphite mt-6 cursor-pointer"
                >
                  Submit additional domain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="heading-editorial text-graphite">
                    Submit Asset for Representation
                  </h2>
                  <p className="text-[14px] text-steel mt-1">
                    Standard terms: 15% commission upon successful close · 90-day
                    exclusive window.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 bg-canvas-white border border-ember-orange/50 text-[13px] text-graphite">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Owner / Portfolio Manager *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Luka Kovacic"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
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
                      placeholder="owner@portfolio.io"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Domain(s) to Represent *
                    </label>
                    <input
                      type="text"
                      required
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      placeholder="example.com, example.si"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Target Asking Price (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min={5000}
                      step={500}
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(e.target.value)}
                      placeholder="65000"
                      className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist font-mono text-[14px] text-graphite tabular-nums focus:border-graphite"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] text-steel mb-1.5">
                    Holding Entity (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Individual or Holding Company"
                    className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-steel mb-1.5">
                    Registrar, Past Offers &amp; Context *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share current registrar, prior inbound interest, or whether you are open to lease-to-own terms..."
                    className="w-full px-3.5 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-graphite cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit for Appraisal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
