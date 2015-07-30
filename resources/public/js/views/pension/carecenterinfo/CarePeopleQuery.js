define(function(){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            var datarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            localDataGrid = datarid.datagrid({
                url:'depart/getcarepeoplelist',
                method:'post',
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var updatebtns=local.find('[action=update]');
                    var logoutbtns=local.find('[action=logout]');
                    var btns_arr=[viewbtns,updatebtns,logoutbtns];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】照料人员详细信息',
                                            htmfile:'text!views/pension/carecenterinfo/carepeople.htm',
                                            jsfile:'views/pension/carecenterinfo/carepeople',
                                            queryParams:{
                                                actiontype:'view',         //（处理）操作方式
                                                data:record                  //填充数据
                                            }
                                        })
                                    }else if($(this).attr("action")=='update'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】照料人员修改',
                                            htmfile:'text!views/pension/carecenterinfo/carepeople.htm',
                                            jsfile:'views/pension/carecenterinfo/carepeople',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:refreshGrid                //刷新
                                            }
                                        })
                                    }else if($(this).attr("action")=='logout'){
                                        layer.confirm('确定要注销么？', {icon: 3,title:'温馨提示'}, function(index){
                                            layer.close(index);
                                            layer.load();
                                            $.ajax({
                                                url:'depart/leavecarepeople',
                                                type:'post',
                                                data:{
                                                    cp_id:record.cp_id
                                                },
                                                success: function (data) {
                                                    if(data == "success"){
                                                        layer.closeAll('loading');
                                                        layer.alert('注销成功!', {icon: 6,title:'温馨提示'});
                                                        refreshGrid();
                                                    }else{
                                                        layer.closeAll('loading');
                                                        layer.alert('注销失败!', {icon: 5,title:'温馨提示'});
                                                    }
                                                }
                                            })
                                        });
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