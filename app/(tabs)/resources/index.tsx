import { StatusChip } from '@/components/StatusChip';
import { useResources } from '@/hooks/useResources';
import { theme } from '@/theme/theme';
import { Resource } from '@/types/resource';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Searchbar, Text } from 'react-native-paper';

export default function ResourcesScreen() {
  const { data: resources, isLoading, isError, refetch, isRefetching } = useResources();
  const [search, setSearch] = React.useState('');

  const filtered = resources?.filter((r) =>
    r.fullName.toLowerCase().includes(search.toLowerCase())
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
        <Text>Couldn't load resources. Pull down to retry.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        Resources
      </Text>
      <Text variant="bodyMedium" style={styles.subheader}>
        {resources?.length ?? 0} team members
      </Text>

      <Searchbar
        placeholder="Search resources"
        placeholderTextColor={theme.colors.onSecondaryContainer}
        iconColor={theme.colors.onSecondaryContainer}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
        inputStyle={styles.searchInput}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: Resource }) => (
          <Card
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/resources/[id]',
                params: { id: item.id },
              })
            }
          >
            <Card.Content>
              <Text variant="titleMedium" style={styles.name}>
                {item.fullName}
              </Text>
              <Text variant="bodyMedium" style={styles.role}>
                {item.role}
              </Text>
              <Text variant="bodySmall" style={styles.email}>
                {item.email}
              </Text>

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
  header: { fontWeight: '700', color: theme.colors.secondary },
  subheader: { color: theme.colors.primary, marginBottom: 12 },
  search: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  searchInput: { color: theme.colors.primary },
  list: { paddingBottom: 24 },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  name: { fontWeight: '700', marginBottom: 2, color: theme.colors.onPrimaryContainer },
  role: { color: theme.colors.primary, marginBottom: 2 },
  email: { color: theme.colors.primary, marginBottom: 8 },
  statusRow: { flexDirection: 'row' },
});