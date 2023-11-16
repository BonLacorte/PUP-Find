const express = require('express')
const router = express.Router()
const productsController = require('../controllers/productsController')
const {verifyJWT, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('../middleware/verifyJWT')

router.use(verifyJWT)

// Customer
router.route('/products')
    .get(productsController.getAllProducts)              // check

router.route('/products/:id')
    .get(productsController.getProductInfo)              // check

// Admin
router.route('/admin/products')
    .get(productsController.getAllProducts)        // check
    

router.route('/admin/products/new')
    .post(productsController.createNewProduct)     // check

router.route('/admin/products/:id')
    .patch(productsController.updateProduct)       // check
    .delete(productsController.deleteProduct)      // check
    .get(productsController.getProductInfo)        // check




// // Customer
// router.route('/products')
//     .get(productsController.getAllProducts)              // check

//     router.route('/products?category=:category')
//     .get(productsController.getAllProductsByCategory)      

// router.route('/product/:id')
//     .get(productsController.getProductInfo)              // check

// // Admin
// router.route('/admin/products')
//     .get(productsController.getAllProducts)        // check
    

// router.route('/admin/products/new')
//     .post(productsController.createNewProduct)     // check

// router.route('/admin/product/:id')
//     .patch(productsController.updateProduct)       // check
//     .delete(productsController.deleteProduct)      // check
//     .get(productsController.getProductInfo)        // check
    

module.exports = router
