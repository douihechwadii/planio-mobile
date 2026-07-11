import { StatusChip } from '@/components/StatusChip';
import { useProjects } from '@/hooks/useProjects';
import { theme } from '@/theme/theme';
import { Project } from '@/types/project';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Searchbar, Text } from 'react-native-paper';

export default function ProjectsScreen() {
  const { data: projects, isLoading, isError, refetch, isRefetching } = useProjects();
  const [search, setSearch] = React.useState('');

  const filtered = projects?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Couldn't load projects. Pull down to retry.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        Projects
      </Text>
      <Text variant="bodyMedium" style={styles.subheader}>
        {projects?.length ?? 0} projects
      </Text>

      <Searchbar
        placeholder="Search projects"
        placeholderTextColor={theme.colors.onSecondaryContainer}
        iconColor={theme.colors.onSecondaryContainer}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: Project }) => (
          <Card
            style={styles.card}
            onPress={() => router.push({
              pathname: '/projects/[id]',
              params: { id: item.id }
            })}
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.projectName}>
                {item.name}
              </Text>
              <Text variant="bodyMedium" style={styles.client}>
                {item.client}
              </Text>

              <View style={styles.row}>
                <Text variant="bodySmall" style={styles.dateLabel}>
                  Kickoff: {item.kickoffDate}
                </Text>
                <Text variant="bodySmall" style={styles.dateLabel}>
                  Go-Live: {item.goLiveDate}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <StatusChip status={item.status} />
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontWeight: '700', color: theme.colors.secondary},
  subheader: { color: theme.colors.primary, marginBottom: 12 },
  search: { marginBottom: 12, borderRadius: 8, backgroundColor: theme.colors.background, borderColor: theme.colors.primary, borderWidth: 2 },
  list: { paddingBottom: 24 },
  card: { marginBottom: 12, borderRadius: 8 , borderWidth: 2 , borderColor: theme.colors.primary , backgroundColor: theme.colors.background, overflow: "hidden" },
  projectName: { fontWeight: '700', marginBottom: 2 , color: theme.colors.onPrimaryContainer},
  client: { color: theme.colors.primary, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dateLabel: { color: theme.colors.onPrimaryContainer },
  statusRow: { flexDirection: 'row' },
});