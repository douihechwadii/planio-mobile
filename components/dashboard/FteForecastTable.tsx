// src/components/dashboard/FteForecastTable.tsx
import { theme } from '@/theme/theme';
import { MonthlyCapacity } from '@/types/dashboard';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

const shortMonth = (ym: string) =>
  new Date(ym + '-01').toLocaleString('default', { month: 'short' });

const CELL_WIDTH = 64;
const ROW_HEIGHT = 40;

export function FteForecastTable({ data }: { data: MonthlyCapacity[] }) {
  return (
    <Card style={styles.card}>
      <Card.Content style={{ paddingHorizontal: 0 }}>
        <Text variant="titleSmall" style={styles.title}>
          FTE Forecast (Headcount)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View>
            <View style={styles.row}>
              {data.map((d) => (
                <View key={d.month} style={[styles.cell, styles.headerCell]}>
                  <Text style={styles.headerText}>{shortMonth(d.month)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.row}>
              {data.map((d) => (
                <View key={d.month} style={styles.cell}>
                  <Text style={styles.valueText}>{d.fteForecast.toFixed(1)}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8 , backgroundColor: theme.colors.background, borderWidth: 2, borderColor: theme.colors.primary},
  title: { fontWeight: '700', marginBottom: 12, paddingHorizontal: 16 , color: theme.colors.onPrimaryContainer},
  row: { flexDirection: 'row' },
  cell: {
    width: CELL_WIDTH,
    height: ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.primary,
  },
  headerCell: { backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderColor: theme.colors.primary },
  headerText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },
  valueText: { fontSize: 13, fontFamily: 'monospace', color: theme.colors.onSecondaryContainer },
});