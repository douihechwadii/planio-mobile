import { api } from '@/lib/axios';
import { Assignment } from '@/types/assignment';
import { useQuery } from '@tanstack/react-query';

export const assignmentKeys = {
  all: () => ['assignments'] as const,
  byProject: (pid: number) => ['assignments', 'project', pid] as const,
  byResource: (rid: number) => ['assignments', 'resource', rid] as const,
};

export function useAssignments() {
  return useQuery({
    queryKey: assignmentKeys.all(),
    queryFn: async () => {
      const { data } = await api.get<Assignment[]>('/assignments');
      return data;
    },
  });
}

export function useAssignmentsByProject(projectId?: number) {
  return useQuery({
    queryKey: ['assignments', 'project', projectId],
    queryFn: async () => {
      const { data } = await api.get<Assignment[]>(`/assignments/project/${projectId}`);
      return data;
    },
    enabled: !!projectId,
  });
}

export function useAssignmentsByResource(resourceId?: number) {
  return useQuery({
    queryKey: ['assignments', 'resource', resourceId],
    queryFn: async () => {
      const { data } = await api.get<Assignment[]>(`/assignments/resource/${resourceId}`);
      return data;
    },
    enabled: !!resourceId,
  });
}