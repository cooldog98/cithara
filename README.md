# Cithara Music AI (Django Project)

## Project Overview

This project is a Django-based web application for AI-generated music.
Users can generate songs based on structured inputs, manage their personal song library, and share songs with others באמצעות shareable links.

The system is designed based on domain-driven concepts, ensuring clear separation between business logic and implementation.

---

## Domain Concepts

The system consists of the following core domain entities:

* **User**
  Authenticated user of the system (Django built-in).
  Can act as both a Creator and a Listener.

* **Song**
  Represents a generated music track.
  Each song belongs to exactly one user and one generation request.

* **SongGenerationRequest**
  Stores input parameters used to generate a song
  (title, mood, occasion, singer gender, prompt).

* **SongLibrary**
  Represents a user's personal collection of songs.

* **ShareLink**
  A shareable link that allows other users to access a song.

---

## Relationships (Summary)

* One User → Many Songs
* One User → Many SongGenerationRequests
* One Song ↔ One SongGenerationRequest
* One Song → Many ShareLinks
* One User → One SongLibrary

---

## UML Diagram

> *![alt text](image.png)*

---

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/cooldog98/music_ai.git
cd music_ai
```

### 2. Install dependencies

```
pip install django
```

### 3. Apply database migrations

```
python3 manage.py migrate
```

### 4. Run the development server

```
python3 manage.py runserver
```

---

## Access the Application

* Main page: http://127.0.0.1:8000/
* Admin panel: http://127.0.0.1:8000/admin

---

## Admin Usage (CRUD Operations)

This project uses Django Admin to demonstrate CRUD operations.

You can:

* Create new songs and generation requests
* View stored data
* Update existing records
* Delete records

To access admin:

```
python3 manage.py createsuperuser
```

---

## Features

* AI song generation request tracking
* Persistent song storage
* Personal song library management
* Shareable song links
* Full CRUD operations via Django Admin

---

## Design Decisions

* **One Song = One Mood, One Occasion**
  Ensures consistency in AI-generated output and simplifies input handling.

* **Song → User (Direct Relationship)**
  Even though songs are part of a library, ownership is modeled explicitly for access control.

* **Regeneration = New Request**
  Each generation is treated as a new event to ensure traceability and accurate history tracking.

---

## Technologies Used

* Python 3
* Django
