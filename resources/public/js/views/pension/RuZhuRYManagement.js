define(function(){
    var render = function(local,option){
        var rzrygl = local.find('[opt=ruzhurymanagement]');        //入住人员管理
        var refresh = local.find('[opt=refresh]');               //刷新
        var departname = local.find('[opt=departname]');        //机构名称
        var name = local.find('[opt=name]');                     //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        rzrygl.datagrid({
            url:'pension/getalloldpeopledepart',
            queryParams:{
                deptype:'jigou'
            },
            type:'post',
            onLoadSuccess:function(data){
               /* var updates = local.find('[action=update]');           //修改
                var del = local.find('[action=delete]');                //删除
                var addrzry = local.find('[action=addrzry]');                //添加入住人员*/
                var cancellation = local.find('[action=cancellation]');     //注销入住人员
                var rows=data.rows;
//                var btns_arr=[updates,del,addrzry];
                var btns_arr=[cancellation];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "cancellation"){             //注销
                                    var departname = record.departname;         //机构名称
                                    var testmsg = "是否注销人员【<label style='color: darkslategrey;font-weight: bold'>"+record.name+"</label>】?"
                                    $.messager.confirm('温馨提示', testmsg, function(r){
                                        if (r){
                                            $.ajax({
                                                url:'pension/oldpeoplecheckout',
                                                type:'post',
                                                data:{
                                                    opd_id:record.opd_id
                                                },
                                                success:function(data){
                                                    if(data.success){
                                                        alert("人员注销成功")
                                                        rzrygl.datagrid("reload")
                                                    }
                                                },
                                                dataType:'json'
                                            })
                                        }
                                    });
                                }
                            });
                        })(i)
                    }
                }
            }
        })
        refresh.click(function(){
//            rzrygl.datagrid('reload');
            rzrygl.datagrid('load',{
                deptype:'jigou',
                departname:departname.searchbox("getValue"),
                name:name.searchbox("getValue"),
                identityid:identityid.searchbox("getValue")
            });
        })
    }

    return {
        render:render
    }
})