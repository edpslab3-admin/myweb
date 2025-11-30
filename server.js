
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB = path.join(__dirname, 'db.json');
if(!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({records:{}}));

app.get('/api/data', (req,res)=>{
  const db = JSON.parse(fs.readFileSync(DB));
  res.json(db.records);
});

app.post('/api/save', (req,res)=>{
  const {date, status} = req.body;
  const db = JSON.parse(fs.readFileSync(DB));
  db.records[date] = status;
  fs.writeFileSync(DB, JSON.stringify(db));
  res.json({ok:true});
});

app.listen(PORT, ()=> console.log("Server running on "+PORT));
