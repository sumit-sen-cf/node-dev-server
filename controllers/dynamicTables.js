const response = require("../common/response.js");
const dynamicTablesModel = require("../models/dynamicTablesModel.js");

exports.addDynamicTablesData = async (req, res) => {
    try {
        const dynamicTableData = new dynamicTablesModel({
            table_name: req.body.table_name,
            user_id: req.body.user_id,
            column_order_Obj: req.body.column_order_Obj,
        });

        const simv = await dynamicTableData.save();
        return response.returnTrue(200, req, res, "dynamic Table Data Created Successfully", simv);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getSingleDynamicTablesData = async (req, res) => {
    try {
        let userId = parseInt(req.query?.userId);
        let tableName = req.query?.tableName;

        const singleDynamicTableData = await dynamicTablesModel.find({
            // _id: req.params.id
            user_id: userId,
            table_name: tableName
        });
        if (!singleDynamicTableData) {
            return response.returnFalse(200, req, res, "No Reord Found...", {});
        }
        return response.returnTrue(200, req, res, "Dynamic table Data Fetch Successfully", singleDynamicTableData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};


exports.editDynamicTablesData = async (req, res) => {
    try {
        const editDynamicData = await dynamicTablesModel.findOneAndUpdate(
            { _id: req.body._id },
            {
                column_order_Obj: req.body.column_order_Obj,
            },
            { new: true }
        );
        if (!editDynamicData) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Reord Found ",
                {}
            );
        }
        return response.returnTrue(200, req, res, "Updation Successfully", editDynamicData);
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};
