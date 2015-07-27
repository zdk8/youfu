define(function () {
    var addToolBar=function(local) {
        var toolBarHeight=35;
        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith',class:'btns'},
            {text: '修改',hidden:'hidden',opt:'update',class:'btns'},
            {text: '删除',hidden:'hidden',opt:'delete',class:'btns'},
            {text: '保存',hidden:'hidden',opt:'save',class:'btns'},
            {text: '保存',hidden:'hidden',opt:'save2',class:'btns'}
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
        render: function (local, option) {
            addToolBar(local);
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
    }
})