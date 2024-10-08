const express = require("express");
const {
  getPromotionData,
  betPlaceJackPod,
  myHistoryJackPod,
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
  getTotalBetAndIncomeYesterday,
  getMyHistoryTemp,
  startJackPod,
  gameHistoryJackPod,
  addFundUser,
  getUserId,
  changeUserPassword,
  ticketRaised,
  getTicketRaisedHistory,
  getTicketRaisedHistoryAdmin,
  updateTicketIssue,
  payInRequest,
  getAdminQrAddress,
  usdtPayinRequest,
  payInRequestApproval,
  payInRequestReject,
  usdtPayOutRequestAdmin,
  payOutRequestApproval,
  payOutRequestReject,
} = require("../controller");
const {
  getPaymentGateway,
  getCallBack,
  withdrawlRequest,
  withdrawlCallBack,
  update_member_withdrawal_gatway,
} = require("../controller/payment_gateway");
const router = express.Router();

////////////////// jack pot ///////////////////
router.post("/place-bid-jackpod", betPlaceJackPod);
router.get("/my-history-jackpod", myHistoryJackPod);
router.get("/game-history-jackpod", gameHistoryJackPod);
router.get("/get-jackpod-result", startJackPod);

////////// trx ///////////////////
router.get("/trx-auto-genrated-result", getGameHistory);
router.get("/trx-getColourBets", getMyHistory);
router.get("/trx-getColourBets-temp", getMyHistoryTemp);
router.post("/trx-bet", placeBetTrx);

////////   wingo api ///////////////////
router.get("/getbet-game-results", myHistoryWingo); /// my history
router.get("/colour_result", gameHistoryWingo); /// game history
router.post("/bet", placeBetWingo); /// game history
router.get(
  "/get-total-betA-ad-income-yesterday",
  getTotalBetAndIncomeYesterday
); /// game history

///////////////////// general api's ////////////////
router.get("/userwallet", getBalance);
router.get("/get-top-winners", getTopWinners);
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
router.post(
  "/transfer-amount-from-working-wallet-to-main-wallet",
  transfer_Amount_to_mainWallet_from_WorkingWallet
);
router.get(
  "/transfer-history-from-working-wallet-to-main-wallet",
  get_transfer_history_working_to_main_wallet
);
router.get("/getCashBack-report", getCashBack);
router.post("/fn_add_fun_to_user", addFundUser);
router.post("/get-user-id", getUserId);
router.post("/change-user-pass", changeUserPassword);
router.post("/ticket-raised", ticketRaised);
router.get("/ticket-raised-history", getTicketRaisedHistory);
router.get("/ticket-raised-history-admin", getTicketRaisedHistoryAdmin);
router.post("/ticket-resolve-history-admin", updateTicketIssue);

// usdt manual
router.get("/admin-qr-address", getAdminQrAddress);
// router.post("/payout-request", payOutRequest);
router.post("/payin-request", payInRequest);
router.get("/usdt-payin-requst-admin", usdtPayinRequest);
router.get("/payin-request-approve", payInRequestApproval);
router.get("/payin-request-reject", payInRequestReject);

router.get("/usdt-payout-request-admin", usdtPayOutRequestAdmin);
router.get("/payout-request-approve", payOutRequestApproval);
router.get("/payout-request-reject", payOutRequestReject);

module.exports = router;
