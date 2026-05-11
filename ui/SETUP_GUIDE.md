# Setup Instructions for Confession Box UI

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Java JDK 17+** (for running the backend API)
- **MySQL** (for the database)

## Backend Setup (API)

1. **Navigate to the API directory:**

   ```powershell
   cd api\confession-box
   ```

2. **Configure the database:**
   - Open `src\main\resources\application.properties`
   - Update the database connection settings:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/confession_box
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Create the database:**

   ```sql
   CREATE DATABASE confession_box;
   ```

4. **Run the Spring Boot application:**

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

   The API will start on `http://localhost:8080`

## Frontend Setup (React UI)

1. **Open a new terminal and navigate to the UI directory:**

   ```powershell
   cd ui
   ```

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Start the development server:**

   ```powershell
   npm start
   ```

   The React app will automatically open in your browser at `http://localhost:3000`

## Testing the Application

### Option 1: Create a New Account

1. Open `http://localhost:3000`
2. You'll be redirected to the login page
3. Click "Sign up" to create a new account
4. Fill in your details:
   - Full Name
   - Username
   - Email
   - Password (min 6 characters)
5. After signup, you'll be redirected to login
6. Login with your credentials

### Option 2: Use Existing Account (if available)

If you have already created test users in the API:

1. Go to `http://localhost:3000/login`
2. Enter your username and password
3. Click "Sign In"

## Features to Test

### For Regular Users:

1. **Dashboard:**
   - View all confessions in the system
   - See welcome message and instructions

2. **Create Confession:**
   - Click "+ New Confession" button
   - Write your confession
   - Choose to post anonymously or with your name
   - Submit

3. **My Confessions:**
   - Navigate to "My Confessions" from the navbar
   - View all your confessions
   - Edit existing confessions (click ✏️ icon)
   - Delete confessions (click 🗑️ icon)

### For Admin Users:

1. **Admin Dashboard:**
   - View statistics (total confessions, active, drafts)
   - Manage all confessions from all users

2. **User Management:**
   - Navigate to "Admin" section (if implemented)
   - View all users
   - Manage user status

## Troubleshooting

### API Connection Issues

If you see errors like "Failed to load confessions":

1. Make sure the backend API is running on `http://localhost:8080`
2. Check the browser console for error messages (F12)
3. Verify the API endpoints are accessible:
   - Try: `http://localhost:8080/confession-box/auth/signin`

### Port Already in Use

If port 3000 is already in use:

```powershell
# The React app will ask if you want to use another port
# Type 'Y' to use a different port
```

### CORS Issues

If you see CORS errors:

1. Make sure the Spring Boot API has CORS configured
2. Check that the proxy in `package.json` is set to `http://localhost:8080`

## Project Structure

```
ui/
├── public/                 # Static files
│   └── index.html         # HTML template
├── src/
│   ├── components/        # React components
│   │   ├── Auth/          # Login & Signup
│   │   ├── Confessions/   # Confession components
│   │   ├── Dashboard/     # Dashboard view
│   │   ├── Layout/        # Navbar and layout
│   │   └── MyConfessions/ # User's confessions
│   ├── context/           # React Context (Auth)
│   ├── services/          # API services
│   │   ├── apiService.js  # API calls
│   │   └── authService.js # Authentication logic
│   ├── App.js             # Main app with routing
│   ├── App.css            # Global styles
│   └── index.js           # Entry point
└── package.json           # Dependencies
```

## Available Scripts

In the `ui` directory:

- **`npm start`** - Runs the app in development mode
- **`npm build`** - Builds the app for production
- **`npm test`** - Runs tests (if configured)
- **`npm eject`** - Ejects from Create React App (one-way operation)

## Default Test Credentials

You can create test users via the API or use the signup page. Example:

**Regular User:**

- Username: `testuser`
- Password: `pass123`

**Admin User:**

- Username: `admin`
- Password: `admin123`

(Note: These must be created first through the API or signup page)

## Technology Stack

### Frontend:

- **React** 18.2.0 - UI library
- **React Router DOM** 6.20.0 - Routing
- **Axios** 1.6.2 - HTTP client
- **CSS3** - Styling

### Backend (existing):

- **Spring Boot** - REST API
- **JWT** - Authentication
- **MySQL** - Database

## Next Steps

1. ✅ Start the backend API
2. ✅ Start the frontend React app
3. ✅ Create an account or login
4. ✅ Create your first confession
5. ✅ Explore all features

## Support

If you encounter any issues:

1. Check that both backend and frontend are running
2. Verify database connection
3. Check browser console for errors
4. Ensure all dependencies are installed

Happy confessing! 🎭
