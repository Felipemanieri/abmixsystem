import { users, vendors, proposals, type User, type InsertUser, type Vendor, type InsertVendor, type Proposal, type InsertProposal } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vendor operations
  getVendor(id: number): Promise<Vendor | undefined>;
  getVendorByEmail(email: string): Promise<Vendor | undefined>;
  getAllVendors(): Promise<Vendor[]>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor>;
  deleteVendor(id: number): Promise<void>;
  
  // Proposal operations
  createProposal(proposal: any): Promise<any>;
  getProposal(id: string): Promise<any>;
  getProposalByToken(token: string): Promise<any>;
  updateProposal(id: string, proposal: any): Promise<any>;
  getVendorProposals(vendorId: number): Promise<any[]>;
  getAllProposals(): Promise<any[]>;
  getProposalCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Vendor operations
  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async getVendorByEmail(email: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.email, email));
    return vendor || undefined;
  }

  async getAllVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors).where(eq(vendors.active, true));
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const [vendor] = await db
      .insert(vendors)
      .values(insertVendor)
      .returning();
    return vendor;
  }

  async updateVendor(id: number, vendorData: Partial<InsertVendor>): Promise<Vendor> {
    const [vendor] = await db
      .update(vendors)
      .set(vendorData)
      .where(eq(vendors.id, id))
      .returning();
    return vendor;
  }

  async deleteVendor(id: number): Promise<void> {
    await db
      .update(vendors)
      .set({ active: false })
      .where(eq(vendors.id, id));
  }

  // Proposal operations
  async createProposal(proposalData: any): Promise<any> {
    const [proposal] = await db
      .insert(proposals)
      .values(proposalData)
      .returning();
    return proposal;
  }

  async getProposal(id: string): Promise<any> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal || undefined;
  }

  async getProposalByToken(token: string): Promise<any> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.clientToken, token));
    return proposal || undefined;
  }

  async updateProposal(id: string, proposalData: any): Promise<any> {
    const [proposal] = await db
      .update(proposals)
      .set({ ...proposalData, updatedAt: new Date() })
      .where(eq(proposals.id, id))
      .returning();
    return proposal;
  }

  async getVendorProposals(vendorId: number): Promise<any[]> {
    return await db.select().from(proposals).where(eq(proposals.vendorId, vendorId));
  }

  async getAllProposals(): Promise<any[]> {
    return await db.select().from(proposals);
  }

  async getProposalCount(): Promise<number> {
    const result = await db.select().from(proposals);
    return result.length;
  }
}

export const storage = new DatabaseStorage();
