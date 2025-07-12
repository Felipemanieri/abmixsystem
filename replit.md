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