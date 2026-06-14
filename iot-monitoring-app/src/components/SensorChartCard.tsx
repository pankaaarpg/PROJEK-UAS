import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type Dataset = {
  data: number[];
  color?: (opacity?: number) => string;
  strokeWidth?: number;
};

type SensorChartCardProps = {
  title: string;
  description: string;
  labels: string[];
  datasets: Dataset[];
  suffix?: string;
};

const screenWidth = Dimensions.get('window').width;

export default function SensorChartCard({
  title,
  description,
  labels,
  datasets,
  suffix = '',
}: SensorChartCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

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

  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064E3B',
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 19,
    marginBottom: 12,
  },

  chart: {
    borderRadius: 18,
    alignSelf: 'center',
  },
});