const cron = require('node-cron');
const phpVendorPaymentRequestData = require("../controllers/phpVendorPaymentRequest");

console.log("cron file calls");
exports.cronImplement = async (req, res) => {
    console.log("cron function calls");
    //cron is to used daily email send
    cron.schedule('0 0 * * *', async () => {
        console.log("cron is to used daily email send")
        //  await phpVendorPaymentRequestData.getVendorPaymentRequestDayWiseListData();
    });

    //cron is to used weekly email send
    cron.schedule('0 8 1 * * 1', async () => {
        console.log("cron is to used weekly email send")
        //  await phpVendorPaymentRequestData.getVendorPaymentRequestWeeklyList();
    });

    //cron is to used for monthly email send
    cron.schedule('0 6 1 * *', async () => {
        console.log("cron is to used for monthly email send")
        //  await phpVendorPaymentRequestData.getVendorPaymentRequestMonthlyList();
    });

    //cron is to used for quaterly email send
    cron.schedule('0 9 1 1,4,7,10 *', async () => {
        console.log("cron is to used for quaterly email send")
        //  await phpVendorPaymentRequestData.getVendorPaymentRequestQuatrlyList();
    });
}