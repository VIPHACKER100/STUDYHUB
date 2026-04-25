# StudyHub
## Project Status: Phase 3 Complete (Advanced Features) ✅

This project was generated as a foundational implementation combining file sharing, real-time messaging, and anonymous collaboration features for educational use.

---

## 🎯 What's Been Built (Phase 1 MVP)

### ✅ Backend Infrastructure  
- **Express Server** with Socket.io integration
- **PostgreSQL Database** with 20+ tables (users, messages, rooms, uploads, etc.)
- **JWT Authentication** system with role-based access control
- **Direct Messaging API** - Full CRUD operations for private conversations
- **Anonymous Chat Rooms API** - Create, join, manage study rooms
- **Real-time WebSocket** handlers for live messaging
- **Database Setup Script** - Auto-creates all tables with initial admin user

### ✅ Frontend Application
- **React 18** with Vite and TailwindCSS
- **Authentication Pages** - Modern login and registration UI
- **Protected Routing** - Auth guards for secure pages
- **Dashboard** - Feature overview and navigation
- **State Management** - Zustand stores for auth and messaging
- **Socket.io Client** - Ready for real-time features
- **API Integration** - Axios client with JWT interceptors

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 3. Create and setup database
createdb notes_platform
cd server && npm run db:setup

# 4. Start development
cd ..
npm run dev
```

**Default Admin Login:**
- Email: `admin@notesplatform.com`
- Password: `admin123` (⚠️ Change in production!)

Visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📋 Implementation Roadmap

### Phase 1STATUS: ✅ **COMPLETE**
- ✅ Project structure and configuration
- ✅ Database schema (20+ tables)
- ✅ User authentication with JWT
- ✅ Direct messaging backend
- ✅ Anonymous rooms backend
- ✅ Real-time Socket.io setup
- ✅ Frontend auth flow

### Phase 2: Content Features (Next Priority)
Implementation order for continuing development:

1. **File Upload System** 🔄
   - Implement `server/src/middleware/upload.js` using Multer
   - Create `server/src/controllers/uploadController.js`
   - Add routes for uploading notes/assignments
   - Integrate AWS S3 or local storage

2. **Messaging UI Components** 🔄
   - Build `ConversationSidebar.jsx` component
   - Create `ChatArea.jsx` with message list
   - Implement `MessageBubble.jsx` and `MessageInput.jsx`
   - Connect to Socket.io for real-time updates

3. **Anonymous Rooms UI** 🔄
   - Create room list component
   - Build room creation modal
   - Implement real-time chat interface
   - Add participant list

### Phase 3: Advanced Features
- ✅ Notifications system (Phase 3C)
- ✅ Advanced Search functionality (Phase 3D)
- ✅ Email Digest System (Phase 3C Extra)
- ✅ Ratings and comments (Phase 3E)
- [ ] Admin panel UI
- [ ] File attachments in messages
- [ ] User profiles
- [ ] Email verification

---

## 🏗️ Architecture Overview

```
Project Structure:
├── server/              Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/     DB & Socket configuration
│   │   ├── models/     Data models (User, Message, Room)
│   │   ├── controllers/ Business logic
│   │   ├── routes/     API endpoints
│   │   ├── socket/     Real-time handlers
│   │   └── middleware/ Auth, validation, upload
│   └── package.json
│
├── client/             Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/      Route components
│   │   ├── stores/     Zustand state management
│   │   ├── services/   API & Socket clients
│   │   └── components/ Reusable UI components (TBD)
│   └── package.json
│
└── package.json        Root workspace config
```

**Tech Stack:**
- Backend: Node.js, Express, PostgreSQL, Socket.io, JWT
- Frontend: React 18, Vite, TailwindCSS, Zustand, React Query
- Real-time: Socket.io (WebSockets)
- Database: PostgreSQL 14+

---

## 📚 Available Documentation

- **README.md** - Project overview and features  
- **SETUP.md** - Detailed installation guide  
- **implementation_plan.md** - Full technical specification
- **task.md** - Development task checklist

---

## 🔑 Key Files to Know

**Backend Entry Points:**
- `server/src/index.js` - Express server with Socket.io
- `server/src/database/schema.sql` - Complete database schema
- `server/src/models/` - User, Message, Room models

**Frontend Entry Points:**
- `client/src/main.jsx` - React app entry
- `client/src/App.jsx` - Routing and auth logic
- `client/src/stores/authStore.js` - Authentication state
- `client/src/stores/messageStore.js` - Messaging state

**Configuration:**
- `.env` - Environment variables (create from `.env.example`)
- `package.json` (root) - Workspace configuration
- `client/vite.config.js` - Frontend build config

---

## 🛠️ Development Commands

```bash
# Install all dependencies
npm install

# Start both servers (concurrent)
npm run dev

# Start backend only
npm run server:dev

# Start frontend only
npm run client:dev

# Database setup/reset
cd server
npm run db:setup

# Build frontend for production
cd client
npm run build
```

---

## 🎓 Next Steps for Developers

1. **Review the Code**
   - Explore `server/src/` for backend logic
   - Check `client/src/pages/` for UI components
   - Read `implementation_plan.md` for full spec

2. **Test Existing Features**
   - Register accounts with different roles
   - Test login/logout flow
   - Check API endpoints in browser/Postman

3. **Continue Implementation**
   - Pick tasks from `task.md`
   - Start with messaging UI (high priority)
   - Or implement file upload system

4. **Customize & Extend**
   - Add more user fields
   - Implement email verification
   - Build admin dashboard
   - Add notification system

---

## 📝 Database Schema Highlights

20+ tables including:
- `users` - Role-based (admin/teacher/student)
- `uploads` - Notes & assignments with metadata
- `direct_conversations` & `direct_messages` - Private messaging
- `anonymous_rooms` & `anonymous_messages` - Study groups
- `notifications` - Unified notification system
- `reports` - Content moderation
- `bookmarks`, `ratings`, `downloads` - User engagement

---

## 🔐 Security Features

- JWT authentication with secure token storage
- Bcrypt password hashing (10 rounds)
- Role-based authorization middleware
- CORS protection
- Helmet security headers
- Input validation (express-validator)
- SQL injection prevention (parameterized queries)
- Socket.io authentication

---

## 🐛 Known Limitations / TODOs

- [ ] Email service not yet configured (verification emails)
- [ ] File upload routes created but implementation pending
- [ ] Messaging UI is placeholder (needs full chat component)
- [ ] Anonymous room UI not built yet
- [ ] Admin panel backend ready, UI pending
- [ ] No tests written yet (consider adding Jest/Vitest)
- [ ] Rate limiting configured but may need tuning
- [ ] No caching layer (Redis planned but not implemented)

---

## 💡 Tips for Contributing

1. **Follow the existing patterns:**
   - Controllers handle business logic
   - Models handle database operations
   - Routes define endpoints
   - Middleware for cross-cutting concerns

2. **Keep components small:**
   - Break down complex UI into reusable pieces
   - Use Zustand for global state
   - React Query for server state

3. **Test thoroughly:**
   - Test API endpoints with Postman or similar
   - Verify database changes in psql
   - Check real-time features with multiple browser windows

4. **Update documentation:**
   - Update task.md when completing items
   - Add comments to complex logic
   - Document new API endpoints

---

##⚡ Quick Reference

**API Base URL:** `http://localhost:5000/api`

**Key Endpoints:**
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `GET /messages/conversations` - Get chats
- `POST /rooms` - Create anonymous room
- `GET /rooms` - List active rooms

**Socket Events:**
- `join_conversation` - Join chat
- `send_message` - Send message
- `join_room` - Join anonymous room
- `room_message` - Send to room

---

## 🙏 Credits

This is an AI-generated educational project template demonstrating modern full-stack development with real-time features.

**Technologies used:**
- React, Node.js, Express, PostgreSQL
- Socket.io for WebSockets
- TailwindCSS for styling
- Zustand for state management

---

**Status:** MVP Complete | **Next:** Implement messaging UI and file uploads  
**License:** MIT | **Contributions:** Welcome!

For detailed setup instructions, see **SETUP.md**.  
For technical specification, see **implementation_plan.md**.
