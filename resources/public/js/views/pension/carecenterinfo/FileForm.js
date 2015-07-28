define(function () {
    return {
        render: function (local,option) {
            //local.find('[name=pc_id]').val(option.poption.otherParams.record.pc_id);
            //local.find('[name=filetype]').val(option.filetype);

            local.find('[name=file]').bind('change',function(){
                var file=$(this).val();
                var strFileName=file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");  //正则表达式获取文件名，不带后缀
                var FileExt='.'+file.replace(/.+\./,"");   //正则表达式获取后缀

                local.find('[name=filenamemsg]').val(strFileName);
                local.find('[name=fileext]').val(FileExt);
                console.log(FileExt)
            })
            llo = local;
            oop = option;
            var plocal = option.plocal;

            function preview(file)
            {
                var prevDiv = document.getElementById('personimg');
                if (file.files && file.files[0])
                {
                    var reader = new FileReader();
                    reader.onload = function(evt){
                        prevDiv.innerHTML = '<img src="' + evt.target.result + '" />';
                        //tt = evt
                        // console.log(evt)
                    }
                    reader.readAsDataURL(file.files[0]);
                }
                else
                {
                    prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
                }
            }

            option.submitbtn.click(function () {
                var success=function(data)
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
                local.find('[opt=fileuploadform]').ajaxForm(options).submit();
                console.log(1212)
            })
        }
    }
})