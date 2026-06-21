// app/(tabs)/assignments/index.tsx
import {
  useAssignments,
  useAssignmentsByProject,
  useAssignmentsByResource,
} from '@/hooks/useAssignments';
import { useProjects } from '@/hooks/useProjects';
import { useResources } from '@/hooks/useResources';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Menu, SegmentedButtons, Text } from 'react-native-paper';

type FilterMode = 'project' | 'resource';

export default function AssignmentsScreen() {
  const [filterMode, setFilterMode] = React.useState<FilterMode>('project');
  const [selectedId, setSelectedId] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const { data: projects } = useProjects();
  const { data: resources } = useResources();

  const { data: allAssignments, isLoading: lAll } = useAssignments();
  const { data: byProject, isLoading: lpj } = useAssignmentsByProject(
    filterMode === 'project' && selectedId !== 0 ? selectedId : undefined
  );
  const { data: byResource, isLoading: lrs } = useAssignmentsByResource(
    filterMode === 'resource' && selectedId !== 0 ? selectedId : undefined
  );

  const assignments =
    selectedId === 0 ? allAssignments : filterMode === 'project' ? byProject : byResource;
  const isLoading = selectedId === 0 ? lAll : filterMode === 'project' ? lpj : lrs;

  const options = filterMode === 'project' ? projects : resources;
  const selectedLabel =
    selectedId === 0
      ? 'All'
      : options?.find((o) => o.id === selectedId)
      ? 'fullName' in (options.find((o) => o.id === selectedId) as any)
        ? (options.find((o) => o.id === selectedId) as any).fullName
        : (options.find((o) => o.id === selectedId) as any).name
      : 'All';

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        Assignments
      </Text>
      <Text variant="bodyMedium" style={styles.subheader}>
        Resources assigned to projects by month
      </Text>

      <SegmentedButtons
        value={filterMode}
        onValueChange={(v) => {
          setFilterMode(v as FilterMode);
          setSelectedId(0);
        }}
        buttons={[
          { value: 'project', label: 'By Project' },
          { value: 'resource', label: 'By Resource' },
        ]}
        style={styles.segmented}
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.filterButton}>
            {selectedLabel}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            setSelectedId(0);
            setMenuVisible(false);
          }}
          title="All"
        />
        {options?.map((item: any) => (
          <Menu.Item
            key={item.id}
            onPress={() => {
              setSelectedId(item.id);
              setMenuVisible(false);
            }}
            title={'fullName' in item ? item.fullName : item.name}
          />
        ))}
      </Menu>

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.projectName}>
                  {item.projectName}
                </Text>
                <Text variant="bodySmall" style={styles.client}>
                  {item.client}
                </Text>
                <Text variant="bodyMedium" style={styles.resourceName}>
                  {item.resourceFullName}
                </Text>
                <Text variant="bodySmall" style={styles.role}>
                  {item.resourceRole}
                </Text>

                <View style={styles.detailRow}>
                  <Text variant="bodySmall" style={styles.detailLabel}>
                    {item.month}
                  </Text>
                  <Text variant="bodySmall" style={styles.daysAssigned}>
                    {item.daysAssigned} days
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No assignments found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  header: { fontWeight: '700' },
  subheader: { color: '#666', marginBottom: 12 },
  segmented: { marginBottom: 12 },
  filterButton: { marginBottom: 12, alignSelf: 'flex-start' },
  loader: { marginTop: 24 },
  list: { paddingBottom: 24 },
  card: { marginBottom: 12, borderRadius: 8 },
  projectName: { fontWeight: '700', color: '#1565c0', marginBottom: 2 },
  resourceName: { fontWeight: '600', marginBottom: 2 },
  role: { color: '#777', marginBottom: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { color: '#666' },
  daysAssigned: { fontWeight: '700', color: '#1565c0' },
  empty: { textAlign: 'center', color: '#777', marginTop: 24 },
  client: { color: '#999', marginBottom: 4 },
});