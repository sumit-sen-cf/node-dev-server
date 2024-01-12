const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-auto-increment');

const contentMgntModel = new mongoose.Schema({
    contentM_id: { 
        type: Number,
        required: false,
        unique: true,
    },
    page_name: {
        type: String,
        required: true
    },
    content_name: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: false,
    },
    sub_category: {
        type: Number,
        required: false,
    },
    content: {
        type: String,
        default: "",
    },
    reason: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    uploaded_by: {
        type: Date,
        default: Date.now
    }
});

contentMgntModel.pre('save', async function (next) {
    if (!this.contentM_id) {
      const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'contentM_id': -1 } });
  
      if (lastAgency && lastAgency.contentM_id) {
        this.contentM_id = lastAgency.contentM_id + 1;
      } else {
        this.contentM_id = 1;
      }
    }
    next();
});

module.exports = mongoose.model('contentMgntModel', contentMgntModel);