const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname)));   // ให้เสิร์ฟไฟล์ทั้งหมดในโฟลเดอร์นี้

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Render ให้ PORT อัตโนมัติ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
