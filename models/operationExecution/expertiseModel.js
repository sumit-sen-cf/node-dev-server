const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const expertiseSchema = new mongoose.Schema({
    exp_id: {
        type: Number,
        required: false
    },
    exp_name: {
        type: String,
        required: [true, "please provide expertise name"]
    },
    user_id: {
        // type:mongoose.SchemaTypes.ObjectId,
        // ref:'userModels',
        type: String,
        required: [true, "please provide userId name"]
    },
    area_of_expertise: {
        category: { type: Array },
        follower_count: { type: Array },
        platform: { type: Array },
        pageLevel: { type: Array },
        pageHealth: { type: Array },
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
    },
    created_by: {
        // type:mongoose.SchemaTypes.ObjectId,
        // ref:'userModels',
        type: String,

    },
    updated_by: {
        // type:mongoose.SchemaTypes.ObjectId,
        // ref:'userModels',
        type: String,
    }
});

expertiseSchema.pre(/^find/, function (next) {
    this.updated_at = Date.now();
    next();
})

expertiseSchema.pre('save', async function (next) {
    if (!this.exp_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'exp_id': -1 } });

        if (lastAgency && lastAgency.exp_id) {
            this.exp_id = lastAgency.exp_id + 1;
        } else {
            this.exp_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model(
    "ExpertiseModel",
    expertiseSchema
);
