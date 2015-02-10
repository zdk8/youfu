define(function(){
    var render = function(local,option){
        var fwrygl = local.find('[opt=furymanagement]');        //服务人员管理
        var refresh = local.find('.searchbtn');               //刷新
        var departname = local.find('[opt=departname]');        //机构名称
        var name = local.find('[opt=name]');                     //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        var refreshGrid = function(){
            fwrygl.datagrid("reload")
        }
        fwrygl.datagrid({
            url:'audit/getalldepservice',
            queryParams:{
            },
            type:'post',
            onLoadSuccess:function(data){
                var viewbtn = local.find("[action=view]")
                var updatebtn = local.find("[action=update]")
                var cancellation = local.find('[action=cancellation]');     //注销入住人员
                var rows=data.rows;
                var btns_arr=[viewbtn,cancellation,updatebtn];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "cancellation"){             //注销
                                    var departname = record.departname;         //机构名称
                                    var testmsg = "是否注销人员【<label style='color: darkslategrey;font-weight: bold'>"+record.servicername+"</label>】?"
                                    $.messager.confirm('温馨提示', testmsg, function(r){
                                        if (r){
                                            $.ajax({
                                                url:'pension/oldpeoplecheckout',
                                                type:'post',
                                                data:{
                                                    opd_id:record.s_id
                                                },
                                                success:function(data){
                                                    if(data.success){
                                                        cj.slideShow('人员注销成功');
                                                        fwrygl.datagrid("reload")
                                                    }
                                                },
                                                dataType:'json'
                                            })
                                        }
                                    });
                                }else if(action = "view"){
                                    var title = "【"+record.servicername+'】详细信息';
                                    if($("#tabs").tabs('getTab',title)){
                                        $("#tabs").tabs('select',title)
                                    }else{
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:title,
                                            htmfile:'text!views/pension/ServiceAgenciesPeople.htm',
                                            jsfile:'views/pension/ServiceAgenciesPeople',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
//                                                data:data,                   //填充数据
                                                record:record,
                                                title:title,
                                                refresh:refreshGrid                //刷新
                                            }
                                        })
                                    }
                                }else if(action = "update"){
                                    var title = "【"+record.servicername+'】信息修改';
                                    if($("#tabs").tabs('getTab',title)){
                                        $("#tabs").tabs('select',title)
                                    }else{
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:title,
                                            htmfile:'text!views/pension/ServiceAgenciesPeople.htm',
                                            jsfile:'views/pension/ServiceAgenciesPeople',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
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
            fwrygl.datagrid('load',{
                departname:departname.val(),
                servicername:name.val()
            });
        })
    }

    return {
        render:render
    }
})