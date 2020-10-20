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
const { param, body, validationResult } = require('express-validator');

const Result = require('../models/Result');

/**
 * * service 层服务
 */
const {
  login,
  findAdminByUsername,
  findUserOrderByRegisterTimeWithPage,
  findUserByUsernameForUserGoOnChain
} = require('../services/admin');

const { md5, decodeJwt } = require('../utils/index');
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');
const { axiosChainAPI } = require('../chainAPI/index');

const router = express.Router();


router.get('/', (req, res, next) => {
  res.send('hello admin');
})

/**
 * * 管理员登录
 */
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

/**
 * * 获取管理员信息
 */
router.get('/info', (req, res, next) => {
  /**
   * * 解析token
   */
  let adminInfoFromToken = decodeJwt(req);
  admin = adminInfoFromToken.admin;

  if (admin && admin.username) {
    findAdminByUsername(admin.username).then(admin => {
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


/**
 * * 获取指定页数用户
 */
router.get('/user/:page', [
  param('page').isNumeric().withMessage('页码必须为数字')
], (req, res, next) => {
  /**
   * * 使用express-validator模块处理输入异常
   */
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { page } = req.params;
    findUserOrderByRegisterTimeWithPage(page).then(users => {
      if (users) {
        new Result(users, '用户信息查询成功').success(res);
      } else {
        new Result(users, '用户信息查询失败').fail(res);
      }
    })
  }
})

/**
 * * 管理员初始化
 */
router.post('/ownerInit', (req, res, next) => {
  let adminInfoFromToken = decodeJwt(req);
  admin = adminInfoFromToken.admin;
  /**
   * * ['管理员私钥:string']
   */
  axiosChainAPI(
      "ownerInit",
      [`${admin.private_key}`])
    .then(response => {
      let chainAPIResult = response.data;
      if (chainAPIResult.message === 'success') {
        if (chainAPIResult.data.result === 'success') {
          new Result('管理员初始化成功').success(res);
        } else {
          new Result('管理员初始化失败').fail(res);
        }
      } else {
        new Result('Chainblock环境错误').chainError(res);
      }
    })
})

/**
 * * 积分系统初始化
 */
router.post('/integralInit', [
  body('bpr').isNumeric().withMessage('bpr必须为数字'),
  body('mf').isNumeric().withMessage('mf必须为数字')
], (req, res, next) => {

  /**
   * * 使用express-validator模块处理输入异常
   */

  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let adminInfoFromToken = decodeJwt(req);
    admin = adminInfoFromToken.admin;
    let { bpr, mf } = req.body;

    /**
     * * ['管理员私钥:string', 'bpr基准利率:number', 'mf最大利息金额:number']
     */
    axiosChainAPI(
        "integralInit",
        [`${admin.private_key}`, bpr, mf])
      .then(response => {
        let chainAPIResult = response.data;
        // console.log(chainAPIResult)
        if (chainAPIResult.message === 'success') {
          if (chainAPIResult.data.result === 'success') {
            new Result('积分系统初始化成功').success(res);
          } else {
            new Result('积分系统初始化失败').fail(res);
          }
        } else {
          new Result('Chainblock环境错误').chainError(res);
        }
      })
  }
})

/**
 * * 新建普通用户
 */
router.post('/newAccount', [
  body('username').isString().withMessage('用户名必须为字符')
], (req, res, next) => {
  let { username } = req.body;
  let adminInfoFromToken = decodeJwt(req);
  admin = adminInfoFromToken.admin;
  /**
   * * ['管理员私钥:string', '用户信息字符串:string']
   */
  findUserByUsernameForUserGoOnChain(username)
    .then(user => {
      console.log(user);
      if (user) {
        axiosChainAPI(
            "newAccount",
            [`${admin.private_key}`, JSON.stringify(user)])
          .then(response => {
            let chainAPIResult = response.data;
            // console.log(chainAPIResult)
            if (chainAPIResult.message === 'success') {
              if (chainAPIResult.data.result === 'success') {
                new Result('用户添加上链').success(res);
              } else {
                new Result('用户添加上链失败').fail(res);
              }
            } else {
              new Result('Chainblock环境错误').chainError(res);
            }
          })
      } else {
        new Result('用户不存在').fail(res);
      }
    })
})

module.exports = router