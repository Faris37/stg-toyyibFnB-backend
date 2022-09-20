const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Shift.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let result = null;
  let param = null;

  param = req.body;

  let shift_startDatetime = param.shift_startDatetime;
  let shift_endDatetime = param.shift_endDatetime;

  console.log('shift_startDatetime: ' + shift_startDatetime);
  console.log('shift_endDatetime: ' + shift_endDatetime);
  try {
    const getNetSales = await model.getNetSales(
      shift_startDatetime,
      shift_endDatetime
    );

    const refund = await model.getRefund(
      shift_startDatetime,
      shift_endDatetime
    );

    if (getNetSales || refund) {
      result = {
        status: 200,
        message: "Success",
        data: getNetSales,
        dataRefund : refund
      };
    } else if (getNetSales == false) {
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
  res.status(200).json(result);
});

module.exports = router;
