define(['views/pension/serviceassinfo/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/getapplylist',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=local.find('[action=view]');
                        var commitbtns=local.find('[action=commit]');
                        var deltns=local.find('[action=del]');
                        var btns_arr=[viewbtns,commitbtns,deltns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){
                                        if($(this).attr("action")=='view'){
                                            layer.load();
                                            var title = "【"+record.name+'】服务申请详细信息';
                                            if(record.apply_type == '1'){
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/serviceassinfo/PensionServiceApply_1&2.htm',
                                                    jsfile:'views/pension/serviceassinfo/PensionServiceApply_1&2',
                                                    queryParams:{
                                                        actiontype:'info',         //（详细信息）操作方式
                                                        data:record,
                                                        title:title,
                                                        refresh:refreshGrid
                                                    }
                                                });
                                            }else if(record.apply_type == '3'){
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/serviceassinfo/PensionServiceApply_3.htm',
                                                    jsfile:'views/pension/serviceassinfo/PensionServiceApply_3',
                                                    queryParams:{
                                                        actiontype:'info',         //（详细信息）操作方式
                                                        data:record,
                                                        title:title,
                                                        refresh:refreshGrid
                                                    }
                                                });
                                            }
                                        }else if($(this).attr("action")=='commit'){         //提交
                                            layer.confirm('是否提交?', {icon: 3, title:'温馨提示'}, function(index){
                                                layer.close(index);
                                                $.ajax({
                                                    url:'audit/addauditapply',
                                                    type:'post',
                                                    data:{
                                                        jja_id:record.jja_id,
                                                        identityid:record.identityid,
                                                        name:record.name,
                                                        apply_type:record.apply_type,
                                                        ishandle:record.ishandle
                                                    },
                                                    success: function (data) {
                                                        if(data == "true"){
                                                            layer.closeAll('loading');
                                                            layer.alert('提交完成', {icon: 6});
                                                            refreshGrid();
                                                        }else{
                                                            layer.closeAll('loading');
                                                            layer.alert('提交失败', {icon: 5});
                                                        }
                                                    }
                                                })
                                            });
                                        }else if($(this).attr("action")=='del'){
                                            layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                                layer.close(index);
                                                layer.load();
                                                $.ajax({
                                                    url:'audit/deleteapplybyid',
                                                    type:'post',
                                                    data:{
                                                        jja_id:record.jja_id
                                                    },
                                                    success: function (data) {
                                                        if(data == "true"){
                                                            layer.closeAll('loading');
                                                            layer.alert('删除成功', {icon: 6});
                                                            refreshGrid();
                                                        }else{
                                                            layer.closeAll('loading');
                                                            layer.alert('删除失败', {icon: 5});
                                                        }
                                                    }
                                                })
                                            });
                                        }
                                    });
                                })(i);
                            }
                            //check
                            if(rows[i].userid) {
                                localDataGrid.datagrid('checkRow', i);
                            }
                        }
                    },
                    striped:true
                })

            local.find('[opt=query]').click(function(){
                localDataGrid.datagrid('load',{
                    name:local.find('[opt=name]').val(),
                    identityid:local.find('[opt=identityid]').val()
                })
            })

            /*1、2类服务申请*/
            local.find('[opt=type_12]').click(function () {
                var title = "1、2类服务申请";
                if($("#tabs").tabs('getTab',title)){
                    $("#tabs").tabs('select',title)
                }else{
                    cj.showContent({                                          //详细信息(tab标签)
                        title:title,
                        htmfile:'text!views/pension/serviceassinfo/PensionServiceApply_1&2.htm',
                        jsfile:'views/pension/serviceassinfo/PensionServiceApply_1&2',
                        queryParams:{
                            actiontype:'add',         //（处理）操作方式
                            title:title,
                            refresh:refreshGrid
                        }
                    })
                }
            });
            /*3类服务申请*/
            local.find('[opt=type_3]').click(function () {
                var title = "3类服务申请";
                if($("#tabs").tabs('getTab',title)){
                    $("#tabs").tabs('select',title)
                }else{
                    cj.showContent({                                          //详细信息(tab标签)
                        title:title,
                        htmfile:'text!views/pension/serviceassinfo/PensionServiceApply_3.htm',
                        jsfile:'views/pension/serviceassinfo/PensionServiceApply_3',
                        queryParams:{
                         actiontype:'add',         //（处理）操作方式
                         title:title,
                         refresh:refreshGrid
                         }
                    })
                }
            });

            /*var showDlg = function(refreshGrid,record,data){
                var title = "【"+record.name+'】信息评估'
                if($("#tabs").tabs('getTab',title)){
                    $("#tabs").tabs('select',title)
                }else{
                    $("#tabs").tabs('add', {
                        title: title,
                        href: 'getPensionServiceAssHtml?jja_id='+record.jja_id,
                        closable: true
                    })
                    var timer = window.setInterval(function () {
                        var local=$("#tabs").tabs('getTab',title)
                        if (local && local.find('[opt=info1_table]').length) {
                            window.clearInterval(timer);
                            psafile.render(local,{queryParams:{
                                title:title,
                                data:data,
                                record:record,
                                refresh:refreshGrid,
                                actionType:"assessment"
                            }});
                        }else{
                            //console.log('oops....info1_table is not ready ')
                        }
                    }, 200);
                }
            }*/
        }
    }
})