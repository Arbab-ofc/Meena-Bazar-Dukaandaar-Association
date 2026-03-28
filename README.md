# Meena Bazar Dukaandaar Association

Official web platform for **Meena Bazar Dukaandaar Association (Patna, Bihar)**.

This project includes:

- Public-facing website (home, notices, legal updates, members, documents, gallery, contact)
- Admin panel for content/data management
- Firebase Auth + Firestore integration
- ImageKit upload workflow for media/documents
- Dockerized production serving via Nginx

---

## Table of Contents

1. [Project Highlights](#project-highlights)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Environment Variables](#environment-variables)
6. [Local Development](#local-development)
7. [Build for Production](#build-for-production)
8. [Docker Compose Setup](#docker-compose-setup)
9. [Authentication &amp; Admin Access](#authentication--admin-access)
10. [Data Model Overview](#data-model-overview)
11. [Image Upload Flow (ImageKit)](#image-upload-flow-imagekit)
12. [Pagination](#pagination)
13. [Logging](#logging)
14. [Troubleshooting](#troubleshooting)
15. [Scripts](#scripts)
16. [GitHub Actions CI/CD](#github-actions-cicd)

---

## Project Highlights

### Public Pages

- Home
- About
- Team
- Members (expandable member cards with full details)
- Notices (published notices)
- Legal Updates
- Documents
- Gallery
- Contact

### Admin Pages

- Login / Signup / Forgot Password
- Dashboard
- Manage Notices
- Manage Legal Updates
- Manage Documents (ImageKit upload)
- Manage Gallery (ImageKit upload)
- Manage Team (ImageKit upload)
- Manage Members (shop timings, schedule, photos)
- Contact Submissions
- Profile

### Core Features

- Role-gated admin area
- Structured Firestore services
- Seed bootstrap to DB for selected collections
- Smooth route scrolling and footer navigation behavior
- Modern pagination across list-heavy pages
- Runtime + service-level structured logging

---

## Tech Stack

- **Frontend**: React 18, React Router 6, Vite 5
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend services**: Firebase Authentication + Firestore
- **Media hosting**: ImageKit
- **Containerization**: Docker, Docker Compose, Nginx

---

## Folder Structure

```txt
src/
  app/
  components/
    common/
    layout/
    ui/
  contexts/
  data/
  hooks/
  pages/
    public/
    admin/
  routes/
  services/
    firebase/
    firestore/
    imagekit/
  styles/
  utils/

docker/
  nginx/
    default.conf

Dockerfile
docker-compose.yml
.env.example
```

---

## Prerequisites

- Node.js 20+ (recommended)
- npm 9+
- Firebase project (Auth + Firestore)
- ImageKit account
- Docker + Docker Compose (for containerized deployment)

---

## Environment Variables

Copy `.env.example` to `.env` and configure values.

```bash
cp .env.example .env
```

### Required

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_IMAGEKIT_ENDPOINT=https://ik.imagekit.io/<your_imagekit_id>/
VITE_IMAGEKIT_PUBLIC_KEY=<your_imagekit_public_key>
VITE_IMAGEKIT_AUTH_ENDPOINT=/api/imagekit-auth

# Used by local Vite dev auth endpoint for ImageKit signing
IMAGEKIT_PRIVATE_KEY=<your_imagekit_private_key>

# Logging verbosity: debug | info | warn | error | silent
VITE_LOG_LEVEL=debug
```

### Notes

- Never expose `IMAGEKIT_PRIVATE_KEY` in client-side code.
- In this project, local dev auth endpoint is served by Vite server middleware at `/api/imagekit-auth`.

---

## Local Development

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Open:

- `http://localhost:5173`

---

## Build for Production

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

---

## Docker Compose Setup

This repo includes a production-ready Docker stack:

- Multi-stage `Dockerfile`
- Nginx SPA config (`docker/nginx/default.conf`)
- `docker-compose.yml`

### Start

```bash
docker compose up --build -d
```

### Access

- `http://localhost:8080`

### Stop

```bash
docker compose down
```

### Validate compose config

```bash
docker compose config
```

---

## Authentication & Admin Access

- Admin routes are protected.
- On login, user is validated against the `admins` Firestore collection.
- Unauthorized users are signed out from admin context.

Admin collection sample fields:

```json
{
  "uid": "firebase-uid",
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "Admin",
  "isActive": true
}
```

---

## Data Model Overview

### `notices`

- `title`, `slug`, `summary`, `content`, `status`, `featured`, timestamps

### `legal_updates`

- `title`, `slug`, `caseNumber`, `court`, `summary`, `content`, `status`, `documentLinks`, timestamps

### `members`

- `shopNumber`, `shopName`, `ownerName`, `status`, `displayOrder`
- `openTime`, `closeTime`
- `schedule` (weekly day-wise open/closed map)
- `shopImageUrl`, `ownerImageUrl`

### `team_members`

- `name`, `roleEn`, `roleHi`, `photoUrl`, `designationOrder`, `isLeadership`, `isBoardMember`

### `documents`

- `title`, `category`, `description`, `fileUrl`, `fileType`, `tags`, `publicId`, `uploadedBy`, timestamps

### `gallery`

- `title`, `category`, `imageUrl`, `thumbnailUrl`, `publicId`, `eventDate`, `location`, timestamps

### `contact_submissions`

- `name`, `email`, `phone`, `message`, `status`, timestamps

---

## Image Upload Flow (ImageKit)

Implemented admin upload workflows:

- Admin Gallery
- Admin Documents
- Admin Team (member photo)
- Admin Members (shop photo + owner photo)

Flow:

1. Select file
2. Fetch signed auth params from `/api/imagekit-auth`
3. Upload to ImageKit
4. Save returned URL/public id in Firestore

---

## Pagination

Reusable pagination component is used across public/admin listing pages.

Behavior:

- Page numbers + previous/next
- Handles long ranges with ellipsis
- Resets to page 1 on filter/search/data changes

---

## Logging

Central logger is implemented in `src/utils/logger.js` with scoped logs.

Also included:

- Runtime global logging (`window.onerror`, `unhandledrejection`)
- Service-level logs in auth/firestore/imagekit services

---

## GitHub Actions CI/CD

This repo includes a workflow at:

`/.github/workflows/ci-cd.yml`

### What it does

- On PRs to `main` or `dev`: runs build check (`npm ci` + `npm run build`)
- On push to `dev`: auto-deploys to dev server via SSH + Docker Compose
- On push to `main`: auto-deploys to production server via SSH + Docker Compose

### Required GitHub Secret

- `FIREBASE_SERVICE_ACCOUNT_MEENA_BAZAR_ASSOCIATION`

Create it from Firebase project service account JSON and add it as a repository secret.

### Deploy behavior

- Push to `dev`: deploys to Firebase Hosting preview channel `dev`
- Push to `main`: deploys to Firebase Hosting `live` channel

Live URL:

- `https://meena-bazar-association.web.app`

Set verbosity via:

```env
VITE_LOG_LEVEL=debug
```

Use `warn`/`error` in production for quieter output.

---

## Troubleshooting

### 1) Published notices not visible

- Ensure notice `status` is `published`.
- Service now normalizes status casing and fetches robustly.

### 2) Image upload fails with auth endpoint error

- Verify `VITE_IMAGEKIT_AUTH_ENDPOINT=/api/imagekit-auth`
- Ensure `.env` contains `IMAGEKIT_PRIVATE_KEY` and `VITE_IMAGEKIT_PUBLIC_KEY`
- Restart dev server after env changes

### 3) CORS issues in local upload flow

- Use relative endpoint `/api/imagekit-auth` (already default)
- Vite middleware handles local auth endpoint

### 4) Footer links navigate but scroll behavior feels wrong

- Global scroll manager is implemented for route+hash handling
- Footer link clicks also force top scroll

### 5) Docker container not healthy

- Check container logs:
  ```bash
  docker compose logs -f web
  ```
- Ensure build succeeds and Nginx config is mounted properly

---

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build locally
```

---

If you want, next step can be adding:

- CI pipeline (lint/build/docker)
- automated tests
- deployment playbook for VPS/Cloud Run/ECS
