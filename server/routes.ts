import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import crypto from "crypto";

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
      console.log("Dados recebidos:", JSON.stringify(proposalData, null, 2));
      
      // Generate unique ABM ID and client token
      const abmCount = await storage.getProposalCount();
      const abmId = `ABM${String(abmCount + 1).padStart(3, '0')}`;
      const proposalId = `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const clientToken = `CLIENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log("IDs gerados:", { proposalId, clientToken });
      
      const dataToInsert = {
        id: proposalId,
        abmId: abmId,
        vendorId: proposalData.vendorId,
        clientToken: clientToken,
        contractData: proposalData.contractData,
        titulares: proposalData.titulares || [],
        dependentes: proposalData.dependentes || [],
        internalData: proposalData.internalData || {},
        vendorAttachments: proposalData.attachments || [],
        clientAttachments: [],
        clientCompleted: false,
        status: "observacao"
      };
      
      console.log("Dados para inserir:", JSON.stringify(dataToInsert, null, 2));
      
      const proposal = await storage.createProposal(dataToInsert);
      
      console.log("Proposta criada:", proposal);

      const response = {
        ...proposal,
        clientLink: `${req.protocol}://${req.hostname}/cliente/proposta/${clientToken}`
      };
      
      console.log("Resposta final:", response);
      res.json(response);
    } catch (error) {
      console.error("Erro ao criar proposta - detalhes:", error);
      console.error("Stack trace:", error.stack);
      res.status(500).json({ error: "Erro interno do servidor", details: error.message });
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

  // Get all proposals (for portals)
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getAllProposals();
      res.json(proposals);
    } catch (error) {
      console.error("Erro ao buscar propostas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get vendor proposals
  app.get("/api/proposals/vendor/:vendorId", async (req, res) => {
    try {
      const vendorId = parseInt(req.params.vendorId);
      const proposals = await storage.getVendorProposals(vendorId);
      res.json(proposals);
    } catch (error) {
      console.error("Erro ao buscar propostas do vendedor:", error);
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
        titulares: updateData.titulares,
        dependentes: updateData.dependentes,
        clientAttachments: updateData.clientAttachments || [],
        clientCompleted: true,
        status: "client_completed"
      });

      res.json(updatedProposal);
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update proposal status and priority (for implementation portal)
  app.put("/api/proposals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, priority } = req.body;
      
      const existingProposal = await storage.getProposal(id);
      if (!existingProposal) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }

      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;

      const updatedProposal = await storage.updateProposal(id, updateData);
      res.json(updatedProposal);
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete proposal (for implementation and vendor portals)
  app.delete("/api/proposals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const existingProposal = await storage.getProposal(id);
      if (!existingProposal) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }

      await storage.deleteProposal(id);
      res.json({ success: true, message: "Proposta excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir proposta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Generate horizontal sheet format for all proposals
  app.get("/api/proposals/sheet", async (req, res) => {
    try {
      const { formatProposalsToSheet, getSheetHeaders } = await import("@shared/sheetsFormatter");
      const proposals = await storage.getAllProposals();
      
      // Get headers and data in horizontal format
      const headers = getSheetHeaders();
      const sheetData = formatProposalsToSheet(proposals);
      
      res.json({
        headers,
        data: sheetData,
        totalRows: sheetData.length
      });
    } catch (error) {
      console.error("Erro ao gerar planilha horizontal:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === VENDOR TARGETS ROUTES ===
  
  // Get all vendor targets
  app.get("/api/vendor-targets", async (req, res) => {
    try {
      const targets = await storage.getAllVendorTargets();
      res.json(targets);
    } catch (error) {
      console.error("Erro ao buscar metas dos vendedores:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get vendor targets by vendor ID
  app.get("/api/vendor-targets/:vendorId", async (req, res) => {
    try {
      const vendorId = parseInt(req.params.vendorId);
      const targets = await storage.getVendorTargets(vendorId);
      res.json(targets);
    } catch (error) {
      console.error("Erro ao buscar metas do vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Create vendor target
  app.post("/api/vendor-targets", async (req, res) => {
    try {
      const { insertVendorTargetSchema } = await import("@shared/schema");
      const validatedData = insertVendorTargetSchema.parse(req.body);
      const target = await storage.createVendorTarget(validatedData);
      res.json(target);
    } catch (error) {
      console.error("Erro ao criar meta do vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update vendor target
  app.put("/api/vendor-targets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedTarget = await storage.updateVendorTarget(id, req.body);
      res.json(updatedTarget);
    } catch (error) {
      console.error("Erro ao atualizar meta do vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete vendor target
  app.delete("/api/vendor-targets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVendorTarget(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar meta do vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === TEAM TARGETS ROUTES ===
  
  // Get all team targets
  app.get("/api/team-targets", async (req, res) => {
    try {
      const targets = await storage.getAllTeamTargets();
      res.json(targets);
    } catch (error) {
      console.error("Erro ao buscar metas da equipe:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Create team target
  app.post("/api/team-targets", async (req, res) => {
    try {
      const { insertTeamTargetSchema } = await import("@shared/schema");
      const validatedData = insertTeamTargetSchema.parse(req.body);
      const target = await storage.createTeamTarget(validatedData);
      res.json(target);
    } catch (error) {
      console.error("Erro ao criar meta da equipe:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update team target
  app.put("/api/team-targets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedTarget = await storage.updateTeamTarget(id, req.body);
      res.json(updatedTarget);
    } catch (error) {
      console.error("Erro ao atualizar meta da equipe:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete team target
  app.delete("/api/team-targets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamTarget(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar meta da equipe:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === AWARDS ROUTES ===
  
  // Get all awards
  app.get("/api/awards", async (req, res) => {
    try {
      const awards = await storage.getAllAwards();
      res.json(awards);
    } catch (error) {
      console.error("Erro ao buscar premiações:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get awards by vendor ID
  app.get("/api/awards/:vendorId", async (req, res) => {
    try {
      const vendorId = parseInt(req.params.vendorId);
      const awards = await storage.getVendorAwards(vendorId);
      res.json(awards);
    } catch (error) {
      console.error("Erro ao buscar premiações do vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Create award
  app.post("/api/awards", async (req, res) => {
    try {
      const { insertAwardSchema } = await import("@shared/schema");
      const validatedData = insertAwardSchema.parse(req.body);
      const award = await storage.createAward(validatedData);
      res.json(award);
    } catch (error) {
      console.error("Erro ao criar premiação:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update award
  app.put("/api/awards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedAward = await storage.updateAward(id, req.body);
      res.json(updatedAward);
    } catch (error) {
      console.error("Erro ao atualizar premiação:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete award
  app.delete("/api/awards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAward(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar premiação:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === ANALYTICS ROUTES ===
  
  // Get vendor statistics
  app.get("/api/analytics/vendor/:vendorId", async (req, res) => {
    try {
      const vendorId = parseInt(req.params.vendorId);
      const { month, year } = req.query;
      
      const stats = await storage.getVendorStats(
        vendorId,
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );
      
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas do vendedor:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get team statistics
  app.get("/api/analytics/team", async (req, res) => {
    try {
      const { month, year } = req.query;
      
      const stats = await storage.getTeamStats(
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );
      
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas da equipe:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
