import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
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

// Proposals table for client links
export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().notNull(), // ABM001, ABM002, etc.
  clientLink: varchar("client_link").unique().notNull(), // UUID for client access
  vendorId: integer("vendor_id").references(() => vendors.id),
  
  // Contract data filled by vendor
  nomeEmpresa: varchar("nome_empresa"),
  cnpj: varchar("cnpj"),
  planoContratado: varchar("plano_contratado"),
  valor: varchar("valor"),
  odontoConjugado: boolean("odonto_conjugado").default(false),
  compulsorio: boolean("compulsorio").default(false),
  livreAdesao: boolean("livre_adesao").default(false),
  inicioVigencia: varchar("inicio_vigencia"),
  periodoMinimo: varchar("periodo_minimo"),
  aproveitamentoCongenere: boolean("aproveitamento_congenere").default(false),
  
  // Vendor internal data
  reuniao: boolean("reuniao").default(false),
  nomeReuniao: varchar("nome_reuniao"),
  vendaDupla: boolean("venda_dupla").default(false),
  nomeVendaDupla: varchar("nome_venda_dupla"),
  desconto: varchar("desconto"),
  autorizadorDesconto: varchar("autorizador_desconto"),
  observacoesVendedor: text("observacoes_vendedor"),
  
  // Client completion status
  clientCompleted: boolean("client_completed").default(false),
  completedAt: timestamp("completed_at"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Proposal attachments
export const proposalAttachments = pgTable("proposal_attachments", {
  id: varchar("id").primaryKey().notNull(),
  proposalId: varchar("proposal_id").references(() => proposals.id),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type"),
  fileSize: varchar("file_size"),
  uploadedBy: varchar("uploaded_by"), // 'vendor' | 'client'
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Personal data for titulares and dependentes
export const proposalPeople = pgTable("proposal_people", {
  id: varchar("id").primaryKey().notNull(),
  proposalId: varchar("proposal_id").references(() => proposals.id),
  type: varchar("type").notNull(), // 'titular' | 'dependente'
  nomeCompleto: varchar("nome_completo"),
  cpf: varchar("cpf"),
  rg: varchar("rg"),
  dataNascimento: varchar("data_nascimento"),
  parentesco: varchar("parentesco"), // only for dependentes
  nomeMae: varchar("nome_mae"),
  sexo: varchar("sexo"), // 'masculino' | 'feminino'
  estadoCivil: varchar("estado_civil"),
  peso: varchar("peso"),
  altura: varchar("altura"),
  emailPessoal: varchar("email_pessoal"),
  telefonePessoal: varchar("telefone_pessoal"),
  emailEmpresa: varchar("email_empresa"),
  telefoneEmpresa: varchar("telefone_empresa"),
  cep: varchar("cep"),
  enderecoCompleto: varchar("endereco_completo"),
  dadosReembolso: varchar("dados_reembolso"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  clientLink: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProposalAttachmentSchema = createInsertSchema(proposalAttachments).omit({
  id: true,
  uploadedAt: true,
});

export const insertProposalPersonSchema = createInsertSchema(proposalPeople).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposalAttachment = z.infer<typeof insertProposalAttachmentSchema>;
export type ProposalAttachment = typeof proposalAttachments.$inferSelect;
export type InsertProposalPerson = z.infer<typeof insertProposalPersonSchema>;
export type ProposalPerson = typeof proposalPeople.$inferSelect;
