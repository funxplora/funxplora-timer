const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const httpServer = http.createServer(app);
const allroutes = require("./controller/index");
const moment = require("moment");
const soment = require("moment-timezone");
const allRoutes = require("./routes/Routes");
const {
  queryDb,
  randomStr,
  getTransactionidForJackPod,
  jackPodClearBet,
  updateMediatorTableJackPod,
} = require("./helper/adminHelper");
const schedule = require("node-cron");

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  },
});
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const PORT = process.env.PORT || 2000;
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api/v1", allRoutes);
io.on("connection", (socket) => {});

let x = true;
let trx = true;

if (x) {
  // generateAndSendMessage();
  console.log("Waiting for the next minute to start...");
  const now = new Date();
  const secondsUntilNextMinute = 60 - now.getSeconds();
  console.log(
    "start after ",
    moment(new Date()).format("HH:mm:ss"),
    secondsUntilNextMinute
  );
  // allroutes.generatedTimeEveryAfterEveryOneMinTRX(io);
  // allroutes.generatedTimeEveryAfterEveryOneMin(io);
  // allroutes.generatedTimeEveryAfterEveryThreeMin(io);
  // allroutes.generatedTimeEveryAfterEveryFiveMin(io);
  setTimeout(() => {
    allroutes.generatedTimeEveryAfterEveryOneMinTRX(io);
    allroutes.generatedTimeEveryAfterEveryOneMin(io);
    x = false;
  }, secondsUntilNextMinute * 1000);
}
if (trx) {
  const now = new Date();
  const nowIST = soment(now).tz("Asia/Kolkata");

  const currentMinute = nowIST.minutes();
  const currentSecond = nowIST.seconds();

  const minutesRemaining = 60 - currentMinute - 1;
  const secondsRemaining = 60 - currentSecond;

  const delay = (minutesRemaining * 60 + secondsRemaining) * 1000;
  console.log(minutesRemaining, secondsRemaining, delay);

  setTimeout(() => {
    // allroutes.generatedTimeEveryAfterEveryThreeMinTRX(io);
    // allroutes.generatedTimeEveryAfterEveryFiveMinTRX(io);
    trx = false;
  }, delay);
}

const generatedTimeEveryAfterEveryFiveMinTRXJackPod = () => {
  let min = 0;
  let sec = 60;
  let jackpodTrxJob = schedule.schedule("* * * * * *", async function () {
    // let interval = setInterval(async () => {
    const currentTime = sec;
    sec = sec - 1;
    if (sec < 0) {
      sec = 59;
    }
    const timeToSend = sec;
    io.emit("fivemintrxjackpod", `${min}_${timeToSend}`);
    console.log(`${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 6) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();

      //////////////////// get transaction id /////////////////////
      await getTransactionidForJackPod([])
        .then(async (result) => {
          //////////////////// get manual result ///////////////////
          const trans_id = result?.[0]?.tr_tranaction_id;
          const get_result_for_transid = `SELECT result FROM trx_manual_result where tr_type = ? AND trans_id = ?;`;
          await queryDb(get_result_for_transid, [
            4,
            String(Number(trans_id) + 1),
          ])
            .then((result) => {
              const result_arrray = [2002, 1000, 3002, 3001, 2001, 2005, 2004];
              let result_number =
                result?.[0]?.result ||
                result_arrray[Math.floor(Math.random() * result_arrray.length)];

              setTimeout(async () => {
                const query = `CALL sp_insert_trx_five_min_jackpod_result(?, ?, ?, ?, ?, ?, ?)`;
                await queryDb(query, [
                  result_number,
                  String(moment(time).format("HH:mm:ss")),
                  4,
                  `**${randomStr(4, "0123456789abcdefghijklmnopqrstuvwxyz")}`,
                  JSON.stringify(
                    randomStr(10, "0123456789abcdefghijklmnopqrstuvwxyz")
                  ),
                  `${randomStr(
                    10,
                    "0123456789abcdefghijklmnopqrstuvwxyz"
                  )?.slice(-5)}`,
                  randomStr(8, "0123456789"),
                ])
                  .then((result) => {})
                  .catch((e) => {
                    console.log(e);
                  });

                ////////////////////// clear bet ////////////
                await jackPodClearBet([String(result_number)])
                  .then((result) => {})
                  .catch((e) => {
                    console.log(e);
                  });
                //////////// update mediator table //////////////////////
                await updateMediatorTableJackPod([0, 0])
                  .then((result) => {})
                  .catch((e) => {
                    console.log(e);
                  });
              }, [1000]);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) {
        clearInterval(interval);
        jackpodTrxJob?.cancel();
        jackpodTrxJob?.cancel();
        jackpodTrxJob?.cancel();
        min = 0;
        sec = 0;
      } // Reset min to 4 when it reaches 0
    }
    // }, 1000);
  });
};

const jackpodResult = async (req, res) => {
  // setTimeout(() => {
  try {
    generatedTimeEveryAfterEveryFiveMinTRXJackPod();
    return res.status(200)?.json({
      msg: "APi hit successfully",
    });
  } catch (e) {
    console.log("error in end point function", e);
  }
  // }, 2000);
};
//
// app.get("/api/v1/get-jackpod-result", jackpodResult);
app.get("/", (req, res) => {
  res.status(200).json({
    msg: "Server is running on port 2343",
  });
});

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
