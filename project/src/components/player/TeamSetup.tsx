import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowRight, Compass } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface TeamSetupProps {
  onTeamCreated: () => void;
}

export const TeamSetup: React.FC<TeamSetupProps> = ({ onTeamCreated }) => {
  const { createTeam, joinTeam, setCurrentTeam, teams } = useGame();
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState(['']);
  const [joinTeamId, setJoinTeamId] = useState('');

  const handleCreateTeam = () => {
    if (teamName && members.filter(m => m.trim()).length > 0) {
      const team = createTeam(teamName, members.filter(m => m.trim()));
      setCurrentTeam(team);
      onTeamCreated();
    }
  };

  const handleJoinTeam = () => {
    const team = joinTeam(joinTeamId);
    if (team) {
      setCurrentTeam(team);
      onTeamCreated();
    }
  };

  const addMember = () => {
    setMembers([...members, '']);
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Compass className="mx-auto h-16 w-16 text-amber-400 mb-4" />
            <h1 className="text-4xl font-bold text-amber-100 mb-2">Treasure Hunt</h1>
            <p className="text-emerald-200">Begin your jungle adventure</p>
          </motion.div>

          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 text-center mb-6">
              Choose Your Path
            </h2>
            
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-3"
                onClick={() => setMode('create')}
              >
                <Plus className="h-5 w-5" />
                Create New Team
              </Button>
              
              {teams.length > 0 && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-3"
                  onClick={() => setMode('join')}
                >
                  <Users className="h-5 w-5" />
                  Join Existing Team
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">Create Your Team</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Team Members
                </label>
                {members.map((member, index) => (
                  <input
                    key={index}
                    type="text"
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                    className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-2"
                    placeholder={`Member ${index + 1} name`}
                  />
                ))}
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addMember}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setMode('select')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateTeam}
                  disabled={!teamName || members.filter(m => m.trim()).length === 0}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  Start Adventure
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6">Join a Team</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Select Team
                </label>
                <select
                  value={joinTeamId}
                  onChange={(e) => setJoinTeamId(e.target.value)}
                  className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Choose a team...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.members.length} members)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setMode('select')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleJoinTeam}
                  disabled={!joinTeamId}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  Join Team
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};