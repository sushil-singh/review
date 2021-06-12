const db = require("../models");
const ReviewModel = db.reviews;

exports.isInvidPayload = (input) => {
    let missingFields = [];
    if (!input.review) {
        missingFields.push('review');
    } 
    if (!input.author) {
        missingFields.push('author');
    } 
    if (!input.review_source) {
        missingFields.push('review_source');
    } 
    if (!input.rating) {
        missingFields.push('rating');
    } 
    if (!input.product_name) {
        missingFields.push('product_name');
    } 
    if (isNaN(input.rating) || input.rating < 1 || input.rating > 5) {
        missingFields.push('rating');
    } 
    if (!input.reviewed_date || new Date(input.reviewed_date) == 'Invalid Date') {
        missingFields.push('reviewed_date');
    }

    if(missingFields.length) {
        return {
            isValid: false,
            error: `Missing/invalid fields : ${missingFields.join(',')}`
        }
    }
    return {
        isValid: true
    }
}

exports.insertMany = (validRequests) => {
    return new Promise((resolve, reject) => {
        ReviewModel.insertMany(validRequests).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err.message || "Some error occurred while creating the review.");
        });
    });
}

exports.findReviews = (queryObj) => {
    return new Promise((resolve, reject) => {
        ReviewModel.find(queryObj).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err.message || "Some error occurred while retrieving reviews.")
        });
    });
}
