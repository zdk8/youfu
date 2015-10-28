define(function(){
    /*伤残人员*/
    function scryFunc(local, option){
        layer.load(2);
        cj.getChildTab(local.find('[opt=vetabs]'),'ScryTable',option,"add");
    }
    /*三属人员*/
    function ssryFunc(local, option){
        layer.load(2);
        cj.getChildTab(local.find('[opt=vetabs]'),'SsryTable',option,"add");
    }
    function lcryFunc(local, option){
        layer.load(2);
        cj.getChildTab(local.find('[opt=vetabs]'),'LcryTable',option,"add");
    }
    function zxlfryFunc(local, option){
        layer.load(2);
        cj.getChildTab(local.find('[opt=vetabs]'),'ZxlfryTable',option,"add");
    }
    function dbhxryFunc(local, option){
        layer.load(2);
        cj.getChildTab(local.find('[opt=vetabs]'),'DbhxryTable',option,"add");
    }
    function ybtyryFunc(local, option){
        layer.load(2);
        cj.getChildTab(local.find('[opt=vetabs]'),'YbtyryTable',option,"add");
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
                    case 'lcry':        //两参人员
                        lcryFunc(local, option);
                        break;
                    case 'zxlfry':        //在乡老复人员
                        zxlfryFunc(local, option);
                        break;
                    case 'dbhxry':        //带病回乡人员
                        dbhxryFunc(local, option);
                        break;
                    case 'ybtyry':        //一般退役军人
                        ybtyryFunc(local, option);
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