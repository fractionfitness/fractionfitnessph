const express = require('express');

const app = express();

require('./routes/sample')(app);
require('./routes/user')(app);

if (process.env.NODE_ENV === 'production') {
  console.log('NODE_ENV', process.env.NODE_ENV);
  const path = require('path'); // eslint-disable-line global-require

  // Express will serve up production assets (/client/build/static/ files), e.g. main.js, main.css, etc.
  // .static is middleware to determine location of the js and css file
  // express determines the location based on the script and style tags in the index.html
  // order of operations matters, as express will try to match location of static file first (index.html is outside static dir)
  app.use(express.static(path.resolve(__dirname, '../client', 'dist')));

  // Express will serve up index.html file if it doesn't recognize the route
  // catch-all case
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('<h1>Server running...</h1>');
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running...');
});
