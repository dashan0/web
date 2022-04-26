$(function() {
    // 点击去注册
    $('#link-reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        // 点击登陆
    $('#link-login').on('click', function() {
            $('.reg-box').hide()
            $('.login-box').show()
        })
        // 从layui中获取form对象
    let form = layui.form
        // 从layui中获取layer对象
    let layer = layui.layer
        //通过form.verify()函数自定义规则
    form.verify({
            //自定义了一个检验密码的规则
            pass: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 效验密码是否一致  value就是用户输入的内容 是确认密码框的
            repwd: function(value) {
                //拿到密码框的内容
                let pwd = $('.reg-box [name=password]').val()
                if (pwd !== value) {
                    return '两次密码不一致'
                }
            }
        })
        // 监听注册的提交事件
    $('#form_reg').on('submit', function(e) {
            // 阻止默认行为
            e.preventDefault()
                // 发起ajax请求
            let data = { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() }
                // $.ajax({
                //         method: 'post',
                //         url: 'http://www.liulongbin.top:3007/api/reguser',
                //         data: data,
                //         success: function(res) {
                //             if (res.status !== 0) {
                //                 return layer.msg(res.message);
                //             }
                //             layer.msg('注册成功，请登陆');
                //             $('#link-login').click()
                //         }
                //     })
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登陆');
                $('#link-login').click()

            })

        })
        //监听登陆事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
            // 发起AJAX请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            //$(this).seriallze() 一次获取所以表单数据
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) return layer.msg(res.message)
                    // console.log('登陆成功');
                    // console.log(res.token);
                    //登陆成功后把token 存储到本地localStorage
                localStorage.setItem('token', res.token)
                    // 跳转首页
                location.href = '/index.html'

            }

        })


    })

})