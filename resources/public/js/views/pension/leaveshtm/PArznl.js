define(function(){
    /*认知能力info1_4评分*/
    var rznlScore = function(local,parentlocal){
        local.find('table[opt=PArznl] :input[type=radio]+label').each(function(i){
            $(this).bind('click',function(){
                var radioValue=0;
                if($(this).prev()[0].checked){
                    radioValue= ($(this).prev()).val();
                    $($(this).parent().parent().children().last().children()[0]).val(radioValue);
                }else{
                    $($(this).parent().parent().children().last().children()[0]).removeAttr("value");
                }
                var rz_zongfen=0;
                local.find('table[opt=PArznl]').find(':input[opt=info9pingfeng]').each(function(){
                    rz_zongfen+=Number($(this).val())
                })
                local.find(':input[name=rz_zongfen]').attr("readonly","readonly").val(rz_zongfen)
                local.find(':input[name=rz_pingguf]').attr("readonly","readonly").val(rz_zongfen/2)
                local.find(':input[name=rz_jiel]+label').removeClass("checked");
                local.find(':input[name=rz_jiel]').removeAttr("checked");
                if(rz_zongfen == 0){
                    local.find(':input[name=rz_jiel]:eq(0)').attr("checked","checked");
                    local.find(':input[name=rz_jiel]:eq(0)+label').addClass("checked");
                }else if(rz_zongfen > 0 &&rz_zongfen <= 5){
                    local.find(':input[name=rz_jiel]:eq(1)').attr("checked","checked");
                    local.find(':input[name=rz_jiel]:eq(1)+label').addClass("checked");
                }else if(rz_zongfen > 5 &&rz_zongfen <= 10){
                    local.find(':input[name=rz_jiel]:eq(2)').attr("checked","checked");
                    local.find(':input[name=rz_jiel]:eq(2)+label').addClass("checked");
                }else{
                    local.find(':input[name=rz_jiel]:eq(3)').attr("checked","checked");
                    local.find(':input[name=rz_jiel]:eq(3)+label').addClass("checked");
                }
                parentlocal.find('fieldset[opt=result1]').find(':input[name=sum_rz_pingguf]').val(rz_zongfen/2);
                calculate(parentlocal);     //计算评估总分
            })
        })
    }
    /*数据填充*/
    var fillDatas = function(local,datas){
        local.find('table[opt=PArznl] :input[name=rz_zongfen]').val(datas.rz_zongfen)
        local.find('table[opt=PArznl] :input[name=rz_pingguf]').val(datas.rz_pingguf)
        local.find('table[opt=PArznl] :input[name=rz_pingguy]').val(datas.rz_pingguy)
        for(var key in datas){
            var name = key
            var value = datas[key]
            if(local.find('input[name='+name+']:radio').val()){
                local.find('input[name='+name+'][type=radio][value='+value+']').attr("checked","checked");
                local.find('input[name='+name+'][type=radio][value='+value+']+label').addClass("checked");
                local.find(':input[oth='+name+']').val(value)
            }else if(local.find('input[name='+name+']:checkbox').val()){
                local.find('input[name='+name+'][type=checkbox][value='+value+']').attr("checked","checked");
                local.find('input[name='+name+'][type=checkbox][value='+value+']+label').addClass("checked");
            }
        }
    }
    return {
        render:function(local,option){
            console.log("认知能力")
            var parentlocal = option.plocal;
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')');
            rznlScore(local,parentlocal);     //评分
            fillDatas(local,datas);           //数据填充
        }
    }
})