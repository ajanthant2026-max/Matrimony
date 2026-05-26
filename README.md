# Aranyam (அரண்யம்)

Mobile-first Sri Lankan Tamil matrimony web application by ATTNAM Labs.

## Run locally

```bash
npm install
npm run dev
```

The app runs in sandbox mode when Firebase environment values are empty.

## Firebase setup

Copy `.env.example` to `.env.local` and fill in the Firebase Web SDK values:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Firestore collections used by the app:

- `users`: `{ uid, name, age, city, country, bio, interests, verifiedStatus }`
- `matches`: `{ matchId, user1, user2, status }`
- `chats/{matchId}/messages`: `{ senderId, text, createdAt }`

## Deploy

```bash
npm run deploy
```
