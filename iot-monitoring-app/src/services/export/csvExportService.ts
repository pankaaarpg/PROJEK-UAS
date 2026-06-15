import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

type SensorLog = {
  timestamp: string;
  temperature: number;
  soilMoisture: number;
  tds: number;
};

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
};

const formatFileNameDateTime = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
};

export const exportSensorLogsToCsv = async (logs: SensorLog[]) => {
  if (logs.length === 0) {
    throw new Error('Tidak ada data log untuk diekspor.');
  }

  const header = 'Tanggal/Waktu,Suhu (°C),Kelembapan Tanah (%),TDS (ppm)\n';

  const rows = logs
    .map((item) => {
      const dateTime = formatDateTime(item.timestamp);

      return `${dateTime},${item.temperature},${item.soilMoisture},${item.tds}`;
    })
    .join('\n');

  const csvContent = header + rows;

  const directory = FileSystem.documentDirectory || FileSystem.cacheDirectory;

  if (!directory) {
    throw new Error('Direktori penyimpanan tidak tersedia.');
  }

  const fileName = `sensor_logs_${formatFileNameDateTime()}.csv`;
  const fileUri = directory + fileName;

  await FileSystem.writeAsStringAsync(fileUri, csvContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const isAvailable = await Sharing.isAvailableAsync();

  if (!isAvailable) {
    throw new Error('Fitur berbagi file tidak tersedia di perangkat ini.');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: 'text/csv',
    dialogTitle: `Download ${fileName}`,
    UTI: 'public.comma-separated-values-text',
  });
};