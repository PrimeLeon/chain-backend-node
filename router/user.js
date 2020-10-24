const express = require('express');
const boom = require('boom');
const { body, validationResult } = require('express-validator');

const Result = require('../models/Result');
const { login } = require('../services/user');
const { md5 } = require('../utils/index');
const { PWD_SALT } = require('../utils/constant');

const router = express.Router();

router.post('/login', [
  body('username').isString().withMessage('用户名必须为字符'),
  body('password').isNumeric().withMessage('密码必须为字符')
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
        new Result('用户名或密码错误').fail(res);
      } else {
        new Result('登录成功').success(res);
      }
    })
  }
})

router.get('/info', (req, res, next) => {
  res.json('user info')
})

module.exports = router