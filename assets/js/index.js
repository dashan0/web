$(function() {
        // 调用获取信息函数
        gitname()
            // 退出
        $('#butLogout').on('click', function() {
            layui.layer.confirm('确定要退出吗?', { icon: 3, title: '提示' }, function(index) {
                //清空本地存储token
                localStorage.removeItem('token')
                    // 跳会登陆页
                location.href = '/login.html'
                layer.close(index);
            })
        })
    })
    //获取用户信息
function gitname() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用渲染头像函数
            rendAvatar(res.data)
        }
    })
}
//渲染头像
function rendAvatar(user) {
    // 获取用户名称
    let name = user.nickname || user.username
    $('#welcome').html('欢迎' + name)
        // 判断用户是否上传了头像
        //    如果上传
    if (user.user_pic !== null) {
        // 把src 修改为对象的
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 没有就显示文字
        $('.layui-nav-img').hide()
            // 拿到名字的第一个字符转成大写
        let first = name.substr(0, 1).toUpperCase()
        $('.text-avatar').html(first).show()

    }
}