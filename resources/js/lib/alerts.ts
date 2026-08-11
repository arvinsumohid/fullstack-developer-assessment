import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function showAlert({ type, message }: FlashToast): void {
    toast[type](message);
}

export function showSuccessAlert(message: string): void {
    showAlert({ type: 'success', message });
}

export function showErrorAlert(message: string): void {
    showAlert({ type: 'error', message });
}

export function getErrorMessage(
    error: unknown,
    fallback = 'Something went wrong.',
): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}
