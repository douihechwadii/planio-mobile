import { theme } from "@/theme/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

type Colour = 'red' | 'green' | 'danger' | 'amber';

const colourMap: Record<Colour, string> = {
    red: '#c62828',
    green: '#2e7d32',
    danger: '#d32f2f',
    amber: '#ed6c02',
};

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  colour?: Colour;
}

export function KpiCard({ label, value, subtitle, colour = 'red' }: KpiCardProps) {
  return (
    <Card style={[styles.card, { borderTopColor: colourMap[colour] }]}>
      <Card.Content>
        <Text variant="labelSmall" style={styles.label}>
          {label.toUpperCase()}
        </Text>
        <Text style={[styles.value, { color: theme.colors.primary }]}>{value}</Text>
        {subtitle && <Text variant="bodySmall" style={styles.subtitle}>{subtitle}</Text>}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderTopWidth: 4, borderRadius: 8, flex: 1 , borderWidth: 2, borderColor: theme.colors.primary, backgroundColor: theme.colors.background},
  label: { color: theme.colors.onSecondaryContainer, letterSpacing: 0.5, marginBottom: 4 },
  value: { fontSize: 26, fontWeight: '700', marginBottom: 2, color: theme.colors.primary },
  subtitle: { color: theme.colors.onSecondaryContainer },
});
