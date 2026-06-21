import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Resource, ResourceMetrics } from '../types/resource';

export const resourceKeys = {
  all: ['resources'] as const,
  active: ['resource', 'active'] as const,
  detail: (id: number) => ['resource', id] as const,
  metrics: (id: number, year: string) => ['resources', id, 'metric', year] as const,
};

export function useResources() {
  return useQuery({
    queryKey: resourceKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Resource[]>('/resources');
      return data;
    },
  });
}

export function useResource(resourceId: number) {
  return useQuery({
    queryKey: resourceKeys.detail(resourceId),
    queryFn: async () => {
      const { data } = await api.get<Resource>(`/resources/${resourceId}`);
      return data;
    },
    enabled: !!resourceId,
  });
}

export function useActiveResource() {
  return useQuery({
    queryKey: resourceKeys.active,
    queryFn: async () => {
      const { data } = await api.get<Resource[]>('/resources/active');
      return data;
    },
  });
}

export function useResourceMetrics(resourceId: number, year: string) {
  const from = `${year}-01`;
  const to = `${year}-12`;
  return useQuery({
    queryKey: resourceKeys.metrics(resourceId, year),
    queryFn: async () => {
      const { data } = await api.get<ResourceMetrics[]>(
        `/resources/${resourceId}/metrics`,
        { params: { from, to } }
      );
      return data;
    },
  });
}