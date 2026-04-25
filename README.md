# Cithara

AI music generation web app built with Django and React. Users can create songs from prompts, manage a personal library, organize playlists, and share tracks through a simple web interface.

![Cithara preview](./image.png)

## Overview

Cithara is a full-stack project with:

- `Django` as the backend API and authentication layer
- `React + Vite` as the frontend
- `SQLite` for local development
- `django-allauth` for Google sign-in support
- A pluggable song generation flow with `mock` and `suno` strategies

The project is designed around a small music domain:

- `SongGenerationRequest` stores prompt, mood, occasion, and singer settings
- `GenerationJob` tracks generation status and returned audio URL
- `Song` stores the generated result
- `SongLibrary` groups a user's songs
- `Playlist` lets users organize songs into collections
- `ShareLink` exists in the domain model for shareable access

## Features

- Register and login with username/password
- Google login via `django-allauth`
- Generate songs from structured prompts
- Upload custom cover images
- Save songs into a personal library
- Create playlists and add/remove songs
- Copy share links for songs
- Download generated audio
- Switch generation backend between `mock` and `suno`

## Screenshots

| Method | Result |
| --- | --- |
| mock | ![mock screenshot](image%20copy%202.png) |
| suno | ![suno screenshot](image%20copy.png) |

## CRUD Functionality
![CRUD](./image-2.png)

## Tech Stack

### Backend

- Python 3
- Django 6
- django-allauth
- django-cors-headers
- python-dotenv
- requests
- Pillow
- SQLite

### Frontend

- React
- Vite
- Axios
- React Router
- React Icons

## Project Structure

```text
cithara/
├── cithara/               # Django project settings
├── frontend/              # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── styles/
├── songs/                 # Main backend app
│   ├── generation/        # Mock and Suno generation strategies
│   ├── models/            # Domain models
│   ├── views.py           # API endpoints
│   └── urls.py
├── db.sqlite3
├── .env
├── manage.py
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login/` | Login with username and password |
| POST | `/api/logout/` | Logout current user |
| POST | `/api/register/` | Register a new user |
| GET | `/api/me/` | Get current authenticated user info |

### Songs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/songs/?username=<username>` | Get all songs for a user |
| POST | `/api/generate/` | Generate a new song |
| GET | `/api/status/<task_id>/` | Check song generation status |
| GET | `/api/songs/<song_id>/` | Get song detail by ID |
| DELETE | `/api/songs/<song_id>/delete/` | Delete a song |

### Playlists

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/playlists/?username=<username>` | Get all playlists for a user |
| POST | `/api/playlists/` | Create a new playlist |
| GET | `/api/playlists/<playlist_id>/` | Get playlist detail with songs |
| DELETE | `/api/playlists/<playlist_id>/` | Delete a playlist |
| POST | `/api/playlists/<playlist_id>/songs/` | Add a song to a playlist |
| DELETE | `/api/playlists/<playlist_id>/songs/` | Remove a song from a playlist |

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd cithara
```

### 2. Create a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install backend dependencies

```bash
pip install django django-allauth django-cors-headers python-dotenv requests pillow
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
GENERATOR_STRATEGY=mock
SUNO_API_KEY=your_suno_api_key
```

`GENERATOR_STRATEGY` options:

- `mock` for local demo mode
- `suno` to call the Suno API

### 5. Run database migrations

```bash
python3 manage.py migrate
```

### 6. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 7. Start the backend

```bash
python3 manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`

### 8. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Frontend runs at `http://127.0.0.1:5173`

Use `127.0.0.1` consistently for both frontend and backend during local OAuth testing.
Mixing `localhost` and `127.0.0.1` can cause Google login redirect/session issues.

## Google Login Setup

Google sign-in is implemented with `django-allauth`.

### 1) Create a Google OAuth client

In Google Cloud Console, create an **OAuth 2.0 Client ID** with type **Web application**.

- Authorized redirect URI:
  - `http://127.0.0.1:8000/accounts/google/login/callback/`

### 2) Configure Django Site and SocialApp

Open Django admin at `http://127.0.0.1:8000/admin` and configure:

- `Sites`:
  - Domain: `127.0.0.1:8000`
  - Display name: any value (for example `127.0.0.1:8000`)
- `Social applications`:
  - Provider: `Google`
  - Client ID / Secret: from Google Cloud Console
  - Chosen sites: include the site above

### 3) Run both servers

- Backend: `python3 manage.py runserver 127.0.0.1:8000`
- Frontend: `cd frontend && npm run dev`

Open the app at `http://127.0.0.1:5173` and use **Login with Google**.

### 4) Important local dev note

Use `127.0.0.1` consistently for both backend and frontend.
Do not mix `localhost` and `127.0.0.1`, because OAuth redirect/session behavior can break across hostnames.

## Song Generation Modes

### Mock Mode

`mock` mode returns a local sample audio file immediately. This is useful for UI development and demos.

How to run in `mock` mode:

1. Set in `.env`:
   - `GENERATOR_STRATEGY=mock`
2. Start backend:
   - `python3 manage.py runserver 127.0.0.1:8000`
3. Start frontend:
   - `cd frontend && npm run dev`

### Suno Mode

`suno` mode sends generation requests to the Suno API and polls for status updates until audio becomes available.

How to run in `suno` mode:

1. Set in `.env`:
   - `GENERATOR_STRATEGY=suno`
   - `SUNO_API_KEY=<your_real_suno_api_key>`
2. Restart backend so new env values are loaded:
   - `python3 manage.py runserver 127.0.0.1:8000`
3. Start frontend:
   - `cd frontend && npm run dev`

If `SUNO_API_KEY` is missing or invalid, Suno generation requests will fail.

## Submission Checklist

- Merge all required work into `main` (or `master`) before submission.
- Do not commit real secrets (especially `SUNO_API_KEY`) into git.
- Keep secrets in `.env` only. This repository ignores `.env` via `.gitignore`.

## Evidence of Running Modes

Provide links to your own run evidence before submitting:

1. Mock generation works (successful output/audio)
2. Suno generation returns a `task_id` and status/details can be fetched

Example evidence format:

- Mock mode run evidence: [`docs/evidence/mock-generation-success.json`](docs/evidence/mock-generation-success.json)
- Suno mode task creation (`task_id`) evidence: [`docs/evidence/suno-generation-attempt.json`](docs/evidence/suno-generation-attempt.json)
- Suno mode status/details evidence (`/api/status/<task_id>/`): [`docs/evidence/suno-status-details.json`](docs/evidence/suno-status-details.json)

## Main Pages

- `/` login and register page
- `/generate` create a new song
- `/library` browse generated songs
- `/playlists` manage playlists
- `/playlists/:id` playlist details and playback
- `/share/:id` open a shared song page
- `/admin` Django admin panel

## Example Development Workflow

```bash
python3 manage.py migrate
python3 manage.py runserver
cd frontend
npm install
npm run dev
```

Then open:

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8000`
- Admin: `http://127.0.0.1:8000/admin`

## Admin

Create an admin account with:

```bash
python3 manage.py createsuperuser
```

Use Django admin to inspect users, songs, generation requests, jobs, and related data.

