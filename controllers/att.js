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

function getLastDate(month, year) {
    // JavaScript months are 0-based (0 = January, 11 = December), so we subtract 1 from the month
    const date = new Date(year, month, 0);
    // Get the last day of the month
    const lastDate = date.getDate();
    return lastDate;
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
            start_date,
            end_date
        } = req.body;

        const startDate = "2024-06-15";
        var sDate = new Date(startDate);
        var sDate1 = sDate.getDate();
        var sMonth = sDate.getUTCMonth() + 1;
        var sYear = sDate.getUTCFullYear();
        var monthName = getMonthName(sMonth);
        console.log("startDate", startDate);
        const endDate = "2024-07-15";
        console.log("endDate", endDate);
        const differenceInTime = endDate - startDate;

        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        const checkBillingHeader = await billingHeaderModel.findOne({ dept_id: dept });

        if (!checkBillingHeader) {
            return res.status(409).send({
                data: [],
                message: "Please Added First Billing Header For This Department",
            });
        }

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
                year: req.body.year,
            });
            console.log("check1", check1);
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
                        var mergeStartDate;
                        var mergeJoining;
                        var lastDate;
                        //new calculation
                        const newJoining = user?.joining_date;
                        // console.log("newJoining", newJoining);
                        const newconvertDate = newJoining.toISOString().slice(0, 10);
                        // console.log("newconvertDate", newconvertDate);

                        if (newconvertDate >= startDate && newconvertDate <= endDate) {
                            //startDate month year
                            sDate = new Date(startDate);
                            sDate1 = sDate.getDate();
                            sMonth = sDate.getUTCMonth() + 1;
                            // console.log("sMonth", sMonth);
                            sYear = sDate.getUTCFullYear();
                            // console.log("sYear", sYear);
                            mergeStartDate = `${sMonth}` + `${sYear}`;
                            // console.log("mergeStartDate", mergeStartDate)

                            const extractDate = new Date(newconvertDate);
                            const extractDate1 = extractDate.getDate();
                            const joiningMonth = extractDate.getUTCMonth() + 1;
                            const joiningYear = extractDate.getUTCFullYear();
                            // const mergeJoining = parseInt(joiningMonth + joiningYear);
                            mergeJoining = `${joiningMonth}` + `${joiningYear}`;
                            // console.log("mergeJoining", mergeJoining);
                            const monthNumber = monthNameToNumber(month);
                            const previousMonthNumber = sMonth - 1;
                            console.log("previousMonthNumber", previousMonthNumber);
                            // const lastDateOfMonth = getLastDateOfMonth(month, year);
                            // const remainingDays = lastDateOfMonth - extractDate1;
                            const previous = `${previousMonthNumber}` + `${year}`;

                            //Last Date of salary month
                            lastDate = getLastDate(sMonth, sYear);
                            console.log("lastDate", lastDate);

                            //last Date of previousMonth
                            const previousLastDate = getLastDate(previousMonthNumber, sYear);

                            if (mergeStartDate == mergeJoining) {
                                if (extractDate1 <= 15) {
                                    work_days = 15 - (extractDate - 1);
                                }
                            } else if (user.user_status == "Resigned") {
                                work_days = (30 - resignExtractDate);
                            } else if (previous <= mergeJoining) {
                                if (extractDate1 <= 15) {
                                    work_days = previousLastDate;
                                } else if (previousMonthNumber == joiningMonth) {
                                    work_days = (previousLastDate - extractDate1) + 15
                                }
                                else {
                                    work_days = lastDate;
                                }
                            }
                            else {
                                work_days = lastDate + 15;
                            }
                        }


                        //End new calculation
                        const absent = noOfabsent == undefined ? 0 : req.body.noOfabsent;

                        if (mergeStartDate <= mergeJoining) {
                            const userExistsInAttendance = await doesUserExistInAttendance(
                                user.user_id,
                                req.body.month,
                                req.body.year
                            );
                            if (!userExistsInAttendance) {
                                const presentDays = lastDate;

                                const perdaysal = user.salary / lastDate;

                                const totalSalary = perdaysal * presentDays;

                                const Bonus = bonus == undefined ? 0 : req.body.bonus;

                                const netSalary = totalSalary + Bonus;

                                const tdsDeduction = (netSalary * user.tds_per) / 100;

                                const ToPay = netSalary - tdsDeduction;
                                const salary = user.salary;
                                let invoiceNo = await createNextInvoiceNumber(user.user_id, monthName, year);

                                const attendanceId = getNextAttendanceId();
                                const creators = new attendanceModel({
                                    attendence_id: attendanceId,
                                    dept: user.dept_id,
                                    user_id: user.user_id,
                                    invoiceNo: invoiceNo,
                                    user_name: user.user_name,
                                    noOfabsent: Number(absent),
                                    present_days: Number(presentDays),
                                    month_salary: Number(totalSalary) && Number(totalSalary).toFixed(2),
                                    month: req.body.month,
                                    year: req.body.year,
                                    bonus: Bonus,
                                    total_salary: Number(user.salary) && Number(user.salary).toFixed(2),
                                    tds_deduction: Number(tdsDeduction) && Number(tdsDeduction).toFixed(2),
                                    net_salary: Number(netSalary) && Number(netSalary).toFixed(2),
                                    toPay: Number(ToPay) && Number(ToPay).toFixed(2),
                                    remark: "",
                                    Created_by: req.body.user_id,
                                    salary,
                                    attendence_status_flow: "Payout Generated",
                                    disputed_reason: req.body.disputed_reason,
                                    disputed_date: req.body.disputed_date,
                                    salary_deduction: req.body.salary_deduction
                                });

                                console.log("creators", creators);
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

                // console.log("results4", results4)

                const findSeparationData = await separationModel.findOne({ user_id: req.body.user_id })
                const resignDate = findSeparationData?.resignation_date;
                const resignConvertDate = new Date(resignDate);
                const resignExtractDate = resignConvertDate?.getDate();

                var work_days;
                const absent = noOfabsent == undefined ? 0 : req.body.noOfabsent;
                // console.log("absent", absent);
                const salaryDeduction = salary_deduction == undefined ? 0 : req.body.salary_deduction;
                // console.log("salaryDeduction", salaryDeduction);
                const joining = results4[0].joining_date;
                // console.log("fffffffffff", joining)
                // console.log("joining", joining);
                const convertDate = new Date(joining);
                const extractDate = convertDate.getDate();
                // console.log("extractDate", extractDate);
                const joiningMonth = String(convertDate.getUTCMonth() + 1).padStart(
                    2,
                    "0"
                );
                const joiningYear = String(convertDate.getUTCFullYear());
                const mergeJoining = parseInt(joiningMonth + joiningYear);
                const monthNumber = monthNameToNumber(month);
                const mergeJoining1 = `${monthNumber}` + `${year}`;
                const previousMonthNumber = monthNumber - 1;
                const lastDateOfMonth = getLastDateOfMonth(month, year);
                const remainingDays = lastDateOfMonth - extractDate;
                const previous = `${previousMonthNumber}` + `${year}`;

                if (mergeJoining == mergeJoining1) {
                    if (extractDate <= 15) {
                        work_days = 15 - (extractDate - 1) - absent;
                    }
                } else if (results4.user_status == "Resigned") {
                    work_days = (30 - resignExtractDate) - absent;
                } else if (previous <= mergeJoining1) {
                    if (extractDate <= 15) {
                        work_days = lastDateOfMonth - absent;
                    } else if (previousMonthNumber == joiningMonth) {
                        const lastDateOfMonth1 = getLastDate(previousMonthNumber, year);
                        work_days = (lastDateOfMonth1 - extractDate) + 15 - absent
                    }
                    else {
                        work_days = lastDateOfMonth - absent;
                    }
                }
                else {
                    work_days = remainingDays + 15 - absent
                }

                // console.log("work_days", work_days);

                // if (mergeJoining == mergeJoining1) {
                //   if (extractDate <= 15) {
                //     work_days = 15 - (extractDate - 1) - absent;
                //   }
                //   // work_days = monthLastValue - extractDate - absent;
                // } else if (findSeparationData?.user_status == "Resigned") {
                //   work_days = (30 - resignExtractDate) - absent;
                // }
                // else {
                //   work_days = remainingDays - (15 - extractDate) + 15 - absent
                // }

                const present_days = work_days;
                const perdaysal = results4[0].salary / lastDateOfMonth;
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
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .send({ error: error.message, sms: "error while adding data" });
    }
};