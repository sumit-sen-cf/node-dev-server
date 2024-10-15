const response = require("../../common/response.js");
const caseStudyModel = require("../../models/executionCaseStudy/caseStudyModel.js");
const mongoose = require("mongoose");
const executionModel = require("../../models/Sales/executionModel.js");

exports.addCaseStudy = async (req, res) => {
    try {
        const caseStudyData = new caseStudyModel({
            sale_booking_id: req.body.sale_booking_id,
            account_id: req.body.account_id,
            no_of_posts: req.body.no_of_posts,
            reach: req.body.reach,
            impression: req.body.impression,
            views: req.body.views,
            engagement: req.body.engagement,
            story_views: req.body.story_views,
            link_clicks: req.body.link_clicks,
            likes: req.body.likes,
            comments: req.body.comments,
            cf_google_sheet_link: req.body.cf_google_sheet_link,
            sarcasm_google_sheet__link: req.body.sarcasm_google_sheet__link,
            MMC_google_sheet__link: req.body.MMC_google_sheet__link
        });
        const caseData = await caseStudyData.save();

        const exeData = await executionModel.findOneAndUpdate(
            { sale_booking_id: req.body.sale_booking_id },
            {
                $set: {
                    execution_status: "case_study_close"
                }
            },
            { new: true }
        );

        return response.returnTrue(
            200,
            req,
            res,
            "Case Study Data Created Successfully",
            caseData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getCaseStudies = async (req, res) => {
    try {
        const simc = await caseStudyModel
            .aggregate([
                {
                    $lookup: {
                        from: "accountmastermodels",
                        localField: "account_id",
                        foreignField: "account_id",
                        as: "accountData",
                    },
                },
                {
                    $unwind: {
                        path: "$accountData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "accountbrandcategorymodels",
                        localField: "accountData.category_id",
                        foreignField: "_id",
                        as: "brandCatData",
                    },
                },
                {
                    $unwind: {
                        path: "$brandCatData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        account_id: 1,
                        account_name: "$accountData.account_name",
                        brand_category_name: "$brandCatData.brand_category_name",
                        no_of_posts: 1,
                        reach: 1,
                        impression: 1,
                        views: 1,
                        engagement: 1,
                        story_views: 1,
                        link_clicks: 1,
                        likes: 1,
                        comments: 1,
                        cf_google_sheet_link: 1,
                        sarcasm_google_sheet__link: 1,
                        MMC_google_sheet__link: 1
                    },
                },
            ])
            .exec();
        if (!simc) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }
        res.status(200).send(simc)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleCaseStudy = async (req, res) => {
    try {
        const simc = await caseStudyModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: "accountmastermodels",
                        localField: "account_id",
                        foreignField: "account_id",
                        as: "accountData",
                    },
                },
                {
                    $unwind: {
                        path: "$accountData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "accountbrandcategorymodels",
                        localField: "accountData.category_id",
                        foreignField: "_id",
                        as: "brandCatData",
                    },
                },
                {
                    $unwind: {
                        path: "$brandCatData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        account_id: 1,
                        account_name: "$accountData.account_name",
                        brand_category_name: "$brandCatData.brand_category_name",
                        no_of_posts: 1,
                        reach: 1,
                        impression: 1,
                        views: 1,
                        engagement: 1,
                        story_views: 1,
                        link_clicks: 1,
                        likes: 1,
                        comments: 1,
                        cf_google_sheet_link: 1,
                        sarcasm_google_sheet__link: 1,
                        MMC_google_sheet__link: 1
                    },
                },
            ])
            .exec();
        if (!simc) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }
        res.status(200).send(simc)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editCaseStudy = async (req, res) => {
    try {
        const editCaseStudy = await caseStudyModel.findOneAndUpdate(
            { _id: req.body.id },
            {
                account_id: req.body.account_id,
                no_of_posts: req.body.no_of_posts,
                reach: req.body.reach,
                impression: req.body.impression,
                views: req.body.views,
                engagement: req.body.engagement,
                story_views: req.body.story_views,
                link_clicks: req.body.link_clicks,
                likes: req.body.likes,
                comments: req.body.comments,
                cf_google_sheet_link: req.body.cf_google_sheet_link,
                sarcasm_google_sheet__link: req.body.sarcasm_google_sheet__link,
                MMC_google_sheet__link: req.body.MMC_google_sheet__link
            },
            { new: true }
        );
        if (!editCaseStudy) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found With This Case Study Id",
                {}
            );
        }
        return response.returnTrue(200, req, res, " Case Study Updation Successfully", editCaseStudy);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteCaseStudy = async (req, res) => {
    caseStudyModel.deleteOne({ _id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Case Study Data Deleted Successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'Case Study Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};