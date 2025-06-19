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
  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);
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
    setCompletedTimer(timer);
    updateTimer(timer.id, { status: 'completed' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Timer Hub</h1>
            <p className="text-gray-600">Manage your time with customizable timers</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={activeView === 'timers' ? 'default' : 'outline'}
              onClick={() => setActiveView('timers')}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Timers
            </Button>
            <Button
              variant={activeView === 'history' ? 'default' : 'outline'}
              onClick={() => setActiveView('history')}
              className="flex items-center gap-2"
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
        {completedTimer && (
          <CompletionModal
            timer={completedTimer}
            onClose={() => setCompletedTimer(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
