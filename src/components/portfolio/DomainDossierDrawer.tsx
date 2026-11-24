import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, ShieldCheck, X } from 'lucide-react';
import { formatUsd, type DomainAsset } from '../../types/brokerage';

interface DomainDossierDrawerProps {
  domain: DomainAsset | null;
  onClose: () => void;
}

export const DomainDossierDrawer: React.FC<DomainDossierDrawerProps> = ({
  domain,
  onClose,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [company, setCompany] = useState('');
  const [offerUsd, setOfferUsd] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const resetAndClose = () => {
    setSubmitted(false);
    setError(null);
    setClientName('');
    setClientEmail('');
    setCompany('');
    setOfferUsd('');
    setMessage('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setError(null);

    const parsedOffer = offerUsd ? Number(offerUsd.replace(/[^0-9]/g, '')) : domain.priceUsd;
    if (domain.status !== 'sold' && offerUsd && parsedOffer < domain.minOfferUsd) {
      setError(
        `Minimum qualified opening offer for ${domain.name} is ${formatUsd(
          domain.minOfferUsd
        )}.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'domain_offer',
          domainId: domain.id,
          domainName: domain.name,
          clientName,
          clientEmail,
          company,
          budgetOrOfferUsd: parsedOffer,
          message:
            message.trim() ||
            `Requesting acquisition terms for ${domain.name} via institutional escrow.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to submit offer.');
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {domain && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-graphite/40"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[580px] bg-canvas-white h-full overflow-y-auto border-l border-mist flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-mist flex items-center justify-between gap-4 sticky top-0 bg-canvas-white z-10">
              <div>
                <p className="font-editorial text-[13px] text-brass">
                  Asset Dossier · {domain.category}
                </p>
                <h2 className="font-editorial text-[32px] text-graphite leading-tight mt-0.5">
                  {domain.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close dossier"
                className="p-2.5 text-steel hover:text-graphite transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1">
              {/* Pricing & Key Specs Panel */}
              <div className="bg-ash asymmetric-card p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  <div>
                    <p className="text-[12px] text-slate">Buy Now / Guide</p>
                    <p className="font-mono text-[20px] text-graphite tabular-nums mt-1">
                      {domain.status === 'sold'
                        ? 'Closed'
                        : formatUsd(domain.priceUsd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate">Min. Offer</p>
                    <p className="font-mono text-[16px] text-steel tabular-nums mt-1.5">
                      {domain.status === 'sold'
                        ? '—'
                        : formatUsd(domain.minOfferUsd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate">Registered</p>
                    <p className="font-mono text-[16px] text-graphite tabular-nums mt-1.5">
                      {domain.registeredYear} ({domain.ageYears}y)
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate">Length / TLD</p>
                    <p className="font-mono text-[16px] text-graphite tabular-nums mt-1.5">
                      {domain.length}L · {domain.tld}
                    </p>
                  </div>
                </div>
              </div>

              {/* Editorial Positioning */}
              <div>
                <p className="font-editorial text-[13px] text-slate mb-2">
                  Editorial Positioning
                </p>
                <p className="text-[16px] leading-[1.6] text-steel">
                  {domain.summary}
                </p>
              </div>

              {/* Use Cases & Comparable Sale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-y border-mist py-6">
                <div>
                  <p className="font-editorial text-[13px] text-slate mb-2">
                    Target Deployments
                  </p>
                  <p className="text-[14px] text-graphite leading-[1.6]">
                    {domain.useCases
                      .split(',')
                      .map((u) => u.trim())
                      .join(' · ')}
                  </p>
                </div>
                <div>
                  <p className="font-editorial text-[13px] text-slate mb-2">
                    Market Comparable
                  </p>
                  <p className="font-mono text-[14px] text-graphite tabular-nums">
                    {domain.comparableSale || 'Private institutional benchmark'}
                  </p>
                  <p className="text-[12px] text-slate mt-1">
                    Structure: {domain.pricingModel}
                  </p>
                </div>
              </div>

              {/* Escrow Verification Callout */}
              <div className="flex items-start gap-3.5 bg-ivory/70 asymmetric-card p-5">
                <ShieldCheck
                  className="w-5 h-5 text-brass shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <div className="text-[13px] leading-[1.55] text-steel">
                  <span className="text-graphite font-medium">
                    Protected institutional transfer.
                  </span>{' '}
                  All acquisitions close through Escrow.com or Atom.com with
                  verified registrar push, clean title warranties, and zero buyer
                  escrow surprises.
                </div>
              </div>

              {/* Acquisition Form */}
              {domain.status === 'sold' ? (
                <div className="border border-mist p-6 bg-fog">
                  <p className="font-editorial text-[18px] text-graphite">
                    Archived Closed Transaction
                  </p>
                  <p className="text-[14px] text-steel mt-2 leading-[1.55]">
                    {domain.name} has already transferred to a private corporate
                    acquirer. Submit a buyer mandate if you are seeking a
                    comparable asset in {domain.category}.
                  </p>
                </div>
              ) : submitted ? (
                <div className="border border-mist bg-ash p-7 asymmetric-card">
                  <div className="flex items-center gap-2.5 text-graphite">
                    <Check className="w-5 h-5 text-ember-orange" strokeWidth={1.8} />
                    <h3 className="font-editorial text-[22px]">
                      Offer logged with Mortila Desk
                    </h3>
                  </div>
                  <p className="text-[14px] text-steel mt-3 leading-[1.6]">
                    A senior broker will respond to{' '}
                    <span className="text-graphite">{clientEmail}</span> within 4
                    business hours with seller confirmation and Escrow.com
                    closing documentation for{' '}
                    <span className="text-graphite">{domain.name}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="btn-graphite mt-6 cursor-pointer"
                  >
                    Return to Portfolio
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-editorial text-[22px] text-graphite">
                      Submit Offer or Buy Now Inquiry
                    </h3>
                    <span className="text-[12px] text-slate">
                      Confidential NDA applies
                    </span>
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
                        placeholder="Alex Mercer"
                        className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px] text-graphite focus:border-graphite focus:bg-canvas-white transition-colors"
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
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px] text-graphite focus:border-graphite focus:bg-canvas-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] text-steel mb-1.5">
                        Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Stealth or Fund Name"
                        className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px] text-graphite focus:border-graphite focus:bg-canvas-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] text-steel mb-1.5">
                        Offer Amount (USD)
                      </label>
                      <input
                        type="number"
                        min={domain.minOfferUsd}
                        step={500}
                        value={offerUsd}
                        onChange={(e) => setOfferUsd(e.target.value)}
                        placeholder={`${domain.priceUsd} (Buy Now)`}
                        className="w-full px-3.5 py-2.5 bg-fog border border-mist font-mono text-[14px] text-graphite tabular-nums focus:border-graphite focus:bg-canvas-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] text-steel mb-1.5">
                      Acquisition Timeline &amp; Notes *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify preferred escrow rail (Escrow.com / Atom), lease-to-own preference, or closing deadline..."
                      className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px] text-graphite focus:border-graphite focus:bg-canvas-white transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-graphite flex-1 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <span>
                        {submitting
                          ? 'Logging offer...'
                          : `Submit Offer for ${domain.name}`}
                      </span>
                      <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
