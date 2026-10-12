import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import AiAssistantDrawer from '../ai/AiAssistantDrawer';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--pm-bg-body)' }}>
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Floating AI Assistant Trigger */}
      {isAuthenticated && (
        <button
          type="button"
          onClick={() => setIsAiOpen(prev => !prev)}
          className="btn btn-primary rounded-circle shadow-lg position-fixed d-flex align-items-center justify-content-center"
          style={{
            bottom: 24,
            right: 24,
            width: 54,
            height: 54,
            zIndex: 1040,
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            border: '2px solid rgba(255, 255, 255, 0.4)'
          }}
          title="Open AI Capstone Assistant"
          aria-label="Open AI Assistant"
        >
          <Sparkles size={24} className="text-white" />
        </button>
      )}

      {/* Slide-out AI Assistant Drawer */}
      <AiAssistantDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      <Footer />
    </div>
  );
};

export default MainLayout;
