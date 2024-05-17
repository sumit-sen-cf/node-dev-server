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

/**
 * Middleware to validate the account Point of Contact (PoC) details in the request body.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.accountPocValidation = async (req, res, next) => {
    const body = req.body; // Extracting the request body

    // Defining the validation schema using Joi
    const schema = Joi.object({
        account_id: Joi.optional(), // account_id is optional
        contact_name: Joi.string().required().messages(), // contact_name is a required string
        contact_no: Joi.number().min(1000000000).max(99999999999999).required().messages(), // contact_no is a required number within specified range
        alternative_contact_no: Joi.number().min(1000000000).max(99999999999999).messages(), // alternative_contact_no is an optional number within specified range
        email: Joi.string().email().required().messages(),
        department: Joi.string().required().messages(),
        designation: Joi.string().required().messages(),
        description: Joi.string().min(5).max(2000).required(),
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

/**
 * Middleware to validate the account document master details in the request body.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.accountDocumentMasterValidation = async (req, res, next) => {
    const body = req.body; // Extracting the request body

    // Defining the validation schema using Joi
    const schema = Joi.object({
        document_name: Joi.string().required(),
        is_visible: Joi.boolean().invalid(false),
        description: Joi.string().min(5).max(2000).required(),
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