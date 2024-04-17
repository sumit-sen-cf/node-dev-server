const { createNextInvoiceNumber } = require("../helper/helper.js");
const attendanceModel = require("../models/attendanceModel.js");
const userModels = require("../models/userAuthModel.js");
const userModel = require("../models/userModel.js");
const vari = require("../variables.js");
const billingHeaderModel = require("../models/billingheaderModel.js");
const separationModel = require("../models/separationModel.js");

async function doesUserExistInAttendance(userId, month, year) {
  const results = await attendanceModel.find({
    user_id: userId,
    month: month,
    year: year,
  });
  return results.length > 0;
}

function monthNameToNumber(monthName) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = months.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );

  // Adding 1 because months are zero-indexed in JavaScript (0-11)
  return monthIndex !== -1 ? monthIndex + 1 : null;
}


const getLatestAttendanceId = async () => {
  try {
    const latestAttendance = await attendanceModel.findOne().sort({ attendence_id: -1 });
    // console.log("latestAttendance", latestAttendance);
    if (latestAttendance) {
      return latestAttendance.attendence_id;
    }
    return 0;
  } catch (error) {
    console.error("Error finding latest attendance ID:", error);
    throw error;
  }
};

let attendanceIdCounter;

const initializeAttendanceIdCounter = async () => {
  try {
    const latestAttendanceId = await getLatestAttendanceId();
    attendanceIdCounter = latestAttendanceId + 1;
  } catch (error) {
    console.error("Error initializing attendanceIdCounter:", error);
    throw error;
  }
};

initializeAttendanceIdCounter();

const getNextAttendanceId = () => {
  if (attendanceIdCounter === undefined) {
    throw new Error("attendanceIdCounter is not initialized. Call initializeAttendanceIdCounter() first.");
  }
  return attendanceIdCounter++;
};

// function getLastDateOfMonth(month, year) {
//   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   const monthIndex = monthNames.indexOf(month);
//   if (monthIndex === -1) {
//     throw new Error('Invalid month name');
//   }

//   let nextMonth = new Date(year, monthIndex + 1, 1);
//   let lastDateOfMonth = new Date(nextMonth - 1);
//   return lastDateOfMonth.getDate();
// }

exports.addAttendance = async (req, res) => {
  try {
    const {
      dept,
      user_id,
      noOfabsent,
      month,
      year,
      bonus,
      remark,
      created_by,
      salary_deduction,
      attendence_status,
      attendence_status_flow,
      salary_status,
    } = req.body;

    const checkBillingHeader = await billingHeaderModel.findOne({ dept_id: dept });

    if (!checkBillingHeader) {
      return res.status(409).send({
        data: [],
        message: "Please Added First Billing Header For This Department",
      });
    }

    // const monthLastValue = getLastDateOfMonth(month, year);

    const attendanceData = await userModel.aggregate([
      {
        $lookup: {
          from: "separationmodels",
          localField: "user_id",
          foreignField: "user_id",
          as: "separation",
        },
      },
      {
        $unwind: {
          path: "$separation",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$user_id",
          status: { $first: "$separation.status" },
          resignation_date: { $first: "$separation.resignation_date" },
          joining_date: { $first: "$joining_date" }
        },
      },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          status: 1,
          resignation_date: 1,
          joining_date: 1
        },
      },
    ]);

    if (attendanceData.length !== 0) {
      //Extract user data
      const check1 = await attendanceModel.find({
        user_id: req.body.user_id,
        month: req.body.month,
        year: req.body.year,
      });
      if (check1.length == 0) {
        const check2 = await userModel.find({
          job_type: "WFHD",
          dept_id: req.body.dept,
          att_status: 'onboarded',
          user_status: "Active"
        });

        let filteredUserData = check2.map(user => {
          const attendance = attendanceData.find(data => data.user_id === user.user_id);
          if (attendance) {
            return { ...user.toObject(), ...attendance };
          } else {
            return user.toObject();
          }
        });

        filteredUserData?.length > 0 &&
          filteredUserData.map(async (user) => {
            //logic for separation
            const resignDate = user.resignation_date;

            const resignConvertDate = new Date(resignDate);

            const resignMonth = resignConvertDate.toLocaleString('default', { month: 'long' });

            const resignMonthNum = resignConvertDate.getUTCMonth() + 1;

            const resignYear = String(resignConvertDate.getUTCFullYear());
            const resignExtractDate = resignConvertDate.getDate();
            const resignMonthYear = `${resignYear}` + `${resignMonthNum}`;

            var work_days;
            const absent = noOfabsent == undefined ? 0 : req.body.noOfabsent;
            const joining = user.joining_date;
            const convertDate = new Date(joining);
            // const extractJodDate = convertDate.getDate() - 1;
            const extractDate = convertDate.getDate() - 1;
            const joiningMonth = String(convertDate.getUTCMonth() + 1);
            const joiningYear = String(convertDate.getUTCFullYear());
            const mergeJoining = parseInt(joiningMonth + joiningYear);
            const monthNumber = monthNameToNumber(month);
            const mergeJoining1 = `${monthNumber}` + `${year}`;
            if (mergeJoining == mergeJoining1) {
              if (extractDate < 15) {
                work_days = 15 - extractDate - absent;
              } else {
                work_days = 30 - extractDate - absent;
              }
            } else if (user.status == "Resigned") {
              work_days = (30 - resignExtractDate) - absent;
            }
            else {
              work_days = 30 - absent;
            }
            const bodymonth = `${year}` + `${monthNumber}`;

            const joiningMonthNumber = convertDate.getUTCMonth() + 1;
            const joiningYearNumber = convertDate.getUTCFullYear();
            const mergeMonthYear = `${joiningYearNumber}` + `${joiningMonthNumber}`;

            if (mergeMonthYear <= bodymonth) {
              const userExistsInAttendance = await doesUserExistInAttendance(
                user.user_id,
                req.body.month,
                req.body.year
              );
              if (!userExistsInAttendance) {
                const presentDays = work_days;

                const perdaysal = user.salary / 30;

                const totalSalary = perdaysal * presentDays;

                const Bonus = bonus == undefined ? 0 : req.body.bonus;

                const netSalary = totalSalary + Bonus;

                const tdsDeduction = (netSalary * user.tds_per) / 100;

                const ToPay = netSalary - tdsDeduction;
                const salary = user.salary;
                let invoiceNo = await createNextInvoiceNumber(user.user_id, month, year);

                const attendanceId = await getNextAttendanceId();
                const creators = new attendanceModel({
                  attendence_id: attendanceId,
                  dept: user.dept_id,
                  user_id: user.user_id,
                  invoiceNo: invoiceNo,
                  user_name: user.user_name,
                  noOfabsent: absent,
                  present_days: presentDays,
                  month_salary: totalSalary && totalSalary.toFixed(2),
                  month: req.body.month,
                  year: req.body.year,
                  bonus: Bonus,
                  total_salary: user.salary && user.salary.toFixed(2),
                  tds_deduction: tdsDeduction && tdsDeduction.toFixed(2),
                  net_salary: netSalary && netSalary.toFixed(2),
                  toPay: ToPay && ToPay.toFixed(2),
                  remark: "",
                  Created_by: req.body.user_id,
                  salary,
                  attendence_status_flow: "Payout Generated",
                  disputed_reason: req.body.disputed_reason,
                  disputed_date: req.body.disputed_date,
                  salary_deduction: req.body.salary_deduction
                });

                if (user.status == "Resigned" && resignMonthYear < bodymonth) {
                  console.log("User Exist ");
                } else {
                  const instav = await creators.save();
                }
              }
              // res.send({ status: 200 });
            }

          });
        res.send({ status: 200 });
      } else {
        const Dept = dept || "";
        const User_id = user_id || "";
        const No_of_absent = noOfabsent || 0;
        const Month = month || "";
        const Year = year || "";
        const Bonus = bonus || 0;
        const Remark = remark || "";
        const created_By = created_by ? parseInt(created_by) : 0;
        const creation_date = new Date();
        const check1 = await attendanceModel.find({
          user_id: req.body.user_id,
          month: req.body.month,
          year: req.body.year,
        });
        if (check1.length == 0) {
          const check2 = await userModel.find({
            job_type: "WFHD",
            dept_id: req.body.dept,
            att_status: 'onboarded'
          });
          check2.map(async (user) => {
            var work_days;
            const joining = user.joining_date;
            const convertDate = new Date(joining);
            const extractDate = convertDate.getDate() - 1;
            const joiningMonth = String(convertDate.getUTCMonth() + 1).padStart(
              2,
              "0"
            );
            const joiningYear = String(convertDate.getUTCFullYear());
            const mergeJoining = parseInt(joiningMonth + joiningYear);
            const monthNumber = monthNameToNumber(month);
            const mergeJoining1 = `${monthNumber}` + `${year}`;
            if (mergeJoining == mergeJoining1) {
              work_days = monthLastValue - extractDate;
            } else {
              work_days = monthLastValue;
            }
            const userExistsInAttendance = await doesUserExistInAttendance(
              user.user_id,
              req.body.month,
              req.body.year
            );
            if (!userExistsInAttendance) {
              const presentDays = work_days;
              const perdaysal = user.salary / work_days;
              const totalSalary = perdaysal * presentDays;
              const Bonus = bonus || 0;
              const netSalary = totalSalary + Bonus;
              const tdsDeduction = (netSalary * user.tds_per) / 100;
              const ToPay = netSalary - tdsDeduction;
              const salary = user.salary;
              let invoiceNo = await createNextInvoiceNumber(user.user_id, month, year);
              const creators = new attendanceModel({
                dept: user.dept_id,
                user_id: user.user_id,
                invoiceNo: invoiceNo,
                user_name: user.user_name,
                noOfabsent: 0,
                present_days: presentDays,
                month_salary: totalSalary,
                month: req.body.month,
                year: req.body.year,
                bonus: Bonus,
                total_salary: user.salary && user.salary.toFixed(2),
                tds_deduction: tdsDeduction && tdsDeduction.toFixed(2),
                net_salary: netSalary && netSalary.toFixed(2),
                toPay: ToPay && ToPay.toFixed(2),
                remark: "",
                Created_by: req.body.user_id,
                salary,
                attendence_status_flow: "Payout Generated",
                disputed_reason: req.body.disputed_reason,
                disputed_date: req.body.disputed_date
              });
              const instav = await creators.save();
            }
            // res.send({ status: 200 });
          });
          res.send({ status: 200 });
        } else if (
          req.body.user_id == check1[0].user_id &&
          req.body.month == check1[0].month &&
          req.body.year == check1[0].year
        ) {
          const results4 = await userModel.find({
            job_type: "WFHD",
            user_id: parseInt(req.body.user_id),
          });

          const findSeparationData = await separationModel.findOne({ user_id: req.body.user_id })
          const resignDate = findSeparationData?.resignation_date;
          const resignConvertDate = new Date(resignDate);
          const resignExtractDate = resignConvertDate?.getDate();

          var work_days;
          const absent = noOfabsent == undefined ? 0 : req.body.noOfabsent;
          const salaryDeduction = salary_deduction == undefined ? 0 : req.body.salary_deduction;
          const joining = results4[0].joining_date;
          const convertDate = new Date(joining);
          const extractDate = convertDate.getDate() - 1;
          const joiningMonth = String(convertDate.getUTCMonth() + 1).padStart(
            2,
            "0"
          );
          const joiningYear = String(convertDate.getUTCFullYear());
          const mergeJoining = parseInt(joiningMonth + joiningYear);
          const monthNumber = monthNameToNumber(month);
          const mergeJoining1 = `${monthNumber}` + `${year}`;
          if (mergeJoining == mergeJoining1) {
            if (extractDate < 15) {
              work_days = 15 - extractDate - absent;
            } else {
              work_days = 30 - extractDate - absent;
            }
            // work_days = monthLastValue - extractDate - absent;
          } else if (findSeparationData?.status == "Resigned") {
            work_days = (30 - resignExtractDate) - absent;
          }
          else {
            work_days = 30 - absent;
          }

          const present_days = work_days;
          const perdaysal = results4[0].salary / 30;
          const totalSalary = perdaysal * present_days;
          const Bonus = bonus == undefined ? 0 : req.body.bonus;
          const netSalary = (totalSalary + parseInt(Bonus)) - salaryDeduction;
          const tdsDeduction = (netSalary * results4[0].tds_per) / 100;
          const ToPay = netSalary - tdsDeduction;
          const salary = results4[0].salary;
          // const attendanceId = await getNextAttendanceId();
          const editsim = await attendanceModel.findOneAndUpdate(
            // { attendence_id: parseInt(check1[0].attendence_id) },
            // { attendence_id: attendanceId },
            {
              attendence_id: parseInt(req.body.attendence_id),
              month: req.body.month,
              year: req.body.year,
            },
            {
              dept: req.body.dept,
              user_id: req.body.user_id,
              noOfabsent: absent,
              month: req.body.month,
              year: req.body.year,
              bonus: Bonus,
              total_salary: totalSalary && totalSalary.toFixed(2),
              tds_deduction: tdsDeduction && tdsDeduction.toFixed(2),
              net_salary: netSalary && netSalary.toFixed(2),
              toPay: ToPay && ToPay.toFixed(2),
              month_salary: (present_days * perdaysal).toFixed(2),
              remark: req.body.remark,
              salary,
              salary_deduction,
              attendence_status,
              salary_status,
              disputed_reason: req.body.disputed_reason,
              disputed_date: req.body.disputed_date,
              attendence_status_flow: req.body.attendence_status_flow,
            },
            { new: true }
          ).sort({ attendence_id: 1 });
          // console.log("edit", editsim)
          return res.send({ status: 200 });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: error.message, sms: "error while adding data" });
  }
};


exports.getSalaryByDeptIdMonthYear = async (req, res) => {
  try {
    const imageUrl = vari.IMAGE_URL;

    const getcreators = await attendanceModel
      .aggregate([
        {
          $match: {
            dept: parseInt(req.body.dept_id),
            month: req.body.month,
            year: parseInt(req.body.year),
          },
        },
        {
          $lookup: {
            from: "departmentmodels",
            localField: "dept",
            foreignField: "dept_id",
            as: "department",
          },
        },
        {
          $unwind: {
            path: "$department",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "billingheadermodels",
            localField: "department.dept_id",
            foreignField: "dept_id",
            as: "billingheadermodels",
          },
        },
        // {
        //   $unwind: "$finance",
        // },
        {
          $unwind: {
            path: "$billingheadermodels",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "usermodels",
            localField: "user_id",
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
          $lookup: {
            from: "designationmodels",
            localField: "user.user_designation",
            foreignField: "desi_id",
            as: "designation",
          },
        },
        {
          $unwind: {
            path: "$designation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "financemodels",
            localField: "attendence_id",
            foreignField: "attendence_id",
            as: "finance",
          },
        },
        // {
        //   $unwind: "$finance",
        // },
        {
          $unwind: {
            path: "$finance",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            attendence_id: 1,
            dept: 1,
            user_id: 1,
            noOfabsent: 1,
            present_days: 1,
            month_salary: 1,
            year: 1,
            remark: 1,
            Creation_date: 1,
            Created_by: 1,
            Last_updated_by: 1,
            Last_updated_date: 1,
            month: 1,
            bonus: 1,
            total_salary: 1,
            net_salary: 1,
            tds_deduction: 1,
            attendence_status_flow: 1,
            user_name: "$user.user_name",
            user_email_id: "$user.user_email_id",
            user_contact_no: "$user.user_contact_no",
            permanent_address: "$user.permanent_address",
            permanent_city: "$user.permanent_city",
            permanent_state: "$user.permanent_state",
            permanent_pin_code: "$user.permanent_pin_code",
            bank_name: "$user.bank_name",
            ifsc_code: "$user.ifsc_code",
            account_no: "$user.account_no",
            billing_header_name: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: [
                        { $type: "$billingheadermodels.billing_header_name" },
                        "missing",
                      ],
                    },
                  ],
                },
                then: "",
                else: "$billingheadermodels.billing_header_name",
              },
            },
            toPay: 1,
            sendToFinance: 1,
            attendence_generated: 1,
            invoiceNo: 1,
            attendence_status: 1,
            salary_status: 1,
            salary_deduction: 1,
            salary: 1,
            dept_name: "$department.dept_name",
            pan_no: "$user.pan_no",
            current_address: "$user.current_address",
            invoice_template_no: "$user.invoice_template_no",
            joining_date: "$user.joining_date",
            designation_name: "$designation.desi_name",
            status_: "$finance.status_",
            reference_no: "$finance.reference_no",
            amount: "$finance.amount",
            pay_date: "$finance.pay_date",
            screenshot: {
              $concat: [imageUrl, "$finance.screenshot"],
            },
            digital_signature_image: "$user.digital_signature_image",
          },
        },
        {
          $group: {
            _id: "$attendence_id",
            data: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$data" },
        },
      ])
      .exec();
    if (getcreators?.length === 0) {
      return res.status(500).send({ success: false });
    }
    return res.status(200).send({ data: getcreators });
  } catch (err) {
    return res.status(500).send({ error: err.message, sms: "Error getting salary" });
  }
};


exports.getSalaryByMonthYear = async (req, res) => {
  try {
    const imageUrl = vari.IMAGE_URL;

    const getcreators = await attendanceModel
      .aggregate([
        {
          $match: {
            month: req.body.month,
            year: parseInt(req.body.year),
          },
        },
        {
          $lookup: {
            from: "usermodels",
            localField: "user_id",
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
          $lookup: {
            from: "designationmodels",
            localField: "user.user_designation",
            foreignField: "desi_id",
            as: "designation",
          },
        },
        {
          $unwind: {
            path: "$designation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "financemodels",
            localField: "attendence_id",
            foreignField: "attendence_id",
            as: "finance",
          },
        },
        {
          $unwind: {
            path: "$finance",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            attendence_id: 1,
            dept: 1,
            user_id: 1,
            noOfabsent: 1,
            year: 1,
            remark: 1,
            Creation_date: 1,
            Created_by: 1,
            Last_updated_by: 1,
            Last_updated_date: 1,
            month: 1,
            bonus: 1,
            total_salary: 1,
            net_salary: 1,
            tds_deduction: 1,
            user_name: "$user.user_name",
            user_email_id: "$user.user_email_id",
            user_contact_no: "$user.user_contact_no",
            permanent_address: "$user.permanent_address",
            permanent_city: "$user.permanent_city",
            permanent_state: "$user.permanent_state",
            permanent_pin_code: "$user.permanent_pin_code",
            bank_name: "$user.bank_name",
            ifsc_code: "$user.ifsc_code",
            account_no: "$user.account_no",
            toPay: 1,
            sendToFinance: 1,
            attendence_generated: 1,
            invoiceNo: 1,
            attendence_status: 1,
            salary_status: 1,
            salary_deduction: 1,
            salary: 1,
            pan_no: "$user.pan_no",
            current_address: "$user.current_address",
            invoice_template_no: "$user.invoice_template_no",
            joining_date: "$user.joining_date",
            designation_name: "$designation.desi_name",
            status_: "$finance.status_",
            reference_no: "$finance.reference_no",
            amount: "$finance.amount",
            pay_date: "$finance.pay_date",
            screenshot: {
              $concat: [imageUrl, "$finance.screenshot"],
            },
            digital_signature_image: "$user.digital_signature_image",
          },
        },
      ])
      .exec();
    if (getcreators?.length === 0) {
      return res.status(500).send({ success: false });
    }
    return res.status(200).send({ data: getcreators });
  } catch (err) {
    return res.status(500).send({ error: err, sms: "Error getting salary" });
  }
};

exports.getSalaryByFilter = async (req, res) => {
  try {
    if (req.body.dept == 0) {
      res.status(200).send({ sms: "working on it" });
    } else {
      const getcreators = await attendanceModel
        .aggregate([
          {
            $match: { dept: parseInt(req.body.dept) },
          },
          {
            $lookup: {
              from: "departmentmodels",
              localField: "dept",
              foreignField: "dept_id",
              as: "department",
            },
          },
          {
            $unwind: "$department",
          },
          {
            $project: {
              dept_name: "$department.dept_name",
              id: "$id",
              dept: "$dept",
              user_id: "$user_id",
              noOfabsent: "$noOfabsent",
              month: "$month",
              year: "$year",
              bonus: "$bonus",
              total_salary: "$total_salary",
              tds_deduction: "$tds_deduction",
              net_salary: "$net_salary",
              toPay: "$toPay",
              remark: "$remark",
              created_by: "$created_by",
            },
          },
        ])
        .exec();
      res.status(200).send({ data: getcreators });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: err, sms: "Error getting salary from dept id" });
  }
};

exports.getSalaryByUserId = async (req, res) => {
  try {
    const imageUrl = vari.IMAGE_URL;
    const getcreators = await attendanceModel
      .aggregate([
        {
          $match: { user_id: parseInt(req.body.user_id) },
        },
        {
          $lookup: {
            from: "departmentmodels",
            localField: "dept",
            foreignField: "dept_id",
            as: "department",
          },
        },
        {
          $unwind: "$department",
        },
        {
          $lookup: {
            from: "billingheadermodels",
            localField: "dept",
            foreignField: "dept_id",
            as: "billingheadermodels",
          },
        },
        {
          $unwind: {
            path: "$billingheadermodels",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "financemodels",
            localField: "attendence_id",
            foreignField: "attendence_id",
            as: "fn",
          },
        },
        {
          $unwind: {
            path: "$fn",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "usermodels",
            localField: "user_id",
            foreignField: "user_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "designationmodels",
            localField: "user.user_designation",
            foreignField: "desi_id",
            as: "designation",
          },
        },
        {
          $unwind: "$designation",
        },
        {
          $project: {
            user_name: "$user.user_name",
            billing_header_name: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: [
                        { $type: "$billingheadermodels.billing_header_name" },
                        "missing",
                      ],
                    },
                  ],
                },
                then: "",
                else: "$billingheadermodels.billing_header_name",
              },
            },
            // billing_header_name: "$billingheadermodels.billing_header_name",
            user_email_id: "$user.user_email_id",
            digital_signature_image: "$user.digital_signature_image",
            pan_no: "$user.pan_no",
            current_address: "$user.current_address",
            status_: "$fn.status_",
            reference_no: "$fn.reference_no",
            pay_date: "$fn.pay_date",
            amount: "$fn.amount",
            invoice_template_no: "$user.invoice_template_no",
            dept_name: "$department.dept_name",
            designation_name: "$designation.desi_name",
            id: "$id",
            dept: "$dept",
            user_id: "$user_id",
            noOfabsent: "$noOfabsent",
            month: "$month",
            year: "$year",
            bonus: "$bonus",
            total_salary: "$total_salary",
            tds_deduction: "$tds_deduction",
            net_salary: "$net_salary",
            toPay: "$toPay",
            remark: "$remark",
            Created_by: "$Created_by",
            Creation_date: "$Creation_date",
            Last_updated_by: "$Last_updated_by",
            Last_updated_date: "$Last_updated_date",
            sendToFinance: "$sendToFinance",
            attendence_generated: "$attendence_generated",
            attendence_status: "$attendence_status",
            salary_status: "$salary_status",
            salary_deduction: "$salary_deduction",
            salary: "$salary",
            attendence_id: "$attendence_id",
            invoiceNo: "$invoiceNo",
            screenshot: {
              $concat: [imageUrl, "$fn.screenshot"]
            },
            beneficiary_name: "$user.beneficiary",
            bank_name: "$user.bank_name",
            account_no: "$user.account_no",
            ifsc_code: "$user.ifsc_code",
            pan_no: "$user.pan",
            user_contact_no: "$user.user_contact_no",
            current_address: "$user.current_address",
            sendToFinance: "$sendToFinance",
            digital_signature_image_url: {
              $concat: [imageUrl, "$user.digital_signature_image"]
            },
            attendence_status_flow: 1,
            disputed_reason: "$disputed_reason",
            disputed_date: "$disputed_date",
            current_address: "$user.current_address",
            current_city: "$user.current_city",
            current_state: "$user.current_state",
            current_pin_code: "$user.current_pin_code",
            permanent_address: "$user.permanent_address",
            permanent_city: "$user.permanent_city",
            permanent_state: "$user.permanent_state",
            permanent_pin_code: "$user.permanent_pin_code",
          },
        },
        // {
        //   $group: {
        //     _id: "$user_id",
        //     data: { $first: "$$ROOT" },
        //   },
        // },
        // {
        //   $replaceRoot: { newRoot: "$data" },
        // },
      ])
      .exec();
    if (getcreators?.length === 0) {
      return res.status(500).send({ success: false });
    }
    return res.status(200).send({ data: getcreators });
  } catch (err) {
    return res
      .status(500)
      .send({ error: err.message, sms: "Error getting salary of user" });
  }
};

exports.countWfhUsers = async (req, res) => {
  try {
    const getCount = await attendanceModel.countDocuments({ job_type: "WFHD" });
    res.status(200).send(getCount);
  } catch (err) {
    res
      .status(500)
      .send({ error: err, sms: "Error getting count of wfh users" });
  }
};

exports.getSalaryCountByDeptYear = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const getCount = await attendanceModel
      .aggregate([
        {
          $match: {
            dept: parseInt(req.body.dept),
            year: parseInt(currentYear),
          },
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: "$total_salary",
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .exec();
    res.status(200).send({ data: getCount });
  } catch (err) {
    res
      .status(500)
      .send({ error: err, sms: "Error getting salary count by dept and year" });
  }
};

exports.getSalaryCountByYear = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const getCount = await attendanceModel
      .aggregate([
        {
          $match: { year: currentYear },
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: "$total_salary",
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .exec();
    res.status(200).send(getCount);
  } catch (err) {
    res
      .status(500)
      .send({ error: err, sms: "Error getting salary count by year" });
  }
};

exports.totalSalary = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const query = await attendanceModel
      .aggregate([
        {
          $match: { year: parseInt(currentYear) },
        },
        {
          $group: {
            _id: 0,
            totalsalary: { $sum: "$total_salary" },
            totalBonus: { $sum: "$bonus" },
            totaltdsdeduction: { $sum: "$tds_deduction" },
            totalsalarydeduction: { $sum: "$salary_deduction" },
          },
        },
      ])
      .exec();
    res.send({ status: 200, data: query });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error getting all salary",
    });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const editsim = await attendanceModel.findOneAndUpdate(
      { attendence_id: req.body.attendence_id, month: req.body.month },
      {
        sendToFinance: req.body.sendToFinance,
      },
      { new: true }
    );
    res.send({ status: 200, sms: "send to finance update successfully" });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error updating send to finance",
    });
  }
};

exports.updateAttendenceStatus = async (req, res) => {
  try {
    const editsim = await attendanceModel.updateMany(
      {
        dept: req.body.dept,
        month: req.body.month,
        year: req.body.year,
      },
      {
        $set: {
          attendence_generated: 1,
          salary_status: 1,
        },
      },
      { new: true }
    );
    res.send({ status: 200, sms: "send to update salary status" });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error updating salary status",
    });
  }
};

// exports.getMonthYearData = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonthIndex = currentDate.getMonth() + 1;
//     const numberOfMonths = 6;
//     const months = [
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//       "January",
//       "February",
//       "March",
//     ];

//     const monthYearArray = months.map((month) => ({
//       month,
//       year:
//         month === "January" || month === "February" || month === "March"
//           ? currentYear + 1
//           : currentYear,
//     }));

//     const aggregationPipeline = [
//       {
//         $group: {
//           _id: {
//             month: "$month",
//             year: "$year",
//             dept: "$dept"
//           },
//         },
//       },
//     ];

//     const dbResult = await attendanceModel.aggregate(aggregationPipeline);
//     console.log("vijay", dbResult);
//     const uniqueDeptIds = [...new Set(dbResult.map(item => item._id.dept))];
//     const deptCount = uniqueDeptIds.length;

//     // const dbResult = await attendanceModel.aggregate(aggregationPipeline).toArray();

//     const dbSet = new Set(
//       dbResult.map((item) => `${item._id.month}-${item._id.year}`)
//     );

//     const actualExistingResult = monthYearArray.map((item) => {
//       const dateStr = `${item.month}-${item.year}-${item.dept}`;
//       item.atdGenerated = dbSet.has(dateStr) ? 1 : 0;

//       return item;
//     });

//     const response = { data: [...actualExistingResult] };
//     res.status(200).json(response);
//   } catch (error) {
//     return res.send({
//       error: error.message,
//       status: 500,
//       sms: "error getting data",
//     });
//   }
// };

exports.getMonthYearData = async (req, res) => {
  try {
    // const currentDate = new Date();
    // const currentYear = currentDate.getFullYear();
    // const currentMonthIndex = currentDate.getMonth() + 1;
    // const numberOfMonths = 6;
    // const months = [
    //   "April",
    //   "May",
    //   "June",
    //   "July",
    //   "August",
    //   "September",
    //   "October",
    //   "November",
    //   "December",
    //   "January",
    //   "February",
    //   "March",
    // ];

    // const monthYearArray = months.map((month) => ({
    //   month,
    //   year:
    //     month === "January" || month === "February" || month === "March"
    //       ? currentYear + 1
    //       : currentYear,
    // }));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth() + 1;
    const numberOfMonths = 6;
    const months = [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ];

    let startYear = currentYear;
    let startMonthIndex = currentMonthIndex;

    if (startMonthIndex <= months.indexOf("March")) {
      startYear--;
    }

    const monthYearArray = months.map((month, index) => {
      const loopMonthIndex = ((startMonthIndex + index - 1) % 12) + 1;
      const loopYear =
        startYear + Math.floor((startMonthIndex + index - 1) / 12);

      return {
        month,
        year:
          loopMonthIndex <= currentMonthIndex
            ? loopYear
            : parseInt(loopYear) +
            parseInt(
              month == "January" || month == "February" || month == "March"
                ? 1
                : 0
            ),
      };
    });

    const aggregationPipeline = [
      {
        $group: {
          _id: {
            month: "$month",
            year: "$year",
            dept: "$dept"
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year"
          },
          deptCount: { $sum: 1 }
        }
      }
    ];

    const dbResult = await attendanceModel.aggregate(aggregationPipeline);

    const dbSet = new Set(
      dbResult.map((item) => `${item._id.month}-${item._id.year}`)
    );

    const actualExistingResult = monthYearArray.map((item) => {
      const dateStr = `${item.month}-${item.year}`;
      const existingData = dbSet.has(dateStr) ? 1 : 0;

      const deptCount = dbResult.find(entry => entry._id.month === item.month && entry._id.year === item.year)?.deptCount || 0;

      item.deptCount = deptCount;
      item.atdGenerated = existingData;

      return item;
    });

    const response = { data: [...actualExistingResult] };
    res.status(200).json(response);
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error getting data",
    });
  }
};


exports.getDistinctDepts = async (req, res) => {
  try {
    const distinctDepts = await attendanceModel.distinct("dept", {
      month: req.body.month,
      year: req.body.year,
    });
    const result = distinctDepts.map((dept) => ({ dept }));

    res.status(200).send(result);
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error getting distinct depts",
    });
  }
};

exports.allDeptsOfWfh = async (req, res) => {
  try {
    const editsim = await userModel
      .aggregate([
        {
          $match: { job_type: "WFHD" },
        },
        {
          $lookup: {
            from: "departmentmodels",
            localField: "dept_id",
            foreignField: "dept_id",
            as: "dept",
          },
        },
        {
          $unwind: "$dept",
        },
        {
          $group: {
            _id: "$dept.dept_id",
            dept_name: { $first: "$dept.dept_name" },
            total_salary: { $sum: "$salary" },
            user_count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            dept_id: "$_id",
            dept_name: 1,
            total_salary: 1,
            user_count: 1,
          },
        },
        {
          $sort: { dept_id: 1 }
        },
      ])
      .exec();

    res.send({ status: 200, data: editsim });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error getting salary status",
    });
  }
};

// --------------------
exports.deptWithWFH = async (req, res) => {
  try {
    const result = await userModel
      .aggregate([
        {
          $match: { job_type: "WFHD" },
        },
        {
          $lookup: {
            from: "departmentmodels",
            localField: "dept_id",
            foreignField: "dept_id",
            as: "dept",
          },
        },
        {
          $unwind: "$dept",
        },
        {
          $group: {
            _id: "$dept.dept_id",
            dept_name: { $first: "$dept.dept_name" },
          },
        },
        {
          $project: {
            _id: 0,
            dept_id: "$_id",
            dept_name: 1,
          },
        },
      ])
      .exec();

    return res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.leftEmployees = async (req, res) => {
  const { dept_id, month, year } = req.body;

  try {
    const results = await userModel.find({
      dept_id: dept_id,
      job_type: "WFHD",
    });

    let leftCount = 0;
    const newLefts = [];

    for (const user of results) {
      if (user.releaving_date) {
        const convertDate = new Date(user.releaving_date);
        const joiningMonth = String(convertDate.getUTCMonth() + 1).padStart(
          2,
          "0"
        );
        const joiningYear = String(convertDate.getUTCFullYear());

        const monthNumber = monthNameToNumber(month);

        const mergeJoining = parseInt(joiningMonth + joiningYear);
        const mergeJoining1 = `${monthNumber}` + `${year}`;

        if (mergeJoining == mergeJoining1) {
          leftCount++;
          newLefts.push({ user_name: user.user_name });
        }
      }
    }

    if (leftCount >= 0) {
      res.json({ leftEmployees: leftCount, UserLefts: newLefts });
    } else {
      res.send("No left employee");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.newJoiners = async (req, res) => {
  const { dept_id, month, year } = req.body;

  try {
    // Use Mongoose to query the MongoDB collection
    const results = await userModel.find({
      dept_id: dept_id,
      job_type: "WFHD",
    });

    let newJoinersCount = 0;
    const newJoiners = [];

    for (const user of results) {
      const convertDate = user.joining_date;
      const joiningMonth = String(convertDate.getUTCMonth() + 1).padStart(
        2,
        "0"
      );
      const joiningYear = String(convertDate.getUTCFullYear());

      const monthNumber = monthNameToNumber(month);

      const mergeJoining = parseInt(joiningMonth + joiningYear);
      const mergeJoining1 = `${monthNumber}` + `${year}`;

      if (mergeJoining == mergeJoining1) {
        newJoinersCount++;
        newJoiners.push({ user_name: user.user_name });
      }
    }

    if (newJoinersCount > 0) {
      res.json({ NewJoiners: newJoinersCount, NewUsers: newJoiners });
    } else {
      res.send("No new joiners");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.checkSalaryStatus = async (req, res) => {
  const { month, year, dept } = req.body;

  try {
    const distinctSalaryStatuses = await attendanceModel.distinct(
      "salary_status",
      {
        month,
        year,
        dept,
      }
    );

    if (distinctSalaryStatuses) {
      res.status(200).json({ salary_status: distinctSalaryStatuses[0] });
    } else {
      res.status(200).send("No record found");
    }
  } catch (error) {
    console.error("Error querying MongoDB:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.allAttendenceMastData = async (req, res) => {
  try {
    // Use Mongoose to perform a left join and retrieve data from multiple collections
    const results = await attendanceModel.aggregate([
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept_id",
          foreignField: "dept",
          as: "dept_data",
        },
      },
      {
        $unwind: "$dept_data",
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "user_id",
          foreignField: "user_id",
          as: "user_data",
        },
      },
      {
        $unwind: "$user_data",
      },
      {
        $project: {
          attendence_id: 1,
          dept: 1,
          user_id: 1,
          noOfabsent: 1,
          year: 1,
          remark: 1,
          Creation_date: 1,
          Created_by: 1,
          Last_updated_by: 1,
          Last_updated_date: 1,
          month: 1,
          bonus: 1,
          total_salary: 1,
          net_salary: 1,
          tds_deduction: 1,
          user_name: "$user_data.user_name",
          toPay: 1,
          sendToFinance: 1,
          attendence_generated: 1,
          // attendence_mastcol: 1,
          attendence_status: 1,
          salary_status: 1,
          salary_deduction: 1,
          salary: 1,
          dept_name: "$dept_data.dept_name",
          Report_L1Name: "$user_data.Report_L1N",
          Report_L2Name: "$user_data.Report_L2N"
        },
      },
    ]);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error querying MongoDB:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.deptIdWithWfh = async (req, res) => {
  const { dept_id } = req.body;

  try {
    const results = await userModel.aggregate([
      {
        $match: {
          job_type: "WFHD",
          dept_id: parseInt(dept_id),
        },
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept_id",
          foreignField: "dept_id",
          as: "dept_data",
        },
      },
      {
        $unwind: "$dept_data",
      },
      {
        $lookup: {
          from: "designationmodels",
          localField: "user_designation",
          foreignField: "desi_id",
          as: "designation_data",
        },
      },
      {
        $unwind: "$designation_data",
      },
      {
        $project: {
          user_id: 1,
          user_name: 1,
          user_designation: 1,
          user_email_id: 1,
          user_login_id: 1,
          user_login_password: 1,
          user_report_to_id: 1,
          created_At: 1,
          last_updated: "$lastupdated",
          created_by: 1,
          user_contact_no: 1,
          dept_id: 1,
          location_id: 1,
          role_id: 1,
          sitting_id: 1,
          image: 1,
          job_type: 1,
          PersonalNumber: 1,
          Report_L1: 1,
          Report_L2: 1,
          Report_L3: 1,
          PersonalEmail: 1,
          level: 1,
          joining_date: 1,
          releaving_date: 1,
          room_id: 1,
          UID: 1,
          pan: 1,
          highest_upload: 1,
          other_upload: 1,
          salary: 1,
          SpokenLanguages: 1,
          Gender: 1,
          Nationality: 1,
          DOB: 1,
          Age: 1,
          fatherName: 1,
          motherName: 1,
          Hobbies: 1,
          BloodGroup: 1,
          MartialStatus: 1,
          DateOfMarriage: 1,
          onboard_status: 1,
          tbs_applicable: "$tds_applicable",
          tds_per: 1,
          image_remark: 1,
          image_validate: 1,
          uid_remark: 1,
          uid_validate: 1,
          pan_remark: 1,
          pan_validate: 1,
          highest_upload_remark: 1,
          highest_upload_validate: 1,
          other_upload_remark: 1,
          other_upload_validate: 1,
          user_status: 1,
          sub_dept_id: 1,
          pan_no: 1,
          uid_no: 1,
          spouse_name: 1,
          highest_qualification_name: 1,
          tenth_marksheet: 1,
          twelveth_marksheet: 1,
          UG_Marksheet: 1,
          passport: 1,
          pre_off_letter: 1,
          pre_expe_letter: 1,
          pre_relieving_letter: 1,
          bankPassBook_Cheque: 1,
          tenth_marksheet_validate: 1,
          twelveth_marksheet_validate: 1,
          UG_Marksheet_validate: 1,
          passport_validate: 1,
          pre_off_letter_validate: 1,
          pre_expe_letter_validate: 1,
          pre_relieving_letter_validate: 1,
          bankPassBook_Cheque_validate: 1,
          tenth_marksheet_validate_remark: 1,
          twelveth_marksheet_validate_remark: 1,
          UG_Marksheet_validate_remark: 1,
          passport_validate_remark: 1,
          pre_off_letter_validate_remark: 1,
          pre_expe_letter_validate_remark: 1,
          pre_relieving_letter_validate_remark: 1,
          bankPassBook_Cheque_validate_remark: 1,
          current_address: 1,
          current_city: 1,
          current_state: 1,
          current_pin_code: 1,
          permanent_address: 1,
          permanent_city: 1,
          permanent_state: 1,
          permanent_pin_code: 1,
          joining_date_extend: 1,
          joining_date_extend_status: 1,
          joining_date_extend_reason: 1,
          joining_extend_document: 1,
          invoice_template_no: 1,
          userSalaryStatus: 1,
          digital_signature_image: 1,
          dept_name: "$dept_data.dept_name",
          Remarks: "$dept_data.Remarks",
          Creation_date: "$dept_data.Creation_date",
          Created_by: "$dept_data.Created_by",
          Last_updated_by: "$dept_data.Last_updated_by",
          Last_updated_date: "$dept_data.Last_updated_date",
          desi_id: "$designation_data.desi_id",
          desi_name: "$designation_data.desi_name",
          remark: "$designation_data.remark",
          created_at: "$designation_data.created_at",
          last_updated_by: {
            $cond: {
              if: {
                $and: [
                  {
                    $eq: [
                      { $type: "$designation_data.last_updated_by" },
                      "missing",
                    ],
                  },
                ],
              },
              then: "",
              else: "$designation_data.last_updated_by",
            },
          },
          last_updated_at: {
            $cond: {
              if: {
                $and: [
                  {
                    $eq: [
                      { $type: "$designation_data.last_updated_at" },
                      "missing",
                    ],
                  },
                ],
              },
              then: "",
              else: "$designation_data.last_updated_at",
            },
          },
        },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error querying MongoDB:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

async function checkIfAttendanceExist(user_id, month, year) {
  const query = { user_id: user_id, month: month, year: year };
  const result = await attendanceModel.findOne(query)
  return result !== null;
}

exports.addAttendanceAllDepartments = async (req, res) => {
  try {
    const month = req.body.month;
    const year = req.body.year;

    const getAllWfhUser = await userModel.find({
      job_type: 'WFHD'
    }).select({ dept_id: 1, user_id: 1, salary: 1 })
    // console.log(getAllWfhUser)

    getAllWfhUser.map(async (item) => {
      const work_days = 30;
      const presentDays = work_days - 0;
      const perdaysal = item.salary / 30;
      const totalSalary = perdaysal * presentDays;
      const netSalary = totalSalary;
      // const tdsDeduction = (netSalary * item.tds_per) / 100;
      const tdsDeduction = netSalary > 0 ? (netSalary * item.tds_per) / 100 : 0;
      const ToPay = netSalary - tdsDeduction;

      const existingData = await checkIfAttendanceExist(item.user_id, month, year)

      if (!existingData) {
        const saveData = new attendanceModel({
          dept: item.dept_id,
          user_id: item.user_id,
          invoiceNo: item.invoiceNo,
          user_name: item.user_name,
          noOfabsent: 0,
          month: req.body.month,
          year: req.body.year,
          bonus: 0,
          total_salary: item.salary && item.salary.toFixed(2),
          tds_deduction: tdsDeduction && tdsDeduction.toFixed(2) || 0,
          net_salary: netSalary && netSalary.toFixed(2),
          toPay: ToPay && ToPay.toFixed(2),
          remark: "",
          Created_by: item.user_id,
          salary: item.salary,
          attendence_generated: 1,
          salary_status: 1
        })
        await saveData.save()
      }
    })
    res.send({ status: 200, sms: "attendance added for all depts" })
    // res.send({ status: 200 });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: error.message, sms: "error while adding data" });
  }
};

exports.getAllAttendanceData = async (req, res) => {
  try {
    const imageUrl = `${vari.IMAGE_URL}/`;
    const latestEntry = await attendanceModel
      .findOne()
      .sort({ _id: -1 })
      .exec();

    console.log("dddddddddd", latestEntry.month, "year", latestEntry.year)
    // const allAttendanceData = await attendanceModel.find();
    const allAttendanceData = await attendanceModel.aggregate([
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept",
          foreignField: "dept_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $lookup: {
          from: "billingheadermodels",
          localField: "department.dept_id",
          foreignField: "dept_id",
          as: "billingheadermodels",
        },
      },
      // {
      //   $unwind: "$finance",
      // },
      {
        $unwind: {
          path: "$billingheadermodels",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "user_id",
          foreignField: "user_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "designationmodels",
          localField: "user.user_designation",
          foreignField: "desi_id",
          as: "designation",
        },
      },
      {
        $unwind: "$designation",
      },
      {
        $lookup: {
          from: "financemodels",
          localField: "attendence_id",
          foreignField: "attendence_id",
          as: "finance",
        },
      },
      // {
      //   $unwind: "$finance",
      // },
      {
        $unwind: {
          path: "$finance",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          attendence_id: 1,
          dept: 1,
          user_id: 1,
          noOfabsent: 1,
          year: 1,
          remark: 1,
          Creation_date: 1,
          Created_by: 1,
          Last_updated_by: 1,
          Last_updated_date: 1,
          month: 1,
          bonus: 1,
          total_salary: 1,
          net_salary: 1,
          tds_deduction: 1,
          user_name: "$user.user_name",
          user_email_id: "$user.user_email_id",
          user_contact_no: "$user.user_contact_no",
          permanent_address: "$user.permanent_address",
          permanent_city: "$user.permanent_city",
          permanent_state: "$user.permanent_state",
          permanent_pin_code: "$user.permanent_pin_code",
          bank_name: "$user.bank_name",
          ifsc_code: "$user.ifsc_code",
          account_no: "$user.account_no",
          billing_header_name: {
            $cond: {
              if: {
                $and: [
                  {
                    $eq: [
                      { $type: "$billingheadermodels.billing_header_name" },
                      "missing",
                    ],
                  },
                ],
              },
              then: "",
              else: "$billingheadermodels.billing_header_name",
            },
          },
          toPay: 1,
          sendToFinance: 1,
          attendence_generated: 1,
          invoiceNo: 1,
          attendence_status: 1,
          salary_status: 1,
          salary_deduction: 1,
          salary: 1,
          dept_name: "$department.dept_name",
          pan_no: "$user.pan_no",
          current_address: "$user.current_address",
          invoice_template_no: "$user.invoice_template_no",
          joining_date: "$user.joining_date",
          designation_name: "$designation.desi_name",
          status_: "$finance.status_",
          reference_no: "$finance.reference_no",
          amount: "$finance.amount",
          pay_date: "$finance.pay_date",
          screenshot: {
            $concat: [imageUrl, "$finance.screenshot"],
          },
          digital_signature_image: "$user.digital_signature_image",
        },
      },
    ]).sort({ attendence_id: 1 });
    res.status(200).send({ data: allAttendanceData });

  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error getting all attendance data",
    });
  }
};

exports.getSalarycalculationData = async (req, res) => {
  try {
    const groupedAttendanceData = await attendanceModel.aggregate([
      {
        $group: {
          _id: {
            dept: "$dept",
            month: "$month",
            year: "$year"
          },
          totalSalary: { $sum: "$total_salary" },
          disbursedSalary: { $sum: "$disbursedSalary" },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departmentmodels",
          localField: "_id.dept",
          foreignField: "dept_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $project: {
          _id: 0,
          dept_id: "$_id.dept",
          month: "$_id.month",
          year: "$_id.year",
          totalSalary: 1,
          disbursedSalary: 1,
          pendingAmount: { $subtract: ["$totalSalary", "$disbursedSalary"] },
          dept_name: "$department.dept_name",
          totalUsers: 1
        },
      },
    ]);

    res.status(200).send({ data: groupedAttendanceData });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "Error getting grouped attendance data",
    });
  }
};

exports.getUsersCountByDept = async (req, res) => {
  try {
    const groupedAttendanceData = await attendanceModel.aggregate([
      {
        $match: {
          dept: parseInt(req.body.dept_id),
          month: req.body.month,
          year: parseInt(req.body.year)
        },
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "user_id",
          foreignField: "user_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $group: {
          _id: {
            dept_id: "$dept",
            month: "$month",
            user_id: "$user.user_id",
          },
          dept_id: { $first: "$dept" },
          user_id: { $first: "$user.user_id" },
          user_name: { $first: "$user.user_name" },
        },
      },
      {
        $project: {
          _id: 0,
          dept_id: 1,
          user_id: 1,
          user_name: 1,
          month: 1
        },
      },
    ]);

    res.status(200).send({ data: groupedAttendanceData });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "Error getting grouped attendance data",
    });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const editsim = await attendanceModel.findOneAndUpdate(
      {
        attendence_id: req.body.attendence_id,
        month: req.body.month,
        year: req.body.year
      },
      {
        attendence_status_flow: req.body.attendence_status_flow,
        disputed_reason: req.body.disputed_reason,
        disputed_date: req.body.disputed_date,
        disputed_status: req.body.disputed_status,
        resolved_date: req.body.resolved_date
      },
      { new: true }
    );
    res.send({ status: 200, sms: " update attendance data successfully", data: editsim });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error updating send to attendance data",
    });
  }
};

// exports.allAttendanceDisputeDatas = async (req, res) => {
//   try {

//     const results = await attendanceModel.aggregate([
//       {
//         $match: {
//           attendence_status_flow: "Disputed"
//         }
//       },
//       {
//         $lookup: {
//           from: "departmentmodels",
//           localField: "dept",
//           foreignField: "dept_id",
//           as: "dept_data",
//         },
//       },
//       {
//         $unwind: "$dept_data",
//       },
//       {
//         $lookup: {
//           from: "usermodels",
//           localField: "user_id",
//           foreignField: "user_id",
//           as: "user_data",
//         },
//       },
//       {
//         $unwind: "$user_data",
//       },
//       {
//         $group: {
//           _id: "$attendence_id",
//           attendence_id: { $first: "$attendence_id" },
//           dept: { $first: "$dept" },
//           user_id: { $first: "$user_id" },
//           dept_data: { $first: "$dept_data" },
//           user_data: { $first: "$user_data" },
//           noOfabsent: { $first: "$noOfabsent" },
//           year: { $first: "$year" },
//           remark: { $first: "$remark" },
//           Creation_date: { $first: "$Creation_date" },
//           Created_by: { $first: "$Created_by" },
//           Last_updated_by: { $first: "$Last_updated_by" },
//           Last_updated_date: { $first: "$Last_updated_date" },
//           month: { $first: "$month" },
//           bonus: { $first: "$bonus" },
//           total_salary: { $first: "$total_salary" },
//           net_salary: { $first: "$net_salary" },
//           tds_deduction: { $first: "$tds_deduction" },
//           user_name: { $first: "$user_data.user_name" },
//           toPay: { $first: "$toPay" },
//           sendToFinance: { $first: "$sendToFinance" },
//           attendence_generated: { $first: "$attendence_generated" },
//           attendence_status: { $first: "$attendence_status" },
//           salary_status: { $first: "$salary_status" },
//           salary_deduction: { $first: "$salary_deduction" },
//           salary: { $first: "$salary" },
//           dept_name: { $first: "$dept_data.dept_name" },
//           Report_L1Name: { $first: "$user_data.Report_L1N" },
//           Report_L2Name: { $first: "$user_data.Report_L2N" },
//           attendence_status_flow: { $first: "$attendence_status_flow" },
//           disputed_reason: { $first: "$disputed_reason" },
//           disputed_date: { $first: "$disputed_date" },
//           disputed_status: { $first: "disputed_status" },
//           resolved_date: { $first: "$resolved_date" },
//         },
//       },
//       {
//         $project: {
//           attendence_id: 1,
//           dept: 1,
//           noOfabsent: 1,
//           year: 1,
//           remark: 1,
//           Creation_date: 1,
//           Created_by: 1,
//           Last_updated_by: 1,
//           Last_updated_date: 1,
//           month: 1,
//           bonus: 1,
//           total_salary: 1,
//           net_salary: 1,
//           tds_deduction: 1,
//           user_name: 1,
//           toPay: 1,
//           sendToFinance: 1,
//           attendence_generated: 1,
//           attendence_status: 1,
//           salary_status: 1,
//           salary_deduction: 1,
//           salary: 1,
//           dept_name: 1,
//           Report_L1Name: 1,
//           Report_L2Name: 1,
//           attendence_status_flow: 1,
//           disputed_reason: 1,
//           disputed_date: 1,
//           disputed_status: 1,
//           resolved_date: 1,
//         },
//       },
//     ]);
//     res.status(200).json(results);
//   } catch (error) {
//     console.error("Error querying MongoDB:", error.message);
//     res.status(500).send("Internal Server Error");
//   }
// };

// exports.getUserAttendanceDisputeDatas = async (req, res) => {
//   try {
//     const results = await attendanceModel.find({
//       user_id: req.params.user_id,
//       attendence_status_flow: "Disputed"
//     })

//     // const resultss = await attendanceModel.aggregate([
//     //   {
//     //     $match: {
//     //       user_id: req.params.user_id,
//     //       attendence_status_flow: "Disputed"
//     //     }
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "departmentmodels",
//     //       localField: "dept_id",
//     //       foreignField: "dept",
//     //       as: "dept_data",
//     //     },
//     //   },
//     //   {
//     //     $unwind: "$dept_data",
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "usermodels",
//     //       localField: "user_id",
//     //       foreignField: "user_id",
//     //       as: "user_data",
//     //     },
//     //   },
//     //   {
//     //     $unwind: "$user_data",
//     //   },
//     //   {
//     //     $group: {
//     //       _id: "$attendence_id",
//     //       attendence_id: { $first: "$attendence_id" },
//     //       user_id: { $first: "$user_id" },
//     //       dept_data: { $first: "$dept_data" },
//     //       user_data: { $first: "$user_data" },
//     //       noOfabsent: { $first: "$noOfabsent" },
//     //       year: { $first: "$year" },
//     //       remark: { $first: "$remark" },
//     //       Creation_date: { $first: "$Creation_date" },
//     //       Created_by: { $first: "$Created_by" },
//     //       Last_updated_by: { $first: "$Last_updated_by" },
//     //       Last_updated_date: { $first: "$Last_updated_date" },
//     //       month: { $first: "$month" },
//     //       bonus: { $first: "$bonus" },
//     //       total_salary: { $first: "$total_salary" },
//     //       net_salary: { $first: "$net_salary" },
//     //       tds_deduction: { $first: "$tds_deduction" },
//     //       user_name: { $first: "$user_data.user_name" },
//     //       toPay: { $first: "$toPay" },
//     //       sendToFinance: { $first: "$sendToFinance" },
//     //       attendence_generated: { $first: "$attendence_generated" },
//     //       attendence_status: { $first: "$attendence_status" },
//     //       salary_status: { $first: "$salary_status" },
//     //       salary_deduction: { $first: "$salary_deduction" },
//     //       salary: { $first: "$salary" },
//     //       dept_name: { $first: "$dept_data.dept_name" },
//     //       Report_L1Name: { $first: "$user_data.Report_L1N" },
//     //       Report_L2Name: { $first: "$user_data.Report_L2N" },
//     //       attendence_status_flow: { $first: "$attendence_status_flow" },
//     //       disputed_reason: { $first: "$disputed_reason" },
//     //       disputed_date: { $first: "$disputed_date" },
//     //       disputed_status:{$first:"disputed_status"},
//     //       resolved_date: { $first: "$resolved_date" },
//     //     },
//     //   },
//     //   {
//     //     $project: {
//     //       attendence_id: 1,
//     //       dept: 1,
//     //       noOfabsent: 1,
//     //       year: 1,
//     //       remark: 1,
//     //       Creation_date: 1,
//     //       Created_by: 1,
//     //       Last_updated_by: 1,
//     //       Last_updated_date: 1,
//     //       month: 1,
//     //       bonus: 1,
//     //       total_salary: 1,
//     //       net_salary: 1,
//     //       tds_deduction: 1,
//     //       user_name: 1,
//     //       toPay: 1,
//     //       sendToFinance: 1,
//     //       attendence_generated: 1,
//     //       attendence_status: 1,
//     //       salary_status: 1,
//     //       salary_deduction: 1,
//     //       salary: 1,
//     //       dept_name: 1,
//     //       Report_L1Name: 1,
//     //       Report_L2Name: 1,
//     //       attendence_status_flow: 1,
//     //       disputed_reason: 1,
//     //       disputed_date: 1,
//     //       disputed_status:1,
//     //       resolved_date:1,
//     //     },
//     //   },
//     // ]);
//     res.status(200).json(results);
//   } catch (error) {
//     console.error("Error querying MongoDB:", error.message);
//     res.status(500).send("Internal Server Error");
//   }
// };