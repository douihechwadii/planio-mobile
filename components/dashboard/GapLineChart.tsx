// src/components/dashboard/GapLineChart.tsx
import { MonthlyCapacity } from '@/types/dashboard';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Text } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width - 48;

const shortMonth = (ym: string) =>
  new Date(ym + '-01').toLocaleString('default', { month: 'short' });

export function GapLineChart({ data }: { data: MonthlyCapacity[] }) {
  const labels = data.map((d) => shortMonth(d.month));
  const gaps = data.map((d) => d.gap);
  const hasNegative = gaps.some((g) => g < 0);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleSmall" style={styles.title}>
          Capacity GAP Trend
        </Text>
        {hasNegative && (
          <Text variant="bodySmall" style={styles.warning}>
            ⚠ Negative GAP detected — capacity shortfall in some months
          </Text>
        )}
        <LineChart
          data={{
            labels,
            datasets: [{ data: gaps }],
          }}
          width={screenWidth}
          height={220}
          fromZero={false}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(198, 40, 40, ${opacity})`,
            labelColor: () => '#666',
            propsForLabels: { fontSize: 10 },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#fff',
            },
          }}
          getDotColor={(dataPoint) =>
            dataPoint < 0 ? '#d32f2f' : '#2e7d32'
          }
          bezier
          style={{ borderRadius: 8 }}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8 },
  title: { fontWeight: '700', marginBottom: 8 },
  warning: { color: '#ed6c02', marginBottom: 8 },
});