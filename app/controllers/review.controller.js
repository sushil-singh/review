const db = require("../models");
const helper = require("../helpers/review.helper");
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
    let isInvalid = helper.isInvidPayload(el)
    if (isInvalid) {
      el.error = isInvalid;
      invalidRequests.push(el);
    }else{
      if(!el.reviewed_date){
        el.reviewed_date = new Date().toJSON();
      }
      validRequests.push(el);
    }
  })
 
  if(!validRequests.length){
    res.status(400).send({ message: "No valid request in payload!", invalidRequests });
    return;
  }

  // Save ReviewModel in the database
  ReviewModel.insertMany(validRequests).then(data => {
     let resdata = {
       data,
       success: true
     }
      if(invalidRequests.length){
        resdata.info = 'Few record did saved, check invalidRequests'
        resdata.invalidRequests = invalidRequests;
      }
      res.send(resdata);
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
    const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999)).toISOString()
        
    query.reviewed_date = {
      $gte: startOfDay, 
      $lt: endOfDay
    }
  }
  if(rating){
    query.rating = rating;
  }
  if(productName){
    query.product_name = productName;
  }

  ReviewModel.find(query)
    .then(data => {
      res.send({success: true, data});
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
  const productName = req.query.productName;
  // if(!productName){
  //   res.status(400).send({ message: "productName can not be empty!" });
  //   return;
  // }

  let query = {}
  if(productName){
    query.product_name = productName;
  }
  let result = {};
  let kayMap = {}
  ReviewModel.find(query)
    .then(data => {
      data.forEach(el => {
        let  {product_name, rating, reviewed_date} = el;
        let year = new Date(reviewed_date).getFullYear();
        let month = new Date(reviewed_date).getMonth();
        let key =  `${product_name}..${year}..${month}`
        kayMap[key] = kayMap[key] ? kayMap[key] : {}
        kayMap[key]['totalRating'] = kayMap[key]['totalRating'] ? kayMap[key]['totalRating'] + rating : rating;
        kayMap[key]['count'] = kayMap[key]['count'] ? kayMap[key]['count'] + 1 : 1;
      });

      Object.keys(kayMap).forEach(key => {
        let keysArr = key.split('..');
        let product_name= keysArr[0];
        let year= keysArr[1];
        let month= keysArr[2];
        result[product_name] = result[product_name] ? result[product_name] : {};
        result[product_name][year] = result[product_name][year] ? result[product_name][year] : {};
        let yearlyData = result[product_name][year];
        yearlyData[month] = (kayMap[key]['totalRating'] / kayMap[key]['count']).toFixed(2);
      })
      res.send({success: true, data: result})
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving reviews."
      });
    });
}
// Allows to get total ratings for each category. Meaning, how many 5*, 4*, 3* and so on
exports.getTotalRatingForCategory = (req, res) => {

  let productName = req.query.productName;
  let query = {}
  if(productName){
    query.product_name = productName;
  }
  let result = {};
  ReviewModel.find(query)
    .then(data => {
      data.forEach(el => {
        let  {product_name, rating} = el
        result[product_name] = result[product_name] ? result[product_name] : {};
        let key = 'Rating ' + rating;
        result[product_name][key] = result[product_name][key] ? result[product_name][key] + 1 : 1
      });
      res.send({success: true, data: result})
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving reviews."
      });
    });
}



