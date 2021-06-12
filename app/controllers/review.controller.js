const helper = require("../helpers/review.helper");

/**
 * The purpose of this function is to Accepts reviews and stores them
 * @param {Object} req
 * @param {Object} res
 */
exports.create = async (req, res) => {
  try {
    let invalidRequests = [];
    let validRequests = [];
    const payload = req.body;
    if (!payload || !payload.length) {
      res.status(400).send({ success: false, message: "Empty Payload!" });
      return;
    }
    payload.forEach(el => {
      let validation = helper.isInvidPayload(el)
      if (!validation.isValid) {
        el.error = validation.error;
        invalidRequests.push(el);
      } else {
        validRequests.push(el);
      }
    })

    if (!validRequests.length) {
      res.status(400).send({
        success: false,
        message: "No valid request in payload!",
        invalidRequests
      });
      return;
    }

    let data = await helper.insertMany(validRequests);
    let resdata = { data, success: true }
    if (invalidRequests.length) {
      resdata.info = 'Few record did not saved, check invalidRequests'
      resdata.invalidRequests = invalidRequests;
    }
    res.status(201).send(resdata);
  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
};


/**
 * The purpose of this function is to allow to fetches reviews
 * Reviews can be filtered by date, store type or rating.
 * All filters are optional; fetch all reviews if no filters are applied.
 * It accepts optional query params : date ('yyyy-mm-dd'), rating (number), productName (string)
 * @param {Object} req
 * @param {Object} res
 */

exports.fetchReviews = async (req, res) => {
  try {
    const date = req.query.date;
    const rating = req.query.rating;
    const productName = req.query.productName;
    let query = {}

    if (date) {
      const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0)).toISOString()
      const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999)).toISOString()
      query.reviewed_date = {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }

    if (rating) {
      query.rating = rating;
    }

    if (productName) {
      query.product_name = productName;
    }

    let data = await helper.findReviews(query);
    res.status(200).send({ success: true, data });
  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
}

/**
 * The purpose of this function is to allow to get average monthly ratings per store
 * It accepts query params : productName (string)
 * If no query param given then it fatches for all products
 * @param {Object} req
 * @param {Object} res
 */
exports.getAverageMonthlyRating = async (req, res) => {
  try {
    let result = {};
    let kayMap = {};
    const productName = req.query.productName;
    const query = productName ? { product_name: productName } : {};

    let data = await helper.findReviews(query);
    data.forEach(el => {
      const { product_name, rating, reviewed_date } = el;
      const year = new Date(reviewed_date).getFullYear();
      const month = new Date(reviewed_date).getMonth() + 1;
      const key = `${product_name}..${year}..${month}`
      kayMap[key] = kayMap[key] ? kayMap[key] : {}
      kayMap[key]['totalRating'] = kayMap[key]['totalRating'] ? kayMap[key]['totalRating'] + rating : rating;
      kayMap[key]['count'] = kayMap[key]['count'] ? kayMap[key]['count'] + 1 : 1;
    });

    Object.keys(kayMap).forEach(key => {
      const keysArr = key.split('..');
      const product_name = keysArr[0];
      const year = keysArr[1];
      const month = keysArr[2];
      result[product_name] = result[product_name] ? result[product_name] : {};
      result[product_name][year] = result[product_name][year] ? result[product_name][year] : {};
      let yearlyData = result[product_name][year];
      yearlyData[month] = (kayMap[key]['totalRating'] / kayMap[key]['count']).toFixed(2);
    });

    res.status(200).send({ success: true, data: result });

  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
}

/**
 * The purpose of this function is to get total ratings for each category. Meaning, how many 5*, 4*, 3* and so on
 * It accepts query params : productName (string)
 * If no query param given then it fatches for all products
 * @param {Object} req
 * @param {Object} res
 */
exports.getTotalRatingForCategory = async (req, res) => {
  try {
    let result = {};
    const productName = req.query.productName;
    const query = productName ? { product_name: productName } : {};

    let data = await helper.findReviews(query);
    data.forEach(el => {
      let { product_name, rating } = el
      result[product_name] = result[product_name] ? result[product_name] : {};
      let key = 'Rating ' + rating;
      result[product_name][key] = result[product_name][key] ? result[product_name][key] + 1 : 1
    });

    res.status(200).send({ success: true, data: result });

  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
}



