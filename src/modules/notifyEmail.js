const cron = require('node-cron');
const transporter = require('./mailer');

const notify = cron.schedule('* 2 * * * *', function () {
    console.log('---------------------');
    console.log('Running Cron Job');

    let messageOptions = {
        from: 'your_demo_email_address@example.com',
        to: 'user@example.com',
        subject: 'Scheduled Email',
        text: 'Hi there. This email was automatically sent by us.',
        template: 'notify',
        // context: { token, app_url },
    };
    console.log(messageOptions)
    // transporter.sendMail(messageOptions, function (error, info) {
    //     if (error) {
    //         throw error;
    //     } else {
    //         console.log('Email successfully sent!');
    //     }
    // });
});

module.exports = notify;