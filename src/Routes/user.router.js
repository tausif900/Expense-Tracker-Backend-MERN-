const express = require("express");
const {
  userRegistration,
  userLogin,
  userLogout,
} = require("../Controllers/user.controller");
const router = express.Router();

/**
 * - POST API '/api/auth/user-registration'
 * - Create new User in the Application
 */
router.post("/user-registration", userRegistration);

/**
 * - POST API '/api/auth/user-login'
 * - Login for registered User
 */
router.post("/user-login", userLogin);

/**
 * - GET API '/api/auth/user-logout'
 * - Logout for registered User
 */
router.get("/user-logout", userLogout);

module.exports = router;
