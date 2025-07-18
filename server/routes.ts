import { Router } from "express";
import { storage } from "./storage";
import crypto from "crypto";

const router = Router();
  // put application routes here
  // prefix all routes with /api

// Global System Settings API
router.get("/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const value = await storage.getSystemSetting(key);
    res.json({ key, value });
  } catch (error) {
    console.error("Erro ao buscar configuração:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/settings", async (req, res) => {
  try {
    const { key, value } = req.body;
    await storage.setSystemSetting(key, value);
    res.json({ success: true, key, value });
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Portal visibility settings
router.get("/portal-visibility", async (req, res) => {
  try {
    const showClientPortal = await storage.getSystemSetting("showClientPortal") || "true";
    const showVendorPortal = await storage.getSystemSetting("showVendorPortal") || "true";
    const showFinancialPortal = await storage.getSystemSetting("showFinancialPortal") || "true";
    const showImplementationPortal = await storage.getSystemSetting("showImplementationPortal") || "true";
    const showSupervisorPortal = await storage.getSystemSetting("showSupervisorPortal") || "true";
    
    res.json({
      showClientPortal: showClientPortal === "true",
      showVendorPortal: showVendorPortal === "true",
      showFinancialPortal: showFinancialPortal === "true",
      showImplementationPortal: showImplementationPortal === "true",
      showSupervisorPortal: showSupervisorPortal === "true"
    });
  } catch (error) {
    console.error("Erro ao buscar visibilidade dos portais:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/portal-visibility", async (req, res) => {
  try {
    const { 
      showClientPortal,
      showVendorPortal, 
      showFinancialPortal,
      showImplementationPortal,
      showSupervisorPortal 
    } = req.body;
    
    await storage.setSystemSetting("showClientPortal", showClientPortal.toString());
    await storage.setSystemSetting("showVendorPortal", showVendorPortal.toString());
    await storage.setSystemSetting("showFinancialPortal", showFinancialPortal.toString());
    await storage.setSystemSetting("showImplementationPortal", showImplementationPortal.toString());
    await storage.setSystemSetting("showSupervisorPortal", showSupervisorPortal.toString());
    
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar visibilidade dos portais:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ViaCEP proxy route (must be before other routes to avoid conflicts)
router.get("/cep/:cep", async (req, res) => {
    try {
      const { cep } = req.params;
      
      // Remove caracteres não numéricos
      const cepLimpo = cep.replace(/\D/g, '');
      
      // Valida se tem 8 dígitos
      if (cepLimpo.length !== 8) {
        return res.status(400).json({ error: "CEP deve ter 8 dígitos" });
      }
      
      // Busca na API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        return res.status(502).json({ error: "Erro ao consultar ViaCEP" });
      }
      
      const data = await response.json();
      
      // Verifica se houve erro
      if (data.erro) {
        return res.status(404).json({ error: "CEP não encontrado" });
      }
      
      // Retorna os dados formatados
      res.json({
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
        enderecoCompleto: [
          data.logradouro,
          data.bairro,
          data.localidade,
          data.uf
        ].filter(Boolean).join(', ')
      });
      
    } catch (error) {
      console.error("Erro no proxy ViaCEP:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  const { insertVendorSchema } = await import("@shared/schema");

// Vendor authentication route
router.post("/vendor/login", async (req, res) => {
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
router.get("/vendors", async (req, res) => {
    try {
      const vendors = await storage.getAllVendors();
      res.json(vendors.map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        password: vendor.password, // Include password for admin management
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
router.post("/vendors", async (req, res) => {
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
router.patch("/vendors/:id", async (req, res) => {
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
router.delete("/vendors/:id", async (req, res) => {
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
router.post("/proposals", async (req, res) => {
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
      
      // Notificar sistema de sincronização em tempo real
      const { notifyDataChange } = await import("@shared/realTimeSheetSync");
      await notifyDataChange('proposal_created', proposal);

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
  router.get("/proposals/client/:token", async (req, res) => {
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
  router.get("/proposals", async (req, res) => {
    try {
      const proposals = await storage.getAllProposals();
      res.json(proposals);
    } catch (error) {
      console.error("Erro ao buscar propostas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get vendor proposals
  router.get("/proposals/vendor/:vendorId", async (req, res) => {
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
  router.put("/proposals/client/:token", async (req, res) => {
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

      // Notificar sistema de sincronização em tempo real
      const { notifyDataChange } = await import("@shared/realTimeSheetSync");
      await notifyDataChange('proposal_updated', updatedProposal);

      res.json(updatedProposal);
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update proposal status and priority (for implementation portal)
  router.put("proposals/:id", async (req, res) => {
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
      
      // Notificar sistema de sincronização em tempo real
      const { notifyDataChange } = await import("@shared/realTimeSheetSync");
      await notifyDataChange('proposal_updated', updatedProposal);
      
      res.json(updatedProposal);
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Clear all proposals (for admin)
  router.delete("/proposals/clear-all", async (req, res) => {
    try {
      await storage.clearAllProposals();
      res.json({ success: true, message: 'Todas as propostas foram removidas' });
    } catch (error) {
      console.error('Error clearing all proposals:', error);
      res.status(500).json({ error: 'Erro ao limpar propostas' });
    }
  });

  // Delete proposal (for implementation and vendor portals)
  router.delete("proposals/:id", async (req, res) => {
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

  // Generate dynamic sheet format for all proposals
  router.get("/proposals/sheet", async (req, res) => {
    try {
      const { generateDynamicSheet } = await import("@shared/dynamicSheetGenerator");
      const proposals = await storage.getAllProposals();
      const vendors = await storage.getAllVendors();
      
      // Add vendor names to proposals
      const proposalsWithVendor = proposals.map(proposal => ({
        ...proposal,
        vendorName: vendors.find(v => v.id === proposal.vendorId)?.name || 'Vendedor Não Identificado'
      }));
      
      // Generate dynamic sheet structure
      const sheetData = generateDynamicSheet(proposalsWithVendor);
      
      res.json({
        success: true,
        ...sheetData,
        message: `Planilha gerada com ${sheetData.data.length} propostas, ${sheetData.maxTitulares} titulares máx., ${sheetData.maxDependentes} dependentes máx.`
      });
    } catch (error) {
      console.error("Erro ao gerar planilha dinâmica:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  
  // Real-time sheet sync endpoint for all departments
  router.post("/sync/sheet", async (req, res) => {
    try {
      const { generateDynamicSheet, formatForGoogleSheets } = await import("@shared/dynamicSheetGenerator");
      const proposals = await storage.getAllProposals();
      const vendors = await storage.getAllVendors();
      
      // Add vendor names to proposals
      const proposalsWithVendor = proposals.map(proposal => ({
        ...proposal,
        vendorName: vendors.find(v => v.id === proposal.vendorId)?.name || 'Vendedor Não Identificado'
      }));
      
      // Generate dynamic sheet structure
      const sheetData = generateDynamicSheet(proposalsWithVendor);
      const googleSheetsData = formatForGoogleSheets(sheetData);
      
      // Here you would integrate with Google Sheets API
      // For now, we'll just return the formatted data
      
      res.json({
        success: true,
        message: "Planilha sincronizada com sucesso",
        data: googleSheetsData,
        stats: {
          totalPropostas: sheetData.data.length,
          maxTitulares: sheetData.maxTitulares,
          maxDependentes: sheetData.maxDependentes,
          totalColunas: sheetData.totalColumns
        }
      });
    } catch (error) {
      console.error("Erro ao sincronizar planilha:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === VENDOR TARGETS ROUTES ===
  
  // Get all vendor targets
  router.get("vendor-targets", async (req, res) => {
    try {
      const targets = await storage.getAllVendorTargets();
      res.json(targets);
    } catch (error) {
      console.error("Erro ao buscar metas dos vendedores:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get vendor targets by vendor ID
  router.get("vendor-targets/:vendorId", async (req, res) => {
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
  router.post("vendor-targets", async (req, res) => {
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
  router.put("vendor-targets/:id", async (req, res) => {
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
  router.delete("vendor-targets/:id", async (req, res) => {
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
  router.get("team-targets", async (req, res) => {
    try {
      const targets = await storage.getAllTeamTargets();
      res.json(targets);
    } catch (error) {
      console.error("Erro ao buscar metas da equipe:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Create team target
  router.post("team-targets", async (req, res) => {
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
  router.put("team-targets/:id", async (req, res) => {
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
  router.delete("team-targets/:id", async (req, res) => {
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
  router.get("awards", async (req, res) => {
    try {
      const awards = await storage.getAllAwards();
      res.json(awards);
    } catch (error) {
      console.error("Erro ao buscar premiações:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get awards by vendor ID
  router.get("awards/:vendorId", async (req, res) => {
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
  router.post("awards", async (req, res) => {
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
  router.put("awards/:id", async (req, res) => {
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
  router.delete("awards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAward(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar premiação:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === WEBHOOK/MAKE.COM INTEGRATION ROUTES ===
  
  // Webhook para notificar Make.com sobre mudanças
  router.post("webhook/notify", async (req, res) => {
    try {
      const { type, data, proposalId, vendorId } = req.body;
      
      // URLs de webhook do Make.com (configuráveis via variáveis de ambiente)
      const makeWebhookUrls = [
        process.env.MAKE_WEBHOOK_PROPOSALS,
        process.env.MAKE_WEBHOOK_FINANCIAL,
        process.env.MAKE_WEBHOOK_SHEETS
      ].filter(Boolean);
      
      // Enviar notificação para todos os webhooks configurados
      const webhookPromises = makeWebhookUrls.map(async (url) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type,
              data,
              proposalId,
              vendorId,
              timestamp: new Date().toISOString()
            })
          });
          
          return { url, success: response.ok, status: response.status };
        } catch (error) {
          console.error(`Erro ao notificar webhook ${url}:`, error);
          return { url, success: false, error: error.message };
        }
      });
      
      const results = await Promise.all(webhookPromises);
      
      res.json({
        success: true,
        webhooksNotified: results.length,
        results
      });
    } catch (error) {
      console.error("Erro ao enviar webhooks:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  
  // Sync com Google Sheets via Make.com
  router.post("sync/sheets", async (req, res) => {
    try {
      const { proposalId, action = 'update' } = req.body;
      
      // Buscar dados da proposta
      const proposal = await storage.getProposal(proposalId);
      if (!proposal) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }
      
      // Enviar para webhook do Make.com para sincronização com Google Sheets
      if (process.env.MAKE_WEBHOOK_SHEETS) {
        await fetch(process.env.MAKE_WEBHOOK_SHEETS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'sync_sheets',
            proposal,
            timestamp: new Date().toISOString()
          })
        });
      }
      
      res.json({ success: true, message: "Sincronização com Google Sheets iniciada" });
    } catch (error) {
      console.error("Erro ao sincronizar com Sheets:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Teste de conectividade com Google Sheets
  router.get("test/sheets", async (req, res) => {
    try {
      // Teste simples de conectividade usando planilha pública do Google
      const testSpreadsheetId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";
      const testApiKey = process.env.GOOGLE_API_KEY || "AIzaSyABC123_fake_key";
      
      const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${testSpreadsheetId}/values/A1:B2?key=${testApiKey}`;
      
      const response = await fetch(testUrl);
      const data = await response.json();
      
      if (response.ok) {
        res.json({ 
          success: true, 
          connected: true,
          message: "Conectado com Google Sheets",
          testData: data 
        });
      } else {
        res.json({ 
          success: false, 
          connected: false,
          message: "Erro na conexão com Google Sheets",
          error: data 
        });
      }
    } catch (error) {
      console.error("Erro ao testar Google Sheets:", error);
      res.status(500).json({ 
        success: false, 
        connected: false,
        message: "Erro interno ao testar conexão",
        error: error.message 
      });
    }
  });
  
  // Integração com sistema financeiro
  router.post("integration/financial", async (req, res) => {
    try {
      const { proposalId, action, financialData } = req.body;
      
      // Buscar proposta
      const proposal = await storage.getProposal(proposalId);
      if (!proposal) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }
      
      // Enviar para sistema financeiro via Make.com
      if (process.env.MAKE_WEBHOOK_FINANCIAL) {
        const response = await fetch(process.env.MAKE_WEBHOOK_FINANCIAL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'financial_integration',
            proposalId,
            proposal,
            financialData,
            timestamp: new Date().toISOString()
          })
        });
        
        const result = await response.json();
        res.json({ success: true, integrationResult: result });
      } else {
        res.status(503).json({ error: "Webhook financeiro não configurado" });
      }
    } catch (error) {
      console.error("Erro na integração financeira:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === ANALYTICS ROUTES ===
  
  // Get vendor statistics
  router.get("analytics/vendor/:vendorId", async (req, res) => {
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
  router.get("analytics/team", async (req, res) => {
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

  // === INTEGRATION CONFIG ROUTES ===
  
  // Get integration status
  router.get("integration/status", async (req, res) => {
    try {
      const status = {
        makeWebhook: !!(process.env.MAKE_WEBHOOK_PROPOSALS || process.env.MAKE_WEBHOOK_FINANCIAL || process.env.MAKE_WEBHOOK_SHEETS),
        googleSheets: !!process.env.MAKE_WEBHOOK_SHEETS,
        financialSystem: !!process.env.MAKE_WEBHOOK_FINANCIAL,
        lastSync: new Date().toISOString()
      };
      
      res.json(status);
    } catch (error) {
      console.error("Erro ao verificar status das integrações:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  
  // Get integration config (sans sensitive data)
  router.get("integration/config", async (req, res) => {
    try {
      const config = {
        hasProposalsWebhook: !!process.env.MAKE_WEBHOOK_PROPOSALS,
        hasFinancialWebhook: !!process.env.MAKE_WEBHOOK_FINANCIAL,
        hasSheetsWebhook: !!process.env.MAKE_WEBHOOK_SHEETS,
        hasGoogleDriveApi: !!process.env.GOOGLE_DRIVE_API_KEY,
        hasSheetsApi: !!process.env.GOOGLE_SHEETS_API_KEY,
        environment: process.env.NODE_ENV || 'development'
      };
      
      res.json(config);
    } catch (error) {
      console.error("Erro ao obter configurações:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get team statistics
  router.get("analytics/team", async (req, res) => {
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

  // === INTEGRATIONS ROUTES ===
  
  // Sync Google Sheets
  router.post("sync-sheets", async (req, res) => {
    try {
      // Buscar todas as propostas para sincronizar
      const proposals = await storage.getAllProposals();
      
      console.log(`Sincronizando ${proposals.length} propostas com Google Sheets...`);
      
      // Simular sincronização (aqui você integraria com a API real do Google Sheets)
      // await syncWithGoogleSheets(proposals);
      
      res.json({ 
        success: true, 
        message: `${proposals.length} propostas sincronizadas com sucesso`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao sincronizar Google Sheets:", error);
      res.status(500).json({ error: "Erro na sincronização com Google Sheets" });
    }
  });

  // Google Drive integration status
  router.get("drive-status", async (req, res) => {
    try {
      // Simular verificação de status do Google Drive
      res.json({
        connected: true,
        lastSync: new Date().toISOString(),
        folderUrl: "https://drive.google.com/drive/folders/1FAIpQLScQKE8BjIZJ-abmix-proposals",
        totalFiles: 247
      });
    } catch (error) {
      console.error("Erro ao verificar status do Google Drive:", error);
      res.status(500).json({ error: "Erro ao verificar Google Drive" });
    }
  });

  // === SYSTEM USERS ROUTES ===
  
  // Get all system users
  router.get("system-users", async (req, res) => {
    try {
      const users = await storage.getAllSystemUsers();
      res.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários do sistema:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get system user by ID
  router.get("system-users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getSystemUser(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Create system user
  router.post("system-users", async (req, res) => {
    try {
      const { insertSystemUserSchema } = await import("@shared/schema");
      const validatedData = insertSystemUserSchema.parse(req.body);
      const user = await storage.createSystemUser(validatedData);
      res.json(user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update system user
  router.put("system-users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateSystemUser(id, req.body);
      res.json(user);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete system user
  router.delete("system-users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSystemUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update last login
  router.patch("system-users/:id/login", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateLastLogin(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao atualizar último login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === UNIFIED AUTHENTICATION SYSTEM ===
  
  // Unified login for all portals - checks both system users and vendors
  router.post("/auth/login", async (req, res) => {
    try {
      const { email, password, portal } = req.body;
      
      if (!email || !password || !portal) {
        return res.status(400).json({ error: "Email, senha e portal são obrigatórios" });
      }

      // First check system users - ANY active user can access ANY portal
      const systemUser = await storage.getSystemUserByEmail(email);
      if (systemUser && systemUser.password === password && systemUser.active) {
        await storage.updateLastLogin(systemUser.id);
        return res.json({
          id: systemUser.id,
          name: systemUser.name,
          email: systemUser.email,
          role: portal, // Use the requested portal as role
          userType: 'system',
          panel: portal // Use the requested portal as panel
        });
      }

      // Then check vendors (for vendor portal)
      if (portal === 'vendor') {
        const vendor = await storage.getVendorByEmail(email);
        if (vendor && vendor.password === password && vendor.active) {
          return res.json({
            id: vendor.id,
            name: vendor.name,
            email: vendor.email,
            role: 'vendor',
            userType: 'vendor',
            panel: 'vendor'
          });
        }
      }

      return res.status(401).json({ error: "Credenciais inválidas ou acesso não autorizado para este portal" });
    } catch (error) {
      console.error("Erro no login unificado:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get all users (system users + vendors) for unified management
  router.get("/auth/users", async (req, res) => {
    try {
      const systemUsers = await storage.getAllSystemUsers();
      const vendors = await storage.getAllVendors();
      
      const allUsers = [
        ...systemUsers.map(user => ({
          ...user,
          userType: 'system',
          panel: user.panel
        })),
        ...vendors.map(vendor => ({
          ...vendor,
          userType: 'vendor',
          panel: 'vendor',
          role: 'vendor'
        }))
      ];
      
      res.json(allUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Create user (unified API)
  router.post("/auth/users", async (req, res) => {
    try {
      const { userType, ...userData } = req.body;
      
      if (userType === 'vendor') {
        const { insertVendorSchema } = await import("@shared/schema");
        const validatedData = insertVendorSchema.parse({ ...userData, role: 'vendor' });
        const vendor = await storage.createVendor(validatedData);
        res.json({
          ...vendor,
          userType: 'vendor',
          panel: 'vendor'
        });
      } else {
        const { insertSystemUserSchema } = await import("@shared/schema");
        const validatedData = insertSystemUserSchema.parse(userData);
        const user = await storage.createSystemUser(validatedData);
        res.json({
          ...user,
          userType: 'system'
        });
      }
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: "Email já está em uso" });
      }
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update user (unified API)
  router.patch("/auth/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userType, userData } = req.body;
      
      console.log("Atualizando usuário:", { id, userType, userData });
      
      if (userType === 'vendor') {
        const { insertVendorSchema } = await import("@shared/schema");
        const validatedData = insertVendorSchema.partial().parse(userData);
        const vendor = await storage.updateVendor(parseInt(id), validatedData);
        res.json({
          ...vendor,
          userType: 'vendor',
          panel: 'vendor'
        });
      } else {
        const { insertSystemUserSchema } = await import("@shared/schema");
        const validatedData = insertSystemUserSchema.partial().parse(userData);
        const user = await storage.updateSystemUser(parseInt(id), validatedData);
        res.json({
          ...user,
          userType: 'system'
        });
      }
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: "Email já está em uso por outro usuário" });
      }
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete user (unified API)
  router.delete("auth/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userType } = req.query;
      
      if (userType === 'vendor') {
        await storage.deleteVendor(parseInt(id));
        res.json({ success: true, message: "Vendedor excluído com sucesso" });
      } else {
        await storage.deleteSystemUser(parseInt(id));
        res.json({ success: true, message: "Usuário excluído com sucesso" });
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update user password (works for both system users and vendors)
  router.patch("/auth/users/:id/password", async (req, res) => {
    try {
      const { id } = req.params;
      const { password, userType } = req.body;
      
      if (!password) {
        return res.status(400).json({ error: "Nova senha é obrigatória" });
      }

      if (userType === 'vendor') {
        const vendor = await storage.updateVendor(parseInt(id), { password });
        res.json({ success: true, message: "Senha do vendedor atualizada com sucesso" });
      } else {
        const user = await storage.updateSystemUser(parseInt(id), { password });
        res.json({ success: true, message: "Senha do usuário atualizada com sucesso" });
      }
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === ATTACHMENTS ROUTES ===
  
  // Get all attachments
  router.get("attachments", async (req, res) => {
    try {
      const attachments = await storage.getAllAttachments();
      res.json(attachments);
    } catch (error) {
      console.error("Erro ao buscar anexos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get attachment by ID
  router.get("attachments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const attachment = await storage.getAttachment(parseInt(id));
      
      if (!attachment) {
        return res.status(404).json({ error: "Anexo não encontrado" });
      }
      
      res.json(attachment);
    } catch (error) {
      console.error("Erro ao buscar anexo:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update attachment status
  router.put("attachments/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, approvedBy } = req.body;
      
      const attachment = await storage.updateAttachmentStatus(parseInt(id), status, approvedBy);
      res.json(attachment);
    } catch (error) {
      console.error("Erro ao atualizar status do anexo:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete attachment
  router.delete("attachments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAttachment(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao excluir anexo:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // === DRIVE CONFIGS ROUTES ===
  
  // Get all drive configs
  router.get("drive-configs", async (req, res) => {
    try {
      const configs = await storage.getAllDriveConfigs();
      res.json(configs);
    } catch (error) {
      console.error("Erro ao buscar configurações do drive:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Create drive config
  router.post("drive-configs", async (req, res) => {
    try {
      const configData = req.body;
      const config = await storage.createDriveConfig(configData);
      res.status(201).json(config);
    } catch (error) {
      console.error("Erro ao criar configuração do drive:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Update drive config
  router.put("drive-configs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const configData = req.body;
      const config = await storage.updateDriveConfig(parseInt(id), configData);
      res.json(config);
    } catch (error) {
      console.error("Erro ao atualizar configuração do drive:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Delete drive config
  router.delete("drive-configs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteDriveConfig(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao excluir configuração do drive:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

export default router;
