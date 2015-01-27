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
                                                /*$.ajax({
                                                    url:"audit/getassessbyid",
                                                    type:"post",
                                                    data:{
                                                        jja_id:record.jja_id
                                                    },
                                                    dataType: 'json',
                                                    success:function(data){
                                                        if(data){
                                                            $("#tabs").tabs('add', {
                                                                title: title,
                                                                href: 'testhtml?jja_id='+record.jja_id,
                                                                closable: true
                                                            })
                                                            var timer = window.setInterval(function () {
                                                                var local=$("#tabs").tabs('getTab',title)
                                                                if (local && local.find('[opt=info1_table]').length) {
                                                                    window.clearInterval(timer);
                                                                    Test.render(local,{queryParams:{
                                                                        title:title,
                                                                        data:data,
                                                                        refresh:refreshGrid
                                                                    }});
                                                                }else{
                                                                    console.log('oops....info1_table is not ready ')
                                                                }
                                                            }, 200);
                                                        }
                                                    }
                                                })*/

                                                /*cj.showHtmlIframe({             //详细信息(tab标签)、评估
                                                    title:title,
                                                    htmfile:'PensionAssessmentInfo',
                                                    jsfile:'views/pension/PensionAssessmentInfo',
                                                    queryParams:{
                                                        actiontype:'assessment',         //（处理）操作方式
                                                        data:data,
                                                        record:record,
                                                        title:title,
                                                        refresh:refreshGrid
                                                    }
                                                })*/
//                                                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                                /*$.ajax({
                                                    url:"audit/getassessbyid",
                                                    type:"post",
                                                    data:{
                                                        jja_id:record.jja_id
                                                    },
                                                    dataType: 'json',
                                                    success:function(data){
                                                        if(data){
                                                            cj.showContent({            //详细信息(tab标签)、评估
                                                                title:title,
                                                                htmfile:'text!views/pension/PensionAssessmentInfo.htm',
                                                                jsfile:'views/pension/PensionAssessmentInfo',
                                                                queryParams:{
                                                                    actiontype:'assessment',         //（处理）操作方式
                                                                    data:data[0],
                                                                    record:record,
                                                                    title:title,
                                                                    refresh:refreshGrid
                                                                }
                                                            })
                                                            setTimeout(function(){
                                                                showProcess(false);
                                                            },1000)
                                                        }
                                                    }
                                                })*/
                                            }
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
                    name:local.find('[opt=name]').searchbox('getValue'),
                    identityid:local.find('[opt=identityid]').searchbox('getValue')
                })
            })
        }
    }
})