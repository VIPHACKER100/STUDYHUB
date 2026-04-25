# StudyHub

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-14%2B-blue.svg)
![Version](https://img.shields.io/badge/version-1.1.0-orange.svg)

> **StudyHub** - A comprehensive educational collaboration platform combining file sharing, real-time messaging, anonymous study rooms, and community features.

[Live Demo](#) | [Documentation](../../README.md) | [Contributing](../CONTRIBUTING.md) | [Security](../SECURITY.md)

---

## 🌟 Features

### 🔐 Authentication & Security
- Secure JWT-based authentication
- Email verification system
- Password reset flow
- Role-based access control (Admin, Teacher, Student)
- User blocking functionality
- Comprehensive rate limiting

### 📚 File Sharing
- Upload notes and assignments (up to 50MB)
- Privacy controls (public, private, unlisted)
- Advanced search and filtering
- Ratings and comments (1-5 stars)
- Bookmark system
- Download tracking

### 💬 Real-Time Messaging
- Direct one-on-one messaging
- File attachments in messages
- Read receipts and typing indicators
- Online/offline status
- Message editing and deletion

### 🎭 Anonymous Study Rooms
- Subject-specific study rooms
- Random anonymous identities
- Real-time group chat
- Automatic room expiration

### 👨‍💼 Admin Dashboard
- User management
- Content moderation
- Platform analytics
- Announcement system
- Report handling

### 🏆 Gamification
- Global Leaderboards
- Badge Achievement System
- Achievement Showcase

### 🧠 Intelligence
- AI Content Recommendations
- Smart PDF Summarization
- Global Trending Logic

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/viphacker100/studyhub.git
cd studyhub

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
cd server
npm run db:setup

# Start development servers
cd ..
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

**Default Admin:**
- Email: `admin@notesplatform.com`
- Password: `admin123`
- ⚠️ **Change immediately after first login!**

## 📚 Documentation

- [📖 README](../../README.md) - Project overview
- [⚙️ SETUP](../setup/SETUP.md) - Detailed setup guide
- [🚀 DEPLOYMENT](../deploy/DEPLOYMENT.md) - Production deployment
- [📋 API DOCS](../api/API_DOCUMENTATION.md) - API reference
- [🤝 CONTRIBUTING](../CONTRIBUTING.md) - Contribution guidelines
- [🔒 SECURITY](../SECURITY.md) - Security policy
- [📝 CHANGELOG](./CHANGELOG.md) - Version history
- [🎨 BRAND GUIDELINES](../branding/BRAND_GUIDELINES.html) - Visual guidelines
- [⚡ QUICK REFERENCE](./QUICK_REFERENCE.md) - Developer quick ref

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks
- Vite (Build tool)
- TailwindCSS (Styling)
- Zustand (State management)
- React Query (Data fetching)
- Socket.io Client (Real-time)

**Backend:**
- Node.js + Express
- PostgreSQL (Database)
- Socket.io (Real-time)
- JWT (Authentication)
- Nodemailer (Email)
- Multer (File uploads)

**Security:**
- bcrypt (Password hashing)
- Helmet (Security headers)
- express-rate-limit (Rate limiting)
- express-validator (Input validation)

## 📊 Project Stats

- **25+ Database Tables**
- **60+ API Endpoints**
- **20,000+ Lines of Code**
- **Phase 5 Complete** ✅
- **Intelligence Layer Active** 🧠

## 🎯 Use Cases

- **Students**: Share notes, collaborate on assignments, join study groups
- **Teachers**: Distribute materials, communicate with students, manage content
- **Study Groups**: Anonymous collaboration, real-time discussions
- **Institutions**: Centralized platform for educational content sharing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔐 Security

Security is a top priority. Please review our [Security Policy](./SECURITY.md) for:
- Vulnerability reporting
- Security best practices
- Deployment checklist

**Found a security issue?** Please email security@studyhub.com instead of opening a public issue.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for educational collaboration
- Inspired by the need for better student collaboration tools
- Thanks to all contributors and the open-source community

## 📞 Support

- **Documentation**: Check the docs folder
- **Issues**: [GitHub Issues](https://github.com/viphacker100/studyhub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/viphacker100/studyhub/discussions)

## 🗺️ Roadmap

### v1.2.0 (Planned)
- [ ] Mobile app (React Native)
- [ ] Video study rooms (WebRTC)
- [ ] AI Tutor integration (RAG)

### v2.0.0 (Future)
- [ ] Shared study calendars
- [ ] Plagiarism detection
- [ ] Collaborative document editing

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ for education**

**Version**: 1.1.0 | **Status**: Intelligence Layer Active ✅

[⬆ Back to top](#studyhub)
