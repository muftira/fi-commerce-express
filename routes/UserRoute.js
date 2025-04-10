const express = require('express');
const router = express.Router();
const { UserController } = require('../controler/UserControler');
const userController = new UserController();
const { authentication, adminRole } = require('../midlewares/authentication');
const upload = require('../midlewares/multer');

router.get('/user', authentication, adminRole, userController.getUser);
router.get('/user/:id', authentication, userController.getUserbyId);

// register user
router.post('/userregister', upload.single('imageProfile'), userController.addUser);

//login user
router.post('/userlogin', userController.loginUser);

router.put('/user/:id', authentication, upload.single('imageProfile'), userController.updateUser);
router.delete('/user/:id', authentication, adminRole, userController.deleteUser);
router.get('/useremail', userController.getUserEmail);
router.post('/forgotpassword', userController.forgotPassword);
router.post('/resetpassword', userController.resetPassword);

module.exports = router;
