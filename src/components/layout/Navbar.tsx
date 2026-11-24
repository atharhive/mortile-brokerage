import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import type { AppRoute } from '../../types/brokerage';

interface NavbarProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeRoute, onNavigate }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleGo = (route: AppRoute) => {
    onNavigate(route);
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const isMandateActive = activeRoute === 'buy' || activeRoute === 'sell';

  return (
    <header className="sticky top-0 z-40 bg-canvas-white/95 backdrop-blur-xs border-b border-mist/70">
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Single-line editorial brand wordmark */}
        <button
          type="button"
          onClick={() => handleGo('home')}
          className="font-editorial text-[20px] text-graphite tracking-[-0.02em] whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span>Mortila Brokerage</span>
        </button>

        {/* Zone 2: Ventriloc floating Ash pill container (200px radius) */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 bg-ash rounded-[200px] px-[22px] py-[10px]"
        >
          <button
            type="button"
            onClick={() => handleGo('portfolio')}
            className={`font-editorial text-[16px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeRoute === 'portfolio'
                ? 'text-ember-orange'
                : 'text-graphite hover:text-ember-orange'
            }`}
          >
            Portfolio
          </button>

          <button
            type="button"
            onClick={() => handleGo('services')}
            className={`font-editorial text-[16px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeRoute === 'services'
                ? 'text-ember-orange'
                : 'text-graphite hover:text-ember-orange'
            }`}
          >
            Services
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              className={`font-editorial text-[16px] whitespace-nowrap shrink-0 flex items-center gap-1 transition-colors cursor-pointer ${
                isMandateActive
                  ? 'text-ember-orange'
                  : 'text-graphite hover:text-ember-orange'
              }`}
            >
              <span>Mandates</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-[calc(100%+16px)] w-[230px] bg-canvas-white border border-mist p-2 asymmetric-card">
                <button
                  type="button"
                  onClick={() => handleGo('buy')}
                  className={`w-full text-left px-3.5 py-2.5 transition-colors cursor-pointer ${
                    activeRoute === 'buy'
                      ? 'bg-ash text-graphite'
                      : 'hover:bg-fog text-graphite'
                  }`}
                >
                  <p className="font-editorial text-[15px]">Looking to Buy</p>
                  <p className="text-[12px] text-slate mt-0.5">
                    Stealth acquisitions &amp; curated mandates
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleGo('sell')}
                  className={`w-full text-left px-3.5 py-2.5 mt-1 transition-colors cursor-pointer ${
                    activeRoute === 'sell'
                      ? 'bg-ash text-graphite'
                      : 'hover:bg-fog text-graphite'
                  }`}
                >
                  <p className="font-editorial text-[15px]">Looking to Sell</p>
                  <p className="text-[12px] text-slate mt-0.5">
                    15% success fee · 90-day exclusive
                  </p>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleGo('about')}
            className={`font-editorial text-[16px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeRoute === 'about'
                ? 'text-ember-orange'
                : 'text-graphite hover:text-ember-orange'
            }`}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => handleGo('admin')}
            className={`font-editorial text-[16px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeRoute === 'admin'
                ? 'text-ember-orange'
                : 'text-slate hover:text-graphite'
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Zone 3: Sharp 0px Graphite CTA button */}
        <div className="hidden md:flex items-center shrink-0">
          <button
            type="button"
            onClick={() => handleGo('contact')}
            className="btn-graphite whitespace-nowrap shrink-0 cursor-pointer"
          >
            Contact us
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          className="md:hidden p-2.5 text-graphite cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-canvas-white border-t border-mist px-6 py-5 space-y-1">
          {(
            [
              { id: 'home', label: 'Home' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'services', label: 'Services' },
              { id: 'buy', label: 'Looking to Buy' },
              { id: 'sell', label: 'Looking to Sell' },
              { id: 'about', label: 'About' },
              { id: 'admin', label: 'Admin Console' },
            ] as { id: AppRoute; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleGo(item.id)}
              className={`block w-full text-left py-2.5 font-editorial text-[17px] cursor-pointer ${
                activeRoute === item.id ? 'text-ember-orange' : 'text-graphite'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3">
            <button
              type="button"
              onClick={() => handleGo('contact')}
              className="btn-graphite w-full text-center cursor-pointer"
            >
              Contact us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
