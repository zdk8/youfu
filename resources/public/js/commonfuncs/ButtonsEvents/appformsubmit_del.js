/**
 * Created by jack on 14-1-6.
 */

define(function(){

    var a={
        render:function(item,datares){
            var record=datares.record;
            $.messager.confirm('确定要删除此申请?', '你正在试图删除选中的 <a><font color="red">'+ record['displayname']+'</font></a> 的申请.你想继续么?', function(r){
                if (r){
                    //alert('confirmed: '+r);
                    if(record['processstatustype']===processstatustype.ok){

                        var params = {
                            businessid:record.id
                        };
                        var successFunc = function(){
                            $.messager.alert('操作成功','删除操作成功!');
                            $('#businessgrid').datagrid('reload');
                        };
                        var complete=function(){

                        };

                        require(['commonfuncs/AjaxForm'],function(ajaxform){
                            ajaxform.ajaxsend("post","json","ajax/delbusinessbybid.jsp",params,successFunc,complete);
                        });

                    }else{
                        var params = {
                            businessid:record.id,
                            processstatustype:processstatustype.ok,
                            processstatus:processdiction.stepthree
                        };
                        var successFunc = function (data, status,xhr) {
                            $.messager.alert('操作成功','删除操作成功!');
                            $('#businessgrid').datagrid('reload');

                        };
                        var failFunc = function (xhr, status,errthrow) {
                            $.messager.alert('操作失败','检查web服务是否异常!');

                        };
                        var complete=function(){

                        };

                        require(['commonfuncs/AjaxForm'],function(ajaxform){
                            ajaxform.ajaxsend("post","json","ajax/changeprocessstatustype.jsp",params,successFunc,complete,failFunc);
                        });

                    }

                }
            });
        }

    }

    return a;
});
