$(function() {
        // 密码效验
        layui.form.verify({
                pwd: [
                    /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
                ],
                samePwd: function(value) {
                    if (value === $('[name=oldpwd]').val()) {
                        return '新密码不能和原密码一致'
                    }
                },
                reqPwd: function(value) {
                    if (value !== $('[name=newpwd]').val()) {
                        return '两次密码不一致！'
                    }
                }
            })
            //提交
        $('.layui-form').submit(function(e) {
            e.preventDefault()
            getPwd()

        })
    })
    // 请求Ajax
function getPwd() {
    let data = {
        oldPwd: $('.layui-form [name=oldpwd]').val(),
        newPwd: $('.layui-form [name=newpwd]').val()
    }
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: data,
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            layui.layer.msg('更改成功')
                // 重置表单 因为JQ没有reset()  所以要先转成原生DOM$('.layui-form')[0]
            $('.layui-form')[0].reset()
                // 同时退出登陆

        }
    })
}