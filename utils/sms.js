var db = require('../Models');
require('dotenv').config()

// Twilio Credentials
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// require the Twilio module and create a REST client
const sms = {
    twilioClient: require('twilio')(accountSid, authToken),
    scanTimeToSendTexts: function(minutes){
        console.log('yup')
        let _this = this;
        setInterval(function(){
            _this.sendTextsByDateTime();
        },1000 * 60 * minutes);
    },
    sendText: function(data){
        this.twilioClient.messages.create(
            {
              to: '+15206129381',
              from: '+12012989819',
              body: data.message
            },
            (err, message) => {
                if(err) return err;
                return message
            }
        );
    },
    sendTextsByDateTime: function(){
        let date = new Date().toISOString().slice(0, 10);
        let time = Date().slice(16,21);
        let _this = this;
        db.Text.findAll({
            where: {
                sendDate: date,
                sendTime: time
            }
        }).then(function (texts, err) {
            if (err) {
                console.log(err);
                return (err);
            }
            console.log('Attempting to send texts if they are ready...')
            
            texts.forEach(text => {
                _this.sendText(text);
            });
        })
    }
}

module.exports = sms;
