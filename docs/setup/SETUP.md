# Setup Guide - Notes & Assignment Platform

Complete step-by-step instructions to set up the project locally.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Verify installation: `psql --version`

3. **Redis** (optional but recommended for performance)
   - Download from: https://redis.io/download/ (or use Docker)
   - Verify installation: `redis-cli ping`

4. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

## Step 1: Clone or Download Project

If you have Git:
```bash
git clone https://github.com/VIPHACKER100/STUDYHUB.git
cd STUDYHUB
```

Or download  and extract the ZIP file, then navigate to the folder.

## Step 2: Install Dependencies

Install all dependencies for both server and client:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

## Step 3: PostgreSQL Database Setup

### Create Database

Using PostgreSQL command line or GUI tool (pgAdmin):

```bash
# Option 1: Using psql command line
psql -U postgres
CREATE DATABASE studyhub_db;
\q

# Option 2: Using createdb command
createdb -U postgres studyhub_db
```

### Verify Database Created

```bash
psql -U postgres -l
# Should see 'studyhub_db' in the list
```

## Step 4: Environment Configuration

### Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### Edit .env File

Open `.env` in a text editor and configure the following:

```env
# REQUIRED - Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studyhub_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# REQUIRED - JWT Secret (change this!)
JWT_SECRET=your_secure_random_string_here_minimum_32_characters

# Optional - Performance & AI
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI (Required for Smart Summaries)
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important**:
- Replace `DB_PASSWORD` with your actual PostgreSQL password
- Replace `JWT_SECRET` with a secure random string (use a password generator)

## Step 5: Initialize Database

Run the database setup script to create all tables:

```bash
cd server
npm run db:setup
```

You should see output like:
```
🚀 Starting database setup...
✅ Database setup completed successfully!
...
🔐 Default admin credentials:
   Email: admin@notesplatform.com
   Password: admin123
```

**⚠️ SECURITY NOTE**: Change the admin password after first login in production!

## Step 6: Start Development Servers

### Option 1: Start Both Servers Together (Recommended)

From the root directory:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:5173

### Option 2: Start Servers Separately

**Terminal 1** - Backend:
```bash
cd server
npm run dev
```

**Terminal 2** - Frontend:
```bash
cd client
npm run dev
```

## Step 7: Verify Installation

1. **Check Backend Health**:
   - Open browser to: http://localhost:5000/api/health
   - Should see: `{"success":true,"message":"Server is running"...}`

2. **Access Frontend**:
   - Open browser to: http://localhost:5173
   - Should see the login page

3. **Test Login**:
   - Email: `admin@notesplatform.com`
   - Password: `admin123`
   - Should redirect to dashboard

## Troubleshooting

### Database Connection Errors

**Error**: "password authentication failed for user"
- **Solution**: Check your PostgreSQL password in `.env` file
- Verify password with: `psql -U postgres -W`

**Error**: "database "studyhub_db" does not exist"
- **Solution**: Create the database first (see Step 3)

**Error**: "relation "users" does not exist"
- **Solution**: Run database setup: `npm run db:setup` in server folder

### Port Already in Use

**Error**: "Port 5000 is already in use"
- **Solution 1**: Stop the process using port 5000
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -ti:5000 | xargs kill`
- **Solution 2**: Change `PORT` in `.env` to different number (e.g., 5001)

**Error**: "Port 5173 is already in use"
- **Solution**: Vite will automatically try next available port (5174, 5175, etc.)

### Node Modules Issues

**Error**: Module not found or package errors
- **Solution**: Delete node_modules and reinstall
  ```bash
  # In root directory
  rm -rf node_modules package-lock.json
  rm -rf server/node_modules server/package-lock.json
  rm -rf client/node_modules client/package-lock.json
  npm install
  cd server && npm install
  cd ../client && npm install
  ```

### Socket.io Connection Issues

**Error**: "Socket connection error" in browser console
- **Solution 1**: Ensure backend server is running
- **Solution 2**: Check CORS settings in `.env`:
  ```env
  CLIENT_URL=http://localhost:5173
  SOCKET_CORS_ORIGIN=http://localhost:5173
  ```

## Next Steps

1. **Change Admin Password**:
   - Login with default credentials
   - Go to Profile Settings
   - Change password

2. **Create Test Accounts**:
   - Register as a student
   - Register as a teacher
   - Test different role permissions

3. **Explore Features**:
   - Try direct messaging (when UI is complete)
   - Create anonymous chat rooms
   - Upload notes (when implemented)

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes to React files auto-refresh browser
- **Backend**: Nodemon auto-restarts server on file changes

### Database Changes

If you modify the schema:
1. Drop existing tables or database
2. Recreate database: `dropdb studyhub_db && createdb studyhub_db`
3. Run setup again: `npm run db:setup`

### Viewing Database

Use PostgreSQL client to view data:

```bash
# Connect to database
psql -U postgres -d studyhub_db

# List all tables
\dt

# View users
SELECT * FROM users;

# View messages
SELECT * FROM direct_messages;

# Exit
\q
```

## Production Deployment

For production deployment, see:
- Update `NODE_ENV=production` in `.env`
- Use strong JWT secret (64+ characters)
- Set up proper database credentials
- Configure HTTPS
- Set up reverse proxy (nginx/Apache)
- Use process manager (PM2)
- Set up database backups

## Need Help?

If you encounter issues not covered here:
1. Check the console/terminal for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running
4. Check that all dependencies are installed
5. Try restarting both servers

## Summary of Commands

```bash
# Initial setup
npm install
cp .env.example .env
# Edit .env file
createdb studyhub_db
cd server && npm run db:setup

# Daily development
cd /path/to/project
npm run dev

# Database reset (if needed)
dropdb studyhub_db
createdb studyhub_db
cd server && npm run db:setup
```

You're now ready to develop and test the platform! 🚀
