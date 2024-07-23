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
} = require("../controller");
const router = express.Router();

router.get("/promotiondata", getPromotionData);
router.post("/place-bid-jackpod", betPlaceJackPod);
router.get("/my-history-jackpod", myHistoryJackPod);
router.get("/game-history-jackpod", gameHistoryJackPod);
// router.get("/get-jackpod-result", jackpodResult);
router.post("/change-password", chnagePassWord);

router.get("/trx-auto-genrated-result", getGameHistory);
router.get("/trx-getColourBets", getMyHistory);
router.post("/trx-bet", placeBetTrx);
router.post("/user_login", loginPage);
module.exports = router;
