const planModel = require('../models/planModel');

module.exports.getAllPlans = async function getAllPlans(req,res) {
    try{
        let plans = await planModel.find();
        if(plans) {
            return res.json({
                message: 'All plans retrived',
                data: plans
            });
        } else {
            return res.json({
                message: 'No plans found!'
            });
        }
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.getPlan = async function getPlan(req,res) {
    try{
        let id = req.params.id;
        let plan = await planModel.findById(id);
        if(plan) {
            return res.json({
                message: 'Plan retrived',
                data: plan
            });
        } else {
            return res.json({
                message: 'No plan found!'
            });
        }
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.createPlan = async function createPlan(req,res) {
    try{
        let planData = req.body;
        let createdPlan = await planModel.create(planData);
        return res.json({
            message: 'New plan successfully created',
            data: createdPlan
        });
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.deletePlan = async function deletePlan(req,res) {
    try{
        let id = req.params.id;
        let deletedPlan = await planModel.findByIdAndDelete(id);
        return res.json({
            message: 'Plan successfully deleted',
            data: deletedPlan
        });
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.updatePlan = async function updatePlan(req,res) {
    try{
        let id = req.params.id;
        let dataToBeUpdated = req.body;
        let keys = [];
        for(let key in dataToBeUpdated) {
            keys.push(key);
        }
        let plan = await planModel.findById(id);
        for(let i=0;i<keys.length;i++) {
            plan[keys[i]] = dataToBeUpdated[keys[i]];
        }
        await plan.save();
        return res.json({
            message: 'Plan successfully updated',
            data: plan
        });
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

// Get Featured Plans
module.exports.featuredPlans = async function featuredPlans(req,res) {  // Get top 3 plans based on ratings
    try {
        const featured3Plans = await planModel.find().sort({
            ratingAverage: -1
        }).limit(3);
        return res.json({
            message: 'Top 3 rated plans',
            data: featured3Plans
        });
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}