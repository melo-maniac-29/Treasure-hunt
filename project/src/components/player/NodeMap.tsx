import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Star, MapPin } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Card } from '../ui/Card';

export const NodeMap: React.FC = () => {
  const { nodes, currentTeam } = useGame();

  if (!currentTeam) return null;

  const getNodeStatus = (nodeId: number) => {
    if (nodeId < currentTeam.currentStage) return 'completed';
    if (nodeId === currentTeam.currentStage) return 'current';
    return 'locked';
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
        <MapPin className="h-6 w-6" />
        Your Journey
      </h2>

      <div className="space-y-4">
        {nodes.map((node, index) => {
          const status = getNodeStatus(node.id);
          
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : status === 'current'
                  ? 'bg-amber-50 border-amber-200 shadow-lg'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {status === 'completed' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : status === 'current' ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="h-6 w-6 text-amber-600" />
                    </motion.div>
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">Node {node.id}</h3>
                    {status === 'completed' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Complete
                      </span>
                    )}
                    {status === 'current' && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  
                  {status !== 'locked' && (
                    <p className="text-emerald-700 font-medium">
                      {node.clue}
                    </p>
                  )}
                  
                  {status === 'locked' && (
                    <p className="text-gray-500 italic">
                      Complete previous nodes to unlock this clue
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {currentTeam.currentStage > nodes.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 bg-gradient-to-r from-amber-100 to-emerald-100 rounded-lg text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-2"
          >
            <Star className="h-12 w-12 text-amber-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-emerald-800">Congratulations!</h3>
          <p className="text-emerald-700">You've completed the treasure hunt!</p>
        </motion.div>
      )}
    </Card>
  );
};