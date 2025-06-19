import { Timer, TimerHistoryEntry } from '@/types/timer';

const TIMERS_KEY = 'timer-hub-timers';
const HISTORY_KEY = 'timer-hub-history';

export const saveTimers = (timers: Timer[]): void => {
  try {
    localStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error('Error saving timers:', error);
  }
};

export const loadTimers = (): Timer[] => {
  try {
    const saved = localStorage.getItem(TIMERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading timers:', error);
    return [];
  }
};

export const saveHistory = (history: TimerHistoryEntry[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

export const loadHistory = (): TimerHistoryEntry[] => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};
