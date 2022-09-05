const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Shift.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let result = null;
  let param = null;

  param = req.body;

  counter = param.counterSecretKey;
  staff_id = param.staff_id;
  cash_open = param.cash_open;

  try {
    const insertShift = await model.insertShift( counter, cash_open , staff_id);

    if (insertShift == false) {
        result = {
            status: 500,
            message: `API Error`,
          };
    }

    if (insertShift) {
      result = {
        status: 200,
        message: "Success",
        data: insertShift,
      };
    } 
  } catch (error) {
    // console.log(error); // LOG ERROR

    result = {
      status: 500,
      message: `API Error`,
      data: error,
    };
  }

  // RETURN
  res.status(result.status).json(result);
});

module.exports = router;
