const express = require('express');
const boom = require('boom');
const userRouter = require('./user');

const { CODE_ERROR } = require('../utils/constant.js');

const router = express.Router();

/**
 * * 后台主页面
 */
router.get('/', (req, res) => {
  res.send('管理后台');
})

/**
 * * 引用userRouter
 */
router.use('/user', userRouter);

/**
 * * 使用中间件抛出接口不存在异常
 */
router.use((req, res, next) => {
  next(boom.notFound('接口不存在'));
})
/**
 * * 不能只抛出异常,要用异常处理中间件处理异常
 */
router.use((err, req, res, next) => {
  console.dir(err);
  const msg = (err && err.message) || '系统错误';
  const statusCode = (err.output && err.output.statusCode) || 500;
  const errorMsg = (err.output &&
    err.output.payload &&
    err.output.payload.error) || err.message;
  res.status(statusCode).json({
    code: CODE_ERROR,
    msg,
    error: statusCode,
    errorMsg
  })

})
module.exports = router;