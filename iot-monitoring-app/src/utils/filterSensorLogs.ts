export type SensorLog = {
  timestamp: string;
  temperature: number;
  soilMoisture: number;
  tds: number;
};

export type SensorFilterType = '1h' | '1d' | '1w' | '1m' | 'custom';

export const filterSensorLogs = (
  logs: SensorLog[],
  filterType: SensorFilterType,
  selectedDate?: Date
) => {
  const now = new Date();

  if (filterType === 'custom' && selectedDate) {
    return logs.filter((log) => {
      const logDate = new Date(log.timestamp);

      return (
        logDate.getFullYear() === selectedDate.getFullYear() &&
        logDate.getMonth() === selectedDate.getMonth() &&
        logDate.getDate() === selectedDate.getDate()
      );
    });
  }

  let startDate = new Date();

  if (filterType === '1h') {
    startDate.setHours(now.getHours() - 1);
  }

  if (filterType === '1d') {
    startDate.setDate(now.getDate() - 1);
  }

  if (filterType === '1w') {
    startDate.setDate(now.getDate() - 7);
  }

  if (filterType === '1m') {
    startDate.setMonth(now.getMonth() - 1);
  }

  return logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= now;
  });
};