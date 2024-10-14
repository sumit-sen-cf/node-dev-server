const constant = require("../../common/constant");
const response = require("../../common/response");
const incentiveSharingServicesModel = require("../../models/Sales/incentiveSharingServicesModel");
const accountMasterModel = require("../../models/accounts/accountMasterModel");

/**
 * Api is to used for the incentive sharing data add in the DB collection.
 */
exports.createIncentiveSharing = async (req, res) => {
    try {
        const { account_id, account_percentage, created_by } = req.body;
        const services = (req.body && req.body.services) ? (req.body.services) : [];
        // Array to store all the created entries
        let addIncentiveSharingServices = [];

        // Iterate through each service in the request
        for (const service of services) {
            const { service_id, service_percentage, incentive_sharing_users } = service;

            // Iterate through each user under this service
            for (const user of incentive_sharing_users) {
                const { user_id, user_percentage } = user;

                //find data by account id and update it
                const existsData = await incentiveSharingServicesModel.findOne({
                    account_id: account_id,
                    service_id: service_id,
                    user_id: user_id,
                })

                //updated obj prepare
                const updateData = {
                    account_id: account_id,
                    service_id: service_id,
                    user_id: user_id,
                    user_percentage: user_percentage,
                    service_percentage: service_percentage,
                    status: constant?.ACTIVE,
                }

                //if data already exits then update it
                if (existsData) {
                    updateData['updated_by'] = created_by;
                    const updateEntry = await incentiveSharingServicesModel.findOneAndUpdate({
                        account_id: account_id,
                        service_id: service_id,
                        user_id: user_id,
                    }, updateData, {
                        new: true
                    });
                    // Push the updateEntry updated entry to the result array
                    addIncentiveSharingServices.push(updateEntry);
                } else {
                    updateData['created_by'] = created_by;
                    // Create a new entry for each user-service combination
                    const newEntry = await incentiveSharingServicesModel.create(updateData);
                    // Push the newly created entry to the result array
                    addIncentiveSharingServices.push(newEntry);
                }
            }
        }

        //account percentage set in the account db collection.
        const accountData = await accountMasterModel.findOneAndUpdate({
            account_id: account_id,
        }, {
            $set: {
                account_percentage: account_percentage
            }
        }, {
            new: true
        });

        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive Sharing Details Updated Successfully",
            {
                addIncentiveSharingServices: addIncentiveSharingServices,
                accountPercentage: accountData.account_percentage
            }
        );
    } catch (error) {
        // Return response if duplicate case
        if (error.code === 11000) {
            return response.returnFalse(400, req, res, 'Duplicate entry found', {});
        }
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the incentive sharing data get_ByID in the DB collection.
 */
exports.getIncentiveSharingDetails = async (req, res) => {
    try {
        const { account_id } = req.params;
        let matchCondition = {
            account_id: parseInt(account_id),
            status: {
                $ne: constant.DELETED
            }
        }

        //get account data from the db
        const accountData = await accountMasterModel.findOne({
            account_id: parseInt(account_id)
        });

        //get account id wise data from the db
        const incentiveSharingDetails = await incentiveSharingServicesModel.aggregate([{
            $match: matchCondition
        }, {
            $group: {
                _id: {
                    service_id: "$service_id",
                    service_percentage: "$service_percentage"
                },
                incentive_sharing_users: {
                    $push: {
                        user_id: "$user_id",
                        user_percentage: "$user_percentage"
                    }
                }
            }
        }, {
            $project: {
                _id: 0,
                service_id: "$_id.service_id",
                service_percentage: "$_id.service_percentage",
                incentive_sharing_users: 1,
            }
        }]);

        //if data not found
        if (!incentiveSharingDetails) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }

        //for the response obj
        const result = {
            account_percentage: accountData?.account_percentage || 100,
            services: incentiveSharingDetails
        }

        // Return a success response with the updated record details
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive Sharing Details Retrive Successfully!",
            result
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

/**
 * Api is to used for the incentive sharing data delete in the DB collection.
 */
exports.deleteIncentiveSharing = async (req, res) => {
    try {
        // Extract the id from request parameters
        const { account_id } = req.params;
        //get body data for the delete set status
        const { updated_by, service_id, incentive_sharing_users } = req.body;

        if (!account_id || !service_id || !incentive_sharing_users || !incentive_sharing_users.length) {
            return response.returnFalse(400, req, res, "Invalid request data", {});
        }

        // Attempt to find and update the record with the given id and status not equal to DELETED
        const updateResult = await incentiveSharingServicesModel.updateMany({
            status: {
                $ne: constant.DELETED
            },
            account_id: parseInt(account_id),
            service_id: service_id,
            user_id: {
                $in: incentive_sharing_users
            },
        }, {
            $set: {
                status: constant.DELETED,
                updated_by: updated_by
            }
        });

        // Check if any documents were updated
        if (updateResult.modifiedCount === 0) {
            return response.returnFalse(404, req, res, "No matching records found to delete", {});
        }

        // Return a success response
        return response.returnTrue(
            200,
            req,
            res,
            "Incentive sharing users deleted successfully",
            {
                modifiedCount: updateResult.modifiedCount,
                serviceId: service_id,
                account_id: account_id
            }
        );
    } catch (error) {
        // Return an error response in case of any exceptions
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};