const accountModel = require("../Models/account.model");
const transactionModel = require("../Models/transaction.model");

// User creates a transaction after creating an account
const createTransaction = async (req, res) => {
  try {
    const user = req.user._id;
    // Data is coming in the request body
    const {
      accountId,
      amount,
      type,
      category,
      note,
      date,
      attachment,
      isRecurring,
      recurringFrequency,
    } = req.body;

    // Check whether account belongs to logged-in user
    const account = await accountModel.findOne({
      _id: accountId,
      user,
    });
    // if account is not found
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Create transaction
    const transaction = await transactionModel.create({
      user,
      accountId,
      amount,
      type,
      category,
      note,
      date,
      attachment,
      isRecurring,
      recurringFrequency,
    });

    // Update account balance, if type is income then add amount or subtract the amount
    const balanceChange = type === "Income" ? amount : -amount;

    // updating the balance on basis of accountId
    await accountModel.findByIdAndUpdate(accountId, {
      $inc: { balance: balanceChange },
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User can get all their transactions with pagination
const getAllTransactionsOfUser = async (req, res) => {
  try {
    const user = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // returns all the newest(latest) trasnactions of the user by id
    const transactions = await transactionModel
      .find({ user })
      .sort({ date: -1 })
      .populate("accountId")
      .skip(skip)
      .limit(limit);

    // counting documents coming from DB
    const transactionsCount = await transactionModel.countDocuments({ user });

    return res.status(200).json({
      message: "Transactions fetched Successfully",
      currentPage: page,
      totalPages: Math.ceil(transactionsCount / limit),
      transactionsCount,
      transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User can update their transaction
const updateTransaction = async (req, res) => {
  try {
    const user = req.user._id;
    const { transactionId } = req.params;

    // Find transaction belonging to logged-in user
    const transaction = await transactionModel.findOne({
      _id: transactionId,
      user,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const {
      accountId,
      amount,
      type,
      category,
      note,
      date,
      attachment,
      isRecurring,
      recurringFrequency,
    } = req.body;

    // Find old account
    const oldAccount = await accountModel.findOne({
      _id: transaction.accountId,
      user,
    });

    if (!oldAccount) {
      return res.status(404).json({
        success: false,
        message: "Old account not found",
      });
    }

    // Determine updated values
    const newAmount = amount ?? transaction.amount;
    const newType = type ?? transaction.type;
    const newAccountId = accountId ?? transaction.accountId;

    // Find new account and verify ownership
    const newAccount = await accountModel.findOne({
      _id: newAccountId,
      user,
    });

    if (!newAccount) {
      return res.status(404).json({
        success: false,
        message: "New account not found",
      });
    }

    // Calculate balance effect
    const oldEffect =
      transaction.type === "Income" ? transaction.amount : -transaction.amount;

    const newEffect = newType === "Income" ? newAmount : -newAmount;

    // If account remains the same
    if (oldAccount._id.equals(newAccount._id)) {
      await accountModel.findByIdAndUpdate(oldAccount._id, {
        $inc: { balance: newEffect - oldEffect },
      });
    } else {
      // If account is changed
      await accountModel.findByIdAndUpdate(oldAccount._id, {
        $inc: { balance: -oldEffect },
      });

      await accountModel.findByIdAndUpdate(newAccount._id, {
        $inc: { balance: newEffect },
      });
    }

    // Update transaction fields
    transaction.accountId = newAccountId;
    transaction.amount = newAmount;
    transaction.type = newType;

    if (category !== undefined) transaction.category = category;
    if (note !== undefined) transaction.note = note;
    if (date !== undefined) transaction.date = date;
    if (attachment !== undefined) transaction.attachment = attachment;
    if (isRecurring !== undefined) transaction.isRecurring = isRecurring;
    if (recurringFrequency !== undefined) {
      transaction.recurringFrequency = recurringFrequency;
    }

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User can delete their transaction
const deleteTransaction = async (req, res) => {
  try {
    const user = req.user._id;
    const { transactionId } = req.params;

    // Find user's transaction
    const transaction = await transactionModel.findOne({
      _id: transactionId,
      user,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Find associated account
    const account = await accountModel.findOne({
      _id: transaction.accountId,
      user,
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Reverse the transaction's balance effect
    const balanceChange =
      transaction.type === "Income" ? -transaction.amount : transaction.amount;

    await accountModel.findByIdAndUpdate(account._id, {
      $inc: { balance: balanceChange },
    });

    // Delete transaction
    await transactionModel.findByIdAndDelete(transactionId);

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getAllTransactionsOfUser,
  updateTransaction,
  deleteTransaction
};
