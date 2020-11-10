/**
 * @brief 返回一个包含tr元素的dom数组
 * @param {array} userArr 包含user的数组 每个数组成员都是一个object
 */
function getUserTrs(userArr) {
  let trsArr = [];
  for (let i = 0; i < userArr.length; i++) {
    // * 遍历所有用户
    let { id, username, balance, isBlack, isActivate, role } = userArr[i];
    let user = {
      id,
      username,
      balance,
      isBlack,
      isActivate,
      role
    }
    // * tr节点
    // console.log(user)
    let trEle = document.createElement('tr');
    // * 遍历用户所有属性创建用户line
    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        let userAttr = user[key];
        /**
         * * 添加td节点
         */
        let tdEle = document.createElement('td');
        let textEle = document.createTextNode(`${userAttr}`);
        // * 添加文本节点
        tdEle.appendChild(textEle);
        // * 挂载到tr节点
        trEle.appendChild(tdEle);
      }
    }
    /**
     * * 构建按钮节点
     */
    let tdEle = document.createElement('td');
    let btnEle = document.createElement('button');
    btnEle.className = 'comfirm-register-btn btn btn-primary';
    btnEle.innerText = '同意';
    btnEle.setAttribute('username', username);

    btnEle.addEventListener('click', (e)=>{
      let username = e.target.getAttribute('username');
      $.ajax({
        type: "post",
        // url: "http://123.56.163.105:80/admin/user/all",
        url: "http://127.0.0.1:5000/admin/newAccount",
        contentType: "application/json;charset=utf-8", //这个参数也是header参数
        data: JSON.stringify({username:username}),
        dataType: "json",
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJpZCI6MiwidXNlcm5hbWUiOiJ4d2oxMjMiLCJwYXNzd29yZCI6ImVmMzBkMGNmNmNlMjkxZjZkZWZhOWYxZDMzMmY3MWFlIiwicHJpdmF0ZV9rZXkiOiJ4d2oxMjMiLCJpc0FjdGl2YXRlIjoxfSwiaWF0IjoxNjA0NTc5NTQ5LCJleHAiOjE2MDcxNzE1NDl9.j8S_6wNcqkb54dpgjAYO0I6r39ij4dErk8siAf0Lja0`);
        },
        success: function (response) {
          let target = e.target;
          if (response.code === 0) {
            target.parentNode.parentNode.childNodes[4].innerText = "1";
            alert(response.msg);
          } else {
            alert(response.msg);
          }
        },
        error: function (error) {
          console.log(error);
        }
      });
    })
    // * 挂载到tr节点
    tdEle.appendChild(btnEle);
    trEle.appendChild(tdEle);
    trsArr.push(trEle);
  }
  return trsArr;
}


function initUsers() {
  $.ajax({
    type: "get",
    url: "http://127.0.0.1:5000/admin/user/all",
    contentType: "application/json;charset=utf-8", //这个参数也是header参数
    data: "{}",
    dataType: "json",
    beforeSend: function (XMLHttpRequest) {
      // * 此处在请求发送前设置请求头
      XMLHttpRequest.setRequestHeader("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJpZCI6MiwidXNlcm5hbWUiOiJ4d2oxMjMiLCJwYXNzd29yZCI6ImVmMzBkMGNmNmNlMjkxZjZkZWZhOWYxZDMzMmY3MWFlIiwicHJpdmF0ZV9rZXkiOiJ4d2oxMjMiLCJpc0FjdGl2YXRlIjoxfSwiaWF0IjoxNjA0NTc5NTQ5LCJleHAiOjE2MDcxNzE1NDl9.j8S_6wNcqkb54dpgjAYO0I6r39ij4dErk8siAf0Lja0`);
    },
    success: function (data) {
      // * 获取tr节点数组
      let root = $('#table-users');
      let trsArr = getUserTrs(data.data.users);
      for (let i = 0; i < trsArr.length; i++) {
        // * 按顺序挂载
        const trEle = trsArr[i];
        root.append(trEle);
      }
    },
    error: function (error) {
      // * 请求发生错误
      console.log(error);
    }
  });
}

$(document).ready(() => {
  initUsers();
});