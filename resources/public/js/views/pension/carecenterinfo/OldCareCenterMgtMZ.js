define(function(){
    /*照料人员*/
    var carePeople = function (local,datagrid) {
        datagrid.datagrid({
            url:'depart/getcarepeoplelist',
            method:'post',
            onLoadSuccess:function(data) {
                var viewbtns = local.find('[action=view_cp]');
                var updatebtns = local.find('[action=update_cp]');
                var logoutbtns = local.find('[action=logout_cp]');
                var btns_arr = [viewbtns, updatebtns, logoutbtns];
                var rows = data.rows;
                for (var i = 0; i < rows.length; i++) {
                    for (var j = 0; j < btns_arr.length; j++) {
                        (function (index) {
                            var record = rows[index];
                            $(btns_arr[j][i]).click(function () {
                                if ($(this).attr("action") == 'view_cp') {
                                    cj.showContent({                                          //详细信息(tab标签)
                                        title: '【' + record.name + '】照料人员详细信息',
                                        htmfile: 'text!views/pension/carecenterinfo/carepeople.htm',
                                        jsfile: 'views/pension/carecenterinfo/carepeople',
                                        queryParams: {
                                            actiontype: 'view',         //（处理）操作方式
                                            data: record                  //填充数据
                                        }
                                    })
                                } else if ($(this).attr("action") == 'update_cp') {
                                    cj.showContent({                                          //详细信息(tab标签)
                                        title: '【' + record.name + '】照料人员修改',
                                        htmfile: 'text!views/pension/carecenterinfo/carepeople.htm',
                                        jsfile: 'views/pension/carecenterinfo/carepeople',
                                        queryParams: {
                                            actiontype: 'update',         //（处理）操作方式
                                            data: record,                   //填充数据
                                            refresh: refreshGrid                //刷新
                                        }
                                    })
                                } else if ($(this).attr("action") == 'logout_cp') {
                                    layer.confirm('确定要注销么？', {icon: 3, title: '温馨提示'}, function (index) {
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url: 'depart/leavecarepeople',
                                            type: 'post',
                                            data: {
                                                cp_id: record.cp_id
                                            },
                                            success: function (data) {
                                                if (data == "success") {
                                                    layer.closeAll('loading');
                                                    layer.alert('注销成功!', {icon: 6, title: '温馨提示'});
                                                    refreshGrid();
                                                } else {
                                                    layer.closeAll('loading');
                                                    layer.alert('注销失败!', {icon: 5, title: '温馨提示'});
                                                }
                                            }
                                        })
                                    });
                                }
                            });
                        })(i);
                    }
                }
            }
        })
    }
    /*工作人员*/
    var worker = function (local, datagrid) {
        datagrid.datagrid({
            url: 'depart/getcareworkerlist',
            method: 'post',
            onLoadSuccess: function (data) {
                var viewbtns = local.find('[action=view_w]');
                var updatebtns = local.find('[action=update_w]');
                var deletebtns = local.find('[action=delete_w]');
                var mapbtn = local.find('[action=map]');                //地图
                var btns_arr = [viewbtns, updatebtns, deletebtns, mapbtn];
                var rows = data.rows;
                for (var i = 0; i < rows.length; i++) {
                    for (var j = 0; j < btns_arr.length; j++) {
                        (function (index) {
                            var record = rows[index];
                            $(btns_arr[j][i]).click(function () {
                                if ($(this).attr("action") == 'view_w') {
                                    cj.showContent({                                          //详细信息(tab标签)
                                        title: '【' + record.zl_name + '】工作人员详细信息',
                                        htmfile: 'text!views/pension/carecenterinfo/careworker.htm',
                                        jsfile: 'views/pension/carecenterinfo/careworker',
                                        queryParams: {
                                            actiontype: 'view',         //（处理）操作方式
                                            data: record                  //填充数据
                                        }
                                    })
                                } else if ($(this).attr("action") == 'update_w') {
                                    cj.showContent({                                          //详细信息(tab标签)
                                        title: '【' + record.zl_name + '】工作人员信息修改',
                                        htmfile: 'text!views/pension/carecenterinfo/careworker.htm',
                                        jsfile: 'views/pension/carecenterinfo/careworker',
                                        queryParams: {
                                            actiontype: 'update',         //（处理）操作方式
                                            data: record,                   //填充数据
                                            refresh: refreshGrid                //刷新
                                        }
                                    })
                                }
                            });
                        })(i);
                    }
                }
            }
        })
    };
    /*大型活动*/
    var bigEvent = function (local,datagrid) {
        datagrid.datagrid({
            url: 'depart/getbigeventlist',
            method: 'post',
            onLoadSuccess: function (data) {
                var viewbtns = local.find('[action=view_be]');
                var updatebtns = local.find('[action=update_be]');
                var deletebtns = local.find('[action=delete_be]');
                var mapbtn = local.find('[action=map]');                //地图
                var btns_arr = [viewbtns, updatebtns, deletebtns, mapbtn];
                var rows = data.rows;
                for (var i = 0; i < rows.length; i++) {
                    for (var j = 0; j < btns_arr.length; j++) {
                        (function (index) {
                            var record = rows[index];
                            $(btns_arr[j][i]).click(function () {
                                if ($(this).attr("action") == 'view_be') {
                                    console.log(22)
                                    cj.showContent({                                          //详细信息(tab标签)
                                        title: '【' + record.zl_name + '】活动详细信息',
                                        htmfile: 'text!views/pension/carecenterinfo/Bigevent.htm',
                                        jsfile: 'views/pension/carecenterinfo/Bigevent',
                                        queryParams: {
                                            actiontype: 'view',         //（处理）操作方式
                                            data: record                  //填充数据
                                        }
                                    })
                                } else if ($(this).attr("action") == 'update_be') {
                                    console.log(3232)
                                    cj.showContent({                                          //详细信息(tab标签)
                                        title: '【' + record.zl_name + '】活动信息修改',
                                        htmfile: 'text!views/pension/carecenterinfo/Bigevent.htm',
                                        jsfile: 'views/pension/carecenterinfo/Bigevent',
                                        queryParams: {
                                            actiontype: 'update',         //（处理）操作方式
                                            data: record                   //填充数据
                                            //refresh: refreshGrid                //刷新
                                        }
                                    })
                                }
                            });
                        })(i);
                    }
                }
            }
        })
    }
    return {
        render:function(local,option){
            var carepeopledatagrid = local.find('[opt=carepeopledatagrid]');
            var workerdatagrid = local.find('[opt=workerdatagrid]');
            var bigeventdatagrid = local.find('[opt=bigeventdatagrid]');
            carePeople(local,carepeopledatagrid);
            worker(local,workerdatagrid);
            bigEvent(local,bigeventdatagrid);

            var localDataGrid;
            var refreshGrid=function() {
                localDataGrid.datagrid('reload');
            };
            var datarid = local.find('[opt=carecenterdatagrid]');      //查询界面datagrid
            localDataGrid = datarid.datagrid({
                url:'depart/getcarecenterlist',
                method:'post',
                onLoadSuccess:function(data){
                    var viewbtns=local.find('[action=view_cc]');
                    var updatebtns=local.find('[action=update_cc]');
                    var addcarepbtns=local.find('[action=addcarep_cc]');
                    var addworkpbtns=local.find('[action=addworkp_cc]');
                    var deletebtns=local.find('[action=delete_cc]');
                    var mapbtn = local.find('[action=map_cc]');                //地图
                    var btns_arr=[viewbtns,updatebtns,addcarepbtns,addworkpbtns,deletebtns,mapbtn];
                    var rows=data.rows;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<btns_arr.length;j++){
                            (function(index){
                                var record=rows[index];
                                $(btns_arr[j][i]).click(function(){
                                    if($(this).attr("action")=='view_cc'){
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
                                    }else if($(this).attr("action")=='update_cc'){
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
                                    }else if($(this).attr("action")=='addcarep_cc'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】添加照料人员',
                                            htmfile:'text!views/pension/carecenterinfo/carepeople.htm',
                                            jsfile:'views/pension/carecenterinfo/carepeople',
                                            queryParams:{
                                                actiontype:'add',         //（处理）操作方式
                                                data:record                   //填充数据
                                            }
                                        })
                                    }else if($(this).attr("action")=='addworkp_cc'){
                                        cj.showContent({                                          //详细信息(tab标签)
                                            title:'【'+record.name+'】添加工作人员',
                                            htmfile:'text!views/pension/carecenterinfo/careworker.htm',
                                            jsfile:'views/pension/carecenterinfo/careworker',
                                            queryParams:{
                                                actiontype:'add',         //（处理）操作方式
                                                data:record                   //填充数据
                                            }
                                        })
                                    }else if($(this).attr("action")=='map_cc'){
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
                onClickRow: function (index,row) {
                    local.find('[opt=zl_id]').val(row.zl_id);
                    carepeopledatagrid.datagrid('load',{
                        zl_id:row.zl_id
                    })
                    workerdatagrid.datagrid('load',{
                        zl_id:row.zl_id
                    })
                    bigeventdatagrid.datagrid('load',{
                        zl_id:row.zl_id
                    })
                },
                rowStyler:function(rowIndex,rowData){
                    //console.log("diffDate: "+rowData.diffDate);
                    //return 'color:black;font-family:宋体;font-size:20';
                },
                striped:true
            })

            /*搜索*/
            local.find('[opt=query_carecenter]').click(function(){
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


            local.find('[opt=query_carepeople]').click(function(){
                console.log(local.find('[opt=zl_id]').val())
                carepeopledatagrid.datagrid('load',{
                    zl_id:local.find('[opt=zl_id]').val(),
                    name:local.find('[opt=name_cp]').val(),
                    identityid:local.find('[opt=identityid_cp]').val()
                })
            })

        }
    }
})