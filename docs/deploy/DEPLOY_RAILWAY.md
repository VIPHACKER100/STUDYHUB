# Deploy StudyHub to Railway.app - Complete Guide

## 🚀 Why Railway?

Railway is **perfect** for StudyHub because:
- ✅ **Free $5/month credit** (enough for small projects)
- ✅ **Node.js support** (your backend)
- ✅ **MySQL included** (your database)
- ✅ **WebSocket support** (Socket.io works!)
- ✅ **Auto-deploy from GitHub**
- ✅ **Free SSL/HTTPS**
- ✅ **Easy to use**

---

## 📋 Prerequisites

- [x] GitHub account
- [x] StudyHub code pushed to GitHub
- [x] Railway account (we'll create this)

---

## 🎯 Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
cd "c:\Users\Aryan\Desktop\github projects\note"

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: StudyHub v1.5.0 - Modern Design Rollout"

# Create repository on GitHub first, then:
git remote add origin https://github.com/viphacker100/studyhub.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Account

1. **Go to:** https://railway.app
2. **Click:** "Login" or "Start a New Project"
3. **Sign up with GitHub**
4. **Authorize Railway** to access your repositories

### Step 3: Create New Project

1. **Click:** "New Project"
2. **Select:** "Deploy from GitHub repo"
3. **Choose:** your StudyHub repository
4. **Railway will:**
   - Detect it's a Node.js project
   - Start building automatically

### Step 4: Add MySQL Database

1. **In your project dashboard:**
   - Click "New" button
   - Select "Database"
   - Choose "Add MySQL"

2. **Wait for MySQL to provision** (takes ~30 seconds)

3. **Get database credentials:**
   - Click on MySQL service
   - Go to "Connect" tab
   - Copy the connection details

### Step 5: Configure Server Environment Variables

1. **Click on your web service** (not the database)
2. **Go to "Variables" tab**
3. **Add these variables:**

```env
NODE_ENV=production
PORT=5000

# Database (use Railway's MySQL credentials)
DB_HOST=<from Railway MySQL>
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=<from Railway MySQL>

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS (will update after frontend deployment)
CLIENT_URL=https://your-frontend-url.vercel.app

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# Email (optional, configure later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=viphacker.100.org@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=viphacker.100.org@gmail.com

# Socket.io
SOCKET_CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Step 6: Configure Build Settings

1. **In your web service settings:**
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

2. **Save settings**

### Step 7: Setup Database

1. **Railway will deploy your backend**
2. **Get your backend URL** (e.g., `https://studyhub-production.up.railway.app`)
3. **Run database setup:**
   - Go to your service
   - Click "..." menu → "Run a Command"
   - Enter: `node src/database/setup-mysql.js`
   - Or use Railway CLI (see below)

### Step 8: Deploy Frontend to Vercel

1. **Go to:** https://vercel.com
2. **Sign up with GitHub**
3. **Click:** "New Project"
4. **Import** your StudyHub repository
5. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. **Add Environment Variables:**
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_SOCKET_URL=https://your-backend-url.railway.app
   ```

7. **Deploy**

### Step 9: Update CORS Settings

1. **Go back to Railway**
2. **Update environment variables:**
   ```env
   CLIENT_URL=https://your-app.vercel.app
   SOCKET_CORS_ORIGIN=https://your-app.vercel.app
   ```

3. **Redeploy** (Railway auto-deploys on env change)

### Step 10: Test Your Deployment

1. **Open your Vercel URL**
2. **Try to:**
   - Register a new user
   - Login
   - Upload a file
   - Send a message
   - Create anonymous room

---

## 🔧 Railway CLI (Optional but Useful)

### Install Railway CLI

```bash
npm install -g @railway/cli
```

### Login

```bash
railway login
```

### Link to Project

```bash
cd "c:\Users\Aryan\Desktop\github projects\note\server"
railway link
```

### Run Database Setup

```bash
railway run node src/database/setup-mysql.js
```

### View Logs

```bash
railway logs
```

---

## 📁 Project Structure for Railway

Make sure your `server/package.json` has:

```json
{
  "name": "studyhub-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "db:setup": "node src/database/setup-mysql.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 🌐 Update Frontend API URLs

Create `client/.env.production`:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

Update `client/src/lib/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    // ... rest of config
});
```

Update `client/src/lib/socket.js`:

```javascript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
    // ... rest of config
});
```

---

## 🎨 Custom Domain (Optional)

### On Railway:

1. Go to your service settings
2. Click "Domains"
3. Add custom domain
4. Update DNS records

### On Vercel:

1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS instructions

---

## 💾 File Storage (Important!)

Railway's file system is **ephemeral** (files are lost on redeploy).

**Solution: Use Cloudinary**

1. **Sign up:** https://cloudinary.com (free tier)
2. **Get credentials**
3. **Install package:**
   ```bash
   npm install cloudinary
   ```

4. **Update upload logic** to use Cloudinary instead of local storage

---

## 🐛 Troubleshooting

### Backend not starting?

**Check logs:**
```bash
railway logs
```

**Common issues:**
- Missing environment variables
- Database connection failed
- Port binding issues

### Database connection failed?

**Verify:**
- DB_HOST is correct
- DB_PASSWORD is correct
- MySQL service is running

### WebSocket not working?

**Check:**
- SOCKET_CORS_ORIGIN matches frontend URL
- Railway allows WebSocket (it does!)
- Frontend is using correct socket URL

### File uploads failing?

**Solution:**
- Use Cloudinary or AWS S3
- Don't use local file system on Railway

---

## 📊 Monitoring

### Railway Dashboard

- View logs in real-time
- Monitor resource usage
- Check deployment status

### Metrics

- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 💰 Cost Estimate

**Railway Free Tier:**
- $5 credit/month
- Typical usage: $3-4/month
- Enough for small projects

**If you exceed free tier:**
- Pay-as-you-go
- ~$0.000463/GB-hour for RAM
- ~$0.25/GB for storage

**Vercel:**
- Free for personal projects
- Unlimited bandwidth
- 100GB/month

**Total: $0/month** (within free tiers)

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project created on Railway
- [ ] MySQL database added
- [ ] Environment variables configured
- [ ] Database setup completed
- [ ] Frontend deployed to Vercel
- [ ] CORS updated
- [ ] Application tested
- [ ] Custom domain added (optional)

---

## 🎉 Success!

Your StudyHub application is now live!

**URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- API: `https://your-backend.railway.app/api`

**Next Steps:**
1. Change admin password
2. Configure email service
3. Set up file storage (Cloudinary)
4. Monitor usage
5. Share with users!

---

**Need help?** Railway has excellent documentation and Discord support!

**Railway Docs:** https://docs.railway.app  
**Railway Discord:** https://discord.gg/railway


