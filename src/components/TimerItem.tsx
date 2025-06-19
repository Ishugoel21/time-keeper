import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, TimerReset, Trash2 } from 'lucide-react';
import { Timer } from '@/types/timer';
import { formatTime } from '@/utils/formatUtils';
import { toast } from '@/hooks/use-toast';

interface TimerItemProps {
  timer: Timer;
  onUpdateTimer: (id: string, updates: Partial<Timer>) => void;
  onDeleteTimer: (id: string) => void;
  onTimerComplete: (timer: Timer) => void;
}

export const TimerItem = ({ timer, onUpdateTimer, onDeleteTimer, onTimerComplete }: TimerItemProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.status === 'running' && timer.remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        onUpdateTimer(timer.id, {
          remainingTime: Math.max(0, timer.remainingTime - 1)
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.status, timer.remainingTime, timer.id, onUpdateTimer]);

  useEffect(() => {
    // Check for completion
    if (timer.status === 'running' && timer.remainingTime === 0) {
      onUpdateTimer(timer.id, { status: 'completed' });
      onTimerComplete({ ...timer, status: 'completed', remainingTime: 0 });
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Check for halfway alert
    if (
      timer.halfwayAlert &&
      !timer.halfwayAlertTriggered &&
      timer.status === 'running' &&
      timer.remainingTime <= timer.duration / 2
    ) {
      toast({
        title: "Halfway Point!",
        description: `${timer.name} is halfway complete.`,
      });
      onUpdateTimer(timer.id, { halfwayAlertTriggered: true });
    }
  }, [timer, onTimerComplete, onUpdateTimer]);

  const handleStart = () => {
    onUpdateTimer(timer.id, { status: 'running' });
  };

  const handlePause = () => {
    onUpdateTimer(timer.id, { status: 'paused' });
  };

  const handleReset = () => {
    onUpdateTimer(timer.id, { 
      status: 'paused', 
      remainingTime: timer.duration,
      halfwayAlertTriggered: false
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${timer.name}"?`)) {
      onDeleteTimer(timer.id);
    }
  };

  const progress = ((timer.duration - timer.remainingTime) / timer.duration) * 100;
  const isCompleted = timer.status === 'completed';
  const isRunning = timer.status === 'running';

  return (
    <div className="p-2 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${isCompleted ? 'text-green-600' : ''}`}>
            {timer.name}
            {isCompleted && ' ✓'}
          </h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mt-1">
            <span>
              {formatTime(timer.remainingTime)} / {formatTime(timer.duration)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isCompleted ? 'bg-green-100 text-green-700' :
              isRunning ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {!isCompleted && (
            <>
              {isRunning ? (
                <Button size="sm" variant="outline" onClick={handlePause}>
                  <Pause className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleStart}>
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleReset}>
                <TimerReset className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 gap-1">
          <span>{Math.round(progress)}% complete</span>
          {timer.halfwayAlert && (
            <span className={timer.halfwayAlertTriggered ? 'text-orange-500' : ''}>
              🔔 Halfway alert {timer.halfwayAlertTriggered ? 'triggered' : 'enabled'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
