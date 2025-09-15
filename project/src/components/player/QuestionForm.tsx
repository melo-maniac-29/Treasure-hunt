import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Clock, HelpCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface QuestionFormProps {
  nodeId: number;
  onSubmit: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ nodeId, onSubmit }) => {
  const { currentTeam, getNodeById, submitAnswer, submissions } = useGame();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const node = getNodeById(nodeId);
  const existingSubmission = submissions.find(
    s => s.teamId === currentTeam?.id && s.nodeId === nodeId && s.status === 'pending'
  );

  if (!node || !currentTeam) return null;

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      submitAnswer(currentTeam.id, nodeId, answer.trim());
      setAnswer('');
      setIsSubmitting(false);
      onSubmit();
    }, 1000);
  };

  if (existingSubmission) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="h-12 w-12 text-amber-600 mx-auto" />
          </motion.div>
          <h3 className="text-xl font-bold text-emerald-800">Answer Submitted!</h3>
          <p className="text-emerald-700">
            Your answer is being reviewed by the game master. Please wait for approval.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 font-medium">Your answer:</p>
            <p className="text-amber-700">"{existingSubmission.submittedAnswer}"</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
        <HelpCircle className="h-6 w-6" />
        Node {nodeId} Question
      </h2>

      <div className="space-y-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 className="font-semibold text-emerald-800 mb-2">Question:</h3>
          <p className="text-emerald-700 text-lg">{node.question}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-2">
            Your Answer
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer here..."
            rows={4}
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!answer.trim() || isSubmitting}
          className="w-full flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="h-4 w-4" />
              </motion.div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Answer
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};