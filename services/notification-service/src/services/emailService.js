const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send an email
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Send a notification email
const sendNotificationEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Notification email sent successfully');
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};

module.exports = {
    sendEmail,
    sendNotificationEmail,
};
