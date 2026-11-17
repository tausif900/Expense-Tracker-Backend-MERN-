const express = require("express");
const authRouter = require("./Routes/user.router");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Router for User Registration and User login
app.use("/api/auth", authRouter);

module.exports = app;
