module.exports = app => {
  const reviewController = require("../controllers/review.controller.js");

  var router = require("express").Router();

  // Get average monthly ratings per store
  router.get("/monthlyRating", reviewController.getAverageMonthlyRating);

  //  Get total ratings for each category
  router.get("/totalRating", reviewController.getTotalRatingForCategory);
  
  // Create a reviews
  router.post("/", reviewController.create);

  // Retrieve all reviews or filtered reviews
  router.get("/", reviewController.fetchReviews);

  app.use("/api/reviews", router);
};
