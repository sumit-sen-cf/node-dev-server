const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const userAuthModel = new mongoose.Schema({
    auth_id:{
        type: Number,
        required: false
    },
    Juser_id:{
        type: Number,
        required: false
    },
    obj_id:{
        type: Number,
        required: false
    },
    insert:{
        type: Number,
        required: false,
        default: 0
    },
    view:{
        type: Number,
        required: false,
        default: 0
    },
    update:{
        type: Number,
        required: false,
        default: 0
    },
    delete_flag:{
        type: Number,
        required: false,
        default: 0
    },
    creation_date:{
        type: Date,
        default: Date.now
    },
    created_by:{
        type: Number,
        required: false,
        default: 0
    },
    Last_updated_date:{
        type: Date,
        default: Date.now
    },
    Last_updated_by:{
        type: Number,
        required: false,
        default: 0
    }
});

userAuthModel.pre('save', async function (next) {
    if (!this.auth_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'auth_id': -1 } });
  
      if (lastAgency && lastAgency.auth_id) {
        this.auth_id = lastAgency.auth_id + 1;
      } else {
        this.auth_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('userAuthModel', userAuthModel);