Here's the fixed version with the missing closing brackets and proper structure:

```typescript
import React, { useState } from 'react';
import { LogOut, DollarSign, TrendingUp, CheckCircle, AlertCircle, Eye, Calculator, Calendar, FileText, User, Bell, CreditCard, PieChart, BarChart3, Wallet, MessageSquare, Zap, Users, Upload, Database, Filter, Search } from 'lucide-react';
import AbmixLogo from './AbmixLogo';
import ActionButtons from './ActionButtons';
import InternalMessage from './InternalMessage';
import FinancialAutomationModal from './FinancialAutomationModal';
import NotificationCenter from './NotificationCenter';
import ClientForm from './ClientForm';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

interface FinancialPortalProps {
  user: any;
  onLogout: () => void;
}

interface Transaction {
  id: string;
  client: string;
  plan: string;
  value: string;
  type: 'income' | 'expense' | 'pending';
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  category: string;
}

const FinancialPortal: React.FC<FinancialPortalProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInternalMessage, setShowInternalMessage] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [selectedProposalForAutomation, setSelectedProposalForAutomation] = useState<{id: string, client: string} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  const [activeTab, setActiveTab] = useState<'dashboard' | 'proposals' | 'clients' | 'analysis' | 'forms'>('dashboard');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { getClientDocuments } = useGoogleDrive();

  // ... [rest of the code remains unchanged until the first incomplete section]

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Ano</option>
              </select>
            </div>
          </div>
        </div>
      </main>

      {/* Internal Message Modal */}
      {showInternalMessage && (
        <InternalMessage 
          isOpen={showInternalMessage}
          onClose={() => setShowInternalMessage(false)}
          currentUser={{
            name: user?.name || 'Usuário Financeiro',
            role: 'financial' 
          }}
        />
      )}
      
      {/* Automation Modal */}
      {showAutomationModal && selectedProposalForAutomation && (
        <FinancialAutomationModal
          isOpen={showAutomationModal}
          onClose={() => setShowAutomationModal(false)}
          proposalId={selectedProposalForAutomation.id}
          clientName={selectedProposalForAutomation.client}
        />
      )}
    </div>
  );
};

export default FinancialPortal;
```