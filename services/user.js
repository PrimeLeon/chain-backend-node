const { querySql, queryOne } = require('../db/index');

function login(username, password) {
  return querySql(`SELECT * FROM user WHERE username='${username}' AND password='${password}'`);
}

function findUserByUsername(username) {
  return queryOne(`SELECT * FROM user WHERE username='${username}'`);
}

module.exports = {
  login,
  findUserByUsername
}