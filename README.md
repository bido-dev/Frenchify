# Frenchify

Welcome to the **Frenchify** project! This repository contains both the frontend application and the backend Firebase functions.

## Project Structure

- **`frontend/`**: The web application built with React, Vite, and Tailwind CSS.
- **`functions/`**: The backend API and serverless functions built with Node.js, Express, TypeScript, and Firebase Functions.
- **`firebase.json`**: Firebase configuration and emulator setup.
- **`firestore.rules` & `storage.rules`**: Security rules for Firestore and Firebase Storage.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 24 is recommended as per `functions/package.json` engines)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- Java (JRE) installed (Required to run Firebase Local Emulators)

If you haven't already, sign in to Firebase CLI:
```bash
firebase login
```

## Setup & Installation

You need to install dependencies for both the frontend and the backend functions.

**1. Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

**2. Install Functions Dependencies**
```bash
cd functions
npm install
cd ..
```

## Running Local Development (Emulators)

To develop locally, we use Vite for the frontend and the Firebase Local Emulator Suite for the backend functions.

**1. Start the Backend / Firebase Emulators**
Open a new terminal, navigate to the `functions` directory, and start the emulators:
```bash
cd functions
firebase emulators:start
```
*This command will build the TypeScript code and start the Firebase emulators (Functions, Firestore, etc.).*

**2. Start the Frontend Development Server**
Open another terminal, navigate to the `frontend` directory, and start Vite:
```bash
cd frontend
npm run dev
```

**3. Seeding the Database (Optional)**
If you need mock data for development, there are seed scripts available in the functions directory:
```bash
cd functions
npm run seed              # General seed data
npm run seed:enrollments  # Seed enrollments data
```

## Testing

The backend functions use Jest for unit testing. To run the tests:

```bash
cd functions
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Building and Deployment

**Frontend Deployment:**
To build the frontend for production:
```bash
cd frontend
npm run build
```
*(Deploy the `frontend/dist` directory to your hosting provider, such as Firebase Hosting or Vercel)*

**Backend (Functions) Deployment:**
To deploy the Firebase functions to the live environment:
```bash
cd functions
npm run deploy
```
*(This command runs `firebase deploy --only functions`)*

To view backend logs:
```bash
cd functions
npm run logs
```
