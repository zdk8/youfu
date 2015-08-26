define(function(){
    function render(local,option){
        var operationtable = local.find('[opt=operationtable]');        //日志table
        /*加载操作日志表*/
        operationtable.datagrid({
            url:'getoperationlog',
            method:'post',
            onLoadSuccess:function(data){
                console.log(data)
            }
        })
    }

    return {
        render:render
    }

})