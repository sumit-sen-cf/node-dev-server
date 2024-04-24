const exeHistoryModel = require("../../models/PMS/exeHistoryModel");
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js')
const { message } = require("../../common/message");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "media", maxCount: 1 },
    { name: "reach_upload_image", maxCount: 1 },
    { name: "impression_upload_image", maxCount: 1 },
    { name: "engagement_upload_image", maxCount: 1 },
    { name: "story_view_upload_image", maxCount: 1 },
    { name: "story_view_upload_video", maxCount: 1 },
    { name: "city_image_upload", maxCount: 1 },
    { name: "Age_upload", maxCount: 1 },
    { name: "country_image_upload", maxCount: 1 },
]);

exports.addExeHistory = [upload, async (req, res) => {
    try {
        const addExeHistory = new exeHistoryModel({
            pageMast_id: req.body.pageMast_id,
            user_id: req.body.user_id,
            reach: req.body.reach,
            impression: req.body.impression,
            engagement: req.body.engagement,
            story_view: req.body.story_view,
            stats_for: req.body.stats_for,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            city1_name: req.body.city1_name,
            city2_name: req.body.city2_name,
            city3_name: req.body.city3_name,
            city4_name: req.body.city4_name,
            city5_name: req.body.city5_name,
            percentage_city1_name: req.body.percentage_city1_name,
            percentage_city2_name: req.body.percentage_city1_name,
            percentage_city3_name: req.body.percentage_city3_name,
            percentage_city4_name: req.body.percentage_city4_name,
            percentage_city5_name: req.body.percentage_city5_name,
            male_percent: req.body.male_percent,
            female_percent: req.body.female_percent,
            Age_13_17_percent: req.body.Age_13_17_percent,
            Age_18_24_percent: req.body.Age_18_24_percent,
            Age_25_34_percent: req.body.Age_25_34_percent,
            Age_35_44_percent: req.body.Age_35_44_percent,
            Age_45_54_percent: req.body.Age_45_54_percent,
            Age_55_64_percent: req.body.Age_55_64_percent,
            Age_65_plus_percent: req.body.Age_65_plus_percent,
            quater: req.body.quater,
            profile_visit: req.body.profile_visit,
            country1_name: req.body.country1_name,
            country2_name: req.body.country2_name,
            country3_name: req.body.country3_name,
            country4_name: req.body.country4_name,
            country5_name: req.body.country5_name,
            percentage_country1_name: req.body.percentage_country1_name,
            percentage_country2_name: req.body.percentage_country1_name,
            percentage_country3_name: req.body.percentage_country3_name,
            percentage_country4_name: req.body.percentage_country4_name,
            percentage_country5_name: req.body.percentage_country5_name,
            stats_update_flag: true,
            story_view_date: req.body.story_view_date
        });
        const bucketName = vari.BUCKET_NAME;
        const bucket = storage.bucket(bucketName);

        if (req.files.media && req.files.media[0].originalname) {
            const blob1 = bucket.file(req.files.media[0].originalname);
            addExeHistory.media = blob1.name;
            const blobStream1 = blob1.createWriteStream();
            blobStream1.on("finish", () => {
            });
            blobStream1.end(req.files.media[0].buffer);
        }
        if (req.files.reach_upload_image && req.files.reach_upload_image[0].originalname) {
            const blob2 = bucket.file(req.files.reach_upload_image[0].originalname);
            addExeHistory.reach_upload_image = blob2.name;
            const blobStream2 = blob2.createWriteStream();
            blobStream2.on("finish", () => {
            });
            blobStream2.end(req.files.reach_upload_image[0].buffer);
        }

        if (req.files.impression_upload_image && req.files.impression_upload_image[0].originalname) {
            const blob2 = bucket.file(req.files.impression_upload_image[0].originalname);
            addExeHistory.impression_upload_image = blob2.name;
            const blobStream2 = blob2.createWriteStream();
            blobStream2.on("finish", () => {
            });
            blobStream2.end(req.files.impression_upload_image[0].buffer);
        }
        if (req.files.engagement_upload_image && req.files.engagement_upload_image[0].originalname) {
            const blob2 = bucket.file(req.files.engagement_upload_image[0].originalname);
            addExeHistory.engagement_upload_image = blob2.name;
            const blobStream2 = blob2.createWriteStream();
            blobStream2.on("finish", () => {
            });
            blobStream2.end(req.files.engagement_upload_image[0].buffer);
        }
        if (req.files.story_view_upload_image && req.files.story_view_upload_image[0].originalname) {
            const blob2 = bucket.file(req.files.story_view_upload_image[0].originalname);
            addExeHistory.story_view_upload_image = blob2.name;
            const blobStream2 = blob2.createWriteStream();
            blobStream2.on("finish", () => {
            });
            blobStream2.end(req.files.story_view_upload_image[0].buffer);
        }
        if (req.files.story_view_upload_video && req.files.story_view_upload_video[0].originalname) {
            const blob2 = bucket.file(req.files.story_view_upload_video[0].originalname);
            addExeHistory.story_view_upload_video = blob2.name;
            const blobStream2 = blob2.createWriteStream();
            blobStream2.on("finish", () => {
            });
            blobStream2.end(req.files.story_view_upload_video[0].buffer);
        }
        if (req.files.city_image_upload && req.files.city_image_upload[0].originalname) {
            const blob2 = bucket.file(req.files.city_image_upload[0].originalname);
            addExeHistory.city_image_upload = blob2.name;
            const blobStream2 = blob2.createWriteStream();
            blobStream2.on("finish", () => {
            });
            blobStream2.end(req.files.city_image_upload[0].buffer);
        }
        if (req.files.Age_upload && req.files.Age_upload[0].originalname) {
            const blob2 = bucket.file(req.files.Age_upload[0].originalname);
            addExeHistory.Age_upload = blob2.name;
            const blobStream2 = blob2.createWriteStream();
            blobStream2.on("finish", () => {
            });
            blobStream2.end(req.files.Age_upload[0].buffer);
        }
        if (req.files.country_image_upload && req.files.country_image_upload[0].originalname) {
            const blob2 = bucket.file(req.files.country_image_upload[0].originalname);
            addExeHistory.country_image_upload = blob2.name;
            const blobStream2 = blob2.createWriteStream();
            blobStream2.on("finish", () => {
            });
            blobStream2.end(req.files.country_image_upload[0].buffer);
        }
        await addExeHistory.save();
        return res.status(200).json({
            status: 200,
            message: "Add executive history data added successfully!",
            data: addExeHistory,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}];


exports.updateExeHistory = [
    upload,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { pageMast_id, user_id, reach, impression, engagement, story_view, stats_for, start_date, end_date, city1_name,
                city2_name, city3_name, city4_name, city5_name, percentage_city1_name, percentage_city2_name, percentage_city3_name,
                percentage_city4_name, percentage_city5_name, male_percent, female_percent, Age_13_17_percent, Age_18_24_percent,
                Age_25_34_percent, Age_35_44_percent, Age_45_54_percent, Age_55_64_percent, Age_65_plus_percent, quater, profile_visit,
                country1_name, country2_name, country3_name, country4_name, country5_name, percentage_country1_name, percentage_country2_name,
                percentage_country3_name, percentage_country4_name, percentage_country5_name, stats_update_flag, story_view_date } = req.body;
            const updateExeHistoryData = await exeHistoryModel.findOne({ _id: id });
            if (!updateExeHistoryData) {
                return res.send("Invalid exe-history Id...");
            }
            if (req.files) {
                updateExeHistoryData.media = req.files["media"] ? req.files["media"][0].filename : updateExeHistoryData.media;
                updateExeHistoryData.reach_upload_image = req.files["reach_upload_image"] ? req.files["reach_upload_image"][0].filename : updateExeHistoryData.reach_upload_image;
                updateExeHistoryData.impression_upload_image = req.files["impression_upload_image"] ? req.files["impression_upload_image"][0].filename : updateExeHistoryData.impression_upload_image;
                updateExeHistoryData.engagement_upload_image = req.files["engagement_upload_image"] ? req.files["engagement_upload_image"][0].filename : updateExeHistoryData.engagement_upload_image;
                updateExeHistoryData.story_view_upload_image = req.files["story_view_upload_image"] ? req.files["story_view_upload_image"][0].filename : updateExeHistoryData.story_view_upload_image;
                updateExeHistoryData.story_view_upload_video = req.files["story_view_upload_video"] ? req.files["story_view_upload_video"][0].filename : updateExeHistoryData.story_view_upload_video;
                updateExeHistoryData.city_image_upload = req.files["city_image_upload"] ? req.files["city_image_upload"][0].filename : updateExeHistoryData.city_image_upload;
                updateExeHistoryData.Age_upload = req.files["Age_upload"] ? req.files["Age_upload"][0].filename : updateExeHistoryData.Age_upload;
                updateExeHistoryData.country_image_upload = req.files["country_image_upload"] ? req.files["country_image_upload"][0].filename : updateExeHistoryData.country_image_upload;
            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files.media && req.files.media[0].originalname) {
                const blob1 = bucket.file(req.files.media[0].originalname);
                updateExeHistoryData.media = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.media[0].buffer);
            }
            if (req.files.reach_upload_image && req.files.reach_upload_image[0].originalname) {
                const blob2 = bucket.file(req.files.reach_upload_image[0].originalname);
                updateExeHistoryData.reach_upload_image = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.reach_upload_image[0].buffer);
            }

            if (req.files.impression_upload_image && req.files.impression_upload_image[0].originalname) {
                const blob2 = bucket.file(req.files.impression_upload_image[0].originalname);
                updateExeHistoryData.impression_upload_image = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.impression_upload_image[0].buffer);
            }
            if (req.files.engagement_upload_image && req.files.engagement_upload_image[0].originalname) {
                const blob2 = bucket.file(req.files.engagement_upload_image[0].originalname);
                updateExeHistoryData.engagement_upload_image = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.engagement_upload_image[0].buffer);
            }
            if (req.files.story_view_upload_image && req.files.story_view_upload_image[0].originalname) {
                const blob2 = bucket.file(req.files.story_view_upload_image[0].originalname);
                updateExeHistoryData.story_view_upload_image = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.story_view_upload_image[0].buffer);
            }
            if (req.files.story_view_upload_video && req.files.story_view_upload_video[0].originalname) {
                const blob2 = bucket.file(req.files.story_view_upload_video[0].originalname);
                updateExeHistoryData.story_view_upload_video = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.story_view_upload_video[0].buffer);
            }
            if (req.files.city_image_upload && req.files.city_image_upload[0].originalname) {
                const blob2 = bucket.file(req.files.city_image_upload[0].originalname);
                updateExeHistoryData.city_image_upload = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.city_image_upload[0].buffer);
            }
            if (req.files.Age_upload && req.files.Age_upload[0].originalname) {
                const blob2 = bucket.file(req.files.Age_upload[0].originalname);
                updateExeHistoryData.Age_upload = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.Age_upload[0].buffer);
            }
            if (req.files.country_image_upload && req.files.country_image_upload[0].originalname) {
                const blob2 = bucket.file(req.files.country_image_upload[0].originalname);
                updateExeHistoryData.country_image_upload = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.country_image_upload[0].buffer);
            }

            await updateExeHistoryData.save();
            const exeHistoryDataUpdated = await exeHistoryModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    pageMast_id,
                    user_id,
                    reach,
                    impression,
                    engagement,
                    story_view,
                    stats_for,
                    start_date,
                    end_date,
                    city1_name,
                    city2_name,
                    city3_name,
                    city4_name,
                    city5_name,
                    percentage_city1_name,
                    percentage_city2_name,
                    percentage_city3_name,
                    percentage_city4_name,
                    percentage_city5_name,
                    male_percent,
                    female_percent,
                    Age_13_17_percent,
                    Age_18_24_percent,
                    Age_25_34_percent,
                    Age_35_44_percent,
                    Age_45_54_percent,
                    Age_55_64_percent,
                    Age_65_plus_percent,
                    quater,
                    profile_visit,
                    country1_name,
                    country2_name,
                    country3_name,
                    country4_name,
                    country5_name,
                    percentage_country1_name,
                    percentage_country2_name,
                    percentage_country3_name,
                    percentage_country4_name,
                    percentage_country5_name,
                    stats_update_flag: true,
                    story_view_date
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "Executive history data updated successfully!",
                data: exeHistoryDataUpdated,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];


exports.getExeHistoryList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const executiveHistoryData = await exeHistoryModel.aggregate([
            {
                $lookup: {
                    from: "pmspagemasts",
                    localField: "pagemast_id",
                    foreignField: "pagemast_id",
                    as: "pmspagemast",
                },
            }, {
                $unwind: {
                    path: "$pmspagemast",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $project: {
                    pageMast_id: 1,
                    user_id: 1,
                    reach: 1,
                    impression: 1,
                    engagement: 1,
                    story_view: 1,
                    stats_for: 1,
                    start_date: 1,
                    end_date: 1,
                    city1_name: 1,
                    city2_name: 1,
                    city3_name: 1,
                    city4_name: 1,
                    city5_name: 1,
                    percentage_city1_name: 1,
                    percentage_city2_name: 1,
                    percentage_city3_name: 1,
                    percentage_city4_name: 1,
                    percentage_city5_name: 1,
                    male_percent: 1,
                    female_percent: 1,
                    Age_13_17_percent: 1,
                    Age_18_24_percent: 1,
                    Age_25_34_percent: 1,
                    Age_35_44_percent: 1,
                    Age_45_54_percent: 1,
                    Age_55_64_percent: 1,
                    Age_65_plus_percent: 1,
                    quater: 1,
                    profile_visit: 1,
                    country1_name: 1,
                    country2_name: 1,
                    country3_name: 1,
                    country4_name: 1,
                    country5_name: 1,
                    percentage_country1_name: 1,
                    percentage_country2_name: 1,
                    percentage_country3_name: 1,
                    percentage_country4_name: 1,
                    percentage_country5_name: 1,
                    stats_update_flag: 1,
                    story_view_date: 1,
                    media: {
                        $concat: [imageUrl, "$media"],
                    },
                    reach_upload_image: {
                        $concat: [imageUrl, "$reach_upload_image"],
                    },
                    impression_upload_image: {
                        $concat: [imageUrl, "$impression_upload_image"],
                    },
                    engagement_upload_image: {
                        $concat: [imageUrl, "$engagement_upload_image"],
                    },
                    story_view_upload_image: {
                        $concat: [imageUrl, "$story_view_upload_image"],
                    },
                    story_view_upload_video: {
                        $concat: [imageUrl, "$story_view_upload_video"],
                    },
                    city_image_upload: {
                        $concat: [imageUrl, "$city_image_upload"],
                    },
                    Age_upload: {
                        $concat: [imageUrl, "$Age_upload"],
                    },
                    country_image_upload: {
                        $concat: [imageUrl, "$country_image_upload"],
                    },
                    PMS_PageMast_data: {
                        pmspageMast_id: "$pmspagemast._id",
                        page_user_name: "$pmspagemast.page_user_name",
                        link: "$pmspagemast.link",
                        platform_id: "$pmspagemast.platform_id",
                        page_catg_id: "$pmspagemast.page_catg_id",
                        tag_category: "$pmspagemast.tag_category",
                        page_level: "$pmspagemast.page_level",
                        page_status: "$pmspagemast.page_status",
                        page_closed_by_user_id: "$user.user_id",
                        page_name_type: "$pmspagemast.page_name_type",
                        content_creation: "$pmspagemast.content_creation",
                        ownership_type: "$pmspagemast.ownership_type",
                        vendorMast_id: "$pmspagemast.vendorMast_id",
                        followers_count: "$pmspagemast.followers_count",
                        profile_type_id: "$pmspagemast.profile_type_id",
                        platform_active_on: "$pmspagemast.platform_active_on",
                        engagment_rate: "$pmspagemast.engagment_rate",
                        description: "$pmspagemast.description",
                        created_by: "$pmspagemast.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_by: "$pmspagemast.last_updated_by",
                    },
                }
            }, {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            }, {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        if (!executiveHistoryData) {
            return res.status(500).send({
                succes: true,
                message: "Executive history data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "Executive history data list successfully!",
            data: executiveHistoryData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

exports.getExeHistoryDetails = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const pmspageMast_id = req.params.pageMast_id; // Assuming this is the parameter name

        const executiveHistoryData = await exeHistoryModel.aggregate([
            // { $match: { pageMast_id: parseInt(req.params.pageMast_id) } },
            {
                $lookup: {
                    from: "pmspagemasts",
                    localField: "pagemast_id",
                    foreignField: "pagemast_id",
                    as: "pmspagemast",
                },
            }, {
                $unwind: {
                    path: "$pmspagemast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: { "pmspagemast.pageMast_id": parseInt(req.params.pageMast_id) },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            }, {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $project: {
                    pageMast_id: 1,
                    user_id: 1,
                    reach: 1,
                    impression: 1,
                    engagement: 1,
                    story_view: 1,
                    stats_for: 1,
                    start_date: 1,
                    end_date: 1,
                    city1_name: 1,
                    city2_name: 1,
                    city3_name: 1,
                    city4_name: 1,
                    city5_name: 1,
                    percentage_city1_name: 1,
                    percentage_city2_name: 1,
                    percentage_city3_name: 1,
                    percentage_city4_name: 1,
                    percentage_city5_name: 1,
                    male_percent: 1,
                    female_percent: 1,
                    Age_13_17_percent: 1,
                    Age_18_24_percent: 1,
                    Age_25_34_percent: 1,
                    Age_35_44_percent: 1,
                    Age_45_54_percent: 1,
                    Age_55_64_percent: 1,
                    Age_65_plus_percent: 1,
                    quater: 1,
                    profile_visit: 1,
                    country1_name: 1,
                    country2_name: 1,
                    country3_name: 1,
                    country4_name: 1,
                    country5_name: 1,
                    percentage_country1_name: 1,
                    percentage_country2_name: 1,
                    percentage_country3_name: 1,
                    percentage_country4_name: 1,
                    percentage_country5_name: 1,
                    stats_update_flag: 1,
                    creation_date: 1,
                    story_view_date: 1,
                    createdAt: 1,
                    media: {
                        $concat: [imageUrl, "$media"],
                    },
                    reach_upload_image: {
                        $concat: [imageUrl, "$reach_upload_image"],
                    },
                    impression_upload_image: {
                        $concat: [imageUrl, "$impression_upload_image"],
                    },
                    engagement_upload_image: {
                        $concat: [imageUrl, "$engagement_upload_image"],
                    },
                    story_view_upload_image: {
                        $concat: [imageUrl, "$story_view_upload_image"],
                    },
                    story_view_upload_video: {
                        $concat: [imageUrl, "$story_view_upload_video"],
                    },
                    city_image_upload: {
                        $concat: [imageUrl, "$city_image_upload"],
                    },
                    Age_upload: {
                        $concat: [imageUrl, "$Age_upload"],
                    },
                    country_image_upload: {
                        $concat: [imageUrl, "$country_image_upload"],
                    },
                    PMS_PageMast_data: {
                        pmspageMast_id: "$pmspagemast._id",
                        pageMast_id: "$pmspagemast.pageMast_id",
                        page_user_name: "$pmspagemast.page_user_name",
                        link: "$pmspagemast.link",
                        platform_id: "$pmspagemast.platform_id",
                        page_catg_id: "$pmspagemast.page_catg_id",
                        tag_category: "$pmspagemast.tag_category",
                        page_level: "$pmspagemast.page_level",
                        page_status: "$pmspagemast.page_status",
                        page_closed_by_user_id: "$user.user_id",
                        page_name_type: "$pmspagemast.page_name_type",
                        content_creation: "$pmspagemast.content_creation",
                        ownership_type: "$pmspagemast.ownership_type",
                        vendorMast_id: "$pmspagemast.vendorMast_id",
                        followers_count: "$pmspagemast.followers_count",
                        profile_type_id: "$pmspagemast.profile_type_id",
                        platform_active_on: "$pmspagemast.platform_active_on",
                        engagment_rate: "$pmspagemast.engagment_rate",
                        description: "$pmspagemast.description",
                        created_by: "$pmspagemast.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_by: "$pmspagemast.last_updated_by",
                        created_date_time: "$pmspagemast.last_updated_by"
                    },
                }
            },
            {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            }, {
                $replaceRoot: { newRoot: "$data" }
            },
            {
                $sort: { "createdAt": -1 }, // Replace "your_timestamp_field" with the actual field
            },
        ])
        if (!executiveHistoryData) {
            return res.status(500).send({
                succes: true,
                message: "Executive history data details not found!",
            });
        }
        // const totalLen = executiveHistoryData?.length - 1;
        // console.log("executiveHistoryData[totalLen]");
        //  console.log(executiveHistoryData[totalLen]);
        return res.status(200).send({
            succes: true,
            message: "Executive history data details successfully!",
            // data: executiveHistoryData[totalLen]
            data: executiveHistoryData

        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


exports.getAllExeData = async (req, res) => {
    try {
        const allEntries = await exeHistoryModel.find().exec();
        const result = [];

        const latestEntriesPromises = allEntries.map(async (entry) => {
            const latestEntry = await exeHistoryModel.findOne({ pageMast_id: entry.pageMast_id }).exec();
            return latestEntry;
        });

        const latestEntries = await Promise.all(latestEntriesPromises);

        for (let i = 0; i < allEntries.length; i++) {
            const entry = allEntries[i];
            const latestEntry = latestEntries[i];

            const totalPercentage = latestEntry
                ? Object.values(latestEntry.toJSON())
                    .filter((value) => value !== null && value !== '' && value !== 0)
                    .length / Object.keys(latestEntry.toJSON()).length * 100
                : 0;

            result.push({
                pageMast_id: entry.pageMast_id,
                user_id: entry.user_id,
                reach: entry.reach,
                impression: entry.impression,
                engagement: entry.engagement,
                story_view: entry.story_view,
                stats_for: entry.stats_for,
                start_date: entry.start_date,
                end_date: entry.end_date,
                city1_name: entry.city1_name,
                city2_name: entry.city2_name,
                city3_name: entry.city3_name,
                city4_name: entry.city4_name,
                city5_name: entry.city5_name,
                percentage_city1_name: entry.percentage_city1_name,
                percentage_city2_name: entry.percentage_city2_name,
                percentage_city3_name: entry.percentage_city3_name,
                percentage_city4_name: entry.percentage_city4_name,
                percentage_city5_name: entry.percentage_city5_name,
                male_percent: entry.male_percent,
                female_percent: entry.female_percent,
                Age_13_17_percent: entry.Age_13_17_percent,
                Age_18_24_percent: entry.Age_18_24_percent,
                Age_25_34_percent: entry.Age_25_34_percent,
                Age_35_44_percent: entry.Age_35_44_percent,
                Age_45_54_percent: entry.Age_45_54_percent,
                Age_55_64_percent: entry.Age_55_64_percent,
                Age_65_plus_percent: entry.Age_65_plus_percent,
                quater: entry.quater,
                profile_visit: entry.profile_visit,
                country1_name: entry.country1_name,
                country2_name: entry.country2_name,
                country3_name: entry.country3_name,
                country4_name: entry.country4_name,
                country5_name: entry.country5_name,
                percentage_country1_name: entry.percentage_country1_name,
                percentage_country2_name: entry.percentage_country2_name,
                percentage_country3_name: entry.percentage_country3_name,
                percentage_country4_name: entry.percentage_country4_name,
                percentage_country5_name: entry.percentage_country5_name,
                stats_update_flag: entry.stats_update_flag,
                story_view_date: entry.story_view_date,
                latestEntry,
                totalPercentage,
            });
        }

        res.status(200).send({ result });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Internal Server Error' });
    }
}











// exports.getExeHistoryDetails = async (req, res) => {
//     try {
//         const imageUrl = vari.IMAGE_URL;
//         const pmspageMast_id = req.params.pageMast_id;

//         const exeHistoryData = await exeHistoryModel.aggregate([
//             {
//                 $lookup: {
//                     from: "pmspagemasts",
//                     localField: "pagemast_id",
//                     foreignField: "pagemast_id",
//                     as: "pmspagemast",
//                 },
//             },
//             {
//                 $unwind: {
//                     path: "$pmspagemast",
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//             {
//                 $match: { "pmspagemast.pageMast_id": parseInt(req.params.pageMast_id) },
//             },
//             {
//                 $lookup: {
//                     from: "usermodels",
//                     localField: "created_by",
//                     foreignField: "user_id",
//                     as: "user",
//                 },
//             },
//             {
//                 $unwind: {
//                     path: "$user",
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "exepurchasemodels",
//                     localField: "link",
//                     foreignField: "page_link",
//                     as: "exepurchasemodelData",
//                 },
//             },
//             {
//                 $unwind: {
//                     path: "$exepurchasemodelData",
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "execounthismodels",
//                     localField: "exepurchasemodelData.p_id",
//                     foreignField: "p_id",
//                     as: "execounthismodelsData",
//                 },
//             },
//             {
//                 $unwind: {
//                     path: "$execounthismodelsData",
//                     preserveNullAndEmptyArrays: true,
//                 },
//             },
//             {
//                 $project: {
//                     pageMast_id: 1,
//                     user_id: 1,
//                     reach: 1,
//                     impression: 1,
//                     engagement: 1,
//                     story_view: 1,
//                     stats_for: 1,
//                     start_date: 1,
//                     end_date: 1,
//                     city1_name: 1,
//                     city2_name: 1,
//                     city3_name: 1,
//                     city4_name: 1,
//                     city5_name: 1,
//                     percentage_city1_name: 1,
//                     percentage_city2_name: 1,
//                     percentage_city3_name: 1,
//                     percentage_city4_name: 1,
//                     percentage_city5_name: 1,
//                     male_percent: 1,
//                     female_percent: 1,
//                     Age_13_17_percent: 1,
//                     Age_18_24_percent: 1,
//                     Age_25_34_percent: 1,
//                     Age_35_44_percent: 1,
//                     Age_45_54_percent: 1,
//                     Age_55_64_percent: 1,
//                     Age_65_plus_percent: 1,
//                     quater: 1,
//                     profile_visit: 1,
//                     country1_name: 1,
//                     country2_name: 1,
//                     country3_name: 1,
//                     country4_name: 1,
//                     country5_name: 1,
//                     percentage_country1_name: 1,
//                     percentage_country2_name: 1,
//                     percentage_country3_name: 1,
//                     percentage_country4_name: 1,
//                     percentage_country5_name: 1,
//                     stats_update_flag: 1,
//                     story_view_date: 1,
//                     media: { $concat: [imageUrl, "$media"] },
//                     reach_upload_image: { $concat: [imageUrl, "$reach_upload_image"] },
//                     impression_upload_image: { $concat: [imageUrl, "$impression_upload_image"] },
//                     engagement_upload_image: { $concat: [imageUrl, "$engagement_upload_image"] },
//                     story_view_upload_image: { $concat: [imageUrl, "$story_view_upload_image"] },
//                     story_view_upload_video: { $concat: [imageUrl, "$story_view_upload_video"] },
//                     city_image_upload: { $concat: [imageUrl, "$city_image_upload"] },
//                     Age_upload: { $concat: [imageUrl, "$Age_upload"] },
//                     country_image_upload: { $concat: [imageUrl, "$country_image_upload"] },
//                     PMS_PageMast_data: {
//                         pmspageMast_id: "$pmspagemast._id",
//                         pageMast_id: "$pmspagemast.pageMast_id",
//                         page_user_name: "$pmspagemast.page_user_name",
//                         link: "$pmspagemast.link",
//                         platform_id: "$pmspagemast.platform_id",
//                         page_catg_id: "$pmspagemast.page_catg_id",
//                         tag_category: "$pmspagemast.tag_category",
//                         page_level: "$pmspagemast.page_level",
//                         page_status: "$pmspagemast.page_status",
//                         page_closed_by_user_id: "$user.user_id",
//                         page_name_type: "$pmspagemast.page_name_type",
//                         content_creation: "$pmspagemast.content_creation",
//                         ownership_type: "$pmspagemast.ownership_type",
//                         vendorMast_id: "$pmspagemast.vendorMast_id",
//                         followers_count: "$pmspagemast.followers_count",
//                         profile_type_id: "$pmspagemast.profile_type_id",
//                         platform_active_on: "$pmspagemast.platform_active_on",
//                         engagment_rate: "$pmspagemast.engagment_rate",
//                         description: "$pmspagemast.description",
//                         created_by: "$pmspagemast.created_by",
//                         created_by_name: "$user.user_name",
//                         last_updated_by: "$pmspagemast.last_updated_by",
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$_id",
//                     data: { $first: "$$ROOT" }
//                 }
//             },
//             {
//                 $replaceRoot: { newRoot: "$data" }
//             }
//         ]);

//         if (exeHistoryData.length > 0) {
//             const responseData = [];
//             for (const entry of exeHistoryData) {
//                 let count = 0;
//                 const relevantFields = [
//                     'reach', 'impression', 'engagement', 'story_view', 'stats_for',
//                     'start_date', 'end_date', 'reach_upload_image', 'impression_upload_image',
//                     'engagement_upload_image', 'story_view_upload_image', 'story_view_upload_video',
//                     'city1_name', 'city2_name', 'city3_name', 'city4_name', 'city5_name',
//                     'percentage_city1_name', 'percentage_city2_name', 'percentage_city3_name',
//                     'percentage_city4_name', 'percentage_city5_name', 'city_image_upload',
//                     'male_percent', 'female_percent', 'Age_13_17_percent', 'Age_upload',
//                     'Age_18_24_percent', 'Age_25_34_percent', 'Age_35_44_percent',
//                     'Age_45_54_percent', 'Age_55_64_percent', 'Age_65_plus_percent',
//                     'quater', 'profile_visit', 'country1_name', 'country2_name', 'country3_name',
//                     'country4_name', 'country5_name', 'percentage_country1_name',
//                     'percentage_country2_name', 'percentage_country3_name', 'percentage_country4_name',
//                     'percentage_country5_name', 'country_image_upload'
//                 ];

//                 for (const field of relevantFields) {
//                     if (entry[field] !== null && entry[field] !== '' && entry[field] !== 0) {
//                         count++;
//                     }
//                 }

//                 const totalPercentage = (count / relevantFields.length) * 100;
//                 responseData.push({
//                     ...entry,
//                     totalPercentage: totalPercentage.toFixed(2),
//                 });
//             }
//             return res.status(200).json({
//                 status: 200,
//                 message: "PMS page type details successfully!",
//                 data: responseData,
//             });
//         } else {
//             return res.status(404).json({
//                 status: 404,
//                 message: "No data found for the given pageMast_id.",
//             });
//         }

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message ? error.message : message.ERROR_MESSAGE,
//         });
//     }
// };

