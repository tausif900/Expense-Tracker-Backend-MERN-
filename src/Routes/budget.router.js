const express = require("express");
const router = express.Router();

const {
  createBudget,
  getBudget,
  updateBudget,
  deleteBudget,
} = require("../Controllers/budget.controller");

const {
  userAuthMiddleware,
} = require("../Middlewares/userAuthenticate.middleware");

router.post("/create-budget", userAuthMiddleware, createBudget);
router.get("/get-budget", userAuthMiddleware, getBudget);
router.put("/update-budget/:budgetId", userAuthMiddleware, updateBudget);
router.delete("/delete-budget/:budgetId", userAuthMiddleware, deleteBudget);

module.exports = router;
