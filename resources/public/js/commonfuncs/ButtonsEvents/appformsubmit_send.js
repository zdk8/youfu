/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        render:function(item,datares){
            var data=datares.record;
            $.messager.confirm('确定提交申请?', '你正在试图提交申请.你想继续么?', function(r){
                if (r){
                     var callback=function(){
                        $.messager.alert('操作成功','提交申请成功!');
                        var freshgrid=$('#businessgrid');
                        if(freshgrid.length>0)$('#businessgrid').datagrid('reload');
                        if($('#mainform').length>0)$('#tabs').tabs('close',1);
                     }
                     require(['commonfuncs/ButtonsEvent'],function(ButtonsEvent){
                         ButtonsEvent.changeapplystatus(data.id,data.process,callback);
                     });

                }
            });

        }

    }

    return a;
});
