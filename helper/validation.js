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
        return response.returnFalse(400, req, res, errors);
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
        return response.returnFalse(400, req, res, errors);
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
        account_id: Joi.number().required(), // account_id is optional
        contact_name: Joi.string().required(), // contact_name is a required string
        contact_no: Joi.number().min(1000000000).max(99999999999999).required(), // contact_no is a required number within specified range
        alternative_contact_no: Joi.number().min(1000000000).max(99999999999999).optional(), // alternative_contact_no is an optional number within specified range
        email: Joi.string().email().required(),
        department: Joi.string().optional(),
        designation: Joi.string().optional(),
        description: Joi.string().min(5).max(2000).optional(),
        created_by: Joi.optional(),
        updated_by: Joi.optional(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
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
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};

/**
 * Middleware to validate the account document overview details in the request body.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.accountDocumentOverviewValidation = async (req, res, next) => {
    const body = req.body; // Extracting the request body

    // Defining the validation schema using Joi
    const schema = Joi.object({
        account_id: Joi.optional(), // account_id is optional
        document_master_id: Joi.string(), // document_master_id is optional
        document_image_upload: Joi.string(),
        document_no: Joi.string().pattern(/^[a-zA-Z0-9]+$/),
        description: Joi.string().min(5).max(2000),
        created_by: Joi.optional(),
        updated_by: Joi.optional(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};
//@2 PMS Vendor Type Master collection Validations

exports.addVendorTypeValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        type_name: Joi.required(),
        description: Joi.optional(),
        created_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};
exports.updateVendorTypeValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        id: Joi.required(),
        type_name: Joi.optional(),
        description: Joi.optional(),
        // created_by: Joi.number().optional(),
        last_updated_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};


//@2 PMS Vendor Platform Master collection Validations

exports.addVendorPlatformValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        platform_name: Joi.required(),
        description: Joi.optional(),
        created_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};
exports.updateVendorPlatformValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        id: Joi.required(),
        platform_name: Joi.optional(),
        description: Joi.optional(),
        // created_by: Joi.number().optional(),
        last_updated_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};

//@2 PMS Vendor Payment Method Master collection Validations

exports.addPaymentMethodValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        payMethod_name: Joi.required(),
        description: Joi.optional(),
        created_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};
exports.updatePaymentMethodValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        id: Joi.required(),
        payMethod_name: Joi.optional(),
        description: Joi.optional(),
        // created_by: Joi.number().optional(),
        last_updated_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};

//@2 PMS Vendor Pay Cycle  Master collection Validations

exports.addPayCycleValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        cycle_name: Joi.required(),
        description: Joi.optional(),
        created_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};
exports.updatePayCycleValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        id: Joi.required(),
        cycle_name: Joi.optional(),
        description: Joi.optional(),
        // created_by: Joi.number().optional(),
        last_updated_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};

//@2 PMS Vendor Group link type  Master collection Validations

exports.addGroupLinkTypeValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        link_type: Joi.required(),
        description: Joi.optional(),
        created_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};
exports.updateGrouplinkTypeValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        id: Joi.required(),
        link_type: Joi.optional(),
        description: Joi.optional(),
        // created_by: Joi.number().optional(),
        last_updated_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};

//@2 PMS Vendor Group link  Master collection Validations

exports.addVendorGroupLinkValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        vendor_id: Joi.required(),
        link: Joi.required(),
        created_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};
exports.updateVendorGrouplinkValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        id: Joi.required(),
        vendor_id: Joi.optional(),
        link: Joi.optional(),
        // created_by: Joi.number().optional(),
        last_updated_by: Joi.number().required(),
    });
    const { error, value } = schema.validate(body, {
        abortEarly: false,
    });
    if (error) {
        const errors = joiValidationErrorConvertor(error.details);
        return response.returnFalse(400, req, res, errors);
    } else {
        next();
    }
};

/**
 * Middleware to validate the account master details in the request body.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.accountMasterValidation = async (req, res, next) => {
    const body = req.body; // Extracting the request body

    // Defining the validation schema using Joi
    const schema = Joi.object({
        account_name: Joi.string().required(),
        account_type_id: Joi.string(),
        company_type_id: Joi.string().required(),
        category_id: Joi.string(),
        description: Joi.string().min(5).max(2000),
        account_owner_id: Joi.number().required(),
        website: Joi.string(),
        turn_over: Joi.number(),
        how_many_offices: Joi.number(),
        connected_office: Joi.string(),
        connect_billing_street: Joi.string(),
        connect_billing_city: Joi.string(),
        connect_billing_state: Joi.string(),
        connect_billing_country: Joi.string(),
        head_office: Joi.string(),
        head_billing_street: Joi.string(),
        head_billing_city: Joi.string(),
        head_billing_state: Joi.string(),
        head_billing_country: Joi.string(),
        pin_code: Joi.number(),
        company_email: Joi.string().email().optional(),
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