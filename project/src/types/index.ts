export interface Team {
  id: string;
  name: string;
  members: string[];
  currentStage: number;
  score: number;
  createdAt: number;
}

export interface Node {
  id: number;
  clue: string;
  question: string;
  correctQrCode: string;
  expectedAnswer?: string;
  createdAt: number;
  isActive: boolean;
}

export interface Submission {
  id: string;
  teamId: string;
  nodeId: number;
  submittedAnswer: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
}

export interface GameSettings {
  id: string;
  totalNodes: number;
  gameActive: boolean;
  pointsPerNode: number;
}

export interface QRCodeData {
  nodeId: number;
  qrSecret: string;
}