<?php

namespace App\Http\Controllers;

use App\Http\Requests\Project\ProjectRequest;
use App\Models\Project;

class ProjectController extends Controller
{
    // get all projects
    public function index()
    {
        $projects = Project::all();

        return response()->json($projects, 200);
    }

    // create project
    public function store(ProjectRequest $request)
    {
        $project = Project::create($request->validated());

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project,
        ], 201);
    }

    // get single project by id
    public function show($id)
    {
        $project = Project::findOrFail($id);

        return response()->json($project, 200);
    }

    // update project
    public function update(ProjectRequest $request, $id)
    {
        $project = Project::findOrFail($id);
        $project->update($request->validated());

        return response()->json($project, 200);
    }

    // delete project
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}
