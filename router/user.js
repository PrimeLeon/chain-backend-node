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
const { login } = require('../services/user');
const { md5 } = require('../utils/index');
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
    let { username, password } = req.body;
    password = md5(`${password}${PWD_SALT}`);
    login(username, password).then(user => {
      if (!user || user.length === 0) {
        new Result('登录失败').fail(res);
      } else {
        /**
         * * 注册token
         */
        const token = jwt.sign(
          { username },
          PRIVATE_KEY, 
          { expiresIn: JWT_EXPIRED });
        new Result({ token }, '登录成功').success(res);
      }
    })
  }
})

router.get('/info', (req, res, next) => {
  res.json('user info')
})

module.exports = router