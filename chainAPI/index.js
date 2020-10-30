const axios = require('axios');
const { baseUrl, body } = require('./config');

/**
 * @brief 返回一个axios对象
 * @param {string} method 请求方法名称
 * @param {array} args 请求方法的参数数组
 */
function axiosChainAPI(method, args = []) {
  body.method = method;
  body.args = args;
  return axios.post(baseUrl, body);
}

// axiosChain(
//   "issue",
//   ["xwj123","testuseraddress",10000])
// .then(response => console.log(response.data))

// axiosChain(
//   "getAccountBalance",
//   ['testuseraddress'])
// .then(response => console.log(response.data))

module.exports = {
  axiosChainAPI
}