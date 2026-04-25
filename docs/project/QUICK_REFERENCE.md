# StudyHub - Quick Reference

## 🚀 Quick Commands

### Development

```bash
# Install all dependencies
npm install

# Start both client and server
npm run dev

# Start server only
npm run server:dev

# Start client only
npm run client:dev
```

### Database

```bash
cd server

# Setup database (creates tables and admin user)
npm run db:setup

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### Testing

```bash
cd server

# Run all tests
npm test

# Run specific test file
npm test -- src/tests/health.test.js
```

### Production

```bash
# Build client
cd client
npm run build

# Start server in production
cd ../server
NODE_ENV=production npm start
```

## 📋 Default Credentials

**Admin Account**

- Email: `viphacker.100.org@gmail.com`
- Password: `admin123`
- ⚠️ **CHANGE IMMEDIATELY AFTER FIRST LOGIN**

## 🔗 Important URLs

### Development

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5000>
- Health Check: <http://localhost:5000/api/health>

### API Endpoints

- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Uploads: `/api/uploads/*`
- Messages: `/api/messages/*`
- Rooms: `/api/rooms/*`
- Admin: `/api/admin/*`
- Leaderboard: `/api/leaderboard/*`
- Recommendations: `/api/recommendations/*`
- AI Features: `/api/ai/*`

## 🎯 Common Tasks

### Create New User

```bash
POST /api/auth/register
{
  "username": "aryan",
  "email": "viphacker.100.org@gmail.com",
  "password": "password123",
  "fullName": "Aryan Ahirwar",
  "role": "student"
}
```

### Upload File

```bash
POST /api/uploads
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: {
  file: <file>,
  title: "My Notes",
  description: "Chapter 1 notes",
  subject: "Mathematics",
  type: "notes",
  privacy: "public"
}
```

### AI Summary

```bash
POST /api/ai/summarize/:id
Headers: Authorization: Bearer <token>
Returns: { "summary": "...markdown..." }
```

### Get Recommendations

```bash
GET /api/recommendations
Headers: Authorization: Bearer <token>
Returns: [ { "id": 1, "title": "...", ... } ]
```

## 🔧 Environment Variables

### Required

```env
PORT=5000
DB_HOST=localhost
DB_NAME=studyhub_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Optional

```env
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=viphacker.100.org@gmail.com
SMTP_PASSWORD=your-password
EMAIL_FROM="StudyHub <viphacker.100.org@gmail.com>"

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# Redis (Required for Performance)
REDIS_HOST=localhost
REDIS_PORT=6379

# Google Gemini AI (Required for Summaries)
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d studyhub_db
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Email Not Sending

- Check SMTP credentials in `.env`
- Verify firewall allows port 587
- For Gmail, use App Password instead of regular password

## 📊 Project Structure

```
studyhub/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── stores/      # State management
│   │   └── lib/         # API clients
│   └── package.json
├── server/              # Node.js backend
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   └── services/    # Business logic
│   └── package.json
└── package.json         # Root workspace
```

## 🎨 Key Features

- ✅ User authentication & authorization
- ✅ File upload & sharing
- ✅ Real-time messaging
- ✅ Anonymous study rooms
- ✅ Ratings & comments
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ User profiles
- ✅ Search & filtering
- ✅ AI Recommendations
- ✅ Smart PDF Summarization
- ✅ Global Leaderboards
- ✅ Achievement Badges
- ✅ PWA Support
- ✅ Premium Glassmorphism UI (v1.5.0)
- ✅ Mock Database Mode (v1.5.0)

## 📞 Support

- Documentation: Check all `.md` files in root
- Issues: GitHub Issues
- Security: See SECURITY.md

## 📄 License

MIT License - See LICENSE file

---

**Version**: 1.5.0  
**Last Updated**: April 26, 2026
