const leadModel = require("../models/leadModel.js");
const leadTypeModel = require("../models/leadTypeModel.js");
const leadMastModel = require("../models/leadMastModel.js")

// All Lead Api 
exports.addLead = async (req, res) => {
    try {
        const {
            leadsource_name,
            lead_source_acc,
            remarks,
            created_by,
            Last_updated_by,
            Last_updated_date
        } = req.body;

        const leadObj = new leadModel({
            leadsource_name,
            lead_source_acc,
            remarks,
            created_by,
            Last_updated_by,
            Last_updated_date
        });

        const savedlead = await leadObj.save();
        return response.returnTrue(
            200,
            req,
            res,
            "lead created successfully",
            savedlead
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leadc = await leadModel.find();
        if (!leadc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(leadc)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all leads' })
    }
};

exports.getLeadById = async (req, res) => {
    try {
        const fetchedData = await leadModel.findOne({
            lead_id: parseInt(req.params.id),
        });
        if (!fetchedData) {
            return res
                .status(200)
                .send({ success: false, data: {}, message: "No Record found" });
        } else {
            res.status(200).send({ data: fetchedData });
        }
    } catch (err) {
        res.status(500).send({
            error: err,
            message: "Error getting lead details",
        });
    }
};

exports.editLead = async (req, res) => {
    try {
        const editleadObj = await leadModel.findOneAndUpdate(
            { lead_id: parseInt(req.body.id) }, 
            {
                $set: { ...req.body },
            },
            { new: true }
        );
        if (!editleadObj) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Record Found with this lead.",
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "Lead updated successfully.",
            editleadObj
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteLead = async (req, res) => {
    const id = req.params.id;
    const condition = { lead_id: id };
    try {
        const result = await leadModel.deleteOne(condition);
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: `Lead with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `Lead with ID ${id} not found`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the lead",
            error: error.message,
        });
    }
};

// All Lead Type Api 

exports.addLeadType = async (req, res) => {
    try {
        const {
            location,
            lead_type,
            remark,
            Created_by,
            Last_updated_by,
            Last_updated_date
        } = req.body;

        const leadtypeObj = new leadTypeModel({
            location,
            lead_type,
            remark,
            Created_by,
            Last_updated_by,
            Last_updated_date
        });

        const savedleadtype = await leadtypeObj.save();
        return response.returnTrue(
            200,
            req,
            res,
            "leadType created successfully",
            savedleadtype
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getLeadTypes = async (req, res) => {
    try {
        const leadTypec = await leadTypeModel.find();
        if (!leadTypec) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(leadTypec)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all leadtypes' })
    }
};

exports.editLeadType = async (req, res) => {
    try {
        const editleadTypeObj = await leadTypeModel.findOneAndUpdate(
            { leadtype_id: parseInt(req.body.id) }, 
            {
                $set: { ...req.body },
            },
            { new: true }
        );
        if (!editleadTypeObj) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Record Found with this leadType.",
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "LeadType updated successfully.",
            editleadTypeObj
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteLeadType = async (req, res) => {
    const id = req.params.id;
    const condition = { leadtype_id: id };
    try {
        const result = await leadTypeModel.deleteOne(condition);
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: `LeadType with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `LeadType with ID ${id} not found`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the leadtype",
            error: error.message,
        });
    }
};

// All Lead Mast APi

exports.addLeadMast = async (req, res) => {
    try {
        const {
            lead_name,
            mobile_no,
            alternate_mobile_no,
            leadsource,
            leadtype,
            dept,
            status,
            loc,
            email,
            addr,
            city,
            state,
            country,
            remarks,
            assign_to,
            Created_by,
            Last_updated_by,
            Last_updated_date
        } = req.body;

        const leadmastObj = new leadMastModel({
            lead_name,
            mobile_no,
            alternate_mobile_no,
            leadsource,
            leadtype,
            dept,
            status,
            loc,
            email,
            addr,
            city,
            state,
            country,
            remarks,
            assign_to,
            Created_by,
            Last_updated_by,
            Last_updated_date
        });

        const savedleadmast = await leadmastObj.save();
        return response.returnTrue(
            200,
            req,
            res,
            "leadType created successfully",
            savedleadmast
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getLeadMasts = async (req, res) => {
    try {
        const leadMastc = await leadMastModel.find();
        if (!leadMastc) {
            res.status(500).send({ success: false })
        }
        res.status(200).send(leadMastc)
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error getting all leadmasts' })
    }
};

exports.getLeadMastById = async (req, res) => {
    try {
        const fetchedData = await leadMastModel.findOne({
            leadmast_id: parseInt(req.params.id),
        });
        if (!fetchedData) {
            return res
                .status(200)
                .send({ success: false, data: {}, message: "No Record found" });
        } else {
            res.status(200).send({ data: fetchedData });
        }
    } catch (err) {
        res.status(500).send({
            error: err,
            message: "Error getting lead mast details",
        });
    }
};

exports.editLeadMast = async (req, res) => {
    try {
        const editleadMastObj = await leadMastModel.findOneAndUpdate(
            { leadmast_id: parseInt(req.body.id) }, 
            {
                $set: { ...req.body },
            },
            { new: true }
        );
        if (!editleadMastObj) {
            return response.returnFalse(
                200,
                req,
                res,
                "No Record Found with this leadMast.",
                {}
            );
        }
        return response.returnTrue(
            200,
            req,
            res,
            "LeadMast updated successfully.",
            editleadMastObj
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.deleteLeadMast = async (req, res) => {
    const id = req.params.id;
    const condition = { leadmast_id: id };
    try {
        const result = await leadMastModel.deleteOne(condition);
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: `LeadMast with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `LeadMast with ID ${id} not found`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the leadmast",
            error: error.message,
        });
    }
};


