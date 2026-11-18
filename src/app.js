const express = require("express");
const authRouter = require("./Routes/user.router");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const accountRouter = require("./Routes/account.router");
const transactionRouter = require("./Routes/tranasction.router");
const dashboardRouter = require("./Routes/dashboard.router");
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

// Router for Transaction
app.use("/api/transaction", transactionRouter);

// Routes to show data on dashboard
app.use("/api/dashboard", dashboardRouter);

module.exports = app;
