define(function(){
    function render(local,option){
        var yljgdlg = local.find('[opt=yljgdlg]');      //表单
        var determine = option.submitbtn;               //确定按钮
        var actiontype = option.actiontype;             //操作方式
        if(actiontype == "update"){                     //编辑
            yljgdlg.form('load', option.data);
            determinefunc({determine:determine,yljgdlg:yljgdlg,actiontype:actiontype,option:option})
        }else if(actiontype == "add"){                  //新增
            determinefunc({determine:determine,yljgdlg:yljgdlg,actiontype:actiontype,option:option})
        }

    }
    /*确定按钮*/
    var determinefunc = function(params){
        params.determine.click(function(){
            if(params.actiontype == "add"){         //新增
                params.yljgdlg.form('submit',{
                    url:'pension/adddepartment',
                    onSubmit:function(param){
                        param.deptype = "jigou"
                    },
                    success:function(data){
                        if(data == "true"){
                            cj.slideShow("添加成功")
                            params.option.parent.trigger('close');
                            params.option.refresh.trigger('click'); //刷新
                        }else{
                            cj.slideShow("添加失败")
                        }
                        /*var data = eval('(' + data + ')');
                        if(data.success){

                        }else{

                        }*/
                    }
                });
            }else if(params.actiontype == "update"){     //修改
                params.yljgdlg.form('submit',{
                    url:'pension/updatedepartmentbyid',
                    onSubmit:function(param){
                        param.dep_id = params.option.data.dep_id
                    },
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