# Confession Box UI

A React-based frontend for the Confession Box application.

## Features

- User authentication (Sign up, Sign in)
- Create anonymous or public confessions
- View and manage your confessions
- Admin panel for managing users and confessions
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Confession Box API running on http://localhost:8080

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs tests
- `npm eject` - Ejects from Create React App

## Project Structure

```
ui/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Confessions/
│   │   └── Layout/
│   ├── services/
│   │   ├── apiService.js
│   │   └── authService.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
```

## Default Credentials

For testing, you can use:

- Username: testuser
- Password: pass123

Or create a new account using the Sign Up page.
