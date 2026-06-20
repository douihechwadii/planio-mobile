import React from 'react';
import { Chip } from 'react-native-paper';

const statusColors: Record<string, string> = {
  ACTIVE: '#2e7d32',
  COMPLETED: '#1565c0',
  ON_HOLD: '#ed6c02',
  CANCELLED: '#d32f2f',
};

export function StatusChip({ status }: { status: string }) {
  const color = statusColors[status] ?? '#757575';
  return (
    <Chip
      compact
      style={{ backgroundColor: `${color}20`, alignSelf: 'flex-start' }}
      textStyle={{ color, fontWeight: '600', fontSize: 12 }}
    >
      {status}
    </Chip>
  );
}