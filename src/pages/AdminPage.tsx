import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Globe,
  Inbox,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  DOMAIN_CATEGORIES,
  formatShortUsd,
  formatUsd,
  type BrokerageInquiry,
  type DomainAsset,
  type DomainStatus,
  type InquiryStatus,
} from '../types/brokerage';
import { CategoryDistributionCard } from '../components/observatory/EditorialDiagrams';

interface AdminPageProps {
  onPortfolioMutated: () => void;
}

type AdminTab = 'overview' | 'inventory' | 'inquiries';

interface DomainFormState {
  id?: number;
  name: string;
  category: string;
  priceUsd: string;
  minOfferUsd: string;
  pricingModel: string;
  status: DomainStatus;
  featured: boolean;
  registeredYear: string;
  summary: string;
  useCases: string;
  comparableSale: string;
}

const EMPTY_FORM: DomainFormState = {
  name: '',
  category: 'Artificial Intelligence',
  priceUsd: '75000',
  minOfferUsd: '50000',
  pricingModel: 'Buy Now / Make Offer',
  status: 'available',
  featured: false,
  registeredYear: '2016',
  summary: '',
  useCases: '',
  comparableSale: '',
};

const INQUIRY_STATUSES: InquiryStatus[] = [
  'new',
  'reviewing',
  'negotiating',
  'closed',
  'archived',
];

export const AdminPage: React.FC<AdminPageProps> = ({ onPortfolioMutated }) => {
  const { user, loading: authLoading, authError, signInWithGoogle, logout, getIdToken } =
    useAuth();

  const [tab, setTab] = useState<AdminTab>('overview');
  const [domains, setDomains] = useState<DomainAsset[]>([]);
  const [inquiries, setInquiries] = useState<BrokerageInquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<DomainFormState>(EMPTY_FORM);
  const [savingForm, setSavingForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const authedFetch = useCallback(
    async (url: string, init?: RequestInit) => {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication session expired. Please sign in again.');
      const res = await fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(init?.headers ?? {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      return data;
    },
    [getIdToken]
  );

  const fetchAdminData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    setDataError(null);
    try {
      const [domRes, inqRes] = await Promise.all([
        authedFetch('/api/admin/domains'),
        authedFetch('/api/admin/inquiries'),
      ]);
      setDomains(domRes.domains ?? []);
      setInquiries(inqRes.inquiries ?? []);
    } catch (err: unknown) {
      setDataError(
        err instanceof Error ? err.message : 'Unable to load administration console.'
      );
    } finally {
      setLoadingData(false);
    }
  }, [user, authedFetch]);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user, fetchAdminData]);

  const filteredDomains = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return domains;
    return domains.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
    );
  }, [domains, searchQuery]);

  const filteredInquiries = useMemo(() => {
    if (inquiryFilter === 'all') return inquiries;
    return inquiries.filter((i) => i.type === inquiryFilter);
  }, [inquiries, inquiryFilter]);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (d: DomainAsset) => {
    setForm({
      id: d.id,
      name: d.name,
      category: d.category,
      priceUsd: String(d.priceUsd),
      minOfferUsd: String(d.minOfferUsd),
      pricingModel: d.pricingModel,
      status: d.status,
      featured: d.featured,
      registeredYear: String(d.registeredYear),
      summary: d.summary,
      useCases: d.useCases,
      comparableSale: d.comparableSale ?? '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSavingForm(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        priceUsd: Number(form.priceUsd),
        minOfferUsd: Number(form.minOfferUsd),
        pricingModel: form.pricingModel,
        status: form.status,
        featured: form.featured,
        registeredYear: Number(form.registeredYear),
        summary: form.summary.trim(),
        useCases: form.useCases.trim(),
        comparableSale: form.comparableSale.trim(),
      };

      if (form.id) {
        await authedFetch(`/api/admin/domains/${form.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await authedFetch('/api/admin/domains', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      await fetchAdminData();
      onPortfolioMutated();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Unable to save domain.');
    } finally {
      setSavingForm(false);
    }
  };

  const handleToggleFeatured = async (d: DomainAsset) => {
    try {
      await authedFetch(`/api/admin/domains/${d.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ featured: !d.featured }),
      });
      await fetchAdminData();
      onPortfolioMutated();
    } catch (err: unknown) {
      setDataError(err instanceof Error ? err.message : 'Failed to update featured state.');
    }
  };

  const handleDeleteDomain = async (id: number) => {
    try {
      await authedFetch(`/api/admin/domains/${id}`, { method: 'DELETE' });
      setConfirmDeleteId(null);
      await fetchAdminData();
      onPortfolioMutated();
    } catch (err: unknown) {
      setDataError(err instanceof Error ? err.message : 'Failed to delete domain.');
    }
  };

  const handleInquiryStatusChange = async (id: number, status: InquiryStatus) => {
    try {
      await authedFetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (err: unknown) {
      setDataError(err instanceof Error ? err.message : 'Unable to update inquiry status.');
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    try {
      await authedFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      setDataError(err instanceof Error ? err.message : 'Unable to remove inquiry.');
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-24 text-center text-slate text-[15px]">
        Verifying partner credentials...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full bg-canvas-white py-20">
        <div className="max-w-[520px] mx-auto px-6">
          <div className="bg-ash asymmetric-card p-10 sm:p-12 border border-mist">
            <p className="font-editorial text-[13px] text-brass">
              Mortila Partner Desk
            </p>
            <h1 className="heading-lg-editorial text-graphite mt-2">
              Portfolio Administration Console
            </h1>
            <p className="mt-4 text-[15px] text-steel leading-[1.6]">
              Sign in with your verified Google partner account to manage domain
              listings, update pricing guides, and review inbound buyer offers
              and seller representation submissions.
            </p>

            {authError && (
              <div className="mt-5 p-3.5 bg-ivory border border-ember-orange/40 text-[13px] text-graphite">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={signInWithGoogle}
              className="btn-graphite w-full mt-8 cursor-pointer"
            >
              Sign in with Google
            </button>

            <p className="mt-5 text-[12px] text-slate">
              Protected by verified bearer authentication. All inventory changes
              sync directly with the public portfolio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeInventory = domains.filter((d) => d.status === 'available');
  const activeValue = activeInventory.reduce((acc, d) => acc + d.priceUsd, 0);
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const underOfferCount = domains.filter((d) => d.status === 'under_offer').length;

  return (
    <div className="w-full bg-fog min-h-[calc(100vh-72px)]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
        {/* Workspace Sidebar (250px) */}
        <aside className="w-full lg:w-[250px] shrink-0 bg-canvas-white border-b lg:border-b-0 lg:border-r border-mist p-6 flex flex-col justify-between">
          <div>
            <p className="font-editorial text-[13px] text-brass">
              Partner Console
            </p>
            <p className="font-editorial text-[20px] text-graphite mt-0.5 truncate">
              {user.displayName || user.email?.split('@')[0]}
            </p>
            <p className="text-[12px] text-slate truncate">{user.email}</p>

            <nav className="mt-7 space-y-1">
              {(
                [
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  {
                    id: 'inventory',
                    label: `Inventory (${domains.length})`,
                    icon: Globe,
                  },
                  {
                    id: 'inquiries',
                    label: `Inquiries (${inquiries.length})`,
                    icon: Inbox,
                  },
                ] as { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[]
              ).map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[14px] transition-colors cursor-pointer ${
                      active
                        ? 'bg-graphite text-canvas-white'
                        : 'text-steel hover:bg-ash hover:text-graphite'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 mt-6 border-t border-mist">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-steel hover:text-graphite transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Canvas */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-x-hidden">
          {/* Contextual Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-mist pb-6">
            <div>
              <p className="text-[12px] text-slate">
                Mortila Brokerage / Admin /{' '}
                <span className="text-graphite capitalize">{tab}</span>
              </p>
              <h1 className="heading-editorial text-graphite mt-1">
                {tab === 'overview'
                  ? 'Portfolio Telemetry & Deal Flow'
                  : tab === 'inventory'
                  ? 'Domain Inventory Ledger'
                  : 'Inbound Offers & Mandates'}
              </h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={fetchAdminData}
                disabled={loadingData}
                className="btn-ghost-graphite inline-flex items-center gap-2 text-[14px] py-2.5 px-4 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`}
                  strokeWidth={1.5}
                />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="btn-graphite inline-flex items-center gap-2 text-[14px] py-2.5 px-4 cursor-pointer"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                <span>Add Domain</span>
              </button>
            </div>
          </div>

          {dataError && (
            <div className="p-4 bg-ivory border border-ember-orange/40 text-[14px] text-graphite flex items-center justify-between">
              <span>{dataError}</span>
              <button
                type="button"
                onClick={() => setDataError(null)}
                className="text-slate hover:text-graphite cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <div className="bg-canvas-white border border-mist p-6 asymmetric-card">
                  <p className="text-[12px] text-slate">Active Inventory Value</p>
                  <p className="font-mono text-[28px] text-graphite tabular-nums mt-1.5">
                    {formatShortUsd(activeValue)}
                  </p>
                  <p className="text-[12px] text-brass mt-1">
                    {activeInventory.length} available assets
                  </p>
                </div>
                <div className="bg-canvas-white border border-mist p-6 asymmetric-card">
                  <p className="text-[12px] text-slate">Total Catalogued</p>
                  <p className="font-mono text-[28px] text-graphite tabular-nums mt-1.5">
                    {domains.length}
                  </p>
                  <p className="text-[12px] text-steel mt-1">
                    {underOfferCount} currently under offer
                  </p>
                </div>
                <div className="bg-canvas-white border border-mist p-6 asymmetric-card">
                  <p className="text-[12px] text-slate">Unreviewed Inquiries</p>
                  <p className="font-mono text-[28px] text-ember-orange tabular-nums mt-1.5">
                    {newInquiriesCount}
                  </p>
                  <p className="text-[12px] text-steel mt-1">
                    {inquiries.length} total logged leads
                  </p>
                </div>
                <div className="bg-canvas-white border border-mist p-6 asymmetric-card">
                  <p className="text-[12px] text-slate">Pipeline Bid Volume</p>
                  <p className="font-mono text-[28px] text-graphite tabular-nums mt-1.5">
                    {formatShortUsd(
                      inquiries.reduce(
                        (sum, item) => sum + (item.budgetOrOfferUsd ?? 0),
                        0
                      )
                    )}
                  </p>
                  <p className="text-[12px] text-steel mt-1">
                    Combined declared budgets
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5">
                  <CategoryDistributionCard domains={domains} />
                </div>

                <div className="lg:col-span-7 bg-canvas-white border border-mist p-7 asymmetric-card">
                  <div className="flex items-baseline justify-between mb-5">
                    <h2 className="font-editorial text-[20px] text-graphite">
                      Recent Inbound Activity
                    </h2>
                    <button
                      type="button"
                      onClick={() => setTab('inquiries')}
                      className="link-ember text-[13px] text-graphite cursor-pointer"
                    >
                      Manage pipeline
                    </button>
                  </div>
                  {inquiries.length === 0 ? (
                    <p className="text-[14px] text-slate py-8">
                      No inbound inquiries recorded yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-mist">
                      {inquiries.slice(0, 5).map((inq) => (
                        <div
                          key={inq.id}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <p className="text-[14px] text-graphite">
                              {inq.clientName}{' '}
                              <span className="text-slate">
                                · {formatInquiryType(inq.type)}
                              </span>
                            </p>
                            <p className="text-[12px] text-steel mt-0.5">
                              {inq.domainName || 'Advisory'} · {inq.clientEmail}
                            </p>
                          </div>
                          <div className="text-right">
                            {inq.budgetOrOfferUsd ? (
                              <p className="font-mono text-[13px] text-graphite tabular-nums">
                                {formatUsd(inq.budgetOrOfferUsd)}
                              </p>
                            ) : null}
                            <p className="font-mono text-[11px] text-ember-orange capitalize">
                              {inq.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY CRUD */}
          {tab === 'inventory' && (
            <div className="space-y-5">
              <div className="relative max-w-[440px]">
                <Search
                  className="w-4 h-4 text-slate absolute left-3.5 top-1/2 -translate-y-1/2"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter inventory by domain, category, or status..."
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas-white border border-mist text-[14px] text-graphite focus:border-graphite"
                />
              </div>

              <div className="overflow-x-auto bg-canvas-white border border-mist">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-fog border-b border-mist text-[12px] text-slate">
                      <th className="py-3.5 px-5 font-normal">Domain</th>
                      <th className="py-3.5 px-4 font-normal">Category</th>
                      <th className="py-3.5 px-4 font-normal">Status</th>
                      <th className="py-3.5 px-4 font-normal text-right">
                        Guide Price
                      </th>
                      <th className="py-3.5 px-4 font-normal text-right">
                        Min Offer
                      </th>
                      <th className="py-3.5 px-4 font-normal text-center">
                        Featured
                      </th>
                      <th className="py-3.5 px-5 font-normal text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mist text-[14px]">
                    {filteredDomains.map((d) => (
                      <tr key={d.id} className="hover:bg-fog/60">
                        <td className="py-3.5 px-5">
                          <p className="font-editorial text-[17px] text-graphite">
                            {d.name}
                          </p>
                          <p className="text-[11px] font-mono text-slate">
                            {d.length}L · Est. {d.registeredYear} · {d.pricingModel}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-steel">{d.category}</td>
                        <td className="py-3.5 px-4 font-mono text-[12px] capitalize">
                          <span
                            className={
                              d.status === 'available'
                                ? 'text-brass'
                                : d.status === 'under_offer'
                                ? 'text-ember-orange'
                                : 'text-slate'
                            }
                          >
                            {d.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-graphite">
                          {formatUsd(d.priceUsd)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-steel">
                          {formatUsd(d.minOfferUsd)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(d)}
                            aria-label={`Toggle featured for ${d.name}`}
                            className="p-1.5 cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                d.featured
                                  ? 'fill-ember-orange text-ember-orange'
                                  : 'text-slate hover:text-graphite'
                              }`}
                              strokeWidth={1.5}
                            />
                          </button>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          {confirmDeleteId === d.id ? (
                            <div className="inline-flex items-center gap-2 text-[12px]">
                              <button
                                type="button"
                                onClick={() => handleDeleteDomain(d.id)}
                                className="text-ember-orange font-medium cursor-pointer"
                              >
                                Confirm delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-slate hover:text-graphite cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(d)}
                                aria-label={`Edit ${d.name}`}
                                className="p-1.5 text-steel hover:text-graphite cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(d.id)}
                                aria-label={`Delete ${d.name}`}
                                className="p-1.5 text-slate hover:text-ember-orange cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INQUIRIES & OFFERS */}
          {tab === 'inquiries' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Inquiries' },
                  { id: 'domain_offer', label: 'Domain Offers' },
                  { id: 'buyer_mandate', label: 'Buyer Mandates' },
                  { id: 'seller_listing', label: 'Seller Listings' },
                  { id: 'general_advisory', label: 'General Advisory' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setInquiryFilter(f.id)}
                    className={`px-3.5 py-1.5 text-[13px] transition-colors cursor-pointer ${
                      inquiryFilter === f.id
                        ? 'bg-graphite text-canvas-white'
                        : 'bg-canvas-white border border-mist text-steel hover:text-graphite'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="bg-canvas-white border border-mist p-12 text-center">
                  <p className="font-editorial text-[20px] text-graphite">
                    No matching inquiries
                  </p>
                  <p className="text-[14px] text-slate mt-1">
                    Submissions from the portfolio dossier, buyer mandate, seller
                    listing, and contact pages will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-canvas-white border border-mist p-6 asymmetric-card space-y-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate">
                            <span className="font-mono text-brass">
                              {formatInquiryType(inq.type)}
                            </span>
                            <span>·</span>
                            <span>
                              {new Date(inq.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {inq.domainName && (
                              <>
                                <span>·</span>
                                <span className="text-graphite font-mono">
                                  {inq.domainName}
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="font-editorial text-[20px] text-graphite mt-1">
                            {inq.clientName}{' '}
                            {inq.company ? (
                              <span className="text-steel text-[15px]">
                                — {inq.company}
                              </span>
                            ) : null}
                          </h3>
                          <p className="text-[13px] text-slate">{inq.clientEmail}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {inq.budgetOrOfferUsd ? (
                            <div className="text-right mr-2">
                              <p className="text-[11px] text-slate">
                                Offer / Budget
                              </p>
                              <p className="font-mono text-[16px] text-graphite tabular-nums">
                                {formatUsd(inq.budgetOrOfferUsd)}
                              </p>
                            </div>
                          ) : null}

                          <select
                            aria-label="Update inquiry status"
                            value={inq.status}
                            onChange={(e) =>
                              handleInquiryStatusChange(
                                inq.id,
                                e.target.value as InquiryStatus
                              )
                            }
                            className="px-3 py-2 bg-fog border border-mist text-[13px] text-graphite capitalize cursor-pointer"
                          >
                            {INQUIRY_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id)}
                            aria-label="Delete inquiry"
                            className="p-2 text-slate hover:text-ember-orange cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>

                      <p className="text-[14px] text-steel leading-[1.6] pt-3 border-t border-mist">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Domain Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-graphite/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-canvas-white border border-mist w-full max-w-[640px] p-8 asymmetric-card my-8">
            <div className="flex items-center justify-between border-b border-mist pb-4 mb-6">
              <div>
                <p className="font-editorial text-[13px] text-brass">
                  Inventory Manager
                </p>
                <h2 className="font-editorial text-[26px] text-graphite">
                  {form.id ? `Edit ${form.name}` : 'Add Domain to Portfolio'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate hover:text-graphite cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-ivory border border-ember-orange/40 text-[13px] text-graphite">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveDomain} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Domain Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="example.com"
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px] text-graphite focus:border-graphite"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px] text-graphite"
                  >
                    {DOMAIN_CATEGORIES.filter((c) => c !== 'All Categories').map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Guide Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={form.priceUsd}
                    onChange={(e) =>
                      setForm({ ...form, priceUsd: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist font-mono text-[14px] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Min Offer (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={250}
                    value={form.minOfferUsd}
                    onChange={(e) =>
                      setForm({ ...form, minOfferUsd: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist font-mono text-[14px] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Registered Year
                  </label>
                  <input
                    type="number"
                    min={1985}
                    max={2026}
                    value={form.registeredYear}
                    onChange={(e) =>
                      setForm({ ...form, registeredYear: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist font-mono text-[14px] tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={form.pricingModel}
                    onChange={(e) =>
                      setForm({ ...form, pricingModel: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px]"
                  >
                    <option value="Buy Now / Make Offer">
                      Buy Now / Make Offer
                    </option>
                    <option value="Buy Now">Buy Now</option>
                    <option value="Make Offer">Make Offer</option>
                    <option value="Lease-to-Own">Lease-to-Own</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as DomainStatus,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px]"
                  >
                    <option value="available">Available</option>
                    <option value="under_offer">Under Offer</option>
                    <option value="sold">Sold (Archive)</option>
                    <option value="private">Private (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] text-steel mb-1">
                  Editorial Positioning Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Concise brand narrative describing linguistic authority and strategic fit..."
                  className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Target Use Cases (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.useCases}
                    onChange={(e) =>
                      setForm({ ...form, useCases: e.target.value })
                    }
                    placeholder="Enterprise AI, Venture Fund, SaaS"
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-steel mb-1">
                    Comparable Sale Benchmark
                  </label>
                  <input
                    type="text"
                    value={form.comparableSale}
                    onChange={(e) =>
                      setForm({ ...form, comparableSale: e.target.value })
                    }
                    placeholder="e.g. Clarify.com — $185,000"
                    className="w-full px-3.5 py-2.5 bg-fog border border-mist text-[14px]"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2.5 text-[14px] text-graphite cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-graphite"
                />
                <span>Feature asset on homepage portfolio showcase</span>
              </label>

              <div className="pt-4 border-t border-mist flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-ghost-graphite cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingForm}
                  className="btn-graphite cursor-pointer disabled:opacity-60"
                >
                  {savingForm
                    ? 'Saving...'
                    : form.id
                    ? 'Save Changes'
                    : 'Publish Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function formatInquiryType(type: BrokerageInquiry['type']): string {
  switch (type) {
    case 'domain_offer':
      return 'Domain Offer';
    case 'buyer_mandate':
      return 'Buyer Mandate';
    case 'seller_listing':
      return 'Seller Listing';
    default:
      return 'Advisory';
  }
}
