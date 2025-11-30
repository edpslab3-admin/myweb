
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const USERS = JSON.parse(fs.readFileSync('./users.json'));
const DB_FILE = './db.json';
function loadDB(){ return JSON.parse(fs.readFileSync(DB_FILE)); }
function saveDB(x){ fs.writeFileSync(DB_FILE, JSON.stringify(x)); }

// login
app.post('/login',(req,res)=>{
  const {user,pass} = req.body;
  if(USERS.admins[user] && USERS.admins[user]===pass){
    return res.json({ok:true, token:user, user});
  }
  return res.status(400).json({error:true});
});

// logout
app.post('/logout',(req,res)=>{ return res.json({ok:true}); });

// list users
app.get('/users',(req,res)=>{
  res.json({employees: USERS.employees});
});

// get attendance
app.get('/attendance',(req,res)=>{
  const db = loadDB();
  res.json(db.attendance || {});
});

// save attendance
app.post('/attendance',(req,res)=>{
  const {date,status,token} = req.body;
  if(!token) return res.status(403).json({error:"no token"});
  const db = loadDB();
  if(!db.attendance) db.attendance = {};
  db.attendance[date] = status;
  saveDB(db);
  res.json({ok:true});
});

app.listen(PORT, ()=> console.log("SERVER B running "+PORT));
