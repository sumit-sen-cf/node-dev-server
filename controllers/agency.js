const response = require("../common/response.js");
const agencyModel = require("../models/agencyModel.js");

exports.addAgency = async (req, res) => {
    const { agency_name } = req.body;
    try {
        const createAgencyData = new agencyModel({
            agency_name
        });
        const agencyDataAdded = await createAgencyData.save();
        // Return a success response with the add record details
        return response.returnTrue(
            200,
            req,
            res,
            "Agency data add successfully!",
            agencyDataAdded
        );
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }

};

exports.getAgencys = async (req, res) => {
    try {
        const agencyDataList = await agencyModel.find();
        if (agencyDataList.length === 0) {
            return response.returnFalse(200, req, res, `No Record Found`, {});

        } else {
            return response.returnTrue(
                200,
                req,
                res,
                "Agency list data retrive successfully!",
                agencyDataList
            );
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    };
}

exports.getAgencyById = async (req, res) => {
    try {
        const agencyData = await agencyModel.findOne({
            agency_id: parseInt(req.params.id),
        });
        if (!agencyData) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        } else {
            return response.returnTrue(
                200,
                req,
                res,
                "Agency data retrive successfully!",
                agencyData
            );
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.editAgency = async (req, res) => {
    try {
        const updateAgency = await agencyModel.findOneAndUpdate({ agency_id: req.body.agency_id }, {
            agency_name: req.body.agency_name
        }, { new: true })
        if (!updateAgency) {
            return response.returnFalse(200, req, res, `No Record Found`, {});
        }
        else {
            return response.returnTrue(
                200,
                req,
                res,
                "Agency data update successfully!",
                updateAgency
            );
        }
    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};

exports.deleteAgency = async (req, res) => {
    const id = req.params.id;
    const condition = { agency_id: id };
    try {
        const deleteAgency = await agencyModel.deleteOne(condition);
        if (deleteAgency.deletedCount === 1) {
            return response.returnTrue(
                500,
                req,
                res,
                `Agency with ID ${id} deleted successfully!`,
                deleteAgency
            );
        } else {
            return response.returnTrue(
                500,
                req,
                res,
                `Agency with ID ${id} not found`,
            );
        }

    } catch (error) {
        return response.returnFalse(500, req, res, `${error.message}`, {});
    }
};
