const jobTypeModel = require("../models/jobTypeModel");

exports.addJobType = async (req, res) => {
    try {
        const { job_type, job_type_description, created_by, created_at } = req.body;
        const checkDuplicacy = await jobTypeModel.findOne({job_type: req.body.job_type})
        if(checkDuplicacy){
            return res.status(409).send({
                data: [],
                message: "Job type already exist",
            });
        }
        const jobtypeObj = new jobTypeModel({
            job_type, job_type_description, created_by, created_at
        });

        const savedJobType = await jobtypeObj.save();
        return res.send({ data: savedJobType, status: 200 });
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: "This Job type cannot be created",
        });
    }
};

exports.getJobTypes = async (req, res) => {
    try {
        const jobTypes = await jobTypeModel.find();
        if (jobTypes.length === 0) {
            return res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            return res.status(200).send({ data: jobTypes });
        }
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, message: "Error getting all job types" });
    }
};
exports.getJobType = async (req, res) => {
    try {
        const jobType = await jobTypeModel.findById(req?.params?.id);
        if (!jobType) {
            return res
                .status(200)
                .send({ success: true, data: {}, message: "No Record found" });
        } else {
            return res.status(200).send({ data: jobType });
        }
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, message: "Error getting  botY" });
    }
};

exports.editJobType = async (req, res) => {
    try {

        const editJObTypeObj = await jobTypeModel.findByIdAndUpdate(
            req.body._id, // Filter condition
            req.body,
            { new: true }
        );

        if (!editJObTypeObj) {
            return res
                .status(200)
                .send({ success: false, message: "Job type not found" });
        }

        return res.status(200).send({ success: true, data: editJObTypeObj });
    } catch (err) {
        return res
            .status(500)
            .send({ error: err.message, message: "Error updating Job type details" });
    }
};

exports.deleteJobType = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await jobTypeModel.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({
                success: true,
                message: `Job type with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `Job type  with ID ${id} not found`,
            });
        }
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
