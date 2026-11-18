const express = require("express");
const authRouter = require("./Routes/user.router");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const accountRouter = require("./Routes/account.router");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Router for User Registration and User login
app.use("/api/auth", authRouter);

// Router for Account
app.use("/api/account", accountRouter);

module.exports = app;
