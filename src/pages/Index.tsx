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
import { ThemeSwitcher } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [history, setHistory] = useState<TimerHistoryEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [completedQueue, setCompletedQueue] = useState<Timer[]>([]);
  const [activeView, setActiveView] = useState<'timers' | 'history'>('timers');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const categories = Array.from(new Set(timers.map(t => t.category)));

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
    <div className="min-h-screen bg-background text-foreground p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="w-full bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-500">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Timer Hub</h1>
              <p className="text-muted-foreground">Manage your time with customizable timers</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto items-center justify-end">
              <ThemeSwitcher />
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
            <Card className="p-4">
              {/* Category Dropdown and Actions - single row, mobile friendly */}
              <div className="flex flex-row gap-2 w-full overflow-x-auto no-scrollbar items-center justify-center whitespace-nowrap">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 min-w-[10rem]">
                    <SelectValue placeholder="Category actions..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!selectedCategory}
                  className="min-w-[80px]"
                  onClick={() => setTimers(prev => prev.map(timer =>
                    (selectedCategory === '__all__' || timer.category === selectedCategory) && timer.status !== 'completed'
                      ? { ...timer, status: 'running' }
                      : timer
                  ))}
                >
                  Start
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!selectedCategory}
                  className="min-w-[80px]"
                  onClick={() => {
                    setTimers(prev => prev.map(timer =>
                      (selectedCategory === '__all__' || timer.category === selectedCategory)
                        ? { ...timer, status: 'paused' }
                        : timer
                    ));
                    setCompletedQueue([]);
                  }}
                >
                  Pause
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!selectedCategory}
                  className="min-w-[80px]"
                  onClick={() => {
                    setTimers(prev => prev.map(timer =>
                      (selectedCategory === '__all__' || timer.category === selectedCategory)
                        ? { ...timer, status: 'paused', remainingTime: timer.duration, halfwayAlertTriggered: false }
                        : timer
                    ));
                    setCompletedQueue([]);
                  }}
                >
                  Reset
                </Button>
              </div>
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
