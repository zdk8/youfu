define(['views/pension/serviceassinfo/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/get-removeaudit',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=local.find('[action=view]');
                        var dealwithbtns=local.find('[action=dealwith]');
                        var btns_arr=[viewbtns,dealwithbtns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){
                                        if($(this).attr("action")=='view'){
                                            var title = "【"+record.messagebrief.
                                                substring(record.messagebrief.indexOf("：")+1,record.messagebrief.indexOf(","))+'】服务评估详细信息'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
//                                                getapplybyidFunc({jja_id:record.bstablepk,title:title,record:record,aulevel:record.aulevel})
                                                $("#tabs").tabs('add', {
                                                    title: title,
                                                    href: 'getPensionServiceAssHtml?jja_id='+record.bstablepk,
                                                    closable: true
                                                })
                                                var timer = window.setInterval(function () {
                                                    var local=$("#tabs").tabs('getTab',title)
                                                    if (local && local.find('[opt=info1_table]').length) {
                                                        window.clearInterval(timer);
                                                        psafile.render(local,{queryParams:{
                                                            title:title,
                                                            data:record,
                                                            refresh:refreshGrid,
                                                            actionType:"view"
                                                        }});
                                                    }else{
                                                        console.log('oops....info1_table is not ready ')
                                                    }
                                                }, 200);
                                            }
                                        }else if($(this).attr("action")=='dealwith'){         //注销处理
                                            var title = "【"+record.messagebrief.
                                                            substring(record.messagebrief.indexOf("：")+1,record.messagebrief.indexOf(","))+
                                                                '】人员注销处理'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
                                                getapplybyidFunc({jja_id:record.bstablepk,title:title,record:record,aulevel:record.aulevel})
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
                    striped:true
                })

            function getapplybyidFunc(params){
//                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                $.ajax({
                    url:"audit/getapplybyid",
                    type:"post",
                    data:{
                        jja_id:params.jja_id
                    },
                    dataType: 'json',
                    success:function(data){
                        if(data){
                            cj.showContent({                                          //详细信息(tab标签)
                                title:params.title,
                                htmfile:'text!views/pension/serviceassinfo/PensionPeopleLogout.htm',
                                jsfile:'views/pension/serviceassinfo/PensionPeopleLogout',
                                queryParams:{
                                    actiontype:'logoutdealwith',         //（处理）操作方式
                                    data:data[0],
                                    title:params.title,
                                    refresh:refreshGrid,
                                    record:params.record,
                                    aulevel:params.aulevel
                                }
                            })
                            /*setTimeout(function(){
                                showProcess(false);
                            },500)*/
                        }
                    }
                })
            }

            local.find('[opt=query]').click(function(){
                localDataGrid.datagrid('load',{
                    name:local.find('[opt=name]').val(),
                    identityid:local.find('[opt=identityid]').val()
                })
            })
        }
    }
})