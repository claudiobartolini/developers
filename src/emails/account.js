const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    console.log('sending welcome email to ' + name + ' at ' + email)
    sgMail.send({
        to: email,
        from: 'claudio@duili.co.uk',
        subject: 'Thanks for joining in!',
        text: 'Welcome to the app, ' + name + '. Let me know if I can help'
    })
}

const sendGoodbyeEmail = (email, name) => {
    console.log('sending goodbye email to ' + name + ' at ' + email)
    sgMail.send({
        to: email,
        from: 'claudio@duili.co.uk',
        subject: 'Sorry to see you go!',
        text: 'Sorry you\'re cancelling your account, ' + name + '. Let me know if there was something grong'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
