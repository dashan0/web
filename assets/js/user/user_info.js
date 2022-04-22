$(function() {
    getUser()
    layui.form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "用户昵称必须在1~6个字符"
            }
        }
    })

    // 重置
    $('#butReset').on('click', function(e) {
            e.preventDefault()
            getUser()

        })
        // 提交
    $('.layui-form').submit(function(e) {
        e.preventDefault()
            // let data = {
            //     id: $('.layui-form [name=id]').val(),
            //     nickname: $('.layui-form [name=nickname]').val(),
            //     email: $('.layui-form [name=email]').val()
            // }

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // data: data,
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.lauer.msg('提交失败')
                }
                layui.layer.msg('提交成功 ')
                    // 调用父页面的函数重新渲染名字头像
                window.parent.gitname()
            }
        })

    })
})

// 获取用户基本信息
function getUser() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('请求失败');
            }

            // 快速填充数据 lay的方法
            layui.form.val("formUserInfo", res.data)
        }
    })
}