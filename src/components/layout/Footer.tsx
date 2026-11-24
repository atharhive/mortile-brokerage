import React, { useState } from 'react';
import type { AppRoute } from '../../types/brokerage';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false);

  return (
    <footer className="w-full bg-ash border-t border-mist pt-16 pb-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-mist">
          {/* Editorial Brand Summary */}
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-editorial text-[24px] text-graphite cursor-pointer"
            >
              Mortila Brokerage
            </button>
            <p className="mt-4 text-[15px] leading-[1.6] text-steel max-w-[380px]">
              Independent domain brokerage and private digital asset advisory.
              Representing category-defining .com, .ai, .io, and .si holdings
              with discreet bilateral negotiation and institutional escrow
              settlement.
            </p>
            <p className="mt-5 font-mono text-[12px] text-brass">
              Zurich · London · Ljubljana · Remote Global Desk
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 space-y-3">
            <p className="font-editorial text-[14px] text-slate">Directory</p>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="text-graphite hover:text-ember-orange transition-colors cursor-pointer"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="text-graphite hover:text-ember-orange transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('buy')}
                  className="text-graphite hover:text-ember-orange transition-colors cursor-pointer"
                >
                  Looking to Buy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('sell')}
                  className="text-graphite hover:text-ember-orange transition-colors cursor-pointer"
                >
                  Looking to Sell
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="font-editorial text-[14px] text-slate">Practice</p>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="text-graphite hover:text-ember-orange transition-colors cursor-pointer"
                >
                  About Mortila
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="text-graphite hover:text-ember-orange transition-colors cursor-pointer"
                >
                  Private Advisory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="text-graphite hover:text-ember-orange transition-colors cursor-pointer"
                >
                  Partner Admin
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-editorial text-[14px] text-slate">Direct Channels</p>
            <ul className="space-y-2.5 text-[14px] text-steel">
              <li>
                <a
                  href="mailto:advisory@mortilabrokerage.com"
                  className="link-ember text-graphite"
                >
                  advisory@mortilabrokerage.com
                </a>
              </li>
              <li>X (Twitter): @MortilaBrokerage</li>
              <li>Telegram Desk: @MortilaBrokerage</li>
              <li>LinkedIn: Mortila Domain Advisory</li>
            </ul>
          </div>
        </div>

        {/* Bottom Quiet Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] font-editorial text-slate">
          <p>© {new Date().getFullYear()} Mortila Brokerage. All transactions settled via licensed escrow.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setCookieDialogOpen(true)}
              className="text-slate hover:text-graphite transition-colors cursor-pointer"
            >
              Cookie preferences
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="text-slate hover:text-graphite transition-colors cursor-pointer"
            >
              Escrow compliance
            </button>
          </div>
        </div>
      </div>

      {/* Quiet Cookie Preferences Drawer/Modal */}
      {cookieDialogOpen && (
        <div className="fixed inset-0 z-50 bg-graphite/35 flex items-center justify-center p-6">
          <div className="bg-canvas-white border border-mist max-w-[460px] w-full p-8 asymmetric-card">
            <p className="font-editorial text-[13px] text-brass">Privacy Standard</p>
            <h3 className="font-editorial text-[24px] text-graphite mt-1">
              Cookie preferences
            </h3>
            <p className="text-[14px] text-steel leading-[1.55] mt-3">
              Mortila Brokerage operates without third-party advertising
              trackers. Only strictly necessary session cookies are used for
              authenticated partner administration and secure offer submission.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCookieDialogOpen(false)}
                className="btn-graphite cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
