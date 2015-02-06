define(['views/pension/PensionServiceAss'],function(psafile){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };

            localDataGrid=
                local.find('.easyui-datagrid-noauto').datagrid({
                    url:'audit/hospitalsubsidyaudit',
                    method:'post',
                    queryParams: {

                    },
                    onLoadSuccess:function(data){
                        var viewbtns=local.find('[action=view]');
                        var zybzdealwithbtns=local.find('[action=zybzdealwith]');   //住院补助
                        var btns_arr=[viewbtns,zybzdealwithbtns];
                        var rows=data.rows;
                        for(var i=0;i<rows.length;i++){
                            for(var j=0;j<btns_arr.length;j++){
                                (function(index){
                                    var record=rows[index];
                                    $(btns_arr[j][i]).click(function(){
                                        if($(this).attr("action")=='view'){
                                            var title = "【"+record.messagebrief.
                                                substring(record.messagebrief.indexOf("：")+1,record.messagebrief.indexOf(","))+'】住院补助细信息'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
                                                $.ajax({
                                                    url:"audit/gethsdatabyid",
                                                    data:{
                                                        hs_id:record.bstablepk
                                                    },
                                                    type:"post",
                                                    dataType:"json",
                                                    success:function(data){
                                                        if(data){
                                                            cj.showContent({                                          //详细信息(tab标签)
                                                                title:title,
                                                                htmfile:'text!views/pension/HospitalSubsidy.htm',
                                                                jsfile:'views/pension/HospitalSubsidy',
                                                                queryParams:{
                                                                    actiontype:'info',         //（处理）操作方式
                                                                    record:record,
                                                                    data:data[0],
                                                                    title:title,
                                                                    refresh:refreshGrid
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        }else if($(this).attr("action")=='zybzdealwith'){               //住院补助处理
                                            var title = "【"+record.messagebrief.
                                                substring(record.messagebrief.indexOf("：")+1,record.messagebrief.indexOf(","))+'】住院补助处理'
                                            if($("#tabs").tabs('getTab',title)){
                                                $("#tabs").tabs('select',title)
                                            }else{
                                                $.ajax({
                                                    url:"audit/gethsdatabyid",
                                                    data:{
                                                        hs_id:record.bstablepk
                                                    },
                                                    type:"post",
                                                    dataType:"json",
                                                    success:function(data){
                                                        if(data){
                                                            cj.showContent({                                          //详细信息(tab标签)
                                                                title:title,
                                                                htmfile:'text!views/pension/HospitalSubsidy.htm',
                                                                jsfile:'views/pension/HospitalSubsidy',
                                                                queryParams:{
                                                                    actiontype:'zybzdealwith',         //（处理）操作方式
                                                                    record:record,
                                                                    data:data[0],
                                                                    title:title,
                                                                    refresh:refreshGrid
                                                                }
                                                            })
                                                        }
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

            local.find('.searchbtn').click(function(){
                localDataGrid.datagrid('load',{
                    name:local.find('[opt=name]').searchbox('getValue'),
                    identityid:local.find('[opt=identityid]').searchbox('getValue')
                })
            })
        }
    }
})