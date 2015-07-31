define(function(){
    var addToolBar=function(local) {
        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '修改',hidden:'hidden',opt:'update'}
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
        local.find('[opt=save]').hide();
        local.find('[opt=update]').hide();
        var ylstdlg = local.find('[opt=ylstdlg]');      //表单
        var actiontype = option.queryParams.actiontype;             //操作方式

        if(actiontype == "update"){                     //编辑
            ylstdlg.form('load', option.queryParams.data);
            local.find("[opt=save]").hide();
            local.find("[opt=update]").show().click(function(){
                ylstdlg.form('submit',{
                    url:'pension/updatecanteen',
                    onSubmit:function(params){
                        params.c_id = option.queryParams.data.c_id
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
            });
        }else if(actiontype == "add"){                  //新增
            local.find("[opt=update]").hide();
            local.find("[opt=save]").show().click(function(){
                ylstdlg.form('submit',{
                    url:'pension/addcanteen',
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

    return {
        render:render
    }

})