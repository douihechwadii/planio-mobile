import { theme } from '@/theme/theme';
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
    labelTextStyle: { color: theme.colors.onPrimaryContainer,  fontSize: 10 },
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
          width={screenWidth - 18}
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
          yAxisLabelWidth={16}
          yAxisTextStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 , textAlign: "left"}}
          xAxisLabelTextStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 10 }}
          yAxisColor= {theme.colors.onPrimaryContainer}
          xAxisColor= {theme.colors.onPrimaryContainer}
          rulesColor= {theme.colors.onPrimaryContainer}
          rulesType="solid"
          noOfSections={4}
          mostNegativeValue={yMin}
          initialSpacing={16}
          spacing={(screenWidth - 36) / Math.max(data.length, 1)}
          xAxisLabelsAtBottom
          labelsExtraHeight={12}
          disableScroll
          rulesLength={screenWidth - 24}
          xAxisLength={screenWidth - 24}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8 , backgroundColor: theme.colors.background, borderWidth: 2, borderColor: theme.colors.primary},
  title: { fontWeight: '700', marginBottom: 8 , color: theme.colors.onPrimaryContainer},
  warning: { color: '#ed6c02', marginBottom: 12 },
});