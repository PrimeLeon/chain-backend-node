const { CODE_ERROR, CODE_SUCCESS, CODE_TOKEN_EXPIRED, CODE_TOKEN_ERROR, } = require('../utils/constant');

class Result {
  /**
   * @param {object} data 传回前端的数据
   * @param {string} msg 操作信息
   * @param {object} options 可选项
   */
  constructor(data, msg = '操作成功', options) {
    this.data = null;
    if (arguments.length === 0) {
      this.msg = '操作成功';
    } else if (arguments.length === 1) {
      this.msg = data;
    } else {
      this.msg = msg;
      this.data = data;
      if (options) {
        this.options = options;
      }
    }
  }
  createResult() {
    if (!this.code) {
      this.code = CODE_SUCCESS;
    }
    let base = {
      code: this.code,
      msg: this.msg
    };
    if (this.data) {
      base.data = this.data;
    }
    if (this.options) {
      /**
       * * 浅拷贝
       */
      base = {
        ...base,
        ...this.options
      };
    }
    console.log(base);
    return base;
  }
  json(res) {
    res.json(this.createResult());
  }
  success(res) {
    this.code = CODE_SUCCESS;
    this.json(res);
  }
  fail(res) {
    this.code = CODE_ERROR;
    this.json(res);
  }
  jwtError(res){
    this.code = CODE_TOKEN_ERROR;
    this.json(res);
  }
  chainError(res){
    this.code = CODE_CHAIN_ERROR;
    this.json(res);
  }
}

module.exports = Result;