define(function () {
    var addToolBar=function(local) {
        var toolBarHeight=35;
        var toolBar=cj.getFormToolBar([
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '关闭',hidden:'hidden',opt:'close'},
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };
    /*新增工作人员*/
    var addCareWorker = function (local,option) {
        local.find('[opt=save]').show().click(function () {
            local.find('[opt=careworkerform]').form('submit', {
                url:'depart/addcareworker',
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
                        cj.showSuccess('保存成功');
                        //option.queryParams.refresh();
                    }else{
                        layer.closeAll('loading');
                        cj.showFail('保存失败');
                    }
                }
            });
        });
    }
    /*查看*/
    var viewCareWorker = function (local,option) {
        local.find('[opt=careworkerform]').form('load',option.queryParams.data);
        local.find('[opt=close]').show().click(function () {
            $('#tabs').tabs('close',option.title);
        });
    }
    /*修改*/
    var updateCareWorker = function (local,option) {
        local.find('[opt=careworkerform]').form('load',option.queryParams.data);
        local.find('[opt=update]').show().click(function () {
            local.find('[opt=careworkerform]').form('submit', {
                url:'depart/updatecareworker',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid){
                        layer.closeAll('loading');
                    }
                    params.zl_id = option.queryParams.data.zl_id;
                    params.cw_id = option.queryParams.data.cw_id;
                    return isValid;
                },
                success: function (data) {
                    if(data == "success"){
                        layer.closeAll('loading');
                        cj.showSuccess('修改成功');
                        option.queryParams.datagrid.datagrid('reload');
                    }else{
                        layer.closeAll('loading');
                        cj.showFail('修改失败');
                    }
                }
            });
        });
    }

    return {
        render: function (local,option) {
            layer.closeAll('loading');
            addToolBar(local);
            local.find('[opt=save]').hide();
            local.find('[opt=update]').hide();
            local.find('[opt=close]').hide();
            if(option && option.queryParams){
                switch (option.queryParams.actiontype){
                    case 'add':
                        addCareWorker(local,option);
                        break;
                    case 'view':
                        viewCareWorker(local,option);
                        break;
                    case 'update':
                        updateCareWorker(local,option);
                        break;
                    default :
                        break;
                }
            }
        }
    }
})