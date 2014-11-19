define(function(){
    var render = function(local,posion){
        var placeDataQuery = local.find('table[opt=placeDataQuery]');           //datagrid
        var jx_mingcheng = local.find('input[opt=jx_mingcheng]');               //界线名称
        var jx_id = local.find('input[opt=jx_id]');                             //界线代码
        var jx_dj = local.find('input[opt=jx_dj]');                             //界线等级
        querybtn(local,placeDataQuery,jx_mingcheng,jx_id,jx_dj);    //按条件查询
        /*复选框选中状态*/
        /*jx_mingcheng.bind('click',function(){
            local.find('input[name=jx_mingcheng]:checkbox').attr("checked",true);
        });
        jx_id.bind('click',function(){
            local.find('input[name=jx_id]:checkbox').attr("checked",true);
        });
        jx_dj.bind('click',function(){
            local.find('input[name=jx_dj]:checkbox').attr("checked",true);
        });
        datastate.combobox({
            onSelect: function (date) {
                local.find('input[name=datastate]:checkbox').attr("checked",true);
            }
        });*/
        /*地名数据查询datagrid*/
        placeDataQuery.datagrid({
            url:preFixUrl+'jcfxs/jxcx',
            onLoadSuccess:function(data){
                console.log(data)
            }
        })

    }

    /*查询*/
    var querybtn = function(local,placeDataQuery,jx_mingcheng,jx_id,jx_dj){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,placeDataQuery,jx_mingcheng,jx_id,jx_dj);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,placeDataQuery,jx_mingcheng,jx_id,jx_dj){
        placeDataQuery.datagrid('load',{
            jx_mingcheng: jx_mingcheng.val(),
            jx_id:jx_id.val()
        })
    }

    return {
        render:render
    }
})