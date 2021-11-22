let nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
    static transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.FROM,
            pass: process.env.PASSWORD
        }
    });

    constructor(subject, message) {
        this.mailOptions = {
            from: process.env.FROM,
            to: process.env.TO,
            subject,
            text: message
        };
    }

    async sendMail() {
        return new Promise((resolve, reject) => {
            MailService.transporter.sendMail(this.mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return resolve({
                        status: "BAD",
                        message: error
                    });
                } else {
                    return resolve({
                        status: "OK",
                        message: "Email successfully sent!!!"
                    });
                }
            });
        })
    }
}

module.exports = {MailService};




