define(function(){
    /*伤残人员*/
    function scryFunc(local, option){
        layer.load(2);
        cj.getChildTab(local.find('[opt=vetabs]'),'ScryTable',option);
    }
    /*三属人员*/
    function ssryFunc(local, option){
        layer.load(2);
        cj.getChildTab(local.find('[opt=vetabs]'),'SsryTable',option);
    }

    var render=function(local,option){
        layer.closeAll('loading');
        local.find('[opt=vetabs]').tabs();
        scryFunc(local, option);
        /*tabs选择事件*/
        local.find('[opt=vetabs]').tabs({
            onSelect: function (title,index) {
                var $title = $(title);
                var sige = $title.attr('opt');
                switch (sige){
                    case 'scry':        //伤残人员
                        scryFunc(local, option);
                        break;
                    case 'ssry':        //三属人员
                        ssryFunc(local, option);
                        break;
                    default :
                        break;
                }
            }
        })
    }
    return {
        render:render
    }

})