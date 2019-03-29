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

router.get('/getListItems/:userId/:listId', function (req, res) {
  let userId = parseInt(req.params.userId);
  let listId = parseInt(req.params.listId);
  var listItems = {
    todoItems: [],
    completedItems: []
  }
console.log('req.body')
console.log(listId)
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
    listItems.todoItems = items;
    db.ListItem.findAll({
      where: {
        ListId: listId,
        completed: true
      }
    }).then(function (items, err) {
      if (err) {
        console.log(err);
        return (err);
      }
      listItems.completedItems = items;
      res.json(listItems);
    })
  })
})

router.get('/getAllUserLists/:id', function (req, res) {

  let id = parseInt(req.params.id);
  db.List.findAll({
    where: {
      UserId: id
    }
  }).then(function (lists, err) {
    if (err) {
      console.log(err);
      return (err);
    }
    console.log('get all user lists',lists);
    res.json(lists);
  })
});

//dashboard pages routes
// Auth route - populate vendor dashboard based on their user id.
router.get('/populateDashboardVendor/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  //change the request parameter from a string to a number
  //gets the request token
  var userId = parseInt(req.params.id);
  var token = getToken(req.headers);
  if (token) {
    //find all of the products
    db.Product.findAll({
      //where the products foreign key is equal to the id passed as a parameter in the request
      where: { UserId: userId }
      //after info is grabbed from the database
    }).then(function (products, err) {
      console.log(products);
      console.log('success');
      console.log(err);
      //if there is an error, return the error
      if (err) {
        return (err);
      }
      //if there is no error, send the products back as json
      else {
        res.json(products);
      }
    });
    //if user is unauthorized return info back to the user
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }

});

//this route grabs the market associated with the market organizer
//this is a very similar route to populateDashboardVendor
//route is first ran through passport for authentication
router.get('/populateDashboardMarket/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log('in');
  //request parameter needs to be parsed to a number before searching the database
  var userId = parseInt(req.params.id)
  var token = getToken(req.headers);
  if (token) {
    //find one market
    db.Market.findOne({
      //where the markets foreign key matches the id passed as a request parameter
      where: { UserId: userId }
    }).then(function (market, err) {
      //if there is an error, return it
      if (err) {
        return err;
        //of there is no error, return the market's data as json
      } else {
        res.json(market);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized' });
  }
});

router.post('/addNewList',passport.authenticate('jwt', { session: false }), function (req, res) {
  // add new list to db
  if (getToken(req.headers)) {

    list = req.body;
    user = JSON.parse(req.headers.user);

    db.List.create({
      UserId: user.id,
      listName: list.title
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

//Dashboard create product route
router.post('/postListItems', passport.authenticate('jwt', { session: false }), function (req, res) {
// router.post('/postListItems', function (req, res) {
  var token = getToken(req.headers);

  if (token) {

    console.log('in token');
    console.log("in if statement");
    console.log(req.headers);
    var item = req.body;

    db.ListItem.create(item)
      .then(function (items, err) {
        if (err) {
          return (err);
        }
        else {
          res.json(items);
        }
    });

  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }

});

router.post('/newMarket', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);

  console.log(req.user.dataValues.id);
  console.log("here is the res.data:")
  console.log(req.user.dataValues);

  if (token) {
    console.log(req.user.dataValues.id);

    if(req.body.marketImage === ''){
      var image = 'https://cfmatl.org/wp-content/uploads/2016/01/Grant-Park-Farmers-Market.jpg'
    } else {
      var image = req.body.marketImage
    }

    var newProduct = {
      marketName: req.body.marketName,
      marketAddress: req.body.marketAddress,
      marketImage: image,
      marketTime: req.body.marketTime,
      marketZip: req.body.marketZip,
      UserId: req.user.dataValues.id
    }

    db.Market.create(newProduct)
      .then(function (products, err) {
        console.log(products);
        console.log('success');
        console.log(err);
        if (err) {
          return (err);
        }
        else {
          res.json(products);
        }
      });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }

})

//Dashboard update a product route

// router.put('/updateListItem/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
router.put('/updateListItem/:listId/:itemId', function (req, res) {
  // var token = getToken(req.headers);
  let listId = parseInt(req.params.listId);
  let itemId = parseInt(req.params.itemId);
  console.log('itemId')
  console.log(itemId)
  // if (token) {
    db.ListItem.update(
      {
        // item: req.body.item,
        completed: req.body.completed
      },
      { where: { 
        ListId: listId,
        id: itemId
      } })
      .then(function (item, err) {
        if (err) {
          return (err);
        }
        else {
          res.json(item)
        }
      });
  // } else {
  //   return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  // }
})

//Dashboard update a market route

router.put('/updateMarket/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  let id = parseInt(req.params.id);
  if (token) {
    db.Market.update(
      {
        marketName: req.body.marketName,
        marketAddress: req.body.marketAddress,
        marketTime: req.body.marketTime,
        marketImage: req.body.marketImage,
        marketZip: req.body.marketZip
      },
      { where: { UserId: id } })
      .then(function (market, err) {
        if (err) {
          return (err);
        }
        else {
          res.json(market)
        }
      });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
})

router.put('/updateUser/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  let id = parseInt(req.params.id);
  if (token) {
    db.User.update(
      {
        profileImage: req.body.profileImage,
        email: req.body.email,
        businessName: req.body.businessName,
        bio: req.body.bio
      },
      { where: { id: id } })
      .then(function (user, err) {
        if (err) {
          return (err);
        }
        else {
          res.json(user)
        }
      });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
})
// Api route to update password from profile form
router.put('/updatePassword/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  let id = parseInt(req.params.id);
  console.log(token, id, req.body.password);
  if (token) {
    db.User.update(
      {
        password: generateHash(req.body.password),
      },
      { where: { id: id } })
      .then(function (user, err) {
        if (err) {
          return (err);
          console.log('failed')
        }
        else {
          res.json(user)
          console.log('success')
        }
      });
  } else {
    console.log('errrrr')
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
})

router.delete('/deleteListItem/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  if (getToken(req.headers)) {
    let id = parseInt(req.params.id);

    db.ListItem.destroy({
      where: { id: id }
    }).then(function (item, err) {
      if (err) {
        return (err);
      } else {
        res.json(item);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized' });
  }
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


//farmer page routes
router.get('/populateFarmerPage/:id', function (req, res) {
  db.User.findOne({
    where: { id: req.params.id, userType: 'Vendor' }
  })
    .then(function (farmer, err) {
      if (err) return (err);
      else {
        res.json(farmer);
      }
    });
});

//markets page routes 
//will need to be populated by location, use zipcode 
router.get('/populateMarketCard', function (req, res) {
  db.Market.findAll({})
    .then(function (market, err) {
      if (err) return (err);
      else {
        res.json(market);
      }
    });
});

router.get('/populateMarketPage/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.Market.findOne({
    where: { id: id }
  })
    .then(function (market, err) {
      if (err) return (err);
      else {
        res.json(market);
      }
    });
});

router.get('/populateFarmers/:id', function (req, res) {
  let id = parseInt(req.params.id);
  
  db.Request.findAll({
    where: {MarketId: id, hasAccepted: true}
  })
  .then(function(requests, error){
    if(error) throw error;
    else {
     let farmers = [];
      requests.map((request)=>{
        farmers.push(request.UserId)
        })
        db.User.findAll({
          where: {
            id: {[Op.in] : farmers}
        }})
        .then(function(farmers, error){
          if(error) throw error;
          else{
            res.json(farmers)
          }
        })
      }
    });
  })


//products routes- associated with farmers 

router.get('/populateProducts/:id', function (req, res) {
  let id = parseInt(req.params.id);
  db.Product.findAll(
    { where: { UserId: id } })
    .then(function (products, err) {
      if (err) return (err);
      else {
        res.json(products);
      }
    });
});

router.get('/nearbyMarkets/:id', function (req, res) {
  let id = parseInt(req.params.id)
  db.Request.findAll(
    { where: { UserId: id } }
  ).then(function (requests, error) {
    if (error) return (error);
    else {
      // console.log('test');
      // console.log(requests);
      let marketIds = [];
      requests.map(request => {
        console.log(request);
        marketIds.push(request.dataValues.MarketId)
      })
      console.log("these are the market ids:" + marketIds);
      db.Market.findAll({
        where: {
          id: {
            [Op.notIn]: marketIds
          }
        }
      })
        .then(function (markets, err) {
          if (err) return (err);
          else {
            res.json(markets);
          }
        })
    }
  })
});

router.post('/sendRequest', passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log("inside send request")
  var marketIds = req.body.marketIds;
  console.log(req.body.marketIds)

  var requests = marketIds.map((id) => {
    request = {
      farmerName: req.user.dataValues.firstName + ' ' + req.user.dataValues.lastName,
      businessName: req.user.dataValues.businessName,
      UserId: req.user.dataValues.id,
      hadAccepted: false,
      MarketId: id
    }
    return request;
  })
  // console.log(requests)
  db.Request.bulkCreate(requests)
    .then(function (requests, error) {
      if (error) {
        throw error
      }
      else {
        res.send('success')
      }
    });
})

router.get('/retrieveRequests/:id', function (req, res) {
  let id = req.params.id;

  db.Market.findOne({
    where: { UserId: id }
  }).then(function (market, error) {
    if (error) throw error;
    else {
      if (market === null) {
        res.send([]);
      } else {
        db.Request.findAll({
          where: {
            MarketId: market.dataValues.id,
            hasAccepted: false
          }
        }).then(function (request, error) {
          if (error) throw error;
          else {
            console.log(request);
            res.json(request);
          }
        })
      }
    }
  })
});

router.put('/acceptRequest', passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log('inside route')
  let requestIds = req.body.requestIds;
  console.log(requestIds);
  db.Request.update({
    hasAccepted: true
  },
    {
      where: { id: { [Op.in]: requestIds } }
    }).then(function (request, error) {
      if (error) throw error;
      else {
        res.json(request)
      }
    })
})

router.get('/getSidebarMarkets/', function (req, res) {
  db.Market.findAll({
    limit: 5
  }).then(function (markets, error) {
    if (error) throw error;
    else {
      res.json(markets);
    }
  })
})

router.get('/filterProductsByMarket/:id', function (req, res) {
  let marketId = parseInt(req.params.id);
  db.Request.findAll({
    where: {
      MarketId: marketId,
      hasAccepted: true
    }
  }).then(function (requests, error) {
    if (error) throw error;
    else {
      let farmerIds = [];
      console.log(requests);
      requests.map((request) => {
        farmerIds.push(request.dataValues.UserId);
      });
      db.Product.findAll({
        where: {
          UserId: {
            [Op.in]: farmerIds
          }
        }
      }).then(function (products, error) {
        if (error) throw error;
        else {
          res.json(products);
        }
      })
    }
  })
})

router.get('/getAssociatedMarkets/:id', function (req, res) {
  let farmerId = parseInt(req.params.id);
  db.Request.findAll({
    where: {
      UserId: farmerId,
      hasAccepted: true
    }
  }).then(function (requests, error) {
    if (error) throw error;
    else {
      let marketIds = [];
      requests.map((request) => {
        marketIds.push(request.dataValues.MarketId);
      });
      db.Market.findAll({
        where: {
          id: {
            [Op.in]: marketIds
          }
        }
      }).then(function (markets, error) {
        if (error) throw error;
        else {
          res.json(markets)
        }
      })
    }
  })
})

router.get('/findMarketByZip/:id', function (req, res) {
  console.log("inside find markets by zip")
  let zipcode = parseInt(req.params.id);
  db.Market.findAll({
    where: {
      marketZip: zipcode
    }
  }).then(function (markets, error) {
    if (error) throw error;
    else {
      res.json(markets)
    }
  })
})

router.post('/sendSMS', function(req,res){
  let currDateTime = new Date().toISOString().slice(0,16);
  let requestedDateTime = req.body.date.slice(0,16);

  // console.log(currDateTime);
  // console.log(requestedDateTime);

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

})

module.exports = router;