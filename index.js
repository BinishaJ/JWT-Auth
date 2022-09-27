//imports
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//routes
const authRoute = require("./routes/auth");
const protectedRoute = require("./routes/protected");

const app = express();

//middleware
app.use(express.json());
//routing middleware
app.use("/api/user", authRoute);
app.use("/api/protected", protectedRoute);

//DB Connection
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true }, () =>
  console.log("Connected to DB")
);

//port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
