const express = require('express');
const routes = express.Router();
const UserController = require('./controllers/UserController')

routes.get('/', (req, res) => {
  res.send('Hello From Express \n');
})

routes.post('/register', UserController.store)

module.exports = routes;