define(function(){
    var render = function(local,option){
        var rzrygl = local.find('[opt=ruzhurymanagement]');        //入住人员管理
        var refresh = local.find('[opt=refresh]');               //刷新
        var departname = local.find('[opt=departname]');        //机构名称
        var name = local.find('[opt=name]');                     //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        var refreshGrid = function(){
            rzrygl.datagrid("reload")
        }
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
                var viewbtn = local.find("[action=view]")
                var cancellation = local.find('[action=cancellation]');     //注销入住人员
                var rows=data.rows;
//                var btns_arr=[updates,del,addrzry];
                var btns_arr=[viewbtn,cancellation];
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
                                                        cj.slideShow('人员注销成功');
                                                        rzrygl.datagrid("reload")
                                                    }
                                                },
                                                dataType:'json'
                                            })
                                        }
                                    });
                                }else if(action = "view"){
                                    var title = "【"+record.name+'】详细信息';
                                    if($("#tabs").tabs('getTab',title)){
                                        $("#tabs").tabs('select',title)
                                    }else{
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:title,
                                            htmfile:'text!views/pension/RuZhuRYDlg.htm',
                                            jsfile:'views/pension/RuZhuRYDlg',
                                            queryParams:{
                                                actiontype:'view',         //（处理）操作方式
//                                                data:data,                   //填充数据
                                                record:record,
                                                title:title,
                                                refresh:refreshGrid                //刷新
                                            }
                                        })
                                    }
                                }
                            });
                        })(i)
                    }
                }
            },
            toolbar:local.find('div[tb]')
        })
        refresh.click(function(){
//            rzrygl.datagrid('reload');
            rzrygl.datagrid('load',{
                deptype:'jigou',
                departname:departname.val(),
                name:name.val(),
                identityid:identityid.val()
            });
        })
    }

    return {
        render:render
    }
})