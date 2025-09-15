import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Users, Target } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Card } from '../ui/Card';

export const Leaderboard: React.FC = () => {
  const { teams } = useGame();

  const sortedTeams = [...teams].sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.currentStage !== b.currentStage) return b.currentStage - a.currentStage;
    return a.createdAt - b.createdAt;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-amber-500" />;
      case 2:
        return <Star className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Target className="h-6 w-6 text-amber-600" />;
      default:
        return <div className="h-6 w-6 flex items-center justify-center text-emerald-600 font-bold">{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200';
      default:
        return 'bg-white border-emerald-100';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6" />
        Leaderboard
      </h2>

      <div className="space-y-3">
        {sortedTeams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No teams registered yet</p>
          </div>
        ) : (
          sortedTeams.map((team, index) => {
            const rank = index + 1;
            
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${getRankColor(rank)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-emerald-800 truncate">
                        {team.name}
                      </h3>
                      {rank <= 3 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          rank === 1 ? 'bg-amber-100 text-amber-800' :
                          rank === 2 ? 'bg-gray-100 text-gray-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          #{rank}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {team.members.length} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Stage {team.currentStage}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-emerald-800">
                      {team.score}
                    </div>
                    <div className="text-xs text-emerald-600">points</div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {sortedTeams.length > 0 && (
        <div className="mt-6 pt-4 border-t border-emerald-100">
          <div className="text-center text-sm text-emerald-600">
            <p>{sortedTeams.length} team{sortedTeams.length !== 1 ? 's' : ''} competing</p>
          </div>
        </div>
      )}
    </Card>
  );
};