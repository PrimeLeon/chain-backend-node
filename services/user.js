const { querySql } = require('../db/index');

function login(username, password) {
  return querySql(`SELECT * FROM user WHERE username='${username}' AND password='${password}'`);
}

module.exports = {
  login
}