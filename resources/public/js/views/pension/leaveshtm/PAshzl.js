/*生活自理能力*/
define(function(){
    /*生活自理能力info1_1评分*/
    var shzlScore = function(local,parentlocal){
        local.find('table[opt=PAshzl] :input[type=radio]+label').each(function(i){
            $(this).bind('click',function(){
                var radioValue=0;
                if($(this).prev()[0].checked){
                    radioValue= ($(this).prev()).val();
                    $($(this).parent().parent().children().last().children()[0]).val(radioValue);
                }else{
                    $($(this).parent().parent().children().last().children()[0]).removeAttr("value");
                }
                var sh_zongf=0;
                local.find('table[opt=PAshzl]').find(':input[opt=info1pingfeng]').each(function(){
//                    $(this).attr("readonly","readonly");
                    sh_zongf+=Number($(this).val())
                })
                local.find(':input[name=sh_zongf]').val(sh_zongf)
                local.find(':input[name=sh_pingguf]').val(sh_zongf/2)
                local.find(':input[name=sh_jiel]+label').removeClass("checked");
                local.find(':input[name=sh_jiel]').removeAttr("checked");
                if(sh_zongf == 0){
                    local.find(':input[name=sh_jiel]:eq(0)').attr("checked","checked");
                    local.find(':input[name=sh_jiel]:eq(0)+label').addClass("checked");
                    parentlocal.find(':input[name=sh_jiel_zj]:eq(0)').attr("checked","checked");
                    parentlocal.find(':input[name=sh_jiel_zj]:eq(0)+label').addClass("checked");
                }else if(sh_zongf > 0 &&sh_zongf <= 10){
                    local.find(':input[name=sh_jiel]:eq(1)').attr("checked","checked");
                    local.find(':input[name=sh_jiel]:eq(1)+label').addClass("checked");
                    parentlocal.find(':input[name=sh_jiel_zj]:eq(1)').attr("checked","checked");
                    parentlocal.find(':input[name=sh_jiel_zj]:eq(1)+label').addClass("checked");
                }else if(sh_zongf > 10 &&sh_zongf <= 50){
                    local.find(':input[name=sh_jiel]:eq(2)').attr("checked","checked");
                    local.find(':input[name=sh_jiel]:eq(2)+label').addClass("checked");
                    parentlocal.find(':input[name=sh_jiel_zj]:eq(2)').attr("checked","checked");
                    parentlocal.find(':input[name=sh_jiel_zj]:eq(2)+label').addClass("checked");
                }else{
                    local.find(':input[name=sh_jiel]:eq(3)').attr("checked","checked");
                    local.find(':input[name=sh_jiel]:eq(3)+label').addClass("checked");
                    parentlocal.find(':input[name=sh_jiel_zj]:eq(3)').attr("checked","checked");
                    parentlocal.find(':input[name=sh_jiel_zj]:eq(3)+label').addClass("checked");
                }
                parentlocal.find('fieldset[opt=result1]').find(':input[name=sum_sh_pingguf]').val(sh_zongf/2);
                calculate(parentlocal);     //计算评估总分
            })
        })
    }
    /*生活自理能力数据填充*/
    var fillDatas = function(local,datas){
        local.find('table[opt=PAshzl] :input[name=sh_zongf]').val(datas.sh_zongf)
        local.find('table[opt=PAshzl] :input[name=sh_pingguf]').val(datas.sh_pingguf)
        local.find('table[opt=PAshzl] :input[name=sh_pingguy]').val(datas.sh_pingguy)
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
            console.log("生活自理")
            var parentlocal = option.plocal;
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')')
            shzlScore(local,parentlocal);  //评分
            fillDatas(local,datas)         //数据填充



        }
    }



})