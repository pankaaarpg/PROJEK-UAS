import React, { useMemo } from 'react'; // 1. Tambahkan useMemo
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type GaugeCardProps = {
  title: string;
  value: number;
  unit: string;
  min?: number; // Jadikan opsional
  max?: number; // Jadikan opsional
  status: string;
};

export default function GaugeCard({
  title,
  value,
  unit,
  min = 0,   // Nilai default 0
  max = 100, // Nilai default 100
  status,
}: GaugeCardProps) {
  const size = 150;
  const strokeWidth = 14;
  
  // 2. Gunakan useMemo agar kalkulasi presisi saat value/min/max berubah
  const { circumference, strokeDashoffset } = useMemo(() => {
    const radius = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * radius;
    
    // Pastikan input adalah number, cegah pembagian dengan nol
    const safeValue = Number(value) || 0;
    const safeMin = Number(min);
    const safeMax = Number(max);
    
    // Perhitungan persentase yang dikunci 0-1
    const percentage = Math.min(Math.max((safeValue - safeMin) / (safeMax - safeMin), 0), 1);
    
    return {
      circumference: circ,
      strokeDashoffset: circ - (percentage * circ),
    };
  }, [value, min, max]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.gaugeWrapper}>
        <Svg width={size} height={size}>
          <Circle
            stroke="#D1FAE5"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeWidth) / 2}
            strokeWidth={strokeWidth}
          />

          <Circle
            stroke="#059669"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeWidth) / 2}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>

        <View style={styles.valueBox}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>

      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#064E3B',
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 14,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 14,
  },
  gaugeWrapper: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueBox: {
    position: 'absolute',
    alignItems: 'center',
  },
  value: {
    fontSize: 30,
    fontWeight: '900',
    color: '#065F46',
  },
  unit: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginTop: 2,
  },
  status: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#047857',
  },
});