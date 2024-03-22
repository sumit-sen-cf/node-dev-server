const cron = require('node-cron');

// Function to schedule quarterly email
exports.scheduleQuarterlyEmail = () => {
    cron.schedule('0 0 1 1,4,7,10 *', async () => { 
        await sendQuarterlyEmail();
    });
};

// Function to send quarterly email
async function sendQuarterlyEmail() {
    try {
        console.log("Sending quatrley email...");

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
            subject: 'quatrley Report', 
            html: '<p>This is the quatrley report.</p>' 
        };

        await transporter.sendMail(mailOptions);

        console.log("quatrley email sent successfully");
    } catch (error) {
        console.error('Error sending quatrley email:', error);
    }
}
