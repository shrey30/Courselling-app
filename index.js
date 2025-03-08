require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { adminRouter } = require("./routes/admin");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");

async function connect_database() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to database.");
  app.listen(3000, () => {
    console.log("Running on port 3000.");
  });
}
const app = express();
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);

connect_database();
