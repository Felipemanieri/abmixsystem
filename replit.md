# Abmix System

## Overview

The Abmix System is a comprehensive proposal management and client portal application designed for managing insurance/health plan sales workflows. It features multiple user portals (Client, Vendor, Financial, Implementation, Supervisor, and Restricted Area) with integrated document management, proposal tracking, and automation capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.
Language: Portuguese (Brazilian)
Interface: Completely localized in Portuguese with enhanced chatbot responses

## System Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Radix UI component library
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: React hooks with local state management
- **UI Components**: Shadcn/ui components with Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple

### Project Structure
```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API and external service integrations
│   │   └── utils/       # Utility functions
├── server/              # Backend Express server
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database abstraction layer
│   └── vite.ts          # Development server setup
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema definitions
└── migrations/          # Database migration files
```

## Key Components

### Portal System
The application provides role-based portals with specific functionality:

1. **Client Portal**: Proposal tracking, document upload, profile management
2. **Vendor Portal**: Proposal creation, client management, sales tracking
3. **Financial Portal**: Proposal validation, financial analysis, automation
4. **Implementation Portal**: Process automation, deployment management
5. **Supervisor Portal**: Team management, reporting, analytics
6. **Restricted Area**: System administration, integrations

### Authentication & Authorization
- Role-based access control with portal-specific authentication
- Session management using PostgreSQL-backed sessions
- User roles determine available features and data access

### Document Management
- Google Drive integration for document storage
- File upload and organization by client
- Document validation and tracking workflows

### Proposal Workflow
- Multi-stage proposal lifecycle from creation to completion
- Status tracking with automated notifications
- Document requirements and validation
- Client self-service form completion

### Integration Layer
- Google Drive API for document storage
- Google Sheets integration for data synchronization
- Make (Integromat) webhook support for automation
- External service integrations for notifications and messaging

## Data Flow

### Proposal Creation Flow
1. Vendor creates proposal with basic contract information
2. System generates unique client link
3. Client completes detailed forms and uploads documents
4. Documents are stored in Google Drive with organized folder structure
5. Completed proposals are sent to Financial for validation
6. Validated proposals proceed to Implementation for processing

### Document Management Flow
1. Client uploads documents through web interface
2. Files are stored in Google Drive with proper naming conventions
3. Document metadata is stored in PostgreSQL database
4. Validation rules ensure required documents are present
5. Automated notifications track document status changes

### Data Synchronization
- Real-time updates using polling mechanisms
- Google Sheets integration for external reporting
- Database transactions ensure data consistency
- Audit trail for all proposal and document changes

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **connect-pg-simple**: PostgreSQL session store

### Google Services
- **Google Drive API**: Document storage and management
- **Google Sheets API**: Data synchronization and reporting
- **Google Authentication**: OAuth2 for service access

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Consistent icon library
- **React Query**: Server state management

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and developer experience
- **ESLint/Prettier**: Code quality and formatting
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Express server running with tsx for TypeScript execution
- PostgreSQL database with local or cloud connection
- Environment variables for API keys and database URLs

### Production Build
- Frontend: Vite build process creates optimized static assets
- Backend: esbuild bundles server code for Node.js execution
- Database: Drizzle migrations manage schema changes
- Static assets served by Express in production

### Environment Configuration
- Database URL required for Drizzle configuration
- Google API credentials for Drive/Sheets integration
- Session secrets for secure authentication
- Build process handles both development and production scenarios

### Scalability Considerations
- Serverless database supports automatic scaling
- Stateless server design enables horizontal scaling
- External file storage reduces server storage requirements
- Component-based architecture supports feature modularity

## Recent Changes

### Correções Críticas de Interface e Persistência (Jan 16, 2025)
- **Corrigido erro de inicialização no SupervisorPortal**:
  - Erro "Cannot access 'proposalPriorities' before initialization" resolvido
  - Reorganizados os useEffects para após declaração dos estados
  - Persistência de prioridades e filtros no localStorage implementada corretamente
  
- **Corrigidas cores dos status EXPIRADO e IMPLANTADO no ImplantacaoPortal**:
  - Mapeamento de cores "blue" e "green" adicionado ao sistema de cores inline
  - Status EXPIRADO agora exibe cor azul forte corretamente
  - Status IMPLANTADO agora exibe cor verde forte corretamente
  - Dropdown de status com cores funcionando para todos os 11 status

- **Sistema completo de persistência no localStorage**:
  - ProposalSelector: Filtros de status, prioridade e vendedor persistem
  - SupervisorPortal: Filtros de vendedor, status, data e prioridades persistem
  - Usuário mantém preferências ao sair e entrar novamente nos portais

### Ordem Cronológica das Propostas Garantida (Jan 16, 2025)
- **Corrigido problema de reordenação indevida das propostas**:
  - Backend: Adicionado orderBy(proposals.createdAt) em getAllProposals e getVendorProposals
  - Frontend: Garantida ordenação cronológica após filtros em todos os portais
  - ImplantacaoPortal: Adicionado sort por createdAt após filteredProposals
  - SupervisorPortal: Adicionado sort por createdAt após filteredProposals  
  - VendorPortal: Adicionado sort por createdAt na renderização das propostas
  - FinancialPortal: Adicionado sort por createdAt na renderização das propostas
  - Sistema agora mantém ordem original de criação independente de mudanças de status
  - Propostas permanecem na mesma posição quando status é alterado

### Autorizador do Desconto convertido para dropdown (Jan 15, 2025)
- **Campo "Autorizador do Desconto" atualizado para dropdown**:
  - ProposalGenerator.tsx: Convertido de input text para select com 3 opções
  - ProposalEditor.tsx: Função renderEditableField modificada para exibir dropdown ao editar
  - Opções padronizadas: Michelle Manieri, Carol Almeida, Rod Ribas
  - Mantida funcionalidade de edição em tempo real no ProposalEditor
  - Interface consistente entre criação e edição de propostas

### Sistema Completo de Gestão de Metas e Premiações no SupervisorPortal (Jan 14, 2025)
- **Implementado sistema completo de metas individuais e de equipe**:
  - Criadas tabelas vendor_targets, team_targets e awards no PostgreSQL
  - Interface completa para criação, edição e remoção de metas
  - Sistema de monitoramento de progresso em tempo real
  - Cálculo automático de percentual de atingimento das metas
  - Bônus configuráveis por vendedor e equipe

- **Sistema de premiações e reconhecimento**:
  - Três tipos de premiações: monetary, recognition e bonus
  - Interface para concessão de premiações com descrição e valor
  - Histórico completo de premiações por vendedor
  - Integração com sistema de metas para premiações automáticas

- **Novo SupervisorPortal com 7 seções especializadas**:
  - Dashboard: KPIs, performance por vendedor, visão geral da equipe
  - Metas: Gerenciamento de metas individuais e de equipe
  - Premiação: Sistema de reconhecimento e incentivos
  - Analytics: Análise detalhada de performance com filtros
  - Equipe: Gerenciamento de vendedores e dados de acesso
  - Propostas: Acompanhamento em tempo real de todas as propostas
  - Relatórios: Visualizações executivas e exportação de dados

- **APIs RESTful completas implementadas**:
  - `/api/vendor-targets` - CRUD completo para metas individuais
  - `/api/team-targets` - CRUD completo para metas de equipe
  - `/api/awards` - CRUD completo para premiações
  - `/api/analytics/vendor/:id` - Estatísticas por vendedor
  - `/api/analytics/team` - Estatísticas da equipe
  - Filtros por mês/ano para análises temporais

- **Sistema de progresso visual aprimorado**:
  - Barras de progresso coloridas por performance
  - Cálculos automáticos de atingimento de metas
  - Visualizações em tempo real de KPIs
  - Dashboard executivo com métricas consolidadas

- **Dados de demonstração inseridos**:
  - 5 metas individuais para diferentes vendedores
  - 1 meta de equipe para Janeiro 2025
  - 4 premiações de exemplo com diferentes tipos

### Sistema de Sincronização em Tempo Real para Propagação Instantânea (Jan 14, 2025)
- **Implementado sistema completo de sincronização em tempo real**:
  - Criado realTimeSync.ts para forçar atualizações instantâneas entre todos os portais
  - Integrado ao ProposalGenerator para notificar criação de propostas em tempo real
  - Ativado polling agressivo (1 segundo) em todos os portais para máxima responsividade
  - Sistema força invalidação e refetch imediato quando vendedor gera link do cliente

- **Correção completa das informações das propostas no SupervisorPortal**:
  - Dados das propostas agora exibem informações completas (nome empresa, CNPJ, vendedor, plano, valor)
  - Campos extraídos corretamente da estrutura contractData da API
  - Filtro de vendedores usa dados reais do banco de dados
  - Links direcionam corretamente para Google Drive e portal do cliente

- **Garantia de propagação instantânea entre portais**:
  - Quando vendedor gera link, dados aparecem instantaneamente em Vendor, Implementation, Supervisor e Financial
  - Sistema de notificações em tempo real com logging para debug
  - Intervalo de atualização reduzido para 1 segundo para máxima responsividade
  - Invalidação inteligente de cache com refetch forçado

### Enhanced Implementation Portal with Additional Actions (Jan 14, 2025)
- **Added 13 new action buttons to Implementation Portal**:
  - Preserved all original actions: Ver Drive, Editar, Automação, Sheets, Link Cliente, Notificar
  - Added new actions: Copiar Link, WhatsApp, Email, Download, Remover, Link Externo, Aprovar, Alerta, Compartilhar, Mensagem Interna
  - Total of 16 action buttons per proposal with unique colors and tooltips
  - Each action has functional implementation with real notifications and external integrations

- **Converted table layout to vertical card layout with progress bars**:
  - Changed from horizontal table to vertical card-based layout
  - Clients displayed one below the other in individual cards
  - Vertical progress bars on the left side of each card showing completion percentage
  - Cards include all proposal information: ID, client name, CNPJ, vendor, plan, value, date
  - Status and priority dropdowns remain functional with color coding
  - All 16 action buttons displayed horizontally below each proposal card

- **Maintained existing functionality while expanding capabilities**:
  - All original Implementation portal features preserved
  - Status editing, priority management, and proposal editing unchanged
  - Added WhatsApp link sharing with pre-formatted messages
  - Email integration with subject and body templates
  - Copy link functionality with success notifications
  - Document download and sharing capabilities

- **Added Sales Tracking to Supervisor Portal**:
  - Integrated visual sales tracking similar to Implementation portal layout
  - Vertical card layout with progress bars showing completion percentage
  - Read-only view - no editing capabilities for status or priority
  - Real-time synchronization with database proposals
  - Limited action buttons: View Drive, Client Link, and Reports only
  - Clear "Somente leitura" (Read Only) indicators throughout interface

### Individual Vendor Authentication System Implementation (Jan 14, 2025)
- **Implemented complete individual vendor authentication**:
  - Email-based login system for each vendor with personalized access
  - Password authentication using default password 120784 for all vendors
  - Individual vendor data isolation - each vendor sees only their own proposals/clients
  - Real authentication API endpoint `/api/vendor/login` with proper validation

- **12 Specific Vendors Registered in PostgreSQL Database**:
  1. Ana Caroline Terto - comercial14@abmix.com.br - Password: 120784
  2. Bruna Garcia - comercial10@abmix.com.br - Password: 120784
  3. Fabiana Ferreira - comercial17@abmix.com.br - Password: 120784
  4. Fabiana Godinho - comercial@abmix.com.br - Password: 120784
  5. Fernanda Batista - comercial18@abmix.com.br - Password: 120784
  6. Gabrielle Fernandes - comercial3@abmix.com.br - Password: 120784
  7. Isabela Velasquez - comercial4@abmix.com.br - Password: 120784
  8. Juliana Araujo - comercial6@abmix.com.br - Password: 120784
  9. Lohainy Berlino - comercial15@abmix.com.br - Password: 120784
  10. Luciana Velasquez - comercial21@abmix.com.br - Password: 120784
  11. Monique Silva - comercial2@abmix.com.br - Password: 120784
  12. Sara Mattos - comercial8@abmix.com.br - Password: 120784

- **Enhanced SupervisorPortal Team Management**:
  - Complete vendor listing with Name, Email, Password (120784), Status, and Creation Date
  - Add/Remove vendor functionality for supervisor access
  - Real-time vendor management using React Query for data synchronization
  - Visual display of vendor passwords for supervisor reference
  - Team management interface with proper CRUD operations

- **Personalized VendorPortal Experience**:
  - Welcome message displays "Bem-vinda(o), [Vendor Name]" in portal header
  - Individual vendor session management with proper user context
  - Each vendor portal restricted to their own data and proposals
  - Real vendor name display throughout the interface

- **Database Integration Completed**:
  - PostgreSQL vendors table with all 12 vendors pre-populated
  - Vendor authentication using Drizzle ORM and proper error handling
  - Session management integrated with individual vendor logins
  - Secure password validation with fallback to default password 120784

### Complete Status System Overhaul with ID Column Integration (Jan 13, 2025)
- **Implemented comprehensive status system with 11 specific status types**:
  - Status types: OBSERVAÇÃO (azul claro), ANALISE (verde claro), ASSINATURA DS (amarelo escuro), EXPIRADO (azul forte), IMPLANTADO (verde forte), AGUAR PAGAMENTO (rosa), ASSINATURA PROPOSTA (amarelo claro), AGUAR SELEÇÃO DE VIGENCIA (laranja), PENDÊNCIA (vermelho), DECLINADO (roxo), AGUAR VIGÊNCIA (azul claro)
  - Exact color mapping with specific Tailwind CSS classes for precise color matching
  - Centralized status management in shared/statusSystem.ts with real-time synchronization

- **Added ID column integration across all portals**:
  - ID column placed before CLIENTE column in all tables (SupervisorPortal, VendorPortal, FinancialPortal, ImplantacaoPortal)
  - Clickable ID buttons that open Google Drive/Sheets folders automatically
  - ID format: ABM001, ABM002, etc. (converted from proposal IDs)
  - Integration ready for Google Drive automation workflows

- **Status control and real-time updates**:
  - Only ImplantacaoPortal can edit status through dropdown selection
  - All other portals (Vendor, Client, Financial, Supervisor) show read-only status badges
  - Real-time status synchronization across all modules using StatusManager
  - Status changes immediately reflect in all connected portals

- **Enhanced portal functionality**:
  - Updated all status filtering dropdowns with new status options
  - Maintained existing functionality while integrating new status system
  - Status badges with proper color coding matching user specifications
  - Progress tracking systems preserved and working with new status structure

- **Colored status dropdown in Implementation portal**:
  - Status selection dropdown shows colored options matching exact status colors
  - Each option in dropdown displays proper background and text colors
  - Visual consistency between dropdown options and status badges
  - Only Implementation portal can edit status, all others show read-only badges

- **Real-time synchronization validated**:
  - All portals (Vendor, Client, Financial, Supervisor) receive immediate status updates
  - StatusManager singleton ensures consistent state across all modules
  - Status changes in Implementation portal instantly reflect in all other portals
  - Proper ID column integration with clickable links to Google Drive folders

### System Fixes and Real API Integration (Jan 14, 2025)
- **Fixed useProposals Hook and Real Data Integration**:
  - Corrected useProposals hook to properly load proposals from PostgreSQL database
  - Replaced all simulated data with real API calls across all portals
  - Implementation portal now shows actual proposals from database with real-time updates
  - Financial portal integrated with authentic proposal data and working filters

- **Enhanced Implementation Portal Actions**:
  - Expanded from 3 to 6 actions per proposal: Ver Drive, Editar, Automação, Sync Sheets, Link Cliente, Notificar
  - All action buttons functional with proper tooltips and visual feedback
  - Color-coded action buttons for different functionalities
  - Real-time synchronization between portals maintained

- **"Gerar Proposta para o Mesmo Link" Button Fix**:
  - Fixed setVendorObservations undefined error in ProposalGenerator
  - Button now correctly maintains contract data while clearing personal data
  - Preserves company information, CNPJ, plan details, and pricing
  - Clears only titular/dependent data, internal notes, and attachments
  - Maintains consistent behavior with user expectations

- **Database Integration Improvements**:
  - 8 total proposals in database with various statuses for testing
  - All portals synchronized with real PostgreSQL data
  - Status management working correctly across Implementation portal
  - Proposal creation flow fully functional from Vendor to Implementation portal

### SupervisorPortal Cleanup (Jan 13, 2025)
- **Removed "Propostas Ativas" section from SupervisorPortal**:
  - Cleaned up dashboard to focus on team performance and KPIs
  - Removed redundant proposal listing as requested by user
  - Maintained vendor performance tracking and recent activity sections
  - Simplified interface for better supervisor workflow focus

### Complete Digital Health Plan Proposal Form (Jan 12, 2025)
- **Rebuilt ProposalGenerator with comprehensive form structure**:
  - Contract data section with company information and plan details
  - Complete personal data forms for titular and unlimited dependents
  - Vendor-only internal controls (meeting data, discount authorization, financial notes)
  - Multi-method document upload: drag-drop, camera capture, file browser
  - Save draft and generate client link functionality

- **Multiple Titulares System (Jan 12, 2025)**:
  - Added multiple titulares functionality identical to dependents structure
  - "+" button to add new titulares with proper numbering (Titular 1, Titular 2, etc.)
  - Remove button available when more than one titular exists
  - All form fields working correctly for each titular
  - Consistent behavior between titulares and dependents

- **Client Portal Integration (Jan 12, 2025)**:
  - New "Completar Proposta" tab in client portal
  - Contract data appears pre-filled from vendor (read-only with lock icon)
  - Identical form structure to vendor with multiple titulares and dependents
  - Separate document upload sections (vendor attachments + client attachments)
  - Form validation and submission with success confirmation
  - Removed redundant "Formulário" tab for cleaner navigation

- **Module Removal and Simplification (Jan 12, 2025)**:
  - Removed "Formulário Digital" module from vendor portal dashboard
  - Consolidated proposal creation into "Nova Proposta" workflow
  - Updated Quick Actions grid from 4 to 3 columns for cleaner layout
  - Removed ProposalForm component imports and references
  - Streamlined vendor portal navigation for better user experience

- **Cotação Integration into Nova Proposta (Jan 12, 2025)**:
  - Transferred complete quotation module into ProposalGenerator component
  - Added "Anexar Cotação" section with all original functionality:
    - Number of lives input field
    - Insurance operator selection dropdown
    - Dynamic age management (add/remove beneficiaries)
    - Quotation file upload with format validation
    - Generate quotation calculation button
    - Clear quotation form functionality
  - Updated vendor portal Quick Actions to 2 columns (Nova Proposta + Acompanhar)
  - Removed standalone "Gerar Cotação" button from dashboard
  - Enhanced "Nova Proposta" description to include quotation capability

- **Form Features Implemented**:
  - All required fields from user specifications (CPF, RG, birth date, complete address, etc.)
  - Expandable dependents with parentesco field
  - Large, responsive buttons and intuitive interface
  - Proper field validation and error handling
  - File attachment management with preview and removal
  - Internal vendor fields toggle (show/hide with eye icon)

- **Integration Completed**:
  - Form integrated into existing VendorPortal "Nova Proposta" workflow
  - Maintained consistent "Cotações" terminology across portals
  - Generated unique client links for completing personal data
  - Client and vendor workflows properly separated
  - Real-time data synchronization between vendor and client portals

- **Enhanced Success Screen and Field Corrections (Jan 13, 2025)**:
  - Added "Gerar Proposta para o Mesmo Link" button in success screen
  - Implemented comprehensive link sharing options: Copy, Email, WhatsApp, Internal Panel
  - Corrected "Período mínimo de vigência" field positioning and dropdown options
  - Fixed "Livre adesão" and "Compulsório" checkboxes layout to match client panel
  - Vendor observations field properly editable for vendors, read-only for clients
  - Resolved controlled component errors in form validation
  - Maintained visual consistency between vendor and client portals

### Complete Implementation Portal with Full Editing Capabilities (Jan 14, 2025)
- **Comprehensive Proposal Editor Implementation**:
  - Created ProposalEditor component with full proposal editing capabilities
  - All fields from vendor form available for editing (contract data, personal data, internal controls)
  - Live field editing with click-to-edit functionality using pencil icons
  - Real-time integration with Google Sheets and Google Drive
  - Change tracking system with user attribution and timestamps
  - Complete document management (upload, download, replace, delete)

- **Proposal Selection System**:
  - ProposalSelector modal with advanced filtering (status, priority, vendor, search)
  - Visual proposal cards showing ID, client, progress, and key metrics
  - Direct navigation to editing interface from proposal list
  - Integration with existing status and priority systems

- **Enhanced Implementation Portal Dashboard**:
  - "Selecionar Proposta" button for easy navigation
  - Quick action buttons for Google Sheets sync and Drive access
  - Priority editing via dropdown (High=red, Medium=yellow, Low=green)
  - Direct edit access from proposal table rows
  - Seamless integration between list view and detailed editor

- **Full Data Access and Control**:
  - Complete visibility of all proposal data including internal vendor controls
  - Editable fields for all sections: contract, personal data, documents, internal notes
  - Document upload/management with category tracking (vendor vs client uploads)
  - Live progress tracking and completion status
  - Change history with audit trail functionality

- **Real-time Synchronization**:
  - Immediate Google Sheets updates on field changes
  - Google Drive integration for document management
  - Status changes propagate to all portals instantly
  - Change notifications with user feedback
  - Backup and synchronization controls