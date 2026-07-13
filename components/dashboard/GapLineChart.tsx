import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Card, Text } from 'react-native-paper';
import { MonthlyCapacity } from '../../types/dashboard';

const screenWidth = Dimensions.get('window').width - 64;

const shortMonth = (ym: string) =>
  new Date(ym + '-01').toLocaleString('default', { month: 'short' });

export function GapLineChart({ data }: { data: MonthlyCapacity[] }) {
  const hasNegative = data.some((d) => d.gap < 0);

  const lineData = data.map((d) => ({
    value: parseFloat(d.gap.toFixed(2)),
    label: shortMonth(d.month),
    labelTextStyle: { color: '#666', fontSize: 10 },
    dataPointColor: d.gap < 0 ? '#d32f2f' : '#2e7d32',
    dataPointRadius: 4,
  }));

  const minGap = Math.min(...data.map((d) => d.gap));
  const yMin = minGap < 0 ? Math.floor(minGap) - 1 : 0;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleSmall" style={styles.title}>
          Capacity GAP Trend
        </Text>

        {hasNegative && (
          <Text variant="bodySmall" style={styles.warning}>
            ⚠ Capacity shortfall detected in some months
          </Text>
        )}

        <LineChart
          data={lineData}
          areaChart
          curved
          width={screenWidth - 28}
          height={120}
          color="#c62828"
          startFillColor="rgba(198,40,40,0.15)"
          endFillColor="rgba(198,40,40,0)"
          startOpacity={0.4}
          endOpacity={0}
          thickness={2}
          referenceLine1Position={0}
          referenceLine1Config={{
            color: '#d32f2f',
            dashWidth: 4,
            dashGap: 4,
            thickness: 1,
          }}
          yAxisLabelWidth={28}
          yAxisTextStyle={{ color: '#999', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#666', fontSize: 10 }}
          yAxisColor="#e0e0e0"
          xAxisColor="#e0e0e0"
          rulesColor="#f0f0f0"
          rulesType="solid"
          noOfSections={4}
          mostNegativeValue={yMin}
          initialSpacing={16}
          spacing={(screenWidth - 36) / Math.max(data.length, 1)}
          xAxisLabelsAtBottom
          labelsExtraHeight={16}
          disableScroll
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8 },
  title: { fontWeight: '700', marginBottom: 8 },
  warning: { color: '#ed6c02', marginBottom: 12 },
});