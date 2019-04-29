var express = require('express');
var router = express.Router();
var db = require('../Models');
var passport = require('passport');
const nodemailer = require("nodemailer");
require('../config/passport')(passport);
var bcrypt = require('bcrypt-nodejs');
const Op = require('sequelize').Op;
var Sequelize = require('sequelize');
var sms = require('../utils/sms');
var email = require('../utils/email');
require('dotenv').config();


// For some reason, creating this instance is required to run a custom query.
var sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
});

// Auth Token
getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

// Encrypt Password
var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

// GET===========================================================

router.get('/getListItems/:userId/:listId', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    if (getToken(req.headers)) {
        let userId = parseInt(req.params.userId);
        let listId = parseInt(req.params.listId);
        db.ListItem.findAll({
            where: {
                ListId: listId,
                completed: false
            }
        }).then(function(items, err) {
            if (err) {
                console.log(err);
                return (err);
            }
            res.json(items);
        })
    } else return res.status(403).send({
        success: false,
        msg: 'Unauthorized.'
    });
})

router.get('/getAllUserLists/:id', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    if (getToken(req.headers)) {
        let id = parseInt(req.params.id);
        db.List.findAll({
            where: {
                UserId: id
            },
            include: [{
                model: db.ListItem
                // required: true
            }]
        }).then(function(lists, err) {
            if (err) {
                console.log(err);
                return (err);
            }

            // console.log(positions);
            console.log('get all user lists', lists);

            res.json(lists);
        })
    } else return res.status(403).send({
        success: false,
        msg: 'Unauthorized.'
    });

});

// POST===========================================================

router.post('/addList', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    // add new list to db
    if (getToken(req.headers)) {

        list = req.body;
        user = JSON.parse(req.headers.user);

        db.List.create({
                UserId: user.id,
                title: list.title
            })
            .then(function(lists, err) {
                if (err) {
                    return (err);
                } else {
                    res.json(lists);
                }
            });

    } else return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
  });
});

router.post('/addListItem', passport.authenticate('jwt', {
    session: false
}), function(req, res) {

    if (getToken(req.headers)) {

        var item = req.body;

        db.ListItem.create(item)
            .then(function(item, err) {
                if (err) return (err);
                db.List.update({
                    itemOrder: Sequelize.fn('CONCAT', Sequelize.col("itemOrder"), `${item.id},`)
                }, {
                    where: {
                        id: item.ListId
                    }
                }).then(function(list, err) {
                    if (err) return (err);
                    res.json(item);
                });
            });

    } else {
        return res.status(403).send({
            success: false,
            msg: 'Unauthorized.'
        });
    }

});

router.post('/sendSMS', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    if (getToken(req.headers)) {

        user = JSON.parse(req.headers.user);
        userId = user.id;
        let currDateTime = new Date().toISOString().slice(0, 16);
        let requestedDateTime = req.body.date.slice(0, 16);


        let data = {
            'userId': userId,
            'message': req.body.message,
            'sendTime': req.body.sendTime,
            'sendDate': req.body.sendDate
        }
        // send text now if request is for now
        if (currDateTime === requestedDateTime) {
            sms.sendText(data);
            res.json('good')
        }

        db.Text.create(data)
            .then(function(resp, err) {
                if (err) throw err;
                // console.log(texts);
                res.json(resp);
            });
    } else return res.status(403).send({
        success: false,
        msg: 'Unauthorized.'
    });

});


// Send Email
router.post('/sendEmail', function(req, res) {

    // console.log('sendEmail',req);

    // using SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            
    const msg = {
        to: req.body.sendTo,
        from: 'music@stevenhorkey.com',
        subject: req.body.subject,
        text: req.body.message,
        html: req.body.message
    };

    sgMail
    .send(msg)
    .then(() => {
        //Celebrate
        console.log('email sent');
        res.json('success')
      })
      .catch(error => {
        res.json('error');
        //Log friendly error
        console.error(error.toString());
    
        //Extract error msg
        const {message, code, response} = error;
    
        //Extract response msg
        const {headers, body} = response;
      });
    
    // async..await is not allowed in global scope, must use a wrapper
    // async function main(){

    //     let transporter = nodemailer.createTransport({
    //         host: 'smtp.gmail.com',
    //         port: 587,
    //         secure: false,
    //         requireTLS: true,
    //         auth: {
    //             user: process.env.GMAIL_USER,
    //             pass: process.env.GMAIL_PASS
    //         }
    //     });
        
    //     let mailOptions = {
    //         from: 'stevedevtech@gmail.com',
    //         to: req.body.sendTo,
    //         subject: req.body.subject,
    //         text: req.body.message
    //     };
        
    //     transporter.sendMail(mailOptions, (error, info) => {
    //         if (error) {
    //             return console.log(error.message);
    //             res.json('error');
    //         }
    //         console.log('success');
    //         res.json('success');
    //     });
    // }

    // main().catch(console.error);

    
    
});

// PUT===========================================================

router.put('/updateListItem/:listId/:itemId', passport.authenticate('jwt', {
    session: false
}), function(req, res) {

    if (getToken(req.headers)) {

        let listId = parseInt(req.params.listId);
        let itemId = parseInt(req.params.itemId);

        db.ListItem.update({
                completed: req.body.completed
            }, {
                where: {
                    ListId: listId,
                    id: itemId
                }
            })
            .then(function(item, err) {
                if (err) return (err);
                res.json(item)
            });
    } else return res.status(403).send({
        success: false,
        msg: 'Unauthorized.'
    });
})

router.put('/updateListItemOrder/:listId', passport.authenticate('jwt', {
    session: false
}), function(req, res) {

    if (getToken(req.headers)) {

        let listId = parseInt(req.params.listId);
        db.List.update({
                // item: req.body.item,
                itemOrder: req.body.newItemOrder
            }, {
                where: {
                    id: listId,
                }
            })
            .then(function(item, err) {
                if (err) return (err);
                res.json(item)
            });
    } else return res.status(403).send({
        success: false,
        msg: 'Unauthorized.'
    });
})

router.put('/updateListItemValue/:listId/:itemId', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    var token = getToken(req.headers);


    console.log(req.body);

    if (getToken(req.headers)) {

        let listId = parseInt(req.params.listId);
        let itemId = parseInt(req.params.itemId);


        db.ListItem.update({
                value: req.body.newValue
            }, {
                where: {
                    ListId: listId,
                    id: itemId,
                }
            })
            .then(function(item, err) {
                if (err) return (err);
                res.json(item)
            });
    } else return res.status(403).send({
        success: false,
        msg: 'Unauthorized.'
    });
})

// DELETE===========================================================

router.delete('/deleteListItem/:listId/:itemId', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    if (getToken(req.headers)) {
        let listId = parseInt(req.params.listId);
        let itemId = parseInt(req.params.itemId);
        console.log("UPDATE Lists SET `itemOrder` = REPLACE(itemOrder,'" + itemId + ",','') WHERE `id` = '" + listId + "'")
        sequelize.query("UPDATE Lists SET `itemOrder` = REPLACE(itemOrder,'" + itemId + ",','') WHERE `id` = '" + listId + "'", {
            type: Sequelize.QueryTypes.UPDATE
        }).then((results) => {
            console.log('hehehe');
            console.log(results);
            db.ListItem.destroy({
                where: {
                    id: itemId
                }
            }).then(function(item, err) {
                if (err) return (err);
                res.json(item);
            });
        });


    } else return res.status(403).send({
        success: false,
        msg: 'Unauthorized'
    });
});

router.delete('/deleteList/:id', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    if (getToken(req.headers)) {
        let id = parseInt(req.params.id);

        db.List.destroy({
            where: {
                id: id
            }
        }).then(function(list, err) {
            if (err) {
                return (err);
            } else {
                res.json(list);
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'Unauthorized'
        });
    }
});

module.exports = router;