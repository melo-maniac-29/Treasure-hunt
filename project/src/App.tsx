import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TeamSetup } from './components/player/TeamSetup';
import { Dashboard } from './components/player/Dashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/ui/AdminLogin';
import { Button } from './components/ui/Button';

const AppContent: React.FC = () => {
  const { currentTeam, isAdmin, setCurrentTeam, setAdmin } = useGame();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleLogout = () => {
    setCurrentTeam(null);
    setAdmin(false);
    setShowAdminLogin(false);
  };

  const handleAdminLogin = () => {
    setAdmin(true);
    setShowAdminLogin(false);
  };

  const handleTeamCreated = () => {
    // Team setup complete, dashboard will be shown
  };

  // Show admin login if requested
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  // Show admin dashboard if admin is logged in
  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Show player dashboard if team is selected
  if (currentTeam) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Show team setup by default
  return (
    <div>
      <TeamSetup onTeamCreated={handleTeamCreated} />
      
      {/* Admin Access Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAdminLogin(true)}
          className="shadow-lg"
        >
          Admin Access
        </Button>
      </div>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;