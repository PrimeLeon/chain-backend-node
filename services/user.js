const { querySql, queryOne } = require('../db/index');

/**
 * @brief 根据用户名密码查找是否有匹配结果
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function login(username, password) {
  return querySql(`SELECT * FROM user WHERE username='${username}' AND password='${password}'`);
}

/**
 * @brief 根据用户名查找用户信息
 * @param {string} username 用户名
 */
function findUserByUsername(username) {
  return queryOne(`SELECT * FROM user WHERE username='${username}'`);
}

module.exports = {
  login,
  findUserByUsername
}