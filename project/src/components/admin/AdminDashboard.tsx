import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, FileText, Users, Settings, Eye, LogOut } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { NodeCreator } from './NodeCreator';
import { SubmissionReview } from './SubmissionReview';
import { GameMonitor } from './GameMonitor';
import { Button } from '../ui/Button';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { nodes, submissions, teams } = useGame();
  const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'submissions' | 'monitor'>('overview');

  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Eye },
    { id: 'nodes' as const, label: 'Nodes', icon: Plus },
    { id: 'submissions' as const, label: 'Submissions', icon: FileText, badge: pendingSubmissions },
    { id: 'monitor' as const, label: 'Monitor', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-amber-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-amber-400" />
              <div>
                <h1 className="text-xl font-bold text-amber-100">Admin Dashboard</h1>
                <p className="text-emerald-200 text-sm">Treasure Hunt Management</p>
              </div>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Exit Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all duration-200 relative ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-800 shadow-lg'
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
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
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Plus className="h-6 w-6 text-emerald-600" />
                  <h3 className="font-bold text-emerald-800">Total Nodes</h3>
                </div>
                <p className="text-3xl font-bold text-emerald-800">{nodes.length}</p>
                <p className="text-emerald-600 text-sm">Active treasure locations</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-amber-600" />
                  <h3 className="font-bold text-emerald-800">Active Teams</h3>
                </div>
                <p className="text-3xl font-bold text-emerald-800">{teams.length}</p>
                <p className="text-emerald-600 text-sm">Currently playing</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-6 w-6 text-red-600" />
                  <h3 className="font-bold text-emerald-800">Pending Reviews</h3>
                </div>
                <p className="text-3xl font-bold text-emerald-800">{pendingSubmissions}</p>
                <p className="text-emerald-600 text-sm">Awaiting approval</p>
              </div>
            </div>
          )}
          
          {activeTab === 'nodes' && <NodeCreator />}
          {activeTab === 'submissions' && <SubmissionReview />}
          {activeTab === 'monitor' && <GameMonitor />}
        </motion.div>
      </div>
    </div>
  );
};