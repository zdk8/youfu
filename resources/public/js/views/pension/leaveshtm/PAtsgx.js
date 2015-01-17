/*特殊贡献*/
define(function(){
    /*处理特殊贡献（初始化checkbox）*/
    var tsgxScore = function(local,parentlocal){
        local.find(":input[type=checkbox] + label").each(function () {
            if ($(this).prev()[0].checked) {
                $(this).addClass("checked");
            }
        }).toggle(function () {
                $(this).prev()[0].checked = true;
                $(this).addClass("checked");
                $($(this).prev()[0]).attr("checked","checked");
            },
            function () {
                $(this).prev()[0].checked = false;
                $(this).removeClass("checked");
                $($(this).prev()[0]).removeAttr("checked");
            }).prev().hide();
        var checks = [];
        local.find('table[opt=PAtsgx] :input[type=checkbox]+label').each(function(i){
            checks.push($(this));
            $(this).bind('click',function(){
                var sum=0;
                for(var i=0;i<checks.length;i++){
                    if(checks[i].prev()[0].checked){
                        sum+=Number(checks[i].prev().val());
                    }
                }
                local.find( 'input[name=gx_pingguf]').attr("readonly","readonly").val(sum/2);
                //同步到result1
                parentlocal.find('input[name=sum_gx_pingguf]').attr("readonly","readonly").val(sum/2);
                calculate(parentlocal);     //计算评估总分
            })
        })
    }
    /*数据填充*/
    var fillDatas = function(local,datas){
        local.find('[name=gx_pingguf]').val(datas.gx_pingguf)
        local.find('[name=gx_pingguy]').val(datas.gx_pingguy)
        local.find('input[opt=gx_laom][type=checkbox][value='+datas.gx_laom+']').attr("checked","checked");
        local.find('input[opt=gx_laom][type=checkbox][value='+datas.gx_laom+']+label').addClass("checked");
        local.find('input[opt=gx_youf][type=checkbox][value='+datas.gx_youf+']').attr("checked","checked");
        local.find('input[opt=gx_youf][type=checkbox][value='+datas.gx_youf+']+label').addClass("checked");
    }
    return {
        render:function(local,option){
            console.log("特殊贡献")
            var parentlocal = option.plocal
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')')
            tsgxScore(local,parentlocal);       //评分
            fillDatas(local,datas);             //数据填充



        }
    }
})