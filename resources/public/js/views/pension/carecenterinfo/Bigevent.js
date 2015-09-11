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
        local.find('[opt=save]').show().click(function () {
            local.find('[opt=bigeventinfo]').form('submit', {
                url:'depart/addbigevent',
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
                    }else{
                        layer.closeAll('loading');
                        layer.alert('保存失败!', {icon: 5,title:'温馨提示'});
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
                    default :
                        break;
                }
            }
        }
    }
})