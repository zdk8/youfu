define(function(){
    return {
        render:function(local,option){
            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            var datarid = local.find('.easyui-datagrid-noauto');      //查询界面datagrid
            localDataGrid = datarid.datagrid({
                url:'depart/getcarecenterlist',
                method:'post',
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view]');
                    var updatebtns=local.find('[action=update]');
                    var addcarepbtns=local.find('[action=addcarep]');
                    var addworkpbtns=local.find('[action=addworkp]');
                    var addeventbtns=local.find('[action=addevent_cc]');
                    var deletebtns=local.find('[action=delete]');
                    var mapbtn = local.find('[action=map]');                //地图
                    var btns_arr=[viewbtns,updatebtns,addcarepbtns,addworkpbtns,addeventbtns,deletebtns,mapbtn];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    layer.load();
                                    if($(this).attr("action")=='view'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】详细信息',
                                            htmfile:'text!views/pension/carecenterinfo/OldCareCenter.htm',
                                            jsfile:'views/pension/carecenterinfo/OldCareCenter',
                                            queryParams:{
                                                actiontype:'view',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:refreshGrid                //刷新
                                            }
                                        })
                                    }else if($(this).attr("action")=='update'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】信息修改',
                                            htmfile:'text!views/pension/carecenterinfo/OldCareCenter.htm',
                                            jsfile:'views/pension/carecenterinfo/OldCareCenter',
                                            queryParams:{
                                                actiontype:'update',         //（处理）操作方式
                                                data:record,                   //填充数据
                                                refresh:refreshGrid                //刷新
                                            }
                                        })
                                    }else if($(this).attr("action")=='addcarep'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】添加照料人员',
                                            htmfile:'text!views/pension/carecenterinfo/carepeople.htm',
                                            jsfile:'views/pension/carecenterinfo/carepeople',
                                            queryParams:{
                                                actiontype:'add',         //（处理）操作方式
                                                data:record                   //填充数据
                                            }
                                        })
                                    }else if($(this).attr("action")=='addworkp'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】添加工作人员',
                                            htmfile:'text!views/pension/carecenterinfo/careworker.htm',
                                            jsfile:'views/pension/carecenterinfo/careworker',
                                            queryParams:{
                                                actiontype:'add',         //（处理）操作方式
                                                data:record                   //填充数据
                                            }
                                        })
                                    }else if($(this).attr("action")=='addevent_cc'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】新增活动',
                                            htmfile:'text!views/pension/carecenterinfo/Bigevent.htm',
                                            jsfile:'views/pension/carecenterinfo/Bigevent',
                                            queryParams:{
                                                actiontype:'add',         //（处理）操作方式
                                                data:record,                  //填充数据
                                                refresh:refreshGrid
                                            }
                                        })
                                    }else if($(this).attr("action")=='map'){
                                        layer.closeAll('loading');
                                        var ywtype = "PT_LNR"
                                        //var mapguid = record.mapguid;
                                        window.open (mapURL+'map#task?ywtype='+ywtype+'&'+
                                            'mapguid='+record.mapguid,
                                            'newwindow', 'height='+window.screen.availHeight+', width='+window.screen.availWidth+', top=0, left=0, toolbar=no, ' +
                                            'menubar=no, scrollbars=no, resizable=no,location=n o, status=no')

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

            /*新增照料中心*/
            local.find('[opt=addcarecenter]').click(function(){
                var title = "新增照料中心"
                if($("#tabs").tabs('getTab',title)){
                    $("#tabs").tabs('select',title)
                }else{
                    cj.showContent({                                          //详细信息(tab标签)
                        title:title,
                        htmfile:'text!views/pension/carecenterinfo/OldCareCenter.htm',
                        jsfile:'views/pension/carecenterinfo/OldCareCenter',
                        queryParams:{
                            actiontype:'add',         //（处理）操作方式
                            title:title,
                            refresh:refreshGrid
                        }
                    })
                }
            })
            /*新增活动*/
            local.find('[opt=addbigevent]').click(function(){
                var title = "新增活动"
                if($("#tabs").tabs('getTab',title)){
                    $("#tabs").tabs('select',title)
                }else{
                    cj.showContent({                                          //详细信息(tab标签)
                        title:title,
                        htmfile:'text!views/pension/carecenterinfo/Bigevent.htm',
                        jsfile:'views/pension/carecenterinfo/Bigevent',
                        queryParams:{
                            actiontype:'add',         //（处理）操作方式
                            title:title,
                            refresh:refreshGrid
                        }
                    })
                }
            })

        }
    }
})