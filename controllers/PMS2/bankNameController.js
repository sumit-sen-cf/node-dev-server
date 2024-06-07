const constant = require("../../common/constant");
const response = require("../../common/response");
const bankNameModel = require("../../models/PMS2/bankNameModel");

exports.addBankName = async (req, res) => {
    try {
        const { sr_no, bank_name, type_of_bank, created_by } = req.body;
        const bankNameAdded = await bankNameModel.create({
            sr_no,
            bank_name,
            type_of_bank,
            description,
            created_by,
        });
        return response.returnTrue(
            200,
            req,
            res,
            "Bank name added successfully!",
            bankNameAdded
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSingleBankNameDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const bankNameDetails = await bankNameModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!bankNameDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Bank name details retreive successfully!",
            bankNameDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getBankNameList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;

        // Calculate the number of exectuion to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of exectuion with pagination applied
        const bankNameList = await bankNameModel.find().skip(skip).limit(limit);

        // Get the total count of exectuion in the collection
        const bankNameCount = await bankNameModel.countDocuments();

        // If no exectuion are found, return a response indicating no exectuion found
        if (bankNameList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of exectuion and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Bank name list retrieved successfully!",
            bankNameList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + bankNameList.length : bankNameList.length,
                total_records: bankNameCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(bankNameCount / limit) : 1,
            }
        );
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

exports.updateBankName = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { sr_no, bank_name, type_of_bank, description, updated_by } = req.body;

        const bankNameUpdated = await bankNameModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                sr_no,
                bank_name,
                type_of_bank,
                description,
                updated_by
            },
        }, {
            new: true
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Bank name detail update successfully!",
            bankNameUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteBankName = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const bankNameDeleted = await bankNameModel.findOneAndUpdate(
            {
                _id: id,
                status: { $ne: constant.DELETED }
            },
            {
                $set: {
                    // Update the status to DELETED
                    status: constant.DELETED,
                },
            },
            { new: true }
        );
        // If no record is found or updated, return a response indicating no record found
        if (!bankNameDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Bank name detail deleted succesfully! for id ${id}`,
            bankNameDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }

};

exports.getAllCountryCodeDeletedData = async (req, res) => {
    try {
        // Find all vendor type that are not deleted
        const detailDeletedData = await countryCodeModel.find({
            status: constant.DELETED,
        });

        if (!detailDeletedData) {
            return response.returnFalse(200, req, res, "No Records Found", {});
        }

        return response.returnTrue(
            200,
            req,
            res,
            "Country code  retrieved successfully!",
            detailDeletedData
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
