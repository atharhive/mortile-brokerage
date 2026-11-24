import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const domains = pgTable('domains', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  sld: text('sld').notNull(),
  tld: text('tld').notNull(),
  category: text('category').notNull(),
  priceUsd: integer('price_usd').notNull(),
  minOfferUsd: integer('min_offer_usd').notNull(),
  pricingModel: text('pricing_model').notNull().default('Buy Now / Make Offer'),
  status: text('status').notNull().default('available'),
  featured: boolean('featured').notNull().default(false),
  length: integer('length').notNull(),
  ageYears: integer('age_years').notNull().default(8),
  registeredYear: integer('registered_year').notNull().default(2016),
  summary: text('summary').notNull(),
  useCases: text('use_cases').notNull(),
  comparableSale: text('comparable_sale'),
  monthlyInquiries: integer('monthly_inquiries').notNull().default(3),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  domainId: integer('domain_id').references(() => domains.id, {
    onDelete: 'set null',
  }),
  domainName: text('domain_name'),
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email').notNull(),
  company: text('company'),
  budgetOrOfferUsd: integer('budget_or_offer_usd'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const domainsRelations = relations(domains, ({ many }) => ({
  inquiries: many(inquiries),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  domain: one(domains, {
    fields: [inquiries.domainId],
    references: [domains.id],
  }),
}));

export type UserRecord = typeof users.$inferSelect;
export type DomainRecord = typeof domains.$inferSelect;
export type NewDomainRecord = typeof domains.$inferInsert;
export type InquiryRecord = typeof inquiries.$inferSelect;
export type NewInquiryRecord = typeof inquiries.$inferInsert;
