define(function(){
    /*居住环境info1_3评分*/
    var jzhjScore = function(local,parentlocal){
        local.find('table[opt=PAjzhj] :input[name=jz_fenl]+label').each(function(i){
            $(this).bind('click',function(){
                local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl]+label').removeClass("checked");
                local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl]').removeAttr("checked");
                if($(this).hasClass("checked")){
                    var v=$(this).prev().val();
                    local.find('fieldset[opt=result1]').find(':input[name=sum_jz_fenl][value='+ v +']+label').addClass("checked");
                    local.find('fieldset[opt=result1]').find(':input[name=sum_jz_fenl][value='+ v +']').attr("checked","checked");
                }else
                    var v = 0;
                local.find(':input[name=jz_pingguf]').attr("readonly","readonly").val(v/2);
                parentlocal.find('fieldset[opt=result1] :input[name=sum_jz_pingguf]').attr("readonly","readonly").val(v/2);
                calculate(parentlocal);     //计算评估总分
            })
        })
    }
    /*数据填充*/
    var fillDatas = function(local,datas){
        local.find('[name=jz_pingguf]').val(datas.jz_pingguf)
        local.find('[name=jz_pingguy]').val(datas.jz_pingguy)
        local.find('input[name=jz_fenl][type=radio][value='+datas.jz_fenl+']').attr("checked","checked");//判断评分
        local.find('input[name=jz_fenl][type=radio][value='+datas.jz_fenl+']+label').addClass("checked");
        local.find('input[name=jz_zhaol][type=radio][value='+datas.jz_zhaol+']').attr("checked","checked");//是否有照料
        local.find('input[name=jz_zhaol][type=radio][value='+datas.jz_zhaol+']+label').addClass("checked");
    }
    return {
        render:function(local,option){
            console.log("居住环境")
            var parentlocal = option.plocal
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')');
            jzhjScore(local,parentlocal);    //评分
            fillDatas(local,datas);          //填充
        }
    }
})