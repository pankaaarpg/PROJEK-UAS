import axios from 'axios';

// --- KONFIGURASI ESP32 ---
const ESP32_URL = 'http://192.168.1.100'; 

// --- KONFIGURASI TELEGRAM ---
const TELEGRAM_TOKEN = '8959505947:AAGE8XZIMudvI8aZTnn6L7iN7CYzaWw46kU';
const CHAT_ID = '5781292573';

// 1. FUNGSI MENARIK DATA DARI ESP32
export const getSensorData = async () => {
  try {
    const response = await axios.get(`${ESP32_URL}/data`);
    return response.data; 
  } catch (error) {
    console.error("Axios Error: Gagal menarik data ESP32", error);
    return null; 
  }
};

// 2. FUNGSI MENGIRIM NOTIFIKASI KE TELEGRAM
export const sendTelegramNotif = async (pesan: string) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await axios.post(url, { 
      chat_id: CHAT_ID, 
      text: `🚨 PERINGATAN SISTEM IoT!\n\n${pesan}` 
    });
    console.log("Notifikasi Telegram berhasil dikirim.");
  } catch (error) {
    console.error("Gagal mengirim notif Telegram:", error);
  }
};