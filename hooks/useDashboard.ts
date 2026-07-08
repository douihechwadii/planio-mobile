import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Alert, MonthlyCapacity, ResourceWorkload } from '../types/dashboard';

export const dashboardKeys = {
  dashboard: (year: string) => ['dashboard', year] as const,
  workload: (month: string) => ['dashboard', 'workload', month] as const,
  alerts: (year: string) => ['dashboard', 'alerts', year] as const,
};

export function useDashboard(year: string) {
  const from = `${year}-01`;
  const to = `${year}-12`;
  return useQuery({
    queryKey: dashboardKeys.dashboard(year),
    queryFn: async () => {
      const { data } = await api.get<MonthlyCapacity[]>('/dashboard', {
        params: { from, to },
      });
      return data;
    },
    enabled: !!year,
  });
}

export function useWorkload(month: string) {
  return useQuery({
    queryKey: dashboardKeys.workload(month),
    queryFn: async () => {
      const { data } = await api.get<ResourceWorkload[]>('/dashboard/workload', {
        params: { month },
      });
      return data;
    },
    enabled: !!month,
  });
}

export function useAlerts(year: string) {
  const from = `${year}-01`;
  const to = `${year}-12`;
  return useQuery({
    queryKey: dashboardKeys.alerts(year),
    queryFn: async () => {
      const { data } = await api.get<Alert[]>('/dashboard/alerts', {
        params: { from, to },
      });
      return data;
    },
    enabled: !!year,
  });
}