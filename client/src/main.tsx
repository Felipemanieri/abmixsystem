console.log('Starting application...');

import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('Imports loaded successfully');

function TestApp() {
  console.log('TestApp component rendering...');
  return React.createElement('div', {
    style: { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }
  }, React.createElement('h1', { style: { color: 'green' } }, '✅ React está funcionando!'));
}

console.log('TestApp component defined');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, finding root element...');
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    console.log('Root element found, creating React root...');
    const root = createRoot(rootElement);
    console.log('React root created, rendering app...');
    root.render(React.createElement(TestApp));
    console.log('App rendered successfully!');
  } else {
    console.error('Root element not found!');
    document.body.innerHTML = '<h1 style="color: red;">ERROR: Root element not found!</h1>';
  }
});

console.log('Script loaded completely');
