const express = require('express')
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const productController = require('../controllers/product')

router.post("", checkAuth, productController.createProduct)
router.get("", productController.getAllProducts)
router.get('/:id', productController.getById)
router.get('/search/:name', productController.search)
router.put('/:id', checkAuth, productController.update)
router.delete('/:id', checkAuth, productController.delete)

module.exports = router
