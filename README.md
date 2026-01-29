# Progres Frontend

This repository contains a modern React and Tailwind CSS implementation of
the **Progres** student portal.  It is designed to talk directly to
the existing Progres backend API and re‑implements all of the
functionality found in the original Kotlin multiplatform client.

## Features

The application supports all of the core features of the original
Progres app.  After logging in with your university credentials you
can:

- View your **student cards** (enrolments) and basic details for each
  academic year.
- Inspect your **baccalaureate information** and individual subject
  grades.
- See your current **pedagogical groups**.
- Browse the **subjects** for your current level along with their
  coefficients.
- View your **weekly timetable** and upcoming class sessions.
- Consult your **exam grades** and the **exam schedule** for all
  academic periods.
- Check your **continuous control (CC) grades**.
- Explore detailed **transcripts** down to the unit and module level.
- Monitor your **accommodation** requests and assignments.
- See whether your **transport fees** have been paid.
- Check your **discharge state** across the university’s various
  departments.
- View your personal **profile** along with your photo and the
  establishment’s logo.

## Tech Stack

- **React 18** with **Vite** for rapid development and hot module
  replacement.
- **React Router** for client side routing.
- **@tanstack/react‑query** to handle all data fetching and caching.
- **Axios** to interface with the REST API.
- **Tailwind CSS** (with the forms plugin) for a modern and fully
  responsive UI.

## Installation & Running

First ensure you have a recent version of **Node.js** installed.

1. Copy `.env.example` to `.env` and adjust the `VITE_API_BASE_URL` to
   point at your Progres backend.  By default it is set to the
   official production endpoint.

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at <http://localhost:5173>.  It will
   automatically reload when you modify any source file.

4. For a production build run:

   ```bash
   npm run build
   npm run preview
   ```

   The `preview` script serves the compiled static files so you can
   verify the production build locally.

## Configuration

The app reads its configuration from **environment variables** prefixed
with `VITE_`.  At minimum you should set:

```env
VITE_API_BASE_URL=https://progres.mesrs.dz
```

This controls the base URL used for all API requests.  If you are
developing against a local or staging server you should update this
value accordingly.

## Authentication

Authentication is handled entirely client side.  When you submit your
username and password on the login page the credentials are sent to
`/api/authentication/v1/` on the backend.  The backend returns a JSON
object containing a `token` and other identifying information.  This
token is stored in `localStorage` and used as the value for the
`Authorization` header on all subsequent requests.  There is no
`Bearer` prefix – the backend expects the raw token value.

When you choose to log out the token is removed from storage and the
application state is reset.

## License

This project is provided under the MIT license, identical to the
original Progres app.  See `LICENSE` in the original repository for
details.