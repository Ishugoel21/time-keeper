
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Calendar, Clock, Tag } from 'lucide-react';
import { TimerHistoryEntry } from '@/types/timer';
import { formatDuration } from '@/utils/formatUtils';

interface TimerHistoryProps {
  history: TimerHistoryEntry[];
}

export const TimerHistory = ({ history }: TimerHistoryProps) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [...new Set(history.map(entry => entry.category))];
  const filteredHistory = filterCategory === 'all' 
    ? history 
    : history.filter(entry => entry.category === filterCategory);

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timer-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No history yet</h3>
        <p className="text-gray-600">Complete some timers to see your history here!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and export */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Timer History</h2>
            <span className="text-sm text-gray-600">
              {filteredHistory.length} completed timer{filteredHistory.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={exportHistory}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.map(entry => (
          <Card key={entry.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{entry.timerName}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {entry.category}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(entry.duration)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(entry.completedAt)}
                  </div>
                </div>
              </div>
              
              <div className="text-green-600 font-semibold">
                ✓ Completed
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
