const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'attendance.json');
if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}));

app.get('/attendance', (req,res)=>{
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

app.post('/attendance', (req,res)=>{
  const { date, status } = req.body;
  if(!date || !status) return res.status(400).json({error:'Missing data'});
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data[date] = status;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2));
  res.json({status:'ok'});
});

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));