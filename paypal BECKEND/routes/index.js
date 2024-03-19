var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

});

const paypal = require('paypal-rest-sdk');


paypal.configure({
  'mode': "sandbox",
  'client_id': "Af9NvDup1SIaCRPrfjnhJLMmSnk749rkSTFaKp7t3HroI5XULl8ou66W_RoQ8Ec980ieggHV2BhsF5bL",
  'client_secret': "EPrGXlHAqHlL7MfF1X99K4UGzGGkVtBLfkwNw_Drtxtzpy-xHg9cF6gUzmLNvI0mqSMVV7Rjwok8OADt"
});

router.post('/paypal', async (req, res) => {
  try {
    let amount = req.body.amount; // This is the amount the
    // let amount = 1; // This is the amount the
    console.log(amount);
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:5000/success",
        "cancel_url": "http://localhost:5000/checkout"
      },
      "transactions": [{
        "amount": {
          "total": amount,
          "currency": "USD",
        },
        "description": "Sample payment description"
      }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.log(error);
        return res.status(400).json(error);
      } else {
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
        return res.status(200).json({
          status: true,
          approvalUrl
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
})
router.get('/success', async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log(payerId, paymentId)
    const executePayment = {
      payer_id: payerId,
    };
    paypal.payment.execute(paymentId, executePayment, async (error, payment) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          message: error.message
        })
      } else {
        console.log("success", payment);
        await payment.transactions.map(i => {
          i.related_resources.map(id => {
            a = id.sale.id;
          })
        });
        // console.log(a);

        return res.render("index");
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    })
  }
})
router.get('/cancel', (req, res) => {
  // return res.send('Payment canceled');
  return res.render("cancel");
});
// yuanevelyn54@gmail.com

// ElijahR03*
module.exports = router;
