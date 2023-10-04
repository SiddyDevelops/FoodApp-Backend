const express = require('express');
const planRouter = express.Router();
const {isAuthorised,protectRoute} = require('../controller/authController');
const { getAllPlans, getPlan, createPlan, updatePlan, deletePlan, featuredPlans } = require('../controller/planController');

// All plan 
planRouter
.route('/allPlans')
.get(getAllPlans);

// Own Plan -> Login is neccessary 
//planRouter.use(protectRoute);
planRouter
.route('/plan/:id')
.get(protectRoute,getPlan);

// Admin and Owner can only perform CRUD on plans
//planRouter.use('/crudPlan',isAuthorised['ADMIN']);
planRouter
.route('/crudPlan')
.post(isAuthorised(['ADMIN','RESTRAUNTOWNER']),createPlan);

planRouter
.route('/crudPlan/:id')
.patch(isAuthorised(['ADMIN','RESTRAUNTOWNER']), updatePlan)
.delete(isAuthorised(['ADMIN','RESTRAUNTOWNER']), deletePlan);

// Featured Plans
planRouter
.route('/featuredPlans')
.get(featuredPlans);

module.exports = planRouter;