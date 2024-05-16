const Joi = require("joi");
const response = require('../common/response');

//error response validate
const joiValidationErrorConvertor = (errors) => {
    let error_message = "";
    errors.forEach((element, index) => {
        error_message = element.message;
        return true;
    });
    error_message = error_message.replaceAll("/", " ");
    error_message = error_message.replaceAll("_", " ");
    return error_message;
};

//account company type validation check
exports.accountCompanyTypeValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        company_type_name: Joi.string().required(),
        description: Joi.string().min(5).max(200).required(),
        created_by: Joi.optional(),
        updated_by: Joi.optional(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(200, req, res, errors);
    } else {
        next();
    }
};

//account type validation check
exports.accountTypeValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        account_type_name: Joi.string().required(),
        description: Joi.string().min(5).max(200).required(),
        created_by: Joi.optional(),
        updated_by: Joi.optional(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(200, req, res, errors);
    } else {
        next();
    }
};


exports.accountPocValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        account_id: Joi.optional(),
        contact_name: Joi.string().required().messages(),
        contact_no: Joi.number().min(1000000000).max(99999999999999).required().messages(),
        alternative_contact_no: Joi.number().min(1000000000).max(99999999999999).messages(),
        email: Joi.string().email().required().messages(),
        department: Joi.string().required().messages(),
        designation: Joi.string().required().messages(),
        description: Joi.string().min(5).max(20).required(),
        created_by: Joi.optional(),
        updated_by: Joi.optional(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(200, req, res, errors);
    } else {
        next();
    }
};


