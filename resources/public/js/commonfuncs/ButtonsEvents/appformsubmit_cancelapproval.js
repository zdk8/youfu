

define(function(){

    var a={
        render:function(item,datares){
            var data=datares.record;
            var s=data.processstatus;
            $.messager.confirm('确定取消'+s+'?', '你正在试图取消'+s+'.你想继续么?', function(r){
                if (r){
                     var callback=function(){
                        $.messager.alert('操作成功','取消'+s+'成功!');
                        var freshgrid=$('#businessgrid');
                        if(freshgrid.length>0)$('#businessgrid').datagrid('reload');
                        if($('#mainform').length>0)$('#tabs').tabs('close',1);
                     }
                    var processstatus="";
                    var approvalname="";
                    if(data.processstatus==processdiction.steptwo){
                        processstatus=processdiction.steptwo;
                        approvalname="街道/乡镇审核";
                    }if(data.processstatus==processdiction.stepthree){
                        processstatus=processdiction.stepthree;
                        approvalname="区/县/市审批";
                    }
                    var params = {
                        businessid:data.id,
                        processstatus:processstatus,
                        approvalname:approvalname
                    };
                    require(['commonfuncs/AjaxForm'],function(ajaxform){
                        ajaxform.ajaxsend("post","json","ajax/cancelApproval.jsp",params,callback,null);
                    });

                }
            });

        }

    }

    return a;
});
