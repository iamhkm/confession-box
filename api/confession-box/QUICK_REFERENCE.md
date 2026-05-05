# Confession Box API - Quick Reference Card

## 📍 Base URL
```
http://localhost:8080/confession-box
```

## 🔐 Authentication
- Header: `Authorization: Bearer <JWT_TOKEN>`
- Get token from: `POST /public/signin`

---

## 📋 Endpoints Summary

### 🔓 PUBLIC ENDPOINTS (No Auth)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/public/signin` | Login & get JWT token |
| POST | `/public/forgot-password` | Request password reset |
| POST | `/users` | Register new account |

---

### 👥 USER MANAGEMENT (Authenticated)

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| GET | `/users` | ADMIN | List all users |
| GET | `/users/{id}` | User | Get user details |
| PUT | `/users/{id}` | User | Update profile |
| POST | `/users/{id}/change-password` | User | Change password |
| PUT | `/users/{id}/status` | ADMIN | Update user status |
| DELETE | `/users/{id}` | ADMIN | Delete user |

**User Status Values:**
```
ACTIVE, INACTIVE, VERIFICATION_PENDING, SUSPENDED, BANNED
```

---

### 📝 CONFESSIONS (Authenticated)

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| GET | `/confessions` | User | Get all confessions |
| GET | `/confessions/{id}` | User | Get specific confession |
| GET | `/confessions/user/{userId}` | User | Get user's confessions |
| POST | `/confessions` | User | Create confession |
| PUT | `/confessions/{id}` | User | Update confession |
| PUT | `/confessions/{id}/status` | ADMIN | Change confession status |
| DELETE | `/confessions/{id}` | User | Delete confession |

**Confession Status Values:**
```
DRAFT, ACTIVE, INACTIVE, INACTIVE_BY_ADMIN, BLOCKED_BY_ADMIN
```

---

## 🧪 Quick Test Flow

### 1️⃣ Create User
```bash
POST /users
Body: {
  "username": "testuser",
  "email": "test@example.com",
  "password": "pass123",
  "name": "Test User",
  "role": "USER"
}
Response: 201 Created
```

### 2️⃣ Sign In
```bash
POST /public/signin
Body: {
  "username": "testuser",
  "password": "pass123"
}
Response: 200 OK
{
  "jwtToken": "eyJhbGci...",
  "username": "testuser",
  "role": "USER"
}
```

### 3️⃣ Use Token
```bash
Authorization: Bearer eyJhbGci...
```

### 4️⃣ Create Confession
```bash
POST /confessions
Headers: Authorization: Bearer <token>
Body: {
  "confesion": "My confession text",
  "anonymous": true,
  "userId": 1
}
Response: 201 Created
```

### 5️⃣ Get Confessions
```bash
GET /confessions
Headers: Authorization: Bearer <token>
Response: 200 OK
[
  {
    "id": 1,
    "confesion": "My confession text",
    "anonymous": true,
    "status": "DRAFT",
    "userId": 1,
    "username": "testuser",
    "createdAt": "2026-05-05T10:00:00",
    "updatedAt": "2026-05-05T10:00:00"
  }
]
```

---

## 📨 Request/Response Examples

### Sign In Response
```json
{
  "jwtToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsInVzZXJJZCI6MSwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MTcwNDE1MzYwMH0...",
  "username": "testuser",
  "role": "USER"
}
```

### Confession Response
```json
{
  "id": 1,
  "confesion": "This is my confession",
  "anonymous": true,
  "status": "DRAFT",
  "userId": 1,
  "username": "testuser",
  "createdAt": "2026-05-05T10:00:00",
  "updatedAt": "2026-05-05T10:00:00"
}
```

### User Response
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "name": "Test User",
  "role": "USER",
  "status": "ACTIVE",
  "createdAt": "2026-05-05T10:00:00",
  "updatedAt": "2026-05-05T10:00:00"
}
```

---

## ❌ Error Codes

| Code | Meaning | Cause |
|------|---------|-------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or missing fields |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions/wrong role |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## 🔒 Role Matrix

| Endpoint | NONE | USER | ADMIN |
|----------|------|------|-------|
| POST /public/signin | ✓ | ✓ | ✓ |
| POST /public/forgot-password | ✓ | ✓ | ✓ |
| POST /users | ✓ | ✓ | ✓ |
| GET /users | ✗ | ✗ | ✓ |
| GET /users/{id} | ✗ | ✓ | ✓ |
| PUT /users/{id} | ✗ | ✓ | ✓ |
| POST /users/{id}/change-password | ✗ | ✓ | ✓ |
| PUT /users/{id}/status | ✗ | ✗ | ✓ |
| DELETE /users/{id} | ✗ | ✗ | ✓ |
| GET /confessions | ✗ | ✓ | ✓ |
| GET /confessions/{id} | ✗ | ✓ | ✓ |
| POST /confessions | ✗ | ✓ | ✓ |
| PUT /confessions/{id} | ✗ | ✓ | ✓ |
| PUT /confessions/{id}/status | ✗ | ✗ | ✓ |
| DELETE /confessions/{id} | ✗ | ✓ | ✓ |

---

## 🔑 Common Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

---

## 💡 Tips

1. **Auto-save JWT:** The Sign In request automatically saves the token
2. **Use variables:** Always use `{{jwtToken}}` and `{{baseUrl}}` variables
3. **Test one role at a time:** Create USER and ADMIN test accounts
4. **Check response code:** Verify 200/201 before using response data
5. **Inspect token:** Paste JWT at [jwt.io](https://jwt.io) to see claims

---

## 🐛 Debugging

### Token not working?
- Sign in again
- Verify `Authorization: Bearer` format
- Check token isn't expired (24 hour expiration)

### Getting 403 Forbidden?
- Verify user role matches endpoint requirement
- Admin endpoints require ADMIN role
- Regular endpoints require any authenticated user

### Getting 400 Bad Request?
- Check all required fields are present
- Verify field format and values
- Review validation constraints

---

## 📎 Collection File
```
Confession-Box-API.postman_collection.json
```

**Import Steps:**
1. Open Postman
2. Click "Import"
3. Select the JSON file
4. Click "Import"
5. Select environment and start testing!

---

**Last Updated:** May 5, 2026
