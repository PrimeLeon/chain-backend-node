const { querySql, queryOne, queryZero } = require('../db/index');
const moment = require('moment');

const { FEE_LOG_COUNT } = require('../utils/constant')

/**
 * @brief 根据用户名密码查找是否有匹配结果
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function login(username, password) {
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
 * @brief 根据页码获取用户
 * @param {string} username 用户名
 */
function findUserOrderByRegisterTimeWithPage(page) {
  const ITEMS_PER_PAGE = 10;
  return querySql(`
  SELECT * 
  FROM user 
  ORDER BY create_time DESC 
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${(page-1) * ITEMS_PER_PAGE}`);
}

/**
 * * 与上一个函数不同 查找指定用户部分信息注册上链
 * @brief 根据用户名查找用户信息
 * @param {string} username 用户名
 */
function findUserByUsernameForUserGoOnChain(username) {
  return queryOne(`
  SELECT username as name,address,id as ID,role,password as passWord,create_time,isBlack as isBlacked,isDelete as isDeleted
  FROM user 
  WHERE username='${username}'
  AND isActivate=0`);
}

function activateUser(username) {
  return queryOne(`
  UPDATE user
  SET isActivate=1
  WHERE username='${username}'`)
}

function blackUser(username, isBlack) {
  return queryZero(`
    UPDATE user
    SET isBlack='${isBlack}'
    WHERE username='${username}'
  `)
}

function findAllBlackUser() {
  return queryZero(`
    SELECT *
    FROM user
    WHERE isBlack='true'
  `)
}

function findAllUser() {
  return querySql(`
  SELECT *
  FROM user`)
}

function updateBalance(username, balance) {
  return queryZero(`
    UPDATE user
    SET balance=${balance}
    WHERE username='${username}'
  `)
}

function feeLog(fee) {
  const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  return queryZero(`
    INSERT INTO fee_log
    (date,fee)
    VALUES
    ('${date}',${fee})
  `)
}

function getFeeLog() {
  return queryZero(`
    SELECT date,fee
    FROM fee_log
    WHERE fee in
    (SELECT fee FROM fee_log GROUP BY fee HAVING COUNT(fee)=1)
    ORDER BY date DESC
    LIMIT 0,${FEE_LOG_COUNT}
  `)
}

module.exports = {
  login,
  findAllUser,
  findAdminByUsername,
  findUserOrderByRegisterTimeWithPage,
  findUserByUsername,
  findUserByUsernameForUserGoOnChain,
  findAllBlackUser,
  updateBalance,
  activateUser,
  blackUser,
  feeLog,
  getFeeLog
}