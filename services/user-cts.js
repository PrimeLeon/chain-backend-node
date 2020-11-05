const axios = require('axios');
const URLencode = require('urlencode');
const CryptoJS = require("crypto-js");

const base64 = require('crypto-js/enc-base64');

// 请求服务器地址
const { serviceAddr, appid, secretkey } = require('../utils/constant').STORE_CONSTANT;

const timestamp = new Date().getTime()


/**
 * @brief 根据区块高度获取详细信息
 * @param {number} blockHeight 区块高度
 * @returns {axios} 返回axios对象
 */
function getDetailByHeight(blockHeight) { //blockHeight：区块的高度值，即第几个区块
  tokenStr = String(blockHeight) + String(timestamp);
  // console.log("tokenStr:" + tokenStr)
  token = base64.stringify(CryptoJS.HmacSHA1(tokenStr, secretkey))
  // console.log("token:" + token)
  // console.log("URLtoken:" + URLencode(token))
  return axios({
    headers: { 'Content-type': "application/json", 'charset': 'UTF-8', 'timestamp': timestamp },
    url: serviceAddr + "/block/getDetailByHeight",
    method: "get",
    params: { 'height': blockHeight, 'appid': URLencode(appid), 'token': token }
  })
  // .then((data) => {
  //   //TODO:处理返回数据
  //   console.log(data)
  //   console.log("--------------------------------------------------------")
  // })
}

/**
 * @brief 根据区块的哈希值获取区块详情
 * @param {string} hash 区块的哈希值
 * @returns {axios} 返回axios对象
 */
function getDetailByHash(hash) { //hash：区块的哈希值
  tokenStr = String(hash) + String(timestamp);
  // console.log("tokenStr:" + tokenStr)
  token = base64.stringify(CryptoJS.HmacSHA1(tokenStr, secretkey))
  // console.log("token:" + token)
  // console.log("URLtoken:" + URLencode(token))
  return axios({
    headers: { 'Content-type': "application/json", 'charset': 'UTF-8', 'timestamp': timestamp },
    url: serviceAddr + "/block/getDetailByHash",
    method: "get",
    params: { 'hash': hash, 'appid': URLencode(appid), 'token': token }
  })
  // .then((data) => {
  //   //TODO:处理返回数据
  //   console.log(data.data.data)
  //   console.log("--------------------------------------------------------")
  // })
}

/**
 * @brief 获取区块高度
 * @returns {axios} 返回axios对象
 */
function getHeight() {
  tokenStr = String(timestamp);
  // console.log("tokenStr:" + tokenStr)
  token = base64.stringify(CryptoJS.HmacSHA1(tokenStr, secretkey))
  // console.log("token:" + token)
  // console.log("URLtoken:" + URLencode(token))
  return axios({
    headers: { 'Content-type': "application/json", 'charset': 'UTF-8', 'timestamp': timestamp },
    url: serviceAddr + "/chain/getHeight",
    method: "get",
    params: { 'appid': URLencode(appid), 'token': token }
  })
  // .then((data) => {
  //   //TODO:处理返回数据
  //   console.log(data.data)
  //   console.log("--------------------------------------------------------")
  // })
}

/**
 * @brief 创建存证
 * @param {number} businessId 存证业务id
 * @param {object} data 需要存的信息
 * @returns {axios} 返回axios对象
 */
function createStore(businessId, data) { //bussinessId：存证业务id，data：要存的信息，是对象格式{...}
  // 讲data转换为json
  data = JSON.stringify(data)
  tokenStr = String(businessId) + String(data) + String(timestamp);
  // console.log("tokenStr:" + tokenStr)
  token = base64.stringify(CryptoJS.HmacSHA1(tokenStr, secretkey))
  // console.log("token:" + token)
  // console.log("URLtoken:" + URLencode(token))
  return axios({
    headers: { 'Content-type': "application/json", 'charset': 'UTF-8', 'timestamp': timestamp },
    url: serviceAddr + "/store/create",
    method: "post",
    data: JSON.stringify({ 'businessId': businessId, 'data': data, 'appid': URLencode(appid), 'token': token })
  })
  // .then((data) => {
  //   //TODO:处理返回数据
  //   console.log(data.data)
  //   console.log("--------------------------------------------------------")
  // })
}

/**
 * @brief 根据哈希值获取存证信息
 * @param {string} hash 存证的哈希值
 * @returns {axios} 返回axios对象
 */
function getStore(hash) { //hash：存证哈希值
  tokenStr = String(hash) + String(timestamp);
  // console.log("tokenStr:" + tokenStr)
  token = base64.stringify(CryptoJS.HmacSHA1(tokenStr, secretkey))
  // console.log("token:" + token)
  // console.log("URLtoken:" + URLencode(token))
  return axios({
    headers: { 'Content-type': "application/json", 'charset': 'UTF-8', 'timestamp': timestamp },
    url: serviceAddr + "/store/get",
    method: "get",
    params: { 'hash': hash, 'appid': URLencode(appid), 'token': token }
  })
  // .then((data) => {
  //   //TODO:处理返回数据
  //   console.log(data.data)
  //   console.log("--------------------------------------------------------")
  // })
}

/**
 * @brief 查询存证
 * @param {number}} businessId 存证业务id
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {number} start 从第几条开始查询
 * @returns {axios} 返回axios对象
 */
function queryStore(businessId, startTime, endTime, start) { //start：从第几条数据开始查询，默认传0，startTime和endTime传空值
  tokenStr = String(businessId) + String(startTime) + String(endTime) + String(start) + String(timestamp);
  // console.log("tokenStr:" + tokenStr)
  token = base64.stringify(CryptoJS.HmacSHA1(tokenStr, secretkey))
  // console.log("token:" + token)
  // console.log("URLtoken:" + URLencode(token))
  return axios({
    headers: { 'Content-type': "application/json", 'charset': 'UTF-8', 'timestamp': timestamp },
    url: serviceAddr + "/store/query",
    method: "get",
    params: { 'businessId': businessId, 'startTime': startTime, 'endTime': endTime, 'start': start, 'appid': URLencode(appid), 'token': token }
  })
  // .then((data) => {
  //   //TODO:处理返回数据
  //   console.log(data.data.data)
  //   console.log("--------------------------------------------------------")
  // })
}

// 测试获取第2个区块的信息
// getDetailByHeight(2)

// // 测试通过区块哈希值获取区块的信息
// getDetailByHash("pl+yAjHm9YRo4/rG9+qSOx+IzM2wImNlm8+/rLQ99xw=")

// // 获取区块的高度
// getHeight()

// // 测试创建存证，传入ID和data信息
// createStore("100", { "name": "daniel", "money": "999" })

// // 测试通过存证的哈希值获取存证信息
// getStore("xCRCGgvMQLb+DHUlo7N9JFdKQxT5g6yhcbJJJW5rIKE=")

// 测试通过ID查询存证，返回多个
// queryStore("100", "", "", "0")


module.exports = {
  getDetailByHeight,
  getDetailByHash,
  getHeight,
  createStore,
  getStore,
  queryStore
}