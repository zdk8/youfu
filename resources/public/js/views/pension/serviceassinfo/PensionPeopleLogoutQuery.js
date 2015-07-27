define(['views/pension/serviceassinfo/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/getallauditrm',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=local.find('[action=view]');
                        var btns_arr=[viewbtns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){
                                        if($(this).attr("action")=='view'){               //变更
                                            var title = "【"+record.name+'】信息变更'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
//                                                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                                cj.showContent({                                          //变更详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/serviceassinfo/PensionServiceApply.htm',
                                                    jsfile:'views/pension/serviceassinfo/PensionServiceApply',
                                                    queryParams:{
                                                        actiontype:'information',         //（处理）操作方式
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
                        }
                    },
                    striped:true,
                    toolbar:local.find('div[tb]')
                })


            local.find('[opt=query]').click(function(){
                localDataGrid.datagrid('load',{
                    name:local.find('[opt=name]').val(),
                    identityid:local.find('[opt=identityid]').val()
                })
            })
        }
    }
})