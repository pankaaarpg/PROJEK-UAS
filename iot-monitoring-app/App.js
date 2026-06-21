import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

// Memanggil mesin Telegram dari file yang Anda buat
import { sendTelegramNotif } from './src/services/axios/apiService';

export default function App() {
  const [status, setStatus] = useState("Sistem Siap. Menunggu input...");

  const testGardenMonitoring = async () => {
    setStatus("Mengecek data kebun...");
    
    // Data Mentah Kritis
    const mockDataKebun = {
      suhu: 36.2,
      kelembapan_udara: 40,
      kelembapan_tanah: 15,
      cahaya: 85000,
      status_pompa: "OFF"
    };

    let pesanPeringatan = "";

    if (mockDataKebun.kelembapan_tanah < 30) {
      pesanPeringatan += `💧 TANAH KERING! Kelembapan hanya ${mockDataKebun.kelembapan_tanah}%.\n`;
    }
    if (mockDataKebun.suhu > 35) {
      pesanPeringatan += `🔥 SUHU PANAS! Terdeteksi ${mockDataKebun.suhu}°C di area kebun.\n`;
    }

    if (pesanPeringatan !== "") {
      await sendTelegramNotif(pesanPeringatan);
      setStatus("Bahaya! Notif Telegram Terkirim.");
      Alert.alert("Berhasil", "Sinyal bahaya dikirim ke Telegram!");
    } else {
      setStatus("Kebun Aman Terkendali.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIMULATOR SMART GARDEN</Text>
      <Text style={styles.status}>{status}</Text>
      
      <TouchableOpacity style={styles.btn} onPress={testGardenMonitoring}>
        <Text style={styles.btnText}>SIMULASI SENSOR BAHAYA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#00FF9D', marginBottom: 20, letterSpacing: 1 },
  status: { color: '#E0E0E0', marginBottom: 40, fontSize: 14 },
  btn: { backgroundColor: '#FF4444', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8, elevation: 5 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});