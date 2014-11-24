/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        render:function(item,datares){
            var data=datares.record;
            $.messager.confirm('确定取消提交?', '你正在试图取消提交.你想继续么?', function(r){
                if (r){
                     var callback=function(){
                        $.messager.alert('操作成功','取消提交成功!');
                        var freshgrid=$('#businessgrid');
                        if(freshgrid.length>0)$('#businessgrid').datagrid('reload');
                        if($('#mainform').length>0)$('#tabs').tabs('close',1);
                     }
                     require(['commonfuncs/ButtonsEvent'],function(ButtonsEvent){
                         ButtonsEvent.changeapplystatus(data.id,processdiction.stepzero,callback);
                     });

                }
            });

        }

    }

    return a;
});
