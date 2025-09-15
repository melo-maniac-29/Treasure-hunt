import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, FileText, Users } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const SubmissionReview: React.FC = () => {
  const { submissions, teams, nodes, getNodeById, reviewSubmission } = useGame();

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Unknown Team';
  };

  const getNodeClue = (nodeId: number) => {
    const node = getNodeById(nodeId);
    return node?.clue.substring(0, 50) + '...' || 'Unknown Node';
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const reviewedSubmissions = submissions.filter(s => s.status !== 'pending');

  const handleReview = (submissionId: string, approved: boolean) => {
    reviewSubmission(submissionId, approved);
  };

  return (
    <div className="space-y-6">
      {/* Pending Submissions */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6 text-amber-600" />
          Pending Submissions ({pendingSubmissions.length})
        </h2>

        <div className="space-y-4">
          {pendingSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold text-amber-800">
                      {getTeamName(submission.teamId)}
                    </span>
                    <span className="text-amber-600">•</span>
                    <span className="text-amber-700">Node {submission.nodeId}</span>
                  </div>
                  
                  <p className="text-amber-700 text-sm mb-3 italic">
                    Clue: {getNodeClue(submission.nodeId)}
                  </p>
                  
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-emerald-800 text-sm mb-1">Submitted Answer:</p>
                    <p className="text-emerald-700">"{submission.submittedAnswer}"</p>
                  </div>
                  
                  <p className="text-amber-600 text-xs mt-2">
                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleReview(submission.id, true)}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReview(submission.id, false)}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {pendingSubmissions.length === 0 && (
            <div className="text-center py-8 text-amber-600">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No pending submissions</p>
              <p className="text-sm">All caught up!</p>
            </div>
          )}
        </div>
      </Card>

      {/* Reviewed Submissions */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Recent Reviews ({reviewedSubmissions.length})
        </h2>

        <div className="space-y-3">
          {reviewedSubmissions
            .sort((a, b) => (b.reviewedAt || 0) - (a.reviewedAt || 0))
            .slice(0, 10)
            .map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border-l-4 ${
                  submission.status === 'accepted'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {submission.status === 'accepted' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    
                    <div>
                      <span className="font-medium text-emerald-800">
                        {getTeamName(submission.teamId)}
                      </span>
                      <span className="text-emerald-600 mx-2">•</span>
                      <span className="text-emerald-700">Node {submission.nodeId}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      submission.status === 'accepted' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {submission.status === 'accepted' ? 'Accepted' : 'Rejected'}
                    </div>
                    <div className="text-xs text-emerald-600">
                      {new Date(submission.reviewedAt || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-emerald-600 mt-1 truncate">
                  Answer: "{submission.submittedAnswer}"
                </p>
              </motion.div>
            ))}
          
          {reviewedSubmissions.length === 0 && (
            <div className="text-center py-6 text-emerald-600">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No reviewed submissions yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};