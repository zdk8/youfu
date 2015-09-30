define(function () {
    var addToolBar=function(local,option,li) {
        var li_func = ' <li>' +
            '<input type="button" value="取消" class="btns" opt="cancel">' +
            '</li>' +'&nbsp;'+li;

        var functool = local.find('.layui-layer-setwin');
        functool.after('<div class="funcmenu"><ul></ul></div>');
        var _toolbar = local.find('.funcmenu');
        _toolbar.css('display','block');
        _toolbar.find('ul').html(li_func);
        /*取消*/
        local.find('[opt=cancel]').click(function () {
            layer.close(option.index);
        });
    };
    return {
        render: function (local,option) {
            layer.closeAll('loading');
            var li = '<li><input type="button" value="保存" class="btns" opt="save"></li>';
            addToolBar(local,option,li);

            //llo = local;
            //pllo = option.queryParams.plocal;

            /*if(option && option.params){
                if(option.params == 'showimg'){     //需要显示照片

                }else{

                }
            }*/

            /*存放附件信息*/
            local.find('[name=file]').bind('change',function(){
                var file=$(this).val();
                var strFileName=file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");  //正则表达式获取文件名，不带后缀
                var FileExt='.'+file.replace(/.+\./,"");   //正则表达式获取后缀

                local.find('[opt=inputMsg]').val(strFileName);
                local.find('[name=fileext]').val(FileExt);
                //option.queryParams.plocal.find('[name=fileext]').val(FileExt);

                //local.find('[name=pc_id]').val(this.files[0]);

                //option.queryParams.plocal.find('[opt=inputVal]').val(local.find('[opt=inputVal]').val());

            })

            /*local.find('[opt=inputVal]').on('change', function () {
                //console.log(this)
                //preview(this);
            })*/

            /*图片预览*/
            /*function preview(file)
            {
                //var prevDiv = document.getElementById('personimg');
                var prevDiv = option.params.plocal.find('[opt=personimg]');
                //var prevDiv = $('[opt=preview]');
                if (file.files && file.files[0]){
                    var reader = new FileReader();
                    reader.onload = function(evt){
                        var imghtm = '<img style="width:150px;height:120px;" src="' + evt.target.result + '" />';
                        prevDiv.html(imghtm);
                        //prevDiv.innerHTML = '<img style="width:150px;height:120px;" src="' + evt.target.result + '" />';
                        //tt = evt
                        //console.log(evt.target.result)
                    }
                    reader.readAsDataURL(file.files[0]);
                }else{
                    //var noperson = '<img name="photo" src="images/noperson.gif" value="" alt="用户照片" width="150px" height="120px">';
                    var noperson = '<div class="img" style="width:150px;height:120px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
                    prevDiv.html(noperson);
                    //prevDiv.innerHTML = '<div class="img" style="width:150px;height:120px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
                }
            }*/

            local.find('[opt=save]').click(function () {
                local.find('[opt=fileuploadform]').form('submit', {
                    url: 'party/fileupload',
                    onSubmit: function (params) {
                        layer.load();
                        var isValid = $(this).form('validate');
                        params.pc_id = option.queryParams.pr_id;
                        params.filetype = option.queryParams.plocal.find('.filefolder ul li.menu_funcV span').attr('opt');
                        if (!isValid) {
                            layer.closeAll('loading');
                        }
                        return isValid;
                    },
                    success: function (data) {
                        layer.closeAll('loading');
                        if(data == "success"){
                            layer.alert('保存成功', {icon: 6,title:'温馨提示',shift:2});
                            layer.close(option.index);
                            option.queryParams.file_dg.datagrid('reload');
                        }else{
                            layer.alert('保存失败', {icon: 5,title:'温馨提示',shift:2});
                        }
                    }
                })
                //preview(local.find('[opt=inputVal]')[0]);
                //preview(option.queryParams.plocal.find('[opt=inputVal]')[0]);
                //layer.close(option.index);

                /*var success=function(data)
                {
                    option.parent.trigger('close');
                    option.refresh();
                    //var d = $.evalJSON(data);
                    var d = eval('('+data+')');
                    if(d.success){
                        //option.refresh();
                        //localDataGrid.datagrid('reload');

                    }else{
                        //$.messager.alert(cj.defaultTitle, d.msg, 'info');
                    }

                };
                var options = {
                    //beforeSubmit:  showRequest,  // pre-submit callback
                    success: success,  // post-submit callback
                    timeout:   5000
                };

                if(option && option.functype == "funcimg"){
                    local.find('[opt=fileuploadform]').ajaxForm(options).submit();
                }else{

                }*/
            })
        }
    }
})