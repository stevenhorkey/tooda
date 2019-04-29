var db = require('../Models');
require('dotenv').config()

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

// require the Twilio module and create a REST client
const email = {

    scanTimeToSendEmails: function(minutes){
        let _this = this;
        setInterval(function(){
            _this.sendEmailsByDateTime();
        },1000 * 60 * minutes);
    },
    sendEmail: function(from, to, subject, text, html){
        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                
        const msg = {
            from,
            to,
            subject,
            text,
            html
        };

        sgMail
        .send(msg)
        .then(() => {
            return 'success';
        })
        .catch(error => {
        
            //Log friendly error
            console.error(error.toString());
        
            //Extract error msg
            const {message, code, response} = error;
        
            //Extract response msg
            const {headers, body} = response;

            return 'error';
        });
    },
    sendEmailByDateTime: function(){
        let date = new Date().toISOString().slice(0, 10);
        let time = Date().slice(16,21);
        let _this = this;
        db.Email.findAll({
            where: {
                sendDate: date,
                sendTime: time
            }
        }).then(function (emails, err) {
            if (err) {
                console.log(err);
                return (err);
            }
            console.log('Attempting to send emails if they are ready...')
            
            emails.forEach(email => {
                _this.sendEmail(email);
            });
        })
    }
}

module.exports = email;
