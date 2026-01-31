import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles, AlertCircle } from 'lucide-react';
import { aiService, type ModelProgress } from '@/services/aiService';

interface ModelDownloadDialogProps {
  open: boolean;
  onClose: () => void;
  onSkip: () => void;
}

export function ModelDownloadDialog({ open, onClose, onSkip }: ModelDownloadDialogProps) {
  const [progress, setProgress] = useState<ModelProgress>({
    loaded: 0,
    total: 100,
    status: 'unloaded',
    message: 'Ready to download',
  });
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    aiService.onProgress((p) => setProgress(p));
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    const success = await aiService.loadModel();
    if (success) {
      setTimeout(onClose, 1000); // Close after showing 100%
    }
  };

  const progressPercent = progress.total > 0 ? (progress.loaded / progress.total) * 100 : 0;

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-zinc-900 border-4 border-black rounded-lg shadow-[8px_8px_0_0_#000] w-full max-w-md mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-4 border-black">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#5865F2]" />
              <h2 className="text-xl font-black">AI Assistant</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              disabled={isDownloading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {progress.status === 'unloaded' && (
              <>
                <div className="space-y-3">
                  <p className="text-zinc-300">
                    Download the AI model to get intelligent bot suggestions powered by machine learning.
                  </p>
                  
                  <div className="bg-zinc-800 border-2 border-zinc-700 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">Download Size:</span>
                      <span className="text-zinc-400">~500MB</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold">Features:</span>
                      <span className="text-zinc-400">Smart suggestions, Auto-complete</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                      <span className="font-bold">One-Time:</span>
                      <span className="text-zinc-400">Cached in browser</span>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-lg p-3">
                    <p className="text-sm text-yellow-200">
                      💡 <strong>Optional:</strong> You can skip and use template-based suggestions instead.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-4 py-3 bg-[#5865F2] text-white font-bold uppercase border-4 border-black rounded-lg hover:transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]"
                  >
                    Download AI Model
                  </button>
                  <button
                    onClick={onSkip}
                    className="px-4 py-3 bg-zinc-800 font-bold border-4 border-black rounded-lg hover:transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]"
                  >
                    Skip
                  </button>
                </div>
              </>
            )}

            {(progress.status === 'downloading' || progress.status === 'loading') && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold">{progress.message}</span>
                    <span className="text-zinc-400">{Math.round(progressPercent)}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-6 bg-zinc-800 border-4 border-black rounded-lg overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#5865F2] to-[#7289DA]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <p className="text-sm text-zinc-400">
                    {progress.status === 'downloading' 
                      ? `Downloaded ${(progress.loaded / 1024 / 1024).toFixed(1)}MB of ${(progress.total / 1024 / 1024).toFixed(1)}MB`
                      : 'Preparing AI model for use...'}
                  </p>
                </div>
              </>
            )}

            {progress.status === 'ready' && (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 mx-auto bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-400">AI Ready!</h3>
                  <p className="text-zinc-400">Your AI assistant is ready to help</p>
                </div>
              </div>
            )}

            {progress.status === 'error' && (
              <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 space-y-3">
                <p className="text-red-400 font-bold">Failed to download AI model</p>
                <p className="text-sm text-zinc-400">
                  Don't worry! You can still use template-based suggestions.
                </p>
                <button
                  onClick={onSkip}
                  className="w-full px-4 py-2 bg-zinc-800 font-bold border-2 border-black rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Continue with Templates
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
