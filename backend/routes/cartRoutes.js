const express = require('express')
const router = express.Router()
const cartsController = require('../controllers/cartsController')
const {verifyJWT, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('../middleware/verifyJWT')

router.use(verifyJWT)

// // Customer
// router.route('/cart/:userId')
//     .get(verifyTokenAndAuthorization, cartsController.getUserCart)           

// router.route('/cart')
//     .post(cartsController.createNewCart)                            // check

// router.route('/cart/:id')
//     .patch(verifyTokenAndAuthorization, cartsController.updateCart)       
//     .delete(verifyTokenAndAuthorization, cartsController.deleteCart)  


// // Admin
// router.route('/admin/cart')
//     .get(verifyTokenAndAdmin, cartsController.getAllCart)       
        



// Customer
router.route('/cart/:userId')
    .get(cartsController.getUserCart)  
    .delete(cartsController.deleteCartProduct)         

// router.route('/cart')
//     .post(cartsController.createNewCart)                            // check

router.route('/cart')
    .post(cartsController.addNewCartProduct)                            // check

// router.route('/cart/:id')    there's no need to update cart
//     .patch(cartsController.updateCart)    


// Admin
router.route('/admin/cart')
    .get(cartsController.getAllCart)       
        
router.route('/admin/cart/:id')


module.exports = router
