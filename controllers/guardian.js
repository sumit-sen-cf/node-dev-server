const response = require("../common/response.js");
const guardianModel = require("../models/guardianModel.js");
const userModel = require("../models/userModel.js");

exports.addGuardian = async (req, res) => {
    try {
        const latestUser = await userModel.findOne({}, { user_id: 1 }).sort({ user_id: -1 });
        const incrementedUser = latestUser.user_id;
        const guardian = new guardianModel({
            user_id: incrementedUser,
            guardian_name: req.body.guardian_name,
            guardian_contact: req.body.guardian_contact,
            guardian_address: req.body.guardian_address,
            relation_with_guardian: req.body.relation_with_guardian
        });
        const simv = await guardian.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Guardian Created Successfully",
            simv
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getGuardians = async (req, res) => {
    try {
        const guardians = await guardianModel.find();
        if (!guardians) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        res.status(200).send(guardians)
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleGuardian = async (req, res) => {
    try {
        const singleGuardian = await guardianModel.find({
            user_id: parseInt(req.params.user_id),
        });
        if (!singleGuardian) {
            return response.returnFalse(200, req, res, "No Reord Found...", {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Guardian Data Fetch Successfully",
            singleGuardian
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.editGuardian = async (req, res) => {
    try {

        if (!req.body.guardian_id) {
            const newGuardian = new guardianModel({
                user_id: req.body.user_id,
                guardian_name: req.body.guardian_name,
                guardian_contact: req.body.guardian_contact,
                guardian_address: req.body.guardian_address,
                relation_with_guardian: req.body.relation_with_guardian
            });

            const savedGuardian = await newGuardian.save();
            return response.returnTrue(200, req, res, "Guardian Added Successfully", savedGuardian);
        }

        const updateFields = {};
        const allowedFields = ['user_id', 'guardian_name', 'contact', 'address', 'relation_with_guardian'];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });
        const editGuardian = await guardianModel.findOneAndUpdate(
            { Guardian_id: parseInt(req.body.guardian_id) },
            updateFields,
            { new: true }
        );

        if (!editGuardian) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Record Found With This Guardian Id",
                {}
            );
        }

        return response.returnTrue(200, req, res, "Updation Successfully", editGuardian);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteGuardian = async (req, res) => {
    guardianModel.deleteOne({ guardian_id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'Guardian deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Guardian not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};