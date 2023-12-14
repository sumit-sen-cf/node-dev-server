const instaBrandSchema = require("../models/instaBrandModel.js");

exports.addInstaBrand = async (req, res) => {
    try {
        const {
            instaBrandName,
            brandCategoryId,
            brandCategoryName,
            brandSubCategoryId,
            brandSubCategoryName,
            igUserName,
            whatsApp,
            userId,
            majorCategory,
            website,
            rating,
            campaign_count,
            post_count,
            simillar_brand_id,
            temp2,
            temp3,
            youtube,
            brand_image
        } = req.body;

        const instabrandObj = new instaBrandSchema({
            instaBrandName,
            brandCategoryId,
            brandCategoryName,
            brandSubCategoryId,
            brandSubCategoryName,
            igUserName,
            whatsApp,
            userId,
            majorCategory,
            website,
            rating,
            campaign_count,
            post_count,
            simillar_brand_id,
            temp2,
            temp3,
            youtube,
            brand_image
        });

        const savedInstaBrand = await instabrandObj.save();
        res.send({ data: savedInstaBrand, status: 200 });
    } catch (err) {
        res
            .status(500)
            .send({ erroradd_instabrand: err, message: "This instabrand cannot be created" });
    }
};

exports.getInstaBrands = async (req, res) => {
    try {
        const instabranddata = await instaBrandSchema.find();
        if (instabranddata.length === 0) {
            res
                .status(200)
                .send({ success: true, data: [], message: "No Record found" });
        } else {
            res.status(200).send({ data: instabranddata });
        }
    } catch (err) {
        res
            .status(500)
            .send({ error: err, message: "Error getting all instabranddata" });
    }
};

exports.getInstaBrandById = async (req, res) => {
    try {
        const fetchedData = await instaBrandSchema.findOne({
            instaBrandId: parseInt(req.params.id),
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
            message: "Error getting instabrand details",
        });
    }
};

exports.editInstaBrand = async (req, res) => {
    try {
        const {
            instaBrandId,
            instaBrandName,
            brandCategoryId,
            brandCategoryName,
            brandSubCategoryId,
            brandSubCategoryName,
            igUserName,
            whatsApp,
            userId,
            majorCategory,
            website,
            rating,
            campaign_count,
            post_count,
            simillar_brand_id,
            temp2,
            temp3,
            youtube,
            brand_image
        } = req.body;

        const editInstaBrandObj = await instaBrandSchema.findOneAndUpdate(
            { instaBrandId: parseInt(instaBrandId) }, // Filter condition
            {
                $set: {
                    instaBrandName,
                    brandCategoryId,
                    brandCategoryName,
                    brandSubCategoryId,
                    brandSubCategoryName,
                    igUserName,
                    whatsApp,
                    userId,
                    majorCategory,
                    website,
                    rating,
                    campaign_count,
                    post_count,
                    simillar_brand_id,
                    temp2,
                    temp3,
                    youtube,
                    brand_image,
                    updated_at: Date.now(),
                },
            },
            { new: true }
        );

        if (!editInstaBrandObj) {
            return res
                .status(200)
                .send({ success: false, message: "InstaBrand not found" });
        }

        return res.status(200).send({ success: true, data: editInstaBrandObj });
    } catch (err) {
        res
            .status(500)
            .send({ error: err, message: "Error updating Instabrand details" });
    }
};

exports.deleteInstaBrand = async (req, res) => {
    const id = parseInt(req.params.id);
    const condition = { instaBrandId: id };
    try {
        const result = await instaBrandSchema.deleteOne(condition);
        if (result.deletedCount === 1) {
            return res.status(200).json({
                success: true,
                message: `instaBrand with ID ${id} deleted successfully`,
            });
        } else {
            return res.status(200).json({
                success: false,
                message: `instaBrand with ID ${id} not found`,
            });
        }
    } catch (err) {
        return res.status(400).json({ success: false, message: err });
    }
};
