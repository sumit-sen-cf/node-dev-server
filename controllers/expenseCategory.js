const response = require("../common/response.js");
const expenseCategoryModel = require("../models/expenseCategoryModel.js");

exports.addExpenseCategory = async (req, res) => {
    try {
        const expenseCategory = new expenseCategoryModel({
            category_name: req.body.category_name,
            created_by: req.body.created_by
        });
        const expenseCatData = await expenseCategory.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Expense Category Created Successfully",
            expenseCatData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getExpenseCategories = async (req, res) => {
    try {
        const expenseCategoryDatas = await expenseCategoryModel.find({});
        if (!expenseCategoryDatas) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(expenseCategoryDatas)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all data expense category' })
    }
};

exports.getSingleExpenseCategory = async (req, res) => {
    try {
        const singleExpenseategoryData = await expenseCategoryModel.findById(req.params._id);
        if (!singleExpenseategoryData) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send(singleExpenseategoryData);
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting data expense category details' })
    }
};

exports.editExpenseCategory = async (req, res) => {
    try {
        const editExpenseData = await expenseCategoryModel.findByIdAndUpdate(req.body._id, {
            category_name: req.body.category_name,
        }, { new: true })

        res.status(200).send({ success: true, data: editExpenseData })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating data expense category details' })
    }
};

exports.deleteExpenseData = async (req, res) => {
    expenseCategoryModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data expense category deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data expense category not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};