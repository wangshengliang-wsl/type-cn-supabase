'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface CompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalWords: number;
    accuracy: number;
    timeSpent: number;
    streak: number;
  };
}

export function CompletionDialog({ isOpen, onClose, stats }: CompletionDialogProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Remove confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackToCourses = () => {
    onClose();
    router.push('/dashboard/courses');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Dialog Content */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-up">
        <div className="text-center">
          {/* Emoji */}
          <div className="text-8xl mb-4 animate-bounce">🎉</div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Great Job!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            You've mastered {stats.totalWords} new words!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stats.accuracy}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {stats.timeSpent}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {stats.streak} 🔥
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Streak</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleBackToCourses}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
              size="lg"
            >
              Back to Course List
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        @keyframes scale-up {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

