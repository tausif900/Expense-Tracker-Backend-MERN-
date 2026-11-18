const budgetModel = require("../Models/budget.model");

// Create Budget
const createBudget = async (req, res) => {
  try {
    const user = req.user._id;
    const { amount, month, year } = req.body;

    const budget = await budgetModel.create({
      user,
      amount,
      month,
      year,
    });

    return res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Budget already exists for this month",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Current Month Budget
const getBudget = async (req, res) => {
  try {
    const user = req.user._id;

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budget = await budgetModel.findOne({
      user,
      month,
      year,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found for this month",
      });
    }

    return res.status(200).json({
      success: true,
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Budget
const updateBudget = async (req, res) => {
  try {
    const user = req.user._id;
    const { budgetId } = req.params;
    const { amount } = req.body;

    const budget = await budgetModel.findOneAndUpdate(
      { _id: budgetId, user },
      { $set: { amount } },
      { returnDocument: "after", runValidators: true },
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Budget
const deleteBudget = async (req, res) => {
  try {
    const user = req.user._id;
    const { budgetId } = req.params;

    const budget = await budgetModel.findOneAndDelete({
      _id: budgetId,
      user,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBudget,
  getBudget,
  updateBudget,
  deleteBudget,
};
