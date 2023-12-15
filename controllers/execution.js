const exeSum = require('../models/exeSumModel.js');
const exeInven = require('../models/exeInvenModel.js');
const exePurchaseModel = require("../models/exePurchaseModel.js");
const jwt = require('jsonwebtoken');
const variable = require('../variables.js');
const axios = require('axios');
const exeCountHisModel = require('../models/exeCountHisModel.js');
const response = require("../common/response.js");
const multer = require("multer");

exports.exeInvenPost = async (req, res) => {
    try {
        const creators = new exeInven({
            account_link: req.body.account_link,
            account_name: req.body.account_name,
            api_service_id: req.body.api_service_id,
            both_: req.body.both_,
            brand_Integration: req.body.brand_Integration,
            cat_name: req.body.cat_name,
            channel_link: req.body.channel_link,
            channel_username: req.body.channel_username,
            comment: req.body.comment,
            commission: req.body.commission,
            display: req.body.display,
            follower_count: req.body.follower_count,
            group_id: req.body.group_id,
            hidden_: req.body.hidden_,
            incoming_status: req.body.incoming_status,
            logo_Integration: req.body.logo_Integration,
            multiple_cost: req.body.multiple_cost,
            note: req.body.note,
            otherboth: req.body.otherboth,
            otherpost: req.body.otherpost,
            otherstory: req.body.otherstory,
            p_id: req.body.p_id,
            page_category: req.body.page_category,
            page_health: req.body.page_health,
            page_level: req.body.page_level,
            page_likes: req.body.page_likes,
            page_link: req.body.page_link,
            page_name: req.body.page_name,
            page_status: req.body.page_status,
            page_user_id: req.body.page_user_id,
            platform: req.body.platform,
            platform_old: req.body.platform_old,
            post: req.body.post,
            price_type: req.body.price_type,
            repost: req.body.repost,
            sales_both_: req.body.sales_both_,
            sales_post: req.body.sales_post,
            sales_story: req.body.sales_story,
            service_id: req.body.service_id,
            service_name_: req.body.service_name_,
            shorts: req.body.shorts,
            story: req.body.story,
            subscribers: req.body.subscribers,
            username: req.body.username,
            vendor_id: req.body.vendor_id
        })
        const instav = await creators.save();
        res.send({ instav, status: 200 })
    } catch (error) {
        res.status(500).send({ error: error, sms: 'error while adding data' })
    }
}

exports.getExeInventory = async (req, res) => {
    try {
        const getcreators = await exeInven.find();
        if (!getcreators) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(getcreators)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all execution inventory' })
    }
};

exports.exeSumPost = async (req, res) => {
    try {
        const loggedin_user_id = req.body.loggedin_user_id;
        const response = await axios.post(
            'https://sales.creativefuel.io/webservices/RestController.php?view=executionSummaryList', {
            loggedin_user_id: loggedin_user_id
        }

        )
        const responseData = response.data.body;

        for (const data of responseData) {

            const existingData = await checkIfDataExists(data.sale_booking_execution_id)

            if (!existingData) {

                const creators = new exeSum({
                    sale_booking_execution_id: data.sale_booking_execution_id,
                    sale_booking_id: data.sale_booking_id,
                    start_date_: data.start_date_,
                    end_date: data.end_date,
                    summary: data.summary,
                    remarks: data.remarks,
                    created_by: data.created_by,
                    last_updated_by: data.last_updated_by,
                    creation_date: data.creation_date,
                    last_updated_date: data.last_updated_date,
                    sale_booking_date: data.sale_booking_date,
                    campaign_amount: data.campaign_amount,
                    execution_date: data?.execution_date === "0000-00-00" ? Date.now() : data?.execution_date,
                    execution_remark: data.execution_remark,
                    execution_done_by: data.execution_done_by,
                    cust_name: data.cust_name,
                    loggedin_user_id: data.loggedin_user_id,
                    execution_status: 0,
                    // execution_status: data.execution_status,
                    payment_update_id: data.payment_update_id,
                    payment_type: data.payment_type,
                    status_desc: data.status_desc,
                    invoice_creation_status: data.invoice_creation_status,
                    manager_approval: data.manager_approval,
                    invoice_particular: data.invoice_particular,
                    payment_status_show: data.payment_status_show,
                    sales_executive_name: data.sales_executive_name,
                    page_ids: data.page_ids,
                    service_id: data.service_id,
                    service_name: data.service_name,
                    execution_excel: data.execution_excel,
                    total_paid_amount: data.total_paid_amount,
                    credit_approval_amount: data.credit_approval_amount,
                    credit_approval_date: data.credit_approval_date,
                    credit_approval_by: data.credit_approval_by,
                    campaign_amount_without_gst: data.campaign_amount_without_gst,
                    start_date: data.start_date
                })
                const instav = await creators.save();

                return res.send({ instav, status: 200 })
            } else {
                return res.status(200).json({ msg: "Data already insterted there is no new data available to insert." })
            }
        }
    } catch (error) {
        return res.status(500).send({ error: error, sms: 'error while adding data' })
    }
}

async function checkIfDataExists(sale_booking_execution_id) {
    const query = { sale_booking_execution_id: sale_booking_execution_id };
    const result = await exeSum.findOne(query);
    return result !== null;
}
async function checkIfDataExistsInExecutionPurchase(p_id) {
    const query = { p_id };
    const result = await exePurchaseModel.findOne(query);
    return result !== null;
}

exports.getExeSum = async (req, res) => {
    try {
        const getcreators = await exeSum.find();
        if (!getcreators) {
            res.status(500).send({ success: false });
        }
        res.status(200).send(getcreators);
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all execution summary' });
    }
};

exports.editExeSum = async (req, res) => {
    try {
        const editinsta = await exeSum.findOneAndUpdate({ sale_booking_execution_id: req.body.sale_booking_execution_id }, {
            sale_booking_execution_id: req.body.sale_booking_execution_id,
            loggedin_user_id: req.body.loggedin_user_id,
            sale_booking_id: req.body.sale_booking_id,
            execution_remark: req.body.execution_remark,
            execution_status: req.body.execution_status,
            start_date_: req.body.start_date_,
            end_date: req.body.end_date
        }, { new: true })
        if (!editinsta) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ success: true, data: editinsta })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error updating execution summary' })
    }
};

exports.executionGraph = async (req, res) => {
    try {
        const pipeline = [
            {
                $match: {
                    $or: [{ execution_status: 1 }, { execution_status: 0 }],
                },
            },
        ];
        exeSum.aggregate(pipeline, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ err: err.message });
            } else {

                // Helper function to group data by interval start, interval type, and execution status
                const groupData = () => {
                    const groupedData = {};
                    const currentDate = new Date();

                    data.forEach(item => {
                        const saleBookingDate = new Date(item.sale_booking_date);
                        const year = saleBookingDate.getFullYear();
                        const month = saleBookingDate.toISOString().slice(0, 7);
                        const currentWeekStartDate = new Date(currentDate);
                        currentWeekStartDate.setHours(0, 0, 0, 0); // Set to the beginning of the day
                        currentWeekStartDate.setDate(currentDate.getDate() - currentDate.getDay()); // Go to the first day of the current week
                        const currentWeekEndDate = new Date(currentWeekStartDate);
                        currentWeekEndDate.setDate(currentWeekStartDate.getDate() + 6);
                        const quarter = `${year}Q${Math.floor((saleBookingDate.getMonth() + 3) / 3)}`;
                        const executionStatus = item.execution_status;

                        // Check if the date falls within the current year, quarter, month, and week
                        if (year === currentDate.getFullYear()) {
                            // Group by Yearly
                            const yearlyKey = `${year}`;
                            if (!groupedData[yearlyKey]) groupedData[yearlyKey] = {};
                            if (!groupedData[yearlyKey]['Yearly']) groupedData[yearlyKey]['Yearly'] = {};
                            if (!groupedData[yearlyKey]['Yearly'][executionStatus]) groupedData[yearlyKey]['Yearly'][executionStatus] = 0;
                            groupedData[yearlyKey]['Yearly'][executionStatus]++;
                        }

                        if (quarter === `${currentDate.getFullYear()}Q${Math.floor((currentDate.getMonth() + 3) / 3)}`) {
                            // Group by Quarterly
                            const quarterlyKey = quarter;
                            if (!groupedData[quarterlyKey]) groupedData[quarterlyKey] = {};
                            if (!groupedData[quarterlyKey]['Quarterly']) groupedData[quarterlyKey]['Quarterly'] = {};
                            if (!groupedData[quarterlyKey]['Quarterly'][executionStatus]) groupedData[quarterlyKey]['Quarterly'][executionStatus] = 0;
                            groupedData[quarterlyKey]['Quarterly'][executionStatus]++;
                        }

                        if (month === currentDate.toISOString().slice(0, 7)) {
                            // Group by Monthly
                            const monthlyKey = month;
                            if (!groupedData[monthlyKey]) groupedData[monthlyKey] = {};
                            if (!groupedData[monthlyKey]['Monthly']) groupedData[monthlyKey]['Monthly'] = {};
                            if (!groupedData[monthlyKey]['Monthly'][executionStatus]) groupedData[monthlyKey]['Monthly'][executionStatus] = 0;
                            groupedData[monthlyKey]['Monthly'][executionStatus]++;
                        }

                        if (saleBookingDate >= currentWeekStartDate && saleBookingDate <= currentWeekEndDate) {
                            // Group by Weekly
                            const weeklyKey = `${currentWeekStartDate.toISOString().slice(0, 10)} - ${currentWeekEndDate.toISOString().slice(0, 10)}`;
                            if (!groupedData[weeklyKey]) groupedData[weeklyKey] = {};
                            if (!groupedData[weeklyKey]['Weekly']) groupedData[weeklyKey]['Weekly'] = {};
                            if (!groupedData[weeklyKey]['Weekly'][executionStatus]) groupedData[weeklyKey]['Weekly'][executionStatus] = 0;
                            groupedData[weeklyKey]['Weekly'][executionStatus]++;
                        }
                    });

                    return groupedData;
                };


                // Helper function to convert grouped data to the desired response format
                const convertToResponse = (groupedData) => {
                    const response = [];

                    for (const key in groupedData) {
                        for (const type in groupedData[key]) {
                            for (const status in groupedData[key][type]) {
                                const count = groupedData[key][type][status];
                                const entry = {
                                    interval_start: key,
                                    interval_type: type,
                                    execution_status: parseInt(status),
                                    count
                                };
                                response.push(entry);
                            }
                        }
                    }

                    return response;
                };

                // Get grouped data and convert to the desired response format
                const groupedData = groupData();
                const modifiedResponse = convertToResponse(groupedData);

                // console.log(modifiedResponse);
                return res.send(modifiedResponse);
            }
        });

        // const getcreators = await exeSum.find();
        // if (!getcreators) {
        //     res.status(500).send({ success: false });
        // }
        // res.status(200).send(getcreators);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting graph summary' });
    }
}

exports.getLatestPIDCount = async (req, res) => {
    try {
        const getcreators = await exeCountHisModel.findOne({ p_id: req.params.p_id }).sort({ creation_date: -1 });
        if (!getcreators) {
            res.status(500).send({ success: false });
        }
        res.status(200).send(getcreators);
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting all Ip Count' });
    }
};
exports.pageHealthDashboard = async (req, res) => {
    try {
        const { intervalFlag, startDate, endDate } = req.body;
        const currentDate = new Date();
        let dateFilter;

        if(startDate && endDate){
            dateFilter = {
                creation_date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }else{
         /**
         * Sets the date filter based on the given interval flag.
         * @param {number} intervalFlag - The interval flag to determine the date filter.
         * @param {Date} currentDate - The current date.
         * @returns {Object} The date filter object.
         */
 switch (intervalFlag) {
    case 1:
        // For flag 1, include last month data
        dateFilter = {
            creation_date: {
                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()),
                $lte: currentDate
            }
        };
        break;
    case 3:
        // For flag 3, include last 3 months data
        dateFilter = {
            creation_date: {
                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate()),
                $lte: currentDate
            }
        };
        break;
    case 6:
        // For flag 3, include last 6 months data
        dateFilter = {
            creation_date: {
                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate()),
                $lte: currentDate
            }
        };
        break;
    case 10:
        // For flag 4, include last 1 year data
        dateFilter = {
            creation_date: {
                $gte: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate()),
                $lte: currentDate
            }
        };
        break;
    case 2:
       // For flag 2, include all data
        dateFilter = {};
        break;
    default:
        dateFilter = {};
        break;
}
        }
       

       
        const getcreators = await exeCountHisModel.aggregate([
            {
                $sort: {
                    p_id: 1,
                    creation_date: -1
                }
            },
            {
              $match: dateFilter
            },
            {
                $group: {
                    _id: "$p_id",
                    latestDocument: { $first: "$$ROOT" },
                    p_id_count: { $sum: 1 },  // For finding how many document exists in a group set

                    //Highest values
                    maxReach: { $max: "$reach" },
                    maxImpression: { $max: "$impression" },
                    maxEngagement: { $max: "$engagement" },
                    maxStoryView: { $max: "$story_view" },
                    maxStoryViewDate: { $max: "$story_view_date" },

                    //Lowest values
                    minReach: { $min: "$reach" },
                    minImpression: { $min: "$impression" },
                    minEngagement: { $min: "$engagement" },
                    minStoryView: { $min: "$story_view" },
                    minStoryViewDate: { $min: "$story_view_date" },

                    //Average Values
                    avgReach: { $avg: "$reach" },
                    avgImpression: { $avg: "$impression" },
                    avgEngagement: { $avg: "$engagement" },
                    avgStoryView: { $avg: "$story_view" },
                    avgStoryViewDate: { $avg: "$story_view_date" },

                    // Gender specification
                    avgMalePercent: { $avg: "$male_percent" },
                    avgFemalePercent: { $avg: "$female_percent" },

                    // Age Group specification 
                    avgAge_13_17_percent: { $avg: "$Age_13_17_percent" },
                    avgAge_18_24_percent: { $avg: "$Age_18_24_percent" },
                    avgAge_25_34_percent: { $avg: "$Age_25_34_percent" },
                    avgAge_35_44_percent: { $avg: "$Age_35_44_percent" },
                    avgAge_45_54_percent: { $avg: "$Age_45_54_percent" },
                    avgAge_55_64_percent: { $avg: "$Age_55_64_percent" },
                    avgAge_65_plus_percent: { $avg: "$Age_65_plus_percent" },
                }
            },
            {
                $lookup: {
                    from: "exepurchasemodels",
                    localField: "_id",
                    foreignField: "p_id",
                    as: "exePurchaseModelData"
                }
            },
            {
                $unwind: "$exePurchaseModelData"
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$latestDocument",
                            "$exePurchaseModelData",
                            { p_id_count: "$p_id_count" },
                            //Highest values which can return in response
                            { maxReach: "$maxReach" },
                            { maxImpression: "$maxImpression" },
                            { maxEngagement: "$maxEngagement" },
                            { maxStoryView: "$maxStoryView" },
                            { maxStoryViewDate: "$maxStoryViewDate" },

                            //Average values which can return in response
                            { avgReach: "$avgReach" },
                            { avgImpression: "$avgImpression" },
                            { avgEngagement: "$avgEngagement" },
                            { avgStoryView: "$avgStoryView" },
                            { avgStoryViewDate: "$avgStoryViewDate" },

                            //Lowest values which can return in response
                            { minReach: "$minReach" },
                            { minImpression: "$minImpression" },
                            { minEngagement: "$minEngagement" },
                            { minStoryView: "$minStoryView" },
                            { minStoryViewDate: "$minStoryViewDate" },

                            // Gender specification
                            { avgMalePercent: "$avgMalePercent" },
                            { avgFemalePercent: "$avgFemalePercent" },

                            //Age Classification 
                            { avgAge_13_17_percent: "$avgAge_13_17_percent" },
                            { avgAge_18_24_percent: "$avgAge_18_24_percent" },
                            { avgAge_35_44_percent: "$avgAge_35_44_percent" },
                            { avgAge_45_54_percent: "$avgAge_45_54_percent" },
                            { avgAge_55_64_percent: "$avgAge_55_64_percent" },
                            { avgAge_65_plus_percent: "$avgAge_55_64_percent" },
                        ]
                    }
                }
            },
        ]);

        if (getcreators && getcreators.length === 0) {
            return response.returnFalse(200, req, res, 'No Record Found', {})
        }
        /**
         * Calculates the percentage of each age group based on the average age percentages
         * in the given data object. Sorts the age groups in descending order based on their
         * percentage and keeps only the top 5 age groups. Updates the data object with the
         * top 5 age group percentages and removes the individual average age percentages and
         * the total count of individuals.
         * @param {Array} getcreators - An array of data objects representing creators.
         * @returns None
         */
        for (const data of getcreators) {
            let ageGroup = [
                { ageGroup: "13-17", percentage: data?.avgAge_13_17_percent / data?.p_id_count },
                { ageGroup: "18-24", percentage: data?.avgAge_18_24_percent / data?.p_id_count },
                { ageGroup: "35-44", percentage: data?.avgAge_35_44_percent / data?.p_id_count },
                { ageGroup: "45-54", percentage: data?.avgAge_45_54_percent / data?.p_id_count },
                { ageGroup: "55-64", percentage: data?.avgAge_55_64_percent / data?.p_id_count },
                { ageGroup: "65+", percentage: data?.avgAge_65_plus_percent / data?.p_id_count },
            ];

            ageGroup.sort((a, b) => b.percentage - a.percentage);
            // Get the top 5 values
            const top5Values = ageGroup.slice(0, 5);
            data.top5AgeGroupPercentage = [...top5Values]
            // Delete specific properties
            delete data.avgAge_13_17_percent;
            delete data.avgAge_18_24_percent;
            delete data.avgAge_35_44_percent;
            delete data.avgAge_45_54_percent;
            delete data.avgAge_55_64_percent;
            delete data.avgAge_65_plus_percent;
            delete data.p_id_count;
        }

        return response.returnTrue(200, req, res, "Finding Operation Success", getcreators)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {})
    }
};

const upload = multer({ dest: "uploads/" }).fields([
    { name: "media", maxCount: 1 },
    { name: "reach_upload_image", maxCount: 1 },
    { name: "impression_upload_image", maxCount: 1 },
    { name: "engagement_upload_image", maxCount: 1 },
    { name: "story_view_upload_image", maxCount: 1 },
    { name: "story_view_upload_video", maxCount: 1 },
    { name: "city_image_upload", maxCount: 1 },
    { name: "Age_upload", maxCount: 1 },
    { name: "country_image_upload", maxCount: 1 }
]);

exports.addIPCountHistory = [upload, async (req, res) => {
    try {
        const simc = new exeCountHisModel({
            p_id: req.body.p_id,
            user_id: req.body.user_id,
            reach: req.body.reach,
            impression: req.body.impression,
            engagement: req.body.engagement,
            story_view: req.body.story_view,
            stats_for: req.body.stats_for,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            media: req.files.media ? req.files.media[0].filename : '',
            reach_upload_image: req.files.reach_upload_image ? req.files.reach_upload_image[0].filename : '',
            impression_upload_image: req.files.impression_upload_image ? req.files.impression_upload_image[0].filename : '',
            engagement_upload_image: req.files.engagement_upload_image ? req.files.engagement_upload_image[0].filename : '',
            story_view_upload_image: req.files.story_view_upload_image ? req.files.story_view_upload_image[0].filename : '',
            story_view_upload_video: req.files.story_view_upload_video ? req.files.story_view_upload_video[0].filename : '',
            city_image_upload: req.files.city_image_upload ? req.files.city_image_upload[0].filename : '',
            Age_upload: req.files.Age_upload ? req.files.Age_upload[0].filename : '',
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
            country_image_upload: req.files.country_image_upload ? req.files.country_image_upload[0].filename : '',
            stats_update_flag: true,
            story_view_date: req.body.story_view_date
        })
        const simv = await simc.save();

        res.send({ simv, status: 200 });

    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'This asset Images data cannot be created' })
    }
}];

const upload1 = multer({ dest: "uploads/" }).fields([
    { name: "media", maxCount: 1 },
    { name: "reach_upload_image", maxCount: 1 },
    { name: "impression_upload_image", maxCount: 1 },
    { name: "engagement_upload_image", maxCount: 1 },
    { name: "story_view_upload_image", maxCount: 1 },
    { name: "story_view_upload_video", maxCount: 1 },
    { name: "city_image_upload", maxCount: 1 },
    { name: "Age_upload", maxCount: 1 },
    { name: "country_image_upload", maxCount: 1 }
]);

exports.updateIPCountHistory = [upload1, async (req, res) => {
    try {

        const editIPCountHistory = await exeCountHisModel.findOneAndUpdate({ _id: req.body._id }, {
            reach: req.body.reach,
            impression: req.body.impression,
            engagement: req.body.engagement,
            story_view: req.body.story_view,
            stats_for: req.body.stats_for,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            media: req.files && req.files['media'] && req.files['media'][0] ? req.files['media'][0].filename : '',
            reach_upload_image: req.files && req.files['reach_upload_image'] && req.files['reach_upload_image'][0] ? req.files['reach_upload_image'][0].filename : '',
            impression_upload_image: req.files && req.files['impression_upload_image'] && req.files['impression_upload_image'][0] ? req.files['impression_upload_image'][0].filename : '',
            engagement_upload_image: req.files && req.files[' engagement_upload_image'] && req.files[' engagement_upload_image'][0] ? req.files[' engagement_upload_image'][0].filename : '',
            story_view_upload_image: req.files && req.files['story_view_upload_image'] && req.files['story_view_upload_image'][0] ? req.files['story_view_upload_image'][0].filename : '',
            story_view_upload_video: req.files && req.files['story_view_upload_video'] && req.files['story_view_upload_video'][0] ? req.files['story_view_upload_video'][0].filename : '',
            city_image_upload: req.files && req.files['city_image_upload'] && req.files['city_image_upload'][0] ? req.files['city_image_upload'][0].filename : '',
            Age_upload: req.files && req.files['Age_upload'] && req.files['Age_upload'][0] ? req.files['Age_upload'][0].filename : '',
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
            country_image_upload: req.files && req.files['country_image_upload'] && req.files['country_image_upload'][0] ? req.files['country_image_upload'][0].filename : '',
            stats_update_flag: true,
            story_view_date: req.body.story_view_date
        }, { new: true });
        if (!editIPCountHistory) {
            return res.status(500).send({ success: false })
        }

        return res.status(200).send({ success: true, data: editIPCountHistory })
    } catch (err) {
        return res.status(500).send({ error: err.message, sms: 'Error updating user details' })
    }
}];


exports.exeForPurchase = async (req, res) => {
    try {
        const loggedin_user_id = req.body.loggedin_user_id;
        const response = await axios.get(
            'https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList'
        )
        const responseData = response.data.body;

        const promises = responseData.map(async (data) => {
            const existingData = await checkIfDataExistsInExecutionPurchase(data.p_id);

            if (!existingData) {
                const creators = new exePurchaseModel({
                    p_id: parseInt(data.p_id),
                    page_name: data.page_name,
                    cat_name: data.cat_name,
                    platform: data.platform,
                    follower_count: parseInt(data.follower_count),
                    page_link: data.page_link,
                    vendor_id: parseInt(data.vendor_id)
                });
                return creators.save();
            } else {
                return { message: `Data already insterted this ` }; // or handle the case where data already exists
            }
        });

        const results = await Promise.all(promises);
        return res.send({ instav: results, status: 200 })
        // for (const data of responseData) {

        //     const existingData = await checkIfDataExists(data.p_id)

        //     if (!existingData) {

        //         const creators = new exePurchaseModel({
        //             p_id: parseInt(data.p_id),
        //             page_name: data.page_name,
        //             cat_name: data.cat_name,
        //             platform: data.platform,
        //             follower_count: parseInt(data.follower_count),
        //             page_link: data.page_link,
        //             vendor_id: parseInt(data.vendor_id)
        //         })
        //         const instav = await creators.save();

        //         return res.send({ instav, status: 200 })
        //     }else{
        //       return  res.status(200).json({msg:"Data already insterted there is no new data available to insert."})
        //     }
        // }
    } catch (error) {
        return res.status(500).send({ error: error.message, sms: 'error while adding data' })
    }
}

exports.getAllExeHistory = async (req, res) => {
    try {
        const cocData = await exeSum.find({});
        res.status(200).send({ data: cocData })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'error getting all data of exe summary' })
    }
}

// exports.getAllExeHistory = async (req, res) => {
//     try {
//         const simc = await exeSum
//         .aggregate([
//           {
//             $lookup: {
//               from: "usermodels",
//               localField: "user_id",
//               foreignField: "user_id",
//               as: "user",
//             },
//           },
//           {
//             $unwind: {
//               path: "$user",
//               preserveNullAndEmptyArrays: true,
//             },
//           },

//           {
//             $project: {
//              _id:"$_id",   
//              id:"$id",
//              sale_booking_execution_id:"$sale_booking_execution_id",
//              sale_booking_id:"$sale_booking_id",
//              start_date_:"$start_date_",
//              end_date:"$end_date",
//              summary: "$summary",
//              remarks: "$remarks",
//              created_by: "$created_by",
//              last_updated_by: "$last_updated_by",
//              creation_date: "$creation_date",
//              last_updated_date: "$last_updated_date",
//              sale_booking_date: "$sale_booking_date",
//              campaign_amount: "$campaign_amount",
//              execution_date: "$execution_date",
//              execution_remark: "$executon_remark",
//              execution_done_by: "$execution_done_by",
//              cust_name: "$cust_name",
//              loggedin_user_id: "$loggedin_user_id",
//              execution_status: "$execution_status",
//              payment_update_id: "$payment_update_id",
//              payment_type: "$payment_type",
//              status_desc: "$status_desc",
//              invoice_creation_status: "$invoice_creation_status",
//              manager_approval:"$manager_approval" ,
//              invoice_particular: "$invoice_particular" ,
//              payment_status_show: "$payment_status_show",
//              sales_executive_name: "$sales_executive_name",
//              page_ids: "$page_ids",
//              service_id: "service_id",
//              service_name: "$service_name",
//              execution_excel: "$execution_excel",
//              total_paid_amount: "$total_paid_amount",
//              credit_approval_amount: "$credit_approval_amount",
//              credit_approval_date: "$credit_approval_date",
//              credit_approval_by: "$credit_approval_by",
//              campaign_amount_without_gst: "$campaign_amount_without_gst",
//              start_date: "$start_date",
//              user_name:"$user.user_name"
//             },
//           },
//         ])
//         .exec();
//       if (!simc) {
//         res.status(500).send({ success: false });
//       }
//       res.status(200).send({ data: simc });
//         // const cocData = await exeSum.find({});
//         // res.status(200).send({data:cocData})
//     } catch (error) {
//         res.status(500).send({error:error.message, sms:'error getting all data of exe summary'})
//     }
// }

exports.getExeIpCountHistory = async (req, res) => {
    try {
        const cocData = await exeCountHisModel.find({ p_id: req.params.p_id, stats_update_flag: true }).lean();
        const exeImagesBaseUrl = "http://34.93.221.166:3000/uploads/";
        const dataWithImageUrl = cocData.map((exe) => ({
            ...exe,
            media_url: exe.media ? exeImagesBaseUrl + exe.media : null,
            reach_upload_image_url: exe.reach_upload_image ? exeImagesBaseUrl + exe.reach_upload_image : null,
            impression_upload_image_url: exe.impression_upload_image ? exeImagesBaseUrl + exe.impression_upload_image : null,
            engagement_upload_image_url: exe.engagement_upload_image ? exeImagesBaseUrl + exe.engagement_upload_image : null,
            story_view_upload_image_url: exe.story_view_upload_image ? exeImagesBaseUrl + exe.story_view_upload_image : null,
            story_view_upload_video_url: exe.story_view_upload_video ? exeImagesBaseUrl + exe.story_view_upload_video : null,
            city_image_upload_url: exe.city_image_upload ? exeImagesBaseUrl + exe.city_image_upload : null,
            Age_upload_url: exe.Age_upload ? exeImagesBaseUrl + exe.Age_upload : null,
            country_image_upload_url: exe.country_image_upload ? exeImagesBaseUrl + exe.country_image_upload : null
        }));
        if (dataWithImageUrl?.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            const result = dataWithImageUrl;
            res.status(200).send({ data: result });
        }
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'error getting stats history for this page' })
    }
}

exports.deleteExeIpCountHistory = async (req, res) => {
    try {
        const deletedHistory = await exeCountHisModel.findByIdAndUpdate(
            req.params._id,
            { isDeleted: true },
            { new: true }
        );

        if (!deletedHistory) {
            return res.status(404).json({ message: 'History not found' });
        }

        res.json(deletedHistory);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.getPercentage = async (req, res) => {
    try {
        const latestEntry = await exeCountHisModel
            .findOne({
                p_id: parseInt(req.body.p_id),
            })
            .sort({ creation_date: -1 })
            .exec();

        if (latestEntry) {
            let count = 0;
            const relevantFields = [
                'reach',
                'impression',
                'engagement',
                'story_view',
                'stats_for',
                'start_date',
                'end_date',
                'reach_upload_image',
                'impression_upload_image',
                'engagement_upload_image',
                'story_view_upload_image',
                'story_view_upload_video',
                'city1_name',
                'city2_name',
                'city3_name',
                'city4_name',
                'city5_name',
                'percentage_city1_name',
                'percentage_city2_name',
                'percentage_city3_name',
                'percentage_city4_name',
                'percentage_city5_name',
                'city_image_upload',
                'male_percent',
                'female_percent',
                'Age_13_17_percent',
                'Age_upload',
                'Age_18_24_percent',
                'Age_25_34_percent',
                'Age_35_44_percent',
                'Age_45_54_percent',
                'Age_55_64_percent',
                'Age_65_plus_percent',
                'quater',
                'profile_visit',
                'country1_name',
                'country2_name',
                'country3_name',
                'country4_name',
                'country5_name',
                'percentage_country1_name',
                'percentage_country2_name',
                'percentage_country3_name',
                'percentage_country4_name',
                'percentage_country5_name',
                'country_image_upload'
            ];

            for (const field of relevantFields) {
                if (
                    latestEntry[field] !== null &&
                    latestEntry[field] !== '' &&
                    latestEntry[field] !== 0
                ) {
                    count++;
                }
            }

            const totalPercentage = (count / 46) * 100;
            res.status(200).send({ latestEntry, totalPercentage: totalPercentage });
        } else {
            res.status(404).json({ message: 'Latest Entry not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getStatUpdateFlag = async (req, res) => {
    try {
        const latestEntry = await exeCountHisModel.findOne({ p_id: req.params.p_id, isDeleted: false }).sort({ creation_date: -1 }).exec();

        if (latestEntry) {
            res.status(200).send({ latestEntry });
        } else {
            res.status(404).json({ message: 'Latest Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Internal Server Error' });
    }
};


exports.getDistinctExeCountHistory = async (req, res) => {
    try {
        let query = {};
        if (req.params.p_id) {
            query.p_id = parseInt(req.params.p_id);
        }

        const distinctPIds = await exeCountHisModel.distinct("p_id", query);

        const distinctEntries = await Promise.all(
            distinctPIds.map(async (p_id) => {
                const latestEntry = await exeCountHisModel
                    .findOne({ p_id })
                    .sort({ creation_date: -1 })
                    .lean();

                const exeImagesBaseUrl = "http://34.93.221.166:3000/uploads/";

                // Map URLs here if needed, similar to your existing logic
                const dataWithImageUrl = {
                    ...latestEntry,
                    media_url: latestEntry.media ? exeImagesBaseUrl + latestEntry.media : null,
                    reach_upload_image_url: latestEntry.reach_upload_image ? exeImagesBaseUrl + latestEntry.reach_upload_image : null,
                    impression_upload_image_url: latestEntry.impression_upload_image ? exeImagesBaseUrl + latestEntry.impression_upload_image : null,
                    engagement_upload_image_url: latestEntry.engagement_upload_image ? exeImagesBaseUrl + latestEntry.engagement_upload_image : null,
                    story_view_upload_image_url: latestEntry.story_view_upload_image ? exeImagesBaseUrl + latestEntry.story_view_upload_image : null,
                    story_view_upload_video_url: latestEntry.story_view_upload_video ? exeImagesBaseUrl + latestEntry.story_view_upload_video : null,
                    city_image_upload_url: latestEntry.city_image_upload ? exeImagesBaseUrl + latestEntry.city_image_upload : null,
                    Age_upload_url: latestEntry.Age_upload ? exeImagesBaseUrl + latestEntry.Age_upload : null,
                    country_image_upload_url: latestEntry.country_image_upload ? exeImagesBaseUrl + latestEntry.country_image_upload : null
                };

                return dataWithImageUrl;
            })
        );

        res.status(200).send({ data: distinctEntries });
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'Error getting distinct data of exe summary' });
    }
}

// exports.getAllExePurchase = async (req, res) => {
//     try {
//         const allEntries = await exePurchaseModel.find({});
//         const result = [];

//         const relevantFields = [
//             'reach', 'impression', 'engagement', 'story_view', 'stats_for',
//             'start_date', 'end_date', 'reach_upload_image', 'impression_upload_image',
//             'engagement_upload_image', 'story_view_upload_image', 'story_view_upload_video',
//             'city1_name', 'city2_name', 'city3_name', 'city4_name', 'city5_name',
//             'percentage_city1_name', 'percentage_city2_name', 'percentage_city3_name',
//             'percentage_city4_name', 'percentage_city5_name', 'city_image_upload',
//             'male_percent', 'female_percent', 'Age_13_17_percent', 'Age_upload',
//             'Age_18_24_percent', 'Age_25_34_percent', 'Age_35_44_percent',
//             'Age_45_54_percent', 'Age_55_64_percent', 'Age_65_plus_percent',
//             'quater', 'profile_visit', 'country1_name', 'country2_name',
//             'country3_name', 'country4_name', 'country5_name',
//             'percentage_country1_name', 'percentage_country2_name',
//             'percentage_country3_name', 'percentage_country4_name',
//             'percentage_country5_name', 'country_image_upload'
//         ];

//         const latestEntries = await exeCountHisModel.find()
//             .sort({ creation_date: -1 })
//             .exec();

//         for (let i = 0; i < allEntries.length; i++) {
//             const entry = allEntries[i];
//             const latestEntry = latestEntries[i];

//             if (latestEntry) {
//                 const count = relevantFields.filter(field =>
//                     latestEntry[field] !== null &&
//                     latestEntry[field] !== '' &&
//                     latestEntry[field] !== 0
//                 ).length;

//                 const totalPercentage = (count / relevantFields.length) * 100;

//                 result.push({
//                     page_name: entry.page_name,
//                     cat_name: entry.cat_name,
//                     follower_count: entry.follower_count,
//                     page_link: entry.page_link,
//                     platform: entry.platform,
//                     latestEntry,
//                     totalPercentage
//                 });
//             }
//         }

//         res.status(200).send({ result });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message, message: 'Internal Server Error' });
//     }
// };

exports.getAllExePurchase = async (req, res) => {
    try {
        const allEntries = await exePurchaseModel.find({});
        const result = [];

        const relevantFields = [
            'reach', 'impression', 'engagement', 'story_view', 'stats_for',
            'start_date', 'end_date', 'reach_upload_image', 'impression_upload_image',
            'engagement_upload_image', 'story_view_upload_image', 'story_view_upload_video',
            'city1_name', 'city2_name', 'city3_name', 'city4_name', 'city5_name',
            'percentage_city1_name', 'percentage_city2_name', 'percentage_city3_name',
            'percentage_city4_name', 'percentage_city5_name', 'city_image_upload',
            'male_percent', 'female_percent', 'Age_13_17_percent', 'Age_upload',
            'Age_18_24_percent', 'Age_25_34_percent', 'Age_35_44_percent',
            'Age_45_54_percent', 'Age_55_64_percent', 'Age_65_plus_percent',
            'quater', 'profile_visit', 'country1_name', 'country2_name',
            'country3_name', 'country4_name', 'country5_name',
            'percentage_country1_name', 'percentage_country2_name',
            'percentage_country3_name', 'percentage_country4_name',
            'percentage_country5_name', 'country_image_upload'
        ];

        for (let i = 0; i < allEntries.length; i++) {
            const entry = allEntries[i];

            const latestEntry = await exeCountHisModel.findOne({ p_id: entry.p_id })
                .exec();

            const totalPercentage = latestEntry ? relevantFields.reduce((total, field) => {
                if (
                    latestEntry[field] !== null &&
                    latestEntry[field] !== '' &&
                    latestEntry[field] !== 0
                ) {
                    return total + 1;
                }
                return total;
            }, 0) / relevantFields.length * 100 : 0;

            result.push({
                p_id : entry.p_id,
                page_name: entry.page_name,
                cat_name: entry.cat_name,
                follower_count: entry.follower_count,
                page_link: entry.page_link,
                platform: entry.platform,
                latestEntry,
                totalPercentage
            });
        }
        res.status(200).send({ result });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Internal Server Error' });
    }
};


