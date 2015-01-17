define(function(){
    /*填充数据*/
    var fillDatas = function(local,datas){
        if(datas){
            for(var key in datas){
                var name = key;
                var value = datas[key];
                local.find('textarea[name='+name+']').val(value)
                if(local.find('input[name='+name+']:radio').val()){
                    local.find('input[name='+name+'][type=radio][value='+value+']').attr("checked","checked");
                    local.find('input[name='+name+'][type=radio][value='+value+']+label').addClass("checked");
                }else if(local.find('input[name='+name+']:checkbox').val()){
                    local.find('input[name='+name+'][type=checkbox][value='+value+']').attr("checked","checked");
                    local.find('input[name='+name+'][type=checkbox][value='+value+']+label').addClass("checked");
                }
            }
        }
    }
    return {
        render:function(local,option){
            var parentlocal = option.plocal
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')')
            fillDatas(local,datas);             //填充数据
            if(option.option && option.option.queryParams.actionType == "dealwith"){ //处理时进入
                local.find('textarea[class=input-text]').attr("readonly","readonly")
            }
        }
    }
})