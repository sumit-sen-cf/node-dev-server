const response = require("../common/response.js");
const userTrainingModel = require("../models/userTrainingModel.js");

exports.addUserTraining = async (req, res) => {
    try {
        const userTraining = new userTrainingModel({
            user_id: req.body.user_id,
            remark: req.body.remark,
            created_by: req.body.created_by,
            training_date: req.body.training_date
        });
        const userTrainingData = await userTraining.save();
        return response.returnTrue(
            200,
            req,
            res,
            "User Training Created Successfully",
            userTrainingData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getUserTrainings = async (req, res) => {
    try {
        const userTrainings = await userTrainingModel
            .aggregate([
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "user_data",
                    },
                },
                {
                    $unwind: "$user_data",
                },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        remark: 1,
                        created_by: 1,
                        training_date: 1,
                        created_by_name: "$user_data.user_name"
                    },
                },
            ])
            .exec();

        if (!userTrainings) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }

        return res.status(200).send(userTrainings);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleUserTraining = async (req, res) => {
    try {
        const singleUserTraining = await userTrainingModel
            .aggregate([
                {
                    $match: { user_id: parseInt(req.params.user_id) },
                },
                {
                    $lookup: {
                        from: "usermodels",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: "user_data",
                    },
                },
                {
                    $unwind: "$user_data",
                },
                {
                    $project: {
                        _id: 1,
                        user_id: 1,
                        remark: 1,
                        created_by: 1,
                        training_date: 1,
                        created_by_name: "$user_data.user_name"
                    },
                },
            ])
            .exec();

        if (!singleUserTraining) {
            return response.returnFalse(200, req, res, "No Reord Found...", {});
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Vendor Data Fetch Successfully",
            singleUserTraining
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editUserTraining = async (req, res) => {
    try {
        const editUserTraining = await userTrainingModel.findOneAndUpdate(
            { _id: parseInt(req.body._id) },
            {
                user_id: req.body.user_id,
                remark: req.body.remark,
                created_by: req.body.created_by,
                training_date: req.body.training_date
            },
            { new: true }
        );
        if (!editUserTraining) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found With This User Training Id",
                {}
            );
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editUserTraining);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteUserTraining = async (req, res) => {
    userTrainingModel.deleteOne({ _id: req.params._id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'User Training deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'User Training not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err.message })
    })
};