define(function(){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/getalljjyldepart',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=local.find('[action=view]');
                        var updatebtns=local.find('[action=update]');
                        var deletebtns=local.find('[action=delete]');
                        var addfwrybtn=local.find('[action=addfwry]');      //添加服务人员
                        var btns_arr=[viewbtns,updatebtns,deletebtns,addfwrybtn];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){
                                        var action = $(this).attr("action");
                                        if(action == 'view'){
                                            var title = "【"+record.name+'】服务申请详细信息'
                                            cj.showContent({                                          //详细信息(tab标签)
                                                title:title,
                                                htmfile:'text!views/pension/serviceassinfo/PensionServiceApply.htm',
                                                jsfile:'views/pension/serviceassinfo/PensionServiceApply',
                                                queryParams:{
                                                    actiontype:'information',         //（详细信息）操作方式
                                                    data:record,
                                                    title:title,
                                                    refresh:refreshGrid
                                                }
                                            })
                                            //viewRoleInfo(record);
                                        }else if(action=='update'){         //修改
                                            var title = "【"+record.departname+'】信息修改'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
//                                                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/serviceassinfo/ServiceAgenciesForm.htm',
                                                    jsfile:'views/pension/serviceassinfo/ServiceAgenciesForm',
                                                    queryParams:{
                                                        actiontype:'update',         //（处理）操作方式
                                                        data:record,
                                                        title:title,
                                                        refresh:refreshGrid
                                                    }
                                                })
                                            }
                                        }else if(action=='delete'){               //删除
                                            /*var title = "【"+record.name+'】信息变更'
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
                                            }*/
                                        }else if(action=='addfwry'){
                                            var title = '<label style="font-weight: bold;color: rgba(39,42,40,0.83)">添加服务人员-'+record.departname+'</label>';
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
//                                                showProcess(true, '温馨提示', '正在提交数据...');   //进度框加载
                                                cj.showContent({                                          //详细信息(tab标签)
                                                    title:title,
                                                    htmfile:'text!views/pension/serviceassinfo/ServiceAgenciesPeople.htm',
                                                    jsfile:'views/pension/serviceassinfo/ServiceAgenciesPeople',
                                                    queryParams:{
                                                        actiontype:'addfwry',         //（处理）操作方式
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

            local.find('[opt=query]').click(function(){
                localDataGrid.datagrid('load',{
                    departname:local.find('[opt=departname]').val()
                })
            })

            /*添加服务机构*/
            local.find('[opt=addsamgt]').click(function(){
                var title = "添加服务机构"
                cj.showContent({                                          //添加服务机构
                    title:title,
                    htmfile:'text!views/pension/serviceassinfo/ServiceAgenciesForm.htm',
                    jsfile:'views/pension/serviceassinfo/ServiceAgenciesForm',
                    queryParams:{
                        actiontype:'add',         //（处理）操作方式
                        data:"",
                        title:title,
                        refresh:refreshGrid
                    }
                })
            })
        }
    }
})