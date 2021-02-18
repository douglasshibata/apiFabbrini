const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');

require('dotenv').config()

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});
transport.use('compile', hbs({
    viewEngine: {
        extName: ".html",
        partialsDir: path.resolve('./src/resources/mail'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: ".html",
}))
module.exports = transport;

//Error resolve with https://stackoverflow.com/questions/64033800/nodemailer-express-handlebars-error-enoent-no-such-file-or-directory-for-tem