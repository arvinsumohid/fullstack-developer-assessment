import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Project } from '@/types/project';

interface ProjectDeleteDialogProps {
    open: boolean;
    project?: Project | null;
    isDeleting?: boolean;
    onConfirm: () => Promise<void> | void;
    onOpenChange: (open: boolean) => void;
}

export default function ProjectDeleteDialog({
    open,
    project,
    isDeleting = false,
    onConfirm,
    onOpenChange,
}: ProjectDeleteDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!isDeleting) {
                    onOpenChange(nextOpen);
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete project?</DialogTitle>

                    <DialogDescription>
                        This will permanently delete "{project?.project_name}".
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isDeleting}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={!project || isDeleting}
                        onClick={onConfirm}
                        data-test="confirm-delete-project-button"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Project'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
