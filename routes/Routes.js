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
} = require("../controller");
const { getPaymentGateway, getCallBack, withdrawlRequest, withdrawlCallBack, update_member_withdrawal_gatway, withdrawl_testing } = require("../controller/payment_gateway");
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


module.exports = router;
