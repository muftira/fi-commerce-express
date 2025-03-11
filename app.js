const express = require('express');
const app = express();
const cors = require('cors');
const UserRoute = require('./routes/UserRoute');
const ItemRoute = require('./routes/ItemRoute');
const CartRoute = require('./routes/CartRoute');
const OrderRoute = require('./routes/OrderRoute');

//get data in JSON format
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

//import routes
app.use('/v1', UserRoute);
app.use('/v1', ItemRoute);
app.use('/v1', CartRoute);
app.use('/v1', OrderRoute);

// error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.error || 'Internal server error';
  const message = err.message;

  return res.status(status).json({
    status: false,
    message: message,
    data: {},
    error: error,
  });
});

module.exports = app;
