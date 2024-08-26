const express = require("express");
const {
  getPromotionData,
  betPlaceJackPod,
  myHistoryJackPod,
  gameHistoryJackPod,
  chnagePassWord,
  getGameHistory,
  getMyHistory,
  placeBetTrx,
  loginPage,
  myHistoryWingo,
  placeBetWingo,
  gameHistoryWingo,
  getBalance,
  getLevels,
  getDepositlHistory,
  addUSDTAddress,
  uddtAddressHistory,
  getWithdrawlHistory,
  getLevelIncome,
  getStatus,
  getSubOrdinateData,
  getAllCommission,
  transfer_Amount_to_mainWallet_from_WorkingWallet,
  get_transfer_history_working_to_main_wallet,
  getDailySalaryIncome,
  getWeeklySalaryIncome,
  getTopWinners,
  getSelfDepositBonus,
  getSponsorIncome,
  needToBet,
  getCashBack,
} = require("../controller");
const { getPaymentGateway, getCallBack, withdrawlRequest, withdrawlCallBack, update_member_withdrawal_gatway } = require("../controller/payment_gateway");
const router = express.Router();

////////////////// jack pot ///////////////////
router.post("/place-bid-jackpod", betPlaceJackPod);
router.get("/my-history-jackpod", myHistoryJackPod);
router.get("/game-history-jackpod", gameHistoryJackPod);

////////// trx ///////////////////
router.get("/trx-auto-genrated-result", getGameHistory);
router.get("/trx-getColourBets", getMyHistory);
router.post("/trx-bet", placeBetTrx);

////////   wingo api ///////////////////
router.get("/getbet-game-results", myHistoryWingo); /// my history
router.get("/colour_result", gameHistoryWingo); /// game history
router.post("/bet", placeBetWingo); /// game history

///////////////////// general api's ////////////////
router.get("/userwallet",getBalance );
router.get("/get-top-winners",getTopWinners);
router.post("/user_login", loginPage);
router.post("/change-password", chnagePassWord);
router.get("/promotiondata", getPromotionData);
router.get("/get-level", getLevels);
router.post("/payment", getPaymentGateway);
router.post("/call-back", getCallBack);
router.get("/coin-payment-deposit-history", getDepositlHistory);
router.get("/coin-payment-withdrawl-history", getWithdrawlHistory);
router.post("/withdrawl-request", withdrawlRequest);
router.post("/add-usdt-address", addUSDTAddress);
router.get("/usdt-address-record", uddtAddressHistory);
router.post("/withdrawlCallBack", withdrawlCallBack);
router.get("/approve-by-admin", update_member_withdrawal_gatway);
router.get("/level-income", getLevelIncome);
router.get("/self-deposit-bonus", getSelfDepositBonus);
router.get("/sponsor-income", getSponsorIncome);
router.get("/need-to-bet", needToBet);
router.get("/daily-salary-icome", getDailySalaryIncome);
router.get("/weekly-salary-icome", getWeeklySalaryIncome);
router.get("/get-status", getStatus);
router.post("/get-subordinate-data-funx", getSubOrdinateData);
router.post("/get-commisssion-data-funx", getAllCommission);
router.post("/transfer-amount-from-working-wallet-to-main-wallet", transfer_Amount_to_mainWallet_from_WorkingWallet);
router.get("/transfer-history-from-working-wallet-to-main-wallet", get_transfer_history_working_to_main_wallet);
router.get("/getCashBack-report", getCashBack);


module.exports = router;
