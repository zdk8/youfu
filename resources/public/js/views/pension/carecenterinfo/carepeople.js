define(function () {
    var addToolBar=function(local) {
        var toolBarHeight=35;
        var toolBar=cj.getFormToolBar([
            {text: '修改',hidden:'hidden',opt:'update',class:'btns'},
            {text: '保存',hidden:'hidden',opt:'save',class:'btns'},
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };

    return {
        render: function (local,option) {
            addToolBar(local);
            if(option && option.queryParams){
                if(option.queryParams.actiontype == "add"){
                    local.find('[name=zl_name]').val(option.queryParams.data.name);
                    local.find('[opt=save]').show().click(function () {
                        local.find('[opt=carepeopleform]').form('submit', {
                            url:'depart/addcarepeople',
                            onSubmit: function (params) {
                                layer.load();
                                var isValid = $(this).form('validate');
                                if (!isValid){
                                    layer.closeAll('loading');
                                }
                                return isValid;
                            },
                            success: function (data) {
                                if(data == "success"){
                                    layer.closeAll('loading');
                                    layer.alert('保存成功!', {icon: 6,title:'温馨提示'});
                                    //option.queryParams.refresh();
                                }else{
                                    layer.closeAll('loading');
                                    layer.alert('保存失败!', {icon: 5,title:'温馨提示'});
                                }
                            }
                        });
                    });
                }
            }
        }
    }
})