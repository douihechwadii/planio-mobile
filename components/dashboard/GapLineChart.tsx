// src/components/dashboard/GapLineChart.tsx
import { MonthlyCapacity } from '@/types/dashboard';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Text } from 'react-native-paper';

const shortMonth = (ym: string) =>
  new Date(ym + '-01').toLocaleString('default', { month: 'short' });

const CHART_HEIGHT = 220;

export function GapLineChart({ data }: { data: MonthlyCapacity[] }) {
  const [containerWidth, setContainerWidth] = useState(0);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const labels = data.map((d) => shortMonth(d.month));
  const gaps = data.map((d) => d.gap);
  const hasNegative = gaps.some((g) => g < 0);

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text variant="titleSmall" style={styles.title}>
          Capacity GAP Trend
        </Text>
        {hasNegative && (
          <Text variant="bodySmall" style={styles.warning}>
            ⚠ Negative GAP detected — capacity shortfall in some months
          </Text>
        )}

        <View style={styles.chartWrapper} onLayout={onContainerLayout}>
          {containerWidth > 0 && (
            <LineChart
              data={{ labels, datasets: [{ data: gaps }] }}
              width={containerWidth}
              height={CHART_HEIGHT}
              fromZero={false}
              segments={8}
              withHorizontalLabels={false}
              // default reserved space for y-axis labels — kill it so the
              // plot spans the full width
              
              formatYLabel={(y) => Math.round(Number(y)).toString()}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(198, 40, 40, ${opacity})`,
                labelColor: () => '#666',
                propsForVerticalLabels: { fontSize: 9 },
                propsForHorizontalLabels: { fontSize: 10 },
                propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
              }}
              getDotColor={(dataPoint) => (dataPoint < 0 ? '#d32f2f' : '#2e7d32')}
              bezier
              style={styles.chart}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8 },
  content: { paddingHorizontal: 0 },
  title: { fontWeight: '700', marginBottom: 8, paddingHorizontal: 16 },
  warning: { color: '#ed6c02', marginBottom: 8, paddingHorizontal: 16 },
  chartWrapper: { width: '100%' },
  chart: { borderRadius: 8, marginLeft: 0 },
});