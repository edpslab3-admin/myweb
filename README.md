
Enterprise PRO 100% - Full bundle
---------------------------------

What's included:
- frontend/  (static files: index.html, login.html, dashboard.html, admin.html, styles.css)
- backend/   (Node.js Express API, database.json, package.json)

Quick local run (development):
1. Install Node.js (v16+)
2. Open a terminal
3. cd backend
4. npm install
5. npm start
6. Backend runs on http://localhost:3000
7. Open frontend/index.html in browser (or serve it with 'npx serve frontend' to avoid CORS issues)
8. To use backend endpoints from frontend, serve frontend through backend static by visiting http://localhost:3000 (server already serves frontend static files).

Deploy to Render (example):
1. Create a GitHub repository and push this project.
2. Go to Render.com -> New -> Web Service
3. Connect your repo and set the root to "backend"
4. Build Command: npm install
5. Start Command: npm start
6. After deploy, set PUBLIC static site for frontend or serve frontend from backend (the backend in this bundle already serves frontend statics at root).

Notes:
- This is a ready-to-run demo bundle. For production, add authentication, HTTPS, and persistent DB (Postgres, etc.).
- Admin credentials (demo): admin / adminpass
- Demo users: user1..user6 password 1111..6666
