const express = require("express");
const router = express.Router();

const { getAnalytics } = require("../Controllers/analytics.controller");
const { userAuthMiddleware } = require("../Middlewares/userAuthenticate.middleware");

router.get("/",userAuthMiddleware, getAnalytics);

module.exports = router;
