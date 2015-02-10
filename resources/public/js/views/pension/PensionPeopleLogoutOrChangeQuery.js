define(['views/pension/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/getauditdata',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=local.find('[action=view]');
                        var logoutbtns=local.find('[action=logout]');
                        var changebtns=local.find('[action=change]');
                        var btns_arr=[viewbtns,logoutbtns,changebtns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){
                                        if($(this).attr("action")=='view'){
                                            var title = "【"+record.name+'】服务申请详细信息'
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
                                                            refresh:refreshGrid,
                                                            actionType:"view"
                                                        }});
                                                    }else{
                                                        console.log('oops....info1_table is not ready ')
                                                    }
                                                }, 200);
                                            }
                                            /*cj.showContent({                                          //详细信息(tab标签)
                                                title:title,
                                                htmfile:'text!views/pension/PensionServiceApply.htm',
                                                jsfile:'views/pension/PensionServiceApply',
                                                queryParams:{
                                                    actiontype:'information',         //（详细信息）操作方式
                                                    data:record,
                                                    title:title,
                                                    refresh:refreshGrid
                                                }
                                            })*/
                                            //viewRoleInfo(record);
                                        }else if($(this).attr("action")=='logout'){         //注销
                                            var title = "【"+record.name+'】人员注销'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
//                                                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/PensionPeopleLogout.htm',
                                                    jsfile:'views/pension/PensionPeopleLogout',
                                                    queryParams:{
                                                        actiontype:'logout',         //（处理）操作方式
                                                        data:record,
                                                        title:title,
                                                        refresh:refreshGrid
                                                    }
                                                })
                                            }
                                        }else if($(this).attr("action")=='change'){               //变更
                                            var title = "【"+record.name+'】信息变更'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
//                                                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                                cj.showContent({                                          //变更详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/PensionServiceApply.htm',
                                                    jsfile:'views/pension/PensionServiceApply',
                                                    queryParams:{
                                                        actiontype:'change',         //（处理）操作方式
                                                        data:record,
                                                        title:title,
                                                        refresh:refreshGrid
                                                    }
                                                })
                                            }
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
                    striped:true,
                    toolbar:local.find('div[tb]')
                })

            /*老人类型选择*/
            var ppselect = local.find('[opt=ppselect]');
            ppselect.change(function () {
                localDataGrid.datagrid('load',{
                    oldtype:ppselect.val()
                })
            })

            local.find('.searchbtn').click(function(){
                localDataGrid.datagrid('load',{
                    datatype:local.find('[opt=ppselect]').val(),
                    name:local.find('[opt=name]').val(),
                    identityid:local.find('[opt=identityid]').val(),
                    minage:local.find('[opt=minage]').val(),
                    maxage:local.find('[opt=maxage]').val()
                })
            })
        }
    }
})