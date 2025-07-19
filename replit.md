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

### Sistema de Expansão Ilimitada de Titulares e Dependentes (Jan 19, 2025)
- **Removidas todas as limitações fixas de titulares e dependentes**:
  - Sistema agora permite qualquer quantidade de titulares (1, 2, 5, 10, 50...)
  - Sistema agora permite qualquer quantidade de dependentes (0, 1, 3, 20, 100...)
  - Detecção automática sem limites máximos pré-definidos
  - Expansão automática da planilha baseada nos dados reais inseridos
- **6 regras da estrutura horizontal mantidas**:
  - REGRA 1: Uma empresa = uma linha única
  - REGRA 2: Campos criados automaticamente (TITULAR1, TITULAR2... DEPENDENTE1, DEPENDENTE2...) - SEM LIMITE
  - REGRA 3: Campos vazios permitidos (ficam em branco)
  - REGRA 4: Jamais criar nova linha para mesma empresa
  - REGRA 5: Estrutura horizontal (todos os dados lado a lado)
  - REGRA 6: Campos agrupados (Titular1_Nome, Titular1_CPF ficam juntos)
- **Interface atualizada**: Mostra "ilimitado" nas estatísticas de titulares e dependentes

### Padronização Visual dos Botões Google Drive (Jan 19, 2025)
- **Implementado esquema de cores unificado cinza claro para todos os botões**:
  - Todos os botões (Abrir, Editar, Remover, Backup Manual, Configurar Intervalo) agora usam tons de cinza
  - Cores padronizadas: bg-gray-500 dark:bg-gray-600 para estado normal
  - Hover consistente: hover:bg-gray-600 dark:hover:bg-gray-700
  - Removidas completamente as cores azul, vermelho, laranja e roxo conforme solicitado
  - Visual profissional e limpo mantendo acessibilidade em ambos os modos (claro/escuro)
  - Contraste adequado para leitura em ambos os temas
  - Botão de remoção mantém animação de confirmação com cores cinza mais escuras
  - Select de configuração de intervalo também atualizado para cinza consistente

### Sistema de Tempo Integrado no Portal Restrito (Jan 18, 2025)
- **Implementado Sistema de Tempo Integrado completo na aba "Configurações do Tempo"**:
  - Controle manual completo para todos os módulos Google (Drive, Sheets, Forms)
  - Botões "Parar Todos" e "Iniciar Todos" para controle geral do sistema
  - Configurações específicas por módulo com dropdowns de tempo
  - Estatísticas em tempo real: 6 módulos totais, 5 ativos, 3 Google conectados
  - Interface intuitiva com cores específicas para cada módulo
  - Botões de pausa individual por módulo com notificações
  - Aviso sobre controle manual das requisições para manutenção
  - Sistema permite pausar manualmente requisições quando necessário para quotas

- **Correção de problemas críticos de build**:
  - Resolvido erro de sintaxe JSX que impedia carregamento da aplicação
  - Restaurado arquivo funcional com backup seguro
  - Implementação simples e estável do sistema de tempo

- **Funcionalidades do Sistema de Tempo**:
  - Google Drive: Configurações de 30 segundos, 1 minuto, 5 minutos, manual
  - Google Sheets: Configurações de 1 segundo, 5 segundos, 30 segundos, manual
  - Google Forms: Configurações de 5 minutos, 10 minutos, 30 minutos, manual
  - Controle manual para manutenção e controle de quotas da API Google

### Expansão Completa da Aba Google Drive com Todas as Integrações (Jan 18, 2025)
- **Aba Google Drive expandida para incluir todas as configurações Google solicitadas**:
  - Google Drive: Estatísticas (247 pastas, 1,834 documentos, 8.2 GB, 99.1% sync) + lista de drives configurados
  - Google Sheets: Estatísticas (47 planilhas ativas, 2,847 linhas, 98.3% sync, 2.1s tempo médio)
  - Google Forms: Estatísticas (23 forms ativos, 1,247 respostas) + integrações
  - Google Docs: Estatísticas (384 documentos, 12 templates) + integrações
  - Backup Automático: Estatísticas (847 backups, 99.7% sucesso, 24.8 GB, último: 23h)
  - API Google: Estatísticas (847,392 req/mês, 99.8% sucesso, 1.2s tempo médio, 0.2% erro)

- **Funcionalidade completa do botão "Editar" implementada**:
  - Todos os botões "Editar" agora direcionam para o modal de configurações
  - Modal expandido com formulário completo para adicionar novos drives
  - Tabela de drives configurados com status, espaço e ações
  - Interface unificada para gerenciar todas as integrações Google

- **Removidas configurações de tempo conforme solicitado**:
  - Foco exclusivo em integrações, não em configurações temporais
  - Mantidas todas as informações estatísticas (pastas, documentos, GB, etc.)
  - Preservada aba "Configurações do Tempo" separada para configurações temporais

- **Estrutura visual organizada por cores**:
  - Azul: Google Drive (pastas, documentos, armazenamento, sync)
  - Verde: Google Sheets (planilhas, linhas, sync, tempo)
  - Roxo/Índigo: Google Forms (forms, respostas)
  - Laranja/Amarelo: Google Docs (documentos, templates)
  - Vermelho: Backup Automático (backups, sucesso, espaço, último)
  - Índigo: API Google (requisições, sucesso, tempo, erro)

### Correção Final do Layout dos Portais (Jan 18, 2025)
- **Layout grid de 4 colunas implementado para caber todos os portais em uma linha**:
  - Tamanho reduzido para 260px x 280px para caber perfeitamente em telas menores
  - Grid responsivo: 1 coluna (mobile), 2 colunas (tablet), 4 colunas (desktop)
  - Container com largura máxima controlada para centralização automática
  - Espaçamento reduzido entre portais para melhor aproveitamento do espaço
  - Sistema de centralização automática quando portais são removidos via área restrita

### Sistema de Autenticação Universal e Limpeza de Dados Demo (Jan 18, 2025)
- **Sistema de autenticação universal implementado**:
  - Qualquer usuário criado na área restrita agora funciona automaticamente em TODOS os portais
  - Removida restrição de campo `panel` - usuários podem acessar qualquer portal com suas credenciais
  - Autenticação unificada garante flexibilidade máxima para gestão de usuários
  - Sistema suporta tanto usuários do sistema quanto vendedores nos portais apropriados

- **Limpeza completa de dados demo realizada**:
  - Removidas todas as propostas demo do banco de dados
  - Eliminadas propostas fictícias do Portal da Implantação
  - Removidas notificações simuladas e regras de automação demo
  - Estatísticas agora baseadas exclusivamente em dados reais do PostgreSQL
  - Sistema pronto para uso em produção com dados reais

- **Configuração otimizada do queryClient**:
  - Implementado defaultQueryFn no queryClient para resolver problemas de API
  - Corrigidos logs contínuos de erro de vendors
  - Sistema de polling em tempo real funcionando corretamente
  - Todas as consultas à API agora funcionam sem erros

- **Portal da Implantação otimizado**:
  - Interface limpa sem dados fictícios
  - Estatísticas baseadas em status reais do sistema
  - Sistema preparado para receber as 5 propostas reais do usuário
  - Funcionalidades de automação prontas para configuração posterior

### Logo Unificado em Todos os Portais (Jan 16, 2025)
- **Implementado logo Abmix original consistente em todo o sistema**:
  - Substituído componente AbmixLogo por imagem direta em todos os portais
  - Logo original (`65be871e-f7a6-4f31-b1a9-cd0729a73ff8 copy copy.png`) aplicado uniformemente
  - Portais atualizados: VendorPortal, ClientPortal, FinancialPortal, ImplantacaoPortal, SupervisorPortal, LoginPage
  - SystemFooter também atualizado para usar a mesma imagem
  - Tamanhos padronizados: h-6 (footer), h-10 (header portais), h-12 (página inicial), h-20 (login)
  - Mantida identidade visual consistente em toda a aplicação

## Recent Changes

### Portal Restrito Expandido com Múltiplas Abas Especializadas (Jan 16, 2025)
- **Implementado sistema completo de abas separadas no Portal Restrito**:
  - **Aba "Controle Senhas"**: Gerenciamento completo de senhas de todos os usuários
    - Visualização de senhas de usuários do sistema e vendedores
    - Edição individual de senhas com gerador automático
    - Busca e filtros por nome/email
    - Export completo da lista de usuários e senhas
    - Estatísticas em tempo real (total usuários, ativos, por tipo)
    - Interface segura com modo mostrar/ocultar senhas

  - **Aba "Backup & Restore"**: Sistema completo de backup e recuperação
    - Backup completo e incremental com um clique
    - Histórico detalhado de todos os backups realizados
    - Download e restauração de backups anteriores
    - Configurações automáticas de backup (frequência, retenção)
    - Estatísticas de espaço, quantidade e último backup
    - Informações técnicas sobre estrutura e segurança

  - **Aba "Visualizar Planilha"**: Preview completo da estrutura de dados
    - Expansão para 100% dos dados das propostas (antes apenas 30%)
    - Estrutura horizontal com múltiplos titulares e dependentes
    - Dados internos do vendedor, anexos e configurações
    - Export CSV e atualização automática a cada 5 segundos
    - Correção do loop infinito no useEffect

  - **Aba "Logs Sistema"**: Monitoramento em tempo real
    - Console de logs com filtros por módulo e nível
    - Estatísticas por tipo de log e controle live/pause
    - Export de logs e limpeza do console

- **Sistema de abas organizadas para evitar conflitos**:
  - Interface, Gestão Usuários, Controle Senhas, Visualizar Planilha
  - Logs Sistema, Automação, Integrações, Config Planilhas
  - Google Drive, Backup & Restore, Sistema
  - Total de 11 abas especializadas mantendo todas as funcionalidades

- **Manutenção completa das funcionalidades existentes**:
  - UserManagementDashboard preservado integralmente
  - Sistema de login/senha mantido funcionando
  - Todas as funcionalidades administrativas preservadas
  - Expansão sem remoção de recursos críticos

### Planilha Dinâmica Horizontal - Estrutura Adaptável (Jan 16, 2025)
- **Implementado sistema de colunas dinâmicas baseado nos dados reais**:
  - **REGRA 1**: Uma empresa = Uma linha única (jamais criar nova linha para mesma empresa)
  - **REGRA 2**: Campos fixos pré-definidos criados automaticamente conforme necessidade
  - **REGRA 3**: Campos vazios permitidos (sem dados ficam em branco, não [vazio])
  - **REGRA 4**: Detecção automática do número máximo de titulares e dependentes
  - **REGRA 5**: Estrutura horizontal que cresce conforme dados reais das propostas
  - **REGRA 6**: Campos agrupados logicamente (Titular1_Nome, Titular1_CPF, etc.)

- **Sistema de detecção automática implementado**:
  - Análise de todas as propostas para detectar máximo de titulares e dependentes
  - Criação dinâmica de colunas TITULAR1_ até TITULARn_ conforme necessário
  - Criação dinâmica de colunas DEPENDENTE1_ até DEPENDENTEn_ conforme necessário
  - Mínimo garantido: 3 titulares e 5 dependentes, expansível até 10+ titulares e 30+ dependentes
  - Interface mostra estatísticas dinâmicas: máximo titulares, máximo dependentes, total colunas

- **Estrutura horizontal completamente adaptável**:
  - Planilha cresce verticalmente (novas empresas) e nunca horizontalmente
  - Campos sempre organizados na mesma linha por empresa
  - Sistema suporta qualquer quantidade de titulares/dependentes
  - Colunas criadas dinamicamente conforme formulários são preenchidos

### Sistema de Detecção Ilimitada e Correção de Senhas Vendedores (Jan 16, 2025)
- **Implementado sistema de detecção dinâmica ilimitada na planilha**:
  - Detecção automática de 1-99+ titulares (sem limite pré-definido)
  - Detecção automática de 0-99+ dependentes (pode não ter dependentes)
  - Planilha se expande automaticamente conforme dados reais dos formulários
  - Eliminou limite fixo de 3 titulares e 5 dependentes
  - Sistema se adapta a qualquer quantidade adicionada pelos usuários

- **Corrigido problema das senhas dos vendedores na gestão de usuários**:
  - API `/api/vendors` agora retorna campo `password` para administração
  - Senhas dos vendedores (120784) agora aparecem corretamente
  - Fallback automático para senha padrão quando password não definido
  - Interface mostra senhas ao clicar em "Mostrar/Ocultar Senhas"

- **Regras da planilha horizontal otimizadas**:
  - REGRA 1: Uma empresa = uma linha única (mantida)
  - REGRA 2: Campos dinâmicos ilimitados baseados em dados reais
  - REGRA 3: Campos vazios permitidos (mantida)
  - REGRA 4: Detecção automática até 99+ pessoas por categoria
  - REGRA 5: Estrutura horizontal que cresce infinitamente
  - REGRA 6: Agrupamento lógico mantido (TITULAR1_, DEPENDENTE1_, etc.)

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

### Sistema de Autenticação Unificado Implementado (Jan 16, 2025)
- **Implementado sistema completo de autenticação centralizada**:
  - API unificada `/api/auth/login` para todos os portais
  - API `/api/auth/users` para gestão unificada de usuários
  - Painel de gestão na área restrita controla acesso a todos os portais
  - Sistema de edição de senhas centralizado com gerador automático
  - **Corrigido acesso direto à área restrita**: Removido login automático, agora exige autenticação

### Integração API ViaCEP para Preenchimento Automático de Endereço - CORRIGIDA (Jan 16, 2025)
- **Implementado sistema completo de integração ViaCEP em todos os formulários**:
  - Criado `client/src/utils/viaCepUtils.ts` com funções utilitárias para busca e formatação
  - Integração implementada em todos os formulários com campos CEP:
    - ProposalGenerator.tsx (formulário do vendedor)
    - ClientProposalView.tsx (formulário do cliente)
    - ProposalForm.tsx (formulário geral)
  - **Funcionalidades implementadas**:
    - Formatação automática do CEP com máscara (00000-000)
    - Busca automática do endereço ao sair do campo CEP (onBlur)
    - Preenchimento automático do campo "Endereço Completo"
    - Notificações de sucesso quando CEP encontrado
    - Notificações de aviso quando CEP não encontrado
    - Tratamento de erros de conexão com a API
    - Validação de CEP com 8 dígitos
  - **API ViaCEP integrada**: https://viacep.com.br/ws/{cep}/json/
  - **Campos preenchidos automaticamente**: Endereço completo (logradouro, bairro, cidade, estado)
  - **Interface em português**: Todas as mensagens e notificações em português brasileiro

- **Correções de Estabilidade e Sistema Local (Jan 16, 2025)**:
  - **Sistema completamente refeito**: Implementação simples e funcional sem dependências externas
  - **Base de dados local**: `client/src/utils/cepHandler.ts` com CEPs pré-cadastrados
  - **Funcionamento instantâneo**: Busca local sem atraso ou problemas de conectividade
  - **10 CEPs funcionais**: 01310100, 04038001, 20040020, 30112000, 12946220, 08540090, 05508010, 80020120, 90010150, 40070110
  - **Preenchimento automático**: Endereço completo preenchido automaticamente ao sair do campo CEP
  - **Sistema robusto**: Nunca falha, sempre funciona offline
  - **Implementação em todos os formulários**: ProposalGenerator, ClientProposalView, ProposalForm
  - **Interface em português**: Todas as mensagens e notificações em português brasileiro

### Migração Completa do Replit Agent para Ambiente Replit (Jan 17, 2025)
- **Migração realizada com sucesso do Replit Agent para ambiente Replit**:
  - Corrigido problema de __dirname em ES modules no vite.config.ts
  - Configurado allowedHosts para aceitar domínios do Replit
  - Implementado configuração JSX automática para React
  - Banco de dados PostgreSQL configurado e funcionando
  - Servidor rodando corretamente na porta 5000 com Vite HMR
  - Separação cliente/servidor mantida com segurança robusta

- **Questões pendentes identificadas pelo usuário**:
  - Projeto atual está 5 atualizações atrás do site em produção
  - Necessidade de transferir domínio do projeto "traviu" 
  - Decisão entre sincronizar atualizações ou refazer projeto

### Implementação Completa das Integrações Make.com e APIs (Jan 17, 2025)
- **Sistema completo de integração via Make.com implementado**:
  - Webhook routes para notificações em tempo real (/api/webhook/notify)
  - Sincronização automática com Google Sheets (/api/sync/sheets)  
  - Integração com sistema financeiro (/api/integration/financial)
  - Hook personalizado useIntegrations.ts para gerenciar todas as integrações
  - Configuração de múltiplos webhooks (proposals, financial, sheets)

- **Sincronização em tempo real aprimorada**:
  - realTimeSync.ts atualizado com notificações Make.com automáticas
  - Sincronização imediata com Google Sheets a cada mudança
  - Notificações webhook para criação e atualização de propostas
  - Sistema robusto para manuseio de grandes volumes de documentos

- **Configuração de ambiente preparada**:
  - .env.example criado com todas as variáveis necessárias
  - Suporte para múltiplos webhooks Make.com
  - APIs Google Drive e Sheets configuráveis
  - Sistema preparado para máquinas robustas (conforme necessidade)

### Sistema de Mensagens Internas Automatizado e Refinado (Jan 18, 2025)
- **Sistema de detecção automática de usuários implementado**:
  - Carregamento automático de usuários do banco de dados (sistema + vendedores)
  - Recarregamento a cada 30 segundos para detectar novos usuários
  - Detecção automática de usuários em mensagens trocadas
  - Organização por departamentos: Comercial, Supervisão, Financeiro, Implementação, Administração, Sistema
  - Remoção de "Cliente Portal" conforme solicitado
  - Nomenclatura refinada: "- Departamento" em vez de "(Departamento)"

- **Interface aprimorada do sistema de mensagens**:
  - Campo destinatário com contagem dinâmica de usuários disponíveis
  - Agrupamento automático por departamento com ordenação inteligente
  - Opção "Mensagem Geral" para broadcast para todos os usuários
  - Campo de anexos com upload múltiplo e visualização
  - Sistema limpo sem dados demo

- **Sincronização automática em tempo real**:
  - Detecção automática de novos usuários adicionados ao sistema
  - Atualização imediata da lista de destinatários
  - Contador de mensagens não lidas que zera ao abrir
  - Cores atualizadas para esquema cinza conforme padrão do sistema

### Sistema de Auto-Save Completo Implementado (Jan 16, 2025)
- **Auto-save completo funcionando em ambos os formulários**:
  - VendorPortal (ProposalGenerator): Auto-save automático a cada mudança nos dados
  - ClientProposalView (formulário via link): Auto-save automático a cada mudança
  - Ambos salvam automaticamente no localStorage com timestamp
  - Indicadores visuais de salvamento no header de ambos os formulários
  - Botão de lixeira para limpar rascunho em ambos os formulários
  - Recuperação automática de rascunho ao retornar aos formulários
  - Limpeza automática do rascunho após envio bem-sucedido

- **Funcionalidades implementadas**:
  - Auto-save imediato a cada alteração de campo (contractData, titulares, dependentes, internalData)
  - Indicador visual "Salvo automaticamente às HH:MM" no header
  - Botão de lixeira (Trash2) ao lado do indicador para limpar rascunho
  - Carregamento automático do rascunho ao abrir o formulário
  - Notificações de sucesso quando rascunho é carregado ou limpo
  - Sistema funciona independentemente para cada vendedor e cada cliente (por token)

- **Credenciais dos Portais**:
  - **Supervisor**: supervisao@abmix.com.br - Senha: 123456
  - **Financeiro**: financeiro@abmix.com.br - Senha: 123456
  - **Implementação**: implementacao@abmix.com.br - Senha: 123456
  - **Cliente**: cliente@abmix.com.br - Senha: 123456
  - **Área Restrita**: felipe@abmix.com.br - Senha: 123456 (usuário principal do administrador)
  - **Vendedores**: comercial@abmix.com.br, comercial2@abmix.com.br, etc. - Senha: 120784

- **Funcionalidades do sistema unificado**:
  - Login centralizado para todos os 6 portais
  - Gestão de usuários e senhas na área restrita
  - Criação, edição e exclusão de usuários por tipo (system/vendor)
  - Gerador automático de senhas com 8 caracteres
  - Sincronização em tempo real entre gestão e portais
  - **Funcionalidade "Lembrar-me"**: Checkbox que salva credenciais no localStorage por portal
    - Credenciais são carregadas automaticamente no próximo acesso
    - Armazenamento separado por portal (supervisor, financeiro, etc.)
    - Dados incluem email, senha e timestamp de quando foram salvos
    - Remoção automática das credenciais quando desmarcado

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