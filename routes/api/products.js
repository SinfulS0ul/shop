const express = require('express');
const upload = require('../../services/file-upload');
const validateSellProductInput = require('../../validation/sellProduct');

const router = express.Router();

const Product = require('../../models/Product');
const User = require('../../models/User');

router.get('/test', (req, res) => res.json({
  msg: "Products Works"
}));

// @route    POST api/products/addProduct
// @desc     Add product

router.post('/addProduct', upload.array('photos', 6), (req, res) => {
  const {
    errors,
    isValid
  } = validateSellProductInput(req.body);

  if (!isValid)
    return res.status(400).json(errors);

    const newProduct = new Product({
      title: req.body.title,
      location: req.body.location,
      userId: req.body.userId
    });

    req.body.price ? newProduct.price = `$${req.body.price}`: newProduct.price = 'No Price';
    req.body.description ? newProduct.description = req.body.description : newProduct.description = 'No Description';
    newProduct.photos = [];
    if (req.files.length > 0)
      newProduct.photos = req.files.map(file => file = file.location);
    else
      newProduct.photos.push('https://murph1ne.s3.eu-central-1.amazonaws.com/1570732578133noimage-md.png');
    newProduct
      .save()
      .then(item => {
        User
          .findOne({
            _id: req.body.userId
          })
          .then(user => {
            user.products = [...user.products, item._id];
            user.save();
          })
          .then(res.json(item))
          .catch(err => {
            console.log(err);
            Products.remove({ _id: item._id});
            return res.status(400);
          })
        })
      .catch(err => console.log(err));
});

// @route    GET api/products/getSearchedProducts
// @desc     Get products by title and location

router.get('/getSearchedProducts', (req, res) => {
  let product = {};
  if (req.query.title)
    product.title = req.query.title;
  if (req.query.location)
    product.location = req.query.location;

  Product
    .find({
      ...product
    })
    .then(products => {
      res.json(products);
    })
    .catch(err => console.log(err));
});

// @route    GET api/products/getProductById
// @desc     Get product by id

router.get('/getProductById', (req, res) => {
  Product
    .findOne({ _id: req.query.id })
    .then(product => {
      res.json(product);
    })
    .catch(err => console.log(err));
});

// @route    GET api/products/getAllProductsWithId
// @desc     Get all products with id

router.get('/getAllProductsWithId', (req, res) => {
  const idArr = Array.from(req.query.productsIds);
  Product
    .find({_id: { $in: [
      ...idArr
    ]}})
    .then(products => { res.send(products) })
});


// @route    GET api/products/getAll
// @desc     Get all products

router.get('/getAll', (req, res) => {
  Product
    .find({})
    .then(products => {
      res.send(products)
    })
});



module.exports = router;