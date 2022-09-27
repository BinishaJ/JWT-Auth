const router = require("express").Router();
const verify = require("./verifyToken");

//Protected Route
router.get("/", verify, (req, res) => {
  res.send("Welcome to Protected Route");
});

module.exports = router;
