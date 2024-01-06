const app = require('express')();
const routes = require('./routes'); // No need to specify 'index.js' explicitly
const dbconnetion = require('./config/dbconnetion')
require('dotenv').config();
const PORT = process.env.PORT || 3000;


dbconnetion();
//  Connect all our routes to our application
app.use('/', routes);

// Turn on that server!
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});