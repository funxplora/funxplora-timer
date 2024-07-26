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
const { randomStr, queryDb } = require("./helper/adminHelper");

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
  setTimeout(() => {
    allroutes.generatedTimeEveryAfterEveryOneMinTRX(io);
    allroutes.generatedTimeEveryAfterEveryOneMin(io);
    allroutes.generatedTimeEveryAfterEveryThreeMin(io);
    allroutes.generatedTimeEveryAfterEveryFiveMin(io);
    x = false;
  }, secondsUntilNextMinute * 1000);
}

if (trx) {
  const now = new Date();
  const nowIST = soment(now).tz("Asia/Kolkata");

  const currentMinute = nowIST.minutes();
  const currentSecond = nowIST.seconds();

  const minutesRemaining = 45 - currentMinute - 1;
  const secondsRemaining = 60 - currentSecond;

  const delay = (minutesRemaining * 60 + secondsRemaining) * 1000;
  console.log(minutesRemaining, secondsRemaining, delay);

  setTimeout(() => {
    // allroutes.generatedTimeEveryAfterEveryThreeMinTRX(io);
    // allroutes.generatedTimeEveryAfterEveryFiveMinTRX(io);
    trx = false;
  }, delay);
}

const jackpodResult = async (req, res) => {
  setTimeout(() => {
    try {
      allroutes.generatedTimeEveryAfterEveryFiveMinTRXJackPod(io);
      return res.status(200)?.json({
        msg: "APi hit successfully",
      });
    } catch (e) {
      console.log("error in end point function", e);
    }
  }, 2000);
};

app.get("/api/v1/get-jackpod-result", jackpodResult);

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "Server is running on port 2343",
  });
});

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
