
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Play, Pause, TimerReset } from 'lucide-react';
import { Timer, CategoryGroup } from '@/types/timer';
import { TimerItem } from './TimerItem';

interface TimerListProps {
  timers: Timer[];
  onUpdateTimer: (id: string, updates: Partial<Timer>) => void;
  onDeleteTimer: (id: string) => void;
  onTimerComplete: (timer: Timer) => void;
}

export const TimerList = ({ timers, onUpdateTimer, onDeleteTimer, onTimerComplete }: TimerListProps) => {
  // Start with all categories expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const categoryGroups: CategoryGroup[] = useMemo(() => {
    console.log('TimerList - Processing timers:', timers);
    
    const groups = timers.reduce((acc, timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }
      acc[timer.category].push(timer);
      return acc;
    }, {} as Record<string, Timer[]>);

    console.log('TimerList - Category groups:', groups);

    const categoryGroups = Object.entries(groups).map(([category, timers]) => ({
      category,
      timers: timers.sort((a, b) => a.name.localeCompare(b.name)),
      isExpanded: expandedCategories.has(category),
    }));

    // Auto-expand categories that aren't already tracked
    const newCategories = Object.keys(groups).filter(cat => !expandedCategories.has(cat));
    if (newCategories.length > 0) {
      setExpandedCategories(prev => {
        const newSet = new Set(prev);
        newCategories.forEach(cat => newSet.add(cat));
        return newSet;
      });
    }

    return categoryGroups;
  }, [timers, expandedCategories]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleCategoryAction = (category: string, action: 'start' | 'pause' | 'reset') => {
    const categoryTimers = timers.filter(t => t.category === category);
    categoryTimers.forEach(timer => {
      if (action === 'start' && timer.status !== 'running' && timer.status !== 'completed') {
        onUpdateTimer(timer.id, { status: 'running' });
      } else if (action === 'pause' && timer.status === 'running') {
        onUpdateTimer(timer.id, { status: 'paused' });
      } else if (action === 'reset') {
        onUpdateTimer(timer.id, { 
          status: 'paused', 
          remainingTime: timer.duration,
          halfwayAlertTriggered: false
        });
      }
    });
  };

  if (timers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No timers yet</h3>
        <p className="text-gray-600">Click "Add New Timer" to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {categoryGroups.map(({ category, timers: categoryTimers, isExpanded }) => (
        <Card key={category} className="overflow-hidden">
          {/* Category Header */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-2 p-0 h-auto font-semibold text-lg"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                {category}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({categoryTimers.length} timer{categoryTimers.length !== 1 ? 's' : ''})
                </span>
              </Button>
              
              {/* Category Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCategoryAction(category, 'start')}
                  className="flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  Start All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCategoryAction(category, 'pause')}
                  className="flex items-center gap-1"
                >
                  <Pause className="w-3 h-3" />
                  Pause All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCategoryAction(category, 'reset')}
                  className="flex items-center gap-1"
                >
                  <TimerReset className="w-3 h-3" />
                  Reset All
                </Button>
              </div>
            </div>
          </div>

          {/* Category Timers */}
          {isExpanded && (
            <div className="divide-y">
              {categoryTimers.map(timer => (
                <TimerItem
                  key={timer.id}
                  timer={timer}
                  onUpdateTimer={onUpdateTimer}
                  onDeleteTimer={onDeleteTimer}
                  onTimerComplete={onTimerComplete}
                />
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
