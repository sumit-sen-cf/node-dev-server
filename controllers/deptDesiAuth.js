const deptDesiAuthModel = require('../models/deptDesiAuthModel.js');
const userAuthModel = require('../models/userAuthModel.js');
const userModel = require('../models/userModel.js');

exports.addDeptDesiAuth = async (req, res) => {
    try {
        const simc = new deptDesiAuthModel({
            desi_id: req.body.desi_id,
            dept_id: req.body.dept_id,
            obj_id: req.body.obj_id,
            insert: req.body.insert,
            view: req.body.view,
            update: req.body.update,
            delete_flag: req.body.delete_flag,
            creation_date: req.body.creation_date,
            created_by: req.body.created_by
        })
        const simv = await simc.save();
        res.send({ simv, status: 200 });
    } catch (err) {
        res.status(500).send({ error: err, sms: 'This desi dept auth cannot be created' })
    }
}

exports.getSingleDeptDesiAuthDetail = async (req, res) => {
    try {
        const delv = await deptDesiAuthModel.aggregate([
            {
                $match: { desi_id: parseInt(req.params.desi_id) }
            },
            {
                $lookup: {
                    from: 'objectmodels',
                    localField: 'obj_id',
                    foreignField: 'obj_id',
                    as: 'object'
                }
            },
            {
                $unwind: {
                    path: "$object",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'departmentmodels',
                    localField: 'dept_id',
                    foreignField: 'dept_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'designationmodels',
                    localField: 'desi_id',
                    foreignField: 'desi_id',
                    as: 'designation'
                }
            },
            {
                $unwind: {
                    path: "$designation",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$obj_id',
                    // auth_id: { $first: '$auth_id' },
                    // Juser_id: { $first: '$Juser_id' },
                    dept_desi_auth_id: { $first: '$dept_desi_auth_id' },
                    desi_id: { $first: '$desi_id' },
                    dept_id: { $first: '$dept_id' },
                    desi_name: { $first: '$designation.desi_name' },
                    dept_name: { $first: '$department.dept_name' },
                    obj_name: { $first: '$object.obj_name' },
                    obj_id: { $first: '$obj_id' },
                    insert_value: { $first: '$insert' },
                    view_value: { $first: '$view' },
                    update_value: { $first: '$update' },
                    delete_flag_value: { $first: '$delete_flag' }
                }
            },
            {
                $sort: { obj_id: 1 }
            }
        ]);

        if (delv.length === 0) {
            return res.status(404).send({ success: false, message: 'dept desi not found' });
        }

        res.status(200).send(delv);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message, message: 'Error getting dept desi auth details' });
    }
};


exports.updateDeptDesiAuth = async (req, res) => {
    try {
        const editsim = await deptDesiAuthModel.findOneAndUpdate({ dept_desi_auth_id: req.body.dept_desi_auth_id }, {
            dept_id: req.body.dept_id,
            desi_id: req.body.desi_id,
            obj_id: req.body.obj_id,
            insert: req.body.insert,
            view: req.body.view,
            update: req.body.update,
            delete_flag: req.body.delete_flag,
            Last_updated_date: req.body.Last_updated_date,
            Last_updated_by: req.body.Last_updated_by
        }, { new: true })
        if(editsim) {
            const getDeptUsers = await userModel.find({dept_id: req.body.dept_id});
            for(let eachUser of getDeptUsers){
                await userAuthModel.updateMany(
                    {   
                        Juser_id: eachUser.user_id,
                        obj_id: req.body.obj_id
                    },{
                        $set:{
                            insert: req.body.insert,
                            view: req.body.view,
                            update: req.body.update,
                            delete_flag: req.body.delete_flag
                        }
                    }
                )
            }
        }
        if (!editsim) {
            return res.status(500).send({ success: false })
        }
        res.status(200).send({ success: true, data: editsim })
    } catch (err) {
        res.status(500).send({ error: err, sms: 'Error updating dept desi auth details' })
    }
};
// exports.updateDeptDesiAuth = async (req, res) => {
//     try {
//         const existingRecord = await deptDesiAuthModel.findOne({
//             dept_id: req.body.dept_id,
//             desi_id: req.body.desi_id
//         });

//         if (!existingRecord) {
//             const newRecord = new deptDesiAuthModel({
//                 dept_id: req.body.dept_id,
//                 desi_id: req.body.desi_id,
//                 obj_id: req.body.obj_id,
//                 insert: req.body.insert,
//                 view: req.body.view,
//                 update: req.body.update,
//                 delete_flag: req.body.delete_flag,
//                 Last_updated_date: req.body.Last_updated_date,
//                 Last_updated_by: req.body.Last_updated_by
//             });

//             const savedRecord = await newRecord.save();

//             if (!savedRecord) {
//                 return res.status(500).send({ success: false, sms: 'Error inserting new record' });
//             }
//         }

//         const editedRecord = await deptDesiAuthModel.findOneAndUpdate(
//             { dept_id: req.body.dept_id, desi_id: req.body.desi_id },
//             {
//                 dept_id: req.body.dept_id,
//                 desi_id: req.body.desi_id,
//                 obj_id: req.body.obj_id,
//                 insert: req.body.insert,
//                 view: req.body.view,
//                 update: req.body.update,
//                 delete_flag: req.body.delete_flag,
//                 Last_updated_date: req.body.Last_updated_date,
//                 Last_updated_by: req.body.Last_updated_by
//             },
//             { new: true }
//         );

//         if (!editedRecord) {
//             return res.status(500).send({ success: false, sms: 'Error updating dept desi auth details' });
//         }

//         res.status(200).send({ success: true, data: editedRecord });
//     } catch (err) {
//         res.status(500).send({ error: err, sms: 'Internal Server Error' });
//     }
// };