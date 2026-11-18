const savingsModel = require("../Models/saving.model");

// Create Savings Goal
const createSavingsGoal = async (req, res) => {
  try {
    const user = req.user._id;

    const { goalName, targetAmount, currentAmount, targetDate } = req.body;

    const goal = await savingsModel.create({
      user,
      goalName,
      targetAmount,
      currentAmount,
      targetDate,
    });

    return res.status(201).json({
      success: true,
      message: "Savings goal created successfully",
      goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Savings Goals
const getAllSavingsGoals = async (req, res) => {
  try {
    const user = req.user._id;

    const goals = await savingsModel.find({ user }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      totalGoals: goals.length,
      goals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Savings Goal
const updateSavingsGoal = async (req, res) => {
  try {
    const user = req.user._id;
    const { goalId } = req.params;

    const { goalName, targetAmount, currentAmount, targetDate } = req.body;

    const updates = {};

    if (goalName !== undefined) updates.goalName = goalName;
    if (targetAmount !== undefined) updates.targetAmount = targetAmount;
    if (currentAmount !== undefined) updates.currentAmount = currentAmount;
    if (targetDate !== undefined) updates.targetDate = targetDate;

    const goal = await savingsModel.findOneAndUpdate(
      { _id: goalId, user },
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Savings goal updated successfully",
      goal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Savings Goal
const deleteSavingsGoal = async (req, res) => {
  try {
    const user = req.user._id;
    const { goalId } = req.params;

    const goal = await savingsModel.findOneAndDelete({
      _id: goalId,
      user,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Savings goal deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSavingsGoal,
  getAllSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
};
