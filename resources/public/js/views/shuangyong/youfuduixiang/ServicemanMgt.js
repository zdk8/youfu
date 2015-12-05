define(function(){
    function render(local,option){
        cj.getdivision(local.find('[opt=districtid]'));

        var datagrid = local.find('.easyui-datagrid-noauto');
        var refreshGrid=function() {
            datagrid.datagrid('reload');
        };






        /*加载现役军人*/
        datagrid.datagrid({
            url:"hyshy/getsoilderlist",
            type:'post',
            queryParams:{
                stype:'1'
            },
            onLoadSuccess:function(data){
                var view = local.find('[action=view]');           //详细信息
                var reportbtns = local.find('[action=report]').hide();           //上报
                var updatebtns = local.find('[action=update]').hide();           //修改
                var delbtns = local.find('[action=del]').hide();           //删除
                var auditbtns = local.find('[action=audit]').hide();           //审核
                var approvebtns = local.find('[action=approve]').hide();           //审批
                var logoutbtns = local.find('[action=logout]').hide();           //注销
                var retirebtns = local.find('[action=retire]').hide();          //退休
                //var imgviewbtns = local.find('[action=imgview]');           //预览
                var rows=data.rows;
                var btns_arr=[reportbtns,updatebtns,delbtns,auditbtns,approvebtns,logoutbtns,view,retirebtns];
                for(var i=0;i<rows.length;i++){
                    if(rows[i].ishandle == '0' || rows[i].ishandle == '-1'){    //保存
                        $(btns_arr[0][i]).show();
                        $(btns_arr[1][i]).show();
                        $(btns_arr[2][i]).show();
                    }else if(rows[i].ishandle == '1'){
                        $(btns_arr[3][i]).show();
                    }else if(rows[i].ishandle == '2'){
                        $(btns_arr[4][i]).show();
                    }else if(rows[i].ishandle == '3'){
                        $(btns_arr[5][i]).show();
                        $(btns_arr[7][i]).show();
                    }
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "report"){                                       //详细信息
                                    updateFunc(record,refreshGrid,'report');
                                }else if(action == "del"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'hyshy/deletesoilder',
                                            type:'post',
                                            data:{
                                                sc_id:record.sc_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('删除成功', {icon: 6});
                                                    refreshGrid();
                                                }else{
                                                    layer.alert('删除失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "update"){                   //修改
                                    updateFunc(record,refreshGrid,'update');
                                }else if(action == "audit"){                   //审核
                                    auditFunc(record,refreshGrid);
                                }else if(action == "approve"){                   //审批
                                    approveFunc(record,refreshGrid);
                                } else if(action == "retire"){
                                    layer.confirm('确定要退伍吗?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'hyshy/retiresoilder',
                                            type:'post',
                                            data:{
                                                sc_id:record.sc_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('退伍成功', {icon: 6});
                                                    refreshGrid();
                                                }else{
                                                    layer.alert('退伍成功', {icon: 5});
                                                }
                                            }
                                        });
                                    })
                                }else if(action == "logout"){                   //注销
                                    layer.confirm('确定要注销此数据么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'hyshy/logoutsoilder',
                                            type:'post',
                                            data:{
                                                sc_id:record.sc_id
                                            },
                                            success: function (data) {
                                                layer.closeAll('loading');
                                                if(data == "true"){
                                                    layer.alert('注销成功', {icon: 6});
                                                    refreshGrid();
                                                }else{
                                                    layer.alert('注销失败', {icon: 5});
                                                }
                                            }
                                        });
                                    });
                                }else if(action == "imgview"){                   //预览
                                    var FileExt=record.photo.replace(/.+\./,"").toLowerCase();
                                    if(FileExt=='png' || FileExt=='jpg' || FileExt=='gif') {
                                        layer.photos({
                                            photos: {
                                                "title": "图片预览",
                                                "start": 0,
                                                "status": 1,
                                                "data": [{
                                                    area: ['560px', '290px'],
                                                    "alt": record.name,
                                                    "pid": 109,
                                                    "src": record.photo,
                                                    "thumb": ""
                                                }]
                                            },
                                            tab: function (pic, layero) {
                                                layero.find('span.layui-layer-imguide').remove();
                                            }
                                        });
                                    }else{
                                        layer.alert('不是图片类型', {icon: 6});
                                    }
                                }else if(action == "view"){                   //预览

                                }
                            });
                        })(i)
                    }
                }
            },
            rowStyler: function(index,row){
                if (row.ishandle == '0'){
                    return 'color:red;';
                }
            }
        })

        var name = local.find('[opt=name]');                        //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        /*搜索*/
        local.find('.querybtn').click(function(){
            datagrid.datagrid('load',{
                name:name.val(),
                identityid:identityid.val(),
                districtid:local.find('[opt=districtid]').combobox('getValue'),
                eachtype:local.find('[opt=eachtype]').combobox('getValue'),
                ishandle:local.find('[opt=handle_type]').combobox('getValue'),
                caretype:local.find('[opt=caretype]').combobox('getValue'),
                isdead:local.find('[opt=die_type]').combobox('getValue'),
                photo:local.find('[opt=hasphoto]').combobox('getValue'),
                joindate:local.find('[opt=joindate]').val(),
                retiredate:local.find('[opt=retiredate]').val(),
                birthday1:local.find('[opt=birthday1]').datebox('getValue'),
                birthday2:local.find('[opt=birthday2]').datebox('getValue'),
                household:local.find('[opt=household]').val(),
              stype:'1'
            })
        })

            /*导入xls*/
      local.find('[opt=importexcel]').click(function(){
        local.find('[opt=importfile]').form('submit',{
            url:"hyshy/soilderimportexcel",

            onSubmit:function(params){
                params.sctype = '100';
            },
            success: function (data) {
            }

          })

      });

              /*导出*/
      local.find('.exportbtn').click(function(){
        window.location.href="hyshy/soilderexportexcel?"+$.param({
                name:name.val(),
                identityid:identityid.val(),
                districtid:local.find('[opt=districtid]').combobox('getValue'),
                eachtype:local.find('[opt=eachtype]').combobox('getValue'),
                ishandle:local.find('[opt=handle_type]').combobox('getValue'),
                caretype:local.find('[opt=caretype]').combobox('getValue'),
                isdead:local.find('[opt=die_type]').combobox('getValue'),
                photo:local.find('[opt=hasphoto]').combobox('getValue'),
                joindate:local.find('[opt=joindate]').val(),
                retiredate:local.find('[opt=retiredate]').val(),
                birthday1:local.find('[opt=birthday1]').datebox('getValue'),
                birthday2:local.find('[opt=birthday2]').datebox('getValue'),
                household:local.find('[opt=household]').val(),
              stype:'1',
              soildertype:'xianyi'

        })})

        /*添加现役军人*/
        local.find('.addbtn').click(function(){
            layer.load(2);
            require(['text!views/shuangyong/youfuduixiang/ServicemanForm.htm','views/shuangyong/youfuduixiang/ServicemanForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'添加现役军人',
                        type: 1,
                        area: ['910px', '500px'], //宽高
                        content: htmfile,
                        success: function(layero, index){
                            jsfile.render(layero,{
                                index:index,
                                queryParams:{
                                    actiontype:'add',
                                    refresh:refreshGrid
                                }
                            });
                        }
                    });
                }
            )
        });


    }

    /*现役军人修改*/
    var updateFunc = function (record,refreshGrid,type) {
        layer.load(2);
        var title ='【'+record.name+ '】现役军人信息修改';
        require(['text!views/shuangyong/youfuduixiang/ServicemanForm.htm','views/shuangyong/youfuduixiang/ServicemanForm'],
            function(htmfile,jsfile){
                layer.open({
                    title:title,
                    type: 1,
                    area: ['910px', '500px'], //宽高
                    content: htmfile,
                    success: function(layero, index){
                        jsfile.render(layero,{
                            index:index,
                            queryParams:{
                                actiontype:'update',
                                type:type,
                                refresh:refreshGrid,
                                record:record
                            }
                        });
                    }
                });
            }
        )
    }
    /*现役军人审核*/
    var auditFunc = function (record,refreshGrid) {
        layer.load(2);
        var title ='【'+record.name+ '】现役军人信息';
        require(['text!views/shuangyong/youfuduixiang/ServicemanForm.htm','views/shuangyong/youfuduixiang/ServicemanForm'],
            function(htmfile,jsfile){
                layer.open({
                    title:title,
                    type: 1,
                    area: ['910px', '500px'], //宽高
                    content: htmfile,
                    success: function(layero, index){
                        jsfile.render(layero,{
                            index:index,
                            queryParams:{
                                actiontype:'audit',
                                refresh:refreshGrid,
                                record:record
                            }
                        });
                    }
                });
            }
        )
    }
    /*现役军人审批*/
    var approveFunc = function (record,refreshGrid) {
        layer.load(2);
        var title ='【'+record.name+ '】现役军人信息';
        require(['text!views/shuangyong/youfuduixiang/ServicemanForm.htm','views/shuangyong/youfuduixiang/ServicemanForm'],
            function(htmfile,jsfile){
                layer.open({
                    title:title,
                    type: 1,
                    area: ['910px', '500px'], //宽高
                    content: htmfile,
                    success: function(layero, index){
                        jsfile.render(layero,{
                            index:index,
                            queryParams:{
                                actiontype:'approve',
                                refresh:refreshGrid,
                                record:record
                            }
                        });
                    }
                });
            }
        )
    }


    return {
        render:render
    }

})
