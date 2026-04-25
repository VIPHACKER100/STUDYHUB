---
description: Connect Railway (PostgreSQL/MySQL) to Vercel Deployment
---

# How to Connect Railway to Vercel

This guide walks you through linking a Railway‑hosted database (PostgreSQL or MySQL) to a Vercel‑deployed application.

## Prerequisites
1. **Railway Project** with a running database service.
2. **Vercel Account** with a project already deployed (e.g., a Next.js or Node.js app).
3. Basic knowledge of environment variables and the database client library you use (`pg`, `mysql2`, `sequelize`, etc.).

## Step‑by‑Step Instructions

### 1. Retrieve the Database Connection URL from Railway
1. Open your Railway dashboard → select the project → go to the **Database** tab.
2. Click **Connect** or **View Credentials**.
3. Copy the **Connection URL** (e.g.,
   - PostgreSQL: `postgresql://user:password@containers-us-west-123.railway.app:5432/database`
   - MySQL: `mysql://user:password@containers-us-west-123.railway.app:3306/database`).

### 2. Add the Connection URL as an Environment Variable in Vercel
1. In Vercel, navigate to your project → **Settings** → **Environment Variables**.
2. Click **Add New** and set:
   - **Key**: `DATABASE_URL` (or a custom name like `MYSQL_URL` / `POSTGRES_URL`).
   - **Value**: paste the URL you copied from Railway.
   - **Environment**: choose **Production**, **Preview**, and **Development** as needed.
3. Save the variable.

### 3. Update Your Application to Use the Variable
#### For Node.js / Express (using `pg` or `mysql2` directly:
```js
const { Pool } = require('pg'); // PostgreSQL example
// const mysql = require('mysql2/promise'); // MySQL example

const connectionString = process.env.DATABASE_URL; // Vercel injects this

const pool = new Pool({ connectionString });
// For MySQL: const pool = await mysql.createPool(connectionString);
```

#### For Sequelize:
```js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: process.env.DATABASE_URL.startsWith('postgres') ? 'postgres' : 'mysql',
  logging: false,
});
```

### 4. Deploy / Redeploy on Vercel
- After committing the code changes, push to the repository linked with Vercel.
- Vercel will automatically rebuild; the new env var will be available.

### 5. Verify the Connection
1. Open the deployed site.
2. Trigger a route that accesses the DB (e.g., `/api/health` that runs a simple `SELECT 1`).
3. Check Vercel’s **Logs** for any connection errors.

### 6. (Optional) Use Railway’s **Preview Deployments**
- Railway can create preview URLs for each branch. To use the same DB across Vercel preview deployments, repeat steps 2‑4 for the preview environment variables.

## Common Pitfalls & Troubleshooting
- **Incorrect URL format** – Ensure there are no extra spaces or newline characters.
- **Missing SSL** – Some Railway databases require `sslmode=require` (Postgres) or `?ssl=true` (MySQL). Append these query params to the URL if needed.
- **IP Whitelisting** – Railway databases are publicly accessible via the URL; no IP whitelisting needed, but ensure the URL isn’t exposed publicly in client‑side code.
- **Environment Variable Name Mismatch** – Your code must reference the exact key you set in Vercel.

---

*This workflow can be executed directly from the `.agent/workflows` directory if you want to automate the steps in the future.*


