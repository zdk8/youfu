define(function(){
    /*数据填充*/
    var fillDatas = function(local,datas){
        local.find('textarea[name=cz_qit]').val(datas.cz_qit)
        local.find(':input[name=cz_pingguy]').val(datas.cz_pingguy)
        local.find('input[name=cz_shil][type=radio][value='+datas.cz_shil+']').attr("checked","checked");//视力
        local.find('input[name=cz_shil][type=radio][value='+datas.cz_shil+']+label').addClass("checked");
        local.find('input[name=cz_tingl][type=radio][value='+datas.cz_tingl+']').attr("checked","checked");//听力
        local.find('input[name=cz_tingl][type=radio][value='+datas.cz_tingl+']+label').addClass("checked");
        local.find('input[name=cz_zhit][type=radio][value='+datas.cz_zhit+']').attr("checked","checked");//肢体
        local.find('input[name=cz_zhit][type=radio][value='+datas.cz_zhit+']+label').addClass("checked");
    }
    return {
        render:function(local,option){
            console.log("残障情况")
            var parentlocal = option.plocal;
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')')
            fillDatas(local,datas);         //数据填充
        }
    }
})