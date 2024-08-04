const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

// Get all articles
router.get("/articles", isAuthenticated, async (req, res) => {
  try {
    const articles = await Article.find();
    res.render("articles", { articles });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching articles");
  }
});

// Get create article form
router.get("/create-article", isAuthenticated, (req, res) => {
  res.render("createArticle");
});

// Create a new article
router.post("/create-article", isAuthenticated, async (req, res) => {
  try {
    const newArticle = new Article({
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      quantity: req.body.quantity,
    });
    await newArticle.save();
    res.redirect("/articles");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating article");
  }
});

// Get a single article
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

// Get edit article form
router.get("/articles/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send("Article not found");
    }
    res.render("editArticle", { article });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching article for edit");
  }
});

// Update an article
router.post("/articles/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        quantity: req.body.quantity,
      },
      { new: true }
    );
    if (!article) {
      return res.status(404).send("Article not found");
    }
    res.redirect(`/articles/${article._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating article");
  }
});

// Delete an article
router.post("/articles/:id/delete", isAuthenticated, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).send("Article not found");
    }
    res.redirect("/articles");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting article");
  }
});

module.exports = router;
