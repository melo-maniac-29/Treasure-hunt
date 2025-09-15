import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Download, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useGame } from '../../context/GameContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const NodeCreator: React.FC = () => {
  const { nodes, createNode } = useGame();
  const [formData, setFormData] = useState({
    clue: '',
    question: '',
    expectedAnswer: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [createdNode, setCreatedNode] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.clue && formData.question) {
      const node = createNode(
        formData.clue,
        formData.question,
        formData.expectedAnswer || undefined
      );
      setCreatedNode(node);
      setFormData({ clue: '', question: '', expectedAnswer: '' });
      setShowPreview(true);
    }
  };

  const downloadQR = (nodeId: number, qrCode: string) => {
    const svg = document.getElementById(`qr-${nodeId}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 400;
        ctx?.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `treasure-hunt-node-${nodeId}-qr.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Create Node Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
          <Plus className="h-6 w-6" />
          Create New Node
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Clue
            </label>
            <textarea
              value={formData.clue}
              onChange={(e) => setFormData({ ...formData, clue: e.target.value })}
              placeholder="Enter the clue that leads to this location..."
              rows={3}
              className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Question
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter the question players must answer..."
              rows={3}
              className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Expected Answer (Optional)
            </label>
            <input
              type="text"
              value={formData.expectedAnswer}
              onChange={(e) => setFormData({ ...formData, expectedAnswer: e.target.value })}
              placeholder="Enter the expected answer for reference..."
              className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            disabled={!formData.clue || !formData.question}
          >
            <Plus className="h-4 w-4" />
            Create Node & Generate QR
          </Button>
        </form>
      </Card>

      {/* Node List & QR Preview */}
      <div className="space-y-6">
        {/* QR Preview for newly created node */}
        {showPreview && createdNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Generated!
              </h3>
              
              <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
                <QRCode
                  id={`qr-${createdNode.id}`}
                  value={createdNode.correctQrCode}
                  size={200}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="success"
                  onClick={() => downloadQR(createdNode.id, createdNode.correctQrCode)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download QR
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowPreview(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Existing Nodes */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Existing Nodes ({nodes.length})
          </h3>
          
          <div className="space-y-3">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-800 mb-1">
                      Node {node.id}
                    </h4>
                    <p className="text-emerald-700 text-sm mb-2">
                      {node.clue.substring(0, 60)}...
                    </p>
                    <p className="text-emerald-600 text-xs">
                      Question: {node.question.substring(0, 40)}...
                    </p>
                  </div>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => downloadQR(node.id, node.correctQrCode)}
                    className="flex items-center gap-1 ml-3"
                  >
                    <Download className="h-3 w-3" />
                    QR
                  </Button>
                </div>
              </motion.div>
            ))}
            
            {nodes.length === 0 && (
              <div className="text-center py-6 text-emerald-600">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No nodes created yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};