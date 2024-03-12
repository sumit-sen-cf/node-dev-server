const response = require("../common/response.js");
const userModel = require("../models/userModel.js");
const Chat = require("../models/chat/chatModel.js");

// @desc		Access or initiate all chating users
// @route		GET /get_chating_users/:id
// @access		private
exports.getChatingUsers = async (req, res) => {
    try {
        //requested user id find
        const { id: requestedUser } = req.params;

        // find all users details with filter
        const userModelData = await userModel.find({
            user_id: {
                $ne: requestedUser
            }
        }, {
            user_id: 1,
            user_name: 1,
            created_At: 1
        });

        //send success response
        return response.returnTrue(200, req, res, "chatting users Fetched Successfully", userModelData)
    } catch (error) {
        //send error response
        return response.returnFalse(500, req, res, error.message, {});
    }
};

// @desc		Access or initiate a chat between two persons
// @route		POST /api/chats
// @access		private
exports.accessChat = async (req, res) => {
    //body data get
    const { userFromChatId, userToChatId } = req.body;

    //check to user id is not available. 
    if (!userToChatId) {
        console.log("UserToChatId not sent with request");
        return res.sendStatus(400);
    }

    //chat id data get from db and required collections.
    var isChat = await Chat.aggregate([{
        $match: {
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userFromChatId } } },
                { users: { $elemMatch: { $eq: userToChatId } } },
            ]
        }
    }, {
        $lookup: {
            from: "messages",
            localField: "latestMessage",
            foreignField: "_id",
            as: "latestMessage",
        },
    }, {
        $lookup: {
            from: "usermodels",
            localField: "users",
            foreignField: "user_id",
            as: "users",
        },
    }, {
        $project: {
            _id: 1,
            chatName: 1,
            isGroupChat: 1,
            createdAt: 1,
            updatedAt: 1,
            users: {
                _id: 1,
                user_id: 1,
                user_login_id: 1,
                user_name: 1,
                user_email_id: 1,
                image: 1,
            },
            latestMessage: {
                $arrayElemAt: ["$latestMessage", 0]
            }
        }
    }]);

    //populate to find userModel data details 
    isChat = await userModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "user_name image user_email_id",
    });

    //check if the isChat length is available
    if (isChat.length > 0) {
        //send success response
        return response.returnTrue(200, req, res, "chat Data Fetched Successfully", isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [userFromChatId, userToChatId],
        };

        try {
            //chat data created.
            const createChat = await Chat.create(chatData);

            //chat data details get from aggregate.
            const fullChat = await Chat.aggregate([{
                $match: {
                    _id: createChat._id
                }
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "users",
                    foreignField: "user_id",
                    as: "users",
                },
            }, {
                $project: {
                    _id: 1,
                    chatName: 1,
                    isGroupChat: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    users: {
                        _id: 1,
                        user_id: 1,
                        user_login_id: 1,
                        user_name: 1,
                        user_email_id: 1,
                        image: 1,
                    }
                }
            }]);

            //return success data response
            return response.returnTrue(200, req, res, "Chat Data created and Fetched Successfully", fullChat[0])
        } catch (err) {
            //return error response
            return response.returnFalse(500, req, res, err.message, {});
        }
    }
};

// @desc		Get all the chats for one user
// @route		GET /api/chats
// @access		private
exports.fetchChats = async (req, res) => {
    try {
        //get current user Id
        const currentUserId = req.params.id;

        //all chat details find with aggregation
        var allChats = await Chat.aggregate([{
            $match: {
                users: { $elemMatch: { $eq: Number(currentUserId) } }
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "users",
                foreignField: "user_id",
                as: "users",
            },
        }, {
            $lookup: {
                from: "messages",
                localField: "latestMessage",
                foreignField: "_id",
                as: "latestMessage",
            },
        }, {
            $lookup: {
                from: "usermodels",
                localField: "groupAdmin",
                foreignField: "_id",
                as: "groupAdmin",
            },
        }, {
            $project: {
                _id: 1,
                chatName: 1,
                isGroupChat: 1,
                createdAt: 1,
                updatedAt: 1,
                users: {
                    _id: 1,
                    user_id: 1,
                    user_login_id: 1,
                    user_name: 1,
                    user_email_id: 1,
                    image: 1,
                },
                latestMessage: {
                    $arrayElemAt: ["$latestMessage", 0]
                },
                groupAdmin: {
                    _id: {
                        $arrayElemAt: ["$groupAdmin._id", 0]
                    },
                    user_id: {
                        $arrayElemAt: ["$groupAdmin.user_id", 0]
                    },
                    user_login_id: {
                        $arrayElemAt: ["$groupAdmin.user_login_id", 0]
                    },
                    user_name: {
                        $arrayElemAt: ["$groupAdmin.user_name", 0]
                    },
                    user_email_id: {
                        $arrayElemAt: ["$groupAdmin.user_email_id", 0]
                    },
                    image: {
                        $arrayElemAt: ["$groupAdmin.image", 0]
                    }
                }
            }
        }, {
            $sort: {
                updatedAt: -1
            }
        }]);

        //chat details populate to get data
        allChats = await userModel.populate(allChats, {
            path: "latestMessage.sender",
            select: "user_name image user_email_id",
        });
        //return success data response
        return response.returnTrue(200, req, res, "Chat Details Fetched Successfully", allChats)
    } catch (err) {
        //return error response
        return response.returnFalse(500, req, res, err.message, {});
    }
};

// @desc		Create a new Chat room
// @route		POST /api/chats/group
// @access		Private
exports.createGroupChat = async (req, res) => {
    // const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({
            message: "Please add all the required fields",
        });
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send({
            message: "A group must have more than 2 users",
        });
    }

    // add the current logged in user as well in the users array
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (err) {
        res.status(500);
        throw new Error("Server could not work on the request");
    }
};

// @desc		Rename the chat
// @route		PUT /api/chats/groupRename
// @access		Private
exports.renameGroup = async (req, res) => {
    // const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    if (!chatName) {
        res.status(400).send({
            message: "Please provide a valid group name",
        });
    }
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(updatedChat);
    } catch (err) {
        res.status(500);
        throw new Error("Server could not work on the request");
    }
};

// @desc		add a new member to the group
// @route		PUT /api/chats/groupAdd
// @access		Private
exports.addToGroup = async (req, res) => {
    // const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!updatedChat) {
            res.status(400);
            throw new Error("Invalid chat");
        } else {
            res.status(200).json(updatedChat);
        }
    } catch (error) {
        res.status(500);
        throw new Error("Server could not work on the request");
    }
};

// @desc		add a new member to the group
// @route		PUT /api/chats/groupAdd
// @access		Private
exports.removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!updatedChat) {
            res.status(400);
            throw new Error("Invalid chat");
        } else {
            res.status(200).json(updatedChat);
        }
    } catch (error) {
        res.status(500);
        throw new Error("Server could not work on the request");
    }
};
















