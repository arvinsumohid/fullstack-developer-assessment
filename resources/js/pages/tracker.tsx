import { lazy, Suspense, useEffect, useState } from 'react';
import {
    createProject,
    deleteProject,
    fetchProjects,
    updateProject,
} from '@/api/projects';
import ProjectDeleteDialog from '@/components/projects/project-delete-dialog';
import type { ProjectFormData } from '@/components/projects/project-form';
import ProjectList from '@/components/projects/project-list';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import {
    getErrorMessage,
    showErrorAlert,
    showSuccessAlert,
} from '@/lib/alerts';
import type { Project } from '@/types/project';

const ProjectDialog = lazy(
    () => import('@/components/projects/project-dialog'),
);

export default function Tracker() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectId, setProjectId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingList, setIsLoadingList] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setIsLoadingList(true);
                const projects = await fetchProjects();
                setProjects(projects);
            } catch (error) {
                showErrorAlert(
                    getErrorMessage(error, 'Unable to load projects.'),
                );
            } finally {
                setIsLoadingList(false);
            }
        };

        loadProjects();
    }, []);

    const handleEdit = (id: number) => {
        setProjectId(id);
        setDialogOpen(true);
    };

    const handleDelete = (project: Project) => {
        setProjectToDelete(project);
    };

    const handleConfirmDelete = async () => {
        const project = projectToDelete;

        if (!project) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await deleteProject(project.id);

            setProjects((currentProjects) =>
                currentProjects.filter(
                    (currentProject) => currentProject.id !== project.id,
                ),
            );
            setProjectToDelete(null);
            showSuccessAlert(response.message ?? 'Project deleted.');
        } catch (error) {
            showErrorAlert(getErrorMessage(error, 'Unable to delete project.'));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreate = () => {
        setProjectId(null);
        setDialogOpen(true);
    };

    const handleSubmitForm = async (formData: ProjectFormData) => {
        try {
            if (projectId) {
                const project = await updateProject(projectId, formData);

                setProjects((currentProjects) =>
                    currentProjects.map((currentProject) =>
                        currentProject.id === project.id
                            ? project
                            : currentProject,
                    ),
                );
                showSuccessAlert('Project updated.');
            } else {
                const response = await createProject(formData);

                if (response.project) {
                    setProjects((currentProjects) => [
                        ...currentProjects,
                        response.project as Project,
                    ]);
                }

                showSuccessAlert(response.message ?? 'Project created.');
            }

            setDialogOpen(false);
        } catch (error) {
            showErrorAlert(getErrorMessage(error, 'Unable to save project.'));
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Projects</h1>

                <Button onClick={handleCreate}>Create Project</Button>
            </div>

            {isLoadingList ? (
                <div className="rounded-lg border p-6" aria-live="polite">
                    <div className="flex items-center justify-center gap-3 py-4">
                        <Spinner className="size-5 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Loading Projects
                        </p>
                    </div>

                    <div className="mt-4 space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="grid gap-3 md:grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.9fr_0.9fr_0.5fr]"
                            >
                                <Skeleton className="h-5" />
                                <Skeleton className="h-5" />
                                <Skeleton className="h-5" />
                                <Skeleton className="h-5" />
                                <Skeleton className="h-5" />
                                <Skeleton className="h-5" />
                                <Skeleton className="h-5" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <ProjectList
                    projects={projects}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
            <Suspense fallback={null}>
                <ProjectDialog
                    open={dialogOpen}
                    projectId={projectId ?? undefined}
                    onSubmit={handleSubmitForm}
                    onOpenChange={setDialogOpen}
                />
            </Suspense>

            <ProjectDeleteDialog
                open={Boolean(projectToDelete)}
                project={projectToDelete}
                isDeleting={isDeleting}
                onConfirm={handleConfirmDelete}
                onOpenChange={(open) => {
                    if (!open) {
                        setProjectToDelete(null);
                    }
                }}
            />
        </div>
    );
}
