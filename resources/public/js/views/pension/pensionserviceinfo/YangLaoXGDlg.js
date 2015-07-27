define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '保存',hidden:'hidden',opt:'save',class:'btns'},
            {text: '修改',hidden:'hidden',opt:'update',class:'btns'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    function render(local,option){
        addToolBar(local)
        var ylxgdlg = local.find('[opt=ylxgdlg]');      //表单
//        var determine = option.submitbtn;               //确定按钮
        var actiontype = option.queryParams.actiontype;             //操作方式

        if(actiontype == "update"){                     //编辑
            ylxgdlg.form('load', option.queryParams.data);
            local.find("[opt=save]").hide();
            local.find("[opt=update]").show().click(function(){
                ylxgdlg.form('submit',{
                    url:'pension/updatedepartmentbyid',
                    onSubmit:function(params){
                        params.dep_id = option.queryParams.data.dep_id
                    },
                    success:function(data){
                        if(data == "true"){
                            cj.slideShow("修改成功！");
                            $("#tabs").tabs("close",option.queryParams.title);
                            var ref = option.queryParams.refresh;
                            ref();
                        }else{
                            cj.slideShow("修改失败！")
                        }
                    }
                });
            })
//            determinefunc({determine:determine,ylxgdlg:ylxgdlg,actiontype:actiontype,option:option})
        }else if(actiontype == "add"){                  //新增
//            determinefunc({determine:determine,ylxgdlg:ylxgdlg,actiontype:actiontype,option:option})
            local.find("[opt=update]").hide();
            local.find("[opt=save]").show().click(function(){
                ylxgdlg.form('submit',{
                    url:'pension/adddepartment',
                    onSubmit:function(params){
                        params.deptype = "xingguang"
                    },
                    success:function(data){
                        if(data == "true"){
                            cj.slideShow("添加成功！");
                            $("#tabs").tabs("close",option.queryParams.title);
                            var ref = option.queryParams.refresh;
                            ref();
                        }else{
                            cj.slideShow("添加失败！")
                        }
                    }
                });
            })
        }

        /*取消*/
        /*local.find('[opt=cancle]').click(function(){
            option.parent.trigger('close');
        })*/
    }
    /*确定按钮*/
    var determinefunc = function(params){
        params.determine.click(function(){
            if(params.actiontype == "add"){         //新增
                params.ylxgdlg.form('submit',{
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
                params.ylxgdlg.form('submit',{
                    url:'pension/updatedepartmentbyid',
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