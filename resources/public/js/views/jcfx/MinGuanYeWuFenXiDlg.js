define(function(){
    var render = function(local,option){
        var mgst = local.find('[opt=mgst]');                 //社团
        var mgmfb = local.find('[opt=mgmfb]');               //民非办
        var mgjjh = local.find('[opt=mgjjh]');               //基金会
        window.setTimeout(function(){
            /*数据初始化加载*/
            loaddata(mgst,"st",option);
        },500)
        var minguanyewufenxidlg =  local.find('[opt=minguanyewufenxidlg]');
        var mgmfbfirst = true;
        var mgjjhfirst = true;
        minguanyewufenxidlg.tabs({
            onSelect:function(title){
                if(title == "民非办" && mgmfbfirst){
                    loaddata(mgmfb,"mf",option);
                    mgmfbfirst = false;
                }else if(title == "基金会" && mgjjhfirst){
                    loaddata(mgjjh,"jjh",option);
                    mgjjhfirst = false;
                }
            }
        })

        if(option.ywtype == "st"){
           minguanyewufenxidlg.tabs("close","民非办")
            minguanyewufenxidlg.tabs("close","基金会")
        }else if(option.ywtype == "mf"){
            minguanyewufenxidlg.tabs("close","社团")
            minguanyewufenxidlg.tabs("close","基金会")
        }



    }

    var loaddata = function(datagridname,tabletype,option){
        datagridname.datagrid({
            url:preFixUrl+'jcfxs/mgdetail',
            queryParams:{
                ywtype:option.ywtype,
                districtid:option.districtid,
                tablesign:tabletype,
                fxcond:option.fxcond,
                colvalue:option.ywtype != "all" ? option.tablevalue : ""
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