const transactionModel = require("../Models/transaction.model");
const accountModel = require("../Models/account.model");

const getDashboardData = async (req, res) => {
  try {
    const user = req.user._id;

    // Current month date range (UTC)
    const now = new Date();

    const monthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );

    const nextMonthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    // Calculate total and monthly income/expenses
    const transactionStats = await transactionModel.aggregate([
      {
        $match: { user },
      },
      {
        $group: {
          _id: null,

          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
            },
          },

          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
            },
          },

          monthlyIncome: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$type", "Income"] },
                    { $gte: ["$date", monthStart] },
                    { $lt: ["$date", nextMonthStart] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },

          monthlyExpenses: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$type", "Expense"] },
                    { $gte: ["$date", monthStart] },
                    { $lt: ["$date", nextMonthStart] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
    ]);

    // Get combined balance from all user accounts
    const accountStats = await accountModel.aggregate([
      {
        $match: { user },
      },
      {
        $group: {
          _id: null,
          currentBalance: { $sum: "$balance" },
        },
      },
    ]);

    // Get latest 5 transactions
    const recentTransactions = await transactionModel
      .find({ user })
      .sort({ date: -1 })
      .limit(5)
      .populate("accountId", "accountName accountType");

    const stats = transactionStats[0] || {};
    const accounts = accountStats[0] || {};

    return res.status(200).json({
      success: true,
      dashboard: {
        totalIncome: stats.totalIncome || 0,
        totalExpenses: stats.totalExpenses || 0,
        currentBalance: accounts.currentBalance || 0,
        monthlyIncome: stats.monthlyIncome || 0,
        monthlyExpenses: stats.monthlyExpenses || 0,
        recentTransactions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashboardData };
