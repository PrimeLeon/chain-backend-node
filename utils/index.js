const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../utils/constant');
const NodeRSA = require("node-rsa");
/**
 * @brief 解析头部的jsonwebtoken 获取用户信息
 * @param {objecj} req 请求对象
 */
function decodeJwt(req) {
  /**
   * * 获取token
   */
  let token = req.get('Authorization');
  if (token) {
    if (token.indexOf('Bearer') === 0) {
      token = token.replace('Bearer ', '');
    }
    return jwt.verify(token, PRIVATE_KEY);
  } else {
    return null;
  }
}


function getRSAKey() {
  const key = new NodeRSA({ b: 512 });
  /**
   * * public Key 即用户区块链的地址
   */
  const publicDer = key.exportKey("pkcs1-public-pem");
  const privateDer = key.exportKey("pkcs1-private-pem");
  
  console.log("公钥:", publicDer);
  console.log("私钥:", privateDer);
  return {
    address: publicDer,
    private_key: privateDer
  }
}

module.exports = {
  md5,
  decodeJwt,
  getRSAKey
}