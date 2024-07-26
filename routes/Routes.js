const express = require("express");
const {
  getPromotionData,
  betPlaceJackPod,
  myHistoryJackPod,
  gameHistoryJackPod,
  chnagePassWord,
  jackpodResult,
  getGameHistory,
  getMyHistory,
  placeBetTrx,
  loginPage,
  myHistoryWingo,
  placeBetWingo,
  gameHistoryWingo,
  getBalance,
} = require("../controller");
const router = express.Router();

router.get("/promotiondata", getPromotionData);
router.post("/place-bid-jackpod", betPlaceJackPod);
router.get("/my-history-jackpod", myHistoryJackPod);
router.get("/game-history-jackpod", gameHistoryJackPod);
// router.get("/get-jackpod-result", jackpodResult);
router.post("/change-password", chnagePassWord);

////////// trx ///////////////////
router.get("/trx-auto-genrated-result", getGameHistory);
router.get("/trx-getColourBets", getMyHistory);
router.post("/trx-bet", placeBetTrx);
router.post("/user_login", loginPage);
router.get("/userwallet",getBalance );

////////   wingo api ///////////////////
router.get("/getbet-game-results", myHistoryWingo); /// my history
router.get("/colour_result", gameHistoryWingo); /// game history
router.post("/bet", placeBetWingo); /// game history

/////////////////////// wingo ///////////

module.exports = router;
