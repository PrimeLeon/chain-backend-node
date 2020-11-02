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
const {
  login,
  register,
  findUserByUsername,
  updateBalanceByUsername,
  findAddressOfTransferUsers,
  transfer
} = require('../services/user');
const { md5, decodeJwt } = require('../utils/index');
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');
const { axiosChainAPI } = require('../chainAPI/index');
const user = require('../services/user');

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

router.post('/register', [
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
    findUserByUsername(username).then(user => {
      if (!user || user.length === 0) {
        register(username, password).then(result => {
          if (result.affectedRows === 1) {
            new Result('申请注册成功').success(res);
          } else {
            new Result('申请注册失败').fail(res);
          }
        })
      } else {
        new Result('用户名已存在').fail(res);
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
        axiosChainAPI(
            'getAccountBalance',
            [user.address],
            'query')
        .then(async response => {
          let chainAPIResult = response.data;
          console.log(chainAPIResult);
          if (chainAPIResult.message == 'success') {
            await updateBalanceByUsername(user.username, chainAPIResult.data.result);
            user.roles = [user.role]
            new Result(user, '用户信息查询成功').success(res);
          } else {
            new Result('函数调用失败').chainError(res);
          }
        })
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
        [user.address],
        'query')
    .then(async response => {
      let chainAPIResult = response.data;
      console.log(chainAPIResult)
      if (chainAPIResult.message == 'success') {
        /**
         * * 更新余额
         */
        user.balance = chainAPIResult.data.result;
        await updateBalanceByUsername(user.username, user.balance);
        new Result(user, "用户余额查询成功").success(res);
      } else {
        new Result('函数调用错误').chainError(res);
      }
    })
  } else {
    new Result('余额查询失败').jwtError(res);
  }
})


/**
 * ! 废弃方案
 */
// router.post('/transfer', [
//   body('touser').isString().withMessage('密码必须为字符'),
//   body('balance').isNumeric().withMessage('密码必须为字符')
// ], (req, res, next) => {
//   let userInfoFromToken = decodeJwt(req);
//   let fromuser = userInfoFromToken.user;
//   let { touser, balance } = req.body;

//   if (balance >= 0) {
//     findUserByUsername(fromuser.username)
//     .then(fromuser => {
//       if (fromuser.balance > balance) {
//         findUserByUsername(touser)
//         .then((touser) => {
//           if (touser) {
//             transfer(fromuser.username, touser.username, balance)
//             .then(result => {
//               if (result === 'success') {
//                 axiosChainAPI(
//                   'transfer',

//                 )
//                 new Result('转账成功').success(res);
//               } else {
//                 new Result('转账失败').fail(res);
//               }
//             })
//           } else {
//             new Result('收款人不存在').fail(res);
//           }
//         })
//       } else {
//         new Result('用户余额不足').fail(res);
//       }
//     })
//   } else {
//     new Result('非法数字')
//   }
// })

router.post('/transfer', [
  body('touser').isString().withMessage('密码必须为字符'),
  body('balance').isNumeric().withMessage('密码必须为字符')
], async (req, res, next) => {
  let userInfoFromToken = decodeJwt(req);
  let fromuser = userInfoFromToken.user;
  let { touser, balance } = req.body;
  let fromAddress, toAddress;
  await findAddressOfTransferUsers(fromuser.username, touser)
  .then(users => {
    /**
     * * 判断转入转出地址
     */
    if (users.length == 2) {
      if (fromuser.username === users[0].username) {
        fromAddress = users[0].address;
        toAddress = users[1].address;
        console.log('from' + user[0]);
        console.log('to' + user[1]);
      } else {
        fromAddress = users[1].address;
        toAddress = users[0].address;
        console.log('from' + user[1]);
        console.log('to' + user[2]);
      }
    }
  })
  /**
   * * 先调用query尝试是否可以转账
   * * 再调用invoke进行转账
   */
  axiosChainAPI(
      'transfer',
      [`${fromAddress}`, `${toAddress}`, balance],
      'query')
  .then(response => {
    let chainAPIResult = response.data;
    console.log(chainAPIResult);
    if (chainAPIResult.message === 'success') {
      if (chainAPIResult.data.result === 'success') {
        axiosChainAPI(
            'transfer',
            [`${fromAddress}`, `${toAddress}`, balance],
            'invoke')
        .then(async response => {
          let chainAPIResult = response.data;
          console.log(chainAPIResult);
          if (chainAPIResult.message === 'success') {
            if (chainAPIResult.data.txId) {
              /**
               * * 转账后同步数据库信息
               */
              await transfer(fromuser.username, touser, balance);
              new Result('转账成功').success(res);
            } else {
              new Result('转账失败').fail(res);
            }
          } else {
            new Result('函数调用失败').fail(res);
          }
        })
      } else {
        new Result('转账失败').fail(res);
      }
    } else {
      new Result('函数调用失败').fail(res);
    }
  })
})

module.exports = router

// console.log(md5(`xwj123psd${PWD_SALT}`));