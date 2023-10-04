const reviewModel = require('../models/reviewModel');
const planModel = require('../models/planModel');

module.exports.getAllReviews = async function getAllReviews(req,res) {
    try {
        const reviews = await reviewModel.find();
        if(reviews) {
            res.json({
                message: 'Reviews retrived',
                data: reviews
            });
        } else {
            res.json({
                message: 'No reviews found!'
            });
        }
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.getFeaturedReviews = async function getFeaturedReviews(req,res) {
    try {
        const reviews = await reviewModel.find().sort({
            rating: -1
        }).limit(3);
        if(reviews) {
            res.json({
                message: 'Featured reviews retrived',
                data: reviews
            });
        } else {
            res.json({
                message: 'No reviews found!'
            });
        }
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.getPlanReviews = async function getPlanReviews(req,res) {
    try {
        let planId = req.params.id;
        let reviews = await reviewModel.find();

        reviews = reviews.filter(review => review.plan._id == planId)
        if(reviews) {
            res.json({
                message: 'Review retrived',
                data: reviews
            });
        } else {
            res.json({
                message: 'No reviews found!'
            });
        }
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.createReview = async function createReview(req,res) {
    try {
        let id = req.params.plan;
        let plan = await planModel.findById(id);
        let review = await reviewModel.create(req.body);
        plan.ratingAverage = (plan.ratingAverage + req.body.rating)/1.5;    // Pseudo Logic
        await plan.save;
        if(review) {
            res.json({
                message: 'Review created',
                data: review
            });
        } else {
            res.json({
                message: 'Review cannot be created'
            });
        }
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.updateReview = async function updateReview(req,res) {
    try {
        let planId = req.params.id;
        let id = req.body.id;
        let dataToBeUpdated = req.body;
        let keys = [];
        for(let key in dataToBeUpdated) {
            if(key == 'id') {
                continue;
            }
            keys.push(key);
        }
        let review = await reviewModel.findById(id);
        for(let i=0;i<keys.length;i++) {
            review[keys[i]] = dataToBeUpdated[keys[i]];
        }
        await review.save();

        if(review) {
            res.json({
                message: 'Review Updated',
                data: review
            });
        } else {
            res.json({
                message: 'No reviews found!'
            });
        }
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.deleteReview = async function deleteReview(req,res) {
    try {
        let planId = req.params.id;
        let id = req.body.id;
        let deletedReview = await reviewModel.findByIdAndDelete(id);
        return res.json({
            message: 'Review successfully deleted',
            data: deletedReview
        });
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}
