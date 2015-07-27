define(function(){

    var initPage=function(local,f) {

        var toolBarHeight=30;

        var toolBar=cj.getFormToolBar([
            {text: '处理',hidden:'hidden',opt:'dealwith'},
            {text: '修改',hidden:'hidden',opt:'update'},
            {text: '删除',hidden:'hidden',opt:'delete'},
            {text: '保存',hidden:'hidden',opt:'save'},
            {text: '操作日志',hidden:'hidden',opt:'log'}
        ]);
        local.append(toolBar);
        local.find('div[opt=formcontentpanel]').panel({
            onResize: function (width, height) {
                $(this).height($(this).height() - toolBarHeight);
                toolBar.height(toolBarHeight);
            }
        });

        //console.log(toolBar.find('[opt=dealwith]').show());
        local.find('.webox').layout().draggable({
            handle:local.find('.pop-win-north-title')
        });

    }


    return {
        render:initPage
    }
})