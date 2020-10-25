const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../utils/constant');
/**
 * @brief 解析头部的jsonwebtoken 获取用户信息
 * @param {objecj} req 请求对象
 */
function decodeJwt(req) {
  /**
   * * 获取token
   */
  let token = req.get('Authorization');
  console.log(token);
  if (token.indexOf('Bearer') === 0) {
    token = token.replace('Bearer ', '');
  }
  return jwt.verify(token, PRIVATE_KEY);
}

module.exports = {
  md5,
  decodeJwt
}