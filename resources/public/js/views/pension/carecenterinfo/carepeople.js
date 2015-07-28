define(function () {
    var addToolBar=function(local) {
        var toolBarHeight=35;
        var toolBar=cj.getFormToolBar([
            {text: '修改',hidden:'hidden',opt:'update',class:'btns'},
            {text: '保存',hidden:'hidden',opt:'save',class:'btns'},
            {text: '关闭',hidden:'hidden',opt:'close',class:'btns'},
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });
    };

    /*添加照料人员*/
    var addCarePeople = function (local,option) {
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
                    params.zl_id = option.queryParams.data.zl_id;
                    return isValid;
                },
                success: function (data) {
                    if(data == "success"){
                        layer.closeAll('loading');
                        layer.alert('保存成功!', {icon: 6,title:'温馨提示'});
                    }else{
                        layer.closeAll('loading');
                        layer.alert('保存失败!', {icon: 5,title:'温馨提示'});
                    }
                }
            });
        });
    }
    /*查看详细信息*/
    var viewCarePeople = function (local,option) {
        local.find('[opt=carepeopleform]').form('load',option.queryParams.data);
        local.find('[opt=close]').show().click(function () {
            $('#tabs').tabs('close',option.title);
        });
    }
    /*修改*/
    var updateCarePeople = function (local,option) {
        local.find('[opt=carepeopleform]').form('load',option.queryParams.data);
        local.find('[opt=update]').show().click(function () {
            local.find('[opt=carepeopleform]').form('submit', {
                url:'depart/updatecarepeople',
                onSubmit: function (params) {
                    layer.load();
                    var isValid = $(this).form('validate');
                    if (!isValid){
                        layer.closeAll('loading');
                    }
                    params.zl_id = option.queryParams.data.zl_id;
                    params.cp_id = option.queryParams.data.cp_id;
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
            if(option && option.queryParams){
                switch (option.queryParams.actiontype){
                    case 'add':
                        addCarePeople(local,option);
                        break;
                    case 'view':
                        viewCarePeople(local,option);
                        break;
                    case 'update':
                        updateCarePeople(local,option);
                        break;
                    default :
                        break;
                }
            }
        }
    }
})