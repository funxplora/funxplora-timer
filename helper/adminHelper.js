"user strict";
const { default: axios } = require("axios");
var sql = require("../config/db.config");
// const path = require("path");

module.exports = {
  randomStr: function (len, arr) {
    let ans = "";
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  },
  oneMinColorWining: async function () {
    try {
      await axios
        .get(`https://admin.funxplora.com/api/colour_winning?id=1&gid=1`)
        .then((result) => {})
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  },
  oneMinColorWinning2min: async function () {
    try {
      await axios
        .get(`https://admin.funxplora.com/api/colour_winning?id=2&gid=2`)
        .then((result) => {})
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  },
  oneMinColorWinning3sec: async function () {
    try {
      await axios
        .get(`https://admin.funxplora.com/api/colour_winning?id=3&gid=3`)
        .then((result) => {})
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  },
  oneMinTrxSendReleasNumber: async function (param) {
    const response = await axios
      .get(`https://admin.funxplora.com/api/trx-winning-result`, {
        params: param,
      })
      .then((result) => {})
      .catch((e) => {
        console.log(e);
      });
  },
  oneThreeTrxSendReleasNumber: async function (param) {
    const response = await axios
      .get(`https://admin.funxplora.com/api/trx-winning-result`, {
        params: param,
      })
      .then((result) => {})
      .catch((e) => {
        console.log(e);
      });
  },
  oneFiveTrxSendReleasNumber: async function (param) {
    const response = await axios
      .get(`https://admin.funxplora.com/api/trx-winning-result`, {
        params: param,
      })
      .then((result) => {})
      .catch((e) => {
        console.log(e);
      });
  },
  getTransactionidForJackPod: function (params) {
    const param = params;
    const get_query_for_trans_id = `SELECT tr_tranaction_id FROM tr_game WHERE tr_id = 7;`;
    return new Promise((resolve, reject) => {
      sql.query(get_query_for_trans_id, param, (err, result) => {
        if (err) {
          //return reject(err);
          return console.log(err);
        }
        resolve(result);
      });
    });
  },
  jackPodClearBet: function (params) {
    const param = params;
    const call_bet_clear_sp = `CALL clear_bet_jackpod(?)`;
    return new Promise((resolve, reject) => {
      sql.query(call_bet_clear_sp, param, (err, result) => {
        if (err) {
          //return reject(err);
          return console.log(err);
        }
        resolve(result);
      });
    });
  },
  updateMediatorTableJackPod: function (params) {
    const param = params;
    const queryUpdateMediatoTable = `UPDATE jackpod_mediator SET net_amount = ?,game_num = ?;`;
    return new Promise((resolve, reject) => {
      sql.query(queryUpdateMediatoTable, param, (err, result) => {
        if (err) {
          //return reject(err);
          return console.log(err);
        }
        resolve(result);
      });
    });
  },

  queryDb: function (query, param) {
    return new Promise((resolve, reject) => {
      sql.query(query, param, (err, result) => {
        if (err) {
          //return reject(err);
          return console.log(err);
        }
        resolve(result);
      });
    });
  },
};
