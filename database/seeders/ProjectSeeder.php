<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\File;
use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(
            File::get(database_path('seeders/test_data.json')),
            true
        );

        foreach ($data as $project) {
            Project::create([
                'client_name' => $project['clientName'],
                'project_name' => $project['projectName'],
                'description' => $project['description'],
                'status' => $project['status'],
                'priority' => $project['priority'],
                'start_date' => $project['startDate'],
                'due_date' => $project['dueDate'],
            ]);
        }
    }
}
