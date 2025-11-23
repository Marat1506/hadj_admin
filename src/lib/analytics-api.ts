import { API } from '@/lib/api';

export interface DashboardStats {
  totalCustomers: number;
  customersTrend: number;
  tasksProgress: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await API.get('/analytics/dashboard');
  return data;
}
