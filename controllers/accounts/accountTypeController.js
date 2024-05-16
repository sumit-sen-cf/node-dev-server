const accountTypesModel = require("../../models/accounts/accountTypesModel");
const { message } = require("../../common/message")
const Joi = require("joi");

/**
 * Api is to used for the add_account_type data in the DB collection.
 */
exports.addAccountType = async (req, res) => {
    try {
        const checkDuplicacy = await accountTypesModel.findOne({ account_type_name: req.body.account_type_name });
        // if check duplicacy account_type_name
        if (checkDuplicacy) {
            return res.status(403).json({
                status: 403,
                message: "Account type name alredy exist!",
            });
        }
        const { account_type_name, description, created_by, updated_by } = req.body;
        // validation used in joi 
        const schema = await Joi.object({
            account_type_name: Joi.string().required().messages({
                "string.empty": `account_type_name is a required field.`,
                "string.account_type_name": `please enter valid account_type_name.`
            }),
            description: Joi.string().min(5).max(200).required().messages({
                "string.empty": `description is a required field.`,
                "string.min": `description must be at least 8 characters long.`,
                "string.max": `description must be at least 100 characters short.`
            })
        });
        const validation = schema.validate({
            account_type_name: account_type_name,
            description: description,
        });

        if (validation.error) {
            return res.status(422).send({
                status: 422,
                message: validation.error.details,
            });
        }
        //add account data
        const createAccountTypeData = new accountTypesModel({
            account_type_name: account_type_name,
            description: description,
            created_by: created_by,
            updated_by: updated_by
        });
        await createAccountTypeData.save();
        return res.status(200).json({
            status: 200,
            message: "Account type data added successfully!",
            data: createAccountTypeData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

