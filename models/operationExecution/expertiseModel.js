const { default: mongoose } = require("mongoose");
const AutoIncrement = require("mongoose-auto-increment");

const expertiseSchema = new mongoose.Schema({
    exp_id:{
        type:String,

    },
    exp_name:{
        type:String,
        required:[true,"please provide expertise name"]
    },
    user_id:{
        // type:mongoose.SchemaTypes.ObjectId,
        // ref:'userModels',
        type:String,
        required:[true,"please provide userId name"]
    },
    area_of_expertise:{
        category:{type:Array},
        follower_count:{type:Array},
        platform:{type:Array},
        pageLevel:{type:Array},
        pageHealth:{type:Array},
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
    },
    created_by:{
        // type:mongoose.SchemaTypes.ObjectId,
        // ref:'userModels',
        type:String,
        
    },
    updated_by:{
         // type:mongoose.SchemaTypes.ObjectId,
        // ref:'userModels',
        type:String,
    }
});

expertiseSchema.pre(/^find/, function(next){
    this.updated_at =Date.now();
    next();
})

AutoIncrement.initialize(mongoose.connection);
expertiseSchema.plugin(AutoIncrement.plugin, {
  model: "ExpertiseModel",
  field: "exp_id",
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model(
  "ExpertiseModel",
  expertiseSchema
);
