import { theme } from '@/theme/theme';
import { ResourceMetrics } from '@/types/resource';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface MetricsTableProps {
  metrics: ResourceMetrics[];
  year: string;
}

const ROWS: { key: keyof ResourceMetrics; label: string }[] = [
  { key: 'workingDays', label: 'WK — Working Days' },
  { key: 'absenceDays', label: 'AD — Absence Days' },
  { key: 'availableDays', label: 'AV — Available Days' },
  { key: 'assignedDays', label: 'AS — Assigned Days' },
  { key: 'remainingDays', label: 'RD — Remaining Days' },
];

const COLUMN_WIDTH = 64;
const LABEL_WIDTH = 160;
const ROW_HEIGHT = 40;

function getCellStyle(key: string, value: number) {
  const isAD = key === 'absenceDays';
  const isRD = key === 'remainingDays';

  let color: string = theme.colors.onPrimaryContainer;
  let fontWeight: '400' | '500' | '700' = '400';

  if (isRD && value < 0) {
    color = '#d32f2f';
    fontWeight = '700';
  } else if (isRD && value === 0) {
    color = '#ed6c02';
  } else if (isAD) {
    color = '#c62828';
    fontWeight = '500';
  }

  return { color, fontWeight };
}

export function MetricsTable({ metrics, year }: MetricsTableProps) {
  if (!metrics.length) {
    return <Text style={styles.empty}>No metrics available.</Text>;
  }

  const monthLabels = metrics.map((m) =>
    new Date(`${m.month}-01`).toLocaleDateString('en-US', { month: 'short' })
  );

  return (
    <View style={styles.container}>
      <View style={styles.tableRow}>
        {/* Fixed label column */}
        <View style={styles.labelColumn}>
          <View style={[styles.headerCell, styles.labelCell]}>
            <Text style={styles.headerText}>Metric</Text>
          </View>
          {ROWS.map(({ key, label }) => (
            <View key={key} style={[styles.cell, styles.labelCell]}>
              <Text style={styles.labelText} numberOfLines={1}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* Scrollable data columns */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <View style={styles.headerRow}>
              {monthLabels.map((label, i) => (
                <View key={i} style={[styles.headerCell, styles.dataCell]}>
                  <Text style={styles.headerText}>{label}</Text>
                </View>
              ))}
            </View>

            {ROWS.map(({ key, label }) => (
              <View key={key} style={styles.dataRow}>
                {metrics.map((m) => {
                  const value = m[key] as number;
                  const cellStyle = getCellStyle(key as string, value);
                  return (
                    <View key={m.month} style={[styles.cell, styles.dataCell]}>
                      <Text style={[styles.valueText, cellStyle]}>{value}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <Text style={styles.footnote}>Read-only view. Year: {year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  tableRow: { flexDirection: 'row' },
  labelColumn: {
    width: LABEL_WIDTH,
    borderRightWidth: 2,
    borderRightColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  headerRow: { flexDirection: 'row' },
  dataRow: { flexDirection: 'row' },
  headerCell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  cell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  labelCell: {
    width: LABEL_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  dataCell: { width: COLUMN_WIDTH },
  headerText: { fontSize: 12, fontWeight: '700', color: theme.colors.secondary },
  labelText: { fontSize: 11, fontWeight: '600', color: theme.colors.secondary },
  valueText: { fontSize: 13, fontVariant: ['tabular-nums'] },
  empty: { color: theme.colors.primary, fontSize: 13 },
  footnote: { fontSize: 11, color: theme.colors.primary, padding: 8 },
});