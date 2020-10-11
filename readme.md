### 环境

* Node 14.14.0 [Node download](http://nodejs.cn/download/)

```bash
# run in cmd
node -v # v14.14.0
npm -v # v6.14.8
```

* Mysql 8.0.22 [Mysql download](https://dev.mysql.com/downloads/installer/)

### 开始

```bash
git clone git@github.com:PrimeLeon/chain-backend-node.git

cd chain-backend-node

npm install

node app.js # 默认启动在5000端口
```

### 静态资源目录

```js
// 默认为项目根目录下的public文件夹
app.use(express.static(__dirname + '/public')); 
```

```js
// 访问示例
localhost:5000/index.html
```

### JWT Token

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

### 用户API

|   接口地址   | /user/login |
| :----------: | ----------- |
| **请求方式** | HTTP / POST |
|   **简介**   | 用户登录    |

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

|   接口地址   | /user/info   |
| :----------: | ------------ |
| **请求方式** | HTTP / GET   |
|   **简介**   | 获取用户信息 |

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
          "id": 3,
          "username": "testuser",
          "password": "b04a7ca45ee3f3afe375161a120f9eaa",
          "nickname": "testusernickname",
          "role": "user",
          "address": "testuseraddress",
          "private_key": "testuserprivatekey",
          "balance": 0,
          "roles": [
              "user"
          ]
      }
  }
  ```

|   接口地址   | /user/balance |
| :----------: | ------------- |
| **请求方式** | HTTP / GET    |
|   **简介**   | 获取用户余额  |

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
          "id": 3,
          "username": "testuser",
          "password": "b04a7ca45ee3f3afe375161a120f9eaa",
          "nickname": "testusernickname",
          "role": "user",
          "address": "testuseraddress",
          "private_key": "testuserprivatekey",
          "balance": "0"
      }
  }
  ```

### 管理员API

|   接口地址   | /admin/login |
| :----------: | ------------ |
| **请求方式** | HTTP / POST  |
|   **简介**   | 管理员登录   |

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

|   接口地址   | /admin/info    |
| :----------: | -------------- |
| **请求方式** | HTTP / GET     |
|   **简介**   | 获取管理员信息 |

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
          "id": 1,
          "username": "testadmin",
          "password": "c0ffd5a3d329dd183d52521e76a89c30",
          "private_key": "testadminprivatekey",
          "isActivate": 1
      }
  }
  ```