import AV from 'leancloud-storage'

var APP_ID = 'KHDrL9QXe3FpByNyIfX7iQM5-gzGzoHsz';
var APP_KEY = '9cvT6ffhiDsKj9OO9DxzHUKY';
var objectID = '';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
export default AV

export function signUp(username, password, successFn, errorFn) {
    // 新建 AVUser 对象实例
    var user = new AV.User()
    // 设置用户名
    user.setUsername(username)
    // 设置密码
    user.setPassword(password)
    // 设置邮箱
    user.signUp().then(function (loginedUser) {
        let user = getUserFromAVUser(loginedUser)
        successFn.call(null, user)
    }, function (error) {
        errorFn.call(null, error)
    })
    return undefined

}

export function signIn(username, password, successFn, errorFn) {
    AV.User.logIn(username, password).then(function (loginedUser) {
        let user = getUserFromAVUser(loginedUser)
        successFn.call(null, user)
    }, function (error) {
        errorFn.call(null, error)
    })
}

export function getCurrentUser() {
    let user = AV.User.current()
    if (user) {
        return getUserFromAVUser(user)
    } else {
        return null
    }
}

export function signOut() {
    AV.User.logOut()
    return undefined
}

export function save(key,value){
    var SaveData = AV.Object.extend('SaveData')
    var data = new SaveData();
    data.set(key,value)
    data.save().then(function (todo) {
        // 成功保存之后，执行其他逻辑
        // 获取 objectId
        console.log(todo.id)
        objectID = todo.id
    }, function (error) {
        alert('保存当前数据失败')
    });

}

 export function load(){
     var todo = AV.Object.createWithoutData('SaveData', objectID);
     todo.fetch().then(function () {
         var todoList = todo.get('todoList');// 读取 todoList
         console.log(todoList)
         return todoList
     }, function (error) {
         alert('error')
     });
 }

function getUserFromAVUser(AVUser) {
    return {
        id: AVUser.id,
        ...AVUser.attributes
    }
}
