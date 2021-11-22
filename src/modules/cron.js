const cron = require('node-cron');


const task = cron.schedule('* 3 * * * *', function () {
    // console.log('running a task every minute');
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});

module.exports = task;