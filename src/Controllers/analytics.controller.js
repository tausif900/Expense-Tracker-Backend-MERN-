const transactionModel = require("../Models/transaction.model");

const getAnalytics = async (req, res) => {
  try {
    const user = req.user._id;
    const now = new Date();

    // India timezone month boundaries
    const getMonthStart = (year, month) =>
      new Date(Date.UTC(year, month, 1) - 330 * 60 * 1000);

    const currentMonthStart = getMonthStart(
      now.getFullYear(),
      now.getMonth()
    );

    const nextMonthStart = getMonthStart(
      now.getFullYear(),
      now.getMonth() + 1
    );

    const twelveMonthsStart = getMonthStart(
      now.getFullYear(),
      now.getMonth() - 11
    );

    // Monthly income and expenses
    const monthlySummary = await transactionModel.aggregate([
      {
        $match: {
          user,
          date: {
            $gte: currentMonthStart,
            $lt: nextMonthStart,
          },
        },
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    // Monthly trends for the last 12 months
    const monthlyTrends = await transactionModel.aggregate([
      {
        $match: {
          user,
          date: {
            $gte: twelveMonthsStart,
            $lt: nextMonthStart,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$date",
              timezone: "Asia/Kolkata",
            },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Current month's category-wise expenses
    const categoryBreakdown = await transactionModel.aggregate([
      {
        $match: {
          user,
          type: "Expense",
          date: {
            $gte: currentMonthStart,
            $lt: nextMonthStart,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const summary = monthlySummary[0] || {
      income: 0,
      expenses: 0,
    };

    return res.status(200).json({
      success: true,
      analytics: {
        monthlyIncome: summary.income,
        monthlyExpenses: summary.expenses,
        monthlySavings: summary.income - summary.expenses,
        monthlyTrends: monthlyTrends.map((item) => ({
          month: item._id,
          income: item.income,
          expenses: item.expenses,
          savings: item.income - item.expenses,
        })),
        categoryBreakdown,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAnalytics };