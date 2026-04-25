# MySQL Setup Instructions for StudyHub

## 🎯 Complete MySQL Migration Guide

Follow these steps to migrate from PostgreSQL to MySQL.

---

## 📋 Prerequisites

- Windows 10/11
- Node.js 18+ installed
- Administrator access

---

## 🔧 Step 1: Install MySQL

### Option A: Using MySQL Installer (Recommended)

1. **Download MySQL Installer:**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download: `mysql-installer-community-8.0.xx.msi`

2. **Run Installer:**
   - Double-click the downloaded file
   - Choose "Custom" installation type
   - Select these components:
     - MySQL Server 8.0.x
     - MySQL Workbench (optional, for GUI)
     - MySQL Shell (optional)

3. **Configure MySQL Server:**
   - Choose "Development Computer" for server configuration
   - Port: 3306 (default)
   - Set a strong root password (remember this!)
   - Create a Windows Service (recommended)
   - Start MySQL Server at system startup

4. **Complete Installation:**
   - Click "Execute" to install
   - Wait for installation to complete
   - Click "Finish"

### Option B: Using Chocolatey

```powershell
# Run PowerShell as Administrator
choco install mysql

# Start MySQL service
net start MySQL80
```

### Verify Installation

```bash
# Check MySQL version
mysql --version

# Should output: mysql  Ver 8.0.xx for Win64
```

---

## 📦 Step 2: Install MySQL Package

```bash
# Navigate to server directory
cd "c:\Users\Aryan\Desktop\github projects\note\server"

# Remove PostgreSQL package
npm uninstall pg

# Install MySQL package
npm install mysql2

# Verify installation
npm list mysql2
```

---

## ⚙️ Step 3: Update Environment Variables

Edit your `.env` file:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=your_mysql_root_password_here
```

**Important:** Replace `your_mysql_root_password_here` with the password you set during MySQL installation.

---

## 🗄️ Step 4: Create Database

### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p
# Enter your password when prompted

# Create database
CREATE DATABASE studyhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify database was created
SHOW DATABASES;

# Exit MySQL
exit;
```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to Local instance
3. Click "Create Schema" button
4. Name: `studyhub`
5. Charset: `utf8mb4`
6. Collation: `utf8mb4_unicode_ci`
7. Click "Apply"

---

## 🚀 Step 5: Run Database Setup

```bash
# Make sure you're in the server directory
cd "c:\Users\Aryan\Desktop\github projects\note\server"

# Run MySQL setup script
node src/database/setup-mysql.js
```

**Expected Output:**
```
🔄 Connecting to MySQL server...
✅ Connected to MySQL server
🔄 Creating database: studyhub...
✅ Database studyhub created/verified
🔄 Reading schema file...
🔄 Generating admin password hash...
🔄 Executing schema...
✅ Schema executed successfully
✅ Created 17 tables

🎉 ════════════════════════════════════════════════════════
   MySQL Database Setup Complete!
  ════════════════════════════════════════════════════════

  📊 Database: studyhub
  📋 Tables: 17

  🔑 Default Admin Credentials:
     Email: viphacker.100.org@gmail.com
     Password: admin123
     ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!

  ✅ You can now start the server with: npm run dev
```

---

## 🔄 Step 6: Update Database Connection

You have two options:

### Option A: Rename Files (Easier)

```bash
# In server/src/config/ directory
# Rename database.js to database-postgres.js (backup)
# Rename database-mysql.js to database.js
```

### Option B: Update Imports (Manual)

Find and replace in all files:
- Find: `from './config/database.js'`
- Replace: `from './config/database-mysql.js'`

Or find: `from '../config/database.js'`
Replace: `from '../config/database-mysql.js'`

---

## ✅ Step 7: Start the Application

```bash
# Navigate to project root
cd "c:\Users\Aryan\Desktop\github projects\note"

# Start development servers
npm run dev
```

**Expected Output:**
```
[0] [nodemon] starting `node src/index.js`
[0] ✅ Connected to MySQL database
[0] 
[0] 🚀 ════════════════════════════════════════════════════════
[0]    StudyHub Platform - Server Started
[0]   ════════════════════════════════════════════════════════
[0] 
[0]   ➜  Server:      http://localhost:5000
[0]   ➜  API:         http://localhost:5000/api
[0] 
[1] VITE v7.2.7  ready in 500 ms
[1] ➜  Local:   http://localhost:5173/
```

---

## 🧪 Step 8: Test the Application

1. **Open Browser:**
   - Navigate to: http://localhost:5173

2. **Test Login:**
   - Email: `viphacker.100.org@gmail.com`
   - Password: `admin123`

3. **Verify Features:**
   - [ ] Login works
   - [ ] Dashboard loads
   - [ ] Can create new user
   - [ ] File upload works
   - [ ] Messages work
   - [ ] Anonymous rooms work

---

## 🔍 Verification Checklist

After migration, verify these work:

### Database
- [ ] MySQL service is running
- [ ] Database `studyhub` exists
- [ ] All 17 tables created
- [ ] Admin user exists

### Application
- [ ] Server starts without errors
- [ ] Frontend loads correctly
- [ ] No console errors
- [ ] Database queries work

### Features
- [ ] User registration
- [ ] User login
- [ ] File uploads
- [ ] Direct messaging
- [ ] Anonymous rooms
- [ ] Admin dashboard
- [ ] Notifications

---

## 🐛 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution:**
```bash
# Reset MySQL root password
mysql -u root -p
# Enter old password

# Change password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
exit;

# Update .env file with new password
```

### Error: "Can't connect to MySQL server"

**Solution:**
```bash
# Check if MySQL is running
net start | findstr MySQL

# If not running, start it
net start MySQL80

# Or restart it
net stop MySQL80
net start MySQL80
```

### Error: "Database does not exist"

**Solution:**
```bash
mysql -u root -p
CREATE DATABASE studyhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### Error: "Table already exists"

**Solution:**
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE studyhub;
CREATE DATABASE studyhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Run setup again
node src/database/setup-mysql.js
```

### Error: "Cannot find module 'mysql2'"

**Solution:**
```bash
cd server
npm install mysql2
```

---

## 📊 MySQL vs PostgreSQL Differences

### Data Types Changed
- `SERIAL` → `INT AUTO_INCREMENT`
- `BOOLEAN` → `TINYINT(1)`
- `TIMESTAMP WITH TIME ZONE` → `TIMESTAMP`
- `JSONB` → `JSON`
- `TEXT[]` → `TEXT` (comma-separated)

### Query Syntax Changed
- `RETURNING *` → Use `LAST_INSERT_ID()`
- `$1, $2` → `?, ?` (parameterized queries)
- `array_agg()` → `GROUP_CONCAT()`

### Features Not Available in MySQL
- Array data types
- Advanced JSON operations
- Some window functions
- `RETURNING` clause

---

## 🔐 Security Notes

1. **Change Admin Password:**
   ```bash
   # After first login, go to profile and change password
   ```

2. **Secure MySQL:**
   ```bash
   # Run MySQL secure installation
   mysql_secure_installation
   ```

3. **Backup Database:**
   ```bash
   # Create backup
   mysqldump -u root -p studyhub > backup.sql
   
   # Restore backup
   mysql -u root -p studyhub < backup.sql
   ```

---

## 📞 Need Help?

If you encounter issues:

1. Check MySQL error log:
   - Location: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`
   - File: `hostname.err`

2. Verify MySQL is running:
   ```bash
   net start | findstr MySQL
   ```

3. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```

4. Check application logs:
   - Look for database connection errors
   - Verify .env configuration

---

## ✅ Success Indicators

You'll know the migration is successful when:

1. ✅ MySQL service is running
2. ✅ Database `studyhub` exists with 17 tables
3. ✅ Server starts with "Connected to MySQL database"
4. ✅ You can login with admin credentials
5. ✅ All features work correctly

---

## 🎉 Congratulations!

Your StudyHub application is now running on MySQL!

**Next Steps:**
1. Change the default admin password
2. Test all features thoroughly
3. Create regular database backups
4. Monitor performance

---

**Version:** 1.0.0 (MySQL)  
**Last Updated:** December 2025


