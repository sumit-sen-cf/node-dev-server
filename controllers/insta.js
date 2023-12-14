const instaC = require("../models/instaCModel.js");
const instaP = require("../models/instaPModel.js");
const instaS = require("../models/instaSModel.js");
// const instaPNew = require('../models/instaPModelNew.js');
// const instaCNew = require('../models/instaPModelNew.js');
const jwt = require("jsonwebtoken");
const variable = require("../variables.js");
const axios = require("axios");
const constant = require("../common/constant.js");
const fs = require('fs');
const path = require('path');
const projectxModel = require("../models/projectxModel.js");
const crawlerModel = require("../models/crawlerModel.js");

const tesseract = require("tesseract.js");
const instaBrandModel = require("../models/instaBrandModel.js");
const instaPostAnalyticsModel = require("../models/instaPostAnalyticsModel.js");
exports.trackCreator = async (req, res) => {
    try {
        const creators = new instaC({
            groupName: req.body.groupName,
            creatorName: req.body.handle,
            followersCount: req.body.stats.followers_count.overall,
            followersToday: req.body.stats.followers_count.today,
            followersPast: req.body.stats.followers_count.vs_previous,
            followingCount: req.body.stats.following_count.overall,
            followingToday: req.body.stats.following_count.today,
            followingPast: req.body.stats.following_count.vs_previous,
            postCount: req.body.stats.post_count.overall,
            postCountToday: req.body.stats.post_count.today,
            postCountPast: req.body.stats.post_count.vs_previous,
        });
        const instav = await creators.save();
        res.send({ instav, status: 200 });
    } catch (error) {
        res.status(500).send({ error: error, sms: "error while adding data" });
    }
};

const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY0NmNhOTExZWY5ZTcwNWM3ODc1Nzk0NyIsIm5hbWUiOiJjcmVhdGl2ZWZ1ZWwiLCJleHAiOjE3Mjc0ODg3MzAsInJvbGUiOiJDTElFTlQiLCJwZXJtaXNzaW9ucyI6W10sInNlc3Npb24iOiJhNjUwNDg1MS00ZTgwLTRiZjQtODBkZC02YzgxYWYxNjU2MzAifQ.EP0JfWCsLxaFdCLr6MizEeltnJ4h3s9PLi-GuoCUops";

exports.trackCreatorY = async (req, res) => {
    try {
        const trackCreatorParams = {
            connector: req.body.connector,
            handle: req.body.handle,
            cron_expression: req.body.cron_expression,
            tracking_expiry_at: req.body.tracking_expiry_at,
        };

        const response = await axios.post(
            "https://app.ylytic.com/ylytic/api/v1/rt_tracking/creators",
            trackCreatorParams,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, sms: "These creators cant be sent" });
    }
};

exports.trackCreatorPutY = async (req, res) => {
    try {
        const trackCreatorParams = {
            cron_expression: req.body.cron_expression,
            tracking_expiry_at: req.body.tracking_expiry_at,
            tracking: req.body.tracking,
            // tracking: true,
        };

        const response = await axios.put(
            `https://app.ylytic.com/ylytic/api/v1/rt_tracking/creators/${req.params.pagename}`,
            trackCreatorParams,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, sms: "These creators cron expression cant be edited" });
    }
};

exports.getCreators = async (req, res) => {
    try {
        const getcreators = await instaC.find();
        if (!getcreators) {
            res.status(500).send({ success: false });
        }
        res.status(200).send(getcreators);
    } catch (err) {
        res.status(500).send({ error: err, sms: "Error getting all creators" });
    }
};

exports.trackPost = async (req, res) => {
    try {
        // const imageUrl = req.body.data.display_url[0];
        // const savePath = path.join(__dirname, '../uploads/instaImages');

        // if (!fs.existsSync(savePath)) {
        //     fs.mkdirSync(savePath, { recursive: true });
        // }

        // const fileExtension = path.extname(imageUrl);
        // const fileName = `image-${Date.now()}${fileExtension}`;
        // var filePath = path.join(savePath, fileName);

        // axios({
        //     method: 'get',
        //     url: imageUrl,
        //     responseType: 'stream',
        // })
        // .then(async (response) => {
        //     response.data.pipe(fs.createWriteStream(filePath));

        //     const creators = new instaP({
        //         postType: req.body.data.post_type,
        //         creatorName: req.body.data.creator.username,
        //         allComments: req.body.data.comments_count.overall,
        //         brand_id: req.body.data.comments_count.today,
        //         pastComment: req.body.data.comments_count.vs_previous,
        //         allLike: req.body.data.likes_count.overall,
        //         campaign_id: req.body.data.likes_count.today,
        //         pastLike: req.body.data.likes_count.vs_previous,
        //         allView: req.body.data.views_count.overall,
        //         agency_id: req.body.data.views_count.today,
        //         pastView: req.body.data.views_count.vs_previous,
        //         title: req.body.data.title,
        //         postedOn: req.body.data.posted_at,
        //         postUrl: req.body.data.post_url,
        //         postImage: filePath,
        //         shortCode: req.body.shortcode,
        //         posttype_decision: req.body.posttype_decision,
        //         selector_name: req.body.selector_name,
        //         interpretor_name: req.body.interpretor_name,
        //         auditor_name: req.body.auditor_name,
        //         auditor_decision: req.body.auditor_decision,
        //         interpretor_decision: req.body.interpretor_decision,
        //         selector_decision: req.body.selector_decision,
        //     });
        //     const instav = await creators.save();
        //     res.send({ instav, status: 200 });
        // })

        let check = await instaP.findOne({ shortCode: req.body.shortcode })
        if (!check) {
            const creators = new instaP({
                handle: req.body.data?.handle ?? "",
                postType: req.body.data.post_type,
                creatorName: req.body.data.creator.username,
                profile_pic_url: req.body.data.creator.profile_pic_url,
                allComments: req.body.data.comments_count.overall,
                brand_id: 0,
                todayComment: req.body.data.comments_count.today,
                pastComment: req.body.data.comments_count.vs_previous,
                allLike: req.body.data.likes_count.overall,
                campaign_id: 0,
                todayLikes: req.body.data.likes_count.today,
                pastLike: req.body.data.likes_count.vs_previous,
                allView: req.body.data.views_count.overall,
                todayViews: req.body.data.views_count.today,
                // agency_id: req.body.data.views_count.today,
                pastView: req.body.data.views_count.vs_previous,
                title: req.body.data.title,
                postedOn: req.body.data.posted_at,
                postUrl: req.body.data.post_url,
                postImage: req.body.data.display_url[0],
                shortCode: req.body.shortcode,
                posttype_decision: req.body.posttype_decision,
                selector_name: req.body.selector_name,
                interpretor_name: req.body.interpretor_name,
                auditor_name: req.body.auditor_name,
                auditor_decision: req.body.auditor_decision,
                interpretor_decision: req.body.interpretor_decision,
                selector_decision: req.body.selector_decision,
                music_info : req.body.data?.music_info,
                location : req.body.data?.location,
                sponsored : req.body.data?.sponsored,
            });
            const instav = await creators.save();
            res.send({ instav, status: 200 });
        } else {
            res.send({ instav: {}, status: 200, message: "short code must be unique" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error while adding data" });
    }
};

exports.trackPostY = async (req, res) => {
    try {
        const trackCreatorParams = {
            connector: req.body.connector,
            shortcode: req.body.handle,
            cron_expression: req.body.cron_expression,
        };

        const response = await axios.post(
            "https://app.ylytic.com/ylytic/admin/api/v1/track_post",
            trackCreatorParams,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, sms: "These post cant be sent" });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const distinctPosts = await instaP.aggregate([
            {
                $sort: { postedOn: -1 },
            },
            {
                $group: {
                    _id: "$postUrl",
                    data: { $first: "$$ROOT" },
                },
            },
            {
                $replaceRoot: { newRoot: "$data" },
            },
        ]);

        if (!distinctPosts || distinctPosts.length === 0) {
            res.status(200).send({ success: false, message: "No posts found" });
        } else {
            res.status(200).send(distinctPosts);
        }
    } catch (err) {
        res.status(500).send({ error: err, message: "Error getting posts" });
    }
};

exports.editInsta = async (req, res) => {
    try {
        const editinsta = await instaP.findByIdAndUpdate(
            req.body._id,
            {
                posttype_decision: req.body.posttype_decision,
                postImage: req.body.postImage,
                selector_name: req.body.selector_name,
                interpretor_name: req.body.interpretor_name,
                auditor_name: req.body.auditor_name,
                auditor_decision: req.body.auditor_decision,
                interpretor_decision: req.body.interpretor_decision,
                selector_decision: req.body.selector_decision,
                brand_id: req.body.brand_id,
                campaign_id: req.body.campaign_id,
                agency_id: req.body.agency_id,
                pastComment: req.body.pastComment,
                pastLike: req.body.pastLike,
                pastView: req.body.pastView,
                hashTag: req.body.hashTag,
                mentions: req.body.mentions,
                selector_date: req.body.selector_date,
                interpretor_date: req.body.interpretor_date,
                auditor_date: req.body.auditor_date,
                updatedAt: Date.now()
            },
            { new: true }
        );
        if (!editinsta) {
            res.status(500).send({ success: false });
        }
        res.status(200).send({ success: true, data: editinsta });
    } catch (err) {
        res.status(500).send({ error: err, sms: "Error updating insta post" });
    }
};

//insta story update
exports.editInstaStory = async (req, res) => {
    try {
        const editinstastory = await instaS.findByIdAndUpdate(
            req.body._id,
            {
                posttype_decision: req.body.posttype_decision,
                brand_id: req.body.brand_id,
                campaign_id: req.body.campaign_id,
                selector_name: req.body.selector_name,
                interpretor_name: req.body.interpretor_name,
                auditor_name: req.body.auditor_name,
                auditor_decision: req.body.auditor_decision,
                interpretor_decision: req.body.interpretor_decision,
                selector_decision: req.body.selector_decision,
                selector_date: req.body.selector_date,
                interpretor_date: req.body.interpretor_date,
                auditor_date: req.body.auditor_date,
                image_url: req.body.image_url
            },
            { new: true }
        );
        if (!editinstastory) {
            res.status(500).send({ success: false });
        }
        res.status(200).send({ success: true, data: editinstastory });
    } catch (err) {
        res.status(500).send({ error: err, sms: "Error updating insta story" });
    }
};


exports.getStorysFromName = async (req, res) => {
    try {
        const creatorName = req.body.creatorName;
        const page = req.query.page || 1;
        const perPage = req.query.perPage || 50;
        const skip = (page - 1) * perPage;

        const getStorys = await instaS
            .find({ creatorName: creatorName, posttype_decision: req.body.posttype_decision })
            .sort({ savedOn: -1 })
            .skip(skip)
            .limit(perPage);

        if (!getStorys || getStorys.length == 0) {
            res.status(200).send({
                success: false,
                message: "No posts found from this creatorName",
            });
        } else {
            const newMap = new Map();
            getStorys.forEach((item) => newMap.set(item.shortcode, item));
            res.status(200).send([...newMap.values()]);
            // res.status(200).send(getStorys);
        }
    } catch (error) {
        res
            .status(500)
            .send({ error: error, sms: "error getting storys from name" });
    }
};


exports.creatorNameCountForStory = async (req, res) => {
    try {
        const query = await instaS.aggregate([
            {
                $group: {
                    _id: "$creatorName",
                    index: { $first: "$_id" },
                    decision_11_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 11] }, then: 1, else: 0 }
                        }
                    },
                    decision_2_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 2] }, then: 1, else: 0 }
                        }
                    },
                    decision_1_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 1] }, then: 1, else: 0 }
                        }
                    },
                    decision_0_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 0] }, then: 1, else: 0 }
                        }
                    }
                }
            }
        ]).exec();
        const sortOrder = req.body.sortOrder;

        switch (sortOrder) {
            case 0:
                query.sort((a, b) => b.decision_0_count - a.decision_0_count);
                break;
            case 1:
                query.sort((a, b) => b.decision_1_count - a.decision_1_count);
                break;
            case 2:
                query.sort((a, b) => b.decision_2_count - a.decision_2_count);
                break;
            case 3:
                query.sort((a, b) => b.decision_11_count - a.decision_11_count);
                break;
            default:
                break;
        }

        res.status(200).send({ success: true, data: query });
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "something went wrong" });
    }
};

exports.postTypeDecCount = async (req, res) => {
    try {
        const pipeline = [
            {
                $match: { posttype_decision: 1 },
            },
            {
                $group: {
                    _id: "$creatorName",
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    count: 1,
                },
            },
        ];
        const query = await instaP.aggregate(pipeline);
        res.status(200).send({ success: true, data: query });
    } catch (error) {
        res.status(500).send({ error: error, sms: "Something went wrong" });
    }
};

exports.creatorNameCount = async (req, res) => {
    try {

        const query = await instaP.aggregate([
            // {
            //     $lookup: {
            //         from: "projectxmodels",
            //         localField: "creatorName",
            //         foreignField: "page_name",
            //         as: "projectData"
            //     }
            // },
            // {
            //     $unwind: {
            //         path: "$projectData",
            //         preserveNullAndEmptyArrays: true,
            //     },
            // },
            {
                $group: {
                    _id: "$creatorName",
                    index: { $first: "$_id" },
                    decision_11_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 11] }, then: 1, else: 0 }
                        }
                    },
                    decision_2_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 2] }, then: 1, else: 0 }
                        }
                    },
                    decision_1_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 1] }, then: 1, else: 0 }
                        }
                    },
                    decision_0_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 0] }, then: 1, else: 0 }
                        }
                    },
                    selector_decision_1_count: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$posttype_decision", 1] },
                                then: {
                                    $cond: {
                                        if: { $eq: ["$selector_decision", 1] },
                                        then: 1,
                                        else: 0
                                    }
                                },
                                else: 0
                            }
                        }
                    },
                    selector_decision_2_count: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$posttype_decision", 1] },
                                then: {
                                    $cond: {
                                        if: { $eq: ["$selector_decision", 2] },
                                        then: 1,
                                        else: 0
                                    }
                                },
                                else: 0
                            }
                        }
                    },
                    selector_decision_3_count: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$posttype_decision", 1] },
                                then: {
                                    $cond: {
                                        if: { $eq: ["$selector_decision", 3] },
                                        then: 1,
                                        else: 0
                                    }
                                },
                                else: 0
                            }
                        }
                    },
                    // page_category_id: { $first: "$projectData.page_category_id" }
                }
            }
        ]).exec();
        const sortOrder = req.body.sortOrder;
        switch (sortOrder) {
            case 0:
                query.sort((a, b) => b.decision_0_count - a.decision_0_count);
                break;
            case 1:
                query.sort((a, b) => b.decision_1_count - a.decision_1_count);
                break;
            case 2:
                query.sort((a, b) => b.decision_2_count - a.decision_2_count);
                break;
            case 3:
                query.sort((a, b) => b.decision_11_count - a.decision_11_count);
                break;
            default:
                break;
        }

        res.status(200).send({ success: true, data: query });
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "something went wrong" });
    }
};

exports.creatorStoriesCount = async (req, res) => {
    try {
        const query = await instaS.aggregate([
            {
                $group: {
                    _id: "$creatorName",
                    index: { $first: "$_id" },
                    decision_11_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 11] }, then: 1, else: 0 }
                        }
                    },
                    decision_2_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 2] }, then: 1, else: 0 }
                        }
                    },
                    decision_1_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 1] }, then: 1, else: 0 }
                        }
                    },
                    decision_0_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 0] }, then: 1, else: 0 }
                        }
                    },
                    selector_decision_1_count: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$posttype_decision", 1] },
                                then: {
                                    $cond: {
                                        if: { $eq: ["$selector_decision", 1] },
                                        then: 1,
                                        else: 0
                                    }
                                },
                                else: 0
                            }
                        }
                    },
                    selector_decision_2_count: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$posttype_decision", 1] },
                                then: {
                                    $cond: {
                                        if: { $eq: ["$selector_decision", 2] },
                                        then: 1,
                                        else: 0
                                    }
                                },
                                else: 0
                            }
                        }
                    },
                    selector_decision_3_count: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$posttype_decision", 1] },
                                then: {
                                    $cond: {
                                        if: { $eq: ["$selector_decision", 3] },
                                        then: 1,
                                        else: 0
                                    }
                                },
                                else: 0
                            }
                        }
                    },
                }
            }
        ]).exec();
        const sortOrder = req.body.sortOrder;

        switch (sortOrder) {
            case 0:
                query.sort((a, b) => b.decision_0_count - a.decision_0_count);
                break;
            case 1:
                query.sort((a, b) => b.decision_1_count - a.decision_1_count);
                break;
            case 2:
                query.sort((a, b) => b.decision_2_count - a.decision_2_count);
                break;
            case 3:
                query.sort((a, b) => b.decision_0_count - a.decision_0_count);
                break;
            default:
                break;
        }

        res.status(200).send({ success: true, data: query });
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "something went wrong" });
    }
};
exports.selectorNameCountInstaP = async (req, res) => {
    try {
        const { selectData, startDate, endDate } = req.body
        let startDateParse = new Date(startDate);
        let endDateParse = new Date(endDate);
        // const startDate = new Date("2023-01-01"); 
        // const endDate = new Date("2023-12-31");
        //Flag 2 for all data fetch and flag 1 for perticular date range data fetch
        if (selectData === 1) {
            const query = await instaP.aggregate([
                {
                    $match: {
                        selector_date: {
                            $gte: startDateParse,
                            $lte: endDateParse
                        }
                    }
                },
                {
                    $group: {
                        _id: "$selector_name",
                        count: { $sum: 1 }
                    }
                }
            ]).exec();

            res.status(200).send({ success: true, data: query });
        } else if (selectData === 2) {
            const query = await instaP.aggregate([
                {
                    $group: {
                        _id: "$selector_name",
                        count: { $sum: 1 }
                    }
                }
            ]).exec();

            res.status(200).send({ success: true, data: query });
        } else {
            res.status(200).send({ success: false, message: "Please provide valid selectData" });
        }

    } catch (error) {
        res.status(500).send({ error: error.message, sms: "something went wrong" });
    }
};
exports.selectorNameCountInstaS = async (req, res) => {
    try {
        const { selectData, startDate, endDate } = req.body
        let startDateParse = new Date(startDate);
        let endDateParse = new Date(endDate);
        // const startDate = new Date("2023-01-01"); 
        // const endDate = new Date("2023-12-31");
        //Flag 2 for all data fetch and flag 1 for perticular date range data fetch
        if (selectData === 1) {
            const query = await instaS.aggregate([
                {
                    $match: {
                        selector_date: {
                            $gte: startDateParse,
                            $lte: endDateParse
                        }
                    }
                },
                {
                    $group: {
                        _id: "$selector_name",
                        count: { $sum: 1 }
                    }
                }
            ]).exec();

            res.status(200).send({ success: true, data: query });
        } else if (selectData === 2) {
            const query = await instaS.aggregate([
                {
                    $group: {
                        _id: "$selector_name",
                        count: { $sum: 1 }
                    }
                }
            ]).exec();

            res.status(200).send({ success: true, data: query });
        } else {
            res.status(200).send({ success: false, message: "Please provide valid selectData" });
        }

    } catch (error) {
        res.status(500).send({ error: error.message, sms: "something went wrong" });
    }
};
exports.getPostsFromName = async (req, res) => {
    try {
        const creatorName = req.body.creatorName;
        const page = req.query.page || 1;
        const perPage = req.query.perPage || 50;
        const skip = (page - 1) * perPage;

        let matchCondition = {creatorName: creatorName}
        
        if(req.body.posttype_decision !== 111){
            matchCondition.posttype_decision = req.body.posttype_decision
        }

        const getPosts = await instaP
            .find(matchCondition)
            .sort({ postedOn: -1 })
            .skip(skip)
            .limit(perPage);

        if (!getPosts || getPosts.length == 0) {
            res.status(200).send({
                success: false,
                message: "No posts found from this creatorName",
            });
        } else {
            const newMap = new Map();
            getPosts.forEach((item) => newMap.set(item.postUrl, item));
            res.status(200).send([...newMap.values()]);
        }
    } catch (error) {
        res
            .status(500)
            .send({ error: error.message, sms: "error getting posts from name" });
    }
};

exports.getPostsByDecNum = async (req, res) => {
    try {
        const getPosts = await instaP.find({ posttype_decision: parseInt(req.body.posttype_decision) });
        res.status(200).send(getPosts);
    } catch (error) {
        res
            .status(500)
            .send({ error: error, sms: "error getting posts from name" });
    }
};

exports.trackStory = async (req, res) => {
    try {
        // console.log("story api", req.body);
        if (req.body) {
            for (const data of req.body?.story_data?.stories) {
                let check = await instaS.findOne({ shortcode: data?.shortcode })
                if (!check) {
                    const creators = new instaS({
                        creatorName: req.body?.handle,
                        mediaCont: req.body?.story_data?.media_count,
                        expiredAt: req.body?.story_data?.expiry_at,
                        savedOn: data?.taken_at,
                        shortcode: data?.shortcode,
                        links: data?.links,
                        hashtags: data?.hashtags,
                        mentions: data?.mentions,
                        locations: data?.locations,
                        music: data?.music,
                        posttype_decision: req.body?.posttype_decision,
                        selector_name: req.body?.selector_name,
                        interpretor_name: req.body?.interpretor_name,
                        auditor_name: req.body?.auditor_name,
                        auditor_decision: req.body?.auditor_decision,
                        interpretor_decision: req.body?.interpretor_decision,
                        selector_decision: req.body?.selector_decision,
                        image_url: data?.image_url,
                    })
                    await creators.save();
                }
            }
            return res.send({ status: 200, sms: "Stories created successfully." })
        } else {
            return res.send({ status: 200, sms: "Please provide request body." })
        }

    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error while adding data" });
    }
};

exports.getStories = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const perPage = req.query.perPage || 50;
        const skip = (page - 1) * perPage;

        const getStorys = await instaS.find({}).skip(skip)
            .limit(perPage);
        return res.status(200).send(getStorys);
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error getting stories" });
    }
};

exports.creatorInsights = async (req, res) => {
    try {
        const response = await axios.get(
            constant.CREATOR_INSIGHTS,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const resObj = {
            status: response.status,
            data: { ...response.data?.insights?.creator_insights?.creators, posts: response.data?.insights?.post_insights?.posts },
            // data: response.data?.insights?.creator_insights?.creators,
            message: "Success",
        };
        res.status(response.status).json(resObj);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, sms: "These creators cant be sent" });
    }
};
exports.cfInstaApi = async (req, res) => {
    try {
        const response = await axios.get(
            constant.CF_INSTA_API,
            {
                headers: {
                    Authorization: `Bearer ${req.headers.authorization}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const dataobj = {
            biography: response.data?.graphql?.user?.biography
        }
        const resObj = {
            status: response.status,
            data: dataobj,
            message: "Success",
        };
        res.status(response.status).json(resObj);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, sms: "Something went wrong..." });
    }
};

exports.countInstaCPModels = async (req, res) => {
    try {
        const flag = req.body.flag
        let resObj = { status: 200 }
        if (parseInt(flag) === constant.INSTA_C_MODELS) {
            const response = await instaC.countDocuments({})
            resObj.data = {
                instac_count: response
            }
        } else if (parseInt(flag) === constant.INSTA_P_MODELS) {
            const response = await instaP.countDocuments({})
            resObj.data = {
                instap_count: response
            }
        } else {
            resObj.message = "Provide valid flag"
            return res.status(200).json(resObj);
        }
        return res.status(200).json(resObj);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, sms: "Something went wrong..." });
    }
};

exports.getDynamicReqAndResInstaP = async (req, res) => {
    try {
        const ReqKey = req.body.request_key;
        const ReqValue = req.body.request_value;
        const flag = req.body.flag;
        const page = req.query?.page;
        const perPage = req.query?.perPage;
        const skip = (page - 1) * perPage;

        if (flag === 1) {
            // Return the count of matching documents
            const count = await instaP.countDocuments({ [ReqKey]: parseInt(ReqValue) });
            return res.status(200).json({ count });
        } else if (flag === 2) {
            // Return all matching documents
            if (page && perPage) {

                const getPosts = await instaP.find({ [ReqKey]: parseInt(ReqValue) }).skip(skip)
                    .limit(perPage);
                return res.status(200).json(getPosts);
            } else {
                const getPosts = await instaP.find({ [ReqKey]: parseInt(ReqValue) })
                return res.status(200).json(getPosts);
            }

        } else {
            return res.status(400).json({ error: "Invalid flag value" });
        }
    } catch (error) {
        res.send({ status: 500, error: error.message, sms: "error getting posts from name" });
    }
};
exports.getDynamicReqAndResInstaS = async (req, res) => {
    try {
        const ReqKey = req.body.request_key;
        const ReqValue = req.body.request_value;
        const flag = req.body.flag;
        const page = req.query?.page;
        const perPage = req.query?.perPage;
        const skip = (page - 1) * perPage;

        if (flag === 1) {
            // Return the count of matching documents
            const count = await instaS.countDocuments({ [ReqKey]: parseInt(ReqValue) });
            return res.status(200).json({ count });
        } else if (flag === 2) {
            // Return all matching documents
            if (page && perPage) {

                const getPosts = await instaS.find({ [ReqKey]: parseInt(ReqValue) }).skip(skip)
                    .limit(perPage);
                return res.status(200).json(getPosts);
            } else {
                const getPosts = await instaS.find({ [ReqKey]: parseInt(ReqValue) })
                return res.status(200).json(getPosts);
            }

        } else {
            return res.status(400).json({ error: "Invalid flag value" });
        }
    } catch (error) {
        res.send({ status: 500, error: error.message, sms: "error getting stories from name" });
    }
};

exports.getAvgFrqOfPost = async (req, res) => {
    try {
        //underworing-----------------------------------------------------

        const query = await instaP.aggregate([
            //   {
            //     $match: {
            //       postedOn: {
            //         $gte: startOfCurrentDate, // Match documents with "postedOn" greater than or equal to the start of the current date
            //         $lt: endOfCurrentDate,     // Match documents with "postedOn" less than the end of the current date
            //       }
            //     }
            //   },
            {
                $group: {
                    _id: "$creatorName",
                    index: { $first: "$_id" },
                    maxPostedOn: { $max: "$postedOn" },
                    minPostedOn: { $min: "$postedOn" },
                    decision_2_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 2] }, then: 1, else: 0 }
                        }
                    },
                    decision_1_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 1] }, then: 1, else: 0 }
                        }
                    },
                    decision_0_count: {
                        $sum: {
                            $cond: { if: { $eq: ["$posttype_decision", 0] }, then: 1, else: 0 }
                        }
                    }
                }
            }
        ]).exec();
        res.status(200).send(query);
    } catch (error) {
        res.send({ status: 500, error: error.message, sms: "error getting posts from name" });
    }
};


exports.getAnalytics = async (req, res) => {
    try {

        const query = await instaP.aggregate([
            {
                $match: {
                    posttype_decision: { $gt: 1 },
                    interpretor_decision: 1
                }
            },
            {
                $facet: {
                    byCampaignId: [
                        {
                            $match: {
                                campaign_id: { $ne: 0 },
                            }
                        },
                        {
                            $group: {
                                _id: "$campaign_id",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $sort: {
                                count: -1,
                                _id: 1
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                max_id: { $first: "$_id" },
                                max_count: { $first: "$count" },
                                min_id: { $last: "$_id" },
                                min_count: { $last: "$count" }
                            }
                        },

                        {
                            $project: {
                                _id: 0,
                                max_id: 1,
                                max_count: 1,
                                min_id: 1,
                                min_count: 1
                            }
                        }
                    ],
                    byBrandId: [
                        {
                            $match: {
                                brand_id: { $ne: 0 },
                            }
                        },
                        {
                            $group: {
                                _id: "$brand_id",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $sort: {
                                count: -1,
                                _id: 1
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                max_id: { $first: "$_id" },
                                max_count: { $first: "$count" },
                                min_id: { $last: "$_id" },
                                min_count: { $last: "$count" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                max_id: 1,
                                max_count: 1,
                                min_id: 1,
                                min_count: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    campaignId: { $arrayElemAt: ["$byCampaignId", 0] },
                    brandId: { $arrayElemAt: ["$byBrandId", 0] }
                }
            }
        ]);
 

        if (query.length !== 0 && Object.keys(query[0]).length !== 0) {

            return res.status(200).send(query[0]);
        } else {
            return res.send({ status: 200, message: "No record found." });
        }
    } catch (error) {
        return res.send({ status: 500, error: error.message, message: "Error getting analytics." });
    }
};


exports.getDynamicMultiReqAndResInsta = async (req, res) => {
    try {
        const { model, request_key_1, request_key_2, request_value_1, request_value_2, flag, matchCondition, sortingFlag } = req.body;
        const page = req.query?.page;
        const perPage = req.query?.perPage;
        const skip = (page - 1) * perPage;

        if (![1, 2].includes(model)) {
            return res.status(200).json({ message: "Invalid model value, you should provide 1 or 2, 1 for post and 2 for story." });
        }
        if (sortingFlag && sortingFlag !== 1) {
            return res.status(200).json({ message: "Invalid sorting flag you should provide 1 for apply sorting." });
        }

        const modelCollection = model === 1 ? instaP : instaS;

        if (flag !== 1 && flag !== 2) {
            return res.status(200).json({ message: "Invalid flag value, you should provide 1 or 2, 1 for count and 2 for all data." });
        }

        const countQuery = { [request_key_1]: request_value_1, [request_key_2]: request_value_2 };
        const dataQuery = { [request_key_1]: request_value_1, [request_key_2]: request_value_2 };

        if (matchCondition) {
            // Spread the contents of matchCondition into countQuery and dataQuery
            Object.assign(countQuery, matchCondition);
            Object.assign(dataQuery, matchCondition);
        }

        if (flag === 1) {
            const count = await modelCollection.countDocuments(countQuery);
            return res.status(200).json({ count });
        } else if (flag === 2) {
            let getPosts;
            let query = modelCollection.find(dataQuery);

            if (sortingFlag === 1) {
                query = query.sort({ postedOn: -1 });
            }
            
            if (page && perPage) {
                getPosts = await  query.skip(skip).limit(perPage);
            } else {
                getPosts = await query.skip(skip).limit(perPage);
            }

            return res.status(200).json(getPosts);
        }

    } catch (error) {
        res.status(500).json({ status: 500, error: error.message, sms: "Internal server error." });
    }
};

exports.countBasedOnPostedOn = async (req, res) => {
    
    const { startDate, endDate, selectData, model } = req.body;
    const startDateParse = new Date(startDate);
    const endDateParse = new Date(endDate);
    
    
    if (![1, 2].includes(selectData)) {
        return res.status(200).json({ message: "Invalid selectData value, you should provide 1 or 2, 2 for all data fetch and 1 for particular date range data." });
    }

    if (![1, 2].includes(model)) {
        return res.status(200).json({ message: "Invalid model value, you should provide 1 or 2, 1 for post and 2 for story." });
    }
    
    const modelCollection = model === 1 ? instaP : instaS;
    
    const createDateRangeQuery = (field) => [
        {
            $match: {
                [field]: { $exists: true, $ne: "" } // Filter out documents where the field is empty or doesn't exist
            }
        },
        {
            $project: {
                date: {
                    $dateFromString: {
                        dateString: {
                            $substr: [`$${field}`, 0, 10] // Extract the first 10 characters (date portion)
                        },
                        format: "%Y-%m-%d"
                    }
                }
            }
        },
        {
            $match: {
                date: {
                    $gte: new Date(startDateParse.toISOString()),
                    $lte: new Date(endDateParse.toISOString())
                }
            }
        },
        {
            $group: {
                _id: "$date",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                date: {
                    $dateToString: { format: "%Y-%m-%d", date: "$_id" }
                },
                count: 1
            }
        }
    ];

    const createWithoutDateRangeQuery = (field)=> [
        {
            $match: {
                [field]: { $exists: true, $ne: "" } // Filter out documents where the field is empty or doesn't exist
            }
        },
        {
            $project: {
                date: {
                    $dateFromString: {
                        dateString: {
                            $substr: [`$${field}`, 0, 10] // Extract the first 10 characters (date portion)
                        },
                        format: "%Y-%m-%d"
                    }
                }
            }
        },
        {
            $group: {
              _id: `$date`, 
              count: { $sum: 1 } 
            }
          },
          {
            $project: {
                _id: 0,
                date: {
                    $dateToString: { format: "%Y-%m-%d", date: "$_id" }
                },
                count: 1
            }
        }
    ]
    
    const dateRangeQueryInstap = createDateRangeQuery("postedOn");
    const withoutDateRangeQueryInstap = createWithoutDateRangeQuery("postedOn");
    const dateRangeQueryInstas = createDateRangeQuery("savedOn");
    const withoutDateRangeQueryInstas = createWithoutDateRangeQuery("savedOn");
    
    const finalDateRangeQuery = model === 1 ? dateRangeQueryInstap : dateRangeQueryInstas;
    const finalWithoutDateRangeQuery = model === 1 ? withoutDateRangeQueryInstap : withoutDateRangeQueryInstas;
    try {
    let query;

        if (selectData === 1) {
            query = await modelCollection.aggregate(finalDateRangeQuery).sort({ date: -1 });
        } else if (selectData === 2) {
            query = await modelCollection.aggregate(finalWithoutDateRangeQuery).sort({ date: -1 });
        }
    
        if (!query) {
            return res.status(200).send({ success: false, data: {}, message: "Something went wrong" });
        }
        return res.status(200).send({ success: true, data: query });

    } catch (error) {
          res.status(500).send({ status: 500, error: error.message, message: "Internal server error." });
    }
};

exports.imageToText = async (req,res)=>{
    try {
        // const img = "https://s3.ap-south-1.amazonaws.com/nudges//tmp/Cz5gyguxBT5.jpg";
        const img = req.body.img;
        tesseract
        .recognize(img, "eng")
        .then((data) => {
          return res.status(200).send({ success: true, data: data?.data?.text });
        })
        .catch((error) => {
          res.status(500).send({ status: 500, error: error.message, message: "Internal server error." });
        });
    } catch (error) {
        res.status(500).send({ status: 500, error: error.message, message: "Internal server error." });
    }
}

exports.addCrawlerCount = async (req, res) => {
    try {
        const creators = new crawlerModel({
            creatorName: req.body.creatorName,
            maxPostCountDay: req.body.maxPostCountDay,
            crawlerCount: req.body.crawlerCount,
            remark: req.body.remark
        });
        const instav = await creators.save();
        res.send({ instav, status: 200 });
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error while adding crawler data" });
    }
};

exports.editCrawlerCount = async (req, res) => {
    try {
        const editinsta = await crawlerModel.findByIdAndUpdate(
            req.body._id,
            {
                // creatorName: req.body.creatorName,
                maxPostCountDay: req.body.maxPostCountDay,
                crawlerCount: req.body.crawlerCount,
                remark: req.body.remark
            },
            { new: true }
        );
        if (!editinsta) {
            res.status(500).send({ success: false });
        }
        res.status(200).send({ success: true, data: editinsta });
    } catch (err) {
        res.status(500).send({ error: err.message, sms: "Error updating insta crawler count" });
    }
};

exports.getAllCrawler = async (req, res) => {
    try{
        const simc = await crawlerModel.find({});
        if(!simc){
            res.status(500).send({success:false})
        }
        res.status(200).send({data:simc})
    } catch(err){
        res.status(500).send({error:err.message,sms:'Error getting all crawlers datas'})
    }
};
exports.getSingleCrawler = async (req, res) =>{
    try {
        const user = await crawlerModel.findById(req.params._id);
        res.status(200).send({data:user})
    } catch (error) {
        res.status(500).send({error:error.message,sms:'Error getting single crawler data'})
    }
};
exports.uploadImageToServer = async (req, res) =>{
    try {
        let image = req.file?.filename 
        console.log(image)
        if(image){

            return  res.status(200).send({message : "Image uploaded...."})
        }else{
            return  res.status(200).send({message : "Provide image...."})
        }
    } catch (error) {
        res.status(500).send({error:error.message,sms:'Internal server error'})
    }
};
exports.instaPostAnalyticsBasedOnRating = async (req, res) =>{
    try {
        const trackCreatorParams = {
            cron_expression: req.body.cron_expression,
            // cron_expression: "*/15 * * * *",
            tracking_expiry_at: req.body.tracking_expiry_at,
            // tracking_expiry_at: "2023-12-01 12:12:12.12",
            tracking: true
        };

        /* Get Brands which rating is 4 to 5 */
        let brnadsData = await instaBrandModel.find({ 
            rating: { $gte: 4, $lte: 5 } 
        },'instaBrandId')

        if(brnadsData?.length === 0){
            return res.status(200).json({status:false, message:"There are no brands with 4 to 5 rating."})
        }

        /* Create condition with brand id */
        let conditionForBrandId = brnadsData?.map((item)=>{
            let obj = {
                brand_id : item.instaBrandId
            }
            return obj
        })
      /*Find post (shortcode) based on provide condition */
        let postDataRespecticBrand = await instaP.find({
            interpretor_decision: 1,
            crone_trak : 0,
            $or: conditionForBrandId
          },'shortCode')
       let resArr = []
        postDataRespecticBrand?.map(async(item, index)=>{
            // if(index < 2 ){
    
                try {
                  let result =  await axios.put(
                        `https://app.ylytic.com/ylytic/api/v1/rt_tracking/posts/${item.shortCode}`,
                        trackCreatorParams,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    resArr.push(result?.data)
                } catch (error) {
                    console.log(error.message)
                }
                  
            // }
                     /* update insta p model post mean that are tracked */
                    //  await instaP.findByIdAndUpdate(item._id,{ $set : {crone_trak : 1}})
            
        })
        res.status(200).json(resArr);
    } catch (error) {
        res.status(500).send({error:error.message,message:'Internal server error'})
    }
};
exports.manuallyApplyTrackingOnShortcode = async (req, res) =>{
    try {
        const trackCreatorParams = {
            cron_expression: req.body.cron_expression,
            // cron_expression: "*/15 * * * *",
            tracking_expiry_at: req.body.tracking_expiry_at,
            // tracking_expiry_at: "2023-12-01 12:12:12.12",
            tracking: true
        };
    let data = req.body.data

     data.map(async(item, index)=>{
            // if(index < 2 ){
    
                try {
                  let result =  await axios.put(
                        `https://app.ylytic.com/ylytic/api/v1/rt_tracking/posts/${item.shortCode}`,
                        trackCreatorParams,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    resArr.push(result?.data)
                } catch (error) {
                    console.log(error.message)
                }
        })
        res.status(200).json({message : "Request Send from our side to third party."});
    } catch (error) {
        res.status(500).send({error:error.message,message:'Internal server error'})
    }
};

// exports.insertDataIntoPostAnalytics = async (req,res)=>{
//     try {
       
//             const savingRes = new instaPostAnalyticsModel({
//                 handle: req.body.data?.handle ?? "",
//                 postType: req.body.data.post_type,
//                 creatorName: req.body.data.creator.username,
//                 allComments: req.body.data.comments_count.overall,
//                 brand_id: 0,
//                 todayComment: req.body.data.comments_count.today,
//                 pastComment: req.body.data.comments_count.vs_previous,
//                 allLike: req.body.data.likes_count.overall,
//                 campaign_id: 0,
//                 todayLikes: req.body.data.likes_count.today,
//                 pastLike: req.body.data.likes_count.vs_previous,
//                 allView: req.body.data.views_count.overall,
//                 todayViews: req.body.data.views_count.today,
//                 // agency_id: req.body.data.views_count.today,
//                 pastView: req.body.data.views_count.vs_previous,
//                 title: req.body.data.title,
//                 postedOn: req.body.data.posted_at,
//                 postUrl: req.body.data.post_url,
//                 postImage: req.body.data.display_url[0],
//                 shortCode: req.body.shortcode,
//                 posttype_decision: req.body.posttype_decision,
//                 selector_name: req.body.selector_name,
//                 interpretor_name: req.body.interpretor_name,
//                 auditor_name: req.body.auditor_name,
//                 auditor_decision: req.body.auditor_decision,
//                 interpretor_decision: req.body.interpretor_decision,
//                 selector_decision: req.body.selector_decision,
//                 music_info : req.body.data?.music_info,
//                 location : req.body.data?.location,
//                 sponsored : req.body.data?.sponsored,
//             });
//             const result =  await savingRes.save()
//              /* update insta p model post mean that are tracked */
//             //  await instaP.findByIdAndUpdate(item._id,{ $set : {crone_trak : 1}})
//             res.send({ result, status: 200 });
       
//     } catch (error) {
//         res.status(500).send({ error: error.message, sms: "error while adding data" });
//     }
// }
exports.insertDataIntoPostAnalytics = async (req,res)=>{
    try {
       let shortCodeFind = req.body.shortcode;
        
       let findDataFromPost = await instaP.find({ shortCode : shortCodeFind }).lean()
       const { _id, __v, todayComment,
        todayLikes,
        todayViews,
        selector_date,
        auditor_date,
        createdAt,
        postType,
        creatorName,
        allComments,
        pastComment,
        allLike,
        pastLike,
        allView,
        pastView,
        title,
        postedOn,
        postUrl,
        postImage,
        shortCode,
        posttype_decision,
        selector_name,
        interpretor_name,
        auditor_name,
        auditor_decision,
        interpretor_decision,
        selector_decision,
        dateCol,
        hashTag,
        mentions,
        interpretor_date,
        handle,
        updatedAt,
        campaign_id,
        location,
        music_info,
        sponsored,
        brand_id,
        crone_trak } = findDataFromPost[0];
 
       const savingRes = new instaPostAnalyticsModel({
        todayComment, 
        todayLikes,
        todayViews,
        selector_date, //
        auditor_date, //
        createdAt,
        postType, 
        creatorName, //
        allComments,
        pastComment,
        allLike,
        pastLike,
        allView,
        pastView,
        title, 
        postedOn,
        postUrl, //
        postImage, //
        shortCode, //
        posttype_decision, //
        selector_name, //
        interpretor_name, //
        auditor_name, //
        auditor_decision,  //
        interpretor_decision, //
        selector_decision, //
        dateCol, //
        hashTag, //
        mentions, //
        interpretor_date, //
        handle, //
        updatedAt, //  
        campaign_id, // ***
        location, 
        music_info, 
        sponsored, 
        brand_id, //  ***
        crone_trak  //
         });
        const result =  await savingRes.save()

        if(result){
          let updatedPost =  await instaP.findByIdAndUpdate(_id,{ $set : {
             createdAt : Date.now(),
             todayComment: req.body.data.comments_count.today,
             todayLikes: req.body.data.likes_count.today,
             todayViews: req.body.data.views_count.today,
             postType: req.body.data.post_type,
             allComments: req.body.data.comments_count.overall,
             pastComment: req.body.data.comments_count.vs_previous,
             allLike: req.body.data.likes_count.overall,
             pastLike: req.body.data.likes_count.vs_previous,
             allView: req.body.data.views_count.overall,
             todayViews: req.body.data.views_count.today,
             pastView: req.body.data.views_count.vs_previous,
             title: req.body.data.title,
             postedOn: req.body.data.posted_at,
             location : req.body.data?.location,
             music_info : req.body.data?.music_info,
             sponsored : req.body.data?.sponsored,
             crone_trak : parseInt(crone_trak) + 1

          }})
            if(!updatedPost){
              return  res.send({ message: "Analytics data inserted sucessfully but insta post model not update properly.", status: 200 });
            }
        }
             /* update insta p model post mean that are tracked */
            //  await instaP.findByIdAndUpdate(item._id,{ $set : {crone_trak : 1}})
       return res.send({ message:"Succefully perform operation.", status: 200 });
       
    } catch (error) {
        res.status(500).send({ error: error.message, sms: "error while adding data" });
    }
}


/**
 * Retrieves counts based on tracked posts and brands from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns None
 * @throws {Error} If there is an error retrieving the data from the database.
 */
exports.getCountBasedOnTrackedPost = async (req,res) => {
        try {
            let obj = {}
        /**
         * Retrieves brand data from the instaBrandModel collection based on the given filter and projection.
         * @param {Object} filterForBrand - The filter object to apply to the query.
         * @param {Object} projectionForBrand - The projection object to apply to the query.
         */
         const filterForBrand = {
            rating: { $gte: 4, $lte: 5 } 
          };
          
          const projectionForBrand = {
            instaBrandId: 1,
          };

          const brnadsData = await instaBrandModel.find(filterForBrand, projectionForBrand);
          const brnadsDataCount = await instaBrandModel.countDocuments(filterForBrand);
           

        /**
         * Checks if the `brnadsData` array is empty. If it is empty, it returns a JSON response
         * with a status of `false` and a message indicating that there are no brands with a rating
         * of 4 to 5. If the array is not empty, it creates a new array `conditionForBrandId` by
         * mapping over the `brnadsData` array and extracting the `instaBrandId` property from each
         * item to create a new object with a `brand_id` property.
         * @param {Array} brnadsData - The array of brand data.
         */
        if(brnadsData?.length === 0){
            return res.status(200).json({status:false, message:"There are no brands with 4 to 5 rating."})
        }
        let conditionForBrandId = brnadsData?.map((item)=>{
            let obj = {
                brand_id : item.instaBrandId
            }
            return obj
        })
      
        /**
         * Retrieves data from the "instaP" collection based on the given filter and projection.
         * @param {object} filterForPost - The filter object to apply to the query.
         * @param {object} projectionForPost - The projection object to apply to the query.
         */
        const filterForPost = {
            interpretor_decision: 1,
            crone_trak: 0,
            $or: conditionForBrandId,
          };
          
          const projectionForPost = {
            shortCode: 1,
          };
          const postDataRespecticBrand = await instaP.find(filterForPost, projectionForPost);
          const documentCount = await instaP.countDocuments(filterForPost);



          /**
           * Finds unique shortcodes from the instaPostAnalyticsModel and filters the postDataRespecticBrand array
           * into two separate arrays based on whether the shortcode is included in the uniqueShortcodeValues array or not.
           * @returns {Promise<{resultArray1: Array<any>, resultArray2: Array<any>}>} - An object containing two arrays:
           * resultArray1 - the filtered array of postDataRespecticBrand where the shortcode is not included in uniqueShortcodeValues,
           * resultArray2 - the filtered array of postDataRespecticBrand where the shortcode is included in uniqueShortcodeValues.
           */
          const uniqueShortcodes = await instaPostAnalyticsModel.find({},'shortCode');
          // Finding not tracked shortcode 
          // Extract an array of unique shortcodes from uniqueShortcodes array
            const uniqueShortcodeValues = [...new Set(uniqueShortcodes.map(obj => obj.shortCode))];
            const resultArray1 = postDataRespecticBrand.filter(postData => {
                  return !uniqueShortcodeValues.includes(postData.shortCode);
             });
            const resultArray2 = postDataRespecticBrand.filter(postData => {
                  return uniqueShortcodeValues.includes(postData.shortCode);
             });
             /**
              * Assigns various properties to the given object based on the provided data.
              * @param {object} obj - The object to assign properties to.
              * @param {number} brnadsDataCount - The count of brand data.
              * @param {number} documentCount - The count of Instagram posts based on brands.
              * @param {string} postDataRespecticBrand - The Instagram post shortcode.
              * @param {number} resultArray2 - The count of short code matches in analytics.
              * @param {array} resultArray2 - The short code matches in analytics.
              * @param {number} resultArray1 - The count of short code not matches in analytics.
              * @param {array} resultArray1 - The  short code not matches in analytics.
              * @param {number} resultArray1 - The unique shortcode values count from analytics.
              * @param {number} uniqueShortcodeValues - The unique shortcode values count from analytics.
              * @param {array} uniqueShortcodeValues - The unique shortcode values  from analytics.
              */
             obj.brnads_data_count_rating = brnadsDataCount
             obj.insta_post_counts_based_on_brands = documentCount
             obj.insta_post_shortcode = postDataRespecticBrand
             obj.short_code_match_in_analytics_counts = resultArray2 && resultArray2.length
             obj.short_code_match_in_analytics = resultArray2
             obj.short_code_not_match_in_analytics_model_count = resultArray1  && resultArray1.length
             obj.short_code_not_match_in_analytics = resultArray1
             obj.unique_shortcode_values_from_analytics_model_counts = uniqueShortcodeValues && uniqueShortcodeValues.length
             obj.unique_shortcode_values_from_analytics = uniqueShortcodeValues
            //  obj.unique_shortcodes_from_analytics = uniqueShortcodes
           
             return res.status(200).json({obj})
        } catch (error) {
            res.status(500).send({error:error.message,message:'Internal server error'}) 
        }
}


/**
 * Retrieves analytics data for a post based on the provided match condition and model.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns None
 */
exports.getResBasedOnMatchForProvidedModel = async (req, res) => {
    try {
        const {  matchCondition, flag,model } = req.body;
        const page = req.query?.page;
        const perPage = req.query?.perPage;
        const skip = (page - 1) * perPage;
        if (![1, 2, 3].includes(model)) {
            return res.status(200).json({ message: "Invalid model value, you should provide 1, 2 or 3, 1 for insta p (post model) and 2 for post analytics (insta post analytics) and 3 for insta story ." });
        }
        
        const modelCollection = model === 1 ? instaP : model === 2 ? instaPostAnalyticsModel : instaS;

        if (flag === 1) {
            const count = await modelCollection.countDocuments(matchCondition);
            return res.status(200).json({ count });
        } else if (flag === 2) {
            let getPosts;

            if (page && perPage) {
                getPosts = await modelCollection.find(matchCondition).skip(skip).limit(perPage);
            } else {
                getPosts = await modelCollection.find(matchCondition);
            }

            return res.status(200).json(getPosts);
        }else {
            return res.status(200).json({status:false, message:"Provide valid flag 1 for count and 2 for all data."})
        }

    } catch (error) {
        res.status(500).json({ status: 500, error: error.message, sms: `Internal server error : ${error.message}` });
    }
};


exports.trackCreatorGet = async (req, res) => {
    try {

        const response = await axios.get(
            `https://app.ylytic.com/ylytic/api/v1/rt_tracking/creators/${req.params.pagename}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, sms: "These creators cron expression cant be edited" });
    }
};
