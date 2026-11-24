import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import {
  domains,
  inquiries,
  users,
  type DomainRecord,
  type InquiryRecord,
  type NewDomainRecord,
  type NewInquiryRecord,
} from './schema.ts';

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName ?? null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName ?? null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed (getOrCreateUser):', error);
    throw new Error('Unable to synchronize user profile.', { cause: error });
  }
}

export async function listDomains(includePrivate = false): Promise<DomainRecord[]> {
  try {
    const rows = await db
      .select()
      .from(domains)
      .orderBy(desc(domains.featured), desc(domains.priceUsd));

    if (includePrivate) {
      return rows;
    }
    return rows.filter((d) => d.status !== 'private');
  } catch (error) {
    console.error('Database query failed (listDomains):', error);
    throw new Error('Unable to retrieve portfolio inventory.', { cause: error });
  }
}

export async function getDomainById(id: number): Promise<DomainRecord | null> {
  try {
    const rows = await db
      .select()
      .from(domains)
      .where(eq(domains.id, id))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error('Database query failed (getDomainById):', error);
    throw new Error('Unable to retrieve domain record.', { cause: error });
  }
}

export async function createDomain(payload: NewDomainRecord): Promise<DomainRecord> {
  try {
    const rows = await db
      .insert(domains)
      .values({
        ...payload,
        updatedAt: new Date(),
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Database query failed (createDomain):', error);
    throw new Error('Unable to create domain listing.', { cause: error });
  }
}

export async function updateDomain(
  id: number,
  payload: Partial<NewDomainRecord>
): Promise<DomainRecord | null> {
  try {
    const rows = await db
      .update(domains)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(domains.id, id))
      .returning();
    return rows[0] ?? null;
  } catch (error) {
    console.error('Database query failed (updateDomain):', error);
    throw new Error('Unable to update domain listing.', { cause: error });
  }
}

export async function deleteDomain(id: number): Promise<boolean> {
  try {
    const rows = await db
      .delete(domains)
      .where(eq(domains.id, id))
      .returning({ id: domains.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Database query failed (deleteDomain):', error);
    throw new Error('Unable to remove domain listing.', { cause: error });
  }
}

export async function listInquiries(): Promise<InquiryRecord[]> {
  try {
    return await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));
  } catch (error) {
    console.error('Database query failed (listInquiries):', error);
    throw new Error('Unable to retrieve brokerage inquiries.', { cause: error });
  }
}

export async function createInquiry(
  payload: NewInquiryRecord
): Promise<InquiryRecord> {
  try {
    const rows = await db.insert(inquiries).values(payload).returning();
    return rows[0];
  } catch (error) {
    console.error('Database query failed (createInquiry):', error);
    throw new Error('Unable to submit inquiry.', { cause: error });
  }
}

export async function updateInquiryStatus(
  id: number,
  status: string
): Promise<InquiryRecord | null> {
  try {
    const rows = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return rows[0] ?? null;
  } catch (error) {
    console.error('Database query failed (updateInquiryStatus):', error);
    throw new Error('Unable to update inquiry status.', { cause: error });
  }
}

export async function deleteInquiry(id: number): Promise<boolean> {
  try {
    const rows = await db
      .delete(inquiries)
      .where(eq(inquiries.id, id))
      .returning({ id: inquiries.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Database query failed (deleteInquiry):', error);
    throw new Error('Unable to delete inquiry.', { cause: error });
  }
}
