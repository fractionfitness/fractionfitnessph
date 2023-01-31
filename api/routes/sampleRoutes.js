const { sampleUser } = require('../models/User');

module.exports = (app) => {
  app.get('/api/sample-route', (req, res) => {
    res.send('<h1>Sample Resource/Page</h1>');
  });

  app.get('/api/user', (req, res) => {
    res.send({ email: sampleUser.email, password: sampleUser.password });
  });
};
