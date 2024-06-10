const response = require("../common/response.js");
const opCampaignModel = require("../models/opCampaignModel.js");
const salesBookingModel = require("../models/Sales/salesBookingModel.js");
const exeSum = require('../models/exeSumModel.js');
const mongoose = require('mongoose');

exports.addOpCampaign = async (req, res) => {
    try {
        let commitments = req.body.commitments;
        if (typeof commitments === 'string') {
            commitments = JSON.parse(commitments);
        }
        const campagin = new opCampaignModel({
            pre_brand_id: req.body.pre_brand_id,
            pre_campaign_id: req.body.pre_campaign_id,
            pre_industry_id: req.body.pre_industry_id,
            pre_agency_id: req.body.pre_agency_id,
            pre_goal_id: req.body.pre_goal_id,
            hash_tag: req.body.hash_tag,
            commitments: commitments,
            campaign_close_by: req.body.campaign_close_by,
            details: req.body.details,
            captions: req.body.captions,
            updated_date: req.body.updated_date,
            created_date: req.body.creation_date,
            sale_booking_execution_id: req.body.sale_booking_execution_id,
            sale_booking_id: req.body.sale_booking_id,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            summary: req.body.summary,
            remarks: req.body.remarks,
            created_by: req.body.created_by,
            creation_date: req.body.creation_date,
            last_updated_date: req.body.last_updated_date,
            sale_booking_date: req.body.sale_booking_date,
            campaign_amount: req.body.campaign_amount,
            execution_date: req.body.execution_date,
            execution_remark: req.body.execution_remark,
            execution_done_by: req.body.execution_done_by,
            cust_name: req.body.cust_name,
            loggedin_user_id: req.body.loggedin_user_id,
            execution_status: req.body.execution_status,
            payment_update_id: req.body.payment_update_id,
            payment_type: req.body.payment_type,
            status_desc: req.body.status_desc,
            invoice_creation_status: req.body.invoice_creation_status,
            manager_approval: req.body.manager_approval,
            invoice_particular: req.body.invoice_particular,
            payment_status_show: req.body.payment_status_show,
            sales_executive_name: req.body.sales_executive_name,
            page_ids: req.body.page_ids,
            service_id: req.body.service_id,
            service_name: req.body.service_name,
            execution_excel: req.body.execution_excel,
            total_paid_amount: req.body.total_paid_amount,
            credit_approval_amount: req.body.credit_approval_amount,
            credit_approval_date: req.body.credit_approval_date,
            credit_approval_by: req.body.credit_approval_by,
            campaign_amount_without_gst: req.body.campaign_amount_without_gst,
            execution_time: req.body.execution_time,
            execution_date_time: req.body.execution_date_time,
            execution_sent_date: req.body.execution_sent_date,
            execution_pause: req.body.execution_pause,
            customer_created_date: req.body.customer_created_date,
            gst_status: req.body.gst_status,
            booking_created_date: req.body.booking_created_date,
            booking_last_updated_date: req.body.booking_last_updated_date,
            record_service_amount: req.body.record_service_amount,
            record_service_created_date: req.body.record_service_created_date,
            last_payment_date: req.body.last_payment_date,
            manager_name: req.body.manager_name,
            execution_token: req.body.execution_token,
            brand_name: req.body.brand_name,
            record_service_campaign_name: req.body.record_service_campaign_name,
            id: req.body.id
        });
        const campaginData = await campagin.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Campaign Created Successfully",
            campaginData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getOpCampaigns = async (req, res) => {
    try {
        const campaigns = await opCampaignModel
            .aggregate([
                {
                    $lookup: {
                        from: "brandmodels",
                        localField: "pre_brand_id",
                        foreignField: "_id",
                        as: "brandData",
                    },
                },
                {
                    $unwind: {
                        path: "$brandData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "execampaignmodels",
                        localField: "pre_campaign_id",
                        foreignField: "_id",
                        as: "exeCampData",
                    },
                },
                {
                    $unwind: {
                        path: "$exeCampData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "industrymasters",
                        localField: "pre_industry_id",
                        foreignField: "_id",
                        as: "industryData",
                    },
                },
                {
                    $unwind: {
                        path: "$industryData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "agencymasters",
                        localField: "pre_agency_id",
                        foreignField: "_id",
                        as: "agencyData",
                    },
                },
                {
                    $unwind: {
                        path: "$agencyData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "goalmasters",
                        localField: "pre_goal_id",
                        foreignField: "_id",
                        as: "goalData",
                    },
                },
                {
                    $unwind: {
                        path: "$goalData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        pre_brand_id: 1,
                        brand_data: {
                            _id: "$brandData._id",
                            brand_name: "$brandData.brand_name",
                            category_id: "$brandData.category_id",
                            sub_category_id: "$brandData.sub_category_id",
                            platforms: "$brandData.platforms",
                            website: "$brandData.website",
                            major_category: "$brandData.major_category",
                            brand_id: "$brandData.brand_id"
                        },
                        pre_campaign_id: 1,
                        campaign_data: {
                            _id: "$exeCampData._id",
                            exeCmpId: "$exeCampData.exe_campaign_id",
                            exeCmpName: "$exeCampData.exe_campaign_name",
                            exeHashTag: "$exeCampData.exe_hash_tag",
                            // exeRemark: "$exeCampData.exeRemark"
                        },
                        pre_industry_id: 1,
                        industry_data: {
                            _id: "$industryData._id",
                            name: "$industryData.name",
                            description: "$industryData.description"
                        },
                        pre_agency_id: 1,
                        agency_data: {
                            _id: "$agencyData._id",
                            name: "$agencyData.name",
                            mobile: "$agencyData.mobile",
                            email: "$agencyData.email",
                            city: "$agencyData.city",
                            instagram: "$agencyData.instagram",
                            remark: "$agencyData.remark"
                        },
                        pre_goal_id: 1,
                        goal_data: {
                            _id: "$goalData._id",
                            name: "$goalData.name",
                            description: "$goalData.description"
                        },
                        hash_tag: 1,
                        campaign_close_by: 1,
                        details: 1,
                        captions: 1,
                        commitments: 1,
                        updated_date: 1,
                        created_date: 1,
                        sale_booking_execution_id: 1,
                        sale_booking_id: 1,
                        start_date: 1,
                        end_date: 1,
                        summary: 1,
                        remarks: 1,
                        created_by: 1,
                        creation_date: 1,
                        last_updated_date: 1,
                        sale_booking_date: 1,
                        campaign_amount: 1,
                        execution_date: 1,
                        execution_remark: 1,
                        execution_done_by: 1,
                        cust_name: 1,
                        loggedin_user_id: 1,
                        execution_status: 1,
                        payment_update_id: 1,
                        payment_type: 1,
                        status_desc: 1,
                        invoice_creation_status: 1,
                        manager_approval: 1,
                        invoice_particular: 1,
                        payment_status_show: 1,
                        sales_executive_name: 1,
                        page_ids: 1,
                        service_id: 1,
                        service_name: 1,
                        execution_excel: 1,
                        total_paid_amount: 1,
                        credit_approval_amount: 1,
                        credit_approval_date: 1,
                        credit_approval_by: 1,
                        campaign_amount_without_gst: 1,
                        execution_time: 1,
                        execution_date_time: 1,
                        execution_sent_date: 1,
                        execution_pause: 1,
                        customer_created_date: 1,
                        gst_status: 1,
                        booking_created_date: 1,
                        booking_last_updated_date: 1,
                        record_service_amount: 1,
                        record_service_created_date: 1,
                        last_payment_date: 1,
                        manager_name: 1,
                        execution_token: 1,
                        brand_name: 1,
                        record_service_campaign_name: 1,
                        id: 1
                    },
                }
            ]);
        if (!campaigns) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        res.status(200).send(campaigns)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


exports.getSingleOpCampaign = async (req, res) => {
    try {
        const campaigns = await opCampaignModel
            .aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: "brandmodels",
                        localField: "pre_brand_id",
                        foreignField: "_id",
                        as: "brandData",
                    },
                },
                {
                    $unwind: {
                        path: "$brandData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "execampaignmodels",
                        localField: "pre_campaign_id",
                        foreignField: "_id",
                        as: "exeCampData",
                    },
                },
                {
                    $unwind: {
                        path: "$exeCampData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "industrymasters",
                        localField: "pre_industry_id",
                        foreignField: "_id",
                        as: "industryData",
                    },
                },
                {
                    $unwind: {
                        path: "$industryData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "agencymasters",
                        localField: "pre_agency_id",
                        foreignField: "_id",
                        as: "agencyData",
                    },
                },
                {
                    $unwind: {
                        path: "$agencyData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "goalmasters",
                        localField: "pre_goal_id",
                        foreignField: "_id",
                        as: "goalData",
                    },
                },
                {
                    $unwind: {
                        path: "$goalData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        pre_brand_id: 1,
                        brand_data: {
                            _id: "$brandData._id",
                            brand_name: "$brandData.brand_name",
                            category_id: "$brandData.category_id",
                            sub_category_id: "$brandData.sub_category_id",
                            platforms: "$brandData.platforms",
                            website: "$brandData.website",
                            major_category: "$brandData.major_category",
                            brand_id: "$brandData.brand_id"
                        },
                        pre_campaign_id: 1,
                        campaign_data: {
                            _id: "$exeCampData._id",
                            exeCmpId: "$exeCampData.exe_campaign_id",
                            exeCmpName: "$exeCampData.exe_campaign_name",
                            exeHashTag: "$exeCampData.exe_hash_tag",
                            // exeRemark: "$exeCampData.exeRemark"
                        },
                        pre_industry_id: 1,
                        industry_data: {
                            _id: "$industryData._id",
                            name: "$industryData.name",
                            description: "$industryData.description"
                        },
                        pre_agency_id: 1,
                        agency_data: {
                            _id: "$agencyData._id",
                            name: "$agencyData.name",
                            mobile: "$agencyData.mobile",
                            email: "$agencyData.email",
                            city: "$agencyData.city",
                            instagram: "$agencyData.instagram",
                            remark: "$agencyData.remark"
                        },
                        pre_goal_id: 1,
                        goal_data: {
                            _id: "$goalData._id",
                            name: "$goalData.name",
                            description: "$goalData.description"
                        },
                        hash_tag: 1,
                        campaign_close_by: 1,
                        details: 1,
                        captions: 1,
                        commitments: 1,
                        updated_date: 1,
                        created_date: 1,
                        sale_booking_execution_id: 1,
                        sale_booking_id: 1,
                        start_date: 1,
                        end_date: 1,
                        summary: 1,
                        remarks: 1,
                        created_by: 1,
                        creation_date: 1,
                        last_updated_date: 1,
                        sale_booking_date: 1,
                        campaign_amount: 1,
                        execution_date: 1,
                        execution_remark: 1,
                        execution_done_by: 1,
                        cust_name: 1,
                        loggedin_user_id: 1,
                        execution_status: 1,
                        payment_update_id: 1,
                        payment_type: 1,
                        status_desc: 1,
                        invoice_creation_status: 1,
                        manager_approval: 1,
                        invoice_particular: 1,
                        payment_status_show: 1,
                        sales_executive_name: 1,
                        page_ids: 1,
                        service_id: 1,
                        service_name: 1,
                        execution_excel: 1,
                        total_paid_amount: 1,
                        credit_approval_amount: 1,
                        credit_approval_date: 1,
                        credit_approval_by: 1,
                        campaign_amount_without_gst: 1,
                        execution_time: 1,
                        execution_date_time: 1,
                        execution_sent_date: 1,
                        execution_pause: 1,
                        customer_created_date: 1,
                        gst_status: 1,
                        booking_created_date: 1,
                        booking_last_updated_date: 1,
                        record_service_amount: 1,
                        record_service_created_date: 1,
                        last_payment_date: 1,
                        manager_name: 1,
                        execution_token: 1,
                        brand_name: 1,
                        record_service_campaign_name: 1,
                        id: 1
                    },
                }
            ]);
        if (!campaigns) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        res.status(200).send(campaigns)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteCampaign = async (req, res) => {
    opCampaignModel.deleteOne({ _id: req.params._id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Campaign Data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Campaign Data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

const getCurrentTimeRange = (rangeType) => {
    const now = new Date();
    let start;

    switch (rangeType) {
        case 1:
            start = new Date(now.setHours(0, 0, 0, 0));
            break;
        case 7:
            const firstDayOfWeek = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1);
            start = new Date(now.setDate(firstDayOfWeek));
            start.setHours(0, 0, 0, 0);
            break;
        case 30:
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 12:
            start = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            throw new Error('Invalid range type');
    }

    return { start, end: new Date() };
};

exports.filterCampagin = async (req, res) => {
    const { rangeType } = req.body;
    if (![1, 7, 12, 30].includes(rangeType)) {
        return res.status(400).json({ error: 'Invalid Date Range' })
    }
    const { start, end } = getCurrentTimeRange(rangeType);
    try {
        // const campaigns = await opCampaignModel.find({ created_date: { $gte: start, $lte: end } })
        const campaigns = await opCampaignModel.aggregate([
            {
                $match: { created_date: { $gte: start, $lte: end } }
            },
            {
                $lookup: {
                    from: "brandmodels",
                    localField: "pre_brand_id",
                    foreignField: "_id",
                    as: "brandData",
                },
            },
            {
                $unwind: {
                    path: "$brandData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "execampaignmodels",
                    localField: "pre_campaign_id",
                    foreignField: "_id",
                    as: "exeCampData",
                },
            },
            {
                $unwind: {
                    path: "$exeCampData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "industrymasters",
                    localField: "pre_industry_id",
                    foreignField: "_id",
                    as: "industryData",
                },
            },
            {
                $unwind: {
                    path: "$industryData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "agencymasters",
                    localField: "pre_agency_id",
                    foreignField: "_id",
                    as: "agencyData",
                },
            },
            {
                $unwind: {
                    path: "$agencyData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "goalmasters",
                    localField: "pre_goal_id",
                    foreignField: "_id",
                    as: "goalData",
                },
            },
            {
                $unwind: {
                    path: "$goalData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    pre_brand_id: 1,
                    brand_data: {
                        _id: "$brandData._id",
                        brand_name: "$brandData.brand_name",
                        category_id: "$brandData.category_id",
                        sub_category_id: "$brandData.sub_category_id",
                        platforms: "$brandData.platforms",
                        website: "$brandData.website",
                        major_category: "$brandData.major_category",
                        brand_id: "$brandData.brand_id"
                    },
                    pre_campaign_id: 1,
                    campaign_data: {
                        _id: "$exeCampData._id",
                        exeCmpId: "$exeCampData.exeCmpId",
                        exeCmpName: "$exeCampData.exeCmpName",
                        exeHashTag: "$exeCampData.exeHashTag",
                        exeRemark: "$exeCampData.exeRemark"
                    },
                    pre_industry_id: 1,
                    industry_data: {
                        _id: "$industryData._id",
                        name: "$industryData.name",
                        description: "$industryData.description"
                    },
                    pre_agency_id: 1,
                    agency_data: {
                        _id: "$agencyData._id",
                        name: "$agencyData.name",
                        mobile: "$agencyData.mobile",
                        email: "$agencyData.email",
                        city: "$agencyData.city",
                        instagram: "$agencyData.instagram",
                        remark: "$agencyData.remark"
                    },
                    pre_goal_id: 1,
                    goal_data: {
                        _id: "$goalData._id",
                        name: "$goalData.name",
                        description: "$goalData.description"
                    },
                    hash_tag: 1,
                    campaign_close_by: 1,
                    details: 1,
                    captions: 1,
                    commitments: 1,
                    updated_date: 1,
                    created_date: 1,
                    sale_booking_execution_id: 1,
                    sale_booking_id: 1,
                    start_date: 1,
                    end_date: 1,
                    summary: 1,
                    remarks: 1,
                    created_by: 1,
                    creation_date: 1,
                    last_updated_date: 1,
                    sale_booking_date: 1,
                    campaign_amount: 1,
                    execution_date: 1,
                    execution_remark: 1,
                    execution_done_by: 1,
                    cust_name: 1,
                    loggedin_user_id: 1,
                    execution_status: 1,
                    payment_update_id: 1,
                    payment_type: 1,
                    status_desc: 1,
                    invoice_creation_status: 1,
                    manager_approval: 1,
                    invoice_particular: 1,
                    payment_status_show: 1,
                    sales_executive_name: 1,
                    page_ids: 1,
                    service_id: 1,
                    service_name: 1,
                    execution_excel: 1,
                    total_paid_amount: 1,
                    credit_approval_amount: 1,
                    credit_approval_date: 1,
                    credit_approval_by: 1,
                    campaign_amount_without_gst: 1,
                    execution_time: 1,
                    execution_date_time: 1,
                    execution_sent_date: 1,
                    execution_pause: 1,
                    customer_created_date: 1,
                    gst_status: 1,
                    booking_created_date: 1,
                    booking_last_updated_date: 1,
                    record_service_amount: 1,
                    record_service_created_date: 1,
                    last_payment_date: 1,
                    manager_name: 1,
                    execution_token: 1,
                    brand_name: 1,
                    record_service_campaign_name: 1,
                    id: 1
                }
            }
        ]);
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: 'error while fetching campaign data' })
    }
}

exports.getCampaignWithFilterData = async (req, res) => {
    try {
        let matchQueryObj = {};
        const filterOption = req.query?.filterOption;

        //check if query filter data is available
        if (filterOption && filterOption != '') {
            //current Quater data array for the months
            let firstQuter = ["January", "February", "March"];
            let secondQuter = ["April", "May", "June"];
            let thirdQuter = ["July", "August", "September"];
            let fourthQuter = ["October", "November", "December"];

            //months name array create
            const months = [...firstQuter, ...secondQuter, ...thirdQuter, ...fourthQuter]

            //current date get
            const currentDate = new Date();

            //current date to year get
            let currentYear = currentDate.getFullYear();
            let previousYear = currentYear - 1;

            //current date to month number get
            let currentMonthNumber = currentDate.getMonth();
            let previousMonthNumber = currentMonthNumber - 1;

            //condition check for the months number
            if (previousMonthNumber < 0) {
                previousMonthNumber = 11;
                currentYear = currentYear - 1;
            }

            //months number to name finds
            const currentMonthName = months[currentMonthNumber].toString();
            const prevoiusMonthName = months[previousMonthNumber].toString();

            // Determine the current quarter based on the current month number
            let currentQuarter;
            if (currentMonthNumber >= 0 && currentMonthNumber <= 2) {
                currentQuarter = firstQuter;
            } else if (currentMonthNumber >= 3 && currentMonthNumber <= 5) {
                currentQuarter = secondQuter;
            } else if (currentMonthNumber >= 6 && currentMonthNumber <= 8) {
                currentQuarter = thirdQuter;
            } else {
                currentQuarter = fourthQuter;
            }

            //current month data get condition
            if (filterOption == "this_month") {
                matchQueryObj = {
                    month: currentMonthName,
                    year: parseInt(currentYear)
                }
            }
            //current quater data get condition
            if (filterOption == "this_quater") {
                matchQueryObj = {
                    month: {
                        $in: currentQuarter
                    },
                    year: parseInt(currentYear)
                }
            }
            //current yesr data get condition
            if (filterOption == "this_year") {
                matchQueryObj = {
                    year: parseInt(currentYear)
                }
            }
            //previous month data get condition
            if (filterOption == "previous_month") {
                matchQueryObj = {
                    month: prevoiusMonthName,
                    year: parseInt(currentYear)
                }
            }
            //previous year data get condition
            if (filterOption == "previous_year") {
                matchQueryObj = {
                    year: parseInt(previousYear)
                }
            }
        }

        //filter condition wise data get from DB collection.
        const campaignData = await opCampaignModel.aggregate([{
            $match: matchQueryObj
        }, {
            $lookup: {
                from: "brandmodels",
                localField: "pre_brand_id",
                foreignField: "_id",
                as: "brandData",
            },
        },
        {
            $unwind: {
                path: "$brandData",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "execampaignmodels",
                localField: "pre_campaign_id",
                foreignField: "_id",
                as: "exeCampData",
            },
        },
        {
            $unwind: {
                path: "$exeCampData",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "industrymasters",
                localField: "pre_industry_id",
                foreignField: "_id",
                as: "industryData",
            },
        },
        {
            $unwind: {
                path: "$industryData",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "agencymasters",
                localField: "pre_agency_id",
                foreignField: "_id",
                as: "agencyData",
            },
        },
        {
            $unwind: {
                path: "$agencyData",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "goalmasters",
                localField: "pre_goal_id",
                foreignField: "_id",
                as: "goalData",
            },
        },
        {
            $unwind: {
                path: "$goalData",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                pre_brand_id: 1,
                brand_data: {
                    _id: "$brandData._id",
                    brand_name: "$brandData.brand_name",
                    category_id: "$brandData.category_id",
                    sub_category_id: "$brandData.sub_category_id",
                    platforms: "$brandData.platforms",
                    website: "$brandData.website",
                    major_category: "$brandData.major_category",
                    brand_id: "$brandData.brand_id"
                },
                pre_campaign_id: 1,
                campaign_data: {
                    _id: "$exeCampData._id",
                    exeCmpId: "$exeCampData.exe_campaign_id",
                    exeCmpName: "$exeCampData.exe_campaign_name",
                    exeHashTag: "$exeCampData.exe_hash_tag",
                    // exeRemark: "$exeCampData.exeRemark"
                },
                pre_industry_id: 1,
                industry_data: {
                    _id: "$industryData._id",
                    name: "$industryData.name",
                    description: "$industryData.description"
                },
                pre_agency_id: 1,
                agency_data: {
                    _id: "$agencyData._id",
                    name: "$agencyData.name",
                    mobile: "$agencyData.mobile",
                    email: "$agencyData.email",
                    city: "$agencyData.city",
                    instagram: "$agencyData.instagram",
                    remark: "$agencyData.remark"
                },
                pre_goal_id: 1,
                goal_data: {
                    _id: "$goalData._id",
                    name: "$goalData.name",
                    description: "$goalData.description"
                },
                hash_tag: 1,
                campaign_close_by: 1,
                details: 1,
                captions: 1,
                commitments: 1,
                updated_date: 1,
                created_date: 1,
                sale_booking_execution_id: 1,
                sale_booking_id: 1,
                start_date: 1,
                end_date: 1,
                summary: 1,
                remarks: 1,
                created_by: 1,
                creation_date: 1,
                last_updated_date: 1,
                sale_booking_date: 1,
                campaign_amount: 1,
                execution_date: 1,
                execution_remark: 1,
                execution_done_by: 1,
                cust_name: 1,
                loggedin_user_id: 1,
                execution_status: 1,
                payment_update_id: 1,
                payment_type: 1,
                status_desc: 1,
                invoice_creation_status: 1,
                manager_approval: 1,
                invoice_particular: 1,
                payment_status_show: 1,
                sales_executive_name: 1,
                page_ids: 1,
                service_id: 1,
                service_name: 1,
                execution_excel: 1,
                total_paid_amount: 1,
                credit_approval_amount: 1,
                credit_approval_date: 1,
                credit_approval_by: 1,
                campaign_amount_without_gst: 1,
                execution_time: 1,
                execution_date_time: 1,
                execution_sent_date: 1,
                execution_pause: 1,
                customer_created_date: 1,
                gst_status: 1,
                booking_created_date: 1,
                booking_last_updated_date: 1,
                record_service_amount: 1,
                record_service_created_date: 1,
                last_payment_date: 1,
                manager_name: 1,
                execution_token: 1,
                brand_name: 1,
                record_service_campaign_name: 1,
                id: 1
            }
        }]);

        //success response send
        return res.status(200).send({ data: campaignData });
    } catch (error) {
        return res.send({
            error: error.message,
            status: 500,
            sms: "Error in getting campaign data with filter",
        });
    }
};

exports.getSingleSaleBookingData = async (req, res) => {
    try {
        // const singleSaleBooking = await salesBookingModel.findOne({
        const singleSaleBooking = await exeSum.findOne({
            sale_booking_id: parseInt(req.params.sale_booking_id),
        });
        if (!singleSaleBooking) {
            return response.returnFalse(200, req, res, "No Reord Found...", {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Sale Booking Data Fetch Successfully",
            singleSaleBooking
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};