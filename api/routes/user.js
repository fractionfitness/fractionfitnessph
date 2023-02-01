const { getUsers, getUserById } = require('../controllers/user');

module.exports = (app) => {
  app.get('/api/users', getUsers);
  app.get('/api/user/:id', getUserById);
};
