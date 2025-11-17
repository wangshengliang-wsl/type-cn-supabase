'use client';

import { useState, useEffect, useRef } from 'react';
import type { Lesson } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { CompletionDialog } from './completion-dialog';
import { ExitDialog } from './exit-dialog';

interface LessonPlayerProps {
  lesson: Lesson;
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [startTime] = useState(Date.now());
  const [userInteracted, setUserInteracted] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null); // 跟踪当前播放的音频
  
  // Audio refs for sound effects
  const typingSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);

  const currentItem = lesson.items[currentIndex];
  // Fix progress calculation: currentIndex is 0-based, so when at last item (index = length-1), progress should be based on completion
  const progressPercentage = showAnswer && isCorrect && currentIndex === lesson.items.length - 1
    ? 100
    : ((currentIndex) / lesson.items.length) * 100;

  // Initialize audio elements
  useEffect(() => {
    typingSoundRef.current = new Audio('/audio/typing.mp3');
    correctSoundRef.current = new Audio('/audio/correct.mp3');
    errorSoundRef.current = new Audio('/audio/error.mp3');
    
    // Preload audio
    typingSoundRef.current.load();
    correctSoundRef.current.load();
    errorSoundRef.current.load();
    
    // Cleanup on unmount
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Auto-play audio when item changes (only after user interaction)
  useEffect(() => {
    // 停止所有正在播放的音频
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    
    const tryAutoPlay = async () => {
      if (currentItem?.audio && userInteracted) {
        try {
          await playAudio(currentItem.audio, 2);
        } catch {
          // Auto-play prevented
        }
      }
    };
    
    tryAutoPlay();
    setUserInput('');
    setIsCorrect(null);
    setShowAnswer(false);
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, userInteracted]);

  const playAudio = async (audioUrl: string, times: number = 1) => {
    // 停止之前正在播放的音频
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    
    for (let i = 0; i < times; i++) {
      try {
        // 创建新的 Audio 实例
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        
        await audio.play();
        
        // 等待音频播放完成
        await new Promise<void>((resolve) => {
          audio.onended = () => {
            if (currentAudioRef.current === audio) {
              currentAudioRef.current = null;
            }
            resolve();
          };
          audio.onerror = () => {
            if (currentAudioRef.current === audio) {
              currentAudioRef.current = null;
            }
            resolve();
          };
          
          // 设置超时，防止音频卡住
          const timeoutId = setTimeout(() => {
            if (currentAudioRef.current === audio) {
              audio.pause();
              currentAudioRef.current = null;
            }
            resolve();
          }, 10000); // 10秒超时
          
          // 清理超时
          audio.addEventListener('ended', () => clearTimeout(timeoutId), { once: true });
          audio.addEventListener('error', () => clearTimeout(timeoutId), { once: true });
        });
        
        // 在多次播放之间添加延迟
        if (i < times - 1) {
          await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), 300);
          });
        }
      } catch {
        // Audio play prevented
        currentAudioRef.current = null;
      }
    }
  };

  const playTypingSound = () => {
    if (typingSoundRef.current) {
      typingSoundRef.current.currentTime = 0;
      typingSoundRef.current.play().catch(() => {
        // Silently fail if auto-play is blocked
      });
    }
  };

  const playCorrectSound = () => {
    if (correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play().catch(console.error);
    }
  };

  const playErrorSound = () => {
    if (errorSoundRef.current) {
      errorSoundRef.current.currentTime = 0;
      errorSoundRef.current.play().catch(console.error);
    }
  };

  const normalizeInput = (input: string): string => {
    return input.toLowerCase().replace(/\s+/g, '');
  };

  const checkAnswer = async () => {
    if (!userInput.trim()) return;

    setAttempts(prev => prev + 1);
    const normalized = normalizeInput(userInput);
    const accepted = currentItem.accepted.map(normalizeInput);
    const correct = accepted.includes(normalized);

    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      playCorrectSound();
      
      // 保存进度到数据库
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessonId: lesson.lesson_id,
            itemId: currentItem.item_id,
            correct: true,
          }),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
      
      // Play audio twice on correct answer (non-blocking)
      if (currentItem.audio) {
        playAudio(currentItem.audio, 2).catch(console.error);
      }
    } else {
      playErrorSound();
      
      // 记录错误尝试
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessonId: lesson.lesson_id,
            itemId: currentItem.item_id,
            correct: false,
          }),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  const handleNext = async () => {
    // 如果已经完成，不再重复执行
    if (isComplete) return;
    
    if (currentIndex < lesson.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // 标记为已完成
      setIsComplete(true);
      
      // Lesson completed - ensure progress is saved and refreshed
      try {
        // 刷新课程进度，确保计算准确
        await fetch('/api/progress/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessonId: lesson.lesson_id,
          }),
        });
      } catch (error) {
        console.error('Failed to save final progress:', error);
      }
      
      // 直接跳转回课程列表页面
      router.push('/dashboard/courses');
    }
  };

  // Global keyboard event handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Escape to exit
      if (e.key === 'Escape') {
        setShowExitDialog(true);
      }
      // Ctrl/Cmd + P to play audio
      else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        if (currentItem?.audio) {
          playAudio(currentItem.audio, 1).catch(() => {
            // Audio play prevented
          });
        }
      }
      // Enter key handling
      else if (e.key === 'Enter') {
        if (showAnswer && isCorrect) {
          // If answer is shown and correct, move to next or complete
          handleNext();
        } else if (showAnswer && !isCorrect) {
          // If answer is shown and incorrect, reset for retry
          setShowAnswer(false);
          setIsCorrect(null);
          setUserInput('');
          setTimeout(() => inputRef.current?.focus(), 0);
        } else if (!showAnswer && userInput.trim()) {
          // First time checking answer
          const normalized = userInput.toLowerCase().replace(/\s+/g, '');
          const accepted = currentItem.accepted.map((a: string) => a.toLowerCase().replace(/\s+/g, ''));
          const correct = accepted.includes(normalized);

          setAttempts(prev => prev + 1);
          setIsCorrect(correct);
          setShowAnswer(true);

          if (correct) {
            setCorrectCount(prev => prev + 1);
            if (correctSoundRef.current) {
              correctSoundRef.current.currentTime = 0;
              correctSoundRef.current.play().catch(console.error);
            }
            
            // 保存进度到数据库
            fetch('/api/progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                lessonId: lesson.lesson_id,
                itemId: currentItem.item_id,
                correct: true,
              }),
            }).catch(error => console.error('Failed to save progress:', error));
            
            if (currentItem?.audio) {
              playAudio(currentItem.audio, 2).catch(() => {
                // Audio play prevented
              });
            }
          } else {
            if (errorSoundRef.current) {
              errorSoundRef.current.currentTime = 0;
              errorSoundRef.current.play().catch(console.error);
            }
            
            // 记录错误尝试
            fetch('/api/progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                lessonId: lesson.lesson_id,
                itemId: currentItem.item_id,
                correct: false,
              }),
            }).catch(error => console.error('Failed to save progress:', error));
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAnswer, isCorrect, userInput, currentItem, currentIndex, lesson.items.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Mark user interaction
    if (!userInteracted) {
      setUserInteracted(true);
    }
    
    // Prevent default for Enter key (handled by global listener)
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mark that user has interacted
    if (!userInteracted) {
      setUserInteracted(true);
      // Try to play the audio for the current item now
      if (currentItem?.audio) {
        playAudio(currentItem.audio, 2).catch(() => {
          // First audio play prevented
        });
      }
    }
    
    const value = e.target.value;
    const lastChar = value[value.length - 1];
    
    // Check if the last character is a-z or space
    if (lastChar && /[a-z\s]/i.test(lastChar)) {
      playTypingSound();
    }
    
    setUserInput(value);
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    router.push('/dashboard/courses');
  };

  const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;
  const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60); // in minutes

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-0">
              {lesson.tag}
            </Badge>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {lesson.title_en}
            </h1>
          </div>
          <Button variant="ghost" onClick={handleExit} className="hover:bg-gray-100 dark:hover:bg-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div className="container mx-auto max-w-4xl mt-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-2">
            <span>
              Question {currentIndex + 1} of {lesson.items.length}
            </span>
            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Course Description (Collapsible) */}
        {showDescription && (
          <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                About this lesson
              </h2>
              <button
                onClick={() => setShowDescription(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lesson.description_en}</p>
          </div>
        )}

        {!showDescription && (
          <button
            onClick={() => setShowDescription(true)}
            className="mb-6 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Show lesson description
          </button>
        )}

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-950 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-800 mb-8">
          {/* English Prompt */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {currentItem.en}
              </p>
              <button
                onClick={() => {
                  setUserInteracted(true);
                  if (currentItem.audio) {
                    playAudio(currentItem.audio, 1).catch(() => {
                      // Audio play prevented
                    });
                  }
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                title="播放音频"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Type in Pinyin
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-8">
            <Input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className={`text-3xl md:text-4xl text-center py-8 border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent transition-colors ${
                isCorrect === true
                  ? 'border-b-green-500 dark:border-b-green-400'
                  : isCorrect === false
                  ? 'border-b-red-500 dark:border-b-red-400 text-red-600 dark:text-red-400'
                  : 'border-b-gray-200 dark:border-b-gray-800 focus:border-b-gray-900 dark:focus:border-b-white'
              }`}
            />
          </div>

          {/* Answer Display */}
          {showAnswer && (
            <div
              className={`text-center p-8 rounded-2xl mb-8 border-2 transition-all ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold mb-3">
                <span className="text-gray-900 dark:text-white">{currentItem.zh}</span>
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                {currentItem.py}
              </div>
              {!isCorrect && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                  Correct answer: {currentItem.accepted[0]}
                </p>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            {!showAnswer ? (
              <Button
                size="lg"
                onClick={checkAnswer}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-12 py-6 text-base transition-colors"
                disabled={!userInput.trim()}
              >
                Check Answer (Enter)
              </Button>
            ) : isCorrect ? (
              <Button
                size="lg"
                onClick={handleNext}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-12 py-6 text-base transition-colors"
              >
                {currentIndex < lesson.items.length - 1 ? 'Next Question (Enter)' : 'Complete Lesson (Enter)'}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  setShowAnswer(false);
                  setIsCorrect(null);
                  setUserInput('');
                  inputRef.current?.focus();
                }}
                className="bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 px-12 py-6 text-base transition-colors"
              >
                Try Again (Enter)
              </Button>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
          <details className="cursor-pointer">
            <summary className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Keyboard Shortcuts
            </summary>
            <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between items-center">
                <span>Submit / Next / Retry</span>
                <kbd className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-xs font-mono">Enter</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Play audio</span>
                <kbd className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-xs font-mono">Ctrl + P</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Exit lesson</span>
                <kbd className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-xs font-mono">Esc</kbd>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Exit Dialog */}
      <ExitDialog
        isOpen={showExitDialog}
        onConfirm={confirmExit}
        onCancel={() => setShowExitDialog(false)}
      />

      {/* Completion Dialog */}
      <CompletionDialog
        isOpen={isComplete}
        onClose={() => setIsComplete(false)}
        stats={{
          totalWords: lesson.items.length,
          accuracy,
          timeSpent,
          streak: 0, // TODO: Get from user stats
        }}
      />
    </div>
  );
}

