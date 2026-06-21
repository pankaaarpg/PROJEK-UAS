import axios from 'axios';

// Ganti string di bawah dengan Token Bot dan Chat ID Telegram milik Anda
const TELEGRAM_BOT_TOKEN = '8628308059:AAHzuf_j_SueHuB8_DU7bSe2n5jGM6WUn18';
const TELEGRAM_CHAT_ID = '5781292573';

/**
 * Fungsi untuk mengirim pesan notifikasi ke Telegram
 * @param pesan Teks pesan dengan format HTML
 */
export const sendTelegramNotif = async (pesan: string) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: pesan,
      parse_mode: 'HTML',
    });

    console.log('✅ Notifikasi Telegram berhasil dikirim!');
  } catch (error) {
    console.error('❌ Gagal mengirim notifikasi Telegram:', error);
    throw error;
  }
};