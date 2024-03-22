const cron = require('node-cron');

// Function to schedule monthly email
exports.scheduleMonthlyEmail = () => {
    cron.schedule('0 0 1 * *', async () => { // First day of every month at midnight
        await sendMonthlyEmail();
    });
};

// Function to send monthly email
async function sendMonthlyEmail() {
    try {
        console.log("Sending monthly email...");

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
            subject: 'monthly Report', 
            html: '<p>This is the monthly report.</p>' 
        };

        await transporter.sendMail(mailOptions);

        console.log("monthly email sent successfully");
    } catch (error) {
        console.error('Error sending monthly email:', error);
    }
}
