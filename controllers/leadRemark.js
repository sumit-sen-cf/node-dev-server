const leadRemarkModel = require("../models/leadRemarkModel.js");
const response = require("../common/response");


exports.addLeadRemark = async (req, res) => {
    try {
        const {
            leadmast_id,
            call_update,
            callupdate_detail,
            lead_status,
            prospect_status,
            cust_owner,
            remark,
            remarkupd_date,
            followup_date,
            followup_time,
        } = req.body;


        const currentDate = new Date();
        const currentHours = currentDate.getHours().toString().padStart(2, "0");
        const currentMinutes = currentDate.getMinutes().toString().padStart(2, "0");
        const currentSeconds = currentDate.getSeconds().toString().padStart(2, "0");
        const currentTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;

        const remarkupdate_time = currentTime;

        const leadRemarkObj = new leadRemarkModel({
            leadmast_id,
            call_update,
            callupdate_detail,
            lead_status,
            prospect_status,
            cust_owner,
            remark,
            remarkupd_date,
            remarkupdate_time,
            followup_date,
            followup_time,
        });

        const savedleadRemark = await leadRemarkObj.save();
        return response.returnTrue(
            200,
            req,
            res,
            "leadRemark created successfully",
            savedleadRemark
        );
    } catch (err) {
        return response.returnFalse(500, req, res, err.message, {});
    }
};

exports.getLeadRemarks = async (req, res) => {
    try{
        const leadRemarkc = await leadRemarkModel.find();
        if(!leadRemarkc){
            res.status(500).send({success:false})
        }
        res.status(200).send(leadRemarkc)
    } catch(err){
        res.status(500).send({error:err,sms:'Error getting all leadRemark datas'})
    }
};

exports.editLeadRemark = async (req, res) => {
    try {
      const editleadremarkObj = await leadRemarkModel.findOneAndUpdate(
        { leadremark_id: parseInt(req.body.id) }, // Filter condition
        {
          $set: { ...req.body },
        },
        { new: true }
      );
      if (!editleadremarkObj) {
        return response.returnFalse(
          200,
          req,
          res,
          "No Record Found with this leadremark.",
          {}
        );
      }
      return response.returnTrue(
        200,
        req,
        res,
        "LeadRemark updated successfully.",
        editleadremarkObj
      );
    } catch (err) {
      return response.returnFalse(500, req, res, err.message, {});
    }
  };