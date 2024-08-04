const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/your_database_name", {
    // useNewUrlParser and useUnifiedTopology are no longer needed in newer versions of Mongoose
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if using https
  })
);

// Routes
app.use("/", userRoutes);
app.use("/", articleRoutes);

// Home route
app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/articles");
  } else {
    res.redirect("/login");
  }
});

// 404 Error handler
app.use((req, res, next) => {
  res.status(404).render("404", { message: "Page not found" });
});

// General Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`View the application at: http://localhost:${PORT}`);
});

module.exports = app;
