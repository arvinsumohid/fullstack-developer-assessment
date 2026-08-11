export type ProjectStatus =
  | 'Planning'
  | 'In Progress'
  | 'On Hold'
  | 'Completed';

export type ProjectPriority = 'Low' | 'Medium' | 'High';

export interface Project {
  id: number;
  client_name: string;
  project_name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string | null;
  due_date: string | null;
}
