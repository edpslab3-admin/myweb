// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortid = require('shortid');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 10000;

const USERS_FILE = path.join(__dirname,'users.json');
const DB_FILE = path.join(__dirname,'db.json');

// load users & admins
function loadUsers() {
  if (fs.existsSync(USERS_FILE)) {
    try { return JSON.parse(fs.readFileSync(USERS_FILE)); }
    catch(e){ return { employees:[], admins:[] }; }
  }
  return { employees:[], admins:[] };
}
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try { return JSON.parse(fs.readFileSync(DB_FILE)); }
    catch(e){ return {}; }
  }
  return {};
}
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

let sessions = {}; // simple in-memory sessions: token -> username (demo only)

app.get('/users', (req,res)=>{
  // Optionally support remote USERS_URL via env var (JSON endpoint)
  const USERS_URL = process.env.USERS_URL;
  if (USERS_URL && USERS_URL.startsWith('http')) {
    // proxy fetch (node fetch is not built-in here) => for simplicity we won't fetch remote; instruct to set USERS_URL only if server can fetch
    // For demo, return local
  }
  const u = loadUsers();
  res.json(u);
});

app.post('/login', (req,res)=>{
  const { user, pass } = req.body || {};
  const u = loadUsers();
  const admin = (u.admins || []).find(a => a.user === user && a.pass === pass);
  if (!admin) return res.status(401).json({ok:false, msg:'invalid'});
  const token = shortid.generate();
  sessions[token] = user;
  res.json({ok:true, token, user});
});

app.post('/logout', (req,res)=>{
  const { token } = req.body||{};
  if(token) delete sessions[token];
  res.json({ok:true});
});

app.get('/attendance', (req,res)=>{
  const db = loadDB();
  res.json(db);
});

app.post('/attendance', (req,res)=>{
  const { date, status, token } = req.body || {};
  // naive auth: token should exist in sessions
  if (!token || !sessions[token]) return res.status(401).json({ok:false, msg:'not authorized'});
  if (!date || !Array.isArray(status)) return res.status(400).json({ok:false,msg:'bad payload'});
  const db = loadDB();
  db[date] = status;
  saveDB(db);
  res.json({ok:true});
});

// serve frontend static files (if you place index.html in same repo)
app.use(express.static(path.join(__dirname)));
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(PORT, ()=> console.log('Server listening on ' + PORT));
