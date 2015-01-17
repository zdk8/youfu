define(function(){
    /*年龄情况info1_5评分*/
    var nlqkScore = function(local,parentlocal){
        local.find('table[opt=PAnlqk] :input[name=nl_fenl]+label').each(function(){
            $(this).bind('click',function(){
                local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl]+label').removeClass("checked");
                local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl]').removeAttr("checked");
                if($(this).hasClass("checked")){
                    var v=$(this).prev().val();
                    local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl][value='+ v +']+label').addClass("checked");
                    local.find('fieldset[opt=result1]').find(':input[name=sum_nl_fenl][value='+ v +']').attr("checked","checked");
                }else
                    var v = 0;
                local.find(':input[name=nl_pingguf]').attr("readonly","readonly").val(v/2)
                parentlocal.find('fieldset[opt=result1] :input[name=sum_nl_pingguf]').attr("readonly","readonly").val(v/2)
                calculate(parentlocal);     //计算评估总分
            })
        })
    }
    /*数据填充*/
    var fillDatas = function(local,datas){
        local.find('[opt=csrq]').datebox('setValue',datas.birthd)
        local.find('[name=nl_pingguf]').val(datas.nl_pingguf)
        local.find('[name=nl_pingguy]').val(datas.nl_pingguy)
        local.find('input[name=nl_fenl][type=radio][value='+datas.nl_fenl+']').attr("checked","checked");
        local.find('input[name=nl_fenl][type=radio][value='+datas.nl_fenl+']+label').addClass("checked");
    }
    return {
        render:function(local,option){
            console.log("年龄情况")
            var parentlocal = option.plocal
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')')
            nlqkScore(local,parentlocal);       //评分
            fillDatas(local,datas);             //数据填充
        }
    }
})