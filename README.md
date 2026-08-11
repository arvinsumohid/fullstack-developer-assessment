# Client Project Tracker

A simple Laravel and React application for tracking client projects, statuses, priorities, and due dates for a digital agency.

## Tech Stack

- Laravel 13
- PHP 8.4
- React 19 with Inertia
- Tailwind CSS 4
- PostgreSQL
- Pest

## Setup

1. Install PHP dependencies.

```bash
composer install
```

2. Install JavaScript dependencies.

```bash
npm install
```

3. Create the environment file and application key.

```bash
cp .env.example .env
php artisan key:generate
```

4. Configure PostgreSQL in `.env`.

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=client_project_tracker
DB_USERNAME=postgres
DB_PASSWORD=
```

5. Run migrations.

```bash
php artisan migrate
```

## Run The App

Start the Laravel server, queue worker, and Vite dev server together:

```bash
composer run dev
```

Then open:

```txt
http://localhost:8000/tracker
```

## API Endpoints

The project API is exposed without an `/api` prefix:

```txt
GET    /projects
GET    /projects/{project}
POST   /projects
PUT    /projects/{project}
DELETE /projects/{project}
```

Run frontend checks:

```bash
npm run types:check
npm run lint:check
```

## Technical Reflection

### What Was Built

I built a client project tracker with CRUD API endpoints, a React project list, create/edit forms, delete confirmation, loading states, and validation for required fields, enum values, and date order.

### Technical Decisions

I used Laravel form requests and PHP enums so validation rules stay centralized and match the database-supported status and priority values. On the frontend, project API calls are kept in a small helper module, while React components stay focused on UI state and rendering.

### Error Handling

Invalid requests return JSON validation errors from Laravel. The frontend parses API errors and displays meaningful toast messages, including date validation and request failures.

### UX Improvements

The project list shows an animated loading state while data is fetched. Edit mode also shows a form-shaped skeleton while project details load, and delete requires a confirmation dialog before the destructive request is sent.

### Tradeoffs And Next Steps

For this assessment-sized app, the implementation favors straightforward code over heavier abstractions. Given more time, I would add full API feature tests with a project factory, field-level frontend validation errors, pagination or filtering for large project lists, and deployment notes.
