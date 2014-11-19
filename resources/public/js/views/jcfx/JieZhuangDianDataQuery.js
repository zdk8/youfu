define(function(){
    var render = function(local,posion){
        var placeDataQuery = local.find('table[opt=placeDataQuery]');           //datagrid
        var jz_mingcheng = local.find('input[opt=jz_mingcheng]');               //界桩名称
        var jz_id = local.find('input[opt=jz_id]');                             //界桩代码
        var jz_jiezhuangweizhi = local.find('input[opt=jz_jiezhuangweizhi]');     //界桩位置
        var jx_id = local.find('input[opt=jx_id]');                             //界线代码
        querybtn(local,placeDataQuery,jz_mingcheng,jz_id,jz_jiezhuangweizhi,jx_id);    //按条件查询
        /*复选框选中状态*/
        /*jz_mingcheng.bind('click',function(){
            local.find('input[name=jz_mingcheng]:checkbox').attr("checked",true);
        });
        jz_id.bind('click',function(){
            local.find('input[name=jz_id]:checkbox').attr("checked",true);
        });
        jz_jiezhuangweizhi.bind('click',function(){
            local.find('input[name=jz_jiezhuangweizhi]:checkbox').attr("checked",true);
        });
        jx_id.bind('click',function(){
            local.find('input[name=jx_id]:checkbox').attr("checked",true);
        });
        datastate.combobox({
            onSelect: function (date) {
                local.find('input[name=datastate]:checkbox').attr("checked",true);
            }
        });*/
        /*地名数据查询datagrid*/
        placeDataQuery.datagrid({
            url:preFixUrl+'jcfxs/jzhcx',
            queryParams:{

            },
            onLoadSuccess:function(data){
                console.log(data)
            }
        })

    }
    /*查询*/
    var querybtn = function(local,placeDataQuery,jz_mingcheng,jz_id,jz_jiezhuangweizhi,jx_id){
        var query = local.find("[opt=query]");
        query.bind("click",function(){
            loaddate(local,placeDataQuery,jz_mingcheng,jz_id,jz_jiezhuangweizhi,jx_id);
        })
    }
    /*按条件加载数据*/
    var loaddate = function(local,placeDataQuery,jz_mingcheng,jz_id,jz_jiezhuangweizhi,jx_id){
        placeDataQuery.datagrid('load',{
            jz_mingcheng: jz_mingcheng.val(),
            jz_id:jz_id.val(),
            jz_jiezhuangweizhi:jz_jiezhuangweizhi.val(),
            jx_id:jx_id.val()
        })
    }

    return {
        render:render
    }
})