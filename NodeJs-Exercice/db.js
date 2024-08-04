const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/express_mongo_project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

module.exports = mongoose.connection;
