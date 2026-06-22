import React, { useRef, useState, useEffect } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

// === IMPORT SERVICE FIREBASE RTDB ===
import { subscribeToRTDBSensors } from '../services/firebase/realTimeSensorService';

import GaugeCard from '../components/GaugeCard';
import SensorChartCard from '../components/SensorChartCard';

import { sensorLogs } from '../data/mockSensorLogs';
import {
  filterSensorLogs,
  SensorFilterType,
} from '../utils/filterSensorLogs';
import { exportSensorLogsToCsv } from '../services/export/csvExportService';

// === IMPORT SERVICE TELEGRAM ===
import { sendTelegramNotif } from '../services/axios/apiService';

type DashboardScreenProps = {
  username: string;
  onLogout: () => void;
};

type DashboardType = 'main' | 'temperature' | 'soil' | 'tds';

const DRAWER_WIDTH = 320;

export default function DashboardScreen({
  username,
  onLogout,
}: DashboardScreenProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeDashboard, setActiveDashboard] =
    useState<DashboardType>('main');

  const [downloadFilter, setDownloadFilter] =
    useState<SensorFilterType>('1h');

  const [downloadCustomDate, setDownloadCustomDate] =
    useState<Date | undefined>();

  const [showDownloadRangeModal, setShowDownloadRangeModal] =
    useState<boolean>(false);

  const [showDownloadDatePicker, setShowDownloadDatePicker] =
    useState<boolean>(false);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const defaultSensorLog = {
    timestamp: new Date().toISOString(),
    temperature: 0,
    soilMoisture: 0,
    tds: 0,
  };

  // State log realtime untuk grafik chart
  const [realTimeLogs, setRealTimeLogs] = useState<any[]>(
    sensorLogs.length > 0 ? sensorLogs : [defaultSensorLog]
  );

  // === INTEGRASI FIREBASE REALTIME DATABASE ===
  useEffect(() => {
    console.log('Menghubungkan ke Firebase Realtime Database...');

    const unsubscribe = subscribeToRTDBSensors((data) => {
      if (data) {
        console.log('Data baru diterima dari Firebase RTDB:', data);
        
        const newLog = {
          timestamp: new Date().toISOString(),
          temperature: Number(data.temperature ?? 0),
          soilMoisture: Number(data.soilMoisture ?? 0),
          tds: Number(data.tds ?? 0),
        };

        setRealTimeLogs((prevLogs) => {
          const updatedLogs = [...prevLogs, newLog];
          if (updatedLogs.length > 20) {
            updatedLogs.shift();
          }
          return updatedLogs;
        });
      }
    });

    return () => {
      unsubscribe();
      console.log('Koneksi Firebase RTDB diputus.');
    };
  }, []);

  const latestSensorData = realTimeLogs[realTimeLogs.length - 1] || defaultSensorLog;

  // =================================================================
  // LOGIKA PENGAWAS OTOMATIS & TELEGRAM
  // =================================================================
  const HAD_SUHU_TINGGI = 30;
  const HAD_KELEMBAPAN_RENDAH = 30;
  const HAD_KELEMBAPAN_TINGGI = 80;

  const statusGabunganTerakhir = useRef<string | null>(null);

  useEffect(() => {
    const evaluasiKondisi = async () => {
      // Abaikan jika data masih default kosong (mencegah salah deteksi di awal)
      if (!latestSensorData || latestSensorData.temperature === 0) return;

      const suhu = latestSensorData.temperature;
      const kelembapan = latestSensorData.soilMoisture;
      const tds = latestSensorData.tds;

      // Evaluasi Kondisi Bahaya/Aman
      const isSuhuBahaya = suhu >= HAD_SUHU_TINGGI;
      const isKelembapanKering = kelembapan < HAD_KELEMBAPAN_RENDAH;
      const isKelembapanBasah = kelembapan > HAD_KELEMBAPAN_TINGGI;

      const teksSuhu = isSuhuBahaya ? "🔥 PANAS EKSTREM" : "✅ AMAN";
      const teksKelembapan = isKelembapanKering ? "💧 KERING (Kritis)" : 
                             isKelembapanBasah ? "🌊 BANJIR (Terlalu Basah)" : "✅ AMAN (Cukup Lembap)";

      // Membuat kode status unik berbasis kondisi terkini
      const kodeStatus = `${isSuhuBahaya ? 'PANAS' : 'AMAN'}_${
        isKelembapanKering ? 'KERING' : isKelembapanBasah ? 'BANJIR' : 'AMAN'
      }`;

      // Kirim otomatis HANYA JIKA status berubah (anti-spam)
      if (statusGabunganTerakhir.current !== kodeStatus) {
        statusGabunganTerakhir.current = kodeStatus;

        let judul = "✅ NORMAL: SEMUA SISTEM STABIL";
        if (isSuhuBahaya || isKelembapanKering || isKelembapanBasah) {
          judul = (isSuhuBahaya && (isKelembapanKering || isKelembapanBasah)) 
                  ? "🚨 KRITIS MULTIPEL: SISTEM DALAM BAHAYA!" 
                  : "⚠️ PERINGATAN: TERDAPAT ANOMALI SENSOR!";
        }

        const pesan = `<b>${judul}</b>\n\n• Suhu Lingkungan: ${suhu}°C\n  └ Status: ${teksSuhu}\n\n• Kelembapan Tanah: ${kelembapan}%\n  └ Status: ${teksKelembapan}\n\n• Kadar Air (TDS): ${tds} ppm`;
        
        await sendTelegramNotif(pesan);
      }
    };

    evaluasiKondisi();
  }, [latestSensorData]);
  // =================================================================

  const chartLabels = realTimeLogs.map((item) => {
    const date = new Date(item.timestamp);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  });

  const temperatureData = realTimeLogs.map((item) => item.temperature);
  const soilMoistureData = realTimeLogs.map((item) => item.soilMoisture);
  const tdsData = realTimeLogs.map((item) => item.tds);

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsMenuOpen(false);
    });
  };

  const handleSelectDashboard = (dashboard: DashboardType) => {
    setActiveDashboard(dashboard);
    handleCloseMenu();
  };

  const handleLogout = () => {
    handleCloseMenu();
    onLogout();
  };

  const getDashboardTitle = () => {
    if (activeDashboard === 'temperature') return 'Dashboard Suhu';
    if (activeDashboard === 'soil') return 'Dashboard Kelembapan Tanah';
    if (activeDashboard === 'tds') return 'Dashboard TDS';
    return 'EL - Garden';
  };

  const getDownloadRangeLabel = () => {
    if (downloadFilter === '1h') return '1 Jam';
    if (downloadFilter === '1d') return '1 Hari';
    if (downloadFilter === '1w') return '1 Minggu';
    if (downloadFilter === '1m') return '1 Bulan';
    if (downloadFilter === 'custom' && downloadCustomDate) {
      return downloadCustomDate.toLocaleDateString('id-ID');
    }
    return 'Custom';
  };

  const getDownloadLogs = () => {
    return filterSensorLogs(realTimeLogs, downloadFilter, downloadCustomDate);
  };

  const handleSelectDownloadRange = (filter: SensorFilterType) => {
    setShowDownloadRangeModal(false);
    if (filter === 'custom') {
      setShowDownloadDatePicker(true);
      return;
    }
    setDownloadFilter(filter);
    setDownloadCustomDate(undefined);
  };

  const handleChangeDownloadDate = (
    _event: DateTimePickerEvent,
    date?: Date
  ) => {
    setShowDownloadDatePicker(false);
    if (date) {
      setDownloadCustomDate(date);
      setDownloadFilter('custom');
    }
  };

  const handleDownloadCsv = async () => {
    try {
      const downloadLogs = getDownloadLogs();
      if (downloadLogs.length === 0) {
        Alert.alert(
          'Data Kosong',
          'Tidak ada data sensor pada rentang waktu yang dipilih.'
        );
        return;
      }
      await exportSensorLogsToCsv(downloadLogs);
    } catch (error) {
      Alert.alert(
        'Download Gagal',
        'Data log gagal diunduh. Silakan coba lagi.'
      );
    }
  };

  const openDownloadRangeModal = () => {
    setShowDownloadRangeModal(true);
  };

  // Pemicu Notifikasi Manual via Tombol
  const handleSendNotification = async () => {
    const suhu = latestSensorData.temperature;
    const kelembapan = latestSensorData.soilMoisture;
    const tds = latestSensorData.tds;

    const pesan = `📢 <b>LAPORAN MANUAL USER</b>\n\n• Suhu: ${suhu}°C\n• Kelembapan Tanah: ${kelembapan}%\n• Kadar Air (TDS): ${tds} ppm\n\n Dikirim secara manual via aplikasi.`;

    try {
      await sendTelegramNotif(pesan);
      Alert.alert('Berhasil', 'Laporan data sensor saat ini telah dikirim ke Telegram.');
    } catch (error) {
      Alert.alert('Gagal', 'Gagal terhubung ke Telegram. Periksa log atau token Anda.');
    }
  };

  const renderNotificationButton = () => {
    return (
      <Pressable
        style={styles.notificationButton}
        onPress={handleSendNotification}
      >
        <Text style={styles.notificationButtonText}>
          Kirim Notifikasi Telegram
        </Text>
      </Pressable>
    );
  };

  const renderRealtimeInfo = () => {
    return (
      <View style={styles.realTimeCard}>
        <View style={styles.realTimeDot} />
        <Text style={styles.realTimeText}>
           
        </Text>
      </View>
    );
  };

  const renderDashboardContent = () => {
    const currentTemp = latestSensorData?.temperature ?? 0;
    const currentMoisture = latestSensorData?.soilMoisture ?? 0;

    if (activeDashboard === 'temperature') {
      return (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Dashboard Suhu</Text>
            <Text style={styles.infoText}>
              Pemantauan suhu lingkungan.
            </Text>
          </View>

          {renderRealtimeInfo()}
          {renderNotificationButton()}

          <GaugeCard
            title="Suhu"
            value={currentTemp}
            unit="°C"
            min={0}
            max={100}
            status={currentTemp >= HAD_SUHU_TINGGI ? "PANAS EKSTREM" : "Normal"}
          />

          <SensorChartCard
            title="Grafik Suhu"
            labels={chartLabels}
            datasets={[
              {
                data: temperatureData,
                color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
                strokeWidth: 3,
              },
            ]}
            suffix="°C"
            downloadRangeLabel={getDownloadRangeLabel()}
            onOpenDownloadRange={openDownloadRangeModal}
            onDownloadCsv={handleDownloadCsv}
          />

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Keterangan</Text>
            <Text style={styles.bottomText}>
              {currentTemp >= HAD_SUHU_TINGGI 
                ? "Suhu melewati batas aman! Segera lakukan pengecekan pendingin ruangan / lingkungan." 
                : "Suhu berada dalam kondisi normal untuk pemantauan lingkungan."}
            </Text>
          </View>
        </>
      );
    }

    if (activeDashboard === 'soil') {
      return (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Dashboard Kelembapan Tanah</Text>
            <Text style={styles.infoText}>
              Kondisi kelembapan tanah.
            </Text>
          </View>

          {renderRealtimeInfo()}
          {renderNotificationButton()}

          <GaugeCard
            title="Kelembapan Tanah"
            value={currentMoisture}
            unit="%"
            min={0}
            max={100}
            status={
              currentMoisture < HAD_KELEMBAPAN_RENDAH ? "Tanah Kering (Kritis)" :
              currentMoisture > HAD_KELEMBAPAN_TINGGI ? "Tanah Terlalu Basah / Banjir" : "Tanah cukup lembap"
            }
          />

          <SensorChartCard
            title="Grafik Kelembapan Tanah"
            labels={chartLabels}
            datasets={[
              {
                data: soilMoistureData,
                color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
                strokeWidth: 3,
              },
            ]}
            suffix="%"
            downloadRangeLabel={getDownloadRangeLabel()}
            onOpenDownloadRange={openDownloadRangeModal}
            onDownloadCsv={handleDownloadCsv}
          />

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Keterangan</Text>
            <Text style={styles.bottomText}>
              {currentMoisture < HAD_KELEMBAPAN_RENDAH ? "Kondisi tanah kritis! Diperlukan penyiraman air sesegera mungkin." :
               currentMoisture > HAD_KELEMBAPAN_TINGGI ? "Volume air terlalu tinggi. Pastikan sistem drainase berfungsi baik." :
               "Kelembapan tanah masih cukup baik untuk kebutuhan tanaman."}
            </Text>
          </View>
        </>
      );
    }

    if (activeDashboard === 'tds') {
      return (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Dashboard TDS</Text>
            <Text style={styles.infoText}>
              Kadar larutan atau nutrisi air.
            </Text>
          </View>

          {renderRealtimeInfo()}
          {renderNotificationButton()}

          <GaugeCard
            title="Kadar Air / TDS"
            value={latestSensorData?.tds ?? 0}
            unit="ppm"
            min={0} 
            max={100}
            status="Kadar larutan stabil"
          />

          <SensorChartCard
            title="Grafik TDS"
            labels={chartLabels}
            datasets={[
              {
                data: tdsData,
                color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
                strokeWidth: 3,
              },
            ]}
            suffix="ppm"
            downloadRangeLabel={getDownloadRangeLabel()}
            onOpenDownloadRange={openDownloadRangeModal}
            onDownloadCsv={handleDownloadCsv}
          />

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Keterangan</Text>
            <Text style={styles.bottomText}>
              Nilai TDS menunjukkan kadar larutan masih berada pada batas stabil.
            </Text>
          </View>
        </>
      );
    }

    return (
      <>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Dashboard Sensor</Text>
          <Text style={styles.infoText}>
            Monitoring suhu, kelembapan tanah, dan kadar larutan.
          </Text>
        </View>

        {renderRealtimeInfo()}
        {renderNotificationButton()}

        <GaugeCard
          title="Suhu"
          value={currentTemp}
          unit="°C"
          min={0}
          max={100}
          status={currentTemp >= HAD_SUHU_TINGGI ? "PANAS EKSTREM" : "Normal"}
        />

        <GaugeCard
          title="Kelembapan Tanah"
          value={currentMoisture}
          unit="%"
          min={0}
          max={100}
          status={
            currentMoisture < HAD_KELEMBAPAN_RENDAH ? "Tanah Kering (Kritis)" :
            currentMoisture > HAD_KELEMBAPAN_TINGGI ? "Tanah Banjir" : "Tanah cukup lembap"
          }
        />

        <GaugeCard
          title="Kadar Air / TDS"
          value={latestSensorData?.tds ?? 0}
          unit="ppm"
          min={0}
          max={100}
          status="Kadar larutan stabil"
        />

        <SensorChartCard
          title="Grafik Gabungan Sensor"
          labels={chartLabels}
          datasets={[
            {
              data: temperatureData,
              color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
              strokeWidth: 3,
            },
            {
              data: soilMoistureData,
              color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
              strokeWidth: 3,
            },
          ]}
          downloadRangeLabel={getDownloadRangeLabel()}
          onOpenDownloadRange={openDownloadRangeModal}
          onDownloadCsv={handleDownloadCsv}
        />

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Keterangan Grafik</Text>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.temperatureDot]} />
            <Text style={styles.legendText}>
              Garis hijau menunjukkan data suhu dalam satuan °C.
            </Text>
          </View>

          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.soilDot]} />
            <Text style={styles.legendText}>
              Garis biru menunjukkan data kelembapan tanah dalam satuan %.
            </Text>
          </View>

          <View style={styles.legendNoteBox}>
            <Text style={styles.legendNoteText}>
              Data TDS tidak ditampilkan pada grafik gabungan karena memiliki
              skala nilai lebih besar. Grafik TDS tersedia pada Dashboard TDS.
            </Text>
          </View>
        </View>

        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>Status Sistem</Text>
          <Text style={styles.bottomText}>
            {(currentTemp >= HAD_SUHU_TINGGI || currentMoisture < HAD_KELEMBAPAN_RENDAH || currentMoisture > HAD_KELEMBAPAN_TINGGI)
              ? "🚨 Terdeteksi masalah pada salah satu parameter sensor!"
              : "Semua sensor aktif dan berada pada batas normal aman."}
          </Text>
          <Text style={styles.bottomSubText}>
            
          </Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={showDownloadRangeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDownloadRangeModal(false)}
      >
        <View style={styles.rangeModalOverlay}>
          <Pressable
            style={styles.rangeModalCloseArea}
            onPress={() => setShowDownloadRangeModal(false)}
          />

          <View style={styles.rangeModalCard}>
            <Text style={styles.rangeModalTitle}>Pilih Data Log</Text>

            <Pressable
              style={[
                styles.rangeModalItem,
                downloadFilter === '1h' && styles.activeRangeModalItem,
              ]}
              onPress={() => handleSelectDownloadRange('1h')}
            >
              <Text
                style={[
                  styles.rangeModalText,
                  downloadFilter === '1h' && styles.activeRangeModalText,
                ]}
              >
                1 Jam Terakhir
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.rangeModalItem,
                downloadFilter === '1d' && styles.activeRangeModalItem,
              ]}
              onPress={() => handleSelectDownloadRange('1d')}
            >
              <Text
                style={[
                  styles.rangeModalText,
                  downloadFilter === '1d' && styles.activeRangeModalText,
                ]}
              >
                1 Hari Terakhir
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.rangeModalItem,
                downloadFilter === '1w' && styles.activeRangeModalItem,
              ]}
              onPress={() => handleSelectDownloadRange('1w')}
            >
              <Text
                style={[
                  styles.rangeModalText,
                  downloadFilter === '1w' && styles.activeRangeModalText,
                ]}
              >
                1 Minggu Terakhir
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.rangeModalItem,
                downloadFilter === '1m' && styles.activeRangeModalItem,
              ]}
              onPress={() => handleSelectDownloadRange('1m')}
            >
              <Text
                style={[
                  styles.rangeModalText,
                  downloadFilter === '1m' && styles.activeRangeModalText,
                ]}
              >
                1 Bulan Terakhir
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.rangeModalItem,
                downloadFilter === 'custom' && styles.activeRangeModalItem,
              ]}
              onPress={() => handleSelectDownloadRange('custom')}
            >
              <Text
                style={[
                  styles.rangeModalText,
                  downloadFilter === 'custom' && styles.activeRangeModalText,
                ]}
              >
                Pilih Tanggal Sendiri
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {showDownloadDatePicker && (
        <DateTimePicker
          value={downloadCustomDate || new Date()}
          mode="date"
          display="default"
          onChange={handleChangeDownloadDate}
        />
      )}

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="none"
        onRequestClose={handleCloseMenu}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.overlayArea} onPress={handleCloseMenu} />

          <Animated.View
            style={[
              styles.leftDrawer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.menuHeader}>
              <Pressable onPress={handleCloseMenu}>
                <Text style={styles.closeIcon}>×</Text>
              </Pressable>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuSectionTitle}>DASHBOARD</Text>

              <Pressable
                style={[
                  styles.menuListItem,
                  activeDashboard === 'main' && styles.activeMenuListItem,
                ]}
                onPress={() => handleSelectDashboard('main')}
              >
                <Text
                  style={[
                    styles.menuListText,
                    activeDashboard === 'main' && styles.activeMenuListText,
                  ]}
                >
                  Dashboard Utama
                </Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.menuListItem,
                  activeDashboard === 'temperature' &&
                    styles.activeMenuListItem,
                ]}
                onPress={() => handleSelectDashboard('temperature')}
              >
                <Text
                  style={[
                    styles.menuListText,
                    activeDashboard === 'temperature' &&
                      styles.activeMenuListText,
                  ]}
                >
                  Dashboard Suhu
                </Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.menuListItem,
                  activeDashboard === 'soil' && styles.activeMenuListItem,
                ]}
                onPress={() => handleSelectDashboard('soil')}
              >
                <Text
                  style={[
                    styles.menuListText,
                    activeDashboard === 'soil' && styles.activeMenuListText,
                  ]}
                >
                  Dashboard Kelembapan Tanah
                </Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.menuListItem,
                  activeDashboard === 'tds' && styles.activeMenuListItem,
                ]}
                onPress={() => handleSelectDashboard('tds')}
              >
                <Text
                  style={[
                    styles.menuListText,
                    activeDashboard === 'tds' && styles.activeMenuListText,
                  ]}
                >
                  Dashboard TDS
                </Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable style={styles.logoutFullButton} onPress={handleLogout}>
                <Text style={styles.logoutFullText}>Logout</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.topBar}>
            <Pressable style={styles.menuButton} onPress={handleOpenMenu}>
              <Text style={styles.menuIcon}>☰</Text>
            </Pressable>

            <View style={styles.headerTextBox}>
              <Text style={styles.greeting}>Halo, {username}</Text>
              <Text style={styles.headerTitle}>{getDashboardTitle()}</Text>
            </View>
          </View>
        </View>

        {renderDashboardContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ECFDF5' 
  },
  wrapper: { 
    padding: 20, 
    paddingBottom: 36 
  },
  header: { 
    backgroundColor: '#064E3B', 
    borderRadius: 28, 
    padding: 18, 
    marginBottom: 20 
  },
  topBar: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  menuButton: { 
    width: 50, 
    height: 50, 
    borderRadius: 16, 
    backgroundColor: '#10B981', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14 
  },
  menuIcon: { 
    fontSize: 28, 
    color: '#FFFFFF', 
    fontWeight: '900', 
    marginTop: -2 
  },
  headerTextBox: { 
    flex: 1 
  },
  greeting: { 
    fontSize: 14, 
    color: '#A7F3D0', 
    marginBottom: 4 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#FFFFFF' 
  },
  infoCard: { 
    backgroundColor: '#D1FAE5', 
    borderRadius: 22, 
    padding: 18, 
    marginBottom: 18 
  },
  infoTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#064E3B', 
    marginBottom: 6 
  },
  infoText: { 
    fontSize: 14, 
    color: '#047857', 
    lineHeight: 20 
  },
  realTimeCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 18, 
    padding: 14, 
    marginBottom: 18, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#A7F3D0' 
  },
  realTimeDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#10B981', 
    marginRight: 10 
  },
  realTimeText: { 
    flex: 1, 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#065F46', 
    lineHeight: 19 
  },
  notificationButton: { 
    backgroundColor: '#059669', 
    borderRadius: 18, 
    paddingVertical: 15, 
    paddingHorizontal: 18, 
    alignItems: 'center', 
    marginBottom: 18 
  },
  notificationButtonText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '900' 
  },
  legendCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 22, 
    padding: 18, 
    marginBottom: 18 
  },
  legendTitle: { 
    fontSize: 17, 
    fontWeight: '900', 
    color: '#064E3B', 
    marginBottom: 14 
  },
  legendRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  legendDot: { 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    marginRight: 10 
  },
  temperatureDot: { 
    backgroundColor: '#16A34A' 
  },
  soilDot: { 
    backgroundColor: '#0EA5E9' 
  },
  legendText: { 
    flex: 1, 
    fontSize: 13, 
    color: '#047857', 
    lineHeight: 20 
  },
  legendNoteBox: { 
    backgroundColor: '#ECFDF5', 
    borderRadius: 14, 
    padding: 12, 
    marginTop: 4 
  },
  legendNoteText: { 
    fontSize: 12, 
    color: '#065F46', 
    lineHeight: 18 
  },
  bottomCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 22, 
    padding: 18, 
    marginTop: 4 
  },
  bottomTitle: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#064E3B', 
    marginBottom: 8 
  },
  bottomText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#059669', 
    marginBottom: 8, 
    lineHeight: 20 
  },
  bottomSubText: { 
    fontSize: 13, 
    color: '#64748B', 
    lineHeight: 19 
  },
  rangeModalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.35)', 
    justifyContent: 'center', 
    paddingHorizontal: 28 
  },
  rangeModalCloseArea: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0 
  },
  rangeModalCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 20 
  },
  rangeModalTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#064E3B', 
    marginBottom: 14 
  },
  rangeModalItem: { 
    paddingVertical: 15, 
    paddingHorizontal: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB', 
    borderRadius: 12 
  },
  activeRangeModalItem: { 
    backgroundColor: '#ECFDF5' 
  },
  rangeModalText: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#065F46' 
  },
  activeRangeModalText: { 
    color: '#059669' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.35)' 
  },
  overlayArea: { 
    flex: 1 
  },
  leftDrawer: { 
    position: 'absolute', 
    left: 0, 
    top: 0, 
    bottom: 0, 
    width: DRAWER_WIDTH, 
    backgroundColor: '#F8FAFC', 
    paddingTop: 20, 
    paddingHorizontal: 24, 
    paddingBottom: 28, 
    borderTopRightRadius: 28, 
    borderBottomRightRadius: 28, 
    zIndex: 10 
  },
  menuHeader: { 
    alignItems: 'flex-end', 
    paddingTop: 10, 
    paddingBottom: 28 
  },
  closeIcon: { 
    fontSize: 42, 
    color: '#064E3B', 
    fontWeight: '300' 
  },
  menuContent: { 
    flex: 1 
  },
  menuSectionTitle: { 
    fontSize: 15, 
    fontWeight: '900', 
    color: '#064E3B', 
    marginBottom: 12 
  },
  menuListItem: { 
    borderTopWidth: 1, 
    borderTopColor: '#E5E7EB', 
    paddingVertical: 18, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  activeMenuListItem: { 
    backgroundColor: '#ECFDF5', 
    paddingHorizontal: 12, 
    borderRadius: 8 
  },
  menuListText: { 
    fontSize: 15, 
    fontWeight: '900', 
    color: '#065F46' 
  },
  activeMenuListText: { 
    color: '#059669' 
  },
  chevron: { 
    fontSize: 34, 
    color: '#065F46', 
    fontWeight: '300' 
  },
  logoutFullButton: { 
    backgroundColor: '#DC2626', 
    borderRadius: 10, 
    paddingVertical: 15, 
    marginTop: 'auto' 
  },
  logoutFullText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '900', 
    textAlign: 'center' 
  },
});











