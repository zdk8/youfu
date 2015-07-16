define(function(){
    function render(local,option){
        llo = local;
        var addToolBar=function(local) {
            var toolBarHeight=30;
            var toolBar=cj.getFormToolBar([
                {text: '处理',hidden:'hidden',opt:'dealwith'},
                {text: '修改',hidden:'hidden',opt:'update'},
                {text: '删除',hidden:'hidden',opt:'delete'},
                {text: '保存',hidden:'hidden',opt:'save'},
                {text: '提交',hidden:'hidden',opt:'assessmentover'}
            ]);
            local.append(toolBar);
            local.find('div[opt=formcontentpanel]').panel({
                onResize: function (width, height) {
                    $(this).height($(this).height() - toolBarHeight);
                    toolBar.height(toolBarHeight);
                }
            });
        };
        //addToolBar(local);
        //local.find('[opt=save]').show();

    }

    return {
        render:render
    }
})