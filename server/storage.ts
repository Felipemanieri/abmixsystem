import { users, vendors, proposals, vendorTargets, teamTargets, awards, systemUsers, attachments, driveConfigs, systemSettings, type User, type InsertUser, type Vendor, type InsertVendor, type Proposal, type InsertProposal, type VendorTarget, type InsertVendorTarget, type TeamTarget, type InsertTeamTarget, type Award, type InsertAward, type SystemUser, type InsertSystemUser, type Attachment, type InsertAttachment, type DriveConfig, type InsertDriveConfig } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

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
  deleteProposal(id: string): Promise<void>;
  getVendorProposals(vendorId: number): Promise<any[]>;
  getAllProposals(): Promise<any[]>;
  getProposalCount(): Promise<number>;
  
  // Vendor Target operations
  createVendorTarget(target: InsertVendorTarget): Promise<VendorTarget>;
  getVendorTarget(vendorId: number, month: number, year: number): Promise<VendorTarget | undefined>;
  getVendorTargets(vendorId: number): Promise<VendorTarget[]>;
  getAllVendorTargets(): Promise<VendorTarget[]>;
  updateVendorTarget(id: number, target: Partial<InsertVendorTarget>): Promise<VendorTarget>;
  deleteVendorTarget(id: number): Promise<void>;
  
  // Team Target operations
  createTeamTarget(target: InsertTeamTarget): Promise<TeamTarget>;
  getTeamTarget(month: number, year: number): Promise<TeamTarget | undefined>;
  getAllTeamTargets(): Promise<TeamTarget[]>;
  updateTeamTarget(id: number, target: Partial<InsertTeamTarget>): Promise<TeamTarget>;
  deleteTeamTarget(id: number): Promise<void>;
  
  // Award operations
  createAward(award: InsertAward): Promise<Award>;
  getVendorAwards(vendorId: number): Promise<Award[]>;
  getAllAwards(): Promise<Award[]>;
  updateAward(id: number, award: Partial<InsertAward>): Promise<Award>;
  deleteAward(id: number): Promise<void>;
  
  // Analytics operations
  getVendorStats(vendorId: number, month?: number, year?: number): Promise<any>;
  getTeamStats(month?: number, year?: number): Promise<any>;
  
  // System Users operations
  getAllSystemUsers(): Promise<SystemUser[]>;
  getSystemUser(id: number): Promise<SystemUser | undefined>;
  getSystemUserByEmail(email: string): Promise<SystemUser | undefined>;
  createSystemUser(user: InsertSystemUser): Promise<SystemUser>;
  updateSystemUser(id: number, user: Partial<InsertSystemUser>): Promise<SystemUser>;
  deleteSystemUser(id: number): Promise<void>;
  updateLastLogin(id: number): Promise<void>;
  
  // Attachment operations
  getAllAttachments(): Promise<Attachment[]>;
  getAttachment(id: number): Promise<Attachment | undefined>;
  getAttachmentsByProposal(proposalId: string): Promise<Attachment[]>;
  createAttachment(attachment: InsertAttachment): Promise<Attachment>;
  updateAttachmentStatus(id: number, status: string, approvedBy?: string): Promise<Attachment>;
  deleteAttachment(id: number): Promise<void>;
  
  // Drive Config operations
  getAllDriveConfigs(): Promise<DriveConfig[]>;
  getDriveConfig(id: number): Promise<DriveConfig | undefined>;
  createDriveConfig(config: InsertDriveConfig): Promise<DriveConfig>;
  updateDriveConfig(id: number, config: Partial<InsertDriveConfig>): Promise<DriveConfig>;
  
  // System Settings operations
  getSystemSetting(key: string): Promise<string | null>;
  setSystemSetting(key: string, value: string): Promise<void>;
  deleteDriveConfig(id: number): Promise<void>;
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

  async deleteProposal(id: string): Promise<void> {
    await db.delete(proposals).where(eq(proposals.id, id));
  }

  async clearAllProposals(): Promise<void> {
    await db.delete(proposals);
  }

  async getVendorProposals(vendorId: number): Promise<any[]> {
    return await db.select().from(proposals)
      .where(eq(proposals.vendorId, vendorId))
      .orderBy(proposals.createdAt); // Manter ordem cronológica de criação
  }

  async getAllProposals(): Promise<any[]> {
    return await db.select().from(proposals)
      .orderBy(proposals.createdAt); // Manter ordem cronológica de criação
  }

  async getProposalCount(): Promise<number> {
    const result = await db.select().from(proposals);
    return result.length;
  }

  // Vendor Target operations
  async createVendorTarget(target: InsertVendorTarget): Promise<VendorTarget> {
    const [vendorTarget] = await db
      .insert(vendorTargets)
      .values(target)
      .returning();
    return vendorTarget;
  }

  async getVendorTarget(vendorId: number, month: number, year: number): Promise<VendorTarget | undefined> {
    const [target] = await db
      .select()
      .from(vendorTargets)
      .where(and(
        eq(vendorTargets.vendorId, vendorId),
        eq(vendorTargets.month, month),
        eq(vendorTargets.year, year)
      ));
    return target || undefined;
  }

  async getVendorTargets(vendorId: number): Promise<VendorTarget[]> {
    return await db
      .select()
      .from(vendorTargets)
      .where(eq(vendorTargets.vendorId, vendorId))
      .orderBy(desc(vendorTargets.year), desc(vendorTargets.month));
  }

  async getAllVendorTargets(): Promise<VendorTarget[]> {
    return await db
      .select()
      .from(vendorTargets)
      .orderBy(desc(vendorTargets.year), desc(vendorTargets.month));
  }

  async updateVendorTarget(id: number, target: Partial<InsertVendorTarget>): Promise<VendorTarget> {
    const [vendorTarget] = await db
      .update(vendorTargets)
      .set({ ...target, updatedAt: new Date() })
      .where(eq(vendorTargets.id, id))
      .returning();
    return vendorTarget;
  }

  async deleteVendorTarget(id: number): Promise<void> {
    await db.delete(vendorTargets).where(eq(vendorTargets.id, id));
  }

  // Team Target operations
  async createTeamTarget(target: InsertTeamTarget): Promise<TeamTarget> {
    const [teamTarget] = await db
      .insert(teamTargets)
      .values(target)
      .returning();
    return teamTarget;
  }

  async getTeamTarget(month: number, year: number): Promise<TeamTarget | undefined> {
    const [target] = await db
      .select()
      .from(teamTargets)
      .where(and(
        eq(teamTargets.month, month),
        eq(teamTargets.year, year)
      ));
    return target || undefined;
  }

  async getAllTeamTargets(): Promise<TeamTarget[]> {
    return await db
      .select()
      .from(teamTargets)
      .orderBy(desc(teamTargets.year), desc(teamTargets.month));
  }

  async updateTeamTarget(id: number, target: Partial<InsertTeamTarget>): Promise<TeamTarget> {
    const [teamTarget] = await db
      .update(teamTargets)
      .set({ ...target, updatedAt: new Date() })
      .where(eq(teamTargets.id, id))
      .returning();
    return teamTarget;
  }

  async deleteTeamTarget(id: number): Promise<void> {
    await db.delete(teamTargets).where(eq(teamTargets.id, id));
  }

  // Award operations
  async createAward(award: InsertAward): Promise<Award> {
    const [newAward] = await db
      .insert(awards)
      .values(award)
      .returning();
    return newAward;
  }

  async getVendorAwards(vendorId: number): Promise<Award[]> {
    return await db
      .select()
      .from(awards)
      .where(eq(awards.vendorId, vendorId))
      .orderBy(desc(awards.dateAwarded));
  }

  async getAllAwards(): Promise<Award[]> {
    return await db
      .select()
      .from(awards)
      .orderBy(desc(awards.dateAwarded));
  }

  async updateAward(id: number, award: Partial<InsertAward>): Promise<Award> {
    const [updatedAward] = await db
      .update(awards)
      .set(award)
      .where(eq(awards.id, id))
      .returning();
    return updatedAward;
  }

  async deleteAward(id: number): Promise<void> {
    await db.delete(awards).where(eq(awards.id, id));
  }

  // Analytics operations
  async getVendorStats(vendorId: number, month?: number, year?: number): Promise<any> {
    const vendorProposals = await db
      .select()
      .from(proposals)
      .where(eq(proposals.vendorId, vendorId));

    // Filter by month/year if specified
    const filteredProposals = vendorProposals.filter(p => {
      if (!month || !year) return true;
      if (!p.createdAt) return false;
      const createdAt = new Date(p.createdAt);
      return createdAt.getMonth() + 1 === month && createdAt.getFullYear() === year;
    });

    const totalProposals = filteredProposals.length;
    const totalValue = filteredProposals.reduce((sum, p) => {
      const contractData = p.contractData as any;
      const value = contractData?.valor || "R$ 0";
      const numericValue = parseInt(value.replace(/[^\d]/g, "")) || 0;
      return sum + numericValue;
    }, 0);

    const averageValue = totalProposals > 0 ? totalValue / totalProposals : 0;

    return { totalProposals, totalValue, averageValue };
  }

  async getTeamStats(month?: number, year?: number): Promise<any> {
    const allProposals = await db.select().from(proposals);

    // Filter by month/year if specified
    const filteredProposals = allProposals.filter(p => {
      if (!month || !year) return true;
      if (!p.createdAt) return false;
      const createdAt = new Date(p.createdAt);
      return createdAt.getMonth() + 1 === month && createdAt.getFullYear() === year;
    });

    const totalProposals = filteredProposals.length;
    const totalValue = filteredProposals.reduce((sum, p) => {
      const contractData = p.contractData as any;
      const value = contractData?.valor || "R$ 0";
      const numericValue = parseInt(value.replace(/[^\d]/g, "")) || 0;
      return sum + numericValue;
    }, 0);

    const averageValue = totalProposals > 0 ? totalValue / totalProposals : 0;
    const totalVendors = new Set(filteredProposals.map(p => p.vendorId)).size;

    return { totalProposals, totalValue, averageValue, totalVendors };
  }

  // System Users operations
  async getAllSystemUsers(): Promise<SystemUser[]> {
    return await db.select().from(systemUsers).orderBy(desc(systemUsers.createdAt));
  }

  async getSystemUser(id: number): Promise<SystemUser | undefined> {
    const [user] = await db.select().from(systemUsers).where(eq(systemUsers.id, id));
    return user || undefined;
  }

  async getSystemUserByEmail(email: string): Promise<SystemUser | undefined> {
    const [user] = await db.select().from(systemUsers).where(eq(systemUsers.email, email));
    return user || undefined;
  }

  async createSystemUser(userData: InsertSystemUser): Promise<SystemUser> {
    const [user] = await db
      .insert(systemUsers)
      .values(userData)
      .returning();
    return user;
  }

  async updateSystemUser(id: number, userData: Partial<InsertSystemUser>): Promise<SystemUser> {
    const [user] = await db
      .update(systemUsers)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(systemUsers.id, id))
      .returning();
    return user;
  }

  async deleteSystemUser(id: number): Promise<void> {
    await db.delete(systemUsers).where(eq(systemUsers.id, id));
  }

  async updateLastLogin(id: number): Promise<void> {
    await db
      .update(systemUsers)
      .set({ lastLogin: new Date() })
      .where(eq(systemUsers.id, id));
  }

  // Attachment operations
  async getAllAttachments(): Promise<Attachment[]> {
    return await db.select().from(attachments);
  }

  async getAttachment(id: number): Promise<Attachment | undefined> {
    const [attachment] = await db.select().from(attachments).where(eq(attachments.id, id));
    return attachment || undefined;
  }

  async getAttachmentsByProposal(proposalId: string): Promise<Attachment[]> {
    return await db.select().from(attachments).where(eq(attachments.proposalId, proposalId));
  }

  async createAttachment(attachmentData: InsertAttachment): Promise<Attachment> {
    const [attachment] = await db
      .insert(attachments)
      .values(attachmentData)
      .returning();
    return attachment;
  }

  async updateAttachmentStatus(id: number, status: string, approvedBy?: string): Promise<Attachment> {
    const updateData: any = { status };
    if (approvedBy) {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
    }

    const [attachment] = await db
      .update(attachments)
      .set(updateData)
      .where(eq(attachments.id, id))
      .returning();
    return attachment;
  }

  async deleteAttachment(id: number): Promise<void> {
    await db.delete(attachments).where(eq(attachments.id, id));
  }

  // Drive Config operations
  async getAllDriveConfigs(): Promise<DriveConfig[]> {
    return await db.select().from(driveConfigs);
  }

  async getDriveConfig(id: number): Promise<DriveConfig | undefined> {
    const [config] = await db.select().from(driveConfigs).where(eq(driveConfigs.id, id));
    return config || undefined;
  }

  async createDriveConfig(configData: InsertDriveConfig): Promise<DriveConfig> {
    const [config] = await db
      .insert(driveConfigs)
      .values(configData)
      .returning();
    return config;
  }

  async updateDriveConfig(id: number, configData: Partial<InsertDriveConfig>): Promise<DriveConfig> {
    const [config] = await db
      .update(driveConfigs)
      .set({ ...configData, updatedAt: new Date() })
      .where(eq(driveConfigs.id, id))
      .returning();
    return config;
  }

  async deleteDriveConfig(id: number): Promise<void> {
    await db.delete(driveConfigs).where(eq(driveConfigs.id, id));
  }

  // System Settings operations
  async getSystemSetting(key: string): Promise<string | null> {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting?.value || null;
  }

  async setSystemSetting(key: string, value: string): Promise<void> {
    await db
      .insert(systemSettings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value, updatedAt: new Date() }
      });
  }
}

export const storage = new DatabaseStorage();
