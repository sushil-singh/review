module.exports = app => {
  const reviewController = require("../controllers/review.controller.js");

  var router = require("express").Router();

  // Create a reviews
  router.post("/", reviewController.create);

  // Retrieve all reviews or filtered reviews
  router.get("/", reviewController.fetchReviews);

  // Get average monthly ratings per store
  router.get("/monthlyRating/:store/:month", reviewController.getAverageMonthlyRating);

  //  Get total ratings for each category
  router.get("/:store", reviewController.getTotalRatingForCategory);

  app.use("/api/reviews", router);
};
