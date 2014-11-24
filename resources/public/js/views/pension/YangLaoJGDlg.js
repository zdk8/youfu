define(function(){
    function render(local,option){
        var yljgdlg = local.find('[opt=yljgdlg]');      //表单
        var determine = local.find('[opt=determine]');      //确定按钮
        var actiontype = option.actiontype;             //操作方式

        if(actiontype == "update"){                     //编辑
            yljgdlg.form('load', option.data);
            determinefunc({determine:determine,yljgdlg:yljgdlg,actiontype:actiontype})
        }else if(actiontype == "add"){                  //新增
            console.log("add")
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
                params.yljgdlg.form('submit',{
                    url:'aaaa',
                    success:function(data){
                        console.log(data)
                    }
                });
            }else if(params.actiontype == "update"){     //修改
                params.yljgdlg.form('submit',{
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