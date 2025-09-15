import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team, Node, Submission, GameSettings } from '../types';

interface GameContextType {
  teams: Team[];
  nodes: Node[];
  submissions: Submission[];
  gameSettings: GameSettings;
  currentTeam: Team | null;
  isAdmin: boolean;
  
  // Team actions
  createTeam: (name: string, members: string[]) => Team;
  joinTeam: (teamId: string) => Team | null;
  setCurrentTeam: (team: Team | null) => void;
  
  // Node actions
  createNode: (clue: string, question: string, expectedAnswer?: string) => Node;
  getNodeById: (id: number) => Node | undefined;
  
  // Submission actions
  submitAnswer: (teamId: string, nodeId: number, answer: string) => Submission;
  reviewSubmission: (submissionId: string, approved: boolean) => void;
  
  // Admin actions
  setAdmin: (isAdmin: boolean) => void;
  updateGameSettings: (settings: Partial<GameSettings>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    id: 'default',
    totalNodes: 5,
    gameActive: true,
    pointsPerNode: 100,
  });

  // Initialize with demo data
  useEffect(() => {
    const demoNodes: Node[] = [
      {
        id: 1,
        clue: "Where ancient books whisper secrets of the past, seek the guardian of knowledge.",
        question: "What year was this library established?",
        correctQrCode: "library-secret-2024",
        expectedAnswer: "1985",
        createdAt: Date.now(),
        isActive: true,
      },
      {
        id: 2,
        clue: "In the heart where nature meets nurture, find where green thumbs work their magic.",
        question: "Count the number of different plant species in this garden.",
        correctQrCode: "garden-secret-2024",
        expectedAnswer: "12",
        createdAt: Date.now(),
        isActive: true,
      },
      {
        id: 3,
        clue: "Where echoes of laughter and cheers once filled the air, champions were made.",
        question: "What sport was primarily played in this arena?",
        correctQrCode: "arena-secret-2024",
        expectedAnswer: "Basketball",
        createdAt: Date.now(),
        isActive: true,
      },
    ];
    
    setNodes(demoNodes);
  }, []);

  const createTeam = (name: string, members: string[]): Team => {
    const team: Team = {
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      members,
      currentStage: 1,
      score: 0,
      createdAt: Date.now(),
    };
    
    setTeams(prev => [...prev, team]);
    return team;
  };

  const joinTeam = (teamId: string): Team | null => {
    const team = teams.find(t => t.id === teamId);
    return team || null;
  };

  const createNode = (clue: string, question: string, expectedAnswer?: string): Node => {
    const nodeId = nodes.length + 1;
    const node: Node = {
      id: nodeId,
      clue,
      question,
      correctQrCode: `node-${nodeId}-secret-${Date.now()}`,
      expectedAnswer,
      createdAt: Date.now(),
      isActive: true,
    };
    
    setNodes(prev => [...prev, node]);
    return node;
  };

  const getNodeById = (id: number): Node | undefined => {
    return nodes.find(node => node.id === id);
  };

  const submitAnswer = (teamId: string, nodeId: number, answer: string): Submission => {
    const submission: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      teamId,
      nodeId,
      submittedAnswer: answer,
      status: 'pending',
      submittedAt: Date.now(),
    };
    
    setSubmissions(prev => [...prev, submission]);
    return submission;
  };

  const reviewSubmission = (submissionId: string, approved: boolean): void => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === submissionId
          ? {
              ...sub,
              status: approved ? 'accepted' : 'rejected',
              reviewedAt: Date.now(),
              reviewedBy: 'admin',
            }
          : sub
      )
    );

    if (approved) {
      const submission = submissions.find(s => s.id === submissionId);
      if (submission) {
        setTeams(prev =>
          prev.map(team =>
            team.id === submission.teamId
              ? {
                  ...team,
                  currentStage: team.currentStage + 1,
                  score: team.score + gameSettings.pointsPerNode,
                }
              : team
          )
        );
      }
    }
  };

  const setAdmin = (admin: boolean): void => {
    setIsAdmin(admin);
  };

  const updateGameSettings = (settings: Partial<GameSettings>): void => {
    setGameSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <GameContext.Provider
      value={{
        teams,
        nodes,
        submissions,
        gameSettings,
        currentTeam,
        isAdmin,
        createTeam,
        joinTeam,
        setCurrentTeam,
        createNode,
        getNodeById,
        submitAnswer,
        reviewSubmission,
        setAdmin,
        updateGameSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};