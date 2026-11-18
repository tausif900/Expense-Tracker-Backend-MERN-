const express = require("express");
const {
  userAuthMiddleware,
} = require("../Middlewares/userAuthenticate.middleware");
const {
  createTransaction,
  getAllTransactionsOfUser,
  updateTransaction,
  deleteTransaction,
} = require("../Controllers/transaction.controller");
const router = express.Router();

/**
 * - POST API "/api/transaction/create-transaction"
 */
router.post("/create-transaction", userAuthMiddleware, createTransaction);

/**
 * - GET API "/api/transaction/get-all-transactions"
 */
router.get(
  "/get-all-transactions",
  userAuthMiddleware,
  getAllTransactionsOfUser,
);

/**
 * - PUT API "/api/transaction/update-transaction/:transactionId"
 */
router.put(
  "/update-transaction/:transactionId",
  userAuthMiddleware,
  updateTransaction,
);

/**
 * - DLETE API "/api/transaction/delete-transaction/:transactionId"
 */
router.delete(
  "/delete-transaction/:transactionId",
  userAuthMiddleware,
  deleteTransaction,
);

module.exports = router;
