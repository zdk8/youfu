define(function () {
    var addToolBar=function(local) {
        var toolBarHeight=35;
        var toolBar=cj.getFormToolBar([
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '关闭',hidden:'hidden',opt:'close'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    /*新增*/
    var addOldCareCenter = function (local,option) {
        local.find('[opt=save]').show().click(function () {
            local.find('[opt=carecenterform]').form('submit', {
                url:'depart/addcarecenter',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid){
                        showProcess(false);
                    }
                    return isValid;
                },
                success: function (data) {
                    if(data == "success"){
                        layer.closeAll('loading');
                        layer.alert('保存成功!', {icon: 6,title:'温馨提示'});
                        option.queryParams.refresh();
                    }else{
                        layer.closeAll('loading');
                        layer.alert('保存失败!', {icon: 5,title:'温馨提示'});
                    }
                }
            });
        })
    }
    /*查看*/
    var viewOldCareCenter = function (local,option) {
        local.find('[opt=carecenterform]').form('load',option.queryParams.data);
        local.find('[opt=close]').show().click(function () {
            $('#tabs').tabs('close',option.title);
        });
    }
    /*修改*/
    var updateOldCareCenter = function (local,option) {
        local.find('[opt=carecenterform]').form('load',option.queryParams.data);
        local.find('[opt=update]').show().click(function () {
            local.find('[opt=carecenterform]').form('submit', {
                url:'depart/updatecarecenter',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid){
                        layer.closeAll('loading');
                    }
                    params.zl_id = option.queryParams.data.zl_id;
                    return isValid;
                },
                success: function (data) {
                    if(data == "success"){
                        layer.closeAll('loading');
                        layer.alert('修改成功!', {icon: 6,title:'温馨提示'});
                        option.queryParams.refresh();
                    }else{
                        layer.closeAll('loading');
                        layer.alert('修改失败!', {icon: 5,title:'温馨提示'});
                    }
                }
            });
        });
    }

    return {
        render: function (local,option) {
            addToolBar(local);
            local.find('[opt=save]').hide();
            local.find('[opt=update]').hide();
            local.find('[opt=close]').hide();
            if(option && option.queryParams){
                switch (option.queryParams.actiontype){
                    case 'add':
                        addOldCareCenter(local,option);
                        break;
                    case 'view':
                        viewOldCareCenter(local,option);
                        break;
                    case 'update':
                        updateOldCareCenter(local,option);
                        break;
                    default :
                        break;
                }
            }

        }
    }
})