# Meena Bazar Dukaandaar Association

Official web platform for **Meena Bazar Dukaandaar Association, Patna, Bihar**.

The application includes a public website, an admin portal, Firebase-backed content management, ImageKit media uploads, Firebase Hosting support, and a Docker/Nginx production setup.

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [Firebase Setup](#firebase-setup)
- [ImageKit Upload Setup](#imagekit-upload-setup)
- [Docker Setup](#docker-setup)
- [Admin Access](#admin-access)
- [Data Model](#data-model)
- [Performance Notes](#performance-notes)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)
- [Scripts](#scripts)

## Features

### Public Website

- Home page with association highlights, latest notices, leadership, gallery, and member shop carousel
- Public member shop directory
- Individual shop detail pages at `/members/:id`
- Shop cards with shop photo, shop number, owner name, timings, and contact number
- Shop detail page with shop photo, owner photo, owner details, contact number, timings, and weekly schedule
- About, team, notices, legal updates, documents, gallery, contact, and links pages
- Published-only visibility for content collections that use `status: published`
- Public read access for member/shop records
- Responsive mobile and large-screen layouts

### Admin Portal

- Login, signup, forgot password, dashboard, and profile
- Manage notices
- Manage legal updates
- Manage documents with ImageKit upload
- Manage gallery with ImageKit upload
- Manage links
- Manage team members with ImageKit upload
- Manage member shops with:
  - shop number
  - shop name
  - owner name
  - contact number
  - display order
  - active/inactive status
  - opening and closing time
  - weekly open/closed schedule
  - shop photo
  - owner photo
- Unique display order validation for member shops
- Contact submission management

### Core Behavior

- Firebase Auth for admin login
- Firestore `admins` collection as the admin allow-list
- Unauthorized users are signed out from admin context
- Firestore service modules per collection
- Structured runtime and service logging
- Route-level lazy loading
- Vendor chunk splitting for better production performance
- Desktop-only Three.js hero background loaded lazily after browser idle

## Tech Stack

- **Frontend**: React 18, Vite 5, React Router 6
- **Styling**: Tailwind CSS with CSS-variable theme tokens
- **Animation**: Framer Motion
- **3D**: Three.js, React Three Fiber, Drei
- **Icons**: Lucide React
- **Backend services**: Firebase Auth, Cloud Firestore
- **Media hosting**: ImageKit
- **Upload signing**: Vite dev middleware, Cloudflare Worker, or Docker auth sidecar
- **Deployment**: Firebase Hosting or Docker/Nginx
- **CI**: GitHub Actions build check and Firebase preview deploy for `dev`

## Project Structure

```txt
src/
  app/
    providers.jsx
  components/
    common/
    layout/
    theme/
    three/
    ui/
  contexts/
  data/
  hooks/
  pages/
    admin/
    public/
  routes/
  services/
    firebase/
    firestore/
    imagekit/
  styles/
  utils/

workers/
  imagekit-auth/
    src/index.js
    wrangler.toml

docker/
  auth/
  nginx/

Dockerfile
docker-compose.yml
firebase.json
firestore.rules
firestore.indexes.json
vite.config.js
```

## Requirements

- Node.js 20+
- npm 9+
- Firebase project with Authentication and Firestore enabled
- ImageKit account
- Cloudflare account if using the Worker signer
- Docker and Docker Compose if using containerized deployment

## Environment Variables

Create `.env` from `.env.example`.

```bash
cp .env.example .env
```

Recommended variables:

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

IMAGEKIT_PRIVATE_KEY=<your_imagekit_private_key>
IMAGEKIT_PUBLIC_KEY=<your_imagekit_public_key>

VITE_ADMIN_SECRET_KEY=<admin_signup_secret>
VITE_LOG_LEVEL=debug
```

Notes:

- Never expose `IMAGEKIT_PRIVATE_KEY` with a `VITE_` prefix.
- `VITE_ADMIN_SECRET_KEY` is client-visible because Vite embeds `VITE_` variables in the browser bundle. Treat it as a signup friction key, not as the main security boundary.
- The real admin security boundary is Firebase Auth plus Firestore admin checks.
- Restart the dev server after changing `.env`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

If port `5173` is busy, Vite will use the next available port.

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Build output is written to `dist/`.

## Firebase Setup

This project uses:

- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- Firestore Security Rules from `firestore.rules`

Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Deploy hosting:

```bash
npm run build
firebase deploy --only hosting
```

Deploy both:

```bash
npm run build
firebase deploy
```

The current Firebase Hosting config is in `firebase.json`.

## Firestore Rules

The canonical rules file is:

```txt
firestore.rules
```

Important behavior:

- `members` are publicly readable so shop cards and shop detail pages work for all visitors.
- `notices`, `legal_updates`, `team_members`, `documents`, `gallery`, and `links` are publicly readable only when they either do not have a `status` field or have `status: published`.
- Contact submissions can be created publicly with strict validation.
- Admin-only writes are protected through the `admins` collection.
- Unknown collections are denied.

Admin check:

```js
function isAdmin() {
  return signedIn()
    && exists(adminDocPath())
    && get(adminDocPath()).data.isActive == true;
}
```

Member read rule:

```js
match /members/{docId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

## ImageKit Upload Setup

Admin uploads use ImageKit for:

- documents
- gallery images
- team member photos
- member shop photos
- member owner photos
- admin profile avatars

Upload flow:

1. Admin selects a file.
2. Client asks an auth endpoint for ImageKit signing parameters.
3. Client uploads directly to ImageKit.
4. Returned URL/path is saved in Firestore.

### Local Vite Signer

In local development, Vite provides `/api/imagekit-auth` through `vite.config.js`.

Required `.env` values:

```env
IMAGEKIT_PRIVATE_KEY=
VITE_IMAGEKIT_PUBLIC_KEY=
```

Use:

```env
VITE_IMAGEKIT_AUTH_ENDPOINT=/api/imagekit-auth
```

or leave it unset for local defaults.

### Cloudflare Worker Signer

Worker location:

```txt
workers/imagekit-auth
```

Deploy:

```bash
cd workers/imagekit-auth
npm install
npx wrangler login
npx wrangler secret put IMAGEKIT_PRIVATE_KEY
npx wrangler secret put IMAGEKIT_PUBLIC_KEY
npx wrangler deploy
```

Then set:

```env
VITE_IMAGEKIT_AUTH_ENDPOINT=https://<your-worker>.workers.dev/api/imagekit-auth
```

## Web Push Notifications

The site supports free web push notifications with Firebase Cloud Messaging and a Cloudflare Worker sender.

Notification flow:

1. Visitor clicks **Enable Notifications** in the footer.
2. The browser grants notification permission and receives an FCM token.
3. The push Worker stores that token in Firestore under `push_tokens`.
4. When an admin creates a published notice or a legal update, the admin UI calls the Worker.
5. The Worker verifies the Firebase admin user and sends the notification through FCM.

Required frontend `.env` values:

```env
VITE_FIREBASE_MESSAGING_VAPID_KEY=
VITE_PUSH_WORKER_ENDPOINT=https://<your-push-worker>.workers.dev
```

Create the VAPID key in Firebase Console:

```txt
Project settings -> Cloud Messaging -> Web Push certificates
```

Push Worker location:

```txt
workers/push-notifications
```

Deploy:

```bash
cd workers/push-notifications
npm install
npx wrangler login
npx wrangler secret put VITE_FIREBASE_API_KEY
npx wrangler secret put FIREBASE_CLIENT_EMAIL
npx wrangler secret put FIREBASE_PRIVATE_KEY
npx wrangler deploy
```

`VITE_FIREBASE_API_KEY` is the same Firebase web API key already used by the React app. `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` come from a Firebase service account JSON. Keep the private key only as a Worker secret.

### Docker Auth Sidecar

Docker Compose includes an `auth` service that signs ImageKit uploads at:

```txt
/api/imagekit-auth
```

Nginx proxies that route to the auth sidecar.

## Docker Setup

Start the stack:

```bash
docker compose up --build -d
```

Open:

```txt
http://localhost:8080
```

Stop:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

Validate config:

```bash
docker compose config
```

## Admin Access

Admin route protection works in two layers:

1. Firebase Auth signs in the user.
2. `AuthContext` checks the user UID against the Firestore `admins` collection.

Admin document sample:

```json
{
  "uid": "firebase-uid",
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "Admin",
  "isActive": true,
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Admin signup creates a document at `admins/{uid}`. Firestore rules require the signed-in user to create only their own admin profile.

## Data Model

### `admins`

- `uid`
- `name`
- `email`
- `role`
- `isActive`
- `avatarUrl`
- `createdAt`
- `updatedAt`

### `notices`

- `title`
- `slug`
- `summary`
- `content`
- `status`: `draft` or `published`
- `featured`
- `createdBy`
- `createdAt`
- `updatedAt`

### `legal_updates`

- `title`
- `slug`
- `caseNumber`
- `court`
- `summary`
- `content`
- `status`
- `documentLinks`
- `createdAt`
- `updatedAt`

### `members`

- `shopNumber`
- `shopName`
- `ownerName`
- `contactNumber`
- `displayOrder`
- `status`: `Active` or `Inactive`
- `openTime`
- `closeTime`
- `schedule`
- `shopImageUrl`
- `ownerImageUrl`
- `createdAt`
- `updatedAt`

Display order is validated in the admin UI to avoid duplicate ordering.

### `team_members`

- `name`
- `roleEn`
- `roleHi`
- `photoUrl`
- `designationOrder`
- `isLeadership`
- `isBoardMember`
- `createdAt`
- `updatedAt`

### `documents`

- `title`
- `category`
- `description`
- `fileUrl`
- `fileType`
- `tags`
- `publicId`
- `uploadedBy`
- `createdAt`
- `updatedAt`

### `gallery`

- `title`
- `category`
- `imageUrl`
- `thumbnailUrl`
- `publicId`
- `eventDate`
- `location`
- `createdAt`
- `updatedAt`

### `links`

- `title`
- `url`
- `type`
- `description`
- `status`
- `createdBy`
- `createdAt`
- `updatedAt`

### `contact_submissions`

- `name`
- `email`
- `phone`
- `message`
- `status`: `new`, `read`, or `replied`
- `createdAt`
- `updatedAt`

## Public Routes

```txt
/                         Home
/about                    About
/team                     Team
/members                  Member directory
/members/:id              Member shop detail
/notices                  Notices
/notices/:slug            Notice detail
/legal-updates            Legal updates
/legal-updates/:slug      Legal update detail
/documents                Documents
/gallery                  Gallery
/contact                  Contact
/links                    Useful links
```

## Admin Routes

```txt
/admin/login
/admin/signup
/admin/forgot-password
/admin/dashboard
/admin/notices
/admin/legal-updates
/admin/documents
/admin/gallery
/admin/links
/admin/team
/admin/members
/admin/contact-submissions
/admin/profile
```

## Performance Notes

The app uses:

- Route-level lazy loading through React Router
- Manual vendor chunk splitting in `vite.config.js`
- Separate chunks for React, Firebase, Framer Motion, Three/R3F, and UI helper libraries
- Desktop-only Three.js hero background loaded lazily after browser idle

These changes keep the Home route and main entry bundle smaller while allowing the 3D hero to load separately.

## Styling and Theme

- Global styles live in `src/styles/globals.css`.
- Theme mode is controlled by `ThemeContext`.
- The active theme is applied as `data-theme` on `document.documentElement`.
- Tailwind consumes CSS variables from the theme tokens.

## Logging

Logging utilities:

```txt
src/utils/logger.js
src/utils/runtimeLogging.js
```

Logging includes:

- scoped service logs
- auth logs
- Firestore service logs
- ImageKit upload logs
- runtime `window.error` and `unhandledrejection` logs

Set log level with:

```env
VITE_LOG_LEVEL=debug
```

Valid values:

```txt
debug | info | warn | error | silent
```

## CI/CD

GitHub Actions workflow:

```txt
.github/workflows/ci-cd.yml
```

Current workflow behavior:

- Pull requests to `main` or `dev`: install dependencies and run `npm run build`
- Pushes to `dev`: build and deploy to Firebase Hosting preview channel `dev`
- Manual dispatch is supported

Required secret:

```txt
FIREBASE_SERVICE_ACCOUNT_MEENA_BAZAR_ASSOCIATION
```

Live Firebase Hosting project:

```txt
meena-bazar-association
```

## Troubleshooting

### Shop cards show but detail page cannot refresh live data

Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

The member rule must allow public reads:

```js
match /members/{docId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

### Duplicate member display order

The admin UI blocks duplicate display order values. Existing duplicate records must be edited manually in Admin > Members.

### Image upload auth fails

Check:

- `IMAGEKIT_PRIVATE_KEY`
- `VITE_IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PUBLIC_KEY`
- `VITE_IMAGEKIT_AUTH_ENDPOINT`
- Worker secrets if using Cloudflare
- Docker auth sidecar logs if using Docker Compose

### Firebase permission denied

Check:

- user is authenticated
- `admins/{uid}` exists
- admin document has `isActive: true`
- latest `firestore.rules` are deployed

### Published content not visible

For collections that use `status`, public reads require:

```txt
status = published
```

Members are the exception and are publicly readable.

### Docker web container unhealthy

Check:

```bash
docker compose logs -f web
docker compose logs -f auth
```

### Build warning about large chunks

The Three.js chunk is intentionally lazy and desktop-only. It is separated from critical route code.

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production assets into dist/
npm run preview  # Preview production build locally
```

Worker scripts:

```bash
cd workers/imagekit-auth
npm run dev
npm run deploy
```

## Current Notes

- There is no automated test suite yet.
- There is no lint script yet.
- Firestore rules are maintained in `firestore.rules`.
- The Cloudflare Worker signer is optional if Docker auth sidecar or local Vite signer is used.
