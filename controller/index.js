const schedule = require("node-cron");
const {
  oneMinColorWining,
  oneMinColorWinning2min,
  oneMinColorWinning3sec,
  queryDb,
  oneMinTrxSendReleasNumber,
  oneThreeTrxSendReleasNumber,
  oneFiveTrxSendReleasNumber,
  functionToreturnDummyResult,
  jackPodClearBet,
  updateMediatorTableJackPod,
  getTransactionidForJackPod,
  randomStr,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");
const { failMsg } = require("../helper/helperResponse");
const io = require("../config/io.config");

exports.generatedTimeEveryAfterEveryOneMin = (io) => {
  const job = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemin", timeToSend); // Emit the formatted time
    if (timeToSend === 9) {
      // oneMinCheckResult();
      // oneMinColorWining();
      clearBetOneMin();
    }
  });
};
const clearBetOneMin = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 1;`;
    await queryDb(get_games_no, [])
      .then(async (result) => {
        const get_actual_round = result?.[0]?.win_transactoin;
        //////////////////// query for get actual number /////////////////////////////
        const admin_se_result_aaya_hai = `SELECT number FROM colour_admin_result WHERE gameid = ? AND gamesno = ? LIMIT 1;`;
        await queryDb(admin_se_result_aaya_hai, [1, String(get_actual_round+1)])
          .then(async (result) => {
            const get_actual_result = result?.[0]?.number || -1;
            const query = `SELECT slot_num, mid_amount FROM wingo_mediator_table WHERE game_type = 1 AND mid_amount = (SELECT MIN(mid_amount) FROM wingo_mediator_table WHERE game_type = 1);`;
            await queryDb(query, [])
              .then(async (result) => {
                let create_array_for_random = [];
                if (result.length === 0) {
                  create_array_for_random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                } else {
                  result.forEach((element) => {
                    create_array_for_random.push(element.slot_num);
                  });
                }
                const slot =
                  get_actual_result >= 0
                    ? get_actual_result
                    : create_array_for_random[
                        Math.floor(
                          Math.random() * create_array_for_random.length
                        )
                      ];
                console.log(slot,get_actual_result,get_actual_round);
                ///////// insert into ledger entry and this sp also clear the all result ///////////////////////
                let clear_bet = "CALL wingo_insert_ledger_entry_one_min(?);";
                await queryDb(clear_bet, [Number(slot)])
                  .then(async (result) => {})
                  .catch((e) => {
                    return res.status(500).json({
                      msg: `Something went wrong api calling`,
                    });
                  });
              })
              .catch((e) => {
                return res.status(500).json({
                  msg: `Something went wrong api calling`,
                });
              });
          })
          .catch((e) => {
            console.log("Something went wrong in clear bet 1 min");
          });
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
exports.generatedTimeEveryAfterEveryThreeMin = (io) => {
  let min = 2;
  const job = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemin", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 25) {
      // oneMinCheckResult2min();
      // oneMinColorWinning2min();
      clearBetThreeMin();
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};

const clearBetThreeMin = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 2;`;
    await queryDb(get_games_no, [])
      .then(async (result) => {
        const get_actual_round = result?.[0]?.win_transactoin;
        //////////////////// query for get actual number /////////////////////////////
        const admin_se_result_aaya_hai = `SELECT number FROM colour_admin_result WHERE gameid = ? AND gamesno = ? LIMIT 1;`;
        await queryDb(admin_se_result_aaya_hai, [2, String(get_actual_round)])
          .then(async (result) => {
            const get_actual_result = result?.[0]?.number || -1;
            const query = `SELECT slot_num, mid_amount FROM wingo_mediator_table WHERE game_type = 2 AND mid_amount = (SELECT MIN(mid_amount) FROM wingo_mediator_table WHERE game_type = 2);`;
            await queryDb(query, [])
              .then(async (result) => {
                let create_array_for_random = [];
                if (result.length === 0) {
                  create_array_for_random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                } else {
                  result.forEach((element) => {
                    create_array_for_random.push(element.slot_num);
                  });
                }
                const slot =
                  get_actual_result >= 0
                    ? get_actual_result
                    : create_array_for_random[
                        Math.floor(
                          Math.random() * create_array_for_random.length
                        )
                      ];
                ///////// insert into ledger entry and this sp also clear the all result ///////////////////////
                let clear_bet = "CALL wingo_insert_ledger_entry_three_min(?);";
                await queryDb(clear_bet, [Number(slot)])
                  .then(async (result) => {})
                  .catch((e) => {
                    return res.status(500).json({
                      msg: `Something went wrong api calling`,
                    });
                  });
              })
              .catch((e) => {
                return res.status(500).json({
                  msg: `Something went wrong api calling`,
                });
              });
          })
          .catch((e) => {
            console.log("Something went wrong in clear bet 1 min");
          });
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.generatedTimeEveryAfterEveryFiveMin = (io) => {
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
      // oneMinColorWinning3sec();
      clearBetFiveMin();
    }
    ///
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 2 when it reaches 0
    }
  });
};

const clearBetFiveMin = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 3;`;
    await queryDb(get_games_no, [])
      .then(async (result) => {
        const get_actual_round = result?.[0]?.win_transactoin;
        //////////////////// query for get actual number /////////////////////////////
        const admin_se_result_aaya_hai = `SELECT number FROM colour_admin_result WHERE gameid = ? AND gamesno = ? LIMIT 1;`;
        await queryDb(admin_se_result_aaya_hai, [3, String(get_actual_round)])
          .then(async (result) => {
            const get_actual_result = result?.[0]?.number || -1;
            const query = `SELECT slot_num, mid_amount FROM wingo_mediator_table WHERE game_type = 3 AND mid_amount = (SELECT MIN(mid_amount) FROM wingo_mediator_table WHERE game_type = 3);`;
            await queryDb(query, [])
              .then(async (result) => {
                let create_array_for_random = [];
                if (result.length === 0) {
                  create_array_for_random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                } else {
                  result.forEach((element) => {
                    create_array_for_random.push(element.slot_num);
                  });
                }
                const slot =
                  get_actual_result >= 0
                    ? get_actual_result
                    : create_array_for_random[
                        Math.floor(
                          Math.random() * create_array_for_random.length
                        )
                      ];
                ///////// insert into ledger entry and this sp also clear the all result ///////////////////////
                let clear_bet = "CALL wingo_insert_ledger_entry_five_min(?);";
                await queryDb(clear_bet, [Number(slot)])
                  .then(async (result) => {})
                  .catch((e) => {
                    return res.status(500).json({
                      msg: `Something went wrong api calling`,
                    });
                  });
              })
              .catch((e) => {
                return res.status(500).json({
                  msg: `Something went wrong api calling`,
                });
              });
          })
          .catch((e) => {
            console.log("Something went wrong in clear bet 1 min");
          });
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.generatedTimeEveryAfterEveryOneMinTRX = (io) => {
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
            `https://apilist.tronscanapi.com/api/block`,
            {
              params: {
                sort: "-balance",
                start: "0",
                limit: "20",
                producer: "",
                number: "",
                start_timestamp: datetoAPISend,
                end_timestamp: datetoAPISend,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (result) => {
            if (result?.data?.data[0]) {
              const obj = result.data.data[0];
              sendOneMinResultToDatabase(time, obj);
            } else {
              sendOneMinResultToDatabase(
                time,
                functionToreturnDummyResult(
                  Math.floor(Math.random() * (4 - 0 + 1)) + 0
                )
              );
            }
          })
          .catch((e) => {
            console.log("error in tron api");
            sendOneMinResultToDatabase(
              time,
              functionToreturnDummyResult(
                Math.floor(Math.random() * (4 - 0 + 1)) + 0
              )
            );
          });
      }, [4000]);
    }
  });
};

const sendOneMinResultToDatabase = async (time, obj) => {
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
  // const parameter = {
  //   number: num,
  //   gameid: 1,
  // };
  // oneMinTrxSendReleasNumber(parameter);

  const queryToSendResult = `CALL trx_clear_bet(?);`;

  await queryDb(queryToSendResult, [Number(num)])
    .then((result) => {})
    .catch((e) => {
      console.log("Something went wrong in clear one bet trx");
    });
};

exports.generatedTimeEveryAfterEveryThreeMinTRX = (io) => {
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
            `https://apilist.tronscanapi.com/api/block`,
            {
              params: {
                sort: "-balance",
                start: "0",
                limit: "20",
                producer: "",
                number: "",
                start_timestamp: datetoAPISend,
                end_timestamp: datetoAPISend,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (result) => {
            if (result?.data?.data[0]) {
              const obj = result.data.data[0];
              sendThreeMinResultToDatabase(time, obj);
            } else {
              sendThreeMinResultToDatabase(
                time,
                functionToreturnDummyResult(
                  Math.floor(Math.random() * (4 - 0 + 1)) + 0
                )
              );
            }
          })
          .catch((e) => {
            console.log("error in tron api");
            sendThreeMinResultToDatabase(
              time,
              functionToreturnDummyResult(
                Math.floor(Math.random() * (4 - 0 + 1)) + 0
              )
            );
          });
      }, [4000]);
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};

async function sendThreeMinResultToDatabase(time, obj) {
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
  // const parameter = {
  //   number: num,
  //   gameid: 2,
  // };
  // oneThreeTrxSendReleasNumber(parameter);

  const queryToSendResult = `CALL trx_clear_bet_3_min(?);`;

  await queryDb(queryToSendResult, [Number(num)])
    .then((result) => {})
    .catch((e) => {
      console.log("Something went wrong in clear one bet trx");
    });
}

exports.generatedTimeEveryAfterEveryFiveMinTRX = (io) => {
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
            `https://apilist.tronscanapi.com/api/block`,
            {
              params: {
                sort: "-balance",
                start: "0",
                limit: "20",
                producer: "",
                number: "",
                start_timestamp: datetoAPISend,
                end_timestamp: datetoAPISend,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (result) => {
            if (result?.data?.data[0]) {
              const obj = result.data.data[0];
              sendFiveMinResultToDatabase(time, obj);
            } else {
              sendFiveMinResultToDatabase(
                time,
                functionToreturnDummyResult(
                  Math.floor(Math.random() * (4 - 0 + 1)) + 0
                )
              );
            }
          })
          .catch((e) => {
            console.log("error in tron api");
            sendFiveMinResultToDatabase(
              time,
              functionToreturnDummyResult(
                Math.floor(Math.random() * (4 - 0 + 1)) + 0
              )
            );
          });
      }, [4000]);
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 4 when it reaches 0
    }
  });
};

async function sendFiveMinResultToDatabase(time, obj) {
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
  // const parameter = {
  //   number: num,
  //   gameid: 3,
  // };
  // oneFiveTrxSendReleasNumber(parameter);

  const queryToSendResult = `CALL trx_clear_bet_5_min(?);`;

  await queryDb(queryToSendResult, [Number(num)])
    .then((result) => {})
    .catch((e) => {
      console.log("Something went wrong in clear one bet trx");
    });
}

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
      return res.status(200).json({
        msg: result?.[1]?.[0]?.["@result_msg"],
      });
    })
    .catch((e) => {
      console.log(e);
      return failMsg("Something went wrong in bet placing");
    });
};

exports.generatedTimeEveryAfterEveryFiveMinTRXJackPod = (io) => {
  let min = 4;
  let sec = 60;
  // let jackpodTrxJob = schedule.schedule("* * * * * *", async function () {
  let interval = setInterval(async () => {
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
              console.log(result);
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
        // jackpodTrxJob?.cancel();
        min = 0;
        sec = 0;
      } // Reset min to 4 when it reaches 0
    }
  }, 1000);
  // });
};

// exports.jackpodResult = async (req, res) => {
//   try {
//     generatedTimeEveryAfterEveryFiveMinTRXJackPod();
//     return res.status(200)?.json({
//       msg: "APi hit successfully",
//     });
//   } catch (e) {
//     console.log("error in end point function", e);
//   }
// };

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

exports.getGameHistory = async (req, res) => {
  const { gameid, limit } = req.query;

  if (!gameid || !limit) {
    return res.status(400).json({
      // Changed to 400 for bad request
      msg: "gameid and limit are required",
    });
  }

  const num_gameid = Number(gameid);
  const num_limit = Number(limit);

  if (typeof num_gameid !== "number" || typeof num_limit !== "number") {
    return res.status(400).send("gameid and limit should be numbers");
  }
  try {
    // const query =
    //   "SELECT * FROM tr42_win_slot WHERE tr41_packtype = ? ORDER BY tr_transaction_id DESC LIMIT 200";
    let query = "";
    if (num_gameid === 1) {
      query =
        "SELECT * FROM tr42_win_slot WHERE tr41_packtype = 1 ORDER BY tr_transaction_id DESC LIMIT 200";
    } else if (num_gameid === 2) {
      query =
        "SELECT * FROM tr42_win_slot WHERE tr41_packtype = 2 ORDER BY tr_transaction_id DESC LIMIT 200";
    } else {
      query =
        "SELECT * FROM tr42_win_slot WHERE tr41_packtype = 3 ORDER BY tr_transaction_id DESC LIMIT 200";
    }
    await queryDb(query, [])
      .then((result) => {
        return res.status(200).json({
          msg: "Data fetched successfully",
          result: result,
        });
      })
      .catch((e) => {
        console.log(e);
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
exports.getMyHistory = async (req, res) => {
  const { gameid, userid } = req.query;

  if (!gameid || !userid) {
    return res.status(400).json({
      // Changed to 400 for bad request
      msg: "gameid and userid are required",
    });
  }
  const num_gameid = Number(gameid);
  const num_userid = Number(userid);

  if (typeof num_gameid !== "number" || typeof num_userid !== "number") {
    return res.status(400).send("gameid and limit should be numbers");
  }
  try {
    let query = "";
    if (num_gameid === 1) {
      query = `SELECT * FROM trx_colour_bet WHERE userid = ? AND gameid = 1 ORDER BY gamesno DESC LIMIT 100;`;
      // query = `SELECT *,tr42_win_slot.tr41_slot_id AS number_result FROM trx_colour_bet LEFT JOIN tr42_win_slot ON trx_colour_bet.gamesno = tr42_win_slot.tr_transaction_id WHERE trx_colour_bet.userid = ? AND trx_colour_bet.gameid = 1
      //       ORDER BY
      //       trx_colour_bet.gamesno DESC
      //       LIMIT 100;`;
    } else if (num_gameid === 2) {
      query = `SELECT * FROM trx_colour_bet WHERE userid = ? AND gameid = 2 ORDER BY gamesno DESC LIMIT 100;`;
    } else {
      query = `SELECT * FROM trx_colour_bet WHERE userid = ? AND gameid = 3 ORDER BY gamesno DESC LIMIT 100;`;
    }

    query !== "" &&
      (await queryDb(query, [Number(num_userid)])
        .then((result) => {
          return res.status(200).json({
            msg: "Data fetched successfully",
            data: result,
          });
        })
        .catch((e) => {
          return res.status(500).json({
            msg: `Something went wrong api calling`,
          });
        }));
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
exports.placeBetTrx = async (req, res) => {
  const { amount, gameid, gamesnio, number, userid } = req.body;
  if (gamesnio && Number(gamesnio) <= 1) {
    return res.status(200).json({
      msg: `Refresh your page may be your game history not updated.`,
    });
  }

  if (!amount || !gameid || !gamesnio || !String(number) || !userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  if (userid && Number(userid) <= 0) {
    return res.status(200).json({
      msg: `Please refresh your page`,
    });
  }

  if (Number(amount) <= 0)
    return res.status(200).json({
      msg: `Amount should be grater or equal to 1.`,
    });
  if (gameid && Number(gameid) <= 0)
    return res.status(200).json({
      msg: `Type is not define`,
    });
  if (gameid && Number(gameid) >= 4)
    return res.status(200).json({
      msg: `Type is not define`,
    });

  const num_gameid = Number(gameid);

  if (typeof num_gameid !== "number")
    return res.status(200).json({
      msg: `Game id should be in number`,
    });
  try {
    const query = `CALL trx_bet_placed(?, ?, ?, ?, @result_msg); SELECT @result_msg;`;
    try {
      const newresult = await queryDb(query, [
        String(userid),
        Number(num_gameid),
        String(amount),
        String(number),
      ])
        .then((result) => {
          res.status(200).json({
            error: "200",
            msg: result?.[1]?.[0]?.["@result_msg"],
          });
        })
        .catch((e) => {
          return res.status(500).json({
            msg: "Something went wrong with the API call",
          });
        });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        msg: "Something went wrong with the API call",
      });
    }
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
exports.loginPage = async (req, res) => {
  const { password, username } = req.body;
  if (!password || !username)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  try {
    const query = `SELECT id FROM user WHERE email = ? OR mobile = ?  AND password = ?;`;
    await queryDb(query, [username, username, password])
      .then((newresult) => {
        if (newresult?.length === 0) {
          return res.status(200).json({
            error: "400",
            msg: "Credential not matches.",
          });
        }
        return res.status(200).json({
          UserID: newresult?.[0]?.id,
          error: "200",
          msg: "Login Successfully",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
exports.getBalance = async (req, res) => {
  const { userid } = req.query;

  if (!userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  const num_gameid = Number(userid);

  if (typeof num_gameid !== "number")
    return res.status(200).json({
      msg: `User id should be in number`,
    });
  try {
    const query = `SELECT cricket_wallet,wallet,winning_wallet FROM user WHERE id = ?;`;
    await queryDb(query, [Number(num_gameid)])
      .then((newresult) => {
        if (newresult?.length === 0) {
          return res.status(200).json({
            error: "400",
            msg: "Something went wrong",
          });
        }
        return res.status(200).json({
          error: "200",
          data: {
            cricket_wallet: newresult?.[0]?.cricket_wallet,
            wallet: newresult?.[0]?.wallet,
            winning: newresult?.[0]?.winning_wallet,
          },
        });
      })
      .catch((error) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.myHistoryWingo = async (req, res) => {
  const { userid, gameid, limit } = req.query;

  if (!userid || !gameid) {
    return res.status(400).json({
      // Changed to 400 for bad request
      msg: "gameid and userid are required",
    });
  }

  const num_gameid = Number(gameid);
  const num_limit = Number(limit);
  const num_userid = Number(userid);

  if (
    typeof num_gameid !== "number" ||
    typeof num_limit !== "number" ||
    typeof num_userid !== "number"
  ) {
    return res.status(400).send("gameid and limit should be numbers");
  }
  try {
    let query = "";
    // if (num_gameid === 1) {
    //   query =
    //     "SELECT * , number_result.number AS number_result FROM `colour_bet` LEFT JOIN colour_results ON colour_bet.gamesno = colour_results.gamesno  WHERE colour_bet.gameid = 1 AND colour_bet.userid = ? ORDER BY colour_bet.gamesno DESC LIMIT 150;";
    // } else if (num_gameid === 2) {
    //   query =
    //     "SELECT * , colour_results.number AS number_result FROM `colour_bet` LEFT JOIN colour_results ON colour_bet.gamesno = colour_results.gamesno  WHERE colour_bet.gameid = 2 AND colour_bet.userid = ? ORDER BY colour_bet.gamesno DESC LIMIT 150;";
    // } else {
    //   query =
    //     "SELECT * , colour_results.number AS number_result FROM `colour_bet` LEFT JOIN colour_results ON colour_bet.gamesno = colour_results.gamesno  WHERE colour_bet.gameid = 3 AND colour_bet.userid = ? ORDER BY colour_bet.gamesno DESC LIMIT 150;";
    // }
    if (num_gameid === 1) {
      query = `SELECT * FROM colour_bet WHERE gameid = 1 AND userid = ?  ORDER BY id DESC LIMIT 150;`;
    } else if (num_gameid === 2) {
      query = `SELECT * FROM colour_bet WHERE gameid = 2 AND userid = ?  ORDER BY id DESC LIMIT 150;`;
    } else {
      query = `SELECT * FROM colour_bet WHERE gameid = 3 AND userid = ?  ORDER BY id DESC LIMIT 150;`;
    }
    query !== "" &&
      (await queryDb(query, [Number(num_userid)])
        .then((result) => {
          return res.status(200).json({
            msg: "Data fetched successfully",
            data: result,
          });
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json({
            msg: `Something went wrong api calling`,
          });
        }));
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.placeBetWingo = async (req, res) => {
  const { amount, gameid, number, userid } = req.body;
  if (!amount || !gameid || !String(number) || !userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  if (userid && Number(userid) <= 0) {
    return res.status(200).json({
      msg: `Please refresh your page`,
    });
  }

  if (Number(amount) <= 0)
    return res.status(200).json({
      msg: `Amount should be grater or equal to 1.`,
    });
  if (gameid && Number(gameid) <= 0)
    return res.status(200).json({
      msg: `Type is not define`,
    });
  if (gameid && Number(gameid) >= 4)
    return res.status(200).json({
      msg: `Type is not define`,
    });

  const gameId = Number(gameid);
  if (typeof gameId !== "number")
    return res.status(201).json({
      msg: "Data type of number should be number.",
    });

  try {
    const query = `CALL wingo_bet_placed(?, ?, ?, ?, @result_msg); SELECT @result_msg;`;
    try {
      const newresult = await queryDb(query, [
        String(userid),
        Number(gameId),
        String(amount),
        String(number),
      ])
        .then((result) => {
          res.status(200).json({
            error: "200",
            msg: result?.[1]?.[0]?.["@result_msg"],
          });
        })
        .catch((e) => {
          return res.status(500).json({
            msg: "Something went wrong with the API call",
          });
        });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        msg: "Something went wrong with the API call",
      });
    }
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};

exports.gameHistoryWingo = async (req, res) => {
  const { gameid, limit } = req.query;

  if (!gameid || !limit) {
    return res.status(400).json({
      // Changed to 400 for bad request
      msg: "gameid and limit are required",
    });
  }

  const num_gameid = Number(gameid);
  const num_limit = Number(limit);

  if (typeof num_gameid !== "number" || typeof num_limit !== "number") {
    return res.status(400).send("gameid and limit should be numbers");
  }
  try {
    let query = "";
    if (num_gameid === 1) {
      query =
        "SELECT * FROM `colour_results` WHERE gameid = 1 ORDER BY id DESC LIMIT 150;";
    } else if (num_gameid === 2) {
      query =
        "SELECT * FROM `colour_results` WHERE gameid = 2 ORDER BY id DESC LIMIT 150;";
    } else {
      query =
        "SELECT * FROM `colour_results` WHERE gameid = 3 ORDER BY id DESC LIMIT 150;";
    }
    query !== "" &&
      (await queryDb(query, [])
        .then((result) => {
          return res.status(200).json({
            msg: "Data fetched successfully",
            data: result,
          });
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json({
            msg: `Something went wrong api calling`,
          });
        }));
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
