# Update Your .env File for MySQL

## 📝 Instructions

Open your `.env` file and update the database configuration section:

### Current Configuration (PostgreSQL):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notes_platform
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### New Configuration (MySQL):
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=your_mysql_password_here
```

## ⚠️ IMPORTANT

Replace `your_mysql_password_here` with:
- The password you set during MySQL installation
- If you used default installation, it's the root password you created

## 🔍 Example

If your MySQL root password is `MySecurePass123`, your `.env` should have:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=MySecurePass123
```

## ✅ Quick Copy-Paste

Copy these lines and paste into your `.env` file (replace the DB_* lines):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=REPLACE_WITH_YOUR_MYSQL_PASSWORD
```

## 📋 Full .env File Example

Your complete `.env` file should look like this:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=studyhub
DB_USER=root
DB_PASSWORD=your_mysql_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM=viphacker.100.org@gmail.com

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Socket.io Configuration
SOCKET_CORS_ORIGIN=http://localhost:5173
```

## 🚀 After Updating

Once you've updated your `.env` file:

1. Save the file
2. Restart your server (if running)
3. Continue with the MySQL setup

---

**Remember:** Never commit your `.env` file to Git! It's already in `.gitignore`.


