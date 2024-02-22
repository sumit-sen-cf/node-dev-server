const response = require("../common/response.js");
const nodePhpVendorPaymentModeModel = require("../models/nodePhpVendorPaymentMode.js");

exports.addPaymentMode = async (req, res) => {
    try {
        //check the alredy exist data then return error
        const paymentModeData = await nodePhpVendorPaymentModeModel.findOne({
            payment_mode: req.body.payment_mode
        })
        if (paymentModeData) {
            return response.returnFalse(409, req, res, "Payment Mode Name is already exist", {});
        }

        //for creation data is to add
        const paymentMode = new nodePhpVendorPaymentModeModel({
            payment_mode: req.body.payment_mode,
            created_by: req.body.created_by
        });

        //save in DB
        const simv = await paymentMode.save();
        //success response send
        return response.returnTrue(
            200,
            req,
            res,
            "Payment Mode Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getAllPaymentMode = async (req, res) => {
    try {
        //get all data in DB collection
        const paymentModeData = await nodePhpVendorPaymentModeModel.aggregate([
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "userData",
                },
            }, {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                },
            }, {
                $project: {
                    _id: 1,
                    payment_mode: 1,
                    created_by: 1,
                    created_by_name: "$userData.user_name",
                    created_on: 1,
                    updated_on: 1,
                }
            }
        ]);

        //if data not found
        if (!paymentModeData) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        //return success response
        res.status(200).send(paymentModeData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSinglePaymentMode = async (req, res) => {
    try {
        //get data by id
        const paymentModeData = await nodePhpVendorPaymentModeModel.findOne({
            _id: req.params._id
        });

        //if not found then error return
        if (!paymentModeData) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }

        //return succes response
        res.status(200).send(paymentModeData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editPaymentMode = async (req, res) => {
    try {
        //find by id and update data
        const editPaymentMode = await nodePhpVendorPaymentModeModel.findOneAndUpdate({
            _id: req.params._id
        }, {
            payment_mode: req.body.payment_mode
        }, {
            new: true
        });

        //if not update then error return
        if (!editPaymentMode) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Record Found",
                {}
            );
        }

        //success response send
        return response.returnTrue(200, req, res, "Updation Successfully", editPaymentMode);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deletePaymentMode = async (req, res) => {
    //deleted data by id
    await nodePhpVendorPaymentModeModel.deleteOne({
        _id: req.params._id
    }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'payment Mode deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'payment Mode not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};