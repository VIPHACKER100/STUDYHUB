# StudyHub - Deployment Guide

## Prerequisites

### Required Software
- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** or **yarn**

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd note
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studyhub_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_very_secure_secret_key_change_this
JWT_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=viphacker.100.org@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="StudyHub <viphacker.100.org@gmail.com>"

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# Optional: AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

## Database Setup

1. **Create database**
```bash
createdb studyhub_db
```

2. **Run schema setup**
```bash
cd server
npm run db:setup
```

This will:
- Create all required tables
- Set up triggers and indexes
- Create default admin user (viphacker.100.org@gmail.com / admin123)

**⚠️ IMPORTANT**: Change the admin password immediately after first login!

## Production Deployment

### Option 1: Traditional Server (VPS/Dedicated)

1. **Build the client**
```bash
cd client
npm run build
```

2. **Configure Nginx** (example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Client (React app)
    location / {
        root /path/to/note/client/dist;
        try_files $uri /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

3. **Start the server with PM2**
```bash
npm install -g pm2
cd server
pm2 start src/index.js --name studyhub-api
pm2 save
pm2 startup
```

### Option 2: Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: studyhub_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres
    volumes:
      - ./uploads:/app/uploads

  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Heroku
```bash
heroku create studyhub-app
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### Vercel (Frontend) + Railway (Backend)
- Deploy client to Vercel
- Deploy server to Railway
- Add PostgreSQL addon on Railway

## Post-Deployment Checklist

- [ ] Change default admin password
- [ ] Configure SMTP for email notifications
- [ ] Set up SSL/TLS certificates (Let's Encrypt)
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure monitoring (e.g., PM2, New Relic)
- [ ] Test all critical features
- [ ] Set up error logging (e.g., Sentry)

## Monitoring & Maintenance

### Health Check
```bash
curl https://yourdomain.com/api/health
```

### Database Backup
```bash
pg_dump studyhub_db > backup_$(date +%Y%m%d).sql
```

### View Logs (PM2)
```bash
pm2 logs studyhub-api
```

### Update Application
```bash
git pull origin main
npm install
cd client && npm run build
pm2 restart studyhub-api
```

## Scaling Considerations

1. **Database**: Use connection pooling (already configured)
2. **File Storage**: Migrate to AWS S3 for uploads
3. **Caching**: Implement Redis for session management
4. **Load Balancing**: Use Nginx or cloud load balancers
5. **CDN**: Serve static assets via CDN

## Security Best Practices

- Keep dependencies updated (`npm audit`)
- Use environment variables for secrets
- Enable HTTPS only
- Implement rate limiting (already configured)
- Regular security audits
- Database encryption at rest
- Regular backups

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d studyhub_db
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Email Not Sending
- Verify SMTP credentials
- Check firewall rules for port 587
- Enable "Less secure app access" for Gmail (or use App Passwords)

## Support

For issues and questions:
- Check logs: `pm2 logs` or `docker logs`
- Review documentation: README.md, SETUP.md
- Database schema: `server/src/database/schema.sql`


