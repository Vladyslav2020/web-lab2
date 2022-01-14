const nodemailer = require('nodemailer');
require('dotenv').config();
const sanitizeHtml = require('sanitize-html');

class MailService {
    static transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.FROM,
            pass: process.env.PASSWORD,
        },
    });

    constructor(subject, message, firstName, lastName) {
        subject = sanitizeHtml(subject);
        message = sanitizeHtml(message);
        firstName = sanitizeHtml(firstName);
        lastName = sanitizeHtml(lastName);
        this.mailOptions = {
            from: process.env.FROM,
            to: process.env.TO,
            subject: `Message from ${firstName} ${lastName}. ${subject}`,
            text: message,
        };
    }

    async sendMail() {
        return new Promise(resolve => {
            MailService.transporter.sendMail(
                this.mailOptions,
                function (error) {
                    if (error) {
                        console.log('Error: ', error);
                        return resolve({
                            status: 'BAD',
                            message: error,
                        });
                    } else {
                        return resolve({
                            status: 'OK',
                            message: 'Email successfully sent!!!',
                        });
                    }
                },
            );
        });
    }
}

module.exports = { MailService };
