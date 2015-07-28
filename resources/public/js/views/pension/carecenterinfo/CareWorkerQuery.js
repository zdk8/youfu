define(function(){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            var datarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            localDataGrid = datarid.datagrid({
                url:'depart/getcareworkerlist',
                method:'post',
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var updatebtns=local.find('[action=update]');
                    var deletebtns=local.find('[action=delete]');
                    var mapbtn = local.find('[action=map]');                //地图
                    var btns_arr=[viewbtns,updatebtns,deletebtns,mapbtn];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.zl_name+'】工作人员详细信息',
                                            htmfile:'text!views/pension/carecenterinfo/careworker.htm',
                                            jsfile:'views/pension/carecenterinfo/careworker',
                                            queryParams:{
                                                actiontype:'view',         //（处理）操作方式
                                                data:record                  //填充数据
                                            }
                                        })
                                    }else if($(this).attr("action")=='update'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.zl_name+'】工作人员信息修改',
                                            htmfile:'text!views/pension/carecenterinfo/careworker.htm',
                                            jsfile:'views/pension/carecenterinfo/careworker',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:refreshGrid                //刷新
                                            }
                                        })
                                    }
                                });
                            })(i);
                        }
                    }
                },
                rowStyler:function(rowIndex,rowData){
                    //console.log("diffDate: "+rowData.diffDate);
                    //return 'color:black;font-family:宋体;font-size:20';
                },
                striped:true
            })

            /*搜索*/
            local.find('[opt=query]').click(function(){
                datarid.datagrid('load',{
                    name:local.find('[opt=name]').val(),
                    contact:local.find('[opt=contact]').val(),
                    runtime:local.find('[opt=runtime]').datebox('getValue')
                })
            })

        }
    }
})