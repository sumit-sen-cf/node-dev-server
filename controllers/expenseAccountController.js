const response = require("../common/response.js");
const expenseAccountModel = require("../models/expenseAccountModel.js");

exports.addExpenseAccount = async (req, res) => {
    try {
        const expenseAccount = new expenseAccountModel({
            account_name: req.body.account_name,
            created_by: req.body.created_by
        });
        const expenseData = await expenseAccount.save();
        return response.returnTrue(
            200,
            req,
            res,
            "Expense Account Created Successfully",
            expenseData
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getExpenseAccounts = async (req, res) => {
    try {
        const expenseAccountDatas = await expenseAccountModel.find({});
        if (!expenseAccountDatas) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(expenseAccountDatas)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all data expense account' })
    }
};

exports.getSingleExpenseAccount = async (req, res) => {
    try {
        const singleExpenseAccountData = await expenseAccountModel.findById(req.params._id);
        if (!singleExpenseAccountData) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send(singleExpenseAccountData);
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting data platform details' })
    }
};

exports.editExpenseData = async (req, res) => {
    try {
        const editExpenseData = await expenseAccountModel.findByIdAndUpdate(req.body._id, {
            account_name: req.body.account_name,
        }, { new: true })

        res.status(200).send({ success: true, data: editExpenseData })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating data expense account details' })
    }
};

exports.deleteExpenseData = async (req, res) => {
    expenseAccountModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'data expense account deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'data expense account not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};