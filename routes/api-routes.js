// still from tap root

var express = require('express');
var router = express.Router();
var db = require('../Models');
var passport = require('passport');
require('../config/passport')(passport);
var bcrypt = require('bcrypt-nodejs');
const Op = require('sequelize').Op;
var Sequelize = require('sequelize');
var sms = require('../utils/sms');
var sequelize = new Sequelize('todo_app', 'root', 'yekroh',{
  host: 'http://18.215.248.253',
  dialect: 'mysql'
});

// Auth Token
getToken = function (headers) {
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
var generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

// GET===========================================================

router.get('/getListItems/:userId/:listId', function (req, res) {
  let userId = parseInt(req.params.userId);
  let listId = parseInt(req.params.listId);
  db.ListItem.findAll({
    where: {
      ListId: listId,
      completed: false
    }
  }).then(function (items, err) {
    if (err) {
      console.log(err);
      return (err);
    }
    res.json(items);
  })
})

router.get('/getAllUserLists/:id', function (req, res) {

  let id = parseInt(req.params.id);
  db.List.findAll({
    where: {
      UserId: id
    },
    include: [{
      model: db.ListItem
      // required: true
    }]
  }).then(function (lists, err) {
    if (err) {
      console.log(err);
      return (err);
    }
    
    // console.log(positions);
    console.log('get all user lists',lists);
    
    res.json(lists);
  })
});

// POST===========================================================

router.post('/addList',passport.authenticate('jwt', { session: false }), function (req, res) {
  // add new list to db
  if (getToken(req.headers)) {

    list = req.body;
    user = JSON.parse(req.headers.user);

    db.List.create({
      UserId: user.id,
      title: list.title
    })
      .then(function (lists, err) {
        if (err) {
          return (err);
        }
        else {
          res.json(lists);
        }
    });

  }
});

router.post('/addListItem', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);

  if (token) {

    var item = req.body;

    db.ListItem.create(item)
      .then(function (item, err) {
        if (err) return (err);
        db.List.update({
          itemOrder: Sequelize.fn('CONCAT', Sequelize.col("itemOrder"),`${item.id},`)
        },
        {
          where: {
            id: item.ListId
          }
        }).then(function (list, err){
          if (err) return (err);
          res.json(item);
        });
    });

  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }

});

router.post('/sendSMS', function(req,res){
  let currDateTime = new Date().toISOString().slice(0,16);
  let requestedDateTime = req.body.date.slice(0,16);


  let data = {
    'message': req.body.message,
    'sendTime': req.body.sendTime,
    'sendDate': req.body.sendDate
  }
  // send text now if request is for now
  if (currDateTime === requestedDateTime){
    sms.sendText(data);
    res.json('good')
  } 

  db.Text.create(data)
    .then(function(resp, err){
      if(err) throw err;
      // console.log(texts);
      res.json(resp);
  });

});

// PUT===========================================================

router.put('/updateListItem/:listId/:itemId', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);

    let listId = parseInt(req.params.listId);
    let itemId = parseInt(req.params.itemId);

    if (token) {
      db.ListItem.update(
        {
          completed: req.body.completed
        },
        { where: { 
          ListId: listId,
          id: itemId
        } 
      })
        .then(function (item, err) {
          if (err) return (err);
          res.json(item)
        });
    } else return res.status(403).send({ success: false, msg: 'Unauthorized.' });
})

router.put('/updateListItemOrder/:listId', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);

    let listId = parseInt(req.params.listId);

    console.log(req.body);

    if (token) {
      db.List.update(
        {
          // item: req.body.item,
          itemOrder: req.body.newItemOrder
        },
        { where: { 
          id: listId,
        } 
      })
        .then(function (item, err) {
          if (err) return (err);
          res.json(item)
        });
    } else return res.status(403).send({ success: false, msg: 'Unauthorized.' });
})

router.put('/updateListItemValue/:listId/:itemId', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);

    let listId = parseInt(req.params.listId);
    let itemId = parseInt(req.params.itemId);

    console.log(req.body);

    if (token) {
      db.ListItem.update(
        {
          value: req.body.newValue
        },
        { where: { 
          ListId: listId,
          id: itemId,
        } 
      })
        .then(function (item, err) {
          if (err) return (err);
          res.json(item)
        });
    } else return res.status(403).send({ success: false, msg: 'Unauthorized.' });
})

// DELETE===========================================================

router.delete('/deleteListItem/:listId/:itemId', passport.authenticate('jwt', { session: false }), function (req, res) {
  if (getToken(req.headers)) {
    let listId = parseInt(req.params.listId);
    let itemId = parseInt(req.params.itemId);

    db.ListItem.destroy({
      where: { id: itemId }
    }).then(function (item, err) {
      if (err) return (err);

      sequelize.query(`UPDATE Lists SET itemOrder = REPLACE(itemOrder,'${itemId},','') WHERE id = ${listId}`, {
        type: Sequelize.QueryTypes.UPDATE
      }).then((results) => {
        console.log('hehehe');
        console.log(results);
      });

      res.json(item);
    });
  } else return res.status(403).send({ success: false, msg: 'Unauthorized' });
});

router.delete('/deleteList/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  if (getToken(req.headers)) {
    let id = parseInt(req.params.id);

    db.List.destroy({
      where: { id: id }
    }).then(function (list, err) {
      if (err) {
        return (err);
      } else {
        res.json(list);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized' });
  }
});

module.exports = router;
