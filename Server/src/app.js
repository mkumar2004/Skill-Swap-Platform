const express = require("express");
const cors = require("cors");
const cp = require("cookie-parser")
const app = express();
const authrRoutes = require('./router/authRoutes')

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());
app.use(cp());

// api 
app.use("/api/auth",authrRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Node.js server is running",
  });
});

module.exports = app;
