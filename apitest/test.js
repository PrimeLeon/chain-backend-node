const axios = require('axios');
const { TEST_USER } = require('./test/constant');

console.log(TEST_USER)

let json = {
  "category": "wvm",
  "name": 'bb0f78f8d0fa308f0c10dda8eab89bdf23b42b7554cb64af06e4837d735ffae2',
  "method": "newAccount",
  "args": ["xwj123", JSON.stringify(TEST_USER)],
  "version": "v1.0"
}

axios.post(
  'http://dev-env.wutongchain.com:59301/v2/tx/sc/query',
  json
).then(response => {
  console.log(response.data);
})