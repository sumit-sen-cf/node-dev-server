const reasonCreditApprovalModel = require("../../models/SMS/reasonCreditApprovalModel");
const { message } = require("../../common/message")

/**
 * Api is to used for the reason_credit_approval data add in the DB collection.
 */
exports.createReasonCreaditApproval = async (req, res) => {
    try {
        const { reason, day_count, reason_order, reason_type } = req.body;
        const addReasonCreditApproval = new reasonCreditApprovalModel({
            reason: reason,
            day_count: day_count,
            reason_order: reason_order,
            reason_type: reason_type,
        });
        await addReasonCreditApproval.save();
        return res.status(200).json({
            status: 200,
            message: "Reason credit approval data added successfully!",
            data: addReasonCreditApproval,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the reason_credit_approval data get_by_ID in the DB collection.
 */
exports.getReasonCreditApprovalDetail = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const reasonCreditApprovalData = await reasonCreditApprovalModel.findOne({ _id: id })
        if (reasonCreditApprovalData) {
            return res.status(200).json({
                status: 200,
                message: "Reason credit approval details successfully!",
                data: reasonCreditApprovalData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};


/**
 * Api is to used for the reason_credit_approval data update in the DB collection.
 */
exports.updateReasonCreditApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, day_count, reason_order, reason_type } = req.body;
        const reasonCreditApprovalData = await reasonCreditApprovalModel.findOne({ _id: id });
        if (!reasonCreditApprovalData) {
            return res.send("Invalid reason credit approval Id...");
        }
        await reasonCreditApprovalData.save();
        const reasonCreditApprovalUpdatedData = await reasonCreditApprovalModel.findOneAndUpdate({ _id: id }, {
            $set: {
                reason,
                day_count,
                reason_order,
                reason_type,
            },
        },
            { new: true }
        );
        return res.status(200).json({
            message: "Reason credit approval data updated successfully!",
            data: reasonCreditApprovalUpdatedData,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the reason_credit_approval data get_list in the DB collection.
 */
exports.getReasonCreditApprovalList = async (req, res) => {
    try {
        const reasonCreditApprovalListData = await reasonCreditApprovalModel.find()
        if (reasonCreditApprovalListData) {
            return res.status(200).json({
                status: 200,
                message: "Reason credit approval list successfully!",
                data: reasonCreditApprovalListData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

/**
 * Api is to used for the reason_credit_approval data delete in the DB collection.
 */
exports.deleteReasonCreditApproval = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const reasonCreditApprovalDelete = await reasonCreditApprovalModel.findOne({ _id: id });
        if (!reasonCreditApprovalDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await reasonCreditApprovalModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "Reason credit approval data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};
