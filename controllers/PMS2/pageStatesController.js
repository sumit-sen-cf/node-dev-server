const pageStatesModel = require("../../models/PMS2/pageStatesModel");
const response = require("../../common/response");
const multer = require("multer");
const vari = require("../../variables");
const { storage } = require('../../common/uploadFile.js');
const constant = require("../../common/constant.js");
const { uploadImage, deleteImage } = require('../../common/uploadImage.js');
const { default: mongoose } = require("mongoose");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "reach_image", maxCount: 1 },
    { name: "impression_image", maxCount: 1 },
    { name: "engagement_image", maxCount: 1 },
    { name: "story_view_image", maxCount: 1 },
    { name: "city_image", maxCount: 1 },
    { name: "Age_upload", maxCount: 1 },
    { name: "country_image", maxCount: 1 }
]);

exports.addPageStates = [upload, async (req, res) => {
    try {
        const {
            page_master_id, reach, impression, engagement, story_view, stats_for, start_date, end_date, city1_name, city2_name, city3_name,
            city4_name, city5_name, percentage_city1_name, percentage_city2_name, percentage_city3_name, percentage_city4_name,
            percentage_city5_name, male_percent, female_percent, Age_13_17_percent, Age_18_24_percent, Age_25_34_percent, Age_35_44_percent,
            Age_45_54_percent, Age_55_64_percent, Age_65_plus_percent, profile_visit, country1_name, country2_name, country3_name,
            country4_name, country5_name, percentage_country1_name, percentage_country2_name, percentage_country3_name,
            percentage_country4_name, percentage_country5_name, story_view_date, created_by
        } = req.body;

        const createPageStates = new pageStatesModel({
            page_master_id,
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
            story_view_date,
            created_by,
        });
        // Define the image fields 
        const imageFields = {
            reach_image: 'ReachImages',
            impression_image: 'ImpressionImages',
            engagement_image: 'EngagementImages',
            story_view_image: 'StoryViewImages',
            city_image: 'CityImages',
            Age_upload: 'AgeUploads',
            country_image: 'CountryImages'
        };
        for (const [field] of Object.entries(imageFields)) {            //itreates 
            if (req.files[field] && req.files[field][0]) {
                createPageStates[field] = await uploadImage(req.files[field][0], "PMS2Docs");
            }
        }
        const pageStatesAdded = await createPageStates.save();
        return res.status(200).json({
            message: "Page states data added successfully!",
            data: pageStatesAdded
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}];

exports.updatePageStates = [upload, async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = {
            //  page_master_id: req.body.page_master_id,
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
            percentage_city2_name: req.body.percentage_city2_name,
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
            profile_visit: req.body.profile_visit,
            country1_name: req.body.country1_name,
            country2_name: req.body.country2_name,
            country3_name: req.body.country3_name,
            country4_name: req.body.country4_name,
            country5_name: req.body.country5_name,
            percentage_country1_name: req.body.percentage_country1_name,
            percentage_country2_name: req.body.percentage_country2_name,
            percentage_country3_name: req.body.percentage_country3_name,
            percentage_country4_name: req.body.percentage_country4_name,
            percentage_country5_name: req.body.percentage_country5_name,
            story_view_date: req.body.story_view_date,
            last_updated_by: req.body.last_updated_by

        }
        // Fetch the old document and update it
        const updatedPageStates = await pageStatesModel.findByIdAndUpdate(
            { _id: id }, updateData, { new: true });

        if (!updatedPageStates) {
            return response.returnFalse(404, req, res, `Page states not found`, {});
        }

        // Define the image fields 
        const imageFields = {
            reach_image: 'ReachImages',
            impression_image: 'ImpressionImages',
            engagement_image: 'EngagementImages',
            story_view_image: 'StoryViewImages',
            city_image: 'CityImages',
            Age_upload: 'AgeUploads',
            country_image: 'CountryImages'
        };

        // Remove old images not present in new data and upload new images
        for (const [fieldName] of Object.entries(imageFields)) {
            if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                // Delete old image if present
                if (updatedPageStates[fieldName]) {
                    await deleteImage(`PMS2Docs/${updatedPageStates[fieldName]}`);
                }
                // Upload new image
                updatedPageStates[fieldName] = await uploadImage(req.files[fieldName][0], "PMS2Docs");
            }
        }

        // Save the updated document with the new image URLs
        const data = await updatedPageStates.save();

        return response.returnTrue(200, req, res, "Page states data updated successfully!", updatedPageStates);
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}]


exports.getPageStatesDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pageStatesDetails = await pageStatesModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(id),
                    status: { $ne: constant.DELETED },
                },
            }, {
                $addFields: {
                    reach_image_url: {
                        $cond: {
                            if: { $ne: ["$reach_image", ""] },
                            then: {
                                $concat: [
                                    constant.GCP_PAGE_STATES_FOLDER_URL,
                                    "/",
                                    "$reach_image",
                                ],
                            },
                            else: "$reach_image",
                        },
                    }, impression_image_url: {
                        $cond: {
                            if: { $ne: ["$impression_image", ""] },
                            then: {
                                $concat: [
                                    constant.GCP_PAGE_STATES_FOLDER_URL,
                                    "/",
                                    "$impression_image",
                                ],
                            },
                            else: "$impression_image",
                        },
                    }, engagement_image_url: {
                        $cond: {
                            if: { $ne: ["$engagement_image", ""] },
                            then: {
                                $concat: [
                                    constant.GCP_PAGE_STATES_FOLDER_URL,
                                    "/",
                                    "$engagement_image",
                                ],
                            },
                            else: "$engagement_image",
                        },
                    }, story_view_image_url: {
                        $cond: {
                            if: { $ne: ["$story_view_image", ""] },
                            then: {
                                $concat: [
                                    constant.GCP_PAGE_STATES_FOLDER_URL,
                                    "/",
                                    "$story_view_image",
                                ],
                            },
                            else: "$story_view_image",
                        },
                    }, city_image_url: {
                        $cond: {
                            if: { $ne: ["$city_image", ""] },
                            then: {
                                $concat: [
                                    constant.GCP_PAGE_STATES_FOLDER_URL,
                                    "/",
                                    "$city_image",
                                ],
                            },
                            else: "$city_image",
                        },
                    }, Age_upload_url: {
                        $cond: {
                            if: { $ne: ["$Age_upload", ""] },
                            then: {
                                $concat: [
                                    constant.GCP_PAGE_STATES_FOLDER_URL,
                                    "/",
                                    "$Age_upload",
                                ],
                            },
                            else: "$Age_upload",
                        },
                    }, country_image_url: {
                        $cond: {
                            if: { $ne: ["$country_image", ""] },
                            then: {
                                $concat: [
                                    constant.GCP_PAGE_STATES_FOLDER_URL,
                                    "/",
                                    "$country_image",
                                ],
                            },
                            else: "$country_image",
                        },
                    },
                },
            },
        ]);
        if (!pageStatesDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Page states details retrive successfully!",
            pageStatesDetails[0]
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getAllPageStatesList = async (req, res) => {
    try {
        const page = (req.query.page && parseInt(req.query.page)) || null;
        const limit = (req.query.limit && parseInt(req.query.limit)) || null;
        const skip = (page && limit) ? (page - 1) * limit : 0;
        let pageStatesList;

        let matchQuery = {
            status: { $ne: constant.DELETED }
        };

        let addFieldsObj = {
            $addFields: {
                reach_image_url: {
                    $cond: {
                        if: { $ne: ["$reach_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_PAGE_STATES_FOLDER_URL,
                                "/",
                                "$reach_image",
                            ],
                        },
                        else: "$reach_image",
                    },
                }, impression_image_url: {
                    $cond: {
                        if: { $ne: ["$impression_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_PAGE_STATES_FOLDER_URL,
                                "/",
                                "$impression_image",
                            ],
                        },
                        else: "$impression_image",
                    },
                }, engagement_image_url: {
                    $cond: {
                        if: { $ne: ["$engagement_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_PAGE_STATES_FOLDER_URL,
                                "/",
                                "$engagement_image",
                            ],
                        },
                        else: "$engagement_image",
                    },
                }, story_view_image_url: {
                    $cond: {
                        if: { $ne: ["$story_view_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_PAGE_STATES_FOLDER_URL,
                                "/",
                                "$story_view_image",
                            ],
                        },
                        else: "$story_view_image",
                    },
                }, city_image_url: {
                    $cond: {
                        if: { $ne: ["$city_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_PAGE_STATES_FOLDER_URL,
                                "/",
                                "$city_image",
                            ],
                        },
                        else: "$city_image",
                    },
                }, Age_upload_url: {
                    $cond: {
                        if: { $ne: ["$Age_upload", ""] },
                        then: {
                            $concat: [
                                constant.GCP_PAGE_STATES_FOLDER_URL,
                                "/",
                                "$Age_upload",
                            ],
                        },
                        else: "$Age_upload",
                    },
                }, country_image_url: {
                    $cond: {
                        if: { $ne: ["$country_image", ""] },
                        then: {
                            $concat: [
                                constant.GCP_PAGE_STATES_FOLDER_URL,
                                "/",
                                "$country_image",
                            ],
                        },
                        else: "$country_image",
                    },
                },
            },
        }
        const pipeline = [{ $match: matchQuery }, addFieldsObj];

        if (page && limit) {
            pipeline.push(
                { $skip: skip },
                { $limit: limit }
            );
        }
        pageStatesList = await pageStatesModel.aggregate(pipeline);
        const pageStatesCount = await pageStatesModel.countDocuments(matchQuery);

        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Pages states data list fetched successfully!",
            pageStatesList,
            {
                start_record: skip + 1,
                end_record: skip + pageStatesList.length,
                total_records: pageStatesCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(pageStatesCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.getStatesHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const statesHistoryDetails = await pageStatesModel.findOne({
            page_master_id: id,
            status: { $ne: constant.DELETED },
        });
        if (!statesHistoryDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Page states history details retrive successfully!",
            statesHistoryDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
}

exports.deletePageStatesDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pageStatesDeleted = await pageStatesModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                status: constant.DELETED,
            }
        }, {
            new: true
        });
        if (!pageStatesDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            `Successfully Delete Page States Data for id ${id}`,
            pageStatesDeleted
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
