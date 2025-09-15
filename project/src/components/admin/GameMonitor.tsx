import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Target, Activity, TrendingUp } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Card } from '../ui/Card';

export const GameMonitor: React.FC = () => {
  const { teams, nodes, submissions } = useGame();

  const teamStats = teams.map(team => {
    const teamSubmissions = submissions.filter(s => s.teamId === team.id);
    const acceptedSubmissions = teamSubmissions.filter(s => s.status === 'accepted').length;
    const pendingSubmissions = teamSubmissions.filter(s => s.status === 'pending').length;
    const rejectedSubmissions = teamSubmissions.filter(s => s.status === 'rejected').length;
    
    return {
      ...team,
      totalSubmissions: teamSubmissions.length,
      acceptedSubmissions,
      pendingSubmissions,
      rejectedSubmissions,
      successRate: teamSubmissions.length > 0 ? (acceptedSubmissions / teamSubmissions.length) * 100 : 0
    };
  });

  const sortedTeams = teamStats.sort((a, b) => b.score - a.score);

  const gameStats = {
    totalTeams: teams.length,
    totalNodes: nodes.length,
    totalSubmissions: submissions.length,
    pendingReviews: submissions.filter(s => s.status === 'pending').length,
    completedGames: teams.filter(t => t.currentStage > nodes.length).length,
  };

  return (
    <div className="space-y-6">
      {/* Game Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{gameStats.totalTeams}</p>
              <p className="text-emerald-600 text-sm">Active Teams</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{gameStats.totalNodes}</p>
              <p className="text-emerald-600 text-sm">Total Nodes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{gameStats.totalSubmissions}</p>
              <p className="text-emerald-600 text-sm">Submissions</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{gameStats.completedGames}</p>
              <p className="text-emerald-600 text-sm">Completed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Team Performance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-emerald-200">
                <th className="text-left p-3 font-semibold text-emerald-800">Team</th>
                <th className="text-left p-3 font-semibold text-emerald-800">Members</th>
                <th className="text-left p-3 font-semibold text-emerald-800">Stage</th>
                <th className="text-left p-3 font-semibold text-emerald-800">Score</th>
                <th className="text-left p-3 font-semibold text-emerald-800">Submissions</th>
                <th className="text-left p-3 font-semibold text-emerald-800">Success Rate</th>
                <th className="text-left p-3 font-semibold text-emerald-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team, index) => (
                <motion.tr
                  key={team.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-emerald-100 hover:bg-emerald-50/50"
                >
                  <td className="p-3">
                    <div className="font-medium text-emerald-800">{team.name}</div>
                    <div className="text-xs text-emerald-600">
                      Created: {new Date(team.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3 text-emerald-700">{team.members.length}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      team.currentStage > nodes.length
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {team.currentStage > nodes.length ? 'Complete' : `Stage ${team.currentStage}`}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-800">{team.score}</td>
                  <td className="p-3">
                    <div className="text-emerald-700">
                      {team.totalSubmissions}
                      <div className="text-xs text-emerald-600">
                        ✓{team.acceptedSubmissions} ⏳{team.pendingSubmissions} ✗{team.rejectedSubmissions}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${team.successRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-emerald-700">
                        {team.successRate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        team.pendingSubmissions > 0
                          ? 'bg-amber-500'
                          : team.currentStage > nodes.length
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`} />
                      <span className="text-xs text-emerald-700">
                        {team.pendingSubmissions > 0
                          ? 'Pending'
                          : team.currentStage > nodes.length
                          ? 'Finished'
                          : 'Active'
                        }
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {sortedTeams.length === 0 && (
            <div className="text-center py-8 text-emerald-600">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No teams registered yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};