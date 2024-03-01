const mongoose = require('mongoose');
const tempAssignmentSchema = new mongoose.Schema({
    plan: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "TempPlanSchema",
        required: [true, "Plan id is Required"]
    },
    campaignId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "registerCampaignModel"
    },
    page: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'TempPlanPagesModel',
        required: [true, "Page id is Required"]
    },
    ass_to: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ExpertiseModel',

    },

}, {
    strictPopulate: false // Add this option to enable strict population
})

tempAssignmentSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'page'
    })
    this.populate({
        path: 'ass_to'
    })
    next()
})


module.exports = mongoose.model('TempAssignmentModel', tempAssignmentSchema)