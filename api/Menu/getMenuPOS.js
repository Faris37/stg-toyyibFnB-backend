const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Menu.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.get("/", async (req, res) => {
  let result = null;

  try {
    // GET USER FUNCTION
    const getMenu = await model.getMenuPOS();

    // if (!getMenu) return;

    if (getMenu) {
      result = {
        status: 200,
        message: "Successfull List of Menu",
        environment: process.env.ENVIRONMENT,
        data: getMenu,
      };
    } else {
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
