# SWYNEX Backend API and Database

REST API for CareerPilot (internship tracker) built with Node.js, Express and SQLite.

## Features
- Complete CRUD for the Jobs resource
- Input validation (title, company, deadline)
- SQLite database (auto-created on first run)

## Setup
1. npm install
2. node server.js
3. Open http://localhost:5000/api/jobs

## API Routes
| Method | Route | Purpose |
|---|---|---|
| POST | /api/jobs | Create a job |
| GET | /api/jobs | List all jobs |
| GET | /api/jobs/:id | Get one job |
| PUT | /api/jobs/:id | Update a job |
| DELETE | /api/jobs/:id | Delete a job |

## Validation Rules
- title: required, minimum 3 characters
- company: required, minimum 2 characters
- deadline: optional, must be a valid date
