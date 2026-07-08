import { MonthlyCapacity } from '@/types/dashboard';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KpiCard } from './KpiCard';

export function KpiGrid({ data }: { data: MonthlyCapacity[] }) {
  if (!data.length) return null;

  const totalDtp = data.reduce((s, m) => s + m.daysToplan, 0);
  const avgFteNeeded = data.reduce((s, m) => s + m.fteNeeded, 0) / data.length;
  const avgFteAssigned = data.reduce((s, m) => s + m.fteAssigned, 0) / data.length;
  const alertCount = data.filter((m) => m.hasAlert).length;

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <KpiCard label="Total Days to Plan" value={totalDtp.toLocaleString()} subtitle="Across all active projects" colour="red" />
        <KpiCard label="Avg FTE Needed" value={avgFteNeeded.toFixed(2)} subtitle="Average per month" colour="red" />
      </View>
      <View style={styles.row}>
        <KpiCard label="Avg FTE Assigned" value={avgFteAssigned.toFixed(2)} subtitle="Average per month" colour="green" />
        <KpiCard label="Alert Months" value={alertCount} subtitle="Months with negative GAP" colour={alertCount > 0 ? 'danger' : 'green'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
});