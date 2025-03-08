const { Router } = require("express");
const courseRouter = Router();
const { courseModel } = require("../db");
const { userMiddleware } = require("../Middleware/user");
const { purchaseModel } = require("../db");

courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  const { courseId } = req.body;
  try {
    await purchaseModel.create({
      courseId,
      userId: req.userId,
    });

    return res.json({
      message: "Course purchased.",
    });
  } catch {
    return res.status(500).json({
      message: "Error purchasing course.",
    });
  }
});

courseRouter.get("/preview", async function (req, res) {
  const courses = await courseModel.find({});
  res.json({
    courses
  });
});

module.exports = {
  courseRouter,
};
