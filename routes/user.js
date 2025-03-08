const { Router } = require("express");
const bcrypt = require("bcrypt");
const userRouter = Router();
const { userModel, purchaseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../Middleware/user");

userRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body; //TODO: Adding zod validation.

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.json({
      message: "signup successfull!",
    });
  } catch (e) {
    res.status(400).json({
      message: "signup failed",
    });
  }
});

userRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    let token;
    if (correctPassword) {
      token = jwt.sign({ userId: user._id }, process.env.JWT_USER_SECRET);
      return res.json({
        message: "Signin successful.",
        token,
      });
    } else {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Signin failed.",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
  const purchases = await purchaseModel.find({
    userId: req.userId,
  });

  res.json({
    purchases,
  });
});

module.exports = {
  userRouter: userRouter,
};
