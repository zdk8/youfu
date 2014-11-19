/**
 * Created by Administrator on 2014/9/29.
 */
define(function(){
    return {
        render:function(local,options){
            require(['text!views/dmxt/SuoZaiZhengQuA.htm','text!views/dmxt/SuoZaiZhengQuB.htm'],function(htmA,htmB){
                if(local.find('tr[opt=suozaizhengqu]').length){
                    local.find('tr[opt=suozaizhengqu]').append(htmB);
                }else if(local.find('table[opt=suozaizhengqu]').length){
                    local.find('table').append(htmA);
                }
            })

        }
    }
})