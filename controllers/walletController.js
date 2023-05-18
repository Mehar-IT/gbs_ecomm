const Wallet = require("../models/walletModel");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

exports.createWallet = asyncErrorHandler(async (req, res, next) => {
  const { walletAddres } = req.body;

  const wallet = await Wallet({
    walletAddres,
  });

  await wallet.save({ validateBeforeSave: true });

  res.status(201).json({
    success: true,
    wallet,
  });
});

exports.getLatestWallet = asyncErrorHandler(async (req, res, next) => {
  const wallets = await Wallet.findOne().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    wallets,
  });
});
