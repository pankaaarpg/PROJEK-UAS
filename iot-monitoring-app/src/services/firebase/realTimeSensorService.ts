import { rtdb } from "./firebaseConfig";
import { ref, onValue, off } from "firebase/database";

// Interface data sensor agar aman secara TypeScript
export interface SensorData {
  soilMoisture: number;
  tds: number;
  temperature: number;
}

export const subscribeToRTDBSensors = (callback: (data: SensorData | null) => void) => {
  // Merujuk ke node 'sensor' di Realtime Database basrawok
  const sensorRef = ref(rtdb, "sensor");

  onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  // Fungsi pembersih (cleanup) untuk memutus koneksi saat tidak dipakai
  return () => off(sensorRef);
};