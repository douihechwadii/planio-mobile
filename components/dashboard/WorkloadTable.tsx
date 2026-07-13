import { theme } from '@/theme/theme';
import { ResourceWorkload } from '@/types/dashboard';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

interface WorkloadTableProps {
  data: ResourceWorkload[];
}

const COLUMN_WIDTH = 56;
const UTIL_COLUMN_WIDTH = 120;
const LABEL_WIDTH = 160;
const ROW_HEIGHT = 40;

const DATA_COLUMNS: { key: keyof ResourceWorkload; label: string }[] = [
  { key: 'workingDays', label: 'WK' },
  { key: 'absenceDays', label: 'AD' },
  { key: 'availableDays', label: 'AV' },
  { key: 'assignedDays', label: 'AS' },
  { key: 'remainingDays', label: 'RD' },
];

function getCellStyle(key: string, value: number) {
  const isAD = key === 'absenceDays';
  const isRD = key === 'remainingDays';

  let color: string = theme.colors.onPrimaryContainer;
  let fontWeight: '400' | '500' | '700' = '400';

  if (isRD && value < 0) {
    color = '#d32f2f';
    fontWeight = '700';
  } else if (isRD && value <= 3) {
    color = '#ed6c02';
  } else if (isAD && value > 0) {
    color = '#c62828';
    fontWeight = '500';
  }

  return { color, fontWeight };
}

function getUtilisationColor(value: number) {
  if (value >= 100) return '#d32f2f';
  if (value >= 75) return '#ed6c02';
  return theme.colors.primary;
}

export function WorkloadTable({ data }: WorkloadTableProps) {
  if (!data.length) {
    return <Text style={styles.empty}>No workload data.</Text>;
  }

  const sorted = [...data].sort((a, b) => b.utilisationPct - a.utilisationPct);

  return (
    <View style={styles.container}>
      <View style={styles.tableRow}>
        {/* Fixed label column */}
        <View style={styles.labelColumn}>
          <View style={[styles.headerCell, styles.labelCell]}>
            <Text style={styles.headerText}>Resource</Text>
          </View>
          {sorted.map((r) => (
            <View key={r.resourceId} style={[styles.cell, styles.labelCell]}>
              <Text style={styles.nameText} numberOfLines={1}>
                {r.fullName}
              </Text>
              <Text style={styles.roleText} numberOfLines={1}>
                {r.role}
              </Text>
            </View>
          ))}
        </View>

        {/* Scrollable data columns */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <View style={styles.headerRow}>
              {DATA_COLUMNS.map(({ key, label }) => (
                <View key={key} style={[styles.headerCell, styles.dataCell]}>
                  <Text style={styles.headerText}>{label}</Text>
                </View>
              ))}
              <View style={[styles.headerCell, styles.utilCell]}>
                <Text style={styles.headerText}>Utilisation</Text>
              </View>
            </View>

            {sorted.map((r) => (
              <View key={r.resourceId} style={styles.dataRow}>
                {DATA_COLUMNS.map(({ key }) => {
                  const value = r[key] as number;
                  const cellStyle = getCellStyle(key as string, value);
                  return (
                    <View key={key} style={[styles.cell, styles.dataCell]}>
                      <Text style={[styles.valueText, cellStyle]}>{value}</Text>
                    </View>
                  );
                })}
                <View style={[styles.cell, styles.utilCell]}>
                  <ProgressBar
                    progress={Math.min(r.utilisationPct, 100) / 100}
                    color={getUtilisationColor(r.utilisationPct)}
                    style={styles.progressBar}
                  />
                  <Text
                    style={[
                      styles.utilText,
                      { color: getUtilisationColor(r.utilisationPct) },
                    ]}
                  >
                    {r.utilisationPct.toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
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
  utilCell: { width: UTIL_COLUMN_WIDTH, flexDirection: 'row', gap: 6, paddingHorizontal: 8 },
  headerText: { fontSize: 12, fontWeight: '700', color: theme.colors.secondary },
  nameText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },
  roleText: { fontSize: 10, color: theme.colors.secondary },
  valueText: { fontSize: 13, fontVariant: ['tabular-nums'] },
  progressBar: { flex: 1, height: 6, borderRadius: 3 },
  utilText: { fontSize: 12, fontWeight: '600', minWidth: 30 },
  empty: { color: theme.colors.primary, fontSize: 13 },
});