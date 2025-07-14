import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  const { insertVendorSchema } = await import("@shared/schema");

  // Vendor authentication route
  app.post("/api/vendor/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const vendor = await storage.getVendorByEmail(email);
      
      if (!vendor || vendor.password !== password || !vendor.active) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      res.json({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get all vendors (for supervisor)
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getAllVendors();
      res.json(vendors.map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
        active: vendor.active,
        createdAt: vendor.createdAt
      })));
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Create vendor (for supervisor)
  app.post("/api/vendors", async (req, res) => {
    try {
      const validatedData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(validatedData);
      res.json({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
        active: vendor.active,
        createdAt: vendor.createdAt
      });
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: "Email já está em uso" });
      }
      console.error("Erro ao criar vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update vendor (for supervisor)
  app.patch("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertVendorSchema.partial().parse(req.body);
      const vendor = await storage.updateVendor(id, validatedData);
      res.json({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
        active: vendor.active,
        createdAt: vendor.createdAt
      });
    } catch (error) {
      console.error("Erro ao atualizar vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete vendor (for supervisor)
  app.delete("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVendor(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Proposal routes
  app.post("/api/proposals", async (req, res) => {
    try {
      const proposalData = req.body;
      
      // Generate unique ID and client token
      const proposalId = `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const clientToken = `CLIENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const proposal = await storage.createProposal({
        id: proposalId,
        vendorId: proposalData.vendorId,
        contractData: proposalData.contractData,
        titulares: proposalData.titulares || [],
        dependentes: proposalData.dependentes || [],
        internalData: proposalData.internalData,
        attachments: proposalData.attachments || [],
        status: "draft",
        clientToken: clientToken
      });

      res.json({
        ...proposal,
        clientLink: `${req.protocol}://${req.hostname}/cliente/proposta/${clientToken}`
      });
    } catch (error) {
      console.error("Erro ao criar proposta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get proposal by token (for client access)
  app.get("/api/proposals/client/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const proposal = await storage.getProposalByToken(token);
      
      if (!proposal) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }

      res.json(proposal);
    } catch (error) {
      console.error("Erro ao buscar proposta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update proposal by token (for client completion)
  app.put("/api/proposals/client/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const updateData = req.body;
      
      const existingProposal = await storage.getProposalByToken(token);
      if (!existingProposal) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }

      const updatedProposal = await storage.updateProposal(existingProposal.id, {
        ...updateData,
        status: "completed"
      });

      res.json(updatedProposal);
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
