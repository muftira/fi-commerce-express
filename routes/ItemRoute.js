const express = require('express');
const router = express.Router();
const { ItemController } = require('../controler/ItemControler');
const itemController = new ItemController();
const { authentication, adminRole } = require('../midlewares/authentication');
const upload = require('../midlewares/multer');

router.get('/item', itemController.getItem);
router.get('/item/:id', itemController.getItembyId);
router.post(
  '/itemproduct',
  authentication,
  adminRole,
  upload.array('imageProduct', 3),
  itemController.addItem
);
router.put(
  '/item/:itemId',
  authentication,
  adminRole,
  upload.array('imageProduct', 3),
  itemController.updateItem
);
router.delete(
  '/item/:id',
  authentication,
  adminRole,
  itemController.deleteItem
);

module.exports = router;
