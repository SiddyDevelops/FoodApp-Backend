const express = require('express');
const reviewRouter = express.Router();
const {protectRoute} = require('../controller/authController');
const { getAllReviews,getFeaturedReviews,getPlanReviews,createReview,updateReview,deleteReview } = require('../controller/reviewController');

reviewRouter
.route('/all')
.get(getAllReviews);

reviewRouter
.route('/featured')
.get(getFeaturedReviews);

reviewRouter
.route('/:id')
.get(getPlanReviews);

reviewRouter
.route('/crud/:plan')
.post(protectRoute,createReview)
.patch(updateReview)
.delete(deleteReview);

module.exports = reviewRouter;



