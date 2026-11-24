import React, { useCallback, useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import type { AppRoute, DomainAsset } from './types/brokerage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DomainDossierDrawer } from './components/portfolio/DomainDossierDrawer';
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import { BuyPage, SellPage } from './pages/MandatePages';
import { AboutPage, ContactPage } from './pages/AboutAndContactPages';
import { AdminPage } from './pages/AdminPage';

const PATH_TO_ROUTE: Record<string, AppRoute> = {
  '/': 'home',
  '/portfolio': 'portfolio',
  '/services': 'services',
  '/buy': 'buy',
  '/sell': 'sell',
  '/about': 'about',
  '/contact': 'contact',
  '/admin': 'admin',
};

const ROUTE_TO_PATH: Record<AppRoute, string> = {
  home: '/',
  portfolio: '/portfolio',
  services: '/services',
  buy: '/buy',
  sell: '/sell',
  about: '/about',
  contact: '/contact',
  admin: '/admin',
};

function getInitialRoute(): AppRoute {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return PATH_TO_ROUTE[path] ?? 'home';
}

function MortilaShell() {
  const [route, setRoute] = useState<AppRoute>(getInitialRoute);
  const [domains, setDomains] = useState<DomainAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<DomainAsset | null>(null);

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/domains');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to load domain inventory.');
      }
      setDomains(data.domains ?? []);
    } catch (err: unknown) {
      setFetchError(
        err instanceof Error ? err.message : 'Unable to load domain inventory.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((nextRoute: AppRoute) => {
    const targetPath = ROUTE_TO_PATH[nextRoute];
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas-white text-graphite">
      <Navbar activeRoute={route} onNavigate={navigate} />

      {fetchError && route !== 'admin' && (
        <div className="bg-ivory border-b border-mist px-6 py-3 text-center text-[13px] text-graphite">
          {fetchError}{' '}
          <button
            type="button"
            onClick={loadPortfolio}
            className="link-ember ml-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex-1">
        {route === 'home' && (
          <HomePage
            domains={domains}
            loading={loading}
            onNavigate={navigate}
            onSelectDomain={setSelectedDomain}
          />
        )}
        {route === 'portfolio' && (
          <PortfolioPage
            domains={domains}
            loading={loading}
            onSelectDomain={setSelectedDomain}
            onNavigate={navigate}
          />
        )}
        {route === 'services' && <ServicesPage onNavigate={navigate} />}
        {route === 'buy' && <BuyPage onNavigate={navigate} />}
        {route === 'sell' && <SellPage onNavigate={navigate} />}
        {route === 'about' && <AboutPage onNavigate={navigate} />}
        {route === 'contact' && <ContactPage />}
        {route === 'admin' && <AdminPage onPortfolioMutated={loadPortfolio} />}
      </div>

      {route !== 'admin' && <Footer onNavigate={navigate} />}

      <DomainDossierDrawer
        domain={selectedDomain}
        onClose={() => setSelectedDomain(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MortilaShell />
    </AuthProvider>
  );
}
