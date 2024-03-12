const response = require("../common/response.js");
const Chat = require("../models/chat/chatModel.js");
const Message = require("../models/chat/messageModel.js");
var ObjectId = require('mongodb').ObjectId;


// @desc		Send message
// @route		POST /messages
// @access		Private
exports.sendMessage = async (req, res) => {
    console.log("============ /message sending   post APi calls ============");
    console.log("============ req.body ============");
    console.log(req.body);

    try {
        //get data from body
        const { content, chatId, currentUserId } = req.body;
        // check for error
        if (!content || !chatId) {
            return response.returnFalse(500, req, res, "Server could not process Invalid request", {});
        }
        // message object
        var newMessage = {
            sender: currentUserId,
            content: content,
            chatId: chatId,
        };
        //message create in DB collection
        var message = await Message.create(newMessage);
        console.log("🚀 ~ exports.sendMessage= ~ message 111:", message)

        //message data find from aggregation
        var aggreData = await Message.aggregate([{
            $match: {
                _id: message._id,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
            },
        }, {
            $unwind: {
                path: "$sender",
                // preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "chats",
                localField: "chatId",
                foreignField: "_id",
                as: "chatIdData",
            },
        }, {
            $unwind: {
                path: "$chatIdData",
                // preserveNullAndEmptyArrays: true,
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "chatIdData.users",
                foreignField: "user_id",
                as: "users",
            },
        }, {
            $project: {
                _id: 1,
                sender: {
                    _id: 1,
                    user_id: 1,
                    user_login_id: 1,
                    user_name: 1,
                    user_email_id: 1,
                    image: 1,
                },
                content: 1,
                chatIdData: {
                    _id: 1,
                    chatName: 1,
                    isGroupChat: 1,
                    users: {
                        $map: {
                            input: "$users",
                            as: "user",
                            in: {
                                _id: "$$user._id",
                                user_id: "$$user.user_id",
                                user_login_id: "$$user.user_login_id",
                                user_name: "$$user.user_name",
                                user_email_id: "$$user.user_email_id",
                                image: "$$user.image"
                            }
                        }
                    },
                    createdAt: 1,
                    updatedAt: 1,
                    latestMessage: 1
                },
                createdAt: 1,
                updatedAt: 1
            }
        }]);

        console.log("🚀 ~ send msg ~ aggreData:", aggreData);

        //chat data update in collection DB
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: aggreData[0],
        }, {
            new: true
        });

        //return success data response
        return response.returnTrue(200, req, res, "message send Successfully", aggreData[0])
    } catch (err) {
        //return error data response
        return response.returnFalse(500, req, res, err.message, {});
    }
};

// @desc		Fetch all the messages
// @route		GET /message:chatId
// @access		Private
exports.fetchMessage = async (req, res) => {
    console.log("============ /message/:chatId   get APi calls ============");
    console.log("============ req.params ============");
    console.log(req.params);
    try {
        const { chatId } = req.params;

        //get all messages from chat Id
        const allMessages = await Message.find({ chatId: ObjectId(chatId) })
            .populate("sender", "user_name image user_id user_email_id")
            .populate("chatId");

        //return success data response
        return response.returnTrue(200, req, res, "message chat Data Fetched Successfully", allMessages)
    } catch (err) {
        //return error response
        return response.returnFalse(500, req, res, err.message, {});
    }
};