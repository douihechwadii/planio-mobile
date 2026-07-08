import { MonthlyCapacity } from '@/types/dashboard';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Card, Text } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width - 48; // padding offset

const shortMonth = (ym: string) =>
  new Date(ym + '-01').toLocaleString('default', { month: 'short' });

export function FteBarChart({ data }: { data: MonthlyCapacity[] }) {
  const labels = data.map((d) => shortMonth(d.month));

  // react-native-chart-kit only supports one dataset per BarChart visually,
  // so we show fteNeeded as primary and overlay a legend note
  const chartData = {
    labels,
    datasets: [
      { data: data.map((d) => d.fteNeeded), color: () => '#c62828' },
    ],
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleSmall" style={styles.title}>
          FTE Needed / Assigned / Forecast
        </Text>
        <BarChart
          data={chartData}
          width={screenWidth}
          height={220}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(198, 40, 40, ${opacity})`,
            labelColor: () => '#666',
            propsForLabels: { fontSize: 10 },
            barPercentage: 0.6,
          }}
          style={{ borderRadius: 8 }}
        />
        <View style={styles.legend}>
          {[
            { color: '#c62828', label: 'FTE Needed' },
            { color: '#2e7d32', label: 'FTE Assigned' },
            { color: '#1565c0', label: 'FTE Forecast' },
          ].map(({ color, label }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text variant="bodySmall" style={{ color: '#666' }}>{label}</Text>
            </View>
          ))}
        </View>
        <Text variant="bodySmall" style={styles.note}>
          Showing FTE Needed. Open web app for full comparison view.
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8 },
  title: { fontWeight: '700', marginBottom: 12 },
  legend: { flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  note: { color: '#aaa', marginTop: 4 },
});