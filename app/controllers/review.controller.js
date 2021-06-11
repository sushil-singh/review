const db = require("../models");
const ReviewModel = db.reviews;

// Accepts reviews and stores them
exports.create = (req, res) => {
  const payload = req.body;
  if(!payload || !payload.length){
    res.status(400).send({ message: "Empty Payload!" });
    return;
  }
  let invalidRequests = [];
  let validRequests = [];
  payload.filter(el => {
    if (!el.review || !el.author || !el.review_source || !el.rating || !el.product_name) {
      invalidRequests.push(el);
    }else{
      if(!el.reviewed_date){
        el.reviewed_date = new Date().toJSON();
      }
      validRequests.push(el);
    }
  })
 
  if(!validRequests.length){
    res.status(400).send({ message: "No valid request in payload!" });
    return;
  }

  // Save ReviewModel in the database
  reviewModel.insertMany(validRequests).then(data => {
      if(invalidRequests.length){
        data.invalidRequests = invalidRequests;
      }
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the review."
      });
    });
};


/*
  Allows to fetches reviews
    Reviews can be filtered by date, store type or rating.
    All filters are optional; fetch all reviews if no filters are applied.
*/
exports.fetchReviews = (req, res) => {
  let date = req.query.date;
  let rating = req.query.rating;
  let productName = req.query.productName;
  let query = {}
  if(date){
    query.reviewed_date = date;
  }
  if(rating){
    query.rating = rating;
  }
  if(productName){
    query.product_name = productName;
  }

  ReviewModel.find(query)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving reviews."
      });
    });
}

// Allows to get average monthly ratings per store.
exports.getAverageMonthlyRating = (req, res) => {
  // to be implemented
  const store = req.param.store;
  const month = req.param.month;

  return res.send('to be implemented')
}
// Allows to get total ratings for each category. Meaning, how many 5*, 4*, 3* and so on
exports.getTotalRatingForCategory = (req, res) => {
  // to be implemented
  const store = req.param.store;
  return res.send('to be implemented')
}



