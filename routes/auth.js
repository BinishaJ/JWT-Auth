const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

//Register Route
router.post("/register", async (req, res) => {
  //check for error
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check for existing user
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).send({ message: "Email already exists" });

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login Route
router.post("/login", async (req, res) => {
  //check for error
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check for user
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ message: "User doesn't exist" });

  //check password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  //create token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});
module.exports = router;
