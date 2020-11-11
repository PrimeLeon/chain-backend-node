const { axiosChainAPI } = require('../chainAPI/index');
const { feeLog } = require('../services/admin');
const { FEE_LOG_INTERVAL } = require('../utils/constant');

(function () {
  setInterval(() => {
    axiosChainAPI(
        'getSumFee',
        [`xwj123`],
        'query')
    .then(async response => {
      let chainAPIResult = response.data;
      if (chainAPIResult.message == 'success') {
        if (chainAPIResult.data.result) {
          let fee = chainAPIResult.data.result;
          await feeLog(fee);
        } else {
          console.log('获取利息总积分失败');
        }
      } else {
        console.log('函数调用失败', chainAPIResult);
      }
    })
  }, FEE_LOG_INTERVAL)
})()