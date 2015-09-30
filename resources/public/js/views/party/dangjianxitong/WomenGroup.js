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
        /*妇女小组加载*/
        datagrid.datagrid({
            url:"party/getwomengrouplist",
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
                                            url:'party/delwomengroup',
                                            type:'post',
                                            data:{
                                                wg_id:record.wg_id
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
                                    var title =record.wg_name+ ' - 妇女小组人员添加';
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
                                                            add_p_url:'party/addpeopletowomengroup',   //添加人员
                                                            reduce_p_url:'party/removepeopletowomengroup',   //移除人员
                                                            idtype:'wg',              //id类型(党支部、共青团...区分)
                                                            id:record.wg_id               //id值
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
                var title = row.wg_name+'-所含人员列表';
                require(['text!views/party/dangjianxitong/PersonDatagrid.htm','views/party/dangjianxitong/PersonDatagrid'],
                    function(htmfile,jsfile){
                        layer.open({
                            title:title,
                            type: 1,
                            area: ['600px', '350px'], //宽高
                            content: htmfile,
                            shift: 2,
                            success: function(layero, index){
                                jsfile.render(layero,{
                                    index:index,
                                    queryParams:{
                                    },params:{
                                        idtype:'wg',              //id类型(党支部、共青团...区分)
                                        id:row.wg_id               //id值
                                    }
                                });
                            }
                        });
                    }
                )
            }
        })

        var wg_name = local.find('[opt=wg_name]');                        //名称
        var wg_createtime = local.find('[opt=wg_createtime]');        //建立时间
        /*搜索*/
        local.find('[opt=query]').click(function(){
            datagrid.datagrid('load',{
                wg_name:wg_name.val(),
                wg_createtime:wg_createtime.datebox('getValue')
            })
        })

        /*添加妇女小组*/
        local.find('[opt=addbtn]').click(function(){
            layer.load(2);
            require(['text!views/party/dangjianxitong/WomenGroupForm.htm','views/party/dangjianxitong/WomenGroupForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'添加证件',
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

    /*修改妇女小组*/
    var updateFunc = function (record,refreshGrid) {
        layer.load(2);
        var title =record.wg_name+ ' - 证件信息修改';
        require(['text!views/party/dangjianxitong/WomenGroupForm.htm','views/party/dangjianxitong/WomenGroupForm'],
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