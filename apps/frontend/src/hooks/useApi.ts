import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => (await api.get('/api/dashboard/summary')).data,
    refetchInterval: 5000,
  });
};

export const useDashboardHistory = () => {
  return useQuery({
    queryKey: ['dashboardHistory'],
    queryFn: async () => (await api.get('/api/dashboard/history')).data,
    refetchInterval: 5000,
  });
};

export const useFarms = () => {
  return useQuery({
    queryKey: ['farms'],
    queryFn: async () => (await api.get('/api/farms')).data,
    refetchInterval: 5000,
  });
};

export const useFarmDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['farm', id],
    queryFn: async () => (await api.get(`/api/farms/${id}`)).data,
    enabled: !!id,
  });
};

export const useFarmTelemetry = (id: string | undefined) => {
  return useQuery({
    queryKey: ['farmTelemetry', id],
    queryFn: async () => (await api.get(`/api/farms/${id}/telemetry`)).data,
    refetchInterval: 5000,
    enabled: !!id,
  });
};
