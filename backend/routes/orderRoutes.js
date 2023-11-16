const express = require('express')
const router = express.Router()
const ordersController = require('../controllers/ordersController')
const {verifyJWT, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('../middleware/verifyJWT')

router.use(verifyJWT)

// // Customer
// router.route('/orders/new')
//     .post(ordersController.createNewOrder)                          // check

// // Admin
// router.route('/admin/orders')
//     .get(verifyTokenAndAdmin, ordersController.getAllOrders)        // check

// router.route('/admin/orders/income')
//     .get(verifyTokenAndAdmin, ordersController.getMonthlyIncome) 

// router.route('/admin/orders/:id')
//     .get(verifyTokenAndAdmin, ordersController.getOrderInfo)        // check
//     .patch(verifyTokenAndAdmin, ordersController.updateOrder)       // check
//     .delete(verifyTokenAndAdmin, ordersController.deleteOrder)      // check




// Customer
router.route('/orders/new')
    .post(ordersController.createNewOrder)                          // check

// Admin
router.route('/admin/orders')
    .get(ordersController.getAllOrders)        // check

router.route('/admin/orders/income')
    .get(ordersController.getMonthlyIncome) 

router.route('/admin/orders/:id')
    .get(ordersController.getOrderInfo)        // check
    .patch(ordersController.updateOrder)       // check
    .delete(ordersController.deleteOrder)      // check


module.exports = router

//  customer clicks order history button
//  find all "orders" with user id  user._id
