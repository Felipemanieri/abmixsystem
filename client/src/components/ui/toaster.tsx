import React from 'react';

interface ToasterProps {}

export function Toaster({}: ToasterProps) {
  return <div id="toast-container" className="fixed top-4 right-4 z-50" />;
}