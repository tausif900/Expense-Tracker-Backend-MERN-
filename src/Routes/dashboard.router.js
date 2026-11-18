const express = require("express");
const router = express.Router();

const { getDashboardData } = require("../Controllers/dashboard.controller");
const {
  userAuthMiddleware,
} = require("../Middlewares/userAuthenticate.middleware");

/**
 * - GET API "/api/dashboard/dashboard-data"
 */
router.get("/dashboard-data", userAuthMiddleware, getDashboardData);

module.exports = router;
