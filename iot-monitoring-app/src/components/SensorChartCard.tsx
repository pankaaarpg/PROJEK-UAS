import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type Dataset = {
  data: number[];
  color?: (opacity?: number) => string;
  strokeWidth?: number;
};

type SensorChartCardProps = {
  title: string;
  labels: string[];
  datasets: Dataset[];
  suffix?: string;
  onDownloadCsv?: () => void;
  downloadRangeLabel?: string;
  onOpenDownloadRange?: () => void;
};

const screenWidth = Dimensions.get('window').width;

export default function SensorChartCard({
  title,
  labels,
  datasets,
  suffix = '',
  onDownloadCsv,
  downloadRangeLabel = '1 Jam',
  onOpenDownloadRange,
}: SensorChartCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.actionRow}>
          {onOpenDownloadRange && (
            <Pressable
              style={styles.rangeButton}
              onPress={onOpenDownloadRange}
            >
              <Text style={styles.rangeText}>{downloadRangeLabel} ▼</Text>
            </Pressable>
          )}

          {onDownloadCsv && (
            <Pressable style={styles.downloadButton} onPress={onDownloadCsv}>
              <Text style={styles.downloadText}>CSV</Text>
            </Pressable>
          )}
        </View>
      </View>

      <LineChart
        data={{
          labels,
          datasets,
        }}
        width={screenWidth - 80}
        height={230}
        yAxisSuffix={suffix}
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(6, 78, 59, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#059669',
          },
          propsForBackgroundLines: {
            stroke: '#D1FAE5',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#064E3B',
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 14,
    elevation: 5,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
    marginRight: 10,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  rangeButton: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 12,
  },

  rangeText: {
    color: '#064E3B',
    fontSize: 11,
    fontWeight: '900',
  },

  downloadButton: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },

  downloadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  chart: {
    borderRadius: 18,
    alignSelf: 'center',
  },
});