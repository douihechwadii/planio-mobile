import { FteBarChart } from '@/components/dashboard/FteBarChart';
import { FteForecastTable } from '@/components/dashboard/FteForecastTable';
import { GapLineChart } from '@/components/dashboard/GapLineChart';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { WorkloadTable } from '@/components/dashboard/WorkloadTable';
import { useAlerts, useDashboard, useWorkload } from '@/hooks/useDashboard';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Chip, Text } from 'react-native-paper';

export default function DashboardScreen() {
  const currentYear = String(new Date().getFullYear());
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [year, setYear] = React.useState(currentYear);
  const [workloadMonth, setWorkloadMonth] = React.useState(currentMonth);

  const years = [String(+currentYear - 1), currentYear, String(+currentYear + 1)];
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Number(year), i);
    return {
      value: `${year}-${String(i + 1).padStart(2, '0')}`,
      label: d.toLocaleString('default', { month: 'short' }),
    };
  });

  const { data: dashboard, isLoading: ldash, refetch: refetchDash } = useDashboard(year);
  const { data: workload, isLoading: lwork } = useWorkload(workloadMonth);
  const { data: alerts } = useAlerts(year);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={ldash} onRefresh={refetchDash} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall" style={styles.title}>Capacity Dashboard</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>FTE planning overview</Text>
        </View>
        <View style={styles.yearRow}>
          {years.map((y) => (
            <Chip key={y} selected={year === y} onPress={() => setYear(y)} compact style={styles.chip}>
              {y}
            </Chip>
          ))}
        </View>
      </View>

      {/* Alerts */}
      {/*alerts && alerts.length > 0 && <AlertBanners alerts={alerts} />*/}

      {ldash ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <KpiGrid data={dashboard ?? []} />
          <FteBarChart data={dashboard ?? []} />
          <GapLineChart data={dashboard ?? []} />
          <FteForecastTable data={dashboard ?? []} />
        </>
      )}

      {/* Workload section */}
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Resource Workload</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthRow}>
          {months.map((m) => (
            <Chip
              key={m.value}
              selected={workloadMonth === m.value}
              onPress={() => setWorkloadMonth(m.value)}
              compact
              style={styles.chip}
            >
              {m.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {lwork ? (
        <ActivityIndicator size="small" style={{ marginTop: 12 }} />
      ) : (
        <WorkloadTable data={workload ?? []} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontWeight: '700' },
  subtitle: { color: '#666' },
  yearRow: { flexDirection: 'row', gap: 6 },
  chip: {},
  center: { justifyContent: 'center', alignItems: 'center', paddingVertical: 48 },
  sectionHeader: { gap: 8 },
  sectionTitle: { fontWeight: '700' },
  monthRow: { flexDirection: 'row' },
});