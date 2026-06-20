// src/components/projects/MonthlyPlanGrid.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface MonthlyPlanEntry {
  month: string;
  [key: string]: any; // adjust once you share the real shape
}

export function MonthlyPlanGrid({ plans }: { plans: MonthlyPlanEntry[] }) {
  if (plans.length === 0) {
    return <Text style={{ color: '#777' }}>No monthly plan data yet.</Text>;
  }

  return (
    <View>
      {plans.map((entry, i) => (
        <Card key={entry.month ?? i} style={styles.row}>
          <Card.Content style={styles.rowContent}>
            <Text variant="bodyMedium" style={styles.month}>
              {entry.month}
            </Text>
            {/* TODO: replace with real fields once MonthlyPlanGrid.tsx is shared */}
            <Text variant="bodySmall" style={styles.detail}>
              {JSON.stringify(entry)}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 8, borderRadius: 8 },
  rowContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  month: { fontWeight: '600' },
  detail: { color: '#666' },
});