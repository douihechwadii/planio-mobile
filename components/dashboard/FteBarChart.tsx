import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Card, Text } from 'react-native-paper';
import { MonthlyCapacity } from '../../types/dashboard';

const screenWidth = Dimensions.get('window').width - 64;

const shortMonth = (ym: string) =>
  new Date(ym + '-01').toLocaleString('default', { month: 'short' });

const COLORS = {
  fteNeeded: '#c62828',
  fteAssigned: '#2e7d32',
  fteForecast: '#1565c0',
};

const LEGEND = [
  { color: COLORS.fteNeeded, label: 'FTE Needed' },
  { color: COLORS.fteAssigned, label: 'FTE Assigned' },
  { color: COLORS.fteForecast, label: 'FTE Forecast' },
];

export function FteBarChart({ data }: { data: MonthlyCapacity[] }) {
  const barData = data.flatMap((d, i) => [
    {
      value: parseFloat(d.fteNeeded.toFixed(2)),
      frontColor: COLORS.fteNeeded,
      label: shortMonth(d.month),
      labelTextStyle: { color: '#666', fontSize: 10 },
      spacing: 2,
    },
    {
      value: parseFloat(d.fteAssigned.toFixed(2)),
      frontColor: COLORS.fteAssigned,
      spacing: 2,
    },
    {
      value: parseFloat(d.fteForecast.toFixed(2)),
      frontColor: COLORS.fteForecast,
      spacing: i < data.length - 1 ? 16 : 2,
    },
  ]);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleSmall" style={styles.title}>
          FTE Needed / Assigned / Forecast
        </Text>

        <BarChart
          data={barData}
          barWidth={32}
          noOfSections={4}
          roundedTop
          hideRules={false}
          rulesColor="#f0f0f0"
          rulesType="solid"
          yAxisLabelWidth={28}
          yAxisTextStyle={{ color: '#999', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#666', fontSize: 10 }}
          yAxisColor="#e0e0e0"
          xAxisColor="#e0e0e0"
          width={screenWidth - 28}
          height={220}
          initialSpacing={4}
          disablePress
        />

        <View style={styles.legend}>
          {LEGEND.map(({ color, label }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text variant="bodySmall" style={styles.legendLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8 },
  title: { fontWeight: '700', marginBottom: 16 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { color: '#555' },
});