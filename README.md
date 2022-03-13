# Google Drive Permission Manager

App that uses the Google Drive API to bulk remove of users permissions on files.

Backend: [https://github.com/ejanerop/gdrive-frontend](https://github.com/ejanerop/gdrive-backend)

## Installation

Clone repo:

```
git clone https://github.com/ejanerop/gdrive-frontend.git
cd gdrive-frontend
```

Install dependencies:

```
npm install
```

Modify environment variables in `environments/environment.ts` and `environments/environment.prod.ts`:

```
export const environment = {
  production: true,
  api_url: 'http://localhost:8000',
  owner_email: 'testuser@gmail.com',
};
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
