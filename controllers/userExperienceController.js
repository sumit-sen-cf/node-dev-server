const userPreviousYearExperienceModel = require("../models/userPreviousYearExperienceModel");
const response = require("../common/response");

exports.editUserExperience = async (req, res) => {
    try {

        if (!req.body.user_experience_id) {
            const newUserExpData = new userPreviousYearExperienceModel({
                user_id: req.body.user_id,
                name_of_organization: req.body.name_of_organization,
                period_of_service_from: req.body.period_of_service_from,
                period_of_service_to: req.body.period_of_service_to,
                designation: req.body.designation,
                gross_salary: req.body.gross_salary,
                manager_name: req.body.manager_name,
                manager_email: req.body.manager_email,
                manager_phone: req.body.manager_phone,
                hr_name: req.body.hr_name,
                hr_email: req.body.hr_email,
                hr_phone: req.body.hr_phone
            });

            const savedNewUserExpData = await newUserExpData.save();
            return response.returnTrue(200, req, res, "User Experience Added Successfully", savedNewUserExpData);
        }

        const updateFields = {};
        const allowedFields = [
            'user_id',
            'name_of_organization',
            'period_of_service_from',
            'period_of_service_to',
            'designation',
            'gross_salary',
            'manager_name',
            'manager_email',
            'manager_phone',
            'hr_name',
            'hr_email',
            'hr_phone'
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });
        const editUserExpData = await userPreviousYearExperienceModel.findOneAndUpdate(
            { user_experience_id: parseInt(req.body.user_experience_id) },
            updateFields,
            { new: true }
        );

        if (!editUserExpData) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Record Found With This User Experience ID",
                {}
            );
        }

        return response.returnTrue(200, req, res, "User Experience Updation Successfully", editUserExpData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getUserExperiences = async (req, res) => {
    try {
        const data = await userPreviousYearExperienceModel.find();

        if (!data) {
            return response.returnFalse(200, req, res, "No Reord Found...", []);
        }
        return response.returnTrue(
            200,
            req,
            res,
            "User Experience Data Fetch Successfully",
            data
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleUserExperience = async (req, res) => {
    try {
        const singleUserExpData = await userPreviousYearExperienceModel.find({
            user_id: parseInt(req.params.user_id),
        });
        if (!singleUserExpData) {
            return response.returnFalse(200, req, res, "No Reord Found...", {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Single User Experience Data Fetch Successfully",
            singleUserExpData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteUserExperience = async (req, res) => {
    userPreviousYearExperienceModel.deleteOne({ user_experience_id: req.params.id }).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'user experience data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'user experience data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};