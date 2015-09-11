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
    var viewBigEvent = function (local,option) {
        local.find('[opt=bigeventinfo]').form('load',option.queryParams.data);
        local.find('[opt=close]').show().click(function () {
            $('#tabs').tabs('close',option.title);
        });
    }
    var addBigEvent = function (local,option) {
        local.find('[name=zl_name]').val(option.queryParams.data.name);
        local.find('[opt=save]').show().click(function () {
            local.find('[opt=bigeventinfo]').form('submit', {
                url:'depart/addbigevent',
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
                        cj.showSuccess('新增成功');
                    }else{
                        layer.closeAll('loading');
                        cj.showFail('新增失败');
                    }
                }
            });
        });
    }
    /*修改*/
    var updateBigEvent = function (local,option) {
        local.find('[opt=bigeventinfo]').form('load',option.queryParams.data);
        local.find('[opt=update]').show().click(function () {
            local.find('[opt=bigeventinfo]').form('submit', {
                url:'depart/updatebigevent',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid){
                        layer.closeAll('loading');
                    }
                    params.be_id = option.queryParams.data.be_id;
                    return isValid;
                },
                success: function (data) {
                    if(data == "success"){
                        layer.closeAll('loading');
                        cj.showSuccess('修改成功');
                        option.queryParams.datagrid.datagrid("reload");
                    }else{
                        layer.closeAll('loading');
                        cj.showFail('修改失败');
                    }
                }
            });
        });
    }

    return {
        render: function (local, option) {
            layer.closeAll('loading');
            addToolBar(local);
            local.find('[opt=save]').hide();
            local.find('[opt=update]').hide();
            if(option && option.queryParams){
                switch(option.queryParams.actiontype){
                    case 'view':
                        viewBigEvent(local,option);
                        break;
                    case 'add':
                        addBigEvent(local,option);
                        break;
                    case 'update':
                        updateBigEvent(local,option);
                        break;
                    default :
                        break;
                }
            }
        }
    }
})