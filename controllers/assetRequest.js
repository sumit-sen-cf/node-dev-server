const response = require("../common/response.js");
const assetRequestModel = require("../models/assetRequestModel.js");
const simModel = require("../models/simModel.js");
const mongoose = require('mongoose');

exports.addAssetRequest = async (req, res) => {
    try {
        const assetRequestData = new assetRequestModel({
            sim_id: req.body.sim_id,
            detail: req.body.detail,
            priority: req.body.priority,
            request_by: req.body.request_by,
            multi_tag: req.body.multi_tag
        });
        const savedassetrequestdata = await assetRequestData.save();
        res.status(200).send({
            data: savedassetrequestdata,
            message: "assetRequsetData created success",
        });
    } catch (err) {
        res.status(500).send({
            error: err.message,
            message: "Error adding assetRequsetData to database",
        });
    }
};

exports.getAssetRequests = async (req, res) => {
    try {

        const assetRequestData = await assetRequestModel
            .aggregate([
                {
                    $lookup: {
                        from: "simmodels",
                        localField: "sim_id",
                        foreignField: "sim_id",
                        as: "sim",
                    },
                },
                {
                    $unwind: {
                        path: "$sim",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "request_by",
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
                        sim_id: "sim_id",
                        asset_name: "$sim.assetsName",
                        detail: "$detail",
                        priority: "$priority",
                        date_and_time_of_asset_request: "$date_and_time_of_asset_request",
                        request_by: "$request_by",
                        request_by_name: "$user.user_name",
                        multi_tag: "$multi_tag",
                        asset_request_status: "$asset_request_status"
                    },
                },
            ])
            .exec();

        if (assetRequestData.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            res.status(200).send({ data: assetRequestData });
        }
    } catch (err) {
        res
            .status(500)
            .send({ error: err.message, message: "Error getting all assetRequestData" });
    }
};

exports.getAssetRequestById = async (req, res) => {
    try {
        const singleAssetRequest = await assetRequestModel.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params._id),
                }
            },
            {
                $lookup: {
                    from: "simmodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "sim",
                },
            },
            {
                $unwind: {
                    path: "$sim",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "request_by",
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
                    sim_id: "sim_id",
                    asset_name: "$sim.assetsName",
                    detail: "$detail",
                    priority: "$priority",
                    date_and_time_of_asset_request: "$date_and_time_of_asset_request",
                    request_by: "$request_by",
                    request_by_name: "$user.user_name",
                    multi_tag: "$multi_tag",
                    asset_request_status: "$asset_request_status"
                },
            },
        ]);

        if (!singleAssetRequest || singleAssetRequest.length === 0) {
            res.status(500).send({ success: false });
            return;
        }

        res.status(200).send(singleAssetRequest[0]);
    } catch (err) {
        res.status(500).send({
            error: err.message,
            message: "Error getting assetBrand details",
        });
    }
};

exports.editAssetRequest = async (req, res) => {
    try {
        const editAssetRequest = await assetRequestModel.findByIdAndUpdate(req.body._id, {
            sim_id: req.body.sim_id,
            detail: req.body.detail,
            priority: req.body.priority,
            request_by: req.body.request_by,
            multi_tag: req.body.multi_tag,
            date_and_time_of_asset_request: req.body.date_and_time_of_asset_request,
            asset_request_status: req.body.asset_request_status,
            updated_at: req.body.updated_at

        }, { new: true })

        res.status(200).send({ success: true, data: editAssetRequest })
    } catch (err) {
        res.status(500).send({
            error: err.message,
            message: "Error updating the assetRequestData in the database",
        });
    }
};

exports.deleteAssetRequest = async (req, res) => {
    assetRequestModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Assset Request Data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Assset Request Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};

exports.showAssetRequestData = async (req, res) => {
    try {
        const { user_id } = req.params;
        const userData = await simModel.aggregate([
            {
                $lookup: {
                    from: "repairrequestmodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "repair",
                },
            },
            {
                $unwind: {
                    path: "$repair",
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "repair.req_by",
                    foreignField: "user_id",
                    as: "userdata",
                },
            },
            {
                $unwind: {
                    path: "$userdata",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "assetscategorymodels",
                    localField: "category_id",
                    foreignField: "category_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "assetssubcategorymodels",
                    localField: "sub_category_id",
                    foreignField: "sub_category_id",
                    as: "subcategory",
                },
            },
            {
                $unwind: {
                    path: "$subcategory",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "vendormodels",
                    localField: "vendor_id",
                    foreignField: "vendor_id",
                    as: "vendor",
                },
            },
            {
                $unwind: {
                    path: "$vendor",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "assetbrandmodels",
                    localField: "asset_brand_id",
                    foreignField: "asset_brand_id",
                    as: "brand",
                },
            },
            {
                $unwind: {
                    path: "$brand",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "assetmodalmodels",
                    localField: "asset_modal_id",
                    foreignField: "asset_modal_id",
                    as: "modal",
                },
            },
            {
                $unwind: {
                    path: "$modal",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "assetrequestmodels",
                    localField: "sim_id",
                    foreignField: "sim_id",
                    as: "assetrequest",
                },
            },
            {
                $unwind: {
                    path: "$assetrequest",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: "$_id",
                    sim_id: "$sim_id",
                    asset_id: "$sim_no",
                    asset_name: "$assetsName",
                    status: "$status",
                    category_id: "$category_id",
                    sub_category_id: "$sub_category_id",
                    vendor_id: "$vendor_id",
                    inWarranty: "$inWarranty",
                    warrantyDate: "$warrantyDate",
                    dateOfPurchase: "$dateOfPurchase",
                    category_name: "$category.category_name",
                    sub_category_name: "$subcategory.sub_category_name",
                    vendor_name: "$vendor.vendor_name",
                    vendor_contact_no: "$vendor.vendor_contact_no",
                    vendor_email_id: "$vendor.vendor_email_id",
                    multi_tag: "$repair.multi_tag",
                    asset_brand_id: "$brand.asset_brand_id",
                    asset_brand_name: "$brand.asset_brand_name",
                    asset_modal_id: "$modal.asset_modal_id",
                    asset_modal_name: "$modal.asset_modal_name",
                    priority: "$repair.priority",
                    req_by: "$repair.req_by",
                    req_by_name: "$userdata.user_name",
                    req_date: "$repair.repair_request_date_time",
                    detail: "$assetrequest.detail",
                    priority: "$assetrequest.priority",
                    asset_request_status: "$assetrequest.asset_request_status"
                },
            },
        ]).exec();
        if (!userData) {
            return res.status(500).json({ success: false, message: "No data found" });
        }
        const filteredData = userData.filter((item) => {
            const multiTagArray = item.multi_tag[0].split(',');
            return multiTagArray.includes(user_id);
        });
        if (filteredData.length === 0) {
            return res.status(404).json({ success: false, message: "No data found for the user_id" });
        }
        res.status(200).json({ data: filteredData });
    } catch (err) {
        res.status(500).send({ error: err.message, sms: "Error getting user details" });
    }
};