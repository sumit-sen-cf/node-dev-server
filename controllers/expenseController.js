const expenseModel = require('../models/expenseModel.js');
const vari = require("../variables.js");
const multer = require("multer");
// const { storage } = require('../common/uploadFile.js');
const { uploadImage, deleteImage } = require("../common/uploadImage.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "upload_bill", maxCount: 5 },
]);

exports.addExpense = [upload, async (req, res) => {
    try {
        const simc = new expenseModel({
            account_details: req.body.account_details,
            amount: req.body.amount,
            description: req.body.description,
            transaction_date: req.body.transaction_date,
            reference_number: req.body.reference_number,
            expense_category: req.body.expense_category,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            creation_date: req.body.creation_date,
            minor_status: req.body.minor_status,
            major_status: req.body.major_status,
        });

        // Define the image fields 
        const imageFields = {
            upload_bill: 'expenseImage',
        };
        for (const [field] of Object.entries(imageFields)) {
            if (req.files[field] && req.files[field][0]) {
                simc[field] = await uploadImage(req.files[field][0], "ExpenseImages");
            }
        }

        const simv = await simc.save();
        res.send({ simv, status: 200 });
    } catch (err) {
        res
            .status(500)
            .send({ error: err.message, sms: "This expense cannot be created" });
    }
}];


exports.getAllExpenses = async (req, res) => {
    try {
        const expenseImagesBaseUrl = `${vari.IMAGE_URL}`;
        const expenses = await expenseModel.aggregate([
            {
                $lookup: {
                    from: 'expenseaccountmodels',
                    localField: 'account_details',
                    foreignField: '_id',
                    as: 'accountData'
                }
            },
            {
                $unwind: {
                    path: "$accountData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'expensecategorymodels',
                    localField: 'expense_category',
                    foreignField: '_id',
                    as: 'expenseCategory'
                }
            },
            {
                $unwind: {
                    path: "$expenseCategory",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'assigned_to',
                    foreignField: 'user_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    account_details: 1,
                    amount: 1,
                    description: 1,
                    reference_number: 1,
                    expense_category: 1,
                    created_by: 1,
                    assigned_to: 1,
                    creation_date: 1,
                    minor_status: 1,
                    major_status: 1,
                    transaction_date: 1,
                    upload_bill: 1,
                    account_name: "$accountData.account_name",
                    category_name: "$expenseCategory.category_name",
                    assigned_to_name: "$userData.user_name",
                    upload_bill_url: { $concat: [expenseImagesBaseUrl, "$upload_bill"] }
                }
            }
        ]).sort({ creation_date: -1 });

        if (!expenses) {
            res.status(500).send({ success: false })
        }
        res.status(200).send({ data: expenses })
    } catch (err) {
        res.status(500).send({ error: err.message, sms: 'Error getting all expense datas' })
    }
};

exports.getSingleExpense = async (req, res) => {
    try {
        const expenseImagesBaseUrl = `${vari.IMAGE_URL}`;
        const singleExpense = await expenseModel.aggregate([
            {
                $match: {
                    _id: req.params._id
                }
            },
            {
                $lookup: {
                    from: 'expenseaccountmodels',
                    localField: 'account_details',
                    foreignField: '_id',
                    as: 'accountData'
                }
            },
            {
                $unwind: {
                    path: "$accountData",
                    // preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'expensecategorymodels',
                    localField: 'expense_category',
                    foreignField: '_id',
                    as: 'expenseCategory'
                }
            },
            {
                $unwind: {
                    path: "$expenseCategory",
                    // preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'assigned_to',
                    foreignField: 'user_id',
                    as: 'userData'
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    // preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    account_details: 1,
                    amount: 1,
                    description: 1,
                    reference_number: 1,
                    expense_category: 1,
                    created_by: 1,
                    assigned_to: 1,
                    creation_date: 1,
                    minor_status: 1,
                    major_status: 1,
                    transaction_date: 1,
                    upload_bill: 1,
                    account_name: "$accountData.account_name",
                    category_name: "$expenseCategory.category_name",
                    assigned_to_name: "$userData.user_name",
                    upload_bill_url: { $concat: [expenseImagesBaseUrl, "$upload_bill"] }
                }
            }
        ]);
        res.status(200).send({ data: singleExpense })
    } catch (error) {
        res.status(500).send({ error: error.message, sms: 'Error getting single expense data' })
    }
};

exports.editExpense = async (req, res) => {
    try {
        const editsim = await expenseModel.findByIdAndUpdate(req.body._id, {
            account_details: req.body.account_details,
            amount: req.body.amount,
            description: req.body.description,
            reference_number: req.body.reference_number,
            expense_category: req.body.expense_category,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            transaction_date: req.body.transaction_date,
            creation_date: req.body.creation_date,
            minor_status: req.body.minor_status,
            major_status: req.body.major_status,
            upload_bill: req.file?.originalname
        }, { new: true })

        // Define the image fields 
        const imageFields = {
            upload_bill: 'expenseImage',
        };

        // Remove old images not present in new data and upload new images
        for (const [fieldName] of Object.entries(imageFields)) {
            if (req.files && req.files[fieldName] && req.files[fieldName][0]) {

                // Delete old image if present
                if (editsim[fieldName]) {
                    await deleteImage(`ExpenseImage/${editsim[fieldName]}`);
                }
                // Upload new image
                editsim[fieldName] = await uploadImage(req.files[fieldName][0], "ExpenseImage");
            }
        }

        return res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        return res.status(500).send({ error: err, sms: 'Error updating expense details' })
    }
};

exports.deleteExpense = async (req, res) => {
    expenseModel.findByIdAndDelete(req.params._id).then(item => {
        if (item) {
            return res.status(200).json({ success: true, message: 'expense data deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'expense data not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
};

exports.addMultipleExpense = async (req, res) => {
    try {
        const expenses = req.body.map(expense => ({
            account_details: expense.account_details,
            amount: expense.amount,
            description: expense.description,
            transaction_date: expense.transaction_date,
            reference_number: expense.reference_number,
            expense_category: expense.expense_category,
            created_by: expense.created_by,
            assigned_to: expense.assigned_to,
            creation_date: expense.creation_date,
            minor_status: expense.minor_status,
            major_status: expense.major_status,
        }));

        const insertedExpenses = await expenseModel.insertMany(expenses);

        res.send({ insertedExpenses, status: 200 });
    } catch (err) {
        res
            .status(500)
            .send({ error: err.message, sms: "These expenses cannot be created" });
    }
};