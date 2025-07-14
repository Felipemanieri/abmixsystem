import { 
  users, vendors, proposals, proposalAttachments, proposalPeople,
  type User, type InsertUser, type Vendor, type InsertVendor, 
  type Proposal, type InsertProposal, type ProposalAttachment, 
  type InsertProposalAttachment, type ProposalPerson, type InsertProposalPerson 
} from "@shared/schema";
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
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  getProposalByLink(clientLink: string): Promise<Proposal | undefined>;
  getProposalById(id: string): Promise<Proposal | undefined>;
  updateProposal(id: string, proposal: Partial<InsertProposal>): Promise<Proposal>;
  getProposalsByVendor(vendorId: number): Promise<Proposal[]>;
  
  // Proposal people operations
  addProposalPerson(person: InsertProposalPerson): Promise<ProposalPerson>;
  getProposalPeople(proposalId: string): Promise<ProposalPerson[]>;
  updateProposalPerson(id: string, person: Partial<InsertProposalPerson>): Promise<ProposalPerson>;
  deleteProposalPerson(id: string): Promise<void>;
  
  // Proposal attachments operations
  addProposalAttachment(attachment: InsertProposalAttachment): Promise<ProposalAttachment>;
  getProposalAttachments(proposalId: string): Promise<ProposalAttachment[]>;
  deleteProposalAttachment(id: string): Promise<void>;
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
  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    // Generate unique ID and client link
    const count = await db.select().from(proposals);
    const nextId = `ABM${String(count.length + 1).padStart(3, '0')}`;
    const clientLink = crypto.randomUUID();
    
    const [proposal] = await db
      .insert(proposals)
      .values({
        id: nextId,
        clientLink,
        ...insertProposal,
      })
      .returning();
    return proposal;
  }

  async getProposalByLink(clientLink: string): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.clientLink, clientLink));
    return proposal;
  }

  async getProposalById(id: string): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }

  async updateProposal(id: string, proposalData: Partial<InsertProposal>): Promise<Proposal> {
    const [proposal] = await db
      .update(proposals)
      .set({ ...proposalData, updatedAt: new Date() })
      .where(eq(proposals.id, id))
      .returning();
    return proposal;
  }

  async getProposalsByVendor(vendorId: number): Promise<Proposal[]> {
    return await db.select().from(proposals).where(eq(proposals.vendorId, vendorId));
  }

  // Proposal people operations
  async addProposalPerson(insertPerson: InsertProposalPerson): Promise<ProposalPerson> {
    const id = crypto.randomUUID();
    const [person] = await db
      .insert(proposalPeople)
      .values({ id, ...insertPerson })
      .returning();
    return person;
  }

  async getProposalPeople(proposalId: string): Promise<ProposalPerson[]> {
    return await db.select().from(proposalPeople).where(eq(proposalPeople.proposalId, proposalId));
  }

  async updateProposalPerson(id: string, personData: Partial<InsertProposalPerson>): Promise<ProposalPerson> {
    const [person] = await db
      .update(proposalPeople)
      .set(personData)
      .where(eq(proposalPeople.id, id))
      .returning();
    return person;
  }

  async deleteProposalPerson(id: string): Promise<void> {
    await db.delete(proposalPeople).where(eq(proposalPeople.id, id));
  }

  // Proposal attachments operations
  async addProposalAttachment(insertAttachment: InsertProposalAttachment): Promise<ProposalAttachment> {
    const id = crypto.randomUUID();
    const [attachment] = await db
      .insert(proposalAttachments)
      .values({ id, ...insertAttachment })
      .returning();
    return attachment;
  }

  async getProposalAttachments(proposalId: string): Promise<ProposalAttachment[]> {
    return await db.select().from(proposalAttachments).where(eq(proposalAttachments.proposalId, proposalId));
  }

  async deleteProposalAttachment(id: string): Promise<void> {
    await db.delete(proposalAttachments).where(eq(proposalAttachments.id, id));
  }
}

export const storage = new DatabaseStorage();
