const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let result = null;
  let param = null;

  param = req.body;

  counter = param.counterSecretKey;

  try {
    const getOrder = await model.getOrderPOS(counter);

    if (getOrder) {
      result = {
        status: 200,
        message: "Success",
        data: getOrder,
      };
    } else if (getOrder == false) {
      result = {
        status: 200,
        message: "No data",
      };
    }
  } catch (error) {
    console.log(error); // LOG ERROR

    result = {
      status: 500,
      message: `API Error`,
    };
  }

  // RETURN
  res.status(result.status).json(result);
});

module.exports = router;
