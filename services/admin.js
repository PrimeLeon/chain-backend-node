const { querySql, queryOne } = require('../db/index');
const { axiosChain } = require('../chainAPI/index');
/**
 * @brief 根据用户名密码查找是否有匹配结果
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function login(username, password) {
  console.log(username, password)
  return queryOne(`
    SELECT *
    FROM admin 
    WHERE username='${username}' 
    AND password='${password}'
    AND isActivate=1`);
}

/**
 * @brief 根据用户名查找用户信息
 * @param {string} username 用户名
 */
function findAdminByUsername(username) {
  return queryOne(`
  SELECT *
  FROM admin 
  WHERE username='${username}'`);
}


module.exports = {
  login,
  findAdminByUsername
}