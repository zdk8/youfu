define(function(){
    /*填充数据*/
    var fillDatas = function(local,datas){
        local.find(':input[name=jb_pingguy]').val(datas.jb_pingguy)
        local.find('textarea[name=jb_beiz]').val(datas.jb_beiz)
        for(var key in datas){
            var name = key
            var value = datas[key]
            if(local.find('input[name='+name+']:radio').val()){
                local.find('input[name='+name+'][type=radio][value='+value+']').attr("checked","checked");
                local.find('input[name='+name+'][type=radio][value='+value+']+label').addClass("checked");
            }
        }
    }
    return {
        render:function(local,option){
            var parentlocal = option.plocal;
            var datas = eval('('+parentlocal.find('[opt=jsondata]').val()+')');
            fillDatas(local,datas);     //数据填充
        }
    }
})