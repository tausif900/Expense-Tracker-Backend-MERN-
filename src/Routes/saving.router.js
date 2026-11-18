const express = require("express");
const router = express.Router();

const {
  createSavingsGoal,
  getAllSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
} = require("../Controllers/saving.controller");
const {
  userAuthMiddleware,
} = require("../Middlewares/userAuthenticate.middleware");

router.post("/create-goal", userAuthMiddleware, createSavingsGoal);
router.get("/get-goals", userAuthMiddleware, getAllSavingsGoals);
router.put("/update-goal/:goalId", userAuthMiddleware, updateSavingsGoal);
router.delete("/delete-goal/:goalId", userAuthMiddleware, deleteSavingsGoal);

module.exports = router;
