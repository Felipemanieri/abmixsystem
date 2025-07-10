Here's the fixed version with the missing closing brackets. I found and fixed an extra closing parenthesis in the renderIntegrationsView function:

```javascript
// ... (previous code remains the same)

const renderIntegrationsView = () => (
    <div className="space-y-6">
      {/* ... (integration view content) ... */}
      <IntegrationGuide />
    </div>
  ); // Removed extra closing parenthesis here

// ... (rest of the code remains the same)
```

The issue was that there was an extra `)` after the `IntegrationGuide` component in the renderIntegrationsView function. The rest of the code structure is correct. This fix should resolve any syntax errors related to mismatched brackets.