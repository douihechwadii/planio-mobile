import { StatusChip } from '@/components/StatusChip';
import { MetricsTable } from '@/components/resources/MetricsTable';
import { useResource, useResourceMetrics } from '@/hooks/useResources';
import { theme } from '@/theme/theme';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, Text } from 'react-native-paper';

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resourceId = Number(id);
  const currentYear = String(new Date().getFullYear());
  const [year, setYear] = React.useState(currentYear);

  const { data: resource, isLoading: lr } = useResource(resourceId);
  const { data: metrics, isLoading: lm } = useResourceMetrics(resourceId, year);

  const years = [String(+currentYear - 1), currentYear, String(+currentYear + 1)];

  if (lr) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!resource) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.colors.error }}>Resource not found.</Text>
      </View>
    );
  }

  const stats = [
    { label: 'Email', value: resource.email },
    { label: 'Role', value: resource.role },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        {resource.fullName}
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        {resource.role}
      </Text>

      <View style={styles.statusRow}>
        <StatusChip status={resource.status} />
      </View>

      <View style={styles.statsGrid}>
        {stats.map(({ label, value }) => (
          <Card key={label} style={styles.statCard}>
            <Card.Content>
              <Text variant="bodySmall" style={styles.statLabel}>
                {label}
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {value}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.metricsHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Capacity Metrics
        </Text>
        <View style={styles.yearRow}>
          {years.map((y) => (
            <Chip
              key={y}
              selected={year === y}
              onPress={() => setYear(y)}
              style={styles.yearChip}
              textStyle={{
                color: year === y ? theme.colors.primary : theme.colors.onSecondaryContainer,
              }}
              icon={() => null}
            >
              {y}
            </Chip>
          ))}
        </View>
      </View>

      {lm ? (
        <ActivityIndicator size="small" style={{ marginTop: 12 }} />
      ) : (
        <MetricsTable metrics={metrics ?? []} year={year} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: '700', color: theme.colors.secondary },
  subtitle: { color: theme.colors.primary, marginBottom: 8 },
  statusRow: { marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  statCard: {
    flexBasis: '47%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  statLabel: { color: theme.colors.primary, marginBottom: 2 },
  statValue: { fontWeight: '600', color: theme.colors.onPrimaryContainer },
  metricsHeader: { marginBottom: 12 },
  sectionTitle: { fontWeight: '700', marginBottom: 8, color: theme.colors.secondary },
  yearRow: { flexDirection: 'row', gap: 8 },
  yearChip: {
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
});