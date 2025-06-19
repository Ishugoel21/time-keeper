import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, History, Clock } from 'lucide-react';
import { AddTimerForm } from '@/components/AddTimerForm';
import { TimerList } from '@/components/TimerList';
import { TimerHistory } from '@/components/TimerHistory';
import { CompletionModal } from '@/components/CompletionModal';
import { Timer, TimerHistoryEntry } from '@/types/timer';
import { saveTimers, loadTimers, saveHistory, loadHistory } from '@/utils/storage';

const Index = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [history, setHistory] = useState<TimerHistoryEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [completedQueue, setCompletedQueue] = useState<Timer[]>([]);
  const [activeView, setActiveView] = useState<'timers' | 'history'>('timers');

  // Load data on component mount
  useEffect(() => {
    const savedTimers = loadTimers();
    const savedHistory = loadHistory();
    console.log('Index - Loaded timers:', savedTimers);
    console.log('Index - Loaded history:', savedHistory);
    setTimers(savedTimers);
    setHistory(savedHistory);
  }, []);

  // Save timers whenever they change
  useEffect(() => {
    console.log('Index - Saving timers:', timers);
    saveTimers(timers);
  }, [timers]);

  // Save history whenever it changes
  useEffect(() => {
    console.log('Index - Saving history:', history);
    saveHistory(history);
  }, [history]);

  // Save history and timers on page unload to ensure persistence
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveHistory(history);
      saveTimers(timers);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [history, timers]);

  const addTimer = (newTimer: Omit<Timer, 'id' | 'status' | 'remainingTime'>) => {
    console.log('Index - addTimer called with:', newTimer);
    
    const timer: Timer = {
      ...newTimer,
      id: Date.now().toString(),
      status: 'paused',
      remainingTime: newTimer.duration,
    };
    
    console.log('Index - Created timer object:', timer);
    
    setTimers(prev => {
      const newTimers = [...prev, timer];
      console.log('Index - New timers array:', newTimers);
      return newTimers;
    });
    
    setShowAddForm(false);
  };

  const updateTimer = (id: string, updates: Partial<Timer>) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id ? { ...timer, ...updates } : timer
    ));
  };

  const deleteTimer = (id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
  };

  const onTimerComplete = (timer: Timer) => {
    const historyEntry: TimerHistoryEntry = {
      id: Date.now().toString(),
      timerName: timer.name,
      category: timer.category,
      duration: timer.duration,
      completedAt: new Date().toISOString(),
    };
    setHistory(prev => [historyEntry, ...prev]);
    setCompletedQueue(prev => [...prev, timer]);
    updateTimer(timer.id, { status: 'completed' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Timer Hub</h1>
            <p className="text-gray-600">Manage your time with customizable timers</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant={activeView === 'timers' ? 'default' : 'outline'}
              onClick={() => setActiveView('timers')}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Clock className="w-4 h-4" />
              Timers
            </Button>
            <Button
              variant={activeView === 'history' ? 'default' : 'outline'}
              onClick={() => setActiveView('history')}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'timers' ? (
          <div className="space-y-6">
            {/* Add Timer Button */}
            <Card className="p-6">
              <Button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center gap-2 py-6 text-lg"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Add New Timer
              </Button>
            </Card>

            {/* Global Timer Actions */}
            <Card className="p-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center">
              <Button
                variant="outline"
                onClick={() => setTimers(prev => prev.map(timer =>
                  timer.status !== 'completed' ? { ...timer, status: 'running' } : timer
                ))}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                Start All
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTimers(prev => prev.map(timer =>
                    timer.status === 'running' ? { ...timer, status: 'paused' } : timer
                  ));
                  setCompletedQueue([]);
                }}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                Pause All
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTimers(prev => prev.map(timer =>
                    timer.status !== 'completed' ? { ...timer, status: 'paused', remainingTime: timer.duration, halfwayAlertTriggered: false } : timer
                  ));
                  setCompletedQueue([]);
                }}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                Reset All
              </Button>
            </Card>

            {/* Timer List */}
            <TimerList
              timers={timers}
              onUpdateTimer={updateTimer}
              onDeleteTimer={deleteTimer}
              onTimerComplete={onTimerComplete}
            />
          </div>
        ) : (
          <TimerHistory history={history} />
        )}

        {/* Add Timer Modal */}
        {showAddForm && (
          <AddTimerForm
            onAddTimer={addTimer}
            onClose={() => setShowAddForm(false)}
            existingCategories={[...new Set(timers.map(t => t.category))]}
          />
        )}

        {/* Completion Modal */}
        {completedQueue.length > 0 && (
          <CompletionModal
            timer={completedQueue[0]}
            onClose={() => setCompletedQueue(prev => prev.slice(1))}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
