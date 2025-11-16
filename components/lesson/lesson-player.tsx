'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson, LessonItem } from '@/lib/types';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
  }, []);

  // Auto-play audio when item changes (only after user interaction)
  useEffect(() => {
    const tryAutoPlay = async () => {
      if (currentItem?.audio && userInteracted) {
        try {
          await playAudio(currentItem.audio, 2);
        } catch (error) {
          console.log('Auto-play prevented:', error);
        }
      }
    };
    
    tryAutoPlay();
    setUserInput('');
    setIsCorrect(null);
    setShowAnswer(false);
    inputRef.current?.focus();
  }, [currentIndex, userInteracted]);

  const playAudio = async (audioUrl: string, times: number = 1) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    audioRef.current.src = audioUrl;
    
    for (let i = 0; i < times; i++) {
      try {
        await audioRef.current.play();
        await new Promise((resolve) => {
          audioRef.current!.onended = resolve;
        });
        if (i < times - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.log('Audio play prevented:', error);
        throw error; // Re-throw to handle in calling code
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
      
      // Play audio twice on correct answer
      if (currentItem.audio) {
        await playAudio(currentItem.audio, 2);
      }
    } else {
      playErrorSound();
    }
  };

  const handleNext = () => {
    if (currentIndex < lesson.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Lesson completed - set complete state
      setIsComplete(true);
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
            console.log('Audio play prevented');
          });
        }
      }
      // Enter key handling
      else if (e.key === 'Enter') {
        if (showAnswer && isCorrect) {
          // If answer is shown and correct, move to next
          if (currentIndex < lesson.items.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            setIsComplete(true);
          }
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
            if (currentItem?.audio) {
              playAudio(currentItem.audio, 2).catch(() => {
                console.log('Audio play prevented');
              });
            }
          } else {
            if (errorSoundRef.current) {
              errorSoundRef.current.currentTime = 0;
              errorSoundRef.current.play().catch(console.error);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
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
          console.log('First audio play prevented');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge>{lesson.tag}</Badge>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {lesson.title_en}
            </h1>
          </div>
          <Button variant="ghost" onClick={handleExit}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div className="container mx-auto mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>
              Question {currentIndex + 1} of {lesson.items.length}
            </span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Course Description (Collapsible) */}
        {showDescription && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                About this lesson
              </h2>
              <button
                onClick={() => setShowDescription(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{lesson.description_en}</p>
          </div>
        )}

        {!showDescription && (
          <button
            onClick={() => setShowDescription(true)}
            className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Show lesson description
          </button>
        )}

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          {/* English Prompt */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentItem.en}
              </p>
              <button
                onClick={() => {
                  setUserInteracted(true);
                  if (currentItem.audio) {
                    playAudio(currentItem.audio, 1).catch(() => {
                      console.log('Audio play prevented');
                    });
                  }
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Play audio"
              >
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                </svg>
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Type in Pinyin
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <Input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className={`text-4xl text-center py-8 border-0 border-b-4 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                isCorrect === true
                  ? 'border-b-green-500'
                  : isCorrect === false
                  ? 'border-b-red-500 text-red-600'
                  : 'border-b-gray-300 dark:border-b-gray-600 focus:border-b-blue-500'
              }`}
            />
          </div>

          {/* Answer Display */}
          {showAnswer && (
            <div
              className={`text-center p-6 rounded-xl mb-6 ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                  : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
              }`}
            >
              <div className="text-4xl font-bold mb-2">
                <span className="text-gray-900 dark:text-white">{currentItem.zh}</span>
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                {currentItem.py}
              </div>
              {!isCorrect && (
                <p className="text-red-600 dark:text-red-400">
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12"
                disabled={!userInput.trim()}
              >
                Check Answer (Enter)
              </Button>
            ) : isCorrect ? (
              <Button
                size="lg"
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12"
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
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-12"
              >
                Try Again (Enter)
              </Button>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <details className="cursor-pointer">
            <summary className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Keyboard Shortcuts
            </summary>
            <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Submit answer / Next question / Try again</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span>Play audio</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl + P</kbd>
              </div>
              <div className="flex justify-between">
                <span>Exit lesson</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd>
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

