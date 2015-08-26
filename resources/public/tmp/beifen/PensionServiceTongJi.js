define(function(){
    var render=function(local,option){
        var districtid = local.find('[opt=districtid]');      //行政区划
        getdivision(districtid);                   //加载行政区划
        var peopleinfodatarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
        var refreshGrid=function() {
            peopleinfodatarid.datagrid('reload');
        };
        peopleinfodatarid.datagrid({
            url:"old/search-oldpeople",
            type:'post',
            queryParams:{

            },
            onLoadSuccess:function(data){
            }
        })
        var districtidval = local.find('[opt=districtid]')
        var typeval = local.find('[opt=type]')
        var birth1val = local.find('[opt=birth1]')
        var birth2val = local.find('[opt=birth2]')
        local.find('[opt=tongji]').click(function(){
            console.log("统计")
            console.log(districtidval.combobox("getValue"))
            console.log(typeval.combobox("getValue"))
            console.log(birth1val.datebox("getValue"))
            console.log(birth2val.datebox("getValue"))
            peopleinfodatarid.datagrid("load",{
                dd:"1"
            })
        })


    }
    return {
        render:render
    }

})