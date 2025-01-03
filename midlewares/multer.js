const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const {
  CloudinaryStorage,
} = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tira-commerce',
    format: async (req, file) => {
      'png', 'jpg', 'jpeg';
    }, // supports promises as well
    public_id: (req, file) => {
      new Date() + '-' + file.originalname;
    },
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported File Format' }, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
