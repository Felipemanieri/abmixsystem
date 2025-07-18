import { createRoot } from 'react-dom/client';
import SimpleApp from './SimpleApp.tsx';
import './index.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<SimpleApp />);
} else {
  console.error('Root element not found');
}
