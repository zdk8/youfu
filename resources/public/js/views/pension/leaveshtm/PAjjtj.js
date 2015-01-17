define(function(){
    /*经济条件info1_2评分*/
    var jjtjScore = function(local,parentlocal){
        local.find('table[opt=PAjjtj] :input[name=jj_fenl]+label').each(function(i){
            $(this).bind('click',function(){
                if($(this).hasClass("checked")){
                    var v=$(this).prev().val();
                }else
                    var v = 0;
                local.find(':input[name=jj_pingguf]').val(v/2)
                parentlocal.find('fieldset[opt=result1] :input[name=sum_jj_pingguf]').attr("readonly","readonly").val(v/2)
                calculate(parentlocal);     //计算评估总分
            })
        })
    }
    /*数据填充*/
    var fillDatas = function(local,datas){
        local.find('[name=jj_pingguy]').val(datas.jj_pingguy)
        local.find('input[name=jj_fenl][type=radio][value='+datas.jj_fenl+']').attr("checked","checked");
        local.find('input[name=jj_fenl][type=radio][value='+datas.jj_fenl+']+label').addClass("checked");
        local.find('[name=jj_pingguf]').val(datas.jj_pingguf)
        var score = datas.jj_fenl
        if(score != 30){
            local.find('[opt=jj_shour'+score+']').val(datas.jj_shour)
        }else if(score == 30){
            local.find('input[opt=jj_leix][type=radio][value='+datas.jj_leix+']').attr("checked","checked");
            local.find('input[opt=jj_leix][type=radio][value='+datas.jj_leix+']+label').addClass("checked");
        }
    }
    return {
        render:function(local,option){
            console.log("经济条件")
            var parentlocal = option.plocal
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')')
            jjtjScore(local,parentlocal);  //评分
            fillDatas(local,datas);        //数据填充

        }
    }
})