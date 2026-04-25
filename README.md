# StudyHub - Notes & Assignment Sharing Platform

A comprehensive educational platform combining file sharing (notes/assignments), real-time messaging, anonymous study rooms, and collaborative learning features.

## 🚀 Features

### Core Platform
- **User Authentication** - Role-based access (Admin, Teacher, Student)
- **Notes & Assignment Sharing** - Upload and share educational content
- **Search & Discovery** - Find relevant study materials
- **Ratings & Comments** - Community feedback on uploads
- **Bookmarking** - Save favorite resources

### Messaging System
- **Direct Messages** - Private one-on-one messaging with real-time delivery
- **Anonymous Chat Rooms** - Subject-specific study groups with random anonymous identities
- **Real-time Features** - Typing indicators, read receipts, online status
- **File Sharing** - Share documents and images in conversations
- **Message Management** - Edit, delete, and search messages

### Admin Features
- **User Management** - View, edit, and manage user accounts
- **Content Moderation** - Monitor and moderate uploads and messages
- **Analytics Dashboard** - Platform usage statistics
- **Announcements** - Platform-wide and targeted announcements
- **Report System** - Handle user reports and content takedowns

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **PostgreSQL** - Database
- **Socket.io** - Real-time WebSocket communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Zustand** - State management
- **React Query** - Data fetching
- **Socket.io Client** - Real-time messaging

## 📋 Prerequisites

- **Node.js** >= 18.x
- **Database**: PostgreSQL >= 14.x OR MySQL >= 8.0
- **npm** or **yarn**

> **Note:** The application supports both PostgreSQL and MySQL. See [MYSQL_SETUP.md](./MYSQL_SETUP.md) for MySQL migration guide.

## 🏃 Quick Start

See the [Documentation Index](./docs/INDEX.md) for detailed installation instructions.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 3. Create database
createdb notes_platform

# 4. Run database setup
cd server
npm run db:setup

# 5. Start development servers
cd ..
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 📚 Documentation

Detailed documentation is available in the [docs/](./docs/) directory:

- [**Documentation Index**](./docs/INDEX.md) ⬅️ **Start Here**
- [**Memory Map**](./docs/project/PROJECT_MEMORY_MAP.md) - Conceptual architecture overview.
- [**Future Roadmap**](./docs/project/FUTURE_ROADMAP.md) - Planned features and updates.
- [Setup Guide](./docs/setup/SETUP.md) - Detailed installation instructions.
- [API Reference](./docs/api/API_DOCUMENTATION.md) - Complete API documentation.
- [Database Guide](./docs/db/MYSQL_SETUP.md) - Database configuration and MySQL migration.

## 🔑 Default Admin Access


After running the database setup, you can login with:
- **Email**: `admin@notesplatform.com`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change this password immediately in production!

## 📁 Project Structure

```
notes-assignment-platform/
├── client/                 # Frontend React app
├── server/                 # Backend Node.js app
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── socket/        # Socket.io handlers
│   │   └── database/      # Database schema & setup
│   └── package.json
├── package.json           # Root workspace config
└── README.md
```

## 🌟 Key Features Implementation Status

### ✅ Completed (Phase 1, 2, 3)
- [x] Project setup with monorepo structure
- [x] PostgreSQL database with comprehensive schema
- [x] User authentication (register, login, JWT)
- [x] Direct messaging API & UI
- [x] Anonymous chat rooms API & UI
- [x] Socket.io real-time messaging
- [x] File upload system (AWS S3 / Local)
- [x] Search functionality with filters
- [x] Ratings and comments system
- [x] Admin panel UI & Content Management
- [x] Email verification & Password Reset
- [x] User profiles and bookmarks
- [x] File attachments in messages
- [x] Privacy & Security (Blocking, Rate Limiting)

### 🚧 Future Enhancements
- [ ] Notifications system (UI integration)
- [ ] Mobile optimization
- [ ] Redis Caching

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password
- `GET /api/auth/search` - Search users

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:userId` - Get/create conversation
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages/send` - Send message
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

### Anonymous Rooms
- `GET /api/rooms` - Get public rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:roomId` - Get room details
- `POST /api/rooms/:roomId/join` - Join room
- `POST /api/rooms/:roomId/leave` - Leave room
- `GET /api/rooms/:roomId/messages` - Get room messages

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## 🤝 Contributing

This is an educational project. Contributions are welcome!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

Built with modern web technologies for educational collaboration and learning.
