const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Membership.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let param = null;
  let result = null;

  let membership_no = null;

  try {
    // BIND PARAMETER TO VARIABLES
    param = req.body;

    membership_no = param.membership_no;

    console.log("membership_no", membership_no);

    let getMembership = await model.getMembershipPOS(membership_no);

    if (getMembership != false) {
      result = {
        status: 200,
        message: 'Success',
        data : getMembership
      };
    } else {
      result = {
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
  res.status(200).json(result);
});

module.exports = router;
