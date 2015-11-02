define(function(){
    function render(local,option){
        cj.getdivision(local.find('[opt=division]'));

        var datagrid = local.find('.easyui-datagrid-noauto');
        var refreshGrid=function() {
            datagrid.datagrid('reload');
        };
        /*加载现役军人*/
        datagrid.datagrid({
            url:"hyshy/getsoilderlist",
            type:'post',
            onLoadSuccess:function(data){
                //var view = local.find('[action=view]');           //详细信息
                var reportbtns = local.find('[action=report]').hide();           //上报
                var updatebtns = local.find('[action=update]').hide();           //修改
                var delbtns = local.find('[action=del]').hide();           //删除
                var auditbtns = local.find('[action=audit]').hide();           //审核
                var approvebtns = local.find('[action=approve]').hide();           //审批
                //var imgviewbtns = local.find('[action=imgview]');           //预览
                var rows=data.rows;
                var btns_arr=[reportbtns,updatebtns,delbtns,auditbtns,approvebtns];
                for(var i=0;i<rows.length;i++){
                    if(rows[i].ishandle == '0'){    //保存
                        $(btns_arr[0][i]).show();
                        $(btns_arr[1][i]).show();
                        $(btns_arr[2][i]).show();
                    }else if(rows[i].ishandle == '1'){
                        $(btns_arr[3][i]).show();
                    }else if(rows[i].ishandle == '2'){
                        $(btns_arr[4][i]).show();
                    }
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "report"){                                       //详细信息
                                    updateFunc(record,refreshGrid,'report');
                                }else if(action == "del"){                   //处理
                                    console.log(record.name)
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'record/delpensonrecords',
                                            type:'post',
                                            data:{
                                                pr_id:record.pr_id
                                            },
                                            success: function (data) {
                                                if(data == "true"){
                                                    layer.closeAll('loading');
                                                    layer.alert('删除成功', {icon: 6});
                                                    refreshGrid();
                                                }else{
                                                    layer.closeAll('loading');
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
        local.find('[opt=query]').click(function(){
            datagrid.datagrid('load',{
                name:name.val(),
                identityid:identityid.val()
            })
        })

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