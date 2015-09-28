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
        /*加载领用/归还证件*/
        datagrid.datagrid({
            url:"party/getcerreceivelist",
            type:'post',
            onLoadSuccess:function(data){
                var view = local.find('[action=view]');           //详细信息
                var backbtns = local.find('[action=back]');           //归还
                var rows=data.rows;
                var btns_arr=[view,backbtns];
                for(var i=0;i<rows.length;i++){
                    for(var j=0;j<btns_arr.length;j++){
                        (function(index){
                            var record=rows[index];
                            $(btns_arr[j][i]).click(function(){
                                var action = $(this).attr("action");
                                if(action == "view"){                                       //详细信息
                                    updateFunc(record,refreshGrid);
                                }else if(action == "back"){
                                    layer.load(2);
                                    require(['text!views/party/zhengjianguanli/PapersBackForm.htm','views/party/zhengjianguanli/PapersBackForm'],
                                        function(htmfile,jsfile){
                                            layer.open({
                                                title:'证件归还',
                                                type: 1,
                                                shift: 2,
                                                area: ['600px', '200px'], //宽高
                                                content: htmfile,
                                                success: function(layero, index){
                                                    jsfile.render(layero,{
                                                        index:index,
                                                        queryParams:{
                                                            actiontype:'back',
                                                            record:record,
                                                            refresh:refreshGrid
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    )
                                }else if(action == "update"){                   //修改
                                    updateFunc(record,refreshGrid);
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

        var name = local.find('[opt=name]');                        //姓名
        var identityid = local.find('[opt=identityid]');        //身份证
        /*搜索*/
        local.find('[opt=query]').click(function(){
            datagrid.datagrid('load',{
                name:name.val(),
                identityid:identityid.val()
            })
        })

        /*领用证件*/
        local.find('[opt=addbtn]').click(function(){
            layer.load(2);
            require(['text!views/party/zhengjianguanli/PapersReceptionForm.htm','views/party/zhengjianguanli/PapersReceptionForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'证件领用',
                        type: 1,
                        area: ['600px', '200px'], //宽高
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

    /*人事档案修改*/
    var updateFunc = function (record,refreshGrid) {
        layer.load(2);
        $.ajax({
            url:'record/getrecordbyid',
            type:'post',
            data:{
                pr_id:record.pr_id
            },
            success: function (data) {
                var title ='【'+record.name+ '】人事档案信息修改';
                require(['text!views/party/renshidangan/PersonnelFileForm.htm','views/party/renshidangan/PersonnelFileForm'],
                    function(htmfile,jsfile){
                        layer.open({
                            title:title,
                            type: 1,
                            area: ['890px', '550px'], //宽高
                            content: htmfile,
                            success: function(layero, index){
                                jsfile.render(layero,{
                                    index:index,
                                    queryParams:{
                                        actiontype:'update',
                                        refresh:refreshGrid,
                                        record:record,
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

    return {
        render:render
    }

})