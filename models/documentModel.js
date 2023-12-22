const { default: mongoose } = require("mongoose");
const userDocManagementModel = require("./userDocManagementModel");

const documentSchema = new mongoose.Schema({
  doc_type: {
    type: String,
    unique: true,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  priority: {
    type: String,
    default: "",
  },
  period: {
    type: Number,
    default: 0,
  },
  isRequired:{
    type: Boolean,
    required: false,
    default: false
  },
  doc_number:{
    type: String,
    default: "",
    required: false
  }
});
// Post-save hook on the Document model
documentSchema.post('save', async function(doc) {
  try {
      // Fetch unique user IDs using MongoDB's aggregation framework
      const uniqueUsers = await userDocManagementModel.aggregate([
          { $group: { _id: "$user_id" } }
      ]);
      const userIds = uniqueUsers.map(user => user._id);
      const userDocEntries = userIds.map(userId => ({
          doc_id: doc._id,
          user_id: userId,
      }));
      await userDocManagementModel.insertMany(userDocEntries);
  } catch (error) {
      console.error('Error in post-save hook:', error);
  }
});

module.exports = mongoose.model("documentModel", documentSchema);
