import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';
import { Timer } from '@/types/timer';
import { useEffect, useRef } from 'react';

interface CompletionModalProps {
  timer: Timer;
  onClose: () => void;
}

export const CompletionModal = ({ timer, onClose }: CompletionModalProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play sound when modal appears
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <Card className="w-full max-w-md p-6 text-center">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-lg text-gray-700 dark:text-foreground">
              <strong>{timer.name}</strong> has been completed!
            </p>
            <p className="text-sm text-gray-600 dark:text-muted-foreground mt-2">
              Category: {timer.category}
            </p>
          </div>

          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};
