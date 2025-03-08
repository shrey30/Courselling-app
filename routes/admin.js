const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../Middleware/admin");
const { courseModel } = require("../db");
const adminRouter = Router();
const { adminModel } = require("../db");

adminRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body; //TODO: Adding zod validation.

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await adminModel.create({
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

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({
      email,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found.",
      });
    }

    const correctPassword = await bcrypt.compare(password, admin.password);
    let token;
    if (correctPassword) {
      token = jwt.sign({ adminId: admin._id }, process.env.JWT_ADMIN_SECRET);
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

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  const { title, description, price, imageUrl } = req.body;
  const course = await courseModel.create({
    title,
    description,
    price,
    imageUrl,
    creatorId: req.adminId,
  });

  res.json({
    message: "Course created",
    courseId: course._id,
  });
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const { title, description, price, imageUrl, courseId } = req.body;
  try {
    const course = await courseModel.updateOne(
      {
        _id: courseId,
      },
      {
        title,
        description,
        price,
        imageUrl,
      }
    );
    if (course) {
      return res.json({
        message: "Course updated",
        courseId: course._id,
      });
    }
  } catch (e) {
    return res.status(401).json({
      message: "Course could not be updated.",
    });
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  try {
    const courses = await courseModel.find({
      creatorId: req.adminId,
    });

    if (courses.length === 0) {
      return res.json({
        message: "No courses found.",
      });
    } else if (courses.length > 0) {
      const filteredCourses = courses.map((course) => ({
        name: course.title,
        discription: course.description,
        price: course.price,
        imageUrl: course.imageUrl,
      }));
      return res.json({
        filteredCourses,
      });
    }
  } catch {
    res.json({
      message: "Could not find courses.",
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
