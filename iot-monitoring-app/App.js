import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";

export default function App() {
  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firebaseURL =
    "https://iot-monitoring-esp-default-rtdb.firebaseio.com/devices/esp32_001/latest.json";

  const getSensorData = async () => {
    try {
      const response = await axios.get(firebaseURL);
      setSensor(response.data);
    } catch (error) {
      console.log("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getSensorData();

    const interval = setInterval(() => {
      getSensorData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getSensorData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Mengambil data sensor...</Text>
      </SafeAreaView>
    );
  }

  if (!sensor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Data sensor tidak ditemukan</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Dashboard Monitoring ESP32</Text>
        <Text style={styles.subtitle}>
          Data diambil dari Firebase menggunakan Axios
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Suhu</Text>
          <Text style={styles.cardValue}>{sensor.temperature}°C</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Kelembapan</Text>
          <Text style={styles.cardValue}>{sensor.humidity}%</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Status</Text>
          <Text style={styles.cardValue}>{sensor.status}</Text>
        </View>

        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>Update terakhir</Text>
          <Text style={styles.timeValue}>{sensor.timestamp}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#f8fafc",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardLabel: {
    fontSize: 18,
    color: "#cbd5e1",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#38bdf8",
  },
  timeBox: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  timeLabel: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 6,
  },
  timeValue: {
    color: "#f8fafc",
    fontSize: 16,
  },
  loadingText: {
    color: "#f8fafc",
    textAlign: "center",
    marginTop: 16,
  },
});