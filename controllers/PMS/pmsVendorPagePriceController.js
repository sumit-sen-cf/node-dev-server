const response = require('../../common/response');
const { message } = require("../../common/message");
const mongoose = require("mongoose");
const pmsVendorPagePriceModel = require('../../models/PMS/pmsVendorPagePriceModel');

//POST- PMS_Vendor_Page_Price
exports.createVendorPagePrice = async (req, res) => {
    try {
        const { platform_price_id, pageMast_id, vendorMast_id, price_type_id, price_cal_type, variable_type, price_fixed,
            price_variable, description, created_by, last_updated_by } = req.body;
        const addVendorPagePriceData = new pmsVendorPagePriceModel({
            platform_price_id: platform_price_id,
            pageMast_id: pageMast_id,
            vendorMast_id: vendorMast_id,
            price_type_id: price_type_id,
            price_cal_type: price_cal_type,
            variable_type: variable_type,
            price_fixed: price_fixed,
            price_variable: price_variable,
            description: description,
            created_by: created_by,
            last_updated_by: last_updated_by
        });
        await addVendorPagePriceData.save();
        return res.status(200).json({
            status: 200,
            message: "PMS vendor page price data added successfully!",
            data: addVendorPagePriceData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_VendorPagePrice-By-ID
exports.getVendorPagePriceDetail = async (req, res) => {
    try {
        const pmsVendorPageData = await pmsVendorPagePriceModel.aggregate([
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
                    platform_price_id: 1,
                    pageMast_id: 1,
                    vendorMast_id: 1,
                    price_type_id: 1,
                    price_cal_type: 1,
                    variable_type: 1,
                    price_fixed: 1,
                    price_variable: 1,
                    description: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                },
            },
        ])
        if (pmsVendorPageData) {
            return res.status(200).json({
                status: 200,
                message: "PMS vendor page price details successfully!",
                data: pmsVendorPageData,
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

//PUT- VendorPAgePrice
exports.updateVendorPagePrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform_price_id, pageMast_id, vendorMast_id, price_type_id, price_cal_type, variable_type, price_fixed,
            price_variable, description, created_by, last_updated_by } = req.body;
        const vendorPagePriceData = await pmsVendorPagePriceModel.findOne({ _id: id });
        if (!vendorPagePriceData) {
            return res.send("Invalid vendor page price Id...");
        }
        await vendorPagePriceData.save();
        const vendorPagePriceUpdate = await pmsVendorPagePriceModel.findOneAndUpdate({ _id: id }, {
            $set: {
                platform_price_id,
                pageMast_id,
                vendorMast_id,
                price_type_id,
                price_cal_type,
                variable_type,
                price_fixed,
                price_variable,
                description,
                created_by,
                last_updated_by
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "PMS vendor page price data updated successfully!",
            data: vendorPagePriceUpdate,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//GET - PMS_VendorPagePrice_List
exports.getVendorPagePriceList = async (req, res) => {
    try {

        const vendorPagePriceData = await pmsVendorPagePriceModel.aggregate([
            {
                $lookup: {
                    from: "pmsplatformprices",
                    localField: "platform_price_id",
                    foreignField: "_id",
                    as: "pmsplatformprice",
                },
            },
            {
                $unwind: {
                    path: "$pmsplatformprice",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspagemasts",
                    localField: "pagemast_id",
                    foreignField: "pagemast_id",
                    as: "pmspagemast",
                },
            },
            {
                $unwind: {
                    path: "$pmspagemast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmsvendormasts",
                    localField: "pmsvendormast_id",
                    foreignField: "pmsvendormast_id",
                    as: "pmsvendormast",
                },
            },
            {
                $unwind: {
                    path: "$pmsvendormast",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pmspricetypes",
                    localField: "price_type_id",
                    foreignField: "_id",
                    as: "pmspricetype",
                },
            },
            {
                $unwind: {
                    path: "$pmspricetype",
                    preserveNullAndEmptyArrays: true,
                },
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
                $project: {
                    platform_price_id: 1,
                    pageMast_id: 1,
                    vendorMast_id: 1,
                    price_type_id: 1,
                    price_cal_type: 1,
                    variable_type: 1,
                    price_fixed: 1,
                    price_variable: 1,
                    description: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    pmsplatformprice_data: {
                        platform_price_id: "$pmsplatformprice._id",
                        description: "$pmsplatformprice.description",
                        created_by: "$pmsplatformprice.created_by"
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
                    PMS_VendorMasts_data: {
                        vendorMast_id: "$pmsvendormast._id",
                        vendorMast_name: "$pmsvendormast.vendorMast_name",
                        country_code: "$pmsvendormast.country_code",
                        mobile: "$pmsvendormast.mobile",
                        alternate_mobile: "$pmsvendormast.alternate_mobile",
                        email: "$pmsvendormast.email",
                        personal_address: "$pmsvendormast.personal_address",
                        pan_no: "$pmsvendormast.pan_no",
                        gst_no: "$pmsvendormast.gst_no",
                        comapny_name: "$pmsvendormast.comapny_name",
                        company_address: "$pmsvendormast.company_address",
                        company_city: "$pmsvendormast.company_city",
                        company_pincode: "$pmsvendormast.company_pincode",
                        company_state: "$pmsvendormast.company_state",
                        threshold_limit: "$pmsvendormast.threshold_limit",
                        home_address: "$pmsvendormast.home_address",
                        home_city: "$pmsvendormast.home_city",
                        home_state: "$pmsvendormast.home_state",
                        created_by: "$pmsvendormast.created_by",
                        last_updated_by: "$pmsvendormast.last_updated_by",
                    },
                    PMS_Price_data: {
                        price_type_id: "$pmspricetype._id",
                        price_type: "$pmspricetype.price_type",
                        description: "$pmspricetype.description",
                        created_by: "$pmspricetype.created_by"
                    }
                }
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
        if (!vendorPagePriceData) {
            return res.status(500).send({
                succes: true,
                message: "PMS vendor page price data list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "PMS vendor page price data list successfully!",
            data: vendorPagePriceData
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - PMS_Vendor_page_Price- By-ID
exports.deleteVendorPagePriceData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const vendorPagePriceData = await pmsVendorPagePriceModel.findOne({ _id: id });
        if (!vendorPagePriceData) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await pmsVendorPagePriceModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "PMS vendor page-price data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};