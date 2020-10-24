const mysql = require('mysql');
const config = require('./config');

function connect() {
    return mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        multipleStatements: true
    });
}

function querySql(sql) {
    const conn = connect();
    return new Promise((resolve, reject) => {
        try {
            conn.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
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

module.exports = {
    querySql
}


// const mysql = require('mysql');
// const config = require("./config");

// const pool = mysql.createPool(config);

// /**
//  * @brief 封装的获取连接、执行sql的函数
//  * @param {string} sql 待执行的sql语句
//  * @param {array[any]} sqlarr 可选的sql参数
//  * @param {function} callback 回调函数
//  * @example callback (err,result) => { ..do something }
//  */
// const querySql = (sql, sqlarr = []) => {
//     return new Promise((resolve, reject) => {
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 console.log(err);
//                 reject(err);
//             } else {
//                 connection.query(sql, sqlarr, (err, result) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(result);
//                     }
//                 });
//             }
//             connection.release();
//         });
//     })
// };

// module.exports = {
//     querySql
// }