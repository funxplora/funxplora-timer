const Coinpayments = require("coinpayments");
const { queryDb } = require("../helper/adminHelper");

exports.getPaymentGateway = async (req, res) => {
  const { amount, userid } = req.body;
  const transactonNo = Date.now();
  if (!amount || !userid)
    return res.status(201).json({
      msg: "Everything is required",
    });

  const num_amount = Number(amount || 0);
  if (typeof num_amount !== "number")
    return res.status(201).json({
      msg: "Amount should be in number data type",
    });
  try {
   

    const client = new Coinpayments(credentials);

    const CoinpaymentsCreateTransactionOpts = {
      currency1: "USDT.BEP20",
      currency2: "USDT.BEP20",
      amount: Number(num_amount || 0),
      buyer_email: "suretradefx24@gmail.com",
      address: "", // Optional, for some currencies
      buyer_name: "Arun Kumar", // Optional
      item_name: "", // Optional
      item_number: "", // Optional
      invoice: transactonNo,
      custom: "", // Optional
      ipn_url: "", // Optional
      success_url: "https://funxplora.com/",
      cancel_url: "https://funxplora.com/",
    };

    const response = await client.createTransaction(
      CoinpaymentsCreateTransactionOpts
    );

    const params = [
      Number(userid),
      "USDT.BEP20",
      Number(num_amount),
      `${transactonNo}`,
      JSON.stringify({
        txtamount: Number(num_amount),
        coin: "USDT.BEP20",
      }),
      JSON.stringify(response),
      `${response?.address}`,
      `${response?.status_url}`,
      `${response?.qrcode_url}`,
    ];
    await saveDataIntoTable(params);
    res.status(200).json({
      data: response,
    });
    setTimeout(async () => {
      await functionForCallback(client, transactonNo);
    }, 3000);
  } catch (e) {
    console.log(e);
    const params = [
      Number(userid),
      "USDT.BEP20",
      Number(num_amount),
      `${transactonNo}`,
      JSON.stringify({
        txtamount: Number(num_amount),
        coin: "USDT.BEP20",
      }),
      JSON.stringify(e),
      "",
      "",
      "",
    ];
    await saveDataIntoTable(params);
    res.status(400).json({
      error: "Something went wrong",
    });
  }
};

async function saveDataIntoTable(params) {
  try {
    const query = `INSERT INTO m05_fund_gateway(user_id,to_coin,amt,order_id,request,response,address,status_url,qrcode_url)
        VALUES(
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
        );`;
    const response_Gateway_data = await queryDb(query, params)
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log(
          "Something went in insert data in table at the usdt gateway"
        );
      });
  } catch (e) {
    console.log(e);
  }
}

async function functionForCallback(client, transactonNo) {
  console.log(transactonNo);
  const CoinpaymentsGetTxOpts = {
    txid: `${transactonNo}`,
    full: 1,
  };
  await client
    .getTx({ options: CoinpaymentsGetTxOpts })
    .then((result) => {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });
}

exports.getCallBack = async (req, res) => {
  console.log(req);
};


