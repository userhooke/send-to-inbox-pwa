const app = require('./app');

app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → ${server.address().address}${server.address().port}`);
});
