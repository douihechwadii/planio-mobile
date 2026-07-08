// src/components/dashboard/WorkloadTable.tsx
import { ResourceWorkload } from '@/types/dashboard';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

const LABEL_WIDTH = 140;
const CELL_WIDTH = 48;
const ROW_HEIGHT = 48;

function getUtilColor(pct: number): string {
  if (pct >= 100) return '#d32f2f';
  if (pct >= 75) return '#ed6c02';
  return '#2e7d32';
}

function getRdColor(rd: number): string {
  if (rd < 0) return '#d32f2f';
  if (rd <= 3) return '#ed6c02';
  return '#2e7d32';
}

export function WorkloadTable({ data }: { data: ResourceWorkload[] }) {
  if (!data.length) {
    return <Text style={{ color: '#777', fontSize: 13 }}>No workload data.</Text>;
  }

  const sorted = [...data].sort((a, b) => b.utilisationPct - a.utilisationPct);
  const dataHeaders = ['WK', 'AD', 'AV', 'AS', 'RD'];

  return (
    <View style={styles.container}>
      <View style={styles.tableRow}>
        {/* Fixed label column */}
        <View style={styles.labelColumn}>
          <View style={[styles.cell, styles.headerCell, { height: ROW_HEIGHT }]}>
            <Text style={styles.headerText}>Resource</Text>
          </View>
          {sorted.map((r) => (
            <View key={r.resourceId} style={[styles.cell, styles.labelCell]}>
              <Text style={styles.resourceName} numberOfLines={1}>{r.fullName}</Text>
              <Text style={styles.resourceRole} numberOfLines={1}>{r.role}</Text>
            </View>
          ))}
        </View>

        {/* Scrollable data columns */}
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View>
            {/* Header */}
            <View style={[styles.dataRow, { height: ROW_HEIGHT }]}>
              {dataHeaders.map((h) => (
                <View key={h} style={[styles.cell, styles.headerCell, { width: CELL_WIDTH }]}>
                  <Text style={styles.headerText}>{h}</Text>
                </View>
              ))}
              <View style={[styles.cell, styles.headerCell, { width: 120 }]}>
                <Text style={styles.headerText}>Utilisation</Text>
              </View>
            </View>

            {/* Data rows */}
            {sorted.map((r) => (
              <View key={r.resourceId} style={styles.dataRow}>
                {([r.workingDays, r.absenceDays, r.availableDays, r.assignedDays] as number[]).map(
                  (val, i) => (
                    <View key={i} style={[styles.cell, { width: CELL_WIDTH }]}>
                      <Text style={styles.cellText}>{val}</Text>
                    </View>
                  )
                )}
                {/* RD with colour */}
                <View style={[styles.cell, { width: CELL_WIDTH }]}>
                  <Text style={[styles.cellText, { color: getRdColor(r.remainingDays), fontWeight: '700' }]}>
                    {r.remainingDays}
                  </Text>
                </View>
                {/* Utilisation bar */}
                <View style={[styles.cell, { width: 120, paddingHorizontal: 8 }]}>
                  <View style={styles.utilRow}>
                    <ProgressBar
                      progress={Math.min(r.utilisationPct / 100, 1)}
                      color={getUtilColor(r.utilisationPct)}
                      style={styles.progressBar}
                    />
                    <Text style={[styles.utilText, { color: getUtilColor(r.utilisationPct) }]}>
                      {r.utilisationPct.toFixed(0)}%
                    </Text>
                  </View>
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
  container: { borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', overflow: 'hidden', backgroundColor: '#fff' },
  tableRow: { flexDirection: 'row' },
  labelColumn: { width: LABEL_WIDTH, borderRightWidth: 1, borderRightColor: '#e0e0e0', backgroundColor: '#fafafa' },
  dataRow: { flexDirection: 'row' },
  cell: { height: ROW_HEIGHT, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerCell: { backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  labelCell: { width: LABEL_WIDTH, alignItems: 'flex-start', paddingHorizontal: 10 },
  headerText: { fontSize: 11, fontWeight: '700', color: '#555' },
  resourceName: { fontSize: 12, fontWeight: '700', color: '#1565c0' },
  resourceRole: { fontSize: 10, color: '#888' },
  cellText: { fontSize: 12 },
  utilRow: { flexDirection: 'row', alignItems: 'center', gap: 4, width: '100%' },
  progressBar: { flex: 1, height: 5, borderRadius: 3 },
  utilText: { fontSize: 11, fontWeight: '700', minWidth: 32 },
});