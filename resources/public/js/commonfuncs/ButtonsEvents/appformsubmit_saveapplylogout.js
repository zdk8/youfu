/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        render:function(item,datares){
            var record=datares.record;

            require(['commonfuncs/AjaxForm'],function(ajaxform){
                var callback=function(){
                    $.messager.confirm('提示信息', '已保存，是否留在该页面?', function(r){
                        if (r){
                        }
                        else{
                            $('#tabs').tabs('close',1);
                        }
                    });
                }
                ajaxform.submitForm('savelogout',datares,callback);
            });

        }

    }

    return a;
});
