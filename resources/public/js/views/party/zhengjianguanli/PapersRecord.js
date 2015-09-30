define(function(){
    function render(local,option){
        layer.closeAll('loading');
        var datagrid = local.find('.easyui-datagrid-noauto');
        var refreshGrid=function() {
            datagrid.datagrid('reload');
        };
        /*加载领用/归还证件*/
        datagrid.datagrid({
            url:"party/getcerreceivebyid",
            type:'post',
            queryParams:{
                c_id:option.queryParams.c_id
            },
            onLoadSuccess:function(data){
            },
            rowStyler: function(index,row){
                if (row.returndate == null){
                    return 'color:#A52A2A;';
                }else{
                    return 'color:#20B2AA';
                }
            }
        })
    }

    return {
        render:render
    }

})