const express = require('express');
const router = express.Router();
const { CartController } = require('../controler/CartControlers');
const cartController = new CartController();

router.get('/cart', cartController.getCart);
router.get('/cart/:id', cartController.getCartbyId);
router.get('/cartitem', cartController.getCart_item);
router.get('/cartitem/:id', cartController.getCart_itembyId);

// buat cart baru atau untuk pertama kali
router.post('/cart/:itemId/:userId', cartController.addCart);

// buat cart dengan cartId sama atau keduakali dan seterusnya
router.post('/cartitem/:cartId/:itemId', cartController.addCartbyId);

// update cart untuk input quantityTotal dan totalPrice property di cart tabel dari sisi frontend
router.put('/cart/:id', cartController.updateCartbyItem);

// delete satu item di cart dan property quantity
router.delete('/cartitem/:cartId/:itemId', cartController.deleteCartbyItem);

// delete cart atau semua item di cart
router.delete('/cart/:id', cartController.deleteCartAllItem);

module.exports = router;
