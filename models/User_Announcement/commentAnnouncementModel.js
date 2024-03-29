// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const commentsType = new mongoose.Schema({
//     comment: {
//         type: String,
//         required: true,
//     },
//     user_id: {
//         type: Number,
//         required: true
//     }
// }, {
//     timestamps: true
// });

// const commentAnnouncementSchema = new mongoose.Schema({
//     announcement_id: {
//         type: Schema.Types.ObjectId,
//         required: true,
//     },
//     // user_id: {
//     //     type: Number,
//     //     required: true,
//     // },
//     commentsHistory: {
//         type: [commentsType]
//     }
// }, {
//     timestamps: true
// }
// );

// module.exports = mongoose.model("announcementComment", commentAnnouncementSchema);