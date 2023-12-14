const objectMastSchema = require("../models/objModel.js");
const userAuthModel = require('../models/userAuthModel.js');
const userModel = require('../models/userModel.js');
const response = require("../common/response");

exports.addObjectMast = async (req, res) => {
  try {
    const { obj_name, soft_name, dept_id, created_by } = req.body;

    const Obj = new objectMastSchema({
      obj_name,
      soft_name,
      Dept_id: dept_id,
      Created_by: created_by,
    });
    const savedObjectMast = await Obj.save();
    const objectId = savedObjectMast.obj_id; 
    
    let maxAuthId = await userAuthModel.findOne({}, { auth_id: 1 }, { sort: { auth_id: -1 } });
    let nextAuthId = maxAuthId ? maxAuthId.auth_id + 1 : 1;

    const userData = await userModel.find({});
    
    let userAuthDocuments = [];

    for (const user of userData) {
      const userId = user.user_id;
      const roleId = user.role_id;
      let insertValue = 0;
      let viewValue = 0;
      let updateValue = 0;
      let deleteValue = 0;

      if (roleId === 1) {
        insertValue = 1;
        viewValue = 1;
        updateValue = 1;
        deleteValue = 1;
      }

      const userAuthDocument = new userAuthModel({
        auth_id: nextAuthId,
        Juser_id: userId,
        obj_id: objectId,
        insert_value: insertValue,
        view_value: viewValue,
        update_value: updateValue,
        delete_flag_value: deleteValue,
      });

      userAuthDocuments.push(userAuthDocument);
      nextAuthId++;
    }

    // Save all userAuthDocuments in one go
    await userAuthModel.insertMany(userAuthDocuments);

    res.send({
      data: savedObjectMast,
      status: 200,
      message: "Object and user_auth_detail added successfully",
    });
  } catch (err) {
    res.status(500).send({ error: err.message, message: "This objMast cannot be created" });
  }
};


exports.getObjectMastById = async (req, res) => {
  try {
    let match_condition = {
      obj_id: parseInt(req.params.obj_id),
    };

    let objects = await objectMastSchema.aggregate([
      {
        $match: match_condition,
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "Dept_id",
          foreignField: "dept_id",
          as: "data",
        },
      },

      {
        $unwind: "$data",
      },
      {
        $project: {
          obj_name: "$obj_name",
          soft_name: "$soft_name",
          Dept_id: "$Dept_id",
          Created_by: "$Created_by",
          dept_name: "$data.dept_name"
        },
      },
    ]);

    if (objects.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      return res.status(200).send({ success: true, data: objects[0] });
    }
  } catch (err) {
    res.status(500).send({ error: err.message, message: "Error getting  Object" });
  }
};

exports.getObjectMasts = async (req, res) => {
  try {
    let objects = await objectMastSchema.aggregate([
      {
        $lookup: {
          from: "departmentmodels",
          localField: "Dept_id",
          foreignField: "dept_id",
          as: "data",
        },
      },
      {
        $unwind: {
          path: "$data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          obj_id:"$obj_id",
          obj_name: "$obj_name",
          soft_name: "$soft_name",
          Dept_id: "$Dept_id",
          Created_by: "$Created_by",
          dept_name: "$data.dept_name"
        },
      },
    ]);
    if (objects.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      return res.status(200).send({ success: true, data: objects });
    }
  } catch (err) {
    res.status(500).send({ error: err.message, message: "Error getting all Objects" });
  }
};


exports.editObjectMast = async (req, res) => {
  try {
    const editobj = await objectMastSchema.findOneAndUpdate(
      { obj_id: parseInt(req.body.obj_id) },
      {
        obj_name: req.body.obj_name,
        soft_name: req.body.soft_name,
        Dept_id: req.body.dept_id,
        Last_updated_by: req.body.Last_updated_by
      },
      { new: true }
    );
    if (!editobj) {
      return response.returnFalse(
        200,
        req,
        res,
        "No Reord Found With This Designation Id",
        {}
      );
    }
    return response.returnTrue(200, req, res, "Updation Successfully", editobj);
  } catch (err) {
    return response.returnFalse(500, req, res, err.message, {});
  }
};


exports.deleteObjectMast = async (req, res) => {
  const id = req.params.obj_id;
  const condition = { obj_id: id };
  try {
      const result = await objectMastSchema.deleteOne(condition);
      if (result.deletedCount === 1) {
          return res.status(200).json({
              success: true,
              message: `objectMast with ID ${id} deleted successfully`,
          });
      } else {
          return res.status(200).json({
              success: false,
              message: `objectMast with ID ${id} not found`,
          });
      }
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "An error occurred while deleting the Sitting",
          error: error.message,
      });
  }
};
