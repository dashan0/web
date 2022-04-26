$(function() {

    // 定一个查询的对象
    let q = {
            pagenum: 1, //页码值 默认显示第一页
            pagesize: 2, //每页显示多少条数据 默认2条 
            cate_id: '', //文章分类的 Id  默认为空
            state: '', //文章的状态 默认为空
        }
        //时间过滤器
    template.defaults.imports.dataFormat = function(data) {
            let dt = new Date(data)
            let y = dt.getFullYear()

            let m = padZero(dt.getMonth() + 1)

            let d = padZero(dt.getDate())

            let hh = padZero(dt.getHours())

            let mm = padZero(dt.getMinutes())

            let ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

        }
        // 时间补零
    function padZero(z) {
        return z > 9 ? z : '0' + z
    }
    initTable()
        // 请求数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {

                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                let htmlStr = template('tab-list', res)

                $('tbody').html(htmlStr)
                    //调用分页函数
                renderPage(res.total)
            }
        })
    }
    initCate()
        // 获取分类列表
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {

                if (res.status !== 0) return layui.layer.msg(res.message)
                let cateStr = template('cate-list', res)

                $('[name=cate_id]').html(cateStr)
                    // 通知layui重新渲染表单
                layui.form.render()

            }
        });
    }
    // 筛选按钮添加提交事件

    $('#but-form').submit(function(e) {
        e.preventDefault()
            // 获取对应的val
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
            // 把拿到的val 赋值给q对象
        q.cate_id = cate_id
        q.state = state
            // 根据q重新获取数据
        initTable()
    })

    // 渲染分页的方法
    function renderPage(total) {
        layui.laypage.render({
            elem: 'test1',
            //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认被选中的页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],
            // 当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); 得到当前页，以便向服务端请求对应页的数据。
                // 把最新的页码值给q
                q.pagenum = obj.curr
                    // console.log(obj.limit);
                    //得到每页显示的条数
                    // 把最新每页显示的条数给q
                q.pagesize = obj.limit
                    //首次不执行  解决死循环
                if (!first) {
                    initTable()
                }
            }
        });
    }
    // 删除事件
    // 获取每个按钮对应的ID

    $('tbody').on('click', '.but-dele', function() {
            // 获取删除按钮的个数
            let len = $('.but-dele').length
            let deleId = $(this).attr('data-id')
            layui.layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    method: "GET",
                    url: "/my/article/delete/" + deleId,

                    success: function(res) {
                        if (res.status !== 0) return layui.layer.msg(res.message)

                        layui.layer.msg('删除成功')
                            // 当数据删除完成后 需要判断当前页是否还有数据  如果没让页码值-1
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                        }
                        initTable()


                    }
                });
                layui.layer.close(index)
            });

        })
        //编辑事件
    let indexEdnt = null
    $('tbody').on('click', '.but-text', function() {
        indexEdnt = layui.layer.open({
            type: 1,
            title: '修改',
            area: ['100%', '100%'],
            content: $("#text-form").html()

        })
        let id = $(this).attr('data-id')
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            data: id,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.form.val('form-x', res.data)

            }
        });
        initCate()
            // 初始化富文本
        initEditor()
            // 初始化裁剪区域
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
            // 确定修改按钮
        $('#form-x').submit(function(e) {
            e.preventDefault()
                // 2. 基于 form 表单，快速创建一个 FormData 对象
            let fd = new FormData($(this)[0])
            fd.append('Id', id)
                // fd.forEach(function(v, k) {
                //     console.log(v, k);
                // })
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
                        // publishArticle(fd)
                    $.ajax({
                        method: 'POST',
                        url: '/my/article/edit',
                        data: fd,
                        // 注意：如果向服务器提交的是 FormData 格式的数据，
                        // 必须添加以下两个配置项
                        contentType: false,
                        processData: false,
                        success: function(res) {
                            if (res.status !== 0) {
                                return layui.layer.msg(res.message)
                            }
                            layui.layer.msg('修改文章成功！')
                                // 根据索引，关闭对应的弹出层
                            layui.layer.close(indexEdnt)
                                // 获取分类列表
                            initTable()
                                // 发布文章成功后，跳转到文章列表页面
                            location.href = '/article/art_list.html'
                        }
                    })
                })
        })

    })




})