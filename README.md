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
| mock | image copy 2.png |
| suno | image copy.png |

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

Frontend runs at `http://localhost:5173` or `http://127.0.0.1:5173`

<!-- ## Authentication

### Username / Password

The app supports local registration and login from the frontend landing page.

### Google Login

Google sign-in is wired through `django-allauth`. To make it work locally, you need:

1. A Google OAuth client
2. A configured `SocialApp` entry in Django admin
3. The correct callback URL in Google Cloud Console

Typical local callback URL:

```text
http://127.0.0.1:8000/accounts/google/login/callback/
```

You also need to ensure the Django `Site` and the Google `SocialApp` are linked correctly. -->

## Song Generation Modes

### Mock Mode

`mock` mode returns a local sample audio file immediately. This is useful for UI development and demos.

### Suno Mode

`suno` mode sends generation requests to the Suno API and polls for status updates until audio becomes available.

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

