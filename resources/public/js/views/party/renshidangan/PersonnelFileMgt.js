/*审核处理*/
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
        /*加载人事档案人员*/
        datagrid.datagrid({
            url:"record/getrecordlist",
            type:'post',
            onLoadSuccess:function(data){
                var view = local.find('[action=view]');           //详细信息
                var updatebtns = local.find('[action=update]');           //修改
                var delbtns = local.find('[action=del]');           //删除
                var rows=data.rows;
                var btns_arr=[view,delbtns,updatebtns];
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
                                    updateFunc(record,refreshGrid);
                                }
                            });
                        })(i)
                    }
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

        /*添加人事档案*/
        local.find('[opt=addbtn]').click(function(){
            layer.load(2);
            require(['text!views/party/renshidangan/PersonnelFileForm.htm','views/party/renshidangan/PersonnelFileForm'],
                function(htmfile,jsfile){
                    layer.open({
                        title:'人事档案添加',
                        type: 1,
                        area: ['890px', '550px'], //宽高
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