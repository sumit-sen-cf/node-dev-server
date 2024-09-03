const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const accountMasterSchema = new mongoose.Schema({
    account_id: {
        type: Number,
        required: false
    },
    account_name: {
        type: String,
        required: true,
        unique: true,
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false
    },
    account_type_id: {
        type: Schema.Types.ObjectId, //brand, indivisual, agency
        required: true,
        ref: "accountTypeModel"
    },
    company_type_id: {
        type: Schema.Types.ObjectId, //update from ownership type
        required: false,
        ref: "accountCompanyTypeModel"
    },
    category_id: {
        type: Schema.Types.ObjectId, //update from industry id
        required: false,
        ref: "accountBrandCategoryModel"
    },
    brand_id: {
        type: Schema.Types.ObjectId, //update from industry id
        required: false,
        ref: "accountBrandModel"
    },
    account_owner_id: {
        type: Number,   //login user_id
        required: true,
    },
    website: {
        type: String,
        required: false,
    },
    turn_over: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    company_email: {
        type: String,
        required: false
    },
    account_image: {
        type: String,
        required: false
    },
    is_rewards_sent: {
        type: Boolean,
        required: false,
        default: false
    },
    created_by: {
        type: Number,
        required: true,
    },
    updated_by: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true
});

/**
 * account master data pre hook used
 */
accountMasterSchema.pre('save', async function (next) {
    if (!this.account_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'account_id': -1 } });

        if (lastAgency && lastAgency.account_id) {
            this.account_id = lastAgency.account_id + 1;
        } else {
            this.account_id = 2000;
        }
    }
    next();
});

/**
 * account master data post hook used
 */
accountMasterSchema.post('save', async function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Account Name must be unique'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model("accountMasterModel", accountMasterSchema);