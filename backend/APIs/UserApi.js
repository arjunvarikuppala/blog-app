import exp from "express";
import { register, authenticate } from "../services/AuthService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import ArticleModel from "../models/ArticleModel.js";

export const userRoute = exp.Router();

//Register user
userRoute.post("/users", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({ ...userObj, role: "USER" });
  //send res
  res.status(201).json({ message: "user created", payload: newUserObj });
});

//Authenticate user
userRoute.post("/authenticate", async (req, res) => {
  //get user cred object
  let userCred = req.body;
  //call authenticate service
  let { token, user } = await authenticate(userCred);
  //save tokan as httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  //send res
  res.status(200).json({ message: "login success", payload: user });
});

//Read all articles(protected route)
userRoute.get("/articles", verifyToken, async (req, res) => {
  try {
    const articles = await ArticleModel.find({
      isArticleActive: true,
    })
      .sort({ createdAt: -1 })
      .populate("author", "firstName lastName email profileImageUrl");

    res.status(200).json({ message: "articles", payload: articles });
  } catch (err) {
    res.status(500).json({ message: "error fetching articles", error: err.message });
  }
});

//Add comment to an article(protected route)
