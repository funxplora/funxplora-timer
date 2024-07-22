const schedule = require("node-cron");
const {
  oneMinColorWining,
  oneMinColorWinning2min,
  oneMinColorWinning3sec,
  queryDb,
  oneMinTrxSendReleasNumber,
  oneThreeTrxSendReleasNumber,
  oneFiveTrxSendReleasNumber,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");
const { failMsg } = require("../helper/helperResponse");
const io = require("../config/io.config");

exports.generatedTimeEveryAfterEveryOneMin = () => {
  const job = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemin", timeToSend); // Emit the formatted time
    if (timeToSend === 3) {
      // oneMinCheckResult();
      oneMinColorWining();
    }
  });
};

exports.generatedTimeEveryAfterEveryThreeMin = () => {
  let min = 2;
  const job = schedule.schedule("* * * * * *", function () {
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

exports.generatedTimeEveryAfterEveryFiveMin = () => {
  let min = 4;
  const job = schedule.schedule("* * * * * *", function () {
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

exports.generatedTimeEveryAfterEveryOneMinTRX = () => {
  let oneMinTrxJob = schedule.schedule("* * * * * *", function () {
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

      setTimeout(async () => {
        const res = await axios
          .get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          )
          .then(async (result) => {
            if (result?.data?.data?.[0]) {
              const obj = result.data.data?.[0];
              const newString = obj.hash;
              let num = null;
              for (let i = newString.length - 1; i >= 0; i--) {
                if (!isNaN(parseInt(newString[i]))) {
                  num = parseInt(newString[i]);
                  break;
                }
              }
              const query = `CALL sp_insert_trx_one_min_result(?, ?, ?, ?, ?, ?, ?)`;
              await queryDb(query, [
                num,
                String(moment(time).format("HH:mm:ss")),
                1,
                `**${obj.hash.slice(-4)}`,
                JSON.stringify(obj),
                `${obj.hash.slice(-5)}`,
                obj.number,
              ])
                .then((result) => {})
                .catch((e) => {
                  console.log(e);
                });

              ////////////// result sent to the  api //////////////
              const parameter = {
                number: num,
                gameid: 1,
              };
              oneMinTrxSendReleasNumber(parameter);
            }
          })
          .catch((e) => {
            console.log("error in tron api");
          });
      }, [4000]);
    }
  });
};

exports.generatedTimeEveryAfterEveryThreeMinTRX = () => {
  let min = 2;
  let twoMinTrxJob = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();

      setTimeout(async () => {
        const res = await axios
          .get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          )
          .then(async (result) => {
            if (result?.data?.data[0]) {
              const obj = result.data.data[0];
              const newString = obj.hash;
              let num = null;
              for (let i = newString.length - 1; i >= 0; i--) {
                if (!isNaN(parseInt(newString[i]))) {
                  num = parseInt(newString[i]);
                  break;
                }
              }

              const query = `CALL sp_insert_trx_three_min_result(?, ?, ?, ?, ?, ?, ?)`;
              await queryDb(query, [
                num,
                String(moment(time).format("HH:mm:ss")),
                2,
                `**${obj.hash.slice(-4)}`,
                JSON.stringify(obj),
                `${obj.hash.slice(-5)}`,
                obj.number,
              ])
                .then((result) => {})
                .catch((e) => {
                  console.log(e);
                });
              ////////////// result sent to the  api //////////////

              const parameter = {
                number: num,
                gameid: 2,
              };
              oneThreeTrxSendReleasNumber(parameter);
            }
          })
          .catch((e) => {
            console.log("error in tron api");
          });
      }, [4000]);
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};

exports.generatedTimeEveryAfterEveryFiveMinTRX = () => {
  let min = 4;
  let threeMinTrxJob = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 9) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();

      setTimeout(async () => {
        const res = await axios
          .get(
            `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
          )
          .then(async (result) => {
            if (result?.data?.data[0]) {
              const obj = result.data.data[0];
              const newString = obj.hash;
              let num = null;
              for (let i = newString.length - 1; i >= 0; i--) {
                if (!isNaN(parseInt(newString[i]))) {
                  num = parseInt(newString[i]);
                  break;
                }
              }

              const query = `CALL sp_insert_trx_five_min_result(?, ?, ?, ?, ?, ?, ?)`;
              await queryDb(query, [
                num,
                String(moment(time).format("HH:mm:ss")),
                3,
                `**${obj.hash.slice(-4)}`,
                JSON.stringify(obj),
                `${obj.hash.slice(-5)}`,
                obj.number,
              ])
                .then((result) => {})
                .catch((e) => {
                  console.log(e);
                });
              ////////////// result sent to the  api //////////////

              const parameter = {
                number: num,
                gameid: 3,
              };
              oneFiveTrxSendReleasNumber(parameter);
            }
          })
          .catch((e) => {
            console.log("error in tron api");
          });
      }, [4000]);
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 4 when it reaches 0
    }
  });
};

exports.getPromotionData = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Id is missing or invalid" });
    }

    const query = `SELECT * FROM user;`;
    const result = await queryDb(query, []);

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
        nextLevel = nextLevel.filter((item) => !idsToRemove.includes(item.id));
        new_data.teamMembersByLevel[levels[i]] = nextLevel;
      }
    }

    for (let i = 1; i <= 6; i++) {
      if (new_data.teamMembersByLevel[`level_${i}`]?.length > 0) {
        indirect_ids.push(
          ...new_data.teamMembersByLevel[`level_${i}`].map((item) => item.id)
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
        const query = `SELECT SUM(tr15_amt) AS total_amount, COUNT(*) AS total_member
          FROM tr15_fund_request
          WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
          ${
            levelIds.length > 0
              ? `tr15_uid IN (${levelIds.join(",")})`
              : "1 = 0"
          }`;

        const promise = queryDb(query, [])
          .then((resultteamamount) => {
            return resultteamamount[0]?.total_amount || 0;
          })
          .catch((err) => {
            console.log(err);
            return 0;
          });

        promises.push(promise);
      } else {
        promises.push(Promise.resolve(0));
      }
    }

    const deposit_member_amounts = await Promise.all(promises);
    new_data.deposit_member_amount = deposit_member_amounts;

    const directQuery = `SELECT SUM(tr15_amt) AS total_amount, COUNT(DISTINCT tr15_uid) AS total_member 
      FROM tr15_fund_request 
      WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
      ${
        direct_ids.length > 0
          ? `tr15_uid IN (${direct_ids.join(",")})`
          : "1 = 0"
      }`;

    const directResult = await queryDb(directQuery, []);

    const indirectQuery = `SELECT SUM(tr15_amt) AS total_amount, COUNT(DISTINCT tr15_uid) AS total_member 
      FROM tr15_fund_request 
      WHERE tr15_status = 'Success' AND tr15_depo_type = 'Winzo' AND 
      ${
        indirect_ids.length > 0
          ? `tr15_uid IN (${indirect_ids.join(",")})`
          : "1 = 0"
      }`;

    const indirectResult = await queryDb(indirectQuery, []);

    for (let i = 1; i <= 6; i++) {
      if (!new_data.teamMembersByLevel[`level_${i}`]) {
        new_data.teamMembersByLevel[`level_${i}`] = [];
      }
    }

    return res.status(200).json({
      data: {
        ...new_data,
        deposit_member: directResult[0]?.total_member || 0,
        deposit_recharge: directResult[0]?.total_amount || 0,
        deposit_member_team: indirectResult[0]?.total_member || 0,
        deposit_recharge_team: indirectResult[0]?.total_amount || 0,
      },
      msg: "Data fetched successfully",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ msg: "Something went wrong", error: e.message });
  }
};

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
        levelMembers.push({
          full_name: u.full_name,
          id: u.id,
          tr15_amt: u.tr15_amt,
        });
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

exports.betPlaceJackPod = async (req, res) => {
  const { userid, amount, gameid, number } = req.body;
  if (!userid || !amount || !gameid || !number)
    return res.status(200).json({
      msg: "Everything is required",
    });
  const query =
    "CALL trx_bet_placing_jack_pod(?,?,?,?, @result_msg); SELECT @result_msg;";
  await queryDb(query, [String(userid), 4, String(amount), String(number)])
    .then((result) => {
      return res.status(500).json({
        msg: "Something went wrong",
        err: err,
      });
    })
    .catch((e) => {
      return failMsg("Something went wrong in bet placing");
    });
};
const generatedTimeEveryAfterEveryFiveMinTRXJackPod = () => {
  let min = 4;
  let sec = 60;
  let jackpodTrxJob = schedule.schedule("* * * * * *", async function () {
    // const currentTime = new Date().getSeconds(); // Get the current time
    const currentTime = sec;
    sec = sec - 1;
    if (sec < 0) {
      sec = 59;
    }
    const timeToSend = sec;
    io.emit("fivemintrxjackpod", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 6) {
      const datetoAPISend = parseInt(new Date().getTime().toString());
      const actualtome = soment.tz("Asia/Kolkata");
      const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();

      //////////////////// get transaction id /////////////
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
        jackpodTrxJob?.cancel();
        min = 0;
        sec = 0;
      } // Reset min to 4 when it reaches 0
    }
  });
};

exports.jackpodResult = async (req, res) => {
  try {
    generatedTimeEveryAfterEveryFiveMinTRXJackPod();
    return res.status(200)?.json({
      msg: "APi hit successfully",
    });
  } catch (e) {
    console.log("error in end point function", e);
  }
};

exports.myHistoryJackPod = async (req, res) => {
  const { userid } = req.query;
  if (!userid)
    return res.status(200).json({
      msg: "Everything is required",
    });
  const query =
    "SELECT * FROM trx_colour_bet WHERE userid = ? AND gameid = ? ORDER BY datetime DESC LIMIT 100;";

  await queryDb(query, [String(userid), 4])
    .then((reslt) => {
      return res.status(200).json({
        msg: "Recorf get successfully",
        data: reslt,
      });
    })
    .catch((e) => {
      return failMsg("Something went wrong in my-history fetching");
    });
};

exports.gameHistoryJackPod = async (req, res) => {
  const query =
    "SELECT * FROM tr42_win_slot WHERE  tr41_packtype = ? ORDER BY tr_transaction_id DESC LIMIT 200;";
  await queryDb(query, [4])
    .then((result) => {
      return res.status(200).json({
        msg: "Recorf get successfully",
        data: result,
      });
    })
    .catch((e) => {
      return failMsg("something went wrong in data fetching game history");
    });
};
exports.chnagePassWord = async (req, res) => {
  const { userid, old_pass, new_pass, confirm_new_pass } = req.body;
  console.log(userid, old_pass, new_pass, confirm_new_pass);
  if (!userid || !old_pass || !new_pass || !confirm_new_pass)
    return res.status(401).json({
      msg: "Everything is requied!",
      error: true,
    });
  if (new_pass !== confirm_new_pass)
    return res.status(401).json({
      msg: "Password and new password should be same.",
      error: true,
    });

  const query = "UPDATE user SET password = ? WHERE id = ? AND password = ?;";
  await queryDb(query, [String(new_pass), Number(userid), String(old_pass)])
    .then((result) => {
      if (result?.length === 0)
        return res.status(401).json({
          msg: "Your old password is wrong!",
        });
      return res.status(200).json({
        msg: "Password updated successfully",
        data: result,
      });
    })
    .catch((e) => {
      return failMsg("something went wrong in data fetching game history");
    });
};
