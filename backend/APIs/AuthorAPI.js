import exp from "express";
import { authenticate, register } from "../services/AuthService.js";
import UserTypeModel from "../models/UserModel.js";

import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import ArticleModel from "../models/ArticleModel.js";


export const authorRoute = exp.Router();

// Register author (public)
authorRoute.post("/users", async (req, res) => {
  try {
    const userObj = req.body;
    const newUserObj = await register({ ...userObj, role: "AUTHOR" });
    res.status(201).json({ message: "author created", payload: newUserObj });
  } catch (err) {
    res.status(500).json({ message: "error creating author", error: err.message });
  }
});

// Authenticate author (public)
// authorRoute.post("/authenticate", async (req, res) => {
//   try {
//     const userCred = req.body;
//     const { token, user } = await authenticate(userCred);

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false,
//     });

//     res.status(200).json({ message: "login success", payload: user });
//   } catch (err) {
//     res.status(401).json({ message: "invalid credentials", error: err.message });
//   }
// });

// Create article (protected)
authorRoute.post(
  "/articles",
  verifyToken,
  checkAuthor,
  async (req, res) => {
    try {
      const article = req.body;
      const newArticleDoc = new ArticleModel(article);
      const createdArticleDoc = await newArticleDoc.save();

      res
        .status(201)
        .json({ message: "article created", payload: createdArticleDoc });
    } catch (err) {
      res.status(500).json({ message: "error creating article", error: err.message });
    }
  }
);

// Read articles of author (protected)
authorRoute.get(
  "/articles/:authorId",
  verifyToken,
  checkAuthor,
  async (req, res) => {
    try {
      const aid = req.params.authorId;

      const articles = await ArticleModel.find({
        author: aid,
        isArticleActive: true,
      }).populate("author", "firstName email");

      res.status(200).json({ message: "articles", payload: articles });
    } catch (err) {
      res.status(500).json({ message: "error fetching articles", error: err.message });
    }
  }
);

// Edit article (protected)
authorRoute.put(
  "/articles",
  verifyToken,
  checkAuthor,
  async (req, res) => {
    try {
      const { articleId, title, category, content, author } = req.body;

      const articleOfDB = await ArticleModel.findOne({
        _id: articleId,
        author: author,
      });

      if (!articleOfDB) {
        return res.status(404).json({ message: "Article not found" });
      }

      const updatedArticle = await ArticleModel.findByIdAndUpdate(
        articleId,
        { $set: { title, category, content } },
        { new: true }
      );

      res
        .status(200)
        .json({ message: "article updated", payload: updatedArticle });
    } catch (err) {
      res.status(500).json({ message: "error updating article", error: err.message });
    }
  }
);


