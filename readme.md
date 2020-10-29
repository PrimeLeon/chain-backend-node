#### 环境

* Node 14.14.0 [Node download](http://nodejs.cn/download/)

```bash
# run in cmd
node -v # v14.14.0
npm -v # v6.14.8
```

* Mysql 8.0.22 [Mysql download](https://dev.mysql.com/downloads/installer/)

#### 开始

```bash
git clone git@github.com:PrimeLeon/chain-backend-node.git

cd chain-backend-node

npm install

node app.js # 默认启动在5000端口
```

#### 静态资源目录

```js
// 默认为项目根目录下的public文件夹
app.use(express.static(__dirname + '/public')); 
```

```js
// 访问示例
localhost:5000/index.html
```

#### JWT Token

请求需要Bearer Token，请求需要Token的接口时需要在HTTP头部包含以下信息

* **Authorization ：Bearer \<Token\>**

#### 接口

|   接口地址   | http://localhost:5000/user/login |
| :----------: | -------------------------------- |
| **请求方式** | HTTP / POST                      |
|   **简介**   | 用户登录                         |

* **请求示例**

  ```json
  //json格式
  {
      "username": "user",
      "password": "userpsd"
  }
  //urlencoded格式
  username = "user"
  password = "userpsd"
  ```

* **返回值示例**

  ```json
  {
      "code": 0,
      "msg": "登录成功",
      "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjAzOTUwMTc1LCJleHAiOjE2MDM5NTM3NzV9.Sz8evnAdErx0LStcvzHWgRMSXaRenj-HkiA17x5Kw1U"
      }
  }
  ```

  

|   接口地址   | http://localhost:5000/user/info |
| :----------: | ------------------------------- |
| **请求方式** | HTTP / POST                     |