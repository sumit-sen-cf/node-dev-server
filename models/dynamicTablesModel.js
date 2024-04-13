const { default: mongoose } = require("mongoose");

const dynamicTablesSchema = new mongoose.Schema({
    table_name: {
        type: String,
        required: false
    },
    user_id: {
        type: Number,
        required: false
    },
    column_order_Obj: {
        type: Array,
        required: false
    },
    // column_visible: {
    //     type: Array,
    //     required: false
    // }
}, {
    timestamps: true
});

module.exports = mongoose.model("dynamicTablesModel", dynamicTablesSchema);
