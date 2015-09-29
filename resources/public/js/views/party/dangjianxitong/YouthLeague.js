define(function(){
    function render(local,option){
        local.find('[opt=other]').on('click', function () {
            local.find('[opt=func_btn]').animate({"right":'', width : "show"},500);
        });
        local.find('[opt=other_2]').on('click', function () {
            local.find('[opt=func_btn]').animate({"right":'', width : "hide"},500);
        });

        var datagrid = local.find('.easyui-datagrid-noauto');
        var refreshGrid=function() {
            datagrid.datagrid('reload');
        };
        /*共青团加载*/
        datagrid.datagrid({
            url:"party/getyouthleaguelist",
            type:'post',
            onLoadSuccess:function(data){
                var view = local.find('[action=view]');           //详细信息
                var add_pbtns = local.find('[action=add_p]');           //添加人员
                var updatebtns = local.find('[action=update]');           //修改
                var delbtns = local.find('[action=del]');           //删除
                var rows=data.rows;
                var btns_arr=[view,delbtns,updatebtns,add_pbtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "view"){                                       //详细信息
                                    updateFunc(record,refreshGrid);
                                }else if(action == "del"){                   //处理
                                    layer.confirm('确定删除么?', {icon: 3, title:'温馨提示'}, function(index){
                                        layer.close(index);
                                        layer.load();
                                        $.ajax({
                                            url:'party/delyouthleague',
                                            type:'post',
                                            data:{
                                                cy_id:record.cy_id
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
                                    updateFunc(record,refreshGrid);
                                }else if(action == "add_p"){                   //添加人员
                                    var title =record.cy_name+ ' - 共青团人员添加';
                                    require(['text!views/party/dangjianxitong/AddPersonnel.htm','views/party/dangjianxitong/AddPersonnel'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:title,
                                                type: 1,
                                                area: ['800px', '400px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'add',
                                                            refresh:refreshGrid,
                                                            record:record
                                                        },params:{
                                                            url:'record/getrecordlist',   //获取人员
                                                            idtype:'cy_id',              //id类型(党支部、共青团...区分)
                                                            id:record.cy_id               //id值
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    )
                                }
                            });
                        })(i)
                    }
                }
            },
            onDblClickRow: function (index,row) {
                layer.load(2);
                var title = row.name+'-信息';
                $.ajax({
                    url:'record/getrecordbyid',
                    type:'post',
                    data:{
                        pr_id:row.pr_id
                    },
                    success: function (data) {
                        require(['text!views/party/renshidangan/PersonnelFile_Child.htm','views/party/renshidangan/PersonnelFile_Child'],
                            function(htmfile,jsfile){
                                layer.open({
                                    title:title,
                                    type: 1,
                                    area: ['700px', '440px'], //宽高
                                    content: htmfile,
                                    shift: 2,
                                    success: function(layero, index){
                                        jsfile.render(layero,{
                                            index:index,
                                            queryParams:{
                                                childrecord:data
                                            }
                                        });
                                    }
                                });
                            }
                        )
                    }
                })
            }
        })

        var cy_name = local.find('[opt=cy_name]');                        //姓名
        var cy_createtime = local.find('[opt=cy_createtime]');        //身份证
        /*搜索*/
        local.find('[opt=query]').click(function(){
            datagrid.datagrid('load',{
                cy_name:cy_name.val(),
                cy_createtime:cy_createtime.datebox('getValue')
            })
        })

        /*添加共青团*/
        local.find('[opt=addbtn]').click(function(){
            layer.load(2);
            require(['text!views/party/dangjianxitong/YouthLeagueForm.htm','views/party/dangjianxitong/YouthLeagueForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'添加共青团',
                        type: 1,
                        area: ['500px', '100px'], //宽高
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

    /*共青团修改*/
    var updateFunc = function (record,refreshGrid) {
        layer.load(2);
        var title =record.cy_name+ ' - 共青团修改';
        require(['text!views/party/dangjianxitong/YouthLeagueForm.htm','views/party/dangjianxitong/YouthLeagueForm'],
            function(htmfile,jsfile){
                layer.open({
                    title:title,
                    type: 1,
                    area: ['500px', '100px'], //宽高
                    content: htmfile,
                    success: function(layero, index){
                        jsfile.render(layero,{
                            index:index,
                            queryParams:{
                                actiontype:'update',
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