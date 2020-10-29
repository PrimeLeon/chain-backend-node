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
const { login, findUserByUsername } = require('../services/user');
const { md5, decodeJwt } = require('../utils/index');
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');

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
  userInfoFromToken = userInfoFromToken.user;
  if (userInfoFromToken && userInfoFromToken.username) {
    findUserByUsername(userInfoFromToken.username).then(user => {
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
  res.send('{router/user.js line 84}Todo...');
  // let userInfoFromToken = decodeJwt(req);
  // userInfoFromToken = userInfoFromToken.user;
  // if (userInfoFromToken && userInfoFromToken.address) {

  // } else {
  //   new Result('余额查询失败').jwtError(res);
  // }
})

console.log(md5(`testuserpsd${PWD_SALT}`));

module.exports = router