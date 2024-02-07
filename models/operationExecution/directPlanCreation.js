const { default: mongoose } = require("mongoose");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const directPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, "plan name is required."],
        unique:[true, "plan name already exists"]
    },
    plan_id: {
        type: Number,
    },
    
    pages:{
        type:Array,
        required: [true, "pages are required"]
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date
    },
    modifiedBy: {
        type: String,
        default: "user"
    },
   
   
  

});

directPlanSchema.pre('save', async function (next) {
    if (!this.plan_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'plan_id': -1 } });
  
      if (lastAgency && lastAgency.plan_id) {
        this.plan_id = lastAgency.plan_id + 1;
      } else {
        this.plan_id = 1;
      }
    }
    next();
});


module.exports = mongoose.model(
    "DirectPlanModel",
    directPlanSchema
);
