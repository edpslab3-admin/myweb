
Enterprise PRO 100% - Full bundle

Folders:
- frontend/  (static files)
- backend/   (Node.js Express API)

Quick local start:
1. Install Node.js (>=16)
2. cd backend
3. npm install
4. npm start  (server runs on 3000)
5. Open frontend/index.html in browser (or serve static via nginx/Render).

To enable full online deployment on Render:
- Create a Git repo with this project and push.
- Create a Web Service in Render using the backend folder (Node service)
- Build: npm install  Start: npm start
- For static frontend, use Render Static Site or serve frontend files from the backend (add express static middleware).
API endpoints:
GET /api/departments  - list last saved per-dept
POST /api/save        - save dept attendance (body: {dept,user,records})
GET /api/all          - admin get all
GET /api/export       - download CSV of all records
