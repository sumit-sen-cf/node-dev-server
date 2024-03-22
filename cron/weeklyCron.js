const cron = require('node-cron');

// Function to schedule weekly email
exports.scheduleWeeklyEmail = () => {
    cron.schedule('0 0 * * 0', async () => { 
        await sendWeeklyEmail();
    });
};

async function sendWeeklyEmail() {
    try {
        console.log("Sending weekly email...");

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "ankigupta1254@gmail.com",
                pass: "ptxbqtjmcaghogcg",
            }
        });

        // Email content
        const mailOptions = {
            from: "ankigupta1254@gmail.com", 
            to: "ankigupta1254@gmail.com", 
            subject: 'Weekly Report', 
            html: '<p>This is the weekly report.</p>' 
        };

        await transporter.sendMail(mailOptions);

        console.log("Weekly email sent successfully");
    } catch (error) {
        console.error('Error sending weekly email:', error);
    }
}


