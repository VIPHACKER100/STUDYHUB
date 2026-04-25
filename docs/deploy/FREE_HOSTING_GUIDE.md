# Deploying StudyHub - Free Hosting Options

## ⚠️ Important: InfinityFree Won't Work

**InfinityFree** only supports:
- ✅ Static HTML/CSS/JS
- ✅ PHP websites
- ❌ **NOT** Node.js applications
- ❌ **NOT** WebSocket/Socket.io
- ❌ **NOT** Real-time features

**StudyHub requires:**
- Node.js runtime
- MySQL/PostgreSQL database
- WebSocket support (Socket.io)
- File upload storage
- Background processes

---

## 🚀 Best Free Hosting Options for StudyHub

### Option 1: Railway.app (Recommended) ⭐

**Why Railway?**
- ✅ Free tier available
- ✅ Node.js support
- ✅ MySQL/PostgreSQL included
- ✅ WebSocket support
- ✅ Easy deployment
- ✅ Automatic HTTPS

**Free Tier:**
- $5 credit/month (enough for small projects)
- 512MB RAM
- 1GB storage

**Deployment Steps:**

1. **Create Account:**
   - Go to: https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your StudyHub repository

3. **Add MySQL Database:**
   - Click "New" → "Database" → "Add MySQL"
   - Railway will provide connection details

4. **Configure Environment Variables:**
   ```env
   NODE_ENV=production
   DB_HOST=<railway-mysql-host>
   DB_PORT=3306
   DB_NAME=railway
   DB_USER=root
   DB_PASSWORD=<railway-mysql-password>
   JWT_SECRET=<your-secret>
   CLIENT_URL=<your-frontend-url>
   GEMINI_API_KEY=<your-gemini-key>
   USE_MOCK_DB=false
   ```

5. **Deploy:**
   - Railway auto-deploys on git push
   - Get your deployment URL

---

### Option 2: Render.com (Great Alternative) ⭐

**Why Render?**
- ✅ Generous free tier
- ✅ Node.js support
- ✅ PostgreSQL included
- ✅ WebSocket support
- ✅ Auto-deploy from Git

**Free Tier:**
- Web services sleep after 15 min inactivity
- 750 hours/month
- PostgreSQL database (90 days)

**Deployment Steps:**

1. **Create Account:**
   - Go to: https://render.com
   - Sign up with GitHub

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Name: studyhub-api
   - Environment: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

3. **Create PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Name: studyhub-db
   - Copy connection details

4. **Set Environment Variables:**
   - In Web Service settings → Environment
   - Add all required variables

5. **Deploy Frontend:**
   - Create another Web Service
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`

---

### Option 3: Vercel (Frontend) + Railway (Backend)

**Best for:**
- Separate frontend/backend deployment
- Maximum performance

**Setup:**

1. **Frontend on Vercel:**
   - Go to: https://vercel.com
   - Import GitHub repository
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Backend on Railway:**
   - Deploy backend as described in Option 1
   - Update frontend env with backend URL

---

### Option 4: Heroku (Classic Choice)

**Note:** Heroku ended free tier, but has affordable paid plans ($5/month)

**If you want to use Heroku:**

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   heroku create studyhub-app
   ```

4. **Add MySQL:**
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

---

### Option 5: Cyclic.sh (Simple & Free)

**Why Cyclic?**
- ✅ Completely free
- ✅ Node.js support
- ✅ Easy deployment
- ⚠️ Limited database options

**Deployment:**
1. Go to: https://cyclic.sh
2. Connect GitHub
3. Select repository
4. Deploy automatically

---

## 📋 Pre-Deployment Checklist

Before deploying to any platform:

- [ ] Push code to GitHub
- [ ] Create production build
- [ ] Set up environment variables
- [ ] Configure database
- [ ] Test locally in production mode
- [ ] Update CORS settings
- [ ] Configure file upload storage

---

## 🔧 Prepare for Deployment

### 1. Update package.json

Add these scripts to `server/package.json`:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "build": "npm install",
    "db:setup": "node src/database/setup-mysql.js"
  }
}
```

### 2. Create Procfile (for Heroku)

Create `Procfile` in root:

```
web: cd server && npm start
```

### 3. Update CORS

In `server/src/index.js`, update CORS:

```javascript
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
};
```

### 4. Environment Variables

Required for production:

```env
NODE_ENV=production
DB_HOST=<your-db-host>
DB_PORT=3306
DB_NAME=<your-db-name>
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
JWT_SECRET=<strong-random-secret>
CLIENT_URL=<your-frontend-url>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASSWORD=<your-app-password>
EMAIL_FROM=viphacker.100.org@gmail.com
```

---

## 🎯 Recommended Deployment Strategy

**Best Free Setup:**

1. **Backend:** Railway.app
   - Node.js server
   - MySQL database
   - WebSocket support

2. **Frontend:** Vercel
   - Fast CDN
   - Automatic deployments
   - Free SSL

3. **File Storage:** Cloudinary (free tier)
   - Image/file hosting
   - 25GB storage
   - Free tier available

**Total Cost:** $0/month (within free tiers)

---

## 📝 Step-by-Step: Deploy to Railway

### 1. Prepare Your Code

```bash
# Make sure code is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### 3. Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your StudyHub repository
4. Railway will detect Node.js

### 4. Add MySQL Database

1. In your project, click "New"
2. Select "Database"
3. Choose "Add MySQL"
4. Wait for provisioning

### 5. Configure Environment

1. Click on your web service
2. Go to "Variables" tab
3. Add all environment variables
4. Use Railway's MySQL connection details

### 6. Deploy

1. Railway auto-deploys
2. Wait for build to complete
3. Get your deployment URL
4. Test your application

---

## 🐛 Common Deployment Issues

### Issue: Database Connection Failed

**Solution:**
- Check environment variables
- Verify database credentials
- Ensure database is running

### Issue: WebSocket Not Working

**Solution:**
- Check CORS settings
- Verify Socket.io configuration
- Enable WebSocket on hosting platform

### Issue: File Uploads Failing

**Solution:**
- Use cloud storage (Cloudinary, AWS S3)
- Don't rely on local file system
- Update upload configuration

---

## 📞 Need Help?

**Documentation:**
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

**Support:**
- Railway Discord: https://discord.gg/railway
- Render Community: https://community.render.com

---

## ✅ Success Checklist

After deployment:

- [ ] Application is accessible via URL
- [ ] Can register new user
- [ ] Can login
- [ ] File uploads work
- [ ] Messages work in real-time
- [ ] Database is persistent
- [ ] HTTPS is enabled
- [ ] No console errors

---

**Recommendation:** Use **Railway.app** for the easiest deployment experience with StudyHub!

Would you like me to create a detailed Railway deployment guide?


