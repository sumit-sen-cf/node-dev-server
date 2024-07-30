const response = require("../../common/response");
const constant = require("../../common/constant");
const accountDepartmentModel = require("../../models/accounts/accountDepartmentModel");

/**
 * Api is to used for the department data add in the DB collection.
 */
exports.createDepartmentDetails = async (req, res) => {
    try {
        const { department_name, created_by } = req.body;
        const addDepartmentData = await accountDepartmentModel.create({
            department_name: department_name,
            created_by: created_by,
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Department Details Created Successfully",
            addDepartmentData
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Department data get_ByID in the DB collection.
 */
exports.getDepartmentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const departmentDetails = await accountDepartmentModel.findOne({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        });
        if (!departmentDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Department Details retrive successfully!",
            departmentDetails
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Department data update in the DB collection.
 */
exports.updateDepartmentDetails = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;
        const { department_name, updated_by } = req.body;

        const departmentUpdated = await accountDepartmentModel.findByIdAndUpdate({
            _id: id
        }, {
            $set: {
                department_name: department_name,
                updated_by: updated_by,
            }
        }, {
            new: true
        });
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Department Details update successfully!",
            departmentUpdated
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Department data get_list fetch from the DB collection.
 */
exports.getDepartmentList = async (req, res) => {
    try {
        // Extract page and limit from query parameters, default to null if not provided
        const page = req.query?.page ? parseInt(req.query.page) : 1;
        const limit = req.query?.limit ? parseInt(req.query.limit) : Number.MAX_SAFE_INTEGER;;
        const sort = { createdAt: -1 };

        // Calculate the number of records to skip based on the current page and limit
        const skip = (page && limit) ? (page - 1) * limit : 0;
        let matchCondition = {
            status: {
                $ne: constant.DELETED
            }
        }
        // Retrieve the list of records with pagination applied
        const departmentList = await accountDepartmentModel.find(matchCondition).skip(skip).limit(limit).sort(sort);

        // Get the total count of records in the collection
        const departmentCount = await accountDepartmentModel.countDocuments();

        // If no records are found, return a response indicating no records found
        if (departmentList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, []);
        }
        // Return a success response with the list of records and pagination details
        return response.returnTrueWithPagination(
            200,
            req,
            res,
            "Department Details list retrieved successfully!",
            departmentList,
            {
                start_record: page && limit ? skip + 1 : 1,
                end_record: page && limit ? skip + departmentList.length : departmentList.length,
                total_records: departmentCount,
                current_page: page || 1,
                total_page: page && limit ? Math.ceil(departmentCount / limit) : 1,
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the Department data delete in the DB collection.
 */
exports.deleteDepartment = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { id } = req.params;

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const departmentDeleted = await accountDepartmentModel.findOneAndUpdate({
            _id: id,
            status: {
                $ne: constant.DELETED
            }
        }, {
            $set: {
                // Update the status to DELETED
                status: constant.DELETED,
            }
        }, {
            new: true
        });
        // If no record is found or updated, return a response indicating no record found
        if (!departmentDeleted) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            `Department Details deleted succesfully! for id ${id}`,
            departmentDeleted
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};