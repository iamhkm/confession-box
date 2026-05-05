# Confession Box API - Postman Collection Guide

## 📋 Overview

This document provides instructions on how to import and use the Confession Box API Postman collection.

## 📥 How to Import the Collection

### Step 1: Open Postman
- Download and install [Postman](https://www.postman.com/downloads/) if you haven't already
- Open the Postman application

### Step 2: Import Collection
**Method 1: Using File**
1. Click **"Import"** button in the top-left corner
2. Select **"File"** tab
3. Click **"Upload Files"**
4. Navigate to: `/Users/himanshumitttal/eclipse-workspace/confession-box/`
5. Select: `Confession-Box-API.postman_collection.json`
6. Click **"Open"** then **"Import"**

**Method 2: Using Link (if shared)**
1. Click **"Import"** button
2. Select **"Link"** tab
3. Paste the collection link
4. Click **"Continue"** then **"Import"**

## ⚙️ Initial Setup

### Step 1: Configure Environment Variables

After importing, you'll see variables defined:

| Variable | Default Value | Purpose |
|----------|---------------|---------|
| `baseUrl` | `http://localhost:8080/confession-box` | API base URL |
| `jwtToken` | Empty | JWT token (auto-populated after login) |
| `username` | Empty | Current username |
| `role` | Empty | Current user's role |

### Step 2: Ensure Your Application is Running

```bash
# Terminal - Navigate to project directory
cd /Users/himanshumitttal/eclipse-workspace/confession-box

# Build the project (optional)
mvn clean install

# Run the application
mvn spring-boot:run

# Or if using Eclipse/IDE, run as Spring Boot Application
```

Check that the API is running at: `http://localhost:8080/confession-box`

## 🚀 Getting Started

### Step 1: Create a Test User

1. Open the collection and navigate to: **User Management → Create User (Register)**
2. The request body has default values:
   ```json
   {
       "username": "new_user",
       "email": "newuser@example.com",
       "password": "password123",
       "name": "New User",
       "role": "USER"
   }
   ```
3. You can modify these values
4. Click **"Send"**
5. Expected response: `201 Created` with user details

### Step 2: Sign In to Get JWT Token

1. Navigate to: **Public Endpoints → Sign In**
2. The request body has default credentials:
   ```json
   {
       "username": "new_user",
       "password": "password123"
   }
   ```
3. Click **"Send"**
4. Expected response: `200 OK` with JWT token
   ```json
   {
       "jwtToken": "eyJhbGciOiJIUzI1NiJ9...",
       "username": "new_user",
       "role": "USER"
   }
   ```

### Step 3: JWT Token Auto-Population

The collection has an automatic test script that saves your JWT token to the environment variable after a successful login:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set('jwtToken', response.jwtToken);
    pm.environment.set('username', response.username);
    pm.environment.set('role', response.role);
    console.log('JWT Token saved to environment');
}
```

**This means:**
- After signing in, your JWT token is automatically saved
- All subsequent requests will use this token
- No manual copy-paste needed!

## 📚 API Endpoints Reference

### Public Endpoints (No Authentication Required)

#### 1. Sign In
```
POST /public/signin
```
- **Description:** Authenticate user and receive JWT token
- **Body:**
  ```json
  {
      "username": "string",
      "password": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
      "jwtToken": "string",
      "username": "string",
      "role": "USER|ADMIN"
  }
  ```

#### 2. Forgot Password
```
POST /public/forgot-password
```
- **Description:** Request password reset token
- **Body:**
  ```json
  {
      "email": "user@example.com"
  }
  ```
- **Response:** `200 OK` with reset token

#### 3. Register User
```
POST /users
```
- **Description:** Create a new user account
- **Body:**
  ```json
  {
      "username": "string",
      "email": "string",
      "password": "string",
      "name": "string",
      "role": "USER|ADMIN"
  }
  ```
- **Response:** `201 Created`

### User Management Endpoints (Authenticated)

#### 1. Get All Users (Admin Only)
```
GET /users
Authorization: Bearer {{jwtToken}}
```
- **Required Role:** ADMIN
- **Response:** `200 OK` - Array of users

#### 2. Get User by ID
```
GET /users/{id}
Authorization: Bearer {{jwtToken}}
```
- **Required Role:** Authenticated (Any user)
- **Response:** `200 OK` - User details

#### 3. Update User
```
PUT /users/{id}
Authorization: Bearer {{jwtToken}}
Content-Type: application/json
```
- **Required Role:** Authenticated
- **Body:**
  ```json
  {
      "name": "string",
      "email": "string"
  }
  ```
- **Response:** `200 OK`

#### 4. Change Password
```
POST /users/{id}/change-password
Authorization: Bearer {{jwtToken}}
Content-Type: application/json
```
- **Required Role:** Authenticated
- **Body:**
  ```json
  {
      "currentPassword": "string",
      "newPassword": "string",
      "confirmPassword": "string"
  }
  ```
- **Response:** `200 OK`

#### 5. Update User Status (Admin Only)
```
PUT /users/{id}/status
Authorization: Bearer {{jwtToken}}
Content-Type: application/json
```
- **Required Role:** ADMIN
- **Body:**
  ```json
  {
      "status": "ACTIVE|INACTIVE|VERIFICATION_PENDING|SUSPENDED|BANNED"
  }
  ```
- **Response:** `200 OK`

#### 6. Delete User (Admin Only)
```
DELETE /users/{id}
Authorization: Bearer {{jwtToken}}
```
- **Required Role:** ADMIN
- **Response:** `200 OK`

### Confession Endpoints (Authenticated)

#### 1. Get All Confessions
```
GET /confessions
Authorization: Bearer {{jwtToken}}
```
- **Required Role:** Authenticated
- **Response:** `200 OK` - Array of confessions

#### 2. Get Confession by ID
```
GET /confessions/{id}
Authorization: Bearer {{jwtToken}}
```
- **Required Role:** Authenticated
- **Response:** `200 OK` - Confession details

#### 3. Get Confessions by User
```
GET /confessions/user/{userId}
Authorization: Bearer {{jwtToken}}
```
- **Required Role:** Authenticated
- **Response:** `200 OK` - Array of user's confessions

#### 4. Create Confession
```
POST /confessions
Authorization: Bearer {{jwtToken}}
Content-Type: application/json
```
- **Required Role:** Authenticated
- **Body:**
  ```json
  {
      "confesion": "string",
      "anonymous": true|false,
      "userId": number
  }
  ```
- **Response:** `201 Created`

#### 5. Update Confession
```
PUT /confessions/{id}
Authorization: Bearer {{jwtToken}}
Content-Type: application/json
```
- **Required Role:** Authenticated
- **Body:**
  ```json
  {
      "confesion": "string",
      "anonymous": true|false
  }
  ```
- **Response:** `200 OK`

#### 6. Update Confession Status (Admin Only)
```
PUT /confessions/{id}/status
Authorization: Bearer {{jwtToken}}
Content-Type: application/json
```
- **Required Role:** ADMIN
- **Body:**
  ```json
  {
      "status": "DRAFT|ACTIVE|INACTIVE|INACTIVE_BY_ADMIN|BLOCKED_BY_ADMIN"
  }
  ```
- **Response:** `200 OK`

#### 7. Delete Confession
```
DELETE /confessions/{id}
Authorization: Bearer {{jwtToken}}
```
- **Required Role:** Authenticated
- **Response:** `200 OK`

## 🧪 Testing Workflow

### Complete Testing Scenario

#### Scenario 1: Regular User Workflow

1. **Register User**
   - Endpoint: `Create User (Register)`
   - Use username: `testuser1`
   - Expected: `201 Created`

2. **Sign In**
   - Endpoint: `Sign In`
   - Username: `testuser1`
   - Expected: `200 OK` with JWT token

3. **Create Confession**
   - Endpoint: `Create Confession`
   - Use userId: 1 (or the ID from registration)
   - Expected: `201 Created`

4. **Get All Confessions**
   - Endpoint: `Get All Confessions`
   - Expected: `200 OK` with array of confessions

5. **Update Confession**
   - Endpoint: `Update Confession`
   - Modify the confession text
   - Expected: `200 OK`

6. **Delete Confession**
   - Endpoint: `Delete Confession`
   - Expected: `200 OK` with success message

#### Scenario 2: Admin Workflow

1. **Sign In as Admin**
   - Username: `admin_user` (must have ADMIN role)
   - Expected: `200 OK` with JWT token

2. **Get All Users**
   - Endpoint: `Get All Users (Admin Only)`
   - Expected: `200 OK` with all users

3. **Update User Status**
   - Endpoint: `Update User Status (Admin Only)`
   - Change status to: `ACTIVE`
   - Expected: `200 OK`

4. **Update Confession Status**
   - Endpoint: `Update Confession Status (Admin Only)`
   - Change status to: `ACTIVE`
   - Expected: `200 OK`

5. **Delete User**
   - Endpoint: `Delete User (Admin Only)`
   - Expected: `200 OK` with success message

## 🔐 Authentication

### How Authorization Works

1. **Public Endpoints:** No token needed
   - `/public/signin`
   - `/public/forgot-password`
   - `POST /users`

2. **User Endpoints:** JWT token required
   - `GET /users/{id}` - Any authenticated user
   - `PUT /users/{id}` - Any authenticated user
   - `GET /users` - ADMIN only
   - `PUT /users/{id}/status` - ADMIN only
   - `DELETE /users/{id}` - ADMIN only

3. **Confession Endpoints:** JWT token required
   - Most endpoints - Any authenticated user
   - `PUT /confessions/{id}/status` - ADMIN only

### Adding JWT Token to Requests

**Automatic (Recommended):**
- The collection has a test script on the Sign In endpoint
- After successful login, JWT token is auto-saved to `{{jwtToken}}`
- All other requests automatically use this token

**Manual:**
1. Sign in and copy the `jwtToken` from response
2. Click on the request
3. Go to **Headers** tab
4. Ensure header exists: `Authorization: Bearer {{jwtToken}}`

## 🐛 Troubleshooting

### Error: 403 Forbidden

**Possible Causes:**
1. JWT token is invalid or expired
2. User role doesn't match required role (e.g., USER trying to access ADMIN endpoint)
3. Authorization header is missing

**Solution:**
1. Sign in again to get a fresh JWT token
2. Check if your user has ADMIN role
3. Verify Authorization header is present in the request

### Error: 401 Unauthorized

**Possible Causes:**
1. No JWT token provided
2. JWT token is malformed
3. Token has expired

**Solution:**
1. Click on environment variables (top-right corner)
2. Verify `jwtToken` has a value
3. Sign in again to refresh the token

### Error: 404 Not Found

**Possible Causes:**
1. Wrong endpoint URL
2. Resource ID doesn't exist
3. API is not running

**Solution:**
1. Verify the endpoint URL matches the API
2. Check if the ID exists (try getting list first)
3. Ensure the application is running on `http://localhost:8080`

### Error: 400 Bad Request

**Possible Causes:**
1. Missing required fields in request body
2. Invalid field values
3. Validation constraints failed

**Solution:**
1. Check request body format
2. Review field validation rules
3. Ensure all required fields are present

## 💾 Exporting Results

### Export Collection

1. Right-click on collection name in left sidebar
2. Select **"Export"**
3. Choose **"Collection v2.1"** format
4. Click **"Export"**
5. Save the JSON file

### Export Environment Variables

1. Click **Environment** icon (gear icon) in top-right
2. Select your environment
3. Click **Export** button
4. Save the JSON file

### Generate API Documentation

1. Right-click on collection
2. Select **"View Documentation"**
3. Postman generates beautiful API docs
4. Click **Export** to download as HTML

## 📝 Notes

- **Base URL:** All requests use `{{baseUrl}}` variable which defaults to `http://localhost:8080/confession-box`
- **JWT Token:** Auto-populated after successful login from the Sign In endpoint
- **Role-Based Access:** Ensure user has appropriate role (USER or ADMIN) for specific endpoints
- **CORS:** If running on different ports, configure CORS in Spring Security

## 🔗 Quick Links

- **API Documentation:** Generated from collection
- **Collection File:** `Confession-Box-API.postman_collection.json`
- **Application Repository:** `/Users/himanshumitttal/eclipse-workspace/confession-box/`

## ✅ Verification Checklist

- [ ] Postman is installed and running
- [ ] Collection is imported successfully
- [ ] `baseUrl` environment variable is set correctly
- [ ] Application is running on `http://localhost:8080`
- [ ] Can successfully sign in and receive JWT token
- [ ] JWT token is auto-populated in subsequent requests
- [ ] Can access protected endpoints with valid token
- [ ] Getting 403 Forbidden when accessing admin endpoints as regular user

---

**Last Updated:** May 5, 2026

For issues or questions, refer to the API controller implementations or Spring Security configuration.
