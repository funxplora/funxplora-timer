const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const todoRoutes = require("./routes/todos");
const moment = require("moment");
const soment = require("moment-timezone");
require("dotenv").config();
const mysql = require("mysql");
const schedule = require("node-schedule");
const { default: axios } = require("axios");
const app = express();
const httpServer = http.createServer(app);
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

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/api/v1", todoRoutes);

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_URL,
  multipleStatements: true,
  connectTimeout: 10000,
});

// Event listener for new connections
pool.on("connection", function (_conn) {
  if (_conn) {
    console.log(`Connected to the database via threadId ${_conn.threadId}!!`);
    _conn.query("SET SESSION auto_increment_increment=1");
  }
});

const job = schedule.scheduleJob("30 0 * * *", async function () {
  console.log("Message nhi aaya hai.");
  try {
    // Make the API call using axios
    const response = await axios.get(
      "https://admin.funxplora.com/api/Daily-salary-income"
    );

    setTimeout(async () => {
      try {
        await axios.get("https://admin.funxplora.com/api/bet-income");
      } catch (e) {
        console.log(e);
      }

      setTimeout(async () => {
        await axios.get("https://admin.funxplora.com/api/wallet-income");
      }, 3000);
    }, 2000);

    setTimeout(async () => {
      try {
        // await axios.get("https://admin.funxplora.com/api/direct-income");
        await axios.get(
          "https://admin.funxplora.com/api/daily-non-working-bonus"
        );
      } catch (e) {
        console.log(e);
      }
    }, 3000);
  } catch (error) {
    console.error("Error:", error.message);
  }
});

let twoMinTrxJob;
let threeMinTrxJob;
let jackpodTrxJob;

// color prediction game time generated every 1 min
function generatedTimeEveryAfterEveryOneMin() {
  const job = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemin", timeToSend); // Emit the formatted time
    if (timeToSend === 3) {
      // oneMinCheckResult();
      oneMinColorWinning();
    }
  });
}

const oneMinColorWinning = async () => {
  try {
    await axios.get(
      `https://admin.funxplora.com/api/colour_winning?id=1&gid=1`
    );
  } catch (e) {
    console.log(e);
  }
};

// color prediction game time generated every 3 min
const generatedTimeEveryAfterEveryThreeMin = () => {
  let min = 2;
  const rule = new schedule.RecurrenceRule();
  rule.second = new schedule.Range(0, 59);
  const job = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemin", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 25) {
      // oneMinCheckResult2min();
      oneMinColorWinning2min();
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};

const oneMinCheckResult2min = async () => {
  try {
    await axios.get(`https://admin.funxplora.com/api/checkresult`);
  } catch (e) {
    console.log(e);
  }
};
const oneMinColorWinning2min = async () => {
  try {
    await axios.get(
      `https://admin.funxplora.com/api/colour_winning?id=2&gid=2`
    );
  } catch (e) {
    console.log(e);
  }
};

const generatedTimeEveryAfterEveryFiveMin = () => {
  let min = 4;
  const rule = new schedule.RecurrenceRule();
  rule.second = new schedule.Range(0, 59);
  const job = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemin", `${min}_${timeToSend}`);

    if (
      timeToSend === 40 && // this is for sec
      min === 0 // this is for minut
    ) {
      // oneMinCheckResult3sec();
      oneMinColorWinning3sec();
    }
    ///
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 2 when it reaches 0
    }
  });
};

const oneMinCheckResult3sec = async () => {
  try {
    await axios.get(`https://admin.funxplora.com/api/checkresult`);
  } catch (e) {
    console.log(e);
  }
};
const oneMinColorWinning3sec = async () => {
  try {
    await axios.get(
      `https://admin.funxplora.com/api/colour_winning?id=3&gid=3`
    );
  } catch (e) {
    console.log(e);
  }
};

// color prediction game time generated every 1 min
function generatedTimeEveryAfterEveryOneMinTRX() {
  let three = 0;
  let five = 0;
  const rule = new schedule.RecurrenceRule();
  rule.second = new schedule.Range(0, 59);
  let oneMinTrxJob = schedule.scheduleJob(rule, function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemintrx", timeToSend);
    if (timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
      try {
        if (three === 2) {
          three = 0;
        } else {
          three++;
        }

        if (five === 4) {
          five = 0;
        } else {
          five++;
        }
        setTimeout(async () => {
          const res = await axios.get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          );
          if (res?.data?.data[0]) {
            const obj = res.data.data[0];
            // const fd = new FormData();
            // fd.append("hash", `**${obj.hash.slice(-4)}`);
            // fd.append("digits", `${obj.hash.slice(-5)}`);
            // fd.append("number", obj.number);
            // fd.append("time", moment(time).format("HH:mm:ss"));

            const newString = obj.hash;
            let num = null;
            for (let i = newString.length - 1; i >= 0; i--) {
              if (!isNaN(parseInt(newString[i]))) {
                num = parseInt(newString[i]);
                break;
              }
            }
            // fd.append("slotid", num);
            // fd.append("overall", JSON.stringify(obj));
            //  trx 1
            try {
              // const response = await axios.post(
              //   "https://admin.funxplora.com/api/insert-one-trx",
              //   fd
              // );
              console.log(
                num,
                "This is number need to send to the sql procedure"
              );
              pool.getConnection((err, con) => {
                if (err) {
                  console.error("Error getting database connection: ", err);
                  return res.status(500).json({
                    msg: `Something went wrong ${err}`,
                  });
                }
                const query = `CALL sp_insert_trx_one_min_result(?, ?, ?, ?, ?, ?, ?)`;
                con.query(
                  query,
                  [
                    num,
                    String(moment(time).format("HH:mm:ss")),
                    1,
                    `**${obj.hash.slice(-4)}`,
                    JSON.stringify(obj),
                    `${obj.hash.slice(-5)}`,
                    obj.number,
                  ],
                  (err, resule) => {
                    con?.release();
                    if (err) {
                      console.log(err);
                      return res.status(500).json({
                        msg: "Something went wrong related with databse",
                      });
                    }
                  }
                );
              });
            } catch (e) {
              console.log(e);
            }
            try {
              const response = await axios.get(
                `https://admin.funxplora.com/api/trx-winning-result?number=${num}&gameid=1`
              );
            } catch (e) {
              console.log(e);
            }
          }
        }, [4000]);
      } catch (e) {
        console.log(e);
      }
    }
  });
}

const generatedTimeEveryAfterEveryThreeMinTRX = () => {
  let min = 2;
  twoMinTrxJob = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
      try {
        setTimeout(async () => {
          const res = await axios.get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          );
          if (res?.data?.data[0]) {
            const obj = res.data.data[0];
            // const fd = new FormData();
            // fd.append("hash", `**${obj.hash.slice(-4)}`);
            // fd.append("digits", `${obj.hash.slice(-5)}`);
            // fd.append("number", obj.number);
            // fd.append("time", moment(time).format("HH:mm:ss"));
            const newString = obj.hash;
            let num = null;
            for (let i = newString.length - 1; i >= 0; i--) {
              if (!isNaN(parseInt(newString[i]))) {
                num = parseInt(newString[i]);
                break;
              }
            }
            // fd.append("slotid", num);
            // fd.append("overall", JSON.stringify(obj));
            //  trx 3
            try {
              // const response = await axios.post(
              //   "https://admin.funxplora.com/api/insert-three-trx",
              //   fd
              // );

              pool.getConnection((err, con) => {
                if (err) {
                  console.error("Error getting database connection: ", err);
                  return res.status(500).json({
                    msg: `Something went wrong ${err}`,
                  });
                }
                const query = `CALL sp_insert_trx_three_min_result(?, ?, ?, ?, ?, ?, ?)`;
                con.query(
                  query,
                  [
                    num,
                    String(moment(time).format("HH:mm:ss")),
                    2,
                    `**${obj.hash.slice(-4)}`,
                    JSON.stringify(obj),
                    `${obj.hash.slice(-5)}`,
                    obj.number,
                  ],
                  (err, resule) => {
                    con?.release();
                    if (err) {
                      console.log(err);
                      return res.status(500).json({
                        msg: "Something went wrong related with databse",
                      });
                    }
                  }
                );
              });
            } catch (e) {
              console.log(e);
            }
            try {
              const response = await axios.get(
                `https://admin.funxplora.com/api/trx-winning-result?number=${num}&gameid=2`
              );
            } catch (e) {
              console.log(e);
            }
          }
        }, [4000]);
      } catch (e) {
        console.log(e);
      }
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};

const generatedTimeEveryAfterEveryFiveMinTRX = () => {
  let min = 4;
  threeMinTrxJob = schedule.scheduleJob("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
      try {
        setTimeout(async () => {
          const res = await axios.get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          );
          if (res?.data?.data[0]) {
            const obj = res.data.data[0];
            // const fd = new FormData();
            // fd.append("hash", `**${obj.hash.slice(-4)}`);
            // fd.append("digits", `${obj.hash.slice(-5)}`);
            // fd.append("number", obj.number);
            // fd.append("time", moment(time).format("HH:mm:ss"));
            const newString = obj.hash;
            let num = null;
            for (let i = newString.length - 1; i >= 0; i--) {
              if (!isNaN(parseInt(newString[i]))) {
                num = parseInt(newString[i]);
                break;
              }
            }
            // fd.append("slotid", num);
            // fd.append("overall", JSON.stringify(obj));
            //  trx 3
            try {
              pool.getConnection((err, con) => {
                if (err) {
                  console.error("Error getting database connection: ", err);
                  return res.status(500).json({
                    msg: `Something went wrong ${err}`,
                  });
                }
                const query = `CALL sp_insert_trx_five_min_result(?, ?, ?, ?, ?, ?, ?)`;
                con.query(
                  query,
                  [
                    num,
                    String(moment(time).format("HH:mm:ss")),
                    3,
                    `**${obj.hash.slice(-4)}`,
                    JSON.stringify(obj),
                    `${obj.hash.slice(-5)}`,
                    obj.number,
                  ],
                  (err, resule) => {
                    con?.release();
                    if (err) {
                      console.log(err);
                      return res.status(500).json({
                        msg: "Something went wrong related with databse",
                      });
                    }
                  }
                );
              });

              // const response = await axios.post(
              //   "https://admin.funxplora.com/api/insert-five-trx",
              //   fd
              // );
            } catch (e) {
              console.log(e);
            }
            try {
              const response = await axios.get(
                `https://admin.funxplora.com/api/trx-winning-result?number=${num}&gameid=3`
              );
            } catch (e) {
              console.log(e);
            }
          }
        }, [4000]);
      } catch (e) {
        console.log(e);
      }
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 4 when it reaches 0
    }
  });
};

function randomStr(len, arr) {
  let ans = "";
  for (let i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}

/// five min trx jackpod funcction
const generatedTimeEveryAfterEveryFiveMinTRXJackPod = () => {
  let min = 0;
  let sec = 60;
  jackpodTrxJob = schedule.scheduleJob("* * * * * *", function () {
    // const currentTime = new Date().getSeconds(); // Get the current time
    const currentTime = sec;
    sec = sec - 1;
    if (sec < 0) {
      sec = 59;
    }
    const timeToSend = sec;
    // currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemintrxjackpod", `${min}_${timeToSend}`);
    console.log(`${min}_${timeToSend}`, "Time to send");
    if (min === 0 && timeToSend === 6) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
      try {
        const get_query_for_trans_id = `SELECT tr_tranaction_id FROM tr_game WHERE tr_id = 7;`;

        pool.getConnection((err, con) => {
          if (err) {
            console.error("Error getting database connection: ", err);
            return;
          }
          con.query(get_query_for_trans_id, (err, result) => {
            if (err) {
              con?.release();
              return;
            }

            const trans_id = result?.[0]?.tr_tranaction_id;
            const get_result_for_transid = `SELECT result FROM trx_manual_result where tr_type = 4 AND trans_id = ${String(
              Number(trans_id) + 1
            )};`;
            con.query(get_result_for_transid, (err, result) => {
              if (err) {
                con?.release();
                return;
              }
              const result_arrray = [2002, 1000, 3002, 3001, 2001, 2005, 2004];
              let result_number =
                result?.[0]?.result ||
                result_arrray[Math.floor(Math.random() * result_arrray.length)];
              console.log(
                result?.[0]?.result,
                trans_id,
                result_number,
                "hiiiiiiiiiiiiiii"
              );
              setTimeout(async () => {
                //  const res = await axios.get(
                //     `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
                //    );
                // if (res?.data?.data[0]) {
                try {
                  // pool.getConnection((err, con) => {
                  //   if (err) {
                  //     console.error("Error getting database connection: ", err);
                  //     return;
                  //   }
                  const query = `CALL sp_insert_trx_five_min_jackpod_result(?, ?, ?, ?, ?, ?, ?)`;
                  // const setResult = `CALL clear_bet_jackpod(?)`;

                  con.query(
                    query,
                    [
                      result_number,
                      String(moment(time).format("HH:mm:ss")),
                      4,
                      `**${randomStr(
                        4,
                        "0123456789abcdefghijklmnopqrstuvwxyz"
                      )}`,
                      JSON.stringify(
                        randomStr(10, "0123456789abcdefghijklmnopqrstuvwxyz")
                      ),
                      `${randomStr(
                        10,
                        "0123456789abcdefghijklmnopqrstuvwxyz"
                      )?.slice(-5)}`,
                      randomStr(8, "0123456789"),
                    ],
                    (err, result) => {
                      // con?.release();
                      if (err) {
                        con?.release();
                        return;
                      }
                    }
                  );

                  const call_bet_clear_sp = `CALL clear_bet_jackpod(${String(
                    result_number
                  )})`;
                  con.query(call_bet_clear_sp, (err, result) => {
                    if (err) {
                      con.release();
                      return;
                    }
                  });
                  // const get_pending_result = `SELECT userid, amount, gameid, number, totalamount FROM trx_colour_bet WHERE status = "0" AND gameid = 4;`;
                  // con.query(get_pending_result, (err, result) => {
                  //   if (err) {
                  //     con?.release();
                  //     console.log(err);
                  //     return;
                  //   }
                  //   result?.map((i) => {
                  //     let win_result = 0;
                  //     if (String(result_number) === i?.number) {
                  //       win_result = 33;
                  //     }
                  //     if (win_result > 0) {
                  //       const updatetrx_colour_bet = `UPDATE trx_colour_bet
                  //      SET win = ${Number(i?.totalamount) * 33}, status = "1"
                  //        WHERE userid = ${i?.userid} AND gameid = ${Number(
                  //         i?.gameid
                  //       )};`;
                  //       con.query(updatetrx_colour_bet, (err, result) => {
                  //         if (err) {
                  //           con.release();
                  //           return;
                  //         }
                  //         const current_winning_wallet = `SELECT winning_wallet FROM user WHERE id=${Number(
                  //           i?.userid
                  //         )};`;
                  //         con.query(current_winning_wallet, (err, result) => {
                  //           if (err) {
                  //             con.release();
                  //             return;
                  //           }
                  //           const net_winning_amount =
                  //             result?.[0]?.winning_wallet;
                  //           const current_winning_wallet = `UPDATE user
                  //           SET winning_wallet = ${String(
                  //             Number(net_winning_amount) +
                  //               Number(i?.totalamount) * 33
                  //           )}
                  //           WHERE id =${Number(i?.userid)};`;
                  //           con.query(current_winning_wallet, (err, result) => {
                  //             if (err) {
                  //               con.release();
                  //               return;
                  //             }
                  //           });
                  //         });
                  //       });
                  //     } else {
                  //       const updateReferralCountnew = `UPDATE trx_colour_bet SET status = "2" WHERE userid = ${
                  //         i?.userid
                  //       } AND gameid = ${Number(i?.gameid)} AND number = ${
                  //         i?.number
                  //       };`;
                  //       con.query(updateReferralCountnew);
                  //     }
                  //   });
                  // });
                } catch (e) {
                  console.log(e);
                }
                //   }
              }, [1000]);
            });
          });
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) {
        jackpodTrxJob?.cancel();
        min = 0;
        sec = 0;
      } // Reset min to 4 when it reaches 0
    }
  });
};

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
    generatedTimeEveryAfterEveryOneMinTRX();
    generatedTimeEveryAfterEveryOneMin();
    generatedTimeEveryAfterEveryThreeMin();
    generatedTimeEveryAfterEveryFiveMin();
    // generatedTimeEveryAfterEveryFiveMinTRXJackPod();
    x = false;
  }, secondsUntilNextMinute * 1000);
}

// let y = true;
// const finalRescheduleJob = schedule.scheduleJob(
//   // "15,30,45,0 * * * *",
//   "30 * * * *",
//   function () {
    // twoMinTrxJob?.cancel();
    // threeMinTrxJob?.cancel();
//     if (y) {
//       generatedTimeEveryAfterEveryThreeMinTRX();
//       generatedTimeEveryAfterEveryFiveMinTRX();
//       y = false;
//     }
//   }
// );

let y = true;
if (y) {
  console.log("Waiting until 10:30 to start...");

  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30, 0); // Set target time to 10:30

  let millisecondsUntilTarget = target - now;

  // If the target time has already passed for today, schedule it for tomorrow
  if (millisecondsUntilTarget < 0) {
    target.setDate(target.getDate() + 1);
    millisecondsUntilTarget = target - now;
  }

  console.log(
    "Current time: ",
    now.toLocaleTimeString(),
    "Milliseconds until 10:30: ",
    millisecondsUntilTarget
  );

  setTimeout(() => {
    console.log("inside the functon")
    generatedTimeEveryAfterEveryThreeMinTRX();
    generatedTimeEveryAfterEveryFiveMinTRX();
    y = false;
  }, millisecondsUntilTarget);
}


// generatedTimeEveryAfterEveryFiveMinTRXJackPod();

app.get("/api/v1/promotiondata-testing", async (req, res) => {
  pool.getConnection((err, con) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      return res.status(500).json({
        msg: `Something went wrong ${err}`,
      });
    }
    const query = `WITH  RECURSIVE my_cte AS ( SELECT 0 as n UNION ALL SELECT n+1 from my_cte where n<10) SELECT * FROM my_cte;`;
    con.query(query, (err, resule) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          msg: "Something went wrong related with databse",
        });
      }
      return res.status(200).json({
        msg: "Hii anand kumarverma",
        data: resule,
      });
    });
  });
});

//////////////////////////////// promotion data ///////////////////////////////////////
app.get("/api/v1/promotiondata", async (req, res) => {
  pool.getConnection((err, con) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      return res.status(500).json({
        msg: `Something went wrong ${err}`,
      });
    }
    const { id } = req.query;
    if (!id || isNaN(id)) {
      con.release();
      return res.status(400).json({
        message: "Id is missing or invalid",
      });
    }

    try {
      con.query("SELECT * FROM user", (err, result) => {
        if (err) {
          console.error(err);
          con.release();
          return res.status(500).json({
            msg: "Error in data fetching",
            error: err.message,
            er: err,
          });
        }

        const array = result.map((i) => ({
          ...i,
          count: 0,
          teamcount: 0,
          directReferrals: [],
        }));

        let new_data = updateReferralCountnew(array).find((i) => i.id == id);
        const levels = Array.from({ length: 22 }, (_, i) => `level_${i + 1}`);

        let direct_ids = new_data.directReferrals?.map((i) => i?.c_id);

        let indirect_ids = [];
        for (let i = levels.length - 1; i >= 0; i--) {
          let currentLevel = new_data?.teamMembersByLevel[levels[i - 1]];
          let nextLevel = new_data?.teamMembersByLevel[levels[i]];

          if (currentLevel && nextLevel) {
            let idsToRemove = currentLevel.map((item) => item.id);
            nextLevel = nextLevel.filter(
              (item) => !idsToRemove.includes(item.id)
            );
            new_data.teamMembersByLevel[levels[i]] = nextLevel;
          }
        }

        for (let i = 1; i <= 6; i++) {
          if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
            indirect_ids.push(
              ...new_data.teamMembersByLevel[`level_${i}`].map(
                (item) => item.id
              )
            );
          }
        }

        new_data = { ...new_data, deposit_member_amount: [] };

        const promises = [];
        for (let i = 1; i <= 6; i++) {
          if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
            let levelIds = new_data.teamMembersByLevel[`level_${i}`].map(
              (k) => k.id
            );
            const promise = new Promise((resolve, reject) => {
              con.query(
                `SELECT SUM(tr15_amt) AS total_amount, COUNT(*) AS total_member
                 FROM tr15_fund_request
                 WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
                 ${
                   levelIds.length > 0
                     ? `tr15_uid IN (${levelIds.join(",")})`
                     : "1 = 0"
                 }`,
                (err, resultteamamount) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    resolve(resultteamamount[0].total_amount || 0);
                  }
                }
              );
            });
            promises.push(promise);
          } else {
            promises.push(Promise.resolve(0));
          }
        }

        Promise.all(promises)
          .then((deposit_member_amounts) => {
            new_data.deposit_member_amount = deposit_member_amounts;
            con.query(
              `SELECT SUM(tr15_amt) AS total_amount,COUNT(DISTINCT tr15_uid) AS total_member FROM tr15_fund_request WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND
              ${
                direct_ids.length > 0
                  ? `tr15_uid IN (${direct_ids.join(",")})`
                  : "1 = 0"
              }`,
              (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({
                    msg: "Error in data fetching",
                    error: err.message,
                    er: err,
                  });
                }

                con.query(
                  `SELECT SUM(tr15_amt) AS total_amount,COUNT(DISTINCT tr15_uid) AS total_member FROM tr15_fund_request WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
                                ${
                                  indirect_ids.length > 0
                                    ? `tr15_uid IN (${indirect_ids.join(",")})`
                                    : "1 = 0"
                                }`,
                  (err, resultteam) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({
                        msg: "Error in data fetching",
                        error: err.message,
                        er: err,
                      });
                    }
                    con.release();
                    // Ensure all levels up to 22 are initialized
                    for (let i = 1; i <= 6; i++) {
                      if (!new_data.teamMembersByLevel[`level_${i}`]) {
                        new_data.teamMembersByLevel[`level_${i}`] = [];
                      }
                    }
                    return res.status(200).json({
                      data: {
                        ...new_data,
                        deposit_member: result[0].total_member || 0,
                        deposit_recharge: result[0].total_amount || 0,
                        deposit_member_team: resultteam[0].total_member || 0,
                        deposit_recharge_team: resultteam[0].total_amount || 0,
                      },
                      msg: "Data fetched successfully",
                    });
                  }
                );
              }
            );
          })
          .catch((err) => {
            console.error(err);
            con.release();
            return res.status(500).json({
              msg: "Error in data fetching",
              error: err.message,
              er: err,
            });
          });
      });
    } catch (e) {
      con.release();
      console.error(e);
      return res.status(500).json({
        msg: "Error in data fetching",
        error: e.message,
      });
    }
  });
});

function updateReferralCountnew(users) {
  const countMap = {};
  const teamCountMap = {};

  users.forEach((user) => {
    countMap[user.id] = 0;
    teamCountMap[user.id] = 0;
    user.directReferrals = [];
  });

  users.forEach((user) => {
    if (countMap.hasOwnProperty(user.referral_user_id)) {
      countMap[user.referral_user_id]++;
    }
  });

  const updateTeamCountRecursively = (user) => {
    let totalChildrenCount = 0;
    if (countMap.hasOwnProperty(user.id)) {
      totalChildrenCount += countMap[user.id];
      users.forEach((u) => {
        if (u.referral_user_id === user.id) {
          if (user.referral_user_id !== null) {
            if (
              !user.directReferrals.some((referral) => referral.c_id === u.id)
            ) {
              user.directReferrals.push({
                user_name: u.full_name,
                mobile: u.mobile,
                c_id: u.id,
                id: u.username,
              });
            }
          }
          totalChildrenCount += updateTeamCountRecursively(u);
        }
      });
    }
    return totalChildrenCount;
  };

  users.forEach((user) => {
    if (countMap.hasOwnProperty(user.id)) {
      teamCountMap[user.id] = updateTeamCountRecursively(user);
    }
  });

  const updateUserLevelRecursively = (user, level, maxLevel) => {
    if (level === 0 || level > maxLevel) return [];

    const levelMembers = [];
    users.forEach((u) => {
      if (u.referral_user_id === user.id) {
        levelMembers.push({ full_name: u.full_name, id: u.id });
        const children = updateUserLevelRecursively(u, level + 1, maxLevel);
        levelMembers.push(...children);
      }
    });

    return levelMembers;
  };

  users.forEach((user) => {
    user.teamMembersByLevel = {};
    for (let i = 1; i <= 6; i++) {
      const levelMembers = updateUserLevelRecursively(user, 1, i);
      user.teamMembersByLevel[`level_${i}`] = levelMembers;
      if (levelMembers.length === 0) break;
    }
  });

  users.forEach((user) => {
    user.count = countMap.hasOwnProperty(user.id) ? countMap[user.id] : 0;
    user.teamcount = teamCountMap.hasOwnProperty(user.id)
      ? teamCountMap[user.id]
      : 0;
  });

  return users;
}

app.post("/api/v1/place-bid-jackpod", async (req, res) => {
  pool.getConnection((err, con) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      return res.status(500).json({
        msg: `Something went wrong ${err} HIIIIII`,
      });
    }
    const { userid, amount, gameid, number } = req.body;
    if (!userid || !amount || !gameid || !number)
      return res.status(200).json({
        msg: "Everything is required",
      });

    const query =
      "CALL trx_bet_placing_jack_pod(?,?,?,?, @result_msg); SELECT @result_msg;";

    con.query(query, [userid, gameid, amount, number], (err, result) => {
      if (err) {
        con.release();
        return res.status(500).json({
          msg: "Something went wrong",
          err: err,
        });
      }
      const resultMsg = result[1][0]["@result_msg"];
      return res.status(200).json({
        msg: resultMsg,
      });
    });
  });
  // trx_bet_placing_jack_pod
});

app.get("/api/v1/my-history-jackpod", async (req, res) => {
  pool.getConnection((err, con) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      return res.status(500).json({
        msg: `Something went wrong ${err} `,
      });
    }
    const { userid } = req.query;
    if (!userid)
      return res.status(200).json({
        msg: "Everything is required",
      });

    const query =
      "SELECT * FROM trx_colour_bet WHERE userid = ? AND gameid = ? ORDER BY datetime DESC LIMIT 100;";

    con.query(query, [String(userid), 4], (err, result) => {
      if (err) {
        con.release();
        return res.status(500).json({
          msg: "Something went wrong",
          err: err,
        });
      }
      return res.status(200).json({
        msg: "Recorf get successfully",
        data: result,
      });
    });
  });
});

app.get("/api/v1/game-history-jackpod", async (req, res) => {
  pool.getConnection((err, con) => {
    if (err) {
      console.error("Error getting database connection: ", err);
      return res.status(500).json({
        msg: `Something went wrong ${err} `,
      });
    }

    const query =
      "SELECT * FROM tr42_win_slot WHERE  tr41_packtype = ? ORDER BY tr_transaction_id DESC LIMIT 200;";

    con.query(query, [4], (err, result) => {
      if (err) {
        con.release();
        return res.status(500).json({
          msg: "Something went wrong",
          err: err,
        });
      }
      return res.status(200).json({
        msg: "Recorf get successfully",
        data: result,
      });
    });
  });
});

app.get("/get-jackpod-result", async (req, res) => {
  try {
    generatedTimeEveryAfterEveryFiveMinTRXJackPod();
    res.status(200)?.json({
      msg: "APi hit successfully",
    });
  } catch (e) {
    console.log("error in end point function", e);
  }
});

app.get("/", (req, res) => {
  res.send(`<h1>server running at port=====> ${PORT}</h1>`);
});

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
