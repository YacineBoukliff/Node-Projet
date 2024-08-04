const express = require("express");
const Article = require("../models/Article");

const router = express.Router();

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

router.get("/articles", isAuthenticated, async (req, res) => {
  try {
    const articles = await Article.find();
    res.render("articles", { articles });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching articles");
  }
});

router.get("/articles/:id", isAuthenticated, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("Article not found");
    }
    res.render("article", { article });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching article");
  }
});

router.get("/create-article", isAuthenticated, (req, res) => {
  res.render("createArticle");
});

router.post("/create-article", isAuthenticated, async (req, res) => {
  try {
    const article = new Article({
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      quantity: req.body.quantity,
    });
    await article.save();
    res.redirect("/articles");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating article");
  }
});

module.exports = router;
