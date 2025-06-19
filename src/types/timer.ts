
export interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  remainingTime: number; // in seconds
  category: string;
  status: 'running' | 'paused' | 'completed';
  halfwayAlert?: boolean;
  halfwayAlertTriggered?: boolean;
}

export interface TimerHistoryEntry {
  id: string;
  timerName: string;
  category: string;
  duration: number;
  completedAt: string;
}

export interface CategoryGroup {
  category: string;
  timers: Timer[];
  isExpanded: boolean;
}
