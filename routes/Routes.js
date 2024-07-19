const express = require("express");
const {
  getPromotionData,
  betPlaceJackPod,
  myHistoryJackPod,
  gameHistoryJackPod,
} = require("../controller");
const router = express.Router();

router.get("/promotiondata", getPromotionData);
router.post("/place-bid-jackpod", betPlaceJackPod);
router.post("/my-history-jackpod", myHistoryJackPod);
router.get("/game-history-jackpod", gameHistoryJackPod);

module.exports = router;
