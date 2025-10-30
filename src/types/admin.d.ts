export interface Admin {
  id: string;
  name: string;
  role: string;
}

export interface DashboardStats {
  totalSubjects: number;
  totalUnits: number;
  totalFiles: number;
  totalStudents: number;
}

export interface DashboardData {
  admin: Admin;
  stats: DashboardStats;
}
