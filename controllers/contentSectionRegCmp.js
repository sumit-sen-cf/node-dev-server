const constant = require("../common/constant.js");
const helper = require("../helper/helper.js");
const response = require("../common/response.js");
const contentSectionRegSchema = require("../models/contentSectionRegCmpModel.js");
const fileUploadModel = require("../models/fileUploadModel.js");

exports.addContentSectionReg = async (req, res) => {
  try {
    const {
      register_campaign_id,
      content_type_id,
      content_brief,
      campaign_brief,
      campaign_dt,
      creator_dt,
      admin_remark,
      creator_remark,
      est_static_vedio,
      status,
      stage,
      assign_to,
      endDate,
      cmpAdminDemoLink,
    } = req.body;
    const cmpAdminDemoFile = req.files?.cmpAdminDemoFile?.[0]?.filename ?? "";
    const ContentSectionRegObj = new contentSectionRegSchema({
      register_campaign_id,
      content_type_id,
      content_brief,
      campaign_brief,
      campaign_dt,
      creator_dt,
      admin_remark,
      cmpAdminDemoFile,
      cmpAdminDemoLink,
      creator_remark,
      endDate,
      est_static_vedio,
      status,
      stage,
      assign_to,
    });

    const savedContentSectionReg = await ContentSectionRegObj.save();
    if (savedContentSectionReg) {
      if (req.files?.content_sec_file) {
        for (const file of req.files?.content_sec_file) {
          const fileData = new fileUploadModel({
            contentSecRegId: savedContentSectionReg.content_section_id,

            contentSecFile: file.filename,
          });
          await fileData.save(fileData);
        }
      }
    }
    res.send({ data: savedContentSectionReg, status: 200 });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "This ContentSectionReg cannot be created",
    });
  }
};

exports.getContentSectionReg = async (req, res) => {
  try {
    const ContentSectionReg = await contentSectionRegSchema.aggregate([
      {
        $lookup: {
          from: "registercampaignmodels",
          localField: "register_campaign_id",
          foreignField: "register_campaign_id",
          as: "data",
        },
      },
      {
        $lookup: {
          from: "fileuploadmodels",
          localField: "contentSecRegId",
          foreignField: "content_section_id",
          as: "files",
        },
      },
      {
        $unwind: "$data",
      },

      {
        $project: {
          _id: 1,
          register_campaign_id: 1,
          content_type_id: 1,
          content_section_id: 1,
          content_brief: 1,
          campaign_brief: 1,
          campaign_dt: 1,
          creator_dt: 1,
          admin_remark: 1,
          creator_remark: 1,
          content_sec_file: 1,
          est_static_vedio: 1,
          cmpAdminDemoLink: 1,
          cmpAdminDemoFile: 1,
          status: 1,
          endDate: 1,
          stage: 1,
          assign_to: 1,
          brand_id: "$data.brand_id",
          brnad_dt: "$data.brnad_dt",
          excel_path: "$data.excel_path",
          commitment: "$data.commitment",
          detailing: "$data.detailing",
          exeCmpId: "$data.exeCmpId",
          files: 1,
        },
      },
    ]);
    if (ContentSectionReg.length === 0) {
      res
        .status(200)
        .send({ success: true, data: [], message: "No Record found" });
    } else {
      const url = `${constant.base_url}/`;
      const dataWithFileUrls = ContentSectionReg.map((item) => {
        const data = item.files?.filter(
          //here apply filter because query not produce exact output
          (d) => d.contentSecRegId === item.content_section_id
        );
        const modifiedFiles = data?.map((file) => {
          return {
            ...file,
            downloadContentSecFile: file.contentSecFile
              ? `${constant.base_url}/`
              : "", // Construct the download URL
          };
        });

        let obj = {
          ...item,
          files: modifiedFiles,
          download_excel_file: item.excel_path ? url + item.excel_path : "",
          download_content_sec_file: item.content_sec_file
            ? url + item.content_sec_file
            : "",
          downloadCmpAdminDemoFile: item.cmpAdminDemoFile
            ? url + item.cmpAdminDemoFile
            : "",
        };
        return obj;
      });
      res.status(200).send({ data: dataWithFileUrls });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error getting all ContentSectionReg",
    });
  }
};

exports.editContentSectionReg = async (req, res) => {
  try {
    let updateObj = {
      ...req.body,
      cmpAdminDemoFile: req.files?.cmpAdminDemoFile?.[0]?.filename,
    };
    let fileId = req.body.fileId;
    if (fileId) {
      const editfile = await fileUploadModel.findOneAndUpdate(
        { fileId: parseInt(fileId) }, // Filter condition
        {
          $set: {
            contentSecFile: req.files?.content_sec_file?.[0]?.filename,
          },
        }
      );
      if (editfile?.contentSecFile) {
        const result = helper.fileRemove(
          editfile?.contentSecFile,
          "../uploads"
        );
        if (result?.status == false) {
          return response.returnFalse(req, res, result.msg, {});
        }
      } else {
        return res
          .status(200)
          .send({ success: false, message: "file not found" });
      }
    }
    const editContentSectionRegObj =
      await contentSectionRegSchema.findOneAndUpdate(
        { content_section_id: parseInt(req.body.content_section_id) },
        {
          $set: updateObj,
        },
        { new: true }
      );

    if (!editContentSectionRegObj) {
      return res
        .status(200)
        .send({ success: false, message: "ContentSectionReg not found" });
    }
    const result = helper.fileRemove(
      editContentSectionRegObj?.cmpAdminDemoFile,
      "../uploads"
    );
    if (result?.status == false) {
      return response.returnFalse(req, res, result.msg, {});
    }
    return res
      .status(200)
      .send({ success: true, data: editContentSectionRegObj });
  } catch (err) {
    res.status(500).send({
      error: err.message,
      message: "Error updating ContentSectionReg details",
    });
  }
};
