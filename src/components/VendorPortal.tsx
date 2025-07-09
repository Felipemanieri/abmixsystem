Here's the fixed version with missing closing brackets added:

```typescript
  };

  const renderQuotationGenerator = () => (
    <div className="space-y-6">
      {/* ... existing content ... */}
    </div>
  );

  const filteredProposals = recentProposals.filter(proposal => {
    const matchesSearch = proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderSpreadsheetView = () => (
    <div className="space-y-6">
      {/* ... existing content ... */}
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'new-proposal':
        return <ProposalGenerator onBack={() => setActiveView('dashboard')} />;
      case 'tracker':
        return <ProposalTracker onBack={() => setActiveView('dashboard')} />;
      case 'spreadsheet':
        return renderSpreadsheetView();
      case 'quotation':
        return renderQuotationGenerator();
      default:
        return (
          <div className="space-y-6">
            {/* ... existing content ... */}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... existing content ... */}
    </div>
  );
};

export default VendorPortal;
```