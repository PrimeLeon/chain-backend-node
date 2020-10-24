const express = require('express');
const boom = require('boom');

const Result = require('../models/Result');
const userRouter = require('./user');
const jwtAuth = require('./jwt');
/**
 * * 注册路由
 */
const router = express.Router();

/**
 * * jwt验证
 */
router.use(jwtAuth);
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
  if (err.name && err.name === 'UnauthorizedError') {
    /**
     * * token错误
     */
    const { status = 401, message } = err;
    new Result(null, 'Token验证失败', {
      error: status,
      errMsg: message
    }).jwtError(res.status(status));
  } else {
    /**
     * * 常规错误
     */
    const msg = (err && err.message) || '系统错误';
    const statusCode = (err.output && err.output.statusCode) || 500;
    const errorMsg = (err.output &&
      err.output.payload &&
      err.output.payload.error) || err.message;
    new Result(null, msg, {
      error: statusCode,
      errorMsg
    }).fail(res.status(statusCode));

  }
})
module.exports = router;