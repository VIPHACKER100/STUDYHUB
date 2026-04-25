---
description: Deploy the full Note app to Railway.app (Node.js + MySQL)
---

# Deploy the Full Note Application to Railway.app

This workflow walks you through taking the **entire** `note` project (backend API + MySQL) and hosting it on Railway.app, so you get a public URL like `https://<project>.up.railway.app/`.

---

## Prerequisites
1. **Railway account** – sign‑up at https://railway.app and be logged in.
2. **Git repository** – the project should be committed to a remote (GitHub, GitLab, Bitbucket, etc.). Railway can clone directly from the repo.
3. **Node.js** (v18+) and **npm** installed locally (for any local testing you might do before deployment).
4. **MySQL** – either the Railway‑provided MySQL add‑on or an external MySQL instance you’ll connect to.

---

## Step‑by‑Step Instructions

### 1️⃣ Create a New Railway Project
1. Go to the Railway dashboard → **New Project**.
2. Choose **Deploy from Git Repository**.
3. Select the repository that contains your `note` project (or paste the Git URL).
4. Railway will automatically detect a `package.json` and suggest a **Node.js** service.

### 2️⃣ Add a MySQL Plugin (Database)
1. In the project view, click **Add Plugin** → **MySQL**.
2. Railway will spin up a MySQL instance and expose a connection URL (e.g. `mysql://user:pass@containers-us-west-123.railway.app:3306/dbname`).
3. **Copy** the connection URL – you’ll need it for environment variables.

### 3️⃣ Set Environment Variables
1. Still in the project view, go to **Settings → Variables**.
2. Add the following variables (replace values where indicated):
   - `DATABASE_URL` → *paste the MySQL connection URL from step 2*.
   - `PORT` → `3000` (or any port your app listens on; Railway will forward traffic automatically).
   - Any other custom env vars your app uses (e.g., `JWT_SECRET`, `NODE_ENV=production`).
3. Click **Save**.

### 4️⃣ Ensure the App Listens on the Correct Port
Your server should read the port from `process.env.PORT`:
```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
If you have a hard‑coded port, update it accordingly.

### 5️⃣ Add a `start` Script (if missing)
Railway runs `npm start` by default. Make sure `package.json` contains:
```json
"scripts": {
  "start": "node server/src/index.js" // adjust path to your entry point
}
```
If you use `nodemon` locally, keep the `dev` script for development, but keep `start` for production.

### 6️⃣ (Optional) Add a `Dockerfile`
Railway can build a Docker image automatically. If you prefer Docker, create a `Dockerfile` at the repo root:
```dockerfile
# Use official Node LTS image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
# Build step if you have any (e.g., TypeScript)
# RUN npm run build

EXPOSE 3000
CMD ["node", "server/src/index.js"]
```
Railway will detect the Dockerfile and use it instead of the default Node build.

### 7️⃣ Deploy / Trigger a Build
1. After setting variables, Railway will automatically start a build.
2. Watch the **Deployments** tab – you’ll see logs for `npm install`, `npm run build` (if any), and the start of the server.
3. Once the build succeeds, Railway provides a public URL like:
   `https://<project>.up.railway.app/`

### 8️⃣ Verify the Deployment
- Open the URL in a browser. You should see your API’s default route or a health‑check endpoint.
- If you have a front‑end, you can point its API base to the same URL.
- Use Railway’s **Logs** view to debug any start‑up errors (e.g., missing env vars, DB connection failures).

### 9️⃣ Enable Automatic Deploys (CI/CD)
- In the **Deployments** settings, toggle **Auto‑Deploy on Push**.
- Now every push to the main branch (or the branch you selected) will trigger a new Railway build.

---

## Common Issues & Fixes
| Symptom | Likely Cause | Fix |
|---------|---------------|-----|
| `Error: connect ECONNREFUSED` | DB URL not set or wrong port | Verify `DATABASE_URL` in Railway variables matches the MySQL plugin URL. |
| `Cannot find module 'src/...` | Wrong start script path | Ensure the `start` script points to the correct entry file (`server/src/index.js` or similar). |
| `SSL connection required` | Railway MySQL enforces SSL | Append `?ssl=true` to the URL or configure `dialectOptions.ssl` in Sequelize. |
| Build times out | Large `node_modules` or missing `npm ci` | Use a `.dockerignore` or `npm prune --production` in Dockerfile. |

---

## TL;DR Quick Checklist (copy‑paste into a note)
```markdown
# Deploy Note app to Railway
- [ ] Create Railway project → Deploy from Git
- [ ] Add MySQL plugin → copy connection URL
- [ ] Set env vars: DATABASE_URL, PORT, JWT_SECRET, etc.
- [ ] Ensure server reads `process.env.PORT`
- [ ] Add `start` script in package.json
- [ ] (Optional) Add Dockerfile
- [ ] Push to repo → Railway auto‑build
- [ ] Verify public URL works
- [ ] Enable Auto‑Deploy on push
```

---

*This workflow lives in `.agent/workflows/railway-full-app-deployment.md` and can be referenced or executed later.*


