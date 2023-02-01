module.exports = (app) => {
  app.get('/api/sample-route', (req, res) => {
    res.send('<h1>Sample Resource/Page</h1>');
  });
};
