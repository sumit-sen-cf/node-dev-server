const response = require("../common/response.js");
const assetVendorSumModel = require("../models/assetVendorSumModel.js");
const userModel = require("../models/userModel.js");


exports.addVendorSum = async (req, res) => {
    try {
        const assetVendorSum = new assetVendorSumModel({
            sim_id: req.body.sim_id,
            vendor_id: req.body.vendor_id,
            send_date: req.body.send_date,
            send_by: req.body.send_by,
            expected_date_of_repair: req.body.expected_date_of_repair,
            vendor_status: req.body.vendor_status
        });
        const assetVendorSumData = await assetVendorSum.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Asset Vendor Summary added Successfully",
            assetVendorSumData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});

    }
};


exports.getVendorSums = async (req, res) => {
    try {

        const assetVendorSumDatas = await assetVendorSumModel
            .aggregate([
                {
                    $lookup: {
                        from: "simmodels",
                        localField: "sim_id",
                        foreignField: "sim_id",
                        as: "simData",
                    },
                },
                {
                    $unwind: {
                        path: "$simData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "vendormodels",
                        localField: "vendor_id",
                        foreignField: "vendor_id",
                        as: "vendorData",
                    },
                },
                {
                    $unwind: {
                        path: "$vendorData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "send_by",
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
                        vendor_id: 1,
                        send_date: 1,
                        sim_id: 1,
                        send_by: 1,
                        assetsName: "$simData.assetsName",
                        vendor_name: "$vendorData.vendor_name",
                        send_by_name: "$userData.user_name",
                        expected_date_of_repair: 1,
                        vendor_status: 1
                    },
                }
            ]);

        res.status(200).send({ data: assetVendorSumDatas });
    } catch (err) {
        res
            .status(500)
            .send({ error: err.message, message: "Error getting all Vendor Summary Data" });
    }
};


exports.getAllHR = async (req, res) => {
    try {
        const hrdatas = await userModel.find({ role_id: 5 }).select({ user_id: 1, user_name: 1 });
        if (!hrdatas) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        res.status(200).send(hrdatas)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editVendorSum = async (req, res) => {
    try {

        if (req.body.id) {
            const editVendorSum = await assetVendorSumModel.findOneAndUpdate(
                { sim_id: req.body.id },
                {
                    vendor_status: req.body.vendor_status,
                    vendor_recieve_date: req.body.vendor_recieve_date,
                    vendor_recieve_remark: req.body.vendor_recieve_remark
                },
                { new: true }
            );
            if (!editVendorSum) {
                res.status(500).send({ success: false });
            }

            return res.status(200).send({ success: true, data: editVendorSum });
        } else {
            const assetVendorSum = new assetVendorSumModel({
                sim_id: req.body.sim_id,
                vendor_id: req.body.vendor_id,
                send_date: req.body.send_date,
                send_by: req.body.send_by,
                expected_date_of_repair: req.body.expected_date_of_repair,
                vendor_status: req.body.vendor_status
            });
            const assetVendorSumData = await assetVendorSum.save();
            return response.returnTrue(
                200,
                req,
                res,
                "Asset Vendor Summary added Successfully",
                assetVendorSumData
            );
        }

    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, sms: "Error updating vendor sum details" });
    }
};
