const app = require('./app');

// import environmental variables from .env file
require('dotenv').config({ path: '../../.env' });

app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
