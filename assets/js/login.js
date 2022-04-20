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
})