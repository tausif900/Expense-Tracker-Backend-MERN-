const express = require("express");
const {
  createAccount,
  getAllAccountsOfUser,
  updateAccount,
  deleteAccount,
} = require("../Controllers/account.controller");
const {
  userAuthMiddleware,
} = require("../Middlewares/userAuthenticate.middleware");
const router = express.Router();

/**
 * - POST API "api/account/create-account"
 * - this api will create the account for the registered User
 */
router.post("/create-account", userAuthMiddleware, createAccount);

/**
 * - GET API "api/account/get-all-accounts"
 * - this api will fetch all the accounts of the loged-In  User
 */
router.get("/get-all-accounts", userAuthMiddleware, getAllAccountsOfUser);

/**
 * - PUT API "api/account/update-account/:accountId"
 * - Through this api, user can update their account based on the acc id
 */
router.put("/update-account/:accountId", userAuthMiddleware, updateAccount);

/**
 * - DELETE API "api/account/delete-account/:accountId"
 * - Through this api, user can delete their account based on the acc id
 */
router.delete("/delete-account/:accountId", userAuthMiddleware, deleteAccount);

module.exports = router;
