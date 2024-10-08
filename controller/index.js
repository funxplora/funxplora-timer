const schedule = require("node-cron");
const {
  queryDb,
  functionToreturnDummyResult,
  jackPodClearBet,
  updateMediatorTableJackPod,
  getTransactionidForJackPod,
  randomStr,
  getAlredyPlacedBet,
  getAlredyPlacedBetOnWingo,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");
const { failMsg } = require("../helper/helperResponse");

exports.generatedTimeEveryAfterEveryOneMin = (io) => {
  const job = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemin", timeToSend); // Emit the formatted time
    // if (timeToSend === 2) {
    //   clearBetOneMin();
    // }
  });
};
exports.generatedTimeEveryAfterEveryOneMinbyCrown = () => {
  schedule.schedule("58 * * * * *", function () {
    clearBetOneMin();
  });
};
//////////
const clearBetOneMin = async () => {
  try {
    const res = await axios.post(
      "https://api.v8gamerecord.com/api/webapi/GetNoaverageEmerdList",
      {
        language: 0,
        pageNo: 1,
        pageSize: 10,
        random: "d9ee89cd0c124c39b6d8e07bb74920eb",
        signature: "1A3D1B659F08D305D151985CAB1709C9",
        timestamp: 1727889300,
        typeId: 1,
      }
    );
    await queryDb("CALL insert_result_1_min_wingo(?);", [
      Number(res?.data?.data?.list[0]?.number || -1),
    ]);
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

    if (min === 0 && timeToSend === 6) {
      clearBetThreeMinResult();
    }
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 2; // Reset min to 2 when it reaches 0
    }
  });
};

const clearBetThreeMinResult = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `CALL insert_result_3_min_wingo();`;
    await queryDb(get_games_no, [])
      .then(() => {})
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
const clearBetThreeMin = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 2;`;
    let get_actual_round = "";
    await queryDb(get_games_no, [])
      .then(async (result) => {
        get_actual_round = result?.[0]?.win_transactoin;
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
    //////////////////// query for get actual number /////////////////////////////
    const admin_se_result_aaya_hai = `SELECT number FROM colour_admin_result WHERE gameid = ? AND gamesno = ? LIMIT 1;`;
    let get_actual_result = -1;
    await queryDb(admin_se_result_aaya_hai, [
      2,
      String(Number(get_actual_round) + 1),
    ])
      .then(async (result) => {
        get_actual_result = result?.[0]?.number || -1;
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
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
                Math.floor(Math.random() * create_array_for_random.length)
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
      timeToSend === 6 && // this is for sec
      min === 0 // this is for minut
    ) {
      clearBetFiveMinResult();
    }
    ///
    if (currentTime === 0) {
      min--;
      if (min < 0) min = 4; // Reset min to 2 when it reaches 0
    }
  });
};
const clearBetFiveMinResult = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `CALL insert_result_5_min_wingo();`;
    await queryDb(get_games_no, [])
      .then(() => {})
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
  } catch (e) {
    return failMsg("Something went worng in node api");
  }
};
const clearBetFiveMin = async () => {
  try {
    ////////////////////// query for get transaction number /////////////////////
    const get_games_no = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 3;`;
    let get_actual_round = "";
    await queryDb(get_games_no, [])
      .then(async (result) => {
        get_actual_round = result?.[0]?.win_transactoin;
      })
      .catch((e) => {
        console.log("Something went wrong in clear bet 1 min");
      });
    //////////////////// query for get actual number /////////////////////////////
    const admin_se_result_aaya_hai = `SELECT number FROM colour_admin_result WHERE gameid = ? AND gamesno = ? LIMIT 1;`;
    let get_actual_result = -1;
    get_actual_round !== "" &&
      (await queryDb(admin_se_result_aaya_hai, [
        3,
        String(Number(get_actual_round) + 1),
      ])
        .then(async (result) => {
          get_actual_result = result?.[0]?.number || -1;
        })
        .catch((e) => {
          console.log("Something went wrong in clear bet 1 min");
        }));
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
                Math.floor(Math.random() * create_array_for_random.length)
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

    if (timeToSend === 6) {
      let timetosend = new Date();
      timetosend.setSeconds(54);
      timetosend.setMilliseconds(0);

      let updatedTimestamp = parseInt(timetosend.getTime().toString());
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
                start_timestamp: updatedTimestamp,
                end_timestamp: updatedTimestamp,
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

  // const queryToSendResult = `CALL trx_clear_bet(?);`;

  // await queryDb(queryToSendResult, [Number(num)])
  //   .then((result) => {})
  //   .catch((e) => {
  //     console.log("Something went wrong in clear one bet trx");
  //   });
};

exports.generatedTimeEveryAfterEveryThreeMinTRX = (io) => {
  let min = 2;
  let twoMinTrxJob = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("threemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 6) {
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

  // const queryToSendResult = `CALL trx_clear_bet_3_min(?);`;

  // await queryDb(queryToSendResult, [Number(num)])
  //   .then((result) => {})
  //   .catch((e) => {
  //     console.log("Something went wrong in clear one bet trx");
  //   });
}

exports.generatedTimeEveryAfterEveryFiveMinTRX = (io) => {
  let min = 4;
  let threeMinTrxJob = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date().getSeconds(); // Get the current time
    const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
    io.emit("fivemintrx", `${min}_${timeToSend}`);
    if (min === 0 && timeToSend === 6) {
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
      }, [5000]);
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

  // const queryToSendResult = `CALL trx_clear_bet_5_min(?);`;

  // await queryDb(queryToSendResult, [Number(num)])
  //   .then((result) => {})
  //   .catch((e) => {
  //     console.log("Something went wrong in clear one bet trx");
  //   });
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
  let jackpodTrxJob = schedule.schedule("* * * * * *", async function () {
    // let interval = setInterval(async () => {
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
exports.startJackPod = async (req, res) => {
  const query = "UPDATE `admin_setting` SET `longtext` = 1 WHERE id = 17;";
  await queryDb(query, [])
    .then((result) => {
      return res.status(200).json({
        msg: "Record get successfully",
      });
    })
    .catch((e) => {
      return failMsg("something went wrong in data fetching game history");
    });
};
exports.chnagePassWord = async (req, res) => {
  const { userid, old_pass, new_pass, confirm_new_pass } = req.body;
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
exports.getMyHistoryTemp = async (req, res) => {
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
      query = `SELECT * FROM trx_colour_bet_temp WHERE userid = ? AND gameid = 1 ORDER BY gamesno DESC LIMIT 100;`;
    } else if (num_gameid === 2) {
      query = `SELECT * FROM trx_colour_bet_temp WHERE userid = ? AND gameid = 2 ORDER BY gamesno DESC LIMIT 100;`;
    } else {
      query = `SELECT * FROM trx_colour_bet_temp WHERE userid = ? AND gameid = 3 ORDER BY gamesno DESC LIMIT 100;`;
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

  let get_round = "";
  if (num_gameid === 1) {
    get_round = `SELECT tr_tranaction_id FROM tr_game WHERE tr_id = 4;`;
  } else if (num_gameid === 2) {
    get_round = `SELECT tr_tranaction_id FROM tr_game WHERE tr_id = 5;`;
  } else {
    get_round = `SELECT tr_tranaction_id FROM tr_game WHERE tr_id = 6;`;
  }
  const get_round_number =
    get_round !== "" &&
    (await queryDb(get_round, [])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Something went wrong in get round.");
      }));
  await getAlredyPlacedBet([
    String(Number(get_round_number?.[0]?.tr_tranaction_id) + 1),
    String(userid),
    num_gameid,
  ]).then(async (result) => {
    if (
      [10, 20, 30]?.includes(Number(number)) &&
      result?.find((i) => [10, 20, 30]?.includes(Number(i?.number)))
    ) {
      return res.status(200).json({
        msg: `Already Placed on color`,
      });
    } else if (
      [40, 50]?.includes(Number(number)) &&
      result?.find((i) => [40, 50]?.includes(Number(i?.number)))
    ) {
      return res.status(200).json({
        msg: `Already placed on big/small`,
      });
    } else if (
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.includes(Number(number)) &&
      result?.filter((i) =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.includes(Number(i?.number))
      )?.length > 2
    ) {
      return res.status(200).json({
        msg: `You have already placed 3  bets.`,
      });
    } else {
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
    }
  });
};

exports.loginPage = async (req, res) => {
  const { password, username, ipAddress } = req.body;
  if (!password || !username)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  try {
    // const query = `SELECT id FROM user WHERE (email = ? OR mobile = ?)  AND password = ? AND is_blocked_status = 1;`;
    const query = `CALL sp_for_login_user(?,?,?,?,@user_id,@msg); SELECT @user_id,@msg;`;
    await queryDb(query, [
      username,
      username,
      password,
      String(ipAddress || ""),
    ])
      .then((newresult) => {
        return res.status(200).json({
          msg: newresult?.[1]?.[0]?.["@msg"],
          UserID: newresult?.[1]?.[0]?.["@user_id"],
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
  // fn_check_total_bet_for_withdrawl(?)
  try {
    const query = `SELECT total_payin,total_payout,transaction_status,working_wallet,cricket_wallet,wallet,winning_wallet,today_turnover,username,email,referral_code,full_name,mobile,0 AS need_amount_for_withdrawl FROM user WHERE id = ?;`;
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
            transaction_status: newresult?.[0]?.transaction_status,
            cricket_wallet: newresult?.[0]?.cricket_wallet,
            working_wallet: newresult?.[0]?.working_wallet,
            wallet: newresult?.[0]?.wallet,
            winning: newresult?.[0]?.winning_wallet,
            total_turnover: newresult?.[0]?.today_turnover,
            username: newresult?.[0]?.username,
            email: newresult?.[0]?.email,
            referral_code: newresult?.[0]?.referral_code,
            full_name: newresult?.[0]?.full_name,
            need_amount_for_withdrawl:
              newresult?.[0]?.need_amount_for_withdrawl,
            mob_no: newresult?.[0]?.mobile,
            total_payin: newresult?.[0]?.total_payin,
            total_payout: newresult?.[0]?.total_payout,
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
exports.getTopWinners = async (req, res) => {
  try {
    const query = `SELECT u.email, u.full_name, SUM(IFNULL(t.win,0)) AS win
      FROM trx_colour_bet AS t
      RIGHT JOIN user AS u ON u.id = t.userid 
      WHERE t.win IS NOT NULL 
  AND t.datetime IS NOT NULL 
  AND DATE(t.datetime) >= DATE(NOW()) - INTERVAL 3 DAY
  GROUP BY u.email, u.full_name  
  ORDER BY SUM(IFNULL(t.win,0)) DESC
  LIMIT 10;`;
    await queryDb(query, [])
      .then((newresult) => {
        return res.status(200).json({
          msg: "Data fetched successfully",
          data: newresult,
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

  let get_round = "";
  if (Number(gameId) === 1) {
    get_round = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 1;`;
  } else if (Number(gameId) === 2) {
    get_round = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 2;`;
  } else {
    get_round = `SELECT win_transactoin FROM wingo_round_number WHERE win_id = 3;`;
  }
  const get_round_number =
    get_round !== "" &&
    (await queryDb(get_round, [])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Something went wrong in get round.");
      }));

  await getAlredyPlacedBetOnWingo([
    String(Number(get_round_number?.[0]?.win_transactoin) + 1),
    String(userid),
    Number(gameId),
  ]).then(async (result) => {
    if (
      [10, 20, 30]?.includes(Number(number)) &&
      result?.find((i) => [10, 20, 30]?.includes(Number(i?.number)))
    ) {
      return res.status(200).json({
        msg: `Already Placed on color`,
      });
    } else if (
      [40, 50]?.includes(Number(number)) &&
      result?.find((i) => [40, 50]?.includes(Number(i?.number)))
    ) {
      return res.status(200).json({
        msg: `Already placed on big/small`,
      });
    } else if (
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.includes(Number(number)) &&
      result?.filter((i) =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]?.includes(Number(i?.number))
      )?.length > 2
    ) {
      return res.status(200).json({
        msg: `You have already placed 3  bets.`,
      });
    } else {
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
    }
  });
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

exports.getLevels = async (req, res) => {
  try {
    const { userid } = req.query;
    if (!userid)
      return res.status(201).json({
        msg: "Please provide uesr id.",
      });
    const id_in_number = Number(userid);
    if (typeof id_in_number !== "number")
      return res.status(201).json({
        msg: "Something went wrong.",
      });
    const query = `CALL sp_get_levels_data(?,?,@yesterday_income,@this_week_income,@total_commission); SELECT @yesterday_income,@this_week_income,@total_commission;`;
    await queryDb(query, [Number(id_in_number), 6]) ///////////////////// second parameter should be (level+1)
      .then((result) => {
        res.status(200).json({
          msg: "Data get successfully",
          data: result?.[0],
          yesterday_income: result?.[2]?.[0]?.["@yesterday_income"],
          this_week_income: result?.[2]?.[0]?.["@this_week_income"],
          total_commission: result?.[2]?.[0]?.["@total_commission"],
        });
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

exports.getDepositlHistory = async (req, res) => {
  const { userid } = req.query;

  if (!userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  const num_userid = Number(userid);

  if (typeof num_userid !== "number")
    return res.status(200).json({
      msg: `User id should be in number`,
    });
  try {
    const query = `SELECT user_id,to_coin,amt,order_id,status,created_at,success_date FROM m05_fund_gateway WHERE user_id = ? ORDER BY id DESC;`;
    await queryDb(query, [Number(num_userid)])
      .then((newresult) => {
        if (newresult?.length === 0) {
          return res.status(200).json({
            error: "400",
            msg: "Something went wrong",
          });
        }
        return res.status(200).json({
          error: "200",
          data: newresult,
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
exports.getWithdrawlHistory = async (req, res) => {
  const { userid } = req.query;

  if (!userid)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  const num_userid = Number(userid);

  if (typeof num_userid !== "number")
    return res.status(200).json({
      msg: `User id should be in number`,
    });
  try {
    const query = `SELECT * FROM tr12_withdrawal WHERE m_u_id = ?;`;
    await queryDb(query, [Number(num_userid)])
      .then((newresult) => {
        if (newresult?.length === 0) {
          return res.status(200).json({
            error: "400",
            msg: "Something went wrong",
          });
        }
        return res.status(200).json({
          error: "200",
          data: newresult,
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

exports.addUSDTAddress = async (req, res) => {
  const { m_u_id, address, coin_type } = req.body;
  if (!m_u_id || !address || !coin_type)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  const num_userid = Number(m_u_id);

  if (typeof num_userid !== "number")
    return res.status(200).json({
      msg: `User id should be in number`,
    });

  try {
    const query_for_check_already_exist_address =
      "SELECT id FROM coin_payment_address_record WHERE userid = ?,coin_type = ? LIMIT 1;";

    let isAvailable = 0;
    isAvailable = await queryDb(query_for_check_already_exist_address, [
      Number(num_userid),
      Number(coin_type || 1),
    ])
      ?.then((result) => {
        return result?.[0]?.id;
      })
      .catch((e) => {
        return res.status(500)?.json({ msg: "Something went wrong." });
      });
    if ((isAvailable || 0) !== 0)
      return res.status(201)?.json({
        msg: "You have already added usdt address.",
      });
    const query = `INSERT INTO coin_payment_address_record(userid,usdt_address,coin_type) VALUES(?,?,?);`;
    await queryDb(query, [
      Number(num_userid),
      String(address),
      Number(coin_type || 1),
    ])
      .then((newresult) => {
        if (newresult?.length === 0) {
          return res.status(200).json({
            error: "400",
            msg: "Something went wrong",
          });
        }
        return res.status(200).json({
          error: "200",
          msg: "Record saved successfully.",
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

exports.uddtAddressHistory = async (req, res) => {
  const { m_u_id } = req.query;
  if (!m_u_id)
    return res.status(200).json({
      msg: `Everything is required`,
    });

  const num_userid = Number(m_u_id);

  if (typeof num_userid !== "number")
    return res.status(200).json({
      msg: `User id should be in number`,
    });

  try {
    const query = `SELECT * FROM coin_payment_address_record WHERE userid = ?;`;
    await queryDb(query, [Number(num_userid)])
      .then((newresult) => {
        return res.status(200).json({
          error: "200",
          msg: "Record saved successfully.",
          data: newresult,
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

exports.getLevelIncome = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(201).json({
        msg: "Please provide id.",
      });
    }

    const query_for_get_referral_bonus =
      "SELECT * FROM `leser` WHERE l01_user_id = ? AND l01_type = 'Level' ORDER BY DATE(l01_date) DESC;";
    const data = await queryDb(query_for_get_referral_bonus, [Number(id)])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Error in fetch level income");
      });

    return res.status(200).json({
      msg: "Data get successfully",
      data: data,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong.",
    });
    console.log("Error in massWithdrawilRequest");
  }
};
exports.getSelfDepositBonus = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(201).json({
        msg: "Please provide id.",
      });
    }

    const query_for_get_referral_bonus =
      "SELECT * FROM leser WHERE  l01_user_id = ? AND (l01_type = 'Bonus' OR l01_type = 'Self Deposit Bonus') ORDER BY lo1_id DESC;";
    const data = await queryDb(query_for_get_referral_bonus, [Number(user_id)])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Error in fetch level income");
      });

    return res.status(200).json({
      msg: "Data get successfully",
      data: data,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong.",
    });
    console.log("Error in massWithdrawilRequest");
  }
};
exports.getSponsorIncome = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(201).json({
        msg: "Please provide id.",
      });
    }

    const query_for_get_referral_bonus =
      "SELECT * FROM leser WHERE  l01_user_id = ? AND (l01_type = 'Reffral' OR l01_type = 'Sponsor Deposit Bonus') ORDER BY lo1_id DESC;";
    const data = await queryDb(query_for_get_referral_bonus, [Number(user_id)])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Error in fetch level income");
      });

    return res.status(200).json({
      msg: "Data get successfully",
      data: data,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong.",
    });
    console.log("Error in massWithdrawilRequest");
  }
};
exports.needToBet = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(201).json({
        msg: "Please provide id.",
      });
    }

    const query_for_get_referral_bonus =
      "SELECT fn_check_total_bet_for_withdrawl(?) AS amount;";
    const data = await queryDb(query_for_get_referral_bonus, [Number(user_id)])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Error in fetch level income");
      });

    return res.status(200).json({
      msg: "Data get successfully",
      data: data?.[0]?.amount,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong.",
    });
    console.log("Error in massWithdrawilRequest");
  }
};
exports.getDailySalaryIncome = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(201).json({
        msg: "Please provide id.",
      });
    }

    const query_for_get_referral_bonus =
      "SELECT * FROM `leser` WHERE l01_user_id = ? AND l01_type = 'Daily Income' ORDER BY DATE(l01_date) DESC;";
    const data = await queryDb(query_for_get_referral_bonus, [Number(id)])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Error in fetch level income");
      });

    return res.status(200).json({
      msg: "Data get successfully",
      data: data,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong.",
    });
    console.log("Error in massWithdrawilRequest");
  }
};
exports.getWeeklySalaryIncome = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(201).json({
        msg: "Please provide id.",
      });
    }

    const query_for_get_referral_bonus =
      "SELECT * FROM `leser` WHERE l01_user_id = ? AND l01_type = 'Weekly Bonus' ORDER BY DATE(l01_date) DESC;";
    const data = await queryDb(query_for_get_referral_bonus, [Number(id)])
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log("Error in fetch level income");
      });

    return res.status(200).json({
      msg: "Data get successfully",
      data: data,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong.",
    });
    console.log("Error in massWithdrawilRequest");
  }
};

exports.getStatus = async (req, res) => {
  try {
    const query = "SELECT * FROM `admin_setting` WHERE id IN (14,15,16)";
    const result = await queryDb(query, [])
      ?.then((result) => {
        return result;
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
    return res.status(200).json({
      msg: `Data get successfully`,
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};

exports.getSubOrdinateData = async (req, res) => {
  try {
    const { user_main_id, level_no, in_date } = req.body;

    if (!user_main_id || !String(level_no) || !in_date)
      return res.status(201).json({
        msg: `Please provide everything`,
      });

    let actual_level = Number(level_no);
    if (typeof actual_level !== "number") {
      return res.status(201).json({
        msg: `Please provide Valid Level No.`,
      });
    }

    const query = "CALL get_all_income_from_team(?,?,?);";
    const params = [
      Number(user_main_id),
      Number(level_no),
      moment(in_date)?.format("YYYY-MM-DD"),
    ];
    const result = await queryDb(query, params)
      ?.then((result) => {
        return result;
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
    return res.status(200).json({
      msg: `Data get successfully`,
      data: result?.[0],
    });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};

exports.getAllCommission = async (req, res) => {
  try {
    const { user_main_id, in_date } = req.body;

    if (!user_main_id || !in_date)
      return res.status(201).json({
        msg: `Please provide everything`,
      });
    const query = "CALL sp_get_commission_details_perday(?,?);";
    const params = [
      Number(user_main_id),
      moment(in_date)?.format("YYYY-MM-DD"),
    ];
    const result = await queryDb(query, params)
      ?.then((result) => {
        return result;
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
    return res.status(200).json({
      msg: `Data get successfully`,
      data: result?.[0],
    });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};

exports.transfer_Amount_to_mainWallet_from_WorkingWallet = async (req, res) => {
  try {
    const { userid, amount, password } = req.body;

    if (!userid || !amount || !password)
      return res.status(201).json({
        msg: `Please provide everything`,
      });

    if (Number(amount) <= 0)
      return res.status(201).json({
        msg: `Please Enter Your Amount.`,
      });

    const query_for_check_working_wallet =
      "CALL sp_transfer_amount_working_wallet_to_main_wallet(?,?,?,?,@result_msg); SELECT @result_msg;";

    await queryDb(query_for_check_working_wallet, [
      Number(amount)?.toFixed(4),
      Number(userid),
      String(Date.now()),
      password,
    ])
      ?.then((result) => {
        return res.status(200).json({
          msg: result?.[1]?.[0]?.["@result_msg"],
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};
exports.get_transfer_history_working_to_main_wallet = async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid)
      return res.status(201).json({
        msg: `Please provide everything`,
      });

    const query_for_check_working_wallet =
      "SELECT * FROM `leser_transfer_wallet` WHERE `l01_user_id` = ?;";

    await queryDb(query_for_check_working_wallet, [Number(userid)])
      ?.then((result) => {
        return res.status(200).json({
          msg: "Data seccessfully fount",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};
exports.getCashBack = async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid)
      return res.status(201).json({
        msg: `Please provide everything`,
      });

    const query_for_check_working_wallet =
      "SELECT * FROM leser WHERE `l01_user_id` = ? AND `l01_type` = 'Caseback';";

    await queryDb(query_for_check_working_wallet, [Number(userid)])
      ?.then((result) => {
        return res.status(200).json({
          msg: "Data seccessfully fount",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};

exports.getTotalBetAndIncomeYesterday = async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid)
      return res.status(201).json({
        msg: `Please provide everything`,
      });

    const query_for_check_working_wallet =
      "SELECT level_1_income,level_2_income,level_3_income,level_4_income,level_5_income,level_6_income,level_1_total_bet,level_2_total_bet,level_3_total_bet,level_4_total_bet,level_5_total_bet,level_6_total_bet,yesterday_income,direct_reg,team_reg,direct_depo_mem,team_depo_mem,direct_yest_depo,team_yest_depo,this_week_commission,total_commission,total_my_deposit_till_yest,total_direct_depo_till_yest,total_my_team_depo_till_this_month,total_my_withdr_till_yest,total_direct_withdr_till_yest,total_my_team_withdr_till_this_month,current_week_team_bet,total_my_salary,salary_achiever_member,my_withdrawal_status FROM user WHERE id = ?;";

    await queryDb(query_for_check_working_wallet, [Number(userid)])
      ?.then((result) => {
        return res.status(200).json({
          msg: "Data seccessfully fount",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};

exports.addFundUser = async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    if (!user_id || !amount)
      return res.status(201).json({
        msg: `Please provide everything`,
      });

    const query_for_check_working_wallet =
      "SELECT fn_add_fun_to_user(?,?) AS msg;";

    await queryDb(query_for_check_working_wallet, [
      Number(user_id),
      Number(amount || 0),
    ])
      ?.then((result) => {
        return res.status(200).json({
          msg: result?.[0]?.msg,
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};
exports.changeUserPassword = async (req, res) => {
  try {
    const { user_id, pass } = req.body;

    if (!user_id || !pass)
      return res.status(201).json({
        msg: `Please provide everything`,
      });

    const query_for_check_working_wallet =
      "UPDATE user SET password = ? WHERE id = ?;";

    await queryDb(query_for_check_working_wallet, [pass, Number(user_id)])
      ?.then((result) => {
        return res.status(200).json({
          msg: "Password updated successfully.",
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};

exports.getUserId = async (req, res) => {
  try {
    const { mobile_no } = req.body;

    if (!mobile_no)
      return res.status(201).json({
        msg: `Please provide everything`,
      });

    const query_for_check_working_wallet =
      "SELECT * FROM `user` WHERE (`mobile` = ? OR `username` = ?) LIMIT 1;";

    await queryDb(query_for_check_working_wallet, [
      String(mobile_no),
      String(mobile_no),
    ])
      ?.then((result) => {
        return res.status(200).json({
          msg: result?.[0],
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: `Something went wrong api calling`,
        });
      });
  } catch (e) {
    return res.status(500).json({
      msg: `Something went wrong api calling`,
    });
  }
};

exports.ticketRaised = async (req, res) => {
  const { user_id, files, type, description } = req.body;

  // Define maximum file size in bytes (e.g., 2MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  // Function to calculate file size from base64 string
  const calculateBase64Size = (base64String) => {
    const padding = (base64String.match(/=*$/) || [""])[0].length; // Get the padding length
    const sizeInBytes = (base64String.length * 3) / 4 - padding;
    return sizeInBytes;
  };

  // Check if user_id is provided and valid
  if (!user_id || !type || !description) {
    return res.status(400).json({
      msg: `User ID is required`,
    });
  }

  if (Number(user_id) <= 0) {
    return res.status(400).json({
      msg: `Invalid User ID. Please refresh your page`,
    });
  }

  const id = Number(user_id);

  if (isNaN(id)) {
    return res.status(400).json({
      msg: `User ID must be a number`,
    });
  }

  // Validate the file size
  if (files) {
    const fileSize = calculateBase64Size(files.split(",")[1]); // Split the base64 data to get the actual data part
    if (fileSize > MAX_FILE_SIZE) {
      return res.status(400).json({
        msg: `File size exceeds the limit of ${
          MAX_FILE_SIZE / (1024 * 1024)
        } MB`,
      });
    }
  } else {
    return res.status(400).json({
      msg: "File data is required",
    });
  }

  try {
    const query =
      "INSERT INTO ticket_raised_table(`userid`,ticket_id,`ticket_type`,description,`file_name`) VALUES(?,?,?,?,?);";
    await queryDb(query, [
      id,
      Date.now(),
      Number(type || 1),
      description || "",
      files,
    ])
      .then((result) => {
        return res.status(200).json({
          msg: "Data saved successfully",
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: "Something went wrong while saving data.",
        });
      });
  } catch (e) {
    return res.status(500).json({
      msg: "Something went wrong in the node API",
    });
  }
};

exports.getTicketRaisedHistory = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({
      msg: `User ID is required`,
    });
  }

  if (Number(user_id) <= 0) {
    return res.status(400).json({
      msg: `Invalid User ID. Please refresh your page`,
    });
  }

  const id = Number(user_id);

  if (isNaN(id)) {
    return res.status(400).json({
      msg: `User ID must be a number`,
    });
  }

  try {
    const query =
      "SELECT * FROM `ticket_raised_table` WHERE userid = ? ORDER BY id DESC;";
    const results = await queryDb(query, id);

    return res.status(200).json({
      msg: "Data retrieved successfully",
      data: results,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went wrong in the node API",
    });
  }
};
exports.getTicketRaisedHistoryAdmin = async (req, res) => {
  try {
    const query =
      "SELECT t.*,u.`username`,u.`mobile`,u.`full_name` FROM `ticket_raised_table` AS t LEFT JOIN `user` AS u ON u.`id` = t.`userid` ORDER BY t.`id` DESC;";
    const results = await queryDb(query);

    return res.status(200).json({
      msg: "Data retrieved successfully",
      data: results,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went wrong in the node API",
    });
  }
};
exports.updateTicketIssue = async (req, res) => {
  const { t_id, dis } = req.body;
  if (!t_id || !dis) {
    return res.status(400).json({
      msg: `Everuything is required`,
    });
  }
  try {
    const query =
      "UPDATE `ticket_raised_table` SET `resolution` = ? , `resolution_date` = NOW(),`status` = 1 WHERE `id` = ?;";
    const results = await queryDb(query, [dis || "", Number(t_id)]);

    return res.status(200).json({
      msg: "Data retrieved successfully",
      data: results,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went wrong in the node API",
    });
  }
};

exports.payInRequest = async (req, res) => {
  // const userid = req.userid;
  const {
    userid,
    req_amount,
    utr_no,
    deposit_type,
    bank_upi_table_id,
    receipt_image,
  } = req.body;
  if (
    !userid ||
    !req_amount ||
    !utr_no ||
    !deposit_type ||
    !bank_upi_table_id ||
    !receipt_image
  )
    return res.status(201)?.json({
      msg: "Everything is required.",
    });
  try {
    const query =
      "CALL sp_manual_fund_request(?,?,?,?,?,?,?,?,?,@res_msg); SELECT @res_msg;";
    await queryDb(query, [
      1,
      Number(userid),
      Number(req_amount || 0),
      utr_no,
      Number(deposit_type),
      Number(bank_upi_table_id),
      1,
      receipt_image,
      "",
    ])
      .then((result) => {
        return res.status(200).json({
          msg: result?.[1]?.[0]?.["@res_msg"],
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: "Something went wrong in the node API",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went worng in node api",
    });
  }
};

exports.getAdminQrAddress = async (req, res) => {
  try {
    const query = "SELECT * FROM `admin_usdt_address`;";
    const results = await queryDb(query, []);

    return res.status(200).json({
      msg: "Data retrieved successfully",
      data: results,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went wrong in the node API",
    });
  }
};

exports.usdtPayinRequest = async (req, res) => {
  try {
    const { type } = req.query;
    const query =
      "SELECT m.*,u.`full_name`,u.`username`,u.`mobile` FROM `m05_fund_gateway` AS m LEFT JOIN `user` AS u ON u.id = m.`user_id` WHERE m.`status` = ? ORDER BY m.id DESC;";
    await queryDb(query, [Number(type) || 1])
      .then((newresult) => {
        return res.status(200).json({
          error: "200",
          msg: "Record saved successfully.",
          data: newresult,
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
exports.payInRequestApproval = async (req, res) => {
  // const userid = req.userid;
  const { t_id } = req.query;

  try {
    const query =
      "CALL sp_manual_fund_request(?,?,?,?,?,?,?,?,?,@res_msg); SELECT @res_msg;";
    await queryDb(query, [2, 123, 123, "34ahlskjf", 1, 123, t_id, "", ""])
      .then((result) => {
        return res.status(200).json({
          msg: result?.[1]?.[0]?.["@res_msg"],
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: "Something went wrong in the node API",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went worng in node api",
    });
  }
};
exports.payInRequestReject = async (req, res) => {
  // const userid = req.userid;
  const { t_id } = req.query;

  try {
    const query =
      "CALL sp_manual_fund_request(?,?,?,?,?,?,?,?,?,@res_msg); SELECT @res_msg;";
    await queryDb(query, [3, 123, 123, "34ahlskjf", 1, 123, t_id, "", ""])
      .then((result) => {
        return res.status(200).json({
          msg: result?.[1]?.[0]?.["@res_msg"],
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: "Something went wrong in the node API",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went worng in node api",
    });
  }
};

////////// payout
exports.usdtPayOutRequestAdmin = async (req, res) => {
  try {
    const { type } = req.query;
    const query =
      "SELECT w.*,u.`full_name`,u.`mobile`,u.`username` FROM `tr12_withdrawal` AS w LEFT JOIN `user` AS u ON u.`id` = w.`m_u_id` WHERE w.`m_w_status` = ? ORDER BY w.`w_id` DESC;";
    await queryDb(query, [Number(type) || 1])
      .then((newresult) => {
        return res.status(200).json({
          error: "200",
          msg: "Record saved successfully.",
          data: newresult,
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

exports.payOutRequestApproval = async (req, res) => {
  // const userid = req.userid;
  const { t_id } = req.query;

  try {
    const query =
      "UPDATE `tr12_withdrawal` SET `m_w_status` = 2 , `m_w_crypto_status` = 2, `success_date` = NOW(),`m_w_approvedate` = NOW() WHERE `w_id` = ?;";
    await queryDb(query, [Number(t_id)])
      .then((result) => {
        return res.status(200).json({
          msg: "Approval Request Accepted successfully",
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: "Something went wrong in the node API",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went worng in node api",
    });
  }
};

exports.payOutRequestReject = async (req, res) => {
  // const userid = req.userid;
  const { t_id } = req.query;

  try {
    const query =
      "UPDATE `tr12_withdrawal` SET `m_w_status` = 3 WHERE `w_id` = ?;";
    await queryDb(query, [Number(t_id)])
      .then((result) => {
        return res.status(200).json({
          msg: "Request Rejected Successfully.",
        });
      })
      .catch((e) => {
        return res.status(500).json({
          msg: "Something went wrong in the node API",
        });
      });
    const query_for_cashback =
      "SELECT m_w_amount_inr,m_u_id,w_wallet_type FROM  `tr12_withdrawal` WHERE `w_id` = ?;";
    const response = await queryDb(query_for_cashback, [Number(t_id)]);
    const insert_in_leser =
      "INSERT INTO leser(`l01_user_id`,`l01_type`,`l01_transection_type`,`l01_amount`,`l01_status`) VALUES(?,?,?,?,?);";
    await queryDb(insert_in_leser, [
      Number(response?.[0]?.m_u_id),
      "Caseback",
      "USDT Cashback Get Successfully.",
      Number(response?.[0]?.m_w_amount_inr || 0),
      1,
    ]);
    if (response?.[0]?.w_wallet_type === "Main Wallet") {
      const insert_in_user =
        "UPDATE user SET winning_wallet = IFNULL(winning_wallet,0)+? WHERE id = ?";
      await queryDb(insert_in_user, [
        Number(response?.[0]?.m_w_amount_inr || 0),
        Number(response?.[0]?.m_u_id),
      ]);
    } else {
      const insert_in_user =
        "UPDATE user SET working_wallet = IFNULL(working_wallet,0)+? WHERE id = ?";
      await queryDb(insert_in_user, [
        Number(response?.[0]?.m_w_amount_inr || 0),
        Number(response?.[0]?.m_u_id),
      ]);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "Something went worng in node api",
    });
  }
};
