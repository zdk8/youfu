define(function(){
    /*数据填充*/
    var fillDatas = function(local,datas){
        local.find('[name=zf_pingguy]').val(datas.zf_pingguy)
        local.find('[name=zf_qit]').val(datas.zf_qit)
        local.find('input[name=zf_lianzf][type=radio][value='+datas.zf_lianzf+']').attr("checked","checked"); //廉租房
        local.find('input[name=zf_lianzf][type=radio][value='+datas.zf_lianzf+']+label').addClass("checked");
        local.find('input[name=zf_zhulf][type=radio][value='+datas.zf_zhulf+']').attr("checked","checked");  //租赁房
        local.find('input[name=zf_zhulf][type=radio][value='+datas.zf_zhulf+']+label').addClass("checked");
        local.find('input[name=zf_shiyf][type=radio][value='+datas.zf_shiyf+']').attr("checked","checked"); //经济适用房
        local.find('input[name=zf_shiyf][type=radio][value='+datas.zf_shiyf+']+label').addClass("checked");
        datas.zf_shiyf == 1?local.find(':input[name=zf_shiyingfnum]').val(datas.zf_shiyingfnum):null
        local.find('input[name=zf_shangpf][type=radio][value='+datas.zf_shangpf+']').attr("checked","checked"); //商品房
        local.find('input[name=zf_shangpf][type=radio][value='+datas.zf_shangpf+']+label').addClass("checked");
        datas.zf_shangpf == 1?local.find(':input[name=zf_shangpinfnum]').val(datas.zf_shangpinfnum):null
        local.find('input[name=zf_zijf][type=radio][value='+datas.zf_zijf+']').attr("checked","checked");  //农村自建房
        local.find('input[name=zf_zijf][type=radio][value='+datas.zf_zijf+']+label').addClass("checked");
        datas.zf_zijf == 1?local.find(':input[name=zf_zijianfnum]').val(datas.zf_zijianfnum):null
    }
    return {
        render:function(local,option){
            console.log("住房情况")
            var parentlocal = option.plocal;
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')')
            fillDatas(local,datas);         //数据填充
        }
    }
})