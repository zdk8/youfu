define(function(){
    var render = function(local,posion){
        var shgig = local.find('[opt=shgjg]');                 //社工机构
        /*var shgjshqry = local.find('opt=shgjshqry');        //社工进社区人员
        var shgjfljg = local.find('opt=shgjfljg');          //社工进福利机构
        var zhyshgjg = local.find('opt=zhyshgjg');  */        //专业社工机构
        window.setTimeout(function(){
            shgig.datagrid({
                url:preFixUrl+'jcfxs/sgdetail',
                queryParams:{
                    districtid:posion.districtid,
                    timefun:posion.timefun,
                    colname:posion.colname
                },
                onLoadSuccess:function(data){
                    console.log(data)
                }
            })
        },500)

    }



    return {
        render:render
    }
})