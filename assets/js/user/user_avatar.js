$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传
    $('#butImage').on('click', function() {
            $('#file').click()

        })
        // 给#file 添加change 事件
    $('#file').on('change', function(e) {
            console.log(e);
            let filelise = e.target.files
            if (filelise.length === 0) {
                return layui.lauer.msg('请选择图片')
            }
            // 拿到用户选择的文件
            let file = e.target.files[0]
                // 把文件转换为url 地址
            let newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域

        })
        // 确定按钮
    $('#butUplod').on('click', function() {
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('更换成功')
                    // 修改主页面的头像
                window.parent.gitname()
            }

        })
    })
})