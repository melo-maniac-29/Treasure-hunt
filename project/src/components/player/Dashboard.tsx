import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Map, Camera, Trophy, Settings, LogOut } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { NodeMap } from './NodeMap';
import { QRScanner } from './QRScanner';
import { QuestionForm } from './QuestionForm';
import { Leaderboard } from './Leaderboard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { currentTeam } = useGame();
  const [activeTab, setActiveTab] = useState<'map' | 'scanner' | 'leaderboard'>('map');
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);

  if (!currentTeam) return null;

  const handleValidScan = (nodeId: number) => {
    setCurrentQuestion(nodeId);
  };

  const handleSubmitAnswer = () => {
    setCurrentQuestion(null);
    setActiveTab('map');
  };

  const tabs = [
    { id: 'map' as const, label: 'Journey', icon: Map },
    { id: 'scanner' as const, label: 'Scanner', icon: Camera },
    { id: 'leaderboard' as const, label: 'Rankings', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="h-8 w-8 text-amber-400" />
              <div>
                <h1 className="text-xl font-bold text-amber-100">{currentTeam.name}</h1>
                <p className="text-emerald-200 text-sm">
                  Stage {currentTeam.currentStage} • {currentTeam.score} points
                </p>
              </div>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {currentQuestion ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestion(null)}
              className="mb-4"
            >
              ← Back to Scanner
            </Button>
            <QuestionForm nodeId={currentQuestion} onSubmit={handleSubmitAnswer} />
          </motion.div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-emerald-800 shadow-lg'
                          : 'text-emerald-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'map' && <NodeMap />}
              {activeTab === 'scanner' && <QRScanner onValidScan={handleValidScan} />}
              {activeTab === 'leaderboard' && <Leaderboard />}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};