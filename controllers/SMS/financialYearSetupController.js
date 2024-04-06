const financialYearSetupModel = require("../../models/SMS/financialYearSetupModel");
const { message } = require("../../common/message")
const mongoose = require("mongoose");

/**
 * Api is to used for the financial_year_setup data add in the DB collection.
 */
exports.createFinancialYearSetup = async (req, res) => {
    try {
        const { start_date, end_date, managed_by, created_by, last_updated_by } = req.body;
        const addFinancialYearSetup = new financialYearSetupModel({
            start_date: start_date,
            end_date: end_date,
            managed_by: managed_by,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addFinancialYearSetup.save();
        return res.status(200).json({
            status: 200,
            message: "Financial year setup data added successfully!",
            data: addFinancialYearSetup,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the financial_year_setup data get_ByID in the DB collection.
 */
exports.getFinancialYearSetupDetails = async (req, res) => {
    try {
        const financialYearSetupData = await financialYearSetupModel.aggregate([
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
                $project: {
                    start_date: 1,
                    end_date: 1,
                    managed_by: 1,
                    created_by: 1,
                    last_updated_by: 1,
                    managed_by_name: "$user.user_name",
                    created_by_name: "$user.user_name",
                    created_date_time: 1,
                    last_updated_date: 1,
                },
            },
        ])
        if (financialYearSetupData) {
            return res.status(200).json({
                status: 200,
                message: "Financial year setup details successfully!",
                data: financialYearSetupData,
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
 * Api is to used for the financial_yaer_setup data update in the DB collection.
 */
exports.updateFinancialYearSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date, managed_by, created_by, last_updated_by } = req.body;
        const financialYearSetupData = await financialYearSetupModel.findOne({ _id: id });
        if (!financialYearSetupData) {
            return res.send("Invalid financial_yaer_setup Id...");
        }
        await financialYearSetupData.save();
        const financialYearSetupUpdated = await financialYearSetupModel.findOneAndUpdate({ _id: id }, {
            $set: {
                start_date,
                end_date,
                managed_by,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Financial year setup data updated successfully!",
            data: financialYearSetupUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the financial_year_setup data get_list in the DB collection.
 */
exports.getFinancialYearSetupList = async (req, res) => {
    try {
        const financialYearSetupListData = await financialYearSetupModel.aggregate([
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
            }, {
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
                $project: {
                    start_date: 1,
                    end_date: 1,
                    managed_by: 1,
                    managed_by_name: "$user.user_name",
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (financialYearSetupListData) {
            return res.status(200).json({
                status: 200,
                message: "Financial year setup details list successfully!",
                data: financialYearSetupListData,
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
 * Api is to used for the financial_year_setup data delete in the DB collection.
 */
exports.deleteFinancialYearSetup = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const financialYearSetupDelete = await financialYearSetupModel.findOne({ _id: id });
        if (!financialYearSetupDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await financialYearSetupModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Financial year setup data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};