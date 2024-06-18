const { default: mongoose } = require("mongoose");

const dynamicTablesSchema = new mongoose.Schema({
    table_name: {
        type: String,
        required: false,
        unique: true
    },
    user_id: {
        type: Number,
        required: false
    },
    column_order_Obj: {
        type: Array,
        required: false
    },
    filter_array: {
        type: Array
    }
    // column_visible: {
    //     type: Array,
    //     required: false
    // }
}, {
    timestamps: true
});

module.exports = mongoose.model("dynamicTablesModel", dynamicTablesSchema);
