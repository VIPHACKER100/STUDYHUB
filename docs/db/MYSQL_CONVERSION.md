# MySQL Conversion Guide for StudyHub

## 📋 Overview

This guide will help you convert StudyHub from PostgreSQL to MySQL.

## ⚙️ Step 1: Install MySQL

### Windows Installation

1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/installer/
   - Download MySQL Installer (Community)
   - Choose "mysql-installer-web-community"

2. **Install MySQL:**
   - Run the installer
   - Choose "Developer Default" setup
   - Set root password (remember this!)
   - Complete installation

3. **Verify Installation:**
   ```bash
   mysql --version
   ```

## 📦 Step 2: Install MySQL Package

```bash
cd server
npm uninstall pg
npm install mysql2
```

## 🔧 Step 3: Update Environment Variables

Update your `.env` file:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=your_mysql_password
```

## 📝 Step 4: Create MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE studyhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
exit;
```

## 🔄 Step 5: Apply Code Changes

I'll create the following files for you:

1. **server/src/config/database-mysql.js** - New MySQL connection
2. **server/src/database/schema-mysql.sql** - MySQL-compatible schema
3. **server/src/database/setup-mysql.js** - MySQL setup script

## 📊 Key Differences: PostgreSQL vs MySQL

### Data Types
- `SERIAL` → `INT AUTO_INCREMENT`
- `TIMESTAMP WITH TIME ZONE` → `TIMESTAMP`
- `TEXT` → `TEXT` (same)
- `BOOLEAN` → `TINYINT(1)`
- `JSONB` → `JSON`

### Syntax
- `RETURNING *` → Use `LAST_INSERT_ID()`
- `$1, $2` → `?, ?` (parameterized queries)
- `NOW()` → `NOW()` (same)
- `CURRENT_TIMESTAMP` → `CURRENT_TIMESTAMP` (same)

### Functions
- `array_agg()` → `GROUP_CONCAT()`
- `string_agg()` → `GROUP_CONCAT()`

## ⚠️ Important Notes

1. **Backup First:** If you have existing data, back it up
2. **Test Thoroughly:** Test all features after conversion
3. **Performance:** MySQL may perform differently
4. **Compatibility:** Some advanced PostgreSQL features may not be available

## 🚀 Quick Start (After Conversion)

```bash
# Setup database
cd server
node src/database/setup-mysql.js

# Start server
cd ..
npm run dev
```

## 🔍 Verification Checklist

After conversion, verify:
- [ ] Database connection successful
- [ ] User registration works
- [ ] Login works
- [ ] File uploads work
- [ ] Messages work
- [ ] Anonymous rooms work
- [ ] Admin dashboard works

## 🆘 Troubleshooting

### Connection Error
```
Error: ER_ACCESS_DENIED_ERROR
```
**Solution:** Check DB_USER and DB_PASSWORD in .env

### Database Not Found
```
Error: ER_BAD_DB_ERROR
```
**Solution:** Create database: `CREATE DATABASE studyhub;`

### Port Already in Use
```
Error: EADDRINUSE
```
**Solution:** MySQL is already running or port 3306 is in use

---

**Ready to proceed with the conversion?**
