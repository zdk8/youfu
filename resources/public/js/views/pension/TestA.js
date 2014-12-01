define(function(){

    var initPage=function(local,f) {

        var toolBarHeight=30;
        var toolBar=cj.getFormToolBar([
            {text: '父节点'},
            {text: '序号'},
            {text: '节点类型'},
            {text: '节点类型'},
            {text: '节点类型'},
            {text: '地址'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });


    }


    return {
        render:initPage
    }
})