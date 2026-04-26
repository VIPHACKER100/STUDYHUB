# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register
`POST /auth/register`
- Body: `{ username, email, password, fullName, role }`
- Returns: `{ data: { user, token }, success, message }`
- Rate Limit: 20 req / 15 min

### Login
`POST /auth/login`
- Body: `{ identifier, password }` (identifier can be email or username)
- Returns: `{ data: { user, token }, success, message }`
- Rate Limit: 20 req / 15 min

### Get Current User
`GET /auth/me`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

### Verify Email
`POST /auth/verify-email`
- Body: `{ token }`
- Rate Limit: 20 req / 15 min

### Forgot Password
`POST /auth/forgot-password`
- Body: `{ email }`
- Rate Limit: 20 req / 15 min

### Reset Password
`POST /auth/reset-password`
- Body: `{ token, newPassword }`
- Rate Limit: 20 req / 15 min

---

## Users

### Get User Profile (Public)
`GET /users/:username`
- Returns: Public user info (username, bio, join date, verify status)

### Get User Uploads
`GET /users/:username/uploads`
- Query: `?page=1&limit=10`
- Returns: Public uploads by user

---

## Uploads

### Upload File
`POST /uploads`
- Headers: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- Body: `file`, `title`, `description`, `subject`, `type`, `tags`
- Rate Limit: 100 req / hour

### Get All Uploads
`GET /uploads`
- Query: `?page=1&limit=20&search=keyword&type=notes&subject=math`

### Get Single Upload
`GET /uploads/:id`

### Rate Upload
`POST /uploads/:id/rate`
- Body: `{ rating, comment }`

### Delete Upload (Admin/Owner)
`DELETE /uploads/:id`
- Soft deletes the file

---

## Messages

### Get Conversations
`GET /messages/conversations`

### Send Message
`POST /messages/send`
- Body: `{ receiverId, content, attachmentUrl, attachmentType }`

### Upload Attachment
`POST /messages/upload`
- Body: `file`
- Rate Limit: 100 req / hour

---

## Admin

### Get Dashboard Stats
`GET /admin/stats`

### Get Uploads (Management)
`GET /admin/uploads`
- Query: `?page=1&search=keyword&type=notes`

### Delete Upload (Admin)
`DELETE /admin/uploads/:id`

### Get Analytics Trends
`GET /admin/trends`
- Returns: `{ labels: [], users: [], uploads: [] }`
- Period: Last 7 days
- Cache: 1 hour

---

## Leaderboards

### Get Rankings
`GET /leaderboard`
- Returns: `{ topContributors, topLearners, userRank }`
- Includes badges and rank metrics.

---

## Recommendations

### Get Personalized Recommendations
`GET /recommendations`
- Headers: `Authorization: Bearer <token>`
- Returns: Top 6 suggestions based on user download history.

### Get Trending Content
`GET /recommendations/trending`
- Returns: Top 10 globally popular items.

---

## AI Features

### Generate Smart Summary
`POST /ai/summarize/:uploadId`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ summary }` (Markdown format)
- Requires: PDF or Text document.


