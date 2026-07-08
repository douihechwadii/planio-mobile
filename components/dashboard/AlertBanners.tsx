import { Alert as AlertType } from '@/types/dashboard';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

export function AlertBanners({ alerts }: { alerts: AlertType[] }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = alerts.filter((a) => !dismissed.includes(a.month));
  if (!visible.length) return null;

  return (
    <View style={styles.container}>
      {visible.map((alert) => {
        const isCritical = alert.severity === 'CRITICAL';
        return (
          <View
            key={alert.month}
            style={[styles.banner, { backgroundColor: isCritical ? '#ffebee' : '#fff8e1' }]}
          >
            <View style={[styles.strip, { backgroundColor: isCritical ? '#d32f2f' : '#ed6c02' }]} />
            <View style={styles.content}>
              <Text variant="labelMedium" style={{ color: isCritical ? '#d32f2f' : '#ed6c02', fontWeight: '700' }}>
                {alert.severity} — {alert.month} — GAP: {alert.gap.toFixed(2)} FTE
              </Text>
              <Text variant="bodySmall" style={styles.suggestion}>{alert.suggestion}</Text>
            </View>
            <IconButton
              icon="close"
              size={16}
              onPress={() => setDismissed((p) => [...p, alert.month])}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  banner: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', alignItems: 'center' },
  strip: { width: 4, alignSelf: 'stretch' },
  content: { flex: 1, padding: 10 },
  suggestion: { color: '#555', marginTop: 2 },
});