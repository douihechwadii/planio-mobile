import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, ProgressBar, Text } from 'react-native-paper';

interface MonthlyPlanEntry {
  month: string;          // "2026-01"
  daysPlanned: number;
  daysAssigned: number;
  assignable: boolean;
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getProgressColor(ratio: number): string {
  if (ratio >= 1) return '#2e7d32';   // fully assigned
  if (ratio >= 0.5) return '#ed6c02'; // partially assigned
  return '#d32f2f';                   // under-assigned
}

export function MonthlyPlanGrid({ plans }: { plans: MonthlyPlanEntry[] }) {
  if (plans.length === 0) {
    return <Text style={{ color: '#777' }}>No monthly plan data yet.</Text>;
  }

  return (
    <View>
      {plans.map((entry) => {
        const ratio = entry.daysPlanned > 0 ? entry.daysAssigned / entry.daysPlanned : 0;
        const progressColor = getProgressColor(ratio);

        return (
          <Card key={entry.month} style={styles.row}>
            <Card.Content>
              <View style={styles.header}>
                <Text variant="titleSmall" style={styles.month}>
                  {formatMonth(entry.month)}
                </Text>
                <Chip
                  compact
                  style={[
                    styles.assignableChip,
                    { backgroundColor: entry.assignable ? '#e8f5e9' : '#f5f5f5' },
                  ]}
                  textStyle={{
                    fontSize: 11,
                    color: entry.assignable ? '#2e7d32' : '#999',
                  }}
                >
                  {entry.assignable ? 'Assignable' : 'Not Assignable'}
                </Chip>
              </View>

              <View style={styles.statsRow}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  {entry.daysAssigned} / {entry.daysPlanned} days assigned
                </Text>
                <Text variant="bodySmall" style={[styles.statLabel, { color: progressColor }]}>
                  {Math.round(ratio * 100)}%
                </Text>
              </View>

              <ProgressBar
                progress={Math.min(ratio, 1)}
                color={progressColor}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 10, borderRadius: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  month: { fontWeight: '700' },
  assignableChip: { height: 32 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statLabel: { color: '#666' },
  progressBar: { height: 6, borderRadius: 3 },
});