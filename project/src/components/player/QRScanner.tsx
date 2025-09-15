import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Scan, AlertCircle, CheckCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface QRScannerProps {
  onValidScan: (nodeId: number) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onValidScan }) => {
  const { currentTeam, getNodeById } = useGame();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const validateQRCode = (qrData: string) => {
    if (!currentTeam) return;

    try {
      // For demo purposes, we'll simulate QR code validation
      const currentNode = getNodeById(currentTeam.currentStage);
      
      if (!currentNode) {
        setScanResult({
          type: 'error',
          message: 'No active node found!'
        });
        return;
      }

      if (qrData === currentNode.correctQrCode) {
        setScanResult({
          type: 'success',
          message: 'QR Code validated! You can now answer the question.'
        });
        onValidScan(currentNode.id);
      } else {
        setScanResult({
          type: 'error',
          message: 'Haha wrong place! Keep exploring! 🗺️'
        });
      }
    } catch (error) {
      setScanResult({
        type: 'error',
        message: 'Invalid QR code format'
      });
    }
    
    setTimeout(() => setScanResult(null), 3000);
  };

  const simulateQRScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      // For demo, simulate scanning the correct QR code
      if (currentTeam) {
        const currentNode = getNodeById(currentTeam.currentStage);
        if (currentNode) {
          validateQRCode(currentNode.correctQrCode);
        }
      }
    }, 2000);
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      validateQRCode(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
        <Scan className="h-6 w-6" />
        QR Scanner
      </h2>

      <div className="space-y-6">
        {/* Camera Scanner */}
        <div className="relative">
          <div className={`aspect-square bg-gray-100 rounded-lg border-4 border-dashed ${
            scanning ? 'border-amber-400' : 'border-gray-300'
          } flex items-center justify-center relative overflow-hidden`}>
            {scanning ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-center"
              >
                <Scan className="h-16 w-16 text-amber-600 mx-auto mb-2" />
                <p className="text-amber-700 font-medium">Scanning...</p>
              </motion.div>
            ) : (
              <div className="text-center">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Point camera at QR code</p>
              </div>
            )}
            
            {scanning && (
              <motion.div
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 h-1 bg-amber-400"
              />
            )}
          </div>
          
          <Button
            variant="primary"
            onClick={simulateQRScan}
            disabled={scanning}
            className="w-full mt-4"
          >
            {scanning ? 'Scanning...' : 'Start QR Scan'}
          </Button>
        </div>

        {/* Manual Entry */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-emerald-800 mb-3">Manual Entry</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter QR code manually"
              className="flex-1 px-3 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Button
              variant="secondary"
              onClick={handleManualEntry}
              disabled={!manualCode.trim()}
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              scanResult.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {scanResult.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="font-medium">{scanResult.message}</p>
          </motion.div>
        )}
      </div>
    </Card>
  );
};