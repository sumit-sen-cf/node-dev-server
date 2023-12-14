const constant = require("../common/constant.js");
const helper = require("../helper/helper.js");
const roomModel = require("../models/roomModel.js");
const sittingModel = require('../models/sittingModel.js');
const userModel = require("../models/userModel.js");

exports.addSitting = async (req, res) => {
  try {
    const sittingc = new sittingModel({
      sitting_ref_no: req.body.sitting_ref_no,
      sitting_area: req.body.sitting_area,
      remarks: req.body.remarks,
      created_by: req.body.created_by,
      last_updated_by: req.body.last_updated_by,
      room_id: req.body.room_id,
    });
    const sittingv = await sittingc.save();
    res.send({ sittingv, status: 200 });
  } catch (err) {
    res.status(500).send({ error: err, sms: "This sitting cannot be created" });
  }
};

exports.getSittings = async (req, res) => {
  try {
    const sittingc = await sittingModel.find();
    if (!sittingc) {
      res.status(500).send({ success: false });
    }
    res.status(200).send({ data: sittingc });
  } catch (err) {
    res
      .status(500)
      .send({ error: err, sms: "Error getting all sitting datas" });
  }
};

exports.getSingleSitting = async (req, res) => {
  try {
    const singlesitting = await sittingModel.findOne({
      sitting_id: req.params.sitting_id,
    });
    if (!singlesitting) {
      return res.status(500).send({ success: false });
    }
    res.status(200).send(singlesitting);
  } catch (err) {
    res.status(500).send({ error: err, sms: "Error getting sitting details" });
  }
};

exports.editSitting = async (req, res) => {
  try {
    const editsitting = await sittingModel.findOneAndUpdate(
      { sitting_id: req.body.sitting_id },
      {
        sitting_ref_no: req.body.sitting_ref_no,
        sitting_area: req.body.sitting_area,
        remarks: req.body.remarks,
        created_by: req.body.created_by,
        last_updated_by: req.body.last_updated_by,
        room_id: req.body.room_id,
      },
      { new: true }
    );
    if (!editsitting) {
      res.status(500).send({ success: false });
    }
    res.status(200).send({ success: true, data: editsitting });
  } catch (err) {
    res.status(500).send({
      error: err,
      message: "Error updating the projectxsubcategory in the database",
    });
  }
};

exports.deleteSitting = async (req, res) => {
  const id = req.params.id;
  const condition = { sitting_id: id };
  try {
    const result = await sittingModel.deleteOne(condition);
    if (result.deletedCount === 1) {
      return res.status(200).json({
        success: true,
        message: `Sitting with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Sitting with ID ${id} not found`,
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

exports.getNotAllocSitting = async (req, res) => {
    const pipeline = [
        {
          $lookup: {
            from: "usermodels",
            localField: "sitting_id",
            foreignField: "sitting_id",
            as: "user"
        }
      },
      {
        $match: {
          "user": { $eq: [] }
        }
      },
      {
        $project: {
          user: 0 
        }
      }
    ];
  
    sittingModel.aggregate(pipeline, (err, results) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
  
      res.send({ data: results });
    });
}

exports.addRoom = async (req, res) => {
  try {
    const { sitting_ref_no, remarks, created_by } = req.body;
    let roomImage = req.file.filename;
    const roomObj = new roomModel({
      sitting_ref_no,
      remarks,
      roomImage,
      created_by
    });
    const roomObjSaved = await roomObj.save();
    res.status(200).send(roomObjSaved);
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, sms: "This room cannot be created" });
  }
};


exports.getRooms = async (req, res) => {
  try {
    const roomObj = await roomModel.aggregate([
      // {
      //   $lookup: {
      //     from: "usermodels",
      //     localField: "created_by",
      //     foreignField: "user_id",
      //     as: "data",
      //   },
      // },

      // {
      //   $unwind: "$data",
      // },

      {
        $project: {
          _id: 1,
          room_id: "$room_id",
          sitting_ref_no: "$sitting_ref_no",
          roomImage: "$roomImage",
          remarks: "$remarks",
          creation_date: "$creation_date",
          created_by: "$created_by",
          last_updated_by: "$last_updated_by",
          last_updated_date: "$last_updated_date",
          // created_by_name: "$data.user_name",
        },
      },
    ]);

    const url = "http://34.93.221.166:3000/uploads/";
    const dataWithImageUrl = roomObj.map((room) => ({
      ...room,
      room_image_url: room.roomImage ? url + room.roomImage : null,
    }));
    if (dataWithImageUrl?.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      res.status(200).send({data:dataWithImageUrl});
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all Rooms" });
  }
};


exports.getRoomById = async (req, res) => {
  try {
    let match_condition = {
      room_id: parseInt(req.params.id),
    };
    const roomObj = await roomModel.aggregate([
      {
        $match: match_condition,
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "created_by",
          foreignField: "user_id",
          as: "data",
        },
      },

      {
        $unwind: "$data",
      },

      {
        $project: {
          _id: 1,
          room_id: 1,
          sitting_ref_no: 1,
          roomImage: 1,
          remarks: 1,
          creation_date: 1,
          created_by: 1,
          last_updated_by: 1,
          last_updated_date: 1,
          user_name: "$data.user_name",
        },
      },
    ]);
    const baseUrl = constant.base_url;
    let roomImageUrl = `${baseUrl}/uploads/`;
    const dataWithImageUrl = roomObj?.map((room) => ({
      ...room,
      room_image_url: room?.roomImage ? roomImageUrl + room?.roomImage : null,
    }));
    if (dataWithImageUrl?.length === 0) {
      res
        .status(200)
        .send({ success: true, data: {}, message: "No Record found" });
    } else {
      res.status(200).send(dataWithImageUrl[0]);
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error getting all Rooms" });
  }
};

exports.editRoom = async (req, res) => {
  try {
    const { sitting_ref_no, remarks,room_id, Last_updated_by } = req.body;
    let last_updated_date = Date.now();
    let roomImage = req?.file?.filename;
    const editRoomObj = await roomModel.findOneAndUpdate(
      { room_id: parseInt(room_id) }, // Filter condition
      {
        $set: {
          sitting_ref_no,
          remarks,
          room_id,
          Last_updated_by,
          last_updated_date,
          roomImage,
        },
      }
    );
    if (editRoomObj?.roomImage && roomImage ) {
      const result = helper.fileRemove(editRoomObj?.roomImage, "../uploads");
      if (result?.status == false) {
        return res.send(result.msg);
      }
    } else {
      return res.status(200).send("image not found");
    }
    if (!editRoomObj) {
      return res
        .status(200)
        .send({ success: false, message: "Room not found" });
    }

    return res.status(200).send(editRoomObj);
  } catch (err) {
    res
      .status(500)
      .send({ error: err.message, message: "Error updating room details" });
  }
};

exports.deleteRoom = async (req, res) => {
  const id = parseInt(req.params.id);
  const condition = { room_id: id };
  try {
    const dataResult = await roomModel.findOneAndDelete(condition);

    if (dataResult) {
      if (dataResult?.roomImage) {
        const result = helper.fileRemove(dataResult?.roomImage, "../uploads");
        if (result?.status == false) {
          return res.send(result.msg);
        }
      } else {
        return res.status(200).send("image not found");
      }
      return res.status(200).json({
        success: true,
        message: `Room with ID ${id} deleted successfully`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Room with ID ${id} not found`,
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
 