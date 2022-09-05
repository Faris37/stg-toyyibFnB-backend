const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Shift.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let result = null;
  let param = null;

  param = req.body;

  shift_id = param.shift_id;
  cash_open = param.cash_open;
  type = param.type;

  try {
    const updateShift = await model.updateShift(shift_id, cash_open, type);

    if (updateShift == false) {
      result = {
        status: 500,
        message: `API Error`,
      };
    }

    if (updateShift) {
      result = {
        status: 200,
        message: "Success",
        data: updateShift,
      };
    }
  } catch (error) {
    // console.log(error); // LOG ERROR

    result = {
      status: 500,
      message: `API Error`,
    };
  }

  // RETURN
  res.status(result.status).json(result);
});

module.exports = router;
