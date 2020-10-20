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
/**
 * @brief 获取所有用户
 * @param {string} username 用户名
 */
function findUserOrderByRegisterTimeWithPage(page) {
  let itemsPerPage = 2;
  return querySql(`
  SELECT * 
  FROM user 
  ORDER BY create_time DESC 
  LIMIT ${(page-1) * itemsPerPage},${page * itemsPerPage}`);
}

/**
 * * 与上一个函数不同 查找指定用户部分信息注册上链
 * @brief 根据用户名查找用户信息
 * @param {string} username 用户名
 */
function findUserByUsernameForUserGoOnChain(username) {
  return queryOne(`
  SELECT address,id as ID,balance,password,private_key as privateKey
  FROM user 
  WHERE username='${username}'`);
} 


module.exports = {
  login,
  findAdminByUsername,
  findUserOrderByRegisterTimeWithPage,
  findUserByUsernameForUserGoOnChain
}