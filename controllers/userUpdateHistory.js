const userModel = require("../models/userModel.js");
const userUpdateHistoryModel = require("../models/userUpdateHistoryModel.js");

const UserUpdateHistory = async (req, res) => {
    const user_id = req.params.user_id;
    const obj = req.body;

    try {
        const userData = await userModel.findOne({ user_id: user_id });
        if (!userData) {
            return res.status(404).send("User not found");
        }

        // Compare userData with obj
        const differences = Object.keys(obj).filter(key => obj[key] !== userData[key]);

        if (differences.length > 0) {
            // Insert data into userUpdateHistoryModel
            const updateHistoryDocument = {
                user_id: userData.user_id,
                updated_fields: differences,
                updated_data: obj,
                updated_at: new Date()
            };

            await userUpdateHistoryModel.create(updateHistoryDocument);

            return res.status(200).send("User data updated and history recorded");
        } else {
            return res.status(200).send("No changes detected in user data");
        }
    } catch (error) {
        console.error("Error in UserUpdateHistory:", error);
        return res.status(500).send("Internal Server Error");
    }
};