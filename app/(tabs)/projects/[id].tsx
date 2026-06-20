import { StatusChip } from '@/components/StatusChip';
import { MonthlyPlanGrid } from '@/components/projects/MonthlyPlanGrid';
import { useMonthlyPlan, useProject } from '@/hooks/useProjects';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const projectId = Number(id);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: monthlyPlan = [], isLoading: planLoading } = useMonthlyPlan(projectId);

  if (projectLoading || planLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#d32f2f' }}>Project not found.</Text>
      </View>
    );
  }

  const stats = [
    { label: 'Kickoff Date', value: project.kickoffDate },
    { label: 'Go-Live Date', value: project.goLiveDate },
    { label: 'Months', value: String(monthlyPlan.length) },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        {project.name}
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        {project.client}
      </Text>

      <View style={styles.statusRow}>
        <StatusChip status={project.status} />
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

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Monthly Plan
      </Text>
      <MonthlyPlanGrid plans={monthlyPlan} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: '700' },
  subtitle: { color: '#666', marginBottom: 12 },
  statusRow: { marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  statCard: { flexBasis: '47%', borderRadius: 8 },
  statLabel: { color: '#777', marginBottom: 2 },
  statValue: { fontWeight: '600' },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
});