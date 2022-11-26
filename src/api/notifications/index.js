const sgMail= require('@sendgrid/mail')
const accountNotifications = require('./Email-template/accountUpdate')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const sendNotificationMail = (email, subject, message, name) => {
        sgMail.send({
        to: email,
        from: process.env.BUSINESS_EMAIL,
        subject: subject,
        html: accountNotifications.emailTemplate(message, name)
        })
    }

    module.exports={
        sendNotificationMail,
    }
