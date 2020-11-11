const { querySql, queryOne, queryZero, transaction } = require('../db/index');
const { axiosChain } = require('../chainAPI/index');
const { getRSAKey } = require('../utils/index');
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
    WHERE username = '${username}' 
    AND password = '${password}'
    AND isActivate=1`);
}

/**
 * @brief 注册
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} role 角色
 */
function register(username, password, role = 'user') {
  const nickname = username;
  const RSAKey = getRSAKey();
  const { address, private_key } = RSAKey;
  const currentDate = new Date();
  const create_time = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  const delete_time = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  const change_time = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  const telephone = 11111111111;
  return queryZero(`
    INSERT INTO user 
    (username,password,nickname,role,address,private_key,create_time,change_time,delete_time) 
    VALUES 
    ('${username}','${password}','${nickname}','${role}','${address}','${private_key}','${create_time}','${change_time}','${delete_time}')
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
  WHERE username = '${username}'
  AND isActivate = 1`);
}

/**
 * @brief 根据用户名查找用户信息
 * @param {string} username 用户名
 */
function findUserByUsernameUnRegistered(username) {
  return queryOne(`
  SELECT id,username,password,nickname,role,address,private_key,balance
  FROM user 
  WHERE username = '${username}'`);
}
/**
 * @brief 根据用户名更新余额
 * @param {string} username 用户名
 * @param {number} balance 余额
 */
function updateBalanceByUsername(username, balance) {
  return queryOne(`
  UPDATE user 
  SET balance = ${balance}
  WHERE username = '${username}'`);
}

/**
 * @brief 转账功能
 * @param {string} fromuser 转账人
 * @param {string} touser 收款人
 * @param {number} balance 转账金额
 */
function findAddressOfTransferUsers(fromuser, touser) {
  return querySql(`
    SELECT username,address
    FROM user
    WHERE username = '${fromuser}' OR username = '${touser}'
  `)
}

/**
 * @brief 转账功能
 * @param {string} fromuser 转账人
 * @param {string} touser 收款人
 * @param {number} balance 转账金额
 */
function transfer(fromuser, touser, balance) {
  const sqlArr = [
    `UPDATE user SET balance = balance - ${balance} WHERE username = '${fromuser}'`,
    `UPDATE user SET balance = balance + ${balance} WHERE username = '${touser}'`
  ]
  return transaction(sqlArr)
}

module.exports = {
  login,
  register,
  findUserByUsername,
  findUserByUsernameUnRegistered,
  updateBalanceByUsername,
  findAddressOfTransferUsers,
  transfer
}