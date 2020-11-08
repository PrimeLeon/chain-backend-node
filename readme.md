## 环境

* Node 14.14.0 [Node download](http://nodejs.cn/download/)

```bash
# run in cmd
node -v # v14.14.0
npm -v # v6.14.8
```

* Mysql 8.0.22 [Mysql download](https://dev.mysql.com/downloads/installer/)

## 开始

```bash
git clone git@github.com:PrimeLeon/chain-backend-node.git

cd chain-backend-node

npm install

node app.js # 默认启动在5000端口
```

## 静态资源目录

```js
// 默认为项目根目录下的public文件夹
app.use(express.static(__dirname + '/public')); 
```

```js
// 访问示例
localhost:5000/index.html
```

## JWT Token

请求需要Bearer Token，请求需要Token的接口时需要在HTTP头部包含以下信息

* **Authorization ：Bearer \<Token\>**
* **Token错误**

```json
// 未包含token
{
    "code": -2,
    "msg": "Token验证失败",
    "error": 401,
    "errMsg": "No authorization token was found"
}
// 包含了过期的token
{
    "code": -2,
    "msg": "Token验证失败",
    "error": 401,
    "errMsg": "jwt expired"
}
```

## <a id="API_LIST">API</a>

* 通用
  * [获取积分利率](#getBPR)
  * [获取最大积分利息](#getMF)
* 用户
  * [登录](#user_login)
    * [企业申请注册](#user_company_register)
    * [用户申请注册](#user_register)
  * [获取用户信息](#user_info)
  * [获取用户余额](#user_balance)
  * [用户转账](#user_transfer)
  * [获取用户是否在黑名单](#user_getAccountIsBlack)
  * **存证模块**
    * [根据高度查询区块信息](#user_getDetailByHeight)
    * [根据哈希查询区块信息](#user_getDetailByHash)
    * [查询高度](#user_getHeight)
    * [创建存证](#user_createStore)
    * [通过哈希获取存证](#user_getStore)
    * [查询存证](#user_queryStore)
* 管理员
  * [登录](#admin_login)
  * [获取管理员信息](#admin_info)
  * [管理员初始化](#admin_ownerInit)
  * **积分系统控制**
    * [积分系统初始化](#admin_integralInit)
    * [暂停 / 恢复 积分系统](#admin_pausable)
    * [积分系统余额查询](#admin_getOwnerBalacne)
    * [增加积分发行](#admin_addTotalSupply)
    * [减少积分发行](#admin_subTotalSupply)
    * [获取当前系统利息总积分](#admin_getSumFee)
    * [获取当前系统暂停状态](#admin_getPausable)
    * [设置积分利率](#admin_setBPR)
    * [设置积分利率上限](#admin_setMF)
  * **用户管理**
    * [按页码查询用户](#admin_user_getByPage)
    * [按用户名查询用户](#admin_user_getByUsername)
    * [获取所有用户](#admin_user_all)
    * [添加用户上链](#admin_newAccount)
    * **黑名单**
      * [从黑名单移除 / 添加用户](#admin_addBlackList)
      * [获取所有已经被拉黑的用户](#admin_user_blackList)
    * [给用户发行积分](#admin_issue)



## 通用
|     名称     | <a id="getBPR">获取积分利率</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------- |
| **接口地址** | /getBPR                                            |
| **请求方式** | HTTP / GET                                            |
|   **简介**   | 获取积分利率                                               |

* **请求示例**

  ```json
  // 不包含参数
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "获取积分利率成功",
      "data": {
          "bpr": "1000"
      }
  }
  ```



|     名称     | <a id="getMF">获取最大积分利息</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------- |
| **接口地址** | /getMF                                            |
| **请求方式** | HTTP / GET                                            |
|   **简介**   | 获取最大积分利息                                               |

* **请求示例**

  ```json
  // 不包含参数
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "获取最大积分利息成功",
      "data": {
          "mf": "10"
      }
  }
  ```


## 用户API

|     名称     | <a id="user_login">登录</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------- |
| **接口地址** | /user/login                                            |
| **请求方式** | HTTP / POST                                            |
|   **简介**   | 用户登录                                               |

* **请求示例**

  ```json
  //json格式
  {
      "username": "testuser",
      "password": "testuserpsd"
  }
  //urlencoded格式
  username : "testuser"
  password : "testuserpsd"
  ```

* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "登录成功",
      "data": {
          "token": "eyJhbGciOiJIUz......"
      }
  }
  // 失败
  {
      "code": -1,
      "msg": "登录失败"
  }
  
  
  
  ```
|     名称     | <a id="user_register">用户申请注册</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/register                                               |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 用户申请注册                                                 |

* **请求示例**

  ```json
  //json格式
  {
      "username": "testuser",
      "password": "testuserpsd"
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "申请注册成功"
  }
  // 失败
  {
      "code": -1,
      "msg": "用户名已存在"
  }
  ```
  
|     名称     | <a id="user_company_register">企业申请注册</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/company/register                                               |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 企业申请注册                                                 |

* **请求示例**

  ```json
  //json格式
  {
      "username": "testuser",
      "password": "testuserpsd"
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "申请注册成功"
  }
  // 失败
  {
      "code": -1,
      "msg": "用户名已存在"
  }
  ```
  

|     名称     | <a id="user_info">获取用户信息</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/info                                                   |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 获取用户信息                                                 |

* **请求示例**

  ```json
  // 仅在请求头部包含以下字段
  Authorization ： Bearer <Token>
  ```

* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "用户信息查询成功",
      "data": {
          "user": {
              "id": 63,
              "username": "testuser",
              "password": "b04a7ca45ee3f3afe375161a120f9eaa",
              "nickname": "testuser",
              "role": "user",
              "address": "...",
              "private_key": "...",
              "balance": 244,
              "roles": [
                  "user"
              ]
          }
      }
  }
  ```

|     名称     | <a id="user_balance">获取用户余额</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/balance                                                |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 获取用户余额                                                 |

* **请求示例**

  ```json
  // 仅在请求头部包含以下字段
  Authorization ： Bearer <Token>
  ```

* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "用户余额查询成功",
      "data": {
          "balance": "254"
      }
  }
  ```

|     名称     | <a id="user_transfer">用户转账</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/transfer                                                |
| **请求方式** | HTTP / POST                                                   |
|   **简介**   | 用户转账                                                 |

* **请求示例**

  ```json
  // 请求头部包含以下字段
  Authorization ： Bearer <Token>
  ```
  
* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "转账成功",
      "data": {
          "txId": "4101fa7ef059432c241097c71a36b35e1895fee1dfebd9955fcd04eec3ffa896"
      }
  }
  ```

|     名称     | <a id="user_getAccountIsBlack">获取用户黑名单状态</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/getAccountIsBlack                                                |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 获取用户黑名单状态                                                 |

* **请求示例**

  ```json
  // 请求头部包含以下字段
  Authorization ： Bearer <Token>
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "状态查询成功",
      "data": {
          "IsBlack": "false"
      }
  }
  ```


|     名称     | <a id="user_getDetailByHeight">查询区块信息（高度）</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/getDetailByHeight                                      |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 根据区块高度查询区块信息                                     |

* **请求示例**

  ```json
  // 请求头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "height": 2
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "获取指定高度区块信息成功",
      "data": {
          "height": 2,
          "details": {
              "header": {
                  "version": 1,
                  "height": 2,
                  "timestamp": 1601450330,
                  "blockHash": "pl+yAjHm9YRo4/rG9+qSOx+IzM2wImNlm8+/rLQ99xw=",
                  "previousHash": "Ep7j7pDgg2/Brnvjcv5vQ8+NFuN40GeK1UQK1gqwUJA=",
                  "worldStateRoot": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
                  "transactionRoot": "fArdOmAKt7jygo4dKrrnrkPuMxW4cwP1Goqfwzg/D30="
              },
              "txs": [
                  "veN+LAbEXz6P3GE2ldYtTbFRZE0KtKo4jylc+CuJudg="
              ],
              "extra": "...",
              "raw": "...."
          }
      }
  }
  ```


|     名称     | <a id="user_getDetailByHash">查询区块信息（哈希）</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/getDetailByHash                                        |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 根据区块哈希值查询区块信息                                   |

* **请求示例**

  ```json
  // 请求头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "hash": "pl+yAjHm9YRo4/rG9+qSOx+IzM2wImNlm8+/rLQ99xw="
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "获取指定高度区块信息成功",
      "data": {
          "height": 2,
          "details": {
              "header": {
                  "version": 1,
                  "height": 2,
                  "timestamp": 1601450330,
                  "blockHash": "pl+yAjHm9YRo4/rG9+qSOx+IzM2wImNlm8+/rLQ99xw=",
                  "previousHash": "Ep7j7pDgg2/Brnvjcv5vQ8+NFuN40GeK1UQK1gqwUJA=",
                  "worldStateRoot": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
                  "transactionRoot": "fArdOmAKt7jygo4dKrrnrkPuMxW4cwP1Goqfwzg/D30="
              },
              "txs": [
                  "veN+LAbEXz6P3GE2ldYtTbFRZE0KtKo4jylc+CuJudg="
              ],
              "extra": "...",
              "raw": "...."
          }
      }
  }
  ```



|     名称     | <a id="user_getHeight">查询高度</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/getHeight                                        |
| **请求方式** | HTTP / GET                                                  |
|   **简介**   | 查询高度                                   |

* **请求示例**

  ```json
  // 请求头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "businessId": "100",
      "data": {
          "name": "daniel",
          "money": "999"
      }
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "获取高度成功",
      "data": {
          "height": 266
      }
  }
  ```



|     名称     | <a id="user_createStore">创建存证</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/createStore                                        |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 创建存证                                   |

* **请求示例**

  ```json
  // 请求头部包含以下字段
  Authorization ： Bearer <Token>
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "创建存证成功",
      "data": {
          "result": {
              "Figure": "3Jv591vK8q/+OsYMhlti1/banb3jrwfXJK5WLgDIqRo=",
              "OK": true
          }
      }
  }
  
  ```
  
|     名称     | <a id="user_getStore">通过哈希获取存证</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/getStore                                        |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 通过哈希获取存证                                   |

* **请求示例**

  ```json
  // 请求头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "hash": "xCRCGgvMQLb+DHUlo7N9JFdKQxT5g6yhcbJJJW5rIKE="
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "获取存证成功",
      "data": {
          "data": "{\"name\":\"daniel\",\"money\":\"999\"}",
          "businessId": "100",
          "blockHeight": 211,
          "timestamp": 1603971710
      }
  }
  ```




|     名称     | <a id="user_queryStore">查询存证</a>   [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /user/queryStore                                             |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 查询存证                                                     |

* **请求示例**

  ```json
  // 请求头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "businessId": "100",
      "startTime": "",
      "endTime": "",
      "start" : 0
  }
  ```
  
* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "查询存证成功",
      "data": {
          "total": 18,
          "items": [
              {
                  "createdTime": "2020-11-04 20:54:27",
                  "txsHash": "3Jv591vK8q/+OsYMhlti1/banb3jrwfXJK5WLgDIqRo=",
                  "data": "{\"name\":\"daniel\",\"money\":\"999\"}",
                  "businessId": "100",
                  "blockHeight": 268
              },
              {
                  "createdTime": "2020-11-04 20:53:47",
                  "txsHash": "cetMfOAfpr+9No87ElmSigv3bi8bnXvuexC0vGEOdZQ=",
                  "data": "{\"name\":\"daniel\",\"money\":\"999\"}",
                  "businessId": "100",
                  "blockHeight": 267
              }
          ]
      }
  }
  ```




## 管理员API

|     名称     | <a id="admin_login">管理员登录 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/login                                                 |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 管理员登录                                                   |

* **请求示例**

  ```json
  //json格式
  {
      "username": "testadmin",
      "password": "testadminpsd"
  }
  //urlencoded格式
  username : "testadmin"
  password : "testadminpsd"
  ```

* **返回值示例**

  ```json
  //成功
  {
      "code": 0,
      "msg": "登录成功",
      "data": {
          "token": "eyJhbGciOiJIUz......"
      }
  }
  // 失败
  {
      "code": -1,
      "msg": "登录失败"
  }
  ```
  
  

|     名称     | <a id="admin_info">获取管理员信息 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/info                                                  |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 获取管理员信息                                               |

* **请求示例**

  ```json
  // 仅在请求头部包含以下字段
  Authorization ： Bearer <Token>
  ```

* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "管理员信息查询成功",
      "data": {
          "admin": {
              "id": 2,
              "username": "xwj123",
              "password": "ef30d0cf6ce291f6defa9f1d332f71ae",
              "private_key": "xwj123",
              "isActivate": 1
          }
      }
  }
  ```

|     名称     | <a id="admin_ownerInit">管理员初始化 </a>  [回到API目录](#API_LIST) |
| :----------: | ------------------------------------------------------------ |
| **接口地址** | /admin/ownerInit                                             |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 管理员初始化（初始化区块链管理员）                           |

* **请求示例**

  ```json
  // 仅在请求头部包含以下字段
  Authorization ： Bearer <Token>
  ```

* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "管理员初始化成功"
  }
  ```
  
  
|     名称     | <a id="admin_integralInit">积分系统初始化 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/integralInit                                          |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 积分系统初始化                                               |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // 请求参数如下
  // bpr 基准利率
  // mf 最大利息金额
  {
      "bpr": 1000,
      "mf": 10
  }
  ```

* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "管理员初始化成功"
  }
  ```
  
  
|     名称     | <a id="admin_getOwnerBalacne">积分系统余额查询 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/getOwnerBalacne                                       |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 积分系统余额查询                                             |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  ```

* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "积分系统余额查询成功",
      "data": {
          "balance": "25000000"
      }
  }
  ```
  
  

|     名称     | <a id="admin_user_getByPage">根据页码查询用户</a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/user/getByPage                                        |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 根据页码查询用户（默认一页10条记录，默认为创建时间倒序排序） |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "page": 1
  }
  ```
  
* **返回值示例**

  ```json
  // 此页有记录
  {
      "code": 0,
      "msg": "用户信息查询成功",
      "data": {
          "users": [
              {
                  "id": 67,
                  "username": "testuser4",
                  "password": "b04a7ca45ee3f3afe375161a120f9eaa",
                  "nickname": "testuser4",
                  "role": "user",
                  "address": "-----BEGIN RSA PUBLIC KEY-----\nMEgCQQClECP5J2AAE=\n-----END RSA PUBLIC KEY-----",
                  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIBOwIBAAJBAKUQI/knaOeIXWQiUrzn-----END RSA PRIVATE KEY-----",
                  "balance": 211,
                  "create_time": "2020-11-02T05:59:43.000Z",
                  "change_time": "2020-11-02T05:59:43.000Z",
                  "delete_time": "2020-11-02T05:59:43.000Z",
                  "isBlack": "false",
                  "isDelete": "false",
                  "isActivate": 1,
                  "paycode": null
              },{},{}
          ]
      }
  }
  // 此页没有记录
  {
      "code": 0,
      "msg": "用户信息查询成功",
      "data": []
  }
  ```
  
  
  
|     名称     | <a id="admin_user_all">查询所有用户</a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/user/all                                        |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 查询所有用户 |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  ```
  
* **返回值示例**

  ```json
  // 此页有记录
  {
      "code": 0,
      "msg": "用户信息查询成功",
      "data": {
          "users": [
              {
                  "id": 67,
                  "username": "testuser4",
                  "password": "b04a7ca45ee3f3afe375161a120f9eaa",
                  "nickname": "testuser4",
                  "role": "user",
                  "address": "-----BEGIN RSA PUBLIC KEY-----\nMEgCQQClECP5J2AAE=\n-----END RSA PUBLIC KEY-----",
                  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIBOwIBAAJBAKUQI/knaOeIXWQiUrzn-----END RSA PRIVATE KEY-----",
                  "balance": 211,
                  "create_time": "2020-11-02T05:59:43.000Z",
                  "change_time": "2020-11-02T05:59:43.000Z",
                  "delete_time": "2020-11-02T05:59:43.000Z",
                  "isBlack": "false",
                  "isDelete": "false",
                  "isActivate": 1,
                  "paycode": null
              },{},{}
          ]
      }
  }
  // 此页没有记录
  {
      "code": 0,
      "msg": "用户信息查询成功",
      "data": []
  }
  ```
  
  
  
|     名称     | <a id="admin_user_getByUsername">根据姓名查询用户信息</a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/user/getByUsername                                    |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 根据姓名查询用户信息                                         |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "username": "testuser"
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "用户信息查询成功",
      "data": {
          "users": [
              {
                  "id": 67,
                  "username": "testuser4",
                  "password": "b04a7ca45ee3f3afe375161a120f9eaa",
                  "nickname": "testuser4",
                  "role": "user",
                  "address": "-----BEGIN RSA PUBLIC KEY-----\nMEgCQQClECP5J2AAE=\n-----END RSA PUBLIC KEY-----",
                  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIBOwIBAAJBAKUQI/knaOeIXWQiUrzn-----END RSA PRIVATE KEY-----",
                  "balance": 211,
                  "create_time": "2020-11-02T05:59:43.000Z",
                  "change_time": "2020-11-02T05:59:43.000Z",
                  "delete_time": "2020-11-02T05:59:43.000Z",
                  "isBlack": "false",
                  "isDelete": "false",
                  "isActivate": 1,
                  "paycode": null
              },{},{}
          ]
      }
  }
  ```
  
  
  
  
|     名称     | <a id="admin_newAccount">添加用户上链 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/newAccount                                            |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 积分系统初始化                                               |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // 请求参数如下
  {
      "username": "testuser"
  }
  ```
  
* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "用户上链成功"
  }
  ```
  
  
|     名称     | <a id="admin_issue">给用户发行积分 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/issue                                                 |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 给用户发行积分                                               |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // 请求参数如下
  // username 用户名
  {
      "username": "testuser",
      "balance": 1
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "发行积分成功",
      "data": {
          "txId": "5ca97a40e9dd07b7404ca1932f508a20a84155a5dff128e2f8ad97f49d48521e"
      }
  }
  // 失败
  {
      "code": -1,
      "msg": "发行积分失败"
  }
  ```
  
  
|     名称     | <a id="admin_getSumFee">获取当前系统利息总积分 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/getSumFee                                                 |
| **请求方式** | HTTP / GET                                                  |
|   **简介**   | 给用户发行积分                                               |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "获取利息总积分成功",
      "data": {
          "fee": "0"
      }
  }
  ```
  
  
|     名称     | <a id="admin_getPausable">获取当前系统暂停状态 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/getPausable                                           |
| **请求方式** | HTTP / GET                                                   |
|   **简介**   | 获取当前系统暂停状态                                         |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "获取积分暂停状态成功",
      "data": {
          "pausable": "false"
      }
  }
  ```
  
  
|     名称     | <a id="admin_pausable">暂停 / 恢复积分系统 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/pausable                                              |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 暂停 / 恢复积分系统                                          |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "pausable" : false
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "积分系统状态已改变",
      "data": {
          "pausable": false
      }
  }
  ```
  
  

|     名称     | <a id="admin_addBlackList">从黑名单添加 / 移除用户 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/addBlackList                                           |
| **请求方式** | HTTP / POST                                                   |
|   **简介**   | 从黑名单添加 / 移除用户                                         |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "username": "testuser4",
      "isBlack": false
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "用户黑名单状态改变成功",
      "data": {
          "user": "testuser4",
          "isBlack": false
      }
  }
  ```
  
  
  
  
  |     名称     | <a id="admin_user_blackList">获取已经拉黑的所有用户 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/user/blackList                                           |
| **请求方式** | HTTP / get                                                   |
|   **简介**   | 从黑名单添加 / 移除用户                                         |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "拉黑用户信息查询成功",
      "data": {
          "users": [
              {
                  "id": 63,
                  "username": "testuser",
                  "password": "b04a7ca45ee3f3afe375161a120f9eaa",
                  "nickname": "testuser",
                  "role": "user",
                  "address": "-----BEGIN RSA PUBLIC KEY-----\n-----END RSA PUBLIC KEY-----",
                  "private_key": "-----BEGIN RSA PRIVATE KEY-----\n-----END RSA PRIVATE KEY-----",
                  "balance": 10451,
                  "create_time": "2020-11-02T05:59:17.000Z",
                  "change_time": "2020-11-02T05:59:17.000Z",
                  "delete_time": "2020-11-02T05:59:17.000Z",
                  "isBlack": "true",
                  "isDelete": "false",
                  "isActivate": 1,
                  "paycode": null
              }
          ]
      }
  }
  ```
  
  
  
|     名称     | <a id="admin_addTotalSupply">增加积分发行 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/addTotalSupply                                           |
| **请求方式** | HTTP / POST                                                   |
|   **简介**   | 增加积分发行                                         |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "balance": 100
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "积分发行成功"
  }
  ```
  
  
|     名称     | <a id="admin_subTotalSupply">减少积分发行 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/subTotalSupply                                           |
| **请求方式** | HTTP / POST                                                   |
|   **简介**   | 减少积分发行                                         |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "balance": 100
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "积分回收成功"
  }
  ```
  
  
|     名称     | <a id="admin_setBPR">设置积分利率 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/setBPR                                                |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 设置积分利率                                                 |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "bpr" : 800
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "设置积分利率成功",
      "data": {
          "bpr": 800
      }
  }
  ```
  
  
|     名称     | <a id="admin_setMF">设置积分利率上限 </a>  [回到API目录](#API_LIST) |
| :----------: | :----------------------------------------------------------- |
| **接口地址** | /admin/setMF                                                |
| **请求方式** | HTTP / POST                                                  |
|   **简介**   | 设置积分利率上限                                                 |

* **请求示例**

  ```json
  // 头部包含以下字段
  Authorization ： Bearer <Token>
  // body
  {
      "mf" : 8
  }
  ```
  
* **返回值示例**

  ```json
  // 成功
  {
      "code": 0,
      "msg": "设置积分利率上限成功",
      "data": {
          "mf": 8
      }
  }
  ```