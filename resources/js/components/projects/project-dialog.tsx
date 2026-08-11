import type { ComponentProps } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import ProjectForm from './project-form';

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId?: number;
    isSubmitting?: boolean;
    onSubmit: ComponentProps<typeof ProjectForm>['onSubmit'];
}

export default function ProjectDialog({
    open,
    onOpenChange,
    projectId,
    onSubmit,
}: ProjectDialogProps) {
    const isEditing = Boolean(projectId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Project' : 'Create Project'}
                    </DialogTitle>

                    <DialogDescription>
                        {isEditing
                            ? 'Update the project details.'
                            : 'Create a new project.'}
                    </DialogDescription>
                </DialogHeader>

                <ProjectForm
                    projectId={projectId}
                    isEditing={isEditing}
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
