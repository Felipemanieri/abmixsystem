/**
 * Utility function to show toast notifications
 * @param message The message to display in the notification
 * @param type The type of notification (success, error, or info)
 */
export const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};