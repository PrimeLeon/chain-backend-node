const { querySql, queryOne, queryZero } = require('../db/index');
const { axiosChain } = require('../chainAPI/index');
const moment = require('moment');
/**
 * @brief 根据用户名密码查找是否有匹配结果
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function login(username, password) {
  return queryOne(`
    SELECT id,username,password,nickname,role,address,private_key,balance
    FROM user 
    WHERE username='${username}' 
    AND password='${password}'
    AND isActivate=1`);
}

function register(username, password) {
  const nickname = username;
  // TODO:
  const address = 'testuseraddress';
  const private_key = 'testuserprivatekey';
  const currentDate = new Date();
  const create_time = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  const delete_time = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  const change_time = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  return queryZero(`
    INSERT INTO user 
    (username,password,nickname,address,private_key,create_time,change_time,delete_time) 
    VALUES 
    ('${username}','${password}','${nickname}','${address}','${private_key}','${create_time}','${change_time}','${delete_time}')
  `);
}

/**
 * @brief 根据用户名查找用户信息
 * @param {string} username 用户名
 */
function findUserByUsername(username) {
  return queryOne(`
  SELECT id,username,password,nickname,role,address,private_key,balance
  FROM user 
  WHERE username='${username}'`);
}

/**
 * @brief 根据用户名查找用户信息
 * @param {string} username 用户名
 * @param {number} balance 余额
 */
function updateBalanceByUsername(username, balance) {
  return queryOne(`
  UPDATE user 
  SET balance=${balance}
  WHERE username='${username}'`);
}

module.exports = {
  login,
  register,
  findUserByUsername,
  updateBalanceByUsername
}