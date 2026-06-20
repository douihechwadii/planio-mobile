import { api } from '@/lib/axios';
import { Project } from '@/types/project';
import { useQuery } from '@tanstack/react-query';

export const projectKeys = {
  all: ['projects'] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Project[]>('/projects');
      return data;
    },
  });
}

export function useProject(projectId: number) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const { data } = await api.get<Project>(`/projects/${projectId}`);
      return data;
    },
    enabled: !!projectId,
  });
}

export function useMonthlyPlan(projectId: number) {
  return useQuery({
    queryKey: ['projects', projectId, 'monthlyPlan'],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectId}/monthly-plan`);
      return data;
    },
    enabled: !!projectId,
  });
}