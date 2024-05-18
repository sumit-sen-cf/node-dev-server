const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const accountMasterSchema = new mongoose.Schema({
    account_id: {
        type: Number,
        required: false
    },
    account_name: {
        type: String,
        required: false,
        unique: true
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
        required: true,
        ref: "accountCompanyTypeModel"
    },
    category_id: {
        type: Schema.Types.ObjectId, //update from industry id
        required: true,
        // ref: ""
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
accountMasterSchema.pre('save', async function (next) {
    if (!this.account_id) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'account_id': -1 } });

        if (lastAgency && lastAgency.account_id) {
            this.account_id = lastAgency.account_id + 1;
        } else {
            this.account_id = 1;
        }
    }
    next();
});

module.exports = mongoose.model("accountMasterModel", accountMasterSchema);