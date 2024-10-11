const response = require("../../common/response.js");
const planPageDetailModel = require("../../models/PMS2/planPageDetailModel.js");
const mongoose = require("mongoose");
const constant = require("../../common/constant");

exports.addPlanPageDetail = async (req, res) => {
    try {
        const planPageData = new planPageDetailModel({
            planx_id: req.body.planx_id,
            page_name: req.body.page_name,
            post_price: req.body.post_price,
            story_price: req.body.story_price,
            post_count: req.body.post_count,
            story_count: req.body.story_count,
            created_by: req.body.created_by
        });
        const planData = await planPageData.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Add Plan Page Details Data Created Successfully",
            planData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getPlanPageDetails = async (req, res) => {
    try {
        const planxData = await planPageDetailModel
            .aggregate([
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "created_by",
                        foreignField: "user_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        planx_id: 1,
                        page_name: 1,
                        post_price: 1,
                        story_price: 1,
                        post_count: 1,
                        story_count: 1,
                        created_by: 1,
                        created_by_name: "$userData.user_name"
                    },
                },
            ]);
        if (!planxData) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }
        res.status(200).send(planxData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSinglePlanPageDetail = async (req, res) => {
    try {
        const planPageSingleData = await planPageDetailModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "created_by",
                        foreignField: "user_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        planx_id: 1,
                        page_name: 1,
                        post_price: 1,
                        story_price: 1,
                        post_count: 1,
                        story_count: 1,
                        created_by: 1,
                        created_by_name: "$userData.user_name"
                    },
                },
            ]);
        if (!planPageSingleData) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }
        res.status(200).send(planPageSingleData)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSinglePlanPageDetailWithPlanXID = async (req, res) => {
    try {
        const planPageSingleData = await planPageDetailModel
            .aggregate([
                {
                    $match: {
                        planx_id: mongoose.Types.ObjectId(req.params.planx_id)
                    }
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "created_by",
                        foreignField: "user_id",
                        as: "userData",
                    },
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        planx_id: 1,
                        page_name: 1,
                        post_price: 1,
                        story_price: 1,
                        post_count: 1,
                        story_count: 1,
                        created_by: 1,
                        created_by_name: "$userData.user_name"
                    },
                },
            ]);
        if (!planPageSingleData) {
            return response.returnFalse(200, req, res, "No Record Found...", []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Plan Page Details Data Fetched Successfully",
            planPageSingleData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editPlanPageDetail = async (req, res) => {
    try {
        const editPlanPageData = await planPageDetailModel.findOneAndUpdate(
            { _id: req.body.id },
            {
                planx_id: req.body.planx_id,
                page_name: req.body.page_name,
                post_price: req.body.post_price,
                story_price: req.body.story_price,
                post_count: req.body.post_count,
                story_count: req.body.story_count,
                created_by: req.body.created_by,
                last_updated_by: req.body.last_updated_by
            },
            { new: true }
        );
        if (!editPlanPageData) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found With This Plan Page Detail Id",
                {}
            );
        }
        return response.returnTrue(200, req, res, " Plan Page Detail Data Updation Successfully", editPlanPageData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deletePlanPageDetail = async (req, res) => {
    try {

        const { id } = req.params;

        const planPageDetailData = await planPageDetailModel.findOneAndUpdate({
            _id: id,
            status: { $ne: constant.DELETED }
        }, {
            $set: {
                status: constant.DELETED,
            },
        },
            { new: true }
        );

        if (!planPageDetailData) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        return response.returnTrue(
            200,
            req,
            res,
            `Plan Page Detail Data Deleted Successfully ${id}`,
            planPageDetailData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.addMultiplePlanPageDetail = async (req, res) => {
    try {
        const { planx_id, plan_pages } = req.body;

        if (!Array.isArray(plan_pages)) {
            return response.returnFalse(400, req, res, "Invalid data format. Expected an array of plan pages.", {});
        }

        const existingPlan = await planPageDetailModel.find({ planx_id: planx_id });

        if (existingPlan) {
            await planPageDetailModel.updateMany(
                { page_name },
                { $set: { status: constant.DELETED } }
            );
        }
        const planPageData = plan_pages.map((planPage) => {
            return new planPageDetailModel({
                planx_id: planx_id,
                page_name: planPage.page_name,
                post_count: planPage.post_count,
                story_count: planPage.story_count,
                post_price: planPage.post_price,
                story_price: planPage.story_price,
                description: planPage.description || "",
                created_by: planPage.created_by
            });
        });

        const planData = await planPageDetailModel.insertMany(planPageData);

        return response.returnTrue(
            200,
            req,
            res,
            "Plan Page Details Data Created Successfully",
            planData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deletePlanPageDetailWithPlanXID = async (req, res) => {
    planPageDetailModel.deleteMany({ planx_id: req.params.planx_id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Plan Page Detail Data Deleted with planx id Successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'Plan Page Detail Data of planx id not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};