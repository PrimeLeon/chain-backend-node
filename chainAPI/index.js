const axios = require('axios');
const { baseUrl, body } = require('./config');

/**
 * @brief 返回一个axios对象
 * @param {string} method 请求方法名称
 * @param {array} args 请求方法的参数数组
 * @param {string} type 请求接口
 * @example 'invoke' 'query'
 */
function axiosChainAPI(method, args = [], type) {
  let url = baseUrl + type;
  body.method = method;
  body.args = args;
  return axios.post(url, body);
}

module.exports = {
  axiosChainAPI
}