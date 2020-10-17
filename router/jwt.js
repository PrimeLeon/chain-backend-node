const jwt = require('express-jwt');
const { PRIVATE_KEY } = require('../utils/constant');

/**
 * * jwt校验
 */
module.exports = jwt({
  secret: PRIVATE_KEY,
  /**
   * ! algorithms is necessary
   * * algorithms should be array
   */
  algorithms: ['HS256'],
  credentialsRequired: true
}).unless({
  /**
   * * jwt白名单
   */
  path: [
    '/user/login',
    '/admin/login',
    '/user/register',
    '/admin'
  ]
});