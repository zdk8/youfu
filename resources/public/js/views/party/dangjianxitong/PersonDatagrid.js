define(function(){
    var render=function(local,option){
        layer.closeAll('loading');

        local.find('.easyui-datagrid-noauto').datagrid({
            url:"record/getrecordlist",
            type:'post',
            queryParams:{
                group:'1',
                idtype:option.params.idtype,
                id:option.params.id
            },
            onLoadSuccess:function(data){}
        });
        
    }
    return {
        render:render
    }

})