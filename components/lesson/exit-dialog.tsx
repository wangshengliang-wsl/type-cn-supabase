'use client';

import { Button } from '@/components/ui/button';

interface ExitDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExitDialog({ isOpen, onConfirm, onCancel }: ExitDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="mb-6">
          <div className="text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Exit Lesson?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Your progress will be lost if you exit now. Are you sure?
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
}

