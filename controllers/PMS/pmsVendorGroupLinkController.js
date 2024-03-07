const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsVendorGroupLinkModel = require('../../models/PMS/pmsVendorGroupLinkModel');

//POST- PMS_Vendor_Group
exports.createVendorGroup = async (req, res) => {
    try {
        const checkDuplicacy = await pmsVendorGroupLinkModel.findOne({ link_type: req.body.link_type });
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "PMS vendor group link data alredy exist!",
            });
        }
        const { vendorMast_id, group_link_type_id, group_link, description, created_date_time, created_by, last_updated_date,
            last_updated_by } = req.body;
        const addVendorGroupData = new pmsVendorGroupLinkModel({
            vendorMast_id: vendorMast_id,
            group_link_type_id: group_link_type_id,
            group_link: group_link,
            description: description,
            created_date_time: created_date_time,
            created_by: created_by,
            last_updated_date: last_updated_date,
            last_updated_by: last_updated_by
        });
        await addVendorGroupData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS vendor group link data added successfully!",
            data: addVendorGroupData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_Vendor-GroupLink-By-ID
exports.getVendorGroupDetail = async (req, res) => {
    try {
        const pmsVendorGroupData = await pmsVendorGroupLinkModel.aggregate([
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
                $project: {
                    group_link_id: 1,
                    group_link_name: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsVendorGroupData) {
            return res.status(200).json({
                status: 200,
                message: "PMS vendor group link details successfully!",
                data: pmsVendorGroupData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};

//PUT - updateVendorGroupLink_By-ID
exports.updateVendorGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendorMast_id, group_link_type_id, group_link, description, created_date_time, created_by, last_updated_date,
            last_updated_by } = req.body;
        const VendorgroupLinkData = await pmsVendorGroupLinkModel.findOne({ _id: id });
        if (!VendorgroupLinkData) {
            return res.send("Invalid vendor group-link Id...");
        }
        await VendorgroupLinkData.save();
        const vendorGroupData = await pmsVendorGroupLinkModel.findOneAndUpdate({ _id: id }, {
            $set: {
                vendorMast_id,
                group_link_type_id,
                group_link,
                description,
                created_date_time,
                created_by,
                last_updated_date,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS vendor group link data updated successfully!",
            data: vendorGroupData,
        });
    } catch (error) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_GroupLink_List
exports.getAllVendorGroupList = async (req, res) => {
    try {
        const pmsVendorGroupLinkData = await pmsVendorGroupLinkModel.aggregate([
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
                    localField: "last_updated_by",
                    foreignField: "user_id",
                    as: "user_data",
                },
            },
            {
                $unwind: {
                    path: "$user_data",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmsvendormasts",
                    localField: "vendorMast_id",
                    foreignField: "_id",
                    as: "pmsVendorMast",
                },
            },
            {
                $unwind: {
                    path: "$pmsVendorMast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmsgrouplinks",
                    localField: "group_link_type_id",
                    foreignField: "_id",
                    as: "pmsgrouplink",
                },
            },
            {
                $unwind: {
                    path: "$pmsgrouplink",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    group_link: 1,
                    description: 1,
                    created_date_time: 1,
                    created_by: 1,
                    last_updated_by_name: "$user_data.user_name",
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    PMSVendorMasts_data: {
                        type_id: "$pmsVendorMast.type_id",
                        platform_id: "$pmsVendorMast.platform_id",
                        payMethod_id: "$pmsVendorMast.payMethod_id",
                        cycle_id: "$pmsVendorMast.cycle_id",
                        vendorMast_name: "$pmsVendorMast.vendorMast_name",
                        country_code: "$pmsVendorMast.country_code",
                        mobile: "$pmsVendorMast.mobile",
                        alternate_mobile: "$pmsVendorMast.alternate_mobile",
                        email: "$pmsVendorMast.email",
                        personal_address: "$pmsVendorMast.personal_address",
                        comapny_name: "$pmsVendorMast.comapny_name",
                        company_address: "$pmsVendorMast.company_address",
                        company_city: "$pmsVendorMast.company_city", 
                        company_pincode: "$pmsVendorMast.company_pincode",
                        company_state: "$pmsVendorMast.company_state",
                        threshold_limit: "$pmsVendorMast.threshold_limit",
                        home_address: "$pmsVendorMast.home_address",
                        home_city: "$pmsVendorMast.home_city",
                        home_state: "$pmsVendorMast.home_state",
                        PMSGroupLinks_data:{
                            link_type:"$pmsgrouplink.link_type",
                            description_group_link_type:"$pmsgrouplink.description",
                            created_by_group_link_type:"$pmsgrouplink.created_by"
                        }
                    }
                }
            }
        ])
        if (!pmsVendorGroupLinkData) {
            return res.status(500).send({
                succes: true,
                message: "PMS vendor group link data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS vendor group link data list successfully!",
            data: pmsVendorGroupLinkData
        });
    } catch (err) {
        return res.status(500).json({
            message: message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_GroupLink-By-ID
exports.deleteVendorGroupData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const vendorgroupData = await pmsVendorGroupLinkModel.findOne({ _id: id });
        if (!vendorgroupData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsVendorGroupLinkModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS vendor group link data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: message.ERROR_MESSAGE,
        });
    }
};