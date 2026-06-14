import React, { useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import GaugeCard from '../components/GaugeCard';

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

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const sensorData = {
    temperature: 28,
    soilMoisture: 64,
    tds: 720,
  };

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
    return 'IoT Monitoring';
  };

  const renderDashboardContent = () => {
    if (activeDashboard === 'temperature') {
      return (
        <>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Dashboard Suhu</Text>
            <Text style={styles.infoText}>
              Menampilkan pemantauan suhu lingkungan dari sensor IoT.
            </Text>
          </View>

          <GaugeCard
            title="Suhu"
            value={sensorData.temperature}
            unit="°C"
            min={0}
            max={50}
            status="Normal"
          />

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Keterangan</Text>
            <Text style={styles.bottomText}>
              Suhu berada dalam kondisi normal untuk pemantauan lingkungan.
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
              Menampilkan kondisi kelembapan tanah berdasarkan sensor moisture.
            </Text>
          </View>

          <GaugeCard
            title="Kelembapan Tanah"
            value={sensorData.soilMoisture}
            unit="%"
            min={0}
            max={100}
            status="Tanah cukup lembap"
          />

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Keterangan</Text>
            <Text style={styles.bottomText}>
              Kelembapan tanah masih cukup baik untuk kebutuhan tanaman.
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
              Menampilkan kadar larutan atau nutrisi air berdasarkan sensor TDS.
            </Text>
          </View>

          <GaugeCard
            title="Kadar Air / TDS"
            value={sensorData.tds}
            unit="ppm"
            min={0}
            max={1500}
            status="Kadar larutan stabil"
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
            Monitoring suhu, kelembapan tanah, dan kadar larutan menggunakan sensor TDS.
          </Text>
        </View>

        <GaugeCard
          title="Suhu"
          value={sensorData.temperature}
          unit="°C"
          min={0}
          max={50}
          status="Normal"
        />

        <GaugeCard
          title="Kelembapan Tanah"
          value={sensorData.soilMoisture}
          unit="%"
          min={0}
          max={100}
          status="Tanah cukup lembap"
        />

        <GaugeCard
          title="Kadar Air / TDS"
          value={sensorData.tds}
          unit="ppm"
          min={0}
          max={1500}
          status="Kadar larutan stabil"
        />

        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>Status Sistem</Text>
          <Text style={styles.bottomText}>
            Semua sensor aktif dan siap mengirim data.
          </Text>
          <Text style={styles.bottomSubText}>
            Data saat ini masih menggunakan mock data. Nanti bagian ini dapat disambungkan ke Axios atau Firebase.
          </Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
    backgroundColor: '#ECFDF5',
  },

  wrapper: {
    padding: 20,
    paddingBottom: 36,
  },

  header: {
    backgroundColor: '#064E3B',
    borderRadius: 28,
    padding: 18,
    marginBottom: 20,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  menuIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: -2,
  },

  headerTextBox: {
    flex: 1,
  },

  greeting: {
    fontSize: 14,
    color: '#A7F3D0',
    marginBottom: 4,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  infoCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },

  infoTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },

  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginTop: 4,
  },

  bottomTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 8,
  },

  bottomText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
    lineHeight: 20,
  },

  bottomSubText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  overlayArea: {
    flex: 1,
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
    zIndex: 10,
  },

  menuHeader: {
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingBottom: 28,
  },

  closeIcon: {
    fontSize: 42,
    color: '#064E3B',
    fontWeight: '300',
  },

  menuContent: {
    flex: 1,
  },

  menuSectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 12,
  },

  menuListItem: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  activeMenuListItem: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  menuListText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#065F46',
  },

  activeMenuListText: {
    color: '#059669',
  },

  chevron: {
    fontSize: 34,
    color: '#065F46',
    fontWeight: '300',
  },

  logoutFullButton: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 'auto',
  },

  logoutFullText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
});