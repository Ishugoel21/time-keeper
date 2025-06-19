
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds: number): string => {
  return formatTime(seconds);
};

export const parseTimeInput = (input: string): number => {
  // Remove any whitespace
  const trimmed = input.trim();
  
  // If it's just a number, treat as seconds
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  
  // Handle MM:SS format
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    const [minutes, seconds] = trimmed.split(':').map(Number);
    return minutes * 60 + seconds;
  }
  
  // Handle HH:MM:SS format
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(trimmed)) {
    const [hours, minutes, seconds] = trimmed.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  // Default to 0 if format is not recognized
  return 0;
};
