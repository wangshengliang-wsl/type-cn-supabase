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

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  size: number;
  shape: 'rect' | 'circle' | 'triangle';
  wobble: number;
}

export function CompletionDialog({ isOpen, onClose, stats }: CompletionDialogProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiData, setConfettiData] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isOpen) {
      // 生成更真实的礼花效果
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
      const shapes: Array<'rect' | 'circle' | 'triangle'> = ['rect', 'circle', 'triangle'];
      
      const data: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        wobble: -30 + Math.random() * 60,
      }));
      
      setConfettiData(data);
      setShowConfetti(true);
      
      // Remove confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackToCourses = () => {
    onClose();
    router.push('/dashboard/courses');
  };

  const renderConfettiShape = (piece: ConfettiPiece) => {
    const style = {
      width: `${piece.size}px`,
      height: `${piece.size}px`,
      backgroundColor: piece.color,
    };

    switch (piece.shape) {
      case 'circle':
        return <div className="rounded-full" style={style} />;
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${piece.size / 2}px solid transparent`,
              borderRight: `${piece.size / 2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
            }}
          />
        );
      case 'rect':
      default:
        return <div className="rounded-sm" style={style} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md">
      {/* Confetti Animation */}
      {showConfetti && confettiData.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiData.map((piece) => (
            <div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.left}%`,
                top: '-20px',
                animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s forwards`,
                '--wobble': `${piece.wobble}px`,
                '--rotation': `${piece.rotation}deg`,
              } as React.CSSProperties}
            >
              {renderConfettiShape(piece)}
            </div>
          ))}
        </div>
      )}

      {/* Dialog Content */}
      <div className="relative bg-white dark:bg-gray-950 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800 shadow-2xl animate-scale-up">
        <div className="text-center">
          {/* Emoji */}
          <div className="text-7xl mb-6 animate-bounce-slow">🎉</div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            太棒了！
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
            你已经掌握了 {stats.totalWords} 个新单词！
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50 hover-lift transition-all duration-300">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 mb-1">
                {stats.accuracy}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">准确率</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50 hover-lift transition-all duration-300">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-300 mb-1">
                {stats.timeSpent}m
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">用时</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800/50 hover-lift transition-all duration-300">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-400 dark:to-orange-300 mb-1">
                {stats.streak} 🔥
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">连续</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleBackToCourses}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 text-base py-6 transition-all duration-300"
              size="lg"
            >
              返回课程列表
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--wobble)) rotate(calc(var(--rotation) * 3));
            opacity: 0.3;
          }
        }

        @keyframes scale-up {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

