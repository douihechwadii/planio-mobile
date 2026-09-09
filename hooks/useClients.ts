import { api } from '@/lib/axios';
import { ClientDetail, ClientSummary } from '@/types/client';
import { useQuery } from '@tanstack/react-query';

export const clientKeys = {
  all: ['clients'] as const,
};

export function useClients() {
  return useQuery({
    queryKey: clientKeys.all,
    queryFn: async () => {
      const { data } = await api.get<ClientSummary[]>('/clients');
      return data;
    },
  });
}

export function useClient(clientId: number) {
  return useQuery({
    queryKey: ['clients', clientId],
    queryFn: async () => {
      const { data } = await api.get<ClientDetail>(`/clients/${clientId}`);
      return data;
    },
    enabled: !!clientId,
  });
}