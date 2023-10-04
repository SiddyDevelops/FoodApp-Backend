const mongoose = require('mongoose');
const DB_LINK = require('../secrets').DB_LINK;

mongoose.connect(DB_LINK)
.then(function(db){
    console.log('plan database connected');
})
.catch(function(err){
    console.log(err);
});

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: [20, 'Plan name should not exceed more than 20 characters.']
    },
    duration: {
        type: Number,
        required: true,  
    },
    price: {
        type: Number,
        required: [true, 'Price not entered.']
    },
    ratingAverage: {
        type: Number
    },
    discount: {
        type: Number,
        validate: [function() {
            return this.discount < 100;
        }, 'Discount should not exceed price.']
    }
});

const planModel = mongoose.model('planModel', planSchema);

(async function createPlan() {
    let planObj = {
        name: 'SuperFood-5',
        duration: 30,
        price: 1000,
        ratingAverage: 5,
        discount: 20
    };
    // const data = await planModel.create(planObj);
    // console.log(data);
    // const doc = new planModel(planObj);
    // await doc.save(doc);
})();

module.exports = planModel;