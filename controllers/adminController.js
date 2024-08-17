const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const helper = require('../helper/helper.js');
const bcrypt = require("bcrypt");
const pageMasterModel = require('../models/PMS2/pageMasterModel.js')
const vendorSchema = require('../models/PMS2/vendorModel.js')
const vendorPlatformModel = require('../models/PMS2/vendorPlatformModel.js')
const { ObjectId } = require('mongodb');
const bankDetailsSchema = require('../models/PMS2/bankDetailsModel.js')
// const fs = require('fs');
// const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const vendorGroupLinkModel = require('../models/PMS2/vendorGroupLinkModel.js')

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

exports.getVendorDetailsWithIds = async (req, res) => {
    try {
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
            }, {
                $project: {
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
            return res.status(200).json({ data: [], message: 'No Reord Found...' });
        }
        return res.status(200).json({ data: vendorData, message: 'Data fetched successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error while getting data' })
    }
}

exports.getVendorDetailsWithIdsById = async (req, res) => {
    try {
        const vendorData = await vendorSchema.aggregate([
            {
                $match: {
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
            }, {
                $project: {
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
            return res.status(200).json({ data: [], message: 'No Reord Found...' });
        }
        return res.status(200).json({ data: vendorData, message: 'Data fetched successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error while getting data' })
    }
}

const dataEncryption = (data, secretKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'base64'), iv);
    let encryptedData = cipher.update(data, 'utf8', 'base64');
    encryptedData += cipher.final('base64');
    const combinedData = Buffer.concat([iv, Buffer.from(encryptedData, 'base64')]);
    const encodedData = combinedData.toString('base64');
    return encodedData;
};

exports.createJWTForPluralPayment = async (req, res) => {
    try {
        const secretKey = '8rNJVtbsSDjSFS1DK7bgGeTwEu9gRMPb6OyU5CpKDFQ=';

        const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCurMdlSquva9EJ
+fAfF3zASK4ghVBQ7bnoSnVP4ZF8J612WvV3iqsSGfMaAwhMPnnmalrFMmKtjwY9
MmIdCvqM9jhqqBPg32oV/JJRUuhZbVN4TN8Ixj4qRJ163exH4bstQwXeTjF8b04Y
jNpEltr3M6lrsf1d+RpqnODeylVGgP8ikkP5stsa/svvFdHjD1fTLqJdpKJek6gl
MYOFi4jJRoL+xYdc5UO8KpCxjcJI1gzu1ujWnQzgMoQlsJhO7SM2ja1jz8+3hXM2
OUJ+ePtYz1elHpk9uXzJAwedGhp3ZYimMFTUHHVRKyNiiUFwc8do0HfdQpLwdMyZ
kvP1BkwJAgMBAAECggEAB6tO7ePe1Urkj42SmIZNeMBcvfXuw/W5yUsnCtusziQe
sLtVEf23NIpA2MT0LAcX6nyDypixKZYzbez9zvE0LB3yPwf/TAGw4CNlU3529I9X
+W0Ndde8HLZoO6kSLCSh7BVj0pIGCHvAS3jKj/WFXMksv2RQWPMMY0zK3QZu53yg
ahwqPhcXXqfr47XvhjiBensB8rWkfRR/CEXvAJIxOHcQA4xD9TORzRw+DdTxbJoh
NIntXD3SVhanhttHJen/PgOa9FyyxzDEyU6NP2qo4m3HfFJOaWXblhKsAq+wCPUM
N6iXa1TlKSIDxL4LRpFDGF0yy7BxvZnuJO4uqGHJiQKBgQDcy8vOLDfamTGd+v/K
8Z+3PFePz293fHnO8pkGnp9FjHHvBR9yX5LdgAKrU56mv6j5YuynCTM6z+yz3ept
o2/nUOncSQB50kxE3PjCRoFofoaHqtW8pRbPdNWkV8/T4PiIF1Z8w7B+kzQfqQoN
/sWhCtn1MxjnYESaqaPwUnoIYwKBgQDKhnYnaVyFbDuHKGo72ka0Bg7hi+FNuEzH
dm5BGImGvoVhB+9ikQai4FYu2SFGj4uT7pG0U+eSA62cPUFMZa/eU6gNTRHb0LmG
ucCkZLazn46fPU8ZuygXxDqfuXv1Iw1Le5ZV5cpnhqYtMVdXbz409zduLIFkj/0f
3RgadlrHowKBgQChNUMm024scvGhMSQWHvjIJoyf+YqfKQkeqk5EYQhVFUgShiEB
tvpaMx6/zJvnj8Rl4W58PuFirXFbmkmRp2UK9S7qoXpxd7QsC1KtNiFCFC9RWtAX
nknbSqi6B0s8neOYKcIB8jcpE31ZKGio8z2EaZHdz2L9fHJaokWKMA3dlQKBgQCw
5dn2etVRxUQJvodsWDBBtrjw0VmupTiLUSrkuSYHCAtAwcma8so1Inak3Qtvsppc
UJn8RP2UUJooSmjq7jc7nx6+336l3h7vSvi1nzLmmovdE5QwCYXvnHsIYN+hM0i9
kemyhdDRtI8aEmsT+BsB8J3+IemziQGz/066bn7EuQKBgQCEhOqdQ0M3EOLsSWrM
p2cRCf2Wfd21peZHHiVY2ehIA9JhEPrpWCFAXAbvYjH3r12/j0GmsVPnAdukgc9p
/rZypJUnAUOFXfd7AqsNVZ07V1DLw49gbLKPIbhi7z5E8exhpUdKaH8y3oKsek7i
buBDe+JCDb5YyVyOyfha4T5fZQ==
-----END RSA PRIVATE KEY-----`;

        const map = {
            mid: '19181',
            iss: 'Akshit',
            agr: 'PLURAL',
        };

        const claims = {
            srv: 'Payout',
            data: '',
        };

        const data = JSON.stringify(map);
        const now = new Date();
        const encodedData = dataEncryption(data, secretKey);
        claims.data = encodedData;
        const tokenTimeOut = 30;
        const jwtToken = jwt.sign(
            {
                ...claims,
                sub: Buffer.from('usr-a1e6864c1e61458087ae734f24b0524c').toString('base64'),
                aud: 'Plural',
                jti: uuidv4(),
                iat: Math.floor(now.getTime() / 1000),
                exp: Math.floor(now.getTime() / 1000) + tokenTimeOut * 60,
            },
            privateKey,
            {
                algorithm: 'RS256',
            }
        );
        return res.status(200).json({ data: jwtToken, message: 'Token for Plural Payment Gateway generated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Error while generating JWT token' });
    }
}

exports.updatepagevendorids = async (req, res) => {
    try {
        const pageMasters = await pageMasterModel.find();

        for (let i = 0; i < pageMasters.length; i++) {
            const pageMaster = pageMasters[i];

            const vendor = await vendorSchema.findOne({ vendor_id: pageMaster.temp_vendor_id });

            if (vendor) {
                await pageMasterModel.updateOne(
                    { _id: pageMaster._id },
                    { $set: { vendor_id: vendor._id } }
                );
            }
        }
        return res.status(200).json({ message: 'Vendor IDs updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateVendoridinGroupLink = async (req, res) => {
    try {
        const groupLinks = await vendorGroupLinkModel.find();

        for (let i = 0; i < groupLinks.length; i++) {
            const groupLink = groupLinks[i];

            const vendor = await vendorSchema.findOne({ vendor_id: groupLink.temp_vendor_id });

            if (vendor) {
                await vendorGroupLinkModel.updateMany(
                    { temp_vendor_id: groupLink.temp_vendor_id },
                    { $set: { vendor_id: vendor._id } }
                );
            }
        }
        return res.status(200).json({ message: 'Vendor IDs updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.copyHomeToCompAddress = async (req, res) => {
    try {
        const vendormodels = await vendorSchema.find({});

        for (const vendor of vendormodels) {
            const newVendorCompanyDetails = {
                vendor_id: vendor._id,
                company_name: '',
                address: vendor.home_address || '',
                city: vendor.home_city || '',
                pincode: vendor.home_pincode || 0,
                state: vendor.home_state || '',
                threshold_limit: '100',
                created_by: 229,
                updated_by: 0,
                status: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await companyDetailsSchema.create(newVendorCompanyDetails);
        }
        res.status(200).json({ message: 'Data inserted from vendor company address' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Error while shifting data' });
    }
};