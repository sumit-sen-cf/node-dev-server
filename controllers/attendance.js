const { createNextInvoiceNumber } = require("../helper/helper.js");
const attendanceModel = require("../models/attendanceModel.js");
const userModels = require("../models/userAuthModel.js");
const userModel = require("../models/userModel.js");
const vari = require("../variables.js");
const billingHeaderModel = require("../models/billingheaderModel.js");
const separationModel = require("../models/separationModel.js");
const financeModel = require("../models/financeModel.js");

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
    (m) => m.toLowerCase() === monthName?.toLowerCase()
  );

  // Adding 1 because months are zero-indexed in JavaScript (0-11)
  return monthIndex !== -1 ? monthIndex + 1 : null;
}

// new
const getLatestAttendanceId = async () => {
  try {
    const latestAttendance = await attendanceModel?.findOne().sort({ attendence_id: -1 }).select({ attendence_id: 1 });
    console.log("latestAttendance", latestAttendance);
    return latestAttendance ? latestAttendance.attendence_id : 0;
  } catch (error) {
    console.error("Error finding latest attendance ID:", error.message);
    throw error;
  }
};

let attendanceIdCounter;

const initializeAttendanceIdCounter = async () => {
  try {
    const latestAttendanceId = await getLatestAttendanceId();
    attendanceIdCounter = latestAttendanceId + 1;
    console.log("Initialized attendanceIdCounter:", attendanceIdCounter);
  } catch (error) {
    console.error("Error initializing attendanceIdCounter:", error.message);
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

function getLastDate(month, year) {
  // JavaScript months are 0-based (0 = January, 11 = December), so we subtract 1 from the month
  const date = new Date(year, month, 0);
  // Get the last day of the month
  const lastDate = date.getDate();
  return lastDate;
}

function getLastDateOfMonth(month, year) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIndex = monthNames.indexOf(month);
  if (monthIndex === -1) {
    throw new Error('Invalid month name');
  }

  let nextMonth = new Date(year, monthIndex + 1, 1);
  let lastDateOfMonth = new Date(nextMonth - 1);
  return lastDateOfMonth.getDate();
}

function getMonthName(monthNumber) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (monthNumber < 1 || monthNumber > 12) {
    return "Invalid month number";
  }

  return monthNames[monthNumber - 1];
}

// exports.addAttendance = async (req, res) => {
//   try {
//     const {
//       dept,
//       user_id,
//       noOfabsent,
//       month,
//       year,
//       bonus,
//       remark,
//       created_by,
//       salary_deduction,
//       attendence_status,
//       attendence_status_flow,
//       salary_status,
//     } = req.body;

//     const checkBillingHeader = await billingHeaderModel.findOne({ dept_id: dept });

//     if (!checkBillingHeader) {
//       return res.status(409).send({
//         data: [],
//         message: "Please Added First Billing Header For This Department",
//       });
//     }

//     const attendanceData = await userModel.aggregate([
//       {
//         $lookup: {
//           from: "separationmodels",
//           localField: "user_id",
//           foreignField: "user_id",
//           as: "separation",
//         },
//       },
//       {
//         $unwind: {
//           path: "$separation",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $group: {
//           _id: "$user_id",
//           status: { $first: "$separation.status" },
//           resignation_date: { $first: "$separation.resignation_date" },
//           joining_date: { $first: "$joining_date" }
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           user_id: "$_id",
//           status: 1,
//           resignation_date: 1,
//           joining_date: 1
//         },
//       },
//     ]);

//     if (attendanceData.length !== 0) {
//       //Extract user data
//       const check1 = await attendanceModel.find({
//         user_id: req.body.user_id,
//         month: req.body.month,
//         year: req.body.year,
//       });
//       if (check1.length == 0) {
//         const check2 = await userModel.find({
//           job_type: "WFHD",
//           dept_id: req.body.dept,
//           att_status: 'onboarded',
//           user_status: "Active"
//         });

//         let filteredUserData = check2.map(user => {
//           const attendance = attendanceData.find(data => data.user_id === user.user_id);
//           if (attendance) {
//             return { ...user.toObject(), ...attendance };
//           } else {
//             return user.toObject();
//           }
//         });

//         filteredUserData?.length > 0 &&
//           filteredUserData.map(async (user) => {
//             //logic for separation
//             const resignDate = user.resignation_date;

//             const resignConvertDate = new Date(resignDate);

//             const resignMonth = resignConvertDate.toLocaleString('default', { month: 'long' });

//             const resignMonthNum = resignConvertDate.getUTCMonth() + 1;

//             const resignYear = String(resignConvertDate.getUTCFullYear());
//             const resignExtractDate = resignConvertDate.getDate();
//             const resignMonthYear = `${resignYear}` + `${resignMonthNum}`;

//             var work_days;
//             const absent = noOfabsent == undefined ? 0 : req.body.noOfabsent;
//             const joining = user.joining_date;
//             const convertDate = new Date(joining);
//             // const extractJodDate = convertDate.getDate() - 1;
//             const extractDate = convertDate.getDate();
//             const joiningMonth = String(convertDate.getUTCMonth() + 1);
//             const joiningYear = String(convertDate.getUTCFullYear());
//             const mergeJoining = parseInt(joiningMonth + joiningYear);
//             const monthNumber = monthNameToNumber(month);
//             const previousMonthNumber = monthNumber - 1;
//             const mergeJoining1 = `${monthNumber}` + `${year}`;
//             const lastDateOfMonth = getLastDateOfMonth(month, year);
//             const remainingDays = lastDateOfMonth - extractDate;
//             const previous = `${previousMonthNumber}` + `${year}`;

//             if (mergeJoining == mergeJoining1) {
//               if (extractDate <= 15) {
//                 work_days = 15 - (extractDate - 1) - absent;
//               }
//             } else if (user.user_status == "Resigned") {
//               work_days = (30 - resignExtractDate) - absent;
//             } else if (previous <= mergeJoining1) {
//               if (extractDate <= 15) {
//                 work_days = lastDateOfMonth - absent;
//               } else if (previousMonthNumber == joiningMonth) {
//                 work_days = (lastDateOfMonth - extractDate) + 15 - absent
//               }
//               else {
//                 work_days = lastDateOfMonth - absent;
//               }
//             }
//             else {
//               work_days = remainingDays + 15 - absent
//             }

//             const bodymonth = `${year}` + `${monthNumber}`;

//             const joiningMonthNumber = convertDate.getUTCMonth() + 1;
//             const joiningYearNumber = convertDate.getUTCFullYear();
//             const mergeMonthYear = `${joiningYearNumber}` + `${joiningMonthNumber}`;

//             if (mergeMonthYear <= bodymonth) {
//               const userExistsInAttendance = await doesUserExistInAttendance(
//                 user.user_id,
//                 req.body.month,
//                 req.body.year
//               );
//               if (!userExistsInAttendance) {
//                 const presentDays = work_days == undefined ? 0 : work_days;

//                 const perdaysal = user.salary / lastDateOfMonth;

//                 const totalSalary = perdaysal * presentDays;

//                 const Bonus = bonus == undefined ? 0 : req.body.bonus;

//                 const netSalary = totalSalary + Bonus;

//                 const tdsDeduction = (netSalary * user.tds_per) / 100;

//                 const ToPay = netSalary - tdsDeduction;
//                 const salary = user.salary;
//                 let invoiceNo = await createNextInvoiceNumber(user.user_id, month, year);

//                 const attendanceId = getNextAttendanceId();
//                 const creators = new attendanceModel({
//                   attendence_id: attendanceId,
//                   dept: user.dept_id,
//                   user_id: user.user_id,
//                   invoiceNo: invoiceNo,
//                   user_name: user.user_name,
//                   noOfabsent: Number(absent),
//                   present_days: Number(presentDays),
//                   month_salary: Number(totalSalary) && Number(totalSalary).toFixed(2),
//                   month: req.body.month,
//                   year: req.body.year,
//                   bonus: Bonus,
//                   total_salary: Number(user.salary) && Number(user.salary).toFixed(2),
//                   tds_deduction: Number(tdsDeduction) && Number(tdsDeduction).toFixed(2),
//                   net_salary: Number(netSalary) && Number(netSalary).toFixed(2),
//                   toPay: Number(ToPay) && Number(ToPay).toFixed(2),
//                   remark: "",
//                   Created_by: req.body.user_id,
//                   salary,
//                   attendence_status_flow: "Payout Generated",
//                   disputed_reason: req.body.disputed_reason,
//                   disputed_date: req.body.disputed_date,
//                   salary_deduction: req.body.salary_deduction
//                 });

//                 if (user.user_status === "Resigned" && resignMonthYear < bodymonth) {
//                   console.log("User Exist ");
//                 } else {
//                   const instav = await creators.save();
//                 }
//               }
//               // res.send({ status: 200 });
//             }

//           });
//         res.send({ status: 200 });
//       } else {
//         const Dept = dept || "";
//         const User_id = user_id || "";
//         const No_of_absent = noOfabsent || 0;
//         const Month = month || "";
//         const Year = year || "";
//         const Bonus = bonus || 0;
//         const Remark = remark || "";
//         const created_By = created_by ? parseInt(created_by) : 0;
//         const creation_date = new Date();
//         const check1 = await attendanceModel.find({
//           user_id: req.body.user_id,
//           month: req.body.month,
//           year: req.body.year,
//         });
//         if (check1.length == 0) {
//           const check2 = await userModel.find({
//             job_type: "WFHD",
//             dept_id: req.body.dept,
//             att_status: 'onboarded'
//           });
//           check2.map(async (user) => {
//             var work_days;
//             const joining = user.joining_date;
//             const convertDate = new Date(joining);
//             const extractDate = convertDate.getDate() - 1;
//             const joiningMonth = String(convertDate.getUTCMonth() + 1).padStart(
//               2,
//               "0"
//             );
//             const joiningYear = String(convertDate.getUTCFullYear());
//             const mergeJoining = parseInt(joiningMonth + joiningYear);
//             const monthNumber = monthNameToNumber(month);
//             const mergeJoining1 = `${monthNumber}` + `${year}`;
//             if (mergeJoining == mergeJoining1) {
//               work_days = monthLastValue - extractDate;
//             } else {
//               work_days = monthLastValue;
//             }
//             const userExistsInAttendance = await doesUserExistInAttendance(
//               user.user_id,
//               req.body.month,
//               req.body.year
//             );
//             if (!userExistsInAttendance) {
//               const presentDays = work_days;
//               const perdaysal = user.salary / work_days;
//               const totalSalary = perdaysal * presentDays;
//               const Bonus = bonus || 0;
//               const netSalary = totalSalary + Bonus;
//               const tdsDeduction = (netSalary * user.tds_per) / 100;
//               const ToPay = netSalary - tdsDeduction;
//               const salary = user.salary;
//               let invoiceNo = await createNextInvoiceNumber(user.user_id, month, year);
//               const creators = new attendanceModel({
//                 dept: user.dept_id,
//                 user_id: user.user_id,
//                 invoiceNo: invoiceNo,
//                 user_name: user.user_name,
//                 noOfabsent: 0,
//                 present_days: presentDays,
//                 month_salary: totalSalary,
//                 month: req.body.month,
//                 year: req.body.year,
//                 bonus: Bonus,
//                 total_salary: user.salary && user.salary.toFixed(2),
//                 tds_deduction: tdsDeduction && tdsDeduction.toFixed(2),
//                 net_salary: netSalary && netSalary.toFixed(2),
//                 toPay: ToPay && ToPay.toFixed(2),
//                 remark: "",
//                 Created_by: req.body.user_id,
//                 salary,
//                 attendence_status_flow: "Payout Generated",
//                 disputed_reason: req.body.disputed_reason,
//                 disputed_date: req.body.disputed_date
//               });
//               const instav = await creators.save();
//             }
//             // res.send({ status: 200 });
//           });
//           res.send({ status: 200 });
//         } else if (
//           req.body.user_id == check1[0].user_id &&
//           req.body.month == check1[0].month &&
//           req.body.year == check1[0].year
//         ) {
//           const results4 = await userModel.find({
//             job_type: "WFHD",
//             user_id: parseInt(req.body.user_id),
//           });

//           // console.log("results4", results4)

//           const findSeparationData = await separationModel.findOne({ user_id: req.body.user_id })
//           const resignDate = findSeparationData?.resignation_date;
//           const resignConvertDate = new Date(resignDate);
//           const resignExtractDate = resignConvertDate?.getDate();

//           var work_days;
//           const absent = noOfabsent == undefined ? 0 : req.body.noOfabsent;
//           // console.log("absent", absent);
//           const salaryDeduction = salary_deduction == undefined ? 0 : req.body.salary_deduction;
//           // console.log("salaryDeduction", salaryDeduction);
//           const joining = results4[0].joining_date;
//           // console.log("joining", joining);
//           const convertDate = new Date(joining);
//           const extractDate = convertDate.getDate();
//           // console.log("extractDate", extractDate);
//           const joiningMonth = String(convertDate.getUTCMonth() + 1).padStart(
//             2,
//             "0"
//           );
//           const joiningYear = String(convertDate.getUTCFullYear());
//           const mergeJoining = parseInt(joiningMonth + joiningYear);
//           const monthNumber = monthNameToNumber(month);
//           const mergeJoining1 = `${monthNumber}` + `${year}`;
//           const previousMonthNumber = monthNumber - 1;
//           const lastDateOfMonth = getLastDateOfMonth(month, year);
//           const remainingDays = lastDateOfMonth - extractDate;
//           const previous = `${previousMonthNumber}` + `${year}`;

//           if (mergeJoining == mergeJoining1) {
//             if (extractDate <= 15) {
//               work_days = 15 - (extractDate - 1) - absent;
//             }
//           } else if (results4.user_status == "Resigned") {
//             work_days = (30 - resignExtractDate) - absent;
//           } else if (previous <= mergeJoining1) {
//             if (extractDate <= 15) {
//               work_days = lastDateOfMonth - absent;
//             } else if (previousMonthNumber == joiningMonth) {
//               work_days = (lastDateOfMonth - extractDate) + 15 - absent
//             }
//             else {
//               work_days = lastDateOfMonth - absent;
//             }
//           }
//           else {
//             work_days = remainingDays + 15 - absent
//           }

//           // console.log("work_days", work_days);

//           // if (mergeJoining == mergeJoining1) {
//           //   if (extractDate <= 15) {
//           //     work_days = 15 - (extractDate - 1) - absent;
//           //   }
//           //   // work_days = monthLastValue - extractDate - absent;
//           // } else if (findSeparationData?.user_status == "Resigned") {
//           //   work_days = (30 - resignExtractDate) - absent;
//           // }
//           // else {
//           //   work_days = remainingDays - (15 - extractDate) + 15 - absent
//           // }

//           const present_days = work_days;
//           const perdaysal = results4[0].salary / lastDateOfMonth;
//           const totalSalary = perdaysal * present_days;
//           const Bonus = bonus == undefined ? 0 : req.body.bonus;
//           const netSalary = (totalSalary + parseInt(Bonus)) - salaryDeduction;
//           const tdsDeduction = (netSalary * results4[0].tds_per) / 100;
//           const ToPay = netSalary - tdsDeduction;
//           const salary = results4[0].salary;
//           // const attendanceId = await getNextAttendanceId();
//           const editsim = await attendanceModel.findOneAndUpdate(
//             // { attendence_id: parseInt(check1[0].attendence_id) },
//             // { attendence_id: attendanceId },
//             {
//               attendence_id: parseInt(req.body.attendence_id),
//               month: req.body.month,
//               year: req.body.year,
//             },
//             {
//               dept: req.body.dept,
//               user_id: req.body.user_id,
//               noOfabsent: absent,
//               month: req.body.month,
//               year: req.body.year,
//               bonus: Bonus,
//               total_salary: totalSalary && totalSalary.toFixed(2),
//               tds_deduction: tdsDeduction && tdsDeduction.toFixed(2),
//               net_salary: netSalary && netSalary.toFixed(2),
//               toPay: ToPay && ToPay.toFixed(2),
//               month_salary: (present_days * perdaysal).toFixed(2),
//               remark: req.body.remark,
//               salary,
//               salary_deduction,
//               attendence_status,
//               salary_status,
//               disputed_reason: req.body.disputed_reason,
//               disputed_date: req.body.disputed_date,
//               attendence_status_flow: req.body.attendence_status_flow,
//             },
//             { new: true }
//           ).sort({ attendence_id: 1 });
//           // console.log("edit", editsim)
//           return res.send({ status: 200 });
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .send({ error: error.message, sms: "error while adding data" });
//   }
// };

//Calculate Start Date and End Date By Month And Year

function getStartDateAndEndDate(monthName, year) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const monthIndex = monthNames.indexOf(monthName);
  if (monthIndex === -1) {
    throw new Error("Invalid month name");
  }

  const startDate = new Date(year, monthIndex, 16);
  const endDate = new Date(year, monthIndex + 1, 15);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
}

// new api for new calculation
exports.addAttendance = async (req, res) => {
  try {
    const {
      dept,
      user_id,
      noOfabsent,
      month,
      year,
      bonus,
      salary_deduction,
      attendence_status,
      salary_status
    } = req.body;
    const { startDate, endDate } = getStartDateAndEndDate(month, year);
    var sDate = new Date(startDate);
    var sDate1 = sDate.getDate();
    var sMonth = sDate.getUTCMonth() + 1;
    var sYear = sDate.getUTCFullYear();
    var monthName = getMonthName(sMonth);

    //Last Date of salary month
    var lastDate = getLastDate(sMonth, sYear);

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
        month: monthName,
        year: sYear,
      });

      if (check1.length == 0) {
        const check2 = await userModel.find({
          job_type: "WFHD",
          dept_id: req.body.dept,
          att_status: 'onboarded',
          user_status: "Active"
        }).select({ user_name: 1, joining_date: 1, salary: 1, user_id: 1 });

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
            // console.log("users", user);
            //logic for separation
            const resignDate = user.resignation_date;

            const resignConvertDate = new Date(resignDate);

            const resignMonth = resignConvertDate.toLocaleString('default', { month: 'long' });

            const resignMonthNum = resignConvertDate.getUTCMonth() + 1;

            const resignYear = String(resignConvertDate.getUTCFullYear());
            const resignExtractDate = resignConvertDate.getDate();
            const resignMonthYear = `${resignYear}` + `${resignMonthNum}`;

            var work_days;
            var mergeStartDate;
            var mergeJoining;

            const newJoining = user?.joining_date;
            const newconvertDate = newJoining.toISOString().slice(0, 10);

            sDate = new Date(startDate);
            sDate1 = sDate.getDate();
            sMonth = sDate.getUTCMonth() + 1;
            sYear = sDate.getUTCFullYear();
            mergeStartDate = `${sYear}` + `${sMonth}`;

            const extractDate = new Date(newconvertDate);
            const extractDate1 = extractDate.getDate();

            const joiningMonth = extractDate.getUTCMonth() + 1;
            const joiningYear = extractDate.getUTCFullYear();
            mergeJoining = `${joiningYear}` + `${joiningMonth}`;
            const previousMonthNumber = sMonth - 1;
            const previous = `${previousMonthNumber}` + `${year}`;

            const nextMonthNumber = sMonth + 1;
            const next = `${nextMonthNumber}` + `${year}`;

            const previousLastDate = getLastDate(previousMonthNumber, sYear);
            const absent = noOfabsent == undefined ? 0 : req.body.noOfabsent;

            if (mergeStartDate == mergeJoining) {
              if (extractDate1 <= 15) {
                work_days = (15 - (extractDate1 - 1)) - absent;
                // console.log("work_days1", work_days);
              }
            } else if (user.user_status == "Resigned") {
              work_days = (30 - resignExtractDate) - absent;
              // console.log("work_days2", work_days);
            } else if (previous <= mergeJoining) {
              if (extractDate1 <= 15) {
                work_days = previousLastDate;
                // console.log("work_days3", work_days);
              } else if (previousMonthNumber == joiningMonth) {
                work_days = (previousLastDate - extractDate1) + 15 - absent
                // console.log("work_days4", work_days);
              }
              else {
                work_days = lastDate - absent;
                // console.log("work_days5", work_days);
              }
            } else if (nextMonthNumber == joiningMonth) {
              if (extractDate1 <= 15) {
                work_days = (15 - extractDate1) - absent;
                // console.log("work_days8", work_days);
              }
            }
            else {
              work_days = lastDate - absent;
              // console.log("work_days6", work_days);
            }

            if (mergeStartDate >= mergeJoining || mergeJoining >= mergeStartDate) {

              const userExistsInAttendance = await doesUserExistInAttendance(
                user.user_id,
                req.body.month,
                req.body.year
              );
              if (!userExistsInAttendance) {

                const Bonus = bonus == undefined ? 0 : req.body.bonus;
                const presentDays = work_days;
                const perdaysal = (user.salary / lastDate).toFixed(2);
                const working_days = work_days ? Number(work_days) : 0;
                const totalSalary = ((perdaysal * working_days) + Bonus).toFixed(2);
                const netSalary = totalSalary + Bonus;
                const tdsDeduction = Number(user.salary) * Number(user.tds_per || 0) / 100;
                const ToPay = netSalary - tdsDeduction;
                const salary = user.salary;

                let invoiceNo = await createNextInvoiceNumber(user.user_id, monthName, sYear);

                const attendanceId = getNextAttendanceId();
                const creators = new attendanceModel({
                  attendence_id: attendanceId,
                  dept: dept,
                  user_id: user.user_id,
                  invoiceNo: invoiceNo,
                  user_name: user.user_name,
                  noOfabsent: absent,
                  present_days: presentDays,
                  month_salary: Number(totalSalary),
                  month: monthName,
                  year: sYear,
                  bonus: Bonus,
                  total_salary: user.salary,
                  tds_deduction: Number(tdsDeduction),
                  net_salary: Number(netSalary),
                  toPay: ToPay,
                  remark: "",
                  Created_by: req.body.user_id,
                  salary,
                  attendence_status_flow: "Payout Generated",
                  disputed_reason: req.body.disputed_reason,
                  disputed_date: req.body.disputed_date,
                  salary_deduction: req.body.salary_deduction
                });

                if (user.user_status === "Resigned" && resignMonthYear < bodymonth) {
                  console.log("User Exist ");
                } else {
                  const instav = await creators.save();
                }
              }
            }
          });
        res.send({ status: 200 });
      }
      else if (
        req.body.user_id == check1[0].user_id &&
        monthName == check1[0].month &&
        sYear == check1[0].year
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
        const extractDate = convertDate.getDate();
        const joiningMonth = String(convertDate.getUTCMonth() + 1).padStart(
          2,
          "0"
        );
        const joiningYear = String(convertDate.getUTCFullYear());
        mergeJoining = `${joiningYear}` + `${joiningMonth}`;

        mergeStartDate = `${sYear}` + `${sMonth}`;

        const previousMonthNumber = sMonth - 1;
        const previous = `${previousMonthNumber}` + `${year}`;
        const nextMonthNumber = sMonth + 1;
        const next = `${nextMonthNumber}` + `${year}`;

        const previousLastDate = getLastDate(previousMonthNumber, sYear);

        if (mergeStartDate == mergeJoining) {
          if (extractDate <= 15) {
            work_days = (15 - (extractDate - 1)) - absent;
            console.log("work_days1", work_days);
          }
        } else if (results4[0].user_status == "Resigned") {
          work_days = ((lastDate - resignExtractDate) - absent);
        } else if (previous <= mergeJoining) {
          if (extractDate <= 15) {
            work_days = previousLastDate - absent;
            console.log("work_days2", work_days);
          } else if (previousMonthNumber == joiningMonth) {
            work_days = (previousLastDate - extractDate) + 15 - absent
            console.log("work_days3", work_days);
          }
          else {
            work_days = lastDate - absent;
            console.log("work_days4", work_days);
          }
        } else if (nextMonthNumber == joiningMonth) {
          if (extractDate <= 15) {
            work_days = (15 - extractDate) - absent;
            console.log("work_days5", work_days);
          }
        }
        else {
          work_days = lastDate - absent;
          console.log("work_days6", work_days);
        }

        const Bonus = bonus == undefined ? 0 : req.body.bonus;
        const presentDays = work_days;
        const perdaysal = (results4[0].salary / lastDate).toFixed(2);
        const working_days = work_days ? Number(work_days) : 0;
        const totalSalary = ((perdaysal * working_days) + Bonus).toFixed(2);
        const netSalary = totalSalary - salaryDeduction;
        const tdsDeduction = Number(results4[0].salary) * Number(results4[0].tds_per || 0) / 100;
        const ToPay = netSalary - tdsDeduction;
        const salary = results4[0].salary;

        const editsim = await attendanceModel.findOneAndUpdate(
          {
            attendence_id: parseInt(req.body.attendence_id),
            month: monthName,
            year: sYear,
          },
          {
            dept: req.body.dept,
            user_id: req.body.user_id,
            noOfabsent: absent,
            month: req.body.month,
            year: req.body.year,
            bonus: Bonus,
            total_salary: totalSalary,
            tds_deduction: tdsDeduction,
            net_salary: netSalary,
            toPay: ToPay,
            month_salary: presentDays * perdaysal,
            remark: req.body.remark,
            present_days: presentDays,
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
        return res.send({ status: 200 });
      }
    }
  }
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: error.message, sms: "error while adding data" });
  }
};

exports.getSalaryByDeptIdMonthYear = async (req, res) => {
  try {
    const imageUrl = vari.IMAGE_URL;

    // Map month name to numeric value
    const monthMap = {
      "January": 1, "February": 2, "March": 3, "April": 4,
      "May": 5, "June": 6, "July": 7, "August": 8,
      "September": 9, "October": 10, "November": 11, "December": 12
    };
    const monthNumeric = monthMap[req.body.month];

    if (!monthNumeric) {
      return res.status(400).send({ error: "Invalid month name" });
    }

    const getcreators = await attendanceModel.aggregate([
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
          localField: "dept_id",
          foreignField: "department.dept_id",
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
          present_days: 1,
          month_salary: 1,
          year: 1,
          // remark: 1,
          Creation_date: 1,
          Created_by: 1,
          // Last_updated_by: 1,
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
          beneficiary_name: "$user.beneficiary",
          billing_header_name: "$billingheadermodels.billing_header_name",
          // billing_header_name: {
          //   $cond: {
          //     if: {
          //       $and: [
          //         {
          //           $eq: [
          //             { $type: "$billingheadermodels.billing_header_name" },
          //             "missing",
          //           ],
          //         },
          //       ],
          //     },
          //     then: "",
          //     else: "$billingheadermodels.billing_header_name",
          //   },
          // },
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
          // current_address: "$user.current_address",
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
          // digital_signature_image: "$user.digital_signature_image",
        },
      },
      // {
      //   $match: {
      //     joining_date: {
      //       $lte: new Date(req.body.year, monthNumeric - 1, 15),
      //     },
      //   },
      // },
      {
        $group: {
          _id: "$attendence_id",
          data: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$data" },
      },
    ]).sort({ attendence_id: 1 });

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
          $unwind: {
            path: "$department",
            preserveNullAndEmptyArrays: true,
          },
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
            presentDays: "$present_days",
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
        {
          $group: {
            _id: "$attendence_id",
            data: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$data" },
        },
      ]).sort({ attendence_id: -1 });
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
            _id: "$year",
            totalsalary: { $sum: "$salary" },
            netSalary: { $sum: "$net_salary" },
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

exports.currentMonthAllDeptTotalSalary = async (req, res) => {
  try {

    //months name array create
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

    //current date get
    const currentDate = new Date();
    const currentMonthNumber = currentDate.getMonth();
    const currentMonthName = months[currentMonthNumber].toString();

    //get data from the aggregation query
    const query = await attendanceModel.aggregate([{
      $match: {
        month: currentMonthName
      }
    }, {
      $group: {
        _id: null,
        totalSalary: { $sum: "$salary" },
        netSalary: { $sum: "$net_salary" },
        totalBonus: { $sum: "$bonus" },
        totalTdsDeduction: { $sum: "$tds_deduction" },
        totalSalaryDeduction: { $sum: "$salary_deduction" }
      }
    }]).exec();

    //success response send
    res.send({ status: 200, data: query });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "Error in current month all department data."
    });
  }
};

exports.singleDeptWholeYearTotalSalary = async (req, res) => {
  try {
    //current date find
    const currentDate = new Date();
    //current date to year get
    const currentYear = currentDate.getFullYear().toString();
    //get dept id from params
    const deptId = req.params?.id;
    //aggregation through data get
    const query = await attendanceModel.aggregate([{
      $match: {
        year: parseInt(currentYear),
        dept: parseInt(deptId)
      }
    }, {
      $group: {
        _id: 0,
        totalsalary: { $sum: "$total_salary" },
        totalBonus: { $sum: "$bonus" },
        totaltdsdeduction: { $sum: "$tds_deduction" },
        totalsalarydeduction: { $sum: "$salary_deduction" },
      }
    }]).exec();

    //send success response
    res.send({ status: 200, data: query });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "error in single dept whole year getting all salary",
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

// const getMonthYearDataFunc = async function () {
//   try {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonthIndex = currentDate.getMonth() + 1;
//     const numberOfMonths = 12; // we need 12 months

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

//     const startYear = currentMonthIndex <= months.indexOf("March") ? currentYear - 1 : currentYear;
//     let startMonthIndex = months.indexOf("April");

//     const monthYearArray = Array.from({ length: numberOfMonths }, (_, index) => {
//       const month = months[(startMonthIndex + index) % 12];
//       const year = (startMonthIndex + index) >= 9 ? startYear + 1 : startYear;
//       return { month, year };
//     });

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
//       {
//         $group: {
//           _id: {
//             month: "$_id.month",
//             year: "$_id.year"
//           },
//           deptCount: { $sum: 1 }
//         }
//       }
//     ];

//     const dbResult = await attendanceModel.aggregate(aggregationPipeline);

//     const dbSet = new Set(
//       dbResult.map((item) => `${item._id.month}-${item._id.year}`)
//     );

//     const actualExistingResult = monthYearArray.map((item) => {
//       const dateStr = `${item.month}-${item.year}`;
//       const existingData = dbSet.has(dateStr) ? 1 : 0;

//       const deptCount = dbResult.find(entry => entry._id.month === item.month && entry._id.year === item.year)?.deptCount || 0;

//       item.deptCount = deptCount;
//       item.atdGenerated = existingData;

//       return item;
//     });

//     const response = { data: [...actualExistingResult] };
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }

// const getMonthYearDataCurrentFy = async function () {
//   try {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonthIndex = currentDate.getMonth() + 1;
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

//     let startYear = currentYear;
//     if (currentMonthIndex >= 1 && currentMonthIndex <= 3) {
//       startYear--;
//     }

//     const monthYearArray = months.map((month, index) => {
//       const loopMonthIndex = ((4 + index - 1) % 12) + 1;
//       const loopYear =
//         startYear + Math.floor((4 + index - 1) / 12);
//       return {
//         month,
//         year: loopYear,
//       };
//     });

//     const aggregationPipeline = [
//       {
//         $group: {
//           _id: {
//             month: "$month",
//             year: "$year",
//             dept: "$dept",
//           },
//           totalAmount: { $sum: "$salary" },
//           totalSalary: { $sum: "$toPay" },
//           totalBonus: { $sum: "$bonus" }
//         },
//       },
//       {
//         $group: {
//           _id: {
//             month: "$_id.month",
//             year: "$_id.year"
//           },
//           totalAmount: { $sum: "$totalAmount" },
//           totalSalary: { $sum: "$totalSalary" },
//           totalBonus: { $sum: "$totalBonus" },
//           deptCount: { $sum: 1 },
//         }
//       }
//     ];

//     const dbResult = await attendanceModel.aggregate(aggregationPipeline);

//     const dbSet = new Set(
//       dbResult.map((item) => `${item._id.month}-${item._id.year}`)
//     );

//     const actualExistingResult = monthYearArray.map((item) => {
//       const dateStr = `${item.month}-${item.year}`;
//       const existingData = dbSet.has(dateStr);
//       const dbEntry = dbResult.find(entry => entry._id.month === item.month && entry._id.year === item.year);
//       const deptCount = dbEntry ? dbEntry.deptCount : 0;
//       const totalAmount = dbEntry ? dbEntry.totalAmount : 0;
//       const totalSalary = dbEntry ? dbEntry.totalSalary : 0;
//       const totalBonus = dbEntry ? dbEntry.totalBonus : 0;
//       item.deptCount = deptCount;
//       item.atdGenerated = existingData ? 1 : 0;
//       item.totalAmount = totalAmount;
//       item.totalSalary = totalSalary;
//       item.totalBonus = totalBonus;
//       return item;
//     });
//     // const shiftedResult = actualExistingResult.map((item, index, array) => {
//     //   const nextIndex = (index + 1) % array.length;
//     //   const nextItem = array[nextIndex];
//     //   return {
//     //     month: item.month,
//     //     year: item.year,
//     //     deptCount: nextItem.deptCount,
//     //     atdGenerated: nextItem.atdGenerated,
//     //     totalAmount: nextItem.totalAmount,
//     //     totalSalary: nextItem.totalSalary,
//     //     totalBonus: nextItem.totalBonus
//     //   };
//     // });

//     // const response = { data: shiftedResult };
//     return actualExistingResult;
//   } catch (error) {
//     console.log(error);
//   }
// }

// new
const getMonthYearDataCurrentFy = async function () {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth() + 1;
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
    if (currentMonthIndex >= 1 && currentMonthIndex <= 3) {
      startYear--;
    }

    const monthYearArray = months.map((month, index) => {
      const loopMonthIndex = ((4 + index - 1) % 12) + 1;
      const loopYear = startYear + Math.floor((4 + index - 1) / 12);
      return {
        month,
        year: loopYear,
      };
    });

    const aggregationPipeline = [
      {
        $group: {
          _id: {
            month: "$month",
            year: "$year",
            dept: "$dept",
          },
          totalAmount: { $sum: "$salary" },
          totalSalary: { $sum: "$toPay" },
          totalBonus: { $sum: "$bonus" },
          card_status: {
            $max: {
              $cond: [
                { $eq: ["$attendence_status_flow", "Pending From Finance"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          totalAmount: { $sum: "$totalAmount" },
          totalSalary: { $sum: "$totalSalary" },
          totalBonus: { $sum: "$totalBonus" },
          deptCount: { $sum: 1 },
          card_status: { $max: "$card_status" },
        },
      },
    ];

    const dbResult = await attendanceModel.aggregate(aggregationPipeline);

    const dbSet = new Set(
      dbResult.map((item) => `${item._id.month}-${item._id.year}`)
    );

    const actualExistingResult = monthYearArray.map((item) => {
      const dateStr = `${item.month}-${item.year}`;
      const existingData = dbSet.has(dateStr);
      const dbEntry = dbResult.find(entry => entry._id.month === item.month && entry._id.year === item.year);
      const deptCount = dbEntry ? dbEntry.deptCount : 0;
      const totalAmount = dbEntry ? dbEntry.totalAmount : 0;
      const totalSalary = dbEntry ? dbEntry.totalSalary : 0;
      const totalBonus = dbEntry ? dbEntry.totalBonus : 0;
      const cardStatus = dbEntry ? dbEntry.card_status : 0;
      item.deptCount = deptCount;
      item.atdGenerated = existingData ? 1 : 0;
      item.totalAmount = totalAmount;
      item.totalSalary = totalSalary;
      item.totalBonus = totalBonus;
      item.card_status = cardStatus;
      return item;
    });

    return actualExistingResult;
  } catch (error) {
    console.log(error);
  }
}

exports.getMonthYearDataMerged = async (req, res) => {
  try {
    //get data from 2023 fy 
    // let data1 = await getMonthYearDataFunc();
    //get data from current fy 
    let data2 = await getMonthYearDataCurrentFy();
    const response = { data: data2 };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message, sms: "error getting data" });
  }
}

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
          $match: { job_type: "WFHD", user_status: "Active", att_status: "onboarded" },
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

exports.getSalaryCalculationWithFilterData = async (req, res) => {
  try {
    let matchQueryObj = {};
    const filterOption = req.query?.filterOption;

    //check if query filter data is available
    if (filterOption && filterOption != '') {
      //current Quater data array for the months
      let firstQuter = ["January", "February", "March"];
      let secondQuter = ["April", "May", "June"];
      let thirdQuter = ["July", "August", "September"];
      let fourthQuter = ["October", "November", "December"];

      //months name array create
      const months = [...firstQuter, ...secondQuter, ...thirdQuter, ...fourthQuter]

      //current date get
      const currentDate = new Date();

      //current date to year get
      let currentYear = currentDate.getFullYear();
      let previousYear = currentYear - 1;

      //current date to month number get
      let currentMonthNumber = currentDate.getMonth();
      let previousMonthNumber = currentMonthNumber - 1;

      //condition check for the months number
      if (previousMonthNumber < 0) {
        previousMonthNumber = 11;
        currentYear = currentYear - 1;
      }

      //months number to name finds
      const currentMonthName = months[currentMonthNumber].toString();
      const prevoiusMonthName = months[previousMonthNumber].toString();

      // Determine the current quarter based on the current month number
      let currentQuarter;
      if (currentMonthNumber >= 0 && currentMonthNumber <= 2) {
        currentQuarter = firstQuter;
      } else if (currentMonthNumber >= 3 && currentMonthNumber <= 5) {
        currentQuarter = secondQuter;
      } else if (currentMonthNumber >= 6 && currentMonthNumber <= 8) {
        currentQuarter = thirdQuter;
      } else {
        currentQuarter = fourthQuter;
      }

      //current month data get condition
      if (filterOption == "this_month") {
        matchQueryObj = {
          month: currentMonthName,
          year: parseInt(currentYear)
        }
      }
      //current quater data get condition
      if (filterOption == "this_quater") {
        matchQueryObj = {
          month: {
            $in: currentQuarter
          },
          year: parseInt(currentYear)
        }
      }
      //current yesr data get condition
      if (filterOption == "this_year") {
        matchQueryObj = {
          year: parseInt(currentYear)
        }
      }
      //previous month data get condition
      if (filterOption == "previous_month") {
        matchQueryObj = {
          month: prevoiusMonthName,
          year: parseInt(currentYear)
        }
      }
      //previous year data get condition
      if (filterOption == "previous_year") {
        matchQueryObj = {
          year: parseInt(previousYear)
        }
      }
    }

    const groupedAttendanceData = await attendanceModel.aggregate([{
      $match: matchQueryObj
    }, {
      $group: {
        _id: {
          dept: "$dept",
          month: "$month",
          year: "$year"
        },
        salary: { $sum: "$salary" },
        totalSalary: { $sum: "$total_salary" },
        totalBonus: { $sum: "$bonus" },
        disbursedSalary: { $sum: "$disbursedSalary" },
        totalUsers: { $sum: 1 },
      }
    }, {
      $lookup: {
        from: "departmentmodels",
        localField: "_id.dept",
        foreignField: "dept_id",
        as: "department",
      }
    }, {
      $unwind: "$department",
    }, {
      $project: {
        _id: 0,
        dept_id: "$_id.dept",
        month: "$_id.month",
        year: "$_id.year",
        totalSalary: 1,
        salary: 1,
        totalBonus: 1,
        disbursedSalary: 1,
        pendingAmount: { $subtract: ["$totalSalary", "$disbursedSalary"] },
        dept_name: "$department.dept_name",
        totalUsers: 1
      }
    }]).sort({ dept_id: 1 });

    return res.status(200).send({ data: groupedAttendanceData });
  } catch (error) {
    return res.send({
      error: error.message,
      status: 500,
      sms: "Error in getting grouped attendance data with filter",
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
          total_salary: { $first: "$total_salary" },
          salary: { $first: "$total_salary" },
          toPay: { $first: "$toPay" },
          bonus: { $first: "$bonus" },
          tds_deduction: { $first: "$tds_deduction" },
          salary_deduction: { $first: "$salary_deduction" }
        },
      },
      {
        $project: {
          _id: 0,
          dept_id: 1,
          user_id: 1,
          user_name: 1,
          month: 1,
          total_salary: 1,
          salary: 1,
          toPay: 1,
          bonus: 1,
          tds_deduction: 1,
          salary_deduction: 1,
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

//delete api
exports.deleteAttecndenceData = async (req, res) => {
  try {
    const { dept, month, year } = req.body;

    if (!dept || !month || !year) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    const attendanceDataDeleted = await attendanceModel.deleteMany({
      dept: dept,
      month: month,
      year: year
    });
    if (attendanceDataDeleted.deletedCount === 0) {
      return res.status(404).json({ error: 'No attendance data found for the provided criteria' });
    }
    return res.status(200).json({
      status: 200,
      message: 'Attendance data deleted successfully!',
      data: attendanceDataDeleted
    });
  } catch (error) {
    console.error('Error deleting attendance data:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

exports.getSalaryByMonthWise = async (req, res) => {
  try {
    const results = await attendanceModel.aggregate([
      {
        $lookup: {
          from: "departmentmodels",
          localField: "dept",
          foreignField: "dept_id",
          as: "dept_data",
        },
      },
      {
        $unwind: {
          path: "$dept_data",
          // preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            dept_id: "$dept",
            month: "$month",
            year: "$year"
          },
          toPay: { $sum: "$toPay" },
          salary: { $sum: "$salary" },
          bonus: { $sum: "$bonus" },
          dept_name: { $first: "$dept_data.dept_name" },
        },
      },
      {
        $sort: { "month": -1 }
      }
    ]);

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: error.message, sms: "error while adding data" });
  }
}

exports.getSalaryWithLPAOfWFHD = async (req, res) => {
  try {
    const users = await userModel.aggregate([
      {
        $match: { job_type: "WFHD", user_status: "Active", att_status: "onboarded" }
      },
      {
        $project: {
          ctc: 1,
          LPA: { $divide: ["$ctc", 100000] }
        }
      },
      {
        $bucket: {
          groupBy: "$LPA",
          boundaries: [0, 1, 2, 3, 4, 5, 10, 20, 30, 40, 50],
          default: "Other",
          output: {
            user_count: { $sum: 1 }
          }
        }
      }
    ]);

    const formattedResult = users.map(bucket => {
      let range = "";
      if (bucket._id === "Other") {
        range = "Above 50 LPA";
      } else {
        const lowerBound = bucket._id;
        const upperBound = lowerBound + 1;
        range = `${lowerBound}-${upperBound} LPA`;
      }
      return { [range]: bucket.user_count };
    });

    res.status(200).json({
      success: true,
      data: formattedResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}

exports.getAllWFHDUsersWithBonus = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          bonus: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'departmentmodels',
          localField: 'dept',
          foreignField: 'dept_id',
          as: 'department'
        }
      },
      {
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          dept: "$dept",
          month: "$month",
          year: "$year",
          user_id: "$user_id",
          user_name: "$user_name",
          dept_name: "$department.dept_name",
          salary: "$salary",
          totalSalary: "$total_salary",
          toPay: "$toPay",
          bonus: "$bonus",
          users: 1,
          totalBonus: 1
        }
      }
    ];

    const data = await attendanceModel.aggregate(pipeline);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.getAllStatusOfAttendance = async (req, res) => {
  try {
    const data = await attendanceModel.find({}).select({ attendance_status_flow: 1 })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}

exports.getSalaryWithLPAOfWFO = async (req, res) => {
  try {
    const users = await userModel.aggregate([
      {
        $match: { job_type: "WFO", user_status: "Active" }
      },
      {
        $project: {
          ctc: 1,
          LPA: { $divide: ["$ctc", 100000] }
        }
      },
      {
        $bucket: {
          groupBy: "$LPA",
          boundaries: [0, 1, 2, 3, 4, 5, 10, 20, 30, 40, 50],
          default: "Other",
          output: {
            user_count: { $sum: 1 }
          }
        }
      }
    ]);

    const formattedResult = users.map(bucket => {
      let range = "";
      if (bucket._id === "Other") {
        range = "Above 50 LPA";
      } else {
        const lowerBound = bucket._id;
        const upperBound = lowerBound + 1;
        range = `${lowerBound}-${upperBound} LPA`;
      }
      return { [range]: bucket.user_count };
    });

    res.status(200).json({
      success: true,
      data: formattedResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}

exports.updateAllSalaryWithFinance = async (req, res) => {
  try {
    const { attendence_ids, sendToFinance } = req.body;

    if (!attendence_ids || !attendence_ids.length) {
      return res.status(400).json({ message: "No attendance IDs provided" });
    }

    const financeRecords = attendence_ids.map(attendence_id => ({
      attendence_id: attendence_id,
    }));

    const insertedFinance = await financeModel.insertMany(financeRecords);
    const updatedAttendance = await attendanceModel.updateMany(
      { attendence_id: { $in: attendence_ids } },
      { $set: { sendToFinance: sendToFinance, attendence_status_flow: 'Pending From Finance' } }
    );

    res.status(200).json({
      message: "Finance data inserted and attendance updated successfully",
      finance: insertedFinance,
      attendance: updatedAttendance,
    });
  } catch (err) {
    console.error("Error updating salary with finance:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};