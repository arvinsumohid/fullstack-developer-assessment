<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'tracker')->name('home');
Route::inertia('tracker', 'tracker')->name('tracker');
Route::inertia('dashboard', 'dashboard')->name('dashboard');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::inertia('dashboard', 'dashboard')->name('dashboard');
// });

require __DIR__.'/settings.php';
