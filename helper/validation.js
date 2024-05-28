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
        type: Joi.required(),
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
        type: Joi.optional(),
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
        account_poc: Joi.array().items({
            contact_name: Joi.string().required(), // contact_name is a required string
            contact_no: Joi.number().min(1000000000).max(99999999999999).required(), // contact_no is a required number within specified range
            alternative_contact_no: Joi.number().min(1000000000).max(99999999999999).optional(), // alternative_contact_no is an optional number within specified range
            email: Joi.string().email().required(),
            department: Joi.string().optional(),
            designation: Joi.string().optional(),
            description: Joi.string().min(5).max(2000).optional(),
        }),
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

//@2 PMS Vendor collection Validations

exports.addVendorValidation = async (req, res, next) => {
    const body = req.body;

    // Define the schema for the individual objects in the array
    const bankDetailsSchema = Joi.object({
        vendor_id: Joi.required(),
        bank_name: Joi.string(),
        account_type: Joi.string(),
        account_number: Joi.string(),
        registered_number: Joi.number(),
        ifcs: Joi.string(),
        upi_id: Joi.string(),
        created_by: Joi.number()
    });
    const vendorGroupLinkDataSchema = Joi.object({
        vendor_id: Joi.required(),
        type: Joi.required(),
        link: Joi.required(),
        created_by: Joi.number().required(),
    });
    const schema = Joi.object({
        vendor_type: Joi.string(),
        vendor_platform: Joi.string(),
        pay_cycle: Joi.string(),
        payment_method: Joi.string(),
        vendor_name: Joi.string(),
        country_code: Joi.number(),
        mobile: Joi.number().min(1000000000).max(99999999999999),
        alternate_mobile: Joi.number().min(1000000000).max(99999999999999),
        email: Joi.string().email(),
        personal_address: Joi.string(),
        pan_no: Joi.number(),
        gst_no: Joi.number(),
        company_name: Joi.string(),
        company_address: Joi.string(),
        company_city: Joi.string(),
        company_pincode: Joi.number(),
        company_state: Joi.string(),
        threshold_limit: Joi.number(),
        home_address: Joi.string(),
        home_city: Joi.string(),
        vendor_category: Joi.string(),
        home_state: Joi.string(),
        pan_image: Joi.string(),
        gst_image: Joi.string(),
        created_by: Joi.number(),
        // Adding validation for the array of objects
        bank_details: Joi.array().items(bankDetailsSchema),
        vendorGroupLink_details: Joi.array().items(vendorGroupLinkDataSchema),
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
exports.updateArrayOfVendorValidation = async (req, res, next) => {
    const body = req.body;

    // Define the schema for the individual objects in the array
    const bankDetailsSchema = Joi.object({
        vendor_id: Joi.required(),
        bank_name: Joi.string(),
        account_type: Joi.string(),
        account_number: Joi.string(),
        registered_number: Joi.number(),
        ifcs: Joi.string(),
        upi_id: Joi.string(),
        created_by: Joi.number()
    });
    const vendorGroupLinkDataSchema = Joi.object({
        vendor_id: Joi.required(),
        type: Joi.required(),
        link: Joi.required(),
        created_by: Joi.number(),
    });
    const schema = Joi.object({
        vendor_type: Joi.string(),
        vendor_platform: Joi.string(),
        pay_cycle: Joi.string(),
        payment_method: Joi.string(),
        vendor_name: Joi.string(),
        country_code: Joi.number(),
        mobile: Joi.number().min(1000000000).max(99999999999999),
        alternate_mobile: Joi.number().min(1000000000).max(99999999999999),
        email: Joi.string().email(),
        personal_address: Joi.string(),
        pan_no: Joi.number(),
        gst_no: Joi.number(),
        company_name: Joi.string(),
        company_address: Joi.string(),
        company_city: Joi.string(),
        company_pincode: Joi.number(),
        company_state: Joi.string(),
        threshold_limit: Joi.number(),
        home_address: Joi.string(),
        home_city: Joi.string(),
        vendor_category: Joi.string(),
        home_state: Joi.string(),
        pan_image: Joi.string(),
        gst_image: Joi.string(),
        created_by: Joi.number(),
        // update validation for the array of objects
        bank_details: Joi.array().items(bankDetailsSchema),
        vendorGroupLink_details: Joi.array().items(vendorGroupLinkDataSchema),
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

exports.updateVendorValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        vendor_type: Joi.string(),
        vendor_platform: Joi.string(),
        pay_cycle: Joi.string(),
        payment_method: Joi.string(),
        vendor_name: Joi.string(),
        country_code: Joi.number(),
        mobile: Joi.number().min(1000000000).max(99999999999999),
        alternate_mobile: Joi.number().min(1000000000).max(99999999999999),
        email: Joi.string().email(),
        personal_address: Joi.string(),
        pan_no: Joi.number(),
        gst_no: Joi.number(),
        company_name: Joi.string(),
        company_address: Joi.string(),
        company_city: Joi.string(),
        company_pincode: Joi.number(),
        company_state: Joi.string(),
        threshold_limit: Joi.number(),
        home_address: Joi.string(),
        home_city: Joi.string(),
        vendor_category: Joi.string(),
        home_state: Joi.string(),
        pan_image: Joi.string(),
        gst_image: Joi.string(),
        updated_by: Joi.number(),
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

//@2 PMS bank details collection Validations

exports.addBankDetailsValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        vendor_id: Joi.required(),
        bank_name: Joi.string(),
        account_type: Joi.string(),
        account_number: Joi.string(),
        registered_number: Joi.number(),
        ifcs: Joi.string(),
        upi_id: Joi.string(),
        created_by: Joi.number(),
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

exports.updateBankDetailsValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        vendor_id: Joi.required(),
        bank_name: Joi.string(),
        account_type: Joi.string(),
        account_number: Joi.string(),
        registered_number: Joi.number(),
        ifcs: Joi.string(),
        upi_id: Joi.string(),
        updated_by: Joi.number().required(),
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

//@2 PMS Page Profile Type collection Validations

exports.addPageProfileValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        profile_type: Joi.required(),
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

exports.updatePageProfileValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        _id: Joi.optional(),
        profile_type: Joi.optional(),
        description: Joi.optional(),
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

//@2 PMS Page Category collection Validations

exports.addPageCategoryValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        page_category: Joi.string(),
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

exports.updatePageCategoryValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        page_category: Joi.optional(),
        description: Joi.optional(),
        last_updated_by: Joi.number(),
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

//@2 PMS Country code  Master collection Validations

exports.addCountryCodeValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        country_name: Joi.required(),
        code: Joi.required(),
        phone: Joi.required(),
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
exports.updateCountryCodeValidation = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
        id: Joi.required(),
        country_name: Joi.optional(),
        code: Joi.optional(),
        phone: Joi.optional(),
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

//@2 Add Page master validations

exports.addPageMasterValidation = async (req, res, next) => {
    const body = req.body;

    const page_price_multiple_obj = Joi.object({
        price: Joi.optional(),
        page_price_type_id: Joi.required(),
    });
    const schema = Joi.object({
        page_profile_type_id : Joi.required(),
        page_category_id : Joi.required(),
        platform_id : Joi.required(),
        vendor_id : Joi.required(),
        page_name : Joi.string().email().optional(),
        page_name_type : Joi.optional(),
        page_link : Joi.optional(),
        preference_level : Joi.optional(),
        content_creation : Joi.optional(),
        ownership_type: Joi.optional(),
        rate_type: Joi.optional(),
        variable_type : Joi.optional(),
        description: Joi.optional(),
        page_closed_by: Joi.optional(),
        followers_count: Joi.optional(),
        engagment_rate: Joi.optional(),
        tags_page_category: Joi.optional(),
        platform_active_on: Joi.optional(),
        status: Joi.number().optional(),
        created_by: Joi.required(),
        // Adding validation for the array of objects
        page_price_multiple: Joi.array().items(page_price_multiple_obj).optional(),
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
exports.updatePageMasterValidation = async (req, res, next) => {
    const body = req.body;

    const page_price_multiple_obj = Joi.object({
        price: Joi.optional(),
        page_price_type_id: Joi.optional(),
    });
    const schema = Joi.object({
        page_profile_type_id : Joi.optional(),
        page_category_id : Joi.optional(),
        platform_id : Joi.optional(),
        vendor_id : Joi.optional(),
        page_name : Joi.optional(),
        page_name_type : Joi.optional(),
        page_link : Joi.optional(),
        preference_level : Joi.optional(),
        content_creation : Joi.optional(),
        ownership_type: Joi.optional(),
        rate_type: Joi.optional(),
        variable_type : Joi.optional(),
        description: Joi.optional(),
        page_closed_by: Joi.optional(),
        followers_count: Joi.optional(),
        engagment_rate: Joi.optional(),
        tags_page_category: Joi.optional(),
        platform_active_on: Joi.optional(),
        status: Joi.number().optional(),
        last_updated_by: Joi.required(),
        // Adding validation for the array of objects
        page_price_multiple: Joi.array().items(page_price_multiple_obj).optional(),
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
