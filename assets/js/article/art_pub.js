$(function() {
    initGetlists()
        // 初始化富文本
    initEditor()
        //   请求类别数据
    function initGetlists() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) return layui.lauer.msg(res.message)
                let indexStr = template('cate-lists', res)
                console.log(indexStr);
                $('[name=cate_id]').html(indexStr)
                    // 通知layui重新渲染表单
                layui.form.render()
            }
        });
    }
    // 初始化裁剪区域
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        // 选择封面
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        // 给#coverFile 添加change 事件
    $('#coverFile').on('change', function(e) {
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
        // 定义文章的发布状态
    let art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        // 发布
    $('#publish-form').submit(function(e) {
        e.preventDefault()
            // 2. 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])
            // 将发布状态添加到FD
        fd.append('state', art_state)
            // fd.forEach(function(v, k) {
            //     console.log(v, k);
            // })
            // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})