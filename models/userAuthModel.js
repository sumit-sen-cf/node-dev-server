const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const userAuthModel = new mongoose.Schema({
    auth_id:{
        type: Number,
        required: true
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

AutoIncrement.initialize(mongoose.connection);
userAuthModel.plugin(
    AutoIncrement.plugin, 
    { model: 'userAuthModels', field: 'auth_id', startAt: 1, incrementBy: 1 }
);

module.exports = mongoose.model('userAuthModel', userAuthModel);