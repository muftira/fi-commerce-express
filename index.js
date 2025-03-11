const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const port = process.env.PORT;

//connect to server
app.listen(port, () => console.log(`Server Connected on Port ${port}`));
