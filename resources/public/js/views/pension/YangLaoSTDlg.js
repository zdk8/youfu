define(function(){
    function render(local,option){
        var ylstdlg = local.find('[opt=ylstdlg]');      //表单
        var determine = local.find('[opt=determine]');      //确定按钮
        var actiontype = option.actiontype;             //操作方式

        if(actiontype == "update"){                     //编辑
            ylstdlg.form('load', option.data);
            determinefunc({determine:determine,ylstdlg:ylstdlg,actiontype:actiontype,option:option})
        }else if(actiontype == "add"){                  //新增
            determinefunc({determine:determine,ylstdlg:ylstdlg,actiontype:actiontype,option:option})
        }

        /*取消*/
        local.find('[opt=cancle]').click(function(){
            option.parent.trigger('close');
        })
    }
    /*确定按钮*/
    var determinefunc = function(params){
        params.determine.click(function(){
            if(params.actiontype == "add"){         //新增
                params.ylstdlg.form('submit',{
                    url:'pension/addcanteen',
                    dataType:"json",
                    success:function(data){
                        var data = eval('(' + data + ')');
                        if(data.success){
                            alert("添加成功！");
                            params.option.parent.trigger('close');
                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            alert("添加失败！")
                        }
                    }
                });
            }else if(params.actiontype == "update"){     //修改
                params.ylstdlg.form('submit',{
                    url:'pension/updatecanteen',
                    dataType:"json",
                    success:function(data){
                        var data = eval('(' + data + ')');
                        if(data.success){
                            alert("修改成功！");
                            params.option.parent.trigger('close');
                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            alert("修改失败！")
                        }
                    }
                });
            }
        });
    }

    return {
        render:render
    }

})