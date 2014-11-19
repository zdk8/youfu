define(function(){
    var render = function(local,option){
        var chshshq = local.find('[opt=chshshq]');                 //城市社区
        var cwh = local.find('[opt=cwh]');                        //村委会
        var jjhzsh = local.find('[opt=jjhzsh]');                  //经济合作社
        var ync = local.find('[opt=ync]');                         //渔农村
        window.setTimeout(function(){
            /*数据初始化加载*/
            loaddata(chshshq,"cs",option);
        },500)

        var cwhfirst = true;
        var jjhzshfirst = true;
        var yncfirst = true;
        $('#jicengzhengquantongjidlg').tabs({
            onSelect:function(title){
                if(title == "村委会" && cwhfirst){
                    loaddata(cwh,"cwh",option);
                    cwhfirst = false;
                }else if(title == "经济合作社" && jjhzshfirst){
                    loaddata(jjhzsh,"jjhzs",option);
                    jjhzshfirst = false;
                }else if(title == "渔农村" && yncfirst){
                    loaddata(ync,"ync",option);
                    yncfirst = false;
                }
            }
        })

    }

    var loaddata = function(datagridname,tabletype,option){
        datagridname.datagrid({
            url:preFixUrl+'jcfxs/jzhdetail',
            queryParams:{
                districtid:option.districtid,
                tabletype:tabletype
            },
            onLoadSuccess:function(data){
//                console.log(data)
            }
        })
    }

    return {
        render:render
    }
})