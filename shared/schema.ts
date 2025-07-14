import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull().default("120784"),
  role: text("role").notNull().default("vendor"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVendorSchema = createInsertSchema(vendors).pick({
  name: true,
  email: true,
  password: true,
  role: true,
  active: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

// Proposals table
export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().notNull(),
  abmId: varchar("abm_id"),
  vendorId: integer("vendor_id").references(() => vendors.id),
  clientToken: varchar("client_token").unique().notNull(),
  contractData: jsonb("contract_data").notNull(),
  titulares: jsonb("titulares").default(sql`'[]'::jsonb`),
  dependentes: jsonb("dependentes").default(sql`'[]'::jsonb`),
  internalData: jsonb("internal_data").default(sql`'{}'::jsonb`),
  vendorAttachments: jsonb("vendor_attachments").default(sql`'[]'::jsonb`),
  clientAttachments: jsonb("client_attachments").default(sql`'[]'::jsonb`),
  clientCompleted: boolean("client_completed").default(false),
  status: varchar("status").default("observacao"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProposalSchema = createInsertSchema(proposals);
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;
