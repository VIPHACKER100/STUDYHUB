# MySQL Quick Start - StudyHub

## 🚀 Fast Track Migration (5 Minutes)

### 1️⃣ Install MySQL
```bash
# Download from: https://dev.mysql.com/downloads/installer/
# Or use Chocolatey:
choco install mysql
```

### 2️⃣ Install Package
```bash
cd server
npm uninstall pg
npm install mysql2
```

### 3️⃣ Update .env
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=your_mysql_password
```

### 4️⃣ Setup Database
```bash
# Create database
mysql -u root -p
CREATE DATABASE studyhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Run setup script
node src/database/setup-mysql.js
```

### 5️⃣ Update Connection
```bash
# Rename files in server/src/config/
mv database.js database-postgres.js
mv database-mysql.js database.js
```

### 6️⃣ Start App
```bash
cd ..
npm run dev
```

### 7️⃣ Login
- URL: http://localhost:5173
- Email: admin@studyhub.com
- Password: admin123

## ✅ Done!

---

## 📋 Verification Commands

```bash
# Check MySQL is running
net start | findstr MySQL

# Test connection
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use studyhub
USE studyhub;

# Show tables
SHOW TABLES;

# Count users
SELECT COUNT(*) FROM users;
```

---

## 🐛 Quick Fixes

### Can't connect to MySQL
```bash
net start MySQL80
```

### Wrong password
```bash
# Update .env with correct password
```

### Database doesn't exist
```bash
mysql -u root -p
CREATE DATABASE studyhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Module not found
```bash
cd server
npm install mysql2
```

---

## 📚 Full Documentation

- **MYSQL_SETUP.md** - Complete setup guide
- **MYSQL_CONVERSION.md** - Technical details
- **schema-mysql.sql** - Database schema

---

**Need help?** Check MYSQL_SETUP.md for detailed instructions!
