const billingheaderModel = require("../models/billingheaderModel.js");
const userModel = require("../models/userModel.js");

exports.addBillingHeader = async (req, res) => {
  const { billing_header_name, dept_id } = req.body;

  try {
    const billingheaderdata = new billingheaderModel({
      billing_header_name,
      dept_id
    });
    const savedbillingheaderdata = await billingheaderdata.save();
    res.status(200).send({
      data: savedbillingheaderdata,
      message: "Bilingheader data created success",
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: "Error adding billingheaderdata to database",
    });
  }
};

exports.getBillingHeaders = async (req, res) => {
  try {
    const billingheaderdata = await billingheaderModel.aggregate([
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept_id",
          foreignField: "dept_id",
          as: "data1",
        },
      },

      {
        $unwind: "$data1",
      },

      {
        $project: {
          _id: 1,
          billingheader_id: 1,
          billing_header_name: 1,
          dept_id: 1,
          department_name: "$data1.dept_name"
        },
      },
    ]);

    const wfhUserCounts = await Promise.all(
      billingheaderdata.map(async (billingHeader) => {
        const count = await userModel.countDocuments({ dept_id: billingHeader.dept_id, job_type: 'WFH' });
        return { dept_id: billingHeader.dept_id, wfhUserCount: count };
      })
    );

    if (billingheaderdata.length === 0) {
      res.status(200).send({ success: true, data: [], message: "No Record found" });
    } else {
      const result = billingheaderdata.map((billingHeader) => {
        const countObj = wfhUserCounts.find((count) => count.dept_id === billingHeader.dept_id);
        return { ...billingHeader, wfhUserCount: countObj ? countObj.wfhUserCount : 0 };
      });

      res.status(200).send({ result, success: true });
    }
  } catch (err) {
    res.status(500).send({ error: err.message, message: "Error getting all billingheaderdata" });
  }
};

exports.getBillingHeaderById = async (req, res) => {
  try {
    const billingheaderdata = await billingheaderModel.aggregate([
      {
        $match: {
          billingheader_id: parseInt(req.params.id),
        }
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept_id",
          foreignField: "dept_id",
          as: "data1",
        },
      },
      {
        $unwind: "$data1",
      },
      {
        $project: {
          _id: 1,
          billingheader_id: 1,
          billing_header_name: 1,
          dept_id: 1,
          department_name: "$data1.dept_name",
        },
      },
    ]);
    if (billingheaderdata.length === 0) {
      return res
        .status(200)
        .send({ success: false, data: {}, message: "No Record found" });
    } else {
      res.status(200).send(billingheaderdata);
    }
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: "Error getting billingheader details",
    });
  }
};

exports.editBillingHeader = async (req, res) => {
  try {
    const editbillingheader = await billingheaderModel.findOneAndUpdate({ billingheader_id: req.body.billingheader_id }, {
      billing_header_name: req.body.billing_header_name,
      dept_id: req.body.dept_id
    }, { new: true })
    if (!editbillingheader) {
      res.status(200).send({ success: false })
    }
    res.status(200).send({ success: true, data: editbillingheader })
  } catch (err) {
    return res.status(500).send({
      error: err.message,
      message: "Error updating the billingheader in the database",
    });
  }
};

exports.deleteBillingHeader = async (req, res) => {
  const id = req.params.id;
  const condition = { billingheader_id: id };
  try {
    const result = await billingheaderModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `billingheader with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `billingheader with ID ${id} not found`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the billingheader",
      error: error.message,
    });
  }
};
