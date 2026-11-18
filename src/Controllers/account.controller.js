const accountModel = require("../Models/account.model");

// User can create their account
const createAccount = async (req, res) => {
  console.log(req.body);
  try {
    const { accountName, accountType, balance } = req.body;
    const account = await accountModel.create({
      user: req.user._id,
      accountName,
      accountType,
      balance,
    });

    return res.status(201).json({ message: "Account created", account });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User can get all their accounts
const getAllAccountsOfUser = async (req, res) => {
  const user = req.user._id;
  const accounts = await accountModel.find({ user });
  return res.status(200).json({ message: "All Accounts fetched", accounts });
};

// User can update their account
const updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = req.user._id;

    const { accountName, accountType, balance } = req.body;

    const updatedAccount = await accountModel.findOneAndUpdate(
      { _id: accountId, user },
      {
        $set: {
          accountName,
          accountType,
          balance,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      updatedAccount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createAccount, getAllAccountsOfUser, updateAccount };
