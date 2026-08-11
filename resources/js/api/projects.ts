import {
    destroy,
    index,
    show,
    store,
    update,
} from '@/actions/App/Http/Controllers/ProjectController';
import type { Project } from '@/types/project';

type ProjectPayload = Omit<Project, 'id'> & Partial<Pick<Project, 'id'>>;

type ProjectApiResponse = {
    message?: string;
    project?: Project;
};

type ValidationErrorBag = Record<string, string[]>;

type ErrorResponse = {
    message?: string;
    errors?: ValidationErrorBag;
};

const jsonResponseHeaders = {
    Accept: 'application/json',
};

const jsonRequestHeaders = {
    ...jsonResponseHeaders,
    'Content-Type': 'application/json',
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
    const data = (await response.json().catch(() => ({}))) as ErrorResponse & T;

    if (!response.ok) {
        const firstError = data.errors
            ? Object.values(data.errors).flat().at(0)
            : undefined;

        throw new Error(
            firstError ??
                data.message ??
                `Request failed with status ${response.status}.`,
        );
    }

    return data;
}

const fetchProjects = async (): Promise<Project[]> => {
    const response = await fetch(index.url(), {
        headers: jsonResponseHeaders,
    });

    return await parseJsonResponse<Project[]>(response);
};

const fetchProjectById = async (id: number): Promise<Project> => {
    const response = await fetch(show.url(id), {
        headers: jsonResponseHeaders,
    });

    return await parseJsonResponse<Project>(response);
};

const createProject = async (
    data: ProjectPayload,
): Promise<ProjectApiResponse> => {
    const response = await fetch(store.url(), {
        method: 'POST',
        headers: jsonRequestHeaders,
        body: JSON.stringify(data),
    });

    return await parseJsonResponse<ProjectApiResponse>(response);
};

const updateProject = async (
    id: number,
    data: ProjectPayload,
): Promise<Project> => {
    const response = await fetch(update.url(id), {
        method: 'PUT',
        headers: jsonRequestHeaders,
        body: JSON.stringify(data),
    });

    return await parseJsonResponse<Project>(response);
};

const deleteProject = async (id: number): Promise<ProjectApiResponse> => {
    const response = await fetch(destroy.url(id), {
        method: 'DELETE',
        headers: jsonResponseHeaders,
    });

    return await parseJsonResponse<ProjectApiResponse>(response);
};

export {
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
};
