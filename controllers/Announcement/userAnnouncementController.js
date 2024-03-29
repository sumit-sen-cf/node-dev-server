const userAnnouncementModel = require("../../models/User_Announcement/userAnnouncementModel");
const multer = require("multer");
const vari = require("../../variables.js");
const { storage } = require('../../common/uploadFile.js');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const userModel = require("../../models/userModel.js");
const commentAnnouncementModel = require("../../models/User_Announcement/commentAnnouncementModel.js");

const upload = multer({
    storage: multer.memoryStorage()
}).fields([
    { name: "image", maxCount: 10 },
    { name: "attachment", maxCount: 10 },
    { name: "image", maxCount: 10 },
    { name: "attachment", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "video", maxCount: 1 },
]);

//POST- User_Announcement
exports.createUserAnnouncement = [
    upload, async (req, res) => {
        try {
            const { post_content, post_subject, all_emp, dept_id, desi_id, job_type, notify_by_user_email, email_response,
                target_audience_count, created_by, last_updated_by } = req.body;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "ankigupta1254@gmail.com",
                    pass: "ptxbqtjmcaghogcg",
                }
            });
            const sendMail = async (to, subject, text) => {
                const templatePath = path.join(__dirname, "userAnnouncement.ejs");
                const template = await fs.promises.readFile(templatePath, "utf-8");
                const html = ejs.render(template, {
                    subject,
                    post_subject,
                    post_content
                });
                try {
                    await transporter.sendMail({
                        from: "ankigupta1254@gmail.com",
                        to: "ankigupta1254@gmail.com",
                        subject: subject,
                        html: html
                    });
                    console.log('Email sent successfully');
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            };
            const addUserAnnouncementData = new userAnnouncementModel({
                post_content: post_content,
                post_subject: post_subject,
                all_emp: all_emp,
                dept_id: dept_id.split(',').map(Number),
                desi_id: desi_id.split(',').map(Number),
                job_type: job_type,
                notify_by_user_email: notify_by_user_email,
                email_response: email_response,
                target_audience_count: target_audience_count,
                created_by: created_by,
                last_updated_by: last_updated_by
            });
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);
            if (req.files['image']) {
                const imagesPromises = req.files['image'].map(async (imageFile) => {
                    if (imageFile.originalname) {
                        const blob = bucket.file(imageFile.originalname);
                        addUserAnnouncementData.image.push(blob.name);
                        const blobStream = blob.createWriteStream();
                        blobStream.on("finish", () => {
                            console.log('Image uploaded successfully');
                        });
                        blobStream.end(imageFile.buffer);
                    }
                });

                await Promise.all(imagesPromises);
            }
            if (req.files.video && req.files.video[0].originalname) {
                const blob2 = bucket.file(req.files.video[0].originalname);
                addUserAnnouncementData.video = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.video[0].buffer);
            }
            // if (req.files.attachment && req.files.attachment[0].originalname) {
            //     const blob2 = bucket.file(req.files.attachment[0].originalname);
            //     addUserAnnouncementData.attachment = blob2.name;
            //     const blobStream2 = blob2.createWriteStream();
            //     blobStream2.on("finish", () => {
            //     });
            //     blobStream2.end(req.files.attachment[0].buffer);
            // }
            if (req.files['attachment']) {
                const attachmentsPromises = req.files['attachment'].map(async (attachmentFile) => {
                    if (attachmentFile.originalname) {
                        const blob = bucket.file(attachmentFile.originalname);
                        addUserAnnouncementData.attachment.push(blob.name);
                        const blobStream = blob.createWriteStream();
                        blobStream.on("finish", () => {
                            console.log('Attachment uploaded successfully');
                        });
                        blobStream.end(attachmentFile.buffer);
                    }
                });
                await Promise.all(attachmentsPromises);
            }
            if (req.body.notify_by_user_email === 'true') {
                const subject = 'New Announcement';
                post_subject;
                post_content;
                await sendMail(req.body.notify_by_user_email, subject, post_subject, post_content);
            }
            await addUserAnnouncementData.save();
            return res.status(200).json({
                status: 200,
                message: "User Announcement data added successfully!",
                data: addUserAnnouncementData,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

//GET - User_Announcement- BY_Id
exports.getUserAnnouncementDetail = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const userAnnouncementData = await userAnnouncementModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    post_content: 1,
                    post_subject: 1,
                    all_emp: 1,
                    dept_id: 1,
                    desi_id: 1,
                    job_type: 1,
                    notify_by_user_email: 1,
                    email_response: 1,
                    target_audience_count: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    image: {
                        // $concat: [imageUrl, "$image"],
                        $concat: [
                            { $toString: "$imageUrl" },
                            { $toString: "$image" },
                        ],
                    },
                    attachment: {
                        $concat: [{ $toString: "$imageUrl" },
                        { $toString: "$attachment" }],
                    },
                    video: {
                        $concat: [{ $toString: "$imageUrl" },
                        { $toString: "$video" }],
                    },
                },
            },
        ])
        if (userAnnouncementData) {
            return res.status(200).json({
                status: 200,
                message: "User Announcement details successfully!",
                data: userAnnouncementData,
            });
        }
        return res.status(404).json({
            status: 404,
            message: message.DATA_NOT_FOUND,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//PUT - updateAnnouncement_By-ID
exports.updateUserAnnouncement = [
    upload,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { post_content, post_subject, all_emp, dept_id, desi_id, job_type, notify_by_user_email, email_response,
                target_audience_count, created_by, last_updated_by } = req.body;
            const userAnnouncementData = await userAnnouncementModel.findOne({ _id: id });
            if (!userAnnouncementData) {
                return res.send("Invalid user-announcement Id...");
            }
            if (req.files) {
                userAnnouncementData.image = req.files["image"] ? req.files["image"][0].filename : userAnnouncementData.image;
                userAnnouncementData.attachment = req.files["attachment"] ? req.files["attachment"][0].filename : userAnnouncementData.attachment;
                userAnnouncementData.video = req.files["video"] ? req.files["video"][0].filename : userAnnouncementData.video;

            }
            const bucketName = vari.BUCKET_NAME;
            const bucket = storage.bucket(bucketName);

            if (req.files?.image && req.files?.image[0].originalname) {
                const blob1 = bucket.file(req.files.image[0].originalname);
                userAnnouncementData.image = blob1.name;
                const blobStream1 = blob1.createWriteStream();
                blobStream1.on("finish", () => {
                });
                blobStream1.end(req.files.image[0].buffer);
            }
            if (req.files?.attachment && req.files?.attachment[0].originalname) {
                const blob2 = bucket.file(req.files.attachment[0].originalname);
                userAnnouncementData.attachment = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.attachment[0].buffer);
            }
            if (req.files?.video && req.files?.video[0].originalname) {
                const blob2 = bucket.file(req.files.video[0].originalname);
                userAnnouncementData.video = blob2.name;
                const blobStream2 = blob2.createWriteStream();
                blobStream2.on("finish", () => {
                });
                blobStream2.end(req.files.video[0].buffer);
            }
            if (notify_by_user_email === 'true') {
                const subject = 'New Announcement';
                const postSubject = req.body.post_subject;
                const postContent = req.body.post_content;
                await sendMail(req.body.notify_by_user_email, subject, postSubject, postContent);
            }
            await userAnnouncementData.save();
            const userAnnouncement = await userAnnouncementModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    post_content,
                    post_subject,
                    all_emp,
                    dept_id,
                    desi_id,
                    job_type,
                    notify_by_user_email,
                    email_response,
                    target_audience_count,
                    created_by,
                    last_updated_by
                },
            },
                { new: true }
            );
            return res.status(200).json({
                message: "User-Announcement data updated successfully!",
                data: userAnnouncement,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message ? error.message : message.ERROR_MESSAGE,
            });
        }
    }];

//GET - User_Announcement_List
exports.getUserAnnoncementList = async (req, res) => {
    try {
        const imageUrl = vari.IMAGE_URL;
        const userAnnouncementList = await userAnnouncementModel.aggregate([
            {
                $lookup: {
                    from: "designationmodels",
                    localField: "desi_id",
                    foreignField: "desi_id",
                    as: "designationData",
                },
            },
            {
                $unwind: {
                    path: "$designationData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "departmentmodels",
                    localField: "dept_id",
                    foreignField: "dept_id",
                    as: "departmentData",
                },
            },
            {
                $unwind: {
                    path: "$departmentData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "usermodels",
                    localField: "created_by",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    post_content: 1,
                    post_subject: 1,
                    all_emp: 1,
                    dept_id: 1,
                    desi_id: 1,
                    job_type: 1,
                    notify_by_user_email: 1,
                    email_response: 1,
                    reactions: 1,
                    //target_audience_count: 1,
                    created_date_time: 1,
                    created_by: 1,
                    created_by_name: "$user.user_name",
                    last_updated_date: 1,
                    last_updated_by: 1,
                    image: {
                        $concat: [
                            { $ifNull: [imageUrl, "$image"] },
                        ]
                    },
                    attachment: {
                        $concat: [
                            { $ifNull: [imageUrl, "$attachment"] },
                        ]
                    },
                    video: {
                        $concat: [
                            { $ifNull: [imageUrl, "$video"] },
                        ]
                    },
                    department_data: {
                        department_id: "$departmentData._id",
                        dept_id: "$departmentData.dept_id",
                        dept_name: "$departmentData.dept_name",
                        remarks: "$departmentData.Remarks",
                        short_name: "$departmentData.short_name",
                        created_by: "$departmentData.Created_by",
                        Last_updated_by: "$departmentData.Last_updated_by"
                    },
                    designation_data: {
                        designation_id: "$designationData._id",
                        desi_id: "$designationData.desi_id",
                        desi_name: "$designationData.desi_name",
                        remark: "$designationData.remark",
                        created_by: "$designationData.created_by",
                        last_updated_by: "$designationData.last_updated_by"
                    },
                },
            },
            {
                $group: {
                    _id: "$_id",
                    data: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$data" }
            }
        ])
        const userData = await userModel.aggregate([{
            $group: {
                _id: "$user_designation",
                target_audience_count: { $sum: 1 }
            },
        }, {
            $project: {
                desi_id: "$_id",
                target_audience_count: 1
            }
        }]);
        const announcementsDeptIdsArray = await userAnnouncementModel.distinct("desi_id");
        const usersByDesiInAnnouncements = announcementsDeptIdsArray.map(desi_id => {
            const userDataEntry = userData.find(entry => entry.desi_id === desi_id);
            return {
                desi_id,
                target_audience_count: userDataEntry ? userDataEntry.target_audience_count : 0
            };
        });
        const totalUserAnnouncementList = await userAnnouncementModel.countDocuments(userAnnouncementList);
        if (!totalUserAnnouncementList) {
            return res.status(404).send({
                succes: true,
                message: "User Announcement data request list not found!",
            });
        }
        return res.status(200).send({
            succes: true,
            message: "User_Announcement list created successfully!",
            Announcement_data: totalUserAnnouncementList, userAnnouncementList,
            desiWiseUserCounts: usersByDesiInAnnouncements,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};

//DELETE - User_Announcement-By-ID
exports.deleteUserAnnouncementData = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const userAnnouncementDelete = await userAnnouncementModel.findOne({ _id: id });
        if (!userAnnouncementDelete) {
            return res.status(404).json({
                status: 404,
                message: message.DATA_NOT_FOUND,
            });
        }
        await userAnnouncementModel.deleteOne({ _id: id });
        return res.status(200).json({
            status: 200,
            message: "User announcement data deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
};



exports.announcementUpdateData = async (req, res) => {
    try {
        const { announcement_id, user_id, reaction, isRemoveReaction } = req.body;
        console.log("body------------------------------------", req.body)
        // if (reaction !== 'like' && reaction !== 'love' && reaction !== 'haha' && reaction !== 'sad' && reaction !== 'clap') {
        //     return res.status(400).json({ success: false, message: 'Invalid reaction type' });
        // }
        // let reactionUserData = { [user_id]: 1 }

        let reactionArray = ['love', 'like', 'haha', 'sad', 'clap'];
        if (reactionArray.includes(reaction)) {
            // reactionArray
        }
        let updateQuery = {};
        let findQuery = {
            _id: announcement_id,
        };
        if (!isRemoveReaction) {
            if (reaction === 'like') {
                findQuery['$nin'] = { 'reactions.like': user_id };
                updateQuery['$push'] = { 'reactions.like': user_id };
            } else if (reaction === 'love') {
                findQuery['$nin'] = { 'reactions.love': user_id };
                updateQuery['$push'] = { 'reactions.love': user_id };
            } else if (reaction === 'haha') {
                findQuery['$nin'] = { 'reactions.haha': user_id };
                updateQuery['$push'] = { 'reactions.haha': user_id };
            } else if (reaction === 'clap') {
                console.log("clapppppppppppp")
                findQuery['$nin'] = { 'reactions.clap': user_id };
                updateQuery['$push'] = { 'reactions.clap': user_id };
            } else if (reaction === 'sad') {
                findQuery['$nin'] = { 'reactions.sad': user_id };
                updateQuery['$push'] = { 'reactions.sad': user_id };
            }
        } else {
            if (reaction === 'like') {
                updateQuery['$pull'] = { 'reactions.like': user_id };
            }
            else if (reaction === 'love') {
                updateQuery['$pull'] = { 'reactions.love': user_id };
            }
            else if (reaction === 'haha') {
                updateQuery['$pull'] = { 'reactions.haha': user_id };
            }
            else if (reaction === 'clap') {
                updateQuery['$pull'] = { 'reactions.clap': user_id };
            }
            else if (reaction === 'sad') {
                updateQuery['$pull'] = { 'reactions.sad': user_id };
            }
        }

        // if (reaction === 'like') {
        //     updateQuery['$push'] = { 'reactions.like': user_id };

        // } else if (reaction === 'dislike') {
        //     updateQuery['$pull'] = { 'reactions.like': user_id };
        // }
        console.log("*************** findQuery ****************")
        console.log(findQuery)
        console.log("*************** updateQuery ****************")
        console.log(updateQuery)
        // const announcement = await userAnnouncementModel.findOneAndUpdate({
        //     _id: announcement_id,
        //     // "$reactions.clap" : { $nin: [user_id] }

        //     // $nin:{
        //     //     "user_id": user_id,
        //     // },
        // }, {
        //     updateQuery
        // }, {
        //     new: true
        // });

        const announcement = await userAnnouncementModel.findOneAndUpdate(findQuery, updateQuery,
            {
                new: true
            });
        console.log("announcement------------------------", ({ "$reactions.clap": { $nin: [user_id] } }))
        console.log("announcement------------------------", updateQuery)

        return res.status(200).json({
            success: true, message: 'Reaction updated successfully',
            data: announcement
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



//PUT - ADD-Comments
exports.announcementWiseComment = async (req, res) => {
    try {
        const { announcement_id, user_id, comment } = req.body;
        let announcementData = await userAnnouncementModel.findById(announcement_id);
        let userIndex = announcementData.commentsHistory.findIndex(item => item.user_id === user_id);
        if (userIndex !== -1) {
            announcementData.commentsHistory[userIndex].comment.push(comment);
        } else {
            announcementData.commentsHistory.push({ user_id, comment: [comment] });
        }
        const announcementCommentsUpdated = await announcementData.save();
        return res.status(200).json({
            message: "Announcement_Comments data updated successfully!",
            data: announcementCommentsUpdated,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}

//GET - Comments_List
exports.getComments = async (req, res) => {
    try {
        const announcementCommentsList = await userAnnouncementModel.aggregate([{
            $match: {
                _id: mongoose.Types.ObjectId(req.params.announcementId)
            }
        }, {
            $lookup: {
                from: "usermodels",
                localField: "user_id",
                foreignField: "user_id",
                as: "userData",
            },
        }, {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true,
            },
        }, {
            $project: {
                user_name: "$userData.user_name",
                commentsHistory: 1
            }
        }]);

        let totalCommentsCount = 0;
        const aggregateData = announcementCommentsList[0]?.commentsHistory;
        for (let commentsData of aggregateData) {
            let dataLength = 0;
            if (commentsData.comment && Array.isArray(commentsData.comment)) {
                dataLength = commentsData.comment.length;
            }
            totalCommentsCount += dataLength;
        }
        let data = announcementCommentsList[0] || {};
        data.totalCommentsCount = totalCommentsCount;

        if (announcementCommentsList.length) {
            return res.status(200).json({
                status: 200,
                message: "Announcement comments details successfully!",
                data: data,
            });
        }
        return res.status(404).json({
            status: 404,
            message: "Data not found!",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message ? error.message : message.ERROR_MESSAGE,
        });
    }
}
