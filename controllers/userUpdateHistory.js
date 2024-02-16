const response = require("../common/response.js");
const userModel = require("../models/userModel.js");
const userUpdateHistoryModel = require("../models/userUpdateHistoryModel.js");

// exports.addUserUpdateHistory = async (req, res) => {
//     try {
//         const { user_id, user_name, job_type, user_email_id, user_login_id } = req.body;

//         const userData = await userModel.findOne({ user_id: user_id });

//         if (!userData) {
//             return res.status(404).send("User not found");
//         }

//         if (user_name !== userData.user_name || job_type !== userData.job_type || user_email_id !== userData.user_email_id || user_login_id !== userData.user_login_id) {
//             const previousValue = {};
//             const currentValue = {};

//             if (user_name !== userData.user_name) {
//                 previousValue.user_name = userData.user_name;
//                 currentValue.user_name = user_name;
//             }
//             if (job_type !== userData.job_type) {
//                 previousValue.job_type = userData.job_type;
//                 currentValue.job_type = job_type;
//             }
//             if (user_email_id !== userData.user_email_id) {
//                 previousValue.user_email_id = userData.user_email_id;
//                 currentValue.user_email_id = user_email_id;
//             }
//             if (user_login_id !== userData.user_login_id) {
//                 previousValue.user_login_id = userData.user_login_id;
//                 currentValue.user_login_id = user_login_id;
//             }
//             const updateHistoryDocument = {
//                 user_id: userData.user_id,
//                 previous_value: previousValue,
//                 current_value: currentValue,
//                 created_by: 0,
//                 last_updated_by: 0,
//                 last_updated_date: new Date(),
//                 creation_date: new Date(),
//             };

//             await userUpdateHistoryModel.create(updateHistoryDocument);
//         }

//         return res.status(200).send("User data updated and history recorded");
//     } catch (error) {
//         console.error("Error in UserUpdateHistory:", error);
//         return res.status(500).send("Internal Server Error");
//     }
// };

exports.addUserUpdateHistory = async (req, res) => {
    try {
        const { user_id } = req.body;

        const userData = await userModel.findOne({ user_id });

        if (!userData) {
            return res.status(404).send("User not found");
        }

        const previousValue = {};
        const currentValue = {};

        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if (userData[key] !== req.body[key]) {
                    previousValue[key] = userData[key];
                    currentValue[key] = req.body[key];
                }
            }
        }

        if (Object.keys(previousValue).length === 0) {
            return res.status(200).send("User data not updated");
        }

        const updateHistoryDocument = {
            user_id: userData.user_id,
            previous_value: previousValue,
            current_value: currentValue,
            created_by: 0,
            last_updated_by: 0,
            last_updated_date: new Date(),
            creation_date: new Date(),
        };

        await userUpdateHistoryModel.create(updateHistoryDocument);

        return res.status(200).send("User data updated and history recorded");
    } catch (error) {
        console.error("Error in UserUpdateHistory:", error);
        return res.status(500).send("Internal Server Error");
    }
};

exports.getSingleUserUpdateHistory = async (req, res) => {
    try {
        const singleupdate = await userUpdateHistoryModel.findOne({
            user_id: parseInt(req.params.user_id),
        });
        if (!singleupdate) {
            return response.returnFalse(200, req, res, "No Reord Found...", {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "singleupdate Fetch Successfully",
            singleupdate
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};