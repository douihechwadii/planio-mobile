import { StatusChip } from '@/components/StatusChip';
import { useClient } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { theme } from '@/theme/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, Text } from 'react-native-paper';

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);

  const { data: client, isLoading: clientLoading } = useClient(clientId);
  // No dedicated "projects for this client" endpoint yet — filter the full
  // list client-side, matching the web app's approach.
  const { data: allProjects, isLoading: projectsLoading } = useProjects();
  const clientProjects = allProjects?.filter((p) => p.client?.id === clientId) ?? [];

  if (clientLoading || projectsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.colors.error }}>Client not found.</Text>
      </View>
    );
  }

  const stats = [
    { label: 'Client Code', value: client.code },
    { label: 'Industry', value: client.industry ?? '—' },
    { label: 'Active Projects', value: String(client.totalActiveProjects) },
    { label: 'Allocated Resources', value: String(client.totalAllocatedResources) },
    {
      label: 'Account Manager',
      value: client.accountManagerName
        ? `${client.accountManagerName}${client.accountManagerEmail ? ` (${client.accountManagerEmail})` : ''}`
        : '—',
    },
    { label: 'Start Date', value: client.startDate ?? '—' },
    { label: 'End Date', value: client.endDate ?? '—' },
    { label: 'Contract', value: client.contract ?? '—' },
    { label: 'Product', value: client.product ?? '—' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        {client.name}
      </Text>
      {client.industry ? (
        <Text variant="bodyMedium" style={styles.subtitle}>
          {client.industry}
        </Text>
      ) : null}

      <View style={styles.statusRow}>
        <StatusChip status={client.status} />
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

      {client.countries.length > 0 && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Countries
          </Text>
          <View style={styles.chipsRow}>
            {client.countries.map((country) => (
              <Chip key={country} style={styles.countryChip}>
                {country}
              </Chip>
            ))}
          </View>
        </>
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Projects
      </Text>

      {clientProjects.length === 0 && (
        <Text variant="bodyMedium" style={styles.emptyText}>
          No projects for this client yet.
        </Text>
      )}

      {clientProjects.map((p) => (
        <Card
          key={p.id}
          style={styles.projectCard}
          onPress={() => router.push({
            pathname: '/projects/[id]',
            params: { id: p.id }
          })}
        >
          <Card.Content>
            <Text variant="titleMedium" style={styles.projectName}>
              {p.name}
            </Text>

            <View style={styles.row}>
              <Text variant="bodySmall" style={styles.dateLabel}>
                Kickoff: {p.kickoffDate}
              </Text>
              <Text variant="bodySmall" style={styles.dateLabel}>
                Go-Live: {p.goLiveDate}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <StatusChip status={p.status} />
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: '700', color: theme.colors.secondary },
  subtitle: { color: theme.colors.primary, marginBottom: 12 },
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
  sectionTitle: { fontWeight: '700', marginBottom: 12, color: theme.colors.secondary },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  countryChip: { backgroundColor: theme.colors.background },
  emptyText: { color: theme.colors.primary, marginBottom: 16 },
  projectCard: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  projectName: { fontWeight: '700', marginBottom: 8, color: theme.colors.onPrimaryContainer },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dateLabel: { color: theme.colors.onPrimaryContainer },
});