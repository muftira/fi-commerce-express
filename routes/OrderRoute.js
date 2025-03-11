const express = require('express');
const router = express.Router();
const { OrderController } = require('../controler/OrderControler');
const orderController = new OrderController();
const { authentication, adminRole } = require('../midlewares/authentication');

router.get('/order', authentication, adminRole, orderController.getOrder);
router.get('/order/:id', authentication, orderController.getOrderbyId);
router.post('/order/:userId/:cartId', authentication, orderController.addOrder);

//update property statusOrder
router.put('/order/:id', authentication, orderController.updateOrder);

router.delete('/order/:id', authentication, orderController.deleteOrder);

module.exports = router;
