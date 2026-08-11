<?php

namespace App\Http\Requests\Project;

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'client_name' => 'required|string|max:255',
            'project_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => [
                'required',
                Rule::enum(ProjectStatus::class),
            ],
            'priority' => [
                'required',
                Rule::enum(ProjectPriority::class),
            ],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'due_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date'],
        ];
    }
}
