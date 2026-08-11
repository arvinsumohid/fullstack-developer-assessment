import { useState, useEffect } from 'react';

import { fetchProjectById } from '@/api/projects';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { showErrorAlert } from '@/lib/alerts';

import type { ProjectPriority, ProjectStatus } from '@/types/project';

export interface ProjectFormData {
    client_name: string;
    project_name: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    start_date: string;
    due_date: string;
}

const defaultProjectFormData: ProjectFormData = {
    client_name: '',
    project_name: '',
    description: '',
    status: 'Planning',
    priority: 'Low',
    start_date: '',
    due_date: '',
};

interface ProjectFormProps {
    projectId?: number;
    isEditing?: boolean;
    onSubmit: (formData: ProjectFormData) => Promise<void> | void;
    onCancel?: () => void;
}

export default function ProjectForm({
    projectId,
    isEditing,
    onSubmit,
    onCancel,
}: ProjectFormProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoadingProject, setIsLoadingProject] = useState<boolean>(
        Boolean(projectId),
    );
    const [form, setForm] = useState<ProjectFormData>(defaultProjectFormData);

    useEffect(() => {
        let isCurrentRequest = true;

        const fetchProject = async () => {
            if (!projectId) {
                setForm(defaultProjectFormData);
                setIsLoadingProject(false);

                return;
            }

            setIsLoadingProject(true);

            try {
                const project = await fetchProjectById(projectId);

                if (!isCurrentRequest) {
                    return;
                }

                setForm({
                    client_name: project.client_name,
                    project_name: project.project_name,
                    description: project.description ?? '',
                    status: project.status,
                    priority: project.priority,
                    start_date: project.start_date?.slice(0, 10) ?? '',
                    due_date: project.due_date?.slice(0, 10) ?? '',
                });
            } catch {
                if (isCurrentRequest) {
                    showErrorAlert('Unable to load project details.');
                }
            } finally {
                if (isCurrentRequest) {
                    setIsLoadingProject(false);
                }
            }
        };

        fetchProject();

        return () => {
            isCurrentRequest = false;
        };
    }, [projectId]);

    const updateField = <K extends keyof ProjectFormData>(
        field: K,
        value: ProjectFormData[K],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(form);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = () => {
        if (
            form.start_date &&
            form.due_date &&
            form.due_date < form.start_date
        ) {
            showErrorAlert('Due date cannot be earlier than start date.');

            return false;
        }

        return true;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    {isEditing ? 'Edit Project' : 'Create Project'}
                </CardTitle>

                <CardDescription>
                    {isEditing
                        ? 'Update the project details below.'
                        : 'Create a new project for your client.'}
                </CardDescription>
            </CardHeader>

            {isLoadingProject ? (
                <CardContent className="space-y-6" aria-live="polite">
                    <div className="flex items-center justify-center gap-3 py-2">
                        <Spinner className="size-5 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Loading Project
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <ProjectFormFieldSkeleton />
                        <ProjectFormFieldSkeleton />
                    </div>

                    <ProjectFormFieldSkeleton className="h-24" />

                    <div className="grid gap-6 md:grid-cols-2">
                        <ProjectFormFieldSkeleton />
                        <ProjectFormFieldSkeleton />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <ProjectFormFieldSkeleton />
                        <ProjectFormFieldSkeleton />
                    </div>
                </CardContent>
            ) : (
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Client / Project */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="client_name">
                                    Client Name
                                    <span className="text-destructive"> *</span>
                                </Label>

                                <Input
                                    id="client_name"
                                    name="client_name"
                                    value={form.client_name}
                                    onChange={(event) =>
                                        updateField(
                                            'client_name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Enter client name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="project_name">
                                    Project Name
                                    <span className="text-destructive"> *</span>
                                </Label>

                                <Input
                                    id="project_name"
                                    name="project_name"
                                    value={form.project_name}
                                    onChange={(event) =>
                                        updateField(
                                            'project_name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Enter project name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>

                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={form.description}
                                onChange={(event) =>
                                    updateField(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                placeholder="Describe the project..."
                                className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                        </div>

                        {/* Status / Priority */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    Status
                                    <span className="text-destructive"> *</span>
                                </Label>

                                <Select
                                    value={form.status}
                                    onValueChange={(value) =>
                                        updateField(
                                            'status',
                                            value as ProjectStatus,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="status"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Planning">
                                            Planning
                                        </SelectItem>

                                        <SelectItem value="In Progress">
                                            In Progress
                                        </SelectItem>

                                        <SelectItem value="On Hold">
                                            On Hold
                                        </SelectItem>

                                        <SelectItem value="Completed">
                                            Completed
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">
                                    Priority
                                    <span className="text-destructive"> *</span>
                                </Label>

                                <Select
                                    value={form.priority}
                                    onValueChange={(value) =>
                                        updateField(
                                            'priority',
                                            value as ProjectPriority,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="priority"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>

                                        <SelectItem value="Medium">
                                            Medium
                                        </SelectItem>

                                        <SelectItem value="High">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>

                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    value={form.start_date}
                                    onChange={(event) =>
                                        updateField(
                                            'start_date',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="due_date">Due Date</Label>

                                <Input
                                    id="due_date"
                                    name="due_date"
                                    type="date"
                                    value={form.due_date}
                                    onChange={(event) =>
                                        updateField(
                                            'due_date',
                                            event.target.value,
                                        )
                                    }
                                    min={form.start_date || undefined}
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="mt-8 justify-end gap-2">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        )}

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Saving...'
                                : isEditing
                                  ? 'Update Project'
                                  : 'Create Project'}
                        </Button>
                    </CardFooter>
                </form>
            )}
        </Card>
    );
}

function ProjectFormFieldSkeleton({
    className = 'h-9',
}: {
    className?: string;
}) {
    return (
        <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className={className} />
        </div>
    );
}
