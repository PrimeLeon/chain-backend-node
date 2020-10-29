const { querySql, queryOne } = require('../db/index');
const { axiosChain } = require('../chainAPI/index');
/**
 * @brief 根据用户名密码查找是否有匹配结果
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function login(username, password) {
  return queryOne(`
    SELECT id,username,password,nickname,role,address,private_key,balance,isBlack,isDelete
    FROM user 
    WHERE username='${username}' 
    AND password='${password}'`);
}

/**
 * @brief 根据用户名查找用户信息
 * @param {string} username 用户名
 */
function findUserByUsername(username) {
  return queryOne(`
  SELECT id,username,password,nickname,role,address,private_key,balance,isBlack,isDelete
  FROM user 
  WHERE username='${username}'`);
}

// function getUserBlanceByAddress(address) {
//   let method = 'getAccountBalance';
//   return axiosChain(method, [address]);
// }

module.exports = {
  login,
  findUserByUsername
}