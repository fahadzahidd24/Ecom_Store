const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const checkAuth = require('../middleware/check-auth')

router.post("", checkAuth, (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
  });
  product.save();
  res.status(201).json({
    message: "Product Added Successfully"
  });
})


router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  let fetchedProducts;
  const productQuery = Product.find();
  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery.then((documents) => {
    fetchedProducts = documents;
    return Product.count();
  }).then(count => {
    res.status(200).json({
      message: "Products Fetched Successfully",
      products: fetchedProducts,
      maxProducts: count
    })
  })

})

router.get('/:id', (req, res, next) => {
  Product.findById(req.params.id).then((product) => {
    if (product) {
      res.status(200).json(product);
    }
    else {
      res.status(404).json({
        message: "Product Not Found"
      })
    }
  })
})

router.get('/search/:name', (req, res, next) => {
  const searchQuery = req.params.name;
  const regex = new RegExp(searchQuery, 'i');
  Product.find({ name: regex }).then((product) => {
    // console.log(product);
    if (product) {
        res.status(200).json({
          message:"Product Found",
          products:product,
          maxProducts:product.length
        })
    }
    else {
      res.status(404).json({
        message: "Product Not Found"
      })
    }
  })
})


router.put('/:id',checkAuth, (req, res, next) => {
  const product = new Product({
    _id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image
  })
  Product.updateOne({ _id: req.params.id }, product).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Product Updated Succesfully"
    })
  })
})

router.delete('/:id',checkAuth, (req, res, next) => {
  Product.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({
      message: "Product Deleted Successfully"
    });
  }).catch(err=>{
    console.log(err);
  })
})

module.exports = router
