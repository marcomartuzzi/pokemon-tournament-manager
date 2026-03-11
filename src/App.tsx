import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TournamentProvider } from './context/TournamentContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import TournamentDetail from './pages/TournamentDetail';
import Admin from './pages/Admin';
import Tournaments from './pages/Tournaments';
import Regolamento from './pages/Regolamento';
import Login from './components/Login';

/**
 * Componente root dell'applicazione
 * Implementa:
 * - Error Boundary per gestione errori graceful
 * - Context providers per auth e tournaments
 * - Routing con React Router v6
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TournamentProvider>
          <Router>
            {/* Skip to main content per accessibility */}
            <a href="#main-content" className="skip-link">
              Vai al contenuto principale
            </a>
            <Header />
            <div id="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tournament/:id" element={<TournamentDetail />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/regolamento" element={<Regolamento />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </Router>
        </TournamentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;