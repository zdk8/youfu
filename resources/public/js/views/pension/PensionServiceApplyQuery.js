define(['views/pension/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/getallapply',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=local.find('[action=view]');
                        var assessmentbtns=local.find('[action=assessment]');
                        var grantbtns=local.find('[action=grant]');
                        var btns_arr=[viewbtns,assessmentbtns,grantbtns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){
                                        if($(this).attr("action")=='view'){
                                            var title = "【"+record.name+'】服务申请详细信息'
                                            cj.showContent({                                          //详细信息(tab标签)
                                                title:title,
                                                htmfile:'text!views/pension/PensionServiceApply.htm',
                                                jsfile:'views/pension/PensionServiceApply',
                                                queryParams:{
                                                    actiontype:'info',         //（详细信息）操作方式
                                                    data:record,
                                                    title:title,
                                                    refresh:refreshGrid
                                                }
                                            })
                                            //viewRoleInfo(record);
                                        }else if($(this).attr("action")=='assessment'){         //评估
                                            var userlength = cj.getUserMsg().regionid.length;
                                            var aul = record.aulevel;
                                            showDlg(refreshGrid,record,data);
                                            /*if(userlength == 12){
                                                $.messager.alert('温馨提示','对不起,你没有该权限!','info');
                                            }else if(userlength == 9){
                                                console.log(aul)
                                                if(aul == 1 || aul == null || aul == 0){
                                                    showDlg(refreshGrid,record)
                                                }else{
                                                    $.messager.alert('温馨提示','对不起,你没有审批权限!','info');
                                                }
                                            }else if(userlength == 6){
                                                showDlg(refreshGrid,record)
                                            }*/

                                        }else if($(this).attr("action")=='grant'){
                                            //grant(record);
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

            local.find('.searchbtn').click(function(){
                localDataGrid.datagrid('load',{
                    name:local.find('[opt=name]').val(),
                    identityid:local.find('[opt=identityid]').val()
                })
            })

            var showDlg = function(refreshGrid,record,data){
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
                                refresh:refreshGrid,
                                actionType:"assessment"
                            }});
                        }else{
                            console.log('oops....info1_table is not ready ')
                        }
                    }, 200);
                }
            }
        }
    }
})