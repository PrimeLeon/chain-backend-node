const express = require('express');
/**
 * * boom处理错误信息
 */
const boom = require('boom');
/**
 * * token校验
 */
const jwt = require('jsonwebtoken');
/**
 * * 处理输入异常
 */
const { body, validationResult } = require('express-validator');

const Result = require('../models/Result');
const { login, findUserByUsername, updateBalanceByUsername } = require('../services/user');
const { md5, decodeJwt } = require('../utils/index');
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');
const { axiosChainAPI } = require('../chainAPI/index');

const router = express.Router();

router.post('/login', [
  body('username').isString().withMessage('用户名必须为字符'),
  body('password').isString().withMessage('密码必须为字符')
], (req, res, next) => {
  /**
   * * 使用express-validator模块处理输入异常
   */
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    /**
     * * 查询用户是否存在
     */
    let { username, password } = req.body;
    password = md5(`${password}${PWD_SALT}`);
    login(username, password).then(user => {
      if (!user || user.length === 0) {
        new Result('登录失败').fail(res);
      } else {
        /**
         * * 注册token
         */
        const token = jwt.sign({ user },
          PRIVATE_KEY, { expiresIn: JWT_EXPIRED });
        new Result({ token }, '登录成功').success(res);
      }
    })
  }
})

router.get('/info', (req, res, next) => {
  /**
   * * 解析token
   */
  let userInfoFromToken = decodeJwt(req);
  let user = userInfoFromToken.user;
  if (user && user.username) {
    findUserByUsername(user.username).then(user => {
      if (user) {
        /**
         * * 此处为RowDataPacket : [Array:object] 长度为1
         */
        user.roles = [user.role]
        new Result(user, '用户信息查询成功').success(res);
      } else {
        new Result(user, '用户信息查询失败').fail(res);
      }
    })
  } else {
    new Result('用户信息查询失败').fail(res);
  }
})

router.get('/balance', (req, res, next) => {
  /**
   * * 解析token
   */
  let userInfoFromToken = decodeJwt(req);
  let user = userInfoFromToken.user;
  if (user && user.address) {
    axiosChainAPI(
        'getAccountBalance',
        [user.address])
      .then(async response => {
        // console.log(response)
        let chainAPIResult = response.data;
        if (chainAPIResult.message == 'success') {
          /**
           * * 更新余额
           */
          user.balance = chainAPIResult.data.result;
          await updateBalanceByUsername(user.username, user.balance);
          new Result(user, "用户余额查询成功").success(res);
        } else {
          new Result('余额查询失败').fail(res);
        }
      })
  } else {
    new Result('余额查询失败').jwtError(res);
  }
})

router.post('/transfer', (req, res, next) => {
  /**
   * * 解析token
   */
  let userInfoFromToken = decodeJwt(req);
  let user = userInfoFromToken.user;
  if (user && user.address) {
    res.send(user);
  } else {
    new Result('余额查询失败').jwtError(res);
  }
})

module.exports = router

// console.log(md5(`testadminpsd${PWD_SALT}`));