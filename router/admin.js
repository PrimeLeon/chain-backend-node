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
const { login, findAdminByUsername } = require('../services/admin');
const { md5, decodeJwt } = require('../utils/index');
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');
const { axiosChainAPI } = require('../chainAPI/index');

const router = express.Router();


router.get('/', (req, res, next) => {
  res.send('hello admin');
})

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

    login(username, password).then(admin => {
      if (!admin || admin.length === 0) {
        new Result('登录失败').fail(res);
      } else {
        /**
         * * 注册token
         */
        const token = jwt.sign({ admin },
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
  let adminInfoFromToken = decodeJwt(req);
  console.log(adminInfoFromToken);
  adminInfoFromToken = adminInfoFromToken.admin;
  if (adminInfoFromToken && adminInfoFromToken.username) {
    findAdminByUsername(adminInfoFromToken.username).then(admin => {
      if (admin) {
        new Result(admin, '管理员信息查询成功').success(res);
      } else {
        new Result(admin, '管理员信息查询失败').fail(res);
      }
    })
  } else {
    new Result('管理员信息查询失败').fail(res);
  }
})


module.exports = router