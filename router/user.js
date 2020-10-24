const express = require('express');
const Result = require('../models/Result');
const {
    querySql
} = require('../db/index');
const router = express.Router();

router.post('/login', (req, res, next) => {
    console.log(req.body);
    const {
        username,
        password
    } = req.body;

    querySql(`SELECT * FROM user WHERE `)
        .then(result => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        })

    if (username == 'admin' && password == 'adminpsd') {
        new Result('登录成功').success(res);
    } else {
        new Result('用户名或密码错误').fail(res);
    }
})

router.get('/info', (req, res, next) => {
    res.json('user info')
})

module.exports = router