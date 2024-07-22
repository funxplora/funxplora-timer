const express = require("express");
const {
  getPromotionData,
  betPlaceJackPod,
  myHistoryJackPod,
  gameHistoryJackPod,
  chnagePassWord,
  jackpodResult,
} = require("../controller");
const router = express.Router();

router.get("/promotiondata", getPromotionData);
router.post("/place-bid-jackpod", betPlaceJackPod);
router.post("/my-history-jackpod", myHistoryJackPod);
router.get("/game-history-jackpod", gameHistoryJackPod);
router.get("/get-jackpod-result", jackpodResult);
router.post("/change-password", chnagePassWord);

module.exports = router;
