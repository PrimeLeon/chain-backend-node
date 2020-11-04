function getUserTableline(userArr) {
  // console.log(userArr)
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
    for (const key in user) {
      // * 遍历用户所有属性
      if (user.hasOwnProperty(key)) {
        const userAttr = user[key];
        let tdEle = document.createElement('td');
        let textEle = document.createTextNode(`${userAttr}`);
        // * 添加文本节点
        tdEle.appendChild(textEle);
        // * 挂载到tr节点
        trEle.appendChild(tdEle);
      }
    }
    trsArr.push(trEle);
  }
  return trsArr;
}


function initUsers() {
  $.ajax({
    type: "get",
    url: "http://127.0.0.1:5000/admin/user/1",
    contentType: "application/json;charset=utf-8", //这个参数也是header参数
    data: "{}",
    dataType: "json",
    beforeSend: function (XMLHttpRequest) {
      // * 此处在请求发送前设置请求头
      XMLHttpRequest.setRequestHeader("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJpZCI6MiwidXNlcm5hbWUiOiJ4d2oxMjMiLCJwYXNzd29yZCI6ImVmMzBkMGNmNmNlMjkxZjZkZWZhOWYxZDMzMmY3MWFlIiwicHJpdmF0ZV9rZXkiOiJ4d2oxMjMiLCJpc0FjdGl2YXRlIjoxfSwiaWF0IjoxNjA0NDYyNjI5LCJleHAiOjE2MDQ1NDkwMjl9.Dkd3J0gl47zbJUILM6sTpdfJCiXNZUxb5hXRSK5DCP8`);
    },
    success: function (data) {
      // console.log(data)

      // * 请求成功后
      let root = $('#table-users');
      // * 获取tr节点数组
      let trsArr = getUserTableline(data.data.users);
      // console.log(root)
      // console.log(trsArr)
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

$(document).ready(function () {
  initUsers();
});