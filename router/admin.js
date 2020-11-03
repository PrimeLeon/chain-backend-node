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
  findUserByUsernameForUserGoOnChain,
  findUserByUsername,
  activateUser
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
    /**
     * ? 通过validator中间件解决?
     * * 处理非法页码 (小于等于0的页码)
     */
    let page = (req.params.page > 0) ? req.params.page : 1;
    console.log(page)
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
      [`${admin.private_key}`],
      'invoke')
  .then(response => {
    let chainAPIResult = response.data;
    if (chainAPIResult.message === 'success') {
      if (chainAPIResult.data.txId) {
        new Result('管理员初始化成功').success(res);
      } else {
        new Result('管理员初始化失败').fail(res);
      }
    } else {
      new Result('函数调用失败').chainError(res);
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
        [`${admin.private_key}`, bpr, mf],
        'invoke')
    .then(response => {
      let chainAPIResult = response.data;
      // console.log(chainAPIResult)
      if (chainAPIResult.message === 'success') {
        if (chainAPIResult.data.txId) {
          new Result('积分系统初始化成功').success(res);
        } else {
          new Result('积分系统初始化失败').fail(res);
        }
      } else {
        new Result('函数调用失败').chainError(res);
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
  findUserByUsernameForUserGoOnChain(username)
  .then(user => {
    if (user) {
      /**
       * * ['管理员私钥:string', '用户信息字符串:string']
       */
      axiosChainAPI(
          "newAccount",
          [`${admin.private_key}`, JSON.stringify(user)],
          'invoke')
      .then(async response => {
        let chainAPIResult = response.data;
        // console.log(chainAPIResult)
        if (chainAPIResult.message === 'success') {
          if (chainAPIResult.data.txId) {
            await activateUser(username);
            new Result('用户上链成功').success(res);
          } else {
            new Result('用户上链失败').fail(res);
          }
        } else {
          new Result('函数执行失败').chainError(res);
        }
      })
    } else {
      new Result('用户不存在或已经上链').fail(res);
    }
  })
})

/**
 * * 管理员查询积分余额
 */
router.get('/getOwnerBalance', (req, res, next) => {
  axiosChainAPI(
      'getOwnerBalance',
      [],
      'query')
  .then(response => {
    let chainAPIResult = response.data;
    console.log(chainAPIResult)
    if (chainAPIResult.message === 'success') {
      if (chainAPIResult.data.result) {
        let balanceData = { balance: chainAPIResult.data.result };
        new Result(balanceData, '积分系统余额查询成功').success(res);
      } else {
        new Result('积分系统余额查询失败').fail(res);
      }
    } else {
      new Result('函数执行失败').chainError(res);
    }
  })
})


/**
 * * 管理员给用户发行积分
 */
router.post('/issue', (req, res, next) => {
  let { username, balance } = req.body;
  let adminInfoFromToken = decodeJwt(req);
  admin = adminInfoFromToken.admin;
  findUserByUsername(username)
  .then(user => {
    if (user) {
      /**
       * * ['管理员私钥:string', '用户地址:string', '发行金额:number']
       */
      axiosChainAPI(
          'issue',
          [`${admin.private_key}`, `${user.address}`, balance],
          'invoke')
      .then(response => {
        // console.log(user.address,balance);
        let chainAPIResult = response.data;
        // console.log(chainAPIResult)
        if (chainAPIResult.message === 'success') {
          if (chainAPIResult.data.txId) {
            new Result('发行积分成功').success(res);
          } else {
            new Result('发行积分失败').fail(res);
          }
        } else {
          new Result('函数执行失败').chainError(res);
        }
      })
    } else {
      new Result('用户不存在').fail(res);
    }
  })
})

/**
 * * 从黑名单添加 / 移除用户
 */
router.post('/addBlackList', (req, res, next) => {
  let adminInfoFromToken = decodeJwt(req);
  admin = adminInfoFromToken.admin;
  let { username, isBlack } = req.body;

  findUserByUsername(username)
  .then(user => {
    if (user) {
      /**
       * * ['管理员私钥:string', '用户地址:string', '发行金额:number']
       */
      axiosChainAPI(
          'addBlackList',
          [`${admin.private_key}`, `${user.address}`, isBlack],
          'invoke')
      .then(response => {
        let chainAPIResult = response.data;
        console.log(chainAPIResult)
        if (chainAPIResult.message === 'success') {
          if (chainAPIResult.data.txId) {
            new Result('用户黑名单状态改变成功').success(res);
          } else {
            new Result('用户黑名单状态改变失败').fail(res);
          }
        } else {
          new Result('函数执行失败').chainError(res);
        }
      })
    } else {
      new Result('用户不存在').fail(res);
    }
  })
})

/**
 * * 获取利息总积分
 */
router.get('/getSumFee', (req, res, next) => {
  let adminInfoFromToken = decodeJwt(req);
  admin = adminInfoFromToken.admin;
  /**
   * * ['管理员私钥:string']
   */
  axiosChainAPI(
      'getSumFee',
      [`${admin.private_key}`],
      'query')
  .then(response => {
    let chainAPIResult = response.data;
    // console.log(chainAPIResult)
    if (chainAPIResult.message == 'success') {
      if (chainAPIResult.data.result) {
        new Result(chainAPIResult.data.result, '获取利息总积分成功').success(res);
      } else {
        new Result('获取利息总积分失败').fail(res);
      }
    } else {
      new Result('函数调用失败').chainError(res);
    }
  })
})

/**
 * * 暂停 / 启动积分系统
 */
router.post('/pausable', (req, res, next) => {
  let adminInfoFromToken = decodeJwt(req);
  admin = adminInfoFromToken.admin;

  let { pausable } = req.body;
  /**
   * * ['管理员私钥:string', '设置系统状态:bool']
   */
  axiosChainAPI(
      'pausable',
      [`${admin.private_key}`, pausable],
      'invoke')
  .then(response => {
    let chainAPIResult = response.data;
    console.log(chainAPIResult)
    if (chainAPIResult.message == 'success') {
      if (chainAPIResult.data.txId) {
        new Result('积分系统状态已改变').success(res);
      } else {
        new Result('积分系统状态改变失败').fail(res);
      }
    } else {
      new Result('函数调用失败').chainError(res);
    }
  })
})


/**
 * * 获取当前系统状态
 */
router.get('/getPausable', (req, res, next) => {
  let adminInfoFromToken = decodeJwt(req);
  admin = adminInfoFromToken.admin;
  /**
   * * []
   */
  axiosChainAPI(
      'getPausable',
      [],
      'query')
  .then(response => {
    let chainAPIResult = response.data;
    // console.log(chainAPIResult)
    if (chainAPIResult.message == 'success') {
      if (chainAPIResult.data.result) {
        new Result(chainAPIResult.data, '获取积分暂停状态成功').success(res);
      } else {
        new Result('获取积分暂停状态失败').fail(res);
      }
    } else {
      new Result('函数调用失败').chainError(res);
    }
  })
})

module.exports = router