
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
// serve frontend static if requested (optional)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const DB = path.join(__dirname, 'database.json');
if(!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({departments:{check100:[],packing:[],loading:[]}, records:[]}));

function readDB(){ return JSON.parse(fs.readFileSync(DB)); }
function writeDB(d){ fs.writeFileSync(DB, JSON.stringify(d,null,2)); }

// employees list (20 each)
app.get('/api/employees', (req,res)=>{
  const db = readDB();
  // if departments empty, create 20 sample employees
  if(Object.keys(db.departments).length === 0){
    db.departments = {check100:[], packing:[], loading:[]};
    ['check100','packing','loading'].forEach(k=>{
      db.departments[k] = Array.from({length:20}, (_,i)=> ({id:i+1, name:'พนักงาน '+(i+1)}));
    });
    writeDB(db);
  }
  res.json(db.departments);
});

// save attendance: body {dept,user,records}
app.post('/api/save', (req,res)=>{
  const {dept, user, records} = req.body;
  const db = readDB();
  if(!db.departments[dept]) db.departments[dept] = [];
  db.departments[dept] = { user, date: new Date().toISOString().split('T')[0], records };
  db.records.push({dept, user, date: new Date().toISOString().split('T')[0], records});
  writeDB(db);
  res.json({ok:true});
});

app.get('/api/all', (req,res)=>{ res.json(readDB()); });

// export CSV (organization)
app.get('/api/export', (req,res)=>{
  const db = readDB();
  let csv = 'dept,user,date,empid,name,am,ot,absent,leave,note\n';
  db.records.forEach(entry=>{
    entry.records.forEach(r=>{
      csv += [entry.dept, entry.user, entry.date, r.id, 'พนักงาน '+r.id, r.am, r.ot, r.absent, r.leave||'', (r.note||'').replace(/\n/g,' ')].join(',') + '\n';
    });
  });
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition','attachment; filename=org_export.csv');
  res.send(csv);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Backend running on', PORT));
