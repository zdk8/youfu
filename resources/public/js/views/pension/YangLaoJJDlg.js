define(function(){
    function render(local,option){
        var yljjdlg = local.find('[opt=yljjdlg]');      //表单
        var determine = local.find('[opt=determine]');      //确定按钮
        var actiontype = option.actiontype;             //操作方式

        if(actiontype == "update"){                     //编辑
            yljjdlg.form('load', option.data);
            determinefunc({determine:determine,yljjdlg:yljjdlg,actiontype:actiontype,option:option})
        }else if(actiontype == "add"){                  //新增
            determinefunc({determine:determine,yljjdlg:yljjdlg,actiontype:actiontype,option:option})
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
                params.yljjdlg.form('submit',{
                    url:'pension/adddepartment',
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
                params.yljjdlg.form('submit',{
                    url:'aaaa',
                    success:function(data){
                        console.log(data)
                    }
                });
            }
        });
    }

    return {
        render:render
    }

})