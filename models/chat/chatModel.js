const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: [true, "chatName is required field"],
        maxlength: 200,
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    users: [{
        type: Number,
        ref: "userModel",
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("chat", chatSchema);
