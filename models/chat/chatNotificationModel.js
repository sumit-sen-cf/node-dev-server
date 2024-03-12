const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
    },
});

module.exports = mongoose.model("chatNotification", notificationSchema);
