const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const helper = require('../helper/helper.js');
const bcrypt = require("bcrypt");
const pageMasterModel = require('../models/PMS2/pageMasterModel.js')
const vendorSchema = require('../models/PMS2/vendorModel.js')
const vendorPlatformModel = require('../models/PMS2/vendorPlatformModel.js')
const { ObjectId } = require('mongodb');
const bankDetailsSchema = require('../models/PMS2/bankDetailsModel.js')

exports.changePassOfSelectedUsers = async (req, res) => {
    try {
        let encryptedPass;
        if (req.body.user_login_password) {
            encryptedPass = await bcrypt.hash(req.body.user_login_password, 10);
        } else {
            return res.status(400).send({ success: false, message: 'Password is required' });
        }

        const userIds = req.body.allUserIds;
        if (!userIds || !Array.isArray(userIds)) {
            return res.status(400).send({ success: false, message: 'User IDs are required and should be an array' });
        }

        let results = {
            success: [],
            notFound: [],
            errors: []
        };

        for (const userId of userIds) {
            try {
                const existingUser = await userModel.findOne({ user_id: userId });
                if (!existingUser) {
                    results.notFound.push(userId);
                    continue;
                }

                const updatedUser = await userModel.findOneAndUpdate(
                    { user_id: userId },
                    { user_login_password: encryptedPass },
                    { new: true }
                );

                if (!updatedUser) {
                    results.errors.push(userId);
                } else {
                    results.success.push(userId);
                }
            } catch (error) {
                results.errors.push(userId);
            }
        }

        if (results.success.length === 0) {
            return res.status(500).send({ success: false, message: 'Failed to change passwords for all users', results });
        }

        return res.status(200).send({ success: true, message: 'Password changed successfully for users', results });
    } catch (err) {
        return res.status(500).send({ error: err.message, message: 'Error while updating user personal information details' });
    }
};

exports.changePassOfUsers = async (req, res) => {
    try {
        let results = {
            success: [],
            notFound: [],
            errors: []
        };

        const getRandomPassword = helper.generateRandomPassword();
        const encryptedPass = await bcrypt.hash(getRandomPassword, 10);
        const userIds = await userModel.find();

        for (const userId of userIds) {
            try {

                if (userId.user_name == 'Admin' || userId.user_name === 'Super Admin') {
                    results.notFound.push(userId);
                    continue;
                }

                const updatedUser = await userModel.findOneAndUpdate(
                    { user_id: userId.user_id },
                    { user_login_password: encryptedPass },
                    { new: true }
                );

                if (!updatedUser) {
                    results.notFound.push(userId);
                } else {
                    results.success.push(userId);
                }
            } catch (error) {
                console.error(`Error updating password for user ${userId.user_id}: ${error.message}`);
                results.errors.push(userId);
            }
        }

        if (results.success.length === 0) {
            return res.status(500).send({ success: false, message: 'Failed to change passwords for all users', results });
        }

        return res.status(200).send({ success: true, message: 'Password changed successfully for users', results });
    } catch (err) {
        console.error(`Error while updating user passwords: ${err.message}`);
        return res.status(500).send({ error: err.message, message: 'Error while updating user passwords' });
    }
};

exports.sendPassEmailToUsers = async (req, res) => {
    try {
        const allUserEmailIds = req.body.emails;

        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "onboarding@creativefuel.io",
                pass: "zboiicwhuvakthth",
            },
        });

        for (const email of allUserEmailIds) {
            const mailOptions = {
                from: 'onboarding@creativefuel.io',
                to: email,
                subject: 'Your Login Password Changed',
                text: 'Your new password is',
                attachments: [
                    {
                        filename: req.file.originalname,
                    }
                ]
            };
            try {
                await mailTransporter.sendMail(mailOptions);
                console.log(`Email sent to ${email}`)
            } catch (err) {
                console.log(err.message)
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Internal Server Error' });
    }
}

exports.changeVendorIdToId = async (req, res) => {
    try {
        const pm2pagemasterDocs = await pageMasterModel.find({ temp_vendor_id: { $ne: null } });
    
        for (let i = 0; i < pm2pagemasterDocs.length; i++) {
          const pm2pagemasterDoc = pm2pagemasterDocs[i];
          
          const vendorSchemaDoc = await vendorSchema.findOne({ vendor_id: pm2pagemasterDoc.temp_vendor_id });
          
          if (vendorSchemaDoc) {
            pm2pagemasterDoc.vendor_id = vendorSchemaDoc._id;
            await pm2pagemasterDoc.save();
          }
        }
    
        res.status(200).json({ message: 'Vendor IDs updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.changePrimaryPageToId = async (req, res) => {
    try {
        const vendors = await vendorSchema.find({}).select({ primary_page: 1 });

        const pm2pagemasterDocs = await pageMasterModel.find({ p_id: { $ne: null } });

        for (let i = 0; i < vendors.length; i++) {
            const vendor = vendors[i];
            const pm2pagemasterDoc = pm2pagemasterDocs.find(doc => doc.p_id === vendor.primary_page);

            if (pm2pagemasterDoc) {
                vendor.primary_page = pm2pagemasterDoc._id; 
                await vendor.save(); 
            }
        }

        res.status(200).json({ message: 'Vendor IDs updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.shiftBankDetails = async (req, res) => {
    try {
        const vendormodels = await vendorSchema.find({});

        for (const vendor of vendormodels) {
            const newVendorBankDetails = {
                vendor_id: vendor._id,
                registered_number: vendor.mobile,
                bank_name: vendor.bank_name || '',
                account_type: vendor.account_type || '',
                account_number: vendor.account_number || 0,
                ifsc: vendor.ifsc || '',
                upi_id: vendor.payment_details || '',
                created_by: null,
                updated_by: null,
                status: 1,
                __v: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                created_by: vendor.created_by || 0
            };
            await bankDetailsSchema.create(newVendorBankDetails);
        }
        res.status(200).json({ message: 'Data inserted from vendor to bank collection' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Error while shifting data' });
    }
};

exports.getVendorDetailsWithIds = async(req, res) => {
    try{
        const vendorData = await vendorSchema.aggregate([
            {
                $lookup: {
                    from: "pms2vendorplatformmodels",
                    localField: "vendor_platform",
                    foreignField: "_id",
                    as: "vendorPlatformDetail",
                },
            }, {
                $unwind: {
                    path: "$vendorPlatformDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pms2vendortypemodels",
                    localField: "vendor_type",
                    foreignField: "_id",
                    as: "vendorTypeDetail",
                },
            }, {
                $unwind: {
                    path: "$vendorTypeDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pms2pagemastermodels",
                    localField: "primary_page",
                    foreignField: "_id",
                    as: "vendorPageDetail",
                },
            }, {
                $unwind: {
                    path: "$vendorPageDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },{
                $project:{
                    closed_by: 1,
                    status: 1,
                    _id: 1,
                    vendor_id: 1,
                    vendor_name: 1,
                    page_count: 1,
                    mobile: 1,
                    alternate_mobile: 1,
                    vendor_type: 1,
                    payment_method: 1,
                    payment_details: 1,
                    pay_cycle: 1,
                    created_at: 1,
                    vendor_platform: 1,
                    Pincode: 1,
                    created_by: 1,
                    updatedAt: 1,
                    updated_by: 1,
                    primary_page: 1,
                    platform_name: "$vendorPlatformDetail.platform_name",
                    type_name: "$vendorTypeDetail.type_name",
                    primary_page_name: "$vendorPageDetail.page_name"
                }
            } 
        ]);
        if (!vendorData) {
            return res.status(200).json({data:[],message:'No Reord Found...'});
        }
        return res.status(200).json({data:vendorData, message:'Data fetched successfully'});
    }catch(err){
        res.status(500).json({error:err.message, message:'error while getting data'})
    }
}

exports.getVendorDetailsWithIdsById = async(req, res) => {
    try{
        const vendorData = await vendorSchema.aggregate([
            {
                $match:{
                    vendor_id: Number(req.params.vendor_id)
                }
            },
            {
                $lookup: {
                    from: "pms2vendorplatformmodels",
                    localField: "vendor_platform",
                    foreignField: "_id",
                    as: "vendorPlatformDetail",
                },
            }, {
                $unwind: {
                    path: "$vendorPlatformDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pms2vendortypemodels",
                    localField: "vendor_type",
                    foreignField: "_id",
                    as: "vendorTypeDetail",
                },
            }, {
                $unwind: {
                    path: "$vendorTypeDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "pms2pagemastermodels",
                    localField: "primary_page",
                    foreignField: "_id",
                    as: "vendorPageDetail",
                },
            }, {
                $unwind: {
                    path: "$vendorPageDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },{
                $project:{
                    closed_by: 1,
                    status: 1,
                    _id: 1,
                    vendor_id: 1,
                    vendor_name: 1,
                    page_count: 1,
                    mobile: 1,
                    alternate_mobile: 1,
                    vendor_type: 1,
                    payment_method: 1,
                    payment_details: 1,
                    pay_cycle: 1,
                    created_at: 1,
                    vendor_platform: 1,
                    Pincode: 1,
                    created_by: 1,
                    updatedAt: 1,
                    updated_by: 1,
                    primary_page: 1,
                    platform_name: "$vendorPlatformDetail.platform_name",
                    type_name: "$vendorTypeDetail.type_name",
                    primary_page_name: "$vendorPageDetail.page_name"
                }
            } 
        ]);
        if (!vendorData) {
            return res.status(200).json({data:[],message:'No Reord Found...'});
        }
        return res.status(200).json({data:vendorData, message:'Data fetched successfully'});
    }catch(err){
        res.status(500).json({error:err.message, message:'error while getting data'})
    }
}