const mysql = require('mysql');
const config = require('./dev.config');
const { debug } = require('../utils/constant');

function connect() {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });
}

function querySql(sql) {
  const conn = connect();
  debug && console.log(sql);
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, results) => {
        if (err) {
          debug && console.log('查询失败, 原因:' + JSON.stringify(err));
          reject(err);
        } else {
          debug && console.log('查询成功', JSON.stringify(results));
          resolve(results);
        }
      });
    } catch (e) {
      reject(e)
    } finally {
      conn.end();
    }
  });
}

function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(results => {
      if (results && results.length === 1) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    }).catch(err => {
      reject(err);
    })
  })
}

function queryZero(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(results => {
      if (results) {
        resolve(results);
      } else {
        resolve(null);
      }
    }).catch(err => {
      reject(err);
    })
  })
}

async function transaction(sqlArr) {
  const conn = connect();
  await conn.beginTransaction()
  debug && console.log(sqlArr);
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < sqlArr.length; i++) {
        const sql = sqlArr[i];
        await conn.query(sql)
      }
      await conn.commit(() => {
        resolve('success');
      });
    } catch (err) {
      await conn.rollback();
      reject(err);
    } finally {
      conn.end();
    }
  })
}

module.exports = {
  querySql,
  queryOne,
  queryZero,
  transaction
}