define(function(){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'/audit/getallapply',
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
                                            cj.showContent({                                          //详细信息(tab标签)
                                                title:record.name+'详细信息',
                                                htmfile:'text!views/pension/PensionServiceApply.htm',
                                                jsfile:'views/pension/PensionServiceApply',
                                                queryParams:{
                                                    actiontype:'info',         //（处理）操作方式
                                                    data:record
                                                }
                                            })
                                            //viewRoleInfo(record);
                                        }else if($(this).attr("action")=='assessment'){         //评估
                                            cj.showContent({                                          //详细信息(tab标签)
                                                title:record.name+'信息评估',
                                                htmfile:'text!views/pension/PensionAssessmentInfo.htm',
                                                jsfile:'views/pension/PensionAssessmentInfo',
                                                queryParams:{
                                                    actiontype:'assessment',         //（处理）操作方式
                                                    data:record
                                                }
                                            })
                                            //deleteRoleInfo(record);
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