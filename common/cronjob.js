const cron = require('node-cron');


exports.cronImplement = async (req, res) => {

    cron.schedule('0 0 * * 0', async () => { 
        await sendWeeklyEmail();
    });
    cron.schedule('0 0 1 * *', async () => { 
        await sendMonthlyEmail();
    });
    cron.schedule('0 0 1 1,4,7,10 *', async () => { 
        await sendQuarterlyEmail();
    });
}
async function sendWeeklyEmail() {
    try {
        console.log("Sending weekly email...");

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your.email@gmail.com', 
                pass: 'yourpassword' 
            }
        });

        // Email content
        const mailOptions = {
            from: 'your.email@gmail.com', 
            to: 'recipient@example.com', 
            subject: 'Weekly Report', 
            html: '<p>This is the weekly report.</p>' 
        };

        await transporter.sendMail(mailOptions);

        console.log("Weekly email sent successfully");
    } catch (error) {
        console.error('Error sending weekly email:', error);
    }
}

// Function to send monthly email
async function sendMonthlyEmail() {
    try {
        // Implement your logic to send the monthly email
        console.log("Sending monthly email...");
        // Example: await sendEmail(description, parsed_request_date, totalPaymentAmount, totalRequestAmount, count, totaldisbursedAmount);
    } catch (error) {
        console.error('Error sending monthly email:', error);
    }
}



// Function to send quarterly email
async function sendQuarterlyEmail() {
    try {
        // Implement your logic to send the quarterly email
        console.log("Sending quarterly email...");
        // Example: await sendEmail(description, parsed_request_date, totalPaymentAmount, totalRequestAmount, count, totaldisbursedAmount);
    } catch (error) {
        console.error('Error sending quarterly email:', error);
    }
}
