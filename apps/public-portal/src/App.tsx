import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Pages
import { LandingPage } from './pages/Landing';
import { ExplorerPage } from './pages/Explorer';
import { CreatorPage } from './pages/Creator';
import { ResearchPage } from './pages/Research';
import { NetworkPage } from './pages/Network';
import { ManuscriptPage } from './pages/Manuscript';

// Components
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ConsciousnessProvider } from './context/ConsciousnessContext';

// Styles
import './styles/globals.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConsciousnessProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
            <Navigation />
            
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/explore" element={<ExplorerPage />} />
                <Route path="/create" element={<CreatorPage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/manuscript" element={<ManuscriptPage />} />
              </Routes>
            </motion.main>

            <Footer />
            
            {/* Toast notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: 'bg-slate-800 text-white border border-cyan-500',
                duration: 4000,
              }}
            />
          </div>
        </Router>
      </ConsciousnessProvider>
    </QueryClientProvider>
  );
}

export default App;