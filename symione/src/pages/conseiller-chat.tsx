import React from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { ConseillerChatView } from '../components/ConseillerChatView';

function Page() {
  return (
    <div className="min-h-screen">
      <ConseillerChatView />
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<Page />);
}


