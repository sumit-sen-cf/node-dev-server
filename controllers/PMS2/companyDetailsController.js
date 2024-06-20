const constant = require("../../common/constant");
const response = require("../../common/response");
const companyDetailsModel = require("../../models/PMS2/companyDetailsModel");

exports.createCompanyDetails = async (req, res) => {
    try {
        const { vendor_id, company_name, address, city, pincode, state, threshold_limit, created_by } = req.body;
        const companyDetailAdded = await companyDetailsModel.create({
            vendor_id,
            company_name,
            address,
            city,
            pincode,
            state,
            threshold_limit,
            created_by
        });
        return response.returnTrue(
            200,
            req,
            res,
            "Company details added successfully!",
            companyDetailAdded
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getSingleCompanyDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const companyDetails = await companyDetailsModel.findOne({
            _id: id,
            status: { $ne: constant.DELETED },
        });
        if (!companyDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Company details retreive successfully!",
            companyDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.getCompanyDetailsList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : null;
        const limit = req.query?.limit ? parseInt(req.query.limit) : null;

        // Calculate the number of exectuion to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;

        // Retrieve the list of exectuion with pagination applied
        const companyDetailsList = await companyDetailsModel.find().skip(skip).limit(limit);

        // Get the total count of exectuion in the collection
        const companyDetailsCount = await companyDetailsModel.countDocuments();

        // If no exectuion are found, return a response indicating no exectuion found
        if (companyDetailsList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of exectuion and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Company details list retrieved successfully!",
            companyDetailsList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + companyDetailsList.length : companyDetailsList.length,
                total_records: companyDetailsCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(companyDetailsCount / limit) : 1,
            }
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.updateCompanyDetails = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { company_name, address, city, pincode, state, threshold_limit, updated_by } = req.body;

        const comapnyDetailsUpdated = await companyDetailsModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                company_name,
                address,
                city,
                pincode,
                state,
                threshold_limit,
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
            "Company detail update successfully!",
            comapnyDetailsUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteCompanyDetails = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const companyDetailDeleted = await companyDetailsModel.findOneAndUpdate(
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
        if (!companyDetailDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Company detail deleted succesfully! for id ${id}`,
            companyDetailDeleted
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

exports.getCompanyDetailsWiseVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const companyDetails = await companyDetailsModel.findOne({
            vendor_id: id,
            status: { $ne: constant.DELETED },
        });
        if (!companyDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Vendor id wise company details retreive successfully!",
            companyDetails
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};