var express = require('express');
var router = express.Router();
var fs = require('fs');
var Cart = require('../models/cart');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

router.get('/index', function(req, res) {
    MongoClient.connect('mongodb://localhost/loginapp', function(err, db) {
        var products;
        db.collection('foods').find().toArray(function(err, products) {
            if (err) {
                console.log(err);
            } else {
                console.log(products);
                res.render('index', {
                    id: id,
                    title: title,
                    price: price
                });
            }
            db.close();
        });
    });
});

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
    res.render('index', {
        title: 'FoodTree',
        products: products
    });
});

router.get('/adminLogin', function(req, res) {
    res.render('adminLogin');
});

router.get('/admin', function(req, res) {
    res.redirect('http://localhost:8084');
});

router.get('/pay', function(req, res) {
    res.render('pay');
});

router.get('/pay', function(req, res) {
    res.redirect('pay');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

router.get('/add/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = products.filter(function(item) {
        return item.id == productId;
    });
    cart.add(product[0], productId);
    req.session.cart = cart;
    res.redirect('/');
});

router.get('/cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('cart', {
            products: null
        });
    }
    var cart = new Cart(req.session.cart);
    res.render('cart', {
        title: 'Shopping Cart',
        products: cart.getItems(),
        totalPrice: cart.totalPrice
    });
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

module.exports = router;