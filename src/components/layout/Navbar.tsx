import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import type { AppRoute } from '../../types/brokerage';
import { BrandWordmark } from './BrandWordmark';
import { EditorialButton } from '../ui/EditorialButton';

interface NavbarProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeRoute, onNavigate }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

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
    <header className="sticky top-0 z-40 bg-canvas-white/92 backdrop-blur-md border-b border-graphite/8">
      <div className="editorial-container h-[78px] flex items-center justify-between gap-8">
        {/* Zone 1: Ventriloc-inspired architectural brand logotype */}
        <BrandWordmark onClick={() => handleGo('home')} />

        {/* Zone 2: Tactile Floating Ash Pill Container (200px radius) */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1.5 surface-paper-ash border border-graphite/8 rounded-[200px] px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
        >
          {(
            [
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'services', label: 'Services' },
            ] as { id: AppRoute; label: string }[]
          ).map((item) => {
            const active = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleGo(item.id)}
                className={`relative px-4 py-1.5 font-editorial text-[15px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active ? 'text-graphite' : 'text-steel hover:text-graphite'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-canvas-white rounded-[200px] border border-graphite/8 shadow-[0_2px_6px_rgba(32,32,32,0.06)] -z-10"
                  />
                )}
                {item.label}
              </button>
            );
          })}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              className={`relative px-4 py-1.5 font-editorial text-[15px] whitespace-nowrap shrink-0 flex items-center gap-1 transition-colors cursor-pointer ${
                isMandateActive
                  ? 'text-graphite'
                  : 'text-steel hover:text-graphite'
              }`}
            >
              {isMandateActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-canvas-white rounded-[200px] border border-graphite/8 shadow-[0_2px_6px_rgba(32,32,32,0.06)] -z-10"
                />
              )}
              <span>Mandates</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-ember-orange' : ''
                }`}
                strokeWidth={1.6}
              />
            </button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-[calc(100%+14px)] w-[250px] tactile-widget asymmetric-card p-2"
              >
                <button
                  type="button"
                  onClick={() => handleGo('buy')}
                  className={`w-full text-left px-3.5 py-3 transition-colors cursor-pointer ${
                    activeRoute === 'buy'
                      ? 'bg-ash text-graphite'
                      : 'hover:bg-fog text-graphite'
                  }`}
                >
                  <p className="font-editorial text-[15px]">Looking to Buy</p>
                  <p className="text-[12px] text-slate mt-0.5">
                    Stealth acquisitions &amp; curated briefs
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleGo('sell')}
                  className={`w-full text-left px-3.5 py-3 mt-1 transition-colors cursor-pointer ${
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
              </motion.div>
            )}
          </div>

          {(
            [
              { id: 'about', label: 'About' },
              { id: 'admin', label: 'Admin' },
            ] as { id: AppRoute; label: string }[]
          ).map((item) => {
            const active = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleGo(item.id)}
                className={`relative px-4 py-1.5 font-editorial text-[15px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'text-graphite'
                    : item.id === 'admin'
                    ? 'text-slate hover:text-graphite'
                    : 'text-steel hover:text-graphite'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-canvas-white rounded-[200px] border border-graphite/8 shadow-[0_2px_6px_rgba(32,32,32,0.06)] -z-10"
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Tactile 0px Graphite CTA Button with Dual-Text Roll */}
        <div className="hidden md:flex items-center shrink-0">
          <EditorialButton
            variant="primary"
            onClick={() => handleGo('contact')}
          >
            Contact us
          </EditorialButton>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          className="md:hidden p-2.5 text-graphite cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Subtle Scroll Progress Ember Hairline */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
        className="h-[1.5px] w-full bg-ember-orange/85"
      />

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
            <EditorialButton
              variant="primary"
              onClick={() => handleGo('contact')}
              className="w-full"
            >
              Contact us
            </EditorialButton>
          </div>
        </div>
      )}
    </header>
  );
};
