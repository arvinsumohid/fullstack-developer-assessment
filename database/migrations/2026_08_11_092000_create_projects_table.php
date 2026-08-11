<?php

use App\Enums\ProjectPriority;
use App\Enums\ProjectStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('project_name');
            $table->text('description')->nullable();
            $table->enum('status', ProjectStatus::values())->default(ProjectStatus::PLANNING->value);
            $table->enum('priority', ProjectPriority::values())->default(ProjectPriority::LOW->value);
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamps();

            $table->index('client_name');
            $table->index('project_name');
            $table->index('status');
            $table->index('priority');
            $table->index('start_date');
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
