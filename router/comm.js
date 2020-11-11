const express = require('express');
/**
 * * boom处理错误信息
 */
const boom = require('boom');

const Result = require('../models/Result');

const { axiosChainAPI } = require('../chainAPI/index');

const router = express.Router();

/**
 * * 查询BPR
 */
router.get('/getBPR', (req, res, next) => {
  axiosChainAPI(
      'getBPR',
      [],
      'query')
  .then(response => {
    let chainAPIResult = response.data;
    console.log(chainAPIResult)
    if (chainAPIResult.message == 'success') {
      if (chainAPIResult.data.result) {
        new Result({ bpr: chainAPIResult.data.result }, '获取积分利率成功').success(res);
      } else {
        new Result('获取积分利率失败').fail(res);
      }
    } else {
      new Result(chainAPIResult, '函数调用失败').chainError(res);
    }
  })
})

/**
 * * 查询BPR
 */
router.get('/getMF', (req, res, next) => {
  axiosChainAPI(
      'getMF',
      [],
      'query')
  .then(response => {
    let chainAPIResult = response.data;
    console.log(chainAPIResult)
    if (chainAPIResult.message == 'success') {
      if (chainAPIResult.data.result) {
        new Result({ mf: chainAPIResult.data.result }, '获取最大积分利息成功').success(res);
      } else {
        new Result('获取最大积分利息失败').fail(res);
      }
    } else {
      new Result(chainAPIResult, '函数调用失败').chainError(res);
    }
  })
})


module.exports = router