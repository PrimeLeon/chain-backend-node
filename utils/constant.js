module.exports = {
  CODE_ERROR: -1,
  CODE_SUCCESS: 0,
  CODE_TOKEN_ERROR: -2,
  CODE_CHAIN_ERROR: -3,
  debug: true,
  PWD_SALT: 'chainPro',
  PRIVATE_KEY: 'chainPro',
  JWT_EXPIRED: 60 * 60 * 24 * 30,
  STORE_CONSTANT: {
    serviceAddr: "https://cts-api.wutongchain.com",
    appid: "4fb18136-09fe-11eb-8a37-fa163ec0b2f0",
    secretkey: "4fd9521a-09fe-11eb-8a37-fa163ec0b2f0"
  },
  PORT: {
    port_prod: 80,
    port_dev: 5000
  },
  FEE_LOG_COUNT: 10,
  FEE_LOG_INTERVAL:  15 * 1000
}