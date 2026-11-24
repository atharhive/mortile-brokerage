import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  createDomain,
  createInquiry,
  deleteDomain,
  deleteInquiry,
  getDomainById,
  listDomains,
  listInquiries,
  updateDomain,
  updateInquiryStatus,
} from './src/db/queries.ts';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_DOMAIN_STATUSES = new Set([
  'available',
  'under_offer',
  'sold',
  'private',
]);
const ALLOWED_INQUIRY_TYPES = new Set([
  'domain_offer',
  'buyer_mandate',
  'seller_listing',
  'general_advisory',
]);
const ALLOWED_INQUIRY_STATUSES = new Set([
  'new',
  'reviewing',
  'negotiating',
  'closed',
  'archived',
]);

function parseDomainParts(rawName: string): {
  name: string;
  sld: string;
  tld: string;
  length: number;
} {
  const cleaned = rawName.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const dotIdx = cleaned.indexOf('.');
  if (dotIdx <= 0 || dotIdx === cleaned.length - 1) {
    throw new Error('Invalid domain format. Expected format like example.com');
  }
  const sld = cleaned.slice(0, dotIdx);
  const tld = cleaned.slice(dotIdx);
  return {
    name: cleaned,
    sld,
    tld,
    length: sld.length,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Public API: list visible portfolio domains
  app.get('/api/domains', async (_req, res) => {
    try {
      const items = await listDomains(false);
      res.json({ domains: items });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load domains';
      res.status(500).json({ error: message });
    }
  });

  // Public API: single domain detail
  app.get('/api/domains/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid domain identifier.' });
    }
    try {
      const item = await getDomainById(id);
      if (!item || item.status === 'private') {
        return res.status(404).json({ error: 'Domain asset not found.' });
      }
      res.json({ domain: item });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load domain';
      res.status(500).json({ error: message });
    }
  });

  // Public API: submit domain offer, buyer mandate, seller listing, or advisory inquiry
  app.post('/api/inquiries', async (req, res) => {
    try {
      const {
        type,
        domainId,
        domainName,
        clientName,
        clientEmail,
        company,
        budgetOrOfferUsd,
        message,
      } = req.body ?? {};

      const safeType =
        typeof type === 'string' && ALLOWED_INQUIRY_TYPES.has(type)
          ? type
          : 'general_advisory';

      if (typeof clientName !== 'string' || clientName.trim().length < 2) {
        return res.status(400).json({ error: 'Please provide your full name.' });
      }
      if (typeof clientEmail !== 'string' || !EMAIL_RE.test(clientEmail.trim())) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }
      if (typeof message !== 'string' || message.trim().length < 8) {
        return res
          .status(400)
          .json({ error: 'Please include brief details regarding your request.' });
      }

      const parsedDomainId =
        domainId !== undefined && domainId !== null && domainId !== ''
          ? Number(domainId)
          : null;
      const parsedBudget =
        budgetOrOfferUsd !== undefined &&
        budgetOrOfferUsd !== null &&
        budgetOrOfferUsd !== ''
          ? Math.max(0, Math.round(Number(budgetOrOfferUsd)))
          : null;

      const created = await createInquiry({
        type: safeType,
        domainId:
          parsedDomainId && Number.isInteger(parsedDomainId) ? parsedDomainId : null,
        domainName:
          typeof domainName === 'string' && domainName.trim()
            ? domainName.trim().slice(0, 140)
            : null,
        clientName: clientName.trim().slice(0, 120),
        clientEmail: clientEmail.trim().slice(0, 160),
        company:
          typeof company === 'string' && company.trim()
            ? company.trim().slice(0, 120)
            : null,
        budgetOrOfferUsd: Number.isFinite(parsedBudget) ? parsedBudget : null,
        message: message.trim().slice(0, 2000),
        status: 'new',
      });

      res.status(201).json({ inquiry: created });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unable to submit inquiry.';
      res.status(500).json({ error: msg });
    }
  });

  // Protected Admin API: current authenticated brokerage partner
  app.get('/api/admin/me', requireAuth, (req: AuthRequest, res) => {
    res.json({
      user: {
        uid: req.user?.uid,
        email: req.user?.email,
        name: req.user?.name ?? req.user?.email?.split('@')[0] ?? 'Partner',
      },
    });
  });

  // Protected Admin API: list all domains including private & sold
  app.get('/api/admin/domains', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const items = await listDomains(true);
      res.json({ domains: items });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load inventory';
      res.status(500).json({ error: message });
    }
  });

  // Protected Admin API: create a domain asset
  app.post('/api/admin/domains', requireAuth, async (req: AuthRequest, res) => {
    try {
      const body = req.body ?? {};
      if (typeof body.name !== 'string' || !body.name.includes('.')) {
        return res
          .status(400)
          .json({ error: 'A valid domain name (e.g. mortila.com) is required.' });
      }

      const parts = parseDomainParts(body.name);
      const priceUsd = Math.max(500, Math.round(Number(body.priceUsd) || 0));
      const minOfferUsd = Math.max(
        250,
        Math.round(Number(body.minOfferUsd) || Math.round(priceUsd * 0.6))
      );
      const status =
        typeof body.status === 'string' && ALLOWED_DOMAIN_STATUSES.has(body.status)
          ? body.status
          : 'available';
      const registeredYear = Number(body.registeredYear) || 2016;
      const ageYears = Math.max(1, new Date().getFullYear() - registeredYear);

      const created = await createDomain({
        name: parts.name,
        sld: parts.sld,
        tld: parts.tld,
        length: parts.length,
        category:
          typeof body.category === 'string' && body.category.trim()
            ? body.category.trim()
            : 'Enterprise SaaS',
        priceUsd,
        minOfferUsd,
        pricingModel:
          typeof body.pricingModel === 'string' && body.pricingModel.trim()
            ? body.pricingModel.trim()
            : 'Buy Now / Make Offer',
        status,
        featured: Boolean(body.featured),
        registeredYear,
        ageYears,
        summary:
          typeof body.summary === 'string' && body.summary.trim()
            ? body.summary.trim()
            : 'Category-defining digital asset vetted for institutional brand deployment and global trademark clarity.',
        useCases:
          typeof body.useCases === 'string' && body.useCases.trim()
            ? body.useCases.trim()
            : 'Enterprise Software, Institutional Finance, Brand Rebrand',
        comparableSale:
          typeof body.comparableSale === 'string' && body.comparableSale.trim()
            ? body.comparableSale.trim()
            : null,
        monthlyInquiries: Math.max(0, Math.round(Number(body.monthlyInquiries) || 3)),
      });

      res.status(201).json({ domain: created });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to add domain';
      res.status(400).json({ error: message });
    }
  });

  // Protected Admin API: update a domain asset
  app.patch('/api/admin/domains/:id', requireAuth, async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid domain identifier.' });
    }
    try {
      const body = req.body ?? {};
      const patch: Record<string, unknown> = {};

      if (typeof body.name === 'string' && body.name.includes('.')) {
        const parts = parseDomainParts(body.name);
        patch.name = parts.name;
        patch.sld = parts.sld;
        patch.tld = parts.tld;
        patch.length = parts.length;
      }
      if (typeof body.category === 'string' && body.category.trim()) {
        patch.category = body.category.trim();
      }
      if (body.priceUsd !== undefined) {
        patch.priceUsd = Math.max(500, Math.round(Number(body.priceUsd) || 0));
      }
      if (body.minOfferUsd !== undefined) {
        patch.minOfferUsd = Math.max(250, Math.round(Number(body.minOfferUsd) || 0));
      }
      if (typeof body.pricingModel === 'string' && body.pricingModel.trim()) {
        patch.pricingModel = body.pricingModel.trim();
      }
      if (typeof body.status === 'string' && ALLOWED_DOMAIN_STATUSES.has(body.status)) {
        patch.status = body.status;
      }
      if (typeof body.featured === 'boolean') {
        patch.featured = body.featured;
      }
      if (body.registeredYear !== undefined) {
        const yr = Math.max(1985, Math.min(2026, Math.round(Number(body.registeredYear))));
        patch.registeredYear = yr;
        patch.ageYears = Math.max(1, new Date().getFullYear() - yr);
      }
      if (typeof body.summary === 'string') {
        patch.summary = body.summary.trim();
      }
      if (typeof body.useCases === 'string') {
        patch.useCases = body.useCases.trim();
      }
      if (typeof body.comparableSale === 'string') {
        patch.comparableSale = body.comparableSale.trim() || null;
      }
      if (body.monthlyInquiries !== undefined) {
        patch.monthlyInquiries = Math.max(0, Math.round(Number(body.monthlyInquiries) || 0));
      }

      const updated = await updateDomain(id, patch);
      if (!updated) {
        return res.status(404).json({ error: 'Domain asset not found.' });
      }
      res.json({ domain: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to update domain';
      res.status(400).json({ error: message });
    }
  });

  // Protected Admin API: delete a domain asset
  app.delete('/api/admin/domains/:id', requireAuth, async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid domain identifier.' });
    }
    try {
      const removed = await deleteDomain(id);
      if (!removed) {
        return res.status(404).json({ error: 'Domain asset not found.' });
      }
      res.json({ deleted: true, id });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to delete domain';
      res.status(500).json({ error: message });
    }
  });

  // Protected Admin API: list inquiries
  app.get('/api/admin/inquiries', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const rows = await listInquiries();
      res.json({ inquiries: rows });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to fetch inquiries';
      res.status(500).json({ error: message });
    }
  });

  // Protected Admin API: update inquiry status
  app.patch('/api/admin/inquiries/:id', requireAuth, async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    const status = req.body?.status;
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid inquiry identifier.' });
    }
    if (typeof status !== 'string' || !ALLOWED_INQUIRY_STATUSES.has(status)) {
      return res.status(400).json({ error: 'Invalid workflow status.' });
    }
    try {
      const updated = await updateInquiryStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Inquiry not found.' });
      }
      res.json({ inquiry: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to update inquiry';
      res.status(500).json({ error: message });
    }
  });

  // Protected Admin API: delete inquiry
  app.delete('/api/admin/inquiries/:id', requireAuth, async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid inquiry identifier.' });
    }
    try {
      const removed = await deleteInquiry(id);
      if (!removed) {
        return res.status(404).json({ error: 'Inquiry not found.' });
      }
      res.json({ deleted: true, id });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to delete inquiry';
      res.status(500).json({ error: message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mortila Brokerage server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
