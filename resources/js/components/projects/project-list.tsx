import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types/project';

interface ProjectListProps {
    projects: Project[];
    onEdit: (projectId: number) => void;
    onDelete: (project: Project) => void;
}

export default function ProjectList({
    projects,
    onEdit,
    onDelete,
}: ProjectListProps) {

    if (projects.length === 0) {
        return (
            <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No projects found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
                <thead className="border-b bg-muted/50">
                    <tr>
                        <th className="px-4 py-3 text-left">Client</th>
                        <th className="px-4 py-3 text-left">Project</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Priority</th>
                        <th className="px-4 py-3 text-left">Start Date</th>
                        <th className="px-4 py-3 text-left">Due Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td className="px-4 py-3">{project.client_name}</td>

                            <td className="px-4 py-3 font-medium">
                                {project.project_name}
                            </td>

                            <td className="px-4 py-3">{project.status}</td>

                            <td className="px-4 py-3">{project.priority}</td>

                            <td className="px-4 py-3">
                                {project.start_date
                                    ? formatDate(project.start_date)
                                    : '-'}
                            </td>

                            <td className="px-4 py-3">
                                {project.due_date
                                    ? formatDate(project.due_date)
                                    : '-'}
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(project.id)}
                                        aria-label={`Edit ${project.project_name}`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => onDelete(project)}
                                        aria-label={`Delete ${project.project_name}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
