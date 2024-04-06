const { message } = require("../../common/message")
const mongoose = require("mongoose");
const salesRoleBadgeAssignedRateModel = require("../../models/SMS/salesRoleBadgeAssignedRateModel");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');

/**
 * Api is to used for the sales_role_badge_assigned_rate data add in the DB collection.
 */
exports.createSalesRoleBadgeAssignedRate = async (req, res) => {
    try {
        const { user_role, financial_year_setup_id, badge_id, rate_min, rate_max, managed_by, created_by, last_updated_by } = req.body;
        const addSalesRoleBadgesAssignedDetails = new salesRoleBadgeAssignedRateModel({
            user_role: user_role,
            financial_year_setup_id: financial_year_setup_id,
            badge_id: badge_id,
            rate_min: rate_min,
            rate_max: rate_max,
            managed_by: managed_by,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addSalesRoleBadgesAssignedDetails.save();
        return res.status(200).json({
            status: 200,
            message: "Sales role badge assigned rate details data added successfully!",
            data: addSalesRoleBadgesAssignedDetails,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the sales_role_badge_assigned_rate data get_ByID in the DB collection.
 */
exports.getSalesRoleBadgeAssigned = async (req, res) => {
    try {
        const salesRoleBadgeAssignedData = await salesRoleBadgeAssignedRateModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "user_role",
                    foreignField: "role_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "managed_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'rolemodels',
                    localField: 'user.role_id',
                    foreignField: 'role_id',
                    as: 'roleData'
                }
            },
            {
                $unwind: {
                    path: "$roleData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    user_role: 1,
                    financial_year_setup_id: 1,
                    badge_id: 1,
                    rate_min: 1,
                    rate_max: 1,
                    managed_by: 1,
                    created_by: 1,
                    last_updated_by: 1,
                    user_role_id: "$user.role_id",
                    user_role_name: "$roleData.Role_name",
                    managed_by_name: "$user.user_name",
                    created_by_name: "$user.user_name",
                    created_date_time: 1,
                    last_updated_date: 1,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        if (salesRoleBadgeAssignedData) {
            return res.status(200).json({
                status: 200,
                message: "Sales role badge assigned rate details successfully!",
                data: salesRoleBadgeAssignedData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};
/**
 * Api is to used for the sales_role_badge_assigned_rate data update in the DB collection.
 */
exports.updateSalesRoleBadgeAssignedRate = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_role, financial_year_setup_id, badge_id, rate_min, rate_max, managed_by, created_by, last_updated_by } = req.body;
        const salesRoleBadgeAssignedDataData = await salesRoleBadgeAssignedRateModel.findOne({ _id: id });
        if (!salesRoleBadgeAssignedDataData) {
            return res.send("Invalid sales_role_badge_assigned_rate Id...");
        }
        await salesRoleBadgeAssignedDataData.save();
        const salesRoleBadgeAssignedUpdatedData = await salesRoleBadgeAssignedRateModel.findOneAndUpdate({ _id: id }, {
            $set: {
                user_role,
                financial_year_setup_id,
                badge_id,
                rate_min,
                rate_max,
                managed_by,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Sales role badge assigned rate data updated successfully!",
            data: salesRoleBadgeAssignedUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_role_badge_assigned_rate data get_list in the DB collection.
 */
exports.getSalesRoleBadgeAssignedRateList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const salesRoleBadgeAssignedRateListData = await salesRoleBadgeAssignedRateModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "managed_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'rolemodels',
                    localField: 'user.role_id',
                    foreignField: 'role_id',
                    as: 'roleData'
                }
            },
            {
                $unwind: {
                    path: "$roleData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'financialyearsetups',
                    localField: 'financial_year_setup_id',
                    foreignField: '_id',
                    as: 'financialyearsetupData'
                }
            },
            {
                $unwind: {
                    path: "$financialyearsetupData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "salesbadges",
                    localField: "badge_id",
                    foreignField: "_id",
                    as: "salesbadgeData",
                },
            },
            {
                $unwind: {
                    path: "$salesbadgeData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    user_role: 1,
                    financial_year_setup_id: 1,
                    badge_id: 1,
                    rate_min: 1,
                    rate_max: 1,
                    managed_by: 1,
                    created_by: 1,
                    last_updated_by: 1,
                    user_role_id: "$user.role_id",
                    user_role_name: "$roleData.Role_name",
                    managed_by_name: "$user.user_name",
                    created_by_name: "$user.user_name",
                    created_date_time: 1,
                    last_updated_date: 1,
                    Financial_Year_Setups: {
                        start_date: "$financialyearsetupData.start_date",
                        end_date: "$financialyearsetupData.end_date",
                        managed_by: "$financialyearsetupData.managed_by",
                        managed_by_name: "$user.user_name",
                        created_date_time: 1,
                        created_by: 1,
                        created_by_name: "$user.user_name",
                    },
                    Sales_Badges: {
                        badge_name: "$salesbadgeData.badge_name",
                        max_rate_status: "$salesbadgeData.max_rate_status",
                        managed_by: "$salesbadgeData.managed_by",
                        managed_by_name: "$user.user_name",
                        created_date_time: "$salesbadgeData.created_date_time",
                        created_by: "$salesbadgeData.created_by",
                        created_by_name: "$user.user_name",
                        last_updated_date: "$salesbadgeData.last_updated_date",
                        last_updated_by: "$salesbadgeData.last_updated_by",
                        badge_image: {
                            $concat: [imageUrl, "$salesbadgeData.badge_image"],
                        },
                    }
                },
            },
        ])
        if (salesRoleBadgeAssignedRateListData) {
            return res.status(200).json({
                status: 200,
                message: "Sales role badge assigned rate list successfully!",
                data: salesRoleBadgeAssignedRateListData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the sales_role_badge_assigned_rate data delete in the DB collection.
 */
exports.deleteSalesRoleBadgeAssigned = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const salesRoleBadgeAssignedDataDelete = await salesRoleBadgeAssignedRateModel.findOne({ _id: id });
        if (!salesRoleBadgeAssignedDataDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await salesRoleBadgeAssignedRateModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Sales role badge assigned data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};